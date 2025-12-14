'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

// Type for user roles (since we can't use Prisma enums with SQLite)
export type UserRole = 'CUSTOMER' | 'VENDOR' | 'ADMIN';

// Hook for checking if user has specific role
export function useRole(requiredRole?: UserRole) {
  const { data: session, status } = useSession();
  const userRole = session?.user?.role as UserRole;

  if (!requiredRole) {
    return {
      hasRole: !!userRole,
      userRole,
      isLoading: status === 'loading',
    };
  }

  return {
    hasRole: userRole === requiredRole,
    userRole,
    isLoading: status === 'loading',
  };
}

// Hook for protecting routes based on role
export function useRoleGuard(requiredRole: UserRole, redirectTo = '/dashboard') {
  const { data: session, status } = useSession();
  const router = useRouter();
  const userRole = session?.user?.role as UserRole;

  useEffect(() => {
    if (status === 'loading') return; // Still loading
    if (!session) {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    if (userRole !== requiredRole) {
      router.push(redirectTo);
    }
  }, [session, status, userRole, requiredRole, redirectTo, router]);

  return {
    isAllowed: session && userRole === requiredRole,
    isLoading: status === 'loading',
    session,
  };
}

// Component for role-based rendering
interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
  requireAuth?: boolean;
}

export function RoleGuard({
  children,
  allowedRoles,
  fallback = null,
  requireAuth = true,
}: RoleGuardProps) {
  const { data: session, status } = useSession();
  const userRole = session?.user?.role as UserRole;

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (requireAuth && !session) {
    return fallback;
  }

  if (userRole && allowedRoles.includes(userRole)) {
    return <>{children}</>;
  }

  return fallback;
}

// Hook for checking vendor verification status
export function useVendorVerification() {
  const { data: session, status } = useSession();
  const userRole = session?.user?.role as UserRole;
  const isVendor = userRole === 'VENDOR';

  return {
    isVendor,
    isLoading: status === 'loading',
    isAuthenticated: !!session,
  };
}
