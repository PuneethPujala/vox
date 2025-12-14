import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin');
  }

  const userRole = (session.user as { role: string }).role;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Welcome to Vox Dashboard
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Hello {session.user.name}, you are logged in as a {userRole.toLowerCase()}.
          </p>
        </div>

        <div className="mt-10">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Dashboard Content</h3>
              <div className="mt-2 max-w-4xl text-sm text-gray-500">
                <p>
                  This is your main dashboard. As a {userRole.toLowerCase()}, you have access to
                  role-specific features and content.
                </p>
                {userRole === 'VENDOR' && (
                  <div className="mt-4 p-4 bg-yellow-50 rounded-md">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> Your vendor account is pending verification. You will
                      have full access once your business details are approved.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
