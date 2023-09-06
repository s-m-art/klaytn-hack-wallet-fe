import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import styles from './index.style';

interface Props {
  onCancel: () => void;
  onConfirm: () => void;
  titleCancel: string;
  titleConfirm: string;
  styleContainer?: any;
  styleBtnConfirm?: any;
  styleBtnCancel?: any;
}

const ComboBtn = ({
  onCancel,
  onConfirm,
  titleCancel,
  titleConfirm,
  styleContainer,
  styleBtnConfirm = {},
  styleBtnCancel = {},
}: Props) => {
  return (
    <View style={styleContainer ?? styles.wrapBtn}>
      <TouchableOpacity
        onPress={onCancel}
        style={{...styles.btnCancel, ...styleBtnCancel}}>
        <Text style={styles.textBtn}>{titleCancel}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onConfirm}
        style={{...styles.btnConfirm, ...styleBtnConfirm}}>
        <Text style={styles.textBtn}>{titleConfirm}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ComboBtn;
