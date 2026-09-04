'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { initializePaddle, CheckoutEventNames, type Paddle } from '@paddle/paddle-js';
import { usePostHog } from 'posthog-js/react';
import { getPaddleEnv, getPaddleClientToken } from '@/modules/billing/paddle/env';

const PaddleContext = createContext<Paddle | undefined>(undefined);

/** The initialized Paddle instance, or undefined until it's ready / if init failed. */
export function usePaddle(): Paddle | undefined {
  return useContext(PaddleContext);
}

/**
 * Initializes Paddle.js once for the subtree. Environment and token come from
 * env vars via `@/modules/billing/paddle/env`, which throws on a missing/invalid value —
 * so a misconfigured deploy fails loudly here rather than silently running
 * checkout against the wrong Paddle account.
 *
 * The `eventCallback` bridges Paddle's own checkout lifecycle (load, payment,
 * completion, close, errors) into PostHog so the subscription funnel is
 * observable end-to-end alongside the page-side events in `PricingClient`.
 */
export default function PaddleProvider({ children }: { children: React.ReactNode }) {
  const [paddle, setPaddle] = useState<Paddle | undefined>(undefined);
  // Held in a ref so the Paddle event callback always sees the current PostHog
  // client without re-running init (which must happen exactly once).
  const ph = usePostHog();
  const phRef = useRef(ph);
  useEffect(() => {
    phRef.current = ph;
  }, [ph]);

  useEffect(() => {
    let environment: ReturnType<typeof getPaddleEnv>;
    let token: string;
    try {
      environment = getPaddleEnv();
      token = getPaddleClientToken();
    } catch (err) {
      // Misconfigured env — surface loudly; the pricing UI stays disabled.
      console.error('[paddle] configuration error', err);
      return;
    }

    initializePaddle({
      environment,
      token,
      eventCallback: (event) => {
        const name = event?.name;
        if (!name) return;
        const d = event.data;
        const item = d?.items?.[0];
        // Common context for every checkout event. Amounts are Paddle's raw
        // integers (lowest denomination) — analytics only, never displayed.
        const base = {
          paddle_env: environment,
          checkout_id: d?.id,
          price_id: item?.price_id,
          product_name: item?.product?.name,
          interval: item?.billing_cycle?.interval,
          currency: d?.currency_code,
          total: d?.totals?.total,
          recurring_total: d?.recurring_totals?.total,
          status: d?.status,
        };
        switch (name) {
          case CheckoutEventNames.CHECKOUT_LOADED:
            phRef.current?.capture('checkout_loaded', base);
            break;
          case CheckoutEventNames.CHECKOUT_PAYMENT_INITIATED:
            phRef.current?.capture('checkout_payment_initiated', {
              ...base,
              payment_method: d?.payment?.method_details?.type,
            });
            break;
          case CheckoutEventNames.CHECKOUT_PAYMENT_FAILED:
            phRef.current?.capture('checkout_payment_failed', {
              ...base,
              payment_method: d?.payment?.method_details?.type,
            });
            break;
          case CheckoutEventNames.CHECKOUT_COMPLETED:
            phRef.current?.capture('checkout_completed', {
              ...base,
              transaction_id: d?.transaction_id,
            });
            break;
          case CheckoutEventNames.CHECKOUT_CLOSED:
            phRef.current?.capture('checkout_closed', base);
            break;
          case CheckoutEventNames.CHECKOUT_ERROR:
          case CheckoutEventNames.CHECKOUT_PAYMENT_ERROR:
            phRef.current?.capture('checkout_error', {
              ...base,
              error_type: event.type,
              error_code: event.code,
              error_detail: event.detail,
            });
            break;
        }
      },
    })
      .then((instance) => {
        if (instance) setPaddle(instance);
      })
      .catch((err) => {
        console.error('[paddle] initialization failed', err);
      });
    // Init must run exactly once; PostHog is reached through phRef, not deps.
  }, []);

  return <PaddleContext.Provider value={paddle}>{children}</PaddleContext.Provider>;
}
