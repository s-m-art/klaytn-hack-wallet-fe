import React, {useState} from 'react';
import {View, StyleSheet, TextInput, Text, Image} from 'react-native';
import Modal from 'react-native-modal';
import {SignClientTypes} from '@walletconnect/types';
import {Message} from '../Modal/Message';
import {rejectEIP155Request} from '../../utils/EIP155Request';
import {ENV_ENTRY_POINT_ADDRESS, ENV_FACTORY_ADDRESS} from '@env';

import {AbiItem} from 'web3-utils';
import {web3Global, web3wallet} from '../../utils/Web3WalletClient';
import {handleDeepLinkRedirect} from '../../utils/LinkingUtils';
import ComboBtn from '../ComboBtn/ComboBtn';
import entryPointAbi from '../../abi/IEntryPoint.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEYS} from '../../constants';
import {getAccountInitCode} from '../../utils/operationUtils';
import {requestToRelayer} from '../../services';
import {getCallDataAddSession, signUserOpWeb3} from '../../utils/signUserOp';
import {fillUserOp} from '../../utils/UserOp';

import {formatJsonRpcResult} from '@json-rpc-tools/utils';
import {useApolloClient} from '@apollo/client';
import {GET_TXN_HASH} from '../../services/query';
import BigNumber from 'bignumber.js';

interface SendTransactionModalProps {
  visible: boolean;
  setVisible: (arg0: boolean) => void;
  requestEvent: SignClientTypes.EventArguments['session_request'] | any;
  requestSession: any;
}

export function SendTransactionModal({
  visible,
  setVisible,
  requestEvent,
  requestSession,
}: SendTransactionModalProps) {
  const chainID = requestEvent?.params?.chainId?.toUpperCase() || '';
  const method = requestEvent?.params?.request?.method || '';
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);
  const requestName = requestSession?.peer?.metadata?.name;
  const requestIcon = requestSession?.peer?.metadata?.icons[0];
  const requestURL = requestSession?.peer?.metadata?.url;
  const requestMetadata: SignClientTypes.Metadata =
    requestSession?.peer?.metadata;

  const {topic, params} = requestEvent;
  const {request} = params;
  const transaction = request.params[0];
  const client = useApolloClient();
  function onRedirect() {
    handleDeepLinkRedirect(requestMetadata?.redirect);
  }

  async function onApprove() {
    try {
      if (requestEvent) {
        const abiEntrypoint: AbiItem[] | any = entryPointAbi.abi;
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
        const accountAddress =
          (await AsyncStorage.getItem(STORAGE_KEYS.ADDRESS)) || '';

        const salt = (await AsyncStorage.getItem(STORAGE_KEYS.SALT)) || '';
        const ownerAddress =
          (await AsyncStorage.getItem(STORAGE_KEYS.ADDRESS_OWNER)) || '';
        const entryPointContract = new web3Global.eth.Contract(
          abiEntrypoint,
          ENV_ENTRY_POINT_ADDRESS,
        );
        const initCode = await getAccountInitCode(
          ownerAddress,
          ENV_FACTORY_ADDRESS,
          salt,
        );
        const {params: paramsRequest, id} = requestEvent;
        const {address, validAfter, validUntil, maxAmount} =
          paramsRequest.request.params[0];
        const msgData = getCallDataAddSession({
          sessionUser: address,
          startFrom: validAfter,
          validUntil,
          totalAmount: maxAmount,
        });

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

        const userOpHash = await entryPointContract.methods
          .getUserOpHash(userOpSignedWeb3)
          .call();
        const {data} = await client.query({
          query: GET_TXN_HASH,
          variables: {
            userOpHash,
          },
        });
        if (!!data && data?.transactionEntities.length > 0) {
          const {id: txnHash} = data.transactionEntities[0];
          const response = formatJsonRpcResult(id, {
            success: true,
            msg: txnHash || '',
          });
          await web3wallet.respondSessionRequest({
            topic,
            response,
          });
        }

        setVisible(false);
        onRedirect();
      }
    } catch (error) {
      console.log(error, 'error');
      setError(true);
    }
  }

  async function onReject() {
    if (requestEvent) {
      const response = rejectEIP155Request(requestEvent);
      await web3wallet.respondSessionRequest({
        topic,
        response,
      });
      setVisible(false);
      onRedirect();
    }
  }

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

  return (
    <Modal backdropOpacity={0.6} isVisible={visible}>
      <View style={styles.modalContainer}>
        <Text style={styles.textWelcome}>
          {requestName} is requesting a session key to perform actions on your
          wallet.
        </Text>
        <Text style={styles.textWelcome}>
          By providing the session key, you grant the app limited access to your
          wallet for the specified actions
        </Text>
        <Text style={styles.textSuggest}>
          Please review the details below before proceeding:
        </Text>

        <View style={styles.chainContainer}>
          <View style={styles.metadata1}>
            <Image
              source={require('../../../assets/WalletConnect.png')}
              style={styles.logo}
            />
            <View>
              <Text style={styles.name}>{requestName}</Text>
              <Text style={styles.uri}>{requestURL}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.wrap}>
            <Text style={styles.textKey}>Network</Text>
            <Text style={styles.textValue}>Klaytn</Text>
          </View>
          <View style={styles.wrap}>
            <Text style={styles.textKey}>Valid from</Text>
            <Text style={styles.textValue}>
              {formatDate(transaction.validAfter)}
            </Text>
          </View>
          <View style={styles.wrap}>
            <Text style={styles.textKey}>Valid until</Text>
            <Text style={styles.textValue}>
              {formatDate(transaction.validUntil)}
            </Text>
          </View>
          <View style={styles.wrap}>
            <Text style={styles.textKey}>Max amount</Text>
            <Text style={styles.textValue}>
              {convertPrice(transaction.maxAmount)}
            </Text>
          </View>
        </View>
        <View style={styles.wrapPasscode}>
          <Text style={styles.passcode}>Enter your passcode</Text>
          <TextInput
            onChangeText={setPasscode}
            value={passcode}
            style={styles.input}
          />
          {error && <Text>Wrong passcode</Text>}
        </View>
        <ComboBtn
          styleContainer={styles.chain}
          onCancel={onReject}
          onConfirm={onApprove}
          titleCancel="Cancel"
          titleConfirm="Submit"
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  textWelcome: {
    marginBottom: 8,
    textAlign: 'left',
    color: '#C0BEBC',
    letterSpacing: 0.1,
  },
  textSuggest: {
    color: '#F8F2EC',
    letterSpacing: 0.1,
    fontWeight: '500',
  },
  metadata1: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    objectFit: 'contain',
  },
  name: {
    color: '#F8F2EC',
    fontSize: 16,
    fontWeight: '700',
  },
  uri: {
    fontSize: 12,
    color: '#888889',
    marginTop: 4,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#3E4247',
  },
  wrap: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textKey: {
    color: '#C0BEBC',
  },
  textValue: {
    color: '#F8F2EC',
    fontWeight: '600',
  },
  chain: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'white',
    width: '100%',
    borderRadius: 10,
    color: '#F8F2EC',
    paddingHorizontal: 16,
  },
  wrapPasscode: {
    width: '100%',
  },
  passcode: {
    textAlign: 'left',
    marginBottom: 8,
    fontWeight: '500',
    color: '#F8F2EC',
  },
  chainContainer: {
    marginVertical: 24,
    width: '100%',
    paddingTop: 14,
    paddingBottom: 18,
    paddingHorizontal: 14,
    gap: 16,
    backgroundColor: '#2B2F35',
    borderRadius: 10,
  },
  modalContainer: {
    borderRadius: 34,
    backgroundColor: 'rgba(31, 35, 41, 1)',
    width: '100%',
    paddingTop: 30,
    minHeight: '70%',
    position: 'absolute',
    bottom: 44,
    paddingHorizontal: 20,
  },
});
