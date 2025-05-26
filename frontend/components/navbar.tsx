'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Gift, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConnectWalletButton } from '@/components/connect-wallet-button';
import { useAccount } from '@starknet-react/core';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isConnected } = useAccount();

  return (
    <header className='sticky top-0 z-50 w-full border-b border-purple-800/50 bg-black/80 backdrop-blur-sm'>
      <div className='container flex h-16 items-center justify-between'>
        <div className='flex items-center gap-6'>
          <Link href='/' className='flex items-center gap-2'>
            <Gift className='h-6 w-6 text-purple-400' />
            <span className='text-xl font-bold'>NIFT</span>
          </Link>
          <nav className='hidden md:flex items-center gap-6'>
            <Link
              href='/'
              className={`text-sm font-medium ${pathname === '/' ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              Home
            </Link>
            <Link
              href='#features'
              className='text-sm font-medium text-zinc-400 hover:text-white'
            >
              Features
            </Link>
            <Link
              href='#newsletter'
              className='text-sm font-medium text-zinc-400 hover:text-white'
            >
              Newsletter
            </Link>
            {isConnected && (
              <Link
                href='/dashboard'
                className={`text-sm font-medium ${pathname.startsWith('/dashboard') ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>
        <div className='flex items-center gap-4'>
          <div className='hidden md:block'>
            <ConnectWalletButton />
          </div>
          <Button
            variant='ghost'
            size='icon'
            className='md:hidden'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className='sr-only'>Toggle menu</span>
            {isMenuOpen ? (
              <X className='h-6 w-6' />
            ) : (
              <Menu className='h-6 w-6' />
            )}
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className='container md:hidden'>
          <nav className='flex flex-col space-y-4 pb-4'>
            <Link
              href='/'
              className={`text-sm font-medium ${pathname === '/' ? 'text-white' : 'text-zinc-400'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href='#features'
              className='text-sm font-medium text-zinc-400'
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href='#newsletter'
              className='text-sm font-medium text-zinc-400'
              onClick={() => setIsMenuOpen(false)}
            >
              Newsletter
            </Link>
            {isWalletConnected && (
              <Link
                href='/dashboard'
                className={`text-sm font-medium ${pathname.startsWith('/dashboard') ? 'text-white' : 'text-zinc-400'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            <ConnectWalletButton />
          </nav>
        </div>
      )}
    </header>
  );
}
