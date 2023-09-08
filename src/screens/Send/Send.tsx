import React, {useEffect, useState} from 'react';
import {
  ImageBackground,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Arrow from '../../../assets/icons/arrow.svg';
import Card from '../../../assets/icons/empty-wallet.svg';
import Layer from '../../../assets/icons/Layer_1.svg';

import styles from './index.style';
import ComboBtn from '../../components/ComboBtn/ComboBtn';
import {ROUTES, STORAGE_KEYS} from '../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {
  navigation: any;
  route: any;
}

const Send = ({navigation, route}: Props) => {
  const [address, setAddress] = useState('');
  const [target, setTarget] = useState('');
  const [amount, setAmount] = useState('');
  const {balance} = route.params;

  const goBack = () => {
    navigation.goBack();
  };

  const goContinue = () => {
    navigation.navigate(ROUTES.CONFIRM, {
      target,
      amount,
    });
  };

  useEffect(() => {
    const fetchAddress = async () => {
      const addressValue = await AsyncStorage.getItem(STORAGE_KEYS.ADDRESS);
      setAddress(addressValue);
    };
    fetchAddress();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.TopTier}>
        <View style={styles.wrapBg}>
          <ImageBackground
            style={styles.imgBg}
            resizeMode="cover"
            source={require('../../../assets/icons/bgww.png')}>
            <View style={styles.topCard}>
              <View style={styles.header}>
                <TouchableOpacity style={styles.btnGoBack} onPress={goBack}>
                  <Arrow width={24} height={24} />
                </TouchableOpacity>
                <Text style={styles.titleHeader}>Send</Text>
              </View>
              <View style={styles.wrapInfo}>
                <View style={styles.wrapIcon}>
                  <Card width={24} height={24} />
                </View>
                <View>
                  <Text style={styles.address}>User`s address</Text>
                  <Text style={styles.value}>{`${address.slice(
                    0,
                    7,
                  )}...${address.slice(-8)}`}</Text>
                </View>
              </View>
              <View style={styles.wrapInfo}>
                <View style={styles.wrapIcon}>
                  <Layer width={24} height={24} />
                </View>
                <View>
                  <Text style={styles.address}>Klay`s balance</Text>
                  <Text style={styles.value}>{balance}</Text>
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>

        <View style={styles.wrapInput}>
          <TextInput
            placeholder="Target"
            placeholderTextColor={'#6A6E73'}
            style={styles.input}
            value={target}
            onChangeText={setTarget}
          />

          <TextInput
            placeholderTextColor={'#6A6E73'}
            placeholder="Amount"
            style={styles.input}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>
      </View>
      <ComboBtn
        onCancel={goBack}
        onConfirm={goContinue}
        titleCancel="Cancel"
        titleConfirm="Continue"
      />
    </View>
  );
};

export default Send;
