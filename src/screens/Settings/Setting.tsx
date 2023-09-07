import React from 'react';
import {Text, View} from 'react-native';
import styles from './index.style';
import ItemSetting from './ItemSetting';

function Settings() {
  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <Text style={styles.proifileText}>My Profile</Text>
      </View>
      <ItemSetting />
    </View>
  );
}

export default Settings;
