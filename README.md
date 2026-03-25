# IGCSE Pseudocode Online Compiler

A browser-based pseudocode interpreter for the **Cambridge IGCSE Computer Science (0478/2210)** syllabus. Write and run pseudocode, practice past-paper questions, and simulate timed exams — all in one place.

**Live:** [pseudocode-compiler.sherlemious.com](https://pseudocode-compiler.sherlemious.com)

## Features

- **Interpreter** — Pseudocode is parsed and executed entirely in the browser via an ANTLR4 grammar and a custom tree-walking interpreter. No transpilation. No server round-trip.
- **Interactive editor** — CodeMirror 6 with syntax highlighting, line numbers, and error markers.
- **INPUT support** — Programs that use `INPUT` pause execution and prompt the user interactively.
- **File handling** — `OPENFILE`, `READFILE`, `WRITEFILE`, `CLOSEFILE` simulated in browser storage.
- **Practice mode** — Curated past-paper questions with hints, AI-graded test cases, and model solutions.
- **Exam simulation** — Timed exam sessions configurable by topic, difficulty, and question count.
- **Progress tracking** — Per-user history, scores, and topic/difficulty breakdowns.
- **Auth** — Google OAuth, GitHub OAuth, and email/password sign-in.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Editor | CodeMirror 6 |
| Parser | antlr4ng v3 (custom ANTLR4 grammar) |
| Database | PostgreSQL via [Neon](https://neon.tech) |
| ORM | Prisma |
| Auth | NextAuth.js v5 (Better Auth) |
| Email | Resend |
| Analytics | PostHog |

## File Structure

```
IGCSE-Pseudocode-Online-Compiler/
├── app/                                  # Next.js application
│   ├── prisma/
│   │   ├── schema.prisma                 # Database schema
│   │   ├── seed.ts                       # Seed script
│   │   └── migrations/
│   ├── public/
│   │   └── fonts/
│   └── src/
│       ├── app/                          # App Router pages & API routes
│       │   ├── page.tsx                  # Home — compiler
│       │   ├── layout.tsx                # Root layout
│       │   ├── analytics/                # Progress dashboard
│       │   ├── auth/signin & signup/     # Auth pages
│       │   ├── docs/                     # Syntax reference page
│       │   ├── exam/[examId]/            # Exam session & results
│       │   ├── practice/[questionId]/    # Practice question workspace
│       │   └── api/
│       │       ├── auth/[...nextauth]/   # NextAuth handler
│       │       ├── exam/                 # Exam CRUD + grading
│       │       ├── grade/                # AI answer grading
│       │       ├── nudges/               # Onboarding nudge state
│       │       └── questions/            # Practice question CRUD
│       ├── components/
│       │   ├── analytics/                # PostHogProvider, progress charts
│       │   ├── auth/                     # AuthForm, SessionWrapper, UserMenu
│       │   ├── common/                   # CodeBlock, Kw
│       │   ├── compiler/                 # CompilerPage, CodeMirrorEditor, outputDisplay
│       │   ├── exam/                     # ExamWorkspace, ExamTimer, ExamConfigForm
│       │   ├── feedback/                 # FeedbackSurvey
│       │   ├── layout/                   # Header, Footer, SettingsPanel
│       │   ├── onboarding/               # NudgeCards, OnboardingTour
│       │   ├── practice/                 # PracticeWorkspace, HintsPanel, SolutionPanel
│       │   └── share/                    # ShareButton, ExamShareButton
│       ├── data/
│       │   ├── examples.ts               # Built-in code examples
│       │   └── documentationToc.ts
│       ├── emails/
│       │   └── welcome.ts                # Welcome email template (Resend)
│       ├── interpreter/                  # ANTLR4-based pseudocode engine
│       │   ├── grammar/
│       │   │   └── Pseudocode.g4         # ANTLR4 grammar (source of truth)
│       │   ├── generated/                # Generated lexer/parser — do not edit
│       │   ├── core/
│       │   │   ├── interpreter.ts        # Tree-walking interpreter
│       │   │   ├── environment.ts        # Variable scoping
│       │   │   ├── values.ts             # Runtime value types
│       │   │   ├── arrays.ts             # Array operations
│       │   │   ├── builtins.ts           # Built-in functions
│       │   │   ├── filesystem.ts         # Browser localStorage file I/O
│       │   │   ├── serverFilesystem.ts   # Server-side file I/O (grading)
│       │   │   └── types.ts              # Shared types
│       │   ├── errorMessages.ts          # Human-friendly error messages
│       │   ├── parser.ts                 # Parse entry point
│       │   ├── pseudocode-lang.ts        # CodeMirror language extension
│       │   ├── useInterpreter.ts         # React hook
│       │   └── index.ts                  # Public API
│       ├── lib/
│       │   ├── auth.ts                   # NextAuth config
│       │   ├── autograder.ts             # AI-based test-case grading
│       │   ├── featureFlags.ts           # PostHog feature flags
│       │   ├── prisma.ts                 # Prisma client singleton
│       │   └── resend.ts                 # Email client
│       ├── theme/                        # Theme context & definitions
│       ├── types/                        # TypeScript type augmentations
│       └── utils/constants.ts
├── pseudocode.md                         # Full IGCSE pseudocode language reference
├── README.md
└── LICENSE
```

## Supported Language Features

See [pseudocode.md](pseudocode.md) for the full syntax reference.

- **Data types** — `INTEGER`, `REAL`, `CHAR`, `STRING`, `BOOLEAN`
- **Variables & constants** — `DECLARE`, `CONSTANT`
- **Assignment** — `←` or `<-`
- **Arrays** — 1D and 2D with custom bounds
- **I/O** — `INPUT`, `OUTPUT`
- **Arithmetic** — `+`, `-`, `*`, `/`, `^`, `DIV`, `MOD`
- **Comparison** — `=`, `<>`, `<`, `>`, `<=`, `>=`
- **Logical** — `AND`, `OR`, `NOT`
- **Selection** — `IF/THEN/ELSE/ENDIF`, `CASE OF/OTHERWISE/ENDCASE`
- **Iteration** — `FOR/TO/STEP/NEXT`, `WHILE/DO/ENDWHILE`, `REPEAT/UNTIL`
- **Subprograms** — `PROCEDURE/ENDPROCEDURE`, `FUNCTION/RETURNS/ENDFUNCTION`, `CALL`, `RETURN`
- **File handling** — `OPENFILE`, `READFILE`, `WRITEFILE`, `CLOSEFILE`
- **String functions** — `LENGTH()`, `LCASE()`, `UCASE()`, `SUBSTRING()`
- **Library routines** — `ROUND()`, `RANDOM()`, `INT()`, `EOF()`
- **Comments** — `// single line`

## Local Development

### Prerequisites

- Node.js 18+
- A PostgreSQL database (or a free [Neon](https://neon.tech) project)

### Setup

```bash
git clone https://github.com/Sherlemious/IGCSE-Pseudocode-Online-Compiler
cd IGCSE-Pseudocode-Online-Compiler/app
cp .env.example .env   # fill in your secrets
npm install
npm run db:migrate     # create tables
npm run db:seed        # optional: seed example questions
npm run dev            # http://localhost:3000
```

### Environment Variables

See `.env.example` for the full list. Required variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (pooled) |
| `DIRECT_URL` | PostgreSQL direct connection string |
| `AUTH_SECRET` | Random secret for NextAuth session signing |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Google OAuth credentials |
| `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` | GitHub OAuth credentials |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog project key (leave blank to disable) |

### Useful Commands

```bash
npm run db:migrate    # run Prisma migrations
npm run db:seed       # seed the database
npm run db:studio     # open Prisma Studio
npm run lint          # ESLint
npm run build         # production build
```

### Regenerating the Parser

If you modify `src/interpreter/grammar/Pseudocode.g4`, regenerate the TypeScript parser:

```bash
npm run antlr:generate
```

The generated files in `src/interpreter/generated/` are committed to the repo — do not edit them by hand.

## Contributing

- Fork the repo and create a branch
- Write clear commit messages
- Ensure `npm run build` passes before opening a PR

## License

This project may not be redistributed. See [LICENSE](LICENSE) for details.
