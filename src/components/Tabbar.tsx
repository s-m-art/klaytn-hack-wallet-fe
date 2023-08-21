import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import styles from './index.styles';
import Svg, {Use} from 'react-native-svg';
// import testSvg from '../../assets/icons/cards.svg';

interface Props {
  navigation: any;
}

const TAB_CONTENTS = [
  {
    id: 1,
    title: 'Account',
    icon: <Image source={require('../../assets/icons/cards.png')} />,
  },
  {
    title: 'Account',
    icon: <Image source={require('../../assets/icons/cards.png')} />,
    id: 2,
  },
  {
    title: 'Account',
    icon: <Image source={require('../../assets/icons/cards.png')} />,
    id: 3,
  },
  {
    title: 'Account',
    icon: <Image source={require('../../assets/icons/cards.png')} />,
    id: 4,
  },
  {
    title: 'Account',
    icon: <Image source={require('../../assets/icons/cards.png')} />,
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
