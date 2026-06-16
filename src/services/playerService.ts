import { supabase } from "./supabaseClient";
import type { PlayerRow } from "../types/database";

export async function joinGame(gameId: string, playerName: string) {
  const { data: existingPlayers, error: countError } = await supabase
    .from("players")
    .select("seat_order")
    .eq("game_id", gameId)
    .order("seat_order", { ascending: false })
    .limit(1);

  if (countError) throw countError;

  const nextSeatOrder = existingPlayers.length > 0 ? existingPlayers[0].seat_order + 1 : 0;

  const { data, error } = await supabase
    .from("players")
    .insert({ game_id: gameId, name: playerName, seat_order: nextSeatOrder })
    .select()
    .single<PlayerRow>();

  if (error) throw error;
  return data;
}

export async function getPlayers(gameId: string) {
  const { data, error } = await supabase
    .from("players")
    .select()
    .eq("game_id", gameId)
    .order("seat_order", { ascending: true })
    .returns<PlayerRow[]>();

  if (error) throw error;
  return data;
}

export async function updatePlayerScore(playerId: string, newScore: number) {
  const { error } = await supabase.from("players").update({ score: newScore }).eq("id", playerId);
  if (error) throw error;
}
