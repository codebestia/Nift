import {
  Abi,
  useAccount,
  useNetwork,
  useReadContract,
} from '@starknet-react/core';
import { BlockNumber } from 'starknet';
import deployedContracts from '@/contracts/deployedContracts';
import { supportedChains } from '@/utils/supportedChains';
import { ArgsOrCalldata } from 'starknet';

type ReadContract = {
  functionName: string;
  args: ArgsOrCalldata;
};

type chains = 'devnet' | 'sepolia' | 'mainnet';

export const useNiftReadContract = ({
  functionName,
  args,
  ...readConfig
}: ReadContract) => {
  const { chain } = useNetwork();
  const deployedContract = deployedContracts[`${chain.network}`]?.Nift;
  return useReadContract({
    functionName,
    address: deployedContract?.address,
    abi: deployedContract?.abi,
    watch: true,
    args: args || [],
    enabled:
      args && (!Array.isArray(args) || !args.some(arg => arg === undefined)),
    blockIdentifier: 'pending' as BlockNumber,
    ...(readConfig as any),
  });
};
