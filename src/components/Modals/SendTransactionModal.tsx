import React from 'react';
import {View, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import {SignClientTypes} from '@walletconnect/types';
import {Tag} from '../Tag';
import {Methods} from '../Modal/Methods';
import {Message} from '../Modal/Message';
import {AcceptRejectButton} from '../AcceptRejectButton';
import {ModalHeader} from '../Modal/ModalHeader';
import {
  approveEIP155Request,
  rejectEIP155Request,
} from '../../utils/EIP155Request';
import {web3wallet} from '../../utils/Web3WalletClient';
import {handleDeepLinkRedirect} from '../../utils/LinkingUtils';
import ComboBtn from '../ComboBtn/ComboBtn';

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

  const requestName = requestSession?.peer?.metadata?.name;
  const requestIcon = requestSession?.peer?.metadata?.icons[0];
  const requestURL = requestSession?.peer?.metadata?.url;
  const requestMetadata: SignClientTypes.Metadata =
    requestSession?.peer?.metadata;

  const {topic, params} = requestEvent;
  const {request} = params;
  const transaction = request.params[0];

  function onRedirect() {
    handleDeepLinkRedirect(requestMetadata?.redirect);
  }

  async function onApprove() {
    if (requestEvent) {
      const response = await approveEIP155Request(requestEvent);
      await web3wallet.respondSessionRequest({
        topic,
        response,
      });
      setVisible(false);
      onRedirect();
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

        <View style={styles.flexRow}>
          <AcceptRejectButton accept={false} onPress={onReject} />
          <AcceptRejectButton accept={true} onPress={onApprove} />
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
    paddingTop: 30,
    backgroundColor: 'rgba(242, 242, 247, 0.9)',
    width: '100%',
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
