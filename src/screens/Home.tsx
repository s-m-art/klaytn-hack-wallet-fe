import React from 'react';
// import {View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Account from './Account/Account';
import {MyTabBar} from '../components/Tabbar';
import {ROUTES_BAR} from '../constants';
import Sessions from './Sessions/Sessions';
import Pairing from './Pairing';
import Settings from './Setting';

const Tab = createBottomTabNavigator();

function Home() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => <MyTabBar {...props} />}
      initialRouteName={ROUTES_BAR.ACCOUNT}>
      <Tab.Screen name={ROUTES_BAR.ACCOUNT} component={Account} />
      <Tab.Screen name={ROUTES_BAR.SESSIONS} component={Sessions} />
      <Tab.Screen name={ROUTES_BAR.WALLET} component={Account} />
      <Tab.Screen name={ROUTES_BAR.PAIRING} component={Pairing} />
      <Tab.Screen name={ROUTES_BAR.SETTINGS} component={Settings} />
    </Tab.Navigator>
  );
}

export default Home;
