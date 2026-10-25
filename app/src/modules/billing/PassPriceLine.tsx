'use client';

import { useEffect, useState } from 'react';
import PaddleProvider, { usePaddle } from './PaddleProvider';
import { getPaddleEnv } from './paddle/env';
import {
  amountFromPaddleTotal,
  earlyBirdFor,
  featuredPass,
  formatMajor,
  priceIdForPass,
  type featuredPassOffer,
} from './paddle/passes';

type Offer = NonNullable<ReturnType<typeof featuredPassOffer>>;

/**
 * "{price} once, open until {date}" with the price Paddle will actually charge
 * this visitor (their currency, regional pricing and tax). Paddle.js is
 * initialised only when this renders, i.e. on the Learn paywall. Until the
 * preview answers, or if it fails, the USD list price is shown with a note.
 */
export default function PassPriceLine({ offer }: { offer: Offer }) {
  return (
    <PaddleProvider>
      <Line offer={offer} />
    </PaddleProvider>
  );
}

function Line({ offer }: { offer: Offer }) {
  const paddle = usePaddle();
  const [quote, setQuote] = useState<{ formatted: string; perMonth: string | null } | null>(null);

  useEffect(() => {
    if (!paddle) return;
    const pass = featuredPass();
    let priceId = '';
    try {
      priceId = pass ? priceIdForPass(pass, getPaddleEnv()) : '';
    } catch {
      return;
    }
    if (!priceId) return;
    let cancelled = false;
    // No address: Paddle prices by the visitor's IP, the same way checkout will.
    paddle
      .PricePreview({ items: [{ priceId, quantity: 1 }] })
      .then((preview) => {
        if (cancelled) return;
        const item = preview.data.details.lineItems.find((i) => i.price.id === priceId);
        if (!item) return;
        const amount = amountFromPaddleTotal(item.totals.total, preview.data.currencyCode);
        setQuote({
          formatted: item.formattedTotals.total,
          perMonth: amount ? formatMajor(amount / offer.months, preview.data.currencyCode) : null,
        });
      })
      .catch(() => {
        /* keep the list price */
      });
    return () => {
      cancelled = true;
    };
  }, [paddle, offer.months]);

  const pass = featuredPass();
  const earlyBird = pass ? earlyBirdFor(pass.kind) : null;
  const earlyLine = earlyBird && (
    <span className="mt-1 block text-success">
      Early bird: {earlyBird.percent}% off until {earlyBird.endsLabel}, taken off at checkout.
    </span>
  );
  if (quote) {
    return (
      <p className="text-light-text">
        <span className="text-lg font-semibold">{quote.formatted}</span> once, open until {offer.until}.
        {quote.perMonth && <span className="text-dark-text"> About {quote.perMonth} a month.</span>}
        {earlyLine}
      </p>
    );
  }
  return (
    <p className="text-light-text">
      <span className="text-lg font-semibold">{offer.price}</span> once, open until {offer.until}.{' '}
      <span className="text-dark-text">
        List price in USD; checkout shows your local price. About {offer.perMonth} a month, {offer.discountPct}% off
        paying monthly (was {offer.was}).
      </span>
      {earlyLine}
    </p>
  );
}
