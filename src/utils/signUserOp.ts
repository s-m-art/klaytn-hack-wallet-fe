import {arrayify} from '@ethersproject/bytes';
import Web3 from 'web3';
import * as ethereumjs from 'ethereumjs-util';
import BigNumber from 'bignumber.js';
import {utils, BigNumber as BigNum} from 'ethers';
import {ABI_FUNCTION} from '../abi';

const chainIdDefault = 1001;
const web3 = new Web3();

export function packUserOpWeb3(op: any, forSignature = true): string {
  if (forSignature) {
    return web3.eth.abi.encodeParameters(
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
        utils.keccak256(op.initCode),
        utils.keccak256(op.callData),
        op.callGasLimit,
        op.verificationGasLimit,
        op.preVerificationGas,
        op.maxFeePerGas,
        op.maxPriorityFeePerGas,
        utils.keccak256(op.paymasterAndData),
      ],
    );
  } else {
    // for the purpose of calculating gas cost encode also signature (and no keccak of bytes)
    return web3.eth.abi.encodeParameters(
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

function getRequestIdWeb3(op: any, entryPointAgr: any, chainIdAgr: any) {
  const userOpHash = Web3.utils.keccak256(packUserOpWeb3(op));

  const enc = web3.eth.abi.encodeParameters(
    ['bytes32', 'address', 'uint256'],
    [userOpHash, entryPointAgr, chainIdAgr],
  );
  return Web3.utils.keccak256(enc);
}

export function tnxIdToNonce(tnxId: any) {
  return new BigNumber(tnxId)
    .multipliedBy(new BigNumber(2).pow(64))
    .toString(10);
}

export async function signUserOpWeb3({
  op,
  privateKey,
  entryPoint,
  chainId = chainIdDefault,
}: any) {
  // Define the range
  const min = new BigNumber(100000);
  const maxPower = new BigNumber(2).pow(64);
  const max = maxPower.minus(1); // We subtract 1 to stay within the specified range

  // Generate a random value between 0 and 1
  const randomValue = new BigNumber(Math.random());
  // Scale the random value to the desired range
  const scaledValue = randomValue.times(max.minus(min)).plus(min);

  // Convert the scaled value to an integer
  const randomInteger = scaledValue.integerValue(BigNumber.ROUND_FLOOR);
  const newOp = {
    ...op,
    callGasLimit: op.callGasLimit.toString(),
    maxFeePerGas: op.maxFeePerGas.toString(),
    verificationGasLimit: utils.hexZeroPad(
      BigNum.from(op.verificationGasLimit).toHexString(),
      32,
    ),
    nonce: tnxIdToNonce(randomInteger),
  };

  const message = getRequestIdWeb3({...newOp}, entryPoint, chainId);

  const msg1 = Buffer.concat([
    Buffer.from('\x19Ethereum Signed Message:\n32', 'ascii'),
    Buffer.from(arrayify(message)),
  ]);
  const sig = ethereumjs.ecsign(
    ethereumjs.keccak256(msg1),
    Buffer.from(arrayify(privateKey)),
  );

  const signedMessage1 = ethereumjs.toRpcSig(sig.v, sig.r, sig.s);

  return {
    ...newOp,
    signature: signedMessage1,
  };
}

export const getCallDataEntryPoint = ({
  sessionUser,
  startFrom,
  validUntil,
  totalAmount,
}: any) => {
  const msgData = web3.eth.abi.encodeFunctionCall(ABI_FUNCTION.ADD_SESSION, [
    sessionUser,
    startFrom,
    validUntil,
    totalAmount,
  ]);
  return msgData;
};

export const getCallDataAddSession = ({sessionUser}: any) => {
  const msgData = web3.eth.abi.encodeFunctionCall(ABI_FUNCTION.REMOVE_SESSION, [
    sessionUser,
  ]);
  return msgData;
};
