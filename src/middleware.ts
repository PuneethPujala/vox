import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Redirect to signin if not authenticated
    if (!token) {
      const signInUrl = new URL('/auth/signin', req.url);
      signInUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Role-based access control
    const userRole = token.role as string;

    // Admin routes - only allow ADMIN role
    if (pathname.startsWith('/admin')) {
      if (userRole !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    // Vendor routes - only allow VENDOR role with verified status
    if (pathname.startsWith('/vendor')) {
      if (userRole !== 'VENDOR') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }

      // Additional check for vendor verification would need to be done
      // in the page component since we don't have access to vendorProfile here
    }

    // Customer routes - allow CUSTOMER role
    if (pathname.startsWith('/customer')) {
      if (userRole !== 'CUSTOMER') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    // Protected dashboard routes
    if (pathname.startsWith('/dashboard')) {
      if (!['CUSTOMER', 'VENDOR', 'ADMIN'].includes(userRole)) {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/vendor/:path*', '/customer/:path*'],
};
