import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { prisma } from '@/shared/db';
import { getResend, FROM_ADDRESS } from './resend';
import { welcomeEmailHtml, welcomeEmailText } from '@/modules/auth/emails/welcome';
import { parseSignupRole, SIGNUP_ROLE_COOKIE } from './signupRole';

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
          legacyCapacity: user.legacyCapacity,
        };
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  events: {
    async createUser({ user }) {
      if (user.id) {
        try {
          const store = await cookies();
          const pending = store.get(SIGNUP_ROLE_COOKIE)?.value;
          store.delete(SIGNUP_ROLE_COOKIE);
          if (pending === 'TEACHER' || pending === 'STUDENT') {
            await prisma.user.update({
              where: { id: user.id },
              data: { role: pending, roleChosen: true },
            });
          }
        } catch {
          // Cookie store isn't always available in this event; jwt fallback below.
        }
      }
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
      const loadEntitlements = async (userId: string) => {
        const fresh = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            plan: true,
            role: true,
            planTier: true,
            roleChosen: true,
            createdAt: true,
            legacyCapacity: true,
            planExpiresAt: true,
            _count: { select: { taughtClasses: true } },
          },
        });
        if (!fresh) return;
        token.plan = fresh.plan;
        token.role = fresh.role;
        token.planTier = fresh.planTier;
        token.legacyCapacity = fresh.legacyCapacity;
        token.planExpiresAt = fresh.planExpiresAt ? fresh.planExpiresAt.toISOString() : null;
        token.ownsClass = fresh._count.taughtClasses > 0;
        // Existing Google accounts predate the picker — don't trap them on
        // /onboarding. Only brand-new signups (30 min) still get the gate.
        const accountAgeMs = Date.now() - fresh.createdAt.getTime();
        token.roleChosen =
          fresh.roleChosen ||
          fresh.role === 'TEACHER' ||
          fresh.role === 'ADMIN' ||
          accountAgeMs > 30 * 60 * 1000;
      };

      if (user) {
        token.id = user.id!;
        // Brand-new Google accounts: apply the signup-page role if createUser
        // couldn't touch cookies. Only for accounts created in the last 2 min
        // that still have the default unchosen student role.
        try {
          const store = await cookies();
          const pendingRaw = store.get(SIGNUP_ROLE_COOKIE)?.value;
          store.delete(SIGNUP_ROLE_COOKIE);
          const pending = pendingRaw === 'TEACHER' || pendingRaw === 'STUDENT' ? pendingRaw : null;
          if (pending && token.id) {
            const current = await prisma.user.findUnique({
              where: { id: token.id as string },
              select: { role: true, roleChosen: true, createdAt: true },
            });
            const ageMs = current ? Date.now() - current.createdAt.getTime() : Infinity;
            if (
              current &&
              current.role !== 'ADMIN' &&
              !current.roleChosen &&
              ageMs < 120_000
            ) {
              await prisma.user.update({
                where: { id: token.id as string },
                data: { role: parseSignupRole(pending), roleChosen: true },
              });
            }
          }
        } catch {
          /* ignore */
        }
        await loadEntitlements(token.id as string);
        token.refreshedAt = Date.now();
        return token;
      }
      // Re-read plan/role/planTier from the DB on an explicit update() OR when the
      // cached copy is older than the refresh window, so a billing/admin/onboarding
      // change surfaces on the next page load without forcing a re-login.
      // 10 min is long enough that a signed-in tab does not keep Neon compute
      // awake (scale-to-zero after 5 min idle). session.update() still refreshes now.
      const REFRESH_MS = 10 * 60 * 1000;
      const refreshedAt = typeof token.refreshedAt === 'number' ? token.refreshedAt : 0;
      const stale = Date.now() - refreshedAt > REFRESH_MS;
      if ((trigger === 'update' || stale) && token.id) {
        await loadEntitlements(token.id as string);
        token.refreshedAt = Date.now();
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.plan = token.plan as string;
      session.user.role = token.role as string;
      session.user.planTier = (token.planTier as string | null | undefined) ?? null;
      session.user.legacyCapacity = Boolean(token.legacyCapacity);
      session.user.planExpiresAt =
        typeof token.planExpiresAt === 'string' ? token.planExpiresAt : null;
      session.user.ownsClass = Boolean(token.ownsClass);
      session.user.roleChosen = Boolean(token.roleChosen);
      return session;
    },
  },
});
