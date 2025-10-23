import { Abi, Contract, RpcProvider } from 'starknet'

export async function readContractFunction({
  functionName,
  contractAddress,
  abi,
  args = [],
}: {
  functionName: string
  contractAddress: `0x${string}`
  abi: Abi
  args?: (string | number | bigint)[] | undefined
}): Promise<unknown> {
  if (!abi) {
    throw new Error('No ABI found for the contract.')
  }

  // Instantiate contract
  const provider = new RpcProvider({ nodeUrl: 'https://starknet-sepolia.public.blastapi.io/rpc/v0_8' })
  const contract = new Contract(abi, contractAddress, provider)

  // Dynamically call the function
  if (typeof contract[functionName] !== 'function') {
    throw new Error(
      `Function '${functionName}' does not exist on the contract.`,
    )
  }
  try{
    console.log(`Calling ${functionName} with args:`, args);
    const result = await contract.call(functionName, args)
    return result;
  }catch(err){
    console.log('Error calling contract function:', err)
    throw err
  }
}

export function truncateAddress(address: string): string {
    return `${address?.slice(0, 6)}...${address?.slice(-4)}`;
}

export function contractAddressToHex(
  addressValue: string | bigint | number,
): `0x${string}` {
  if (!addressValue) return '0x0' as `0x${string}`

  let bigIntValue: bigint

  // Handle different input types
  if (typeof addressValue === 'bigint') {
    bigIntValue = addressValue
  } else if (typeof addressValue === 'number') {
    bigIntValue = BigInt(addressValue)
  } else {
    // This handles the case where it is already a string
    // If it's already a hex string, return as is (with proper formatting)
    if (addressValue.startsWith('0x')) {
      return addressValue.toLowerCase().padStart(66, '0') as `0x${string}` // Ensure 64 chars after 0x
    }
    // If it's a decimal string, convert to BigInt
    bigIntValue = BigInt(addressValue)
  }

  // Convert to hex string
  const hexString = bigIntValue.toString(16)

  // Pad to 64 characters (32 bytes) and add 0x prefix
  const paddedHex = '0x' + hexString.padStart(64, '0')

  return paddedHex as `0x${string}`
}

export function formatTokenAmount(
  amount: bigint,
  decimals: number = 18,
): string {
  // Convert from wei to readable format (assuming 18 decimals)
  const divisor = BigInt(10 ** decimals)
  const whole = amount / divisor
  const decimal = amount % divisor

  if (decimal === BigInt(0)) {
    return whole.toString()
  }

  // Show up to 6 decimal places
  const decimalStr = decimal.toString().padStart(18, '0')
  const trimmedDecimal = decimalStr.slice(0, 6).replace(/0+$/, '')

  return trimmedDecimal ? `${whole}.${trimmedDecimal}` : whole.toString()
}