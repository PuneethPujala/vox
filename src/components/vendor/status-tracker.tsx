'use client';

import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

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

interface StatusTrackerProps {
  vendor: VendorProfile;
}

export function VendorStatusTracker({ vendor }: StatusTrackerProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Verified';
      case 'rejected':
        return 'Needs Revision';
      default:
        return 'Pending Review';
    }
  };

  return (
    <div className="border rounded-lg p-6 space-y-4">
      <h2 className="text-lg font-semibold">Verification Status</h2>

      <div className="flex items-center gap-3">
        {getStatusIcon(vendor.verificationStatus)}
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">Current Status</p>
          <p className="text-lg font-semibold">{vendor.vendorName}</p>
        </div>
        <Badge className={getStatusColor(vendor.verificationStatus)}>
          {getStatusText(vendor.verificationStatus)}
        </Badge>
      </div>

      <div className="space-y-2 pt-4 border-t">
        <p className="text-sm font-medium">Details</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Email</p>
            <p className="font-mono text-xs">{vendor.email}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Documents Submitted</p>
            <p className="font-medium">{vendor.documents.length}</p>
          </div>
        </div>
      </div>

      {vendor.verificationStatus === 'rejected' && vendor.documents.length > 0 && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs font-medium text-red-800 mb-1">Revision Required</p>
          <p className="text-xs text-red-700">
            {vendor.documents[0].reviewerNotes ||
              'Please review the feedback and resubmit your documents.'}
          </p>
        </div>
      )}
    </div>
  );
}
