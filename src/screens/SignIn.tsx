import React, {useState} from 'react';
import {Text, View, Image, TouchableOpacity} from 'react-native';
import CustomInput from '../components/CustomInput/CustomInput';
import UserIcon from '../../assets/icons/user.svg';
import LockIcon from '../../assets/icons/lock.svg';
import Bg from '../../assets/icons/login-bg.png';
import {COLOR} from '../../styles/color';
import {ROUTES, STORAGE_KEYS} from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ENV_FACTORY_ADDRESS, ENV_ENTRY_POINT_ADDRESS} from '@env';
import Web3 from 'web3';
import factoryAbi from '../abi/SimpleAccountFactory.json';
import entryPointAbi from '../abi/IEntryPoint.json';

import {AbiItem} from 'web3-utils';
import {fillUserOp} from '../utils/UserOp';
import {getAccountInitCode} from '../utils/operationUtils';
import {signUserOpWeb3} from '../utils/signUserOp';
interface Props {
  navigation: any;
  setIsSignIn: React.Dispatch<React.SetStateAction<boolean>>;
}
let ENV_RPC = 'https://api.baobab.klaytn.net:8651';

function SignIn({navigation, setIsSignIn}: Props) {
  console.log(ENV_RPC, 'ENV_RPC');

  const [signInInfo, setSignInInfo] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(true);

  const onChangeSigninInfo = (field: string, value: string) => {
    setSignInInfo(prev => ({...prev, [field]: value}));
  };

  const onSignUp = () => {
    navigation.navigate(ROUTES.SIGN_UP);
  };

  function generateRandomUint256() {
    const web3 = new Web3(ENV_RPC);
    const randomBigNumber = web3.utils.toBN(web3.utils.randomHex(32)); // 256 bits = 32 bytes
    return randomBigNumber.toString();
  }

  // const onSignIn = () => {
  //   setIsSignIn(true);
  //   // TODO: Implement sign in
  // };
  const handleCreateWallet = async () => {
    try {
      const web3 = new Web3(ENV_RPC);
      const newWallet = web3.eth.accounts.create();
      console.log(newWallet, 'newWallet');
      console.log(ENV_RPC, 'ENV_RPC');

      // await AsyncStorage.setItem(STORAGE_KEYS.ADDRESS_OWNER, newWallet.address);
      const encryptPrikey = web3.eth.accounts.encrypt(
        newWallet.privateKey,
        signInInfo.password,
      );
      const abiFactory: AbiItem[] | any = factoryAbi.abi;
      const abiEntrypoint: AbiItem[] | any = entryPointAbi.abi;
      const salt = 1000; //generateRandomUint256();
      const factoryContract = new web3.eth.Contract(
        abiFactory,
        ENV_FACTORY_ADDRESS,
      );
      const entryPointContract = new web3.eth.Contract(
        abiEntrypoint,
        ENV_ENTRY_POINT_ADDRESS,
      );

      const addressValue = await factoryContract.methods
        .getAddress(newWallet.address, salt)
        .call();

      const op2 = await fillUserOp(
        {
          sender: addressValue,
          initCode: getAccountInitCode(
            newWallet.address,
            ENV_FACTORY_ADDRESS,
            salt,
          ),
          callData: '0x',
        },
        entryPointContract,
      );
      const chainId = await web3.eth.getChainId();
      console.log(chainId, 'chainId');

      const userOpSignedWeb3 = signUserOpWeb3({
        op: {...op2, nonce: 1000},
        privateKey: newWallet.privateKey,
        entryPoint: ENV_ENTRY_POINT_ADDRESS,
        chainId,
      });
      console.log(userOpSignedWeb3, 'userOpSignedWeb3');
    } catch (error) {
      console.log(error, 'error');
    }
    setLoading(false);
  };

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
            {!loading ? 'Log in' : 'loading'}
          </Text>
          <View style={{display: 'flex', gap: 12, width: '100%'}}>
            <CustomInput
              placeHolder="Username"
              LeftAdornment={UserIcon}
              styles={{width: '100%'}}
              setValue={(text: string) => onChangeSigninInfo('username', text)}
              value={signInInfo.username}
            />
            <CustomInput
              placeHolder="Password"
              LeftAdornment={LockIcon}
              styles={{width: '100%'}}
              isPassword={true}
              setValue={(text: string) => onChangeSigninInfo('password', text)}
              value={signInInfo.password}
            />
          </View>
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
