interface QuestionCardProps {
  questionText: string;
  hotSeatPlayerName: string;
}

export function QuestionCard({ questionText, hotSeatPlayerName }: QuestionCardProps) {
  return (
    <div className="card">
      <p className="muted">Kuumal toolil on {hotSeatPlayerName}</p>
      <h2>{questionText}</h2>
    </div>
  );
}
