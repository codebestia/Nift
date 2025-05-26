'use client';
import { Analytics } from '@/components/analytics';
import { useReadContract } from '@starknet-react/core';
import { useEffect, useState } from 'react';
import { Functions } from '@/utils/functions';
import { useAccount } from '@starknet-react/core';
import ConnectWalletNeeded from '@/components/connect-wallet-needed';
import { useDeployContract } from '@/hooks/useDeployContract';
import ContractNotDeployed from '@/components/contract-not-deployed';

export default function DashboardPage() {
  const [numberOfGiftsPurchased, setNumberOfGiftsPurchased] = useState(0);
  const [numberofPoints, setNumberOfPoints] = useState(0);
  const [numberofGiftsRedeemed, setNumberOfGiftsRedeemed] = useState(0);
  const { address } = useAccount();
  const deployedContract = useDeployContract();
  if (!address) {
    return <ConnectWalletNeeded />;
  }
  if (!deployedContract) {
    return <ContractNotDeployed />;
  }
  const {
    data: pointsData,
    isLoading: isLoadingPoints,
    isError: isErrorPoints,
  } = useReadContract({
    functionName: Functions.getUserPoints,
    address: deployedContract?.address,
    abi: deployedContract?.abi,
    watch: true,
    args: [address],
  });

  const {
    data: purchasedGifts,
    isLoading: isLoadingPurchasedData,
    isError: isPurchasedDataPoints,
  } = useReadContract({
    functionName: Functions.getUserPurchasedGifts,
    address: deployedContract?.address,
    abi: deployedContract?.abi,
    watch: true,
    args: [address],
  });
  const loadAnalyticsData = () => {};
  console.log(purchasedGifts);
  useEffect(() => {
    if (purchasedGifts) {
      console.log(purchasedGifts);
      setNumberOfGiftsPurchased(purchasedGifts?.length);
    }
    if (pointsData) {
      console.log(pointsData);
      setNumberOfPoints(pointsData);
    }
  }, [pointsData, purchasedGifts]);
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Analytics</h1>
        <p className='text-muted-foreground'>
          Overview of your gift card activity and stats.
        </p>
      </div>
      <Analytics
        numberOfGiftsPurchased={numberOfGiftsPurchased}
        numberOfGiftsRedeemed={numberofGiftsRedeemed}
        numberofPoints={numberofPoints}
      />
    </div>
  );
}
