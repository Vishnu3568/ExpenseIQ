import React, { useState } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ErrorAlert } from '../components/ui/ErrorAlert';

export const Register: React.FC = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const passwordVal = watch('password');

  const onSubmit = async (data: FieldValues) => {
    setApiError('');
    setIsSubmitting(true);
    try {
      await registerAuth(data.name, data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      const errMsg =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err as any).response?.data?.message || 'Registration failed. Please check inputs.';
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
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Create your account</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Get started with ExpenseIQ personal budgeting
          </p>
        </div>

        {/* Register Card */}
        <Card className="border shadow-md bg-card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <ErrorAlert message={apiError} />

            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              error={errors.name?.message}
              {...register('name', {
                required: 'Full name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters long',
                },
              })}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              error={errors.email?.message}
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
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters long',
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/,
                  message: 'Must include uppercase, lowercase, number, and special character',
                },
              })}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (val) => val === passwordVal || 'Passwords do not match',
              })}
            />

            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Sign Up
            </Button>
          </form>
        </Card>

        {/* Footer Navigation */}
        <p className="text-center text-sm text-muted-foreground mt-4">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline transition-all"
          >
            Sign in instead
          </Link>
        </p>
      </div>
    </div>
  );
};
