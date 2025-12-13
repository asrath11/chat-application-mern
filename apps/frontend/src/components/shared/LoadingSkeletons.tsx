import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export const ChatListSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn('space-y-2 p-4', className)}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className='flex items-center space-x-3 p-3 rounded-lg'>
          <Skeleton className='h-12 w-12 rounded-full' />
          <div className='space-y-2 flex-1'>
            <Skeleton className='h-4 w-3/4' />
            <Skeleton className='h-3 w-1/2' />
          </div>
          <Skeleton className='h-3 w-8' />
        </div>
      ))}
    </div>
  );
};

export const MessageListSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn('space-y-4 p-4', className)}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}
        >
          <div
            className={`flex items-start space-x-2 max-w-xs ${i % 2 === 0 ? '' : 'flex-row-reverse space-x-reverse'}`}
          >
            <Skeleton className='h-8 w-8 rounded-full shrink-0' />
            <div className='space-y-2'>
              <Skeleton
                className={`h-4 ${i % 3 === 0 ? 'w-32' : i % 3 === 1 ? 'w-24' : 'w-40'}`}
              />
              <Skeleton className='h-3 w-16' />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const ChatInfoSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn('p-6 space-y-6', className)}>
      {/* Header */}
      <div className='flex items-center space-x-4'>
        <Skeleton className='h-16 w-16 rounded-full' />
        <div className='space-y-2'>
          <Skeleton className='h-6 w-32' />
          <Skeleton className='h-4 w-24' />
        </div>
      </div>

      {/* Actions */}
      <div className='space-y-3'>
        <Skeleton className='h-10 w-full' />
        <Skeleton className='h-10 w-full' />
        <Skeleton className='h-10 w-full' />
      </div>

      {/* Members section */}
      <div className='space-y-4'>
        <Skeleton className='h-5 w-20' />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className='flex items-center space-x-3'>
            <Skeleton className='h-10 w-10 rounded-full' />
            <div className='space-y-1 flex-1'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-3 w-16' />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const UserListSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn('space-y-2 p-4', className)}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className='flex items-center space-x-3 p-2 rounded-lg'>
          <Skeleton className='h-10 w-10 rounded-full' />
          <div className='space-y-1 flex-1'>
            <Skeleton className='h-4 w-32' />
            <Skeleton className='h-3 w-20' />
          </div>
          <Skeleton className='h-8 w-16' />
        </div>
      ))}
    </div>
  );
};

export const FormSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn('space-y-4 p-6', className)}>
      <Skeleton className='h-8 w-48 mx-auto' />
      <div className='space-y-4'>
        <div className='space-y-2'>
          <Skeleton className='h-4 w-20' />
          <Skeleton className='h-10 w-full' />
        </div>
        <div className='space-y-2'>
          <Skeleton className='h-4 w-16' />
          <Skeleton className='h-10 w-full' />
        </div>
        <Skeleton className='h-10 w-full' />
      </div>
    </div>
  );
};

export const CardSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn('p-4 border rounded-lg space-y-3', className)}>
      <Skeleton className='h-6 w-3/4' />
      <Skeleton className='h-4 w-full' />
      <Skeleton className='h-4 w-2/3' />
      <div className='flex justify-between items-center pt-2'>
        <Skeleton className='h-4 w-20' />
        <Skeleton className='h-8 w-16' />
      </div>
    </div>
  );
};

export const ChatWindowSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn('flex flex-col h-full bg-background', className)}>
      {/* Header Skeleton */}
      <div className='h-16 border-b flex items-center px-6 gap-3 shrink-0'>
        <Skeleton className='h-10 w-10 rounded-full' />
        <div className='flex flex-col gap-1.5'>
          <Skeleton className='h-4 w-32' />
          <Skeleton className='h-3 w-20' />
        </div>
        <div className='ml-auto'>
          <Skeleton className='h-8 w-8 rounded-full' />
        </div>
      </div>

      {/* Messages Skeleton */}
      <div className='flex-1 p-4'>
        <MessageListSkeleton />
      </div>

      {/* Input Skeleton */}
      <div className='h-20 border-t p-4 flex items-center gap-2 shrink-0'>
        <Skeleton className='h-10 w-10 rounded-full' />
        <Skeleton className='h-10 flex-1 rounded-md' />
        <Skeleton className='h-10 w-10 rounded-full' />
      </div>
    </div>
  );
};
