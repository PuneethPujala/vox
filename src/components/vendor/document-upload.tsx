'use client';

import { useState } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

interface DocumentUploadProps {
  vendorId: string;
  onUploadSuccess: () => void;
}

export function VendorDocumentUpload({ vendorId, onUploadSuccess }: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('vendorId', vendorId);

      const response = await fetch('/api/vendor/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }

      await response.json();
      setSuccess(`Document uploaded successfully: ${file.name}`);
      onUploadSuccess();

      const input = e.target;
      input.value = '';
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border rounded-lg p-6 space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Upload className="w-5 h-5" />
        Upload Document
      </h2>

      <div className="border-2 border-dashed rounded-lg p-6 text-center space-y-3">
        <p className="text-sm text-muted-foreground">
          Drag and drop your document or click to select
        </p>
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileSelect}
          disabled={uploading}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        />
        <label htmlFor="file-upload">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Select File'}
          </button>
        </label>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex gap-2">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      <div className="text-xs text-muted-foreground space-y-1">
        <p>Accepted formats: PDF, DOC, DOCX, JPG, PNG</p>
        <p>Maximum file size: 10 MB</p>
      </div>
    </div>
  );
}
