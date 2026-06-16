import type { Player } from "../types/game";

interface PlayerStatusListProps {
  title: string;
  players: Player[];
  doneIds: Set<string>;
  excludeId?: string | null;
}

export function PlayerStatusList({ title, players, doneIds, excludeId }: PlayerStatusListProps) {
  const visible = excludeId ? players.filter((player) => player.id !== excludeId) : players;

  return (
    <div className="card">
      <p className="muted">{title}</p>
      <ul className="player-list">
        {visible.map((player) => (
          <li key={player.id}>
            <span>{player.name}</span>
            <span>{doneIds.has(player.id) ? "✅" : "…"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
