import React, {useState, useEffect} from 'react';
import {
  Alert,
  Modal,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';

import AddIcon from '../../../assets/icons/add.svg';
import styles from './index.style';
import Header from '../Header/Header';
import ComboBtn from '../ComboBtn/ComboBtn';
import QRScanner from '../QRScanner';
import {ScrollView} from 'react-native-gesture-handler';

interface Props {
  modalVisible: boolean;
  setModalVisible: (val: boolean) => void;
  onPair: (val: string) => void;
}

const initialError = {status: false, message: ''};

const ModalConnect = ({modalVisible, setModalVisible, onPair}: Props) => {
  const [isShowInput, setIsShowInput] = useState<boolean>(false);
  const [connectUri, setConnectUri] = useState<string>('');
  const [error, setError] = useState(initialError);

  const handleConfirm = () => {
    if (!connectUri) {
      setError({
        status: true,
        message: 'Please enter your uri',
      });
      return;
    }

    onPair(connectUri);
    setConnectUri('');
  };

  const resetToInitial = () => {
    setIsShowInput(false);
    setError(initialError);
    setConnectUri('');
  };

  useEffect(() => {
    resetToInitial();
  }, [modalVisible]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        setModalVisible(!modalVisible);
      }}>
      <View style={styles.modalContent}>
        <ScrollView>
          <Header
            goBack={() => {
              setModalVisible(false);
            }}
            title="Scan QR Code"
          />
          <View style={styles.qrContainer}>
            <QRScanner onPair={onPair} />
          </View>
          <View style={styles.connectUri}>
            <View style={styles.middle}>
              <View style={styles.line} />
              <Text style={styles.textOr}>or</Text>
              <View style={styles.line} />
            </View>
            {isShowInput ? (
              <View style={{marginBottom: 10}}>
                <TextInput
                  value={connectUri}
                  onChangeText={setConnectUri}
                  style={
                    [
                      styles.input,
                      error.status ? styles.inputError : '',
                    ] as TextStyle
                  }
                />
                {error.status && (
                  <Text style={styles.textError}>{error.message}</Text>
                )}
                <View>
                  <ComboBtn
                    styleBtnConfirm={styles.btnConfirm}
                    styleContainer={styles.wrapBtn}
                    onCancel={resetToInitial}
                    onConfirm={handleConfirm}
                    titleCancel="Cancel"
                    titleConfirm="Connect"
                  />
                </View>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => setIsShowInput(!isShowInput)}
                style={styles.btnConnectUri}>
                <AddIcon />
                <Text style={styles.textBtn}>User Wallet Connect Uri</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default ModalConnect;
