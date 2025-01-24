import React from 'react'
import { QRCodeSVG } from 'qrcode.react';

const QRCode = ({ address }: { address: string }) => {
  return <QRCodeSVG width='200' height='200' value={address} />;
}

export default QRCode;