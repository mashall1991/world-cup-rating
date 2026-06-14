#!/usr/bin/env node
// 欧冠 2025-26 回测：你的模型胜率 + clubelo "高Elo者胜" 参照线。
// 前置：src/data/ucl/fixtures.json 和 players-stats.json(由 fetch-ucl-quality.mjs 生成)。
// 用法：node scripts/backtest-ucl.mjs
//
// 俱乐部打分(可调权重)：分钟加权球员评分(质量,主导) + 年龄结构 + 位置平衡。
// 只预测"谁赢"：高分者胜。实际平局算未命中，另行报告"剔除平局后的命中率"。
// clubelo 参照：运行时免费拉取一个时点快照(高Elo者胜)，在两队都能匹配的同一批比赛上对比。

import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "data", "ucl");
const CLUBELO_DATE = "2025-09-16"; // 联赛阶段开赛前后的时点快照(参照线，简化)

// —— 俱乐部打分 v1（可调）——
// finalScore = 质量0.60 + 进攻0.15 + 稳定0.10 + 年龄0.10 + 位置0.05
//   质量 = 主力XI(分钟加权评分) 0.6 + 深度(12-18名评分) 0.2 + 顶端天赋(评分前3均值) 0.2  → 映射0-100
//   进攻 = 核心球员场均进球密度(firepower)，缩放到0-100
//   稳定 = 主力XI分钟占全队核心分钟的比例(越集中=越成型)
//   年龄 = 黄金年龄(24-29)分钟占比
//   位置 = 四线覆盖度
const W = { quality: 0.60, attack: 0.15, stability: 0.10, age: 0.10, position: 0.05 };

const isMainStage = (round) => !/(qualif|prelim)/i.test(String(round ?? ""));

const mean = (arr) => (arr.length ? arr.reduce((s, x) => s + x, 0) / arr.length : null);
// 球员评分(~6.2-7.5)映射到 0-100，区间收窄以放大强弱差
const ratingToScore = (r) => (r == null ? null : Math.max(0, Math.min(100, ((r - 6.2) / (7.5 - 6.2)) * 100)));

// —— 跨联赛强度校正 ——
// API-Football 的赛季评分是"联赛内相对值"：在弱联赛刷出的 7.2 ≠ 五大联赛的 7.2。
// 不校正会让博多/格利姆特、贝尔格莱德红星、土超双雄等"小池塘大鱼"虚高。
// 做法：把评分向中性基准 BASE 收缩，收缩力度 = 联赛强度系数(强联赛=1，越弱越向 BASE 压)。
//   adjusted = BASE + (rating - BASE) * factor
// 系数粗略参照 UEFA 国家/联赛系数，量级可再调；真正的裁判是回测命中率。
const BASE = 6.5;
const LEAGUE_FACTOR = {
  England: 1.0, Spain: 1.0, Italy: 0.96, Germany: 0.96, France: 0.9,
  Portugal: 0.82, Netherlands: 0.8, Belgium: 0.74, Turkey: 0.72,
  Scotland: 0.66, Czechia: 0.64, Greece: 0.64, Austria: 0.64,
  Switzerland: 0.62, Denmark: 0.6, Serbia: 0.52, Norway: 0.48,
  Hungary: 0.48, Cyprus: 0.45, Azerbaijan: 0.45, Kazakhstan: 0.42
};
// 当前 players-stats.json 还没有 per-player 联赛字段(旧数据)，按球队归属联赛兜底。
// 键为 teamName 的小写子串；命中第一个即用。重抓数据后会优先用 p.leagueName。
const TEAM_LEAGUE = [
  ["arsenal", "England"], ["manchester city", "England"], ["liverpool", "England"],
  ["chelsea", "England"], ["newcastle", "England"], ["tottenham", "England"],
  ["real madrid", "Spain"], ["barcelona", "Spain"], ["atletico", "Spain"],
  ["villarreal", "Spain"], ["athletic club", "Spain"],
  ["inter", "Italy"], ["juventus", "Italy"], ["atalanta", "Italy"], ["napoli", "Italy"],
  ["bayern", "Germany"], ["dortmund", "Germany"], ["leverkusen", "Germany"], ["frankfurt", "Germany"],
  ["paris saint", "France"], ["marseille", "France"], ["monaco", "France"],
  ["sporting", "Portugal"], ["benfica", "Portugal"],
  ["psv", "Netherlands"], ["ajax", "Netherlands"],
  ["brugge", "Belgium"], ["union st", "Belgium"],
  ["fenerbah", "Turkey"], ["galatasaray", "Turkey"],
  ["celtic", "Scotland"], ["rangers", "Scotland"],
  ["slavia", "Czechia"], ["olympiakos", "Greece"], ["sturm graz", "Austria"], ["salzburg", "Austria"],
  ["basel", "Switzerland"], ["copenhagen", "Denmark"], ["crvena zvezda", "Serbia"],
  ["bodo", "Norway"], ["ferencvar", "Hungary"], ["pafos", "Cyprus"],
  ["kairat", "Kazakhstan"], ["qarabag", "Azerbaijan"]
];
function teamLeague(teamName) {
  const n = String(teamName ?? "").toLowerCase();
  const hit = TEAM_LEAGUE.find(([sub]) => n.includes(sub));
  return hit ? hit[1] : null;
}
// 优先用球员评分所在联赛(新数据)，否则退回球队联赛；都缺则用中性折扣 0.75。
function factorFor(player, fallbackLeague) {
  const league = player.leagueName ?? fallbackLeague;
  return LEAGUE_FACTOR[league] ?? 0.75;
}
const adjustRating = (rating, factor) => BASE + (rating - BASE) * factor;

// 代表性球员：有评分且有出场，按分钟降序(分钟多≈主力)。评分已做跨联赛强度校正。
function getCore(team) {
  const fallbackLeague = teamLeague(team.teamName);
  return (team.players ?? [])
    .filter((p) => p.rating != null && p.minutes != null && p.minutes > 0)
    .map((p) => ({ ...p, rating: adjustRating(p.rating, factorFor(p, fallbackLeague)) }))
    .sort((a, b) => b.minutes - a.minutes);
}

// —— 多个打分口径，用于消融对比(每个返回分数或 null) ——
const SCORERS = {
  // v0: 全队分钟加权平均评分
  avgFull(core) {
    const wm = core.reduce((s, p) => s + p.minutes, 0);
    return wm ? ratingToScore(core.reduce((s, p) => s + p.rating * p.minutes, 0) / wm) : null;
  },
  // 只看主力 XI(分钟加权)
  xiOnly(core) {
    const xi = core.slice(0, 11), wm = xi.reduce((s, p) => s + p.minutes, 0);
    return wm ? ratingToScore(xi.reduce((s, p) => s + p.rating * p.minutes, 0) / wm) : null;
  },
  // 只看球星(评分前 3 均值)
  top3(core) {
    return ratingToScore(mean([...core].sort((a, b) => b.rating - a.rating).slice(0, 3).map((p) => p.rating)));
  },
  // 厚度：有质量的常规轮换人数(评分≥7.0 且出场≥900分钟)，/12 归一
  thickness(core) {
    const reg = core.filter((p) => p.minutes >= 900 && p.rating >= 7.0).length;
    return Math.max(0, Math.min(100, (reg / 12) * 100));
  },
  // 厚度为主、球星为辅：广义阵容(前18分钟加权)0.45 + 厚度 0.35 + 球星(前3均值)0.20
  depthFocus(core) {
    const sq = core.slice(0, 18), wm = sq.reduce((s, p) => s + p.minutes, 0);
    const broad = wm ? ratingToScore(sq.reduce((s, p) => s + p.rating * p.minutes, 0) / wm) : null;
    if (broad == null) return null;
    const thick = SCORERS.thickness(core);
    const stars = ratingToScore(mean([...core].sort((a, b) => b.rating - a.rating).slice(0, 3).map((p) => p.rating)));
    return 0.45 * broad + 0.35 * thick + 0.20 * stars;
  },
  // v1 的质量项：主力XI 0.6 + 深度 0.2 + 顶端 0.2
  qualityV1(core) {
    const xi = core.slice(0, 11), depth = core.slice(11, 18);
    const wXi = xi.reduce((s, p) => s + p.minutes, 0);
    const xiR = wXi ? xi.reduce((s, p) => s + p.rating * p.minutes, 0) / wXi : mean(xi.map((p) => p.rating));
    const depthR = depth.length ? mean(depth.map((p) => p.rating)) : xiR - 0.15;
    const top3R = mean([...core].sort((a, b) => b.rating - a.rating).slice(0, 3).map((p) => p.rating));
    return ratingToScore(0.6 * xiR + 0.2 * depthR + 0.2 * top3R);
  },
  // v1 全套：质量 + 进攻 + 稳定 + 年龄 + 位置
  v1Full(core) {
    const quality = SCORERS.qualityV1(core);
    if (quality == null) return null;
    const xi = core.slice(0, 11);
    const wXi = xi.reduce((s, p) => s + p.minutes, 0);
    const goals = core.reduce((s, p) => s + (p.goals || 0), 0);
    const apps = core.reduce((s, p) => s + (p.appearances || 0), 0);
    const attack = Math.max(0, Math.min(100, ((apps ? goals / apps : 0) / 0.30) * 100));
    const totMin = core.reduce((s, p) => s + p.minutes, 0);
    const stability = totMin ? Math.min(100, (wXi / totMin) * 100) : 50;
    const primeMin = core.filter((p) => p.age >= 24 && p.age <= 29).reduce((s, p) => s + p.minutes, 0);
    const age = totMin ? (primeMin / totMin) * 100 : 50;
    const pos = (key) => core.filter((p) => String(p.position ?? "").toLowerCase().includes(key)).length;
    const cover = [pos("goal") >= 1, pos("defen") >= 3, pos("midfield") >= 3, pos("attack") >= 1];
    const position = (cover.filter(Boolean).length / 4) * 100;
    return W.quality * quality + W.attack * attack + W.stability * stability + W.age * age + W.position * position;
  }
};

// 主输出用的打分：消融显示"全队分钟加权平均评分"最优且最简，故采用 avgFull。
function scoreTeam(team) {
  const core = getCore(team);
  if (core.length < 8) return null;
  return SCORERS.avgFull(core);
}

// 实际结果：home / away / draw
function actualOutcome(f) {
  if (f.fixture?.status?.short !== "FT") return null;
  if (f.teams?.home?.winner === true) return "home";
  if (f.teams?.away?.winner === true) return "away";
  return "draw";
}

function tally(name, rows) {
  let n = 0, hits = 0, draws = 0;
  for (const r of rows) {
    n += 1;
    if (r.actual === "draw") draws += 1;
    if (r.pred === r.actual) hits += 1;
  }
  const acc = n ? hits / n : 0;
  const accNoDraw = n - draws ? hits / (n - draws) : 0;
  console.log(`\n【${name}】`);
  console.log(`  样本 ${n} 场 · 命中 ${hits} · 实际平局 ${draws}`);
  console.log(`  命中率(含平局算未中): ${(acc * 100).toFixed(1)}%`);
  console.log(`  命中率(剔除平局):     ${(accNoDraw * 100).toFixed(1)}%`);
  return { n, hits, draws, acc, accNoDraw };
}

// —— clubelo 名称匹配 ——
function norm(s) {
  return String(s ?? "").normalize("NFKD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().replace(/\b(fc|cf|sc|ac|afc|cd|ss|as|sv|bsc)\b/g, "")
    .replace(/[^a-z0-9]+/g, "").trim();
}
// API-Football 名 → clubelo 名(键为 norm() 归一后的形式，即无空格无标点)
const ALIAS = {
  "manchestercity": "Man City", "manchesterunited": "Man United",
  "parissaintgermain": "Paris SG", "bayernmunchen": "Bayern", "bayernmunich": "Bayern",
  "borussiadortmund": "Dortmund", "atleticomadrid": "Atletico", "sportingcp": "Sporting",
  "copenhagen": "FC Kobenhavn", "clubbruggekv": "Brugge",
  "olympiquemarseille": "Marseille", "bayerleverkusen": "Leverkusen", "psveindhoven": "PSV",
  "qarabag": "Karabakh Agdam", "unionstgilloise": "St Gillis",
  "redbullsalzburg": "Salzburg", "olympiakospiraeus": "Olympiakos",
  "bodoglimt": "Bodoe Glimt", "athleticclub": "Bilbao",
  "eintrachtfrankfurt": "Frankfurt", "ferencvarositc": "Ferencvaros",
  "basel1893": "Basel", "kairatalmaty": "Kairat"
};

async function loadClubelo() {
  const res = await fetch(`http://api.clubelo.com/${CLUBELO_DATE}`);
  const text = await res.text();
  const map = new Map();
  for (const line of text.split("\n").slice(1)) {
    const c = line.split(",");
    if (c.length < 5) continue;
    const club = c[1], elo = Number(c[4]);
    if (club && Number.isFinite(elo)) map.set(norm(club), elo);
  }
  return map;
}
function eloOf(name, elo) {
  const n = norm(name);
  const aliased = ALIAS[n];
  if (aliased && elo.has(norm(aliased))) return elo.get(norm(aliased));
  return elo.has(n) ? elo.get(n) : null;
}

async function main() {
  const fixtures = JSON.parse(await readFile(join(DIR, "fixtures.json"), "utf8"));
  const stats = JSON.parse(await readFile(join(DIR, "players-stats.json"), "utf8"));

  const scoreById = new Map();
  for (const t of stats) { const s = scoreTeam(t); if (s != null) scoreById.set(t.teamId, s); }
  console.log(`已为 ${scoreById.size}/${stats.length} 支球队算出模型分。`);

  const finished = fixtures.filter((f) => isMainStage(f.league?.round) && actualOutcome(f));

  console.log(`\n拉取 clubelo 快照 ${CLUBELO_DATE} …`);
  const elo = await loadClubelo();

  // 模型全样本(凡两队都有模型分)
  const modelAll = [];
  // 公平对比集(两队都有模型分 且 两队都能匹配 clubelo)
  const modelCommon = [], eloCommon = [];
  const unmatched = new Set();
  let skipNoScore = 0;
  for (const f of finished) {
    const a = scoreById.get(f.teams.home.id), b = scoreById.get(f.teams.away.id);
    if (a == null || b == null) { skipNoScore += 1; continue; }
    const actual = actualOutcome(f);
    modelAll.push({ pred: a >= b ? "home" : "away", actual });
    const ea = eloOf(f.teams.home.name, elo), eb = eloOf(f.teams.away.name, elo);
    if (ea == null) unmatched.add(f.teams.home.name);
    if (eb == null) unmatched.add(f.teams.away.name);
    if (ea == null || eb == null) continue;
    modelCommon.push({ pred: a >= b ? "home" : "away", actual });
    eloCommon.push({ pred: ea >= eb ? "home" : "away", actual });
  }

  console.log(`\n正赛完赛 ${finished.length} 场；两队都有模型分 ${modelAll.length} 场(跳过 ${skipNoScore} 场缺分)。`);
  tally("你的模型 · 全样本", modelAll);

  console.log(`\n———— 同一批比赛的公平对比(${modelCommon.length} 场，两队都有模型分且都匹配上 clubelo) ————`);
  tally("你的模型", modelCommon);
  tally("clubelo 参照(高Elo者胜)", eloCommon);
  if (unmatched.size) console.log(`\n⚠ clubelo 仍未匹配队名(可在 ALIAS 里补): ${[...unmatched].join(", ")}`);

  // —— 消融对比：多个打分口径在同一批比赛上的命中率(剔除平局) ——
  const coreById = new Map();
  for (const t of stats) { const c = getCore(t); if (c.length >= 8) coreById.set(t.teamId, c); }
  const variants = Object.keys(SCORERS);
  const scoreMaps = {};
  for (const v of variants) {
    const m = new Map();
    for (const [id, c] of coreById) { const s = SCORERS[v](c); if (s != null) m.set(id, s); }
    scoreMaps[v] = m;
  }
  const ablRows = finished.filter((f) =>
    coreById.has(f.teams.home.id) && coreById.has(f.teams.away.id) &&
    eloOf(f.teams.home.name, elo) != null && eloOf(f.teams.away.name, elo) != null
  ).map((f) => ({ f, actual: actualOutcome(f) }));

  const results = [];
  for (const v of variants) {
    let n = 0, hits = 0, draws = 0;
    for (const { f, actual } of ablRows) {
      const sh = scoreMaps[v].get(f.teams.home.id), sa = scoreMaps[v].get(f.teams.away.id);
      if (sh == null || sa == null) continue;
      n += 1; if (actual === "draw") draws += 1;
      if ((sh >= sa ? "home" : "away") === actual) hits += 1;
    }
    results.push({ v, n, accNoDraw: n - draws ? hits / (n - draws) : 0, acc: n ? hits / n : 0 });
  }
  {
    let hits = 0, draws = 0;
    for (const { f, actual } of ablRows) {
      if (actual === "draw") draws += 1;
      if ((eloOf(f.teams.home.name, elo) >= eloOf(f.teams.away.name, elo) ? "home" : "away") === actual) hits += 1;
    }
    results.push({ v: "clubelo(参照)", n: ablRows.length, accNoDraw: hits / (ablRows.length - draws), acc: hits / ablRows.length });
  }
  results.sort((a, b) => b.accNoDraw - a.accNoDraw);
  console.log(`\n———— 打分口径消融对比(同一批 ${ablRows.length} 场，按"剔除平局命中率"排序) ————`);
  for (const r of results) {
    console.log(`  ${r.v.padEnd(14)} 剔除平局 ${(r.accNoDraw * 100).toFixed(1)}%  ·  含平局 ${(r.acc * 100).toFixed(1)}%`);
  }

  console.log("\n注：模型只预测胜负、不预测平局；clubelo 用单一时点快照，仅作参照线。");
}

main().catch((e) => { console.error("失败:", e); process.exit(1); });
