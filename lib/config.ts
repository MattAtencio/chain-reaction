export const CONFIG = {
  solo: { rows: 6, cols: 6 },
  local: { rows: 8, cols: 8 },
  daily: { rows: 6, cols: 6 },
  playerColors: {
    1: "#3b82f6",
    2: "#ef4444",
  } as Record<number, string>,
  animationDelay: 200,
} as const;
