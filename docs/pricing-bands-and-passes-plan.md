# Pricing redesign — capacity bands + student session passes

**Status:** Implemented on `feat/pricing-bands-session-passes`. Paddle prices created in **sandbox + live** (2026-09-16) and IDs wired into `seedPricing.ts` / `passes.ts`. Notifications include `transaction.completed` (plus created/paid). Remaining: `db:seed:pricing production` at deploy so live main does not list Department/School before this branch ships. See [`docs/paddle-catalog.md`](paddle-catalog.md).
**Goal:** grow from **$5 MRR** (1 Starter) to **$200+ MRR**, without cutting the teacher who already pays.
**Passes are student-only.** They never grant teaching capacity and the webhook ignores a pass purchase by a `TEACHER` or anyone on Starter/Pro/School.

---

## Teacher ladder — priced by TOTAL student capacity (new checkouts)

Annual = ~2 months free. Prices in USD (Paddle localizes).

| Tier | Total students | Classes | USD/mo | Annual | Notes |
|------|----------------|---------|--------|--------|-------|
| Free | 5 | 1 | $0 | — | the taste |
| **Starter** | 30 | 3 | **$5** | $50 | new buyers: 30 **total** |
| **Classroom** | 90 | 6 | $15 | $150 | was "Pro" — same $15 price, now capped |
| **Department** | 250 | 15 | **$39** | $390 | NEW (checkout after Paddle IDs) |
| **School** | 750 | 40 | **$89** | $890 | NEW (checkout after Paddle IDs) |
| **Campus** | ∞ | ∞ | contact | custom | was "Advanced" |

### Grandfathering (existing teachers)

Paid teachers at cutover keep **the limits they already have**, not the new bands:

- Starter → still 3 classes × 30 students **per class**, no cross-class total (`User.legacyCapacity = true`)
- Pro → still unlimited (label stays "Pro")
- School/Advanced → still unlimited

New buyers of the live $15 price get Classroom (90). Renewals of the existing Starter/Pro Paddle prices do **not** flip `legacyCapacity`. Buying a new band (Department/School/Campus) does.

Backfill after `prisma db push`:

```
cd app
npx tsx prisma/backfillLegacyCapacity.ts
```

---

## Student — monthly subscription + session passes

The **$2/month Student plan is a recurring subscription** (PricingTier slug `student`), not a pass. Session passes are one-time, student-only, 33% off that monthly rate for the window length. The leftover 1-month **one-time** SKU still grants time in the webhook but is no longer listed on `/pricing`.

| SKU | Shown | Covers until | List | Was |
|-----|-------|--------------|------|-----|
| **Student monthly** | always | while subscribed | **$2/mo** | — |
| **May/June pass** | September–May | 30 June of the series | **$13** | $20 (10 × $2) |
| **Oct/Nov pass** | June–November | 30 November of the series | **$8** | $12 (6 × $2) |
| 1-month one-time (legacy) | not listed | +1 month (stacks) | $2 | — |

Buying late does not run past the series end. A second purchase takes the later of the two dates. Teachers never see a working Buy button; the webhook will not apply a pass to them.

---

## Deploy order

1. `npx prisma db push` on production (adds nullable `planExpiresAt` + `legacyCapacity`). **Before** the code deploy — `getEntitlements` selects both.
2. `npx tsx prisma/backfillLegacyCapacity.ts` so the current Starter teacher keeps 3×30.
3. Set `CRON_SECRET`. Confirm Vercel root so `app/vercel.json` cron `/api/cron/expire-passes` hits this app.
4. Subscribe the Paddle notification destination to `transaction.completed`.
5. Create Paddle prices — follow [`docs/paddle-catalog.md`](paddle-catalog.md). Then fill IDs in `seedPricing.ts` / `passes.ts` and seed.

Rollback: revert the merge; the new columns can stay (nullable / default false).
