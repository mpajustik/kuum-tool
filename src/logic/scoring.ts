import type { Answer, Player, Vote } from "../types/game";

export function calculateScores(
  players: Player[],
  answers: Answer[],
  votes: Vote[],
  hotSeatPlayerId: string
): Map<string, number> {
  const scoreChanges = new Map<string, number>();

  for (const player of players) {
    scoreChanges.set(player.id, 0);
  }

  const hotSeatAnswer = answers.find((answer) => answer.playerId === hotSeatPlayerId);
  if (!hotSeatAnswer) {
    return scoreChanges;
  }

  for (const vote of votes) {
    const selectedAnswer = answers.find((answer) => answer.id === vote.answerId);
    if (!selectedAnswer) continue;

    const voterId = vote.voterPlayerId;
    const answerAuthorId = selectedAnswer.playerId;

    if (selectedAnswer.id === hotSeatAnswer.id) {
      scoreChanges.set(voterId, (scoreChanges.get(voterId) ?? 0) + 2);
      scoreChanges.set(hotSeatPlayerId, (scoreChanges.get(hotSeatPlayerId) ?? 0) + 1);
    } else {
      scoreChanges.set(answerAuthorId, (scoreChanges.get(answerAuthorId) ?? 0) + 1);
    }
  }

  return scoreChanges;
}

export function findWinners(players: Player[], targetScore: number): Player[] {
  return players.filter((player) => player.score >= targetScore);
}
