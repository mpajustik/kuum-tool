import type { Player } from "../types/game";

interface ScoreBoardProps {
  players: Player[];
}

export function ScoreBoard({ players }: ScoreBoardProps) {
  const ranked = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="card">
      <h2>Punktid</h2>
      <ul className="player-list">
        {ranked.map((player, index) => (
          <li key={player.id}>
            <span>
              {index + 1}. {player.name}
            </span>
            <span>{player.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
