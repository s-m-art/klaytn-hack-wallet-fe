import React from 'react';
import {View} from 'react-native';
import TopAccount from './TopAccount';
import styles from './index.style';
import ListTxn from './ListTxn';

interface Props {
  navigation: any;
}
function Account({navigation}: Props) {
  return (
    <View style={styles.container}>
      <TopAccount />
      <ListTxn navigation={navigation} />
    </View>
  );
}

export default Account;
