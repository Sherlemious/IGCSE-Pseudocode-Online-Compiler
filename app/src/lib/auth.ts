import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
// import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
// import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

const authSecret =
  process.env.AUTH_SECRET ??
  process.env.NEXTAUTH_SECRET ??
  (process.env.NODE_ENV === 'development' ? 'local-dev-auth-secret-change-me' : undefined);

export const { handlers, signIn, signOut, auth } = NextAuth({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: PrismaAdapter(prisma) as any,
  secret: authSecret,
  session: { strategy: 'jwt' },
  providers: [
    Google({
      // Allows Google login to attach to an existing user with the same email.
      // This avoids OAuthAccountNotLinked loops when users first signed up with email/password.
      allowDangerousEmailAccountLinking: true,
    }),
    // GitHub({
    //   clientId: process.env.AUTH_GITHUB_ID!,
    //   clientSecret: process.env.AUTH_GITHUB_SECRET!,
    // }),
    // Credentials({
    //   name: 'Email',
    //   credentials: {
    //     email: { label: 'Email', type: 'email' },
    //     password: { label: 'Password', type: 'password' },
    //   },
    //   async authorize(credentials) {
    //     const email = (credentials?.email as string | undefined)?.trim().toLowerCase();
    //     const password = credentials?.password as string | undefined;
    //     if (!email || !password) return null;
    //
    //     const user = await prisma.user.findUnique({ where: { email } });
    //     if (!user?.password) return null;
    //
    //     const valid = await bcrypt.compare(password, user.password);
    //     if (!valid) return null;
    //
    //     return { id: user.id, name: user.name, email: user.email, image: user.image, plan: user.plan };
    //   },
    // }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.plan = (user as unknown as { plan: string }).plan;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.plan = token.plan as string;
      return session;
    },
  },
});
