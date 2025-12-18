import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vendorName, email, contactPerson } = body;

    if (!vendorName || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingVendor = await prisma.vendorProfile.findUnique({
      where: { email },
    });

    if (existingVendor) {
      return NextResponse.json({ vendorId: existingVendor.id }, { status: 200 });
    }

    const vendor = await prisma.vendorProfile.create({
      data: {
        vendorName,
        email,
        contactPerson,
      },
    });

    return NextResponse.json({
      vendorId: vendor.id,
      message: 'Vendor profile created successfully',
    });
  } catch (error) {
    console.error('Profile creation error:', error);
    const message = error instanceof Error ? error.message : 'Profile creation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
    }

    const vendor = await prisma.vendorProfile.findUnique({
      where: { email },
      include: {
        documents: {
          orderBy: { uploadedAt: 'desc' },
        },
      },
    });

    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    return NextResponse.json(vendor);
  } catch (error) {
    console.error('Fetch profile error:', error);
    const message = error instanceof Error ? error.message : 'Fetch failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
