'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowRight, Ticket, X } from 'lucide-react';
import { seriesEnd } from '@/modules/billing/paddle/passes';
import { qrSvg } from '@/shared/lib/qrCode';
import { SITE_URL } from '@/shared/lib/seo';

export const PASS_TOAST_SHOWN_KEY = 'nudge_shown_pass';
const NUDGE = 'session_pass';

type Capture = (event: string, props: Record<string, unknown>) => void;

/** `from` values a phone lands with after scanning the toast's QR code. */
export const PHONE_QR_FROM = { pay: 'pass_toast_phone', signup: 'phone_qr_signup' } as const;

/**
 * Where the QR code sends the phone. Many visitors are on school computers,
 * where nobody pays: signed in → student pricing on the phone (their own wallet
 * or a parent's), signed out → sign up on the phone and come back to this page.
 */
export function phoneQrUrl(signedIn: boolean, path: string): string {
  if (signedIn) return `${SITE_URL}/pricing?view=student&from=${PHONE_QR_FROM.pay}`;
  const back = path.startsWith('/') && !path.startsWith('//') ? path : '/learn';
  return `${SITE_URL}/auth/signup?callbackUrl=${encodeURIComponent(back)}&from=${PHONE_QR_FROM.signup}`;
}

/**
 * Once per browser: a small toast for the May/June pass. Callers check
 * eligibility (`shouldOfferSessionPass`) first. The link lands on student
 * pricing, not straight in checkout, so the price shown is the local one.
 * `source` is `sitting` (they just said May/Jun 2027) or `returning`.
 */
export function showPassToast(
  source: 'sitting' | 'returning',
  capture: Capture,
  opts: { force?: boolean; signedIn?: boolean } = {},
): boolean {
  try {
    if (!opts.force && localStorage.getItem(PASS_TOAST_SHOWN_KEY) === '1') return false;
    localStorage.setItem(PASS_TOAST_SHOWN_KEY, '1');
  } catch {
    return false;
  }

  const until = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', timeZone: 'UTC' }).format(
    seriesEnd('may_june'),
  );
  const href = `/pricing?view=student&from=pass_toast_${source}`;
  const signedIn = opts.signedIn ?? false;
  // Phones and tablets are already the device to pay on; the QR is for desktops.
  const showQr = window.matchMedia('(min-width: 768px) and (pointer: fine)').matches;
  let qr = '';
  if (showQr) {
    try {
      qr = qrSvg(phoneQrUrl(signedIn, window.location.pathname));
    } catch {
      qr = '';
    }
  }

  // The Toaster mounts after OnboardingNudges, so a toast fired on page load would be dropped.
  window.setTimeout(() => {
    capture('nudge_shown', { nudge: NUDGE, source, signed_in: signedIn, qr: Boolean(qr) });
    toast.custom(
      (toastId) => (
        <div className="relative flex w-[340px] max-w-[calc(100vw-2rem)] items-start gap-3 overflow-hidden rounded-2xl border border-border/80 bg-surface/95 p-3 pr-8 text-light-text shadow-intense backdrop-blur-md">
          <span className="absolute inset-y-2 left-0 w-0.5 rounded-r-full bg-primary" />
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
            <Ticket size={17} aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-semibold">
              {source === 'sitting' ? 'Sitting May/June? One payment covers it.' : 'The May/June pass'}
            </span>
            <span className="mt-0.5 block text-[11px] leading-snug text-dark-text">
              Every Paper 2 Path level and premium question until {until}. Pay once, no subscription.
            </span>
            <Link
              href={href}
              onClick={() => {
                capture('nudge_clicked', { nudge: NUDGE, source });
                toast.dismiss(toastId);
              }}
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/10 px-2.5 py-1.5 text-[11px] font-semibold text-primary transition-colors hover:border-primary/40 hover:bg-primary/20"
            >
              See the pass
              <ArrowRight size={12} aria-hidden="true" />
            </Link>
            {qr && (
              <span className="mt-3 flex items-center gap-2.5 border-t border-border/60 pt-3">
                <span
                  className="block h-[76px] w-[76px] shrink-0 overflow-hidden rounded-md"
                  dangerouslySetInnerHTML={{ __html: qr }}
                />
                <span className="text-[11px] leading-snug text-dark-text">
                  {signedIn ? (
                    <>
                      <span className="block font-semibold text-light-text">On a school computer?</span>
                      Scan to get the pass on your phone, or show a parent.
                    </>
                  ) : (
                    <>
                      <span className="block font-semibold text-light-text">On a school computer?</span>
                      Scan to sign up on your phone and keep going at home.
                    </>
                  )}
                </span>
              </span>
            )}
          </span>
          <button
            type="button"
            onClick={() => {
              capture('nudge_dismissed', { nudge: NUDGE, source });
              toast.dismiss(toastId);
            }}
            className="absolute right-2 top-2 rounded-md p-1 text-dark-text hover:bg-background hover:text-light-text"
            aria-label="Dismiss"
          >
            <X size={13} aria-hidden="true" />
          </button>
        </div>
      ),
    { duration: Infinity, position: 'bottom-right', unstyled: true },
  );
  }, 1500);
  return true;
}
