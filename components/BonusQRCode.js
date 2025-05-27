//#
import React from 'react';
import QRCode from 'react-native-qrcode-svg';

export default function BonusQRCode({ value }) {
  return (
    <QRCode value={value?.toString() || ''} size={180} backgroundColor="#fff" />
  );
}
