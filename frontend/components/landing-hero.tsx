import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ConnectWalletButton } from '@/components/connect-wallet-button';

export function LandingHero() {
  return (
    <section className='relative overflow-hidden py-20 md:py-32'>
      <div className='container relative z-10'>
        <div className='grid gap-8 md:grid-cols-2 items-center'>
          <div className='space-y-6'>
            <h1 className='text-4xl md:text-6xl font-bold leading-tight tracking-tight bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent'>
              Web3 Gift Cards Reimagined
            </h1>
            <p className='text-lg md:text-xl text-zinc-300 max-w-lg'>
              Purchase, send, and redeem cryptocurrency gift cards as NFTs. The
              future of gifting is here, secured by blockchain.
            </p>
            <div className='flex flex-col sm:flex-row gap-4'>
              <ConnectWalletButton />
              <Button
                variant='outline'
                className='border-purple-600 text-purple-400 hover:bg-purple-900/20'
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className='relative aspect-square max-w-md mx-auto'>
            <div className='absolute inset-0 rounded-full bg-purple-600/20 blur-3xl'></div>
            <div className='relative z-10 scale-90'>
              <Image
                src='/placeholder.svg?height=400&width=400'
                alt='Gift Card NFT'
                width={400}
                height={400}
                className='drop-shadow-2xl'
              />
            </div>
          </div>
        </div>
      </div>
      <div className='absolute -top-24 -right-24 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl'></div>
      <div className='absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl'></div>
    </section>
  );
}
