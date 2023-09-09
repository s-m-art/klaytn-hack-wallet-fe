import React from 'react';
import {View, Dimensions} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';

const SCREEN_WIDTH = Dimensions.get('screen').width;

interface Props {
  onPair: (val: string) => void;
}

const QRScanner = ({onPair}: Props) => {
  const onSuccess = (e: any) => {
    onPair(e.data);
  };

  const marker = (
    color: string,
    size: string | number,
    borderLength: string | number,
    thickness: number = 2,
    borderRadius: number = 0,
  ): JSX.Element => {
    return (
      <View style={{height: size, width: size}}>
        <View
          style={{
            position: 'absolute',
            height: borderLength,
            width: borderLength,
            top: 0,
            left: 0,
            borderColor: color,
            borderTopWidth: thickness,
            borderLeftWidth: thickness,
            borderTopLeftRadius: borderRadius,
          }}></View>
        <View
          style={{
            position: 'absolute',
            height: borderLength,
            width: borderLength,
            top: 0,
            right: 0,
            borderColor: color,
            borderTopWidth: thickness,
            borderRightWidth: thickness,
            borderTopRightRadius: borderRadius,
          }}></View>
        <View
          style={{
            position: 'absolute',
            height: borderLength,
            width: borderLength,
            bottom: 0,
            left: 0,
            borderColor: color,
            borderBottomWidth: thickness,
            borderLeftWidth: thickness,
            borderBottomLeftRadius: borderRadius,
          }}></View>
        <View
          style={{
            position: 'absolute',
            height: borderLength,
            width: borderLength,
            bottom: 0,
            right: 0,
            borderColor: color,
            borderBottomWidth: thickness,
            borderRightWidth: thickness,
            borderBottomRightRadius: borderRadius,
          }}></View>
      </View>
    );
  };

  return (
    <QRCodeScanner
      onRead={onSuccess}
      cameraStyle={{
        width: '90%',
        borderRadius: 50,
        overflow: 'hidden',
        marginLeft: 'auto',
        marginRight: 'auto',
        height: SCREEN_WIDTH - 80,
      }}
      showMarker
      customMarker={marker('white', '80%', '30%', 6, 56)}
    />
  );
};

export default QRScanner;
