# Paddle catalog — what to add

Create these in **sandbox first**, then mirror in **live**. After each env, paste the `pri_…` IDs into the app (see “Where to paste IDs”). Do **not** reprice or delete existing Starter / Pro / student-subscription prices — current teachers stay on those.

Currency: **USD** list. Turn on Paddle’s per-country overrides (~40% below list) for the PPP set already used on live prices: IN, PK, BD, LK, NP, TH, VN, ID, PH, MM, KH, LA, MV. See `app/src/modules/billing/ppp.ts`.

Tax category: same as existing compiler products (digital / SaaS).

---

## Already in Paddle — leave alone

App still sells Starter and the $15 Pro price (shown as **Classroom**). Existing student *subscriptions* are hidden on `/pricing` but the prices must stay so any remaining sub can renew.

| Env | Slug | Interval | Price ID (already seeded) |
|-----|------|----------|---------------------------|
| sandbox | student (legacy sub) | month | `pri_01m1j4kxapd6a1dgfaw5tdjpgt` |
| sandbox | student (legacy sub) | year | `pri_01m1j4kxfevc4yw6m7664cck4h` |
| sandbox | starter | month | `pri_01m1j4kxtxewyftebqsvryp50k` |
| sandbox | starter | year | `pri_01m1j4kxzn6cp0ywqr2m7qc73s` |
| sandbox | pro → Classroom | month | `pri_01m1j4kyafpw7v0r985s1tmhzf` |
| sandbox | pro → Classroom | year | `pri_01m1j4kyezssa9erzpzwe9nc88` |
| live | student (legacy sub) | month | `pri_01m1mbfxkdvv0esey8wcaktkxr` |
| live | student (legacy sub) | year | `pri_01m1mbfxqpt6018eessnr3mnhw` |
| live | starter | month | `pri_01m1mbfxw6enq2faxm3wnkc3de` |
| live | starter | year | `pri_01m1mbfy1hm2fndbp227dqvk02` |
| live | pro → Classroom | month | `pri_01m1mbfy5rmde0sb9eq8emg292` |
| live | pro → Classroom | year | `pri_01m1mbfy9x1vkj2h7gnecdrtym` |

Optional dashboard rename: Pro product/price **name** → “Classroom”. The site already shows Classroom from `tierCopy.ts`. **Do not change the price ID or the $15 amount.**

Campus (was Advanced) stays **contact-only** — no new self-serve price.

---

## Create — teacher subscriptions

Same billing model as Starter/Pro: recurring, month + year (year = 10× month, ~2 months free).

Suggested product: **Teacher plans** (or add prices onto the existing teacher product).

| Internal name | App slug | Type | USD | Billing |
|---------------|----------|------|-----|---------|
| Department monthly | `department` | Recurring | **$39** | 1 month |
| Department yearly | `department` | Recurring | **$390** | 1 year |
| School monthly | `school` | Recurring | **$89** | 1 month |
| School yearly | `school` | Recurring | **$890** | 1 year |

Copy for the Paddle product (students on the roster do not pay):

- Department: up to 15 classes, 250 students total.
- School: up to 40 classes, 750 students total.

Create **sandbox + live** (8 prices).

---

## Create — student passes (one-time only)

**Not subscriptions.** Billing period = none. Quantity = 1. Student-only; the app will not apply these to a teacher.

Suggested product: **Student session passes**.

Base rate: **$2 / month**. Session SKUs are 33% off that rate for the window, rounded to the nearest dollar.

| Internal name | App slug | Type | USD list | Strike (undiscounted) | Access |
|---------------|----------|------|----------|------------------------|--------|
| 1-month pass | `student-month` | One-time | **$2** | — | +1 calendar month (stacks) |
| May/June session | `student-may-june` | One-time | **$13** | $20 (10 × $2) | Until 30 June of the series |
| Oct/Nov session | `student-oct-nov` | One-time | **$8** | $12 (6 × $2) | Until 30 November of the series |

Checkout custom data the app already sends: `{ app_user_id }`. The webhook keys off the **price ID**, not the name.

Create **sandbox + live** (6 prices).

The listed **Student** plan on `/pricing` is the existing recurring `student` PricingTier (legacy ~$1/mo IDs until a true $2/mo price exists). The 1-month **one-time** pass stays in `PASS_PRICES` so leftover purchases still grant time; it is not shown on the page.

---

## After the prices exist

1. Sandbox IDs → `app/prisma/seedPricing.ts` (`SANDBOX_TIERS` add `department` + `school`) and `app/src/modules/billing/paddle/passes.ts` (`PASS_PRICES.sandbox`).
2. Live IDs → the production blocks in those same files.
3. `cd app && npm run db:seed:pricing sandbox` then `production`.
4. Paddle **notification destination** (sandbox + live): subscribe to `transaction.completed` in addition to the existing `subscription.*` events. Pass purchases will not provision without it.
5. Confirm `/pricing?view=student` Buy buttons enable (they stay “Available soon” until IDs are in `passes.ts`).

### ID paste shape

`seedPricing.ts` (subscriptions):

```ts
tier('department', 'pri_…month', 'pri_…year'),
tier('school', 'pri_…month', 'pri_…year'),
```

You’ll also need to add `department` / `school` to the `COPY` object (sortOrder 3 and 4, bump `advanced` to 5) — they already have marketing copy in `tierCopy.ts`.

`passes.ts` (one-time):

```ts
sandbox: {
  'pri_…month': MONTH,
  'pri_…may_june': MAY_JUNE,
  'pri_…oct_nov': OCT_NOV,
},
```

---

## Created — sandbox IDs (2026-09-16, via paddle-sandbox MCP)

USD base + a single USD PPP override at ~40% below list for the 13 `ppp.ts` countries.

| App slug | Product | Month / one-time price | Year price |
|----------|---------|------------------------|------------|
| `department` | `pro_01m2nqdaq8pj3nn31y6jc4exdf` | `pri_01m2nqdavv70rmdvhp3dps1xfx` ($39, PPP $23) | `pri_01m2nqdb01nqnxaa9bpvf4qgx5` ($390, PPP $234) |
| `school` | `pro_01m2nqdb5bygv2791cjchf2ryh` | `pri_01m2nqdb9a319kcwny4pf01m2d` ($89, PPP $53) | `pri_01m2nqdbd4dvbew96tnbjmt8yx` ($890, PPP $534) |
| `student-month` | `pro_01m2nqdbjgn9z2ds2yj0dz9w6z` | `pri_01m2nqdbxe4nmfpzqcn1gnv1x4` ($2, PPP $1) | — |
| `student-may-june` | (same pass product) | `pri_01m2nqdc16zf8vpt5gb9wdntc9` ($13, PPP $8) | — |
| `student-oct-nov` | (same pass product) | `pri_01m2nqdc50e62nk65nkcvcpkbp` ($8, PPP $5) | — |

Pasted into `seedPricing.ts` (`SANDBOX_TIERS`) + `passes.ts` (`PASS_PRICES.sandbox`) and seeded with `db:seed:pricing sandbox`.

## Created — live IDs (2026-09-16, via paddle-live MCP)

Same USD base + PPP override structure as sandbox.

| App slug | Product | Month / one-time price | Year price |
|----------|---------|------------------------|------------|
| `department` | `pro_01m2nqt5xjh79fean79sge303p` | `pri_01m2nqt61vncea5t0g6qe80n28` ($39, PPP $23) | `pri_01m2nqt66336h29kpb3pafv90q` ($390, PPP $234) |
| `school` | `pro_01m2nqt6fg5dd1r6x6e2vaebct` | `pri_01m2nqt6krpwdzxep16epjahdm` ($89, PPP $53) | `pri_01m2nqt6qw9xx9trwqcykedb6h` ($890, PPP $534) |
| `student-month` | `pro_01m2nqt6xm8tw4brkfmthjm834` | `pri_01m2nqt7289natscexm33zy7pa` ($2, PPP $1) | — |
| `student-may-june` | (same pass product) | `pri_01m2nqt7729dg9w1gxmmtcj42p` ($13, PPP $8) | — |
| `student-oct-nov` | (same pass product) | `pri_01m2nqt7bgw87v9svw5brqe9my` ($8, PPP $5) | — |

Pasted into `seedPricing.ts` (`PRODUCTION_TIERS`) + `passes.ts` (`PASS_PRICES.production`).
**`db:seed:pricing production` intentionally NOT run yet** — the live `/pricing` page reads teacher tiers from the `PricingTier` table, so seeding production rows would expose Department/School (with working checkout) on the live site before this branch's capacity/entitlement/webhook code deploys. Run it at deploy time (Deploy order step 5).

## Checklist

Sandbox

- [x] Department month $39
- [x] Department year $390
- [x] School month $89
- [x] School year $890
- [x] Student 1-month one-time $2
- [x] Student May/June one-time $13
- [x] Student Oct/Nov one-time $8
- [x] PPP country overrides on each new price
- [x] `transaction.completed` on the destination (added in dashboard by user, 2026-09-16 — also added transaction.created/paid)
- [x] IDs pasted + `db:seed:pricing sandbox`

Live (same list)

- [x] All seven new prices
- [x] PPP overrides
- [x] `transaction.completed` on the live destination (user added 2026-09-16, also transaction.created/paid)
- [x] IDs pasted; [ ] `db:seed:pricing production` (deferred to deploy — see note above)
