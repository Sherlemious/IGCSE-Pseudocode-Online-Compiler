'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';

interface AuthFormProps {
  mode: 'signin' | 'signup';
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || 'Sign up failed');
          setLoading(false);
          return;
        }
      }

      // Sign in with credentials (works for both sign-up and sign-in)
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(mode === 'signin' ? 'Invalid email or password' : 'Account created but sign in failed. Try signing in.');
        setLoading(false);
        return;
      }

      router.push('/practice');
      router.refresh();
    } catch {
      setError('Something went wrong');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 text-xs text-error bg-error/10 border border-error/20 rounded-lg px-3 py-2">
          <AlertCircle size={14} className="shrink-0" />
          {error}
        </div>
      )}

      {mode === 'signup' && (
        <div>
          <label htmlFor="name" className="block text-xs font-medium text-dark-text mb-1">
            Name <span className="text-dark-text/50">(optional)</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-light-text text-sm
              placeholder:text-dark-text/40 focus:outline-none focus:border-primary/60 transition-colors"
            placeholder="Your name"
          />
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-xs font-medium text-dark-text mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-light-text text-sm
            placeholder:text-dark-text/40 focus:outline-none focus:border-primary/60 transition-colors"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-xs font-medium text-dark-text mb-1">
          Password {mode === 'signup' && <span className="text-dark-text/50">(min 8 characters)</span>}
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={mode === 'signup' ? 8 : undefined}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-light-text text-sm
            placeholder:text-dark-text/40 focus:outline-none focus:border-primary/60 transition-colors"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
          bg-primary/15 text-primary text-sm font-medium
          hover:bg-primary/25 transition-colors disabled:opacity-50"
      >
        {loading && <Loader2 size={14} className="animate-spin" />}
        {mode === 'signin' ? 'Sign in' : 'Create account'}
      </button>
    </form>
  );
}
