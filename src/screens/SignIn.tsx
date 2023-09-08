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
import {ROUTES, STORAGE_KEYS} from '../constants';
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
const FAKE_WALLET = {
  address: '0x3a524990De14A46e8Fe2e9ec4cA535012d3EBf0F',
  privateKey:
    '0x0d85968fbf5c5cfa1af4271b1fc2477ef73127744dc4da84e2dd8fe4f418d13e',
};

function SignIn({navigation, setIsSignIn}: Props) {
  const {randomBigNumber} = useNumbers();
  const [existWallet, setExistWallet] = useState<boolean | null>(null);
  const [error, setError] = useState<boolean>(false);

  const [signInInfo, setSignInInfo] = useState({
    passcode: '',
  });
  const [loading, setLoading] = useState(false);

  const onChangeSigninInfo = (field: string, value: string) => {
    setSignInInfo(prev => ({...prev, [field]: value}));
  };

  const onSignUp = () => {
    navigation.navigate(ROUTES.SIGN_UP);
  };

  const deployWallet = async ({
    accountAddress,
    web3,
    privateKey,
    ownerAddress,
  }: DeployWalletParam) => {
    const abiEntrypoint: AbiItem[] | any = entryPointAbi.abi;
    const chainId = await web3.eth.getChainId();
    const entryPointContract = new web3.eth.Contract(
      abiEntrypoint,
      ENV_ENTRY_POINT_ADDRESS,
    );

    const initCode = await getAccountInitCode(
      ownerAddress,
      ENV_FACTORY_ADDRESS,
      randomBigNumber,
    );

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
    const data = await requestToRelayer(userOpSignedWeb3);

    console.log(data, 'data');
  };

  const handleCreateWallet = async () => {
    setLoading(true);
    if (!signInInfo) {
      return;
    }

    const web3 = new Web3(ENV_RPC);
    setWeb3Global(web3);
    try {
      if (existWallet) {
        const addressWallet =
          (await AsyncStorage.getItem(STORAGE_KEYS.ADDRESS)) || '';
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
        setWalletAddress({walletAddress: addressWallet});
        setIsSignIn(true);
      } else {
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
        console.log(code, 'code');
        const notDeployed = code === '0x';

        await AsyncStorage.setItem(STORAGE_KEYS.ADDRESS, accountAddress);
        await AsyncStorage.setItem(STORAGE_KEYS.ADDRESS_OWNER, owner.address);
        await AsyncStorage.setItem(STORAGE_KEYS.SALT, randomBigNumber);
        await AsyncStorage.setItem(
          STORAGE_KEYS.ENCRYPT_PRIKEY,
          JSON.stringify(encryptPrikey),
        );
        setIsSignIn(true);
        if (notDeployed) {
          await deployWallet({
            accountAddress,
            ownerAddress: owner.address,
            privateKey: owner.privateKey,
            web3,
          });
        }
      }
    } catch {
      setError(true);
    }

    setLoading(false);
  };

  const createWalletFake = async () => {
    const web3 = new Web3(ENV_RPC);
    setLoading(true);
    setWeb3Global(web3);
    if (!signInInfo) {
      return;
    }
    try {
      const FAKE_CODE = '123';
      let owner = FAKE_WALLET;
      const encryptPrikey = web3.eth.accounts.encrypt(
        owner.privateKey,
        FAKE_CODE,
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
      console.log(code, 'code');
      const notDeployed = code === '0x';

      await AsyncStorage.setItem(STORAGE_KEYS.ADDRESS, accountAddress);
      await AsyncStorage.setItem(STORAGE_KEYS.ADDRESS_OWNER, owner.address);
      await AsyncStorage.setItem(STORAGE_KEYS.SALT, randomBigNumber);
      await AsyncStorage.setItem(
        STORAGE_KEYS.ENCRYPT_PRIKEY,
        JSON.stringify(encryptPrikey),
      );
      setIsSignIn(true);
      if (notDeployed) {
        await deployWallet({
          accountAddress,
          ownerAddress: owner.address,
          privateKey: owner.privateKey,
          web3,
        });
      }
    } catch {
      setError(true);
    }

    setLoading(false);
  };

  useEffect(() => {
    // setIsSignIn(true); // fake
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
    <View style={styles.wrapper}>
      <Image source={Bg} style={styles.img} />
      <View style={styles.container}>
        <View style={styles.wrap}>
          <Text style={styles.text1}>
            {existWallet ? 'Welcome back' : 'Create New Account'}
          </Text>
          <View style={styles.wrapInput}>
            <CustomInput
              placeHolder="Passcode"
              LeftAdornment={LockIcon}
              styles={styles.input}
              isPassword={true}
              setValue={(text: string) => onChangeSigninInfo('passcode', text)}
              value={signInInfo.passcode}
            />
          </View>
          <View>{error && <Text>Wrong Passcode</Text>}</View>
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
                {existWallet ? 'Login' : 'Create'}
              </Text>
            )}
          </TouchableOpacity>
          <View style={styles.wrapBottom}>
            <View style={styles.wrapTextBottom}>
              <Text style={styles.dontAcc}>Don't have an account?</Text>
              <Text style={styles.signUp} onPress={onSignUp}>
                Sign Up
              </Text>
            </View>
          </View>
        </View>

        {/* ==============Fake btn====================== */}
        <TouchableOpacity
          disabled={loading}
          style={styles.btn}
          onPress={createWalletFake}>
          <Text style={styles.loginBtn}>DEMO</Text>
        </TouchableOpacity>

        {/* =================================================== */}
      </View>
    </View>
  );
}

export default SignIn;
