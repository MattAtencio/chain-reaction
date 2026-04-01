"use client";

import React from "react";
import { useGameStore } from "@/store/gameStore";
import CellComponent from "./Cell";
import { canPlace } from "@/lib/engine";

export default function Grid() {
  const {
    grid,
    rows,
    cols,
    currentPlayer,
    gameOver,
    isAnimating,
    explodingCells,
    makeMove,
  } = useGameStore();

  return (
    <div
      className="grid gap-1 w-full max-w-md mx-auto p-2"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
      }}
    >
      {grid.map((row, r) =>
        row.map((cell, c) => (
          <CellComponent
            key={`${r}-${c}`}
            cell={cell}
            row={r}
            col={c}
            rows={rows}
            cols={cols}
            isExploding={explodingCells.has(`${r}-${c}`)}
            canPlace={
              !gameOver &&
              !isAnimating &&
              canPlace(grid, r, c, currentPlayer)
            }
            onClick={() => makeMove(r, c)}
          />
        ))
      )}
    </div>
  );
}
