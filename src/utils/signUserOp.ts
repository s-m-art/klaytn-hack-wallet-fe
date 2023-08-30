import {arrayify} from '@ethersproject/bytes';
import web3 from 'web3';
import abiCoder from 'web3-eth-abi';
import * as ethereumjs from 'ethereumjs-util';
import BigNumber from 'bignumber.js';

const chainIdDefault = 1001;

function encodeWeb3(typevalues: any, forSignature: any) {
  const types = typevalues.map((typevalue: any) =>
    typevalue.type === 'bytes' && forSignature ? 'bytes32' : typevalue.type,
  );
  const values = typevalues.map((typevalue: any) =>
    typevalue.type === 'bytes' && forSignature
      ? web3.utils.keccak256(typevalue.val)
      : typevalue.val,
  );
  console.log('///////////////////////', abiCoder, '///////////////////');

  return abiCoder.encodeParameters(types, values);
}

function packUserOpWeb3(op: any, forSignature = true) {
  if (forSignature) {
    // lighter signature scheme (must match UserOperation#pack): do encode a zero-length signature, but strip afterwards the appended zero-length value
    const userOpType = {
      components: [
        {type: 'address', name: 'sender'},
        {type: 'uint256', name: 'nonce'},
        {type: 'bytes', name: 'initCode'},
        {type: 'bytes', name: 'callData'},
        {type: 'uint256', name: 'callGasLimit'},
        {type: 'uint256', name: 'verificationGasLimit'},
        {type: 'uint256', name: 'preVerificationGas'},
        {type: 'uint256', name: 'maxFeePerGas'},
        {type: 'uint256', name: 'maxPriorityFeePerGas'},
        {type: 'bytes', name: 'paymasterAndData'},
        {type: 'bytes', name: 'signature'},
      ],
      name: 'userOp',
      type: 'tuple',
    };
    console.log(abiCoder, 'abiCoder');

    let encoded = abiCoder.encodeParameters(
      [userOpType],
      [{...op, signature: '0x'}],
    );
    // remove leading word (total length) and trailing word (zero-length signature)
    encoded = `0x${encoded.slice(66, encoded.length - 64)}`;
    return encoded;
  }
  const typevalues = [
    {type: 'address', val: op.sender},
    {type: 'uint256', val: op.nonce},
    {type: 'bytes', val: op.initCode},
    {type: 'bytes', val: op.callData},
    {type: 'uint256', val: op.callGasLimit},
    {type: 'uint256', val: op.verificationGasLimit},
    {type: 'uint256', val: op.preVerificationGas},
    {type: 'uint256', val: op.maxFeePerGas},
    {type: 'uint256', val: op.maxPriorityFeePerGas},
    {type: 'bytes', val: op.paymasterAndData},
  ];
  if (!forSignature) {
    // for the purpose of calculating gas cost, also hash signature
    typevalues.push({type: 'bytes', val: op.signature});
  }
  return encodeWeb3(typevalues, forSignature);
}

function getRequestIdWeb3(op: any, entryPointAgr: any, chainIdAgr: any) {
  console.log('00000000000000000000000000000000000');

  const userOpHash = web3.utils.keccak256(packUserOpWeb3(op, true));

  const enc = abiCoder.encodeParameters(
    ['bytes32', 'address', 'uint256'],
    [userOpHash, entryPointAgr, chainIdAgr],
  );
  return web3.utils.keccak256(enc);
}

export function tnxIdToNonce(tnxId: any) {
  return new BigNumber(tnxId)
    .multipliedBy(new BigNumber(2).pow(64))
    .toString(10);
}

export function signUserOpWeb3({
  op,
  privateKey,
  entryPoint,
  chainId = chainIdDefault,
}: any) {
  console.log('11111111111111111111111111111111111111111111111');

  const newOp = {...op, nonce: tnxIdToNonce(op.nonce)};
  const message = getRequestIdWeb3(newOp, entryPoint, chainId);

  const msg1 = Buffer.concat([
    Buffer.from('\x19Ethereum Signed Message:\n32', 'ascii'),
    Buffer.from(arrayify(message)),
  ]);
  const sig = ethereumjs.ecsign(
    ethereumjs.keccak256(msg1),
    Buffer.from(arrayify(privateKey)),
  );

  // that's equivalent of:  await signer.signMessage(message);
  // (but without "async"
  const signedMessage1 = ethereumjs.toRpcSig(sig.v, sig.r, sig.s);
  return {
    ...newOp,
    signature: signedMessage1,
  };
}
