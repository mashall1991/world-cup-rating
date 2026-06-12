<script setup>
import { computed } from "vue";
import {
  appState, getSelectedTeam, getTier, formatScore, formatPercent, signed, clamp,
  scoreComponentConfig, tournamentStageConfig, getCoefficientTotal, getActiveCoefficientConfig,
  getEffectiveCoefficients, formatCoefficient, getDefaultCoefficientConfig,
  saveCoefficientConfig, saveStageLoadMode, refreshTeamScores, getStageLoadConfig
} from "../lib/engine.js";
import { ui, openLineup } from "../lib/ui.js";
import PlayerTable from "./PlayerTable.vue";

const team = computed(() => {
  void appState.teams;
  void appState.selectedId;
  return getSelectedTeam();
});

const effectiveCoefficients = computed(() => {
  void appState.coefficients;
  void appState.stageLoadMode;
  return getEffectiveCoefficients(getActiveCoefficientConfig());
});

const coefficientTotal = computed(() => getCoefficientTotal(appState.coefficients));

const dimensionRows = computed(() =>
  scoreComponentConfig.map(([key, label, , color]) => ({
    key, label, color,
    score: team.value?.scoreComponents?.[key] ?? 0,
    weight: formatCoefficient(effectiveCoefficients.value[key])
  }))
);

const environmentRows = computed(() => [
  ["联赛强度", team.value.environmentBreakdown.leagueStrength],
  ["俱乐部竞争力", team.value.environmentBreakdown.clubCompetitiveness],
  ["俱乐部角色稳定性", team.value.environmentBreakdown.roleStability]
]);

const performanceRows = computed(() => [
  ["正式比赛结果", team.value.performanceBreakdown.officialResults],
  ["正式比赛攻防", team.value.performanceBreakdown.officialGoalProfile],
  ["强队交手表现", team.value.performanceBreakdown.strongOpponent],
  ["球员俱乐部强度", team.value.performanceBreakdown.playerParticipation],
  ["API俱乐部覆盖", formatPercent(team.value.performanceBreakdown.clubStatsCoverage)],
  ["公开数据匹配", team.value.publicPerformance ? "已接入" : "未匹配"]
]);

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
</script>

<template>
  <section v-if="team" class="detail-panel" :class="{ expanded: ui.sheetOpen }" aria-live="polite">
    <button class="sheet-handle" type="button" aria-label="展开/收起评分详情" @click="ui.sheetOpen = !ui.sheetOpen">
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
        <span class="rank-pill">#{{ team.rank }}</span>
        <strong>{{ formatScore(team.finalScore) }}</strong>
        <span class="tier-label">{{ getTier(team.finalScore) }}</span>
      </div>
    </div>

    <section class="summary-grid" aria-label="评分摘要">
      <div class="metric-tile"><span>基础评分</span><strong>{{ formatScore(team.baseScore) }}</strong></div>
      <div class="metric-tile"><span>位置平衡</span><strong>{{ formatScore(team.scoreComponents.positionalBalance) }}</strong></div>
      <div class="metric-tile"><span>可用性系数</span><strong>{{ Math.round(team.availabilityAdjustment * 100) }}%</strong></div>
      <button class="metric-tile link-metric" type="button" @click="openLineup(team)">
        <span>预测首发</span><strong>{{ team.squadVersion.status }} →</strong>
      </button>
    </section>

    <section class="chart-section" aria-label="评分模型">
      <div class="section-heading">
        <h3>评分模型</h3>
        <span>系数合计 {{ formatCoefficient(coefficientTotal) }}%</span>
      </div>
      <div class="dimension-bars">
        <div v-for="row in dimensionRows" :key="row.key" class="dimension-row">
          <div class="dimension-label">
            <strong>{{ row.label }}</strong>
            <small>权重 {{ row.weight }}%</small>
          </div>
          <div class="bar-track" aria-hidden="true">
            <div class="bar-fill" :style="{ width: clamp(row.score) + '%', '--bar-color': row.color }"></div>
          </div>
          <div class="dimension-value">{{ formatScore(row.score) }}</div>
        </div>
      </div>

      <div class="coefficient-panel" aria-label="模型系数设置">
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
          <h3>近期表现</h3>
          <span>{{ team.publicPerformance ? `${team.publicPerformance.matches} 场公开比赛` : "样例输入" }}</span>
        </div>
        <div class="breakdown-list">
          <div v-for="[label, value] in performanceRows" :key="label" class="breakdown-row">
            <span>{{ label }}</span><strong>{{ displayValue(value) }}</strong>
          </div>
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
