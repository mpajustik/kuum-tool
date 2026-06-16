import type { Player } from "../types/game";

interface PlayerListProps {
  players: Player[];
  hotSeatPlayerId?: string | null;
}

export function PlayerList({ players, hotSeatPlayerId }: PlayerListProps) {
  return (
    <ul className="player-list">
      {players.map((player) => (
        <li key={player.id}>
          <span>
            {player.name}
            {player.isHost ? " (host)" : ""}
            {player.id === hotSeatPlayerId ? " 🔥" : ""}
          </span>
          <span>{player.score}</span>
        </li>
      ))}
    </ul>
  );
}
