import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createGame } from "../services/gameService";
import { saveLocalPlayer } from "../hooks/useLocalPlayer";

export function CreateGamePage() {
  const [hostName, setHostName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    if (!hostName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const { game, host } = await createGame(hostName.trim());
      saveLocalPlayer(game.id, host.id);
      navigate("/lobby");
    } catch {
      setError("Mängu loomine ebaõnnestus. Proovi uuesti.");
      setIsSubmitting(false);
    }
  }

  return (
    <form className="page" onSubmit={handleCreate}>
      <h1>Loo mäng</h1>
      <label className="muted" htmlFor="hostName">
        Sinu nimi
      </label>
      <input
        id="hostName"
        className="input"
        value={hostName}
        onChange={(event) => setHostName(event.target.value)}
        placeholder="Sinu nimi"
        disabled={isSubmitting}
      />
      {error && <p style={{ color: "var(--accent-dark)" }}>{error}</p>}
      <button type="submit" className="btn" disabled={isSubmitting}>
        Loo mäng
      </button>
    </form>
  );
}
