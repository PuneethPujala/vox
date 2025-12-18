'use client';

import { useState } from 'react';
import { FileText, CheckCircle, XCircle } from 'lucide-react';

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

interface VerificationTableProps {
  documents: VendorDocument[];
  onAction: (documentId: string, action: 'approve' | 'reject', notes?: string) => void;
}

export function VendorVerificationTable({ documents, onAction }: VerificationTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState<string | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleApprove = async (documentId: string) => {
    setProcessing(documentId);
    try {
      await onAction(documentId, 'approve');
      setExpandedId(null);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (documentId: string) => {
    const reviewNotes = notes[documentId] || '';
    if (!reviewNotes.trim()) {
      alert('Please provide reviewer notes for rejection');
      return;
    }
    setProcessing(documentId);
    try {
      await onAction(documentId, 'reject', reviewNotes);
      setNotes((prev) => {
        const newNotes = { ...prev };
        delete newNotes[documentId];
        return newNotes;
      });
      setExpandedId(null);
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted">
              <th className="px-6 py-3 text-left font-semibold">Vendor</th>
              <th className="px-6 py-3 text-left font-semibold">Document</th>
              <th className="px-6 py-3 text-left font-semibold">File Size</th>
              <th className="px-6 py-3 text-left font-semibold">Submitted</th>
              <th className="px-6 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} className="border-b hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium">{doc.vendor.vendorName}</p>
                    <p className="text-xs text-muted-foreground">{doc.vendor.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <p className="truncate">{doc.fileName}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs">{formatFileSize(doc.fileSize)}</td>
                <td className="px-6 py-4 text-xs text-muted-foreground">
                  {formatDate(doc.uploadedAt)}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => setExpandedId(expandedId === doc.id ? null : doc.id)}
                    className="px-3 py-1 text-xs rounded border hover:bg-muted transition-colors"
                  >
                    {expandedId === doc.id ? 'Hide' : 'Review'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {expandedId && (
        <div className="border-t p-6 bg-muted/30 space-y-4">
          <div className="space-y-4">
            {documents.map((doc) => {
              if (doc.id !== expandedId) return null;
              return (
                <div key={doc.id} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Vendor Name</p>
                      <p className="font-medium">{doc.vendor.vendorName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-mono text-xs">{doc.vendor.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Document</p>
                      <p className="text-sm">{doc.fileName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">File Size</p>
                      <p className="text-sm">{formatFileSize(doc.fileSize)}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground block mb-2">
                      Reviewer Notes (required for rejection)
                    </label>
                    <textarea
                      value={notes[doc.id] || ''}
                      onChange={(e) =>
                        setNotes((prev) => ({
                          ...prev,
                          [doc.id]: e.target.value,
                        }))
                      }
                      placeholder="Enter any feedback or revision requests..."
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={3}
                      disabled={processing === doc.id}
                    />
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => handleApprove(doc.id)}
                      disabled={processing === doc.id}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(doc.id)}
                      disabled={processing === doc.id}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
