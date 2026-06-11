const defaultTeams = [
  {
    id: "arg",
    name: "阿根廷",
    nameEn: "Argentina",
    flag: "🇦🇷",
    confederation: "CONMEBOL",
    badge: "ARG",
    badgeColor: "#2f79b7",
    squadVersion: { date: "2026-05-25", status: "预测名单" },
    dimensions: {
      environment: 86,
      cohesion: 91,
      age: 82,
      performance: 88
    },
    environmentBreakdown: {
      leagueStrength: 87,
      clubCompetitiveness: 84,
      roleStability: 88
    },
    cohesionBreakdown: {
      nationalTeam: 93,
      club: 82,
      historical: 62
    },
    performanceBreakdown: {
      officialResults: 89,
      officialGoalProfile: 86,
      strongOpponent: 84
    },
    ageProfile: {
      weightedAgeScore: 82,
      primeShare: 46,
      riskPositions: "边路轮换偏老"
    },
    squadBalanceAdjustment: -2,
    availabilityAdjustment: 0.99,
    players: [
      player("梅西", "Lionel Messi", 38, "前场核心", "核心轮换", 0.55, "迈阿密国际", "Inter Miami", 76, "可用"),
      player("劳塔罗", "Lautaro Martinez", 28, "中锋", "预计主力", 1, "国际米兰", "Inter", 91, "可用"),
      player("麦卡利斯特", "Alexis Mac Allister", 27, "中场", "预计主力", 1, "利物浦", "Liverpool", 93, "可用"),
      player("恩佐", "Enzo Fernandez", 25, "中场", "预计主力", 1, "切尔西", "Chelsea", 88, "可用"),
      player("罗梅罗", "Cristian Romero", 28, "中卫", "预计主力", 1, "托特纳姆热刺", "Tottenham Hotspur", 89, "观察")
    ]
  },
  {
    id: "fra",
    name: "法国",
    nameEn: "France",
    flag: "🇫🇷",
    confederation: "UEFA",
    badge: "FRA",
    badgeColor: "#315f9f",
    squadVersion: { date: "2026-05-25", status: "预测名单" },
    dimensions: {
      environment: 92,
      cohesion: 84,
      age: 88,
      performance: 86
    },
    environmentBreakdown: {
      leagueStrength: 91,
      clubCompetitiveness: 93,
      roleStability: 92
    },
    cohesionBreakdown: {
      nationalTeam: 86,
      club: 78,
      historical: 58
    },
    performanceBreakdown: {
      officialResults: 87,
      officialGoalProfile: 86,
      strongOpponent: 84
    },
    ageProfile: {
      weightedAgeScore: 88,
      primeShare: 58,
      riskPositions: "结构均衡"
    },
    squadBalanceAdjustment: -1,
    availabilityAdjustment: 1,
    players: [
      player("姆巴佩", "Kylian Mbappe", 27, "边锋", "预计主力", 1, "皇家马德里", "Real Madrid", 96, "可用"),
      player("楚阿梅尼", "Aurelien Tchouameni", 26, "后腰", "预计主力", 1, "皇家马德里", "Real Madrid", 93, "可用"),
      player("卡马文加", "Eduardo Camavinga", 23, "中场", "核心轮换", 0.55, "皇家马德里", "Real Madrid", 89, "可用"),
      player("萨利巴", "William Saliba", 25, "中卫", "预计主力", 1, "阿森纳", "Arsenal", 94, "可用"),
      player("登贝莱", "Ousmane Dembele", 29, "边锋", "核心轮换", 0.55, "巴黎圣日耳曼", "Paris Saint-Germain", 89, "可用")
    ]
  },
  {
    id: "bra",
    name: "巴西",
    nameEn: "Brazil",
    flag: "🇧🇷",
    confederation: "CONMEBOL",
    badge: "BRA",
    badgeColor: "#1f7a4d",
    squadVersion: { date: "2026-05-25", status: "预测名单" },
    dimensions: {
      environment: 89,
      cohesion: 78,
      age: 86,
      performance: 76
    },
    environmentBreakdown: {
      leagueStrength: 90,
      clubCompetitiveness: 88,
      roleStability: 89
    },
    cohesionBreakdown: {
      nationalTeam: 78,
      club: 74,
      historical: 61
    },
    performanceBreakdown: {
      officialResults: 74,
      officialGoalProfile: 78,
      strongOpponent: 72
    },
    ageProfile: {
      weightedAgeScore: 86,
      primeShare: 54,
      riskPositions: "边锋深度充足"
    },
    squadBalanceAdjustment: -3,
    availabilityAdjustment: 0.98,
    players: [
      player("维尼修斯", "Vinicius Junior", 25, "边锋", "预计主力", 1, "皇家马德里", "Real Madrid", 96, "可用"),
      player("罗德里戈", "Rodrygo", 25, "前锋", "预计主力", 1, "皇家马德里", "Real Madrid", 92, "可用"),
      player("吉马良斯", "Bruno Guimaraes", 28, "中场", "预计主力", 1, "纽卡斯尔联", "Newcastle United", 89, "可用"),
      player("马尔基尼奥斯", "Marquinhos", 32, "中卫", "预计主力", 1, "巴黎圣日耳曼", "Paris Saint-Germain", 83, "可用"),
      player("恩德里克", "Endrick", 19, "前锋", "核心轮换", 0.55, "皇家马德里", "Real Madrid", 76, "观察")
    ]
  },
  {
    id: "eng",
    name: "英格兰",
    nameEn: "England",
    flag: "\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}",
    confederation: "UEFA",
    badge: "ENG",
    badgeColor: "#7b2f35",
    squadVersion: { date: "2026-05-25", status: "预测名单" },
    dimensions: {
      environment: 91,
      cohesion: 82,
      age: 87,
      performance: 84
    },
    environmentBreakdown: {
      leagueStrength: 93,
      clubCompetitiveness: 90,
      roleStability: 90
    },
    cohesionBreakdown: {
      nationalTeam: 84,
      club: 80,
      historical: 56
    },
    performanceBreakdown: {
      officialResults: 85,
      officialGoalProfile: 83,
      strongOpponent: 80
    },
    ageProfile: {
      weightedAgeScore: 87,
      primeShare: 52,
      riskPositions: "中前场黄金年龄"
    },
    squadBalanceAdjustment: -2,
    availabilityAdjustment: 1,
    players: [
      player("贝林厄姆", "Jude Bellingham", 22, "中场", "预计主力", 1, "皇家马德里", "Real Madrid", 94, "可用"),
      player("福登", "Phil Foden", 26, "前场", "预计主力", 1, "曼城", "Manchester City", 92, "可用"),
      player("萨卡", "Bukayo Saka", 24, "边锋", "预计主力", 1, "阿森纳", "Arsenal", 93, "可用"),
      player("凯恩", "Harry Kane", 32, "中锋", "预计主力", 1, "拜仁慕尼黑", "Bayern Munich", 91, "可用"),
      player("赖斯", "Declan Rice", 27, "后腰", "预计主力", 1, "阿森纳", "Arsenal", 94, "可用")
    ]
  },
  {
    id: "esp",
    name: "西班牙",
    nameEn: "Spain",
    flag: "🇪🇸",
    confederation: "UEFA",
    badge: "ESP",
    badgeColor: "#bf7b1f",
    squadVersion: { date: "2026-05-25", status: "预测名单" },
    dimensions: {
      environment: 87,
      cohesion: 86,
      age: 84,
      performance: 87
    },
    environmentBreakdown: {
      leagueStrength: 88,
      clubCompetitiveness: 86,
      roleStability: 87
    },
    cohesionBreakdown: {
      nationalTeam: 88,
      club: 84,
      historical: 64
    },
    performanceBreakdown: {
      officialResults: 88,
      officialGoalProfile: 86,
      strongOpponent: 85
    },
    ageProfile: {
      weightedAgeScore: 84,
      primeShare: 43,
      riskPositions: "年轻核心成熟度"
    },
    squadBalanceAdjustment: -1,
    availabilityAdjustment: 1,
    players: [
      player("佩德里", "Pedri", 23, "中场", "预计主力", 1, "巴塞罗那", "Barcelona", 87, "可用"),
      player("加维", "Gavi", 21, "中场", "核心轮换", 0.55, "巴塞罗那", "Barcelona", 83, "观察"),
      player("罗德里", "Rodri", 29, "后腰", "预计主力", 1, "曼城", "Manchester City", 96, "可用"),
      player("亚马尔", "Lamine Yamal", 18, "边锋", "预计主力", 1, "巴塞罗那", "Barcelona", 84, "可用"),
      player("奥亚萨瓦尔", "Mikel Oyarzabal", 29, "前锋", "核心轮换", 0.55, "皇家社会", "Real Sociedad", 82, "可用")
    ]
  },
  {
    id: "ger",
    name: "德国",
    nameEn: "Germany",
    flag: "🇩🇪",
    confederation: "UEFA",
    badge: "GER",
    badgeColor: "#3d3d3d",
    squadVersion: { date: "2026-05-25", status: "预测名单" },
    dimensions: {
      environment: 88,
      cohesion: 80,
      age: 81,
      performance: 82
    },
    environmentBreakdown: {
      leagueStrength: 89,
      clubCompetitiveness: 88,
      roleStability: 87
    },
    cohesionBreakdown: {
      nationalTeam: 80,
      club: 83,
      historical: 60
    },
    performanceBreakdown: {
      officialResults: 81,
      officialGoalProfile: 83,
      strongOpponent: 78
    },
    ageProfile: {
      weightedAgeScore: 81,
      primeShare: 40,
      riskPositions: "中轴年龄混合"
    },
    squadBalanceAdjustment: -3,
    availabilityAdjustment: 1,
    players: [
      player("穆西亚拉", "Jamal Musiala", 23, "前场", "预计主力", 1, "拜仁慕尼黑", "Bayern Munich", 91, "可用"),
      player("维尔茨", "Florian Wirtz", 23, "前场", "预计主力", 1, "勒沃库森", "Bayer Leverkusen", 90, "可用"),
      player("基米希", "Joshua Kimmich", 31, "中场", "预计主力", 1, "拜仁慕尼黑", "Bayern Munich", 86, "可用"),
      player("吕迪格", "Antonio Rudiger", 33, "中卫", "预计主力", 1, "皇家马德里", "Real Madrid", 83, "可用"),
      player("菲尔克鲁格", "Niclas Fullkrug", 33, "中锋", "核心轮换", 0.55, "西汉姆联", "West Ham United", 78, "可用")
    ]
  }
];

const tournamentTeamSeeds = [
  ["mex", "墨西哥", "Mexico", "🇲🇽", "CONCACAF", "Group A", "#1f7a4d"],
  ["rsa", "南非", "South Africa", "🇿🇦", "CAF", "Group A", "#bf7b1f"],
  ["kor", "韩国", "South Korea", "🇰🇷", "AFC", "Group A", "#315f9f"],
  ["cze", "捷克", "Czech Republic", "🇨🇿", "UEFA", "Group A", "#7b2f35"],
  ["can", "加拿大", "Canada", "🇨🇦", "CONCACAF", "Group B", "#b64a3a"],
  ["bih", "波黑", "Bosnia & Herzegovina", "🇧🇦", "UEFA", "Group B", "#315f9f"],
  ["qat", "卡塔尔", "Qatar", "🇶🇦", "AFC", "Group B", "#7b2f35"],
  ["sui", "瑞士", "Switzerland", "🇨🇭", "UEFA", "Group B", "#b64a3a"],
  ["bra", "巴西", "Brazil", "🇧🇷", "CONMEBOL", "Group C", "#1f7a4d"],
  ["mar", "摩洛哥", "Morocco", "🇲🇦", "CAF", "Group C", "#b64a3a"],
  ["hai", "海地", "Haiti", "🇭🇹", "CONCACAF", "Group C", "#315f9f"],
  ["sco", "苏格兰", "Scotland", "🏴", "UEFA", "Group C", "#315f9f"],
  ["usa", "美国", "USA", "🇺🇸", "CONCACAF", "Group D", "#315f9f"],
  ["par", "巴拉圭", "Paraguay", "🇵🇾", "CONMEBOL", "Group D", "#7b2f35"],
  ["aus", "澳大利亚", "Australia", "🇦🇺", "AFC", "Group D", "#bf7b1f"],
  ["tur", "土耳其", "Turkey", "🇹🇷", "UEFA", "Group D", "#b64a3a"],
  ["ger", "德国", "Germany", "🇩🇪", "UEFA", "Group E", "#3d3d3d"],
  ["cuw", "库拉索", "Curaçao", "🇨🇼", "CONCACAF", "Group E", "#277a86"],
  ["civ", "科特迪瓦", "Ivory Coast", "🇨🇮", "CAF", "Group E", "#bf7b1f"],
  ["ecu", "厄瓜多尔", "Ecuador", "🇪🇨", "CONMEBOL", "Group E", "#bf7b1f"],
  ["ned", "荷兰", "Netherlands", "🇳🇱", "UEFA", "Group F", "#bf7b1f"],
  ["jpn", "日本", "Japan", "🇯🇵", "AFC", "Group F", "#b64a3a"],
  ["swe", "瑞典", "Sweden", "🇸🇪", "UEFA", "Group F", "#315f9f"],
  ["tun", "突尼斯", "Tunisia", "🇹🇳", "CAF", "Group F", "#b64a3a"],
  ["bel", "比利时", "Belgium", "🇧🇪", "UEFA", "Group G", "#bf7b1f"],
  ["egy", "埃及", "Egypt", "🇪🇬", "CAF", "Group G", "#7b2f35"],
  ["irn", "伊朗", "Iran", "🇮🇷", "AFC", "Group G", "#1f7a4d"],
  ["nzl", "新西兰", "New Zealand", "🇳🇿", "OFC", "Group G", "#3d3d3d"],
  ["esp", "西班牙", "Spain", "🇪🇸", "UEFA", "Group H", "#bf7b1f"],
  ["cpv", "佛得角", "Cape Verde", "🇨🇻", "CAF", "Group H", "#277a86"],
  ["ksa", "沙特阿拉伯", "Saudi Arabia", "🇸🇦", "AFC", "Group H", "#1f7a4d"],
  ["uru", "乌拉圭", "Uruguay", "🇺🇾", "CONMEBOL", "Group H", "#315f9f"],
  ["fra", "法国", "France", "🇫🇷", "UEFA", "Group I", "#315f9f"],
  ["sen", "塞内加尔", "Senegal", "🇸🇳", "CAF", "Group I", "#1f7a4d"],
  ["irq", "伊拉克", "Iraq", "🇮🇶", "AFC", "Group I", "#7b2f35"],
  ["nor", "挪威", "Norway", "🇳🇴", "UEFA", "Group I", "#315f9f"],
  ["arg", "阿根廷", "Argentina", "🇦🇷", "CONMEBOL", "Group J", "#2f79b7"],
  ["alg", "阿尔及利亚", "Algeria", "🇩🇿", "CAF", "Group J", "#1f7a4d"],
  ["aut", "奥地利", "Austria", "🇦🇹", "UEFA", "Group J", "#b64a3a"],
  ["jor", "约旦", "Jordan", "🇯🇴", "AFC", "Group J", "#7b2f35"],
  ["por", "葡萄牙", "Portugal", "🇵🇹", "UEFA", "Group K", "#7b2f35"],
  ["cod", "刚果民主共和国", "DR Congo", "🇨🇩", "CAF", "Group K", "#277a86"],
  ["uzb", "乌兹别克斯坦", "Uzbekistan", "🇺🇿", "AFC", "Group K", "#277a86"],
  ["col", "哥伦比亚", "Colombia", "🇨🇴", "CONMEBOL", "Group K", "#bf7b1f"],
  ["eng", "英格兰", "England", "\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}", "UEFA", "Group L", "#7b2f35"],
  ["cro", "克罗地亚", "Croatia", "🇭🇷", "UEFA", "Group L", "#315f9f"],
  ["gha", "加纳", "Ghana", "🇬🇭", "CAF", "Group L", "#bf7b1f"],
  ["pan", "巴拿马", "Panama", "🇵🇦", "CONCACAF", "Group L", "#b64a3a"]
];

const COEFFICIENT_STORAGE_KEY = "worldCupStrengthCoefficients";
const STAGE_LOAD_STORAGE_KEY = "worldCupStrengthStageLoad";

const scoreComponentConfig = [
  ["squadQuality", "阵容质量", 45, "#1f7a4d"],
  ["recentMatchRating", "近期比赛强度", 30, "#315f9f"],
  ["positionalBalance", "位置平衡", 10, "#bf7b1f"],
  ["squadDepth", "阵容深度", 8, "#277a86"],
  ["cohesionContinuity", "协同连续性", 4, "#7b2f35"],
  ["ageLoad", "年龄/赛程耐久", 3, "#b64a3a"]
];

// 两队对比弹窗按四个维度展开（与详情页分区标题一致）
const dimensionConfig = [
  ["environment", "竞技环境", "", "#1f7a4d"],
  ["performance", "近期表现", "", "#315f9f"],
  ["cohesion", "协同经验", "", "#7b2f35"],
  ["age", "年龄结构", "", "#b64a3a"]
];

const tournamentStageConfig = [
  ["group", "小组赛", 1],
  ["round32", "32强", 1.35],
  ["round16", "16强", 1.7],
  ["quarterfinal", "八强", 2.05],
  ["semifinal", "四强", 2.4],
  ["final", "决赛", 3]
];

const ELITE_CLUB_PATTERNS = [
  "real madrid",
  "manchester city",
  "bayern munchen",
  "fc bayern",
  "barcelona",
  "liverpool",
  "arsenal",
  "chelsea",
  "manchester united",
  "atletico de madrid",
  "paris saint germain",
  "psg",
  "internazionale",
  "inter milan",
  "ac milan",
  "juventus",
  "borussia dortmund"
];

// 实时数据走同源 /api 代理（server.js 转发到 football-data.org 并在服务端附加 token）。
// 这样浏览器不受 CORS 限制，token 也不暴露在前端源码里。
// file:// 直接打开页面时无代理可用，自动降级为本地数据。
const LINEUP_API = {
  baseUrl: "/api/v4",
  competition: "WC",
  timeoutMs: 8000,
  cachePrefix: "lineupCache:",
  get available() {
    return window.location.protocol === "http:" || window.location.protocol === "https:";
  }
};

const publicData = loadPublicData();

const appState = {
  teams: loadTeams(),
  coefficients: loadCoefficientConfig(),
  stageLoadMode: loadStageLoadMode(),
  publicData,
  publicPerformance: buildPublicPerformanceIndex(publicData?.recentResults),
  selectedId: null,
  query: "",
  sortMode: "rank",
  view: "strength",
  scheduleMode: "recent",
  scheduleQuery: "",
  scheduleGroup: "all",
  liveSchedule: null,
  liveScheduleLoading: false,
  liveScheduleAttempted: false
};

const els = {
  liveBanner: document.querySelector("#liveBanner"),
  detailPanel: document.querySelector("#detailPanel"),
  sheetHandle: document.querySelector("#sheetHandle"),
  strengthNav: document.querySelector("#strengthNav"),
  scheduleNav: document.querySelector("#scheduleNav"),
  strengthControls: document.querySelector("#strengthControls"),
  strengthView: document.querySelector("#strengthView"),
  scheduleView: document.querySelector("#scheduleView"),
  teamList: document.querySelector("#teamList"),
  teamCount: document.querySelector("#teamCount"),
  teamSearch: document.querySelector("#teamSearch"),
  sortMode: document.querySelector("#sortMode"),
  teamBadge: document.querySelector("#teamBadge"),
  teamConfed: document.querySelector("#teamConfed"),
  teamName: document.querySelector("#teamName"),
  teamMeta: document.querySelector("#teamMeta"),
  teamRank: document.querySelector("#teamRank"),
  finalScore: document.querySelector("#finalScore"),
  strengthTier: document.querySelector("#strengthTier"),
  baseScore: document.querySelector("#baseScore"),
  balanceAdjustment: document.querySelector("#balanceAdjustment"),
  availabilityAdjustment: document.querySelector("#availabilityAdjustment"),
  squadVersion: document.querySelector("#squadVersion"),
  performanceSource: document.querySelector("#performanceSource"),
  coefficientControls: document.querySelector("#coefficientControls"),
  coefficientTotal: document.querySelector("#coefficientTotal"),
  resetCoefficients: document.querySelector("#resetCoefficients"),
  stageLoadMode: document.querySelector("#stageLoadMode"),
  stageLoadHint: document.querySelector("#stageLoadHint"),
  dimensionBars: document.querySelector("#dimensionBars"),
  environmentBreakdown: document.querySelector("#environmentBreakdown"),
  performanceBreakdown: document.querySelector("#performanceBreakdown"),
  ageNote: document.querySelector("#ageNote"),
  ageProfile: document.querySelector("#ageProfile"),
  cohesionBreakdown: document.querySelector("#cohesionBreakdown"),
  playerCount: document.querySelector("#playerCount"),
  playerTable: document.querySelector("#playerTable"),
  lineupDialog: document.querySelector("#lineupDialog"),
  lineupTitle: document.querySelector("#lineupTitle"),
  lineupMeta: document.querySelector("#lineupMeta"),
  lineupGrid: document.querySelector("#lineupGrid"),
  closeLineup: document.querySelector("#closeLineup"),
  compareDialog: document.querySelector("#compareDialog"),
  compareMeta: document.querySelector("#compareMeta"),
  compareTitle: document.querySelector("#compareTitle"),
  compareBody: document.querySelector("#compareBody"),
  closeCompare: document.querySelector("#closeCompare"),
  recentScheduleMode: document.querySelector("#recentScheduleMode"),
  fullScheduleMode: document.querySelector("#fullScheduleMode"),
  scheduleSearch: document.querySelector("#scheduleSearch"),
  scheduleGroup: document.querySelector("#scheduleGroup"),
  scheduleUpdated: document.querySelector("#scheduleUpdated"),
  scheduleTitle: document.querySelector("#scheduleTitle"),
  scheduleCount: document.querySelector("#scheduleCount"),
  scheduleList: document.querySelector("#scheduleList")
};

init();

function getDefaultCoefficientConfig() {
  return Object.fromEntries(scoreComponentConfig.map(([key, , defaultWeight]) => [key, defaultWeight]));
}

function loadCoefficientConfig() {
  const fallback = getDefaultCoefficientConfig();
  try {
    const stored = JSON.parse(localStorage.getItem(COEFFICIENT_STORAGE_KEY));
    if (!stored || typeof stored !== "object") return fallback;
    return Object.fromEntries(
      scoreComponentConfig.map(([key]) => {
        const value = Number(stored[key]);
        return [key, Number.isFinite(value) ? clamp(value) : fallback[key]];
      })
    );
  } catch {
    return fallback;
  }
}

function saveCoefficientConfig(coefficients) {
  try {
    localStorage.setItem(COEFFICIENT_STORAGE_KEY, JSON.stringify(coefficients));
  } catch {
    // localStorage 不可用时保留当前会话设置
  }
}

function getCoefficientTotal(coefficients) {
  return scoreComponentConfig.reduce((sum, [key]) => sum + Number(coefficients[key] ?? 0), 0);
}

function getActiveCoefficientConfig() {
  return getCoefficientTotal(appState.coefficients) > 0 ? appState.coefficients : getDefaultCoefficientConfig();
}

function getDefaultStageLoadMode() {
  return tournamentStageConfig[0][0];
}

function getStageLoadConfig(mode = appState.stageLoadMode) {
  const found = tournamentStageConfig.find(([key]) => key === mode);
  const [key, label, ageMultiplier] = found ?? tournamentStageConfig[0];
  return { key, label, ageMultiplier };
}

function loadStageLoadMode() {
  try {
    const stored = localStorage.getItem(STAGE_LOAD_STORAGE_KEY);
    return tournamentStageConfig.some(([key]) => key === stored) ? stored : getDefaultStageLoadMode();
  } catch {
    return getDefaultStageLoadMode();
  }
}

function saveStageLoadMode(mode) {
  try {
    localStorage.setItem(STAGE_LOAD_STORAGE_KEY, mode);
  } catch {
    // localStorage 不可用时保留当前会话设置
  }
}

function getEffectiveCoefficients(coefficients) {
  const base = Object.fromEntries(
    scoreComponentConfig.map(([key]) => [key, Math.max(0, Number(coefficients[key] ?? 0))])
  );
  const total = getCoefficientTotal(base);
  if (total <= 0) return getDefaultCoefficientConfig();

  const { ageMultiplier } = getStageLoadConfig();
  const currentAge = Number(base.ageLoad ?? 0);
  const requestedAge = currentAge * ageMultiplier;
  const ageCap = Math.max(currentAge, total * 0.16);
  const targetAge = Math.min(total, requestedAge, ageCap);
  const delta = Math.max(0, targetAge - currentAge);
  const otherKeys = scoreComponentConfig.map(([key]) => key).filter((key) => key !== "ageLoad");
  const otherTotal = otherKeys.reduce((sum, key) => sum + Number(base[key] ?? 0), 0);
  if (!delta || otherTotal <= 0) return base;

  const scale = Math.max(0, (otherTotal - delta) / otherTotal);
  const adjusted = { ...base, ageLoad: targetAge };
  otherKeys.forEach((key) => {
    adjusted[key] = Number(base[key] ?? 0) * scale;
  });
  return adjusted;
}

function formatCoefficient(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "0";
  return Number.isInteger(number) ? String(number) : number.toFixed(1);
}

function init() {
  appState.teams = normalizeTeams(appState.teams);
  appState.selectedId = appState.teams[0]?.id ?? null;
  renderScheduleGroupOptions();
  bindEvents();
  bindSheetDrag();
  render();
  loadLiveSchedule();
}

// ---- 移动端评分详情底部浮层 ----

function isNarrowScreen() {
  return window.matchMedia("(max-width: 980px)").matches;
}

function setSheetExpanded(expanded) {
  appState.sheetExpanded = Boolean(expanded);
  els.detailPanel.classList.toggle("expanded", appState.sheetExpanded);
  if (!appState.sheetExpanded) {
    els.detailPanel.scrollTop = 0;
  }
}

function bindSheetDrag() {
  if (!els.sheetHandle || !els.detailPanel) return;

  let dragging = false;
  let startY = 0;
  let baseOffset = 0;

  const peekOffset = () => els.detailPanel.getBoundingClientRect().height - 148;

  els.sheetHandle.addEventListener("pointerdown", (event) => {
    if (!isNarrowScreen()) return;
    dragging = true;
    startY = event.clientY;
    baseOffset = appState.sheetExpanded ? 0 : peekOffset();
    els.detailPanel.classList.add("dragging");
    els.sheetHandle.setPointerCapture(event.pointerId);
  });

  els.sheetHandle.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    const delta = event.clientY - startY;
    const offset = Math.min(peekOffset(), Math.max(0, baseOffset + delta));
    els.detailPanel.style.transform = `translateY(${offset}px)`;
  });

  const finishDrag = (event) => {
    if (!dragging) return;
    dragging = false;
    els.detailPanel.classList.remove("dragging");
    els.detailPanel.style.transform = "";
    const delta = event.clientY - startY;
    if (Math.abs(delta) < 10) {
      // 视为点击：切换展开/收起
      setSheetExpanded(!appState.sheetExpanded);
    } else {
      // 向上拖展开，向下拖收起
      setSheetExpanded(delta < 0);
    }
  };

  els.sheetHandle.addEventListener("pointerup", finishDrag);
  els.sheetHandle.addEventListener("pointercancel", finishDrag);
}

function bindEvents() {
  els.strengthNav.addEventListener("click", () => setActiveView("strength"));
  els.scheduleNav.addEventListener("click", () => setActiveView("schedule"));

  els.teamSearch.addEventListener("input", (event) => {
    appState.query = event.target.value.trim().toLowerCase();
    renderTeamList();
  });

  els.sortMode.addEventListener("change", (event) => {
    appState.sortMode = event.target.value;
    renderTeamList();
  });

  els.coefficientControls.addEventListener("change", (event) => {
    const input = event.target.closest("[data-coefficient-key]");
    if (!input) return;
    const key = input.dataset.coefficientKey;
    appState.coefficients[key] = clamp(Number(input.value));
    saveCoefficientConfig(appState.coefficients);
    refreshTeamScores();
    render();
  });

  els.stageLoadMode.addEventListener("change", (event) => {
    appState.stageLoadMode = event.target.value;
    saveStageLoadMode(appState.stageLoadMode);
    refreshTeamScores();
    render();
  });

  els.resetCoefficients.addEventListener("click", () => {
    appState.coefficients = getDefaultCoefficientConfig();
    saveCoefficientConfig(appState.coefficients);
    refreshTeamScores();
    render();
  });

  els.squadVersion.addEventListener("click", () => {
    const team = getSelectedTeam();
    if (team) openLineup(team);
  });

  els.closeLineup.addEventListener("click", () => {
    els.lineupDialog.close();
  });

  els.lineupDialog.addEventListener("click", (event) => {
    if (event.target === els.lineupDialog) {
      els.lineupDialog.close();
    }
  });

  els.closeCompare.addEventListener("click", () => {
    els.compareDialog.close();
  });

  els.compareDialog.addEventListener("click", (event) => {
    if (event.target === els.compareDialog) {
      els.compareDialog.close();
    }
  });

  els.recentScheduleMode.addEventListener("click", () => setScheduleMode("recent"));
  els.fullScheduleMode.addEventListener("click", () => setScheduleMode("full"));

  els.scheduleSearch.addEventListener("input", (event) => {
    appState.scheduleQuery = event.target.value.trim().toLowerCase();
    renderSchedule();
  });

  els.scheduleGroup.addEventListener("change", (event) => {
    appState.scheduleGroup = event.target.value;
    renderSchedule();
  });
}

function render() {
  renderActiveView();
  renderLiveBanner();
  renderTeamList();
  renderDetail();
  renderSchedule();
  renderEmoji();
}

function setActiveView(view) {
  appState.view = view;
  renderActiveView();
  if (view === "schedule" && !appState.liveScheduleAttempted) {
    loadLiveSchedule();
  }
}

async function loadLiveSchedule() {
  if (!LINEUP_API.available || appState.liveScheduleLoading) return;
  appState.liveScheduleAttempted = true;
  appState.liveScheduleLoading = true;
  try {
    const data = await lineupApiGet(`/competitions/${LINEUP_API.competition}/matches`);
    if (data?.matches?.length) {
      appState.liveSchedule = {
        source: "live",
        fetchedAt: new Date().toISOString(),
        matches: data.matches
      };
      try {
        localStorage.setItem("wcScheduleCache", JSON.stringify(appState.liveSchedule));
      } catch {
        // 忽略缓存写入失败
      }
    }
  } catch {
    // 实时获取失败：尝试缓存，再不行就继续用本地 JSON
    try {
      const cached = JSON.parse(localStorage.getItem("wcScheduleCache"));
      if (cached?.matches?.length) {
        appState.liveSchedule = { ...cached, source: "cache" };
      }
    } catch {
      // 缓存也不可用
    }
  } finally {
    appState.liveScheduleLoading = false;
    renderSchedule();
    renderLiveBanner();

    // 自适应轮询：根据当前比赛状态动态决定下次刷新间隔，
    // 保证“即将开赛 → 进行中”的状态翻转及比分变化都能被及时拉到。
    clearTimeout(appState.livePollTimer);
    const nextPollDelay = getLivePollDelay();
    if (nextPollDelay) {
      appState.livePollTimer = setTimeout(loadLiveSchedule, nextPollDelay);
    }
  }
}

// 轮询节奏：
// - 有比赛进行中/中场 → 30s，尽量贴近实时比分
// - 今日有即将开赛或刚结束的比赛 → 60s，及时翻转状态
// - 其余情况 → 10 分钟心跳，等待新一天的比赛进入临场窗口
function getLivePollDelay() {
  if (!LINEUP_API.available) return 0;
  const today = beijingParts(new Date().toISOString())?.date;
  const matches = (appState.liveSchedule?.matches ?? []).map(liveMatchToLocal);
  const hasLive = matches.some((match) => ["IN_PLAY", "PAUSED"].includes(match.status));
  if (hasLive) return 30000;
  const activeToday = matches.some(
    (match) => match.date === today && ["SCHEDULED", "TIMED", "FINISHED"].includes(match.status)
  );
  if (activeToday) return 60000;
  return 600000;
}

function renderLiveBanner() {
  if (!els.liveBanner) return;
  const featuredMatches = getFeaturedBannerMatches();

  if (!featuredMatches.length) {
    els.liveBanner.hidden = true;
    els.liveBanner.replaceChildren();
    return;
  }

  els.liveBanner.hidden = false;
  els.liveBanner.replaceChildren();

  featuredMatches.forEach((local) => {
    const teamA = findTeamByName(local.team1);
    const teamB = findTeamByName(local.team2);
    const stageText = [local.round, local.group].filter(Boolean).join(" · ");
    const bannerStatus = getBannerMatchStatus(local);

    let predictText = "暂无模型评分";
    if (teamA && teamB) {
      const favored = teamA.finalScore >= teamB.finalScore ? teamA : teamB;
      predictText = `模型预测 ${formatScore(teamA.finalScore)} : ${formatScore(teamB.finalScore)} · 看好 ${favored.name}`;
    }

    const card = document.createElement("button");
    card.type = "button";
    card.className = `live-match-card ${bannerStatus.className}`;
    card.innerHTML = `
      <span class="live-status">
        <span class="live-dot" aria-hidden="true"></span>
        ${escapeHtml(bannerStatus.label)}
      </span>
      <span class="live-teams">
        <strong>${escapeHtml(formatTeamName(local.team1))}</strong>
        <span class="live-score">${escapeHtml(local.liveScore ?? "vs")}</span>
        <strong>${escapeHtml(formatTeamName(local.team2))}</strong>
      </span>
      <span class="live-meta">${escapeHtml([local.date, local.time, stageText || "世界杯"].filter(Boolean).join(" · "))}</span>
      <span class="live-predict">${escapeHtml(predictText)}</span>
    `;

    if (teamA && teamB) {
      card.title = "点击查看两队实力对比";
      card.addEventListener("click", () =>
        openCompare(teamA, teamB, {
          date: local.date,
          time: local.time,
          meta: [bannerStatus.label, stageText].filter(Boolean).join(" · ")
        })
      );
    }

    els.liveBanner.append(card);
  });

  renderEmoji();
}

function getFeaturedBannerMatches() {
  const today = beijingParts(new Date().toISOString())?.date;
  const liveSource = appState.liveSchedule?.matches?.length
    ? appState.liveSchedule.matches.map(liveMatchToLocal)
    : [];
  const localSource = getWorldCupMatches()
    .map((match) => {
      const kickoff = match.beijing
        ? { date: match.date, time: match.time }
        : localKickoffToBeijing(match.date, match.time);
      return {
        ...match,
        beijing: true,
        date: kickoff?.date ?? match.date ?? "--",
        time: kickoff?.time ?? match.time ?? "--",
        status: match.status ?? "SCHEDULED",
        liveScore: match.liveScore ?? null
      };
    });
  const source = liveSource.length ? liveSource : localSource;
  const liveMatches = source.filter((match) => ["IN_PLAY", "PAUSED"].includes(match.status));
  const finishedToday = source.filter((match) => match.status === "FINISHED" && match.date === today);
  const upcoming = source
    .filter((match) => ["SCHEDULED", "TIMED"].includes(match.status))
    .filter((match) => !today || match.date >= today)
    .sort(compareBannerKickoff);

  const upcomingToday = upcoming.filter((match) => match.date === today);
  const upcomingVisible = upcomingToday.length ? upcomingToday : upcoming.slice(0, Math.max(0, 3 - liveMatches.length));

  return [...liveMatches, ...upcomingVisible, ...finishedToday]
    .sort((a, b) => {
      const priority = { IN_PLAY: 0, PAUSED: 0, TIMED: 1, SCHEDULED: 1, FINISHED: 2 };
      const priorityDiff = (priority[a.status] ?? 9) - (priority[b.status] ?? 9);
      if (priorityDiff) return priorityDiff;
      return compareBannerKickoff(a, b);
    })
    .slice(0, 6);
}

function compareBannerKickoff(a, b) {
  return `${a.date ?? ""} ${a.time ?? ""}`.localeCompare(`${b.date ?? ""} ${b.time ?? ""}`);
}

function getBannerMatchStatus(match) {
  if (match.status === "PAUSED") return { label: "中场休息", className: "is-live" };
  if (match.status === "IN_PLAY") return { label: "比赛进行中", className: "is-live" };
  if (match.status === "FINISHED") return { label: "今日赛果", className: "is-finished" };
  return { label: "即将开赛", className: "is-upcoming" };
}

function liveMatchToLocal(match) {
  const utc = String(match.utcDate ?? "");
  const fullTime = match.score?.fullTime;
  const hasScore = fullTime && fullTime.home !== null && fullTime.home !== undefined;
  const stageNames = {
    GROUP_STAGE: "小组赛",
    LAST_32: "1/16决赛",
    LAST_16: "1/8决赛",
    QUARTER_FINALS: "1/4决赛",
    SEMI_FINALS: "半决赛",
    THIRD_PLACE: "季军赛",
    FINAL: "决赛"
  };
  const beijing = beijingParts(utc);
  return {
    beijing: true,
    date: beijing?.date ?? utc.slice(0, 10),
    time: beijing?.time ?? "--",
    team1: match.homeTeam?.name ?? "--",
    team2: match.awayTeam?.name ?? "--",
    round: stageNames[match.stage] ?? match.stage ?? "",
    group: match.group ? match.group.replace("GROUP_", "Group ") : "",
    ground: match.venue ?? "",
    liveScore: hasScore ? `${fullTime.home} : ${fullTime.away}` : null,
    status: match.status ?? ""
  };
}

function renderActiveView() {
  const isSchedule = appState.view === "schedule";
  els.strengthNav.classList.toggle("active", !isSchedule);
  els.scheduleNav.classList.toggle("active", isSchedule);
  els.strengthView.classList.toggle("active", !isSchedule);
  els.scheduleView.classList.toggle("active", isSchedule);
  els.strengthControls.hidden = isSchedule;
}

function setScheduleMode(mode) {
  appState.scheduleMode = mode;
  els.recentScheduleMode.classList.toggle("active", mode === "recent");
  els.fullScheduleMode.classList.toggle("active", mode === "full");
  renderSchedule();
}

function renderTeamList() {
  const teams = getVisibleTeams();
  els.teamCount.textContent = String(teams.length);
  els.teamList.replaceChildren();

  if (!teams.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "没有匹配队伍";
    els.teamList.append(empty);
    return;
  }

  const template = document.querySelector("#teamButtonTemplate");
  teams.forEach((team) => {
    const button = template.content.firstElementChild.cloneNode(true);
    button.classList.toggle("active", team.id === appState.selectedId);
    button.querySelector(".mini-badge").textContent = `${team.flag} ${team.name}`;
    button.querySelector("strong").textContent = team.nameEn;
    button.querySelector("small").textContent = `${team.confederation} · ${getTier(team.finalScore)}`;
    button.querySelector(".team-score").textContent = formatScore(team.finalScore);
    button.addEventListener("click", () => {
      appState.selectedId = team.id;
      render();
      // 窄屏下选中队伍后弹出底部浮层页首
      if (isNarrowScreen()) {
        els.detailPanel.scrollTop = 0;
        setSheetExpanded(false);
      }
    });
    els.teamList.append(button);
  });
}

function renderDetail() {
  const teams = rankTeams(appState.teams);
  const team = teams.find((item) => item.id === appState.selectedId) ?? teams[0];
  if (!team) return;

  appState.selectedId = team.id;
  els.teamBadge.textContent = `${team.flag} ${team.name}`;
  els.teamConfed.textContent = team.confederation;
  els.teamName.textContent = `${team.name} · ${team.nameEn}`;
  els.teamMeta.textContent = `${team.squadVersion.status} · ${team.squadVersion.date}`;
  els.teamRank.textContent = `#${team.rank}`;
  els.finalScore.textContent = formatScore(team.finalScore);
  els.strengthTier.textContent = getTier(team.finalScore);
  els.baseScore.textContent = formatScore(team.baseScore);
  els.balanceAdjustment.textContent = formatScore(team.scoreComponents.positionalBalance);
  els.availabilityAdjustment.textContent = `${Math.round(team.availabilityAdjustment * 100)}%`;
  els.squadVersion.textContent = team.squadVersion.status;
  els.performanceSource.textContent = team.publicPerformance
    ? `${team.publicPerformance.matches} 场公开比赛`
    : "样例输入";

  renderDimensionBars(team);
  renderCoefficientControls();
  renderBreakdown(els.environmentBreakdown, [
    ["联赛强度", team.environmentBreakdown.leagueStrength],
    ["俱乐部竞争力", team.environmentBreakdown.clubCompetitiveness],
    ["俱乐部角色稳定性", team.environmentBreakdown.roleStability]
  ]);
  renderBreakdown(els.performanceBreakdown, [
    ["正式比赛结果", team.performanceBreakdown.officialResults],
    ["正式比赛攻防", team.performanceBreakdown.officialGoalProfile],
    ["强队交手表现", team.performanceBreakdown.strongOpponent],
    ["公开数据匹配", team.publicPerformance ? "已接入" : "未匹配"]
  ]);
  renderBreakdown(els.cohesionBreakdown, [
    ["国家队共同出场", team.cohesionBreakdown.nationalTeam],
    ["同俱乐部共同出场", team.cohesionBreakdown.club],
    ["青训/历史经历", team.cohesionBreakdown.historical]
  ]);
  renderAgeProfile(team);
  renderPlayers(team);
}

function getSelectedTeam() {
  const teams = rankTeams(appState.teams);
  return teams.find((item) => item.id === appState.selectedId) ?? teams[0] ?? null;
}

async function openLineup(team) {
  els.lineupTitle.textContent = `${team.name} · 首发阵容`;
  setLineupMeta(team, LINEUP_API.available ? "本地预测 · 正在尝试获取实时名单…" : "本地预测");
  renderLineupGrid(team.startingXI);

  if (typeof els.lineupDialog.showModal === "function") {
    els.lineupDialog.showModal();
  } else {
    els.lineupDialog.setAttribute("open", "");
  }

  if (!LINEUP_API.available) return;

  const live = await tryLiveLineup(team);
  if (!els.lineupDialog.open) return;

  if (live) {
    renderLineupGrid(live);
    setLineupMeta(team, "实时名单 · football-data.org");
    saveLineupCache(team.id, live);
    return;
  }

  const cached = readLineupCache(team.id);
  if (cached?.lineup?.length) {
    renderLineupGrid(cached.lineup);
    setLineupMeta(team, `缓存名单 · ${formatGeneratedAt(cached.savedAt)}`);
  } else {
    setLineupMeta(team, "本地预测（实时名单暂不可用）");
  }
}

function setLineupMeta(team, sourceLabel) {
  els.lineupMeta.textContent = `${team.squadVersion.status} · ${team.squadVersion.date} · ${sourceLabel}`;
}

function renderLineupGrid(lineup) {
  els.lineupGrid.replaceChildren();
  lineup.forEach((item) => {
    const card = document.createElement("div");
    card.className = `lineup-card${item.placeholder ? " placeholder" : ""}`;
    const details = [item.nameEn, item.clubEn || item.note || "待补充公开名单数据"].filter(Boolean).join(" · ");
    card.innerHTML = `
      <span>${escapeHtml(item.position)}</span>
      <strong>${escapeHtml(item.name)}</strong>
      <small>${escapeHtml(details)}</small>
    `;
    els.lineupGrid.append(card);
  });
}

async function tryLiveLineup(team) {
  try {
    const fixtures = await lineupApiGet(`/competitions/${LINEUP_API.competition}/matches`);
    const candidates = (fixtures.matches ?? [])
      .filter((match) => matchInvolvesTeam(match, team))
      .filter((match) => ["IN_PLAY", "PAUSED", "FINISHED"].includes(match.status))
      .sort((a, b) => String(b.utcDate).localeCompare(String(a.utcDate)));

    for (const match of candidates.slice(0, 2)) {
      const detail = await lineupApiGet(`/matches/${match.id}`);
      const side = pickTeamSide(detail, team);
      const lineup = side?.lineup ?? [];
      if (lineup.length >= 11) {
        return lineup.slice(0, 11).map((player) => ({
          position: translateLineupPosition(player.position),
          name: player.name ?? "未知",
          nameEn: player.name ?? "",
          clubEn: "",
          note: "实时名单",
          placeholder: false
        }));
      }
    }
  } catch {
    // 网络失败 / 限流 / 无权限：交给调用方降级处理
  }
  return null;
}

async function lineupApiGet(path) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), LINEUP_API.timeoutMs);
  try {
    const response = await fetch(`${LINEUP_API.baseUrl}${path}`, {
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

function matchInvolvesTeam(match, team) {
  const key = normalizeTeamKey(team.nameEn);
  return (
    normalizeTeamKey(match.homeTeam?.name) === key ||
    normalizeTeamKey(match.awayTeam?.name) === key
  );
}

function pickTeamSide(matchDetail, team) {
  const key = normalizeTeamKey(team.nameEn);
  if (normalizeTeamKey(matchDetail.homeTeam?.name) === key) return matchDetail.homeTeam;
  if (normalizeTeamKey(matchDetail.awayTeam?.name) === key) return matchDetail.awayTeam;
  return null;
}

function translateLineupPosition(position) {
  const map = {
    Goalkeeper: "门将",
    "Centre-Back": "中卫",
    "Left-Back": "左后卫",
    "Right-Back": "右后卫",
    Defence: "后卫",
    "Defensive Midfield": "后腰",
    "Central Midfield": "中场",
    "Attacking Midfield": "前腰",
    Midfield: "中场",
    "Left Winger": "左边锋",
    "Right Winger": "右边锋",
    "Centre-Forward": "中锋",
    Offence: "前锋"
  };
  return map[position] ?? (position || "位置待定");
}

function saveLineupCache(teamId, lineup) {
  try {
    localStorage.setItem(
      `${LINEUP_API.cachePrefix}${teamId}`,
      JSON.stringify({ savedAt: new Date().toISOString(), lineup })
    );
  } catch {
    // localStorage 不可用时忽略缓存
  }
}

function readLineupCache(teamId) {
  try {
    const raw = localStorage.getItem(`${LINEUP_API.cachePrefix}${teamId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function renderDimensionBars(team) {
  els.dimensionBars.replaceChildren();
  const effectiveCoefficients = getEffectiveCoefficients(getActiveCoefficientConfig());
  scoreComponentConfig.forEach(([key, label, , color]) => {
    const score = team.scoreComponents[key];
    const weight = `${formatCoefficient(effectiveCoefficients[key])}%`;
    const row = document.createElement("div");
    row.className = "dimension-row";
    row.innerHTML = `
      <div class="dimension-label">
        <strong>${label}</strong>
        <small>权重 ${weight}</small>
      </div>
      <div class="bar-track" aria-hidden="true">
        <div class="bar-fill" style="width: ${clamp(score)}%; --bar-color: ${color}"></div>
      </div>
      <div class="dimension-value">${formatScore(score)}</div>
    `;
    els.dimensionBars.append(row);
  });
}

function renderCoefficientControls() {
  const total = getCoefficientTotal(appState.coefficients);
  const effectiveCoefficients = getEffectiveCoefficients(getActiveCoefficientConfig());
  els.coefficientTotal.textContent = `系数合计 ${formatCoefficient(total)}%`;
  els.stageLoadMode.value = getStageLoadConfig().key;
  els.stageLoadHint.textContent = `年龄有效 ${formatCoefficient(effectiveCoefficients.ageLoad)}%`;
  els.coefficientControls.replaceChildren();

  scoreComponentConfig.forEach(([key, label]) => {
    const row = document.createElement("label");
    row.className = "coefficient-row";
    row.innerHTML = `
      <span>${label}</span>
      <input type="number" min="0" max="100" step="1" value="${formatCoefficient(appState.coefficients[key])}" data-coefficient-key="${key}" />
      <small>%</small>
    `;
    els.coefficientControls.append(row);
  });
}

function renderBreakdown(container, rows) {
  container.replaceChildren();
  rows.forEach(([label, value]) => {
    const row = document.createElement("div");
    row.className = "breakdown-row";
    const displayValue = Number.isFinite(Number(value)) ? formatScore(value) : String(value);
    row.innerHTML = `
      <span>${label}</span>
      <strong>${displayValue}</strong>
    `;
    container.append(row);
  });
}

function renderScheduleGroupOptions() {
  const groups = getWorldCupMatches()
    .map((match) => match.group)
    .filter(Boolean)
    .filter((group, index, list) => list.indexOf(group) === index)
    .sort((a, b) => a.localeCompare(b));

  groups.forEach((group) => {
    const option = document.createElement("option");
    option.value = group;
    option.textContent = group.replace("Group ", "小组 ");
    els.scheduleGroup.append(option);
  });
}

function renderSchedule() {
  const isFull = appState.scheduleMode === "full";
  els.scheduleTitle.textContent = isFull ? "完整赛程" : "近期比赛";
  els.scheduleGroup.disabled = !isFull;
  const updatedAt = appState.liveSchedule?.fetchedAt ?? appState.publicData?.manifest?.generated_at;
  els.scheduleUpdated.textContent = `${formatGeneratedAt(updatedAt)} · ${getScheduleSourceLabel()}`;

  const rows = isFull ? getFullScheduleRows() : getRecentMatchRows();
  const filtered = rows.filter(matchMatchesScheduleFilters);
  const visible = isFull ? filtered : filtered.slice(0, 80);

  els.scheduleCount.textContent = isFull
    ? `${filtered.length} 场`
    : `${visible.length}/${filtered.length} 场`;
  els.scheduleList.replaceChildren();

  if (!visible.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = appState.publicData ? "没有匹配比赛" : "未加载公开比赛数据";
    els.scheduleList.append(empty);
    return;
  }

  visible.forEach((match) => {
    const row = document.createElement("article");
    row.className = "match-row";
    row.innerHTML = `
      <div class="match-date">
        <strong>${escapeHtml(match.date)}</strong>
        <span>${escapeHtml(match.time)}</span>
      </div>
      <div class="match-main">
        <div class="match-teams">
          <span>${escapeHtml(formatTeamName(match.team1))}</span>
          <span class="match-score">${escapeHtml(match.score)}</span>
          <span>${escapeHtml(formatTeamName(match.team2))}</span>
        </div>
        <div class="match-meta">${escapeHtml(match.meta)}</div>
      </div>
      <div class="match-side">
        <span class="match-pill">${escapeHtml(match.badge)}</span>
        <span>${escapeHtml(match.place)}</span>
      </div>
    `;

    const teamA = findTeamByName(match.team1);
    const teamB = findTeamByName(match.team2);
    if (teamA && teamB) {
      row.classList.add("clickable");
      row.title = "点击查看两队实力对比";
      row.addEventListener("click", () => openCompare(teamA, teamB, match));
    }

    els.scheduleList.append(row);
  });
}

function findTeamByName(name) {
  const key = normalizeTeamKey(name);
  if (!key || key === "--") return null;
  const ranked = rankTeams(appState.teams);
  return ranked.find((team) => normalizeTeamKey(team.nameEn) === key) ?? null;
}

function openCompare(teamA, teamB, match) {
  const token = (appState.compareToken = (appState.compareToken ?? 0) + 1);

  els.compareTitle.textContent = `${teamA.flag} ${teamA.name} vs ${teamB.flag} ${teamB.name}`;
  els.compareMeta.textContent = [match.date, match.time !== "--" ? match.time : "", match.meta]
    .filter(Boolean)
    .join(" · ");
  els.compareBody.replaceChildren();

  // 评分对比区（实时首发到手后可被重新绘制）
  const scoreSection = document.createElement("div");
  scoreSection.className = "compare-score-section";
  els.compareBody.append(scoreSection);
  renderCompareScores(scoreSection, teamA, teamB, "");

  // 首发阵容对比区（先用本地预测，再异步刷新为实时名单）
  const lineups = buildCompareLineups(teamA, teamB);
  els.compareBody.append(lineups.element);

  renderEmoji();

  if (typeof els.compareDialog.showModal === "function") {
    els.compareDialog.showModal();
  } else {
    els.compareDialog.setAttribute("open", "");
  }

  hydrateCompare(scoreSection, lineups, teamA, teamB, token);
}

function renderCompareScores(container, teamA, teamB, noteText) {
  container.replaceChildren();

  const head = document.createElement("div");
  head.className = "compare-head";
  head.innerHTML = `
    <div class="compare-team">
      <strong>${escapeHtml(teamA.name)}</strong>
      <small>#${teamA.rank} · ${escapeHtml(getTier(teamA.finalScore))}</small>
    </div>
    <div class="compare-score">${formatScore(teamA.finalScore)} : ${formatScore(teamB.finalScore)}</div>
    <div class="compare-team">
      <strong>${escapeHtml(teamB.name)}</strong>
      <small>#${teamB.rank} · ${escapeHtml(getTier(teamB.finalScore))}</small>
    </div>
  `;
  container.append(head);

  if (noteText) {
    const note = document.createElement("div");
    note.className = "compare-adjust-note";
    note.textContent = noteText;
    container.append(note);
  }

  const rows = [
    ["综合得分", teamA.finalScore, teamB.finalScore, "#17202b"],
    ["基础评分", teamA.baseScore, teamB.baseScore, "#3d3d3d"],
    ...dimensionConfig.map(([key, label, weight, color]) => [
      `${label} ${weight}`.trim(),
      teamA.dimensions[key],
      teamB.dimensions[key],
      color
    ])
  ];

  rows.forEach(([label, valueA, valueB, color]) => {
    const row = document.createElement("div");
    row.className = "compare-row";
    const leadA = valueA >= valueB;
    row.innerHTML = `
      <strong class="compare-value-left${leadA ? " lead" : ""}">${formatScore(valueA)}</strong>
      <div class="bar-track left"><div class="bar-fill" style="width: ${clamp(valueA)}%; --bar-color: ${color}"></div></div>
      <span class="compare-label">${escapeHtml(label)}</span>
      <div class="bar-track"><div class="bar-fill" style="width: ${clamp(valueB)}%; --bar-color: ${color}"></div></div>
      <strong${leadA ? "" : ' class="lead"'}>${formatScore(valueB)}</strong>
    `;
    container.append(row);
  });
}

function buildCompareLineups(teamA, teamB) {
  const element = document.createElement("section");
  element.className = "compare-lineups";

  const heading = document.createElement("div");
  heading.className = "section-heading";
  heading.innerHTML = `<h3>首发阵容</h3><span>实时优先 · 不可用回退本地</span>`;
  element.append(heading);

  const grid = document.createElement("div");
  grid.className = "compare-lineup-grid";
  const A = buildCompareLineupColumn(teamA);
  const B = buildCompareLineupColumn(teamB);
  grid.append(A.element, B.element);
  element.append(grid);

  return { element, columns: { A, B } };
}

function buildCompareLineupColumn(team) {
  const element = document.createElement("div");
  element.className = "compare-lineup-col";

  const head = document.createElement("div");
  head.className = "compare-lineup-head";
  head.innerHTML = `<strong>${escapeHtml(`${team.flag} ${team.name}`)}</strong><small></small>`;

  const listEl = document.createElement("ol");
  listEl.className = "compare-lineup-list";

  element.append(head, listEl);

  const col = { element, listEl, metaEl: head.querySelector("small"), team };
  renderCompareLineupList(listEl, team.startingXI ?? []);
  col.metaEl.textContent = "本地预测";
  return col;
}

function renderCompareLineupList(listEl, lineup) {
  listEl.replaceChildren();
  (lineup ?? []).forEach((item) => {
    const li = document.createElement("li");
    li.className = `compare-lineup-item${item.placeholder ? " placeholder" : ""}`;
    li.innerHTML = `
      <span class="cl-pos">${escapeHtml(item.position)}</span>
      <span class="cl-name">${escapeHtml(item.name)}</span>
    `;
    listEl.append(li);
  });
}

// 异步拉两队实时首发：成功则替换显示并按真实首发重算评分，失败回退缓存/本地
async function hydrateCompare(scoreSection, lineups, teamA, teamB, token) {
  if (!LINEUP_API.available) return;

  const [liveA, liveB] = await Promise.all([
    resolveCompareLineup(lineups.columns.A, teamA, token),
    resolveCompareLineup(lineups.columns.B, teamB, token)
  ]);
  if (token !== appState.compareToken || !els.compareDialog.open) return;

  const adjA = liveA ? recomputeWithLineup(teamA, liveA) : null;
  const adjB = liveB ? recomputeWithLineup(teamB, liveB) : null;
  if (!adjA && !adjB) return;

  const noteParts = [
    adjA ? `${teamA.name} 匹配 ${adjA.lineupMatched} 人` : "",
    adjB ? `${teamB.name} 匹配 ${adjB.lineupMatched} 人` : ""
  ].filter(Boolean);
  renderCompareScores(scoreSection, adjA ?? teamA, adjB ?? teamB, `已按实时首发修正评分 · ${noteParts.join(" · ")}`);
  renderEmoji();
}

async function resolveCompareLineup(col, team, token) {
  col.metaEl.textContent = "获取实时名单…";
  let live = null;
  try {
    live = await tryLiveLineup(team);
  } catch {
    live = null;
  }
  if (token !== appState.compareToken || !els.compareDialog.open) return null;

  if (live) {
    renderCompareLineupList(col.listEl, live);
    col.metaEl.textContent = "实时名单";
    saveLineupCache(team.id, live);
    renderEmoji();
    return live;
  }

  const cached = readLineupCache(team.id);
  if (cached?.lineup?.length) {
    renderCompareLineupList(col.listEl, cached.lineup);
    col.metaEl.textContent = "缓存名单";
    renderEmoji();
  } else {
    col.metaEl.textContent = "本地预测";
  }
  return null;
}

// 用实时首发重算评分：把出现在首发名单里的球员权重设为 1，其余降为替补 0.2。
// 保护逻辑：实时名单异常或与模型库匹配过少时返回 null，调用方据此回退到预测评分。
function recomputeWithLineup(team, lineup) {
  const players = Array.isArray(team.players) ? team.players : [];
  if (!players.length) return null;

  const starterKeys = new Set(
    (lineup ?? [])
      .filter((item) => !item.placeholder)
      .map((item) => normalizeTeamKey(item.name))
      .filter(Boolean)
  );
  if (starterKeys.size < 8) return null;

  let matched = 0;
  const adjustedPlayers = players.map((person) => {
    const isStarter =
      starterKeys.has(normalizeTeamKey(person.nameEn)) || starterKeys.has(normalizeTeamKey(person.name));
    if (isStarter) matched += 1;
    return { ...person, appearanceWeight: isStarter ? 1 : 0.2 };
  });

  // 匹配过少说明命名对不上，强行改会把已知主力全判替补，得出离谱评分 → 放弃修正
  if (matched < 8) return null;

  const adjusted = withScores({ ...team, players: adjustedPlayers });
  return { ...adjusted, rank: team.rank, lineupMatched: matched };
}

function getRecentMatchRows() {
  const liveFinished = (appState.liveSchedule?.matches ?? [])
    .filter((match) => ["FINISHED", "IN_PLAY", "PAUSED"].includes(match.status))
    .map(liveMatchToLocal)
    .map((match) => ({
      kind: "recent",
      date: match.date,
      time: match.status === "FINISHED" ? "赛果" : "进行中",
      team1: match.team1,
      team2: match.team2,
      score: match.liveScore ?? "vs",
      meta: ["世界杯", match.round, match.group].filter(Boolean).join(" · "),
      badge: "世界杯",
      group: match.group ?? "",
      place: match.ground || "地点未标注",
      searchText: [match.date, match.team1, match.team2, match.round, match.group, match.ground].join(" ")
    }));

  const localRows = getRecentMatches()
    .map((match) => ({
      kind: "recent",
      date: match.date ?? "--",
      time: "赛果",
      team1: match.home_team ?? "--",
      team2: match.away_team ?? "--",
      score: `${match.home_score ?? "-"} : ${match.away_score ?? "-"}`,
      meta: match.tournament ?? "未标注赛事",
      badge: isFriendly(match) ? "友谊赛" : "正式/杯赛",
      group: "",
      place: [match.city, match.country].filter(Boolean).join(" · ") || "地点未标注",
      searchText: [
        match.date,
        match.home_team,
        match.away_team,
        match.tournament,
        match.city,
        match.country
      ].join(" ")
    }));

  return [...liveFinished, ...localRows].sort((a, b) => b.date.localeCompare(a.date));
}

function getFullScheduleRows() {
  return getWorldCupMatches()
    .map((match) => {
      const beijing = match.beijing
        ? { date: match.date, time: match.time }
        : localKickoffToBeijing(match.date, match.time);
      return { ...match, displayDate: beijing?.date ?? match.date, displayTime: beijing?.time ?? match.time };
    })
    .map((match) => ({
      kind: "full",
      date: match.displayDate ?? "--",
      time: match.displayTime ?? "--",
      team1: match.team1 ?? "--",
      team2: match.team2 ?? "--",
      score: match.liveScore ?? "vs",
      meta: [match.round, match.group].filter(Boolean).join(" · ") || "淘汰赛",
      badge: match.group ? match.group.replace("Group ", "小组 ") : match.round ?? "赛程",
      group: match.group ?? "",
      place: match.ground ?? "场地未标注",
      searchText: [
        match.date,
        match.time,
        match.team1,
        match.team2,
        match.round,
        match.group,
        match.ground
      ].join(" ")
    }))
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
}

function matchMatchesScheduleFilters(match) {
  const query = appState.scheduleQuery;
  const group = appState.scheduleGroup;
  const groupMatches = appState.scheduleMode !== "full" || group === "all" || match.group === group;
  if (!groupMatches) return false;
  if (!query) return true;
  return match.searchText.toLowerCase().includes(query);
}

function getRecentMatches() {
  return appState.publicData?.recentResults?.matches ?? [];
}

function getWorldCupMatches() {
  if (appState.liveSchedule?.matches?.length) {
    return appState.liveSchedule.matches.map(liveMatchToLocal);
  }
  return appState.publicData?.worldCup?.data?.matches ?? [];
}

function getScheduleSourceLabel() {
  if (appState.liveSchedule?.source === "live") return "实时 · football-data.org";
  if (appState.liveSchedule?.source === "cache") return "缓存";
  return "本地数据";
}

function formatTeamName(name) {
  const team = appState.teams.find((item) => normalizeTeamKey(item.nameEn) === normalizeTeamKey(name));
  return team ? `${team.flag} ${team.name}` : String(name ?? "--");
}

// ---- 北京时间 (UTC+8) 显示 ----

function beijingParts(dateLike) {
  const parsed = new Date(dateLike);
  if (Number.isNaN(parsed.getTime())) return null;
  const parts = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).formatToParts(parsed);
  const get = (type) => parts.find((item) => item.type === type)?.value ?? "";
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    time: `${get("hour")}:${get("minute")}`
  };
}

// openfootball 赛程时间格式如 "13:00 UTC-6"，按场馆时区换算成北京时间
function localKickoffToBeijing(dateText, timeText) {
  const match = /^(\d{1,2}):(\d{2})\s*UTC([+-]\d{1,2})$/.exec(String(timeText ?? "").trim());
  if (!match || !dateText) return null;
  const [, hh, mm, offset] = match;
  const sign = offset.startsWith("-") ? "-" : "+";
  const abs = String(Math.abs(Number(offset))).padStart(2, "0");
  return beijingParts(`${dateText}T${hh.padStart(2, "0")}:${mm}:00${sign}${abs}:00`);
}

function formatGeneratedAt(value) {
  const parts = beijingParts(value);
  return parts ? `${parts.date} ${parts.time} 北京时间` : "--";
}

function renderAgeProfile(team) {
  els.ageNote.textContent = team.ageProfile.riskPositions;
  els.ageProfile.replaceChildren();
  [
    ["加权年龄分", formatScore(team.ageProfile.weightedAgeScore)],
    ["黄金年龄占比", `${team.ageProfile.primeShare}%`],
    ["满分区间", "25-28"]
  ].forEach(([label, value]) => {
    const box = document.createElement("div");
    box.className = "age-box";
    box.innerHTML = `<span>${label}</span><strong>${value}</strong>`;
    els.ageProfile.append(box);
  });
}

function shortTier(item) {
  const weight = Number(item.appearanceWeight ?? 0);
  if (weight >= 1) return "主力 1.0";
  if (weight >= 0.55) return "轮换 0.55";
  if (weight > 0) return "替补 0.2";
  return String(item.tier ?? "--");
}

function renderPlayers(team) {
  els.playerCount.textContent = String(team.players.length);
  const rows = team.players
    .map((item) => {
      const statusClass = item.availability === "观察" ? "status-watch" : item.availability === "缺席" ? "status-out" : "";
      return `
        <tr>
          <td>
            <span class="dual-name">
              <strong>${item.name}</strong>
              <small>${item.nameEn}</small>
            </span>
          </td>
          <td>${item.age}</td>
          <td>${item.position}</td>
          <td>${shortTier(item)}</td>
          <td>
            <span class="dual-name">
              <strong>${item.club}</strong>
              <small>${item.clubEn}</small>
            </span>
          </td>
          <td><span class="status-dot ${statusClass}">${item.availability}</span></td>
          <td>${formatScore(item.environmentScore)}</td>
        </tr>
      `;
    })
    .join("");

  const cards = team.players
    .map((item) => {
      const statusClass = item.availability === "观察" ? "status-watch" : item.availability === "缺席" ? "status-out" : "";
      return `
        <article class="player-card">
          <div class="player-card-head">
            <span class="dual-name">
              <strong>${item.name}</strong>
              <small>${item.nameEn}</small>
            </span>
            <span class="player-card-score">${formatScore(item.environmentScore)}</span>
          </div>
          <div class="player-card-meta">
            <span>${item.age}岁 · ${item.position}</span>
            <span class="player-card-tier">${shortTier(item)}</span>
            <span class="status-dot ${statusClass}">${item.availability}</span>
          </div>
          <div class="player-card-club">${item.club} · ${item.clubEn}</div>
        </article>
      `;
    })
    .join("");

  els.playerTable.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>球员</th>
          <th>年龄</th>
          <th>位置</th>
          <th>出场权重</th>
          <th>俱乐部</th>
          <th>可用性</th>
          <th>环境分</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="player-cards">${cards}</div>
  `;
}

function renderEmoji() {
  if (!window.twemoji) return;

  window.twemoji.parse(document.body, {
    folder: "svg",
    ext: ".svg"
  });
}

function loadPublicData() {
  return window.WORLD_CUP_PUBLIC_DATA && typeof window.WORLD_CUP_PUBLIC_DATA === "object"
    ? window.WORLD_CUP_PUBLIC_DATA
    : null;
}

// 近期表现算法：
// 1) 时间衰减：12 个月半衰期，窗口内越近的比赛权重越高
// 2) 迭代 SOS（4 轮）：对手系数（0.6x~1.4x）每轮用上一轮调整后的分数重算，
//    让"对手的对手"的强度跨洲传导，消除预选赛刷弱旅的偏差
// 3) 单场净胜球截断 ±3，防止血洗弱旅刷攻防分
// 4) 小样本收缩：正式比赛少于 10 场时向全体均值收缩
// 5) 强队集合用调整后的积分选取，避免刷分队混入
function buildPublicPerformanceIndex(recentResults) {
  if (!recentResults?.matches?.length) return null;

  const windowEnd = new Date(recentResults.competitive_match_window?.end ?? Date.now());
  const official = recentResults.matches.filter((match) => !isFriendly(match));
  if (!official.length) return null;

  const decayOf = (dateText) => {
    const matchDate = new Date(dateText);
    if (Number.isNaN(matchDate.getTime())) return 0.5;
    const months = Math.max(0, (windowEnd - matchDate) / (1000 * 60 * 60 * 24 * 30.44));
    return Math.pow(0.5, months / 12);
  };

  const pointsOf = (goalsFor, goalsAgainst) =>
    goalsFor > goalsAgainst ? 3 : goalsFor === goalsAgainst ? 1 : 0;

  // 第一轮：未调整的衰减场均积分
  const rawPpm = new Map();
  official.forEach((match) => {
    const weight = decayOf(match.date);
    [
      [match.home_team, pointsOf(Number(match.home_score), Number(match.away_score))],
      [match.away_team, pointsOf(Number(match.away_score), Number(match.home_score))]
    ].forEach(([teamName, points]) => {
      const item = rawPpm.get(teamName) ?? { pts: 0, w: 0 };
      item.pts += points * weight;
      item.w += weight;
      rawPpm.set(teamName, item);
    });
  });
  const ppmOf = (teamName) => {
    const item = rawPpm.get(teamName);
    return item?.w ? item.pts / item.w : 1;
  };
  // 各队比赛记录（对手、积分、衰减权重）与净胜球累计
  const records = new Map();
  const sums = new Map();
  official.forEach((match) => {
    const weight = decayOf(match.date);
    const homeScore = Number(match.home_score);
    const awayScore = Number(match.away_score);
    const homeGd = Math.max(-3, Math.min(3, homeScore - awayScore));
    [
      [match.home_team, match.away_team, pointsOf(homeScore, awayScore), homeGd],
      [match.away_team, match.home_team, pointsOf(awayScore, homeScore), -homeGd]
    ].forEach(([teamName, opponent, points, gd]) => {
      const recs = records.get(teamName) ?? [];
      recs.push([opponent, points, weight]);
      records.set(teamName, recs);
      const item = sums.get(teamName) ?? { gd: 0, w: 0, n: 0 };
      item.gd += gd * weight;
      item.w += weight;
      item.n += 1;
      sums.set(teamName, item);
    });
  });

  // 迭代 SOS：对手系数每轮用上一轮调整后的分数重算
  let ratings = new Map();
  records.forEach((_, teamName) => {
    ratings.set(teamName, clamp((ppmOf(teamName) / 3) * 100));
  });
  for (let round = 0; round < 4; round += 1) {
    const factorOf = (teamName) => 0.6 + ((ratings.get(teamName) ?? 50) / 100) * 0.8;
    const next = new Map();
    records.forEach((recs, teamName) => {
      let num = 0;
      let den = 0;
      recs.forEach(([opponent, points, weight]) => {
        num += points * factorOf(opponent) * weight;
        den += 3 * weight;
      });
      next.set(teamName, den ? clamp((num / den) * 100) : 0);
    });
    ratings = next;
  }

  const resultScores = new Map(ratings);
  const allScores = [...resultScores.values()];
  const globalMean = allScores.reduce((sum, value) => sum + value, 0) / allScores.length;

  // 小样本收缩
  sums.forEach((item, teamName) => {
    if (item.n < 10) {
      const prior = 10 - item.n;
      const score = resultScores.get(teamName);
      resultScores.set(teamName, (score * item.n + globalMean * prior) / (item.n + prior));
    }
  });

  // 强队集合：调整后积分 top 25%（至少 8 场正式比赛）
  const rankedTeams = [...sums.entries()]
    .filter(([, item]) => item.n >= 8)
    .sort((a, b) => resultScores.get(b[0]) - resultScores.get(a[0]));
  const strongCount = Math.max(1, Math.ceil(rankedTeams.length * 0.25));
  const strongTeams = new Set(rankedTeams.slice(0, strongCount).map(([teamName]) => teamName));

  const teams = new Map();
  sums.forEach((item, teamName) => {
    const officialResults = resultScores.get(teamName);
    const officialGoalProfile = clamp(50 + (item.w ? item.gd / item.w : 0) * 18);

    let strongPts = 0;
    let strongDen = 0;
    let strongMatches = 0;
    official.forEach((match) => {
      const isHome = match.home_team === teamName;
      const isAway = match.away_team === teamName;
      if (!isHome && !isAway) return;
      const opponent = isHome ? match.away_team : match.home_team;
      if (!strongTeams.has(opponent)) return;
      const weight = decayOf(match.date);
      const goalsFor = Number(isHome ? match.home_score : match.away_score);
      const goalsAgainst = Number(isHome ? match.away_score : match.home_score);
      strongPts += pointsOf(goalsFor, goalsAgainst) * weight;
      strongDen += 3 * weight;
      strongMatches += 1;
    });
    // 无强队交手记录时：向 50 分收缩而不是简单打折
    const strongOpponent = strongMatches
      ? clamp((strongPts / strongDen) * 100)
      : clamp(officialResults * 0.6 + 50 * 0.4);

    const aggregate = recentResults.team_aggregates?.[teamName] ?? {};
    teams.set(normalizeTeamKey(teamName), {
      sourceName: teamName,
      score: clamp(officialResults * 0.5 + officialGoalProfile * 0.33 + strongOpponent * 0.17),
      matches: Number(aggregate.matches ?? item.n),
      officialMatches: Number(aggregate.official_matches ?? item.n),
      friendlyMatches: Number(aggregate.friendly_matches ?? 0),
      breakdown: {
        officialResults,
        officialGoalProfile,
        strongOpponent
      }
    });
  });

  return {
    teams,
    source: recentResults.source,
    window: recentResults.competitive_match_window,
    coverage: recentResults.source_coverage,
    strongOpponentProxy: {
      method:
        "Top quartile by 4-round iterative SOS-adjusted, time-decayed official points per match (half-life 12 months) inside the 24-month window.",
      teamCount: strongTeams.size
    }
  };
}

function applyPublicPerformance(team) {
  const index = appState.publicPerformance;
  if (!index) return team;

  const performance = index.teams.get(normalizeTeamKey(team.nameEn));
  if (!performance) return team;

  return {
    ...team,
    dimensions: {
      ...team.dimensions,
      performance: performance.score
    },
    performanceBreakdown: {
      ...performance.breakdown
    },
    publicPerformance: performance
  };
}

function isFriendly(match) {
  return String(match.tournament ?? "").toLowerCase() === "friendly";
}

function safeDivide(numerator, denominator) {
  return denominator ? numerator / denominator : 0;
}

function normalizeTeamKey(value) {
  const normalized = String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

  const aliases = {
    usa: "united states",
    us: "united states",
    "united states of america": "united states",
    "cote d ivoire": "ivory coast",
    "czechia": "czech republic",
    "congo dr": "dr congo",
    "democratic republic of congo": "dr congo",
    "korea republic": "south korea",
    turkiye: "turkey"
  };

  return aliases[normalized] ?? normalized;
}

function normalizeTeams(teams) {
  return rankTeams(
    ensureTournamentTeams(teams).map((team, index) => {
      const players = Array.isArray(team.players) ? team.players.map(normalizePlayer) : [];
      const normalized = {
        ...team,
        id: team.id ?? slugify(team.name ?? `team-${index + 1}`),
        nameEn: team.nameEn ?? team.name ?? `Team ${index + 1}`,
        flag: team.flag ?? "🏳️",
        badge: team.badge ?? String(team.name ?? "TM").slice(0, 3).toUpperCase(),
        badgeColor: team.badgeColor ?? "#1f7a4d",
        confederation: team.confederation ?? "N/A",
        squadVersion: team.squadVersion ?? { date: "未标注", status: "未标注" },
        dimensions: fillScores(team.dimensions),
        environmentBreakdown: fillScores(team.environmentBreakdown),
        cohesionBreakdown: fillScores(team.cohesionBreakdown),
        performanceBreakdown: fillScores(team.performanceBreakdown),
        ageProfile: {
          weightedAgeScore: Number(team.ageProfile?.weightedAgeScore ?? team.dimensions?.age ?? 0),
          primeShare: Number(team.ageProfile?.primeShare ?? 0),
          riskPositions: team.ageProfile?.riskPositions ?? "未标注"
        },
        squadBalanceAdjustment: Number(team.squadBalanceAdjustment ?? 0),
        availabilityAdjustment: Number(team.availabilityAdjustment ?? 1),
        players,
        startingXI: normalizeStartingXI(team.startingXI, players, team.name)
      };
      return withScores(applyPublicPerformance(normalized));
    })
  );
}

function ensureTournamentTeams(teams) {
  const inputTeams = Array.isArray(teams) ? teams : [];
  const byId = new Map(inputTeams.map((team) => [team.id, team]));
  const byName = new Map(inputTeams.map((team) => [normalizeTeamKey(team.nameEn ?? team.name), team]));
  const seeded = tournamentTeamSeeds.map((seed) => {
    const [id, name, nameEn, flag, confederation, group, badgeColor] = seed;
    const existing = byId.get(id) ?? byName.get(normalizeTeamKey(nameEn));
    const base = buildSeedTeam({ id, name, nameEn, flag, confederation, group, badgeColor });
    return existing
      ? {
          ...base,
          ...existing,
          group,
          flag: existing.flag ?? flag,
          confederation: existing.confederation ?? confederation,
          badgeColor: existing.badgeColor ?? badgeColor
        }
      : base;
  });
  const seededIds = new Set(tournamentTeamSeeds.map(([id]) => id));
  const extras = inputTeams.filter((team) => team.id && !seededIds.has(team.id));
  return [...seeded, ...extras];
}

function buildSeedTeam(seed) {
  const baseline = getConfederationBaseline(seed.confederation);
  return {
    id: seed.id,
    name: seed.name,
    nameEn: seed.nameEn,
    flag: seed.flag,
    confederation: seed.confederation,
    group: seed.group,
    badge: seed.id.toUpperCase(),
    badgeColor: seed.badgeColor,
    squadVersion: { date: "2026-06-11", status: "预测名单" },
    dimensions: {
      environment: baseline.environment,
      cohesion: baseline.cohesion,
      age: baseline.age,
      performance: baseline.performance
    },
    environmentBreakdown: {
      leagueStrength: baseline.environment,
      clubCompetitiveness: Math.max(0, baseline.environment - 2),
      roleStability: Math.min(100, baseline.environment + 2)
    },
    cohesionBreakdown: {
      nationalTeam: baseline.cohesion,
      club: Math.max(0, baseline.cohesion - 4),
      historical: Math.max(0, baseline.cohesion - 12)
    },
    performanceBreakdown: {
      officialResults: baseline.performance,
      officialGoalProfile: baseline.performance,
      strongOpponent: Math.max(0, baseline.performance - 6)
    },
    ageProfile: {
      weightedAgeScore: baseline.age,
      primeShare: 42,
      riskPositions: "待接入球员年龄数据"
    },
    squadBalanceAdjustment: -3,
    availabilityAdjustment: 1,
    players: [],
    startingXI: placeholderStartingXI()
  };
}

function getConfederationBaseline(confederation) {
  const baselines = {
    UEFA: { environment: 72, cohesion: 68, age: 72, performance: 64 },
    CONMEBOL: { environment: 71, cohesion: 67, age: 72, performance: 63 },
    CAF: { environment: 65, cohesion: 63, age: 71, performance: 60 },
    AFC: { environment: 62, cohesion: 62, age: 70, performance: 58 },
    CONCACAF: { environment: 63, cohesion: 62, age: 70, performance: 58 },
    OFC: { environment: 56, cohesion: 58, age: 69, performance: 54 }
  };
  return baselines[confederation] ?? { environment: 60, cohesion: 60, age: 70, performance: 56 };
}

function normalizeStartingXI(input, players) {
  const provided = Array.isArray(input) ? input.map(normalizeLineupPlayer) : [];
  const fromPlayers = players
    .filter((item) => Number(item.appearanceWeight ?? 0) >= 0.55)
    .slice(0, 11)
    .map((item) => ({
      position: item.position,
      name: item.name,
      nameEn: item.nameEn,
      clubEn: item.clubEn,
      placeholder: false
    }));
  const lineup = provided.length ? provided : fromPlayers;
  return fillStartingXI(lineup);
}

function normalizeLineupPlayer(item) {
  return {
    position: item.position ?? "位置待定",
    name: item.name ?? "待补充",
    nameEn: item.nameEn ?? item.name ?? "",
    clubEn: item.clubEn ?? item.club ?? "",
    note: item.note ?? "",
    placeholder: Boolean(item.placeholder)
  };
}

function fillStartingXI(lineup) {
  const filled = lineup.slice(0, 11);
  const positions = defaultLineupPositions();
  while (filled.length < 11) {
    filled.push({
      position: positions[filled.length],
      name: "待补充",
      nameEn: "",
      clubEn: "",
      note: "待补充公开名单数据",
      placeholder: true
    });
  }
  return filled;
}

function placeholderStartingXI() {
  return defaultLineupPositions().map((position) => ({
    position,
    name: "待补充",
    nameEn: "",
    clubEn: "",
    note: "待补充公开名单数据",
    placeholder: true
  }));
}

function defaultLineupPositions() {
  return ["门将", "右后卫", "中卫", "中卫", "左后卫", "后腰", "中场", "前腰", "右边锋", "中锋", "左边锋"];
}

function fillScores(input = {}) {
  return Object.fromEntries(
    Object.entries(input).map(([key, value]) => [key, Number(value)])
  );
}

function withScores(team) {
  const scoreComponents = calculateScoreComponents(team);
  const activeCoefficients = getActiveCoefficientConfig();
  const effectiveCoefficients = getEffectiveCoefficients(activeCoefficients);
  const activeTotal = getCoefficientTotal(effectiveCoefficients);
  const baseScore =
    scoreComponentConfig.reduce((sum, [key]) => {
      return sum + scoreComponents[key] * Number(effectiveCoefficients[key] ?? 0);
    }, 0) / activeTotal;
  const balancedScore = baseScore;
  const finalScore = balancedScore * team.availabilityAdjustment;
  return {
    ...team,
    scoreComponents,
    baseScore,
    balancedScore,
    finalScore: clamp(finalScore)
  };
}

function calculateScoreComponents(team) {
  return {
    squadQuality: calculateSquadQuality(team),
    recentMatchRating: clamp(team.dimensions.performance),
    positionalBalance: calculatePositionalBalance(team),
    squadDepth: calculateSquadDepth(team),
    cohesionContinuity: clamp(team.dimensions.cohesion),
    ageLoad: clamp(team.dimensions.age)
  };
}

function calculateSquadQuality(team) {
  const players = Array.isArray(team.players) ? team.players : [];
  const fallback = Number(team.dimensions.environment ?? 0);
  if (!players.length) return clamp(fallback);

  const starters = players.filter((player) => Number(player.appearanceWeight) === 1);
  const rotation = players.filter((player) => Number(player.appearanceWeight) === 0.55);
  const fringe = players.filter((player) => Number(player.appearanceWeight) > 0 && Number(player.appearanceWeight) < 0.55);
  const starterScore = weightedPlayerScore(starters, fallback);
  const rotationScore = weightedPlayerScore(rotation, fallback);
  const fringeScore = weightedPlayerScore(fringe, rotationScore);
  const starterCount = starters.length || 1;
  const eliteShare = starters.filter(isEliteClubPlayer).length / starterCount;
  const weakShare = starters.filter((player) => Number(player.environmentScore ?? 0) < 76).length / starterCount;
  const eliteStarterAdjustment = (eliteShare - 0.25) * 10 - Math.max(0, 0.18 - eliteShare) * 8;
  const lowIntensityOldStarters = starters.filter((player) => {
    const age = Number(player.age ?? 0);
    const league = String(player.leagueCode ?? "");
    return age >= 32 && !["ENG", "ESP", "ITA", "GER", "FRA"].includes(league);
  }).length;

  return clamp(
    starterScore * 0.72 +
      rotationScore * 0.22 +
      fringeScore * 0.06 +
      eliteStarterAdjustment -
      weakShare * 6 -
      lowIntensityOldStarters * 1.4
  );
}

function isEliteClubPlayer(player) {
  const club = normalizeAscii(player.clubEn ?? player.club ?? "");
  return ELITE_CLUB_PATTERNS.some((pattern) => club.includes(pattern));
}

function normalizeAscii(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function calculatePositionalBalance(team) {
  const players = Array.isArray(team.players) ? team.players : [];
  const counts = players.reduce((acc, player) => {
    const code = player.positionCode ?? positionCodeFromLabel(player.position);
    if (code) acc[code] = (acc[code] ?? 0) + 1;
    return acc;
  }, {});
  const targets = { GK: 3, DF: 7, MF: 6, FW: 5 };
  const coverageAdjustment = Object.entries(targets).reduce((sum, [code, target]) => {
    const shortage = Math.max(0, target - Number(counts[code] ?? 0));
    if (shortage) return sum - shortage * (code === "GK" ? 3 : 5);
    return sum + 2;
  }, 0);
  const starterGroups = ["GK", "DF", "MF", "FW"].map((code) => {
    const group = players.filter((player) => Number(player.appearanceWeight) === 1 && (player.positionCode ?? positionCodeFromLabel(player.position)) === code);
    return weightedPlayerScore(group, Number(team.dimensions.environment ?? 0));
  });
  const weakestStarterGroup = Math.min(...starterGroups);
  const groupQualityAdjustment =
    weakestStarterGroup >= 85 ? 6 : weakestStarterGroup >= 80 ? 3 : weakestStarterGroup >= 76 ? 0 : weakestStarterGroup >= 70 ? -4 : -8;
  const balancePenalty = Math.abs(Number(team.squadBalanceAdjustment ?? 0)) * 8;
  return clamp(85 + coverageAdjustment + groupQualityAdjustment - balancePenalty);
}

function calculateSquadDepth(team) {
  const players = Array.isArray(team.players) ? team.players : [];
  const fallback = Number(team.dimensions.environment ?? 0);
  const rotation = players.filter((player) => Number(player.appearanceWeight) === 0.55);
  const fringe = players.filter((player) => Number(player.appearanceWeight) > 0 && Number(player.appearanceWeight) < 0.55);
  const rotationScore = weightedPlayerScore(rotation, fallback);
  const fringeScore = weightedPlayerScore(fringe, rotationScore);
  return clamp(rotationScore * 0.7 + fringeScore * 0.3);
}

function weightedPlayerScore(players, fallback) {
  let total = 0;
  let weight = 0;
  players.forEach((player) => {
    const playerWeight = Number(player.appearanceWeight ?? 0.2);
    total += Number(player.environmentScore ?? fallback) * playerWeight;
    weight += playerWeight;
  });
  return weight ? total / weight : fallback;
}

function positionCodeFromLabel(position) {
  if (position === "门将") return "GK";
  if (position === "后卫" || position?.includes("后卫") || position?.includes("中卫")) return "DF";
  if (position === "中场" || position?.includes("中场") || position?.includes("后腰") || position?.includes("前腰")) return "MF";
  if (position === "前锋" || position?.includes("边锋") || position?.includes("中锋")) return "FW";
  return "";
}

function refreshTeamScores() {
  appState.teams = appState.teams.map(withScores);
}

function rankTeams(teams) {
  return [...teams]
    .sort((a, b) => b.finalScore - a.finalScore)
    .map((team, index) => ({ ...team, rank: index + 1 }));
}

function getVisibleTeams() {
  const ranked = rankTeams(appState.teams);
  const filtered = ranked.filter((team) => {
    const playerText = team.players
      .map((item) => `${item.name} ${item.nameEn} ${item.club} ${item.clubEn}`)
      .join(" ");
    const value = `${team.name} ${team.nameEn} ${team.flag} ${team.confederation} ${playerText}`.toLowerCase();
    return value.includes(appState.query);
  });

  if (appState.sortMode === "rank") return filtered;

  return filtered.sort((a, b) => {
    const key = appState.sortMode;
    return getSortScore(b, key) - getSortScore(a, key) || b.finalScore - a.finalScore;
  });
}

function getSortScore(team, key) {
  if (team.scoreComponents && Object.hasOwn(team.scoreComponents, key)) {
    return Number(team.scoreComponents[key]);
  }
  return Number(team.dimensions?.[key] ?? 0);
}

function loadTeams() {
  if (Array.isArray(window.WORLD_CUP_STRENGTH_TEAMS)) {
    return structuredClone(window.WORLD_CUP_STRENGTH_TEAMS);
  }

  const stored = localStorage.getItem("worldCupStrengthTeams");
  if (!stored) return structuredClone(defaultTeams);
  try {
    const teams = JSON.parse(stored);
    return Array.isArray(teams) ? teams : structuredClone(defaultTeams);
  } catch {
    return structuredClone(defaultTeams);
  }
}

function getTier(score) {
  if (score >= 90) return "冠军热门";
  if (score >= 80) return "四强竞争者";
  if (score >= 70) return "八强/黑马区";
  if (score >= 60) return "小组出线竞争者";
  if (score >= 50) return "小组赛弱势方";
  return "明显弱势";
}

function formatScore(value) {
  return Number(value).toFixed(1);
}

function signed(value) {
  const number = Number(value);
  return `${number > 0 ? "+" : ""}${number.toFixed(1)}`;
}

function clamp(value) {
  return Math.max(0, Math.min(100, Number(value) || 0));
}

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function normalizePlayer(item) {
  return {
    ...item,
    nameEn: item.nameEn ?? item.name,
    club: item.club ?? item.clubName ?? item.clubEn ?? "未标注",
    clubEn: item.clubEn ?? item.clubNameEn ?? item.club ?? "Unspecified",
    environmentScore: Number(item.environmentScore ?? 0)
  };
}

function player(name, nameEn, age, position, tier, appearanceWeight, club, clubEn, environmentScore, availability) {
  return {
    name,
    nameEn,
    age,
    position,
    tier: `${tier} · ${appearanceWeight}`,
    appearanceWeight,
    club,
    clubEn,
    environmentScore,
    availability
  };
}
