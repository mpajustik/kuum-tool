import { useState } from "react";
import { AnswerCard } from "./AnswerCard";

interface VoteOption {
  id: string;
  answerText: string;
  label: string;
}

interface VotePanelProps {
  hotSeatPlayerName: string;
  options: VoteOption[];
  onVote: (answerId: string) => void;
  disabled?: boolean;
}

export function VotePanel({ hotSeatPlayerName, options, onVote, disabled }: VotePanelProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  function handleSelect(answerId: string) {
    if (disabled) return;
    setSelectedId(answerId);
    onVote(answerId);
  }

  return (
    <div className="page">
      <p className="muted">Milline oli {hotSeatPlayerName} päris vastus?</p>
      {options.map((option) => (
        <AnswerCard
          key={option.id}
          label={option.label}
          answerText={option.answerText}
          selected={selectedId === option.id}
          onClick={() => handleSelect(option.id)}
        />
      ))}
    </div>
  );
}
