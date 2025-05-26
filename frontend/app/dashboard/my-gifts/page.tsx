'use client';
import { GiftCardGrid } from '@/components/gift-card-grid';
import { useAccount, useReadContract } from '@starknet-react/core';
import { useEffect, useState } from 'react';
import { GiftCard } from '@/types/gift-card';
import { giftCards } from '@/lib/samples';
import { useNiftReadContract } from '@/hooks/useNiftContractRead';
import { useDeployContract } from '@/hooks/useDeployContract';
import ConnectWalletNeeded from '@/components/connect-wallet-needed';
import ContractNotDeployed from '@/components/contract-not-deployed';
import { Functions } from '@/utils/functions';

export default function MyGiftsPage() {
  const { address } = useAccount();
  const [cards, setGiftCards] = useState<number[]>([]);
  const deployedContract = useDeployContract();
  if (!address) {
    return <ConnectWalletNeeded />;
  }
  if (!deployedContract) {
    return <ContractNotDeployed />;
  }
  const {
    data: giftsData,
    isLoading: isLoadingGifts,
    isError: isErrorGifts,
    error,
  } = useReadContract({
    functionName: Functions.getUserGifts,
    address: deployedContract?.address,
    abi: deployedContract?.abi,
    watch: true,
    args: [address],
  });

  useEffect(() => {
    if (Array.isArray(giftsData)) {
      setGiftCards(giftsData);
    }
  }, [giftsData]);
  useEffect(() => {
    if (isErrorGifts) {
      console.error('Error getting user gift token ids');
      console.error(error);
    }
  }, [isErrorGifts]);

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>My Gift Cards</h1>
        <p className='text-muted-foreground'>
          View and manage your NFT gift cards.
        </p>
      </div>
      <GiftCardGrid giftCards={cards} isLoading={isLoadingGifts} />
    </div>
  );
}
