import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  sendEmail,
  getVendorDocumentApprovedEmail,
  getVendorDocumentRejectedEmail,
} from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    const status = request.nextUrl.searchParams.get('status');

    const pendingDocuments = await prisma.vendorDocument.findMany({
      where: status ? { status } : {},
      include: {
        vendor: true,
      },
      orderBy: { uploadedAt: 'desc' },
    });

    return NextResponse.json(pendingDocuments);
  } catch (error) {
    console.error('Fetch pending documents error:', error);
    const message = error instanceof Error ? error.message : 'Fetch failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { documentId, action, reviewerNotes } = body;

    if (!documentId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const document = await prisma.vendorDocument.findUnique({
      where: { id: documentId },
      include: { vendor: true },
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const newStatus = action === 'approve' ? 'approved' : 'rejected';

    const updatedDocument = await prisma.vendorDocument.update({
      where: { id: documentId },
      data: {
        status: newStatus,
        reviewerNotes: reviewerNotes || null,
        reviewedAt: new Date(),
      },
    });

    if (action === 'approve') {
      await prisma.vendorProfile.update({
        where: { id: document.vendorId },
        data: { verificationStatus: 'approved' },
      });

      await sendEmail(
        getVendorDocumentApprovedEmail(document.vendor.vendorName, document.vendor.email)
      );
    } else {
      await sendEmail(
        getVendorDocumentRejectedEmail(
          document.vendor.vendorName,
          document.vendor.email,
          reviewerNotes || 'No specific notes provided'
        )
      );
    }

    return NextResponse.json({
      success: true,
      document: updatedDocument,
      message: `Document ${action}ed successfully`,
    });
  } catch (error) {
    console.error('Verification action error:', error);
    const message = error instanceof Error ? error.message : 'Action failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
