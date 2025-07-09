'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function DebugAuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState('');

  const debugUser = async () => {
    if (!email) {
      setError('Please enter an email address');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch('/api/debug-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      setUserInfo(result);
    } catch (err) {
      setError('Error debugging user');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!email || !password) {
      setError('Please enter both email and new password');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch('/api/reset-user-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (result.success) {
        setUserInfo(result);
        setError('Password reset successfully! You can now try logging in.');
      } else {
        setError(result.error || 'Failed to reset password');
      }
    } catch (err) {
      setError('Error resetting password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card variant="premium">
            <CardHeader>
              <h1 className="text-2xl font-serif font-bold text-gray-800">
                Debug Authentication Issues
              </h1>
              <p className="text-gray-600">
                This page helps debug authentication issues with existing users.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password (for reset)
                  </label>
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={debugUser}
                    disabled={isLoading}
                    variant="outline"
                  >
                    {isLoading ? <LoadingSpinner size="small" /> : 'Debug User'}
                  </Button>
                  
                  <Button
                    onClick={resetPassword}
                    disabled={isLoading}
                    variant="primary"
                  >
                    {isLoading ? <LoadingSpinner size="small" /> : 'Reset Password'}
                  </Button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {userInfo && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-800 mb-2">User Information:</h3>
                  <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                    {JSON.stringify(userInfo, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}