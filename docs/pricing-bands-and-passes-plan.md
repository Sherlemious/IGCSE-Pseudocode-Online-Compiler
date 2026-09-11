# Pricing redesign — student-count bands + one-time student passes

**Status:** Phase A (backend) shipped on branch `feat/pricing-bands-student-passes`; Phases B–D pending.
**Goal:** grow from ~€5.50 MRR (1 Starter) to **€200+ MRR**.
**Owner insight that drove this:** _"unlimited students for $15 is insane"_ — the flat Pro tier let a 750-student school pay the same as a 30-student teacher, capping revenue. Fix = price by capacity, and let students buy sessional passes instead of month-to-month.

---

## 1. The model

### Teacher ladder — priced by TOTAL student capacity
Annual = ~2 months free. Prices in USD (Paddle localizes per country).

| Tier | Total students | Classes | USD/mo | Annual | Notes |
|------|----------------|---------|--------|--------|-------|
| Free | 5 | 1 | $0 | — | the taste |
| **Starter** | 30 | 3 | **$5** | $50 | individual teacher (unchanged price) |
| **Classroom** | 90 | 6 | $15 | $150 | **was "Pro"** — same $15 price, now capped |
| **Department** | 250 | 15 | **$39** | $390 | NEW |
| **School** | 750 | 40 | **$89** | $890 | NEW |
| **Campus** | ∞ | ∞ | contact | custom | **was "Advanced"** — contact-only |

**Path to €200 (~$216/mo):** e.g. `2 × School + 1 × Department = $217`, or a blend of Classroom/Department/School. A handful of school deals, not hundreds of individual subs.

### Student plan — one-time PASSES (not subscriptions)
Students want the academic session covered, not a recurring charge. Passes **do not auto-renew**; access expires on a date.

| Pass | Price | Effective | Discount | Notes |
|------|-------|-----------|----------|-------|
| 1-month | $3 | $3/mo | — | short top-up |
| **6-month** | **$12** | $2/mo | **33% off** | covers most of an Oct–Jun session |

Also fixes fee drag: at $1/mo, Paddle's ~$0.50 + 5% ate ~55% of each payment; one $12 charge nets ~$10.90.

---

## 2. Phase A — backend foundation (DONE, on this branch)

Commit `1d48bc9`. Verified: `npm run build`, ESLint (0 errors), 18/18 entitlements tests.

- **`prisma/schema.prisma`** — added nullable `User.planExpiresAt` (backs pass expiry). _Schema only — needs `prisma db push`._
- **`modules/billing/entitlements.ts`** — `Tier` = `free|starter|classroom|department|school|campus`; `LIMITS` now carries `maxStudentsTotal` (kept `maxStudentsPerClass` = band total so existing consumers compile); slug-driven `tierForUser()`; expiry-aware `isPlanActive()`; legacy slugs `pro→classroom`, `advanced→campus`.
- **`modules/classes/service.ts`** — `joinClass` enforces **total** students across the owner's classes (was per-class).
- **`modules/billing/paddle/plan.ts`**, **`planDisplay.ts`**, **`modules/classes/CreateClassForm.tsx`** — map + label the new tiers.
- **`modules/billing/paddle/passes.ts`** (new) — one-time pass catalog (`priceId → {months, tier}`), **price IDs blank until created**.
- **`app/api/paddle/webhook/route.ts`** — handles `transaction.completed` → one-time pass (sets `STUDENT` + `planExpiresAt`, never clobbers a paying teacher, stacks remaining time); `setPlan` refactored for expiry/linkage.
- **`app/api/cron/expire-passes/route.ts`** (new) + **`app/vercel.json`** — daily sweep resets expired passes to Free; `CRON_SECRET`-guarded.

**Non-breaking:** new tiers/passes are inert until the Paddle prices exist and are seeded; current checkout keeps working.

---

## 3. Phase B — Paddle catalog + seed (BLOCKED on price creation)

> The app's live Paddle MCP is read-only. Create **sandbox** prices via MCP for testing; **live** prices need the dashboard or a live API key.

1. **Create Paddle prices** under the existing product(s), both sandbox and production:
   - Department — monthly $39, yearly $390
   - School — monthly $89, yearly $890
   - Student 1-month pass — **one-time** $3
   - Student 6-month pass — **one-time** $12
   - (Classroom keeps the existing "Pro" $15 monthly/yearly prices — no new price needed.)
2. **`prisma/seedPricing.ts`** — add `department` and `school` tier rows (copy + new price IDs) for both envs. Update the `pro` row's display copy to "Classroom" (keep slug `pro` so existing subs resolve), and update `advanced` copy to "Campus".
3. **`modules/billing/paddle/passes.ts`** — fill the sandbox + production one-time price IDs.
4. **Run** `npm run db:seed:pricing sandbox` (then `production` when live prices exist).

### Grandfathering (verified-safe mechanism)
- Paddle never auto-reprices existing subs — Jocelyn (Starter $6.25 localized) and any others keep their price automatically.
- The webhook's `tierSlugForPriceId` lookup has **no `active` filter**, while `/pricing` lists only `active:true`. So if you ever replace a price: add a NEW `PricingTier` row (`active:true`) and set the OLD row `active:false` — hidden from the page, still resolvable for renewals.
- Extra safety net: the webhook's unmapped-price branch does **not** downgrade; only non-entitling statuses (`past_due`/`paused`/`canceled`) revoke.

---

## 4. Phase C — pricing page UI

`modules/billing/PricingClient.tsx` + `app/pricing/page.tsx`:
- Render the new teacher tiers with "up to N students" copy; mark **Classroom** as "Most popular" (update `featured` from `slug === 'pro'` to include `classroom`).
- Add a **student passes** section: one-time "Buy pass" CTA (not "Subscribe"), 1-month / 6-month options, no recurring-interval toggle for passes.
- Pass checkout **must** send `customData: { app_user_id }` so the `transaction.completed` webhook can link the buyer (falls back to customer email).
- Show remaining pass time for a student whose `planExpiresAt` is in the future ("Pass active until …").

---

## 5. Phase D — polish (nice-to-have)

- **Teacher student-cap nudge** — when a teacher hits `maxStudentsTotal`, surface an upgrade prompt in the class view (mirror the class-count nudge already shipped: `nudge_shown`/`nudge_clicked` with `{ nudge: 'student_limit' }`). Today the `LIMIT_STUDENTS` error is shown to the joining *student*, not the teacher.
- **Per-class "isFull" previews** (`app/c/[code]/page.tsx`, `.../assignments/[assignmentId]/page.tsx`) still use `maxStudentsPerClass` and are optimistic vs the total cap. Recompute against the owner's total, or accept the transactional join as the real gate.
- Analytics: add `pass_purchased` / tier to the funnel if useful.

---

## 6. Deploy runbook (order matters)

1. ✅ Merge/rebase the branch onto `main` (resolve any drift with the owner's parallel commits).
2. ⚠️ **`npx prisma db push` on the production DB FIRST** — adds the nullable `planExpiresAt` column (additive, non-destructive). **Deploying the code before this breaks `getEntitlements`, the webhook, and class pages** (they select `planExpiresAt`).
3. Seed production pricing: `npm run db:seed:pricing production` (after live prices exist).
4. Set Vercel env: **`CRON_SECRET`** (`openssl rand -base64 32`). Confirm the Vercel **root directory** so `app/vercel.json`'s cron path (`/api/cron/expire-passes`) resolves.
5. Deploy. Verify: `/pricing` shows the new tiers + passes; a sandbox pass purchase sets `plan=STUDENT` + `planExpiresAt`; the cron endpoint returns `{expired: n}` with the bearer secret.
6. Subscribe to `transaction.completed` on the Paddle **notification destination** (in addition to the existing `subscription.*` events) — the pass webhook won't fire otherwise.

### Rollback
- Code: revert the merge; the `planExpiresAt` column can stay (harmless, nullable).
- Prices: set the new `PricingTier` rows `active:false` and re-activate the old — existing subs are unaffected either way.

---

## 7. Testing (sandbox, before live)

- [ ] Create sandbox prices; seed sandbox; fill `passes.ts` sandbox IDs.
- [ ] Buy a 1-month pass (signed in) → webhook sets `STUDENT` + `planExpiresAt ≈ now+1mo`; premium access on.
- [ ] Buy a 6-month pass while a pass is active → expiry **stacks** (extends, not resets).
- [ ] Buy a Department sub → `plan=PRO`, `planTier=department`, 250-seat cap enforced on join.
- [ ] Fill classes past a band cap → `LIMIT_STUDENTS` at the total, existing enrolments untouched.
- [ ] Force `planExpiresAt` into the past → cron resets to Free; premium access off.
- [ ] Existing Starter (Jocelyn) unaffected; owner's legacy "pro" shows as "Classroom".

---

## 8. Open decisions

- Final band sizes/prices (current: 30/90/250/750 at $5/$15/$39/$89) — adjust freely.
- Full-session (9-month) pass at ~$15 instead of/alongside the 6-month? (owner leaned 6-month.)
- Trial capacity: currently `classroom` (90). Bump for school pilots?

_See also: `docs/course-and-monetization-plan.md`._
