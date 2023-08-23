import React from 'react';
import {Text, View} from 'react-native';
import Arrow from '../../../assets/icons/arrow.svg';
import styles from './index.style';
import {TouchableOpacity} from 'react-native';
import TxnItem from '../Account/TxnItem';
import {listTxnMock} from '../Account/mock';
import Header from '../../components/Header/Header';

interface Props {
  navigation: any;
}

function DetailTxn({navigation}: Props) {
  const goBack = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      <View style={styles.TopTier}>
        <Header goBack={goBack} title="Details" />
        <TxnItem item={listTxnMock[0]} />
        <View style={styles.infoWrap}>
          <View style={styles.itemWrap}>
            <Text style={styles.textTilte}>Network</Text>
            <Text style={styles.textValue}>Network</Text>
          </View>
          <View style={styles.itemWrap}>
            <Text style={styles.textTilte}>Valid from</Text>
            <Text style={styles.textValue}>21:00 20/11/2023</Text>
          </View>
          <View style={styles.itemWrap}>
            <Text style={styles.textTilte}>Valid until</Text>
            <Text style={styles.textValue}>21:00 20/11/2023</Text>
          </View>
          <View style={styles.itemWrap}>
            <Text style={styles.textTilte}>Message</Text>
            <Text style={styles.textValue}>This is message</Text>
          </View>
          <View style={styles.itemWrap}>
            <Text style={styles.textTilte}>Methods</Text>
            <Text style={styles.textValue}>Methods personal_sign, claims,</Text>
          </View>
          <View style={styles.itemWrap}>
            <Text style={styles.textTilte}>Max Amount</Text>
            <Text style={styles.textValue}>1 KLAY</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity>
        <View style={styles.btnRemove}>
          <Text style={styles.textRemove}>Remove</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default DetailTxn;
