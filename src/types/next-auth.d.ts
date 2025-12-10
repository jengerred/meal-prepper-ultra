import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    _id: string;
    name?: string | null;
    email?: string | null;
    location?: string | null;
  }

  interface Session {
    user: {
      id: string;
      _id: string;
      name?: string | null;
      email?: string | null;
      location?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    _id: string;
    name?: string | null;
    email?: string | null;
  }
}
