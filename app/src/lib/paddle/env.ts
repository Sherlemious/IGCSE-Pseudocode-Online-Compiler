/**
 * Paddle environment resolution.
 *
 * Both values are read from env vars and validated on access — there is NO
 * default. Running the wrong environment against the wrong account is the most
 * expensive mistake here, so we fail loudly rather than guess.
 *
 * `NEXT_PUBLIC_*` vars are inlined into the client bundle by Next.js, which is
 * correct: the environment name and the client-side token are both public by
 * design. The server-side API key (PADDLE_API_KEY) is NOT read here and must
 * never be imported into a client component.
 */

export type PaddleEnv = 'sandbox' | 'production';

/** The Paddle environment for this deployment. Throws if unset/invalid. */
export function getPaddleEnv(): PaddleEnv {
  const value = process.env.NEXT_PUBLIC_PADDLE_ENV;
  if (value !== 'sandbox' && value !== 'production') {
    throw new Error(
      `NEXT_PUBLIC_PADDLE_ENV must be "sandbox" or "production" (got ${
        value ?? 'undefined'
      }). Refusing to guess which Paddle account to use.`,
    );
  }
  return value;
}

/** The Paddle client-side token (test_… for sandbox, live_… for production). Throws if unset. */
export function getPaddleClientToken(): string {
  const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
  if (!token) {
    throw new Error(
      'NEXT_PUBLIC_PADDLE_CLIENT_TOKEN is not set. Set a test_… token for sandbox or a live_… token for production.',
    );
  }
  return token;
}
