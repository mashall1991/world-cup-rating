<script setup>
import { computed } from "vue";
import {
  appState, getRecentMatchRows, getFullScheduleRows,
  getScheduleSourceLabel, formatGeneratedAt, findTeamByName,
  formatTeamName, getPredictionBadge, getPredictionResultText, getMissingRatingLabel,
  getLineupAdjustedPair, renderOddsText, getMatchBenchmarkRow
} from "../lib/engine.js";
import { openCompare } from "../lib/ui.js";

function formatProbs(probs) {
  if (!probs) return null;
  return {
    home: Math.round(probs.home * 100),
    draw: Math.round(probs.draw * 100),
    away: Math.round(probs.away * 100)
  };
}

function buildBenchLines(bench) {
  const lines = [
    { key: "model", name: "模型", probs: formatProbs(bench.model) },
    { key: "bookmaker", name: "博彩", probs: formatProbs(bench.bookmaker) },
    { key: "elo", name: "Elo", probs: formatProbs(bench.elo) }
  ];
  return { lines, show: lines.some((line) => line.probs) };
}

const updatedText = computed(() => {
  const updatedAt = appState.liveSchedule?.fetchedAt ?? appState.publicData?.manifest?.generated_at;
  const sourceLabel = getScheduleSourceLabel().replace("本地数据", "本地").replace("实时 · ", "");
  const updatedLabel = formatGeneratedAt(updatedAt).replace(" 北京时间", "").replace(/^(\d{4})-/, "");
  return `${updatedLabel} · ${sourceLabel} · UTC+8`;
});

const isFull = computed(() => appState.scheduleMode === "full");

const rows = computed(() => {
  void appState.liveSchedule;
  void appState.odds;
  void appState.teams;
  void appState.matchLineupVersion;
  const base = isFull.value ? getFullScheduleRows() : getRecentMatchRows();
  const visible = isFull.value ? base : base.slice(0, 80);
  return {
    total: base.length,
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
        odds: renderOddsText(match),
        benchmark: teamA && teamB ? buildBenchLines(getMatchBenchmarkRow(match, pair.teamA, pair.teamB)) : null
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
    <section class="schedule-controls" aria-label="赛程类型">
      <div class="segmented-control" role="tablist" aria-label="赛程类型">
        <button :class="{ active: !isFull }" type="button" @click="appState.scheduleMode = 'recent'">近期比赛</button>
        <button :class="{ active: isFull }" type="button" @click="appState.scheduleMode = 'full'">完整赛程</button>
      </div>
      <div class="schedule-status">
        <strong>{{ updatedText }}</strong>
      </div>
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
            <div v-if="item.benchmark && item.benchmark.show" class="match-benchmark" aria-label="三方胜平负概率对照">
              <div
                v-for="line in item.benchmark.lines"
                :key="line.key"
                class="bench-line"
                :class="{ 'bench-line-model': line.key === 'model' }"
              >
                <span class="bench-name">{{ line.name }}</span>
                <template v-if="line.probs">
                  <span class="bench-prob">主<b>{{ line.probs.home }}</b></span>
                  <span class="bench-prob">平<b>{{ line.probs.draw }}</b></span>
                  <span class="bench-prob">客<b>{{ line.probs.away }}</b></span>
                </template>
                <span v-else class="bench-na">无数据</span>
              </div>
            </div>
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

<style scoped>
.match-benchmark {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-top: 6px;
}

.bench-line {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11.5px;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

.bench-line-model {
  color: var(--text-strong);
  font-weight: 600;
}

.bench-name {
  flex: none;
  width: 30px;
}

.bench-prob b {
  font-weight: 700;
  margin-left: 1px;
}

.bench-line-model .bench-prob b { color: var(--accent); }

.bench-na { color: var(--text-faint); }
</style>
