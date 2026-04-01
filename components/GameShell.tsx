"use client";

import React, { useEffect } from "react";
import { useGameStore } from "@/store/gameStore";
import ModeSelector from "./ModeSelector";
import GameHeader from "./GameHeader";
import Grid from "./Grid";

export default function GameShell() {
  const { showModeSelector, loadSavedGame } = useGameStore();

  useEffect(() => {
    // Try to restore saved game on mount
    const restored = loadSavedGame();
    if (!restored) {
      // No save to restore — stay on mode selector
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (showModeSelector) {
    return <ModeSelector />;
  }

  return (
    <div className="flex flex-col items-center p-4 pb-8 safe-area-padding">
      <GameHeader />
      <Grid />
    </div>
  );
}
