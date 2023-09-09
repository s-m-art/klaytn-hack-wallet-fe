import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import styles from './index.style';
import ItemSetting from './ItemSetting';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {currentETHAddress} from '../../utils/Web3WalletClient';

interface Props {
  setIsSignIn: any;
}
function Settings({setIsSignIn}: Props) {
  const handleLogout = async () => {
    setIsSignIn(false);
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
