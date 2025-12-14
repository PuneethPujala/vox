import { NextRequest, NextResponse } from 'next/server';
import { uploadFile } from '@/lib/storage';
import { sendEmail, getVendorDocumentSubmittedEmail } from '@/lib/email';
import { prisma } from '@/lib/prisma';

const ADMIN_EMAIL = 'admin@vox.local';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const vendorId = formData.get('vendorId') as string;

    if (!file || !vendorId) {
      return NextResponse.json({ error: 'Missing file or vendorId' }, { status: 400 });
    }

    const vendor = await prisma.vendorProfile.findUnique({
      where: { id: vendorId },
    });

    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResult = await uploadFile(buffer, file.name, file.type);

    const document = await prisma.vendorDocument.create({
      data: {
        vendorId,
        fileName: file.name,
        fileSize: uploadResult.size,
        fileType: uploadResult.type,
        filePath: uploadResult.path,
        status: 'pending',
      },
    });

    await sendEmail(getVendorDocumentSubmittedEmail(vendor.vendorName, ADMIN_EMAIL));

    return NextResponse.json({
      success: true,
      documentId: document.id,
      message: 'Document uploaded successfully',
    });
  } catch (error) {
    console.error('Upload error:', error);
    const message = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
