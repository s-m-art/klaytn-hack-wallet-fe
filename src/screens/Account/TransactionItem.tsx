import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';

import {Transaction} from '../../types';
import {ROUTES_BAR} from '../../constants';
import styles from './index.style';
import BigNumber from 'bignumber.js';

interface Props {
  item: Transaction;
  navigation?: any;
  isDetailPage?: boolean;
}

const TransactionItem = ({item, navigation, isDetailPage}: Props) => {
  const {id, value, data} = item;

  const convertPrice = (value: string, currency: string) => {
    const price = new BigNumber(BigInt(value).toString()).dividedBy(
      BigNumber(10).pow(BigNumber(18)),
    );

    if (currency === 'klaytn') return price.toString(10);
    return price.multipliedBy(BigNumber(0.133541)).toString(10);
  };

  const renderName = () => {
    if (data === '0x') return <Text style={styles.name}>Send</Text>;
    return <Text style={styles.name}>Interaction</Text>;
  };

  const goToDetail = () => {
    navigation.navigate(ROUTES_BAR.DETAIL, {
      transactionId: id,
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
            {renderName()}
            <Text style={styles.status}>Succeed</Text>
          </View>
        </View>
        <View style={styles.wrapTxnRight}>
          <Text style={styles.priceKlaytn}>{`-${convertPrice(
            value,
            'klaytn',
          )} KLAY`}</Text>
          {!isDetailPage && (
            <Text style={styles.priceUSD}>{`-${convertPrice(
              value,
              'usd',
            )} USD`}</Text>
          )}
        </View>
      </View>
    </WrapForm>
  );
};

export default TransactionItem;
