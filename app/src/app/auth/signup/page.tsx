import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { Braces } from 'lucide-react';
import AuthForm from '@/components/auth/AuthForm';

export const metadata: Metadata = { title: 'Sign Up' };

export default async function SignUpPage() {
  const session = await auth();
  if (session) redirect('/');

  return (
    <div className="flex-1 flex items-center justify-center bg-background bg-dot-grid p-4 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(var(--color-primary-rgb), 0.06) 0%, transparent 70%)',
        }}
      />

      <div className="w-full max-w-sm relative animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-surface border border-border flex items-center justify-center mx-auto mb-4 animate-glow-pulse">
            <Braces className="h-6 w-6 text-primary" strokeWidth={2} />
          </div>
          <h1 className="text-xl font-bold text-light-text tracking-tight">Create your account</h1>
          <p className="text-sm text-dark-text mt-1.5">
            Start practicing IGCSE pseudocode for free
          </p>
        </div>

        <div className="bg-surface/80 backdrop-blur-sm rounded-xl border border-border p-6 card-glow">
          <AuthForm mode="signup" />
        </div>

        <p className="text-xs text-dark-text/60 text-center mt-5">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-primary hover:text-primary-hover transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
