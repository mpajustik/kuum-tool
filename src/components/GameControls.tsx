import type { RoundStatus } from "../types/game";

const BUTTON_TEXT: Record<RoundStatus, string> = {
  question: "Alusta vastamist",
  answering: "Näita vastuseid",
  reading: "Ava hääletus",
  voting: "Näita õiget vastust",
  reveal: "Arvuta punktid",
  scoring: "Lõpeta voor",
  complete: "Järgmine voor",
};

interface GameControlsProps {
  roundStatus: RoundStatus;
  onNextStep: () => void;
  disabled?: boolean;
}

export function GameControls({ roundStatus, onNextStep, disabled }: GameControlsProps) {
  return (
    <button type="button" className="btn" onClick={onNextStep} disabled={disabled}>
      {BUTTON_TEXT[roundStatus]}
    </button>
  );
}
