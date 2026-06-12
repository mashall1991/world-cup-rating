// 零依赖 Node 服务器：静态托管 + football-data.org API 代理
// - 浏览器请求 /api/v4/... 由本服务器转发到 https://api.football-data.org/v4/...
//   并在服务端附加 X-Auth-Token（解决浏览器 CORS 限制，token 不暴露给前端）
// - 其余路径按静态文件返回
// 本地运行：node server.js → http://localhost:3000
// Render 部署：startCommand = node server.js，环境变量 FOOTBALL_DATA_TOKEN

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT) || 3000;
const TOKEN = process.env.FOOTBALL_DATA_TOKEN || "";
const ROOT = __dirname;
const UPSTREAM = "https://api.football-data.org";

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

// 简单的代理响应缓存，减少免费层 API 配额消耗（60 秒）。
// 比分接口需要贴近实时，带 ts= 的请求不走缓存。
const proxyCache = new Map();
const PROXY_CACHE_MS = 60 * 1000;

async function handleApiProxy(req, res, url) {
  if (req.method !== "GET") {
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "method not allowed" }));
    return;
  }

  const upstreamPath = url.pathname.replace(/^\/api/, "");
  const bypassCache = url.searchParams.has("ts");
  url.searchParams.delete("ts");
  const target = UPSTREAM + upstreamPath + url.search;

  const cached = proxyCache.get(target);
  if (!bypassCache && cached && Date.now() - cached.at < PROXY_CACHE_MS) {
    res.writeHead(cached.status, cached.headers);
    res.end(cached.body);
    return;
  }

  try {
    const upstream = await fetch(target, {
      headers: TOKEN ? { "X-Auth-Token": TOKEN } : {},
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
    res.end(JSON.stringify({ error: "upstream unavailable", detail: String(error?.message ?? error) }));
  }
}

function handleStatic(req, res, url) {
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === "/") pathname = "/index.html";

  const filePath = path.normalize(path.join(ROOT, pathname));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not Found");
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host ?? "localhost"}`);
  if (url.pathname.startsWith("/api/")) {
    handleApiProxy(req, res, url);
  } else {
    handleStatic(req, res, url);
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  if (!TOKEN) {
    console.warn("FOOTBALL_DATA_TOKEN 未设置：实时数据接口将以未认证方式请求（可能被拒绝）。");
  }
});
