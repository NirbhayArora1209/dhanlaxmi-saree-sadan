import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    role: string;
    emailVerified: boolean;
    address?: {
      street: string;
      city: string;
      state: string;
      pincode: string;
      country: string;
    };
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      phone?: string;
      role: string;
      emailVerified: boolean;
      address?: {
        street: string;
        city: string;
        state: string;
        pincode: string;
        country: string;
      };
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    emailVerified: boolean;
    address?: {
      street: string;
      city: string;
      state: string;
      pincode: string;
      country: string;
    };
  }
}