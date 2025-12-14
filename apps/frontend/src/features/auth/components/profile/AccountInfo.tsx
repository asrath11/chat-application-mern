import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Info, Calendar, AlertCircle } from 'lucide-react';

interface AccountInfoProps {
  userId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export function AccountInfo({ userId, createdAt, updatedAt }: AccountInfoProps) {
  return (
    <Card className='p-8'>
      <div className='space-y-6'>
        <div>
          <h3 className='text-xl font-semibold flex items-center space-x-2 text-foreground'>
            <Info className='h-5 w-5' />
            <span>Account Information</span>
          </h3>
          <p className='text-muted-foreground text-sm mt-1'>
            Your account details and activity
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label className='text-muted-foreground text-sm'>Account ID</Label>
              <div className='font-mono p-3 rounded border border-border bg-muted text-sm text-foreground'>
                {userId || 'N/A'}
              </div>
            </div>

            <div className='space-y-2'>
              <Label className='text-muted-foreground text-sm'>
                Account Status
              </Label>
              <div className='flex items-center space-x-2'>
                <div className='h-2 w-2 rounded-full bg-chart-1'></div>
                <span className='font-medium text-chart-1'>Active</span>
              </div>
            </div>
          </div>

          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label className='text-muted-foreground text-sm'>
                Member Since
              </Label>
              <div className='flex items-center space-x-2 text-muted-foreground'>
                <Calendar className='h-4 w-4' />
                <span className='font-medium'>
                  {new Date(createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>

            <div className='space-y-2'>
              <Label className='text-muted-foreground text-sm'>
                Last Updated
              </Label>
              <div className='flex items-center space-x-2 text-muted-foreground'>
                <Calendar className='h-4 w-4' />
                <span className='font-medium'>
                  {new Date(updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className='p-4 rounded-lg border border-border bg-muted'>
          <div className='flex items-start space-x-3'>
            <AlertCircle className='h-5 w-5 text-primary mt-0.5 shrink-0' />
            <div>
              <h4 className='font-medium text-foreground'>Security Tip</h4>
              <p className='text-muted-foreground text-sm mt-1'>
                Always log out from shared devices and use strong, unique
                passwords for your accounts. Enable two-factor authentication if
                available.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
