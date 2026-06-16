export type GameStatus = "lobby" | "in_progress" | "game_over";

export type RoundStatus =
  | "question"
  | "answering"
  | "reading"
  | "voting"
  | "reveal"
  | "scoring"
  | "complete";

export interface Player {
  id: string;
  gameId: string;
  name: string;
  score: number;
  seatOrder: number;
  isHost: boolean;
}

export interface Game {
  id: string;
  roomCode: string;
  status: GameStatus;
  targetScore: number;
  currentRoundId: string | null;
}

export interface Question {
  id: string;
  textEt: string;
  category: string;
}

export interface Round {
  id: string;
  gameId: string;
  roundNumber: number;
  questionId: string;
  hotSeatPlayerId: string;
  status: RoundStatus;
}

export interface Answer {
  id: string;
  roundId: string;
  playerId: string;
  answerText: string;
  isHotSeatAnswer: boolean;
  displayOrder: number | null;
}

export interface Vote {
  id: string;
  roundId: string;
  voterPlayerId: string;
  answerId: string;
}
