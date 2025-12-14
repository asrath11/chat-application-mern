import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { Key, Shield, X, Loader2, Lock, Check } from 'lucide-react';
import { PasswordRequirements } from './PasswordRequirements';
import { updatePassword } from '../../services/user.service';

interface PasswordChangeFormProps {
  lastUpdated: string | Date;
}

export function PasswordChangeForm({ lastUpdated }: PasswordChangeFormProps) {
  const [isChanging, setIsChanging] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const passwordMutation = useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      toast.success('Password updated successfully', {
        icon: <Check className='h-4 w-4' />,
      });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setIsChanging(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update password');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error('All password fields are required');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)) {
      toast.error('Password must contain uppercase, lowercase, and numbers');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    passwordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
  };

  const handleCancel = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setIsChanging(false);
  };
  return (
    <div className='space-y-8'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-xl font-semibold flex items-center space-x-2 text-foreground'>
            <Lock className='h-5 w-5' />
            <span>Password & Security</span>
          </h3>
          <p className='text-muted-foreground text-sm mt-1'>
            Change your password and secure your account
          </p>
        </div>
        {!isChanging && (
          <Button onClick={() => setIsChanging(true)} variant='outline'>
            Change Password
          </Button>
        )}
      </div>

      {isChanging ? (
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='space-y-2'>
              <Label
                htmlFor='currentPassword'
                className='text-muted-foreground flex items-center space-x-2'
              >
                <Key className='h-4 w-4' />
                <span>Current Password</span>
              </Label>
              <PasswordInput
                id='currentPassword'
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                placeholder='Enter current password'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='newPassword' className='text-muted-foreground'>
                New Password
              </Label>
              <PasswordInput
                id='newPassword'
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                placeholder='Enter new password'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='confirmPassword' className='text-muted-foreground'>
                Confirm Password
              </Label>
              <PasswordInput
                id='confirmPassword'
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                placeholder='Confirm new password'
              />
            </div>
          </div>

          <PasswordRequirements />

          <div className='flex justify-end space-x-3 pt-2'>
            <Button
              type='button'
              variant='outline'
              onClick={handleCancel}
              disabled={passwordMutation.isPending}
            >
              <X className='h-4 w-4 mr-2' />
              Cancel
            </Button>
            <Button type='submit' disabled={passwordMutation.isPending}>
              {passwordMutation.isPending ? (
                <>
                  <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                  Updating...
                </>
              ) : (
                <>
                  <Shield className='h-4 w-4 mr-2' />
                  Update Password
                </>
              )}
            </Button>
          </div>
        </form>
      ) : (
        <div className='p-6 rounded-lg bg-muted'>
          <div className='flex items-center space-x-4'>
            <div className='h-12 w-12 rounded-full flex items-center justify-center bg-accent'>
              <Lock className='h-6 w-6 text-accent-foreground' />
            </div>
            <div>
              <h4 className='font-medium text-foreground'>
                Keep your account secure
              </h4>
              <p className='text-muted-foreground text-sm mt-1'>
                Last changed: {new Date(lastUpdated).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
