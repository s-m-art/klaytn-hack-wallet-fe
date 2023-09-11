import React, {useState} from 'react';
import {
  ActivityIndicator,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import BigNumber from 'bignumber.js';
import Header from '../../components/Header/Header';
import {useQuery} from '@apollo/client';
import {GET_SESSION} from '../../services/query';
import SessionItem from './SessionItem';
import styles from './index.style';
import {SESSION_TYPES, STORAGE_KEYS} from '../../constants';
import entryPointAbi from '../../abi/IEntryPoint.json';
import {AbiItem} from 'web3-utils';

import {TextInput} from 'react-native';
import {getCallDataRemoveSession, signUserOpWeb3} from '../../utils/signUserOp';
import {fillUserOp} from '../../utils/UserOp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ENV_ENTRY_POINT_ADDRESS} from '@env';
import {web3Global} from '../../utils/Web3WalletClient';
import {requestToRelayer} from '../../services';

interface Props {
  route: any;
  navigation: any;
}

function SessionDetails({route, navigation}: Props) {
  const {sessionId, status} = route.params;
  const [passcode, setPasscode] = useState('');
  const [errorPasscode, setErrorPassCode] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);
  const {loading, error, data} = useQuery(GET_SESSION, {
    variables: {sessionId},
  });

  const goBack = () => {
    navigation.goBack();
  };

  const showToast = () => {
    ToastAndroid.show('Remove session success!', ToastAndroid.SHORT);
  };

  const handleRemoveSession = async () => {
    try {
      setLoadingSend(true);
      const msgData: any = getCallDataRemoveSession({
        sessionUser: data.sessionEntity.sessionUser,
      });
      const abiEntrypoint: AbiItem[] | any = entryPointAbi.abi;

      const entryPointContract = new web3Global.eth.Contract(
        abiEntrypoint,
        ENV_ENTRY_POINT_ADDRESS,
      );
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
        setErrorPassCode(true);
        return;
      }
      const accountAddress =
        (await AsyncStorage.getItem(STORAGE_KEYS.ADDRESS)) || '';
      const op2 = await fillUserOp(
        {
          sender: accountAddress,
          initCode: '0x',
          maxFeePerGas: '0',
          maxPriorityFeePerGas: '0',
          callData: msgData,
          nonce: 1000,
        },
        entryPointContract,
      );
      const userOpSignedWeb3 = await signUserOpWeb3({
        op: {
          ...op2,
          initCode: '0x',
          nonce: 1000,
        },
        privateKey,
        entryPoint: ENV_ENTRY_POINT_ADDRESS,
        chainId,
      });
      const {result} = await requestToRelayer(userOpSignedWeb3);
      console.log(result, 'result');
      showToast();
      goBack();
    } catch (error) {
      console.log(error, 'error');
    } finally {
      setLoadingSend(false);
    }
  };

  const convertPrice = (value: string) => {
    const price = new BigNumber(BigInt(value).toString()).dividedBy(
      BigNumber(10).pow(BigNumber(18)),
    );

    return `${price.toString(10)} KLAY`;
  };

  const formatDate = (timestampInSeconds: any) => {
    const date = new Date(timestampInSeconds * 1000);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();

    return `${hours}:${minutes} ${day}/${month}/${year}`;
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error! {error.message}</Text>;

  const renderStatus = () => {
    switch (status) {
      case SESSION_TYPES.VALID: {
        return <Text style={styles.textActive}>{SESSION_TYPES.VALID}</Text>;
      }
      case SESSION_TYPES.UP_COMING: {
        return (
          <Text style={styles.textUpcoming}>{SESSION_TYPES.UP_COMING}</Text>
        );
      }
      case SESSION_TYPES.EXPIRED: {
        return <Text style={styles.textExp}>{SESSION_TYPES.EXPIRED}</Text>;
      }
      default: {
        return <Text style={styles.textActive}>{SESSION_TYPES.VALID}</Text>;
      }
    }
  };
  const session = data.sessionEntity;
  return (
    <View style={styles.container}>
      <View style={styles.TopTier}>
        <Header goBack={goBack} title="Details" />
        <SessionItem item={session} isDetailPage />
        <View style={styles.infoWrap}>
          <View style={styles.itemWrap}>
            <Text style={styles.textTilte}>Network</Text>
            <Text style={styles.textValue}>Klaytn</Text>
          </View>
          <View style={styles.itemWrap}>
            <Text style={styles.textTilte}>Valid from</Text>
            <Text style={styles.textValue}>
              {formatDate(session.startFrom)}
            </Text>
          </View>
          <View style={styles.itemWrap}>
            <Text style={styles.textTilte}>Valid until</Text>
            <Text style={styles.textValue}>
              {formatDate(session.validUntil)}
            </Text>
          </View>
          <View style={styles.itemWrap}>
            <Text style={styles.textTilte}>Max Amount</Text>
            <Text style={styles.textValue}>
              {convertPrice(session.totalAmount)}
            </Text>
          </View>
          <View style={styles.itemWrap}>
            <Text style={styles.textTilte}>Status</Text>
            {renderStatus()}
          </View>
        </View>
      </View>
      <TextInput
        placeholderTextColor={'#6A6E73'}
        placeholder="passcode"
        style={styles.input}
        secureTextEntry
        value={passcode}
        onChangeText={setPasscode}
      />
      {errorPasscode && <Text>Wrong passcode</Text>}
      <TouchableOpacity disabled={loadingSend} onPress={handleRemoveSession}>
        <View style={styles.btnRemove}>
          {loadingSend ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <Text style={styles.textRemove}>Remove</Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default SessionDetails;
