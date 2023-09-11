import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import styles from './index.style';
import ItemSetting from './ItemSetting';
import {currentETHAddress, web3wallet} from '../../utils/Web3WalletClient';
import {getSdkError} from '@walletconnect/utils';

interface Props {
  setIsSignIn: any;
}
function Settings({setIsSignIn}: Props) {
  async function disconnect() {
    const activeSessions = await web3wallet.getActiveSessions();
    const topic = Object.values(activeSessions)[0].topic;

    if (activeSessions) {
      await web3wallet.disconnectSession({
        topic,
        reason: getSdkError('USER_DISCONNECTED'),
      });
    }
  }

  const handleLogout = async () => {
    setIsSignIn(false);
    disconnect();
  };

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <Text style={styles.proifileText}>My Profile</Text>
      </View>
      <View style={styles.profile}>
        <Text>{currentETHAddress}</Text>
      </View>
      <ItemSetting />
      <View style={styles.profile}>
        <TouchableOpacity onPress={handleLogout} style={styles.btnLogout}>
          <Text style={styles.textLogout}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Settings;
