'use client';

import { useState } from 'react';
import { VendorDocumentUpload } from '@/components/vendor/document-upload';
import { VendorStatusTracker } from '@/components/vendor/status-tracker';
import { DocumentList } from '@/components/vendor/document-list';

interface VendorProfile {
  id: string;
  vendorName: string;
  email: string;
  verificationStatus: string;
  documents: Array<{
    id: string;
    fileName: string;
    status: string;
    uploadedAt: string;
    reviewerNotes?: string;
  }>;
}

export default function VendorDashboard() {
  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [vendorEmail, setVendorEmail] = useState('');

  const handleFetchProfile = async (email: string) => {
    setLoading(true);
    setVendorEmail(email);
    try {
      const response = await fetch(`/api/vendor/profile?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        setVendor(data);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to load profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      alert('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUploadSuccess = () => {
    if (vendorEmail) {
      handleFetchProfile(vendorEmail);
    }
  };

  if (!vendor && !loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Vendor Dashboard</h1>
            <p className="text-muted-foreground">Access your vendor verification dashboard</p>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Load Your Profile</h2>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleFetchProfile((e.target as HTMLInputElement).value);
                  }
                }}
              />
              <button
                onClick={(e) => {
                  const input = (e.target as HTMLButtonElement)
                    .previousElementSibling as HTMLInputElement;
                  handleFetchProfile(input.value);
                }}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Load Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Vendor Dashboard</h1>
          <p className="text-muted-foreground">{vendor.vendorName}</p>
        </div>

        <VendorStatusTracker vendor={vendor} />

        <div className="grid md:grid-cols-2 gap-8">
          <VendorDocumentUpload
            vendorId={vendor.id}
            onUploadSuccess={handleDocumentUploadSuccess}
          />
          <DocumentList documents={vendor.documents} />
        </div>
      </div>
    </div>
  );
}
