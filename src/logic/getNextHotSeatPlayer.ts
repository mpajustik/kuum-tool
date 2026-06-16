import type { Player } from "../types/game";

export function getNextHotSeatPlayer(players: Player[], currentHotSeatPlayerId: string | null): Player {
  const ordered = [...players].sort((a, b) => a.seatOrder - b.seatOrder);

  if (!currentHotSeatPlayerId) {
    return ordered[0];
  }

  const currentIndex = ordered.findIndex((player) => player.id === currentHotSeatPlayerId);
  const nextIndex = (currentIndex + 1) % ordered.length;

  return ordered[nextIndex];
}
