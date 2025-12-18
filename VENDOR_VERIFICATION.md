# Vendor Verification Flow

This document describes the complete vendor verification system implemented in Vox.

## Overview

The vendor verification flow allows vendors to submit documents for verification, enables admins to review and approve/reject submissions, and enforces authorization checks to ensure only verified vendors can access product management features.

## Features

### 1. Vendor Document Management

- **Model**: `VendorDocument` and `VendorProfile` tables in PostgreSQL
- **Fields Tracked**:
  - File metadata (name, size, type, path)
  - Status (pending, approved, rejected)
  - Reviewer notes for rejection feedback
  - Upload and review timestamps

### 2. Secure File Upload

- **Endpoint**: `POST /api/vendor/upload`
- **Validation**:
  - File size limits (configurable, default 10 MB)
  - File type whitelist (PDF, images, Word documents)
  - Secure streaming to local storage or S3-compatible buckets
- **Storage Options**:
  - Local filesystem storage (for development)
  - S3-compatible storage (configurable via environment variables)

### 3. Vendor Dashboard

- **URL**: `/vendor-dashboard`
- **Features**:
  - View vendor profile and verification status
  - Upload documents
  - Track submission status
  - Receive feedback on rejected documents
  - Resubmit revised documents

### 4. Admin Panel

- **URL**: `/admin/vendor-verification`
- **Features**:
  - List all pending vendor document submissions
  - Review vendor and document details
  - Approve submissions (updates vendor status to "approved")
  - Reject submissions with reviewer notes
  - Send notification emails to vendors

### 5. Authorization Helper

- **Module**: `src/lib/vendor-auth.ts`
- **Functions**:
  - `isVendorVerified(vendorEmail)` - Check if vendor is approved
  - `getVendorVerificationStatus(vendorEmail)` - Get current status
  - `requireVendorVerification(status)` - Validate access
- **Usage**: Protects product management routes from unverified vendors

### 6. Product Management Access Control

- **Endpoint**: `GET /api/product-management`
- **Behavior**:
  - Returns 403 Forbidden if vendor is not verified
  - Returns 200 OK if vendor is approved
  - Can be used to enforce access in client-side or server-side logic

## Database Schema

### VendorProfile Table

```
- id (String, primary key)
- vendorName (String)
- email (String, unique)
- contactPerson (String, optional)
- verificationStatus (String, default: "pending")
- documents (relation to VendorDocument[])
- createdAt, updatedAt (timestamps)
```

### VendorDocument Table

```
- id (String, primary key)
- vendorId (String, foreign key)
- vendor (relation to VendorProfile)
- fileName (String)
- fileSize (Int)
- fileType (String)
- filePath (String)
- status (String, default: "pending")
- reviewerNotes (String, optional)
- uploadedAt (DateTime)
- reviewedAt (DateTime, optional)
- updatedAt (DateTime)
```

## API Endpoints

### Vendor Profile Management

```
POST /api/vendor/profile
- Creates or returns existing vendor profile
- Request: { vendorName, email, contactPerson? }
- Response: { vendorId }

GET /api/vendor/profile?email=<email>
- Retrieves vendor profile with documents
- Response: { VendorProfile with nested documents }
```

### Document Upload

```
POST /api/vendor/upload
- Uploads a document for a vendor
- Body: FormData with 'file' and 'vendorId'
- Response: { success, documentId, message }
- Errors: 400, 404, 500
```

### Admin Verification Management

```
GET /api/admin/vendor-verification?status=<status>
- Lists pending or all documents for review
- Optional status filter: "pending", "approved", "rejected"
- Response: [VendorDocument[]]

POST /api/admin/vendor-verification
- Approves or rejects a document
- Request: { documentId, action, reviewerNotes? }
- Actions: "approve" or "reject"
- Response: { success, document, message }
- Side effects: Updates vendor status, sends email
```

### Product Management Access Control

```
GET /api/product-management?vendorEmail=<email>
- Checks if vendor is verified for product access
- Response (403): { error, status }
- Response (200): { message, vendorEmail, verificationStatus }

POST /api/product-management
- Performs product action for verified vendor only
- Request: { vendorEmail, action }
- Response (403): { error, status }
- Response (200): { message, vendorEmail, verificationStatus }
```

## Environment Configuration

### File Storage

```
# Storage type: "local" or "s3"
STORAGE_TYPE=local

# Local storage path
LOCAL_STORAGE_PATH=./uploads

# S3 Configuration
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=vendor-documents
S3_REGION=us-east-1
```

### File Upload Constraints

```
# Maximum file size in bytes (default: 10 MB)
MAX_FILE_SIZE=10485760

# Allowed MIME types (comma-separated)
ALLOWED_FILE_TYPES=application/pdf,image/jpeg,image/png,application/msword,...
```

## Notification System

### Email Notifications (Stub Implementation)

The email system uses console logging for development. In production, integrate with an email provider:

- **Vendor Document Approved**: Notifies vendor of approval and access to product features
- **Vendor Document Rejected**: Sends reviewer notes and requests resubmission
- **Vendor Submission Received**: Notifies admins of new documents to review

Console output format:

```
[Email Stub] Sending email:
  To: vendor@example.com
  Subject: Your vendor verification documents have been approved
  Body: ...
```

## Usage Flow

### For Vendors

1. Navigate to `/vendor-dashboard`
2. Enter your email to load/create vendor profile
3. Upload verification documents
4. Monitor document status
5. Receive notification when approved
6. Access `/product-management` to manage products

### For Admins

1. Navigate to `/admin/vendor-verification`
2. Review pending vendor submissions
3. Add reviewer notes if needed
4. Click "Approve" or "Reject"
5. Vendor receives automatic email notification

### For Product Management

1. Vendor checks access via `/product-management` with their email
2. If verified: access granted, can use product APIs
3. If not verified: receive 403 Forbidden error with status
4. Vendor can then submit documents for verification

## Authorization Middleware Example

To protect product management routes, use the authorization helper:

```typescript
import { getVendorVerificationStatus, requireVendorVerification } from '@/lib/vendor-auth';

// In API route
export async function POST(request: NextRequest) {
  const vendorEmail = extractVendorEmail(request);
  const status = await getVendorVerificationStatus(vendorEmail);

  if (!requireVendorVerification(status)) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  // Proceed with product management logic
}
```

## File Storage Details

### Local Storage

- Files are stored in the `./uploads` directory
- File names are sanitized and prefixed with timestamps
- Full file path is stored in the database

### S3 Storage (Stubbed)

- Configuration via environment variables
- Upload path: `vendor-documents/{timestamp}-{filename}`
- Currently logs to console (ready for actual S3 integration)

## Testing the System

### Create a Test Vendor Profile

```bash
curl -X POST http://localhost:3000/api/vendor/profile \
  -H "Content-Type: application/json" \
  -d '{"vendorName": "Test Vendor", "email": "test@vendor.com", "contactPerson": "John Doe"}'
```

### Upload a Document

```bash
curl -X POST http://localhost:3000/api/vendor/upload \
  -F "file=@document.pdf" \
  -F "vendorId=<vendor-id>"
```

### Check Vendor Status

```bash
curl http://localhost:3000/api/vendor/profile?email=test@vendor.com
```

### List Pending Documents (Admin)

```bash
curl http://localhost:3000/api/admin/vendor-verification?status=pending
```

### Approve a Document (Admin)

```bash
curl -X POST http://localhost:3000/api/admin/vendor-verification \
  -H "Content-Type: application/json" \
  -d '{"documentId": "<doc-id>", "action": "approve"}'
```

### Check Product Management Access

```bash
curl "http://localhost:3000/api/product-management?vendorEmail=test@vendor.com"
```

## Future Enhancements

- Real email service integration (SendGrid, AWS SES, etc.)
- Actual S3 implementation with presigned URLs for downloads
- Document versioning and rollback
- Audit logging for all admin actions
- Automated email reminders for vendors with pending reviews
- Admin dashboard analytics and metrics
- Two-factor authentication for vendor accounts
- Document encryption for sensitive files
- Integration with payment processors for vendor fees

## Security Considerations

- File uploads are validated for size and type
- File paths are sanitized to prevent directory traversal
- Vendor email is unique per profile
- Verification status is checked server-side before granting access
- Admin actions update database and trigger notifications
- Email notifications are sent asynchronously

## Troubleshooting

### Database Connection Issues

- Ensure `DATABASE_URL` is set correctly in `.env`
- Run `npm run prisma:migrate` to create tables

### File Upload Failures

- Check `MAX_FILE_SIZE` is not too small
- Verify `ALLOWED_FILE_TYPES` includes the file's MIME type
- Ensure `LOCAL_STORAGE_PATH` directory exists

### Missing Notifications

- Check console output for email logs
- Verify admin email configuration

### Authorization Failures

- Confirm vendor email matches profile in database
- Check vendor's `verificationStatus` is "approved"
- Ensure Prisma client is properly initialized
