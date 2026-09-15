'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import { Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { safeCallback } from './callback';
import RoleToggle from './RoleToggle';
import type { SignupRole } from './signupRole';

interface AuthFormProps {
  mode: 'signin' | 'signup';
  callbackUrl?: string;
  /**
   * When provided, a successful credentials sign-in calls this instead of
   * navigating away. Used by the in-page grade auth sheet so the student stays
   * on the question and grades in place. `callbackUrl` is ignored in this case.
   */
  onAuthenticated?: () => void | Promise<void>;
  /** Controlled signup role. When set, the in-form role picker is hidden. */
  role?: SignupRole;
  /** If set, fires `sign_in_clicked` with this `source` when the form is submitted. */
  analyticsSource?: string;
}

export default function AuthForm({ mode, callbackUrl, onAuthenticated, role: roleProp, analyticsSource }: AuthFormProps) {
  const router = useRouter();
  const ph = usePostHog();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [internalRole, setInternalRole] = useState<SignupRole>('STUDENT');
  const role = roleProp ?? internalRole;
  const showRolePicker = mode === 'signup' && roleProp === undefined;
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (analyticsSource) ph?.capture('sign_in_clicked', { source: analyticsSource });

    try {
      if (mode === 'signup') {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, role }),
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || 'Sign up failed');
          setLoading(false);
          return;
        }
      }

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(
          mode === 'signin' ? 'Invalid email or password' : 'Account created but sign in failed. Try signing in.'
        );
        setLoading(false);
        return;
      }

      // Stay on the page when the caller wants to handle the authenticated
      // state in place (e.g. the practice grade sheet).
      if (onAuthenticated) {
        try {
          await onAuthenticated();
        } finally {
          setLoading(false);
        }
        return;
      }

      const fallback = mode === 'signup' && role === 'TEACHER' ? '/classes' : '/practice';
      router.push(safeCallback(callbackUrl, fallback));
      router.refresh();
    } catch {
      setError('Something went wrong');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      {error && (
        <div className="flex items-start gap-2.5 text-xs text-error bg-error/8 border border-error/15 rounded-lg px-3.5 py-2.5 animate-scale-in">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {showRolePicker && <RoleToggle role={role} onChange={setInternalRole} />}

      {mode === 'signup' && (
        <div className="group">
          <label htmlFor="name" className="mono-label text-dark-text mb-1.5 block">
            Name <span className="text-dark-text/40 normal-case tracking-normal">(optional)</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-light-text text-sm
              placeholder:text-dark-text/30 focus:outline-none input-glow transition-all duration-200"
            placeholder="Your name"
          />
        </div>
      )}

      <div>
        <label htmlFor="email" className="mono-label text-dark-text mb-1.5 block">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-light-text text-sm
            placeholder:text-dark-text/30 focus:outline-none input-glow transition-all duration-200"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="mono-label text-dark-text mb-1.5 block">
          Password{' '}
          {mode === 'signup' && <span className="text-dark-text/40 normal-case tracking-normal">(min 8 chars)</span>}
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={mode === 'signup' ? 8 : undefined}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-light-text text-sm
            placeholder:text-dark-text/30 focus:outline-none input-glow transition-all duration-200"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg mt-1
          bg-primary text-on-primary text-sm font-semibold
          hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50
          shadow-[0_0_16px_-4px_rgba(var(--color-primary-rgb),0.4)]"
      >
        {loading ? (
          <Loader2 size={15} className="animate-spin" />
        ) : (
          <>
            {mode === 'signin' ? 'Sign in' : 'Create account'}
            <ArrowRight size={14} />
          </>
        )}
      </button>
    </form>
  );
}
