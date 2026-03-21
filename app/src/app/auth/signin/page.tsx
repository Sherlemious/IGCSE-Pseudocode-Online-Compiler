import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth, signIn } from '@/lib/auth';
import { Braces, Terminal } from 'lucide-react';
import AuthForm from '@/components/auth/AuthForm';

export const metadata: Metadata = { title: 'Sign In' };

export default async function SignInPage() {
  const session = await auth();
  if (session) redirect('/');

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-background bg-dot-grid p-4 relative">
      {/* Atmospheric gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(var(--color-primary-rgb), 0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative min-h-full flex items-start sm:items-center justify-center py-6">
        <div className="w-full max-w-sm relative animate-fade-in-up">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-surface border border-border flex items-center justify-center mx-auto mb-4 animate-glow-pulse">
              <Braces className="h-6 w-6 text-primary" strokeWidth={2} />
            </div>
            <h1 className="text-xl font-bold text-light-text tracking-tight">Welcome back</h1>
            <p className="text-sm text-dark-text mt-1.5">Sign in to track progress and unlock questions</p>
          </div>

          {/* Auth card */}
          <div
            className="bg-surface/80 backdrop-blur-sm rounded-xl border border-border p-6 card-glow"
            style={{ animationDelay: '100ms' }}
          >
            {/* OAuth providers */}
            <div className="space-y-2.5 stagger-children">
              <form
                action={async () => {
                  'use server';
                  await signIn('google', { redirectTo: '/practice' });
                }}
              >
                <button
                  type="submit"
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg
                  bg-background border border-border text-light-text text-sm font-medium
                  hover:border-primary/40 hover:bg-background/80 transition-all duration-200 group"
                >
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                    Continue with Google
                  </span>
                </button>
              </form>

              <form
                action={async () => {
                  'use server';
                  await signIn('github', { redirectTo: '/practice' });
                }}
              >
                <button
                  type="submit"
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg
                  bg-background border border-border text-light-text text-sm font-medium
                  hover:border-primary/40 hover:bg-background/80 transition-all duration-200 group"
                >
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                    Continue with GitHub
                  </span>
                </button>
              </form>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-surface px-3 mono-label text-dark-text/50 flex items-center gap-1.5">
                  <Terminal size={10} />
                  or use email
                </span>
              </div>
            </div>

            {/* Email/password form */}
            <AuthForm mode="signin" />
          </div>

          <p className="text-xs text-dark-text/60 text-center mt-5">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-primary hover:text-primary-hover transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
