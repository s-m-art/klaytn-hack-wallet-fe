import {gql} from '@apollo/client';

const GET_TXN_HASH = gql`
  query MyQuery($userOpHash: String!) {
    transactionEntities(where: {userOpHash: $userOpHash}) {
      id
    }
  }
`;

const GET_DATA = gql`
  query {
    transactionEntities {
      id
      userOpHash
      data
    }
  }
`;

const GET_ALL_TRANSACTIONS = gql`
  query GetAllTransactions {
    transactionEntities {
      id
      value
      data
    }
  }
`;

export {GET_TXN_HASH, GET_DATA, GET_ALL_TRANSACTIONS};
