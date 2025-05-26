import { Gift, Wallet, RefreshCw, Shield } from 'lucide-react';

export function Features() {
  return (
    <section id='features' className='py-20 bg-black/60'>
      <div className='container'>
        <div className='text-center space-y-4 mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
            The Future of Digital Gifting
          </h2>
          <p className='text-zinc-400 max-w-2xl mx-auto'>
            NIFT combines the security of blockchain with the joy of gifting.
            Our NFT gift cards are unique, transferable, and redeemable.
          </p>
        </div>

        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
          <div className='relative overflow-hidden rounded-lg border border-purple-800/30 bg-black/50 p-6 backdrop-blur'>
            <div className='absolute -top-10 -right-10 h-20 w-20 rounded-full bg-purple-600/10'></div>
            <Gift className='h-10 w-10 text-purple-400 mb-4' />
            <h3 className='text-xl font-semibold mb-2'>Purchase Gift Cards</h3>
            <p className='text-zinc-400'>
              Buy gift cards using your favorite cryptocurrencies, instantly
              minted as NFTs in your wallet.
            </p>
          </div>

          <div className='relative overflow-hidden rounded-lg border border-purple-800/30 bg-black/50 p-6 backdrop-blur'>
            <div className='absolute -top-10 -right-10 h-20 w-20 rounded-full bg-purple-600/10'></div>
            <Wallet className='h-10 w-10 text-purple-400 mb-4' />
            <h3 className='text-xl font-semibold mb-2'>Send Anywhere</h3>
            <p className='text-zinc-400'>
              Transfer your gift cards to anyone with a web3 wallet, anywhere in
              the world.
            </p>
          </div>

          <div className='relative overflow-hidden rounded-lg border border-purple-800/30 bg-black/50 p-6 backdrop-blur'>
            <div className='absolute -top-10 -right-10 h-20 w-20 rounded-full bg-purple-600/10'></div>
            <RefreshCw className='h-10 w-10 text-purple-400 mb-4' />
            <h3 className='text-xl font-semibold mb-2'>Easy Redemption</h3>
            <p className='text-zinc-400'>
              Redeem your gift cards anytime to receive the crypto directly in
              your wallet.
            </p>
          </div>

          <div className='relative overflow-hidden rounded-lg border border-purple-800/30 bg-black/50 p-6 backdrop-blur'>
            <div className='absolute -top-10 -right-10 h-20 w-20 rounded-full bg-purple-600/10'></div>
            <Shield className='h-10 w-10 text-purple-400 mb-4' />
            <h3 className='text-xl font-semibold mb-2'>Blockchain Secured</h3>
            <p className='text-zinc-400'>
              Your gift cards are protected by the security and immutability of
              blockchain technology.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
