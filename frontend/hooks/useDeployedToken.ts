import tokenAbi from '@/contracts/tokenAbi';
import { useNetwork } from '@starknet-react/core';

export const useTokenABI = () => {
  const { chain } = useNetwork();
  return tokenAbi[`${chain.network}`]?.MockToken?.abi;
};
