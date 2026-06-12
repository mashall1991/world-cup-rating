<script setup>
import { onMounted } from "vue";
import { appState, loadLiveSchedule, loadOdds } from "./lib/engine.js";
import LiveBanner from "./components/LiveBanner.vue";
import TeamList from "./components/TeamList.vue";
import TeamDetail from "./components/TeamDetail.vue";
import ScheduleView from "./components/ScheduleView.vue";
import LineupDialog from "./components/LineupDialog.vue";
import CompareDialog from "./components/CompareDialog.vue";

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
