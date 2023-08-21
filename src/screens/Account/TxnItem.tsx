import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';

import styles from './index.style';
import {TYPE_STATUS} from './mock';
import {TxnData} from '../../types';

import {ROUTES_BAR} from '../../constants';

interface Props {
  item: TxnData;
  navigation?: any;
}

const TxnItem = ({item, navigation}: Props) => {
  const {name, type, startDate, endDate} = item;
  const defineItemStatus = () => {
    switch (type) {
      case TYPE_STATUS.ACTIVE: {
        return <Text style={styles.textActive}>Active</Text>;
      }
      case TYPE_STATUS.UP_COMING: {
        return <Text style={styles.textUpcoming}>Upcoming</Text>;
      }
      case TYPE_STATUS.EXPIRED: {
        return <Text style={styles.textExp}>Expired</Text>;
      }
      default: {
        return <Text style={styles.textActive}>Active</Text>;
      }
    }
  };

  const goToDetail = () => {
    navigation.navigate(ROUTES_BAR.DETAIL);
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
            source={require('../../../assets/icons/Avatar.png')}
            style={styles.img}
          />
          <View style={styles.wrapName}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.date}>
              {startDate}-{endDate}
            </Text>
          </View>
        </View>
        <View>{defineItemStatus()}</View>
      </View>
    </WrapForm>
  );
};

export default TxnItem;
