import { create } from "zustand";
import {
  GameMode,
  GameState,
  PlayerId,
} from "@/lib/types";
import { CONFIG } from "@/lib/config";
import {
  canPlace,
  checkDailyWin,
  checkWin,
  createGrid,
  getAIMove,
  placeOrb,
  resolveExplosions,
} from "@/lib/engine";
import { generateDailyPuzzle } from "@/lib/daily";
import { clearSave, loadGame, saveGame } from "@/lib/storage";

interface GameStore extends GameState {
  dailyDate: string | null;
  showModeSelector: boolean;
  setMode: (mode: GameMode) => void;
  makeMove: (row: number, col: number) => void;
  resetGame: () => void;
  loadSavedGame: () => boolean;
  backToMenu: () => void;
}

function initialState(mode: GameMode): Omit<GameState, "isAnimating" | "explodingCells"> & { dailyDate: string | null } {
  if (mode === "daily") {
    const puzzle = generateDailyPuzzle();
    return {
      grid: puzzle.grid,
      currentPlayer: 1,
      mode,
      rows: puzzle.rows,
      cols: puzzle.cols,
      moveCount: 0,
      gameOver: false,
      winner: null,
      targetMoves: puzzle.targetMoves,
      dailySolved: false,
      dailyDate: puzzle.date,
    };
  }

  const cfg = mode === "solo" ? CONFIG.solo : CONFIG.local;
  return {
    grid: createGrid(cfg.rows, cfg.cols),
    currentPlayer: 1,
    mode,
    rows: cfg.rows,
    cols: cfg.cols,
    moveCount: 0,
    gameOver: false,
    winner: null,
    targetMoves: null,
    dailySolved: false,
    dailyDate: null,
  };
}

export const useGameStore = create<GameStore>((set, get) => ({
  grid: createGrid(6, 6),
  currentPlayer: 1,
  mode: "solo",
  rows: 6,
  cols: 6,
  moveCount: 0,
  gameOver: false,
  winner: null,
  isAnimating: false,
  explodingCells: new Set<string>(),
  targetMoves: null,
  dailySolved: false,
  dailyDate: null,
  showModeSelector: true,

  setMode: (mode: GameMode) => {
    const state = initialState(mode);
    set({
      ...state,
      isAnimating: false,
      explodingCells: new Set<string>(),
      showModeSelector: false,
    });
    saveGame(
      { ...get(), ...state, isAnimating: false, explodingCells: new Set() },
      state.dailyDate || undefined
    );
  },

  makeMove: (row: number, col: number) => {
    const state = get();
    if (state.gameOver || state.isAnimating) return;

    const { grid, currentPlayer, mode, moveCount, rows, cols } = state;

    // In daily mode, only player 1 places
    if (mode === "daily" && currentPlayer !== 1) return;

    if (!canPlace(grid, row, col, currentPlayer)) return;

    // Place orb
    let newGrid = placeOrb(grid, row, col, currentPlayer);
    const newMoveCount = moveCount + 1;

    // Resolve explosions
    const { grid: resolvedGrid, steps } = resolveExplosions(newGrid, currentPlayer);
    newGrid = resolvedGrid;

    // Collect all exploded cell keys for animation
    const allExploded = new Set<string>();
    for (const step of steps) {
      for (const [r, c] of step.exploded) {
        allExploded.add(`${r}-${c}`);
      }
    }

    // Check win conditions
    let gameOver = false;
    let winner: PlayerId | null = null;
    let dailySolved = state.dailySolved;

    if (mode === "daily") {
      if (checkDailyWin(newGrid)) {
        gameOver = true;
        dailySolved = true;
      } else if (state.targetMoves && newMoveCount >= state.targetMoves) {
        gameOver = true;
        dailySolved = false;
      }
    } else {
      winner = checkWin(newGrid, newMoveCount);
      if (winner) gameOver = true;
    }

    const nextPlayer: PlayerId = currentPlayer === 1 ? 2 : 1;

    // Apply animation briefly
    set({
      isAnimating: steps.length > 0,
      explodingCells: allExploded,
    });

    // After a brief delay, apply the final state
    const applyFinalState = () => {
      const finalState = {
        grid: newGrid,
        currentPlayer: gameOver ? currentPlayer : nextPlayer,
        moveCount: newMoveCount,
        gameOver,
        winner,
        dailySolved,
        isAnimating: false,
        explodingCells: new Set<string>(),
      };
      set(finalState);
      saveGame(
        { ...get(), ...finalState },
        state.dailyDate || undefined
      );

      // If solo mode and it's AI's turn, trigger AI move
      if (mode === "solo" && !gameOver && nextPlayer === 2) {
        setTimeout(() => {
          const current = get();
          if (current.gameOver || current.currentPlayer !== 2) return;
          const aiMove = getAIMove(current.grid, 2);
          if (aiMove) {
            current.makeMove(aiMove[0], aiMove[1]);
          }
        }, 500);
      }
    };

    if (steps.length > 0) {
      setTimeout(applyFinalState, CONFIG.animationDelay * Math.min(steps.length, 5));
    } else {
      applyFinalState();
    }
  },

  resetGame: () => {
    const state = get();
    const newState = initialState(state.mode);
    clearSave();
    set({
      ...newState,
      isAnimating: false,
      explodingCells: new Set<string>(),
      showModeSelector: false,
    });
  },

  loadSavedGame: () => {
    const saved = loadGame();
    if (!saved) return false;

    // If daily puzzle, check if it's still today
    if (saved.mode === "daily") {
      const today = new Date().toISOString().split("T")[0];
      if (saved.dailyDate !== today) {
        clearSave();
        return false;
      }
    }

    set({
      grid: saved.grid,
      currentPlayer: saved.currentPlayer,
      mode: saved.mode,
      rows: saved.rows,
      cols: saved.cols,
      moveCount: saved.moveCount,
      gameOver: saved.gameOver,
      winner: saved.winner,
      targetMoves: saved.targetMoves,
      dailySolved: saved.dailySolved,
      dailyDate: saved.dailyDate || null,
      isAnimating: false,
      explodingCells: new Set<string>(),
      showModeSelector: false,
    });
    return true;
  },

  backToMenu: () => {
    clearSave();
    set({
      showModeSelector: true,
      grid: createGrid(6, 6),
      currentPlayer: 1,
      mode: "solo",
      rows: 6,
      cols: 6,
      moveCount: 0,
      gameOver: false,
      winner: null,
      isAnimating: false,
      explodingCells: new Set<string>(),
      targetMoves: null,
      dailySolved: false,
      dailyDate: null,
    });
  },
}));
