// Wraps the OpenNext worker to add the daily cron that Vercel ran from vercel.json.
// Excluded from tsconfig: .open-next/worker.js only exists after `opennextjs-cloudflare build`.
import { default as handler } from './.open-next/worker.js';

type Env = { CRON_SECRET?: string };

const worker = {
  // Workers custom domains answer plain http too (Vercel used to redirect it), so
  // every page also existed at http://. Send those to https once, permanently.
  fetch(request: Request, env: unknown, ctx: unknown) {
    const url = new URL(request.url);
    if (url.protocol === 'http:') {
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
    }
    return handler.fetch(request, env as never, ctx as never);
  },

  async scheduled(_event: unknown, env: Env, ctx: { waitUntil(promise: Promise<unknown>): void }) {
    const request = new Request('https://cron.internal/api/cron/expire-passes', {
      headers: { authorization: `Bearer ${env.CRON_SECRET ?? ''}` },
    });
    ctx.waitUntil(handler.fetch(request, env, ctx));
  },
};

export default worker;
