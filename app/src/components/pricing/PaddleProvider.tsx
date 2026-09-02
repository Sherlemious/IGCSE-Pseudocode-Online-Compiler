'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { initializePaddle, type Paddle } from '@paddle/paddle-js';
import { getPaddleEnv, getPaddleClientToken } from '@/lib/paddle/env';

const PaddleContext = createContext<Paddle | undefined>(undefined);

/** The initialized Paddle instance, or undefined until it's ready / if init failed. */
export function usePaddle(): Paddle | undefined {
  return useContext(PaddleContext);
}

/**
 * Initializes Paddle.js once for the subtree. Environment and token come from
 * env vars via `@/lib/paddle/env`, which throws on a missing/invalid value —
 * so a misconfigured deploy fails loudly here rather than silently running
 * checkout against the wrong Paddle account.
 */
export default function PaddleProvider({ children }: { children: React.ReactNode }) {
  const [paddle, setPaddle] = useState<Paddle | undefined>(undefined);

  useEffect(() => {
    try {
      const environment = getPaddleEnv();
      const token = getPaddleClientToken();
      initializePaddle({ environment, token })
        .then((instance) => {
          if (instance) setPaddle(instance);
        })
        .catch((err) => {
          console.error('[paddle] initialization failed', err);
        });
    } catch (err) {
      // Misconfigured env — surface loudly; the pricing UI stays disabled.
      console.error('[paddle] configuration error', err);
    }
  }, []);

  return <PaddleContext.Provider value={paddle}>{children}</PaddleContext.Provider>;
}
