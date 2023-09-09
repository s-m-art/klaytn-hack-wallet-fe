import React, {FC, useState} from 'react';
import {TextInput, View} from 'react-native';
import EyeIcon from '../../../assets/icons/eye.svg';

import {styles} from './style';
import {COLOR} from '../../../styles/color';

interface propTypes {
  placeHolder: string;
  value: string;
  setValue: any;
  isPassword?: boolean;
  error?: boolean;
  errorText?: string;
  LeftAdornment?: any;
  styles?: any;
}

const CustomInput: FC<propTypes> = props => {
  const {LeftAdornment, setValue} = props;
  const [visibility, setVisibility] = useState(false);

  return (
    <View style={{...styles.container, ...props.styles}}>
      <View style={styles.inputLeft}>
        {!!LeftAdornment ? <LeftAdornment /> : null}
        <TextInput
          style={styles.input}
          placeholder={props.placeHolder}
          placeholderTextColor={COLOR.neutral_1}
          value={props.value}
          secureTextEntry={props?.isPassword && !visibility}
          onChangeText={text => setValue(text)}
        />
      </View>
      {props?.isPassword ? (
        <EyeIcon onPress={() => setVisibility(prev => !prev)} />
      ) : null}
    </View>
  );
};

export default CustomInput;
