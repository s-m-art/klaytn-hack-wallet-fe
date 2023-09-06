import {AbiItem} from 'web3-utils';

export const ABI_FUNCTION = {
  CREATE_ACC: {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'salt',
        type: 'uint256',
      },
    ],
    name: 'createAccount',
    outputs: [
      {
        internalType: 'contract SimpleAccount',
        name: 'ret',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  } as AbiItem,
  EXEC_FROM_ENTRY_POINT: {
    inputs: [
      {
        internalType: 'address',
        name: 'dest',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'func',
        type: 'bytes',
      },
    ],
    name: 'execute',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  ADD_SESSION: {
    inputs: [
      {
        internalType: 'address',
        name: 'sessionUser',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'startFrom',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'validUntil',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalAmount',
        type: 'uint256',
      },
    ],
    name: 'addSession',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  } as AbiItem,
  REMOVE_SESSION: {
    inputs: [
      {
        internalType: 'address',
        name: 'sessionUser',
        type: 'address',
      },
    ],
    name: 'removeSession',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  } as AbiItem,
};
