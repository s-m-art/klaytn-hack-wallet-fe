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
  query GetTransactionsBySender($sender: String!) {
    transactionEntities(where: {sender: $sender}) {
      id
      value
      data
    }
  }
`;

const GET_TRANSACTION = gql`
  query GetTransactionById($transactionId: String!) {
    transactionEntity(id: $transactionId) {
      sender
      target
      userOpHash
      value
      data
    }
  }
`;

const GET_ALL_SESSIONS = gql`
  query GetSessionsBySender($sender: String!) {
    sessionEntities(where: {sender: $sender}) {
      id
      startFrom
      validUntil
      deleted
    }
  }
`;

const GET_SESSION = gql`
  query GetSessionById($sessionId: String!) {
    sessionEntity(id: $sessionId) {
      startFrom
      validUntil
      totalAmount
      sessionUser
    }
  }
`;

export {
  GET_TXN_HASH,
  GET_DATA,
  GET_ALL_TRANSACTIONS,
  GET_TRANSACTION,
  GET_ALL_SESSIONS,
  GET_SESSION,
};
