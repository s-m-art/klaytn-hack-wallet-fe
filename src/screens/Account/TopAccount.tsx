import React, {useEffect, useRef} from 'react';
import {Animated, Easing, Text, TouchableOpacity, View} from 'react-native';
import styles from './index.style';
import WalletLog from '../../../assets/icons/walletLog.svg';
import {ROUTES} from '../../constants';
interface Props {
  navigation: any;
  balance: string;
}
function TopAccount({navigation, balance}: Props) {
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

  return (
    <View style={styles.topContent}>
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
          <Text style={styles.titleNet}>Klay`s balance</Text>
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
