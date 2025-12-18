'use client';

import { FileText, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface Document {
  id: string;
  fileName: string;
  status: string;
  uploadedAt: string;
  reviewerNotes?: string;
}

interface DocumentListProps {
  documents: Document[];
}

export function DocumentList({ documents }: DocumentListProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Pending';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (documents.length === 0) {
    return (
      <div className="border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">Submitted Documents</h2>
        <p className="text-muted-foreground text-sm">No documents submitted yet.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-6 space-y-4">
      <h2 className="text-lg font-semibold">Submitted Documents</h2>

      <div className="space-y-2">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{doc.fileName}</p>
              <p className="text-xs text-muted-foreground">{formatDate(doc.uploadedAt)}</p>
              {doc.reviewerNotes && (
                <p className="text-xs text-red-600 mt-1">{doc.reviewerNotes}</p>
              )}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {getStatusIcon(doc.status)}
              <span className="text-xs font-medium">{getStatusText(doc.status)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
