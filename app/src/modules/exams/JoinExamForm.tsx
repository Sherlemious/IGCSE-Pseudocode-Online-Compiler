'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { normalizeShareCode } from '@/shared/lib/shareCode';

export default function JoinExamForm() {
  const router = useRouter();
  const [code, setCode] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const normalized = normalizeShareCode(code);
    if (!normalized) return;
    router.push(`/e/${normalized}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter code"
        autoCapitalize="characters"
        spellCheck={false}
        className="flex-1 min-w-0 px-3.5 py-2.5 rounded-lg bg-background border border-border text-sm font-mono
          tracking-[0.15em] uppercase text-light-text placeholder:text-dark-text/50 placeholder:tracking-normal
          placeholder:normal-case focus:outline-none focus:border-primary/50 transition-colors"
      />
      <button
        type="submit"
        disabled={!code.trim()}
        className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary text-on-primary
          text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40"
      >
        Join
        <ArrowRight size={14} />
      </button>
    </form>
  );
}
