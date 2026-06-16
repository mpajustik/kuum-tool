import { useEffect } from "react";
import { supabase } from "../services/supabaseClient";

export function useGameRealtime(gameId: string | null, onChange: () => void) {
  useEffect(() => {
    if (!gameId) return;

    const channel = supabase
      .channel(`game-${gameId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "players", filter: `game_id=eq.${gameId}` }, onChange)
      .on("postgres_changes", { event: "*", schema: "public", table: "games", filter: `id=eq.${gameId}` }, onChange)
      .on("postgres_changes", { event: "*", schema: "public", table: "rounds", filter: `game_id=eq.${gameId}` }, onChange)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId, onChange]);
}
