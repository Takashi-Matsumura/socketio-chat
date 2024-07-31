import React from "react";
import QRCode from "qrcode.react";

interface QRCodeDisplayProps {
  url: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ url }) => {
  return (
    <div>
      <QRCode value={url} />
    </div>
  );
};

export default QRCodeDisplay;
