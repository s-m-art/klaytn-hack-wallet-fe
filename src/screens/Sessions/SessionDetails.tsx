import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import BigNumber from 'bignumber.js';
import Header from '../../components/Header/Header';
import {useQuery} from '@apollo/client';
import {GET_SESSION} from '../../services/query';
import SessionItem from './SessionItem';
import styles from './index.style';
import {SESSION_TYPES} from '../../constants';

interface Props {
  route: any;
  navigation: any;
}

function SessionDetails({route, navigation}: Props) {
  const {sessionId, status} = route.params;
  const {loading, error, data} = useQuery(GET_SESSION, {
    variables: {sessionId},
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

  const formatDate = (timestampInSeconds: any) => {
    const date = new Date(timestampInSeconds * 1000);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();

    return `${hours}:${minutes} ${day}/${month}/${year}`;
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error! {error.message}</Text>;

  const renderStatus = () => {
    switch (status) {
      case SESSION_TYPES.VALID: {
        return <Text style={styles.textActive}>{SESSION_TYPES.VALID}</Text>;
      }
      case SESSION_TYPES.UP_COMING: {
        return (
          <Text style={styles.textUpcoming}>{SESSION_TYPES.UP_COMING}</Text>
        );
      }
      case SESSION_TYPES.EXPIRED: {
        return <Text style={styles.textExp}>{SESSION_TYPES.EXPIRED}</Text>;
      }
      default: {
        return <Text style={styles.textActive}>{SESSION_TYPES.VALID}</Text>;
      }
    }
  };

  const session = data.sessionEntity;

  return (
    <View style={styles.container}>
      <View style={styles.TopTier}>
        <Header goBack={goBack} title="Details" />
        <SessionItem item={session} isDetailPage />
        <View style={styles.infoWrap}>
          <View style={styles.itemWrap}>
            <Text style={styles.textTilte}>Network</Text>
            <Text style={styles.textValue}>Klaytn</Text>
          </View>
          <View style={styles.itemWrap}>
            <Text style={styles.textTilte}>Valid from</Text>
            <Text style={styles.textValue}>
              {formatDate(session.startFrom)}
            </Text>
          </View>
          <View style={styles.itemWrap}>
            <Text style={styles.textTilte}>Valid until</Text>
            <Text style={styles.textValue}>
              {formatDate(session.validUntil)}
            </Text>
          </View>
          <View style={styles.itemWrap}>
            <Text style={styles.textTilte}>Max Amount</Text>
            <Text style={styles.textValue}>
              {convertPrice(session.totalAmount)}
            </Text>
          </View>
          <View style={styles.itemWrap}>
            <Text style={styles.textTilte}>Status</Text>
            {renderStatus()}
          </View>
        </View>
      </View>
      <TouchableOpacity>
        <View style={styles.btnRemove}>
          <Text style={styles.textRemove}>Remove</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default SessionDetails;
