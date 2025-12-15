import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { ProfileAvatar } from '../components/profile/ProfileAvatar';
import { ProfileUserInfo } from '../components/profile/ProfileUserInfo';
import { ProfileForm } from '../components/profile/ProfileForm';
import { PasswordChangeForm } from '../components/profile/PasswordChangeForm';
import { AccountInfo } from '../components/profile/AccountInfo';
import { useAuth } from '@/app/providers/AuthContext';

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [avatar, setAvatar] = useState(user?.avatar || '');

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real app, you would upload the file to your server
    // and get back a URL. For now, we'll create a local URL.
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  if (!user) {
    return null;
  }

  return (
    <div className='min-h-screen bg-background py-8 px-4'>
      <div className='max-w-3xl mx-auto'>
        <ProfileHeader onBackClick={() => navigate('/')} />

        <div className='space-y-6'>
          {/* User Profile Card */}
          <Card className='p-8'>
            <div className='flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8'>
              <ProfileAvatar
                avatar={avatar}
                name={user.name || ''}
                onAvatarUpload={handleAvatarUpload}
              />
              <ProfileUserInfo
                name={user.name || ''}
                email={user.email || ''}
                createdAt={user.createdAt || ''}
              />
            </div>

            <Separator className='my-8' />

            <ProfileForm user={user} />
          </Card>

          {/* Password Card */}
          <Card className='p-8'>
            <PasswordChangeForm lastUpdated={user.updatedAt || ''} />
          </Card>

          <AccountInfo
            userId={user.id}
            createdAt={user.createdAt || ''}
            updatedAt={user.updatedAt || ''}
          />
        </div>
      </div>
    </div>
  );
}
