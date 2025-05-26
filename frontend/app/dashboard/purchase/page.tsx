'use client';
import { PurchaseForm } from '@/components/purchase-form';
import {
  useAccount,
  useContract,
  useSendTransaction,
} from '@starknet-react/core';
import { useDeployContract } from '@/hooks/useDeployContract';
import ConnectWalletNeeded from '@/components/connect-wallet-needed';
import ContractNotDeployed from '@/components/contract-not-deployed';
import { useMemo } from 'react';
import { Functions } from '@/utils/functions';

export default function PurchasePage() {
  const { address } = useAccount();
  const deployedContract = useDeployContract();
  if (!address) {
    return <ConnectWalletNeeded />;
  }
  if (!deployedContract) {
    return <ContractNotDeployed />;
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>
          Purchase a Gift Card
        </h1>
        <p className='text-muted-foreground'>
          Create a new NFT gift card with your chosen cryptocurrency.
        </p>
      </div>
      <div className='grid gap-6 md:grid-cols-2'>
        <div>
          <PurchaseForm />
        </div>
        <div className='hidden md:block'>
          <div className='rounded-lg border bg-card p-6 shadow'>
            <h3 className='mb-4 text-lg font-medium'>Why Choose CryptoGift?</h3>
            <ul className='space-y-2'>
              <li className='flex items-center gap-2'>
                <div className='h-2 w-2 rounded-full bg-purple-500'></div>
                <span>Instant Delivery</span>
              </li>
              <li className='flex items-center gap-2'>
                <div className='h-2 w-2 rounded-full bg-purple-500'></div>
                <span>Secure Blockchain Storage</span>
              </li>
              <li className='flex items-center gap-2'>
                <div className='h-2 w-2 rounded-full bg-purple-500'></div>
                <span>Easy to Share & Redeem</span>
              </li>
              <li className='flex items-center gap-2'>
                <div className='h-2 w-2 rounded-full bg-purple-500'></div>
                <span>Multiple Cryptocurrencies</span>
              </li>
              <li className='flex items-center gap-2'>
                <div className='h-2 w-2 rounded-full bg-purple-500'></div>
                <span>Earn Points on Every Purchase</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
