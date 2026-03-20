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
    <div className="flex-1 flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Braces className="h-8 w-8 text-primary mx-auto mb-3" strokeWidth={2} />
          <h1 className="text-lg font-bold text-light-text">Create your account</h1>
          <p className="text-sm text-dark-text mt-1">
            Start practicing IGCSE pseudocode questions for free.
          </p>
        </div>

        <AuthForm mode="signup" />

        <p className="text-xs text-dark-text/50 text-center mt-6">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
