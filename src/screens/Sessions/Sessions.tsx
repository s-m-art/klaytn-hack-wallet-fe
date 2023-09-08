import React from 'react';
import {FlatList, ScrollView, Text, View} from 'react-native';
import {useQuery} from '@apollo/client';
import {GET_ALL_SESSIONS} from '../../services/query';
import SessionItem from './SessionItem';
import styles from './index.style';

interface Props {
  navigation: any;
}

function Sessions({navigation}: Props) {
  const {loading, error, data} = useQuery(GET_ALL_SESSIONS);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error! {error.message}</Text>;

  const sessions = data.sessionEntities;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>List Sessions</Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={sessions}
        renderItem={({item}) => (
          <SessionItem key={item.id} item={item} navigation={navigation} />
        )}
      />
    </View>
  );
}

export default Sessions;
