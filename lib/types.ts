export interface User {
  id: string;
  username: string;
  email: string;
  streak?: number;
  age?: number | null;
  createdAt: string;
}

export interface Level {
  id: number;
  title: string;
  difficulty: "easy" | "medium" | "hard" | string;
  data: Record<string, unknown>;
  createdAt: string;
}

export interface GameSession {
  id: string;
  userId: string;
  levelId: number;
  currentState: Record<string, unknown>;
  isCompleted: boolean;
  timeElapsed: number;
  moves: number;
  createdAt: string;
  updatedAt: string;
  level?: Level;
}

export interface Score {
  id: string;
  userId: string;
  levelId: number;
  points: number;
  timeSeconds: number;
  completedAt: string;
  user?: { username: string };
  level?: Level;
}

export interface ApiError {
  error: string;
}
