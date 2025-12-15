import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { User, Mail, Check, X, Loader2 } from 'lucide-react';
import { updateProfile } from '../../services/user.service';
import type { User as UserType } from '@chat-app/shared-types';
import { useAuth } from '@/app/providers/AuthContext';

const profileFormSchema = z.object({
  userName: z
    .string()
    .toLowerCase()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  avatar: z.string().optional().or(z.literal('')),
});

interface ProfileFormProps {
  user: UserType;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const queryClient = useQueryClient();
  const { checkAuth } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      userName: user.name || '',
      avatar: user.avatar || '',
    },
  });

  const profileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: async (data) => {
      queryClient.setQueryData(['user'], data.user);
      await checkAuth(); // Refresh auth context with updated user data
      toast.success('Profile updated successfully', {
        icon: <Check className='h-4 w-4' />,
      });
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });

  const handleSubmit = (values: z.infer<typeof profileFormSchema>) => {
    profileMutation.mutate({
      userName: values.userName,
      avatar: values.avatar || '',
    });
  };

  const handleCancel = () => {
    form.reset({
      userName: user.name || '',
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <FormField
              control={form.control}
              name='userName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-muted-foreground flex items-center space-x-2'>
                    <User className='h-4 w-4' />
                    <span>Username</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter your full name'
                      disabled={!isEditing}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='space-y-2'>
              <FormLabel className='text-muted-foreground flex items-center space-x-2'>
                <Mail className='h-4 w-4' />
                <span>Email Address</span>
              </FormLabel>
              <Input type='email' value={user.email || ''} disabled />
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
      </Form>
    </div>
  );
}
