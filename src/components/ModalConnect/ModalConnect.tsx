import React, {useState} from 'react';
import {
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import styles from './index.style';
import Header from '../Header/Header';
import ComboBtn from '../ComboBtn/ComboBtn';
import QRScanner from '../QRScanner';

interface Props {
  modalVisible: boolean;
  setModalVisible: (val: boolean) => void;
  onPair: (val: string) => void;
}

const ModalConnect = ({modalVisible, setModalVisible, onPair}: Props) => {
  const [isShowInput, setIsShowInput] = useState<boolean>(false);
  const [connectUri, setConnectUri] = useState<string>('');

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        setModalVisible(!modalVisible);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Header
            goBack={() => {
              setModalVisible(false);
            }}
            title="Scan QR Code"
          />
          <View style={styles.qrContainer}>
            <QRScanner onPair={onPair} />
          </View>
          <View style={styles.middle}>
            <View style={styles.line} />
            <Text style={styles.textOr}>or</Text>
            <View style={styles.line} />
          </View>
          {isShowInput ? (
            <View style={styles.wrapInput}>
              <TextInput
                value={connectUri}
                onChangeText={setConnectUri}
                style={styles.input}
              />
              <View>
                <ComboBtn
                  styleBtnConfirm={styles.btnConfirm}
                  styleContainer={styles.wrapBtn}
                  onCancel={() => {
                    setIsShowInput(false);
                    setConnectUri('');
                  }}
                  onConfirm={() => {
                    onPair(connectUri);
                    setConnectUri('');
                  }}
                  titleCancel="Cancel"
                  titleConfirm="Connect"
                />
              </View>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => setIsShowInput(!isShowInput)}
              style={styles.btnConnectUri}>
              <Text style={styles.textBtn}>User Wallet Connect Uri</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ModalConnect;
