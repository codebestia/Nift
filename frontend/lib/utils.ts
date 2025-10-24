import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const symbols: Record<string, string> = {
  '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7': 'ETH',
  '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d': 'STRK',
  '0x053b40A647CEDfca6cA84f542A0fe36736031905A9639a7f19A3C1e66bFd5080': 'USDC',
};

export function contractAddressToHex(
  addressValue: string | bigint | number
): `0x${string}` {
  if (!addressValue) return '0x0' as `0x${string}`;

  let bigIntValue: bigint;

  // Handle different input types
  if (typeof addressValue === 'bigint') {
    bigIntValue = addressValue;
  } else if (typeof addressValue === 'number') {
    bigIntValue = BigInt(addressValue);
  } else {
    // This handles the case where it is already a string
    // If it's already a hex string, return as is (with proper formatting)
    if (addressValue.startsWith('0x')) {
      return addressValue.toLowerCase().padStart(66, '0') as `0x${string}`; // Ensure 64 chars after 0x
    }
    // If it's a decimal string, convert to BigInt
    bigIntValue = BigInt(addressValue);
  }

  // Convert to hex string
  const hexString = bigIntValue.toString(16);

  // Pad to 64 characters (32 bytes) and add 0x prefix
  const paddedHex = '0x' + hexString.padStart(64, '0');

  return paddedHex as `0x${string}`;
}

export function getSymbolFromAddress(
  address: string | bigint | number | undefined
): string {
  if (!address) return 'UNKNOWN';
  if (typeof address === 'bigint' || typeof address === 'number') {
    address = contractAddressToHex(address);
  }
  if (address.length == 0) return 'UNKNOWN';
  // format address to hex
  const symbol = symbols[address];
  return symbol ? symbol : 'UNKNOWN'; // TODO: make a smart contract call to get symbol if not found in the map
}
