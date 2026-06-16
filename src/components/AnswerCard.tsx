interface AnswerCardProps {
  answerText: string;
  label: string;
  selected?: boolean;
  onClick?: () => void;
}

export function AnswerCard({ answerText, label, selected, onClick }: AnswerCardProps) {
  return (
    <button
      type="button"
      className={selected ? "btn" : "btn btn-secondary"}
      onClick={onClick}
      style={{ textAlign: "left" }}
    >
      {label}. {answerText}
    </button>
  );
}
