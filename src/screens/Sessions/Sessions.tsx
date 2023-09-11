import React, {useCallback} from 'react';
import {FlatList, Text, View} from 'react-native';
import {useLazyQuery} from '@apollo/client';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {GET_ALL_SESSIONS} from '../../services/query';
import {STORAGE_KEYS} from '../../constants';
import SessionItem from './SessionItem';
import styles from './index.style';

interface Props {
  navigation: any;
}

function Sessions({navigation}: Props) {
  const [getSessions, {loading, error, data}] = useLazyQuery(GET_ALL_SESSIONS);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const accountAddress =
          (await AsyncStorage.getItem(STORAGE_KEYS.ADDRESS)) || '';
        getSessions({variables: {sender: accountAddress}});
      };

      fetchData();
    }, []),
  );

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error! {error.message}</Text>;

  const showEmptyText = () => (
    <Text style={styles.textEmpty}>You don't have any sessions</Text>
  );

  const sessions = data?.sessionEntities;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>List Sessions</Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={sessions}
        renderItem={({item}) => (
          <SessionItem key={item.id} item={item} navigation={navigation} />
        )}
        ListEmptyComponent={showEmptyText()}
      />
    </View>
  );
}

export default Sessions;
