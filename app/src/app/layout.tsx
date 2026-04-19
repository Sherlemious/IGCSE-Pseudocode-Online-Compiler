import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { ThemeProvider } from '../theme/ThemeContext';
import SessionWrapper from '../components/auth/SessionWrapper';
import Header from '../components/layout/header';
import { Toaster } from 'sonner';
import PostHogProvider from '../components/analytics/PostHogProvider';
import SessionIdentifier from '../components/analytics/SessionIdentifier';
import OnboardingNudges from '../components/onboarding/OnboardingNudges';

const SITE_URL = 'https://pseudocode-compiler.sherlemious.com';
const DESCRIPTION =
  'Write, run and debug Cambridge IGCSE pseudocode in your browser. Free compiler with interactive input, practice questions from past papers, timed exams and instant autograding.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'IGCSE Pseudocode Compiler — Free Online Editor & Runner',
    template: '%s | IGCSE Pseudocode Compiler',
  },
  description: DESCRIPTION,
  keywords: [
    // syllabus codes
    '0478', '0984', '2210',
    // exam boards & levels
    'IGCSE', 'IGCSE 9-1', 'O Level', 'Cambridge IGCSE', 'Cambridge O Level', 'CIE',
    // subject names
    'Computer Science', 'IGCSE Computer Science', 'O Level Computer Science',
    // core tool terms — spelling variants
    'pseudocode', 'pseudo code', 'pseudo-code',
    'pseudocode compiler', 'pseudocode interpreter', 'pseudocode online',
    'run pseudocode', 'pseudocode editor', 'pseudocode runner',
    'pseudocode checker', 'pseudocode tester', 'pseudocode simulator',
    // translator / converter
    'pseudocode translator', 'pseudocode to Python', 'pseudocode to code',
    'convert pseudocode', 'pseudocode converter', 'translate pseudocode',
    // algorithm & CS concepts students search
    'algorithm', 'flowchart', 'trace table', 'dry run', 'pseudocode algorithm',
    'pseudocode examples', 'pseudocode syntax', 'Cambridge pseudocode syntax',
    // language features students look up
    'pseudocode arrays', 'pseudocode functions', 'pseudocode procedures',
    'pseudocode file handling', 'pseudocode INPUT OUTPUT',
    'pseudocode IF ELSE', 'pseudocode FOR loop', 'pseudocode WHILE loop',
    'pseudocode REPEAT UNTIL', 'pseudocode CASE OF',
    'pseudocode DECLARE', 'pseudocode INTEGER REAL STRING BOOLEAN',
    // practice & exam features
    'pseudocode practice questions', 'pseudocode past paper questions',
    'pseudocode exam simulator', 'timed pseudocode exam',
    'pseudocode autograder', 'pseudocode autograding', 'pseudocode test cases',
    'IGCSE CS practice questions', 'IGCSE computer science past papers',
    // student intent
    'learn pseudocode', 'IGCSE revision', 'IGCSE practice', 'IGCSE past papers',
    'Cambridge past papers', 'IGCSE CS revision', 'computer science revision',
    'pseudocode help', 'pseudocode tutorial', 'pseudocode for beginners',
    // tool type
    'free pseudocode compiler', 'online pseudocode IDE', 'browser pseudocode',
    'no install pseudocode', 'pseudocode without Python',
    // regional
    'Egypt', 'IGCSE Egypt', 'Cambridge Egypt',
    'UAE', 'Saudi Arabia', 'Pakistan', 'Nigeria', 'Kenya', 'international school',
  ],
  authors: [{ name: 'Sherlemious' }],
  icons: { icon: '/favicon.svg', shortcut: '/favicon.svg' },
  openGraph: {
    type: 'website',
    siteName: 'IGCSE Pseudocode Compiler',
    url: SITE_URL,
    title: 'IGCSE Pseudocode Compiler — Free Online Editor & Runner',
    description: DESCRIPTION,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: 'IGCSE Pseudocode Compiler — Free Online Editor & Runner',
    description: DESCRIPTION,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'IGCSE Pseudocode Compiler',
  url: SITE_URL,
  description: DESCRIPTION,
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires a modern browser with JavaScript enabled',
  inLanguage: 'en',
  audience: {
    '@type': 'EducationalAudience',
    educationalRole: 'student',
  },
  featureList: [
    'Browser-based pseudocode compiler — no installation required',
    'Interactive INPUT support — execution pauses and waits for user input',
    'Full Cambridge IGCSE pseudocode syntax: IF/ELSEIF/ELSE, FOR/WHILE/REPEAT, CASE OF, PROCEDURE, FUNCTION, arrays, file handling',
    'Built-in functions: LENGTH, SUBSTRING, ROUND, INT, RANDOM, ASC, CHR, NUM_TO_STRING, STRING_TO_NUM',
    'Syntax highlighting editor with error markers',
    'Practice questions sourced from IGCSE past papers with difficulty and topic filters',
    'Multi-step hints and model solutions per question',
    'Instant autograder with visible and hidden test cases',
    'Timed exam simulation with configurable duration and question count',
    'Progress tracking: solved status, best score, attempt history',
    'Analytics dashboard with activity heatmap and topic/difficulty breakdown',
    'Comprehensive language reference documentation with searchable TOC',
    'Share code via URL, clipboard, or WhatsApp',
    'File handling simulation via browser localStorage',
    'Google and GitHub OAuth sign-in',
  ],
  alternativeHeadline: 'IGCSE Pseudocode Editor, Runner & Interpreter',
  alternativeName: ['pseudocode compiler', 'pseudocode editor', 'pseudocode runner', 'pseudocode interpreter', 'psuedocode compiler', 'pseudocode complier'],
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-8DTBPF97YS"
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-8DTBPF97YS');
        `}
      </Script>
      <body className="h-screen flex flex-col overflow-hidden" suppressHydrationWarning>
        <PostHogProvider>
          <SessionWrapper>
            <SessionIdentifier />
            <OnboardingNudges />
            <ThemeProvider>
              <Header />
              <main className="flex-1 min-h-0 flex flex-col overflow-hidden">{children}</main>
              <Toaster position="top-center" theme="dark" richColors />
            </ThemeProvider>
          </SessionWrapper>
        </PostHogProvider>
      </body>
    </html>
  );
}
