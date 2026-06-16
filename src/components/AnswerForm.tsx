import { useState } from "react";

interface AnswerFormProps {
  questionText: string;
  hotSeatPlayerName: string;
  onSubmit: (answerText: string) => void;
  disabled?: boolean;
}

export function AnswerForm({ questionText, hotSeatPlayerName, onSubmit, disabled }: AnswerFormProps) {
  const [answerText, setAnswerText] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!answerText.trim()) return;
    onSubmit(answerText.trim());
  }

  return (
    <form className="page" onSubmit={handleSubmit}>
      <p className="muted">Vasta {hotSeatPlayerName} vaatenurgast</p>
      <p>{questionText}</p>
      <textarea
        className="input"
        rows={3}
        value={answerText}
        onChange={(event) => setAnswerText(event.target.value)}
        disabled={disabled}
      />
      <button type="submit" className="btn" disabled={disabled}>
        Saada vastus
      </button>
    </form>
  );
}
