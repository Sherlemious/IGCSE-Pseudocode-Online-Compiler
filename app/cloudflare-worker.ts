// Wraps the OpenNext worker to add the daily cron that Vercel ran from vercel.json.
// Excluded from tsconfig: .open-next/worker.js only exists after `opennextjs-cloudflare build`.
import { default as handler } from './.open-next/worker.js';

type Env = { CRON_SECRET?: string };

const worker = {
  fetch: handler.fetch,

  async scheduled(_event: unknown, env: Env, ctx: { waitUntil(promise: Promise<unknown>): void }) {
    const request = new Request('https://cron.internal/api/cron/expire-passes', {
      headers: { authorization: `Bearer ${env.CRON_SECRET ?? ''}` },
    });
    ctx.waitUntil(handler.fetch(request, env, ctx));
  },
};

export default worker;
