import { Info, Check } from 'lucide-react';

export function PasswordRequirements() {
  return (
    <div className='p-4 rounded-lg border border-border bg-muted'>
      <div className='flex items-start space-x-3'>
        <Info className='h-5 w-5 mt-0.5 shrink-0 text-primary' />
        <div>
          <h4 className='font-medium mb-2 text-foreground'>
            Password Requirements
          </h4>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
            <div className='flex items-center space-x-2'>
              <Check className='h-4 w-4 text-chart-1' />
              <span className='text-sm text-muted-foreground'>
                At least 8 characters
              </span>
            </div>
            <div className='flex items-center space-x-2'>
              <Check className='h-4 w-4 text-chart-1' />
              <span className='text-sm text-muted-foreground'>
                Uppercase & lowercase letters
              </span>
            </div>
            <div className='flex items-center space-x-2'>
              <Check className='h-4 w-4 text-chart-1' />
              <span className='text-sm text-muted-foreground'>
                At least one number
              </span>
            </div>
            <div className='flex items-center space-x-2'>
              <Check className='h-4 w-4 text-chart-1' />
              <span className='text-sm text-muted-foreground'>
                No common patterns
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
