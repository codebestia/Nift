import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const CardSkeleton = () => (
  <Card className='overflow-hidden bg-gradient-to-br from-purple-950/50 to-slate-900/50 border border-purple-800/20'>
    <CardHeader className='p-0'>
      <div className='relative aspect-square bg-black/20'>
        <Skeleton className='h-full w-full' />
      </div>
    </CardHeader>
    <CardContent className='p-4 space-y-3'>
      <div className='flex items-center justify-between'>
        <Skeleton className='h-6 w-24' />
        <Skeleton className='h-5 w-12 rounded-full' />
      </div>
      <div className='space-y-2'>
        <div className='flex items-center justify-between'>
          <Skeleton className='h-4 w-16' />
          <Skeleton className='h-4 w-12' />
        </div>
        <div className='flex items-center justify-between'>
          <Skeleton className='h-4 w-16' />
          <Skeleton className='h-4 w-20' />
        </div>
        <div className='flex items-center justify-between'>
          <Skeleton className='h-4 w-16' />
          <Skeleton className='h-4 w-14' />
        </div>
      </div>
    </CardContent>
    <CardFooter className='p-4 pt-0 flex gap-2'>
      <Skeleton className='h-10 w-full' />
      <Skeleton className='h-10 w-10' />
    </CardFooter>
  </Card>
);

export default CardSkeleton;
