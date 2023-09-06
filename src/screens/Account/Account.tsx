import React from 'react';
import {View} from 'react-native';
import TopAccount from './TopAccount';
import styles from './index.style';
import ListTxn from './ListTxn';

interface Props {
  navigation: any;
  balance: string;
}
function Account({navigation, balance}: Props) {
  return (
    <View style={styles.container}>
      <TopAccount balance={balance} navigation={navigation} />
      <ListTxn navigation={navigation} />
    </View>
  );
}

export default Account;
