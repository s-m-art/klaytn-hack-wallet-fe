import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import styles from './index.style';

interface Props {
  onCancel: () => void;
  onConfirm: () => void;
  titleCancel: string;
  titleConfirm: string;
}

const ComboBtn = ({onCancel, onConfirm, titleCancel, titleConfirm}: Props) => {
  return (
    <View style={styles.wrapBtn}>
      <TouchableOpacity onPress={onCancel} style={styles.btnCancel}>
        <Text style={styles.textBtn}>{titleCancel}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onConfirm} style={styles.btnConfirm}>
        <Text style={styles.textBtn}>{titleConfirm}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ComboBtn;
