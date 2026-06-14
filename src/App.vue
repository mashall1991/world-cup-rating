<script setup>
import { onBeforeUnmount, onMounted } from "vue";
import { appState, loadLiveSchedule, loadOdds } from "./lib/engine.js";
import LiveBanner from "./components/LiveBanner.vue";
import BenchmarkPanel from "./components/BenchmarkPanel.vue";
import TeamList from "./components/TeamList.vue";
import TeamDetail from "./components/TeamDetail.vue";
import ScheduleView from "./components/ScheduleView.vue";
import LineupDialog from "./components/LineupDialog.vue";
import CompareDialog from "./components/CompareDialog.vue";

const DAY_THEME_START_HOUR = 7;
const NIGHT_THEME_START_HOUR = 19;
let timeThemeTimer = null;

function setView(view) {
  appState.view = view;
  if (view === "schedule" && !appState.liveScheduleAttempted) {
    loadLiveSchedule();
  }
}

function applyTimeTheme() {
  const hour = new Date().getHours();
  const isDay = hour >= DAY_THEME_START_HOUR && hour < NIGHT_THEME_START_HOUR;
  document.documentElement.dataset.timeTheme = isDay ? "day" : "night";
}

function scheduleTimeTheme() {
  applyTimeTheme();
  clearInterval(timeThemeTimer);
  timeThemeTimer = setInterval(applyTimeTheme, 60 * 1000);
}

onMounted(() => {
  scheduleTimeTheme();
  loadLiveSchedule();
  loadOdds();
});

onBeforeUnmount(() => clearInterval(timeThemeTimer));
</script>

<template>
  <div class="app-shell" :class="`view-${appState.view}`">
    <header class="topbar">
      <div class="brand">
        <span class="brand-mark">⚽️</span>
        <div>
          <p class="eyebrow">World Cup 2026 · Competitive Strength</p>
          <h1>世界杯大聪明</h1>
        </div>
      </div>
      <nav class="app-nav" aria-label="页面切换">
        <button :class="{ active: appState.view === 'events' }" type="button" @click="setView('events')">赛事</button>
        <button :class="{ active: appState.view === 'ranking' }" type="button" @click="setView('ranking')">排名</button>
        <button :class="{ active: appState.view === 'schedule' }" type="button" @click="setView('schedule')">赛程</button>
      </nav>
    </header>

    <main v-if="appState.view === 'events'" class="events-page" aria-label="赛事概览">
      <LiveBanner />
      <BenchmarkPanel />
    </main>

    <template v-else-if="appState.view === 'ranking'">
      <main class="workspace">
        <TeamList />
        <TeamDetail />
      </main>
    </template>

    <ScheduleView v-else-if="appState.view === 'schedule'" />

    <LineupDialog />
    <CompareDialog />
  </div>
</template>
