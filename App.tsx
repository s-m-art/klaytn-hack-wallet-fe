/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Home from './src/screens/Home';
import {createStackNavigator} from '@react-navigation/stack';
import SignIn from './src/screens/SignIn';
import SignUp from './src/screens/SignUp';
import {ROUTES} from './src/constants';

const Stack = createStackNavigator();

function App(): JSX.Element {
  const isSignedIn = false;
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="SignIn">
        {isSignedIn ? (
          <>
            <Stack.Screen name={ROUTES.HOME} component={Home} />
          </>
        ) : (
          <>
            <Stack.Screen name={ROUTES.SIGN_IN} component={SignIn} />
            <Stack.Screen name={ROUTES.SIGN_UP} component={SignUp} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
