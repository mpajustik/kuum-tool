interface DisplayAnswer {
  id: string;
  answerText: string;
  label: string;
}

interface AnswerListProps {
  answers: DisplayAnswer[];
}

export function AnswerList({ answers }: AnswerListProps) {
  return (
    <div className="page">
      {answers.map((answer) => (
        <div key={answer.id} className="card">
          {answer.label}. {answer.answerText}
        </div>
      ))}
    </div>
  );
}
