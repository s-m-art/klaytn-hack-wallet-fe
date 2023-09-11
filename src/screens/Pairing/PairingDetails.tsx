import React from 'react';
import {Text, View} from 'react-native';

import Header from '../../components/Header/Header';
import PairingItem from './PairingItem';
import styles from './index.style';

interface Props {
  route: any;
  navigation: any;
}

function PairingDetails({route, navigation}: Props) {
  const {data} = route.params;

  const goBack = () => {
    navigation.goBack();
  };

  const formatDate = (timestampInSeconds: any) => {
    const date = new Date(timestampInSeconds * 1000);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();

    return `${hours}:${minutes} ${day}/${month}/${year}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.TopTier}>
        <Header goBack={goBack} title="Details" />
        <PairingItem item={data} />
        <View style={styles.infoWrap}>
          <View style={styles.itemWrap}>
            <Text style={styles.textTilte}>Expired date</Text>
            <Text style={styles.textValue}>{formatDate(data.expiry)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default PairingDetails;
