"use client";

import React from "react";
import { useGameStore } from "@/store/gameStore";
import { CONFIG } from "@/lib/config";
import Button from "./ui/Button";

export default function GameHeader() {
  const {
    currentPlayer,
    mode,
    moveCount,
    gameOver,
    winner,
    dailySolved,
    targetMoves,
    isAnimating,
    resetGame,
    backToMenu,
  } = useGameStore();

  const modeLabel =
    mode === "solo"
      ? "Solo Practice"
      : mode === "local"
      ? "Local 2-Player"
      : "Daily Puzzle";

  const playerColor = CONFIG.playerColors[currentPlayer];

  return (
    <div className="w-full max-w-md mx-auto space-y-3 mb-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-text-primary">Chain Reaction</h1>
        <span className="text-sm text-text-secondary">{modeLabel}</span>
      </div>

      {gameOver ? (
        <div className="text-center p-4 bg-surface-secondary rounded-lg border border-border-primary">
          {mode === "daily" ? (
            dailySolved ? (
              <p className="text-lg font-bold text-green-400">
                Puzzle Solved in {moveCount} moves!
              </p>
            ) : (
              <p className="text-lg font-bold text-red-400">
                Out of moves! Try again.
              </p>
            )
          ) : (
            <p className="text-lg font-bold" style={{ color: CONFIG.playerColors[winner!] }}>
              Player {winner} Wins!
            </p>
          )}
          <div className="flex gap-2 justify-center mt-3">
            <Button size="sm" onClick={resetGame}>
              Play Again
            </Button>
            <Button size="sm" variant="secondary" onClick={backToMenu}>
              Menu
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between bg-surface-secondary rounded-lg p-3 border border-border-primary">
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: playerColor }}
            />
            <span className="text-text-primary font-medium">
              {mode === "solo"
                ? currentPlayer === 1
                  ? "Your Turn"
                  : "AI Thinking..."
                : mode === "daily"
                ? "Your Move"
                : `Player ${currentPlayer}`}
            </span>
            {isAnimating && (
              <span className="text-accent-primary text-sm animate-pulse">
                Reacting...
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-text-secondary text-sm">
              Moves: {moveCount}
              {targetMoves ? ` / ${targetMoves}` : ""}
            </span>
          </div>
        </div>
      )}

      {!gameOver && (
        <div className="flex gap-2 justify-end">
          <Button size="sm" variant="ghost" onClick={resetGame}>
            Restart
          </Button>
          <Button size="sm" variant="ghost" onClick={backToMenu}>
            Menu
          </Button>
        </div>
      )}
    </div>
  );
}
