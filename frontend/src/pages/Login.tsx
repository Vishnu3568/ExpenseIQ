import React, { useState } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ErrorAlert } from '../components/ui/ErrorAlert';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: FieldValues) => {
    setApiError('');
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      const errMsg =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err as any).response?.data?.message || 'Failed to login. Please check your credentials.';
      setApiError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Brand Logo */}
        <div className="flex flex-col items-center">
          <div className="p-3 bg-primary/10 rounded-2xl mb-4">
            <Activity className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Welcome back</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Sign in to your ExpenseIQ account to continue
          </p>
        </div>

        {/* Login Card */}
        <Card className="border shadow-md bg-card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <ErrorAlert message={apiError} />

            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              error={errors.email?.message}
              autoComplete="email"
              {...register('email', {
                required: 'Email address is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address format',
                },
              })}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              autoComplete="current-password"
              {...register('password', {
                required: 'Password is required',
              })}
            />

            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Sign In
            </Button>
          </form>
        </Card>

        {/* Footer Navigation */}
        <p className="text-center text-sm text-muted-foreground mt-4">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-medium text-primary hover:underline transition-all"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};
