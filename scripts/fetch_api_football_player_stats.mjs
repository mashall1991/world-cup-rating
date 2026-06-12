import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SQUAD_PATH = path.join(ROOT, "data", "public", "squad_model_data.json");
const OUT_JSON = path.join(ROOT, "data", "public", "club_player_stats.json");
const OUT_JS = path.join(ROOT, "data", "public", "club_player_stats.js");
const BASE_URL = "https://v3.football.api-sports.io";
const API_FOOTBALL_LEAGUE_BY_CODE = {
  ARG: 128,
  AUT: 218,
  BEL: 144,
  BRA: 71,
  BUL: 172,
  CHN: 169,
  CRO: 210,
  CYP: 318,
  CZE: 345,
  DEN: 119,
  ENG: 39,
  ESP: 140,
  FRA: 61,
  GER: 78,
  GRE: 197,
  HUN: 271,
  ISR: 383,
  ITA: 135,
  JPN: 98,
  KOR: 292,
  KSA: 307,
  MEX: 262,
  NED: 88,
  NOR: 103,
  POL: 106,
  POR: 94,
  QAT: 305,
  ROU: 283,
  RUS: 235,
  SCO: 179,
  SRB: 286,
  SUI: 207,
  SWE: 113,
  TUR: 203,
  UAE: 301,
  UKR: 333,
  URU: 268,
  USA: 253
};

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
const teamSearchCache = new Map();
const teamPlayersCache = new Map();

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
  await writeFileWithRetry(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`);
  await writeFileWithRetry(OUT_JS, `window.WORLD_CUP_CLUB_PLAYER_STATS = ${JSON.stringify(payload, null, 2)};\n`);
}

async function writeFileWithRetry(filePath, content) {
  let lastError = null;
  for (let attempt = 1; attempt <= 6; attempt += 1) {
    try {
      await fs.writeFile(filePath, content, "utf8");
      return;
    } catch (error) {
      lastError = error;
      await sleep(150 * attempt);
    }
  }
  throw lastError;
}

async function searchApiFootballPlayers(player) {
  const teamId = await resolveClubTeamId(player);
  if (teamId) {
    return getTeamPlayers(teamId);
  }

  const query = cleanPlayerName(player.nameEn ?? player.name);
  if (query.length < 4) return [];
  const league = getApiFootballLeagueId(player);
  if (!league) {
    throw new Error(`league_not_mapped:${player.leagueCode ?? "UNK"}`);
  }
  const data = await apiFootballGet("/players", { search: query, league, season });
  return Array.isArray(data.response) ? data.response : [];
}

async function resolveClubTeamId(player) {
  const clubQueries = getClubSearchQueries(player.clubEn ?? player.club);
  if (!clubQueries.length) return null;
  const cacheKey = normalizeKey(clubQueries[0]);
  if (teamSearchCache.has(cacheKey)) return teamSearchCache.get(cacheKey);

  for (const clubQuery of clubQueries) {
    const data = await apiFootballGet("/teams", { search: clubQuery });
    const teams = Array.isArray(data.response) ? data.response : [];
    const selected = pickBestTeamCandidate(teams, player, clubQuery);
    const id = selected?.team?.id ?? null;
    await sleep(Math.min(150, sleepMs));
    if (id) {
      teamSearchCache.set(cacheKey, id);
      return id;
    }
  }

  teamSearchCache.set(cacheKey, null);
  return null;
}

async function getTeamPlayers(teamId) {
  const cacheKey = `${teamId}:${season}`;
  if (teamPlayersCache.has(cacheKey)) return teamPlayersCache.get(cacheKey);

  const players = [];
  let page = 1;
  let totalPages = 1;
  do {
    const data = await apiFootballGet("/players", { team: teamId, season, page });
    if (Array.isArray(data.response)) players.push(...data.response);
    totalPages = Number(data.paging?.total ?? 1);
    page += 1;
    if (page <= totalPages) await sleep(Math.min(150, sleepMs));
  } while (page <= totalPages && page <= 8);

  teamPlayersCache.set(cacheKey, players);
  return players;
}

function getApiFootballLeagueId(player) {
  const code = String(player.leagueCode ?? "").trim().toUpperCase();
  return API_FOOTBALL_LEAGUE_BY_CODE[code] ?? null;
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
    const nameScore = Math.max(...names.map((name) => getPlayerNameScore(target, name)), 0);
    if (nameScore <= 0) return { candidate, score: 0 };
    const clubScore = (candidate.statistics ?? []).some((stat) => clubKey && clubKey.includes(normalizeKey(stat.team?.name))) ? 2 : 0;
    const minutes = Math.max(...(candidate.statistics ?? []).map((stat) => Number(stat.games?.minutes ?? 0)), 0);
    return { candidate, score: nameScore + clubScore + Math.min(1.5, minutes / 1200) };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.score > 0 ? scored[0].candidate : null;
}

function getPlayerNameScore(target, candidate) {
  if (!target || !candidate) return 0;
  if (target === candidate) return 8;
  if (target.includes(candidate) || candidate.includes(target)) return 4;

  const targetParts = target.split(" ").filter(Boolean);
  const candidateParts = candidate.split(" ").filter(Boolean);
  const targetLast = targetParts.at(-1);
  const candidateLast = candidateParts.at(-1);
  const sameLastName = targetLast && candidateLast && targetLast === candidateLast;
  const targetInitial = targetParts[0]?.[0];
  const candidateInitial = candidateParts[0]?.[0];
  if (sameLastName && targetInitial && targetInitial === candidateInitial) return 5;

  const targetTail = targetParts.slice(-2).join(" ");
  const candidateTail = candidateParts.slice(-2).join(" ");
  if (targetTail && candidateTail && targetTail === candidateTail) return 5;
  return 0;
}

function pickBestTeamCandidate(candidates, localPlayer, query) {
  const clubKey = normalizeKey(query ?? cleanClubSearchName(localPlayer.clubEn ?? localPlayer.club));
  const countryCode = extractClubCountryCode(localPlayer.clubEn ?? localPlayer.club);
  const scored = candidates.map((candidate) => {
    const team = candidate.team ?? {};
    const nameKey = normalizeKey(team.name);
    const exact = nameKey === clubKey ? 8 : 0;
    const fuzzy = clubKey.includes(nameKey) || nameKey.includes(clubKey) ? 4 : 0;
    const country = countryCode && countryMatchesCode(candidate.team?.country, countryCode) ? 2 : 0;
    const nationalPenalty = team.national ? -8 : 0;
    return { candidate, score: exact + fuzzy + country + nationalPenalty };
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

function cleanClubSearchName(name) {
  return cleanPlayerName(name)
    .replace(/\([^)]*\)/g, " ")
    .replace(/&/g, " and ")
    .replace(/[.]/g, " ")
    .replace(/\bC\s*F\b/gi, " ")
    .replace(/\bF\s*C\b/gi, " ")
    .replace(/\bS\s*S\s*C\b/gi, " ")
    .replace(/\bS\s*C\b/gi, " ")
    .replace(/\bS\s*A\b/gi, " ")
    .replace(/\bS\s*L\b/gi, " ")
    .replace(/\bA\s*S\b/gi, " ")
    .replace(/\bA\s*C\b/gi, " ")
    .replace(/[^a-zA-Z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getClubSearchQueries(name) {
  const cleaned = cleanClubSearchName(name);
  if (!cleaned) return [];
  const withoutAnd = cleaned.replace(/\band\b/gi, " ").replace(/\s+/g, " ").trim();
  const words = withoutAnd.split(" ").filter(Boolean);
  const variants = [
    cleaned,
    withoutAnd,
    words.slice(0, 2).join(" "),
    words[0]
  ].filter((query) => query && query.length >= 3);
  return [...new Set(variants)];
}

function extractClubCountryCode(name) {
  const match = /\(([A-Z]{2,3})\)\s*$/.exec(String(name ?? ""));
  return match?.[1] ?? "";
}

function countryMatchesCode(country, code) {
  const countries = {
    ARG: "Argentina",
    AUT: "Austria",
    BEL: "Belgium",
    BRA: "Brazil",
    CZE: "Czech-Republic",
    DEN: "Denmark",
    ENG: "England",
    ESP: "Spain",
    FRA: "France",
    GER: "Germany",
    GRE: "Greece",
    ITA: "Italy",
    JPN: "Japan",
    KOR: "South-Korea",
    KSA: "Saudi-Arabia",
    MEX: "Mexico",
    NED: "Netherlands",
    POR: "Portugal",
    SCO: "Scotland",
    SUI: "Switzerland",
    TUR: "Turkey",
    USA: "USA"
  };
  return normalizeKey(country) === normalizeKey(countries[code] ?? "");
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
