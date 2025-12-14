import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function VendorDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin');
  }

  const userRole = (session.user as any).role;

  if (userRole !== 'VENDOR') {
    redirect('/dashboard');
  }

  // Get vendor profile to check verification status
  const userId = (session.user as any).id;
  const vendorProfile = await prisma.vendorProfile.findUnique({
    where: { userId },
  });

  if (!vendorProfile) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Vendor Dashboard</h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Unable to load vendor profile.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isVerified = vendorProfile.verificationStatus === 'VERIFIED';
  const isPending = vendorProfile.verificationStatus === 'PENDING';
  const isRejected = vendorProfile.verificationStatus === 'REJECTED';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Vendor Dashboard</h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Welcome back, {session.user.name}! Manage your business on Vox.
          </p>
        </div>

        {/* Verification Status */}
        <div className="mt-8">
          <div
            className={`overflow-hidden shadow rounded-lg ${isVerified ? 'bg-green-50' : isPending ? 'bg-yellow-50' : 'bg-red-50'}`}
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {isVerified && <div className="h-6 w-6 text-green-600">✓</div>}
                  {isPending && <div className="h-6 w-6 text-yellow-600">⏳</div>}
                  {isRejected && <div className="h-6 w-6 text-red-600">✗</div>}
                </div>
                <div className="ml-3">
                  <h3
                    className={`text-lg leading-6 font-medium ${isVerified ? 'text-green-900' : isPending ? 'text-yellow-900' : 'text-red-900'}`}
                  >
                    Account Status: {vendorProfile.verificationStatus}
                  </h3>
                  <div
                    className={`mt-2 max-w-4xl text-sm ${isVerified ? 'text-green-700' : isPending ? 'text-yellow-700' : 'text-red-700'}`}
                  >
                    {isVerified && (
                      <p>
                        Congratulations! Your vendor account has been verified. You now have full
                        access to all vendor features.
                      </p>
                    )}
                    {isPending && (
                      <p>
                        Your vendor account is currently under review. You will receive an email
                        once the verification process is complete.
                      </p>
                    )}
                    {isRejected && (
                      <p>
                        Your vendor account verification was rejected. Please contact support for
                        more information.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="mt-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Business Information</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Business Name</label>
                  <p className="mt-1 text-sm text-gray-900">{vendorProfile.businessName}</p>
                </div>

                {vendorProfile.businessDescription && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Business Description
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {vendorProfile.businessDescription}
                    </p>
                  </div>
                )}

                {vendorProfile.phoneNumber && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <p className="mt-1 text-sm text-gray-900">{vendorProfile.phoneNumber}</p>
                  </div>
                )}

                {vendorProfile.address && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Business Address
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{vendorProfile.address}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Vendor Features (only if verified) */}
        {isVerified && (
          <div className="mt-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Vendor Features</h3>
                <div className="mt-2 max-w-4xl text-sm text-gray-500">
                  <p>
                    This section will contain vendor-specific features like product management,
                    orders, analytics, etc.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
