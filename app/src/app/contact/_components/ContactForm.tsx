'use client';

import { useState } from 'react';
import { Check, Send } from 'lucide-react';
import { usePostHog } from 'posthog-js/react';
import { toast } from 'sonner';

interface Props {
  defaultName: string;
  defaultEmail: string;
  signedIn: boolean;
}

const inputClass =
  'w-full px-3 py-2 rounded-lg bg-background border border-border text-light-text text-sm ' +
  'placeholder:text-dark-text/40 focus:outline-none focus:border-primary/50 transition-colors';

export default function ContactForm({ defaultName, defaultEmail, signedIn }: Props) {
  const ph = usePostHog();

  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const emailOk = signedIn || email.trim().length > 0;
  const canSubmit = message.trim().length > 0 && emailOk && !submitting;

  async function submit() {
    if (!canSubmit) return;
    setSubmitting(true);

    ph?.capture('contact_submitted', { signed_in: signedIn, has_subject: subject.trim().length > 0 });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || null,
          email: signedIn ? null : email.trim() || null,
          subject: subject.trim() || null,
          message: message.trim(),
          pageUrl: (() => {
            try { return window.location.pathname + window.location.search; } catch { return null; }
          })(),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(data.error ?? 'bad status');
      }
      setDone(true);
    } catch (err) {
      setSubmitting(false);
      toast.error(err instanceof Error && err.message !== 'bad status'
        ? err.message
        : "Couldn't send your message — please try again.");
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <div className="w-10 h-10 rounded-full bg-success/15 flex items-center justify-center">
          <Check size={18} className="text-success" />
        </div>
        <p className="text-base font-semibold text-light-text">Message sent</p>
        <p className="text-sm text-dark-text max-w-sm">
          Thanks for reaching out. We&apos;ll reply to{' '}
          <span className="text-light-text">{signedIn ? defaultEmail : email.trim()}</span> as soon as we can.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); void submit(); }}
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mono-label text-dark-text mb-1.5 block">
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="mono-label text-dark-text mb-1.5 block">
            Email {!signedIn && <span className="text-error">*</span>}
          </label>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={signedIn}
            placeholder="you@example.com"
            className={`${inputClass} disabled:opacity-60 disabled:cursor-not-allowed`}
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className="mono-label text-dark-text mb-1.5 block">
          Subject
        </label>
        <input
          id="contact-subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="What's this about? (optional)"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="mono-label text-dark-text mb-1.5 block">
          Message <span className="text-error">*</span>
        </label>
        <textarea
          id="contact-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="How can we help?"
          rows={6}
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className="flex items-center justify-end pt-1">
        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-primary text-on-primary hover:bg-primary-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={14} />
          {submitting ? 'Sending…' : 'Send message'}
        </button>
      </div>
    </form>
  );
}
