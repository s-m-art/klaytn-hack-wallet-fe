import QRCodeScanner from 'react-native-qrcode-scanner';
import React from 'react';
import {Linking} from 'react-native';
import {RNCamera} from 'react-native-camera';

const QRScanner = () => {
  const onSuccess = (e: any) => {
    Linking.openURL(e.data)
      .then(res => console.log(res))
      .catch(err => console.error('An error occured', err));
  };

  return (
    <QRCodeScanner
      onRead={onSuccess}
      flashMode={RNCamera.Constants.FlashMode.torch}
    />
  );
};

export default QRScanner;
