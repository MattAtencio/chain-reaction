import { Cell, GridState, PlayerId } from "./types";

export function createGrid(rows: number, cols: number): GridState {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, (): Cell => ({ owner: null, count: 0 }))
  );
}

export function cloneGrid(grid: GridState): GridState {
  return grid.map((row) => row.map((cell) => ({ ...cell })));
}

export function getCriticalMass(
  row: number,
  col: number,
  rows: number,
  cols: number
): number {
  const isTop = row === 0;
  const isBottom = row === rows - 1;
  const isLeft = col === 0;
  const isRight = col === cols - 1;

  const edgeCount =
    (isTop ? 1 : 0) + (isBottom ? 1 : 0) + (isLeft ? 1 : 0) + (isRight ? 1 : 0);

  if (edgeCount >= 2) return 2; // corner
  if (edgeCount === 1) return 3; // edge
  return 4; // center
}

export function canPlace(
  grid: GridState,
  row: number,
  col: number,
  player: PlayerId
): boolean {
  const cell = grid[row][col];
  return cell.owner === null || cell.owner === player;
}

export function placeOrb(
  grid: GridState,
  row: number,
  col: number,
  player: PlayerId
): GridState {
  const newGrid = cloneGrid(grid);
  newGrid[row][col].owner = player;
  newGrid[row][col].count += 1;
  return newGrid;
}

interface ExplosionStep {
  grid: GridState;
  exploded: [number, number][];
}

export function resolveExplosions(
  grid: GridState,
  player: PlayerId
): { grid: GridState; steps: ExplosionStep[] } {
  let current = cloneGrid(grid);
  const rows = current.length;
  const cols = current[0].length;
  const steps: ExplosionStep[] = [];
  let maxIterations = 1000; // safety limit

  while (maxIterations-- > 0) {
    const toExplode: [number, number][] = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (current[r][c].count >= getCriticalMass(r, c, rows, cols)) {
          toExplode.push([r, c]);
        }
      }
    }

    if (toExplode.length === 0) break;

    steps.push({ grid: cloneGrid(current), exploded: toExplode });

    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    for (const [r, c] of toExplode) {
      current[r][c].count -= getCriticalMass(r, c, rows, cols);
      if (current[r][c].count <= 0) {
        current[r][c].count = 0;
        current[r][c].owner = null;
      }

      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          current[nr][nc].count += 1;
          current[nr][nc].owner = player;
        }
      }
    }
  }

  return { grid: current, steps };
}

export function countPlayerOrbs(
  grid: GridState,
  player: PlayerId
): number {
  let count = 0;
  for (const row of grid) {
    for (const cell of row) {
      if (cell.owner === player) count += cell.count;
    }
  }
  return count;
}

export function countTotalOrbs(grid: GridState): number {
  let count = 0;
  for (const row of grid) {
    for (const cell of row) {
      count += cell.count;
    }
  }
  return count;
}

export function checkWin(
  grid: GridState,
  moveCount: number
): PlayerId | null {
  // Need at least 2 moves per player (4 total) before win is possible
  if (moveCount < 4) return null;

  const totalOrbs = countTotalOrbs(grid);
  if (totalOrbs === 0) return null;

  const p1 = countPlayerOrbs(grid, 1);
  const p2 = countPlayerOrbs(grid, 2);

  if (p1 > 0 && p2 === 0) return 1;
  if (p2 > 0 && p1 === 0) return 2;

  return null;
}

export function checkDailyWin(grid: GridState): boolean {
  return countTotalOrbs(grid) === 0;
}

/** Simple AI: picks a random valid cell, preferring cells near critical mass */
export function getAIMove(
  grid: GridState,
  player: PlayerId
): [number, number] | null {
  const rows = grid.length;
  const cols = grid[0].length;
  const validMoves: [number, number][] = [];
  const dangerMoves: [number, number][] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (canPlace(grid, r, c, player)) {
        const mass = getCriticalMass(r, c, rows, cols);
        if (grid[r][c].count === mass - 1 && grid[r][c].owner === player) {
          dangerMoves.push([r, c]);
        }
        validMoves.push([r, c]);
      }
    }
  }

  // Prefer moves that will cause an explosion
  if (dangerMoves.length > 0) {
    return dangerMoves[Math.floor(Math.random() * dangerMoves.length)];
  }

  if (validMoves.length === 0) return null;
  return validMoves[Math.floor(Math.random() * validMoves.length)];
}
