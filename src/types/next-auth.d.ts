import { DefaultSession, DefaultUser } from 'next-auth';

// Type for user roles (since we can't use Prisma enums with SQLite)
export type UserRole = 'CUSTOMER' | 'VENDOR' | 'ADMIN';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role: UserRole;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole;
  }
}
