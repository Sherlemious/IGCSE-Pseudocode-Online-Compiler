'use client';

import { useEffect, useRef } from 'react';
import { usePostHog } from 'posthog-js/react';
import PaddleProvider, { usePaddle } from './PaddleProvider';
import { PassPriceQuote } from './PassPriceLine';
import type { featuredPassOffer } from './paddle/passes';

type Offer = NonNullable<ReturnType<typeof featuredPassOffer>>;

interface Props {
  token: string;
  studentName: string | null;
  offer: Offer;
  passLabel: string;
  priceId: string;
  discountCode: string | null;
}

/**
 * The parent's side of "ask a parent to pay". Checkout carries the signed
 * token as `pay_for`, so the webhook puts the pass on the student whatever
 * email the parent pays with. No email is prefilled: the receipt is theirs.
 */
export default function ParentPayClient(props: Props) {
  return (
    <PaddleProvider>
      <ParentPay {...props} />
    </PaddleProvider>
  );
}

function ParentPay({ token, studentName, offer, passLabel, priceId, discountCode }: Props) {
  const paddle = usePaddle();
  const ph = usePostHog();
  const viewedRef = useRef(false);
  useEffect(() => {
    if (!ph || viewedRef.current) return;
    viewedRef.current = true;
    ph.capture('parent_pay_viewed', { pass: passLabel, early_bird: Boolean(discountCode) });
  }, [ph, passLabel, discountCode]);

  const who = studentName ?? 'A student';
  const pay = () => {
    if (!paddle || !priceId) return;
    ph?.capture('parent_pay_clicked', { pass: passLabel, price_id: priceId, discount_code: discountCode });
    paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      ...(discountCode ? { discountCode } : {}),
      customData: { pay_for: token },
      settings: {
        displayMode: 'overlay',
        variant: 'one-page',
        successUrl: `${window.location.origin}/pay/${encodeURIComponent(token)}?paid=1`,
      },
    });
  };

  return (
    <>
      <p className="mono-label text-primary mb-3">{passLabel} pass</p>
      <h1 className="text-2xl font-bold tracking-tight text-light-text">
        {who} asked you to pay for their exam pass
      </h1>
      <p className="mt-3 text-sm text-dark-text leading-relaxed">
        Pseudocode Compiler is where students practise for Cambridge IGCSE and A Level Computer Science Paper 2:
        writing pseudocode, running it, and getting it marked. The pass unlocks everything on {studentName ? `${studentName}'s` : 'their'}{' '}
        account until {offer.until}.
      </p>

      <ul className="mt-5 space-y-2 text-sm text-light-text">
        <li>&#10003; Every level of the Paper 2 Path, in order, with a check on every lesson</li>
        <li>&#10003; The full practice library, marked by hidden tests</li>
        <li>&#10003; Timed exams, so the real paper is not the first time against the clock</li>
      </ul>

      <div className="mt-5 rounded-xl border border-warning/30 bg-warning/5 p-3 text-sm">
        <PassPriceQuote offer={offer} />
        <p className="mt-1.5 text-dark-text">
          One payment. No subscription, nothing renews, and you can ask for a full refund within 14 days.
        </p>
      </div>

      <button
        type="button"
        onClick={pay}
        disabled={!paddle || !priceId}
        className="mt-6 w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition-colors disabled:opacity-60"
      >
        Pay for {studentName ? `${studentName}'s` : 'the'} pass
      </button>
      <p className="mt-3 text-xs text-dark-text leading-relaxed">
        Card, PayPal or Google Pay through Paddle, our payment provider. You don&apos;t need an account. The
        receipt goes to the email you enter at checkout.
      </p>
    </>
  );
}
