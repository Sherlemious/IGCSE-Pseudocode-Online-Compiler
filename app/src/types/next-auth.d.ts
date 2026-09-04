import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      plan: string; // 'FREE' | 'STUDENT' | 'STARTER' | 'PRO' | 'SCHOOL'
      role: string; // 'STUDENT' | 'TEACHER' | 'ADMIN'
      planTier?: string | null; // marketing tier slug for display, set by the billing webhook
    };
  }

  interface User {
    plan: string;
    role: string;
    planTier?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    plan: string;
    role: string;
    planTier?: string | null;
    refreshedAt?: number; // epoch ms of the last DB re-read of plan/role/planTier
  }
}
