const GAME_ID_KEY = "gameId";
const PLAYER_ID_KEY = "playerId";

export function saveLocalPlayer(gameId: string, playerId: string) {
  localStorage.setItem(GAME_ID_KEY, gameId);
  localStorage.setItem(PLAYER_ID_KEY, playerId);
}

export function getLocalPlayer(): { gameId: string; playerId: string } | null {
  const gameId = localStorage.getItem(GAME_ID_KEY);
  const playerId = localStorage.getItem(PLAYER_ID_KEY);

  if (!gameId || !playerId) return null;
  return { gameId, playerId };
}

export function clearLocalPlayer() {
  localStorage.removeItem(GAME_ID_KEY);
  localStorage.removeItem(PLAYER_ID_KEY);
}
