import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScoreBoard } from "../components/ScoreBoard";
import { LoadingView } from "../components/LoadingView";
import { getLocalPlayer, clearLocalPlayer } from "../hooks/useLocalPlayer";
import { getPlayers } from "../services/playerService";
import type { PlayerRow } from "../types/database";

export function GameOverPage() {
  const navigate = useNavigate();
  const [local] = useState(() => getLocalPlayer());
  const [players, setPlayers] = useState<PlayerRow[] | null>(null);

  useEffect(() => {
    if (!local) {
      navigate("/");
      return;
    }
    getPlayers(local.gameId).then(setPlayers);
  }, [local, navigate]);

  if (!players) {
    return <LoadingView />;
  }

  const mapped = players.map((player) => ({
    id: player.id,
    gameId: player.game_id,
    name: player.name,
    score: player.score,
    seatOrder: player.seat_order,
    isHost: player.is_host,
  }));
  const winner = [...mapped].sort((a, b) => b.score - a.score)[0];

  function handleNewGame() {
    clearLocalPlayer();
    navigate("/");
  }

  return (
    <div className="page">
      <h1>Mäng läbi!</h1>
      <p className="muted">Võitja</p>
      <h2>{winner.name}</h2>
      <ScoreBoard players={mapped} />
      <button type="button" className="btn" onClick={handleNewGame}>
        Uus mäng
      </button>
    </div>
  );
}
