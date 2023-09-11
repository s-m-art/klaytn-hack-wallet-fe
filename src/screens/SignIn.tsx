import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import 'react-native-get-random-values';
import '@ethersproject/shims';
import CustomInput from '../components/CustomInput/CustomInput';
import LockIcon from '../../assets/icons/lock.svg';
import Bg from '../../assets/icons/login-bg.png';
import Card from '../../assets/icons/empty-wallet.svg';

import {STORAGE_KEYS} from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Web3 from 'web3';
import useNumbers from '../hooks/useNumbers';
import {AbiItem} from 'web3-utils';
import factoryAbi from '../abi/SimpleAccountFactory.json';
import {ENV_FACTORY_ADDRESS, ENV_RPC, ENV_ENTRY_POINT_ADDRESS} from '@env';
import {fillUserOp} from '../utils/UserOp';
import entryPointAbi from '../abi/IEntryPoint.json';
import {signUserOpWeb3} from '../utils/signUserOp';
import {getAccountInitCode} from '../utils/operationUtils';
import styles from './SignIn.style';
import {ethers} from 'ethers';
import {requestToRelayer} from '../services';
import {setWalletAddress, setWeb3Global} from '../utils/Web3WalletClient';

interface Props {
  navigation: any;
  setIsSignIn: React.Dispatch<React.SetStateAction<boolean>>;
}

interface DeployWalletParam {
  accountAddress: string;

  web3: Web3;
  privateKey: string;
  ownerAddress: string;
}

function SignIn({setIsSignIn}: Props) {
  const {randomBigNumber} = useNumbers();
  const [existWallet, setExistWallet] = useState<boolean | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [signInInfo, setSignInInfo] = useState({
    passcode: '',
    confirmPasscode: '',
  });
  const [accountAddress, setAccountAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const onChangeSigninInfo = (field: string, value: string) => {
    setSignInInfo(prev => ({...prev, [field]: value}));
    setError(false);
  };

  const deployWallet = async ({
    accountAddress,
    web3,
    privateKey,
    ownerAddress,
  }: DeployWalletParam) => {
    try {
      const abiEntrypoint: AbiItem[] | any = entryPointAbi.abi;
      // const chainId = await web3.eth.getChainId();
      const entryPointContract = new web3.eth.Contract(
        abiEntrypoint,
        ENV_ENTRY_POINT_ADDRESS,
      );
      const [chainId, initCode] = await Promise.all([
        web3.eth.getChainId(),
        getAccountInitCode(ownerAddress, ENV_FACTORY_ADDRESS, randomBigNumber),
      ]);

      // const initCode = await getAccountInitCode(
      //   ownerAddress,
      //   ENV_FACTORY_ADDRESS,
      //   randomBigNumber,
      // );

      const op2 = await fillUserOp(
        {
          sender: accountAddress,
          initCode,
          maxFeePerGas: '0',
          maxPriorityFeePerGas: '0',
          callData: '0x',
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
      console.log(userOpSignedWeb3, 'userOpSignedWeb3');

      await requestToRelayer(userOpSignedWeb3);
    } catch (error) {
      console.log(error, 'error relayer');
    }
  };

  const convertShortenAddress = (value: string) => {
    if (value) {
      return `${value.slice(0, 10)}...${value.slice(-8)}`;
    }
  };

  const handleCreateWallet = async () => {
    setError(false);

    if (!signInInfo.passcode) {
      setError(true);
      return;
    }

    setLoading(true);
    if (!signInInfo) {
      return;
    }

    const web3 = new Web3(ENV_RPC);
    setWeb3Global(web3);
    try {
      if (existWallet) {
        const [addressWallet, encryptPriKey] = await Promise.all([
          await AsyncStorage.getItem(STORAGE_KEYS.ADDRESS),
          await AsyncStorage.getItem(STORAGE_KEYS.ENCRYPT_PRIKEY),
        ]);

        const walletDecrypt = web3.eth.accounts.decrypt(
          JSON.parse(encryptPriKey || '{}'),
          signInInfo.passcode,
        );
        const {privateKey} = walletDecrypt;
        if (!privateKey) {
          setError(true);
          return;
        }
        setWalletAddress({walletAddress: addressWallet || ''});

        setIsSignIn(true);
      } else {
        if (signInInfo.passcode !== signInInfo.confirmPasscode) {
          setLoading(false);
          return;
        }
        let owner = ethers.Wallet.createRandom();
        const encryptPrikey = web3.eth.accounts.encrypt(
          owner.privateKey,
          signInInfo.passcode,
        );
        const abiFactory: AbiItem[] | any = factoryAbi.abi;
        const factoryContract = new web3.eth.Contract(
          abiFactory,
          ENV_FACTORY_ADDRESS,
        );

        const accountAddress = await factoryContract.methods
          .getAddress(owner.address, randomBigNumber)
          .call();
        setWalletAddress({walletAddress: accountAddress});
        // check address exist on chain
        const code = await web3.eth.getCode(accountAddress);
        await Promise.all([
          AsyncStorage.setItem(STORAGE_KEYS.ADDRESS, accountAddress),
          AsyncStorage.setItem(STORAGE_KEYS.ADDRESS_OWNER, owner.address),
          AsyncStorage.setItem(STORAGE_KEYS.SALT, randomBigNumber),
          AsyncStorage.setItem(
            STORAGE_KEYS.ENCRYPT_PRIKEY,
            JSON.stringify(encryptPrikey),
          ),
        ]);

        const notDeployed = code === '0x';
        if (notDeployed) {
          await deployWallet({
            accountAddress,
            ownerAddress: owner.address,
            privateKey: owner.privateKey,
            web3,
          });
        }
        setIsSignIn(true);
      }
    } catch {
      setError(true);
    }

    setLoading(false);
  };

  useEffect(() => {
    const checkWallet = async () => {
      const walletAddress =
        (await AsyncStorage.getItem(STORAGE_KEYS.ADDRESS)) || '';
      if (walletAddress) {
        setExistWallet(true);
        setAccountAddress(walletAddress);
      } else {
        setExistWallet(false);
      }
    };
    checkWallet();
  }, []);

  return (
    <View style={styles.wrapper}>
      <Image source={Bg} style={styles.img} />
      <View style={styles.container}>
        <View style={styles.wrap}>
          <Text style={styles.text1}>
            {existWallet ? 'Welcome back!' : 'New to Just Wallet?'}
          </Text>
          {existWallet ? null : (
            <Text style={styles.note}>
              Enter your password to set up an account!
            </Text>
          )}
          {existWallet && accountAddress && (
            <View style={styles.card}>
              <Card />
              <Text style={styles.address}>
                {convertShortenAddress(accountAddress)}
              </Text>
            </View>
          )}
          <View style={styles.wrapInput}>
            <CustomInput
              placeHolder="Password"
              LeftAdornment={LockIcon}
              styles={styles.input}
              isPassword
              setValue={(text: string) => onChangeSigninInfo('passcode', text)}
              value={signInInfo.passcode}
            />
            {error && <Text style={styles.textError}>Wrong Password</Text>}
            {existWallet === false && (
              <CustomInput
                placeHolder="Re-enter password"
                LeftAdornment={LockIcon}
                styles={styles.input}
                isPassword
                setValue={(text: string) =>
                  onChangeSigninInfo('confirmPasscode', text)
                }
                value={signInInfo.confirmPasscode}
              />
            )}
          </View>
        </View>
        <View style={styles.login}>
          <TouchableOpacity
            disabled={loading}
            style={styles.btn}
            onPress={handleCreateWallet}>
            {loading ? (
              <ActivityIndicator size="large" />
            ) : (
              <Text style={styles.loginBtn}>
                {existWallet ? 'Login' : 'Create account'}
              </Text>
            )}
          </TouchableOpacity>
          {existWallet && (
            <View style={styles.wrapBottom}>
              <View style={styles.wrapTextBottom}>
                <Text style={styles.dontAcc}>
                  You want to create new account?
                </Text>
                <TouchableOpacity
                  onPress={async () => {
                    await AsyncStorage.clear();
                    setExistWallet(false);
                  }}>
                  <Text style={styles.signUp}>Register</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

export default SignIn;
