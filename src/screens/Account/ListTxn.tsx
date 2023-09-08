import React from 'react';
import {FlatList, Text, View} from 'react-native';
import {useQuery} from '@apollo/client';

import {GET_ALL_TRANSACTIONS} from '../../services/query';
import TransactionItem from './TransactionItem';
import styles from './index.style';

interface Props {
  navigation: any;
}

function ListTransactions({navigation}: Props) {
  const {loading, error, data} = useQuery(GET_ALL_TRANSACTIONS);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error! {error.message}</Text>;

  const transactions = data?.transactionEntities;

  return (
    <View style={styles.txnContainer}>
      <Text style={styles.titleTxn}>List Transactions</Text>
      <FlatList
        data={transactions}
        renderItem={({item}) => (
          <TransactionItem key={item.id} navigation={navigation} item={item} />
        )}
      />
    </View>
  );
}

export default ListTransactions;
