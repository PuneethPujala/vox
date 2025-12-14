import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can verify vendors
    const userRole = (session.user as { role: string }).role;
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { vendorId, action } = await request.json();

    if (!vendorId || !action) {
      return NextResponse.json({ error: 'Vendor ID and action are required' }, { status: 400 });
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Action must be either "approve" or "reject"' },
        { status: 400 }
      );
    }

    const verificationStatus = action === 'approve' ? 'VERIFIED' : 'REJECTED';

    const vendorProfile = await prisma.vendorProfile.update({
      where: { id: vendorId },
      data: { verificationStatus },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: `Vendor ${action}d successfully`,
      vendor: {
        id: vendorProfile.id,
        businessName: vendorProfile.businessName,
        verificationStatus: vendorProfile.verificationStatus,
        user: vendorProfile.user,
      },
    });
  } catch (error) {
    console.error('Vendor verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
