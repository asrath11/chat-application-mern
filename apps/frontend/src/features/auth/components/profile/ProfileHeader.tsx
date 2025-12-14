import { Button } from '@/components/ui/button';

interface ProfileHeaderProps {
  onBackClick: () => void;
}

export function ProfileHeader({ onBackClick }: ProfileHeaderProps) {
  return (
    <div className='flex items-center justify-between mb-8'>
      <div className='flex items-center space-x-4'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>Profile Settings</h1>
          <p className='text-muted-foreground mt-1'>
            Manage your account information and security
          </p>
        </div>
      </div>
      <Button variant='outline' onClick={onBackClick}>
        Back to Chat
      </Button>
    </div>
  );
}
