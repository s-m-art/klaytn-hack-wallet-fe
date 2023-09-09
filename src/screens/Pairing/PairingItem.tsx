import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';

import styles from '../Account/index.style';
import {PairData} from '../../types';
import {ROUTES_BAR} from '../../constants';

interface Props {
  item: PairData;
  navigation?: any;
}

const PairingItem = ({item, navigation}: Props) => {
  const {peerMetadata} = item;

  const goToDetail = () => {
    navigation.navigate(ROUTES_BAR.PAIRING_DETAILS, {
      data: item,
    });
  };

  const WrapForm = ({children}: any) =>
    navigation ? (
      <TouchableOpacity onPress={goToDetail}>{children}</TouchableOpacity>
    ) : (
      <View>{children}</View>
    );

  return (
    <WrapForm>
      <View style={styles.itemContainer}>
        <View style={styles.wrapTxnLeft}>
          <Image
            source={require('../../../assets/icons/transfer.png')}
            style={styles.img}
          />
          <View style={styles.wrapName}>
            <Text style={styles.name}>{peerMetadata?.name ?? ''}</Text>
            <Text style={styles.link}>{peerMetadata?.url ?? ''}</Text>
          </View>
        </View>
      </View>
    </WrapForm>
  );
};

export default PairingItem;
