import type { GameStatus, RoundStatus } from "./game";

export interface GameRow {
  id: string;
  room_code: string;
  status: GameStatus;
  target_score: number;
  current_round_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlayerRow {
  id: string;
  game_id: string;
  name: string;
  score: number;
  seat_order: number;
  is_host: boolean;
  joined_at: string;
  last_seen_at: string | null;
}

export interface RoundRow {
  id: string;
  game_id: string;
  round_number: number;
  question_id: string | null;
  custom_question_text: string | null;
  hot_seat_player_id: string;
  status: RoundStatus;
  created_at: string;
  completed_at: string | null;
}

export interface AnswerRow {
  id: string;
  round_id: string;
  player_id: string;
  answer_text: string;
  is_hot_seat_answer: boolean;
  display_order: number | null;
  created_at: string;
}

export interface VoteRow {
  id: string;
  round_id: string;
  voter_player_id: string;
  answer_id: string;
  created_at: string;
}
