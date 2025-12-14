'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type UserType = 'customer' | 'vendor';

export default function SignUpPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<UserType>('customer');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Vendor-specific fields
    businessName: '',
    businessDescription: '',
    phoneNumber: '',
    address: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      let response;
      const commonData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      if (userType === 'customer') {
        response = await fetch('/api/auth/register-customer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(commonData),
        });
      } else {
        const vendorData = {
          ...commonData,
          businessName: formData.businessName,
          businessDescription: formData.businessDescription,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
        };

        response = await fetch('/api/auth/register-vendor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(vendorData),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        return;
      }

      setSuccess(data.message);

      // Redirect to signin page after 2 seconds
      setTimeout(() => {
        router.push('/auth/signin');
      }, 2000);
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Join Vox</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/auth/signin" className="font-medium text-blue-600 hover:text-blue-500">
              sign in to your account
            </Link>
          </p>
        </div>

        {/* User Type Selection */}
        <div className="flex justify-center space-x-4">
          <Button
            type="button"
            variant={userType === 'customer' ? 'default' : 'outline'}
            onClick={() => setUserType('customer')}
            className="flex-1"
          >
            Customer
          </Button>
          <Button
            type="button"
            variant={userType === 'vendor' ? 'default' : 'outline'}
            onClick={() => setUserType('vendor')}
            className="flex-1"
          >
            Vendor
          </Button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            {/* Vendor-specific fields */}
            {userType === 'vendor' && (
              <>
                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                    Business Name *
                  </label>
                  <Input
                    id="businessName"
                    name="businessName"
                    type="text"
                    required={userType === 'vendor'}
                    placeholder="Enter your business name"
                    value={formData.businessName}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="businessDescription"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Business Description
                  </label>
                  <Textarea
                    id="businessDescription"
                    name="businessDescription"
                    placeholder="Describe your business"
                    value={formData.businessDescription}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Business Address
                  </label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Enter your business address"
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
              </>
            )}
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {success && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="text-sm text-green-700">{success}</div>
            </div>
          )}

          <div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </div>

          <div className="text-xs text-center text-gray-500">
            {userType === 'vendor' &&
              'Vendor accounts require verification before access is granted.'}
          </div>
        </form>
      </div>
    </div>
  );
}
