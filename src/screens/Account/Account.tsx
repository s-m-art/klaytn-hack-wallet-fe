import React from 'react';
import {ScrollView} from 'react-native';
import TopAccount from './TopAccount';
import styles from './index.style';
import ListTxn from './ListTxn';

interface Props {
  navigation: any;
  balance: string;
}

function Account({navigation, balance}: Props) {
  return (
    <ScrollView style={styles.container} bounces={false}>
      <TopAccount balance={balance} navigation={navigation} />
      <ListTxn navigation={navigation} />
    </ScrollView>
  );
}

export default Account;
