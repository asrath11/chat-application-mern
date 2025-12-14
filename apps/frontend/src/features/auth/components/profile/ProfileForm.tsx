import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Check, X, Loader2 } from 'lucide-react';
import { updateProfile } from '../../services/user.service';
import type { User as UserType } from '@chat-app/shared-types';

interface ProfileFormProps {
  user: UserType;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user.name || '',
    email: user.email || '',
    avatar: user.avatar || '',
  });

  const profileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
      toast.success('Profile updated successfully', {
        icon: <Check className='h-4 w-4' />,
      });
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!profileData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    profileMutation.mutate({
      name: profileData.name,
      avatar: profileData.avatar,
    });
  };

  const handleCancel = () => {
    setProfileData({
      name: user.name || '',
      email: user.email || '',
      avatar: user.avatar || '',
    });
    setIsEditing(false);
  };
  return (
    <div className='space-y-8'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-xl font-semibold flex items-center space-x-2 text-foreground'>
            <User className='h-5 w-5' />
            <span>Personal Information</span>
          </h3>
          <p className='text-muted-foreground text-sm mt-1'>
            Update your personal details
          </p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <Label
              htmlFor='name'
              className='text-muted-foreground flex items-center space-x-2'
            >
              <User className='h-4 w-4' />
              <span>username</span>
            </Label>
            <Input
              id='name'
              value={profileData.name}
              onChange={(e) =>
                setProfileData({ ...profileData, name: e.target.value })
              }
              disabled={!isEditing}
              placeholder='Enter your full name'
            />
          </div>

          <div className='space-y-2'>
            <Label
              htmlFor='email'
              className='text-muted-foreground flex items-center space-x-2'
            >
              <Mail className='h-4 w-4' />
              <span>Email Address</span>
            </Label>
            <Input id='email' type='email' value={profileData.email} disabled />
            <p className='text-xs text-muted-foreground'>
              Contact support to change your email
            </p>
          </div>
        </div>

        {isEditing && (
          <div className='flex justify-end space-x-3 pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={handleCancel}
              disabled={profileMutation.isPending}
            >
              <X className='h-4 w-4 mr-2' />
              Cancel
            </Button>
            <Button type='submit' disabled={profileMutation.isPending}>
              {profileMutation.isPending ? (
                <>
                  <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                  Saving...
                </>
              ) : (
                <>
                  <Check className='h-4 w-4 mr-2' />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
