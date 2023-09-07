/**
 * @format
 */
import '@ethersproject/shims';
import 'text-encoding-polyfill';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {ApolloProvider} from '@apollo/client';
import client from './src/services/graphql';

// Wrap the App component with ApolloProvider
const AppWithApollo = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

// Register the App component with ApolloProvider
AppRegistry.registerComponent(appName, () => AppWithApollo);
