import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import styles from './index.style';
import WalletLog from '../../../assets/icons/walletLog.svg';
import {ROUTES} from '../../constants';
interface Props {
  navigation: any;
}
function TopAccount({navigation}: Props) {
  const goSend = () => {
    navigation.navigate(ROUTES.SEND);
  };

  return (
    <View style={styles.topContent}>
      <View style={styles.outSite}>
        <View style={styles.circleITem}>
          <WalletLog width={36} height={36} />
          <Text style={styles.titleNet}>Klay`s balance</Text>
          <Text style={styles.valuePrice}>3.519,44</Text>
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
