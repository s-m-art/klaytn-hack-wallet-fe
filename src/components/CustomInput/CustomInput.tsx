import React, {FC} from 'react';
import {TextInput, View} from 'react-native';
import EyeIcon from '../../../assets/icons/eye.svg';

import {styles} from './style';
import {COLOR} from '../../../styles/color';

interface propTypes {
  placeHolder: string;
  value?: string;
  isPassword?: boolean;
  error?: boolean;
  errorText?: string;
  LeftAdornment?: any;
  styles?: any;
}

const CustomInput: FC<propTypes> = props => {
  const {LeftAdornment} = props;
  return (
    <View style={{...styles.container, ...props.styles}}>
      <View style={styles.inputLeft}>
        {!!LeftAdornment ? <LeftAdornment /> : null}
        <TextInput
          style={styles.input}
          placeholder={props.placeHolder}
          placeholderTextColor={COLOR.neutral_1}
        />
      </View>
      {props?.isPassword ? <EyeIcon /> : null}
    </View>
  );
};

export default CustomInput;
