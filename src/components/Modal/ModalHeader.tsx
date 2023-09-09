import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

interface IModalHeaderProps {
  name: string;
  url: string;
  icon: string;
}

export function ModalHeader({name, url, icon}: IModalHeaderProps) {
  return (
    <View style={styles.modalHeaderContainer}>
      <View style={styles.imageRowContainer}>
        <Image
          source={require('../../../assets/WalletConnect.png')}
          style={styles.logo}
        />
      </View>
      {name && <Text style={styles.dappTitle}>{name}</Text>}
      {url && <Text style={styles.urlText}>{url?.slice(8)}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  modalHeaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  imageRowContainer: {
    width: 60,
    height: 70,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  emojiContainer: {
    opacity: 0.8,
    width: 290,
    height: 44,
    borderRadius: 8,
    marginBottom: 8,
  },
  dappTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    color: '#F8F2EC',
  },
  urlText: {
    color: 'rgba(60, 60, 67, 0.6)',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(60, 60, 67, 0.36)',
    marginVertical: 16,
  },
});
