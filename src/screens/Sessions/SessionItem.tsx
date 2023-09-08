import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';

import styles from '../Account/index.style';
import {SessionData} from '../../types';

import {ROUTES_BAR, SESSION_TYPES} from '../../constants';

interface Props {
  item: SessionData;
  navigation?: any;
  isDetailPage?: boolean;
}

const TxnItem = ({item, navigation, isDetailPage}: Props) => {
  const {id, startFrom, validUntil} = item;

  const getStatus = () => {
    const currentTime = Math.floor(Date.now() / 1000);
    const startTime = parseInt(startFrom, 10);
    const endTime = parseInt(validUntil, 10);

    if (currentTime < startTime) {
      return SESSION_TYPES.UP_COMING;
    } else if (currentTime >= startTime && currentTime <= endTime) {
      return SESSION_TYPES.VALID;
    } else {
      return SESSION_TYPES.EXPIRED;
    }
  };

  const renderStatus = () => {
    switch (getStatus()) {
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

  const goToDetail = () => {
    navigation.navigate(ROUTES_BAR.SESSION_DETAILS, {
      sessionId: id,
      status: getStatus(),
    });
  };

  // eslint-disable-next-line react/no-unstable-nested-components
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
            <Text style={styles.name}>TicTacToe</Text>
            <Text style={styles.link}>https://192.168.11.249:5173/</Text>
          </View>
        </View>
        {!isDetailPage && (
          <View style={styles.wrapTxnLeft}>{renderStatus()}</View>
        )}
      </View>
    </WrapForm>
  );
};

export default TxnItem;
