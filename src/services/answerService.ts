import { supabase } from "./supabaseClient";
import type { AnswerRow } from "../types/database";

export async function submitAnswer(
  roundId: string,
  playerId: string,
  answerText: string,
  isHotSeatAnswer: boolean
) {
  const { data, error } = await supabase
    .from("answers")
    .insert({
      round_id: roundId,
      player_id: playerId,
      answer_text: answerText,
      is_hot_seat_answer: isHotSeatAnswer,
    })
    .select()
    .single<AnswerRow>();

  if (error) throw error;
  return data;
}

export async function getAnswers(roundId: string) {
  const { data, error } = await supabase
    .from("answers")
    .select()
    .eq("round_id", roundId)
    .returns<AnswerRow[]>();

  if (error) throw error;
  return data;
}

export async function setDisplayOrder(answerId: string, displayOrder: number) {
  const { error } = await supabase
    .from("answers")
    .update({ display_order: displayOrder })
    .eq("id", answerId);

  if (error) throw error;
}
