import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getGameByRoomCode } from "../services/gameService";
import { joinGame } from "../services/playerService";
import { saveLocalPlayer } from "../hooks/useLocalPlayer";

export function JoinGamePage() {
  const [searchParams] = useSearchParams();
  const [roomCode, setRoomCode] = useState(searchParams.get("kood") ?? "");
  const [playerName, setPlayerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleJoin(event: React.FormEvent) {
    event.preventDefault();
    if (!roomCode.trim() || !playerName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const game = await getGameByRoomCode(roomCode.trim());
      if (!game) {
        setError("Mängukoodiga mängutuba ei leitud.");
        setIsSubmitting(false);
        return;
      }

      const player = await joinGame(game.id, playerName.trim());
      saveLocalPlayer(game.id, player.id);
      navigate("/lobby");
    } catch (err) {
      console.error("joinGame failed:", err);
      setError("Liitumine ebaõnnestus. Proovi uuesti.");
      setIsSubmitting(false);
    }
  }

  return (
    <form className="page" onSubmit={handleJoin}>
      <h1>Liitu mänguga</h1>
      <label className="muted" htmlFor="roomCode">
        Mängukood
      </label>
      <input
        id="roomCode"
        className="input"
        value={roomCode}
        onChange={(event) => setRoomCode(event.target.value.toUpperCase())}
        placeholder="KUM482"
        disabled={isSubmitting}
      />
      <label className="muted" htmlFor="playerName">
        Sinu nimi
      </label>
      <input
        id="playerName"
        className="input"
        value={playerName}
        onChange={(event) => setPlayerName(event.target.value)}
        placeholder="Sinu nimi"
        disabled={isSubmitting}
      />
      {error && <p style={{ color: "var(--accent-dark)" }}>{error}</p>}
      <button type="submit" className="btn" disabled={isSubmitting}>
        Liitu
      </button>
    </form>
  );
}
