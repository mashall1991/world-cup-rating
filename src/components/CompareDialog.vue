<script setup>
import { computed, ref, watch } from "vue";
import {
  LINEUP_API, dimensionConfig, tryLiveLineup, saveLineupCache, readLineupCache,
  recomputeWithLineup, ensureMatchLineups, getTier, formatScore, clamp
} from "../lib/engine.js";
import { ui, closeCompare } from "../lib/ui.js";

const colA = ref(null);
const colB = ref(null);
const adjustedA = ref(null);
const adjustedB = ref(null);
const note = ref("");

const teamA = computed(() => adjustedA.value ?? ui.compare.teamA);
const teamB = computed(() => adjustedB.value ?? ui.compare.teamB);

const metaText = computed(() => {
  const match = ui.compare.match ?? {};
  return [match.date, match.time !== "--" ? match.time : "", match.meta].filter(Boolean).join(" · ");
});

const compareRows = computed(() => {
  if (!teamA.value || !teamB.value) return [];
  return [
    ["综合得分", teamA.value.finalScore, teamB.value.finalScore, "var(--text-strong)"],
    ["基础评分", teamA.value.baseScore, teamB.value.baseScore, "var(--text-muted)"],
    ...dimensionConfig.map(([key, label, , color]) => [
      label,
      teamA.value.dimensions[key],
      teamB.value.dimensions[key],
      color
    ])
  ];
});

function makeColumn(team) {
  return { team, lineup: team.startingXI ?? [], meta: "本地预测" };
}

async function resolveColumn(col, team, token) {
  col.meta = "获取实时名单…";
  const live = await tryLiveLineup(team).catch(() => null);
  if (token !== ui.compare.token || !ui.compare.open) return null;
  if (live) {
    col.lineup = live;
    col.meta = "实时名单";
    saveLineupCache(team.id, live);
    return live;
  }
  const cached = readLineupCache(team.id);
  if (cached?.lineup?.length) {
    col.lineup = cached.lineup;
    col.meta = "缓存名单";
  } else {
    col.meta = "本地预测";
  }
  return null;
}

watch(
  () => ui.compare.open,
  async (open) => {
    if (!open || !ui.compare.teamA || !ui.compare.teamB) return;
    const token = ui.compare.token;
    const a = ui.compare.teamA;
    const b = ui.compare.teamB;
    adjustedA.value = null;
    adjustedB.value = null;
    note.value = "";
    colA.value = makeColumn(a);
    colB.value = makeColumn(b);

    if (!LINEUP_API.available) return;

    // 优先用按场次保存的实际首发(已完赛场次冻结,不再请求)
    const saved = await ensureMatchLineups(ui.compare.match ?? {}, a, b).catch(() => null);
    if (token !== ui.compare.token || !ui.compare.open) return;
    if (saved?.lineups) {
      const label = saved.phase === "post" ? "实际首发 · 已保存" : "赛前名单 · 已保存";
      colA.value = { team: a, lineup: saved.lineups.home, meta: label };
      colB.value = { team: b, lineup: saved.lineups.away, meta: label };
      const adjA = recomputeWithLineup(a, saved.lineups.home);
      const adjB = recomputeWithLineup(b, saved.lineups.away);
      if (adjA || adjB) {
        adjustedA.value = adjA;
        adjustedB.value = adjB;
        const noteParts = [
          adjA ? `${a.name} 匹配 ${adjA.lineupMatched} 人` : "",
          adjB ? `${b.name} 匹配 ${adjB.lineupMatched} 人` : ""
        ].filter(Boolean);
        note.value = `已按保存的实际首发修正评分 · ${noteParts.join(" · ")}`;
      }
      return;
    }

    const [liveA, liveB] = await Promise.all([
      resolveColumn(colA.value, a, token),
      resolveColumn(colB.value, b, token)
    ]);
    if (token !== ui.compare.token || !ui.compare.open) return;

    const adjA = liveA ? recomputeWithLineup(a, liveA) : null;
    const adjB = liveB ? recomputeWithLineup(b, liveB) : null;
    if (!adjA && !adjB) return;
    adjustedA.value = adjA;
    adjustedB.value = adjB;
    const noteParts = [
      adjA ? `${a.name} 匹配 ${adjA.lineupMatched} 人` : "",
      adjB ? `${b.name} 匹配 ${adjB.lineupMatched} 人` : ""
    ].filter(Boolean);
    note.value = `已按实时首发修正评分 · ${noteParts.join(" · ")}`;
  }
);
</script>

<template>
  <Teleport to="body">
    <div v-if="ui.compare.open && teamA && teamB" class="modal-overlay" @click.self="closeCompare()">
      <div class="modal compare-dialog" role="dialog" aria-modal="true" aria-label="两队实力对比">
        <div class="dialog-head">
          <div>
            <p class="eyebrow">{{ metaText }}</p>
            <h2>{{ teamA.flag }} {{ teamA.name }} <span class="vs">vs</span> {{ teamB.flag }} {{ teamB.name }}</h2>
          </div>
          <button class="icon-button" type="button" aria-label="关闭对比" @click="closeCompare()">×</button>
        </div>

        <div class="compare-body">
          <div class="compare-score-section">
            <div class="compare-head">
              <div class="compare-team">
                <strong>{{ teamA.name }}</strong>
                <small>#{{ teamA.rank }} · {{ getTier(teamA.finalScore) }}</small>
              </div>
              <div class="compare-score">{{ formatScore(teamA.finalScore) }} : {{ formatScore(teamB.finalScore) }}</div>
              <div class="compare-team">
                <strong>{{ teamB.name }}</strong>
                <small>#{{ teamB.rank }} · {{ getTier(teamB.finalScore) }}</small>
              </div>
            </div>
            <div v-if="note" class="compare-adjust-note">{{ note }}</div>
            <div v-for="[label, valueA, valueB, color] in compareRows" :key="label" class="compare-row">
              <strong class="compare-value-left" :class="{ lead: valueA >= valueB }">{{ formatScore(valueA) }}</strong>
              <div class="bar-track left"><div class="bar-fill" :style="{ width: clamp(valueA) + '%', '--bar-color': color }"></div></div>
              <span class="compare-label">{{ label }}</span>
              <div class="bar-track"><div class="bar-fill" :style="{ width: clamp(valueB) + '%', '--bar-color': color }"></div></div>
              <strong :class="{ lead: valueB > valueA }">{{ formatScore(valueB) }}</strong>
            </div>
          </div>

          <section class="compare-lineups">
            <div class="section-heading">
              <h3>首发阵容</h3>
              <span>实时优先 · 不可用回退本地</span>
            </div>
            <div class="compare-lineup-grid">
              <div v-for="col in [colA, colB]" :key="col?.team?.id" class="compare-lineup-col">
                <div class="compare-lineup-head">
                  <strong>{{ col.team.flag }} {{ col.team.name }}</strong>
                  <small>{{ col.meta }}</small>
                </div>
                <ol class="compare-lineup-list">
                  <li
                    v-for="(item, index) in col.lineup"
                    :key="index"
                    class="compare-lineup-item"
                    :class="{ placeholder: item.placeholder }"
                  >
                    <span class="cl-pos">{{ item.position }}</span>
                    <span class="cl-name">{{ item.name }}</span>
                  </li>
                </ol>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </Teleport>
</template>
