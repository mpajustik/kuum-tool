interface GameCodeBoxProps {
  roomCode: string;
  joinUrl: string;
}

export function GameCodeBox({ roomCode, joinUrl }: GameCodeBoxProps) {
  return (
    <div className="card">
      <p className="muted">Mängukood</p>
      <div className="room-code">{roomCode}</div>
      <p className="muted">{joinUrl}</p>
    </div>
  );
}
