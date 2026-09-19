'use client';

import { SessionProvider } from 'next-auth/react';

export default function SessionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false} refetchWhenOffline={false}>
      {children}
    </SessionProvider>
  );
}
