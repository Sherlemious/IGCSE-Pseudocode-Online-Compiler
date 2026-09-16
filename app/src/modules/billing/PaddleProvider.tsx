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

  // Last data-bearing checkout context (price/tier/currency). Error and failure
  // events carry no `data`, so we merge this in to attribute an abandonment to a
  // specific tier — otherwise a `checkout_error` can't be tied to what was bought.
  const lastCtxRef = useRef<Record<string, unknown>>({});

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
          sku_type: item?.billing_cycle?.interval ? 'subscription' : item ? 'one_time' : null,
          currency: d?.currency_code,
          total: d?.totals?.total,
          recurring_total: d?.recurring_totals?.total,
          status: d?.status,
        };
        // Remember the latest context so the data-less error/failure events below
        // can still be attributed to a tier/price.
        if (d) {
          lastCtxRef.current = {
            checkout_id: base.checkout_id,
            price_id: base.price_id,
            product_name: base.product_name,
            interval: base.interval,
            sku_type: base.sku_type,
            currency: base.currency,
            total: base.total,
            recurring_total: base.recurring_total,
          };
        }
        const ctx = lastCtxRef.current;
        switch (name) {
          case CheckoutEventNames.CHECKOUT_LOADED:
            phRef.current?.capture('checkout_loaded', base);
            break;
          // Which payment method the buyer picked — captured even if they then
          // abandon, so payment-method friction (common in PPP regions) is visible.
          case CheckoutEventNames.CHECKOUT_PAYMENT_SELECTED:
            phRef.current?.capture('checkout_payment_selected', {
              ...base,
              payment_method: d?.payment?.method_details?.type,
            });
            break;
          case CheckoutEventNames.CHECKOUT_PAYMENT_INITIATED:
            phRef.current?.capture('checkout_payment_initiated', {
              ...base,
              payment_method: d?.payment?.method_details?.type,
            });
            break;
          case CheckoutEventNames.CHECKOUT_PAYMENT_FAILED:
            phRef.current?.capture('checkout_payment_failed', {
              ...ctx,
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
          // Terminal failure (distinct from a dismissed error dialog). No `data`,
          // so lean on the remembered context.
          case CheckoutEventNames.CHECKOUT_FAILED:
            phRef.current?.capture('checkout_failed', { paddle_env: environment, ...ctx });
            break;
          case CheckoutEventNames.CHECKOUT_ERROR:
          case CheckoutEventNames.CHECKOUT_PAYMENT_ERROR:
            // Error events carry the reason at the top level (CheckoutEventError:
            // type/code/detail), and no `data` — so merge the remembered context.
            phRef.current?.capture('checkout_error', {
              paddle_env: environment,
              ...ctx,
              error_name: name,
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
