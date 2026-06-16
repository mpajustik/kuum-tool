import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GameCodeBox } from "../components/GameCodeBox";
import { QRJoinCode } from "../components/QRJoinCode";
import { PlayerList } from "../components/PlayerList";
import { LoadingView } from "../components/LoadingView";
import { getGameState, startGame, setCurrentRound } from "../services/gameService";
import { getPlayers } from "../services/playerService";
import { createRound } from "../services/roundService";
import { getNextHotSeatPlayer } from "../logic/getNextHotSeatPlayer";
import { questions } from "../data/questions";
import { useGameRealtime } from "../hooks/useGameRealtime";
import { getLocalPlayer } from "../hooks/useLocalPlayer";
import type { GameRow, PlayerRow } from "../types/database";

export function LobbyPage() {
  const navigate = useNavigate();
  const [local] = useState(() => getLocalPlayer());
  const [game, setGame] = useState<GameRow | null>(null);
  const [players, setPlayers] = useState<PlayerRow[]>([]);
  const [isStarting, setIsStarting] = useState(false);

  const refresh = useCallback(async () => {
    if (!local) return;
    const [gameData, playersData] = await Promise.all([
      getGameState(local.gameId),
      getPlayers(local.gameId),
    ]);
    setGame(gameData);
    setPlayers(playersData);
  }, [local]);

  useEffect(() => {
    if (!local) {
      navigate("/");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch from Supabase on mount
    refresh();
  }, [local, navigate, refresh]);

  useGameRealtime(local?.gameId ?? null, refresh);

  useEffect(() => {
    if (game?.status === "in_progress") {
      navigate("/mang");
    }
  }, [game, navigate]);

  if (!local || !game) {
    return <LoadingView />;
  }

  const isHost = players.find((player) => player.id === local.playerId)?.is_host ?? false;
  const joinUrl = `${window.location.origin}/liitu?kood=${game.room_code}`;

  async function handleStart() {
    if (isStarting || players.length < 2) return;
    setIsStarting(true);

    const hotSeatPlayer = getNextHotSeatPlayer(
      players.map((player) => ({
        id: player.id,
        gameId: player.game_id,
        name: player.name,
        score: player.score,
        seatOrder: player.seat_order,
        isHost: player.is_host,
      })),
      null
    );
    const question = questions[Math.floor(Math.random() * questions.length)];

    const round = await createRound(game!.id, hotSeatPlayer.id, question.textEt, 1);
    await setCurrentRound(game!.id, round.id);
    await startGame(game!.id);
    navigate("/mang");
  }

  return (
    <div className="page">
      <h1>Mängutuba</h1>
      <GameCodeBox roomCode={game.room_code} joinUrl={joinUrl} />
      <QRJoinCode joinUrl={joinUrl} />
      <h2>Mängijad</h2>
      <PlayerList
        players={players.map((player) => ({
          id: player.id,
          gameId: player.game_id,
          name: player.name,
          score: player.score,
          seatOrder: player.seat_order,
          isHost: player.is_host,
        }))}
      />
      {isHost ? (
        <button type="button" className="btn" onClick={handleStart} disabled={isStarting || players.length < 2}>
          Alusta mängu
        </button>
      ) : (
        <p className="status-banner">Ootame, kuni host alustab mängu</p>
      )}
    </div>
  );
}
