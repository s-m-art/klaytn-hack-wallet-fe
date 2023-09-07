import {defaultAbiCoder, hexDataSlice, keccak256} from 'ethers/lib/utils';
import {Logger} from '@ethersproject/logger';

import {BigNumber, Contract, Signer, Wallet} from 'ethers';
import Web3 from 'web3';
// import {AddressZero, callDataCost, rethrow} from './testutils';
import {ecsign, toRpcSig, keccak256 as keccak256_buffer} from 'ethereumjs-util';
// import {EntryPoint} from '../typechain';
import {ENV_ENTRY_POINT_ADDRESS} from '@env';
// import {UserOperation} from './UserOperation';
// import {Create2Factory} from '../src/Create2Factory';
import {UserOperation} from '../constants/UserOperation';
import {Create2Factory} from './Create2Factory';
import {AddressZero, callDataCost, rethrow, version} from './operationUtils';

const web3 = new Web3();

const logger = new Logger(version);
export type Bytes = ArrayLike<number>;

export type BytesLike = Bytes | string;
export interface Hexable {
  toHexString(): string;
}

function isHexable(value: any): value is Hexable {
  return !!value.toHexString;
}

export type DataOptions = {
  allowMissingPrefix?: boolean;
  hexPad?: 'left' | 'right' | null;
};

function addSlice(array: any): Uint8Array {
  if (array.slice) {
    return array;
  }

  array.slice = function () {
    const args: any = Array.prototype.slice.call(arguments);
    return addSlice(new Uint8Array(Array.prototype.slice.apply(array, args)));
  };

  return array;
}

function isInteger(value: number) {
  return typeof value === 'number' && value == value && value % 1 === 0;
}

export function isBytes(value: any): value is Bytes {
  if (value == null) {
    return false;
  }

  if (value.constructor === Uint8Array) {
    return true;
  }
  if (typeof value === 'string') {
    return false;
  }
  if (!isInteger(value.length) || value.length < 0) {
    return false;
  }

  for (let i = 0; i < value.length; i++) {
    const v = value[i];
    if (!isInteger(v) || v < 0 || v >= 256) {
      return false;
    }
  }
  return true;
}

export function isHexString(value: any, length?: number): boolean {
  if (typeof value !== 'string' || !value.match(/^0x[0-9A-Fa-f]*$/)) {
    return false;
  }
  if (length && value.length !== 2 + 2 * length) {
    return false;
  }
  return true;
}

export function arrayify(
  value: BytesLike | Hexable | number,
  options?: DataOptions,
): Uint8Array {
  if (!options) {
    options = {};
  }

  if (typeof value === 'number') {
    logger.checkSafeUint53(value, 'invalid arrayify value');

    const result = [];
    while (value) {
      result.unshift(value & 0xff);
      value = parseInt(String(value / 256));
    }
    if (result.length === 0) {
      result.push(0);
    }

    return addSlice(new Uint8Array(result));
  }

  if (
    options.allowMissingPrefix &&
    typeof value === 'string' &&
    value.substring(0, 2) !== '0x'
  ) {
    value = '0x' + value;
  }

  if (isHexable(value)) {
    value = value.toHexString();
  }

  if (isHexString(value)) {
    let hex = (<string>value).substring(2);
    if (hex.length % 2) {
      if (options.hexPad === 'left') {
        hex = '0' + hex;
      } else if (options.hexPad === 'right') {
        hex += '0';
      } else {
        logger.throwArgumentError('hex data is odd-length', 'value', value);
      }
    }

    const result = [];
    for (let i = 0; i < hex.length; i += 2) {
      result.push(parseInt(hex.substring(i, i + 2), 16));
    }

    return addSlice(new Uint8Array(result));
  }

  if (isBytes(value)) {
    return addSlice(new Uint8Array(value));
  }

  return logger.throwArgumentError('invalid arrayify value', 'value', value);
}

export function packUserOp(op: UserOperation, forSignature = true): string {
  if (forSignature) {
    return defaultAbiCoder.encode(
      [
        'address',
        'uint256',
        'bytes32',
        'bytes32',
        'uint256',
        'uint256',
        'uint256',
        'uint256',
        'uint256',
        'bytes32',
      ],
      [
        op.sender,
        op.nonce,
        keccak256(op.initCode),
        keccak256(op.callData),
        op.callGasLimit,
        op.verificationGasLimit,
        op.preVerificationGas,
        op.maxFeePerGas,
        op.maxPriorityFeePerGas,
        keccak256(op.paymasterAndData),
      ],
    );
  } else {
    // for the purpose of calculating gas cost encode also signature (and no keccak of bytes)
    return defaultAbiCoder.encode(
      [
        'address',
        'uint256',
        'bytes',
        'bytes',
        'uint256',
        'uint256',
        'uint256',
        'uint256',
        'uint256',
        'bytes',
        'bytes',
      ],
      [
        op.sender,
        op.nonce,
        op.initCode,
        op.callData,
        op.callGasLimit,
        op.verificationGasLimit,
        op.preVerificationGas,
        op.maxFeePerGas,
        op.maxPriorityFeePerGas,
        op.paymasterAndData,
        op.signature,
      ],
    );
  }
}

export function packUserOp1(op: UserOperation): string {
  return defaultAbiCoder.encode(
    [
      'address', // sender
      'uint256', // nonce
      'bytes32', // initCode
      'bytes32', // callData
      'uint256', // callGasLimit
      'uint256', // verificationGasLimit
      'uint256', // preVerificationGas
      'uint256', // maxFeePerGas
      'uint256', // maxPriorityFeePerGas
      'bytes32', // paymasterAndData
    ],
    [
      op.sender,
      op.nonce,
      keccak256(op.initCode),
      keccak256(op.callData),
      op.callGasLimit,
      op.verificationGasLimit,
      op.preVerificationGas,
      op.maxFeePerGas,
      op.maxPriorityFeePerGas,
      keccak256(op.paymasterAndData),
    ],
  );
}

export function getUserOpHash(
  op: UserOperation,
  entryPoint: string,
  chainId: number,
): string {
  const userOpHash = keccak256(packUserOp(op, true));
  const enc = defaultAbiCoder.encode(
    ['bytes32', 'address', 'uint256'],
    [userOpHash, entryPoint, chainId],
  );
  return keccak256(enc);
}

export const DefaultsForUserOp: UserOperation = {
  sender: AddressZero,
  nonce: 0,
  initCode: '0x',
  callData: '0x',
  callGasLimit: 0,
  verificationGasLimit: 150000, // default verification gas. will add create2 cost (3200+200*length) if initCode exists
  preVerificationGas: 21000, // should also cover calldata cost.
  maxFeePerGas: 0,
  maxPriorityFeePerGas: 1e9,
  paymasterAndData: '0x',
  signature: '0x',
};

export function signUserOp(
  op: UserOperation,
  signer: Wallet,
  entryPoint: string,
  chainId: number,
): UserOperation {
  const message = getUserOpHash(op, entryPoint, chainId);
  const msg1 = Buffer.concat([
    Buffer.from('\x19Ethereum Signed Message:\n32', 'ascii'),
    Buffer.from(arrayify(message)),
  ]);

  const sig = ecsign(
    keccak256_buffer(msg1),
    Buffer.from(arrayify(signer.privateKey)),
  );
  // that's equivalent of:  await signer.signMessage(message);
  // (but without "async"
  const signedMessage1 = toRpcSig(sig.v, sig.r, sig.s);
  return {
    ...op,
    signature: signedMessage1,
  };
}

export function fillUserOpDefaults(
  op: Partial<UserOperation>,
  defaults = DefaultsForUserOp,
): UserOperation {
  const partial: any = {...op};
  // we want "item:undefined" to be used from defaults, and not override defaults, so we must explicitly
  // remove those so "merge" will succeed.
  for (const key in partial) {
    if (partial[key] == null) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete partial[key];
    }
  }
  const filled = {...defaults, ...partial};
  return filled;
}

// helper to fill structure:
// - default callGasLimit to estimate call from entryPoint to account (TODO: add overhead)
// if there is initCode:
//  - calculate sender by eth_call the deployment code
//  - default verificationGasLimit estimateGas of deployment code plus default 100000
// no initCode:
//  - update nonce from account.getNonce()
// entryPoint param is only required to fill in "sender address when specifying "initCode"
// nonce: assume contract as "getNonce()" function, and fill in.
// sender - only in case of construction: fill sender from initCode.
// callGasLimit: VERY crude estimation (by estimating call to account, and add rough entryPoint overhead
// verificationGasLimit: hard-code default at 100k. should add "create2" cost
export async function fillUserOp(
  op: Partial<UserOperation>,
  entryPoint?: any,
  getNonceFunction = 'getNonce',
): Promise<UserOperation> {
  const op1 = {...op};
  console.log(`========xxxxxxxxxxxxxxxxxxx======`);
  const entryPointProvider =
    entryPoint?.provider || entryPoint?.currentProvider;
  const provider = new Web3(entryPointProvider);
  console.log(`provider:`, {provider});

  if (op.initCode != null) {
    const initAddr = hexDataSlice(op1.initCode!, 0, 20);
    const initCallData = hexDataSlice(op1.initCode!, 20);
    if (op1.nonce == null) op1.nonce = 0;
    if (op1.sender == null) {
      // hack: if the init contract is our known deployer, then we know what the address would be, without a view call
      if (
        initAddr.toLowerCase() === Create2Factory.contractAddress.toLowerCase()
      ) {
        const ctr = hexDataSlice(initCallData, 32);
        const salt = hexDataSlice(initCallData, 0, 32);
        op1.sender = Create2Factory.getDeployedAddress(ctr, salt);
      } else {
        // console.log('\t== not our deployer. our=', Create2Factory.contractAddress, 'got', initAddr)
        if (provider == null) throw new Error('no entrypoint/provider');
        op1.sender = await entryPoint!.callStatic
          .getSenderAddress(op1.initCode!)
          .catch((e: {errorArgs: {sender: any}}) => e.errorArgs.sender);
      }
    }
    console.log(`========xxxxyyyyyyyyyyyyxxxxx======`);

    if (op1.verificationGasLimit == null) {
      if (provider == null) throw new Error('no entrypoint/provider');
      const initEstimate = await provider.eth.estimateGas({
        from: ENV_ENTRY_POINT_ADDRESS,
        to: initAddr,
        data: initCallData,
        gasLimit: 10e6,
      });
      op1.verificationGasLimit = BigNumber.from(
        DefaultsForUserOp.verificationGasLimit,
      ).add(initEstimate);
    }
  }
  console.log(`========zzzzzzzzzzzzzzzzzzzz======`);

  if (op1.nonce == null) {
    if (provider == null)
      throw new Error('must have entryPoint to autofill nonce');
    const c = new Contract(
      op.sender!,
      [`function ${getNonceFunction}() view returns(uint256)`],
      provider,
    );
    op1.nonce = await c[getNonceFunction]().catch(rethrow());
  }
  if (op1.callGasLimit == null && op.callData != null) {
    if (provider == null)
      throw new Error('must have entryPoint for callGasLimit estimate');
    const gasEtimated = await provider.eth.estimateGas({
      from: ENV_ENTRY_POINT_ADDRESS,
      to: op1.sender,
      data: op1.callData,
    });

    // console.log('estim', op1.sender,'len=', op1.callData!.length, 'res=', gasEtimated)
    // estimateGas assumes direct call from entryPoint. add wrapper cost.
    op1.callGasLimit = gasEtimated; // .add(55000)
  }
  if (op1.maxFeePerGas == null) {
    if (provider == null)
      throw new Error('must have entryPoint to autofill maxFeePerGas');
    const block = await provider.eth.getBlock('latest');
    // op1.maxFeePerGas = block.baseFeePerGas!.add(
    //   op1.maxPriorityFeePerGas ?? DefaultsForUserOp.maxPriorityFeePerGas,
    // );
    op1.maxFeePerGas = block.baseFeePerGas;
  }
  // TODO: this is exactly what fillUserOp below should do - but it doesn't.
  // adding this manually
  if (op1.maxPriorityFeePerGas == null) {
    op1.maxPriorityFeePerGas = DefaultsForUserOp.maxPriorityFeePerGas;
  }
  const op2 = fillUserOpDefaults(op1);
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  if (op2.preVerificationGas.toString() === '0') {
    // TODO: we don't add overhead, which is ~21000 for a single TX, but much lower in a batch.
    op2.preVerificationGas = callDataCost(packUserOp(op2, false));
  }

  console.log(`op2:`, {op2});
  return op2;
}

export async function fillAndSign(
  op: Partial<UserOperation>,
  signer: Wallet | Signer,
  entryPoint?: any,
  getNonceFunction = 'getNonce',
): Promise<UserOperation> {
  const provider = entryPoint?.provider;
  console.log(`=======================`);
  const op2 = await fillUserOp(op, entryPoint, getNonceFunction);
  console.log(`xxxxop2:`, {op2});
  const chainId = await provider!
    .getNetwork()
    .then((net: {chainId: any}) => net.chainId);
  const message = arrayify(getUserOpHash(op2, entryPoint!.address, chainId));

  return {
    ...op2,
    signature: await signer.signMessage(message),
  };
}

export const getCallData = ({abiFunction, value}: any) =>
  web3.eth.abi.encodeFunctionCall(abiFunction, value);

// export const getCallDataEntryPoint = ({value, target, msgDataEncode}: any) => {
//   const msgData = web3.eth.abi.encodeFunctionCall(
//     ABI_FUNCTION.EXEC_FROM_ENTRY_POINT,
//     [target, value, msgDataEncode],
//   );
//   return msgData;
// };
export const signMessage = async (
  message: string,
  signer: any,
  privateKey: string,
) => {
  const web3 = new Web3();
  const hashedMsg = web3.utils.keccak256(message);

  web3.eth.accounts.wallet.add(privateKey);
  const sig = await web3.eth.sign(hashedMsg, signer);
  let v = parseInt(sig.substring(130, 132), 16);
  if (v < 27) v += 27;
  const normalizedSig = `${sig.substring(0, 130)}${v.toString(16)}`;
  return normalizedSig;
};
