import { supabase } from "./supabaseClient";
import type { VoteRow } from "../types/database";

export async function submitVote(roundId: string, voterPlayerId: string, answerId: string) {
  const { data, error } = await supabase
    .from("votes")
    .insert({ round_id: roundId, voter_player_id: voterPlayerId, answer_id: answerId })
    .select()
    .single<VoteRow>();

  if (error) throw error;
  return data;
}

export async function getVotes(roundId: string) {
  const { data, error } = await supabase
    .from("votes")
    .select()
    .eq("round_id", roundId)
    .returns<VoteRow[]>();

  if (error) throw error;
  return data;
}
