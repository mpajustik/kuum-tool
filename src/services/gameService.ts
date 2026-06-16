import { supabase } from "./supabaseClient";
import { createRoomCode } from "../logic/createRoomCode";
import type { GameRow, PlayerRow } from "../types/database";
import type { GameStatus } from "../types/game";

export async function createGame(hostName: string, targetScore = 21) {
  const roomCode = createRoomCode();

  const { data: game, error: gameError } = await supabase
    .from("games")
    .insert({ room_code: roomCode, target_score: targetScore })
    .select()
    .single<GameRow>();

  if (gameError) throw gameError;

  const { data: host, error: hostError } = await supabase
    .from("players")
    .insert({ game_id: game.id, name: hostName, seat_order: 0, is_host: true })
    .select()
    .single<PlayerRow>();

  if (hostError) throw hostError;

  return { game, host };
}

export async function getGameByRoomCode(roomCode: string) {
  const { data, error } = await supabase
    .from("games")
    .select()
    .eq("room_code", roomCode.toUpperCase())
    .maybeSingle<GameRow>();

  if (error) throw error;
  return data;
}

export async function getGameState(gameId: string) {
  const { data, error } = await supabase
    .from("games")
    .select()
    .eq("id", gameId)
    .single<GameRow>();

  if (error) throw error;
  return data;
}

export async function updateGameStatus(gameId: string, status: GameStatus) {
  const { error } = await supabase.from("games").update({ status }).eq("id", gameId);
  if (error) throw error;
}

export async function setCurrentRound(gameId: string, roundId: string | null) {
  const { error } = await supabase
    .from("games")
    .update({ current_round_id: roundId })
    .eq("id", gameId);

  if (error) throw error;
}

export async function startGame(gameId: string) {
  await updateGameStatus(gameId, "in_progress");
}

export async function endGame(gameId: string) {
  await updateGameStatus(gameId, "game_over");
}
