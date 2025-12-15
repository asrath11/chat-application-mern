import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/password-input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Key, Shield, X, Loader2, Lock, Check } from 'lucide-react';
import { PasswordRequirements } from './PasswordRequirements';
import { updatePassword } from '../../services/user.service';

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain uppercase, lowercase, and numbers'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

interface PasswordChangeFormProps {
  lastUpdated: string | Date;
}

export function PasswordChangeForm({ lastUpdated }: PasswordChangeFormProps) {
  const [isChanging, setIsChanging] = useState(false);

  const form = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const passwordMutation = useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      toast.success('Password updated successfully', {
        icon: <Check className='h-4 w-4' />,
      });
      form.reset();
      setIsChanging(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update password');
    },
  });

  const handleSubmit = (values: z.infer<typeof passwordFormSchema>) => {
    passwordMutation.mutate({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
  };

  const handleCancel = () => {
    form.reset();
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <FormField
                control={form.control}
                name='currentPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-muted-foreground flex items-center space-x-2'>
                      <Key className='h-4 w-4' />
                      <span>Current Password</span>
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder='Enter current password'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='newPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-muted-foreground'>
                      New Password
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder='Enter new password'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-muted-foreground'>
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder='Confirm new password'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
        </Form>
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
