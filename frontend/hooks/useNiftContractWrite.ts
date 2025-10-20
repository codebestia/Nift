'use client'

import {
  useContract,
  useSendTransaction,
  useTransactionReceipt,
} from '@starknet-react/core'

import { useCallback, useState, useMemo } from 'react'
import type { InvokeFunctionResponse, Abi } from 'starknet'

export type ContractFunctionArgs = Record<string, unknown>

export interface ContractConfig {
  address: string
  abi: Abi
}

export interface ContractWriteResult {
  writeAsync: (args?: ContractFunctionArgs) => Promise<InvokeFunctionResponse>
  data: InvokeFunctionResponse | undefined
  error: Error | null
  isLoading: boolean
  isSuccess: boolean
  reset: () => void
}

interface UseNiftWriteContractProps {
  contractConfig: ContractConfig
  functionName: string
  onSuccess?: (data: InvokeFunctionResponse) => void
  onError?: (error: Error) => void
}

/**
 * Enhanced contract write hook with transaction tracking
 */
export function useNiftWriteContract({
  contractConfig,
  functionName,
  onSuccess,
  onError,
}: UseNiftWriteContractProps): ContractWriteResult {
  const [lastTransactionHash, setLastTransactionHash] = useState<string>()

  const { contract } = useContract({
    address: contractConfig.address.startsWith('0x')
      ? (contractConfig.address as `0x${string}`)
      : (`0x${contractConfig.address}` as `0x${string}`),
    abi: contractConfig.abi,
  })

  const {
    sendAsync,
    data: transactionData,
    error: transactionError,
    isPending: isTransactionPending,
    reset: resetTransaction,
  } = useSendTransaction({
    calls: undefined,
  })

  // Track transaction receipt
  const {
    data: receiptData,
    error: receiptError,
    isLoading: isReceiptLoading,
  } = useTransactionReceipt({
    hash: lastTransactionHash,
    watch: !!lastTransactionHash,
  })

  const writeAsync = useCallback(
    async (args: ContractFunctionArgs = {}) => {
      if (!contract) {
        throw new Error('Contract not initialized')
      }

      try {
        // Convert args object to array format and ensure correct type
        const calldata = Object.values(args) as (string | number | bigint)[]

        console.log('🔍 Debug Info:')
        console.log('Contract Address:', contractConfig.address)
        console.log('Function Name:', functionName)
        console.log('Arguments:', args)
        console.log('Calldata:', calldata)

        const calls = [contract.populate(functionName, calldata)]

        console.log('📤 Sending transaction with calls:', calls)

        const result = await sendAsync(calls)
        setLastTransactionHash(result.transaction_hash)

        console.log('✅ Transaction sent:', result)

        if (onSuccess) {
          onSuccess(result)
        }

        return result
      } catch (error) {
        console.error('❌ Transaction error:', error)

        let errorMessage = 'Transaction failed'
        let isUserRejection = false

        if (error instanceof Error) {
          const msg = error.message.toLowerCase()
          const originalMessage = error.message

          console.log('Original error message:', originalMessage)

          if (
            msg.includes('user rejected') ||
            msg.includes('user denied') ||
            msg.includes('user cancelled') ||
            msg.includes('rejected by user') ||
            msg.includes('user abort')
          ) {
            errorMessage = 'Transaction was rejected by user'
            isUserRejection = true
          } else if (
            msg.includes('insufficient funds') ||
            msg.includes('insufficient balance')
          ) {
            errorMessage = 'Insufficient funds to complete transaction'
          } else if (msg.includes('network') || msg.includes('fetch')) {
            errorMessage =
              'Network error: Please check your connection and try again'
          } else if (msg.includes('nonce')) {
            errorMessage = 'Nonce error: Please try again'
          } else if (
            msg.includes('contract not found') ||
            msg.includes('class_hash_not_found')
          ) {
            errorMessage =
              'Contract not found: Please check the contract address'
          } else if (msg.includes('entry point not found')) {
            errorMessage = `Function '${functionName}' not found in contract`
          } else {
            errorMessage = `${originalMessage} (Original error preserved for debugging)`
          }
        }

        const processedError = new Error(errorMessage)
        // Add original error for debugging
        ;(processedError as any).originalError = error
        ;(processedError as any).isUserRejection = isUserRejection

        if (onError) {
          onError(processedError)
        }
        throw processedError
      }
    },
    [
      contract,
      contractConfig.address,
      functionName,
      sendAsync,
      onSuccess,
      onError,
    ],
  )

  const reset = useCallback(() => {
    resetTransaction()
    setLastTransactionHash(undefined)
  }, [resetTransaction])

  // Process errors for better user experience
  const processedError = useMemo(() => {
    const error = transactionError || receiptError
    if (!error) return null

    const errorMessage = error.message || error.toString()

    if (
      errorMessage.includes('user rejected') ||
      errorMessage.includes('user denied')
    ) {
      return new Error('Transaction was rejected by user')
    }

    if (errorMessage.includes('insufficient funds')) {
      return new Error('Insufficient funds to complete transaction')
    }

    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return new Error(
        'Network error: Please check your connection and try again',
      )
    }

    return error as Error
  }, [transactionError, receiptError])

  // Determine success state
  const isSuccess = !!(receiptData && !receiptError)
  const isLoading = isTransactionPending || isReceiptLoading

  return {
    writeAsync,
    data: transactionData,
    error: processedError,
    isLoading,
    isSuccess,
    reset,
  }
}
