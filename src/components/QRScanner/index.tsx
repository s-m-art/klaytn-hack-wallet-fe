import React from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';

interface Props {
  onPair: (val: string) => void;
}

const QRScanner = ({onPair}: Props) => {
  const onSuccess = (e: any) => {
    onPair(e.data);
  };

  return <QRCodeScanner onRead={onSuccess} showMarker />;
};

export default QRScanner;
