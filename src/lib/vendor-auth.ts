import { prisma } from '@/lib/prisma';

export async function isVendorVerified(vendorEmail: string): Promise<boolean> {
  try {
    const vendor = await prisma.vendorProfile.findUnique({
      where: { email: vendorEmail },
    });

    return vendor?.verificationStatus === 'approved';
  } catch {
    return false;
  }
}

export async function getVendorVerificationStatus(vendorEmail: string): Promise<string | null> {
  try {
    const vendor = await prisma.vendorProfile.findUnique({
      where: { email: vendorEmail },
    });

    return vendor?.verificationStatus || null;
  } catch {
    return null;
  }
}

export function requireVendorVerification(verificationStatus: string | null): boolean {
  return verificationStatus === 'approved';
}
