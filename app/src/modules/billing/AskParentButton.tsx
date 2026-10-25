'use client';

import { useState } from 'react';
import { usePostHog } from 'posthog-js/react';
import { Check, Copy, Share2, Users } from 'lucide-react';

/**
 * "Ask a parent to pay": makes a link (`/pay/<token>`) the student sends to
 * whoever pays. Many students are 15–16 with no card of their own, and
 * several checkouts failed on payment, not on price.
 */
export default function AskParentButton({ surface, until }: { surface: string; until?: string }) {
  const ph = usePostHog();
  const [url, setUrl] = useState<string | null>(null);
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [copied, setCopied] = useState(false);

  const create = async () => {
    setState('loading');
    try {
      const res = await fetch('/api/me/parent-link', { method: 'POST' });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { url: string };
      setUrl(data.url);
      setState('idle');
      ph?.capture('parent_link_created', { surface });
    } catch {
      setState('error');
    }
  };

  if (!url) {
    return (
      <div>
        <button
          type="button"
          onClick={create}
          disabled={state === 'loading'}
          className="inline-flex items-center gap-1.5 min-h-10 text-sm text-dark-text hover:text-light-text hover:underline disabled:opacity-60"
        >
          <Users size={14} />
          {state === 'loading' ? 'Making your link…' : 'No card? Ask a parent to pay'}
        </button>
        {state === 'error' && <p className="mt-1 text-xs text-error">Couldn&apos;t make the link. Try again.</p>}
      </div>
    );
  }

  const message = `Hi! Could you pay for my Computer Science exam pass? It's one payment, not a subscription, and it unlocks all my Paper 2 practice${until ? ` until ${until}` : ''}: ${url}`;
  const shared = (method: string) => ph?.capture('parent_link_shared', { surface, method });
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      shared('copy');
    } catch {
      /* the link is still on screen to select by hand */
    }
  };
  const nativeShare = async () => {
    try {
      await navigator.share({ text: message });
      shared('native');
    } catch {
      /* dismissed */
    }
  };
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  return (
    <div className="w-full rounded-xl border border-border bg-background/60 p-3 text-sm">
      <p className="text-light-text">Send this to a parent. They pay on their phone, and the pass goes on your account.</p>
      <p className="mt-2 break-all rounded-lg bg-surface px-2 py-1.5 font-mono text-xs text-dark-text select-all">{url}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 min-h-9 px-3 rounded-lg bg-primary/15 text-primary text-sm font-medium hover:bg-primary/25"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy message'}
        </button>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => shared('whatsapp')}
          className="inline-flex items-center gap-1.5 min-h-9 px-3 rounded-lg bg-success/15 text-success text-sm font-medium hover:bg-success/25"
        >
          WhatsApp
        </a>
        {canShare && (
          <button
            type="button"
            onClick={nativeShare}
            className="inline-flex items-center gap-1.5 min-h-9 px-3 rounded-lg border border-border text-dark-text text-sm hover:text-light-text"
          >
            <Share2 size={14} />
            Share
          </button>
        )}
      </div>
      <p className="mt-2 text-xs text-dark-text">The link works for 30 days. Refresh this page after they pay.</p>
    </div>
  );
}
