'use client';

import { useState } from 'react';
import { AlertCircle, Lock, Package } from 'lucide-react';

export default function ProductManagement() {
  const [vendorEmail, setVendorEmail] = useState('');
  const [accessResult, setAccessResult] = useState<{
    granted: boolean;
    message: string;
    status?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const checkAccess = async () => {
    if (!vendorEmail) {
      alert('Please enter a vendor email');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/product-management?vendorEmail=${encodeURIComponent(vendorEmail)}`
      );
      const data = await response.json();

      if (response.ok) {
        setAccessResult({
          granted: true,
          message: data.message,
          status: data.verificationStatus,
        });
      } else {
        setAccessResult({
          granted: false,
          message: data.error,
          status: data.status,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setAccessResult({
        granted: false,
        message: 'Failed to check access',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Product Management</h1>
          <p className="text-muted-foreground">Access your product listing and management tools</p>
        </div>

        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Vendor Verification Check
          </h2>

          <p className="text-sm text-muted-foreground">
            This area is restricted to verified vendors only. Enter your email to check your
            verification status.
          </p>

          <div className="space-y-3">
            <input
              type="email"
              placeholder="Enter your email"
              value={vendorEmail}
              onChange={(e) => setVendorEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && checkAccess()}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              onClick={checkAccess}
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4" />
              {loading ? 'Checking...' : 'Check Access'}
            </button>
          </div>

          {accessResult && (
            <div
              className={`p-4 rounded-lg border ${
                accessResult.granted ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex gap-3">
                {accessResult.granted ? (
                  <Package className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      accessResult.granted ? 'text-green-800' : 'text-red-800'
                    }`}
                  >
                    {accessResult.granted ? 'Access Granted' : 'Access Denied'}
                  </p>
                  <p
                    className={`text-sm mt-1 ${
                      accessResult.granted ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {accessResult.message}
                  </p>
                  {accessResult.status && (
                    <p className="text-xs mt-2 opacity-75">Status: {accessResult.status}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border rounded-lg p-6 space-y-4 bg-muted/50">
          <h3 className="font-semibold">About Vendor Verification</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-blue-600">•</span>
              <span>Only verified vendors can access product management features</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600">•</span>
              <span>Submit your documents in the vendor dashboard</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600">•</span>
              <span>Wait for admin review and approval</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600">•</span>
              <span>Once approved, you can manage your products</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
