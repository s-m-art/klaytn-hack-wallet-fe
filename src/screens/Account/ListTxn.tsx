import React, {useCallback} from 'react';
import {FlatList, Text, View} from 'react-native';
import {useLazyQuery} from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';

import {GET_ALL_TRANSACTIONS} from '../../services/query';
import {STORAGE_KEYS} from '../../constants';
import TransactionItem from './TransactionItem';
import styles from './index.style';

interface Props {
  navigation: any;
}

function ListTransactions({navigation}: Props) {
  const [getTransactions, {loading, error, data}] =
    useLazyQuery(GET_ALL_TRANSACTIONS);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const accountAddress =
          (await AsyncStorage.getItem(STORAGE_KEYS.ADDRESS)) || '';
        getTransactions({variables: {sender: accountAddress}});
      };

      fetchData();
    }, []),
  );

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text style={styles.textExp}>Error! {error.message}</Text>;

  const showEmptyText = () => (
    <Text style={styles.textEmpty}>You don't have any transactions</Text>
  );

  const transactions = data?.transactionEntities;

  return (
    <View style={styles.txnContainer}>
      <Text style={styles.titleTxn}>List Transactions</Text>
      <FlatList
        data={transactions}
        renderItem={({item}) => (
          <TransactionItem key={item.id} navigation={navigation} item={item} />
        )}
        ListEmptyComponent={showEmptyText()}
      />
    </View>
  );
}

export default ListTransactions;
