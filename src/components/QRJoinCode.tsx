import { QRCodeSVG } from "qrcode.react";

interface QRJoinCodeProps {
  joinUrl: string;
}

export function QRJoinCode({ joinUrl }: QRJoinCodeProps) {
  return (
    <div className="card" style={{ display: "flex", justifyContent: "center" }}>
      <QRCodeSVG value={joinUrl} size={160} />
    </div>
  );
}
