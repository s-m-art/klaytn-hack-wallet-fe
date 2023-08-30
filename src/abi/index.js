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
  },
};
