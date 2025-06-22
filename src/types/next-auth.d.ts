// src/types/next-auth.d.ts
import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      profileCompleted: boolean; // ✅ Add this
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    profileCompleted: boolean; // ✅ Optional: Useful if using 'user' somewhere
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    name: string;
    email: string;
    profileCompleted: boolean; // ✅ Add this
  }
}
