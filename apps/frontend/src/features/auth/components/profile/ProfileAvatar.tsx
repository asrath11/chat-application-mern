import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';

interface ProfileAvatarProps {
  avatar: string;
  name: string;
  onAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfileAvatar({
  avatar,
  name,
  onAvatarUpload,
}: ProfileAvatarProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className='shrink-0'>
      <div className='relative'>
        <Avatar className='h-28 w-28 border-4 border-border'>
          {avatar ? (
            <AvatarImage src={avatar} alt={name} className='object-cover' />
          ) : null}
          <AvatarFallback className='text-2xl bg-primary text-primary-foreground'>
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
        <label
          htmlFor='avatar-upload'
          className='absolute -bottom-2 -right-2 bg-card rounded-full p-2 shadow-md border border-border cursor-pointer hover:bg-accent transition-colors'
        >
          <Camera className='h-4 w-4 text-muted-foreground' />
          <input
            id='avatar-upload'
            type='file'
            accept='image/*'
            className='hidden'
            onChange={onAvatarUpload}
          />
        </label>
      </div>
    </div>
  );
}
