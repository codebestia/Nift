import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { StarknetProvider } from '@/components/provider';
import { ReconnectorProvider } from '@/context/reconnector';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NIFT - Web3 Gift Card Platform',
  description: 'Purchase, send and redeem cryptocurrency gift cards as NFTs',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
          enableSystem
          disableTransitionOnChange
        >
          <StarknetProvider>
            <ReconnectorProvider>
            {children}
            </ReconnectorProvider>
          </StarknetProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
