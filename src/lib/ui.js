import { reactive } from "vue";

// 跨组件 UI 状态：弹窗与移动端底部浮层
export const ui = reactive({
  lineup: { open: false, team: null },
  compare: { open: false, teamA: null, teamB: null, match: null, token: 0 },
  sheetOpen: false
});

export function openLineup(team) {
  ui.lineup.team = team;
  ui.lineup.open = true;
}

export function closeLineup() {
  ui.lineup.open = false;
}

export function openCompare(teamA, teamB, match) {
  ui.compare.token += 1;
  ui.compare.teamA = teamA;
  ui.compare.teamB = teamB;
  ui.compare.match = match;
  ui.compare.open = true;
}

export function closeCompare() {
  ui.compare.open = false;
}
