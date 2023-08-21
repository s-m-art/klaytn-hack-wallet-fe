import React from 'react';
import {Image, View} from 'react-native';
import styles from './index.style';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/icons/splashhi.png')}
        style={styles.img}
      />
    </View>
  );
};

export default SplashScreen;
