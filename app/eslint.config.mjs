import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';

const productModules = [
  'admin',
  'auth',
  'billing',
  'classes',
  'compiler',
  'content',
  'docs',
  'exams',
  'feedback',
  'flowchart',
  'learn',
  'onboarding',
  'practice',
  'progress',
  'share',
  'telemetry',
];

const eslintConfig = [
  ...nextVitals,
  ...nextTypeScript,
  {
    ignores: ['src/modules/interpreter/generated/**'],
  },
  {
    rules: {
      'react-hooks/set-state-in-effect': 'off',
      // Enforced here rather than via tsconfig noUnused*, which would also
      // flag the ANTLR-generated parser (not editable, ignored by ESLint).
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none', ignoreRestSiblings: true },
      ],
    },
  },
  {
    files: ['src/modules/interpreter/**/*.{ts,tsx}'],
    ignores: [
      'src/modules/interpreter/generated/**',
      'src/modules/interpreter/**/*.test.ts',
      'src/modules/interpreter/__tests__/**',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'posthog-js',
              message:
                'Interpreter must not import PostHog. Inject capture via setInterpreterCapture().',
            },
            {
              name: 'next',
              message: 'Interpreter is a language runtime, not a Next.js module.',
            },
            {
              name: 'next/navigation',
              message: 'Interpreter is a language runtime, not a Next.js module.',
            },
            {
              name: '@prisma/client',
              message: 'Interpreter is a language runtime; it cannot touch the database.',
            },
          ],
          patterns: [
            {
              group: ['@/shared/db', '@/app', '@/app/*'],
              message: 'Interpreter cannot import app/platform modules.',
            },
            ...productModules.flatMap((mod) => [
              {
                group: [`@/modules/${mod}`, `@/modules/${mod}/*`],
                message: 'Interpreter cannot import other product modules.',
              },
            ]),
          ],
        },
      ],
    },
  },
  {
    files: ['src/modules/billing/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@/modules/interpreter',
                '@/modules/interpreter/*',
                '@/modules/compiler',
                '@/modules/compiler/*',
                '@/modules/practice',
                '@/modules/practice/*',
              ],
              message: 'Billing cannot depend on the compiler or interpreter.',
            },
          ],
        },
      ],
    },
  },
  {
    // Layout chrome may compose feature UI (e.g. Header → UserMenu).
    // Primitives and infra may not.
    files: ['src/shared/ui/**/*.{ts,tsx}', 'src/shared/lib/**/*.{ts,tsx}', 'src/shared/icons/**/*.{ts,tsx}', 'src/shared/db.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: productModules
            .filter((mod) => mod !== 'content')
            .flatMap((mod) => [
              {
                group: [`@/modules/${mod}`, `@/modules/${mod}/*`],
                message:
                  'Shared primitives cannot import product modules. Interpreter tokens are the exception — import from @/modules/interpreter.',
              },
            ]),
        },
      ],
    },
  },
  {
    // API routes are the HTTP layer: guards + input + a service call. Data
    // access goes through a module's repo.ts (see shared/http/route.ts).
    files: ['src/app/api/**/route.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@/shared/db',
              message: 'Route handlers do not query the database. Call a service or a module repo.ts.',
            },
          ],
        },
      ],
    },
  },
  {
    // Feature pages reuse the editor kit (compiler/editor), not the playground page.
    files: ['src/modules/{practice,exams,learn,flowchart}/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/modules/compiler/CompilerPage'],
              message: 'Import the editor kit from @/modules/compiler/editor, not the playground page.',
            },
          ],
        },
      ],
    },
  },
];

export default eslintConfig;
