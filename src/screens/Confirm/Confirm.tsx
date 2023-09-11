import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  ToastAndroid,
  TouchableHighlight,
  View,
} from 'react-native';
import {ENV_ENTRY_POINT_ADDRESS} from '@env';
import {AbiItem} from 'web3-utils';

import styles from './index.style';
import Header from '../../components/Header/Header';
import ComboBtn from '../../components/ComboBtn/ComboBtn';
import EyeIcon from '../../../assets/icons/eye.svg';
import LockIcon from '../../../assets/icons/lock.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ROUTES_BAR, STORAGE_KEYS} from '../../constants';
import {fillUserOp, getCallDataEntryPoint} from '../../utils/UserOp';
import {web3Global} from '../../utils/Web3WalletClient';
import entryPointAbi from '../../abi/IEntryPoint.json';
import BigNumber from 'bignumber.js';
import {getCallDataGetUserOpHash, signUserOpWeb3} from '../../utils/signUserOp';
import {requestToRelayer} from '../../services';
import client from '../../services/graphql';
import {GET_TXN_HASH} from '../../services/query';

interface Props {
  navigation: any;
  route: any;
}

const STEPS = {
  CONFIRM: 'confirm',
  SUBMIT: 'submit',
};

const Confirm = ({navigation, route}: Props) => {
  const [step, setStep] = useState<string>(STEPS.CONFIRM);
  const [showPass, setShowPass] = useState<boolean>(false);
  const isConfirmStep = step === STEPS.CONFIRM;
  const [error, setError] = useState(false);
  const {target, amount: amountData} = route.params;
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [passcode, setPasscode] = useState('');
  const [toAddress, setToAddress] = useState(target);
  const [amount, setAmount] = useState(amountData);

  const handleGoBack = () => {
    if (isConfirmStep) {
      navigation.goBack();
    } else {
      setStep(STEPS.CONFIRM);
    }
  };

  const fetchDataOp = async () => {
    if (!passcode || !amount || !target || !address) {
      return;
    }
    const abiEntrypoint: AbiItem[] | any = entryPointAbi.abi;
    const entryPointContract = new web3Global.eth.Contract(
      abiEntrypoint,
      ENV_ENTRY_POINT_ADDRESS,
    );
    try {
      const chainId = await web3Global.eth.getChainId();

      const encryptPriKey = await AsyncStorage.getItem(
        STORAGE_KEYS.ENCRYPT_PRIKEY,
      );
      const walletDecrypt = web3Global.eth.accounts.decrypt(
        JSON.parse(encryptPriKey || '{}'),
        passcode,
      );
      const {privateKey} = walletDecrypt;
      if (!privateKey) {
        setError(true);
        return;
      }

      const valueSend = new BigNumber(amount).multipliedBy(
        new BigNumber(10).pow(new BigNumber(18)),
      );
      console.log(valueSend.toString(10), 'valueSend.toString(10)');

      const callData = getCallDataEntryPoint({
        value: valueSend.toString(10),
        target,
        msgDataEncode: '0x',
      });
      const op2 = await fillUserOp(
        {
          sender: address,
          initCode: '0x',
          maxFeePerGas: '0',
          maxPriorityFeePerGas: '0',
          callData,
          nonce: 1000,
        },
        entryPointContract,
      );
      const userOpSignedWeb3 = await signUserOpWeb3({
        op: {
          ...op2,
          nonce: 1000,
        },
        privateKey,
        entryPoint: ENV_ENTRY_POINT_ADDRESS,
        chainId,
      });
      return {userOpSignedWeb3, error: null};
    } catch (err) {
      setError(true);
      console.log(err);
      return {userOpSignedWeb3: null, error: true};
    }
  };

  const showToast = () => {
    ToastAndroid.show('Send success!', ToastAndroid.SHORT);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const {userOpSignedWeb3, error}: any = await fetchDataOp();
      if (error) {
        setLoading(false);
        return;
      }
      console.log(userOpSignedWeb3, 'userOpSignedWeb3');

      const {result} = await requestToRelayer(userOpSignedWeb3);
      console.log(result, 'result');

      setTimeout(() => {
        navigation.navigate(ROUTES_BAR.ACCOUNT);
        showToast();
      }, 3000);
    } catch (error) {
      console.log(error, 'error');
    }
  };

  const handleConfirm = () => {
    if (isConfirmStep) {
      setStep(STEPS.SUBMIT);
    } else {
      handleSubmit();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const addressValue =
        (await AsyncStorage.getItem(STORAGE_KEYS.ADDRESS)) || '';
      console.log(addressValue, 'addressValue');
      setAddress(addressValue);
    };
    fetchData();
  }, []);

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
                <TextInput
                  value={address}
                  onChangeText={setAddress}
                  style={styles.wrapInput}
                />
              </View>
              <View style={styles.wrapField}>
                <Text style={styles.title}>To address</Text>
                <TextInput
                  value={toAddress}
                  onChangeText={setToAddress}
                  style={styles.wrapInput}
                />
              </View>
              <View style={styles.wrapField}>
                <Text style={styles.title}>Amount</Text>
                <TextInput
                  value={amount}
                  onChangeText={setAmount}
                  style={styles.wrapInput}
                />
              </View>
              <View style={styles.wrapField}>
                <Text style={styles.title}>Gas estimated</Text>
                <TextInput style={styles.wrapInput} />
              </View>
            </View>
          ) : (
            <View style={styles.wrapField}>
              <Text style={styles.title}>Enter your passcode</Text>
              <View style={styles.wrapInputEye}>
                <LockIcon />
                <TextInput
                  secureTextEntry={!showPass}
                  placeholder="Passcode"
                  value={passcode}
                  onChangeText={setPasscode}
                  placeholderTextColor={'#6A6E73'}
                  style={styles.input}
                />
                {error && <Text>Wrong Passcode</Text>}
                <TouchableHighlight onPress={() => setShowPass(!showPass)}>
                  <EyeIcon />
                </TouchableHighlight>
              </View>
            </View>
          )}
        </ScrollView>
      </View>

      <ComboBtn
        disabledConfirm={loading}
        titleCancel={titleCancel}
        titleConfirm={titleConfirm}
        onCancel={handleGoBack}
        onConfirm={handleConfirm}
      />
    </View>
  );
};

export default Confirm;
