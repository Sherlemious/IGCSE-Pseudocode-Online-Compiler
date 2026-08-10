# Course & Monetization Plan

> Strategy doc for turning the IGCSE Pseudocode Online Compiler from a free tool into a
> self-paced **course** with a visual roadmap. Captures the competitive research, the locked
> product decisions, the roadmap content outline, the free/paid split, and the build sequence.
>
> Status: **planning** (no implementation started). Last updated: 2026-06-19.

---

## 1. TL;DR

We are repositioning from "a pseudocode tool with a feature paywall" to **"a free best-in-class
pseudocode compiler that is also the practice environment inside a self-paced course."** The
compiler, debugger, and flowchart stay free (they are the acquisition engine and beat every free
rival). The **structured learning journey** — a visual roadmap of lessons → graded practice →
mock exams → report card → certificate — becomes the paid product.

Why: as a *tool* we are price-anchored against free competitors and a $2 rival. As a *course* we
compete with revision platforms and tutoring, where willingness-to-pay is 15–40× higher, and our
interactive engine is a moat none of those content brands have.

---

## 2. Locked decisions

These were decided during the research conversation and should not be re-litigated without reason:

| Decision | Choice | Rationale |
|---|---|---|
| Primary buyer | **B2C first, B2B (schools) later** | Validate willingness-to-pay fast; B2B is the bigger prize but a longer build. The course makes B2B *easier* (schools buy curricula, not tools). |
| Paywall philosophy | **Light** — gate depth, not the tool | Free rivals exist; gating the core tool loses acquisition. Gate the *course/progression*, not the editor. |
| Product framing | **Full course + visual roadmap** | Escapes the $2 price anchor; changes the competitive category. |
| Course scope | **Pseudocode / programming strand only** (0478 + 9618) | This is where the interactive engine is a real moat. Theory (hardware/networks/security) is just reading — no engine advantage, head-on fight with Seneca/Save My Exams. Revisit "theory later" only after the programming course is proven. |
| Delivery model | **Self-paced roadmap** | Scales infinitely, no per-student labor, fits the existing product. (Hybrid cohort/tutoring upsell can come later.) |

---

## 3. Competitive landscape (June 2026)

| Tool | Scope | Standout | Monetization |
|---|---|---|---|
| **pseudocode.pro** | 0478 / 2210 / 9618 | 50 free → **500 paid** challenges; past-paper starter code; **creative extensions** (canvas, sound, events, custom HTML); sister "Assembly Code Pro" | **$2 one-time** license (removes ads, desktop/offline app, +challenges). **Ads on free tier.** |
| **PseudoRun** (pseudorun.tech) | IGCSE | **CodeMirror 6** (same stack as us); full debugger (step/breakpoints/watch/call stack); 22 examples; exam mode w/ timer; browser extensions | **100% free, no ads** — and markets that. Listed on SideProjectors (may be for sale / not run as a business). |
| **cs.coursemo.com/igpc** | IGCSE | Syntax check, run, console. **v0.0.3 — alpha.** | None. |
| **igcse-ide.com** | IGCSE | Editor, run, examples, theming, report issues | None. |

### Key takeaways
- The only competitor charging anything charges **$2 one-time** — a brutally low anchor for a *tool*.
  A *course* sidesteps this entirely.
- **Nobody** offers a teacher/school product → B2B is wide open.
- **Nobody** offers AI feedback, an analytics/report card, a flowchart view, or a structured course →
  these are our differentiators.
- Two of four are fully free → the **core tool must stay free and generous** or we lose acquisition.

### Our competitive position (verified in code)
We are the **most capable product in the category**:
- Debugger: breakpoints, step execution, live variable state, **call stack** (`methodStack` in
  `interpreter.ts`) — matches PseudoRun, beats the rest.
- **Unique vs all four:** flowchart view (`flowchartConverter.ts`), Python conversion
  (`pythonConverter.ts`), AI feedback/grading, analytics / exam report card.
- ~105 topic-tagged questions + exam mode w/ timer + past-paper metadata.
- Strongest polish, theming/customization, and **mobile responsiveness** in the set.

**Gaps to close (funnel, not paywall):** distribution (a browser extension, like PseudoRun) and
optional engagement-via-fun (creative extensions, like pseudocode.pro). Neither is a paid feature.

> Note: keep the debugger and flowchart **free** — PseudoRun gives the debugger away, so gating ours
> would lose the top of funnel. They are table-stakes acquisition features now.

---

## 4. The product

**One line:** a free, best-in-class pseudocode compiler that is also the practice environment inside
a self-paced course — a visual roadmap that walks an IGCSE / A Level student from `OUTPUT "Hello"` to
exam-ready, every node backed by run-it-yourself lessons, auto-graded practice, and mock exams.

**The learning loop (per roadmap node):**

> Concept lesson → worked example (in the compiler) → auto-graded practice → checkpoint (quiz/trace) → unlock next node

Our moat vs content brands (Save My Exams, Seneca, Znotes, Udemy): they give a PDF/video; we give an
**interactive loop in-browser**. Our moat vs tools (PseudoRun, pseudocode.pro): nobody sells a
structured course, so we're not anchored to their price.

---

## 5. The roadmap (content spine)

Three tracks, ~18 nodes. Each node = lesson → worked example → auto-graded practice → checkpoint → unlock.
Status legend: ✅ have it · ⚠️ thin (needs more content/questions) · ❌ net-new.

### Track 1 — Foundations  *(free preview lives here)*
1. Output & your first program — *docs `first-program`, examples* ✅
2. Variables, constants & data types — *docs `variables`* ✅
3. Input & interaction — *docs `first-input`* ✅
4. Operators & expressions — *docs `operators`, 6 Qs* ✅
5. Selection (IF / CASE) — *docs `selection`, 16 Qs* ✅
6. Iteration (FOR / WHILE / REPEAT) — *docs `iteration`, 20 Qs* ✅

### Track 2 — Core exam skills  *(the heart of the paid course)*
7. Strings & text processing — *15 Qs* ✅
8. Arrays 1D — *17 Qs* ✅
9. Arrays 2D — *docs `arrays-2d`, 1 Q* ⚠️
10. Procedures & functions (params, scope, BYREF/BYVAL) — *4 Qs* ⚠️
11. File handling — *4 Qs* ⚠️
12. Standard algorithms (search, sort, totalling, max/min) — *15 "Algorithms" Qs* ✅
13. Validation & verification — *3 Qs* ⚠️
14. **Trace tables & dry runs** — *TraceTable feature* ✅, *content* ❌
15. Decomposition & reading the question / mark schemes — ❌ net-new, high exam value

### Track 3 — A Level (9618)  *(separate paid track / upsell)*
16. Records, user-defined types, pointers — *docs `alevel-types`* ✅, *Qs* ❌
17. OOP (classes, inheritance, encapsulation) — *docs `alevel-oop`* ✅, *1 Q* ⚠️
18. Recursion + ADTs (stacks/queues/linked lists/trees) + random files — *docs `alevel-random-files`* ✅, *Queues 1 Q* ⚠️

### Capstones
- Timed mock — IGCSE — *exam mode* ✅
- Timed mock — A Level — *exam mode* ✅
- "Exam-ready" report card + **certificate** — *report card* ✅, *certificate* ❌

---

## 6. Free / paid split

**Free (acquisition + SEO):**
- Compiler + debugger + flowchart + Python view
- The **roadmap visible in full** ("IGCSE pseudocode roadmap" is a search magnet; drives completion)
- **Track 1 (Foundations)** as a real, finishable taster that proves course quality

**Paid (the course):**
- Tracks 2–3, all graded checkpoints, unlimited mock exams, model solutions
- Report-card analytics (history, topic mastery, weak-topic targeting)
- "Exam-ready" certificate

---

## 7. Monetization & pricing

- **Frame as a course, not a tool** → escapes the $2 anchor.
- **B2C pricing:** ~£30–60 one-time, or annual aligned to the exam cycle. Consider an **Exam Season
  Pass** timed to May/June and Oct/Nov (IGCSE's calendar is the demand curve).
- **B2B (later):** per-seat curriculum license to teachers/schools. Stronger as a "course" than a
  "tool" — schools buy schemes of work. "Assign Module 3, see class report cards" is the pitch.
- **Avoid ads** (pseudocode.pro uses them; PseudoRun markets against them; ARPU is tiny and it
  conflicts with a paid course).
- **Payments do not exist yet** — no Stripe/Paddle, no checkout, no upgrade flow. The `Plan` field
  and `PREMIUM_GATING_ENABLED` flag exist but can't be set by a user. **This is the gating item for
  all revenue.**

---

## 8. What exists vs what's net-new

| Course need | Status | Notes |
|---|---|---|
| Curriculum taxonomy | ✅ | Docs sections + topic-tagged questions |
| Lesson reference content | ⚠️ | Exists as *reference*; must be rewritten as *teaching* |
| Worked examples | ✅ | Examples library (`data/examples.ts`) |
| Graded practice | ✅ | ~105 questions + auto/AI grading (`autograder.ts`) |
| Checkpoints | ✅ | Practice / trace tables (need wiring as gates) |
| Capstone assessment | ✅ | Exam mode + timer |
| Progress along path | ⚠️ | `Progress` is per-question; needs lesson/module/path completion |
| Interactive practice env | ✅ | Interpreter + debugger + flowchart |
| Visual roadmap UI | ❌ | Net-new |
| Prerequisite / unlock model | ❌ | Net-new — schema: `Module`/`Lesson`/`RoadmapNode` + edges |
| Payments / checkout / entitlement | ❌ | Net-new — blocks all revenue |
| Certificate | ❌ | Net-new |

---

## 9. Build sketch (high level — detailed plan TBD)

> Not a committed implementation plan; a sketch of the shape. Detail this before building.

**Data layer**
- New models: `Module`, `Lesson`, `RoadmapNode` (or a single node model with a `type`), prerequisite
  edges between nodes.
- Extend `Progress` (or add `LessonProgress`) to track lesson/module/path completion, not just
  per-question.
- Lesson content storage (MDX/DB) — decide authoring format.

**App layer**
- Visual roadmap page (skill-tree/path UI), node states: locked / available / in-progress / done.
- Lesson view that embeds the existing compiler + practice + checkpoint loop.
- Entitlement check (real, beyond the current boolean flag) gating Tracks 2–3.

**Payments**
- Stripe/Paddle integration, checkout, webhook → set `Plan`, upgrade flow in UI.

**Content (the long pole — see §10)**
- Rewrite docs → teaching lessons; fill thin nodes (9–11, 13, 14) and Track 3 with lessons + questions.

---

## 10. The main risk

**Content is now the product, and content is expensive.** A course lives or dies on lesson quality.
Authoring 15–18 modules of genuine *teaching* (not reference) + checkpoints + worked solutions is a
larger, ongoing effort than any feature built so far, and it shifts our competitive set toward
established content brands (Save My Exams, Seneca) with SEO and trust we'd have to earn.

**Mitigants:**
- Scope discipline — programming strand only (already decided).
- Ship Foundations + most of Core first; ~95 of 105 existing questions plus Tracks 1–2 docs mean a
  real course can launch before all content exists.
- A Level track and exam-skills nodes (14–15) are the genuine build-out, can follow launch.

---

## 11. Suggested sequencing

1. **Payments + entitlement** — nothing earns until a user can pay and be gated for real.
2. **Roadmap data model + UI** — `Module`/`Lesson`/`RoadmapNode`, completion tracking, the visual path.
3. **Wire existing assets into Track 1 + most of Track 2** — docs→lessons, attach existing questions
   as graded practice/checkpoints. Launch Foundations free + Core paid.
4. **Fill thin nodes + author exam-skills nodes (14–15)** — trace-table technique, decomposition/mark
   schemes; add questions to nodes 9–11, 13.
5. **A Level track (16–18) + certificate.**
6. **Later:** browser extension (distribution), B2B teacher/class dashboards, optional cohort/tutoring
   upsell, theory strand.
