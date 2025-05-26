'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  BarChart3,
  Gift,
  PlusCircle,
  RefreshCw,
  LogOut,
  User,
  ChevronDown,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useAccount } from '@starknet-react/core';

export function DashboardSidebar() {
  const pathname = usePathname();
  const { address } = useAccount();

  return (
    <Sidebar className='border-r border-purple-800/30 bg-black'>
      <SidebarHeader className='flex items-center justify-between p-4'>
        <Link href='/' className='flex items-center gap-2'>
          <Gift className='h-6 w-6 text-purple-400' />
          <span className='text-lg font-bold'>NIFT</span>
        </Link>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent className='px-2'>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/dashboard'}
              tooltip='Analytics'
            >
              <Link href='/dashboard'>
                <BarChart3 className='h-5 w-5' />
                <span>Analytics</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/dashboard/my-gifts'}
              tooltip='My Gifts'
            >
              <Link href='/dashboard/my-gifts'>
                <Gift className='h-5 w-5' />
                <span>My Gifts</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/dashboard/purchase'}
              tooltip='Purchase'
            >
              <Link href='/dashboard/purchase'>
                <PlusCircle className='h-5 w-5' />
                <span>Purchase a Gift Card</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/dashboard/redeem'}
              tooltip='Redeem'
            >
              <Link href='/dashboard/redeem'>
                <RefreshCw className='h-5 w-5' />
                <span>Redeem a Gift Card</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className='mt-auto border-t border-purple-800/30 p-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Avatar className='h-8 w-8 border border-purple-800/50'>
              <AvatarImage
                src='/placeholder.svg?height=32&width=32'
                alt='User'
              />
              <AvatarFallback className='bg-purple-900 text-white'>
                U
              </AvatarFallback>
            </Avatar>
            <div className='flex flex-col'>
              <span className='text-xs text-zinc-400'>Wallet</span>
              <span className='text-sm font-medium'>
                {address
                  ? `${address.slice(0, 6)}...${address.slice(-4)}`
                  : 'Connect Wallet'}
              </span>
            </div>
          </div>
          {address && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='rounded-full h-8 w-8'
                >
                  <ChevronDown className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-56'>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className='mr-2 h-4 w-4' />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className='mr-2 h-4 w-4' />
                  <span>Disconnect Wallet</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
