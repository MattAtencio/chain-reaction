"use client";

import React from "react";
import { Cell as CellType, PlayerId } from "@/lib/types";
import { CONFIG } from "@/lib/config";
import { getCriticalMass } from "@/lib/engine";

interface CellProps {
  cell: CellType;
  row: number;
  col: number;
  rows: number;
  cols: number;
  isExploding: boolean;
  canPlace: boolean;
  onClick: () => void;
}

function Orbs({ count, color }: { count: number; color: string }) {
  if (count === 0) return null;

  if (count === 1) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div
          className="w-4 h-4 rounded-full shadow-lg orb-pulse"
          style={{ backgroundColor: color }}
        />
      </div>
    );
  }

  if (count === 2) {
    return (
      <div className="flex items-center justify-center gap-1 w-full h-full">
        <div
          className="w-3.5 h-3.5 rounded-full shadow-lg orb-pulse"
          style={{ backgroundColor: color, animationDelay: "0.1s" }}
        />
        <div
          className="w-3.5 h-3.5 rounded-full shadow-lg orb-pulse"
          style={{ backgroundColor: color, animationDelay: "0.3s" }}
        />
      </div>
    );
  }

  // 3 or more orbs
  return (
    <div className="flex flex-wrap items-center justify-center gap-0.5 w-full h-full p-1">
      <div className="flex gap-0.5">
        <div
          className="w-3 h-3 rounded-full shadow-lg orb-pulse"
          style={{ backgroundColor: color, animationDelay: "0s" }}
        />
        <div
          className="w-3 h-3 rounded-full shadow-lg orb-pulse"
          style={{ backgroundColor: color, animationDelay: "0.15s" }}
        />
      </div>
      <div
        className="w-3 h-3 rounded-full shadow-lg orb-pulse"
        style={{ backgroundColor: color, animationDelay: "0.3s" }}
      />
    </div>
  );
}

export default function Cell({
  cell,
  row,
  col,
  rows,
  cols,
  isExploding,
  canPlace: canPlaceHere,
  onClick,
}: CellProps) {
  const mass = getCriticalMass(row, col, rows, cols);
  const nearCritical = cell.count === mass - 1 && cell.count > 0;
  const color = cell.owner ? CONFIG.playerColors[cell.owner] : "transparent";

  return (
    <button
      onClick={onClick}
      disabled={!canPlaceHere}
      className={`
        aspect-square border border-border-primary rounded-md
        flex items-center justify-center
        transition-all duration-150
        ${canPlaceHere ? "cursor-pointer hover:bg-surface-tertiary hover:border-accent-primary/50" : "cursor-default"}
        ${isExploding ? "explode-animation" : ""}
        ${nearCritical ? "near-critical" : ""}
        bg-surface-secondary
      `}
    >
      <Orbs count={cell.count} color={color} />
    </button>
  );
}
