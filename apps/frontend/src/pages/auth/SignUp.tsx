import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { registerFormSchema } from '@/lib/validation-schemas';

const formSchema = registerFormSchema;

export default function SignUp() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const { confirmPassword, ...rest } = values;
      await register(rest);
      toast.success('Account created successfully');
      navigate('/');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(
        error?.response?.data?.message || error?.message || 'Something went wrong'
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='flex h-screen w-full items-center justify-center px-4'>
      <Card className='mx-auto max-w-sm w-full'>
        <CardHeader>
          <CardTitle className='text-2xl'>Register</CardTitle>
          <CardDescription>
            Create a new account by filling out the form below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <div className='grid gap-4'>
                {/* Name Field */}
                <FormField
                  control={form.control}
                  name='userName'
                  render={({ field }) => (
                    <FormItem className='grid gap-2'>
                      <FormLabel htmlFor='userName'>user name</FormLabel>
                      <FormControl>
                        <Input
                          id='userName'
                          placeholder='John Doe'
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email Field */}
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem className='grid gap-2'>
                      <FormLabel htmlFor='email'>Email</FormLabel>
                      <FormControl>
                        <Input
                          id='email'
                          placeholder='johndoe@mail.com'
                          type='email'
                          autoComplete='email'
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem className='grid gap-2'>
                      <FormLabel htmlFor='password'>Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          id='password'
                          placeholder='******'
                          autoComplete='new-password'
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password Field */}
                <FormField
                  control={form.control}
                  name='confirmPassword'
                  render={({ field }) => (
                    <FormItem className='grid gap-2'>
                      <FormLabel htmlFor='confirmPassword'>
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          id='confirmPassword'
                          placeholder='******'
                          autoComplete='new-password'
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type='submit' className='w-full' disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Creating account...
                    </>
                  ) : (
                    'Register'
                  )}
                </Button>
              </div>
            </form>
          </Form>
          <div className='mt-4 text-center text-sm'>
            Already have an account?{' '}
            <Link to='/signin' className='underline'>
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
