import { NextAuthOptions, User as NextAuthUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import dbConnect from './db';
import User from '@/models/User';

interface ExtendedUser extends NextAuthUser {
  id: string;
  location?: string;
  role: string;
}

interface CredentialsType {
  email: string;
  password: string;
  demo?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        demo: { label: 'Demo', type: 'boolean' }
      },
      async authorize(credentials: any) {
        try {
          // Handle demo login
          if (credentials?.demo) {
            return {
              id: 'demo-user-id',
              name: 'Demo User',
              email: 'demo@example.com',
              role: 'demo',
              _id: 'demo-user-id',
              location: 'Demo Location'
            } as ExtendedUser;
          }

          // Regular login flow
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Please provide both email and password');
          }

          // Demo mode - accept any non-empty email and password
          if (credentials.demo === 'true') {
            return {
              id: 'demo-user-id',
              _id: 'demo-user-id',
              name: 'Demo User',
              email: credentials.email,
              location: 'Demo Location',
              role: 'demo'
            } as ExtendedUser;
          }

          // Regular authentication flow
          await dbConnect();
          
          // Find user by email
          const user = await User.findOne({ email: credentials.email })
            .select('+password')
            .lean();

          if (!user) {
            throw new Error('No user found with this email');
          }

          // Check password
          const isValid = await compare(credentials.password, user.password);
          
          if (!isValid) {
            throw new Error('Invalid password');
          }

          // Return user object with required fields
          return {
            id: user._id.toString(),
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            location: user.location,
            role: 'user'
          } as ExtendedUser;
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Type assertion since we know we're setting the role in the authorize callback
        const extendedUser = user as unknown as ExtendedUser;
        token.id = extendedUser.id;
        token._id = extendedUser._id;
        token.name = extendedUser.name;
        token.email = extendedUser.email;
        token.role = extendedUser.role || 'user'; // Default to 'user' if role is not set
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user._id = token._id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key',
  debug: process.env.NODE_ENV === 'development',
};
