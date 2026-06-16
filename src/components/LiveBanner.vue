<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, watchEffect } from "vue";
import {
  appState, getFeaturedBannerMatches, getBannerMatchStatus, findTeamByName,
  formatTeamName, getPrediction, getPredictionResultText, getPredictionStats, getVillainPredictionStats,
  ensureMatchLineups, getLineupAdjustedPair, renderOddsText, getBannerClockDelay,
  formatVenueName, getBookmakerProbabilities, getModelProbabilities, getVillainPrediction, getVillainHeat,
  getGlobalModeHeat, recordVillainHeat, recordGlobalModeHeat, formatPercent
} from "../lib/engine.js";
import { openCompare, openVillainTeamDetail } from "../lib/ui.js";

const bannerClock = ref(Date.now());
const villainCards = ref(new Set());
const justiceBubbleBump = ref(false);
const evilBubbleBump = ref(false);
let bannerClockTimer = null;
let justiceBubbleTimer = null;
let evilBubbleTimer = null;
let justiceBubbleMutedUntil = 0;
let evilBubbleMutedUntil = 0;

const cards = computed(() => {
  // 依赖 liveSchedule / odds / teams / 已保存首发 的变化
  void bannerClock.value;
  void appState.liveSchedule;
  void appState.odds;
  void appState.teams;
  void appState.matchLineupVersion;
  void appState.villainHeat;
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
    let modelProbs = null;
    let villain = null;
    if (teamA && teamB) {
      const pair = getLineupAdjustedPair(local, teamA, teamB);
      prediction = getPrediction(pair.teamA, pair.teamB, local);
      modelProbs = getModelProbabilities(pair.teamA, pair.teamB, local);
      villain = getVillainPrediction(pair.teamA, pair.teamB, local);
      predictText = getPredictionResultText(
        { ...local, score: local.liveScore, resultFinal: local.status === "FINISHED" },
        pair.teamA,
        pair.teamB
      );
      if (pair.adjusted) predictText += " · 按实际首发";
    }
    const predictParts = predictionParts(predictText);
    const market = getMarketLean(local, prediction, teamA, teamB);
    const winDrawLoss = modelProbs
      ? [
          { label: formatTeamName(local.team1), value: formatPercent(modelProbs.home) },
          { label: "平", value: formatPercent(modelProbs.draw) },
          { label: formatTeamName(local.team2), value: formatPercent(modelProbs.away) }
        ]
      : null;
    return {
      local, teamA, teamB, stageText, venueText, status, predictText, predictParts,
      market, winDrawLoss, villain, villainHeat: getVillainHeat(local),
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

const villainStats = computed(() => {
  void appState.liveSchedule;
  void appState.teams;
  void appState.matchLineupVersion;
  void appState.odds;
  return getVillainPredictionStats();
});

const justiceHeat = computed(() => {
  void appState.villainHeat;
  return getGlobalModeHeat("justice");
});

const evilHeat = computed(() => {
  void appState.villainHeat;
  return getGlobalModeHeat("evil");
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

function formatRoi(value) {
  if (!Number.isFinite(Number(value))) return "暂无赔率样本";
  const percent = Number(value) * 100;
  return `${percent > 0 ? "+" : ""}${Math.round(percent)}%`;
}

function isVillainOpen(key) {
  return villainCards.value.has(key);
}

function triggerBubble(refValue, timerName) {
  const now = Date.now();
  if (timerName === "justice") {
    if (now < justiceBubbleMutedUntil) return;
    justiceBubbleMutedUntil = now + 720;
  } else {
    if (now < evilBubbleMutedUntil) return;
    evilBubbleMutedUntil = now + 720;
  }
  refValue.value = false;
  const nextFrame = typeof requestAnimationFrame === "function" ? requestAnimationFrame : (fn) => setTimeout(fn, 0);
  nextTick(() => {
    nextFrame(() => {
      refValue.value = true;
    });
  });
  if (timerName === "justice") {
    clearTimeout(justiceBubbleTimer);
    justiceBubbleTimer = setTimeout(() => { justiceBubbleBump.value = false; }, 700);
  } else {
    clearTimeout(evilBubbleTimer);
    evilBubbleTimer = setTimeout(() => { evilBubbleBump.value = false; }, 700);
  }
}

async function toggleVillain(card) {
  const next = new Set(villainCards.value);
  const willOpen = !next.has(card.key);
  if (willOpen) {
    next.add(card.key);
    recordVillainHeat(card.local);
    recordGlobalModeHeat("evil");
  } else {
    next.delete(card.key);
    recordGlobalModeHeat("justice");
  }
  villainCards.value = next;
}

function scheduleBannerClock() {
  clearTimeout(bannerClockTimer);
  bannerClockTimer = setTimeout(() => {
    bannerClock.value = Date.now();
    scheduleBannerClock();
  }, getBannerClockDelay(bannerClock.value));
}

onMounted(scheduleBannerClock);
onBeforeUnmount(() => {
  clearTimeout(bannerClockTimer);
  clearTimeout(justiceBubbleTimer);
  clearTimeout(evilBubbleTimer);
});

watch(justiceHeat, (next, previous) => {
  if (Number(next) !== Number(previous)) triggerBubble(justiceBubbleBump, "justice");
}, { flush: "post" });

watch(evilHeat, (next, previous) => {
  if (Number(next) !== Number(previous)) triggerBubble(evilBubbleBump, "evil");
}, { flush: "post" });

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
  // 反派模式下也弹出对比弹窗(反派配色),而不是跳转到排名页
  openCompare(card.teamA, card.teamB, {
    ...card.local,
    meta: [card.status.label, card.stageText, card.venueText].filter(Boolean).join(" · ")
  }, { villain: isVillainOpen(card.key) });
}

function openVillainDetail(card) {
  openVillainTeamDetail(getVillainDetailTeam(card));
}

function getVillainDetailTeam(card) {
  if (card.villain.modelPick === "home") return card.teamB;
  if (card.villain.modelPick === "away") return card.teamA;
  if (card.villain.primaryOutcome === "home") return card.teamA;
  if (card.villain.primaryOutcome === "away") return card.teamB;
  return card.teamA;
}
</script>

<template>
  <div v-if="cards.length || stats.total" class="live-banner" aria-live="polite">
    <div v-if="stats.total" class="live-stat-card">
      <div class="live-stat-columns">
        <div class="live-stat-main">
          <span class="live-status stat-faction justice-status">
            <span class="live-dot" aria-hidden="true"></span>
            <span>正义</span>
            <span class="stat-heat-bubble justice-bubble" :class="{ bump: justiceBubbleBump }">{{ justiceHeat }}</span>
          </span>
          <span class="stat-value">{{ Math.round(stats.accuracy * 100) }}<small>%</small></span>
          <span class="live-meta">已完赛 {{ stats.total }} 场 · 命中 {{ stats.hits }} 场</span>
          <span class="live-meta">实际平局 {{ stats.draws }} 场 · 风险命中 {{ stats.drawHits }} 场</span>
        </div>
        <div class="live-stat-villain">
          <span class="live-status stat-faction villain-status">
            <span class="live-dot" aria-hidden="true"></span>
            <span>邪恶</span>
            <span class="stat-heat-bubble evil-bubble" :class="{ bump: evilBubbleBump }">{{ evilHeat }}</span>
          </span>
          <span class="stat-value villain-value">{{ Math.round(villainStats.accuracy * 100) }}<small>%</small></span>
          <span class="live-meta">反向命中 {{ villainStats.hits }}/{{ villainStats.total }} 场</span>
          <span class="live-meta">收益 {{ formatRoi(villainStats.roi) }} · 样本 {{ villainStats.stake }} 场</span>
        </div>
      </div>
      <span class="live-note">命中口径：主-平-客取最大概率（含平局）· 全部完赛场次</span>
    </div>
    <article
      v-for="card in cards"
      :key="card.key"
      role="button"
      tabindex="0"
      class="live-match-card"
      :class="[card.status.className, { 'villain-active': isVillainOpen(card.key) }]"
      :title="card.teamA && card.teamB ? (isVillainOpen(card.key) ? '点击查看反派模式对比' : '点击查看两队实力对比') : undefined"
      @click="onCardClick(card)"
      @keydown.enter.prevent="onCardClick(card)"
      @keydown.space.prevent="onCardClick(card)"
    >
      <span v-if="card.villainHeat" class="villain-heat-badge">反{{ card.villainHeat }}</span>
      <span class="live-card-top">
        <span class="live-status">
          <span class="live-dot" aria-hidden="true"></span>
          {{ card.status.label }}
        </span>
        <button
          v-if="card.villain"
          type="button"
          class="villain-toggle"
          :class="{ active: isVillainOpen(card.key) }"
          @click.stop="toggleVillain(card)"
        >
          {{ isVillainOpen(card.key) ? "正常" : "反派" }}
        </button>
      </span>
      <span class="live-teams">
        <strong>{{ formatTeamName(card.local.team1) }}</strong>
        <span class="live-score">{{ card.local.liveScore ?? "vs" }}</span>
        <strong>{{ formatTeamName(card.local.team2) }}</strong>
      </span>
      <span class="live-meta">{{ [card.local.date, card.local.time, card.stageText || "世界杯"].filter(Boolean).join(" · ") }}</span>
      <span class="live-venue">{{ card.venueText }}</span>
      <span v-if="card.winDrawLoss && !isVillainOpen(card.key)" class="live-probs">
        <span v-for="p in card.winDrawLoss" :key="p.label" class="live-prob">
          <span class="live-prob-label">{{ p.label }}</span>
          <span class="live-prob-value">{{ p.value }}</span>
        </span>
      </span>
      <span v-if="!isVillainOpen(card.key) && (card.predictText || card.odds)" class="live-card-info">
        <span v-if="card.predictText" class="live-predict" :class="{ hit: card.predictParts.hit }">
          <strong v-if="card.predictParts.hit">{{ card.predictParts.hit }}</strong>{{ card.predictParts.prefix }}<strong v-if="card.predictParts.favorite" class="live-favorite-team">{{ card.predictParts.favorite }}</strong>{{ card.predictParts.confidencePrefix }}<span v-if="card.predictParts.confidence" class="live-confidence">{{ card.predictParts.confidence }}</span>{{ card.predictParts.suffix }}
        </span>
        <span v-if="card.market" class="live-market" :class="{ disagree: card.market.disagree }">
          {{ card.market.disagree ? "市场分歧：" : "市场倾向 " }}<strong>{{ card.market.label }}</strong>
          <span class="live-confidence">{{ card.market.confidence }}</span>
        </span>
        <span v-if="card.odds" class="live-odds">{{ card.odds }}</span>
      </span>
      <span v-if="card.villain && isVillainOpen(card.key)" class="villain-panel" @click.stop="openVillainDetail(card)">
        <span class="villain-title">反派剧本开演</span>
        <strong>{{ card.villain.text }}</strong>
        <span>作案目标：专门不让 {{ card.villain.modelLabel }} 舒服</span>
        <span>坏人算法：{{ card.villain.label }} 就算计划得逞</span>
        <span v-if="card.villain.odds">黑账赔率 {{ card.villain.odds.toFixed(2) }}</span>
      </span>
    </article>
  </div>
</template>
