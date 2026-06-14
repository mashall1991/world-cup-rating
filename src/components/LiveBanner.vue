<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watchEffect } from "vue";
import {
  appState, getFeaturedBannerMatches, getBannerMatchStatus, findTeamByName,
  formatTeamName, getPrediction, getPredictionResultText, getPredictionStats,
  ensureMatchLineups, getLineupAdjustedPair, renderOddsText, getBannerClockDelay,
  formatVenueName, getBookmakerProbabilities, formatPercent
} from "../lib/engine.js";
import { openCompare } from "../lib/ui.js";

const bannerClock = ref(Date.now());
let bannerClockTimer = null;

const cards = computed(() => {
  // 依赖 liveSchedule / odds / teams / 已保存首发 的变化
  void bannerClock.value;
  void appState.liveSchedule;
  void appState.odds;
  void appState.teams;
  void appState.matchLineupVersion;
  return getFeaturedBannerMatches().map((local) => {
    const teamA = findTeamByName(local.team1);
    const teamB = findTeamByName(local.team2);
    const stageText = [formatStageLabel(local.round), formatGroupLabel(local.group)].filter(Boolean).join(" · ");
    const venueText = formatVenueText(local);
    const status = getBannerMatchStatus(local);
    // 置顶卡片展示模型预测；已完赛场次额外展示命中结果。
    // 有保存的实际首发时按首发修正分计算。
    let predictText = "";
    let prediction = null;
    if (teamA && teamB) {
      const pair = getLineupAdjustedPair(local, teamA, teamB);
      prediction = getPrediction(pair.teamA, pair.teamB, local);
      predictText = getPredictionResultText(
        { ...local, score: local.liveScore, resultFinal: local.status === "FINISHED" },
        pair.teamA,
        pair.teamB
      );
      if (pair.adjusted) predictText += " · 按实际首发";
    }
    const predictParts = predictionParts(predictText);
    const market = getMarketLean(local, prediction, teamA, teamB);
    return {
      local, teamA, teamB, stageText, venueText, status, predictText, predictParts,
      market,
      odds: renderOddsText(local),
      key: `${local.date}|${local.team1}|${local.team2}`
    };
  });
});

const stats = computed(() => {
  void appState.liveSchedule;
  void appState.teams;
  void appState.matchLineupVersion;
  return getPredictionStats();
});

function predictionParts(text) {
  const match = /^(预测命中|平局风险命中)(.*)$/.exec(text ?? "");
  const hit = match ? match[1] : "";
  const rest = match ? match[2] : (text ?? "");
  const favorite = /^(看好\s+)(.+?)(\s*·\s*看好信心\s+)(\d+%)(.*)$/.exec(rest);
  if (favorite) {
    return {
      hit,
      prefix: favorite[1],
      favorite: favorite[2],
      confidencePrefix: favorite[3],
      confidence: favorite[4],
      suffix: favorite[5] ?? ""
    };
  }
  return { hit, prefix: "", favorite: "", confidencePrefix: "", confidence: "", suffix: rest };
}

function formatStageLabel(value) {
  const text = String(value ?? "").trim();
  if (!text) return "";
  const matchday = /^Matchday\s+(\d+)$/i.exec(text);
  if (matchday) return `第${matchday[1]}比赛日`;
  return text.replace(/^Group Stage$/i, "小组赛");
}

function formatGroupLabel(value) {
  const text = String(value ?? "").trim();
  if (!text) return "";
  const group = /^(?:Group|GROUP_)\s*_?([A-L])$/i.exec(text);
  return group ? `${group[1].toUpperCase()}组` : text;
}

function formatVenueText(match) {
  const ground = String(match.ground ?? "").trim();
  const city = String(match.city ?? "").trim();
  const labels = [ground, city]
    .filter(Boolean)
    .map(formatVenueName)
    .filter((label, index, list) => label && list.indexOf(label) === index);
  return labels.join(" · ") || "地点未标注";
}

function getMarketLean(match, prediction, teamA, teamB) {
  const probabilities = getBookmakerProbabilities(match);
  if (!probabilities || !teamA || !teamB) return null;
  const options = [
    { outcome: "home", label: teamA.name, value: probabilities.home },
    { outcome: "draw", label: "平局", value: probabilities.draw },
    { outcome: "away", label: teamB.name, value: probabilities.away }
  ].filter((item) => Number.isFinite(item.value));
  if (!options.length) return null;
  const leader = options.sort((a, b) => b.value - a.value)[0];
  return {
    label: leader.label,
    confidence: formatPercent(leader.value),
    disagree: Boolean(prediction?.outcome && prediction.outcome !== leader.outcome),
    bookmaker: probabilities.bookmaker ?? ""
  };
}

function scheduleBannerClock() {
  clearTimeout(bannerClockTimer);
  bannerClockTimer = setTimeout(() => {
    bannerClock.value = Date.now();
    scheduleBannerClock();
  }, getBannerClockDelay(bannerClock.value));
}

onMounted(scheduleBannerClock);
onBeforeUnmount(() => clearTimeout(bannerClockTimer));

// 对横幅中的比赛尝试获取并保存实际首发(engine 内部自带冻结与节流)
watchEffect(() => {
  cards.value.forEach((card) => {
    if (card.teamA && card.teamB) {
      ensureMatchLineups(card.local, card.teamA, card.teamB);
    }
  });
});

function onCardClick(card) {
  if (!card.teamA || !card.teamB) return;
  openCompare(card.teamA, card.teamB, {
    ...card.local,
    meta: [card.status.label, card.stageText, card.venueText].filter(Boolean).join(" · ")
  });
}
</script>

<template>
  <div v-if="cards.length || stats.total" class="live-banner" aria-live="polite">
    <div v-if="stats.total" class="live-stat-card">
      <span class="live-status"><span class="live-dot" aria-hidden="true"></span>模型战绩</span>
      <span class="stat-value">{{ Math.round(stats.accuracy * 100) }}<small>%</small></span>
      <span class="live-meta">已完赛 {{ stats.total }} 场 · 命中 {{ stats.hits }} 场</span>
      <span class="live-meta">实际平局 {{ stats.draws }} 场 · 风险命中 {{ stats.drawHits }} 场</span>
    </div>
    <button
      v-for="card in cards"
      :key="card.key"
      type="button"
      class="live-match-card"
      :class="card.status.className"
      :title="card.teamA && card.teamB ? '点击查看两队实力对比' : undefined"
      @click="onCardClick(card)"
    >
      <span class="live-status">
        <span class="live-dot" aria-hidden="true"></span>
        {{ card.status.label }}
      </span>
      <span class="live-teams">
        <strong>{{ formatTeamName(card.local.team1) }}</strong>
        <span class="live-score">{{ card.local.liveScore ?? "vs" }}</span>
        <strong>{{ formatTeamName(card.local.team2) }}</strong>
      </span>
      <span class="live-meta">{{ [card.local.date, card.local.time, card.stageText || "世界杯"].filter(Boolean).join(" · ") }}</span>
      <span class="live-venue">{{ card.venueText }}</span>
      <span v-if="card.predictText || card.odds" class="live-card-info">
        <span v-if="card.predictText" class="live-predict" :class="{ hit: card.predictParts.hit }">
          <strong v-if="card.predictParts.hit">{{ card.predictParts.hit }}</strong>{{ card.predictParts.prefix }}<strong v-if="card.predictParts.favorite" class="live-favorite-team">{{ card.predictParts.favorite }}</strong>{{ card.predictParts.confidencePrefix }}<span v-if="card.predictParts.confidence" class="live-confidence">{{ card.predictParts.confidence }}</span>{{ card.predictParts.suffix }}
        </span>
        <span v-if="card.market" class="live-market" :class="{ disagree: card.market.disagree }">
          {{ card.market.disagree ? "市场分歧：" : "市场倾向 " }}<strong>{{ card.market.label }}</strong>
          <span class="live-confidence">{{ card.market.confidence }}</span>
        </span>
        <span v-if="card.odds" class="live-odds">{{ card.odds }}</span>
      </span>
    </button>
  </div>
</template>
