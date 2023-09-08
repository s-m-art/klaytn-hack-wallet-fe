import React from 'react';
import {Text, View} from 'react-native';
import BigNumber from 'bignumber.js';
import Header from '../../components/Header/Header';
import {useQuery} from '@apollo/client';
import {GET_TRANSACTION} from '../../services/query';
import TransactionItem from '../Account/TransactionItem';
import styles from './index.style';

interface Props {
  route: any;
  navigation: any;
}

function DetailTxn({route, navigation}: Props) {
  const {transactionId} = route.params;
  const {loading, error, data} = useQuery(GET_TRANSACTION, {
    variables: {transactionId},
  });

  const goBack = () => {
    navigation.goBack();
  };

  const convertPrice = (value: string) => {
    const price = new BigNumber(BigInt(value).toString()).dividedBy(
      BigNumber(10).pow(BigNumber(18)),
    );

    return `${price.toString(10)} KLAY`;
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error! {error.message}</Text>;

  const transaction = data.transactionEntity;

  return (
    <View style={styles.container}>
      <View style={styles.TopTier}>
        <Header goBack={goBack} title="Details" />
        <TransactionItem item={transaction} isDetailPage />
        <View style={styles.infoWrap}>
          <View style={styles.itemWrap}>
            <Text style={styles.textTilte}>Network</Text>
            <Text style={styles.textValue}>Klaytn</Text>
          </View>
          <View style={styles.itemWrap}>
            <Text style={styles.textTilte}>From</Text>
            <Text style={styles.textValue}>{transaction.sender}</Text>
          </View>
          <View style={styles.itemWrap}>
            <Text style={styles.textTilte}>To</Text>
            <Text style={styles.textValue}>{transaction.target}</Text>
          </View>
          <View style={styles.itemWrap}>
            <Text style={styles.textTilte}>Date</Text>
            <Text style={styles.textValue}>21:00 10/09/2023</Text>
          </View>
          <View style={styles.itemWrap}>
            <Text style={styles.textTilte}>Amount</Text>
            <Text style={styles.textValue}>
              {convertPrice(transaction.value)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default DetailTxn;
