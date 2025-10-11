import { useCallback, useMemo } from 'react';
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

export interface ContractReadResult<T = unknown> {
  data: T | undefined
  error: Error | null
  isLoading: boolean
  refetch: () => void
}

type chains = 'devnet' | 'sepolia' | 'mainnet';

export const useNiftReadContract = <T = any>({
  functionName,
  args,
  ...readConfig
}: ReadContract): ContractReadResult<T> => {
  const deployedContract = deployedContracts.sepolia.Nift;
  const { data, error, isLoading, refetch } = useReadContract({
    functionName,
    address: deployedContract.address,
    abi: deployedContract.abi,
    watch: true,
    args: args || [],
    enabled:
      args && (!Array.isArray(args) || !args.some(arg => arg === undefined)),
    blockIdentifier: 'pending' as BlockNumber,
    ...(readConfig as any),
  });

  // Enhanced refetch with error handling
  const enhancedRefetch = useCallback(async () => {
    try {
      await refetch()
    } catch (error) {
      console.error(`Error refetching ${functionName}:`, error)
    }
  }, [refetch, functionName])

  // Process error to provide more helpful messages
  const processedError = useMemo(() => {
    if (!error) return null

    const errorMessage = error.message || error.toString()

    if (
      errorMessage.includes('NetworkError') ||
      errorMessage.includes('fetch')
    ) {
      return new Error(
        'Network error: Unable to connect to StarkNet. Please check your internet connection and try again.',
      )
    }

    if (
      errorMessage.includes('Contract not found') ||
      errorMessage.includes('CLASS_HASH_NOT_FOUND')
    ) {
      return new Error(
        'Contract not found: The contract address may be invalid or not deployed on this network.',
      )
    }

    if (
      errorMessage.includes('Entry point') ||
      errorMessage.includes('ENTRY_POINT_NOT_FOUND')
    ) {
      return new Error(
        `Function '${functionName}' not found in contract. Please check the function name.`,
      )
    }

    return error as Error
  }, [error, functionName])

  return {
    data: data as T,
    error: processedError,
    isLoading,
    refetch: enhancedRefetch,
  }
};
