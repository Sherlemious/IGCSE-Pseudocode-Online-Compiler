'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import { AlertCircle, ArrowRight, Loader2 } from 'lucide-react';

/** Set the password on an account a purchase created, then sign straight in. */
export default function ClaimForm({ email, token }: { email: string; token: string }) {
  const router = useRouter();
  const ph = usePostHog();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expired, setExpired] = useState(!token);
  const [resent, setResent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch('/api/auth/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, token, password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Could not set the password. Try again.');
      if (data.code === 'CLAIM_EXPIRED') setExpired(true);
      setLoading(false);
      return;
    }
    const result = await signIn('credentials', { email, password, redirect: false });
    if (result?.error) {
      setError('Password saved, but sign-in failed. Sign in with your email and the new password.');
      setLoading(false);
      return;
    }
    ph?.capture('account_claimed', { method: 'password' });
    router.push('/welcome');
    router.refresh();
  };

  const resend = async () => {
    setLoading(true);
    await fetch('/api/auth/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resend: true, email }),
    }).catch(() => {});
    ph?.capture('account_claim_resent');
    setResent(true);
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      {!expired && (
        <form onSubmit={submit} className="space-y-3">
          <label className="block text-left text-xs font-medium text-dark-text">
            Email
            <input
              type="email"
              value={email}
              readOnly
              className="mt-1 w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm text-dark-text"
            />
          </label>
          <label className="block text-left text-xs font-medium text-dark-text">
            New password (8 or more characters)
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              maxLength={72}
              required
              autoComplete="new-password"
              autoFocus
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-light-text focus:border-primary focus:outline-none"
            />
          </label>
          <button
            type="submit"
            disabled={loading || password.length < 8}
            className="flex w-full min-h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
            Set password and sign in
          </button>
        </form>
      )}

      {error && (
        <p className="flex items-start gap-2 rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-left text-xs text-error" role="alert">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          {error}
        </p>
      )}

      {expired &&
        (resent ? (
          <p className="text-sm text-success">If this email has an account waiting, a new link is on its way. Check your inbox.</p>
        ) : (
          <button
            type="button"
            onClick={resend}
            disabled={loading || !email}
            className="w-full min-h-10 rounded-lg border border-border px-4 text-sm font-semibold text-light-text hover:bg-surface disabled:opacity-60"
          >
            Email me a new link
          </button>
        ))}
    </div>
  );
}
