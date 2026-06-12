<script setup>
import { onMounted } from "vue";
import { appState, loadLiveSchedule, loadOdds } from "./lib/engine.js";
import LiveBanner from "./components/LiveBanner.vue";
import TeamList from "./components/TeamList.vue";
import TeamDetail from "./components/TeamDetail.vue";
import ScheduleView from "./components/ScheduleView.vue";
import LineupDialog from "./components/LineupDialog.vue";
import CompareDialog from "./components/CompareDialog.vue";

const sortOptions = [
  ["rank", "综合排名"],
  ["squadQuality", "阵容质量"],
  ["recentMatchRating", "近期比赛"],
  ["positionalBalance", "位置平衡"],
  ["squadDepth", "阵容深度"],
  ["cohesionContinuity", "协同连续性"],
  ["ageLoad", "年龄耐久"]
];

function setView(view) {
  appState.view = view;
  if (view === "schedule" && !appState.liveScheduleAttempted) {
    loadLiveSchedule();
  }
}

onMounted(() => {
  loadLiveSchedule();
  loadOdds();
});
</script>

<template>
  <div class="app-shell">
    <header class="topbar">
      <div class="brand">
        <span class="brand-mark">⚽️</span>
        <div>
          <p class="eyebrow">World Cup 2026 · Competitive Strength</p>
          <h1>世界杯队伍实力评估</h1>
        </div>
      </div>
      <nav class="app-nav" aria-label="页面切换">
        <button :class="{ active: appState.view !== 'schedule' }" type="button" @click="setView('strength')">实力</button>
        <button :class="{ active: appState.view === 'schedule' }" type="button" @click="setView('schedule')">赛程</button>
      </nav>
    </header>

    <template v-if="appState.view !== 'schedule'">
      <section class="controls" aria-label="筛选与排序">
        <label class="select-box">
          <span>排序</span>
          <select v-model="appState.sortMode">
            <option v-for="[value, label] in sortOptions" :key="value" :value="value">{{ label }}</option>
          </select>
        </label>
      </section>

      <LiveBanner />

      <main class="workspace">
        <TeamList />
        <TeamDetail />
      </main>
    </template>

    <ScheduleView v-else />

    <LineupDialog />
    <CompareDialog />
  </div>
</template>
