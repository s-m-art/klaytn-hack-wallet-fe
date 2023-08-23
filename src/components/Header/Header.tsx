import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import styles from './index.style';
import Arrow from '../../../assets/icons/arrow.svg';

interface Props {
  goBack: () => void;
  title: string;
}

const Header = ({goBack, title}: Props) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.btnGoBack} onPress={goBack}>
        <Arrow width={24} height={24} />
      </TouchableOpacity>
      <Text style={styles.titleHeader}>{title}</Text>
    </View>
  );
};

export default Header;
