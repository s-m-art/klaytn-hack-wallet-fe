import BigNumber from 'bignumber.js';

const useNumbers = () => {
  // Define the range
  const min = new BigNumber(10000000);
  const max = new BigNumber(99999999999999);

  // Generate a random value between 0 and 1
  const randomValue = Math.random();

  // Scale the random value to the desired range
  const scaledValue = min.plus(max.minus(min).times(randomValue));

  // Convert the scaled value to a BigNumber
  const randomBigNumber = scaledValue
    .integerValue(BigNumber.ROUND_FLOOR)
    .toString();

  return {randomBigNumber};
};

export default useNumbers;
