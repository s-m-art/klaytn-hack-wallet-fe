import React, {useEffect} from 'react';
import {FlatList, Text, View} from 'react-native';
import {useLazyQuery, useQuery} from '@apollo/client';

import {GET_ALL_TRANSACTIONS} from '../../services/query';
import TransactionItem from './TransactionItem';
import styles from './index.style';
import {STORAGE_KEYS} from '../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {
  navigation: any;
}

function ListTransactions({navigation}: Props) {
  const [getTransactions, {loading, error, data}] =
    useLazyQuery(GET_ALL_TRANSACTIONS);

  useEffect(() => {
    const fetchData = async () => {
      const accountAddress =
        (await AsyncStorage.getItem(STORAGE_KEYS.ADDRESS)) || '';
      getTransactions({variables: {sender: accountAddress}});
    };

    fetchData();
  }, []);

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
