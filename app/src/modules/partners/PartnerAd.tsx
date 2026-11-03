'use client';

import { useEffect, useState } from 'react';
import { Camera, ExternalLink, X } from 'lucide-react';
import { captureEvent } from '@/modules/interpreter/analytics';
import { PARTNERS, partnerOutHref, type PartnerSurface } from './partners';

const PARTNER = 'learningmate' as const;
const DISMISS_KEY = `partner_ad_dismissed_${PARTNER}`;

function readDismissed(): boolean {
  try {
    return localStorage.getItem(DISMISS_KEY) === '1';
  } catch {
    return false;
  }
}

/**
 * Teacher-only partner card for The Learning Mate (AI marking of paper
 * scripts). Clicks go through /api/out so the referral is counted server-side.
 * Dismiss hides it for this browser.
 */
export default function PartnerAd({ surface }: { surface: PartnerSurface }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (readDismissed()) return;
    setVisible(true);
    captureEvent('partner_ad_shown', { partner: PARTNER, surface });
  }, [surface]);

  if (!visible) return null;

  const dismiss = () => {
    setVisible(false);
    captureEvent('partner_ad_dismissed', { partner: PARTNER, surface });
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* private mode: hides for this page view only */
    }
  };

  return (
    <aside
      aria-label={`Partner: ${PARTNERS[PARTNER].name}`}
      className="relative flex items-start gap-3 rounded-xl border border-border bg-surface/80 p-4 pr-10"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background">
        <Camera size={16} className="text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="mono-label text-[10px] text-dark-text/70">Partner</p>
        <p className="mt-0.5 text-sm font-medium text-light-text">Marking paper scripts too?</p>
        <p className="mt-1 text-xs leading-relaxed text-dark-text">
          {PARTNERS[PARTNER].name} grades a student&apos;s paper from a photo or upload, with feedback on each question.
        </p>
        <a
          href={partnerOutHref(PARTNER, surface)}
          target="_blank"
          rel="sponsored noopener"
          onClick={() => captureEvent('partner_ad_clicked', { partner: PARTNER, surface })}
          className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
        >
          Grade a paper free
          <ExternalLink size={12} />
        </a>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Hide this partner card"
        className="absolute right-2.5 top-2.5 rounded p-1 text-dark-text/50 hover:bg-background hover:text-light-text"
      >
        <X size={14} />
      </button>
    </aside>
  );
}
