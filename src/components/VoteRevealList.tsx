export interface VoteRevealItem {
  id: string;
  name: string;
  label: string | null;
  answerText: string | null;
  isHotSeat: boolean;
  isCorrect: boolean;
}

interface VoteRevealListProps {
  items: VoteRevealItem[];
}

export function VoteRevealList({ items }: VoteRevealListProps) {
  return (
    <ul className="vote-reveal-list">
      {items.map((item) => (
        <li key={item.id}>
          <span>{item.name}</span>
          {item.label ? (
            <span className={item.isHotSeat ? "muted" : item.isCorrect ? "vote-correct" : "vote-wrong"}>
              {item.label}. {item.answerText}
              {item.isHotSeat ? " (oma vastus)" : item.isCorrect ? " ✅" : " ❌"}
            </span>
          ) : (
            <span className="muted">Ei hääletanud</span>
          )}
        </li>
      ))}
    </ul>
  );
}
