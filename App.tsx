/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Home from './src/screens/Home';
import {createStackNavigator} from '@react-navigation/stack';
import SignIn from './src/screens/SignIn';
import SignUp from './src/screens/SignUp';
import {ROUTES, ROUTES_BAR} from './src/constants';
import DetailTxn from './src/screens/DetailTxn/DetailTxn';
import SplashScreen from './src/screens/SplashScreen/SplashScreen';
import Send from './src/screens/Send/Send';

const Stack = createStackNavigator();

function App(): JSX.Element {
  const [isSignedIn, setIsSignIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 3000);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="SignIn">
        {!loading ? (
          isSignedIn ? (
            <>
              <Stack.Screen name={ROUTES.HOME} component={Home} />
              <Stack.Screen name={ROUTES.SEND} component={Send} />
              <Stack.Screen name={ROUTES_BAR.DETAIL} component={DetailTxn} />
            </>
          ) : (
            <>
              <Stack.Screen name={ROUTES.SIGN_IN}>
                {props => <SignIn {...props} setIsSignIn={setIsSignIn} />}
              </Stack.Screen>
              <Stack.Screen name={ROUTES.SIGN_UP} component={SignUp} />
            </>
          )
        ) : (
          <Stack.Screen name={ROUTES.SPLASH} component={SplashScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
