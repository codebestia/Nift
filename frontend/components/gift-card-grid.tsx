'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Share2,
  Gift,
  Info,
  ExternalLink,
  Check,
  Loader2,
  PlusCircle,
} from 'lucide-react';
import { GiftCard } from '@/types/gift-card';
import GiftCardWidget from './gift-card-widget';
import { useRouter } from 'next/navigation';
import { contractAddressToHex, truncateAddress } from '@/contracts/functions';
import { useNiftWriteContract } from '@/hooks/useNiftContractWrite';
import { useDeployContract } from '@/hooks/useDeployContract';
import { Functions } from '@/utils/functions';
import { useAccount } from '@starknet-react/core';

interface GiftCardGridProps {
  giftCards: number[];
  isLoading?: boolean;
}

export function GiftCardGrid({
  giftCards,
  isLoading = false,
}: GiftCardGridProps) {
  const router = useRouter();
  const [selectedCard, setSelectedCard] = useState<GiftCard | null>(null);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [processingDialogOpen, setProcessingDialogOpen] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const { address } = useAccount();

  const deployedContract = useDeployContract();

  const {
    writeAsync,
    isLoading: waitIsLoading,
    error: waitIsError,
  } = useNiftWriteContract({
    contractConfig: {
      abi: deployedContract?.abi,
      address: deployedContract?.address,
    },
    functionName: Functions.sendGiftCard,
    onSuccess: data => {
      setProcessingDialogOpen(false);
      setTransactionHash(data.transaction_hash);
      setCompleteDialogOpen(true);
    },
    onError: err => {
      console.error('Error sending gift card:', err);
      setProcessingDialogOpen(false);
      resetDialogs();
    },
  });

  const handleSendGift = (card: GiftCard | undefined) => {
    if (!card) return;
    setSelectedCard(card);
    setRecipientAddress('');
    setSendDialogOpen(true);
  };

  const handleSendConfirm = () => {
    if (!recipientAddress.trim()) return;
    if (!selectedCard) return;

    setSendDialogOpen(false);
    setProcessingDialogOpen(true);
    writeAsync({
      from: address,
      to: recipientAddress,
      token_id: selectedCard.token_id,
    });
  };

  const resetDialogs = () => {
    setCompleteDialogOpen(false);
    setSelectedCard(null);
    setRecipientAddress('');
  };

  // Skeleton loader for cards
  const CardSkeleton = () => (
    <Card className='overflow-hidden bg-gradient-to-br from-purple-950/50 to-slate-900/50 border border-purple-800/20'>
      <CardHeader className='p-0'>
        <div className='relative aspect-square bg-black/20'>
          <Skeleton className='h-full w-full' />
        </div>
      </CardHeader>
      <CardContent className='p-4 space-y-3'>
        <div className='flex items-center justify-between'>
          <Skeleton className='h-6 w-24' />
          <Skeleton className='h-5 w-12 rounded-full' />
        </div>
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <Skeleton className='h-4 w-16' />
            <Skeleton className='h-4 w-12' />
          </div>
          <div className='flex items-center justify-between'>
            <Skeleton className='h-4 w-16' />
            <Skeleton className='h-4 w-20' />
          </div>
          <div className='flex items-center justify-between'>
            <Skeleton className='h-4 w-16' />
            <Skeleton className='h-4 w-14' />
          </div>
        </div>
      </CardContent>
      <CardFooter className='p-4 pt-0 flex gap-2'>
        <Skeleton className='h-10 w-full' />
        <Skeleton className='h-10 w-10' />
      </CardFooter>
    </Card>
  );
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
            <GiftCardWidget
              key={tokenId}
              tokenId={tokenId}
              handleSendGift={handleSendGift}
            />
          ))}
        </div>
      )}

      {/* Send Gift Dialog */}
      {selectedCard && (
        <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
          <DialogContent className='sm:max-w-md'>
            <DialogHeader>
              <DialogTitle>Send Gift Card</DialogTitle>
              <DialogDescription>
                Enter the wallet address of the recipient to send this gift
                card.
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4 py-4'>
              <div className='flex items-center gap-4'>
                <div className='relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-purple-500/30'>
                  <Image
                    src={selectedCard.image || '/placeholder.svg'}
                    alt={selectedCard.minter}
                    fill
                    className='object-cover'
                  />
                </div>
                <div>
                  <h4 className='font-medium'>
                    {truncateAddress(contractAddressToHex(selectedCard.minter))}
                  </h4>
                  <p className='text-sm text-muted-foreground'>
                    {selectedCard.token_amount} {selectedCard.token} ($
                    {selectedCard.value})
                  </p>
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='recipient-address'>Recipient Address</Label>
                <Input
                  id='recipient-address'
                  placeholder='0x...'
                  value={recipientAddress}
                  onChange={e => setRecipientAddress(e.target.value)}
                  className='bg-background border-purple-800/50 focus-visible:ring-purple-500'
                />
              </div>
            </div>
            <DialogFooter className='flex flex-col sm:flex-row gap-2'>
              <Button
                variant='outline'
                className='border-purple-800/50'
                onClick={() => setSendDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className='bg-purple-600 hover:bg-purple-700'
                onClick={handleSendConfirm}
                disabled={!recipientAddress.trim()}
              >
                Send Gift
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
              Please wait while we process your transaction. This may take a
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
        <Dialog open={completeDialogOpen} onOpenChange={resetDialogs}>
          <DialogContent className='sm:max-w-md'>
            <DialogHeader>
              <DialogTitle className='flex items-center gap-2'>
                <Check className='h-5 w-5 text-green-500' />
                Gift Card Sent!
              </DialogTitle>
              <DialogDescription>
                Your gift card has been successfully sent to the recipient.
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4 py-4'>
              <div className='rounded-lg border border-green-500/20 bg-green-500/10 p-4'>
                <div className='flex flex-col gap-2'>
                  <div className='flex items-center justify-between'>
                    <span className='font-medium'>Recipient</span>
                    <span className='text-sm truncate max-w-[200px]'>
                      {recipientAddress}
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='font-medium'>Gift Card</span>
                    <span>
                      {selectedCard.token_amount} {selectedCard.token_id}
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='font-medium'>Transaction</span>
                    <Link
                      href={`https://sepolia.voyager.online/tx/${transactionHash}`}
                      target='_blank'
                      className='text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1'
                    >
                      View on Explorer <ExternalLink className='h-3 w-3' />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                className='bg-purple-600 hover:bg-purple-700'
                onClick={resetDialogs}
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
