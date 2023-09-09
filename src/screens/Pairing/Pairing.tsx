import React, {useEffect, useState} from 'react';
import {FlatList, Text, View} from 'react-native';
import {getPairings} from '../../utils/Web3WalletClient';

import styles from '../Sessions/index.style';
import PairingItem from './PairingItem';

interface Props {
  navigation: any;
}

function Pairing({navigation}: Props) {
  const [listPaired, setListPaired] = useState<any[]>([]);

  useEffect(() => {
    setListPaired(getPairings());
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setListPaired(getPairings());
    });
    return unsubscribe;
  }, [navigation]);

  const showEmptyText = () => (
    <Text style={styles.textEmpty}>You haven't paired any apps yet</Text>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>List Pairing</Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={listPaired}
        renderItem={({item}) => (
          <PairingItem key={item.id} item={item} navigation={navigation} />
        )}
        ListEmptyComponent={showEmptyText()}
      />
    </View>
  );
}

export default Pairing;
