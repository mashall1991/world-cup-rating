<script setup>
import { ref, watch } from "vue";
import { LINEUP_API, ensureTeamLineup, readLineupCache, formatGeneratedAt } from "../lib/engine.js";
import { ui, closeLineup } from "../lib/ui.js";

const lineup = ref([]);
const sourceLabel = ref("");
let requestToken = 0;

watch(
  () => ui.lineup.open,
  async (open) => {
    if (!open || !ui.lineup.team) return;
    const team = ui.lineup.team;
    const token = ++requestToken;
    lineup.value = team.startingXI ?? [];
    const cached = readLineupCache(team.id);
    if (cached?.lineup?.length) {
      lineup.value = cached.lineup;
      sourceLabel.value = `缓存名单 · ${formatGeneratedAt(cached.savedAt)}`;
      void ensureTeamLineup(team);
      return;
    }

    sourceLabel.value = LINEUP_API.available ? "本地预测 · 正在尝试获取实时名单…" : "本地预测";
    if (!LINEUP_API.available) return;

    const result = await ensureTeamLineup(team).catch(() => null);
    if (token !== requestToken || !ui.lineup.open) return;

    if (result?.lineup?.length) {
      lineup.value = result.lineup;
      sourceLabel.value = result.source === "cache"
        ? `缓存名单 · ${formatGeneratedAt(result.savedAt)}`
        : "实时名单 · API-Football";
      return;
    }
    sourceLabel.value = "本地预测（实时名单暂不可用）";
  }
);
</script>

<template>
  <Teleport to="body">
    <div v-if="ui.lineup.open && ui.lineup.team" class="modal-overlay" @click.self="closeLineup()">
      <div class="modal lineup-dialog" role="dialog" aria-modal="true" :aria-label="`${ui.lineup.team.name} 首发阵容`">
        <div class="dialog-head">
          <div>
            <p class="eyebrow">{{ ui.lineup.team.squadVersion.status }} · {{ ui.lineup.team.squadVersion.date }} · {{ sourceLabel }}</p>
            <h2>{{ ui.lineup.team.flag }} {{ ui.lineup.team.name }} · 首发阵容</h2>
          </div>
          <button class="icon-button" type="button" aria-label="关闭预测首发" @click="closeLineup()">×</button>
        </div>
        <div class="lineup-grid">
          <div
            v-for="(item, index) in lineup"
            :key="index"
            class="lineup-card"
            :class="{ placeholder: item.placeholder }"
          >
            <span>{{ item.position }}</span>
            <strong>{{ item.name }}</strong>
            <small>{{ [item.nameEn, item.clubEn || item.note || "待补充公开名单数据"].filter(Boolean).join(" · ") }}</small>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
