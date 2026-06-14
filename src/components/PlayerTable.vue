<script setup>
import { shortTier, formatScore, getPlayerClubProfile } from "../lib/engine.js";

defineProps({ players: { type: Array, default: () => [] } });

function statusClass(item) {
  if (item.availability === "观察") return "status-watch";
  if (item.availability === "缺席") return "status-out";
  return "";
}

function clubProfile(item) {
  return getPlayerClubProfile(item);
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
            <div class="player-club-cell" :class="{ highlighted: clubProfile(item).highlighted }">
              <span class="dual-name">
                <strong>{{ [clubProfile(item).club, clubProfile(item).league].filter(Boolean).join(" · ") }}</strong>
                <small>{{ clubProfile(item).clubEn }}</small>
              </span>
              <span class="club-tags">
                <span class="club-chip" :class="{ highlight: clubProfile(item).elite }">{{ clubProfile(item).level }}</span>
                <span class="club-chip" :class="{ highlight: clubProfile(item).starter }">{{ clubProfile(item).role }}</span>
              </span>
            </div>
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
        <div class="player-card-club" :class="{ highlighted: clubProfile(item).highlighted }">
          <span>{{ [clubProfile(item).club, clubProfile(item).league].filter(Boolean).join(" · ") }}</span>
          <small v-if="clubProfile(item).clubEn">{{ clubProfile(item).clubEn }}</small>
          <span class="club-tags">
            <span class="club-chip" :class="{ highlight: clubProfile(item).elite }">{{ clubProfile(item).level }}</span>
            <span class="club-chip" :class="{ highlight: clubProfile(item).starter }">{{ clubProfile(item).role }}</span>
          </span>
        </div>
      </article>
    </div>
  </div>
</template>
