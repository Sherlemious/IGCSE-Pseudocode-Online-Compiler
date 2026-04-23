# CLAUDE.md — IGCSE Pseudocode Online Compiler

## Stack

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS** — dark navy theme (`#0D1B2A` bg, `#778DA9` primary, `#EF4444` error)
- **CodeMirror 6** — editor with custom pseudocode language extension
- **antlr4ng v3** — ANTLR4 parser for pseudocode
- **Prisma** + **PostgreSQL** (Neon) — database ORM
- **NextAuth.js v5** — auth (Google OAuth, GitHub OAuth, email/password)
- **Resend** — transactional email
- **PostHog** — analytics (project: `pseudocode-compiler.sherlemious.com`)
- **tsconfig**: `strict`, `noUnusedLocals`, `noUnusedParameters`

## Architecture

The app has two distinct halves:

**Client-side interpreter** — pseudocode is parsed and executed entirely in the browser. No server round-trip for running code. The ANTLR4 lexer/parser runs in a Web Worker context and the tree-walking interpreter is fully async to support `INPUT` pausing.

**Next.js backend** — API routes handle auth, practice/exam CRUD, AI grading, and nudge state. Database access goes through Prisma.

## Key Paths

| Path | Purpose |
|------|---------|
| `app/src/interpreter/grammar/Pseudocode.g4` | ANTLR4 grammar — source of truth |
| `app/src/interpreter/generated/` | Generated lexer/parser — **do not edit** |
| `app/src/interpreter/core/interpreter.ts` | Tree-walking interpreter |
| `app/src/interpreter/core/environment.ts` | Variable scoping / closures |
| `app/src/interpreter/errorMessages.ts` | Human-friendly parse + runtime error messages |
| `app/src/interpreter/useInterpreter.ts` | React hook wrapping the interpreter |
| `app/src/lib/autograder.ts` | AI-based test-case grading |
| `app/src/lib/auth.ts` | NextAuth config |
| `app/prisma/schema.prisma` | Database schema |

## ANTLR4 Quirks

- **antlr4ng v3** uses `BaseErrorListener`, not `ErrorListener`
- Grammar `op=TOKEN` labels generate `_op` (underscore prefix) on the parse tree node
- `NEWLINE` is a **significant token** — not skipped; the grammar uses it for statement separation
- Case-insensitive keywords are implemented via letter fragments (e.g. `D E C L A R E`)
- Generated files live in `src/interpreter/generated/` — regenerate with `npm run antlr:generate` after editing the grammar

## Interpreter Design

- Fully **async** — every visitor method is `async` to support `INPUT` pausing and UI responsiveness
- **AbortController** for cancellation — checked at every loop iteration
- **ReturnSignal** is thrown (not returned) to unwind the call stack from `RETURN` statements
- `filesystem.ts` = browser localStorage file I/O; `serverFilesystem.ts` = server-side (used during AI grading)

### INPUT syntax

Two forms are supported:
```
INPUT identifier                          // plain input
INPUT identifier, "prompt text"          // displays prompt before the input field
INPUT identifier[index]                   // array element input
INPUT identifier[index], "prompt text"   // array element with prompt
```

The optional string literal is stripped of its quotes and passed to `onInputRequest(variableName, prompt?)` → stored in `OutputEntry.prompt?` → rendered in `OutputDisplay` as a `text-primary` line above the input field.

## Error Messages

`errorMessages.ts` converts raw ANTLR parse errors and runtime errors into student-friendly messages. Raw messages are still sent to PostHog for analysis.

Key maps:
- `SYNTAX_HINTS` — missing closing keywords (ENDIF, ENDWHILE, etc.) + missing `:` (colon in DECLARE/CASE)
- `WRONG_TOKENS` — non-IGCSE keywords (print, var, let, :=, `(` at line start, etc.)
- `PORTUGOL_TOKENS` — Portugol/VisualG keywords (escreval, leia, fimse, senao, etc.) — detects students writing Brazilian pseudocode and redirects them to the IGCSE equivalent

Additional patterns (based on PostHog top-error analysis, Apr 2026):
- `.` character → "not valid here, use `&` for string join"
- Keyword on same line as previous statement → "must be on its own line"
- `UNTIL` inside a FOR loop → directs to REPEAT or NEXT
- `ENDIF` where `THEN` expected → missing THEN hint
- `\nNEXT` at top level → missing FOR loop hint
- `,` inside `[...]` in non-2D context → array indexing hint
- Extraneous `]` → bracket-matching hint
- Newline token as expression → "line seems incomplete"

## Database Schema (Prisma)

- `User` / `Account` / `Session` — NextAuth tables
- `Question` / `TestCase` — practice questions with test cases
- `Progress` — per-user question completion state
- `ExamAttempt` / `ExamAnswer` — timed exam sessions
- `Example` — built-in code examples (also seeded in `data/examples.ts`)

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
| `share_clicked` | `method`, `context` |
| `share_completed` | `method` |
| `sign_in_clicked` | `source` |
| `user_authenticated` | — |
| `user_signed_out` | — |
| `nudge_shown` | `nudge` |
| `nudge_clicked` | `nudge` |
| `nav_clicked` | `destination`, `from` |
| `feedback_submitted` | — |

## Environment Variables

Copy `app/.env.example` → `app/.env`. Required:
- `DATABASE_URL`, `DIRECT_URL` — Neon PostgreSQL
- `AUTH_SECRET`, `BETTER_AUTH_SECRET` — session signing
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` — Google OAuth
- `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` — GitHub OAuth
- `RESEND_API_KEY` — email (optional in dev)
- `NEXT_PUBLIC_POSTHOG_KEY` — analytics (leave blank in dev to disable)
