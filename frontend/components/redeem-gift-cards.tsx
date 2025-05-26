'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, ExternalLink, Gift, Loader2, PlusCircle } from 'lucide-react';
import CardSkeleton from './card-skeleton';
import RedeemGiftCardWidget from './redeem-gift-card-widget';
import {
  useAccount,
  useContract,
  useReadContract,
  useSendTransaction,
  useTransactionReceipt,
} from '@starknet-react/core';
import { useDeployContract } from '@/hooks/useDeployContract';
import ConnectWalletNeeded from './connect-wallet-needed';
import ContractNotDeployed from './contract-not-deployed';
import { Functions } from '@/utils/functions';
import { GiftCard } from '@/types/gift-card';
import { useRouter } from 'next/navigation';

export function RedeemGiftCards() {
  const router = useRouter();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [processingDialogOpen, setProcessingDialogOpen] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<GiftCard | null>(null);
  const { address } = useAccount();
  const [giftCards, setGiftCards] = useState<number[]>([]);
  const deployedContract = useDeployContract();
  if (!address) {
    return <ConnectWalletNeeded />;
  }
  if (!deployedContract) {
    return <ContractNotDeployed />;
  }
  const {
    data: giftsData,
    isLoading,
    isError: isErrorGifts,
    error,
  } = useReadContract({
    functionName: Functions.getUserGifts,
    address: deployedContract?.address,
    abi: deployedContract?.abi,
    watch: true,
    args: [address],
  });
  const { contract } = useContract({
    abi: deployedContract?.abi,
    address: deployedContract?.address,
  });
  const calls = useCallback(() => {
    if (!contract) {
      console.error('Could not get contract data');
      return;
    }
    return [contract.populate(Functions.redeemGiftCard, [])];
  }, [deployedContract, contract, selectedCard]);
  const {
    send,
    sendAsync,
    data,
    error: sendError,
    isPending,
  } = useSendTransaction({
    calls: calls(),
  });
  const {
    data: waitData,
    status: waitStatus,
    error: waitError,
    isLoading: waitIsLoading,
    isError: waitIsError,
  } = useTransactionReceipt({
    watch: true,
    hash: data?.transaction_hash,
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

  const handleRedeem = (card: GiftCard | undefined) => {
    if (!card) return;
    setSelectedCard(card);
    setConfirmDialogOpen(true);
  };

  const handleConfirmRedeem = async () => {
    if (!contract) {
      console.error('Could not get contract data');
      return;
    }
    setConfirmDialogOpen(false);
    setProcessingDialogOpen(true);

    await sendAsync([
      contract.populate(Functions.redeemGiftCard, [selectedCard?.token_id]),
    ]);

    setProcessingDialogOpen(false);
    setCompleteDialogOpen(true);
  };

  return (
    <>
      {isLoading ? (
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <CardSkeleton key={index} />
            ))}
        </div>
      ) : giftCards.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-12 text-center'>
          <div className='rounded-full bg-purple-900/20 p-4 mb-4'>
            <Gift className='h-8 w-8 text-purple-400' />
          </div>
          <h3 className='text-xl font-medium mb-2'>No Gift Cards Found</h3>
          <p className='text-muted-foreground max-w-md mb-6'>
            You don't have any gift cards yet. Purchase your first gift card to
            get started.
          </p>
          <Button
            className='bg-purple-600 hover:bg-purple-700'
            onClick={() => router.push('/dashboard/purchase')}
          >
            <PlusCircle className='mr-2 h-4 w-4' />
            Purchase a Gift Card
          </Button>
        </div>
      ) : (
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {giftCards.map(tokenId => (
            <RedeemGiftCardWidget
              tokenId={tokenId}
              handleRedeem={handleRedeem}
            />
          ))}
        </div>
      )}

      {/* Confirmation Dialog */}
      {selectedCard && (
        <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
          <DialogContent className='sm:max-w-md'>
            <DialogHeader>
              <DialogTitle>Redeem Gift Card</DialogTitle>
              <DialogDescription>
                Are you sure you want to redeem this gift card? The token will
                be sent to your connected wallet.
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4'>
              <div className='mx-auto max-w-[280px]'>
                <div className='overflow-hidden rounded-lg border border-purple-500/50 bg-gradient-to-br from-purple-950 to-slate-900 shadow-lg'>
                  <div className='relative aspect-[4/3] bg-black/20'>
                    <Image
                      src={selectedCard.image || '/placeholder.svg'}
                      alt={selectedCard.name}
                      fill
                      className='object-cover'
                    />
                  </div>
                  <div className='p-4 space-y-2'>
                    <div className='flex items-center justify-between'>
                      <span className='font-medium'>
                        {selectedCard.token} Gift Card
                      </span>
                      <span className='text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full'>
                        {selectedCard.token_id}
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-zinc-400'>Amount</span>
                      <span className='font-medium'>
                        {selectedCard.amount} {selectedCard.token}
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-zinc-400'>Value</span>
                      <span className='text-sm text-zinc-300'>
                        ${selectedCard.value.toLocaleString()} USD
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className='flex flex-col sm:flex-row gap-2'>
              <Button
                variant='outline'
                className='border-purple-800/50'
                onClick={() => setConfirmDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className='bg-purple-600 hover:bg-purple-700'
                onClick={handleConfirmRedeem}
              >
                Redeem
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Processing Dialog */}
      <Dialog
        open={processingDialogOpen}
        onOpenChange={setProcessingDialogOpen}
      >
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Processing Transaction</DialogTitle>
            <DialogDescription>
              Please wait while we process your redemption. This may take a
              moment.
            </DialogDescription>
          </DialogHeader>
          <div className='flex justify-center py-8'>
            <Loader2 className='h-12 w-12 animate-spin text-purple-500' />
          </div>
          <DialogFooter>
            <p className='text-xs text-muted-foreground'>
              Do not close this window during processing.
            </p>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Dialog */}
      {selectedCard && (
        <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
          <DialogContent className='sm:max-w-md'>
            <DialogHeader>
              <DialogTitle className='flex items-center gap-2'>
                <Check className='h-5 w-5 text-green-500' />
                Gift Card Redeemed!
              </DialogTitle>
              <DialogDescription>
                Your token has been sent to your wallet successfully.
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4'>
              <div className='rounded-lg border border-green-500/20 bg-green-500/10 p-4'>
                <div className='flex flex-col gap-2'>
                  <div className='flex items-center justify-between'>
                    <span className='font-medium'>Token</span>
                    <span>{selectedCard.token}</span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='font-medium'>Amount</span>
                    <span>
                      {selectedCard.amount} {selectedCard.token}
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='font-medium'>Value</span>
                    <span>
                      ${selectedCard?.value?.toLocaleString() ?? 0} USD
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                className='bg-purple-600 hover:bg-purple-700'
                onClick={() => setCompleteDialogOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
