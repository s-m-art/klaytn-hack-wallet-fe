import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import styles from './index.style';
import {listTxnMock} from '../Account/mock';
import TxnItem from '../Account/TxnItem';

interface Props {
  navigation: any;
}

function Sessions({navigation}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>List Transactions</Text>
      <ScrollView>
        {listTxnMock.map(item => (
          <TxnItem navigation={navigation} key={item.id} item={item} />
        ))}
      </ScrollView>
    </View>
  );
}

export default Sessions;
