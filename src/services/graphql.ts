// src/apollo.ts
import {GRAPHQL_ENDPOINT} from '@env';
import {ApolloClient, InMemoryCache} from '@apollo/client';

const client = new ApolloClient({
  uri: GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
});

export default client;
