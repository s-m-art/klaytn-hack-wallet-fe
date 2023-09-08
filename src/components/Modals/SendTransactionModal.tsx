import React, {useState} from 'react';
import {View, StyleSheet, TextInput, Text} from 'react-native';
import Modal from 'react-native-modal';
import {SignClientTypes} from '@walletconnect/types';
import {Tag} from '../Tag';
import {Methods} from '../Modal/Methods';
import {Message} from '../Modal/Message';
import {ModalHeader} from '../Modal/ModalHeader';
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

        await requestToRelayer(userOpSignedWeb3);
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

  return (
    <Modal backdropOpacity={0.6} isVisible={visible}>
      <View style={styles.modalContainer}>
        <ModalHeader name={requestName} url={requestURL} icon={requestIcon} />

        <View style={styles.divider} />

        <View style={styles.chainContainer}>
          <View style={styles.flexRowWrapped}>
            <Tag value={chainID} grey={true} />
          </View>
          <Methods methods={[method]} />
          <Message message={JSON.stringify(transaction, null, 2)} />
        </View>
        <View style={styles.wrapPasscode}>
          <Text style={styles.passcode}>Passcode</Text>
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
          titleCancel="Decline"
          titleConfirm="Accept"
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  chain: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'white',
    width: '90%',
    borderRadius: 10,
  },
  wrapPasscode: {
    width: '90%',
  },
  passcode: {
    textAlign: 'left',
    marginBottom: 10,
  },
  chainContainer: {
    width: '90%',
    padding: 10,
    borderRadius: 25,
    backgroundColor: 'rgba(80, 80, 89, 0.1)',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  flexRowWrapped: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  modalContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 34,
    backgroundColor: 'rgba(31, 35, 41, 1)',
    width: '100%',
    paddingTop: 30,
    minHeight: '70%',
    position: 'absolute',
    bottom: 44,
  },
  rejectButton: {
    color: 'red',
  },
  dappTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
  },
  imageContainer: {
    width: 48,
    height: 48,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(60, 60, 67, 0.36)',
    marginVertical: 16,
  },
});
