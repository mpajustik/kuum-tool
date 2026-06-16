import { supabase } from "./supabaseClient";
import type { RoundRow } from "../types/database";
import type { RoundStatus } from "../types/game";

export async function createRound(
  gameId: string,
  hotSeatPlayerId: string,
  questionText: string,
  roundNumber: number
) {
  const { data, error } = await supabase
    .from("rounds")
    .insert({
      game_id: gameId,
      round_number: roundNumber,
      hot_seat_player_id: hotSeatPlayerId,
      custom_question_text: questionText,
    })
    .select()
    .single<RoundRow>();

  if (error) throw error;
  return data;
}

export async function getRound(roundId: string) {
  const { data, error } = await supabase
    .from("rounds")
    .select()
    .eq("id", roundId)
    .single<RoundRow>();

  if (error) throw error;
  return data;
}

export async function updateRoundStatus(roundId: string, status: RoundStatus) {
  const { error } = await supabase.from("rounds").update({ status }).eq("id", roundId);
  if (error) throw error;
}

export async function completeRound(roundId: string) {
  const { error } = await supabase
    .from("rounds")
    .update({ status: "complete", completed_at: new Date().toISOString() })
    .eq("id", roundId);

  if (error) throw error;
}
