import React from 'react';
// import {View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Account from './Account';
import {MyTabBar} from '../components/Tabbar';
import {ROUTES_BAR} from '../constants';

const Tab = createBottomTabNavigator();

function Home() {
  return (
    <Tab.Navigator
      tabBar={props => <MyTabBar {...props} />}
      initialRouteName="Account">
      <Tab.Screen name={ROUTES_BAR.ACCOUNT} component={Account} />
      <Tab.Screen name={ROUTES_BAR.SESSIONS} component={Account} />
      <Tab.Screen name={ROUTES_BAR.WALLET} component={Account} />
      <Tab.Screen name={ROUTES_BAR.PAIRING} component={Account} />
      <Tab.Screen name={ROUTES_BAR.SETTINGS} component={Account} />
    </Tab.Navigator>
  );
}

export default Home;
