import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin');
  }

  const userRole = (session.user as { role: string }).role;

  if (userRole !== 'ADMIN') {
    redirect('/dashboard');
  }

  // Get vendor verification requests (pending ones)
  const pendingVendors = await prisma.vendorProfile.findMany({
    where: {
      verificationStatus: 'PENDING',
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Admin Dashboard</h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Manage users and vendor verification requests.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">⏳</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Pending Verifications
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">{pendingVendors.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Vendor Verifications */}
        <div className="mt-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Pending Vendor Verifications
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Review and approve vendor registration requests.
              </p>
            </div>

            {pendingVendors.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <div className="text-gray-400 text-lg">📋</div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No pending verifications</h3>
                <p className="mt-1 text-sm text-gray-500">
                  All vendor requests have been processed.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {pendingVendors.map((vendor) => (
                  <li key={vendor.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-blue-600 truncate">
                            {vendor.user.name} ({vendor.user.email})
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              {vendor.verificationStatus}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-900 font-medium">
                            Business: {vendor.businessName}
                          </p>
                          {vendor.businessDescription && (
                            <p className="text-sm text-gray-500">{vendor.businessDescription}</p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            Registered: {vendor.user.createdAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0 flex space-x-2">
                        <button
                          type="button"
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-xs font-medium"
                          onClick={async () => {
                            try {
                              const response = await fetch('/api/admin/verify-vendor', {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                  vendorId: vendor.id,
                                  action: 'approve',
                                }),
                              });

                              if (response.ok) {
                                window.location.reload();
                              }
                            } catch (error) {
                              console.error('Error approving vendor:', error);
                            }
                          }}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs font-medium"
                          onClick={async () => {
                            try {
                              const response = await fetch('/api/admin/verify-vendor', {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                  vendorId: vendor.id,
                                  action: 'reject',
                                }),
                              });

                              if (response.ok) {
                                window.location.reload();
                              }
                            } catch (error) {
                              console.error('Error rejecting vendor:', error);
                            }
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
