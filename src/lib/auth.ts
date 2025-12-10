import { NextAuthOptions, User as NextAuthUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { Document } from 'mongoose';
import dbConnect from './db';
import User from '@/models/User';

// For demo purposes - in production, set NEXTAUTH_SECRET environment variable
const isProduction = process.env.NODE_ENV === 'production';
const secret = process.env.NEXTAUTH_SECRET || (isProduction ? undefined : 'demo-secret-change-in-production');

interface UserDocument extends Document {
  _id: any;
  email: string;
  password: string;
  name: string;
  location?: string;
}

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
  secret, // Use the secret we defined above
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
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
          // Validate credentials
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
            .lean()
            .exec() as UserDocument | null;

          if (!user) {
            throw new Error('No user found with this email');
          }
          if (!user!.password) {
            throw new Error('User has no password set');
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
        return {
          ...token,
          id: extendedUser.id,
          _id: extendedUser._id || extendedUser.id,
          role: extendedUser.role || 'user',
          name: extendedUser.name,
          email: extendedUser.email
        };
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
  debug: !isProduction,
};
