import deployedContracts from '@/contracts/deployedContracts';
import {
  useContract,
  useNetwork,
  useSendTransaction,
  useTransactionReceipt,
} from '@starknet-react/core';
import { useMemo } from 'react';
import { ArgsOrCalldata } from 'starknet';

type WriteContract = {
  functionName: string;
  args: ArgsOrCalldata;
};

export const useNiftWriteContract = ({ functionName, args }: WriteContract) => {
  const { chain } = useNetwork();
  console.log('Current Chain:', chain);
  const deployedContract = deployedContracts[`${chain.network}`]?.Nift;
  const { contract } = useContract({
    abi: deployedContract?.abi,
    address: deployedContract?.address,
  });
  const calls = useMemo(() => {
    if (!deployedContract) {
      console.error('NIFT Contract is not deployed');
      return;
    }
    if (!chain?.id) {
      console.error('Please connect your wallet');
      return;
    }

    if (!contract) {
      console.log('Could not get contract data');
      return;
    }
    return [contract.populate(functionName, args)];
  }, [deployedContract, contract, chain?.id]);
  const { send, sendAsync, error, isPending } = useSendTransaction({
    calls,
  });
  return {
    send,
    sendAsync,
    error,
    isPending,
  };
};
