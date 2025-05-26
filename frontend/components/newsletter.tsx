import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Newsletter() {
  return (
    <section
      id='newsletter'
      className='py-20 bg-gradient-to-b from-purple-900/20 to-black'
    >
      <div className='container'>
        <div className='mx-auto max-w-2xl rounded-lg border border-purple-800/30 bg-black/50 p-8 backdrop-blur'>
          <div className='text-center space-y-4 mb-6'>
            <h2 className='text-2xl md:text-3xl font-bold'>Stay in the Loop</h2>
            <p className='text-zinc-400'>
              Get the latest updates on new features, blockchain integrations,
              and exclusive offers.
            </p>
          </div>
          <div className='flex flex-col sm:flex-row gap-3'>
            <Input
              type='email'
              placeholder='Enter your email'
              className='bg-black/60 border-purple-800/50 focus-visible:ring-purple-500'
            />
            <Button className='bg-purple-600 hover:bg-purple-700'>
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
