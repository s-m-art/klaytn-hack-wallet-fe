import {Core} from '@walletconnect/core';
import {ICore} from '@walletconnect/types';
import Web3 from 'web3';
import {Web3Wallet, IWeb3Wallet} from '@walletconnect/web3wallet';
export let web3wallet: IWeb3Wallet;
export let core: ICore;
export let currentETHAddress: string;
export let web3Global: Web3;
// @ts-expect-error - env is a virtualised module via Babel config.
import {ENV_PROJECT_ID, ENV_RELAY_URL} from '@env';

// import {createOrRestoreEIP155Wallet} from './EIP155Wallet';

interface TypeCreate {
  walletAddress: string;
}

export async function createWeb3Wallet() {
  console.log('ENV_PROJECT_ID', ENV_PROJECT_ID);
  console.log('ENV_RELAY_URL', ENV_RELAY_URL);

  core = new Core({
    // @notice: If you want the debugger / logs
    // logger: 'debug',
    projectId: ENV_PROJECT_ID,
    relayUrl: ENV_RELAY_URL,
  });

  // const {eip155Addresses} = await createOrRestoreEIP155Wallet();
  // currentETHAddress =
  // console.log('1111111111111111111111');
  // currentETHAddress = eip155Addresses[0];
  // console.log(eip155Addresses, 'eip155Addresses');

  web3wallet = await Web3Wallet.init({
    core,
    metadata: {
      name: 'React Native Web3Wallet',
      description: 'ReactNative Web3Wallet',
      url: 'https://walletconnect.com/',
      icons: ['https://avatars.githubusercontent.com/u/37784886'],
      redirect: {
        native: 'w3wrnsample://',
      },
    },
  });
}

export function setWeb3Global(web3: Web3) {
  web3Global = web3;
}

export function setWalletAddress({walletAddress}: TypeCreate) {
  currentETHAddress = walletAddress;
}

export async function _pair(params: {uri: string}) {
  return await core.pairing.pair({uri: params.uri});
}
