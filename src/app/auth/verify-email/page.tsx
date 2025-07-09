'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';

import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const verifyEmailSchema = z.object({
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
});

type VerifyEmailForm = z.infer<typeof verifyEmailSchema>;

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailForm>({
    resolver: zodResolver(verifyEmailSchema),
  });

  useEffect(() => {
    if (!email) {
      setError('Email address is required');
    }
  }, [email]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const onSubmit = async (data: VerifyEmailForm) => {
    if (!email) {
      setError('Email address is required');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp: data.otp,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Failed to verify email');
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);

    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email || countdown > 0) return;

    try {
      setIsResending(true);
      setError(null);

      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Failed to resend OTP');
        return;
      }

      setCountdown(60); // 1 minute cooldown
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card variant="premium" className="p-8">
            <CardContent className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h1 className="text-2xl font-serif font-bold text-gray-800">
                Email Verified!
              </h1>
              <p className="text-gray-600">
                Your email has been successfully verified. You can now sign in to your account.
              </p>
              <div className="text-sm text-gray-500">
                Redirecting to login page...
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card variant="premium" className="p-8">
          <CardContent className="space-y-6">
            {/* Header */}
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail size={32} className="text-amber-600" />
                </div>
                <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">
                  Verify Your Email
                </h1>
                <p className="text-gray-600">
                  We've sent a 6-digit verification code to
                </p>
                <p className="text-amber-600 font-medium">
                  {email}
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                  <p className="text-blue-800 text-sm">
                    <strong>Development Mode:</strong> Check your browser console or terminal where you ran <code>npm run dev</code> to see the OTP code.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2"
              >
                <AlertCircle size={20} />
                {error}
              </motion.div>
            )}

            {/* OTP Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  error={errors.otp?.message}
                  {...register('otp')}
                  className="text-center text-lg tracking-widest"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Please check your email and enter the 6-digit code
                </p>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="large"
                disabled={isLoading || !email}
              >
                {isLoading ? <LoadingSpinner size="small" /> : 'Verify Email'}
              </Button>
            </form>

            {/* Resend OTP */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Didn't receive the code?
              </p>
              <Button
                type="button"
                variant="outline"
                size="small"
                onClick={handleResendOTP}
                disabled={isResending || countdown > 0}
                className="flex items-center gap-2"
              >
                {isResending ? (
                  <LoadingSpinner size="small" />
                ) : (
                  <RefreshCw size={16} />
                )}
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
              </Button>
            </div>

            {/* Footer */}
            <div className="text-center">
              <Link
                href="/auth/login"
                className="text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors"
              >
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <React.Suspense fallback={<LoadingSpinner size="large" />}>
      <VerifyEmailContent />
    </React.Suspense>
  );
}