'use client';

import { useState, useEffect } from 'react';
import { VendorVerificationTable } from '@/components/admin/vendor-verification-table';

interface VendorDocument {
  id: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  status: string;
  vendor: {
    id: string;
    vendorName: string;
    email: string;
  };
}

export default function AdminVendorVerification() {
  const [documents, setDocuments] = useState<VendorDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingDocuments();
  }, []);

  const fetchPendingDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/vendor-verification?status=pending');
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }
      const data = await response.json();
      setDocuments(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load documents';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentAction = async (
    documentId: string,
    action: 'approve' | 'reject',
    reviewerNotes?: string
  ) => {
    try {
      const response = await fetch('/api/admin/vendor-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId,
          action,
          reviewerNotes,
        }),
      });

      if (!response.ok) {
        throw new Error('Action failed');
      }

      setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Action failed';
      alert(message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Vendor Verification</h1>
          <p className="text-muted-foreground">Review and approve vendor documents</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : documents.length === 0 ? (
          <div className="border rounded-lg p-8 text-center">
            <p className="text-muted-foreground">No pending documents to review</p>
          </div>
        ) : (
          <VendorVerificationTable documents={documents} onAction={handleDocumentAction} />
        )}
      </div>
    </div>
  );
}
