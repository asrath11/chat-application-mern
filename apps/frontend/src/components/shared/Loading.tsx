import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  className?: string;
  variant?: 'spinner' | 'dots' | 'pulse';
}

export const Loading = ({
  size = 'md',
  text,
  className,
  variant = 'spinner',
}: LoadingProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  };

  if (variant === 'spinner') {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-2',
          className
        )}
      >
        <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
        {text && (
          <p className={cn('text-muted-foreground', textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-2',
          className
        )}
      >
        <div className='flex space-x-1'>
          <div
            className={cn(
              'bg-primary rounded-full animate-bounce',
              sizeClasses[size]
            )}
            style={{ animationDelay: '0ms' }}
          />
          <div
            className={cn(
              'bg-primary rounded-full animate-bounce',
              sizeClasses[size]
            )}
            style={{ animationDelay: '150ms' }}
          />
          <div
            className={cn(
              'bg-primary rounded-full animate-bounce',
              sizeClasses[size]
            )}
            style={{ animationDelay: '300ms' }}
          />
        </div>
        {text && (
          <p className={cn('text-muted-foreground', textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-2',
          className
        )}
      >
        <div
          className={cn(
            'bg-primary rounded-full animate-pulse',
            sizeClasses[size]
          )}
        />
        {text && (
          <p
            className={cn(
              'text-muted-foreground animate-pulse',
              textSizeClasses[size]
            )}
          >
            {text}
          </p>
        )}
      </div>
    );
  }

  return null;
};

export const LoadingScreen = ({ text = 'Loading...' }: { text?: string }) => {
  return (
    <div className='flex items-center justify-center min-h-screen bg-background'>
      <Loading size='xl' text={text} variant='spinner' />
    </div>
  );
};

export const LoadingOverlay = ({
  isVisible,
  text = 'Loading...',
  className,
}: {
  isVisible: boolean;
  text?: string;
  className?: string;
}) => {
  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50',
        className
      )}
    >
      <Loading size='lg' text={text} variant='spinner' />
    </div>
  );
};

export const InlineLoading = ({
  text = 'Loading...',
  className,
}: {
  text?: string;
  className?: string;
}) => {
  return (
    <div
      className={cn('flex items-center gap-2 text-muted-foreground', className)}
    >
      <Loader2 className='w-4 h-4 animate-spin' />
      <span className='text-sm'>{text}</span>
    </div>
  );
};
