import { useEffect } from "react";
import { supabase } from "../services/supabaseClient";

export function useGameRealtime(gameId: string | null, onChange: () => void, roundId: string | null = null) {
  useEffect(() => {
    if (!gameId) return;

    const channel = supabase
      .channel(`game-${gameId}-${roundId ?? "lobby"}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "players", filter: `game_id=eq.${gameId}` }, onChange)
      .on("postgres_changes", { event: "*", schema: "public", table: "games", filter: `id=eq.${gameId}` }, onChange)
      .on("postgres_changes", { event: "*", schema: "public", table: "rounds", filter: `game_id=eq.${gameId}` }, onChange);

    if (roundId) {
      channel
        .on("postgres_changes", { event: "*", schema: "public", table: "answers", filter: `round_id=eq.${roundId}` }, onChange)
        .on("postgres_changes", { event: "*", schema: "public", table: "votes", filter: `round_id=eq.${roundId}` }, onChange);
    }

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId, onChange, roundId]);
}
