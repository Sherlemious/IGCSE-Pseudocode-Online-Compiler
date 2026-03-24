'use client';

/**
 * Reusable share panel.
 *
 * Priority:
 *  1. Native Web Share API   (mobile / modern browsers)
 *  2. WhatsApp deep link     (primary channel for IGCSE students)
 *  3. Copy to clipboard
 *  4. "Share with teacher"   — alternative copy aimed at educators
 */

import { useState } from 'react';
import { Share2, MessageCircle, Link2, Check, GraduationCap } from 'lucide-react';
import { usePostHog } from 'posthog-js/react';

const SITE_URL = 'https://pseudocode-compiler.sherlemious.com';

interface ShareButtonProps {
  /** Shown above the action buttons, e.g. after an exam result */
  headline?: string;
  /** Pre-filled WhatsApp / Web Share message */
  shareText?: string;
  /** Compact single-icon variant — no card, just a button */
  compact?: boolean;
}

function buildWhatsApp(text: string) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export default function ShareButton({
  headline,
  shareText,
  compact = false,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const ph = usePostHog();

  const studentText =
    shareText ??
    `If you're studying IGCSE Computer Science, this free pseudocode compiler is worth checking out.\n${SITE_URL}`;

  const teacherText =
    `Free tool for IGCSE Computer Science students — write and run Cambridge pseudocode right in the browser, with practice questions and timed exams:\n${SITE_URL}`;

  function track(method: string) {
    ph?.capture('share_clicked', { method, context: headline ?? 'generic' });
  }

  async function handleNativeShare() {
    track('native');
    try {
      await navigator.share({ title: 'IGCSE Pseudocode Compiler', text: studentText, url: SITE_URL });
      ph?.capture('share_completed', { method: 'native' });
    } catch {
      // user cancelled or not supported — fall through silently
    }
  }

  async function handleCopy() {
    track('copy');
    await navigator.clipboard.writeText(SITE_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Compact mode: single icon that triggers native share or copies on click
  if (compact) {
    const canShare = typeof navigator !== 'undefined' && Boolean(navigator.share);
    return (
      <button
        onClick={canShare ? handleNativeShare : handleCopy}
        className="flex items-center gap-1.5 px-2 py-1 rounded text-xs text-header-text/70
          hover:text-header-text hover:bg-white/10 transition duration-200"
        title="Share this tool"
      >
        {copied ? <Check size={13} className="text-success" /> : <Share2 size={13} />}
        Share
      </button>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-xl p-5 animate-fade-in-up">
      {headline && (
        <p className="text-sm font-semibold text-light-text mb-4 text-center">{headline}</p>
      )}

      <div className="space-y-2.5">
        {/* WhatsApp — primary for IGCSE student demographics */}
        <a
          href={buildWhatsApp(studentText)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('whatsapp_student')}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg
            bg-[#25D366]/10 border border-[#25D366]/25 text-[#25D366]
            hover:bg-[#25D366]/20 transition-all duration-200 text-sm font-medium"
        >
          {/* WhatsApp icon (inline SVG to avoid extra dep) */}
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Share with classmates
        </a>

        {/* WhatsApp — teacher variant */}
        <a
          href={buildWhatsApp(teacherText)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('whatsapp_teacher')}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg
            bg-background border border-border text-dark-text
            hover:border-primary/40 hover:text-light-text transition-all duration-200 text-sm font-medium"
        >
          <GraduationCap size={15} className="shrink-0 text-primary" />
          Send to my teacher
        </a>

        {/* Copy link */}
        <button
          onClick={handleCopy}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg
            bg-background border border-border text-dark-text
            hover:border-primary/40 hover:text-light-text transition-all duration-200 text-sm font-medium"
        >
          {copied
            ? <Check size={15} className="shrink-0 text-success" />
            : <Link2 size={15} className="shrink-0" />}
          {copied ? 'Link copied!' : 'Copy link'}
        </button>
      </div>

      <p className="text-[10px] text-dark-text/40 text-center mt-3">Free forever · No sign-up required to try it</p>
    </div>
  );
}
