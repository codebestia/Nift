import deployedContracts from '@/contracts/deployedContracts';
import { useNetwork } from '@starknet-react/core';

export const useDeployContract = () => {
  const { chain } = useNetwork();
  return deployedContracts[`${chain.network}`]?.Nift;
};
