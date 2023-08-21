import React from 'react';
import {Text, View} from 'react-native';

import styles from './index.style';
import {listTxnMock} from './mock';
import TxnItem from './TxnItem';

interface Props {
  navigation: any;
}

function ListTxn({navigation}: Props) {
  return (
    <View style={styles.txnContainer}>
      <Text style={styles.titleTxn}>List Transactions</Text>
      {listTxnMock.slice(0, 3).map(item => (
        <TxnItem navigation={navigation} key={item.id} item={item} />
      ))}
    </View>
  );
}

export default ListTxn;
