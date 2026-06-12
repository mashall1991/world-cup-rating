<script setup>
import { shortTier, formatScore } from "../lib/engine.js";

defineProps({ players: { type: Array, default: () => [] } });

function statusClass(item) {
  if (item.availability === "观察") return "status-watch";
  if (item.availability === "缺席") return "status-out";
  return "";
}
</script>

<template>
  <div class="player-table">
    <table>
      <thead>
        <tr>
          <th>球员</th><th>年龄</th><th>位置</th><th>出场权重</th><th>俱乐部</th><th>可用性</th><th>环境分</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in players" :key="item.nameEn || item.name">
          <td>
            <span class="dual-name"><strong>{{ item.name }}</strong><small>{{ item.nameEn }}</small></span>
          </td>
          <td>{{ item.age }}</td>
          <td>{{ item.position }}</td>
          <td>{{ shortTier(item) }}</td>
          <td>
            <span class="dual-name"><strong>{{ item.club }}</strong><small>{{ item.clubEn }}</small></span>
          </td>
          <td><span class="status-dot" :class="statusClass(item)">{{ item.availability }}</span></td>
          <td class="num">{{ formatScore(item.environmentScore) }}</td>
        </tr>
      </tbody>
    </table>

    <div class="player-cards">
      <article v-for="item in players" :key="item.nameEn || item.name" class="player-card">
        <div class="player-card-head">
          <span class="dual-name"><strong>{{ item.name }}</strong><small>{{ item.nameEn }}</small></span>
          <span class="player-card-score">{{ formatScore(item.environmentScore) }}</span>
        </div>
        <div class="player-card-meta">
          <span>{{ item.age }}岁 · {{ item.position }}</span>
          <span class="player-card-tier">{{ shortTier(item) }}</span>
          <span class="status-dot" :class="statusClass(item)">{{ item.availability }}</span>
        </div>
        <div class="player-card-club">{{ item.club }} · {{ item.clubEn }}</div>
      </article>
    </div>
  </div>
</template>
