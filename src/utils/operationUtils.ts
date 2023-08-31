import {defaultAbiCoder, hexConcat, keccak256} from 'ethers/lib/utils';
import {UserOperation} from '../constants/UserOperation';
import {ethers} from 'ethers';
import {getCallData} from './UserOp';
import {ABI_FUNCTION} from '../abi/index';

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
const panicCodes: {[key: number]: string} = {
  // from https://docs.soliditylang.org/en/v0.8.0/control-structures.html
  0x01: 'assert(false)',
  0x11: 'arithmetic overflow/underflow',
  0x12: 'divide by zero',
  0x21: 'invalid enum value',
  0x22: 'storage byte array that is incorrectly encoded',
  0x31: '.pop() on an empty array.',
  0x32: 'array sout-of-bounds or negative index',
  0x41: 'memory overflow',
  0x51: 'zero-initialized variable of internal function type',
};

export function decodeRevertReason(
  data: string,
  nullIfNoMatch = true,
): string | null {
  const methodSig = data.slice(0, 10);
  const dataParams = '0x' + data.slice(10);

  if (methodSig === '0x08c379a0') {
    const [err] = ethers.utils.defaultAbiCoder.decode(['string'], dataParams);
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return `Error(${err})`;
  } else if (methodSig === '0x00fa072b') {
    const [opindex, paymaster, msg] = ethers.utils.defaultAbiCoder.decode(
      ['uint256', 'address', 'string'],
      dataParams,
    );
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return `FailedOp(${opindex}, ${
      paymaster !== AddressZero ? paymaster : 'none'
    }, ${msg})`;
  } else if (methodSig === '0x4e487b71') {
    const [code] = ethers.utils.defaultAbiCoder.decode(['uint256'], dataParams);
    return `Panic(${panicCodes[code] ?? code} + ')`;
  }
  if (!nullIfNoMatch) {
    return data;
  }
  return null;
}

export function rethrow(): (e: Error) => void {
  const callerStack = new Error()
    .stack!.replace(/Error.*\n.*at.*\n/, '')
    .replace(/.*at.* \(internal[\s\S]*/, '');

  if (arguments[0] != null) {
    throw new Error('must use .catch(rethrow()), and NOT .catch(rethrow)');
  }
  return function (e: Error) {
    const solstack = e.stack!.match(/((?:.* at .*\.sol.*\n)+)/);
    const stack = (solstack != null ? solstack[1] : '') + callerStack;
    // const regex = new RegExp('error=.*"data":"(.*?)"').compile()
    const found = /error=.*?"data":"(.*?)"/.exec(e.message);
    let message: string;
    if (found != null) {
      const data = found[1];
      message =
        decodeRevertReason(data) ?? e.message + ' - ' + data.slice(0, 100);
    } else {
      message = e.message;
    }
    const err = new Error(message);
    err.stack = 'Error: ' + message + '\n' + stack;
    throw err;
  };
}
export const AddressZero = ethers.constants.AddressZero;
export function callDataCost(data: string): number {
  return ethers.utils
    .arrayify(data)
    .map(x => (x === 0 ? 4 : 16))
    .reduce((sum, x) => sum + x);
}
// helper function to create the initCode to deploy the account, using our account factory.
export function getAccountInitCode(
  owner: string,
  factoryAddress: any,
  salt = '0',
): any {
  return hexConcat([
    factoryAddress,
    getCallData({abiFunction: ABI_FUNCTION.CREATE_ACC, value: [owner, salt]}),
    // factory.interface.encodeFunctionData('createAccount', [owner, salt]),
  ]);
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
export const version = 'bytes/5.7.0';
