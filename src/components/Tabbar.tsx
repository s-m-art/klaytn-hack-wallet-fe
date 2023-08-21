import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import styles from './index.styles';

import AccountIconActive from '../../assets/icons/cards.svg';
import AccountIcon from '../../assets/icons/cards-no-active.svg';
import SessionIconActive from '../../assets/icons/card-edit.svg';
import SessionIcon from '../../assets/icons/card-edit-no-active.svg';
import ScanIcon from '../../assets/icons/scan.svg';
import PairingIconActive from '../../assets/icons/group.svg';
import PairingIcon from '../../assets/icons/group-no-active.svg';
import SettingIconActive from '../../assets/icons/setting-2.svg';
import SettingIcon from '../../assets/icons/setting-2-no-active.svg';

interface Props {
  navigation: any;
}

const TAB_CONTENTS = [
  {
    id: 1,
    title: 'Account',
    iconActive: <AccountIconActive width={24} height={24} />,
    icon: <AccountIcon width={24} height={24} />,
  },
  {
    title: 'Sessions',
    iconActive: <SessionIconActive width={24} height={24} />,
    icon: <SessionIcon width={24} height={24} />,
    id: 2,
  },
  {
    title: '',
    iconActive: <ScanIcon width={32} height={32} />,
    icon: <ScanIcon width={32} height={32} />,
    id: 3,
  },
  {
    title: 'Pairing',
    iconActive: <PairingIconActive width={24} height={24} />,
    icon: <PairingIcon width={24} height={24} />,
    id: 4,
  },
  {
    title: 'Settings',
    iconActive: <SettingIconActive width={24} height={24} />,
    icon: <SettingIcon width={24} height={24} />,
    id: 5,
  },
];

export function MyTabBar({navigation}: Props) {
  return (
    <View style={styles.container}>
      {TAB_CONTENTS.map(item => (
        <TouchableOpacity key={item.id}>
          <View style={styles.itemTab}>
            {item.icon}
            <Text>{item.title}</Text>
          </View>
        </TouchableOpacity>
      ))}
      {/* <Button
        title="Go somewhere"
        onPress={() => {
          // Navigate using the `navigation` prop that you received
          navigation.navigate('SomeScreen');
        }}
      /> */}
    </View>
  );
}
