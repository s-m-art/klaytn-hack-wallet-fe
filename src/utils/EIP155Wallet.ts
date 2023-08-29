import AsyncStorage from '@react-native-async-storage/async-storage';
import EIP155Lib from '../lib/EIP155';

export let wallet1: EIP155Lib;
export let wallet2: EIP155Lib;
export let eip155Wallets: Record<string, EIP155Lib>;
export let eip155Addresses: string[];

export let address1: string;
let address2: string;

/**
 * Utilities
 */
export const setMnemonic = async (mnemonic: any) => {
  try {
    const value = await AsyncStorage.setItem('EIP155_MNEMONIC_1', mnemonic);
    if (value !== null) {
      return value;
    }
  } catch (e) {
    console.log('setMnemonic Error:', e);
  }
};

export const getMnemonic = async () => {
  try {
    const value = await AsyncStorage.getItem('EIP155_MNEMONIC_1');
    if (value !== null) {
      return value;
    }
  } catch (e) {
    console.log('getLocalStorage Error:', e);
  }
};

export async function createOrRestoreEIP155Wallet() {
  let mnemonic1 = await getMnemonic();

  if (mnemonic1) {
    wallet1 = EIP155Lib.init({mnemonic: mnemonic1});
  } else {
    wallet1 = EIP155Lib.init({});
  }
  console.log(wallet1, 'wallet1');

  // @notice / Warning!!! : This is a test wallet, do not use it for real transactions
  setMnemonic(wallet1?.getMnemonic());
  address1 = wallet1.getAddress();

  eip155Wallets = {
    [address1]: wallet1,
    [address2]: wallet2,
  };
  eip155Addresses = Object.keys(eip155Wallets);

  return {
    eip155Wallets,
    eip155Addresses,
  };
}
