import React from 'react';
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

interface Props {
  navigation: any;
}

const Send = ({navigation}: Props) => {
  const goBack = () => {
    navigation.goBack();
  };
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
                  <Text style={styles.value}>0xkjwd45bs351g...624d5qg</Text>
                </View>
              </View>
              <View style={styles.wrapInfo}>
                <View style={styles.wrapIcon}>
                  <Layer width={24} height={24} />
                </View>
                <View>
                  <Text style={styles.address}>Klay`s balance</Text>
                  <Text style={styles.value}>3.519,44</Text>
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
          />

          <TextInput
            placeholderTextColor={'#6A6E73'}
            placeholder="Amount"
            style={styles.input}
          />
        </View>
      </View>
      <View style={styles.wrapBtn}>
        <TouchableOpacity style={styles.btnCancel}>
          <Text style={styles.textBtn}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnConfirm}>
          <Text style={styles.textBtn}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Send;
