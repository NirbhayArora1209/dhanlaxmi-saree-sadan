'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit3, 
  Save, 
  X, 
  LogOut, 
  ShoppingBag, 
  Heart, 
  Settings,
  Shield
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits').optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional(),
    country: z.string().optional()
  }).optional()
});

type ProfileUpdateForm = z.infer<typeof profileUpdateSchema>;

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ProfileUpdateForm>({
    resolver: zodResolver(profileUpdateSchema),
  });

  useEffect(() => {
    if (session?.user) {
      reset({
        name: session.user.name || '',
        phone: session.user.phone || '',
        address: session.user.address || {}
      });
    }
  }, [session, reset]);

  const onSubmit = async (data: ProfileUpdateForm) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Failed to update profile');
        return;
      }

      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSuccess(false), 3000);

    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background-light">
        <Header />
        <main className="pt-20 flex items-center justify-center min-h-screen">
          <LoadingSpinner size="large" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!session) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-background-light">
      <Header />
      <main className="pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">
                My Account
              </h1>
              <p className="text-gray-600">
                Manage your account settings and preferences
              </p>
            </div>

            {/* Email Verification Alert */}
            {session?.user && !session.user.emailVerified && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Verification Required</p>
                    <p className="text-sm">Please verify your email address to access all features.</p>
                  </div>
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => router.push(`/auth/verify-email?email=${encodeURIComponent(session.user.email)}`)}
                  >
                    Verify Now
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg"
              >
                Profile updated successfully!
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
              >
                {error}
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Info */}
              <div className="lg:col-span-2">
                <Card variant="premium">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <h2 className="text-xl font-serif font-semibold text-gray-800">
                      Profile Information
                    </h2>
                    <div className="flex gap-2">
                      {!isEditing ? (
                        <Button
                          variant="outline"
                          size="small"
                          onClick={() => setIsEditing(true)}
                          className="flex items-center gap-2"
                        >
                          <Edit3 size={16} />
                          Edit
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="small"
                            onClick={() => setIsEditing(false)}
                            className="flex items-center gap-2"
                          >
                            <X size={16} />
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {!isEditing ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <User className="text-gray-400" size={20} />
                          <div>
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="text-gray-800">{session.user.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="text-gray-400" size={20} />
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="text-gray-800">{session.user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="text-gray-400" size={20} />
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="text-gray-800">{session.user.phone || 'Not provided'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="text-gray-400" size={20} />
                          <div>
                            <p className="text-sm text-gray-500">Address</p>
                            <p className="text-gray-800">
                              {session.user.address?.street || 'Not provided'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Shield className="text-gray-400" size={20} />
                          <div>
                            <p className="text-sm text-gray-500">Account Status</p>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                session.user.emailVerified 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {session.user.emailVerified ? 'Verified' : 'Pending Verification'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                          <Input
                            type="text"
                            placeholder="Full Name"
                            icon={<User size={20} />}
                            error={errors.name?.message}
                            {...register('name')}
                          />
                        </div>
                        <div>
                          <Input
                            type="tel"
                            placeholder="Phone Number"
                            icon={<Phone size={20} />}
                            error={errors.phone?.message}
                            {...register('phone')}
                          />
                        </div>
                        <div>
                          <Input
                            type="text"
                            placeholder="Street Address"
                            icon={<MapPin size={20} />}
                            error={errors.address?.street?.message}
                            {...register('address.street')}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            type="text"
                            placeholder="City"
                            error={errors.address?.city?.message}
                            {...register('address.city')}
                          />
                          <Input
                            type="text"
                            placeholder="State"
                            error={errors.address?.state?.message}
                            {...register('address.state')}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            type="text"
                            placeholder="Pincode"
                            error={errors.address?.pincode?.message}
                            {...register('address.pincode')}
                          />
                          <Input
                            type="text"
                            placeholder="Country"
                            error={errors.address?.country?.message}
                            {...register('address.country')}
                          />
                        </div>
                        <Button
                          type="submit"
                          variant="primary"
                          disabled={isLoading}
                          className="flex items-center gap-2"
                        >
                          {isLoading ? <LoadingSpinner size="small" /> : <Save size={16} />}
                          Save Changes
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <Card variant="premium">
                  <CardHeader>
                    <h3 className="text-lg font-serif font-semibold text-gray-800">
                      Quick Actions
                    </h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={() => router.push('/orders')}
                      className="flex items-center gap-2 justify-start"
                    >
                      <ShoppingBag size={20} />
                      My Orders
                    </Button>
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={() => router.push('/wishlist')}
                      className="flex items-center gap-2 justify-start"
                    >
                      <Heart size={20} />
                      Wishlist
                    </Button>
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={() => router.push('/settings')}
                      className="flex items-center gap-2 justify-start"
                    >
                      <Settings size={20} />
                      Settings
                    </Button>
                  </CardContent>
                </Card>

                <Card variant="premium">
                  <CardContent className="pt-6">
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={handleSignOut}
                      className="flex items-center gap-2 justify-center text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <LogOut size={20} />
                      Sign Out
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 