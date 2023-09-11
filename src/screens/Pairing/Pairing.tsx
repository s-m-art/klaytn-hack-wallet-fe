import React, {useState, useCallback} from 'react';
import {FlatList, Text, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

import {getPairings} from '../../utils/Web3WalletClient';
import PairingItem from './PairingItem';
import styles from '../Sessions/index.style';

interface Props {
  navigation: any;
}

function Pairing({navigation}: Props) {
  const [listPaired, setListPaired] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      setListPaired(getPairings());
    }, []),
  );

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
