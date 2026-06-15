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
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SEO_KEYWORDS,
  SITE_NAME,
  SITE_URL,
} from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [...SEO_KEYWORDS],
  authors: [{ name: 'Sherlemious' }],
  creator: 'Sherlemious',
  publisher: 'Sherlemious',
  category: 'education',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: { icon: '/favicon.svg', shortcut: '/favicon.svg' },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    url: SITE_URL,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: SITE_NAME,
  url: SITE_URL,
  description: DEFAULT_DESCRIPTION,
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires a modern browser with JavaScript enabled',
  inLanguage: 'en',
  isAccessibleForFree: true,
  educationalUse: ['practice', 'revision', 'exam preparation'],
  learningResourceType: ['compiler', 'code editor', 'practice questions', 'exam simulator'],
  teaches: [
    'Cambridge IGCSE Computer Science pseudocode',
    'Cambridge O Level Computer Science pseudocode',
    'Cambridge International AS & A Level Computer Science 9618 pseudocode',
    'trace tables',
    'classes and object-oriented pseudocode',
  ],
  audience: {
    '@type': 'EducationalAudience',
    educationalRole: 'student',
  },
  accessibilityFeature: [
    'adjustableText',
    'alternativeText',
    'highContrastDisplay',
    'readingOrder',
  ],
  featureList: [
    'Browser-based pseudocode compiler with no installation required',
    'Interactive INPUT support where execution pauses and waits for user input',
    'Supports Cambridge IGCSE (0478/0984/2210) and Cambridge International AS & A Level Computer Science (9618) pseudocode syntax',
    'Full IGCSE pseudocode syntax: IF/ELSEIF/ELSE, FOR/WHILE/REPEAT, CASE OF, PROCEDURE, FUNCTION, arrays and file handling',
    'AS & A Level features including records, enums, pointers, SET OF, DATE, random-access files, classes, objects, inheritance, constructors and SUPER',
    'Built-in functions: LENGTH, SUBSTRING, ROUND, INT, RANDOM, ASC, CHR, NUM_TO_STRING, STRING_TO_NUM',
    'Trace table support for dry-running algorithms and checking variable changes',
    'Dyslexia-friendly editor option with OpenDyslexic typography',
    'Syntax highlighting editor with error markers',
    'Practice questions sourced from Cambridge past papers with difficulty, topic, year and session filters',
    'Multi-step hints and model solutions per question',
    'Instant autograder with visible and hidden test cases',
    'Timed practice exams with configurable duration and question count',
    'Progress tracking: solved status, best score, attempt history',
    'Analytics dashboard with activity heatmap and topic/difficulty breakdown',
    'Comprehensive language reference documentation with searchable TOC',
    'Share code via URL, clipboard, or WhatsApp',
    'File handling simulation via browser localStorage',
    'Google OAuth sign-in',
  ],
  alternativeHeadline: 'Cambridge IGCSE, O Level and AS & A Level Pseudocode Editor, Runner & Interpreter',
  alternativeName: [
    'pseudocode compiler',
    'pseudocode editor',
    'pseudocode runner',
    'pseudocode interpreter',
    'IGCSE pseudocode compiler',
    'A Level pseudocode compiler',
    'psuedocode compiler',
    'pseudocode complier',
  ],
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
        <link
          rel="preload"
          href="/fonts/inter/inter-latin-wght-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/fira-code/fira-code-latin-wght-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/fraunces/fraunces-latin-wght-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
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
      <body className="h-dvh flex flex-col overflow-hidden" suppressHydrationWarning>
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
