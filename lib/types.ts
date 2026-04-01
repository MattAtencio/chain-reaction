export type PlayerId = 1 | 2;

export interface Cell {
  owner: PlayerId | null;
  count: number;
}

export type GridState = Cell[][];

export type GameMode = "solo" | "local" | "daily";

export interface GameState {
  grid: GridState;
  currentPlayer: PlayerId;
  mode: GameMode;
  rows: number;
  cols: number;
  moveCount: number;
  gameOver: boolean;
  winner: PlayerId | null;
  isAnimating: boolean;
  explodingCells: Set<string>;
  /** For daily puzzle mode */
  targetMoves: number | null;
  dailySolved: boolean;
}

export interface DailyPuzzle {
  grid: GridState;
  rows: number;
  cols: number;
  targetMoves: number;
  date: string;
}
