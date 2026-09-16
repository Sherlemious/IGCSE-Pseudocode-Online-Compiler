/**
 * Seed the PricingTier table from the Paddle catalog.
 *
 * The tier → Paddle price-ID binding lives in the DB (not in code/env), so this
 * script is how those rows get created/updated. It is idempotent: rows are
 * upserted by (slug, paddleEnv), so re-running it is safe.
 *
 * Sandbox and production have DIFFERENT price IDs. Fill both blocks below from
 * the catalog audit, then run:
 *
 *   npm run db:seed:pricing              # both environments
 *   npm run db:seed:pricing sandbox      # sandbox rows only
 *   npm run db:seed:pricing production   # production rows only
 *
 * Amounts/currency are NOT stored here — Paddle is the source of truth for money
 * (the /pricing page shows Paddle's formattedTotals). This only holds the display
 * copy and the price IDs to preview + check out. Contact-only tiers (e.g. Campus,
 * formerly Advanced) have no self-serve price, so their price IDs are intentionally empty.
 * Department and School have Paddle IDs in both envs. Seed sandbox anytime;
 * seed production only at deploy so live main does not list those tiers early.
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { TIER_COPY } from '../src/modules/billing/tierCopy';

const prisma = new PrismaClient();

type PaddleEnv = 'sandbox' | 'production';

interface TierSeed {
  slug: string;
  name: string;
  description: string;
  features: string[];
  monthPriceId: string; // Paddle pri_… (monthly); empty for contact-only tiers
  yearPriceId: string; // Paddle pri_… (yearly); empty for contact-only tiers
  sortOrder: number;
  contactOnly: boolean;
}

// Shared display copy — identical across environments; only the price IDs differ.
const COPY = {
  student: { ...TIER_COPY.student, sortOrder: 0, contactOnly: false },
  starter: { ...TIER_COPY.starter, sortOrder: 1, contactOnly: false },
  pro: { ...TIER_COPY.pro, sortOrder: 2, contactOnly: false },
  department: { ...TIER_COPY.department, sortOrder: 3, contactOnly: false },
  school: { ...TIER_COPY.school, sortOrder: 4, contactOnly: false },
  advanced: { ...TIER_COPY.advanced, sortOrder: 5, contactOnly: true },
} as const;

const tier = (slug: keyof typeof COPY, monthPriceId: string, yearPriceId: string): TierSeed => ({
  slug,
  ...COPY[slug],
  features: [...COPY[slug].features],
  monthPriceId,
  yearPriceId,
});

// ─── Sandbox price IDs (Athaar sandbox account) ───────────────────────────────
const SANDBOX_TIERS: TierSeed[] = [
  tier('student', 'pri_01m1j4kxapd6a1dgfaw5tdjpgt', 'pri_01m1j4kxfevc4yw6m7664cck4h'),
  tier('starter', 'pri_01m1j4kxtxewyftebqsvryp50k', 'pri_01m1j4kxzn6cp0ywqr2m7qc73s'),
  tier('pro', 'pri_01m1j4kyafpw7v0r985s1tmhzf', 'pri_01m1j4kyezssa9erzpzwe9nc88'),
  // Created 2026-09-16 via the paddle-sandbox MCP (see docs/paddle-catalog.md).
  tier('department', 'pri_01m2nqdavv70rmdvhp3dps1xfx', 'pri_01m2nqdb01nqnxaa9bpvf4qgx5'),
  tier('school', 'pri_01m2nqdb9a319kcwny4pf01m2d', 'pri_01m2nqdbd4dvbew96tnbjmt8yx'),
  tier('advanced', '', ''), // contact-only
];

// ─── Production price IDs (compiler live account) ──────────────────────────────
// Created 2026-09-03 via the paddle-live MCP, mirroring the sandbox catalog.
// Advanced stays blank (contact-only) even though live Advanced prices exist —
// the app gates that tier behind contact-sales, same as sandbox.
const PRODUCTION_TIERS: TierSeed[] = [
  tier('student', 'pri_01m1mbfxkdvv0esey8wcaktkxr', 'pri_01m1mbfxqpt6018eessnr3mnhw'),
  tier('starter', 'pri_01m1mbfxw6enq2faxm3wnkc3de', 'pri_01m1mbfy1hm2fndbp227dqvk02'),
  tier('pro', 'pri_01m1mbfy5rmde0sb9eq8emg292', 'pri_01m1mbfy9x1vkj2h7gnecdrtym'),
  // Created 2026-09-16 via the paddle-live MCP, mirroring the sandbox catalog.
  tier('department', 'pri_01m2nqt61vncea5t0g6qe80n28', 'pri_01m2nqt66336h29kpb3pafv90q'),
  tier('school', 'pri_01m2nqt6krpwdzxep16epjahdm', 'pri_01m2nqt6qw9xx9trwqcykedb6h'),
  tier('advanced', '', ''), // contact-only
];
// ──────────────────────────────────────────────────────────────────────────────

async function upsertTiers(paddleEnv: PaddleEnv, tiers: TierSeed[]) {
  for (const t of tiers) {
    // Guard: never seed blank IDs for a self-serve tier. Contact-only tiers are
    // exempt — they legitimately have no price.
    if (!t.contactOnly && (!t.monthPriceId || !t.yearPriceId)) {
      throw new Error(
        `[${paddleEnv}] tier "${t.slug}" is missing monthPriceId/yearPriceId. ` +
          'Fill in the audited Paddle price IDs before seeding.',
      );
    }
    await prisma.pricingTier.upsert({
      where: { slug_paddleEnv: { slug: t.slug, paddleEnv } },
      create: {
        slug: t.slug,
        name: t.name,
        description: t.description,
        features: t.features,
        monthPriceId: t.monthPriceId,
        yearPriceId: t.yearPriceId,
        paddleEnv,
        sortOrder: t.sortOrder,
        active: true,
        contactOnly: t.contactOnly,
      },
      update: {
        name: t.name,
        description: t.description,
        features: t.features,
        monthPriceId: t.monthPriceId,
        yearPriceId: t.yearPriceId,
        sortOrder: t.sortOrder,
        active: true,
        contactOnly: t.contactOnly,
      },
    });
    console.log(`✔ upserted ${paddleEnv}/${t.slug}`);
  }
}

async function main() {
  const target = process.argv[2] as PaddleEnv | undefined;
  if (target && target !== 'sandbox' && target !== 'production') {
    throw new Error(`Unknown target "${target}". Use "sandbox", "production", or omit for both.`);
  }
  if (!target || target === 'sandbox') await upsertTiers('sandbox', SANDBOX_TIERS);
  if (!target || target === 'production') await upsertTiers('production', PRODUCTION_TIERS);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
