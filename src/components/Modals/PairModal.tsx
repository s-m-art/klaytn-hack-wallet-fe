import React from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import Modal from 'react-native-modal';
import {Events} from '../Modal/Events';
import {Methods} from '../Modal/Methods';
import ComboBtn from '../ComboBtn/ComboBtn';

interface PairModalProps {
  proposal: any; //ToDo: fix.
  visible: boolean;
  handleAccept: () => void;
  handleDecline: () => void;
}

/*
     @notice: Proposal Modal for initiating the pair()
     @params: proposal, visible, open, handleAccept

     Rendering
      1. ModalHeader
      2. Requested Permissions Text
      3. Chain + Methods + Events
      4. Accept/Reject Buttons
  */

export function PairModal({
  proposal,
  visible,
  handleAccept,
  handleDecline,
}: PairModalProps) {
  // Note: Current namespaces is for EIP155 only (i.e. methods, events, chains)
  const name = proposal?.params?.proposer?.metadata?.name;
  const methods = proposal?.params?.requiredNamespaces.eip155.methods;
  const events = proposal?.params?.requiredNamespaces.eip155.events;

  return (
    <Modal isVisible={visible} hideModalContentWhileAnimating>
      <View style={styles.container}>
        <View style={styles.modalContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={require('../../../assets/WalletConnect.png')}
              style={styles.logo}
            />
          </View>
          <Text style={styles.textWelcome}>
            You are attempting to log in to {name}.
          </Text>
          <Text style={styles.permissionsText}>
            Do you want to proceed with this login request?
          </Text>

          <View style={styles.chainContainer}>
            <Methods methods={methods} />
            <Events events={events} />
          </View>

          <ComboBtn
            styleContainer={styles.chain}
            onCancel={handleDecline}
            onConfirm={handleAccept}
            titleCancel="Reject"
            titleConfirm="Approve"
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  chain: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 20,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexRow: {
    flex: 1,
    flexDirection: 'row',
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
  permissionsText: {
    color: '#FF662B',
    letterSpacing: 0.1,
    fontWeight: '500',
    marginBottom: 20,
    textAlign: 'center',
  },
  chainContainer: {
    width: '100%',
    paddingHorizontal: 20,
    gap: 10,
  },
  textWelcome: {
    color: '#C0BEBC',
    letterSpacing: 0.1,
    textAlign: 'center',
  },
  imageContainer: {
    width: 60,
    height: 70,
    marginBottom: 20,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
});
