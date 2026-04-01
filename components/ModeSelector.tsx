"use client";

import React from "react";
import Link from "next/link";
import { useGameStore } from "@/store/gameStore";
import { GameMode } from "@/lib/types";
import Button from "./ui/Button";

const modes: { id: GameMode; title: string; description: string }[] = [
  {
    id: "solo",
    title: "Solo Practice",
    description: "Play against a simple AI on a 6x6 grid",
  },
  {
    id: "local",
    title: "Local 2-Player",
    description: "Take turns on the same device (8x8 grid)",
  },
  {
    id: "daily",
    title: "Daily Puzzle",
    description: "Clear a seeded board in limited moves",
  },
];

export default function ModeSelector() {
  const { setMode, loadSavedGame } = useGameStore();

  const handleResume = () => {
    loadSavedGame();
  };

  const hasSave = typeof window !== "undefined" && localStorage.getItem("chain-reaction-save") !== null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-text-primary">
          Chain Reaction
        </h1>
        <p className="text-text-secondary">
          Place orbs, trigger explosions, dominate the grid
        </p>
      </div>

      <div className="w-full max-w-sm space-y-3">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => setMode(mode.id)}
            className="w-full text-left p-4 bg-surface-secondary border border-border-primary rounded-lg
              hover:border-accent-primary/50 hover:bg-surface-tertiary transition-all cursor-pointer"
          >
            <div className="font-semibold text-text-primary">{mode.title}</div>
            <div className="text-sm text-text-secondary mt-1">
              {mode.description}
            </div>
          </button>
        ))}
      </div>

      {hasSave && (
        <Button variant="secondary" onClick={handleResume}>
          Resume Saved Game
        </Button>
      )}

      <Link
        href="/help"
        className="text-text-secondary hover:text-accent-primary transition-colors text-sm"
      >
        How to Play
      </Link>
    </div>
  );
}
