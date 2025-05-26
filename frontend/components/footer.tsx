import Link from 'next/link';
import { Gift, Twitter, Instagram, Github, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className='border-t border-purple-800/30 bg-black'>
      <div className='container py-12'>
        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
          <div>
            <Link href='/' className='flex items-center gap-2 mb-4'>
              <Gift className='h-6 w-6 text-purple-400' />
              <span className='text-xl font-bold'>NIFT</span>
            </Link>
            <p className='text-zinc-400 mb-4'>
              The future of digital gifting, powered by blockchain technology.
            </p>
            <div className='flex gap-4'>
              <Link href='#' className='text-zinc-400 hover:text-purple-400'>
                <Twitter className='h-5 w-5' />
                <span className='sr-only'>Twitter</span>
              </Link>
              <Link href='#' className='text-zinc-400 hover:text-purple-400'>
                <Instagram className='h-5 w-5' />
                <span className='sr-only'>Instagram</span>
              </Link>
              <Link href='#' className='text-zinc-400 hover:text-purple-400'>
                <Github className='h-5 w-5' />
                <span className='sr-only'>GitHub</span>
              </Link>
              <Link href='#' className='text-zinc-400 hover:text-purple-400'>
                <Linkedin className='h-5 w-5' />
                <span className='sr-only'>LinkedIn</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className='font-medium mb-4'>Quick Links</h3>
            <ul className='space-y-2'>
              <li>
                <Link href='/' className='text-zinc-400 hover:text-purple-400'>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href='#features'
                  className='text-zinc-400 hover:text-purple-400'
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href='#newsletter'
                  className='text-zinc-400 hover:text-purple-400'
                >
                  Newsletter
                </Link>
              </li>
              <li>
                <Link
                  href='/dashboard'
                  className='text-zinc-400 hover:text-purple-400'
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='font-medium mb-4'>Resources</h3>
            <ul className='space-y-2'>
              <li>
                <Link href='#' className='text-zinc-400 hover:text-purple-400'>
                  Documentation
                </Link>
              </li>
              <li>
                <Link href='#' className='text-zinc-400 hover:text-purple-400'>
                  FAQ
                </Link>
              </li>
              <li>
                <Link href='#' className='text-zinc-400 hover:text-purple-400'>
                  Support
                </Link>
              </li>
              <li>
                <Link href='#' className='text-zinc-400 hover:text-purple-400'>
                  API
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='font-medium mb-4'>Legal</h3>
            <ul className='space-y-2'>
              <li>
                <Link href='#' className='text-zinc-400 hover:text-purple-400'>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href='#' className='text-zinc-400 hover:text-purple-400'>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href='#' className='text-zinc-400 hover:text-purple-400'>
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className='mt-12 pt-6 border-t border-purple-800/30 text-center text-zinc-500 text-sm'>
          <p>© {new Date().getFullYear()} NIFT. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
