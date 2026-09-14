import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import LinkedInProvider from 'next-auth/providers/linkedin';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from './prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile',
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'r_liteprofile r_emailaddress w_member_social',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' || account?.provider === 'linkedin') {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (existingUser) {
          // Update user with LinkedIn data if available
          if (account.provider === 'linkedin' && profile) {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                linkedinUrl: (profile as any).profileUrl || (profile as any).linkedinUrl,
                image: user.image || existingUser.image,
                name: user.name || existingUser.name,
              },
            });
          }
        }
      }
      return true;
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            role: true,
            title: true,
            company: true,
            linkedinUrl: true,
            githubUrl: true,
            twitterUrl: true,
            bio: true,
            location: true,
          },
        });
        if (dbUser) {
          session.user.role = dbUser.role;
          session.user.title = dbUser.title;
          session.user.company = dbUser.company;
          session.user.linkedinUrl = dbUser.linkedinUrl;
          session.user.githubUrl = dbUser.githubUrl;
          session.user.twitterUrl = dbUser.twitterUrl;
          session.user.bio = dbUser.bio;
          session.user.location = dbUser.location;
        }
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      title?: string | null;
      company?: string | null;
      linkedinUrl?: string | null;
      githubUrl?: string | null;
      twitterUrl?: string | null;
      bio?: string | null;
      location?: string | null;
    };
  }

  interface User {
    role?: string;
    title?: string | null;
    company?: string | null;
    linkedinUrl?: string | null;
    githubUrl?: string | null;
    twitterUrl?: string | null;
    bio?: string | null;
    location?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: string;
    accessToken?: string;
    provider?: string;
  }
}