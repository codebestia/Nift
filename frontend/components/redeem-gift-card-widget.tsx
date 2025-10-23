import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, ExternalLink, Loader2 } from 'lucide-react';
import { GiftCard } from '@/types/gift-card';
import { useDeployContract } from '@/hooks/useDeployContract';
import {
  useContract,
  useReadContract,
  useSendTransaction,
  useTransactionReceipt,
} from '@starknet-react/core';
import { Functions } from '@/utils/functions';
import CardSkeleton from './card-skeleton';
import { useTokenABI } from '@/hooks/useDeployedToken';
import { getETHPriceEquivalent, getSTRKPriceEquivalent } from '@/lib/prices';
import { formatTokenAmount } from '@/contracts/functions';
import { getCardImageById } from '@/utils/asset';

type RedeemGiftCardWidgetProps = {
  token_id: number;
  handleRedeem: (card: GiftCard | undefined) => void;
};

const RedeemGiftCardWidget = ({
  token_id,
  handleRedeem,
}: RedeemGiftCardWidgetProps) => {
  const [card, setCard] = useState<GiftCard | undefined>(undefined);
  const deployedContract = useDeployContract();
  const {
    data: giftData,
    isLoading,
    isError: isErrorGift,
    error,
  } = useReadContract({
    functionName: Functions.getGiftCardInfo,
    address: deployedContract?.address,
    abi: deployedContract?.abi,
    watch: true,
    args: [token_id],
  });
  const tokenABI = useTokenABI();
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
          key={card?.token_id}
          className='overflow-hidden bg-gradient-to-br from-purple-950 to-slate-900 border border-purple-800/30 hover:border-purple-500/50 transition-all'
        >
          <CardHeader className='p-0'>
            <div className='relative aspect-square bg-black/20'>
              <Image
                src={
                  card?.category_id
                    ? getCardImageById(Number(card.category_id))
                    : '/placeholder.svg'
                }
                alt={`${card?.token_id}`}
                fill
                className='object-cover'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4'>
                <div className='flex items-center justify-end'>
                  <a
                    href={`https://voyager.io/token/${card?.token_id ?? ''}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-xs text-white/70 hover:text-white flex items-center gap-1'
                  >
                    View on Explorer <ExternalLink className='h-3 w-3' />
                  </a>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className='p-4 space-y-3'>
            <CardTitle className='flex items-center justify-between'>
              <span>{card?.token_symbol ?? 'STRK'} Gift Card</span>
              <span className='text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full'>
                {card?.token_id}
              </span>
            </CardTitle>
            <div className='space-y-1'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-zinc-400'>Token</span>
                <span className='font-medium'>
                  {card?.token_symbol ?? 'STRK'}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-zinc-400'>Amount</span>
                <span className='font-medium'>
                  {formatTokenAmount(BigInt(card?.token_amount ?? 0))}{' '}
                  {card?.token_symbol ?? 'STRK'}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-zinc-400'>Value</span>
                <span className='text-sm text-zinc-300'>
                  $
                  {card?.token_symbol == 'ETH'
                    ? getETHPriceEquivalent(
                        Number(
                          formatTokenAmount(BigInt(card?.token_amount ?? 0))
                        )
                      )
                    : card?.token_symbol == 'STRK'
                      ? getSTRKPriceEquivalent(
                          Number(
                            formatTokenAmount(BigInt(card?.token_amount ?? 0))
                          )
                        )
                      : 0}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className='p-4 pt-0'>
            <Button
              onClick={() => handleRedeem(card)}
              className='w-full bg-purple-600 hover:bg-purple-700'
            >
              Redeem
            </Button>
          </CardFooter>
        </Card>
      )}
    </>
  );
};

export default RedeemGiftCardWidget;
