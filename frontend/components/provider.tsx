'use client';
import React from 'react';

import { sepolia, mainnet, devnet, Chain } from '@starknet-react/chains';
import { supportedChains } from '@/utils/supportedChains';
import {
  StarknetConfig,
  publicProvider,
  argent,
  braavos,
  useInjectedConnectors,
  voyager,
  jsonRpcProvider,
} from '@starknet-react/core';

export const rpc = (chain: Chain) => {
  return {
    nodeUrl: `https://starknet-${chain.network.toLowerCase()}.public.blastapi.io/rpc/v0_8`,
  };
};

export function StarknetProvider({ children }: { children: React.ReactNode }) {
  const { connectors } = useInjectedConnectors({
    // Show these connectors if the user has no connector installed.
    recommended: [argent(), braavos()],
    // Hide recommended connectors if the user has any connector installed.
    includeRecommended: 'onlyIfNoConnectors',
    // Randomize the order of the connectors.
    order: 'random',
  });

  return (
    <StarknetConfig
      chains={[sepolia]}
      provider={jsonRpcProvider({ rpc })}
      connectors={connectors}
      explorer={voyager}
    >
      {children}
    </StarknetConfig>
  );
}
