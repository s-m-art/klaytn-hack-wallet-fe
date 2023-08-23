import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Button,
  Easing,
  ScrollView,
  Text,
  TextInput,
  Touchable,
  TouchableHighlight,
  View,
} from 'react-native';

import styles from './index.style';
import Header from '../../components/Header/Header';
import ComboBtn from '../../components/ComboBtn/ComboBtn';
import EyeIcon from '../../../assets/icons/eye.svg';
import LockIcon from '../../../assets/icons/lock.svg';

interface Props {
  navigation: any;
}

const STEPS = {
  CONFIRM: 'confirm',
  SUBMIT: 'submit',
};

const Confirm = ({navigation}: Props) => {
  const [step, setStep] = useState<string>(STEPS.CONFIRM);
  const [showPass, setShowPass] = useState<boolean>(false);
  const isConfirmStep = step === STEPS.CONFIRM;

  const handleGoBack = () => {
    if (isConfirmStep) {
      navigation.goBack();
    } else {
      setStep(STEPS.CONFIRM);
    }
  };

  const handleSubmit = () => {};

  const handleConfirm = () => {
    if (isConfirmStep) {
      setStep(STEPS.SUBMIT);
    } else {
      handleSubmit();
    }
  };

  const titleConfirm = isConfirmStep ? 'Confirm' : 'Submit';
  const titleCancel = isConfirmStep ? 'Reject' : 'Cancel';

  return (
    <View style={styles.container}>
      <View style={styles.TopTier}>
        <Header goBack={handleGoBack} title="Confirm" />
        <ScrollView>
          {isConfirmStep ? (
            <View>
              <View style={styles.wrapField}>
                <Text style={styles.title}>From address</Text>
                <TextInput style={styles.wrapInput} />
              </View>
              <View style={styles.wrapField}>
                <Text style={styles.title}>To address</Text>
                <TextInput style={styles.wrapInput} />
              </View>
              <View style={styles.wrapField}>
                <Text style={styles.title}>Amount</Text>
                <TextInput style={styles.wrapInput} />
              </View>
              <View style={styles.wrapField}>
                <Text style={styles.title}>Gas estimated</Text>
                <TextInput style={styles.wrapInput} />
              </View>
            </View>
          ) : (
            <View style={styles.wrapField}>
              <Text style={styles.title}>Enter your password</Text>
              <View style={styles.wrapInputEye}>
                <LockIcon />
                <TextInput
                  secureTextEntry={!showPass}
                  placeholder="Password"
                  placeholderTextColor={'#6A6E73'}
                  style={styles.input}
                />
                <TouchableHighlight onPress={() => setShowPass(!showPass)}>
                  <EyeIcon />
                </TouchableHighlight>
              </View>
            </View>
          )}
        </ScrollView>
      </View>

      <ComboBtn
        titleCancel={titleCancel}
        titleConfirm={titleConfirm}
        onCancel={handleGoBack}
        onConfirm={handleConfirm}
      />
    </View>
  );
};

export default Confirm;
