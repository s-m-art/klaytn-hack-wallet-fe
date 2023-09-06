import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
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
import {ROUTES_BAR} from '../constants';

interface Props {
  navigation: any;
  setModalVisible: (val: boolean) => void;
}

const TAB_CONTENTS = [
  {
    id: 1,
    title: ROUTES_BAR.ACCOUNT,
    iconActive: <AccountIconActive width={24} height={24} />,
    icon: <AccountIcon width={24} height={24} />,
  },
  {
    title: ROUTES_BAR.SESSIONS,
    iconActive: <SessionIconActive width={24} height={24} />,
    icon: <SessionIcon width={24} height={24} />,
    id: 2,
  },
  {
    title: ROUTES_BAR.WALLET,
    iconActive: <ScanIcon width={32} height={32} />,
    icon: <ScanIcon width={32} height={32} />,
    id: 3,
  },
  {
    title: ROUTES_BAR.PAIRING,
    iconActive: <PairingIconActive width={24} height={24} />,
    icon: <PairingIcon width={24} height={24} />,
    id: 4,
  },
  {
    title: ROUTES_BAR.SETTINGS,
    iconActive: <SettingIconActive width={24} height={24} />,
    icon: <SettingIcon width={24} height={24} />,
    id: 5,
  },
];

export function MyTabBar({navigation, setModalVisible}: Props) {
  const [indexSelected, setIndexSelected] = useState(0);
  const handleSelectItem = (index: number, title: string): void => {
    setIndexSelected(index);
    navigation.navigate(title);
  };

  return (
    <View style={styles.container}>
      {TAB_CONTENTS.map((item, index) => {
        let isSelected = indexSelected === index;
        let middleTab = index === 2;
        let icon = isSelected ? item.iconActive : item.icon;
        const isWalletModal = item.title === ROUTES_BAR.WALLET;

        return (
          <TouchableOpacity
            onPress={() => {
              isWalletModal
                ? setModalVisible(true)
                : handleSelectItem(index, item.title);
            }}
            key={item.id}>
            <View style={styles.itemTab}>
              {middleTab ? <View style={styles.middleIcon}>{icon}</View> : icon}
              {!!item.title && !middleTab && (
                <Text
                  style={isSelected ? styles.textSelected : styles.textTitle}>
                  {item.title}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
