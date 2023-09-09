import React, {useEffect, useRef, useState} from 'react';
import {Animated, Easing, Text, TouchableOpacity, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Clipboard from '@react-native-community/clipboard';
import WalletLog from '../../../assets/icons/walletLog.svg';
import CopyIcon from '../../../assets/icons/copy.svg';
import {ROUTES, STORAGE_KEYS} from '../../constants';
import styles from './index.style';

interface Props {
  navigation: any;
  balance: string;
}
function TopAccount({navigation, balance}: Props) {
  const [address, setAddress] = useState('');

  const getAddress = async () => {
    const accountAddress =
      (await AsyncStorage.getItem(STORAGE_KEYS.ADDRESS)) || '';
    setAddress(accountAddress);
  };

  const convertShortenAddress = (value: string) => {
    if (value) {
      return `${value.slice(0, 5)}...${value.slice(-4)}`;
    }
  };

  const handleCopyText = () => {
    console.log(address);

    Clipboard.setString(address);
  };

  const goSend = () => {
    navigation.navigate(ROUTES.SEND, {
      balance,
    });
  };

  const scaleValue = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 0.8,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(scaleValue, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
      ]),
      {
        iterations: -1,
      },
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [scaleValue]);

  useEffect(() => {
    getAddress();
  }, []);

  return (
    <View style={styles.topContent}>
      {address && (
        <TouchableOpacity
          style={styles.addressContainer}
          onPress={handleCopyText}>
          <Text style={styles.textAddress}>
            {convertShortenAddress(address)}
          </Text>
          <CopyIcon />
        </TouchableOpacity>
      )}
      <View style={styles.outSite}>
        <View style={styles.ldsRipple}>
          <Animated.View
            style={[
              styles.rippleInner,
              styles.rippleInnerDelayed,
              {transform: [{scale: scaleValue}]},
            ]}
          />
        </View>
        <View style={styles.circleITem}>
          <WalletLog width={36} height={36} />
          <Text style={styles.titleNet}>Klay's balance</Text>
          <Text style={styles.valuePrice}>{balance}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={goSend}>
        <View style={styles.buttonSend}>
          <Text style={styles.textSend}>Send</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default TopAccount;
