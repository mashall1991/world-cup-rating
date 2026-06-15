<script setup>
import { computed } from "vue";
import { appState, getBenchmarkComparison } from "../lib/engine.js";

const MODEL_ORDER = ["model", "bookmaker", "elo"];

const report = computed(() => {
  void appState.liveSchedule;
  void appState.teams;
  void appState.odds;
  void appState.matchLineupVersion;
  return getBenchmarkComparison();
});

const columns = computed(() => MODEL_ORDER.map((key) => ({ key, label: report.value.models[key].label })));

const rows = computed(() => {
  const models = report.value.models;
  const defs = [
    { key: "accuracy", label: "命中率", better: "high", format: (v) => `${Math.round(v * 100)}%` },
    { key: "brier", label: "Brier 分", better: "low", format: (v) => v.toFixed(3) },
    { key: "logloss", label: "对数损失", better: "low", format: (v) => v.toFixed(3) }
  ];
  return defs.map((def) => {
    const values = MODEL_ORDER.map((key) => models[key][def.key]).filter((v) => v != null && Number.isFinite(v));
    const best = values.length ? (def.better === "high" ? Math.max(...values) : Math.min(...values)) : null;
    return {
      label: def.label,
      cells: MODEL_ORDER.map((key) => {
        const value = models[key][def.key];
        const valid = value != null && Number.isFinite(value);
        return {
          key,
          text: valid ? def.format(value) : "—",
          best: valid && best != null && value === best && values.length > 1
        };
      })
    };
  });
});
</script>

<template>
  <section class="benchmark-panel" aria-label="模型对比基准">
    <div class="benchmark-head">
      <h3>模型对比 · 回测战绩</h3>
      <span class="benchmark-sub">你的模型 vs 市场赔率 vs Elo</span>
    </div>

    <p v-if="!report.sampleSize" class="benchmark-empty">
      暂无可对比的完赛样本。回测从现在开始积累——每有一场三方都具备赔率/评分数据的比赛结束，就会自动计入下表。
    </p>

    <template v-else>
      <div class="benchmark-table" role="table">
        <div class="benchmark-row benchmark-row-head" role="row">
          <span class="benchmark-metric" role="columnheader">指标</span>
          <span
            v-for="col in columns"
            :key="col.key"
            class="benchmark-cell benchmark-cell-head"
            :class="{ 'is-model': col.key === 'model' }"
            role="columnheader"
          >{{ col.label }}</span>
        </div>
        <div v-for="row in rows" :key="row.label" class="benchmark-row" role="row">
          <span class="benchmark-metric" role="rowheader">{{ row.label }}</span>
          <span
            v-for="cell in row.cells"
            :key="cell.key"
            class="benchmark-cell"
            :class="{ best: cell.best, 'is-model': cell.key === 'model' }"
            role="cell"
          >{{ cell.text }}</span>
        </div>
      </div>
      <p class="benchmark-foot">
        命中率口径：主-平-客取最大概率（与顶部模型战绩一致）· 样本 {{ report.sampleSize }} 场 · 仅统计三方均有数据的场次（故样本少于顶部全场）· Brier 分与对数损失越低越好 · Elo 快照 {{ report.eloSnapshotDate }}（{{ report.eloSource }}）
      </p>
    </template>
  </section>
</template>

<style scoped>
.benchmark-panel {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 16px clamp(14px, 2.4vw, 22px) 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.benchmark-head {
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-wrap: wrap;
}

.benchmark-head h3 { font-size: 16px; }
.benchmark-sub { font-size: 12px; color: var(--text-muted); }

.benchmark-empty {
  margin: 0;
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.6;
}

.benchmark-table {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.benchmark-row {
  display: grid;
  grid-template-columns: 1.1fr 1fr 1fr 1fr;
  align-items: center;
}

.benchmark-row + .benchmark-row { border-top: 1px solid var(--border); }

.benchmark-row-head { background: var(--panel-soft); }

.benchmark-metric {
  padding: 9px 12px;
  font-size: 12.5px;
  color: var(--text-muted);
  font-weight: 600;
}

.benchmark-cell {
  padding: 9px 12px;
  font-size: 14px;
  text-align: center;
  font-variant-numeric: tabular-nums;
  color: var(--text);
  border-left: 1px solid var(--border);
}

.benchmark-cell-head {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text-strong);
}

.benchmark-cell.is-model { background: var(--accent-soft); }
.benchmark-cell-head.is-model { color: var(--accent); }

.benchmark-cell.best {
  color: var(--text-strong);
  font-weight: 800;
}

.benchmark-cell.best::after {
  content: " ★";
  color: var(--gold);
  font-size: 11px;
}

.benchmark-foot {
  margin: 0;
  font-size: 11.5px;
  color: var(--text-faint);
  line-height: 1.6;
}
</style>
