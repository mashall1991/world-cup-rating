import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SQUAD_PATH = path.join(ROOT, "data", "public", "squad_model_data.json");
const OUT_JSON = path.join(ROOT, "data", "public", "club_player_stats.json");
const OUT_JS = path.join(ROOT, "data", "public", "club_player_stats.js");
const BASE_URL = "https://v3.football.api-sports.io";

const args = parseArgs(process.argv.slice(2));
if (args.help) {
  printHelp();
  process.exit(0);
}

const token = process.env.API_FOOTBALL_KEY || process.env.APISPORTS_KEY || process.env.API_SPORTS_KEY;
if (!token) {
  console.error("API_FOOTBALL_KEY is required. Set it in the environment, not in source code.");
  process.exit(1);
}

const minWeight = Number(args["min-weight"] ?? 0.55);
const limit = args.limit === "all" ? Infinity : Number(args.limit ?? 160);
const sleepMs = Number(args.sleep ?? 450);
const teamFilters = arrayArg(args.team).map(normalizeKey);
const season = String(args.season ?? process.env.API_FOOTBALL_PLAYER_SEASON ?? "2025");
const resume = Boolean(args.resume && args.resume !== "false");

const squadModel = JSON.parse(await fs.readFile(SQUAD_PATH, "utf8"));
const players = selectPlayers(squadModel.teams ?? [], { minWeight, limit, teamFilters });
const existing = resume ? await readExistingResults() : [];
const results = [...existing];
const completedKeys = new Set(existing.map((item) => playerKey(item.teamEn, item.playerEn)));

for (const [index, item] of players.entries()) {
  if (completedKeys.has(playerKey(item.teamNameEn, item.player.nameEn))) {
    console.log(`[${index + 1}/${players.length}] ${item.teamNameEn} - ${item.player.nameEn} (cached)`);
    continue;
  }

  console.log(`[${index + 1}/${players.length}] ${item.teamNameEn} - ${item.player.nameEn}`);
  try {
    const candidates = await searchApiFootballPlayers(item.player);
    const selected = pickBestPlayerCandidate(candidates, item.player);
    if (!selected) {
      results.push(buildMissingResult(item, "not_found"));
      await writePayload(results, { partial: true });
      await sleep(sleepMs);
      continue;
    }

    const seasons = normalizeStatistics(selected.statistics ?? []);
    const latest = pickBestSeason(seasons, item.player);
    results.push({
      team: item.teamName,
      teamEn: item.teamNameEn,
      player: item.player.name,
      playerEn: item.player.nameEn,
      position: item.player.position,
      club: item.player.club,
      clubEn: item.player.clubEn,
      appearanceWeight: Number(item.player.appearanceWeight ?? 0),
      apiFootball: normalizeApiFootballPlayer(selected.player),
      latestSeason: latest,
      seasons
    });
  } catch (error) {
    results.push(buildMissingResult(item, String(error?.message ?? error)));
  }
  await writePayload(results, { partial: true });
  await sleep(sleepMs);
}

await writePayload(results, { partial: false });
console.log(`Wrote ${path.relative(ROOT, OUT_JSON)} and ${path.relative(ROOT, OUT_JS)}`);

function parseArgs(argv) {
  const parsed = {};
  for (const arg of argv) {
    if (arg === "--help" || arg === "-h") {
      parsed.help = true;
      continue;
    }
    const match = /^--([^=]+)(?:=(.*))?$/.exec(arg);
    if (!match) continue;
    const [, key, value = "true"] = match;
    if (parsed[key] === undefined) parsed[key] = value;
    else if (Array.isArray(parsed[key])) parsed[key].push(value);
    else parsed[key] = [parsed[key], value];
  }
  return parsed;
}

function arrayArg(value) {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function printHelp() {
  console.log(`Usage:
  API_FOOTBALL_KEY=... node scripts/fetch_api_football_player_stats.mjs [options]

Options:
  --team=Belgium          Only fetch one team. Repeat for multiple teams.
  --min-weight=0.55       Minimum appearanceWeight to fetch. Default 0.55.
  --limit=160             Max players to fetch after filtering. Use "all" for all. Default 160.
  --season=2025           API-Football season year for club stats. Default 2025.
  --sleep=450             Delay between API calls in ms. Default 450.
  --resume=true           Reuse existing output and continue missing players.
`);
}

function selectPlayers(teams, { minWeight, limit, teamFilters }) {
  const selected = [];
  for (const team of teams) {
    if (teamFilters.length && !teamFilters.includes(normalizeKey(team.nameEn ?? team.name))) continue;
    for (const player of team.players ?? []) {
      if (Number(player.appearanceWeight ?? 0) < minWeight) continue;
      selected.push({ teamName: team.name, teamNameEn: team.nameEn, player });
    }
  }
  selected.sort((a, b) => Number(b.player.appearanceWeight ?? 0) - Number(a.player.appearanceWeight ?? 0));
  return Number.isFinite(limit) ? selected.slice(0, limit) : selected;
}

async function readExistingResults() {
  try {
    const payload = JSON.parse(await fs.readFile(OUT_JSON, "utf8"));
    return Array.isArray(payload.players) ? payload.players : [];
  } catch {
    return [];
  }
}

async function writePayload(players, { partial }) {
  const payload = {
    generatedAt: new Date().toISOString(),
    source: "API-Football v3",
    partial,
    notes: [
      "Token is read from API_FOOTBALL_KEY and is not stored in this file.",
      "Coverage depends on the active API-Football subscription and selected season.",
      "latestSeason is selected from the closest club/team statistics row returned by /players."
    ],
    query: {
      minWeight,
      limit: Number.isFinite(limit) ? limit : "all",
      teams: teamFilters,
      season
    },
    players
  };
  await fs.writeFile(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  await fs.writeFile(OUT_JS, `window.WORLD_CUP_CLUB_PLAYER_STATS = ${JSON.stringify(payload, null, 2)};\n`, "utf8");
}

async function searchApiFootballPlayers(player) {
  const query = cleanPlayerName(player.nameEn ?? player.name);
  if (query.length < 4) return [];
  const data = await apiFootballGet("/players", { search: query, season });
  return Array.isArray(data.response) ? data.response : [];
}

async function apiFootballGet(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, value);
  }
  const response = await fetch(url, {
    headers: { "x-apisports-key": token }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.message ?? data?.errors ?? `HTTP ${response.status}`;
    throw new Error(typeof message === "string" ? message : JSON.stringify(message));
  }
  if (data.errors && Object.keys(data.errors).length) {
    throw new Error(JSON.stringify(data.errors));
  }
  return data;
}

function pickBestPlayerCandidate(candidates, localPlayer) {
  const target = normalizeKey(localPlayer.nameEn ?? localPlayer.name);
  const clubKey = normalizeKey(localPlayer.clubEn ?? localPlayer.club);
  const scored = candidates.map((candidate) => {
    const apiPlayer = candidate.player ?? {};
    const names = [apiPlayer.name, apiPlayer.firstname, apiPlayer.lastname].filter(Boolean).map(normalizeKey);
    const exactName = names.includes(target);
    const nameScore = exactName ? 6 : names.some((name) => target.includes(name) || name.includes(target)) ? 3 : 0;
    const clubScore = (candidate.statistics ?? []).some((stat) => clubKey && clubKey.includes(normalizeKey(stat.team?.name))) ? 2 : 0;
    const minutes = Math.max(...(candidate.statistics ?? []).map((stat) => Number(stat.games?.minutes ?? 0)), 0);
    return { candidate, score: nameScore + clubScore + Math.min(1.5, minutes / 1200) };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.score > 0 ? scored[0].candidate : null;
}

function normalizeApiFootballPlayer(player = {}) {
  return {
    id: player.id ?? null,
    name: player.name ?? "",
    firstName: player.firstname ?? "",
    lastName: player.lastname ?? "",
    age: player.age ?? null,
    nationality: player.nationality ?? "",
    height: player.height ?? "",
    weight: player.weight ?? "",
    injured: Boolean(player.injured),
    photo: player.photo ?? null
  };
}

function normalizeStatistics(statistics) {
  return statistics.map((row) => ({
    season: row.league?.season ?? season,
    leagueId: row.league?.id ?? null,
    leagueName: row.league?.name ?? "",
    leagueCountry: row.league?.country ?? "",
    teamId: row.team?.id ?? null,
    teamName: row.team?.name ?? "",
    metrics: extractMetrics(row),
    raw: row
  }));
}

function extractMetrics(row) {
  return {
    appearances: numericValue(row.games?.appearences),
    starts: numericValue(row.games?.lineups),
    minutes: numericValue(row.games?.minutes),
    rating: numericValue(row.games?.rating),
    goals: numericValue(row.goals?.total),
    assists: numericValue(row.goals?.assists),
    shots: numericValue(row.shots?.total),
    shotsOnTarget: numericValue(row.shots?.on),
    keyPasses: numericValue(row.passes?.key),
    totalPasses: numericValue(row.passes?.total),
    tackles: numericValue(row.tackles?.total),
    interceptions: numericValue(row.tackles?.interceptions),
    duels: numericValue(row.duels?.total),
    duelsWon: numericValue(row.duels?.won),
    dribbleAttempts: numericValue(row.dribbles?.attempts),
    dribblesWon: numericValue(row.dribbles?.success),
    yellowCards: numericValue(row.cards?.yellow),
    redCards: numericValue(row.cards?.red)
  };
}

function pickBestSeason(seasons, localPlayer) {
  if (!seasons.length) return null;
  const clubKey = normalizeKey(localPlayer.clubEn ?? localPlayer.club);
  return [...seasons].sort((a, b) => {
    const aClub = clubKey && clubKey.includes(normalizeKey(a.teamName)) ? 1 : 0;
    const bClub = clubKey && clubKey.includes(normalizeKey(b.teamName)) ? 1 : 0;
    if (aClub !== bClub) return bClub - aClub;
    return Number(b.metrics.minutes ?? 0) - Number(a.metrics.minutes ?? 0);
  })[0];
}

function numericValue(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function playerKey(teamEn, playerEn) {
  return `${normalizeKey(teamEn)}::${normalizeKey(playerEn)}`;
}

function buildMissingResult(item, reason) {
  return {
    team: item.teamName,
    teamEn: item.teamNameEn,
    player: item.player.name,
    playerEn: item.player.nameEn,
    position: item.player.position,
    club: item.player.club,
    clubEn: item.player.clubEn,
    appearanceWeight: Number(item.player.appearanceWeight ?? 0),
    error: reason,
    latestSeason: null,
    seasons: []
  };
}

function cleanPlayerName(name) {
  return String(name ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeKey(value) {
  return cleanPlayerName(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
