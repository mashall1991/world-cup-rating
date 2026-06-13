<script setup>
import { computed } from "vue";
import {
  appState, getRecentMatchRows, getFullScheduleRows, matchMatchesScheduleFilters,
  getWorldCupMatches, getScheduleSourceLabel, formatGeneratedAt, findTeamByName,
  formatTeamName, getPredictionBadge, getPredictionResultText, getMissingRatingLabel,
  getLineupAdjustedPair, renderOddsText
} from "../lib/engine.js";
import { openCompare } from "../lib/ui.js";

const groups = computed(() => {
  void appState.liveSchedule;
  return getWorldCupMatches()
    .map((match) => match.group)
    .filter(Boolean)
    .filter((group, index, list) => list.indexOf(group) === index)
    .sort((a, b) => a.localeCompare(b));
});

const updatedText = computed(() => {
  const updatedAt = appState.liveSchedule?.fetchedAt ?? appState.publicData?.manifest?.generated_at;
  return `${formatGeneratedAt(updatedAt)} · ${getScheduleSourceLabel()}`;
});

const isFull = computed(() => appState.scheduleMode === "full");

const rows = computed(() => {
  void appState.liveSchedule;
  void appState.odds;
  void appState.teams;
  void appState.scheduleQuery;
  void appState.scheduleGroup;
  void appState.matchLineupVersion;
  const base = isFull.value ? getFullScheduleRows() : getRecentMatchRows();
  const filtered = base.filter(matchMatchesScheduleFilters);
  const visible = isFull.value ? filtered : filtered.slice(0, 80);
  return {
    total: filtered.length,
    items: visible.map((match, index) => {
      const teamA = findTeamByName(match.team1);
      const teamB = findTeamByName(match.team2);
      // 有保存的实际首发时,预测按首发修正分计算(只读取,不发请求)
      const pair = getLineupAdjustedPair(match, teamA, teamB);
      const suffix = pair.adjusted ? " · 按实际首发" : "";
      const badge = getPredictionBadge(match, pair.teamA, pair.teamB);
      return {
        match, teamA, teamB,
        key: `${match.date}|${match.team1}|${match.team2}|${index}`,
        badge,
        prediction: teamA && teamB ? getPredictionResultText(match, pair.teamA, pair.teamB) + suffix : "",
        missed: badge === "预测未中",
        missing: getMissingRatingLabel(match, teamA, teamB),
        odds: renderOddsText(match)
      };
    })
  };
});

function onRowClick(item) {
  if (item.teamA && item.teamB) openCompare(item.teamA, item.teamB, item.match);
}
</script>

<template>
  <section class="schedule-view" aria-label="赛程页">
    <section class="schedule-hero">
      <div>
        <p class="eyebrow">Matches</p>
        <h2>赛程与近期比赛</h2>
      </div>
      <div class="schedule-status">
        <span>数据更新 · 全部时间为北京时间 (UTC+8)</span>
        <strong>{{ updatedText }}</strong>
      </div>
    </section>

    <section class="schedule-controls" aria-label="赛程筛选">
      <div class="segmented-control" role="tablist" aria-label="赛程类型">
        <button :class="{ active: !isFull }" type="button" @click="appState.scheduleMode = 'recent'">近期比赛</button>
        <button :class="{ active: isFull }" type="button" @click="appState.scheduleMode = 'full'">完整赛程</button>
      </div>
      <label class="select-box">
        <span>小组</span>
        <select v-model="appState.scheduleGroup" :disabled="!isFull">
          <option value="all">全部</option>
          <option v-for="group in groups" :key="group" :value="group">{{ group.replace("Group ", "小组 ") }}</option>
        </select>
      </label>
    </section>

    <section class="schedule-panel">
      <div class="section-heading">
        <h3>{{ isFull ? "完整赛程" : "近期比赛" }}</h3>
        <span class="count-pill">{{ isFull ? `${rows.total} 场` : `${rows.items.length}/${rows.total} 场` }}</span>
      </div>
      <div class="schedule-list">
        <div v-if="!rows.items.length" class="empty-state">
          {{ appState.publicData ? "没有匹配比赛" : "未加载公开比赛数据" }}
        </div>
        <article
          v-for="item in rows.items"
          :key="item.key"
          class="match-row"
          :class="{ clickable: item.teamA && item.teamB, missed: item.missed }"
          :title="item.missing || (item.teamA && item.teamB ? '点击查看两队实力对比' : undefined)"
          @click="onRowClick(item)"
        >
          <div class="match-main">
            <div class="match-date">
              <strong>{{ item.match.date }}</strong>
              <span>{{ item.match.time }}</span>
              <span>{{ item.match.meta }}</span>
            </div>
            <div class="match-teams">
              <span class="match-team home">{{ formatTeamName(item.match.team1) }}</span>
              <span class="match-score">{{ item.match.score }}</span>
              <span class="match-team away">{{ formatTeamName(item.match.team2) }}</span>
            </div>
            <div v-if="item.odds" class="match-odds">{{ item.odds }}</div>
          </div>
          <div class="match-side">
            <span class="match-pill">{{ item.match.badge }}</span>
            <span v-if="item.badge" class="match-pill match-pill-success">{{ item.badge }}</span>
            <span v-if="item.prediction" class="match-prediction">{{ item.prediction }}</span>
            <span v-if="item.missing" class="match-pill match-pill-muted">缺少模型评分</span>
            <span class="match-place">{{ item.match.place }}</span>
          </div>
        </article>
      </div>
    </section>
  </section>
</template>
