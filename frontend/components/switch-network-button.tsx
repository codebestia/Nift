'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import {
  Connector,
  useAccount,
  useConnect,
  useSwitchChain,
  useDisconnect,
} from '@starknet-react/core';

import { StarknetkitConnector, useStarknetkitConnectModal } from 'starknetkit';
import { useToast } from '@/hooks/use-toast';

const SwitchNetworkButton = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const { disconnect } = useDisconnect();
  const { toast } = useToast();

  const { connect, connectors } = useConnect();
  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: connectors as StarknetkitConnector[],
  });

  const handleChangeNetwork = async () => {
    setIsConnecting(true);
    connect();
    const { connector } = await starknetkitConnectModal();
    if (!connector) {
      return;
    }
    try {
      await connect({ connector: connector as Connector });
      setIsConnecting(false);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error connecting to wallet',
        description: 'Please try again',
        variant: 'destructive',
      });
      setIsConnecting(false);
    }
  };

  return (
    <Button
      onClick={handleChangeNetwork}
      disabled={isConnecting || isConnected}
      className='bg-purple-600 hover:bg-purple-700'
    >
      {isConnecting ? (
        <>
          <span className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent'></span>
          Connecting...
        </>
      ) : address ? (
        <>
          <Wallet className='mr-2 h-4 w-4' />
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </>
      ) : (
        <>
          <Wallet className='mr-2 h-4 w-4' />
          Connect Wallet
        </>
      )}
    </Button>
  );
};

export default SwitchNetworkButton;
