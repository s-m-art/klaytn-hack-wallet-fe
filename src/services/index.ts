import {RELAYER_URL, ENV_ENTRY_POINT_ADDRESS} from '@env';
import axios from 'axios';
// Convert the JSON data to a string

// Define the headers for the POST request

interface Params {
  callData: string;
  callGasLimit: string;
  initCode: string;
  maxFeePerGas: string | number;
  maxPriorityFeePerGas: string | number;
  nonce: string;
  paymasterAndData: string;
  preVerificationGas: string | number;
  sender: string;
  signature: string;
  verificationGasLimit: string;
}

// Send the POST request using the fetch function
export const requestToRelayer = async (params: Params) => {
  const jsonData = {
    jsonrpc: '2.0',
    id: 1,
    method: 'eth_sendUserOperation',
    params: [params, ENV_ENTRY_POINT_ADDRESS],
  };
  //   const jsonString = JSON.stringify(jsonData);
  try {
    console.log('hihi');

    console.log(RELAYER_URL, 'RELAYER_URL');
    console.log(jsonData, 'jsonData');

    const res = await axios.post(
      'https://10db-118-70-67-134.ngrok.io',
      jsonData,
    );

    return res.data;
  } catch (error) {
    return {
      error,
    };
  }
};
