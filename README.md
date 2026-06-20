# IGCSE and AS & A Level Pseudocode Online Compiler

A browser-based pseudocode interpreter for **Cambridge IGCSE Computer Science (0478/0984/2210)** and **Cambridge International AS & A Level Computer Science (9618)**. Write and run pseudocode, practice past-paper questions, and simulate timed exams — all in one place.

**Live:** [pseudocode-compiler.sherlemious.com](https://pseudocode-compiler.sherlemious.com)

## Features

- **Browser-based Interpreter** — Pseudocode is parsed and executed entirely in the browser via an ANTLR4 grammar and a custom tree-walking interpreter. No transpilation. No server round-trip.
- **Cambridge 9618 Support** — AS & A Level additions include user-defined types, `DATE`, pointers, sets, `BYREF`/`BYVAL`, random-access files, CASE ranges, and classes.
- **Interactive Editor** — CodeMirror 6 with syntax highlighting, line numbers, error markers, autocomplete, and selectable editor fonts (including a dyslexia-friendly option).
- **Command Palette** — `Ctrl`/`⌘ K` opens a grouped, searchable palette for every action (run, format, open, navigate, links), plus tidy **Open** and **Export** menus for examples, files, downloads, and share links.
- **Code Formatter** — One-click autoformatter re-indents pseudocode to match block structure.
- **Python View** — Convert pseudocode to equivalent Python on demand, with syntax highlighting and runtime helper shims.
- **Flowchart View** — Render pseudocode as an auto-laid-out flowchart (React Flow + dagre).
- **Trace Table** — Variable-by-variable execution trace collected as the program runs — a built-in exam-style dry-run.
- **I/O & File Handling** — `INPUT` support with interactive prompts, and `OPENFILE`, `READFILE`, `WRITEFILE` (including random-access records) simulated in browser storage.
- **Practice Mode** — Curated past-paper questions with faceted filtering and sort, hints, automated test-case grading, model solutions, and a template-vs-scratch start gate.
- **Exam Simulation** — Timed exam sessions configurable by topic, difficulty, and question count, with results presented as an exam-paper report card.
- **Progress & Analytics** — Activity heatmap, difficulty/topic breakdowns, and session history tracking.
- **Custom Themes** — DB-backed theme editor with a live preview and color pickers, managed from the settings panel.
- **Authentication** — Secure sign-in via Google OAuth, GitHub OAuth, and email/password.
- **Onboarding & Nudges** — Interactive tours and smart nudges to guide new users.
- **Admin Dashboard** — Platform analytics, user feedback, and user management.
- **Sharing** — Easily share code, practice solutions, and exam results via link.
- **Premium Gating** — Feature flag support for premium content restrictions.

## Tech Stack

| Layer          | Technology                                      |
| -------------- | ----------------------------------------------- |
| **Framework**  | Next.js 16 (App Router), React 19               |
| **Language**   | TypeScript 5                                    |
| **Styling**    | Tailwind CSS v4, tailwind-scrollbar             |
| **Components** | Radix UI, lucide-react / simple-icons, sonner   |
| **Editor**     | CodeMirror 6 (`@codemirror/lang-python` for Python view) |
| **Parser**     | antlr4ng v3 (custom ANTLR4 grammar)             |
| **Flowcharts** | React Flow (`@xyflow/react`) + dagre layout     |
| **Database**   | PostgreSQL via [Neon](https://neon.tech)        |
| **ORM**        | Prisma 6                                        |
| **Auth**       | Auth.js (NextAuth v5)                           |
| **Email**      | Resend                                          |
| **Analytics**  | PostHog                                         |
| **Markdown**   | react-markdown, remark-gfm                      |
| **Theming**    | react-colorful (custom theme editor)            |
| **Testing**    | Vitest                                          |

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
│       │   ├── admin/                    # Admin dashboard
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
│       │   ├── common/                   # CodeBlock, Kw, CommandPalette, GlobalCommands
│       │   ├── compiler/                 # CompilerPage, CodeMirrorEditor, outputDisplay,
│       │   │                             #   PythonView, FlowchartView, TraceTable
│       │   ├── exam/                     # ExamWorkspace, ExamTimer, ExamConfigForm
│       │   ├── feedback/                 # FeedbackSurvey
│       │   ├── icons/                    # PythonLogo and other brand icons
│       │   ├── layout/                   # Header, Footer, SettingsPanel (theme editor)
│       │   ├── onboarding/               # NudgeCards, OnboardingTour
│       │   ├── practice/                 # PracticeWorkspace, HintsPanel, SolutionPanel,
│       │   │                             #   PracticeStartGate
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
│       │   ├── converters/               # Pseudocode → Python / Flowchart
│       │   │   ├── pythonConverter.ts    # Pseudocode → Python source
│       │   │   ├── pythonHelpers.ts      # Runtime shims for emitted Python
│       │   │   └── flowchartConverter.ts # Pseudocode → flowchart nodes/edges
│       │   ├── formatter.ts              # Pseudocode autoformatter (re-indent)
│       │   ├── errorMessages.ts          # Human-friendly error messages
│       │   ├── parser.ts                 # Parse entry point
│       │   ├── pseudocode-lang.ts        # CodeMirror language extension
│       │   ├── useInterpreter.ts         # React hook
│       │   └── index.ts                  # Public API
│       ├── lib/
│       │   ├── auth.ts                   # NextAuth config
│       │   ├── admin.ts                  # Admin-access helpers
│       │   ├── autograder.ts             # AI-based test-case grading
│       │   ├── featureFlags.ts           # PostHog feature flags
│       │   ├── prisma.ts                 # Prisma client singleton
│       │   ├── seo.ts                    # Metadata helpers
│       │   ├── themeValidation.ts        # Custom theme validation
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

### AS & A Level (9618) additions

- **User-defined types** — `TYPE` records (dot notation), enums (ordinal arithmetic), pointers (`^x`, `ptr^`), `SET OF` + `DEFINE`
- **`DATE` type** — `dd/mm/yyyy` literals
- **Extended `CASE`** — ranges (`1 TO 5 :`) and multi-value labels
- **Parameter passing** — `BYREF` / `BYVAL` (sticky across following params)
- **Random-access files** — `OPENFILE ... FOR RANDOM`, `SEEK`, `GETRECORD`, `PUTRECORD`
- **OOP** — `CLASS`/`ENDCLASS`, `INHERITS`, `PUBLIC`/`PRIVATE` (runtime-enforced), constructor `NEW`, `SUPER`, `obj <- NEW ClassName(...)`
- **`ELSE IF`** — accepted as a two-word alias for `ELSEIF`

> One superset grammar covers both qualifications — all syntax is always available, with no mode toggle.

## Local Development

### Prerequisites

- Node.js 20+ (required by Next.js 16)
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

| Variable                                | Description                                                            |
| --------------------------------------- | ---------------------------------------------------------------------- |
| `DATABASE_URL`                          | PostgreSQL connection string (pooled)                                  |
| `DIRECT_URL`                            | PostgreSQL direct connection string                                    |
| `AUTH_SECRET`                           | Random secret for NextAuth session signing (`openssl rand -base64 32`) |
| `AUTH_URL`                              | Your app origin (e.g. `http://localhost:3000`)                         |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Google OAuth credentials                                               |
| `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` | GitHub OAuth credentials                                               |
| `NEXT_PUBLIC_POSTHOG_KEY`               | PostHog project key (leave blank to disable)                           |
| `NEXT_PUBLIC_PREMIUM_GATING_ENABLED`    | Set to `true` to enforce premium restrictions (`false` by default)     |

#### Google OAuth Redirect URI Setup

If you see `redirect_uri_mismatch`, add the exact callback URL in Google Cloud Console:

- Production: `https://pseudocode-compiler.sherlemious.com/api/auth/callback/google`
- Local: `http://localhost:3000/api/auth/callback/google`

Also ensure Authorized JavaScript origins include both `https://pseudocode-compiler.sherlemious.com` and `http://localhost:3000`.

### Useful Commands

```bash
npm run db:migrate    # run Prisma migrations
npm run db:seed       # seed the database
npm run db:studio     # open Prisma Studio
npm run lint          # ESLint
npm test              # run the Vitest suite (interpreter, converters, formatter)
npm run test:watch    # Vitest in watch mode
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
- Ensure `npm test` and `npm run build` pass before opening a PR

## License

This project may not be redistributed. See [LICENSE](LICENSE) for details.
