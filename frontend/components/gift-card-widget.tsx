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
import { Skeleton } from '@/components/ui/skeleton';
import { Share2, Gift, Info, ExternalLink } from 'lucide-react';
import { GiftCard } from '@/types/gift-card';
import { useReadContract } from '@starknet-react/core';
import { Functions } from '@/utils/functions';
import { useDeployContract } from '@/hooks/useDeployContract';
import CardSkeleton from './card-skeleton';

type GiftCardWidgetProps = {
  tokenId: number;
  handleSendGift: (card: GiftCard | undefined) => void;
};

const GiftCardWidget = ({ tokenId, handleSendGift }: GiftCardWidgetProps) => {
  const [card, setCard] = useState<GiftCard | undefined>(undefined);
  const deployedContract = useDeployContract();
  const {
    data: giftData,
    isLoading,
    isError: isErrorGift,
    error,
  } = useReadContract({
    functionName: Functions.getGiftInfo,
    address: deployedContract?.address,
    abi: deployedContract?.abi,
    watch: true,
    args: [tokenId],
  });
  useEffect(() => {
    if (giftData) {
      setCard(giftData);
    }
  }, [giftData]);
  useEffect(() => {
    if (isErrorGift) {
      console.error('Error getting gift info');
      console.error(error);
    }
  }, [isErrorGift]);

  return (
    <>
      {isLoading ? (
        <CardSkeleton />
      ) : (
        <Card
          key={card?.id}
          className='overflow-hidden bg-gradient-to-br from-purple-950 to-slate-900 border border-purple-800/30 hover:border-purple-500/50 transition-all'
        >
          <CardHeader className='p-0'>
            <div className='relative aspect-square bg-black/20'>
              <Image
                src={card?.image || '/placeholder.svg'}
                alt={`${card?.name}`}
                fill
                className='object-cover'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4'>
                <div className='flex items-center justify-between'>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant='outline'
                          size='icon'
                          className='h-8 w-8 rounded-full bg-black/50 border-white/20 backdrop-blur-sm hover:bg-purple-800/50'
                        >
                          <Share2 className='h-4 w-4' />
                          <span className='sr-only'>Share</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Share Gift Card</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Link
                    href={`https://voyager.io/token/${card?.token_id}`}
                    target='_blank'
                    className='text-xs text-white/70 hover:text-white flex items-center gap-1'
                  >
                    View on Explorer <ExternalLink className='h-3 w-3' />
                  </Link>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className='p-4 space-y-3'>
            <CardTitle className='flex items-center justify-between'>
              <span>{card?.name}</span>
              <span className='text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full'>
                {card?.token_id}
              </span>
            </CardTitle>
            <div className='space-y-1'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-zinc-400'>Token</span>
                <span className='font-medium'>{card?.token}</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-zinc-400'>Amount</span>
                <span className='font-medium'>
                  {card?.amount} {card?.token}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-zinc-400'>Value</span>
                <span className='text-sm text-zinc-300'>
                  ${card?.value.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className='p-4 pt-0 flex gap-2'>
            <Button
              className='w-full bg-purple-600 hover:bg-purple-700'
              onClick={() => handleSendGift(card)}
            >
              <Gift className='mr-2 h-4 w-4' />
              Send Gift
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='outline'
                    size='icon'
                    className='h-10 w-10 border-purple-800/50'
                  >
                    <Info className='h-4 w-4' />
                    <span className='sr-only'>More Info</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View Gift Card Details</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardFooter>
        </Card>
      )}
    </>
  );
};

export default GiftCardWidget;
