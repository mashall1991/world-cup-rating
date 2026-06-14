#!/usr/bin/env node
// 补抓 2025-26 欧冠"正赛"球队的球员赛季质量数据(评分/分钟/出场)。
// 跳过资格赛球队，控制调用量。
//
// 前置：先跑过 fetch-ucl.mjs(需要 src/data/ucl/fixtures.json)。
// 用法：APIFOOTBALL_KEY=你的token node scripts/fetch-ucl-quality.mjs
//
// 输出：src/data/ucl/players-stats.json
//   [{ teamId, teamName, players:[{id,name,age,position,leagueId,leagueName,rating,minutes,appearances,goals}] }]
//
// 每名球员取其"出场分钟最多的那条统计"(通常是所在联赛),评分/分钟最有代表性。
// 约 36 队 × 1-2 页 ≈ 50-72 次调用，在免费档 100/天 之内。

import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const KEY = process.env.APIFOOTBALL_KEY || process.argv.find((a) => a.length === 32);
const SEASON = 2025;
const BASE = "https://v3.football.api-sports.io";
const DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "data", "ucl");

if (!KEY) { console.error("缺少 token。用法: APIFOOTBALL_KEY=xxxx node scripts/fetch-ucl-quality.mjs"); process.exit(1); }

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let calls = 0;

async function api(path) {
  calls += 1;
  const res = await fetch(`${BASE}/${path}`, { headers: { "x-apisports-key": KEY } });
  const remaining = res.headers.get("x-ratelimit-requests-remaining");
  const json = await res.json();
  console.log(`  [${calls}] ${path} → ${json.results ?? 0}${remaining != null ? ` · 剩余 ${remaining}` : ""}`);
  await sleep(250);
  return json;
}

// 选出"代表性统计行"：出场分钟最多的一条
function pickStat(player) {
  const lines = player.statistics ?? [];
  let best = null;
  for (const s of lines) {
    const mins = Number(s.games?.minutes ?? 0) || 0;
    if (!best || mins > best._min) best = { ...s, _min: mins };
  }
  return best;
}

async function main() {
  const fixtures = JSON.parse(await readFile(join(DIR, "fixtures.json"), "utf8"));

  // 正赛 = 轮次名不含 qualifying / preliminary / play-off(夏季资格赛)
  const isMainStage = (round) => !/(qualif|prelim)/i.test(String(round ?? ""));
  const teamMap = new Map();
  for (const f of fixtures) {
    if (!isMainStage(f.league?.round)) continue;
    for (const side of ["home", "away"]) {
      const t = f.teams?.[side];
      if (t?.id) teamMap.set(t.id, t.name);
    }
  }
  console.log(`正赛球队 ${teamMap.size} 支，开始补抓球员统计…`);

  const out = [];
  for (const [teamId, teamName] of teamMap) {
    const first = await api(`players?team=${teamId}&season=${SEASON}&page=1`);
    let resp = [...(first.response ?? [])];
    const total = first.paging?.total ?? 1;
    for (let p = 2; p <= total; p += 1) {
      const next = await api(`players?team=${teamId}&season=${SEASON}&page=${p}`);
      resp = resp.concat(next.response ?? []);
    }
    const players = resp.map((pl) => {
      const st = pickStat(pl) ?? {};
      return {
        id: pl.player?.id,
        name: pl.player?.name,
        age: pl.player?.age ?? null,
        position: st.games?.position ?? null,
        // 评分所在联赛(用于跨联赛强度校正：弱联赛刷出的高分需打折)
        leagueId: st.league?.id ?? null,
        leagueName: st.league?.name ?? null,
        rating: st.games?.rating != null ? Number(st.games.rating) : null,
        minutes: st.games?.minutes != null ? Number(st.games.minutes) : null,
        appearances: st.games?.appearences != null ? Number(st.games.appearences) : null,
        goals: st.goals?.total != null ? Number(st.goals.total) : null
      };
    });
    out.push({ teamId, teamName, players });
  }

  await writeFile(join(DIR, "players-stats.json"), JSON.stringify(out, null, 2), "utf8");
  console.log(`\n完成。共 ${calls} 次调用。已写入 src/data/ucl/players-stats.json (${out.length} 队)`);
}

main().catch((e) => { console.error("失败:", e); process.exit(1); });
