<script setup>
import { computed } from "vue";
import { appState, getVisibleTeams, getTier, getEvilScore, getEvilTier, formatScore } from "../lib/engine.js";
import { ui } from "../lib/ui.js";

const teams = computed(() => {
  void appState.query;
  void appState.sortMode;
  void appState.teams;
  void appState.rankingVillainMode;
  return getVisibleTeams();
});

function tierClass(score) {
  if (score >= 90) return "tier-elite";
  if (score >= 80) return "tier-strong";
  if (score >= 70) return "tier-solid";
  if (score >= 60) return "tier-mid";
  return "tier-weak";
}

function selectTeam(team) {
  appState.selectedId = team.id;
  ui.sheetOpen = true;
}

function toggleVillainRanking() {
  appState.rankingVillainMode = !appState.rankingVillainMode;
}
</script>

<template>
  <aside class="team-panel" :class="{ 'villain-ranking-panel': appState.rankingVillainMode }" aria-label="队伍列表">
    <div class="panel-heading">
      <h2>{{ appState.rankingVillainMode ? "反派排行" : "队伍" }}</h2>
      <div class="panel-heading-actions">
        <button
          type="button"
          class="villain-ranking-toggle"
          :class="{ active: appState.rankingVillainMode }"
          @click="toggleVillainRanking"
        >
          反派
        </button>
        <span class="count-pill">{{ teams.length }}</span>
      </div>
    </div>
    <div v-if="appState.rankingVillainMode" class="team-list-head" aria-hidden="true">
      <span></span>
      <span></span>
      <span>反派国家</span>
      <span>邪恶指数</span>
    </div>
    <div class="team-list">
      <div v-if="!teams.length" class="empty-state">没有匹配队伍</div>
      <button
        v-for="team in teams"
        :key="team.id"
        type="button"
        class="team-button"
        :class="{ active: team.id === appState.selectedId }"
        @click="selectTeam(team)"
      >
        <span class="team-rank">{{ appState.rankingVillainMode ? team.evilRank : team.rank }}</span>
        <span class="team-flag" aria-hidden="true">{{ team.flag }}</span>
        <span class="team-copy">
          <strong>{{ team.name }}</strong>
          <small>{{ team.nameEn }} · {{ team.confederation }}</small>
        </span>
        <span class="team-score-wrap">
          <span class="team-score" :class="tierClass(appState.rankingVillainMode ? getEvilScore(team) : team.finalScore)">
            {{ formatScore(appState.rankingVillainMode ? getEvilScore(team) : team.finalScore) }}
          </span>
          <small>{{ appState.rankingVillainMode ? getEvilTier(getEvilScore(team)) : getTier(team.finalScore) }}</small>
        </span>
      </button>
    </div>
  </aside>
</template>
