import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QuestionCard } from "../components/QuestionCard";
import { AnswerForm } from "../components/AnswerForm";
import { AnswerList } from "../components/AnswerList";
import { VotePanel } from "../components/VotePanel";
import { GameControls } from "../components/GameControls";
import { PlayerList } from "../components/PlayerList";
import { PlayerStatusList } from "../components/PlayerStatusList";
import { LoadingView } from "../components/LoadingView";
import { getLocalPlayer } from "../hooks/useLocalPlayer";
import { useGameRealtime } from "../hooks/useGameRealtime";
import { getGameState, endGame, setCurrentRound } from "../services/gameService";
import { getPlayers, updatePlayerScore } from "../services/playerService";
import { getRound, updateRoundStatus, createRound } from "../services/roundService";
import { submitAnswer, getAnswers, setDisplayOrder } from "../services/answerService";
import { submitVote, getVotes } from "../services/voteService";
import { shuffle } from "../logic/shuffle";
import { getNextHotSeatPlayer } from "../logic/getNextHotSeatPlayer";
import { calculateScores, findWinners } from "../logic/scoring";
import { questions } from "../data/questions";
import type { GameRow, PlayerRow, RoundRow, AnswerRow, VoteRow } from "../types/database";
import type { Player } from "../types/game";

function toPlayer(row: PlayerRow): Player {
  return {
    id: row.id,
    gameId: row.game_id,
    name: row.name,
    score: row.score,
    seatOrder: row.seat_order,
    isHost: row.is_host,
  };
}

const LABELS = ["A", "B", "C", "D", "E", "F", "G", "H"];

export function GamePage() {
  const navigate = useNavigate();
  const [local] = useState(() => getLocalPlayer());
  const [game, setGame] = useState<GameRow | null>(null);
  const [players, setPlayers] = useState<PlayerRow[]>([]);
  const [round, setRound] = useState<RoundRow | null>(null);
  const [answers, setAnswers] = useState<AnswerRow[]>([]);
  const [votes, setVotes] = useState<VoteRow[]>([]);
  const [isWorking, setIsWorking] = useState(false);

  const refresh = useCallback(async () => {
    if (!local) return;
    const gameData = await getGameState(local.gameId);
    setGame(gameData);

    const playersData = await getPlayers(local.gameId);
    setPlayers(playersData);

    if (gameData.current_round_id) {
      const roundData = await getRound(gameData.current_round_id);
      setRound(roundData);
      setAnswers(await getAnswers(roundData.id));
      setVotes(await getVotes(roundData.id));
    }
  }, [local]);

  useEffect(() => {
    if (!local) {
      navigate("/");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch from Supabase on mount
    refresh();
  }, [local, navigate, refresh]);

  useGameRealtime(local?.gameId ?? null, refresh, round?.id ?? null);

  useEffect(() => {
    if (round?.id) {
      getAnswers(round.id).then(setAnswers);
      getVotes(round.id).then(setVotes);
    }
  }, [round?.id, round?.status]);

  useEffect(() => {
    if (game?.status === "game_over") {
      navigate("/mang-labi");
    }
  }, [game, navigate]);

  if (!local || !game || !round) {
    return <LoadingView />;
  }

  const me = players.find((player) => player.id === local.playerId);
  const hotSeatPlayer = players.find((player) => player.id === round.hot_seat_player_id);
  const isHotSeat = me?.id === round.hot_seat_player_id;
  const questionText = round.custom_question_text ?? "";
  const myAnswer = answers.find((answer) => answer.player_id === local.playerId);
  const myVote = votes.find((vote) => vote.voter_player_id === local.playerId);
  const answeredIds = new Set(answers.map((answer) => answer.player_id));
  const votedIds = new Set(votes.map((vote) => vote.voter_player_id));

  const sortedAnswers = [...answers].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
  const displayAnswers = sortedAnswers.map((answer, index) => ({
    id: answer.id,
    answerText: answer.answer_text,
    label: LABELS[index] ?? String(index + 1),
  }));

  async function handleAnswerSubmit(answerText: string) {
    if (!me) return;
    await submitAnswer(round!.id, me.id, answerText, isHotSeat);
    await refresh();
  }

  async function handleVote(answerId: string) {
    if (!me) return;
    await submitVote(round!.id, me.id, answerId);
    await refresh();
  }

  async function handleNextStep() {
    if (isWorking) return;
    setIsWorking(true);

    try {
      if (round!.status === "question") {
        await updateRoundStatus(round!.id, "answering");
      } else if (round!.status === "answering") {
        const shuffled = shuffle(answers);
        await Promise.all(shuffled.map((answer, index) => setDisplayOrder(answer.id, index)));
        await updateRoundStatus(round!.id, "reading");
      } else if (round!.status === "reading") {
        await updateRoundStatus(round!.id, "voting");
      } else if (round!.status === "voting") {
        await updateRoundStatus(round!.id, "reveal");
      } else if (round!.status === "reveal") {
        if (hotSeatPlayer) {
          const scoreChanges = calculateScores(
            players.map(toPlayer),
            answers.map((a) => ({
              id: a.id,
              roundId: a.round_id,
              playerId: a.player_id,
              answerText: a.answer_text,
              isHotSeatAnswer: a.is_hot_seat_answer,
              displayOrder: a.display_order,
            })),
            votes.map((v) => ({ id: v.id, roundId: v.round_id, voterPlayerId: v.voter_player_id, answerId: v.answer_id })),
            hotSeatPlayer.id
          );

          await Promise.all(
            players.map((player) => {
              const change = scoreChanges.get(player.id) ?? 0;
              return change !== 0 ? updatePlayerScore(player.id, player.score + change) : Promise.resolve();
            })
          );
        }
        await updateRoundStatus(round!.id, "scoring");
      } else if (round!.status === "scoring") {
        await updateRoundStatus(round!.id, "complete");
      } else if (round!.status === "complete") {
        const refreshedPlayers = await getPlayers(game!.id);
        const winners = findWinners(refreshedPlayers.map(toPlayer), game!.target_score);

        if (winners.length > 0) {
          await endGame(game!.id);
        } else {
          const nextHotSeat = getNextHotSeatPlayer(refreshedPlayers.map(toPlayer), round!.hot_seat_player_id);
          const question = questions[Math.floor(Math.random() * questions.length)];
          const nextRound = await createRound(game!.id, nextHotSeat.id, question.textEt, round!.round_number + 1);
          await setCurrentRound(game!.id, nextRound.id);
        }
      }

      await refresh();
    } finally {
      setIsWorking(false);
    }
  }

  return (
    <div className="page">
      <p className="muted">
        Voor {round.round_number} · Kuumal toolil: {hotSeatPlayer?.name ?? "?"}
      </p>
      <PlayerList players={players.map(toPlayer)} hotSeatPlayerId={round.hot_seat_player_id} />

      {round.status === "question" && hotSeatPlayer && (
        <QuestionCard questionText={questionText} hotSeatPlayerName={hotSeatPlayer.name} />
      )}

      {round.status === "answering" && hotSeatPlayer && (
        <>
          <QuestionCard questionText={questionText} hotSeatPlayerName={hotSeatPlayer.name} />
          <PlayerStatusList title="Kes on vastanud" players={players.map(toPlayer)} doneIds={answeredIds} />
          {myAnswer ? (
            <div className="card">
              <p>Vastus saadetud.</p>
              <p className="muted">Ootame teisi mängijaid.</p>
            </div>
          ) : (
            <AnswerForm hotSeatPlayerName={hotSeatPlayer.name} onSubmit={handleAnswerSubmit} />
          )}
        </>
      )}

      {round.status === "reading" && <AnswerList answers={displayAnswers} />}

      {round.status === "voting" && hotSeatPlayer && (
        <>
          <QuestionCard questionText={questionText} hotSeatPlayerName={hotSeatPlayer.name} />
          <PlayerStatusList
            title="Kes on hääletanud"
            players={players.map(toPlayer)}
            doneIds={votedIds}
            excludeId={hotSeatPlayer.id}
          />
          {isHotSeat ? (
            <p className="status-banner">Sa ei hääleta selles voorus.</p>
          ) : myVote ? (
            <div className="card">
              <p>Hääl saadetud.</p>
              <p className="muted">Ootame teisi.</p>
            </div>
          ) : (
            <VotePanel hotSeatPlayerName={hotSeatPlayer.name} options={displayAnswers} onVote={handleVote} />
          )}
        </>
      )}

      {round.status === "reveal" && hotSeatPlayer && (
        <div className="card">
          <p className="muted">Õige vastus oli:</p>
          <p>{answers.find((a) => a.player_id === hotSeatPlayer.id)?.answer_text}</p>
        </div>
      )}

      {round.status === "scoring" && <div className="card">Punktid arvutatud.</div>}

      {round.status === "complete" && <div className="card">Voor on lõppenud.</div>}

      {me?.is_host && (
        <GameControls roundStatus={round.status} onNextStep={handleNextStep} disabled={isWorking} />
      )}
    </div>
  );
}
