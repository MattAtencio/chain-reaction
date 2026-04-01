import { GameMode, GameState, GridState, PlayerId } from "./types";

const STORAGE_KEY = "chain-reaction-save";

interface SaveData {
  grid: GridState;
  currentPlayer: PlayerId;
  mode: GameMode;
  rows: number;
  cols: number;
  moveCount: number;
  gameOver: boolean;
  winner: PlayerId | null;
  targetMoves: number | null;
  dailySolved: boolean;
  dailyDate?: string;
}

export function saveGame(state: GameState, dailyDate?: string): void {
  try {
    const data: SaveData = {
      grid: state.grid,
      currentPlayer: state.currentPlayer,
      mode: state.mode,
      rows: state.rows,
      cols: state.cols,
      moveCount: state.moveCount,
      gameOver: state.gameOver,
      winner: state.winner,
      targetMoves: state.targetMoves,
      dailySolved: state.dailySolved,
      dailyDate,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Silently fail if storage is unavailable
  }
}

export function loadGame(): (SaveData & { dailyDate?: string }) | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SaveData & { dailyDate?: string };
  } catch {
    return null;
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silently fail
  }
}
