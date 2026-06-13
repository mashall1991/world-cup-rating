<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watchEffect } from "vue";
import {
  appState, getFeaturedBannerMatches, getBannerMatchStatus, findTeamByName,
  formatTeamName, getPredictionResultText, getPredictionStats,
  ensureMatchLineups, getLineupAdjustedPair, renderOddsText, getBannerClockDelay
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
    const stageText = [local.round, local.group].filter(Boolean).join(" · ");
    const status = getBannerMatchStatus(local);
    // 置顶卡片展示模型预测；已完赛场次额外展示命中结果。
    // 有保存的实际首发时按首发修正分计算。
    let predictText = "";
    if (teamA && teamB) {
      const pair = getLineupAdjustedPair(local, teamA, teamB);
      predictText = getPredictionResultText(
        { ...local, score: local.liveScore, resultFinal: local.status === "FINISHED" },
        pair.teamA,
        pair.teamB
      );
      if (pair.adjusted) predictText += " · 按实际首发";
    }
    const predictParts = predictionParts(predictText);
    return {
      local, teamA, teamB, stageText, status, predictText, predictParts,
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
  return match ? { hit: match[1], rest: match[2] } : { hit: "", rest: text };
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
    meta: [card.status.label, card.stageText].filter(Boolean).join(" · ")
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
      <span v-if="card.predictText || card.odds" class="live-card-info">
        <span v-if="card.predictText" class="live-predict" :class="{ hit: card.predictParts.hit }">
          <strong v-if="card.predictParts.hit">{{ card.predictParts.hit }}</strong>{{ card.predictParts.rest }}
        </span>
        <span v-if="card.odds" class="live-odds">{{ card.odds }}</span>
      </span>
    </button>
  </div>
</template>
