import { reactive } from "vue";
import { eloRatings, ELO_SNAPSHOT_DATE, ELO_SOURCE } from "../data/elo-ratings.js";

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
  ["sco", "苏格兰", "Scotland", "\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74\uDB40\uDC7F", "UEFA", "Group C", "#315f9f"],
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
const FINISHED_HOME_RESULTS_STORAGE_KEY = "worldCupFinishedPredictionResults";
const ODDS_STORAGE_KEY = "wcOddsCache";
const ODDS_STORAGE_VERSION = 4;
const ODDS_DEBUG_STORAGE_KEY = "wcOddsDebug";

const VENUE_ZH_LABELS = Object.freeze({
  "Mexico City": "墨西哥城",
  "Guadalajara (Zapopan)": "瓜达拉哈拉（萨波潘）",
  "Monterrey": "蒙特雷",
  "Monterrey (Guadalupe)": "蒙特雷（瓜达卢佩）",
  "Atlanta": "亚特兰大",
  "Boston": "波士顿",
  "Boston (Foxborough)": "波士顿（福克斯伯勒）",
  "Dallas": "达拉斯",
  "Dallas (Arlington)": "达拉斯（阿灵顿）",
  "Arlington": "阿灵顿",
  "Houston": "休斯敦",
  "Kansas City": "堪萨斯城",
  "Los Angeles": "洛杉矶",
  "Los Angeles (Inglewood)": "洛杉矶（英格尔伍德）",
  "Inglewood": "英格尔伍德",
  "Miami": "迈阿密",
  "Miami (Miami Gardens)": "迈阿密（迈阿密花园）",
  "Miami Gardens": "迈阿密花园",
  "New York/New Jersey": "纽约/新泽西",
  "New York/New Jersey (East Rutherford)": "纽约/新泽西（东卢瑟福）",
  "East Rutherford": "东卢瑟福",
  "Philadelphia": "费城",
  "San Francisco Bay Area": "旧金山湾区",
  "San Francisco Bay Area (Santa Clara)": "旧金山湾区（圣克拉拉）",
  "Santa Clara": "圣克拉拉",
  "Seattle": "西雅图",
  "Toronto": "多伦多",
  "Vancouver": "温哥华",
  "Orlando": "奥兰多",
  "Leiria": "莱里亚",
  "Malé": "马累",
  "Casablanca": "卡萨布兰卡",
  "Auburn": "奥本",
  "Yerevan": "埃里温",
  "Szombathely": "松博特海伊",
  "Minsk": "明斯克",
  "Phnom Penh": "金边",
  "Hangzhou": "杭州",
  "Orléans": "奥尔良",
  "Marrakesh": "马拉喀什",
  "Dire Dawa": "德雷达瓦",
  "Debrecen": "德布勒森",
  "Jakarta": "雅加达",
  "Bishkek": "比什凯克",
  "San Antonio": "圣安东尼奥",
  "Hisor": "希索尔",
  "Manila": "马尼拉",
  "United States": "美国",
  "Portugal": "葡萄牙",
  "Maldives": "马尔代夫",
  "Morocco": "摩洛哥",
  "Armenia": "亚美尼亚",
  "Hungary": "匈牙利",
  "Belarus": "白俄罗斯",
  "Cambodia": "柬埔寨",
  "China": "中国",
  "France": "法国",
  "Ethiopia": "埃塞俄比亚",
  "Indonesia": "印度尼西亚",
  "Kyrgyzstan": "吉尔吉斯斯坦",
  "Tajikistan": "塔吉克斯坦",
  "Philippines": "菲律宾",
  "Estadio Azteca": "阿兹特克体育场",
  "Estadio Guadalajara": "瓜达拉哈拉体育场",
  "Estadio BBVA": "蒙特雷 BBVA 体育场",
  "Mercedes-Benz Stadium": "梅赛德斯-奔驰体育场",
  "Gillette Stadium": "吉列体育场",
  "AT&T Stadium": "AT&T 体育场",
  "NRG Stadium": "NRG 体育场",
  "Arrowhead Stadium": "箭头体育场",
  "SoFi Stadium": "SoFi 体育场",
  "Hard Rock Stadium": "硬石体育场",
  "MetLife Stadium": "大都会人寿体育场",
  "Lincoln Financial Field": "林肯金融球场",
  "Levi's Stadium": "李维斯体育场",
  "Lumen Field": "流明球场",
  "BMO Field": "BMO 球场",
  "BC Place": "BC Place 体育场"
});

const scoreComponentConfig = [
  ["squadQuality", "阵容质量", 42, "#1f7a4d"],
  ["recentMatchRating", "近期比赛强度", 33, "#315f9f"],
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

const CLUB_ZH_LABELS = Object.freeze({
  "manchester city fc": "曼城",
  "manchester city": "曼城",
  "fc bayern munchen": "拜仁慕尼黑",
  "bayern munich": "拜仁慕尼黑",
  "paris saint germain": "巴黎圣日耳曼",
  "arsenal fc": "阿森纳",
  "arsenal": "阿森纳",
  "fc barcelona": "巴塞罗那",
  "barcelona": "巴塞罗那",
  "atletico de madrid": "马德里竞技",
  "manchester united fc": "曼联",
  "manchester united": "曼联",
  "crystal palace fc": "水晶宫",
  "al hilal sc": "利雅得新月",
  "borussia dortmund": "多特蒙德",
  "liverpool fc": "利物浦",
  "liverpool": "利物浦",
  "galatasaray sk": "加拉塔萨雷",
  "real madrid c f": "皇家马德里",
  "real madrid": "皇家马德里",
  "psv eindhoven": "埃因霍温",
  "ac milan": "AC米兰",
  "fenerbahce sk": "费内巴切",
  "sk slavia praha": "布拉格斯拉维亚",
  "sunderland afc": "桑德兰",
  "al ahli fc": "吉达国民",
  "aston villa fc": "阿斯顿维拉",
  "cr flamengo": "弗拉门戈",
  "al ahly fc": "开罗国民",
  "al nassr fc": "利雅得胜利",
  "lille osc": "里尔",
  "eintracht frankfurt": "法兰克福",
  "ogc nice": "尼斯",
  "tottenham hotspur fc": "托特纳姆热刺",
  "tottenham hotspur": "托特纳姆热刺",
  "sl benfica": "本菲卡",
  "chelsea fc": "切尔西",
  "chelsea": "切尔西",
  "tsg hoffenheim": "霍芬海姆",
  "brighton and hove albion fc": "布莱顿",
  "atalanta bergamo": "亚特兰大",
  "vfb stuttgart": "斯图加特",
  "newcastle united fc": "纽卡斯尔联",
  "newcastle united": "纽卡斯尔联",
  "villarreal cf": "比利亚雷亚尔",
  "celtic fc": "凯尔特人",
  "mamelodi sundowns fc": "马梅洛迪日落",
  "orlando pirates fc": "奥兰多海盗",
  "al duhail sc": "杜海勒",
  "bayer 04 leverkusen": "勒沃库森",
  "rc strasbourg": "斯特拉斯堡",
  "se palmeiras": "帕尔梅拉斯",
  "fc internazionale milano": "国际米兰",
  "inter": "国际米兰",
  "sporting cp": "葡萄牙体育",
  "olympique marseille": "马赛",
  "bsc young boys": "伯尔尼年轻人",
  "real betis": "皇家贝蒂斯",
  "rb leipzig": "莱比锡",
  "1 fsv mainz 05": "美因茨",
  "fulham fc": "富勒姆",
  "juventus fc": "尤文图斯",
  "wolverhampton wanderers fc": "狼队",
  "as monaco": "摩纳哥",
  "feyenoord rotterdam": "费耶诺德",
  "vfl wolfsburg": "沃尔夫斯堡",
  "olympique lyonnais": "里昂",
  "ca river plate": "河床",
  "club brugge": "布鲁日",
  "rangers fc": "流浪者",
  "borussia monchengladbach": "门兴格拉德巴赫",
  "afc bournemouth": "伯恩茅斯",
  "bologna fc": "博洛尼亚",
  "real sociedad": "皇家社会",
  "burnley fc": "伯恩利",
  "nottingham forest fc": "诺丁汉森林",
  "as roma": "罗马",
  "cd guadalajara": "瓜达拉哈拉",
  "al sadd sc": "萨德"
});

const CLUB_BADGE_LABELS = Object.freeze({
  "manchester city fc": { text: "MC", color: "#6cabdd" },
  "manchester city": { text: "MC", color: "#6cabdd" },
  "fc bayern munchen": { text: "FCB", color: "#dc052d" },
  "bayern munich": { text: "FCB", color: "#dc052d" },
  "paris saint germain": { text: "PSG", color: "#004170" },
  "arsenal fc": { text: "ARS", color: "#ef0107" },
  "arsenal": { text: "ARS", color: "#ef0107" },
  "fc barcelona": { text: "BAR", color: "#a50044" },
  "barcelona": { text: "BAR", color: "#a50044" },
  "atletico de madrid": { text: "ATM", color: "#cb3524" },
  "manchester united fc": { text: "MU", color: "#da291c" },
  "manchester united": { text: "MU", color: "#da291c" },
  "al hilal sc": { text: "HIL", color: "#0054a6" },
  "borussia dortmund": { text: "BVB", color: "#facc15" },
  "liverpool fc": { text: "LIV", color: "#c8102e" },
  "liverpool": { text: "LIV", color: "#c8102e" },
  "real madrid c f": { text: "RM", color: "#fbbf24" },
  "real madrid": { text: "RM", color: "#fbbf24" },
  "ac milan": { text: "MIL", color: "#fb090b" },
  "tottenham hotspur fc": { text: "TOT", color: "#132257" },
  "tottenham hotspur": { text: "TOT", color: "#132257" },
  "sl benfica": { text: "BEN", color: "#e83030" },
  "chelsea fc": { text: "CHE", color: "#034694" },
  "chelsea": { text: "CHE", color: "#034694" },
  "newcastle united fc": { text: "NEW", color: "#111827" },
  "newcastle united": { text: "NEW", color: "#111827" },
  "bayer 04 leverkusen": { text: "B04", color: "#e32221" },
  "se palmeiras": { text: "PAL", color: "#006437" },
  "fc internazionale milano": { text: "INT", color: "#0068a8" },
  "inter": { text: "INT", color: "#0068a8" },
  "sporting cp": { text: "SCP", color: "#00843d" },
  "rb leipzig": { text: "RBL", color: "#dd0741" },
  "juventus fc": { text: "JUV", color: "#111827" },
  "ca river plate": { text: "RIV", color: "#e31e24" },
  "as roma": { text: "ROM", color: "#8e1f2f" }
});

const CLUB_LOGO_URLS = Object.freeze({
  "newcastle united fc": "https://media.api-sports.io/football/teams/34.png",
  "newcastle united": "https://media.api-sports.io/football/teams/34.png",
  "liverpool fc": "https://media.api-sports.io/football/teams/40.png",
  "liverpool": "https://media.api-sports.io/football/teams/40.png",
  "arsenal fc": "https://media.api-sports.io/football/teams/42.png",
  "arsenal": "https://media.api-sports.io/football/teams/42.png",
  "tottenham hotspur fc": "https://media.api-sports.io/football/teams/47.png",
  "tottenham hotspur": "https://media.api-sports.io/football/teams/47.png",
  "chelsea fc": "https://media.api-sports.io/football/teams/49.png",
  "chelsea": "https://media.api-sports.io/football/teams/49.png",
  "manchester city fc": "https://media.api-sports.io/football/teams/50.png",
  "manchester city": "https://media.api-sports.io/football/teams/50.png",
  "olympique marseille": "https://media.api-sports.io/football/teams/81.png",
  "ogc nice": "https://media.api-sports.io/football/teams/84.png",
  "paris saint germain": "https://media.api-sports.io/football/teams/85.png",
  "as monaco": "https://media.api-sports.io/football/teams/91.png",
  "fc bayern munchen": "https://media.api-sports.io/football/teams/157.png",
  "bayern munich": "https://media.api-sports.io/football/teams/157.png",
  "borussia dortmund": "https://media.api-sports.io/football/teams/165.png",
  "bayer 04 leverkusen": "https://media.api-sports.io/football/teams/168.png",
  "eintracht frankfurt": "https://media.api-sports.io/football/teams/169.png",
  "psv eindhoven": "https://media.api-sports.io/football/teams/197.png",
  "feyenoord rotterdam": "https://media.api-sports.io/football/teams/209.png",
  "sl benfica": "https://media.api-sports.io/football/teams/211.png",
  "sporting cp": "https://media.api-sports.io/football/teams/228.png",
  "celtic fc": "https://media.api-sports.io/football/teams/247.png",
  "rangers fc": "https://media.api-sports.io/football/teams/257.png",
  "juventus fc": "https://media.api-sports.io/football/teams/496.png",
  "atalanta bergamo": "https://media.api-sports.io/football/teams/499.png",
  "fc internazionale milano": "https://media.api-sports.io/football/teams/505.png",
  "inter": "https://media.api-sports.io/football/teams/505.png",
  "fc barcelona": "https://media.api-sports.io/football/teams/529.png",
  "barcelona": "https://media.api-sports.io/football/teams/529.png",
  "atletico de madrid": "https://media.api-sports.io/football/teams/530.png",
  "villarreal cf": "https://media.api-sports.io/football/teams/533.png",
  "real madrid c f": "https://media.api-sports.io/football/teams/541.png",
  "real madrid": "https://media.api-sports.io/football/teams/541.png",
  "sk slavia praha": "https://media.api-sports.io/football/teams/560.png",
  "fenerbahce sk": "https://media.api-sports.io/football/teams/611.png",
  "galatasaray sk": "https://media.api-sports.io/football/teams/645.png"
});

const LEAGUE_CODE_LABELS = Object.freeze({
  ENG: "英超",
  ESP: "西甲",
  GER: "德甲",
  ITA: "意甲",
  FRA: "法甲",
  NED: "荷甲",
  POR: "葡超",
  TUR: "土超",
  SCO: "苏超",
  BEL: "比甲",
  SUI: "瑞士超",
  AUT: "奥甲",
  DEN: "丹超",
  NOR: "挪超",
  SWE: "瑞典超",
  RUS: "俄超",
  GRE: "希超",
  CZE: "捷甲",
  POL: "波甲",
  CRO: "克甲",
  SRB: "塞超",
  ROU: "罗甲",
  BUL: "保甲",
  SVK: "斯伐超",
  SVN: "斯洛文尼亚甲",
  KSA: "沙特联",
  QAT: "卡塔尔联",
  UAE: "阿联酋联",
  IRN: "伊朗联",
  IRQ: "伊拉克联",
  JOR: "约旦联",
  KOR: "K联赛",
  JPN: "J联赛",
  AUS: "澳超",
  CHN: "中超",
  USA: "美职联",
  MEX: "墨超",
  BRA: "巴甲",
  ARG: "阿甲",
  ECU: "厄瓜多尔甲",
  COL: "哥伦比亚甲",
  PAR: "巴拉圭甲",
  URU: "乌拉圭甲",
  CHI: "智利甲",
  RSA: "南非超",
  EGY: "埃及超",
  TUN: "突尼斯甲",
  ALG: "阿尔及利亚甲",
  MAR: "摩洛哥甲",
  CYP: "塞浦路斯甲",
  ISR: "以超",
  HUN: "匈甲",
  CAN: "加超",
  NZL: "新西兰联"
});

// 跨联赛强度校正（与 scripts/backtest-ucl.mjs 同源）：
// API-Football 的俱乐部赛季评分是“联赛内相对值”——在弱联赛刷出的 7.3 ≠ 五大联赛的 7.3。
// 不校正会让“小池塘大鱼”虚高（欧冠回测里博多/格利姆特、贝尔格莱德红星、土超双雄都异常靠前）。
// 做法：把评分向中性基准收缩，收缩力度 = 联赛强度系数（强联赛=1，越弱越向 BASE 压）：
//   adjusted = BASE + (rating - BASE) * factor
// 该项只作用于 getClubPerformanceAdjustment（喂入阵容质量的“俱乐部表现”加成），
// 不改动球员的 leagueStrength / clubCompetitiveness（那两项本就按联赛强度赋值）。
// 系数粗略参照 UEFA 联赛系数，真正的裁判是欧冠回测命中率（avgFull 64.1%→66.0%，xiOnly 64.1%→68.6%）。
const RATING_NEUTRAL_BASELINE = 6.5;
const LEAGUE_STRENGTH_FACTOR = {
  // 五大联赛
  "Premier League": 1.0,
  "La Liga": 1.0,
  "Serie A": 0.96,
  "Bundesliga": 0.96,
  "Ligue 1": 0.9,
  // 欧战 / 跨洲赛事：评分本身就是高水平对抗，基本不打折
  "UEFA Champions League": 1.0,
  "UEFA Europa League": 0.9,
  "UEFA Europa Conference League": 0.8,
  "FIFA Club World Cup": 0.95,
  // 二档欧洲联赛
  "Primeira Liga": 0.82,
  "Eredivisie": 0.8,
  "Pro League": 0.74,
  "Süper Lig": 0.72,
  "Championship": 0.72,
  "Serie B": 0.66,
  "Segunda División": 0.66,
  "2. Bundesliga": 0.66,
  "Ligue 2": 0.64,
  "Premiership": 0.62,
  "Super League": 0.62,
  "Super League 1": 0.62,
  "Superliga": 0.6,
  "Super Liga": 0.52,
  "Eliteserien": 0.48,
  "Allsvenskan": 0.5,
  "1. Division": 0.5,
  "Liga I": 0.55,
  "Segunda Liga": 0.55,
  "Challenger Pro League": 0.55,
  "League One": 0.55,
  // 其它大洲
  "Liga MX": 0.6,
  "Major League Soccer": 0.58,
  "J1 League": 0.56,
  "K League 1": 0.56,
  "A-League": 0.5,
  "Primera A": 0.55,
  "Torneo Federal A": 0.45,
  "Stars League": 0.5,
  "Persian Gulf Pro League": 0.5,
  "Premier Soccer League": 0.5,
  "AFC Champions League Elite": 0.7,
  "AFC Champions League Two": 0.6,
  "CONCACAF Champions League": 0.62
};
// 未列出的联赛（多为弱联赛或杯赛长尾，每个仅个位数球员）按中性折扣兜底，与回测一致。
const LEAGUE_STRENGTH_DEFAULT = 0.75;

function leagueStrengthFactor(leagueName) {
  if (!leagueName) return LEAGUE_STRENGTH_DEFAULT;
  return LEAGUE_STRENGTH_FACTOR[leagueName] ?? LEAGUE_STRENGTH_DEFAULT;
}

function adjustCrossLeagueRating(rating, leagueName) {
  if (!(rating > 0)) return rating;
  return RATING_NEUTRAL_BASELINE + (rating - RATING_NEUTRAL_BASELINE) * leagueStrengthFactor(leagueName);
}

// 实时数据走同源 /api 代理（server.js 转发到 API-Football 并在服务端附加 token）。
// 这样浏览器不受 CORS 限制，token 也不暴露在前端源码里。
// file:// 直接打开页面时无代理可用，自动降级为本地数据。
const SCHEDULE_CACHE_STORAGE_KEY = "wcScheduleCache";
const SCHEDULE_API_COOLDOWN_MS = 10 * 60 * 1000;
const BANNER_UPCOMING_WINDOW_MS = 2 * 60 * 60 * 1000;
const BANNER_ESTIMATED_LIVE_MS = 2 * 60 * 60 * 1000;
const BANNER_ACTIVE_REFRESH_MS = 60 * 1000;
const HOME_ACTIVE_MATCH_LIMIT = 8;
const HOME_FINISHED_MATCH_LIMIT = 6;

const LINEUP_API = {
  baseUrl: "/api/football",
  timeoutMs: 8000,
  scheduleCacheMaxAgeMs: SCHEDULE_API_COOLDOWN_MS,
  cachePrefix: "lineupCache:",
  get available() {
    return window.location.protocol === "http:" || window.location.protocol === "https:";
  }
};

const ODDS_API = {
  endpoint: "/api/odds/worldcup",
  refreshMs: 10 * 60 * 1000,
  midKickoffRefreshMs: 3 * 60 * 1000,
  midKickoffWindowMs: 60 * 60 * 1000,
  nearKickoffRefreshMs: 60 * 1000,
  nearKickoffWindowMs: 30 * 60 * 1000,
  get available() {
    return window.location.protocol === "http:" || window.location.protocol === "https:";
  }
};

// 势均力敌阈值：评分差在 1 分内时提示平局风险,但不直接把赛果预测为平局。
const CLOSE_MATCH_THRESHOLD = 1;
const GROUP_STAGE_DRAW_CONFIDENCE_MAX = 0.3;
const KNOCKOUT_DRAW_CONFIDENCE_MAX = 0.33;
const WIN_CONFIDENCE_MIN = 0.5;
const WIN_CONFIDENCE_MAX = 0.8;
const WIN_CONFIDENCE_SCALE = 16;

const publicData = loadPublicData();
const clubPlayerStats = loadClubPlayerStats();
const clubPlayerStatsIndex = buildClubPlayerStatsIndex(clubPlayerStats);
const oddsDebugLogKeys = new Set();

// ==== 球员中文名映射(data/public/player_name_zh.js,源自官方名单 PDF)====
function loadPlayerNameZh() {
  return Array.isArray(window.WORLD_CUP_PLAYER_NAME_ZH) ? window.WORLD_CUP_PLAYER_NAME_ZH : [];
}

// 为每个 [拉丁名, 中文名] 派生别名:全名、倒序、token 排序拼接、
// 首字母+姓("S. McTominay",姓含空格时同时生成去空格变体)、唯一姓氏。
// 不同球员撞键的别名直接弃用,避免张冠李戴。
function sortedConcatKey(tokens) {
  return [...tokens].sort().join("");
}

function buildPlayerNameZhIndex(rows) {
  const index = new Map();
  const ambiguous = new Set();
  const put = (key, zh) => {
    if (!key) return;
    if (index.has(key) && index.get(key) !== zh) {
      ambiguous.add(key);
      return;
    }
    index.set(key, zh);
  };
  rows.forEach(([en, zh]) => {
    const key = normalizeAscii(en);
    const tokens = key.split(" ").filter(Boolean);
    put(key, zh);
    if (tokens.length >= 2) {
      put([...tokens].reverse().join(" "), zh);
      put(sortedConcatKey(tokens), zh);
      const rest = tokens.slice(1);
      const variants = new Set([rest.join(" "), rest.join("")]);
      variants.forEach((variant) => {
        put(`${tokens[0][0]} ${variant}`, zh);
        put(`${tokens[0]} ${variant}`, zh);
        put(variant, zh);
      });
    }
  });
  ambiguous.forEach((key) => index.delete(key));
  return index;
}

const playerNameZhIndex = buildPlayerNameZhIndex(loadPlayerNameZh());

function zhPlayerName(value) {
  if (!value) return null;
  const key = normalizeAscii(value);
  if (!key) return null;
  const direct = playerNameZhIndex.get(key);
  if (direct) return direct;
  const tokens = key.split(" ").filter(Boolean);
  if (tokens.length < 2) return null;
  // token 排序拼接:兼容 "Son Heung-Min" / "Heungmin Son" 等切分差异
  const sorted = playerNameZhIndex.get(sortedConcatKey(tokens));
  if (sorted) return sorted;
  // 相邻 token 两两合并(连字符名常见):"kim min jae" → "kim minjae"
  for (let i = 0; i < tokens.length - 1; i += 1) {
    const merged = [...tokens.slice(0, i), tokens[i] + tokens[i + 1], ...tokens.slice(i + 2)];
    const hit = playerNameZhIndex.get(merged.join(" ")) ?? playerNameZhIndex.get(sortedConcatKey(merged));
    if (hit) return hit;
  }
  return null;
}

export const appState = reactive({
  teams: loadTeams(),
  coefficients: loadCoefficientConfig(),
  stageLoadMode: loadStageLoadMode(),
  publicData,
  publicPerformance: buildPublicPerformanceIndex(publicData?.recentResults),
  selectedId: null,
  query: "",
  sortMode: "rank",
  view: "events",
  scheduleMode: "recent",
  scheduleQuery: "",
  scheduleGroup: "all",
  liveSchedule: null,
  liveScheduleLoading: false,
  liveScheduleAttempted: false,
  odds: null,
  oddsLoading: false,
  matchLineupVersion: 0
});


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

// ---- 移动端评分详情底部浮层 ----

async function loadLiveSchedule() {
  if (!LINEUP_API.available || appState.liveScheduleLoading) return;
  appState.liveScheduleAttempted = true;
  const cached = readScheduleCache();
  if (isFreshScheduleCache(cached)) {
    appState.liveSchedule = { ...cached, source: "cache" };
    scheduleNextLiveScheduleLoad(getScheduleCacheRemainingMs(cached));
    return;
  }

  appState.liveScheduleLoading = true;
  try {
    const data = await lineupApiGet(`/worldcup/fixtures?ts=${Date.now()}`);
    const matches = normalizeApiFootballResponse(data);
    if (matches.length) {
      appState.liveSchedule = {
        source: "live",
        fetchedAt: new Date().toISOString(),
        matches
      };
      try {
        writeScheduleCache(appState.liveSchedule);
      } catch {
        // 忽略缓存写入失败
      }
    }
  } catch {
    // 实时获取失败：尝试缓存，再不行就继续用本地 JSON
    try {
      if (isFreshScheduleCache(cached)) {
        appState.liveSchedule = { ...cached, source: "cache" };
      } else if (!isFreshScheduleCache(appState.liveSchedule)) {
        appState.liveSchedule = null;
      }
    } catch {
      if (!isFreshScheduleCache(appState.liveSchedule)) {
        appState.liveSchedule = null;
      }
    }
  } finally {
    appState.liveScheduleLoading = false;

    // 赛程接口统一 10 分钟冷却,并持久化到浏览器缓存,避免切换页面或重进页面时重复请求。
    const nextPollDelay = getLivePollDelay();
    if (nextPollDelay) scheduleNextLiveScheduleLoad(nextPollDelay);
  }
}

async function loadOdds() {
  if (!ODDS_API.available || appState.oddsLoading) return;
  const cached = readOddsCache();
  if (isFreshOddsCache(cached)) {
    appState.odds = { ...cached, source: cached.source ?? "cache" };
    logOddsEvent("使用浏览器缓存", {
      fetchedAt: cached.fetchedAt,
      matches: cached.matches?.length ?? 0,
      remainingSeconds: Math.round(getOddsCacheRemainingMs(cached) / 1000),
      nextRefreshSeconds: Math.round(getActiveOddsRefreshMs() / 1000)
    });
    scheduleNextOddsLoad(getOddsCacheRemainingMs(cached));
    return;
  }

  appState.oddsLoading = true;
  try {
    logOddsEvent("请求赔率接口", {
      endpoint: ODDS_API.endpoint,
      nextRefreshSeconds: Math.round(getActiveOddsRefreshMs() / 1000),
      cachedAt: cached?.fetchedAt ?? null,
      cachedMatches: cached?.matches?.length ?? 0
    });
    const response = await fetch(`${ODDS_API.endpoint}?ts=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    appState.odds = {
      source: data?.source ?? "api-football",
      fetchedAt: new Date().toISOString(),
      matches: Array.isArray(data) ? data : data?.matches ?? []
    };
    logOddsEvent("赔率接口返回", {
      source: appState.odds.source,
      matches: appState.odds.matches.length,
      paging: data?.paging ?? null,
      errors: data?.errors ?? null,
      targeted: data?.targeted ?? null,
      canadaBosniaCandidates: summarizeOddsCandidates(appState.odds.matches, "Canada", "Bosnia & Herzegovina")
    });
    writeOddsCache(appState.odds);
  } catch (error) {
    logOddsEvent("赔率接口失败", {
      message: String(error?.message ?? error),
      fallbackCachedAt: cached?.fetchedAt ?? null,
      fallbackCachedMatches: cached?.matches?.length ?? 0
    }, "warn");
    appState.odds = appState.odds?.matches?.length
      ? appState.odds
      : cached?.matches?.length ? { ...cached, source: cached.source ?? "cache-stale" } : null;
  } finally {
    appState.oddsLoading = false;
    scheduleNextOddsLoad(getActiveOddsRefreshMs());
  }
}

function scheduleNextOddsLoad(delayMs) {
  clearTimeout(appState.oddsPollTimer);
  appState.oddsPollTimer = setTimeout(loadOdds, Math.max(30000, Number(delayMs) || ODDS_API.refreshMs));
}

function readOddsCache() {
  try {
    const parsed = JSON.parse(localStorage.getItem(ODDS_STORAGE_KEY));
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function writeOddsCache(odds) {
  if (!odds?.matches?.length) return;
  try {
    localStorage.setItem(ODDS_STORAGE_KEY, JSON.stringify({ ...odds, cacheVersion: ODDS_STORAGE_VERSION }));
  } catch {
    // localStorage 不可用时只使用当前会话数据
  }
}

function getOddsCacheRemainingMs(cached) {
  const fetchedAt = new Date(cached?.fetchedAt ?? 0).getTime();
  if (!Number.isFinite(fetchedAt)) return 0;
  return getActiveOddsRefreshMs() - (Date.now() - fetchedAt);
}

function isFreshOddsCache(cached) {
  return cached?.cacheVersion === ODDS_STORAGE_VERSION && Boolean(cached?.matches?.length) && getOddsCacheRemainingMs(cached) > 0;
}

function getActiveOddsRefreshMs() {
  const diff = getNearestKickoffDiffMs();
  if (diff === null) return ODDS_API.refreshMs;
  if (diff <= ODDS_API.nearKickoffWindowMs) return ODDS_API.nearKickoffRefreshMs;
  if (diff <= ODDS_API.midKickoffWindowMs) return ODDS_API.midKickoffRefreshMs;
  return ODDS_API.refreshMs;
}

function getNearestKickoffDiffMs() {
  const now = Date.now();
  let nearest = null;
  getWorldCupMatches().forEach((match) => {
    if (isMatchFinished(match) || ["IN_PLAY", "PAUSED", "POSTPONED"].includes(match.status)) return;
    const kickoff = getMatchKickoffMs(match);
    if (!Number.isFinite(kickoff)) return;
    const diff = kickoff - now;
    if (diff < 0) return;
    if (nearest === null || diff < nearest) nearest = diff;
  });
  return nearest;
}

function getBannerClockDelay(now = Date.now()) {
  let delay = SCHEDULE_API_COOLDOWN_MS;
  getWorldCupMatches().forEach((match) => {
    if (isMatchFinished(match) || ["IN_PLAY", "PAUSED", "POSTPONED"].includes(match.status)) return;
    const kickoff = getMatchKickoffMs(match);
    if (!Number.isFinite(kickoff)) return;
    const diff = kickoff - now;
    if (diff > BANNER_UPCOMING_WINDOW_MS) {
      delay = Math.min(delay, diff - BANNER_UPCOMING_WINDOW_MS);
    } else if (diff > 0) {
      delay = Math.min(delay, diff, BANNER_ACTIVE_REFRESH_MS);
    } else if (diff >= -BANNER_ESTIMATED_LIVE_MS) {
      delay = Math.min(delay, BANNER_ACTIVE_REFRESH_MS);
    }
  });
  return Math.max(1000, Math.min(delay, SCHEDULE_API_COOLDOWN_MS));
}

function getMatchKickoffMs(match) {
  const dateText = match?.date;
  const timeText = String(match?.time ?? "").trim();
  if (!dateText || !timeText || timeText === "--") return NaN;

  const offsetMatch = /^(\d{1,2}):(\d{2})\s*UTC([+-]\d{1,2})$/.exec(timeText);
  if (offsetMatch) {
    const [, hh, mm, offset] = offsetMatch;
    const sign = offset.startsWith("-") ? "-" : "+";
    const abs = String(Math.abs(Number(offset))).padStart(2, "0");
    return new Date(`${dateText}T${hh.padStart(2, "0")}:${mm}:00${sign}${abs}:00`).getTime();
  }

  const beijingMatch = /^(\d{1,2}):(\d{2})$/.exec(timeText);
  if (beijingMatch) {
    const [, hh, mm] = beijingMatch;
    return new Date(`${dateText}T${hh.padStart(2, "0")}:${mm}:00+08:00`).getTime();
  }

  return NaN;
}

function readScheduleCache() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SCHEDULE_CACHE_STORAGE_KEY));
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function writeScheduleCache(schedule) {
  if (!schedule?.matches?.length) return;
  try {
    localStorage.setItem(SCHEDULE_CACHE_STORAGE_KEY, JSON.stringify(schedule));
  } catch {
    // localStorage 不可用时只保留当前会话数据
  }
}

function getScheduleCacheRemainingMs(cached) {
  const fetchedAt = new Date(cached?.fetchedAt ?? 0).getTime();
  if (!Number.isFinite(fetchedAt)) return 0;
  return LINEUP_API.scheduleCacheMaxAgeMs - (Date.now() - fetchedAt);
}

function scheduleNextLiveScheduleLoad(delayMs) {
  clearTimeout(appState.livePollTimer);
  const delay = Math.max(30000, Number(delayMs) || LINEUP_API.scheduleCacheMaxAgeMs);
  appState.livePollTimer = setTimeout(loadLiveSchedule, delay);
}

// 赛程接口冷却：近期比赛与完整赛程共用同一份实时赛程接口，统一 10 分钟心跳。
function getLivePollDelay() {
  if (!LINEUP_API.available) return 0;
  const remaining = getScheduleCacheRemainingMs(appState.liveSchedule);
  return remaining > 0 ? remaining : LINEUP_API.scheduleCacheMaxAgeMs;
}

function isFreshScheduleCache(cached) {
  return Boolean(cached?.matches?.length) && getScheduleCacheRemainingMs(cached) > 0;
}

function getPrediction(teamA, teamB, match = null) {
  if (!teamA || !teamB) return null;
  const scoreA = Number(teamA.finalScore);
  const scoreB = Number(teamB.finalScore);
  if (!Number.isFinite(scoreA) || !Number.isFinite(scoreB)) return null;
  const diff = scoreA - scoreB;
  const leading = getPredictionLeader(diff, teamA, teamB);
  const confidence = getPredictionConfidence(diff);
  const drawConfidence = getDrawConfidence(diff, match);
  const closeMatch = Math.abs(diff) <= CLOSE_MATCH_THRESHOLD;
  return {
    outcome: leading.outcome,
    label: leading.label,
    confidence,
    probability: confidence,
    drawConfidence,
    closeMatch
  };
}

function getPredictionLeader(diff, teamA, teamB) {
  if (diff > 0) return { outcome: "home", label: teamA.name };
  if (diff < 0) return { outcome: "away", label: teamB.name };
  const rankA = Number(teamA.rank);
  const rankB = Number(teamB.rank);
  if (Number.isFinite(rankA) && Number.isFinite(rankB) && rankA !== rankB) {
    return rankA < rankB ? { outcome: "home", label: teamA.name } : { outcome: "away", label: teamB.name };
  }
  return { outcome: "home", label: teamA.name };
}

function getPredictionConfidence(diff) {
  const edge = Math.abs(Number(diff) || 0);
  const scaledEdge = 1 - Math.exp(-edge / WIN_CONFIDENCE_SCALE);
  return Math.max(
    WIN_CONFIDENCE_MIN,
    Math.min(WIN_CONFIDENCE_MAX, WIN_CONFIDENCE_MIN + scaledEdge * (WIN_CONFIDENCE_MAX - WIN_CONFIDENCE_MIN))
  );
}

function getDrawConfidence(diff, match = null) {
  const edge = Math.abs(Number(diff) || 0);
  const closeness = Math.max(0, CLOSE_MATCH_THRESHOLD - edge) / Math.max(1, CLOSE_MATCH_THRESHOLD);
  const maxConfidence = isKnockoutMatch(match)
    ? KNOCKOUT_DRAW_CONFIDENCE_MAX
    : GROUP_STAGE_DRAW_CONFIDENCE_MAX;
  return Math.max(0.18, Math.min(maxConfidence, maxConfidence - 0.08 + closeness * 0.08));
}

function isKnockoutMatch(match) {
  if (!match) return false;
  const group = String(match.group ?? "").trim();
  if (group) return false;
  const roundText = [match.round, match.meta, match.badge].filter(Boolean).join(" ");
  return /(round|16|32|quarter|semi|final|third|淘汰|决赛|半决赛|四分之一|八分之一|32强|16强|8强|4强)/i.test(roundText);
}

function renderPredictionConfidence(prediction) {
  const drawText = prediction.closeMatch
    ? ` · 势均力敌 · 平局信心 ${formatPercent(prediction.drawConfidence)}`
    : "";
  return `看好 ${prediction.label} · 看好信心 ${formatPercent(prediction.confidence)}${drawText}`;
}

function getPredictionText(teamA, teamB, match = null) {
  const prediction = getPrediction(teamA, teamB, match);
  if (!prediction) return "暂无模型评分";
  return `模型预测 ${formatScore(teamA.finalScore)} : ${formatScore(teamB.finalScore)} · ${renderPredictionConfidence(prediction)}`;
}

function getPredictionBadge(match, teamA, teamB) {
  if (!match.resultFinal) return "";
  const prediction = getPrediction(teamA, teamB, match);
  const actual = getScoreOutcome(match.score);
  if (!prediction || !actual) return "";
  if (prediction.outcome === actual) return "预测命中";
  if (actual === "draw" && prediction.closeMatch) return "平局风险命中";
  return "预测未中";
}

function getPredictionResultText(match, teamA, teamB) {
  const prediction = getPrediction(teamA, teamB, match);
  if (!prediction) return "暂无模型评分";
  const actual = getScoreOutcome(match.score ?? match.liveScore);
  const confidenceText = renderPredictionConfidence(prediction);
  if (!match.resultFinal || !actual) {
    return confidenceText;
  }
  const hit = prediction.outcome === actual;
  const outcomeLabel = hit ? "预测命中" : actual === "draw" && prediction.closeMatch ? "平局风险命中" : "预测未中";
  return `${outcomeLabel} · ${confidenceText}`;
}

function getMissingRatingLabel(match, teamA, teamB) {
  const missing = [];
  if (!teamA) missing.push(formatTeamName(match.team1));
  if (!teamB) missing.push(formatTeamName(match.team2));
  return missing.length ? `缺少模型评分：${missing.join("、")}` : "";
}

function getMatchOdds(match) {
  const oddsMatches = appState.odds?.matches ?? [];
  const team1Key = normalizeTeamKey(match.team1);
  const team2Key = normalizeTeamKey(match.team2);
  if (!team1Key || !team2Key) return null;
  const debug = shouldLogOddsMatch(match);
  if (debug) {
    logOddsMatchOnce(match, "开始匹配", {
      match: summarizeMatchForOdds(match),
      oddsSource: appState.odds?.source ?? null,
      oddsFetchedAt: appState.odds?.fetchedAt ?? null,
      oddsCount: oddsMatches.length,
      targetKeys: { team1Key, team2Key },
      candidateSummary: summarizeOddsCandidates(oddsMatches, match.team1, match.team2)
    });
  }

  for (const oddsMatch of oddsMatches) {
    const sameFixture = match.apiFootballFixtureId && getOddsFixtureId(oddsMatch) === Number(match.apiFootballFixtureId);
    const homeName = getOddsHomeName(oddsMatch);
    const awayName = getOddsAwayName(oddsMatch);
    const homeKey = normalizeTeamKey(homeName);
    const awayKey = normalizeTeamKey(awayName);
    const sameOrder = homeKey === team1Key && awayKey === team2Key;
    const reverseOrder = homeKey === team2Key && awayKey === team1Key;
    if (!sameFixture && !sameOrder && !reverseOrder) continue;

    const h2h = getFirstH2hMarket(oddsMatch);
    if (!h2h) {
      if (debug) {
        logOddsMatchOnce(match, `命中候选但没有H2H市场:${getOddsFixtureId(oddsMatch) ?? "no-fixture"}`, {
          oddsMatch: summarizeOddsMatch(oddsMatch),
          bookmakers: (oddsMatch.bookmakers ?? []).map((bookmaker) => ({
            name: bookmaker.name ?? bookmaker.title ?? bookmaker.key ?? "",
            bets: (bookmaker.bets ?? []).map((bet) => ({ id: bet.id, name: bet.name, values: bet.values?.length ?? 0 })),
            markets: (bookmaker.markets ?? []).map((market) => ({ key: market.key, outcomes: market.outcomes?.length ?? 0 }))
          }))
        }, "warn");
      }
      continue;
    }
    const homePrice = h2h.apiFootball ? getOutcomePrice(h2h, "Home") : getOutcomePrice(h2h, homeName);
    const awayPrice = h2h.apiFootball ? getOutcomePrice(h2h, "Away") : getOutcomePrice(h2h, awayName);
    const drawPrice = getOutcomePrice(h2h, "Draw");
    const odds = {
      home: sameFixture || sameOrder ? homePrice : awayPrice,
      draw: drawPrice,
      away: sameFixture || sameOrder ? awayPrice : homePrice,
      bookmaker: h2h.bookmaker,
      updatedAt: oddsMatch.update ?? oddsMatch.bookmakers?.[0]?.last_update ?? oddsMatch.commence_time
    };
    if (debug) {
      logOddsMatchOnce(match, "匹配成功", {
        oddsMatch: summarizeOddsMatch(oddsMatch),
        h2h,
        renderedOdds: odds
      });
    }
    return odds;
  }

  if (debug) {
    logOddsMatchOnce(match, "未匹配到赔率", {
      match: summarizeMatchForOdds(match),
      oddsSource: appState.odds?.source ?? null,
      oddsFetchedAt: appState.odds?.fetchedAt ?? null,
      oddsCount: oddsMatches.length,
      candidateSummary: summarizeOddsCandidates(oddsMatches, match.team1, match.team2)
    }, "warn");
  }
  return null;
}

function shouldLogOddsMatch(match) {
  if (isOddsDebugEnabled()) return true;
  const keys = [normalizeTeamKey(match?.team1), normalizeTeamKey(match?.team2)];
  return keys.includes("canada") && keys.includes("bosnia and herzegovina");
}

function isOddsDebugEnabled() {
  try {
    return localStorage.getItem(ODDS_DEBUG_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function logOddsEvent(message, payload = {}, level = "info") {
  const logger = level === "warn" ? console.warn : console.info;
  logger(`[odds] ${message}`, payload);
}

function logOddsMatchOnce(match, step, payload = {}, level = "info") {
  const key = [
    normalizeTeamKey(match?.team1),
    normalizeTeamKey(match?.team2),
    appState.odds?.fetchedAt ?? "no-odds",
    appState.odds?.matches?.length ?? 0,
    step
  ].join("|");
  if (oddsDebugLogKeys.has(key)) return;
  oddsDebugLogKeys.add(key);
  logOddsEvent(`${match?.team1 ?? "--"} vs ${match?.team2 ?? "--"} · ${step}`, payload, level);
}

function summarizeMatchForOdds(match) {
  return {
    date: match?.date,
    time: match?.time,
    status: match?.status,
    team1: match?.team1,
    team2: match?.team2,
    team1Key: normalizeTeamKey(match?.team1),
    team2Key: normalizeTeamKey(match?.team2),
    apiFootballFixtureId: match?.apiFootballFixtureId ?? null,
    finished: isMatchFinished(match)
  };
}

function summarizeOddsCandidates(oddsMatches, teamA, teamB) {
  const targetKeys = [normalizeTeamKey(teamA), normalizeTeamKey(teamB)];
  return (oddsMatches ?? [])
    .map(summarizeOddsMatch)
    .filter((item) => {
      const keys = [item.homeKey, item.awayKey];
      return targetKeys.some((key) => keys.includes(key)) ||
        keys.some((key) => key.includes("canada") || key.includes("bosnia"));
    })
    .slice(0, 12);
}

function summarizeOddsMatch(oddsMatch) {
  const homeName = getOddsHomeName(oddsMatch);
  const awayName = getOddsAwayName(oddsMatch);
  return {
    fixtureId: getOddsFixtureId(oddsMatch),
    fixtureDate: oddsMatch?.fixture?.date ?? oddsMatch?.fixture_date ?? null,
    homeName,
    awayName,
    homeKey: normalizeTeamKey(homeName),
    awayKey: normalizeTeamKey(awayName),
    bookmakers: (oddsMatch?.bookmakers ?? []).length,
    firstBookmaker: oddsMatch?.bookmakers?.[0]?.name ?? oddsMatch?.bookmakers?.[0]?.title ?? null,
    betNames: (oddsMatch?.bookmakers ?? [])
      .flatMap((bookmaker) => bookmaker.bets ?? [])
      .slice(0, 5)
      .map((bet) => `${bet.id ?? ""}:${bet.name ?? ""}`)
  };
}

function getOddsFixtureId(oddsMatch) {
  const id = Number(oddsMatch?.fixture?.id ?? oddsMatch?.fixture_id ?? oddsMatch?.id);
  return Number.isFinite(id) ? id : null;
}

function getOddsHomeName(oddsMatch) {
  return oddsMatch?.home_team || oddsMatch?.teams?.home?.name || oddsMatch?.homeTeam?.name || "";
}

function getOddsAwayName(oddsMatch) {
  return oddsMatch?.away_team || oddsMatch?.teams?.away?.name || oddsMatch?.awayTeam?.name || "";
}

function getFirstH2hMarket(oddsMatch) {
  for (const bookmaker of oddsMatch.bookmakers ?? []) {
    const apiFootballBet = (bookmaker.bets ?? []).find((item) => {
      const name = String(item.name ?? "").toLowerCase();
      return Number(item.id) === 1 || name.includes("match winner") || name.includes("1x2");
    });
    if (apiFootballBet?.values?.length) {
      return {
        apiFootball: true,
        bookmaker: bookmaker.name ?? "API-Football",
        outcomes: apiFootballBet.values.map((item) => ({
          name: item.value,
          price: Number(item.odd)
        }))
      };
    }

    const market = (bookmaker.markets ?? []).find((item) => item.key === "h2h" && item.outcomes?.length);
    if (market) return { ...market, bookmaker: bookmaker.title ?? bookmaker.key ?? "Odds" };
  }
  return null;
}

function getOutcomePrice(market, name) {
  const key = normalizeTeamKey(name);
  const outcome = (market.outcomes ?? []).find((item) => normalizeTeamKey(item.name) === key);
  return Number.isFinite(Number(outcome?.price)) ? Number(outcome.price) : null;
}

function renderOddsText(match) {
  if (isMatchFinished(match)) return "";
  const odds = getMatchOdds(match);
  if (!odds) return "";
  const parts = [
    ["主", odds.home],
    ["平", odds.draw],
    ["客", odds.away]
  ]
    .filter(([, value]) => value !== null)
    .map(([label, value]) => `${label} ${Number(value).toFixed(2)}`);
  return parts.length ? parts.join(" / ") : "";
}

function getScoreOutcome(scoreText) {
  const match = /^\s*(\d+)\s*[:：]\s*(\d+)\s*$/.exec(String(scoreText ?? ""));
  if (!match) return "";
  const home = Number(match[1]);
  const away = Number(match[2]);
  if (home === away) return "draw";
  return home > away ? "home" : "away";
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
  persistFinishedHomeResults(source.filter((match) => match.status === "FINISHED"));
  const liveMatches = source.filter((match) => ["IN_PLAY", "PAUSED"].includes(match.status));
  const finishedSaved = readFinishedHomeResults();
  const finishedRecent = mergeFinishedMatches(
    source.filter((match) => match.status === "FINISHED"),
    finishedSaved
  ).sort((a, b) => compareBannerKickoff(b, a));
  const upcoming = source
    .filter((match) => ["SCHEDULED", "TIMED"].includes(match.status))
    .filter((match) => !today || match.date >= today)
    .sort(compareBannerKickoff);

  const upcomingToday = upcoming.filter((match) => match.date === today);
  const upcomingVisible = (upcomingToday.length ? upcomingToday : upcoming)
    .slice(0, Math.max(0, HOME_ACTIVE_MATCH_LIMIT - liveMatches.length));
  const finishedVisible = finishedRecent.slice(0, HOME_FINISHED_MATCH_LIMIT);

  return [...liveMatches, ...upcomingVisible, ...finishedVisible]
    .sort((a, b) => {
      const priority = { IN_PLAY: 0, PAUSED: 0, TIMED: 1, SCHEDULED: 1, FINISHED: 2 };
      const priorityDiff = (priority[a.status] ?? 9) - (priority[b.status] ?? 9);
      if (priorityDiff) return priorityDiff;
      if (a.status === "FINISHED" && b.status === "FINISHED") return compareBannerKickoff(b, a);
      return compareBannerKickoff(a, b);
    });
}

function persistFinishedHomeResults(matches) {
  if (!matches.length) return;
  try {
    const merged = mergeFinishedMatches(matches, readFinishedHomeResults())
      .sort((a, b) => compareBannerKickoff(b, a))
      .slice(0, 24);
    localStorage.setItem(FINISHED_HOME_RESULTS_STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // localStorage 不可用时只在当前实时数据里展示
  }
}

function readFinishedHomeResults() {
  try {
    const parsed = JSON.parse(localStorage.getItem(FINISHED_HOME_RESULTS_STORAGE_KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function mergeFinishedMatches(primary, secondary) {
  const byKey = new Map();
  [...secondary, ...primary].forEach((match) => {
    if (!match || match.status !== "FINISHED") return;
    byKey.set(getMatchStorageKey(match), {
      beijing: true,
      date: match.date ?? "--",
      time: match.time ?? "--",
      team1: match.team1 ?? "--",
      team2: match.team2 ?? "--",
      round: match.round ?? "",
      group: match.group ?? "",
      ground: match.ground ?? "",
      city: match.city ?? "",
      liveScore: match.liveScore ?? match.score ?? null,
      status: "FINISHED",
      apiFootballFixtureId: match.apiFootballFixtureId ?? null
    });
  });
  return [...byKey.values()];
}

function getMatchStorageKey(match) {
  return [
    match.apiFootballFixtureId || match.date,
    normalizeTeamKey(match.team1),
    normalizeTeamKey(match.team2)
  ].join("|");
}

function compareBannerKickoff(a, b) {
  return `${a.date ?? ""} ${a.time ?? ""}`.localeCompare(`${b.date ?? ""} ${b.time ?? ""}`);
}

function getBannerMatchStatus(match) {
  if (match.status === "PAUSED") return { label: "中场休息", className: "is-live" };
  if (match.status === "IN_PLAY") return { label: "比赛进行中", className: "is-live" };
  if (match.status === "FINISHED") return { label: "赛果", className: "is-finished" };
  const kickoff = getMatchKickoffMs(match);
  if (!Number.isFinite(kickoff)) return { label: "预期赛事", className: "is-expected" };
  const diff = kickoff - Date.now();
  if (diff > BANNER_UPCOMING_WINDOW_MS) return { label: "预期赛事", className: "is-expected" };
  if (diff > 0) return { label: "即将开赛", className: "is-upcoming" };
  if (diff >= -BANNER_ESTIMATED_LIVE_MS) return { label: "预计进行中", className: "is-estimated-live" };
  return { label: "等待赛果", className: "is-awaiting-result" };
}

function liveMatchToLocal(match) {
  if (match?.fixture && match?.teams) return apiFootballFixtureToLocal(match);

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
    status: match.status ?? "",
    apiFootballFixtureId: match.apiFootballFixtureId ?? null
  };
}

function isMatchFinished(match) {
  return match?.status === "FINISHED" || Boolean(match?.resultFinal);
}

function normalizeApiFootballResponse(data) {
  if (Array.isArray(data?.response)) return data.response;
  if (Array.isArray(data?.matches)) return data.matches;
  if (Array.isArray(data)) return data;
  return [];
}

function apiFootballFixtureToLocal(match) {
  const fixture = match.fixture ?? {};
  const status = normalizeApiFootballStatus(fixture.status?.short);
  const beijing = beijingParts(fixture.date);
  const homeScore = match.goals?.home;
  const awayScore = match.goals?.away;
  const hasScore = homeScore !== null && homeScore !== undefined && awayScore !== null && awayScore !== undefined;
  return {
    beijing: true,
    date: beijing?.date ?? String(fixture.date ?? "").slice(0, 10),
    time: beijing?.time ?? "--",
    team1: match.teams?.home?.name ?? "--",
    team2: match.teams?.away?.name ?? "--",
    round: normalizeApiFootballRound(match.league?.round),
    group: normalizeApiFootballGroup(match.league?.round),
    ground: fixture.venue?.name ?? "",
    city: fixture.venue?.city ?? "",
    liveScore: hasScore ? `${homeScore} : ${awayScore}` : null,
    status,
    apiFootballFixtureId: fixture.id ?? null
  };
}

function normalizeApiFootballStatus(shortStatus) {
  const code = String(shortStatus ?? "").toUpperCase();
  if (["1H", "2H", "ET", "BT", "P", "LIVE", "INT"].includes(code)) return "IN_PLAY";
  if (code === "HT") return "PAUSED";
  if (["FT", "AET", "PEN"].includes(code)) return "FINISHED";
  if (["NS", "TBD"].includes(code)) return "SCHEDULED";
  if (["PST", "CANC", "ABD", "AWD", "WO"].includes(code)) return "POSTPONED";
  return code || "";
}

function normalizeApiFootballRound(round) {
  const value = String(round ?? "");
  if (/final/i.test(value) && !/semi/i.test(value)) return "决赛";
  if (/semi/i.test(value)) return "半决赛";
  if (/quarter/i.test(value)) return "1/4决赛";
  if (/16/.test(value)) return "1/8决赛";
  if (/32/.test(value)) return "1/16决赛";
  if (/group/i.test(value)) return "小组赛";
  return value;
}

function normalizeApiFootballGroup(round) {
  const match = /group\s+([A-L])/i.exec(String(round ?? ""));
  return match ? `Group ${match[1].toUpperCase()}` : "";
}

function getSelectedTeam() {
  const teams = rankTeams(appState.teams);
  return teams.find((item) => item.id === appState.selectedId) ?? teams[0] ?? null;
}

async function tryLiveLineup(team) {
  try {
    const fixturePayload = appState.liveSchedule?.matches?.length
      ? { response: appState.liveSchedule.matches }
      : await lineupApiGet(`/worldcup/fixtures`);
    const candidates = normalizeApiFootballResponse(fixturePayload)
      .filter((match) => matchInvolvesTeam(match, team))
      .filter((match) => ["IN_PLAY", "PAUSED", "FINISHED"].includes(liveMatchToLocal(match).status))
      .sort((a, b) => String(b.fixture?.date ?? b.utcDate ?? "").localeCompare(String(a.fixture?.date ?? a.utcDate ?? "")));

    for (const match of candidates.slice(0, 2)) {
      const fixtureId = match.fixture?.id ?? match.id;
      if (!fixtureId) continue;
      const detail = await lineupApiGet(`/fixtures/lineups?fixture=${encodeURIComponent(fixtureId)}`);
      const lineup = pickApiFootballLineup(detail, team);
      if (lineup.length >= 11) {
        return lineup.slice(0, 11).map((player) => ({
          position: translateLineupPosition(player.pos ?? player.position),
          name: zhPlayerName(player.name) ?? player.name ?? "未知",
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
      cache: "no-store",
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
  if (match?.teams) {
    return (
      normalizeTeamKey(match.teams.home?.name) === key ||
      normalizeTeamKey(match.teams.away?.name) === key
    );
  }
  return (
    normalizeTeamKey(match.homeTeam?.name) === key ||
    normalizeTeamKey(match.awayTeam?.name) === key
  );
}

function pickApiFootballLineup(lineupPayload, team) {
  const key = normalizeTeamKey(team.nameEn);
  const side = normalizeApiFootballResponse(lineupPayload).find((item) => normalizeTeamKey(item.team?.name) === key);
  return (side?.startXI ?? []).map((item) => item.player ?? item).filter(Boolean);
}

function translateLineupPosition(position) {
  const map = {
    G: "门将",
    D: "后卫",
    M: "中场",
    F: "前锋",
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

function saveLineupCache(teamId, lineup, meta = {}) {
  const entry = { savedAt: new Date().toISOString(), ...meta, lineup };
  try {
    localStorage.setItem(
      `${LINEUP_API.cachePrefix}${teamId}`,
      JSON.stringify(entry)
    );
  } catch {
    // localStorage 不可用时忽略缓存
  }
  return entry;
}

function getMatchLineupBasisMs(match) {
  const kickoff = getMatchKickoffMs(match);
  if (Number.isFinite(kickoff)) return kickoff;
  const dateMs = new Date(match?.date ?? 0).getTime();
  return Number.isFinite(dateMs) ? dateMs : Date.now();
}

function shouldSaveTeamLineupBasis(teamId, match) {
  const cached = readLineupCache(teamId);
  if (!cached?.lineup?.length) return true;
  if (!["actual-match", "match-lineup"].includes(cached.source)) return true;
  const cachedBasisMs = Number(cached.basisMatchMs);
  if (!Number.isFinite(cachedBasisMs)) return true;
  return getMatchLineupBasisMs(match) >= cachedBasisMs;
}

function saveTeamLineupBasis(team, lineup, match, side, phase, savedAt) {
  if (!team?.id || !lineup?.length || !shouldSaveTeamLineupBasis(team.id, match)) return null;
  const entry = saveLineupCache(team.id, lineup, {
    savedAt,
    source: phase === "post" ? "actual-match" : "match-lineup",
    basisMatchKey: matchLineupKey(match),
    basisMatchMs: getMatchLineupBasisMs(match),
    basisMatchDate: match.date ?? "",
    basisMatchSide: side
  });
  applyTeamLineup(team.id, lineup, {
    savedAt: entry.savedAt,
    source: entry.source
  });
  return entry;
}

function readLineupCache(teamId) {
  try {
    const raw = localStorage.getItem(`${LINEUP_API.cachePrefix}${teamId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function findTeamByName(name) {
  const key = normalizeTeamKey(name);
  if (!key || key === "--") return null;
  const ranked = rankTeams(appState.teams);
  return ranked.find((team) => normalizeTeamKey(team.nameEn) === key) ?? null;
}

const TEAM_LINEUP_RETRY_MS = 5 * 60 * 1000;
const teamLineupRequests = new Map();

function applyLineupAdjustmentToTeam(team, lineup, entry = {}) {
  if (!Array.isArray(lineup) || !lineup.length) return null;
  if (entry.savedAt && team.lineupCacheSavedAt === entry.savedAt) return team;
  const adjusted = recomputeWithLineup(team, lineup);
  if (!adjusted) return null;
  return {
    ...adjusted,
    startingXI: fillStartingXI(lineup.map(normalizeLineupPlayer)),
    lineupCacheSavedAt: entry.savedAt ?? null,
    lineupSource: entry.source ?? "cache"
  };
}

function applyTeamLineup(teamId, lineup, entry = {}) {
  let nextTeam = null;
  let changed = false;
  const nextTeams = appState.teams.map((team) => {
    if (team.id !== teamId) return team;
    const adjusted = applyLineupAdjustmentToTeam(team, lineup, entry);
    nextTeam = adjusted ?? team;
    if (adjusted && adjusted !== team) {
      changed = true;
      return adjusted;
    }
    return team;
  });
  if (changed) appState.teams = nextTeams;
  return { team: nextTeam, changed };
}

function applySavedLineupsToTeams() {
  appState.teams = appState.teams.map((team) => {
    const cached = readLineupCache(team.id);
    if (!cached?.lineup?.length) return team;
    return applyLineupAdjustmentToTeam(team, cached.lineup, {
      savedAt: cached.savedAt,
      source: "cache"
    }) ?? team;
  });
}

// 队伍级出场名单：先读持久化缓存；没有缓存时才请求一次实时名单。
// 成功保存后立即把 appState.teams 中对应队伍替换为按该名单重算后的版本。
async function ensureTeamLineup(team) {
  if (!team?.id) return null;

  const cached = readLineupCache(team.id);
  if (cached?.lineup?.length) {
    const applied = applyTeamLineup(team.id, cached.lineup, {
      savedAt: cached.savedAt,
      source: "cache"
    });
    return { source: "cache", ...cached, team: applied.team, adjusted: Boolean(applied.team?.lineupCacheSavedAt) };
  }

  if (!LINEUP_API.available) return null;

  const pending = teamLineupRequests.get(team.id);
  if (pending?.promise) return pending.promise;
  if (pending && Date.now() - pending.at < TEAM_LINEUP_RETRY_MS) return null;

  const promise = (async () => {
    const live = await tryLiveLineup(team).catch(() => null);
    if (!live?.length) return null;
    const entry = saveLineupCache(team.id, live);
    const applied = applyTeamLineup(team.id, live, {
      savedAt: entry.savedAt,
      source: "live"
    });
    return {
      source: "live",
      savedAt: entry.savedAt,
      lineup: live,
      team: applied.team,
      adjusted: Boolean(applied.team?.lineupCacheSavedAt)
    };
  })();

  teamLineupRequests.set(team.id, { at: Date.now(), promise });
  try {
    return await promise;
  } finally {
    teamLineupRequests.set(team.id, { at: Date.now() });
  }
}

// 异步拉两队实时首发：成功则替换显示并按真实首发重算评分，失败回退缓存/本地
// 用实时首发重算评分：实际首发权重设为 1，其余降为替补（保留深度信号）。
// 然后按建模脚本同样的口径，用新的出场权重对全体球员加权，重算
// environment / age / cohesion 三个维度（performance 是球队层面战绩，与首发无关，保持不变）。
// 保护逻辑：实时名单异常或与模型库匹配过少时返回 null，调用方据此回退到预测评分。
function recomputeWithLineup(team, lineup) {
  const players = Array.isArray(team.players) ? team.players : [];
  if (!players.length) return null;

  const starterKeys = new Set(
    (lineup ?? [])
      .filter((item) => !item.placeholder)
      .flatMap((item) => [normalizeTeamKey(item.name), normalizeTeamKey(item.nameEn)])
      .filter(Boolean)
  );
  if (starterKeys.size < 8) return null;

  let matched = 0;
  const adjustedPlayers = players.map((person) => {
    const isStarter =
      starterKeys.has(normalizeTeamKey(person.nameEn)) || starterKeys.has(normalizeTeamKey(person.name));
    if (isStarter) matched += 1;
    // 实际首发=1.0；其余取原权重与 0.55 的较小值（被弃用的预测主力降为可用替补，深替仍 0.2）
    const weight = isStarter ? 1 : Math.min(Number(person.appearanceWeight ?? 0.2), 0.55);
    return { ...person, appearanceWeight: weight };
  });

  // 匹配过少说明命名对不上，强行改会把已知主力全判替补，得出离谱评分 → 放弃修正
  if (matched < 8) return null;

  const dimensions = {
    ...team.dimensions,
    environment: weightedAverageBy(adjustedPlayers, "environmentScore", team.dimensions.environment),
    age: weightedAverageBy(adjustedPlayers, "ageScore", team.dimensions.age),
    cohesion: computeCohesionScore(adjustedPlayers, team.dimensions.cohesion)
  };
  const environmentBreakdown = {
    leagueStrength: weightedAverageBy(adjustedPlayers, "leagueStrength", team.environmentBreakdown.leagueStrength),
    clubCompetitiveness: weightedAverageBy(adjustedPlayers, "clubCompetitiveness", team.environmentBreakdown.clubCompetitiveness),
    roleStability: weightedAverageBy(adjustedPlayers, "roleStability", team.environmentBreakdown.roleStability)
  };

  const adjusted = withScores({ ...team, players: adjustedPlayers, dimensions, environmentBreakdown });
  return { ...adjusted, rank: team.rank, lineupMatched: matched };
}

// 按出场权重加权球员某字段（移植自建模脚本 weighted_average）。
// 字段覆盖不足（如默认样例队缺少该字段）时回退到原维度值，避免算出偏差。
function weightedAverageBy(players, key, fallback) {
  let total = 0;
  let weight = 0;
  let covered = 0;
  players.forEach((person) => {
    const value = Number(person[key]);
    const personWeight = Number(person.appearanceWeight ?? 0);
    if (Number.isFinite(value) && personWeight > 0) {
      total += value * personWeight;
      weight += personWeight;
      covered += personWeight;
    }
  });
  const allWeight = players.reduce((sum, person) => sum + Number(person.appearanceWeight ?? 0), 0);
  if (!weight || (allWeight && covered / allWeight < 0.6)) return fallback;
  return clamp(total / weight);
}

// 阵容协同经验（移植自建模脚本 calculate_cohesion）：基于首发+轮换两两配对，
// 用国家队同框（受同代上限约束的共同出场场次代理）与俱乐部/联赛熟悉度估算。
function computeCohesionScore(players, fallback) {
  const pool = players.filter((person) => Number(person.appearanceWeight ?? 0) >= 0.55);
  if (pool.length < 2 || pool.some((person) => !Number.isFinite(Number(person.caps)))) return fallback;

  let weightedPairs = 0;
  let national = 0;
  let club = 0;
  for (let i = 0; i < pool.length; i += 1) {
    for (let j = i + 1; j < pool.length; j += 1) {
      const a = pool[i];
      const b = pool[j];
      const pairWeight = Number(a.appearanceWeight) * Number(b.appearanceWeight);
      weightedPairs += pairWeight;

      const yearsOverlap = Math.max(0.5, Math.min(Number(a.age), Number(b.age)) - 19);
      const maxSharedCaps = yearsOverlap * 9;
      const capsOverlap = Math.min(Number(a.caps), Number(b.caps), maxSharedCaps);
      national += pairWeight * Math.min(100, (Math.log1p(capsOverlap) / Math.log1p(90)) * 100);

      if (a.clubEn && a.clubEn === b.clubEn) {
        club += pairWeight * 100;
      } else if (a.leagueCode && a.leagueCode === b.leagueCode && a.leagueCode !== "UNK") {
        club += pairWeight * 20;
      }
    }
  }
  if (!weightedPairs) return fallback;
  const nationalScore = national / weightedPairs;
  const clubScore = club / weightedPairs;
  const historicalScore = nationalScore * 0.4;
  return clamp(nationalScore * 0.75 + clubScore * 0.2 + historicalScore * 0.05);
}

function getRecentMatchRows() {
  const liveFinished = (appState.liveSchedule?.matches ?? [])
    .map(liveMatchToLocal)
    .filter((match) => ["FINISHED", "IN_PLAY", "PAUSED"].includes(match.status))
    .map((match) => ({
      kind: "recent",
      date: match.date,
      time: match.status === "FINISHED" ? "赛果" : "进行中",
      team1: match.team1,
      team2: match.team2,
      score: match.liveScore ?? "vs",
      meta: ["世界杯", match.round, match.group].filter(Boolean).join(" · "),
      badge: "世界杯",
      resultFinal: match.status === "FINISHED",
      group: match.group ?? "",
      place: formatVenueName(match.ground),
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
      resultFinal: true,
      group: "",
      place: formatVenueName([match.city, match.country].filter(Boolean).join(" · ")),
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
      resultFinal: match.status === "FINISHED",
      group: match.group ?? "",
      place: formatVenueName(match.ground),
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
  if (appState.liveSchedule?.source === "live") return "实时 · API-Football";
  if (appState.liveSchedule?.source === "cache") return "缓存";
  return "本地数据";
}

function formatTeamName(name) {
  const team = appState.teams.find((item) => normalizeTeamKey(item.nameEn) === normalizeTeamKey(name));
  return team ? `${team.flag} ${team.name}` : String(name ?? "--");
}

function formatVenueName(name) {
  const value = String(name ?? "").trim();
  if (!value) return "地点未标注";
  if (VENUE_ZH_LABELS[value]) return VENUE_ZH_LABELS[value];
  if (value.includes(" · ")) {
    return value.split(" · ").map((part) => VENUE_ZH_LABELS[part] ?? part).join(" · ");
  }
  return value;
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

function shortTier(item) {
  const weight = Number(item.appearanceWeight ?? 0);
  if (weight >= 1) return "主力 1.0";
  if (weight >= 0.55) return "轮换 0.55";
  if (weight > 0) return "替补 0.2";
  return String(item.tier ?? "--");
}

function loadPublicData() {
  return window.WORLD_CUP_PUBLIC_DATA && typeof window.WORLD_CUP_PUBLIC_DATA === "object"
    ? window.WORLD_CUP_PUBLIC_DATA
    : null;
}

function loadClubPlayerStats() {
  return window.WORLD_CUP_CLUB_PLAYER_STATS && typeof window.WORLD_CUP_CLUB_PLAYER_STATS === "object"
    ? window.WORLD_CUP_CLUB_PLAYER_STATS
    : { players: [] };
}

function buildClubPlayerStatsIndex(payload) {
  const index = new Map();
  for (const item of payload?.players ?? []) {
    [item.playerEn, item.player].filter(Boolean).forEach((name) => {
      const key = normalizeTeamKey(name);
      if (key && !index.has(key)) index.set(key, item);
    });
  }
  return index;
}

function getClubPlayerStats(player) {
  return clubPlayerStatsIndex.get(normalizeTeamKey(player.nameEn)) ??
    clubPlayerStatsIndex.get(normalizeTeamKey(player.name)) ??
    null;
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

  // 独立强度锚：World Football Elo（跨洲校准）。把它按“结果评分”的均值/标准差对齐到同一量纲后，
  // 混入对手系数，打破纯结果 SOS 的“区域弱池自循环”。只用于估对手强度，不直接计入球队自身战绩分。
  const eloByKey = new Map(
    Object.entries(eloRatings).map(([name, value]) => [normalizeTeamKey(name), Number(value)])
  );
  const eloAligned = (() => {
    const paired = [...ratings.keys()]
      .map((teamName) => ({ teamName, elo: eloByKey.get(normalizeTeamKey(teamName)) }))
      .filter((row) => Number.isFinite(row.elo));
    if (paired.length < 8) return new Map(); // Elo 覆盖太少则不启用，退回纯结果 SOS
    const resultVals = paired.map((row) => ratings.get(row.teamName));
    const eloVals = paired.map((row) => row.elo);
    const meanOf = (arr) => arr.reduce((sum, x) => sum + x, 0) / arr.length;
    const stdOf = (arr, m) => Math.sqrt(arr.reduce((sum, x) => sum + (x - m) ** 2, 0) / arr.length) || 1;
    const mr = meanOf(resultVals);
    const sr = stdOf(resultVals, mr);
    const me = meanOf(eloVals);
    const se = stdOf(eloVals, me);
    const aligned = new Map();
    paired.forEach((row) => aligned.set(row.teamName, clamp(mr + ((row.elo - me) / se) * sr)));
    return aligned;
  })();
  const ELO_ANCHOR = 0.4; // 对手强度 = 结果自举 0.6 + Elo 锚 0.4

  for (let round = 0; round < 4; round += 1) {
    const strengthOf = (teamName) => {
      const result = ratings.get(teamName) ?? 50;
      const elo = eloAligned.get(teamName);
      return Number.isFinite(elo) ? result * (1 - ELO_ANCHOR) + elo * ELO_ANCHOR : result;
    };
    const factorOf = (teamName) => 0.6 + (strengthOf(teamName) / 100) * 0.8;
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
  const playerParticipation = calculatePlayerParticipationStrength(team);
  const performance = index?.teams.get(normalizeTeamKey(team.nameEn));
  const calibratedTeamResults = performance
    ? calibratePublicPerformance(team, performance.score)
    : Number(team.dimensions?.performance ?? playerParticipation);
  // 实际近期战绩（已含跨洲 Elo 锚的 SOS）占比从 0.3 提到 0.4，让“打了谁、赢没赢”更有发言权。
  const blendedPerformance = clamp(playerParticipation * 0.6 + calibratedTeamResults * 0.4);

  return {
    ...team,
    dimensions: {
      ...team.dimensions,
      performance: blendedPerformance
    },
    performanceBreakdown: {
      ...(performance?.breakdown ?? {}),
      playerParticipation,
      teamResults: calibratedTeamResults,
      rawPublicScore: performance?.score ?? null,
      blendedScore: blendedPerformance
    },
    publicPerformance: performance ?? null
  };
}

function applyClubDataAdjustments(team) {
  const players = Array.isArray(team.players) ? team.players : [];
  if (!players.length) return team;

  const clubStatsCoverage = calculateClubStatsCoverage(players);
  const clubCohesionAdjustment = calculateClubDataCohesionAdjustment(team);
  if (!clubStatsCoverage && !clubCohesionAdjustment) return team;

  const adjustedCohesion = clamp(Number(team.dimensions?.cohesion ?? 0) + clubCohesionAdjustment);
  return {
    ...team,
    dimensions: {
      ...team.dimensions,
      cohesion: adjustedCohesion
    },
    cohesionBreakdown: {
      ...team.cohesionBreakdown,
      club: clamp(Number(team.cohesionBreakdown?.club ?? 0) + clubCohesionAdjustment * 2.5),
      clubDataAdjustment: clubCohesionAdjustment,
      clubStatsCoverage
    },
    performanceBreakdown: {
      ...team.performanceBreakdown,
      clubStatsCoverage
    }
  };
}

function calculatePlayerParticipationStrength(team) {
  const players = Array.isArray(team.players) ? team.players : [];
  if (!players.length) return Number(team.dimensions?.environment ?? 0);

  let total = 0;
  let weight = 0;
  players.forEach((player) => {
    const roleWeight = getPlayerParticipationWeight(player);
    const environment = Number(player.environmentScore ?? team.dimensions?.environment ?? 0);
    const league = Number(player.leagueStrength ?? environment);
    const club = Number(player.clubCompetitiveness ?? environment);
    const stability = Number(player.roleStability ?? environment);
    const clubPerformanceAdjustment = getClubPerformanceAdjustment(player);
    const participationScore = clamp(
      environment * 0.2 +
        league * 0.3 +
        club * 0.25 +
        stability * 0.25 +
        getClubRoleAdjustment(club, stability) +
        clubPerformanceAdjustment * 0.9
    );
    total += participationScore * roleWeight;
    weight += roleWeight;
  });

  return weight ? clamp(total / weight) : Number(team.dimensions?.environment ?? 0);
}

function getPlayerParticipationWeight(player) {
  const nationalRole = Math.max(0.15, Number(player.appearanceWeight ?? 0.2));
  const stability = Number(player.roleStability ?? player.environmentScore ?? 70);
  const clubRoleMultiplier =
    stability >= 88 ? 1.08 :
    stability >= 82 ? 1 :
    stability >= 76 ? 0.86 :
    stability >= 68 ? 0.68 :
    0.5;
  return nationalRole * clubRoleMultiplier * getClubDataWeightMultiplier(player);
}

function getClubRoleAdjustment(clubCompetitiveness, roleStability) {
  const club = Number(clubCompetitiveness);
  const role = Number(roleStability);
  let adjustment =
    club >= 92 ? 3 :
    club >= 86 ? 1.5 :
    club >= 78 ? 0 :
    club >= 68 ? -2 :
    -5;

  if (club >= 90 && role < 76) adjustment -= 4;
  if (club < 78 && role >= 86) adjustment += 1.5;
  return adjustment;
}

function calculateClubStatsCoverage(players) {
  const relevant = players.filter((player) => Number(player.appearanceWeight ?? 0) >= 0.55);
  if (!relevant.length) return 0;
  const coveredWeight = relevant.reduce((sum, player) => {
    const hasMetrics = Boolean(getClubPlayerStats(player)?.latestSeason?.metrics);
    return sum + (hasMetrics ? Number(player.appearanceWeight ?? 0) : 0);
  }, 0);
  const totalWeight = relevant.reduce((sum, player) => sum + Number(player.appearanceWeight ?? 0), 0);
  return totalWeight ? coveredWeight / totalWeight : 0;
}

function calculateClubDataCohesionAdjustment(team) {
  const players = (team.players ?? []).filter((player) => Number(player.appearanceWeight ?? 0) >= 0.55);
  if (players.length < 2) return 0;

  let weightedPairs = 0;
  let actualClubScore = 0;
  let coveredPairs = 0;

  for (let i = 0; i < players.length; i += 1) {
    for (let j = i + 1; j < players.length; j += 1) {
      const a = players[i];
      const b = players[j];
      const aStats = getClubPlayerStats(a)?.latestSeason;
      const bStats = getClubPlayerStats(b)?.latestSeason;
      if (!aStats?.metrics || !bStats?.metrics) continue;

      const pairWeight = Number(a.appearanceWeight ?? 0) * Number(b.appearanceWeight ?? 0);
      const aMinutes = metricNumber(aStats.metrics.minutes);
      const bMinutes = metricNumber(bStats.metrics.minutes);
      const activeMultiplier = Math.min(1, Math.min(aMinutes, bMinutes) / 1200);
      const sameTeam =
        aStats.teamId && bStats.teamId
          ? aStats.teamId === bStats.teamId
          : normalizeTeamKey(aStats.teamName) === normalizeTeamKey(bStats.teamName);
      const sameLeague =
        aStats.leagueId && bStats.leagueId
          ? aStats.leagueId === bStats.leagueId
          : normalizeTeamKey(aStats.leagueName) === normalizeTeamKey(bStats.leagueName);

      let pairScore = 0;
      if (sameTeam) pairScore = 100;
      else if (sameLeague) pairScore = 26;
      else pairScore = 6;

      actualClubScore += pairScore * activeMultiplier * pairWeight;
      weightedPairs += pairWeight;
      coveredPairs += pairWeight;
    }
  }

  if (!weightedPairs || coveredPairs < 3) return 0;
  const actual = actualClubScore / weightedPairs;
  const currentClub = Number(team.cohesionBreakdown?.club ?? 0);
  const coverage = Math.min(1, coveredPairs / 18);
  const adjustment = (actual - currentClub) * 0.08 * coverage;
  return Math.max(-3, Math.min(4, adjustment));
}

function calibratePublicPerformance(team, publicScore) {
  const score = Number(publicScore);
  if (!Number.isFinite(score)) return Number(team.dimensions?.performance ?? 0);

  const baseline = getConfederationBaseline(team.confederation);
  const prior = clamp(
    Number(team.dimensions?.environment ?? baseline.environment) * 0.55 +
      Number(team.dimensions?.cohesion ?? baseline.cohesion) * 0.15 +
      Number(team.dimensions?.age ?? baseline.age) * 0.1 +
      Number(baseline.performance ?? 56) * 0.2
  );
  // 放宽对环境先验的收缩：截断 ±12→±15、回归系数 0.65→0.75，让真实战绩能更多地偏离先验。
  const cappedDelta = Math.max(-15, Math.min(15, score - prior));
  return clamp(prior + cappedDelta * 0.75);
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
    "cabo verde": "cape verde",
    "bosnia herzegovina": "bosnia and herzegovina",
    "congo dr": "dr congo",
    "democratic republic of congo": "dr congo",
    "korea republic": "south korea",
    turkiye: "turkey"
  };

  return aliases[normalized] ?? normalized;
}

function normalizeTeams(teams) {
  // 第一遍：把每支球队补全维度并叠加公开战绩/俱乐部数据修正，得到带完整 dimensions 的“准成品”。
  const prepared = ensureTournamentTeams(teams).map((team, index) => {
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
    return applyClubDataAdjustments(applyPublicPerformance(normalized));
  });

  // 第二遍：阵容质量改用全场 Min-Max 归一化（见 calculateSquadQuality），需先用整批球队定出 raw 的上下界。
  updateSquadQualityBounds(prepared);
  return rankTeams(prepared.map(withScores));
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

// 阵容质量的 raw（未归一化）分：球员加权质量 + 各项加成，可超过 100、也可低于 0。
// 单调反映“这套阵容真实有多强”，留待 calculateSquadQuality 用全场 Min-Max 归一化。
function calculateRawSquadQuality(team) {
  const players = Array.isArray(team.players) ? team.players : [];
  const fallback = Number(team.dimensions.environment ?? 0);
  if (!players.length) return fallback;

  const starters = players.filter((player) => Number(player.appearanceWeight) === 1);
  const rotation = players.filter((player) => Number(player.appearanceWeight) === 0.55);
  const fringe = players.filter((player) => Number(player.appearanceWeight) > 0 && Number(player.appearanceWeight) < 0.55);
  const starterScore = weightedPlayerScore(starters, fallback);
  const rotationScore = weightedPlayerScore(rotation, fallback);
  const fringeScore = weightedPlayerScore(fringe, rotationScore);
  const starterCount = starters.length || 1;
  const weakShare = starters.filter((player) => getPlayerQualityScore(player, fallback) < 76).length / starterCount;
  const eliteStarterAdjustment = calculateEliteStarterAdjustment(starters);
  const starCoreAdjustment = calculateStarCoreAdjustment(starters);
  const lineIntegrityAdjustment = calculateLineIntegrityAdjustment(starters, fallback);
  const lowIntensityOldStarters = starters.filter((player) => {
    const age = Number(player.age ?? 0);
    const league = String(player.leagueCode ?? "");
    return age >= 32 && !["ENG", "ESP", "ITA", "GER", "FRA"].includes(league);
  }).length;

  const rawQuality =
    starterScore * 0.72 +
      rotationScore * 0.2 +
      fringeScore * 0.04 +
      eliteStarterAdjustment -
      weakShare * 3.5 +
      starCoreAdjustment -
      lowIntensityOldStarters * 1.4 +
      lineIntegrityAdjustment;

  return rawQuality + calculateClubDataSquadAdjustment(starters, rotation);
}

// 全场 raw 分的上下界，由 normalizeTeams 整批球队定出，供 Min-Max 归一化复用。
// 单队实时首发重算（recomputeWithLineup）沿用既有界，越界处由归一化夹到 [0,100]。
let squadQualityBounds = null;

function updateSquadQualityBounds(teams) {
  const raws = teams.map(calculateRawSquadQuality).filter((value) => Number.isFinite(value));
  if (!raws.length) {
    squadQualityBounds = null;
    return;
  }
  squadQualityBounds = { min: Math.min(...raws), max: Math.max(...raws) };
}

// 阵容质量 = 全场 Min-Max 归一化后 ×100：最强阵容→100、最弱→0，顶端不再被 softCap 压扁。
// 界尚未建立（早期单测/异常）时退回直接 clamp，避免除零。
function calculateSquadQuality(team) {
  const raw = calculateRawSquadQuality(team);
  const bounds = squadQualityBounds;
  if (!bounds || !(bounds.max > bounds.min)) return clamp(raw);
  const normalized = ((raw - bounds.min) / (bounds.max - bounds.min)) * 100;
  return Math.max(0, Math.min(100, normalized));
}

function calculateStarCoreAdjustment(starters) {
  const coreScores = starters
    .map((player) => {
      if (!isEliteClubPlayer(player)) return 0;
      const role = Number(player.roleStability ?? player.environmentScore ?? 70);
      if (role < 78) return 0;
      const starScore = getPlayerQualityScore(player, 0);
      const starterBonus = role >= 90 ? 3 : role >= 86 ? 1.8 : role >= 82 ? 0.8 : 0;
      const peakBonus = starScore >= 94 ? 2.4 : starScore >= 91 ? 1.2 : 0;
      return clamp(starScore + starterBonus + peakBonus);
    })
    .filter((score) => score > 0)
    .sort((a, b) => b - a)
    .slice(0, 3);

  if (!coreScores.length) return 0;
  const [first = 0, second = first, third = second] = coreScores;
  const starIndex = first * 0.52 + second * 0.3 + third * 0.18;
  const elitePeakBonus = Math.max(0, first - 92) * 0.6 + Math.max(0, second - 90) * 0.35;
  return Math.min(10.5, Math.max(0, starIndex - 84) * 0.75 + elitePeakBonus);
}

function calculateEliteStarterAdjustment(starters) {
  if (!starters.length) return 0;
  const roleValues = starters.map(getEliteRoleValue);
  const eliteDensity = roleValues.reduce((sum, value) => sum + Math.max(0, value), 0) / starters.length;
  const benchPenalty = roleValues.filter((value) => value < 0).length * 0.8;
  return (eliteDensity - 0.22) * 8 - Math.max(0, 0.14 - eliteDensity) * 4 - benchPenalty;
}

function getEliteRoleValue(player) {
  if (!isEliteClubPlayer(player)) return 0;
  const role = Number(player.roleStability ?? player.environmentScore ?? 70);
  if (role >= 90) return 1;
  if (role >= 84) return 0.75;
  if (role >= 78) return 0.38;
  return -0.35;
}

// 四线（GK/DF/MF/FW）主力的加权质量分。
function starterLineScores(starters, fallback) {
  return ["GK", "DF", "MF", "FW"].map((code) => {
    const group = starters.filter((player) => (player.positionCode ?? positionCodeFromLabel(player.position)) === code);
    return weightedPlayerScore(group, fallback);
  });
}

// 绝对短板（进 squadQuality）：某条线真的弱就扣，四线都 ≥84 给 +2 均衡奖。
// 相对失衡不在这里——它改为在 withScores 里直接扣总分，避免被 42% 权重+归一化稀释。
function calculateLineIntegrityAdjustment(starters, fallback) {
  const weakest = Math.min(...starterLineScores(starters, fallback));
  return (
    weakest < 68 ? -6 :
    weakest < 72 ? -4 :
    weakest < 76 ? -2 :
    weakest >= 84 ? 2 :
    0
  );
}

function calculateClubDataSquadAdjustment(starters, rotation) {
  const weighted = [
    ...starters.map((player) => ({ player, weight: 1 })),
    ...rotation.map((player) => ({ player, weight: 0.4 }))
  ].filter(({ player }) => getClubPlayerStats(player)?.latestSeason?.metrics);

  if (!weighted.length) return 0;

  const totalWeight = weighted.reduce((sum, item) => sum + item.weight, 0);
  const adjustmentAverage = weighted.reduce(
    (sum, item) => sum + getClubPerformanceAdjustment(item.player) * item.weight,
    0
  ) / totalWeight;
  const topAverage = weighted
    .map(({ player }) => getClubPerformanceAdjustment(player))
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((sum, value, index, arr) => sum + value / arr.length, 0);
  const coverage = Math.min(1, totalWeight / 11);
  const adjustment = (adjustmentAverage * 0.14 + topAverage * 0.1) * coverage;
  return Math.max(-1.6, Math.min(1.6, adjustment));
}

function isEliteClubPlayer(player) {
  const club = normalizeAscii(
    [player.clubEn, player.clubRaw, player.clubNameEn, player.clubName, player.club]
      .find((value) => String(value ?? "").trim()) ?? ""
  );
  return ELITE_CLUB_PATTERNS.some((pattern) => club.includes(pattern));
}

function findRosterPlayer(team, player) {
  if (!team?.players?.length || !player) return null;
  const keys = [player.nameEn, player.name]
    .map(normalizeTeamKey)
    .filter(Boolean);
  return team.players.find((item) => {
    const rosterKeys = [item.nameEn, item.name].map(normalizeTeamKey);
    return keys.some((key) => rosterKeys.includes(key));
  }) ?? null;
}

function getClubLevelLabel(player) {
  if (isEliteClubPlayer(player)) return "豪门";
  const club = Number(player.clubCompetitiveness ?? player.environmentScore ?? 0);
  if (club >= 86) return "强队";
  if (club >= 78) return "主流";
  if (club >= 68) return "中游";
  return "低级别";
}

function getClubRoleLabel(player) {
  const stats = getClubPlayerStats(player)?.latestSeason?.metrics;
  const appearances = metricNumber(stats?.appearances);
  const starts = metricNumber(stats?.starts);
  if (appearances >= 5) {
    const startShare = starts / appearances;
    if (startShare >= 0.65) return "俱乐部主力";
    if (startShare >= 0.35) return "轮换";
    return "替补";
  }

  const role = Number(player.roleStability ?? player.environmentScore ?? 0);
  if (role >= 86) return "俱乐部主力";
  if (role >= 74) return "轮换";
  if (role > 0) return "替补";
  return "角色未知";
}

function getClubNameKey(value) {
  return normalizeAscii(String(value ?? "").replace(/\s*\([A-Z]{2,3}\)\s*$/i, ""));
}

function formatClubZhName(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return "未标注";
  return CLUB_ZH_LABELS[getClubNameKey(raw)] ?? raw.replace(/\s*\([A-Z]{2,3}\)\s*$/i, "");
}

function getLeagueCodeFromClub(value) {
  return /\(([A-Z]{2,3})\)\s*$/i.exec(String(value ?? "").trim())?.[1]?.toUpperCase() ?? "";
}

function getLeagueLabel(player, rawClub, rawClubEn) {
  const code = String(player.leagueCode ?? (getLeagueCodeFromClub(rawClub) || getLeagueCodeFromClub(rawClubEn))).toUpperCase();
  if (LEAGUE_CODE_LABELS[code]) return LEAGUE_CODE_LABELS[code];
  const statsLeague = getClubPlayerStats(player)?.latestSeason?.leagueName;
  return statsLeague || code || "";
}

function getPlayerClubProfile(player, team = null) {
  const roster = findRosterPlayer(team, player);
  const source = roster ? { ...(player ?? {}), ...roster } : (player ?? {});
  const rawClub = [source.club, source.clubName, roster?.club]
    .find((value) => String(value ?? "").trim()) ?? "未标注";
  const rawClubEn = [source.clubEn, source.clubNameEn, roster?.clubEn]
    .find((value) => String(value ?? "").trim()) ?? "";
  const club = formatClubZhName(rawClub);
  const clubEn = getClubNameKey(rawClub) === getClubNameKey(rawClubEn) ? "" : rawClubEn;
  const enriched = { ...source, club, clubEn, clubRaw: rawClub };
  const level = getClubLevelLabel(enriched);
  const role = getClubRoleLabel(enriched);
  const league = getLeagueLabel(enriched, rawClub, rawClubEn);
  const clubKey = getClubNameKey(rawClub);
  const clubEnKey = getClubNameKey(rawClubEn);
  const badgeConfig = CLUB_BADGE_LABELS[clubKey] ?? CLUB_BADGE_LABELS[clubEnKey] ?? null;
  const logo = CLUB_LOGO_URLS[clubKey] ?? CLUB_LOGO_URLS[clubEnKey] ?? null;
  const badge = badgeConfig ? { ...badgeConfig, logo } : null;
  return {
    club,
    clubEn,
    league,
    badge,
    level,
    role,
    elite: level === "豪门",
    starter: role === "俱乐部主力",
    highlighted: level === "豪门" || role === "俱乐部主力"
  };
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
    const playerWeight = getPlayerScoreWeight(player);
    total += getPlayerQualityScore(player, fallback) * playerWeight;
    weight += playerWeight;
  });
  return weight ? total / weight : fallback;
}

function getPlayerScoreWeight(player) {
  const nationalRole = Math.max(0.15, Number(player.appearanceWeight ?? 0.2));
  const role = Number(player.roleStability ?? player.environmentScore ?? 70);
  const multiplier =
    role >= 90 ? 1.1 :
    role >= 84 ? 1 :
    role >= 78 ? 0.9 :
    role >= 70 ? 0.76 :
    0.6;
  return nationalRole * multiplier * getClubDataWeightMultiplier(player);
}

function getPlayerQualityScore(player, fallback) {
  const base = Number(player.environmentScore ?? fallback ?? 0);
  const league = Number(player.leagueStrength ?? base);
  const club = Number(player.clubCompetitiveness ?? base);
  const role = Number(player.roleStability ?? base);
  const appearance = Number(player.appearanceWeight ?? 0.2);
  const clubRole = getClubRoleQualityAdjustment(club, role, appearance, isEliteClubPlayer(player));
  const ageAdjustment = getAgeQualityAdjustment(player);
  const clubPerformanceAdjustment = getClubPerformanceAdjustment(player);
  return clamp(base * 0.42 + league * 0.18 + club * 0.2 + role * 0.2 + clubRole + ageAdjustment + clubPerformanceAdjustment);
}

function getClubDataWeightMultiplier(player) {
  const metrics = getClubPlayerStats(player)?.latestSeason?.metrics;
  if (!metrics) return 1;
  const minutes = metricNumber(metrics.minutes);
  const starts = metricNumber(metrics.starts);
  const appearances = metricNumber(metrics.appearances);
  if (minutes >= 2200 || (appearances >= 20 && starts >= 16)) return 1.08;
  if (minutes >= 1200 || (appearances >= 15 && starts >= 8)) return 1.03;
  if (minutes > 0 && minutes < 450) return 0.88;
  return 1;
}

function getClubPerformanceAdjustment(player) {
  const stats = getClubPlayerStats(player);
  const metrics = stats?.latestSeason?.metrics;
  if (!metrics) return 0;

  const minutes = metricNumber(metrics.minutes);
  const starts = metricNumber(metrics.starts);
  const appearances = metricNumber(metrics.appearances);
  // 跨联赛强度校正：弱联赛刷出的高评分向中性基准收缩后再参与加成（见 LEAGUE_STRENGTH_FACTOR）。
  const rating = adjustCrossLeagueRating(metricNumber(metrics.rating), stats?.latestSeason?.leagueName);
  const goals = metricNumber(metrics.goals);
  const assists = metricNumber(metrics.assists);
  const keyPasses = metricNumber(metrics.keyPasses);
  const tackles = metricNumber(metrics.tackles);
  const interceptions = metricNumber(metrics.interceptions);
  const redCards = metricNumber(metrics.redCards);
  const position = player.positionCode ?? positionCodeFromLabel(player.position);
  const startShare = appearances ? starts / appearances : 0;

  let adjustment =
    minutes >= 2800 ? 2.4 :
    minutes >= 2000 ? 1.8 :
    minutes >= 1200 ? 1 :
    minutes >= 600 ? 0.2 :
    minutes > 0 ? -1.2 :
    0;

  if (appearances >= 10) {
    if (startShare >= 0.72) adjustment += 1.1;
    else if (startShare >= 0.45) adjustment += 0.4;
    else if (startShare < 0.25) adjustment -= 0.8;
  }

  if (rating >= 7.25) adjustment += 1.8;
  else if (rating >= 6.95) adjustment += 1;
  else if (rating >= 6.65) adjustment += 0.3;
  else if (rating > 0 && rating < 6.35) adjustment -= 0.9;

  const attackingPer90 = per90(goals + assists, minutes);
  if (position === "FW") {
    if (attackingPer90 >= 0.7) adjustment += 1.8;
    else if (attackingPer90 >= 0.45) adjustment += 1;
    else if (attackingPer90 >= 0.25) adjustment += 0.4;
  } else if (position === "MF") {
    if (attackingPer90 >= 0.4) adjustment += 1.2;
    else if (attackingPer90 >= 0.22) adjustment += 0.6;
  } else if (position === "DF") {
    const defensiveActions = per90(tackles + interceptions, minutes);
    if (defensiveActions >= 3.5) adjustment += 0.8;
    if (goals + assists >= 5 || keyPasses >= 25) adjustment += 0.4;
  } else if (position === "GK") {
    if (minutes >= 2500 && rating >= 6.8) adjustment += 0.8;
  }

  if (redCards >= 2) adjustment -= 0.8;
  return Math.max(-3.5, Math.min(5.5, adjustment));
}

function metricNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function per90(value, minutes) {
  return minutes > 0 ? (Number(value) / minutes) * 90 : 0;
}

function getClubRoleQualityAdjustment(club, role, appearance, eliteClub) {
  let adjustment =
    club >= 92 ? 2.4 :
    club >= 86 ? 1.1 :
    club >= 78 ? 0 :
    club >= 68 ? -1.6 :
    -4;

  if (eliteClub && role >= 90 && appearance >= 0.9) adjustment += 3.2;
  else if (eliteClub && role >= 84 && appearance >= 0.55) adjustment += 1.8;
  else if (eliteClub && role >= 78) adjustment += 0.5;
  else if (eliteClub && role < 76) adjustment -= 4;
  else if (!eliteClub && role >= 88 && appearance >= 0.9 && club >= 78) adjustment += 1.2;

  if (club >= 88 && role < 70) adjustment -= 2.5;
  if (club < 76 && role >= 86) adjustment += 0.8;
  return adjustment;
}

function getAgeQualityAdjustment(player) {
  const age = Number(player.age ?? 0);
  const position = player.positionCode ?? positionCodeFromLabel(player.position);
  if (!age) return 0;
  if (age <= 20) return -0.8;
  if (age <= 23) return 0.3;
  if (age <= 29) return 0.8;
  if (age <= 32) return position === "GK" ? 0.7 : 0;
  if (age <= 34) return position === "GK" ? 0.2 : -1.1;
  return position === "GK" ? -0.7 : -2.4;
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

function formatPercent(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "--";
  return `${Math.round(number * 100)}%`;
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

function normalizePlayer(item) {
  return {
    ...item,
    name: zhPlayerName(item.nameEn ?? item.name) ?? item.name,
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


// 模型整体战绩：对所有已完赛场次(实时+本地缓存)比对预测与实际结果
function getPredictionStats() {
  const liveFinished = (appState.liveSchedule?.matches ?? [])
    .map(liveMatchToLocal)
    .filter((match) => match.status === "FINISHED");
  const merged = mergeFinishedMatches(liveFinished, readFinishedHomeResults());
  let total = 0;
  let hits = 0;
  let draws = 0;
  let drawRiskHits = 0;
  merged.forEach((match) => {
    const teamA = findTeamByName(match.team1);
    const teamB = findTeamByName(match.team2);
    const actual = getScoreOutcome(match.liveScore);
    if (!teamA || !teamB || !actual) return;
    const pair = getLineupAdjustedPair(match, teamA, teamB);
    const prediction = getPrediction(pair.teamA, pair.teamB, match);
    if (!prediction) return;
    total += 1;
    if (actual === "draw") draws += 1;
    if (actual === "draw" && prediction.closeMatch) drawRiskHits += 1;
    if (prediction.outcome === actual) {
      hits += 1;
    }
  });
  return { total, hits, draws, drawHits: drawRiskHits, accuracy: total ? hits / total : 0 };
}

// ==== 每场比赛实际首发的持久化与冻结 ====
// 规则:
// - 已完赛(或开赛后)保存的名单 phase = "post",立即冻结,不再更新
// - 赛前保存的名单 phase = "pre",开赛后允许再更新一次,之后冻结
const MATCH_LINEUP_STORAGE_KEY = "wcMatchLineupStore";
const MATCH_LINEUP_RETRY_MS = 5 * 60 * 1000;
const matchLineupRequests = new Map();

function matchLineupKey(match) {
  return [match.date, normalizeTeamKey(match.team1), normalizeTeamKey(match.team2)].join("|");
}

function readMatchLineupStore() {
  try {
    const parsed = JSON.parse(localStorage.getItem(MATCH_LINEUP_STORAGE_KEY));
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeMatchLineupStore(store) {
  try {
    const entries = Object.entries(store)
      .sort((a, b) => String(b[1]?.savedAt ?? "").localeCompare(String(a[1]?.savedAt ?? "")))
      .slice(0, 80);
    localStorage.setItem(MATCH_LINEUP_STORAGE_KEY, JSON.stringify(Object.fromEntries(entries)));
  } catch {
    // localStorage 不可用时仅在当前会话生效
  }
}

function getSavedMatchLineups(match) {
  if (!match?.team1 || !match?.team2) return null;
  return readMatchLineupStore()[matchLineupKey(match)] ?? null;
}

function isMatchStarted(match) {
  return ["IN_PLAY", "PAUSED", "FINISHED"].includes(match.status) || Boolean(match.resultFinal);
}

function mapApiLineupPlayers(players) {
  return players.slice(0, 11).map((item) => ({
    position: translateLineupPosition(item.pos ?? item.position),
    name: zhPlayerName(item.name) ?? item.name ?? "未知",
    nameEn: item.name ?? "",
    clubEn: "",
    note: "实际首发",
    placeholder: false
  }));
}

async function fetchMatchLineups(match, teamA, teamB) {
  let fixtureId = match.apiFootballFixtureId ?? null;
  if (!fixtureId) {
    const found = (appState.liveSchedule?.matches ?? []).find(
      (item) => matchLineupKey(liveMatchToLocal(item)) === matchLineupKey(match)
    );
    fixtureId = found?.fixture?.id ?? null;
  }
  if (!fixtureId) return null;
  try {
    const detail = await lineupApiGet(`/fixtures/lineups?fixture=${encodeURIComponent(fixtureId)}`);
    const home = pickApiFootballLineup(detail, teamA);
    const away = pickApiFootballLineup(detail, teamB);
    if (home.length < 11 || away.length < 11) return null;
    return { home: mapApiLineupPlayers(home), away: mapApiLineupPlayers(away) };
  } catch {
    return null;
  }
}

// 获取并保存某场比赛的实际首发(带冻结与 5 分钟节流)。teamA 必须对应 match.team1。
async function ensureMatchLineups(match, teamA, teamB) {
  if (!teamA || !teamB || !match?.team1 || !LINEUP_API.available) return getSavedMatchLineups(match);
  const key = matchLineupKey(match);
  const entry = getSavedMatchLineups(match);
  const started = isMatchStarted(match);
  // 已冻结(post),或赛前名单还没到"开赛后再更新一次"的时机
  if (entry && (entry.phase === "post" || !started)) return entry;

  const pending = matchLineupRequests.get(key);
  if (pending?.promise) return pending.promise;
  if (pending && Date.now() - pending.at < MATCH_LINEUP_RETRY_MS) return entry;

  const promise = (async () => {
    const fetched = await fetchMatchLineups(match, teamA, teamB);
    if (!fetched) return entry;
    const store = readMatchLineupStore();
    const savedAt = new Date().toISOString();
    store[key] = {
      savedAt,
      phase: started ? "post" : "pre",
      lineups: fetched
    };
    writeMatchLineupStore(store);
    saveTeamLineupBasis(teamA, fetched.home, match, "home", store[key].phase, savedAt);
    saveTeamLineupBasis(teamB, fetched.away, match, "away", store[key].phase, savedAt);
    appState.matchLineupVersion += 1;
    return store[key];
  })();
  matchLineupRequests.set(key, { at: Date.now(), promise });
  try {
    return await promise;
  } finally {
    matchLineupRequests.set(key, { at: Date.now() });
  }
}

// 用已保存的实际首发修正两队评分;没有保存时原样返回
function getLineupAdjustedPair(match, teamA, teamB) {
  if (!teamA || !teamB) return { teamA, teamB, adjusted: false };
  const entry = getSavedMatchLineups(match);
  if (!entry?.lineups) return { teamA, teamB, adjusted: false };
  const adjA = recomputeWithLineup(teamA, entry.lineups.home);
  const adjB = recomputeWithLineup(teamB, entry.lineups.away);
  return { teamA: adjA ?? teamA, teamB: adjB ?? teamB, adjusted: Boolean(adjA || adjB) };
}

// ============================================================
// 基准对比：把"你的模型 / 市场赔率 / Elo"都转成归一化的主-平-客三路概率，
// 再用命中率、Brier 分、对数损失三个指标做回测对比。
// Brier 与对数损失越低越好；命中率越高越好。
// ============================================================

const eloIndex = new Map(Object.entries(eloRatings).map(([name, value]) => [normalizeTeamKey(name), Number(value)]));
// Elo 三路概率参数：实力相当时平局概率最高，随评分差按高斯衰减。
const ELO_DRAW_MAX = 0.28;
const ELO_DRAW_SIGMA = 200;

function getTeamElo(team) {
  if (!team) return null;
  const key = normalizeTeamKey(team.nameEn ?? team.name);
  return eloIndex.has(key) ? eloIndex.get(key) : null;
}

function clampProb(value) {
  const v = Number(value);
  if (!Number.isFinite(v)) return 0;
  return Math.min(1, Math.max(0, v));
}

function normalizeProbs(probs) {
  const sum = probs.home + probs.draw + probs.away;
  if (!(sum > 0)) return null;
  return { home: probs.home / sum, draw: probs.draw / sum, away: probs.away / sum };
}

// 你的模型：看好信心(看好方胜) + 平局信心 → 归一化三路概率
function getModelProbabilities(teamA, teamB, match = null) {
  const prediction = getPrediction(teamA, teamB, match);
  if (!prediction) return null;
  const pDraw = clampProb(prediction.drawConfidence);
  const favShare = clampProb(prediction.confidence);
  const favProb = (1 - pDraw) * favShare;
  const dogProb = (1 - pDraw) * (1 - favShare);
  const probs = prediction.outcome === "away"
    ? { home: dogProb, draw: pDraw, away: favProb }
    : { home: favProb, draw: pDraw, away: dogProb };
  return normalizeProbs(probs);
}

// 市场：赔率取倒数得隐含概率，再除以总和去抽水(de-vig)
function getBookmakerProbabilities(match) {
  const odds = getMatchOdds(match);
  if (!odds) return null;
  const h = Number(odds.home);
  const d = Number(odds.draw);
  const a = Number(odds.away);
  if (![h, d, a].every((v) => Number.isFinite(v) && v > 1)) return null;
  const ih = 1 / h;
  const id = 1 / d;
  const ia = 1 / a;
  const sum = ih + id + ia;
  if (!(sum > 0)) return null;
  return { home: ih / sum, draw: id / sum, away: ia / sum, bookmaker: odds.bookmaker ?? null };
}

// Elo：评分差 → 期望得分(logistic) + 高斯平局模型
function getEloProbabilities(teamA, teamB) {
  const eloA = getTeamElo(teamA);
  const eloB = getTeamElo(teamB);
  if (eloA === null || eloB === null) return null;
  const dr = eloA - eloB;
  const expectedA = 1 / (1 + Math.pow(10, -dr / 400));
  const pDraw = ELO_DRAW_MAX * Math.exp(-(dr * dr) / (2 * ELO_DRAW_SIGMA * ELO_DRAW_SIGMA));
  return {
    home: (1 - pDraw) * expectedA,
    draw: pDraw,
    away: (1 - pDraw) * (1 - expectedA)
  };
}

const BENCHMARK_OUTCOMES = ["home", "draw", "away"];

function topPick(probs) {
  return BENCHMARK_OUTCOMES.reduce((best, o) => (probs[o] > probs[best] ? o : best), "home");
}

function brierScore(probs, actual) {
  return BENCHMARK_OUTCOMES.reduce((sum, o) => {
    const diff = (probs[o] ?? 0) - (actual === o ? 1 : 0);
    return sum + diff * diff;
  }, 0);
}

function logLossScore(probs, actual) {
  const p = Math.min(1, Math.max(1e-6, probs[actual] ?? 0));
  return -Math.log(p);
}

function createBenchmarkAccumulator(label) {
  return { label, n: 0, hits: 0, brier: 0, logloss: 0 };
}

function accumulateBenchmark(acc, probs, actual) {
  acc.n += 1;
  if (topPick(probs) === actual) acc.hits += 1;
  acc.brier += brierScore(probs, actual);
  acc.logloss += logLossScore(probs, actual);
}

function finalizeBenchmark(acc) {
  return {
    label: acc.label,
    n: acc.n,
    accuracy: acc.n ? acc.hits / acc.n : 0,
    brier: acc.n ? acc.brier / acc.n : null,
    logloss: acc.n ? acc.logloss / acc.n : null
  };
}

// 回测：遍历完赛比赛，只统计三方都能给出概率的场次(保证同一批样本公平对比)
function getBenchmarkComparison() {
  const liveFinished = (appState.liveSchedule?.matches ?? [])
    .map(liveMatchToLocal)
    .filter((match) => match.status === "FINISHED");
  const merged = mergeFinishedMatches(liveFinished, readFinishedHomeResults());
  const accumulators = {
    model: createBenchmarkAccumulator("你的模型"),
    bookmaker: createBenchmarkAccumulator("市场赔率"),
    elo: createBenchmarkAccumulator("Elo")
  };
  let sampleSize = 0;
  merged.forEach((match) => {
    const teamA = findTeamByName(match.team1);
    const teamB = findTeamByName(match.team2);
    const actual = getScoreOutcome(match.liveScore ?? match.score);
    if (!teamA || !teamB || !actual) return;
    const pair = getLineupAdjustedPair(match, teamA, teamB);
    const probsByModel = {
      model: getModelProbabilities(pair.teamA, pair.teamB, match),
      bookmaker: getBookmakerProbabilities(match),
      elo: getEloProbabilities(teamA, teamB)
    };
    if (!probsByModel.model || !probsByModel.bookmaker || !probsByModel.elo) return;
    sampleSize += 1;
    Object.entries(probsByModel).forEach(([key, probs]) => accumulateBenchmark(accumulators[key], probs, actual));
  });
  return {
    sampleSize,
    eloSnapshotDate: ELO_SNAPSHOT_DATE,
    eloSource: ELO_SOURCE,
    models: Object.fromEntries(Object.entries(accumulators).map(([key, acc]) => [key, finalizeBenchmark(acc)]))
  };
}

// 单场三方概率(用于赛程内的并排展示，未完赛比赛也可用)
function getMatchBenchmarkRow(match, teamA, teamB) {
  return {
    model: getModelProbabilities(teamA, teamB, match),
    bookmaker: getBookmakerProbabilities(match),
    elo: getEloProbabilities(teamA, teamB)
  };
}

// ---- module init (was init()) ----
appState.teams = normalizeTeams(appState.teams);
applySavedLineupsToTeams();
appState.selectedId = appState.teams[0]?.id ?? null;

export {
  scoreComponentConfig, dimensionConfig, tournamentStageConfig, LINEUP_API, ODDS_API,
  getDefaultCoefficientConfig, saveCoefficientConfig, getCoefficientTotal, getActiveCoefficientConfig,
  getStageLoadConfig, saveStageLoadMode, getEffectiveCoefficients, formatCoefficient,
  loadLiveSchedule, loadOdds, getPrediction, getPredictionText, getPredictionBadge,
  getPredictionResultText, getMissingRatingLabel, renderOddsText, getFeaturedBannerMatches,
  getBannerClockDelay,
  getBannerMatchStatus, isMatchFinished, normalizeTeams, refreshTeamScores, rankTeams,
  getVisibleTeams, getSelectedTeam, findTeamByName, formatTeamName, getRecentMatchRows,
  getFullScheduleRows, matchMatchesScheduleFilters, getWorldCupMatches, getScheduleSourceLabel,
  formatGeneratedAt, formatVenueName, tryLiveLineup, saveLineupCache, readLineupCache, ensureTeamLineup, recomputeWithLineup,
  getPredictionStats, ensureMatchLineups, getSavedMatchLineups, getLineupAdjustedPair, zhPlayerName, getTier, formatScore, formatPercent, signed, clamp, shortTier, withScores, normalizeTeamKey,
  getBenchmarkComparison, getMatchBenchmarkRow, getModelProbabilities, getBookmakerProbabilities, getEloProbabilities, getPlayerClubProfile
};
