import React from 'react';
import {Text, View} from 'react-native';

import styles from './index.style';
import {ListSessionMock} from './mock';
import TxnItem from './TxnItem';

interface Props {
  navigation: any;
}

function ListSession({navigation}: Props) {
  return (
    <View style={styles.txnContainer}>
      <Text style={styles.titleTxn}>List Sessions</Text>
      {ListSessionMock.slice(0, 3).map(item => (
        <TxnItem navigation={navigation} key={item.id} item={item} />
      ))}
    </View>
  );
}

export default ListSession;
