# CLAUDE.md — IGCSE Pseudocode Online Compiler

## Stack

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS** — editor/UI default is One Dark Pro (`#282C34` bg, `#61AFEF` primary). Brand identity (logo, OG, email, 404) lives in `src/shared/brand/` and uses examiner red `#E5533D` on ink `#111726` / paper `#F3EEE3`. Do not restyle the editor with brand colours.
- **CodeMirror 6** — editor with custom pseudocode language extension
- **antlr4ng v3** — ANTLR4 parser for pseudocode
- **Prisma** + **PostgreSQL** (Neon) — database ORM
- **NextAuth.js v5** — auth (Google OAuth, GitHub OAuth, email/password)
- **Resend** — transactional email
- **PostHog** — analytics (project: `pseudocode-compiler.sherlemious.com`)
- **tsconfig**: `strict`, `noUnusedLocals`, `noUnusedParameters`

## Architecture

Modular monolith. `src/app/` is a thin routing layer (pages + API route handlers). Product code lives in `src/modules/<domain>/`. Cross-cutting UI and infra live in `src/shared/`. The interpreter is a language runtime, not a Next.js feature — it must not import PostHog, Prisma, auth, or billing.

**Client-side interpreter** — pseudocode is parsed and executed entirely in the browser. No server round-trip for running code. The ANTLR4 lexer/parser runs in a Web Worker context and the tree-walking interpreter is fully async to support `INPUT` pausing. Product telemetry is injected via `setInterpreterCapture`.

**Next.js backend** — API routes handle auth, practice/exam CRUD, AI grading, and nudge state. Database access goes through Prisma (`src/shared/db.ts`).

### Module map

| Module | Owns |
|--------|------|
| `modules/interpreter` | Grammar, generated parser, runtime, `useInterpreter` |
| `modules/compiler` | Playground UI + shared editor kit (`editor.ts`) |
| `modules/billing` | Paddle, plans, entitlements, pricing page |
| `modules/practice` | Practice UI + autograder |
| `modules/learn` | Paper 2 Path (`/learn`) — sequenced levels, player, local progress |
| `modules/exams` | Exam take/author UI |
| `modules/classes` | Class/assignment UI |
| `modules/auth` | NextAuth config, session UI, transactional email |
| `modules/admin` | Admin gate (`isAdmin`) — pages stay under `app/admin` |
| `modules/progress` | Student progress dashboard widgets |
| `modules/telemetry` | PostHog provider / session identify |
| `shared/` | Layout chrome, UI primitives, Prisma, SEO, brand identity, rate limit, logger |
| `theme/` | Editor/UI themes + validation |

Dependency rules (enforced by ESLint):
- `interpreter` ↛ product modules, Prisma, PostHog, Next.js
- `billing` ↛ interpreter / compiler / practice
- `shared/ui` + `shared/lib` ↛ product modules (interpreter tokens are allowed). `shared/layout` may compose feature UI (Header → UserMenu).
- `practice` / `exams` / `learn` may import `compiler/editor` (CodeMirror + trace table), not `CompilerPage`

## Key Paths

| Path | Purpose |
|------|---------|
| `app/src/modules/interpreter/grammar/Pseudocode.g4` | ANTLR4 grammar — source of truth |
| `app/src/modules/interpreter/generated/` | Generated lexer/parser — **do not edit** |
| `app/src/modules/interpreter/core/interpreter.ts` | Tree-walking interpreter |
| `app/src/modules/interpreter/core/environment.ts` | Variable scoping / closures |
| `app/src/modules/interpreter/errorMessages.ts` | Human-friendly parse + runtime error messages |
| `app/src/modules/interpreter/useInterpreter.ts` | React hook wrapping the interpreter |
| `app/src/modules/practice/autograder.ts` | Test-case grading |
| `app/src/modules/auth/auth.ts` | NextAuth config |
| `app/src/modules/billing/` | Pricing, Paddle, entitlements |
| `app/src/modules/learn/` | Paper 2 Path curriculum, player, progress |
| `app/prisma/schema.prisma` | Database schema |
| `app/src/shared/brand/` | Mark, palette, OG card, logo — never restyle the editor with these |

## Brand

Canonical names live in `src/shared/brand/brand.ts` and `src/shared/lib/seo.ts`:
- **Short:** `BRAND.shortName` — "Pseudocode Compiler" (header, manifest, casual share text)
- **Long:** `SITE_NAME` — "Cambridge IGCSE & A Level Pseudocode Compiler" (SEO, email subject/from, legal)
- **Maker:** "Sherlemious"

The logo is the **Examiner Owl**: a pair of braces for the face, ringed eyes, and the arrowhead as a red beak. It's drawn once in `mark.ts` and drives the header, favicon (`app/icon.tsx`), Apple icon and OG card. It blinks on first paint of the home header and on hover. After editing the mark, run `node docs/brand/render.cjs` with the dev server up to refresh `public/favicon.png` (manifest + email). One red accent per surface. Paper grain and answer-line patterns are for marketing surfaces (OG, 404, tutorial hero, email) only.

## ANTLR4 Quirks

- **antlr4ng v3** uses `BaseErrorListener`, not `ErrorListener`
- Grammar `op=TOKEN` labels generate `_op` (underscore prefix) on the parse tree node
- `NEWLINE` is a **significant token** — not skipped; the grammar uses it for statement separation
- Case-insensitive keywords are implemented via letter fragments (e.g. `D E C L A R E`)
- Generated files live in `src/modules/interpreter/generated/` — regenerate with `npm run antlr:generate` after editing the grammar

## Language Coverage

One **superset grammar** covers both Cambridge IGCSE (0478) and AS & A Level (9618) pseudocode — there is **no mode toggle**; all syntax is always available. A Level additions: `TYPE` definitions (records with dot notation, enums with ordinal arithmetic, pointers `^x`/`ptr^`, `SET OF` + `DEFINE`), `DATE` type with `dd/mm/yyyy` literals, CASE ranges (`1 TO 5 :`) and multi-value labels, `BYREF`/`BYVAL` (sticky across following params), random-access files (`OPENFILE ... FOR RANDOM`, `SEEK`, `GETRECORD`, `PUTRECORD`), and OOP (`CLASS`/`ENDCLASS`, `INHERITS`, `PUBLIC`/`PRIVATE` with runtime enforcement, constructor `NEW`, `SUPER`, `obj <- NEW ClassName(...)`).

Deliberate parse edges (documented in /docs — do not "fix"):
- Contiguous `dd/dd/dddd` lexes as a DATE_LITERAL; spaced division (`10 / 02 / 2005`) still works
- `p^ - 1` parses as pointer-deref-then-subtract; negative exponents on identifiers need parens: `x ^ (-1)`
- A Level keywords are **soft keywords**: the grammar's `identifier` rule accepts TYPE/SET/DATE/RANDOM/NEW/CLASS/SEEK/DEFINE/INHERITS/PUBLIC/PRIVATE/BYREF/BYVAL/GETRECORD/PUTRECORD in variable-name positions, so `DECLARE Date : STRING` keeps working. Only SUPER, ENDTYPE, ENDCLASS and the pre-existing IGCSE keywords are fully reserved. Type/class **names** stay hard IDENTIFIER.
- `block` may be empty — comment-only IF/loop bodies (common in starter scaffolds) parse and run as no-ops
- Some seed `starterCode` is deliberately incomplete (literal `...` placeholders referenced by hints); only `solution` blocks are parse-checked by the test suite, and `...` gets a friendly "replace the placeholder" parse hint

## Interpreter Design

- Fully **async** — every visitor method is `async` to support `INPUT` pausing and UI responsiveness
- **AbortController** for cancellation — checked at every loop iteration
- **ReturnSignal** is thrown (not returned) to unwind the call stack from `RETURN` statements
- **Designators** — lvalues (`x`, `arr[i,j]`, `rec.Field`, `ptr^`, chains thereof) resolve to `Reference` objects (`core/references.ts`); the same mechanism backs assignment, INPUT/READFILE/GETRECORD targets, BYREF parameters and pointers
- **Value semantics** — arrays and records deep-copy on assignment (`core/copy.ts`); objects stay references
- Record/class member names are **case-insensitive** (the Cambridge guide itself mixes `FirstName`/`Firstname`); variable names remain case-sensitive
- `core/filesystem.ts` = one VFS (OPENFILE / READFILE / WRITEFILE / RANDOM). Persistence is injected: `LocalStorageFileStore` in the playground, `MemoryFileStore` (`ServerVirtualFileSystem`) for grading and vitest. Random-access record encoding lives in `core/fileStore.ts`.
- New core modules: `records.ts`, `references.ts`, `classes.ts`, `copy.ts`, `serialize.ts` (record ↔ JSON for random files)

### INPUT syntax

INPUT targets any designator, with an optional prompt:
```
INPUT identifier                          // plain input
INPUT identifier, "prompt text"          // displays prompt before the input field
INPUT identifier[row, col]                // array element (1D or 2D)
INPUT record.Field, "prompt text"        // record field with prompt
```

The optional string literal is stripped of its quotes and passed to `onInputRequest(variableName, prompt?)` → stored in `OutputEntry.prompt?` → rendered in `OutputDisplay` as a `text-primary` line above the input field.

## Error Messages

`errorMessages.ts` converts raw ANTLR parse errors and runtime errors into student-friendly messages. Raw messages are still sent to PostHog for analysis.

Key maps:
- `SYNTAX_HINTS` — missing closing keywords (ENDIF, ENDWHILE, etc.) + missing `:` (colon in DECLARE/CASE)
- `WRONG_TOKENS` — non-IGCSE keywords (print, var, let, :=, `(` at line start, etc.)
- `PORTUGOL_TOKENS` — Portugol/VisualG keywords (escreval, leia, fimse, senao, etc.) — detects students writing Brazilian pseudocode and redirects them to the IGCSE equivalent

Additional patterns (based on PostHog top-error analysis, Apr 2026):
- `console.log(...)` now parses (dot notation is valid A Level syntax) and is caught at runtime → "Use OUTPUT instead"
- Keyword on same line as previous statement → "must be on its own line"
- `UNTIL` inside a FOR loop → directs to REPEAT or NEXT
- `ENDIF` where `THEN` expected → missing THEN hint
- `\nNEXT` at top level → missing FOR loop hint
- `,` inside `[...]` in non-2D context → array indexing hint
- Extraneous `]` → bracket-matching hint
- Newline token as expression → "line seems incomplete"

Source-line pattern detectors (added Sep 2026 from the offending-line telemetry, the two biggest resolve-rate holes were `no_viable_alternative`/`mismatched_input`). These key off the offending **source line** itself (like `closerSuggestion`), so they beat ANTLR's opaque message; each keys off syntax that is never valid IGCSE, and only runs on an already-flagged line. `sourceLineHint()` is shared by `humanizeParseError` and `categorizeParseError` so message and slug never drift. New slugs:
- `python_syntax` — `else:`/`elif …:`, `for … in range(…):`, `int(input(…))`/`input(…)`, `range(…)`, `if/while …:` colon headers → redirect to IGCSE (mirrors the Portugol detector)
- `basic_block_closer` — `END IF`→ENDIF (one word), `ENDFOR`/`END FOR`→`NEXT <var>`, bare `END`/`BEGIN` wrappers
- `for_loop_assignment` — `FOR count : 1 TO 3` / `FOR i = 1 TO 10` → counter is set with `<-`
- `output_missing_comma` — `OUTPUT "text" value` (with or without a space) → OUTPUT items need a comma between them

Second pass (Sept 2026, sized by replaying the `ErrorSample` table through the current rules; cut the unexplained share by about half). More single-line detectors: `input_prompt` (`INPUT "Enter name"`), `input_target` (`INPUT 10`), `set_assignment` (`SET x = 0`), `declare_array_syntax` (any array DECLARE that fails → canonical `ARRAY[1:n] OF T`), `procedure_returns`, `param_type_missing`, `call_missing` (`Stars(5)` without CALL), `call_in_expression` (`x <- CALL F(…)`), `case_comparison` (`>= 80 :`), `else_condition` (`ELSE x > 5 THEN`), `compare_with_arrow` / `while_as_for` (`<-` in a condition), `type_as_value` (`IF N = INTEGER`), `implicit_multiply` (`(9/5)C`), `value_missing_operator`, `power_operator` (`**`), `line_numbers` (pasted exam numbering), `misspelled_keyword` / `plain_english`. `=` assignment parses, so a flagged `x = …` line is about its value, not the operator.

Whole-program hints take a `ParseErrorContext` (`{ lines, line }`, passed from `useInterpreter`): an IF/FOR/WHILE/REPEAT/CASE left open is reported at the end of the program as "no viable alternative at '\n'" on a valid last line, so `unclosedBlockHint` names the opener line instead (reuses `missing_endif`/`missing_next`/… slugs); `misplaced_then` covers THEN after a WHILE or after an IF that already has a statement. Parameterless `PROCEDURE Name`, `FUNCTION Name RETURNS T` and `CALL Name` (no brackets) are valid, as in the Cambridge guide.

## Database Schema (Prisma)

- `User` / `Account` / `Session` — NextAuth tables
- `Question` / `TestCase` — practice questions with test cases
- `Progress` — per-user question completion state
- `ExamAttempt` / `ExamAnswer` — a student's run of an exam (timed session). `examId` is null for the self-service random simulator; set when the attempt is a run of a shared `Exam`.
- `Exam` / `ExamQuestion` — instructor-authored, reusable, shareable exam **definitions** (fixed ordered question set, `shareCode`, `isPublished`). Any signed-in user can create one and share it via `/e/[code]`; taking it materializes an `ExamAttempt` (`api/exams/[examId]/start`) so the existing take→grade→results pipeline is reused unchanged.
- `Example` — built-in code examples (also seeded in `data/examples.ts`)

> **DB workflow:** the migration history under `prisma/migrations/` is stale/incomplete — `prisma migrate dev` fails on shadow-DB replay of an older migration. Apply schema changes to the dev DB with `npx prisma db push` (schema-diff, no shadow replay). Purely additive changes are non-destructive.

## Dev Commands

```bash
cd app
npm run dev           # dev server → http://localhost:3000
npm run build         # production build (runs prisma generate first)
npm run db:migrate    # run Prisma migrations
npm run db:seed       # seed questions/examples
npm run db:studio     # Prisma Studio GUI
npm run lint          # ESLint
npm run antlr:generate  # regenerate parser from grammar
```

## Analytics Events (PostHog)

| Event | Properties |
|-------|-----------|
| `$pageview` | standard |
| `interpreter_error` | `error_type` (parse\|runtime), `error_message`, `line`, `code_lines` |
| `$exception` | PostHog Error Tracking — app crashes, not student code errors. Unhandled errors/rejections are autocaptured (`capture_exceptions` in `PostHogProvider`); `app/error.tsx` + `app/global-error.tsx` add `boundary` (`segment`\|`global`), `digest`, `path`. Filter students with person `role` (set on identify; signed-out visitors have none) |
| `share_clicked` | `method`, `context` |
| `share_completed` | `method` |
| `sign_in_clicked` | `source` |
| `user_authenticated` | — |
| `user_signed_out` | — |
| `teacher_identified` | `plan` — once per browser when the session role is TEACHER (incl. right after the `/onboarding` role pick; `SessionIdentifier`). Triggers the PostHog workflow "Teacher onboarding: what you can do" (email 1 at once; email 2 after 3 days unless `class_progress_viewed`; `utm_campaign=teacher_onboarding`) |
| `nudge_shown` | `nudge` |
| `nudge_clicked` | `nudge` |
| `nudge_dismissed` | `nudge` — timed corner cards (`onboarding/OnboardingNudges.tsx`): `signup` (90 s, signed out), `learn` (15 min, no Learn progress → `/learn?from=nudge_learn`), `exam` (2nd session). `share` and the 15-min `practice` card were removed Sept 2026 (0.3% clicks / no solves). None show on `/learn`, `/pricing`, `/welcome`, `/onboarding`, `/auth`, `/exam`, `/e/` |
| `learn_first_start_shown` / `learn_first_start_clicked` | `choice` (`learn`\|`compiler`) on click — experiment `learn-first-start` (PostHog 467173), test arm only: a brand-new playground visitor (no autosave, tour not done, no Learn progress, no `?code`) gets a start card with the Paper 2 Path as the default (→ `/learn?from=first_visit`) instead of the tour. The flag is read only for eligible visitors, so `$feature_flag_called` is the exposure |
| `nav_clicked` | `destination`, `from` |
| `feedback_submitted` | — |
| `bug_reported` | `category`, `has_code`, `page` |
| `paste_cleaned` | `looks_ai`, `stripped_prose`, `blocks` — fired when a pasted AI/Markdown answer is stripped to just its fenced code |
| `nudge_shown` / `nudge_clicked` / `nudge_dismissed` (Learn path) | `nudge` (`learn_path_playground`\|`learn_path_practice`), `surface` — one-time toast after a successful run / passed question (`learn/learnNudge.tsx`); the link lands on `/learn?from=<nudge>` so `learn_opened.from` attributes it |

Paywall follow-up: PostHog workflow "Nudge if they hit the Learn paywall and don't buy" emails anyone with an email one day after their first `learn_gate_blocked` (`source: paywall`) unless they bought. Open/click tracking is on; links carry `utm_campaign=learn_paywall` (pricing) and `?from=paywall_email` (learn). The "Student conversion & checkout friction" dashboard tracks payment-method failures, school vs personal accounts at checkout, the weekly Learn funnel, and paywall hitters who haven't bought.

### Practice retention (first solve + streak)

85% of practice visitors never solve a question (Sept 2026), so the list recommends one and the streak rewards coming back. The streak is per-browser localStorage (`practice/practiceStreak.ts`, key `practice_solve_days`); recommendations come from `practice/practiceNext.ts` (unsolved, unlocked, easiest, most-solved; EASY only when signed out).

| Event | Properties |
|-------|-----------|
| `practice_start_here_shown` | `question_id`, `kind` (`first`\|`next`), `difficulty`, `streak`, `solved_today` — card at the top of `/practice` when there's no in-progress question |
| `practice_start_here_clicked` | `question_id`, `kind`, `difficulty`, `streak` |
| `practice_streak_extended` | `question_id`, `streak` — first solve of the local day |
| `practice_next_clicked` | `question_id`, `streak` — "Next question" in the solved banner (→ `/practice?from=solved`) |
| `practice_hint_nudged` | `question_id`, `hint_count` — hint auto-opened after the first failed check (was the second) |
| `practice_hint_revealed` | `question_id`, `hint_number`, `source` (`nudge`\|`manual`) |

### Classes / teacher progress

Page-side events fire via `captureEvent` (same path as `class_joined` / `assignment_link_opened`). Never include student name, email, or `lastCode`.

| Event | Properties |
|-------|-----------|
| `class_joined` | `class_id`, optional assignment context |
| `assignment_link_opened` | `assignment_id`, `class_id`, `source` (`google_classroom`\|`direct`), `signed_in` |
| `assignment_link_copied` | `assignment_id`, `class_id` |
| `assignment_started` | `assignment_id`, `class_id`, `source`, `exam_id` (attempt id) |
| `class_progress_viewed` | `class_id`, `roster_size`, `assignment_count`, `students_with_practice`, `students_active_7d` |
| `class_roster_sorted` | `class_id`, `sort` (`name`\|`solved`\|`last_active`) |
| `class_student_progress_clicked` | `class_id`, `source` (`roster`\|`assignment_results`) |
| `class_student_progress_viewed` | `class_id`, `solved_count`, `attempted_count`, `assignments_submitted`, `assignment_count`, `has_practice` |
| `class_student_code_expanded` | `class_id`, `surface` (`assigned_work`\|`practice`) |

### Pricing / subscription funnel (`/pricing` + Paddle checkout)

Page-side events fire from `PricingClient`; the `checkout_*` events are bridged from Paddle.js's own `eventCallback` in `PaddleProvider`. Every event carries `paddle_env` (`sandbox`\|`production`) so test traffic is filterable. Checkout amounts (`total`, `recurring_total`) are Paddle's raw integers (lowest denomination) — analytics only.

| Event | Properties |
|-------|-----------|
| `pricing_viewed` | `paddle_env`, `tier_count`, `pass_count`, `has_student_monthly`, `has_session_switcher`, `country`, `signed_in`, `audience` (`student`\|`teacher`) |
| `pricing_audience_clicked` | `audience` (`student`\|`teacher`\|`choose`), `paddle_env`, `source` (`gate` on I'm a student/teacher, `switch` on in-page links) |
| `pricing_session_changed` | `session` (`may_june`\|`oct_nov`), `paddle_env` |
| `pricing_teacher_seats_changed` | `seats`, `plan_tier`, `max_classes`, `paddle_env` |
| `pricing_prices_loaded` | `paddle_env`, `country`, `resolved_country`, `regional_pricing` (bool — resolved country has a per-country override, see `billing/ppp.ts`), `price_count`, `priced_count`, `currency` |
| `pricing_prices_error` | `paddle_env`, `country`, `error` |
| `pricing_interval_changed` | `interval`, `paddle_env` |
| `subscribe_clicked` | `tier`, `interval`, `price_id`, `paddle_env`, `sku_type` (`subscription`) |
| `pass_clicked` | `tier`, `interval` (`pass`), `price_id`, `paddle_env`, `sku_type` (`session_pass`) |
| `contact_sales_clicked` | `tier`, `paddle_env` |
| `checkout_loaded` | `paddle_env`, `checkout_id`, `price_id`, `product_name`, `interval`, `sku_type` (`subscription`\|`one_time`), `currency`, `total`, `recurring_total`, `status` |
| `checkout_payment_selected` | …base + `payment_method` — method picked (captured even if they abandon; surfaces payment-method friction) |
| `checkout_payment_initiated` | …base + `payment_method` |
| `checkout_payment_failed` | …base + `payment_method` (base merged from last-known checkout context) |
| `checkout_completed` | …base + `transaction_id` (the conversion) |
| `checkout_closed` | …base (abandonment) |
| `checkout_failed` | `paddle_env` + last-known context (terminal failure, distinct from a dismissed error dialog) |
| `checkout_error` | `paddle_env` + last-known context + `error_name`, `error_type`, `error_code`, `error_detail`. Error events carry no `data`, so price/tier come from the remembered context. |
| `checkout_success_viewed` | `transaction` (`_ptxn`) — fired on `/welcome` |
| `subscription_plan_granted` | webhook — `plan`, `plan_tier`, `price_id`, `paddle_env`, `subscription_id`, `status` |
| `subscription_plan_revoked` | webhook — `reason` (Paddle status), `paddle_env`, `subscription_id` |
| `student_pass_granted` | webhook — `pass_kind`, `plan_tier`, `paddle_env`, `transaction_id` |

### Paper 2 Path (`/learn`)

Progress is localStorage; these fire from the path map and the lesson player. Interpreter runs inside a lesson also send `code_run` / `interpreter_error` with `feature_context: learn`.

| Event | Properties |
|-------|-----------|
| `learn_opened` | `course`, `from`, `signed_in`, `completed_count`, `playable_count`, `next_lesson` |
| `learn_continue_clicked` | lesson props + `source: continue` |
| `learn_lesson_clicked` | lesson props + `source: node` |
| `learn_gate_blocked` | lesson/level props + `source` (`node` on a gated map node, `roadmap` on a coming-level row) |
| `learn_gate_viewed` | landed on a locked/unplayable lesson URL |
| `learn_lesson_started` | lesson props + `already_complete` |
| `learn_check_submitted` | lesson props + `ok`, `reason` (`passed`\|`must_contain`\|`forbidden`\|`runtime`\|`wrong_output`\|…), `attempts`, `message` |
| `learn_quiz_submitted` | lesson props + `ok`, `attempts`, `correct_count`, `total` |
| `learn_lesson_completed` | lesson props + `attempts`, `$set` `learn_level` / `learn_completed_count` |
| `learn_level_completed` | `level`, `level_name` |
| `learn_path_completed` | all currently playable lessons done |
| `learn_path_clicked` | back to `/learn` — `source` `header`\|`gate` |
| `learn_next_clicked` | `destination` `lesson`\|`path` |
| `learn_prev_clicked` | `prev_lesson` |
| `learn_docs_clicked` | `docs_anchor` |
| `learn_pane_changed` | mobile `pane` `lesson`\|`editor`, `source` `tab`\|`cta` |
| `learn_signup_gate_shown` | lesson props + `gate: account` — signed-out student opened a level-3+ free lesson (`ACCOUNT_REQUIRED_FROM_LEVEL` in `learn/progress.ts`); the in-page sheet auto-opens |
| `learn_signup_gate_opened` | lesson props + `gate` (`account`\|`paywall`) — sheet opened from the gate button |
| `learn_signup_gate_dismissed` | lesson props + `gate` |
| `learn_signup_gate_completed` | lesson props + `gate`, `method` (`email`\|`google`; Google is detected on return via sessionStorage `learn_pending_auth`) |
| `learn_upgrade_clicked` | lesson props + `source` (`paywall` → auto-opens student checkout, `paywall_compare` → plain student pricing) |
| `nudge_shown` / `nudge_clicked` / `nudge_dismissed` (`nudge: learn_upgrade_level_complete`) | `level` — toast when the last free level is finished; links to the auto-opening student checkout |

Student checkout hand-off: `/pricing?checkout=student&from=<source>` auto-opens the Student monthly ($2/mo) Paddle checkout for a signed-in student with no plan (never for teachers). Signed out, it opens the in-page auth sheet first (`pricing_signin_prompt_shown` / `_clicked` / `_dismissed` / `_completed`, all with `source`) so the purchase carries `app_user_id` instead of relying on the Paddle email matching the account email. `subscribe_clicked` / `pass_clicked` now carry `source` (the `from` param, default `pricing`) and `auto_opened`.

### Compare (`/compare`)

Page-side events fire via `captureEvent` from `CompareAnalytics`. `$pageview` still fires automatically; these are the conversion funnel.

| Event | Properties |
|-------|-----------|
| `compare_viewed` | `signed_in`, `from` (query `from`, internal pathname, or referrer host), `question_count` |
| `compare_cta_clicked` | `destination` (`compiler`\|`practice`\|`exam`\|`pricing`\|`teacher_pricing`\|`classes`\|`faq`\|`docs`), `source` (`hero`\|`plans`\|`teachers`\|`pricing`\|`faq`) |
| `compare_section_clicked` | `section` (`why`\|`plans`\|`teachers`\|`usage`\|`pricing`\|`faq`) |

### Tutorial (`/tutorial`)

Page-side events fire via `captureEvent` from `TutorialAnalytics`. `$pageview` still fires automatically.

| Event | Properties |
|-------|-----------|
| `tutorial_viewed` | `signed_in`, `from` (query `from`, internal pathname, or referrer host) |
| `tutorial_cta_clicked` | `destination` (`learn`\|`compiler`\|`docs`\|`practice`\|`faq`), `source` (`hero`\|`who`\|`first-program`\|`routines`\|`trace`\|`path`\|`path-cta`\|`faq`) |

## Environment Variables

Copy `app/.env.example` → `app/.env`. Required:
- `DATABASE_URL`, `DIRECT_URL` — Neon PostgreSQL
- `AUTH_SECRET`, `BETTER_AUTH_SECRET` — session signing
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` — Google OAuth
- `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` — GitHub OAuth
- `RESEND_API_KEY` — email (optional in dev)
- `NEXT_PUBLIC_POSTHOG_KEY` — analytics (leave blank in dev to disable)
