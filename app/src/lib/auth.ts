import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import { getResend, FROM_ADDRESS } from './resend';
import { welcomeEmailHtml, welcomeEmailText } from '@/emails/welcome';

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
    Credentials({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = (credentials?.email as string | undefined)?.trim().toLowerCase();
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        // No password set => the account exists only via OAuth (e.g. Google).
        // Refuse credentials login until they set a password in their profile,
        // so an OAuth account can't be hijacked by guessing the email.
        if (!user?.password) return null;

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          plan: user.plan,
          role: user.role,
          planTier: user.planTier,
        };
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  events: {
    async createUser({ user }) {
      if (!user.email) return;
      const resend = getResend();
      if (!resend) return;
      const name = user.name ?? 'Student';
      await resend.emails.send({
        from: FROM_ADDRESS,
        to: user.email,
        subject: 'Welcome to the IGCSE Pseudocode Compiler',
        html: welcomeEmailHtml(name),
        text: welcomeEmailText(name),
      }).catch(() => {}); // non-critical — don't break sign-in if email fails
    },
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id!;
        token.plan = (user as unknown as { plan: string }).plan;
        token.role = (user as unknown as { role: string }).role;
        token.planTier = (user as unknown as { planTier?: string | null }).planTier ?? null;
      } else if (trigger === 'update' && token.id) {
        // Client called session.update() (e.g. after onboarding picks a role, or
        // a plan change). Re-read the authoritative values so the session reflects
        // the DB without forcing a re-login. Kept off the hot path — only on update.
        const fresh = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { plan: true, role: true, planTier: true },
        });
        if (fresh) {
          token.plan = fresh.plan;
          token.role = fresh.role;
          token.planTier = fresh.planTier;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.plan = token.plan as string;
      session.user.role = token.role as string;
      session.user.planTier = (token.planTier as string | null | undefined) ?? null;
      return session;
    },
  },
});
