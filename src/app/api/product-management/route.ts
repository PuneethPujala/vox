import { NextRequest, NextResponse } from 'next/server';
import { getVendorVerificationStatus, requireVendorVerification } from '@/lib/vendor-auth';

export async function GET(request: NextRequest) {
  try {
    const vendorEmail = request.nextUrl.searchParams.get('vendorEmail');

    if (!vendorEmail) {
      return NextResponse.json({ error: 'vendorEmail parameter is required' }, { status: 400 });
    }

    const verificationStatus = await getVendorVerificationStatus(vendorEmail);

    if (!requireVendorVerification(verificationStatus)) {
      return NextResponse.json(
        {
          error:
            'Access denied. Vendor verification is required to access product management features.',
          status: verificationStatus,
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      message: 'Access granted. Vendor is verified.',
      vendorEmail,
      verificationStatus,
    });
  } catch (error) {
    console.error('Product management access error:', error);
    const message = error instanceof Error ? error.message : 'Access check failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vendorEmail, action } = body;

    if (!vendorEmail) {
      return NextResponse.json({ error: 'vendorEmail is required' }, { status: 400 });
    }

    const verificationStatus = await getVendorVerificationStatus(vendorEmail);

    if (!requireVendorVerification(verificationStatus)) {
      return NextResponse.json(
        {
          error: 'Access denied. Vendor verification is required.',
          status: verificationStatus,
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      message: `Product management action '${action}' executed successfully for verified vendor`,
      vendorEmail,
      verificationStatus,
    });
  } catch (error) {
    console.error('Product management action error:', error);
    const message = error instanceof Error ? error.message : 'Action failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
