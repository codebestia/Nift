'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Image from 'next/image';
import { Check, Loader2 } from 'lucide-react';
import tokenAddresses from '@/contracts/tokenAddresses';
import { getETHPriceEquivalent, getSTRKPriceEquivalent } from '@/lib/prices';
import { useDeployContract } from '@/hooks/useDeployContract';
import {
  useContract,
  useSendTransaction,
  useTransactionReceipt,
} from '@starknet-react/core';
import { Functions } from '@/utils/functions';
import { useToast } from '@/hooks/use-toast';

type GiftResultType = {
  id: number;
  minter: string;
  token_contract: string;
  token_amount: number;
  status: {
    variant: string;
  };
};

const formSchema = z.object({
  token: z.string({
    required_error: 'Please select a token.',
  }),
  amount: z.string().min(1, {
    message: 'Please enter an amount.',
  }),
});

export function PurchaseForm() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [currentToken, setCurrentToken] = useState('0x0');
  const [currentAmount, setCurrentAmount] = useState(0);
  const [usdValue, setUsdValue] = useState(0);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      token: '',
      amount: '',
    },
  });
  const deployedContract = useDeployContract();
  const { contract } = useContract({
    abi: deployedContract?.abi,
    address: deployedContract?.address,
  });
  const calls = useCallback(() => {
    if (!contract) {
      console.log('Could not get contract data');
      return;
    }
    return [
      contract.populate(Functions.purchaseGiftCard, [
        currentToken,
        currentAmount,
      ]),
    ];
  }, [deployedContract, contract, currentAmount, currentToken]);
  const { send, sendAsync, data, error, isPending } = useSendTransaction({
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
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setCurrentToken(values.token);
    setCurrentAmount(Number(values.amount));
    setIsProcessing(true);
    let result = await sendAsync(calls()); // send data to smart contracf
    setIsProcessing(false);
    setIsPurchased(true);
  }

  function handleClose() {
    setIsPurchased(false);
    form.reset();
  }

  const fetchUsdValue = async (token: string, amount: string) => {
    let value = 0;
    if (token == tokenAddresses.ETH) {
      value = await getETHPriceEquivalent(Number(amount));
    } else if (token == tokenAddresses.STRK) {
      value = await getSTRKPriceEquivalent(Number(amount));
    }
    setUsdValue(value);
  };
  useEffect(() => {
    if ((form.watch('token'), form.watch('amount'))) {
      fetchUsdValue(form.watch('token'), form.watch('amount'));
    }
  }, [form.watch('token'), form.watch('amount')]);
  useEffect(() => {
    if (error) {
      toast({
        title: 'Smart contract error',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  }, [error]);
  useEffect(() => {
    if (waitStatus == 'error') {
      toast({
        title: 'Transaction Error',
        description: 'Error',
        variant: 'destructive',
      });
    }
  }, [waitStatus]);
  useEffect(() => {
    setIsProcessing(isPending);
  }, [isPending]);
  return (
    <>
      <Card className='border border-purple-800/30 bg-card'>
        <CardHeader>
          <CardTitle>Create a New Gift Card</CardTitle>
          <CardDescription>
            Choose a token and amount to purchase a new NFT gift card.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='token'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Token</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='bg-background border-purple-800/50 focus:ring-purple-500'>
                          <SelectValue placeholder='Select a token' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7'>
                          Ethereum (ETH)
                        </SelectItem>
                        <SelectItem value='0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d'>
                          Starknet (STRK)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      This token will be locked in the gift card NFT.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='amount'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter amount'
                        type='number'
                        step='0.001'
                        className='bg-background border-purple-800/50 focus-visible:ring-purple-500'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {`Approximately $${usdValue} USD`}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type='submit'
                className='w-full bg-purple-600 hover:bg-purple-700'
              >
                Purchase Gift Card
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Processing Transaction Dialog */}
      <Dialog open={isProcessing} onOpenChange={setIsProcessing}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Processing Transaction</DialogTitle>
            <DialogDescription>
              {waitIsLoading
                ? 'Waiting for confimration'
                : waitIsError
                  ? 'Transaction rejected'
                  : waitStatus == 'error'
                    ? 'Transaction rejected'
                    : waitStatus == 'success'
                      ? 'Transaction successful'
                      : 'Please wait while we process your transaction. This may take a moment.'}
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

      {/* Purchase Complete Dialog */}
      <Dialog open={isPurchased} onOpenChange={handleClose}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <Check className='h-5 w-5 text-green-500' />
              Gift Card Purchased!
            </DialogTitle>
            <DialogDescription>
              Your gift card NFT has been minted and added to your wallet.
            </DialogDescription>
          </DialogHeader>
          <div className='mx-auto max-w-[280px]'>
            <div className='overflow-hidden rounded-lg border border-purple-500/50 bg-gradient-to-br from-purple-950 to-slate-900 shadow-lg'>
              <div className='relative aspect-square bg-black/20'>
                <Image
                  src='/placeholder.svg?height=300&width=300'
                  alt='Gift Card NFT'
                  fill
                  className='object-cover'
                />
              </div>
              <div className='p-4 space-y-2'>
                <div className='flex items-center justify-between'>
                  <span className='font-medium'>{currentToken} Gift Card</span>
                  <span className='text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full'>
                    #1234
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-zinc-400'>Amount</span>
                  <span className='font-medium'>
                    {currentAmount} {currentToken}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-zinc-400'>Value</span>
                  <span className='text-sm text-zinc-300'>${usdValue}</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className='flex flex-col sm:flex-row gap-2'>
            <Button
              variant='outline'
              className='border-purple-800/50'
              onClick={handleClose}
            >
              Close
            </Button>
            <Button
              className='bg-purple-600 hover:bg-purple-700'
              onClick={handleClose}
            >
              View My Gifts
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
