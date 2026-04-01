import { Cell, DailyPuzzle, GridState, PlayerId } from "./types";
import { CONFIG } from "./config";
import { getCriticalMass } from "./engine";

/** Mulberry32 PRNG seeded from a number */
function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Convert date string to numeric seed */
function dateToSeed(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

export function generateDailyPuzzle(dateStr?: string): DailyPuzzle {
  const date = dateStr || new Date().toISOString().split("T")[0];
  const seed = dateToSeed(date);
  const rng = mulberry32(seed);

  const { rows, cols } = CONFIG.daily;
  const grid: GridState = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, (): Cell => ({ owner: null, count: 0 }))
  );

  // Place 8-14 orbs randomly across the grid
  const orbCount = Math.floor(rng() * 7) + 8;
  let placed = 0;

  while (placed < orbCount) {
    const r = Math.floor(rng() * rows);
    const c = Math.floor(rng() * cols);
    const mass = getCriticalMass(r, c, rows, cols);

    // Don't overfill — keep below critical mass
    if (grid[r][c].count < mass - 1) {
      const player: PlayerId = rng() > 0.5 ? 1 : 2;
      grid[r][c].count += 1;
      grid[r][c].owner = player;
      placed++;
    }
  }

  // Target moves: 3-6 based on orb count
  const targetMoves = Math.floor(rng() * 4) + 3;

  return { grid, rows, cols, targetMoves, date };
}
