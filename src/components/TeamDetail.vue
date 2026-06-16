<script setup>
import { computed, ref, watch } from "vue";
import {
  appState, getSelectedTeam, getTier, formatScore, formatPercent, signed, clamp,
  scoreComponentConfig, tournamentStageConfig, getCoefficientTotal, getActiveCoefficientConfig,
  getEffectiveCoefficients, formatCoefficient, getDefaultCoefficientConfig,
  saveCoefficientConfig, saveStageLoadMode, refreshTeamScores, getStageLoadConfig,
  ensureTeamLineup, getEvilScore, getEvilTier
} from "../lib/engine.js";
import { ui, openLineup } from "../lib/ui.js";
import PlayerTable from "./PlayerTable.vue";

const team = computed(() => {
  void appState.teams;
  void appState.selectedId;
  void appState.rankingVillainMode;
  return getSelectedTeam();
});

const effectiveCoefficients = computed(() => {
  void appState.coefficients;
  void appState.stageLoadMode;
  return getEffectiveCoefficients(getActiveCoefficientConfig());
});

const coefficientTotal = computed(() => getCoefficientTotal(appState.coefficients));

const isVillainRanking = computed(() => appState.rankingVillainMode);

const dimensionRows = computed(() =>
  scoreComponentConfig.map(([key, label, , color]) => ({
    key, label, color,
    score: team.value?.scoreComponents?.[key] ?? 0,
    weight: formatCoefficient(effectiveCoefficients.value[key])
  }))
);

const evilRows = computed(() => {
  const evil = team.value?.evilBreakdown ?? {};
  return [
    ["faceJustice", "面对正义表现", evil.faceJustice, "#ef4444"],
    ["upsetPower", "爆冷作案能力", evil.upsetPower, "#f97316"],
    ["justiceNotHereYet", "正义未到韧性", evil.justiceNotHereYet, "#fb7185"],
    ["underdogAura", "弱者反杀气场", evil.underdogAura, "#fbbf24"]
  ].map(([key, label, score, color]) => ({ key, label, score: clamp(score), color }));
});

const environmentRows = computed(() => [
  ["联赛强度", team.value.environmentBreakdown.leagueStrength],
  ["俱乐部竞争力", team.value.environmentBreakdown.clubCompetitiveness],
  ["俱乐部角色稳定性", team.value.environmentBreakdown.roleStability]
]);

const performanceRows = computed(() => [
  [isVillainRanking.value ? "常规作案效率" : "正式比赛结果", team.value.performanceBreakdown.officialResults],
  [isVillainRanking.value ? "进退场破坏力" : "正式比赛攻防", team.value.performanceBreakdown.officialGoalProfile],
  [isVillainRanking.value ? "面对正义表现" : "强队交手表现", team.value.performanceBreakdown.strongOpponent],
  [isVillainRanking.value ? "欺负弱队被扣戏份" : "弱队未胜扣分", signed(-(team.value.performanceBreakdown.weakOpponentPenalty ?? 0))],
  ["球员俱乐部强度", team.value.performanceBreakdown.playerParticipation],
  ["API俱乐部覆盖", formatPercent(team.value.performanceBreakdown.clubStatsCoverage)],
  ["公开数据匹配", team.value.publicPerformance ? "已接入" : "未匹配"]
]);

const evilBreakdownRows = computed(() => {
  const evil = team.value?.evilBreakdown ?? {};
  return [
    ["面对正义表现", evil.faceJustice],
    ["爆冷作案能力", evil.upsetPower],
    ["正义未到韧性", evil.justiceNotHereYet],
    ["弱者反杀气场", evil.underdogAura],
    ["欺负弱队扣戏份", signed(-(evil.weakTeamBullyPenalty ?? 0))]
  ];
});

const cohesionRows = computed(() => [
  ["国家队共同出场", team.value.cohesionBreakdown.nationalTeam],
  ["同俱乐部共同出场", team.value.cohesionBreakdown.club],
  ["俱乐部数据修正", signed(team.value.cohesionBreakdown.clubDataAdjustment ?? 0)],
  ["青训/历史经历", team.value.cohesionBreakdown.historical]
]);

const ageBoxes = computed(() => [
  ["加权年龄分", formatScore(team.value.ageProfile.weightedAgeScore)],
  ["黄金年龄占比", `${team.value.ageProfile.primeShare}%`],
  ["满分区间", "25-28"]
]);

watch(
  team,
  (selectedTeam) => {
    if (selectedTeam) void ensureTeamLineup(selectedTeam);
  },
  { immediate: true }
);

function displayValue(value) {
  return Number.isFinite(Number(value)) ? formatScore(value) : String(value);
}

function onCoefficientChange(key, event) {
  appState.coefficients[key] = clamp(Number(event.target.value));
  saveCoefficientConfig(appState.coefficients);
  refreshTeamScores();
}

function onStageChange(event) {
  appState.stageLoadMode = event.target.value;
  saveStageLoadMode(appState.stageLoadMode);
  refreshTeamScores();
}

function resetCoefficients() {
  appState.coefficients = getDefaultCoefficientConfig();
  saveCoefficientConfig(appState.coefficients);
  refreshTeamScores();
}

// 移动端底部浮层：把手支持拖动展开/收起，轻点则切换
const panelRef = ref(null);
let dragStartY = 0;
let collapsedOffset = 0;
let dragging = false;
let moved = false;

function onHandleDown(event) {
  const panel = panelRef.value;
  if (!panel) return;
  dragging = true;
  moved = false;
  dragStartY = event.clientY;
  collapsedOffset = Math.max(panel.offsetHeight - 112, 0);
  panel.style.transition = "none";
  event.currentTarget.setPointerCapture?.(event.pointerId);
  window.addEventListener("pointermove", onHandleMove);
  window.addEventListener("pointerup", onHandleUp);
}

function onHandleMove(event) {
  const panel = panelRef.value;
  if (!dragging || !panel) return;
  const delta = event.clientY - dragStartY;
  if (Math.abs(delta) > 4) moved = true;
  const base = ui.sheetOpen ? 0 : collapsedOffset;
  const next = Math.min(Math.max(base + delta, 0), collapsedOffset);
  panel.style.transform = `translateY(${next}px)`;
}

function onHandleUp(event) {
  const panel = panelRef.value;
  dragging = false;
  window.removeEventListener("pointermove", onHandleMove);
  window.removeEventListener("pointerup", onHandleUp);
  if (!panel) return;
  panel.style.transition = "";
  panel.style.transform = "";
  if (!moved) {
    ui.sheetOpen = !ui.sheetOpen;
    return;
  }
  const delta = event.clientY - dragStartY;
  if (delta < -40) ui.sheetOpen = true;
  else if (delta > 40) ui.sheetOpen = false;
}
</script>

<template>
  <section v-if="team" ref="panelRef" class="detail-panel" :class="{ expanded: ui.sheetOpen, 'evil-detail': isVillainRanking }" aria-live="polite">
    <button class="sheet-handle" type="button" aria-label="拖动或点击展开/收起评分详情" @pointerdown="onHandleDown">
      <span></span>
    </button>

    <div class="score-band" :style="{ '--badge-color': team.badgeColor }">
      <div class="team-identity">
        <div class="team-badge" aria-hidden="true">{{ team.flag }}</div>
        <div class="team-titles">
          <p class="eyebrow">{{ team.confederation }}<template v-if="team.group"> · {{ team.group.replace('Group ', '小组 ') }}</template></p>
          <h2>{{ team.name }}</h2>
          <p class="muted">{{ team.nameEn }} · {{ team.squadVersion.status }} · {{ team.squadVersion.date }}</p>
        </div>
      </div>
      <div class="score-block">
        <span class="rank-pill">#{{ isVillainRanking ? team.evilRank : team.rank }}</span>
        <strong>{{ formatScore(isVillainRanking ? getEvilScore(team) : team.finalScore) }}</strong>
        <span class="tier-label">{{ isVillainRanking ? getEvilTier(getEvilScore(team)) : getTier(team.finalScore) }}</span>
      </div>
    </div>

    <section class="summary-grid" :aria-label="isVillainRanking ? '邪恶分摘要' : '评分摘要'">
      <div class="metric-tile">
        <span>{{ isVillainRanking ? "邪恶分" : "基础评分" }}</span>
        <strong>{{ formatScore(isVillainRanking ? getEvilScore(team) : team.baseScore) }}</strong>
      </div>
      <div class="metric-tile">
        <span>{{ isVillainRanking ? "面对正义表现" : "位置平衡" }}</span>
        <strong>{{ formatScore(isVillainRanking ? team.evilBreakdown.faceJustice : team.scoreComponents.positionalBalance) }}</strong>
      </div>
      <div class="metric-tile">
        <span>{{ isVillainRanking ? "正义未到韧性" : "可用性系数" }}</span>
        <strong>{{ isVillainRanking ? formatScore(team.evilBreakdown.justiceNotHereYet) : `${Math.round(team.availabilityAdjustment * 100)}%` }}</strong>
      </div>
      <button class="metric-tile link-metric" type="button" @click="openLineup(team)">
        <span>{{ team.lineupCacheSavedAt ? "已保存出场名单" : "预测首发" }}</span>
        <strong>{{ team.lineupCacheSavedAt ? "查看名单" : team.squadVersion.status }} →</strong>
      </button>
    </section>

    <section class="chart-section" aria-label="评分模型">
      <div class="section-heading">
        <h3>{{ isVillainRanking ? "邪恶分拆解" : "评分模型" }}</h3>
        <span>{{ isVillainRanking ? "强队越难受，分越高" : `系数合计 ${formatCoefficient(coefficientTotal)}%` }}</span>
      </div>
      <div class="dimension-bars">
        <div v-for="row in (isVillainRanking ? evilRows : dimensionRows)" :key="row.key" class="dimension-row">
          <div class="dimension-label">
            <strong>{{ row.label }}</strong>
            <small>{{ isVillainRanking ? "反派指标" : `权重 ${row.weight}%` }}</small>
          </div>
          <div class="bar-track" aria-hidden="true">
            <div class="bar-fill" :style="{ width: clamp(row.score) + '%', '--bar-color': row.color }"></div>
          </div>
          <div class="dimension-value">{{ formatScore(row.score) }}</div>
        </div>
      </div>

      <div v-if="!isVillainRanking" class="coefficient-panel" aria-label="模型系数设置">
        <label class="stage-load-row">
          <span>赛程阶段</span>
          <select :value="getStageLoadConfig().key" @change="onStageChange">
            <option v-for="[key, label] in tournamentStageConfig" :key="key" :value="key">{{ label }}</option>
          </select>
          <small>年龄有效 {{ formatCoefficient(effectiveCoefficients.ageLoad) }}%</small>
        </label>
        <div class="coefficient-controls">
          <label v-for="[key, label] in scoreComponentConfig" :key="key" class="coefficient-row">
            <span>{{ label }}</span>
            <input
              type="number" min="0" max="100" step="1"
              :value="formatCoefficient(appState.coefficients[key])"
              @change="onCoefficientChange(key, $event)"
            />
            <small>%</small>
          </label>
        </div>
        <button class="ghost-button" type="button" @click="resetCoefficients">重置默认系数</button>
      </div>
    </section>

    <section class="split-section">
      <div class="data-section">
        <div class="section-heading"><h3>竞技环境</h3><span>来源指标</span></div>
        <div class="breakdown-list">
          <div v-for="[label, value] in environmentRows" :key="label" class="breakdown-row">
            <span>{{ label }}</span><strong>{{ displayValue(value) }}</strong>
          </div>
        </div>
      </div>
      <div class="data-section">
        <div class="section-heading">
          <h3>{{ isVillainRanking ? "反派战绩" : "近期表现" }}</h3>
          <span>{{ team.publicPerformance ? `${team.publicPerformance.matches} 场公开比赛` : "样例输入" }}</span>
        </div>
        <div class="breakdown-list">
          <div v-for="[label, value] in performanceRows" :key="label" class="breakdown-row">
            <span>{{ label }}</span><strong>{{ displayValue(value) }}</strong>
          </div>
        </div>
      </div>
    </section>

    <section v-if="isVillainRanking" class="data-section evil-section">
      <div class="section-heading"><h3>邪恶账本</h3><span>强队越破防越好看</span></div>
      <div class="breakdown-list">
        <div v-for="[label, value] in evilBreakdownRows" :key="label" class="breakdown-row">
          <span>{{ label }}</span><strong>{{ displayValue(value) }}</strong>
        </div>
      </div>
    </section>

    <section class="split-section">
      <div class="data-section">
        <div class="section-heading"><h3>年龄结构</h3><span>{{ team.ageProfile.riskPositions }}</span></div>
        <div class="age-profile">
          <div v-for="[label, value] in ageBoxes" :key="label" class="age-box">
            <span>{{ label }}</span><strong>{{ value }}</strong>
          </div>
        </div>
      </div>
      <div class="data-section">
        <div class="section-heading"><h3>协同经验</h3><span>球员组合</span></div>
        <div class="breakdown-list">
          <div v-for="[label, value] in cohesionRows" :key="label" class="breakdown-row">
            <span>{{ label }}</span><strong>{{ displayValue(value) }}</strong>
          </div>
        </div>
      </div>
    </section>

    <section class="squad-section" aria-label="关键球员">
      <div class="section-heading">
        <h3>关键球员</h3>
        <span class="count-pill">{{ team.players.length }}</span>
      </div>
      <PlayerTable :players="team.players" />
    </section>
  </section>
</template>
