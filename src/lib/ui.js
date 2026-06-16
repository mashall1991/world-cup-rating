import { reactive } from "vue";
import { appState } from "./engine.js";

// 跨组件 UI 状态：弹窗与移动端底部浮层
export const ui = reactive({
  lineup: { open: false, team: null },
  compare: { open: false, teamA: null, teamB: null, match: null, token: 0, villain: false },
  sheetOpen: false
});

export function openLineup(team) {
  ui.lineup.team = team;
  ui.lineup.open = true;
}

export function closeLineup() {
  ui.lineup.open = false;
}

export function openCompare(teamA, teamB, match, options = {}) {
  ui.compare.token += 1;
  ui.compare.teamA = teamA;
  ui.compare.teamB = teamB;
  ui.compare.match = match;
  ui.compare.villain = Boolean(options.villain);
  ui.compare.open = true;
}

export function openVillainTeamDetail(team) {
  if (!team) return;
  ui.compare.open = false;
  appState.view = "ranking";
  appState.rankingVillainMode = true;
  appState.selectedId = team.id;
  ui.sheetOpen = true;
}

export function closeCompare() {
  ui.compare.open = false;
}
