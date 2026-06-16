import type { Player } from "../types/game";

interface PlayerListProps {
  players: Player[];
  hotSeatPlayerId?: string | null;
  scoreChanges?: Map<string, number>;
}

export function PlayerList({ players, hotSeatPlayerId, scoreChanges }: PlayerListProps) {
  return (
    <ul className="player-list">
      {players.map((player) => {
        const change = scoreChanges?.get(player.id) ?? 0;
        return (
          <li key={player.id}>
            <span>
              {player.name}
              {player.isHost ? " (host)" : ""}
              {player.id === hotSeatPlayerId ? " 🔥" : ""}
            </span>
            <span>
              {player.score}
              {change !== 0 && (
                <span className={change > 0 ? "score-delta-positive" : "score-delta-negative"}>
                  {" "}
                  {change > 0 ? `+${change}` : change}
                </span>
              )}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
