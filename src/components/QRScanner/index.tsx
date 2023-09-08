import React from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';

interface Props {
  onPair: (val: string) => void;
}

const QRScanner = ({onPair}: Props) => {
  const onSuccess = (e: any) => {
    onPair(e.data);
  };

  return (
    <QRCodeScanner
      onRead={onSuccess}
      flashMode={RNCamera.Constants.FlashMode.torch}
    />
  );
};

export default QRScanner;
