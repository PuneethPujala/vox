import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
// import { UserRole } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, businessName, businessDescription, phoneNumber, address } =
      await request.json();

    // Validate input
    if (!name || !email || !password || !businessName) {
      return NextResponse.json(
        { error: 'Name, email, password, and business name are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user and vendor profile in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user as VENDOR
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'VENDOR',
        },
      });

      // Create vendor profile with PENDING verification status
      const vendorProfile = await tx.vendorProfile.create({
        data: {
          userId: user.id,
          businessName,
          businessDescription,
          phoneNumber,
          address,
          verificationStatus: 'PENDING',
        },
      });

      return { user, vendorProfile };
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = result.user;

    return NextResponse.json(
      {
        message: 'Vendor registered successfully. Your account is pending verification.',
        user: userWithoutPassword,
        vendorProfile: {
          businessName: result.vendorProfile.businessName,
          verificationStatus: result.vendorProfile.verificationStatus,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Vendor registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
