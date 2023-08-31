import React, {useEffect, useState} from 'react';
import {Text, View, Image, TouchableOpacity} from 'react-native';
import CustomInput from '../components/CustomInput/CustomInput';
import UserIcon from '../../assets/icons/user.svg';
import LockIcon from '../../assets/icons/lock.svg';
import Bg from '../../assets/icons/login-bg.png';
import {COLOR} from '../../styles/color';
import {ROUTES, STORAGE_KEYS} from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Web3 from 'web3';
import useNumbers from '../hooks/useNumbers';
import {getAccountInitCode} from '../utils/operationUtils';

interface Props {
  navigation: any;
  setIsSignIn: React.Dispatch<React.SetStateAction<boolean>>;
}
let ENV_RPC = 'https://api.baobab.klaytn.net:8651';

function SignIn({navigation, setIsSignIn}: Props) {
  const {randomBigNumber} = useNumbers();
  const [existWallet, setExistWallet] = useState<boolean | null>(null);
  const [error, setError] = useState<boolean>(false);

  const [signInInfo, setSignInInfo] = useState({
    passcode: '',
  });
  const [loading, setLoading] = useState(true);

  const onChangeSigninInfo = (field: string, value: string) => {
    setSignInInfo(prev => ({...prev, [field]: value}));
  };

  const onSignUp = () => {
    navigation.navigate(ROUTES.SIGN_UP);
  };

  const handleCreateWallet = async () => {
    if (!signInInfo) {
      return;
    }
    const web3 = new Web3(ENV_RPC);
    try {
      if (existWallet) {
        const encryptPriKey = await AsyncStorage.getItem(
          STORAGE_KEYS.ENCRYPT_PRIKEY,
        );

        const walletDecrypt = web3.eth.accounts.decrypt(
          JSON.parse(encryptPriKey || '{}'),
          signInInfo.passcode,
        );
        const {privateKey} = walletDecrypt;
        if (!privateKey) {
          setError(true);
          return;
        }
        setIsSignIn(true);
      } else {
        const owner = web3.eth.accounts.create();
        const encryptPrikey = web3.eth.accounts.encrypt(
          owner.privateKey,
          signInInfo.passcode,
        );
        const m = Date.now();
        console.log(m);

        await AsyncStorage.setItem(STORAGE_KEYS.ADDRESS_OWNER, owner.address);
        await AsyncStorage.setItem(STORAGE_KEYS.SALT, randomBigNumber);
        await AsyncStorage.setItem(
          STORAGE_KEYS.ENCRYPT_PRIKEY,
          JSON.stringify(encryptPrikey),
        );
        setIsSignIn(true);
      }
    } catch (error) {
      console.log(error, 'error');
      setError(true);
    }

    setLoading(false);
  };

  useEffect(() => {
    const checkWallet = async () => {
      const walletAddress = await AsyncStorage.getItem(
        STORAGE_KEYS.ADDRESS_OWNER,
      );
      if (walletAddress) {
        setExistWallet(true);
      } else {
        setExistWallet(false);
      }
    };
    checkWallet();
  }, []);

  return (
    <View style={{flex: 1, position: 'relative'}}>
      <Image
        source={Bg}
        style={{
          zIndex: -1,
          position: 'absolute',
          backgroundColor: COLOR.neutral_3,
          height: '100%',
          width: '100%',
        }}
      />
      <View
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          position: 'absolute',
          top: '30%',
          bottom: '5%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
        }}>
        <View style={{width: '100%', gap: 32, display: 'flex'}}>
          <Text
            style={{
              fontSize: 38,
              fontWeight: '700',
              lineHeight: 50,
              color: COLOR.light,
            }}>
            {existWallet ? 'Welcome back' : 'Create New Account'}
          </Text>
          <View style={{display: 'flex', gap: 12, width: '100%'}}>
            <CustomInput
              placeHolder="Passcode"
              LeftAdornment={LockIcon}
              styles={{width: '100%'}}
              isPassword={true}
              setValue={(text: string) => onChangeSigninInfo('passcode', text)}
              value={signInInfo.passcode}
            />
          </View>
          <View>{error && <Text>Wrong Passcode</Text>}</View>
        </View>
        <View style={{display: 'flex', gap: 24}}>
          <TouchableOpacity
            style={{
              borderRadius: 100,
              padding: 15,
              backgroundColor: COLOR.orange,
            }}
            onPress={handleCreateWallet}>
            <Text
              style={{
                color: COLOR.light,
                fontWeight: '600',
                fontSize: 18,
                textAlign: 'center',
                marginBottom: 4,
              }}>
              Log In
            </Text>
          </TouchableOpacity>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 2,
              justifyContent: 'center',
            }}>
            <View style={{display: 'flex', flexDirection: 'row', gap: 2}}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '500',
                  color: COLOR.neutral_1,
                }}>
                Don't have an account?
              </Text>
              <Text
                style={{fontSize: 16, fontWeight: '500', color: COLOR.orange}}
                onPress={onSignUp}>
                Sign Up
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

export default SignIn;
