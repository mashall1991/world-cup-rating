// 零依赖 Node 服务器：静态托管 + API-Football 代理
// - 浏览器请求 /api/football/... 由本服务器转发到 https://v3.football.api-sports.io/...
//   并在服务端附加 x-apisports-key（解决浏览器 CORS 限制，token 不暴露给前端）
// - 其余路径按静态文件返回
// 本地运行：node server.js → http://localhost:3000
// Render 部署：startCommand = node server.js，环境变量 API_FOOTBALL_KEY

const http = require("http");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const PORT = Number(process.env.PORT) || 3000;
const TOKEN = process.env.API_FOOTBALL_KEY || process.env.APISPORTS_KEY || process.env.API_SPORTS_KEY || "";
const API_FOOTBALL_LEAGUE = process.env.API_FOOTBALL_LEAGUE || "1";
const API_FOOTBALL_SEASON = process.env.API_FOOTBALL_SEASON || "2026";
const API_FOOTBALL_TIMEZONE = process.env.API_FOOTBALL_TIMEZONE || "Asia/Shanghai";
const API_FOOTBALL_BOOKMAKER = process.env.API_FOOTBALL_BOOKMAKER || "";
const API_FOOTBALL_ODDS_BET = process.env.API_FOOTBALL_ODDS_BET || "1";
const ROOT = __dirname;
const UPSTREAM = "https://v3.football.api-sports.io";
const IS_RENDER = Boolean(process.env.RENDER || process.env.RENDER_SERVICE_ID);
const DEFAULT_VILLAIN_HEAT_FILE = IS_RENDER
  ? path.join("/var", "data", "villain_heat.json")
  : path.join(ROOT, ".runtime", "villain_heat.json");
const VILLAIN_HEAT_FILE = process.env.VILLAIN_HEAT_FILE || DEFAULT_VILLAIN_HEAT_FILE;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".md": "text/markdown; charset=utf-8"
};

// 文本类资源走 gzip；体积小、收益大（如 176KB 的 bundle 压缩到 ~64KB）。
const COMPRESSIBLE = new Set([".html", ".js", ".css", ".json", ".svg", ".md"]);

// 简单的代理响应缓存，减少免费层 API 配额消耗（60 秒）。
// 比分接口需要贴近实时，带 ts= 的请求不走缓存。
const proxyCache = new Map();
const PROXY_CACHE_MS = 60 * 1000;
const ODDS_CACHE_MS = 3 * 60 * 1000;
const ODDS_NEAR_KICKOFF_CACHE_MS = 60 * 1000;
const ODDS_NEAR_KICKOFF_WINDOW_MS = 30 * 60 * 1000;
const ODDS_TARGETED_FIXTURE_WINDOW_MS = 36 * 60 * 60 * 1000;
const ODDS_TARGETED_FIXTURE_LIMIT = 8;
const FIXTURE_TEAM_CACHE_MS = 10 * 60 * 1000;

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(payload));
}

function readJsonBody(req, maxBytes = 4096) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > maxBytes) {
        reject(new Error("payload too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!raw.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("invalid json"));
      }
    });
    req.on("error", reject);
  });
}

function readVillainHeatStore() {
  try {
    const parsed = JSON.parse(fs.readFileSync(VILLAIN_HEAT_FILE, "utf8"));
    const counts = parsed?.counts && typeof parsed.counts === "object" ? parsed.counts : {};
    return {
      updatedAt: parsed?.updatedAt ?? null,
      counts: Object.fromEntries(
        Object.entries(counts)
          .map(([key, value]) => [key, Math.max(0, Math.floor(Number(value) || 0))])
          .filter(([key, value]) => key && value > 0)
      )
    };
  } catch {
    return { updatedAt: null, counts: {} };
  }
}

function writeVillainHeatStore(store) {
  const dir = path.dirname(VILLAIN_HEAT_FILE);
  fs.mkdirSync(dir, { recursive: true });
  const entries = Object.entries(store.counts ?? {})
    .filter(([key, value]) => key && Number(value) > 0)
    .slice(-800);
  const payload = {
    updatedAt: new Date().toISOString(),
    counts: Object.fromEntries(entries)
  };
  const temp = `${VILLAIN_HEAT_FILE}.${process.pid}.tmp`;
  fs.writeFileSync(temp, JSON.stringify(payload, null, 2));
  fs.renameSync(temp, VILLAIN_HEAT_FILE);
  return payload;
}

function isValidVillainHeatKey(key) {
  return typeof key === "string" &&
    key.length >= 8 &&
    key.length <= 180 &&
    /^[a-z0-9|._:-]+$/.test(key);
}

async function handleVillainHeat(req, res) {
  if (req.method === "GET") {
    sendJson(res, 200, readVillainHeatStore());
    return;
  }
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "method not allowed" });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const key = String(body?.key ?? "");
    if (!isValidVillainHeatKey(key)) {
      sendJson(res, 400, { error: "invalid villain heat key" });
      return;
    }
    const store = readVillainHeatStore();
    store.counts[key] = Math.max(0, Math.floor(Number(store.counts[key]) || 0)) + 1;
    const saved = writeVillainHeatStore(store);
    sendJson(res, 200, { key, count: saved.counts[key], ...saved });
  } catch (error) {
    const message = String(error?.message ?? error);
    sendJson(res, message.includes("large") ? 413 : 400, { error: message });
  }
}

function buildApiFootballParams(url, defaults = {}) {
  const params = new URLSearchParams(defaults);
  for (const [key, value] of url.searchParams.entries()) {
    if (key !== "ts") params.set(key, value);
  }
  return params;
}

function buildWorldCupFixtureParams() {
  return new URLSearchParams({
    league: API_FOOTBALL_LEAGUE,
    season: API_FOOTBALL_SEASON,
    timezone: API_FOOTBALL_TIMEZONE
  });
}

async function fetchApiFootballJson(pathname, params) {
  const query = params?.toString();
  const target = `${UPSTREAM}${pathname}${query ? `?${query}` : ""}`;
  const upstream = await fetch(target, {
    headers: { "x-apisports-key": TOKEN },
    signal: AbortSignal.timeout(10000)
  });
  const data = await upstream.json().catch(() => ({}));
  return { ok: upstream.ok, status: upstream.status, data };
}

async function getFixtureTeamMap() {
  const cacheKey = `fixtures:${API_FOOTBALL_LEAGUE}:${API_FOOTBALL_SEASON}:${API_FOOTBALL_TIMEZONE}`;
  const cached = proxyCache.get(cacheKey);
  if (cached && Date.now() - cached.at < FIXTURE_TEAM_CACHE_MS) return cached.map;

  const { ok, data } = await fetchApiFootballJson("/fixtures", buildWorldCupFixtureParams());
  if (!ok || !Array.isArray(data.response)) return new Map();

  const map = new Map();
  for (const item of data.response) {
    const fixtureId = item?.fixture?.id;
    if (!fixtureId) continue;
    map.set(Number(fixtureId), {
      fixture_id: Number(fixtureId),
      home_team: item.teams?.home?.name ?? "",
      away_team: item.teams?.away?.name ?? "",
      fixture_date: item.fixture?.date ?? ""
    });
  }
  proxyCache.set(cacheKey, { at: Date.now(), map });
  return map;
}

function enrichOddsWithFixtureTeams(matches, fixtureTeamMap) {
  return matches.map((match) => {
    const fixtureId = Number(match?.fixture?.id);
    const fixtureTeams = fixtureTeamMap.get(fixtureId);
    if (!fixtureTeams) return match;
    return {
      ...match,
      home_team: match.home_team || fixtureTeams.home_team,
      away_team: match.away_team || fixtureTeams.away_team,
      fixture_date: match.fixture_date || fixtureTeams.fixture_date
    };
  });
}

function getOddsCacheMs(matches) {
  return hasNearKickoffOddsMatch(matches) ? ODDS_NEAR_KICKOFF_CACHE_MS : ODDS_CACHE_MS;
}

function hasNearKickoffOddsMatch(matches) {
  const now = Date.now();
  return matches.some((match) => {
    const kickoff = new Date(match?.fixture?.date ?? match?.fixture_date ?? "").getTime();
    if (!Number.isFinite(kickoff)) return false;
    const diff = kickoff - now;
    return diff >= 0 && diff <= ODDS_NEAR_KICKOFF_WINDOW_MS;
  });
}

function getTargetedFixtureIds(fixtureTeamMap, existingOddsMatches) {
  const now = Date.now();
  const existingIds = new Set((existingOddsMatches ?? []).map((match) => Number(match?.fixture?.id)).filter(Number.isFinite));
  return [...fixtureTeamMap.entries()]
    .filter(([fixtureId, item]) => {
      if (existingIds.has(Number(fixtureId))) return false;
      const kickoff = new Date(item.fixture_date ?? "").getTime();
      if (!Number.isFinite(kickoff)) return false;
      const diff = kickoff - now;
      return diff >= 0 && diff <= ODDS_TARGETED_FIXTURE_WINDOW_MS;
    })
    .sort((a, b) => new Date(a[1].fixture_date).getTime() - new Date(b[1].fixture_date).getTime())
    .slice(0, ODDS_TARGETED_FIXTURE_LIMIT)
    .map(([fixtureId]) => Number(fixtureId));
}

async function fetchTargetedFixtureOdds(fixtureIds) {
  const matches = [];
  const attempted = [];
  for (const fixtureId of fixtureIds) {
    const params = new URLSearchParams({ fixture: String(fixtureId), bet: API_FOOTBALL_ODDS_BET });
    if (API_FOOTBALL_BOOKMAKER) params.set("bookmaker", API_FOOTBALL_BOOKMAKER);
    attempted.push(fixtureId);
    const { ok, data } = await fetchApiFootballJson("/odds", params);
    if (!ok) continue;
    if (Array.isArray(data.response)) matches.push(...data.response);
  }
  return { matches, attempted };
}

async function handleApiFootballProxy(req, res, url) {
  if (req.method !== "GET") {
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "method not allowed" }));
    return;
  }

  if (!TOKEN) {
    sendJson(res, 200, { source: "disabled", fetchedAt: new Date().toISOString(), response: [] });
    return;
  }

  let upstreamPath = url.pathname.replace(/^\/api\/football/, "");
  let params = buildApiFootballParams(url);
  if (upstreamPath === "/worldcup/fixtures") {
    upstreamPath = "/fixtures";
    params = buildApiFootballParams(url, Object.fromEntries(buildWorldCupFixtureParams()));
  }

  const bypassCache = url.searchParams.has("ts");
  const query = params.toString();
  const target = `${UPSTREAM}${upstreamPath}${query ? `?${query}` : ""}`;

  const cached = proxyCache.get(target);
  if (!bypassCache && cached && Date.now() - cached.at < PROXY_CACHE_MS) {
    res.writeHead(cached.status, cached.headers);
    res.end(cached.body);
    return;
  }

  try {
    const upstream = await fetch(target, {
      headers: { "x-apisports-key": TOKEN },
      signal: AbortSignal.timeout(10000)
    });
    const body = Buffer.from(await upstream.arrayBuffer());
    const headers = {
      "Content-Type": upstream.headers.get("content-type") || "application/json",
      "Cache-Control": "no-store"
    };
    if (!bypassCache && upstream.ok) {
      proxyCache.set(target, { at: Date.now(), status: upstream.status, headers, body });
    }
    res.writeHead(upstream.status, headers);
    res.end(body);
  } catch (error) {
    res.writeHead(502, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "api-football upstream unavailable", detail: String(error?.message ?? error) }));
  }
}

async function handleOddsProxy(req, res) {
  if (req.method !== "GET") {
    sendJson(res, 405, { error: "method not allowed" });
    return;
  }

  if (!TOKEN) {
    sendJson(res, 200, { source: "disabled", fetchedAt: new Date().toISOString(), matches: [] });
    return;
  }

  const cacheKey = `odds:${API_FOOTBALL_LEAGUE}:${API_FOOTBALL_SEASON}:${API_FOOTBALL_BOOKMAKER}:${API_FOOTBALL_ODDS_BET}`;
  const cached = proxyCache.get(cacheKey);
  if (cached && Date.now() - cached.at < (cached.maxAgeMs ?? ODDS_CACHE_MS)) {
    res.writeHead(cached.status, cached.headers);
    res.end(cached.body);
    return;
  }

  const target = new URL("/odds", UPSTREAM);
  target.searchParams.set("league", API_FOOTBALL_LEAGUE);
  target.searchParams.set("season", API_FOOTBALL_SEASON);
  target.searchParams.set("bet", API_FOOTBALL_ODDS_BET);
  if (API_FOOTBALL_BOOKMAKER) target.searchParams.set("bookmaker", API_FOOTBALL_BOOKMAKER);

  try {
    let status = 200;
    let errors = null;
    let paging = null;
    const matches = [];
    for (let page = 1; page <= 5; page += 1) {
      target.searchParams.set("page", String(page));
      const upstream = await fetch(target, {
        headers: { "x-apisports-key": TOKEN },
        signal: AbortSignal.timeout(10000)
      });
      status = upstream.status;
      const data = await upstream.json().catch(() => ({}));
      errors = data.errors ?? errors;
      paging = data.paging ?? paging;
      if (Array.isArray(data.response)) matches.push(...data.response);
      if (!upstream.ok || !paging || Number(paging.current) >= Number(paging.total ?? 1)) break;
    }
    let enrichedMatches = matches;
    let targeted = { attempted: [], added: 0 };
    try {
      const fixtureTeamMap = await getFixtureTeamMap();
      const targetedFixtureIds = getTargetedFixtureIds(fixtureTeamMap, matches);
      const targetedOdds = await fetchTargetedFixtureOdds(targetedFixtureIds);
      targeted = { attempted: targetedOdds.attempted, added: targetedOdds.matches.length };
      enrichedMatches = enrichOddsWithFixtureTeams([...matches, ...targetedOdds.matches], fixtureTeamMap);
    } catch {
      // 赔率本身可用时，不因为补主客队名失败而丢掉赔率响应。
    }
    const body = Buffer.from(JSON.stringify({
      source: "api-football",
      fetchedAt: new Date().toISOString(),
      matches: enrichedMatches,
      paging,
      errors,
      targeted
    }));
    const headers = {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    };
    if (status >= 200 && status < 300) {
      proxyCache.set(cacheKey, { at: Date.now(), status, headers, body, maxAgeMs: getOddsCacheMs(enrichedMatches) });
    }
    res.writeHead(status, headers);
    res.end(body);
  } catch (error) {
    sendJson(res, 502, { error: "odds upstream unavailable", detail: String(error?.message ?? error) });
  }
}

// 静态资源：优先 Vite 构建产物 dist/，找不到再回退仓库根目录（data/public 等）
const DIST = path.join(ROOT, "dist");

function resolveStatic(pathname) {
  const candidates = [];
  for (const base of [DIST, ROOT]) {
    const filePath = path.normalize(path.join(base, pathname));
    if (filePath.startsWith(base)) candidates.push(filePath);
  }
  return candidates;
}

function handleStatic(req, res, url) {
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === "/") pathname = "/index.html";

  const candidates = resolveStatic(pathname);
  if (!candidates.length) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  const acceptsGzip = /\bgzip\b/.test(req.headers["accept-encoding"] || "");
  const tryRead = (index) => {
    if (index >= candidates.length) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not Found");
      return;
    }
    fs.readFile(candidates[index], (error, data) => {
      if (error) {
        tryRead(index + 1);
        return;
      }
      const ext = path.extname(candidates[index]).toLowerCase();
      const headers = {
        "Content-Type": MIME[ext] || "application/octet-stream",
        // 带 hash 的构建产物可永久缓存；index.html 等始终回源校验。
        "Cache-Control": pathname.startsWith("/assets/")
          ? "public, max-age=31536000, immutable"
          : "no-cache"
      };
      let body = data;
      if (acceptsGzip && COMPRESSIBLE.has(ext)) {
        body = zlib.gzipSync(data);
        headers["Content-Encoding"] = "gzip";
        headers["Vary"] = "Accept-Encoding";
      }
      res.writeHead(200, headers);
      res.end(body);
    });
  };
  tryRead(0);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host ?? "localhost"}`);
  if (url.pathname === "/api/odds/worldcup") {
    handleOddsProxy(req, res);
  } else if (url.pathname === "/api/villain-heat") {
    handleVillainHeat(req, res);
  } else if (url.pathname.startsWith("/api/football/")) {
    handleApiFootballProxy(req, res, url);
  } else {
    handleStatic(req, res, url);
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  if (!TOKEN) {
    console.warn("API_FOOTBALL_KEY 未设置：实时赛程、比分、首发和赔率不会显示。");
  }
});
