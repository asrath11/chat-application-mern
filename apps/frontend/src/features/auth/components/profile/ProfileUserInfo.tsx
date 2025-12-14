import { Badge } from '@/components/ui/badge';
import { Mail, Calendar } from 'lucide-react';

interface ProfileUserInfoProps {
  name: string;
  email: string;
  createdAt: string | Date;
}

export function ProfileUserInfo({
  name,
  email,
  createdAt,
}: ProfileUserInfoProps) {
  return (
    <div className='grow'>
      <div className='space-y-3'>
        <div>
          <h2 className='text-2xl font-bold text-foreground'>{name}</h2>
          <div className='flex items-center space-x-2 text-muted-foreground mt-1'>
            <Mail className='h-4 w-4' />
            <span>{email}</span>
          </div>
        </div>

        <div className='flex flex-wrap gap-3'>
          <Badge variant='secondary' className='px-3 py-1'>
            <div className='flex items-center space-x-2'>
              <div className='h-2 w-2 rounded-full bg-chart-1' />
              <span>Active</span>
            </div>
          </Badge>

          <div className='flex items-center space-x-2 text-sm text-muted-foreground'>
            <Calendar className='h-4 w-4' />
            <span>
              Joined{' '}
              {new Date(createdAt).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
