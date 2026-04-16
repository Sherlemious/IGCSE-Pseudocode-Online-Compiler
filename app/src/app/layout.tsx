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
  'Write and run IGCSE pseudocode online. Free browser-based compiler for Cambridge Computer Science 0478 syllabus.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'IGCSE Pseudocode Compiler',
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
    // student intent
    'learn pseudocode', 'IGCSE revision', 'IGCSE practice', 'IGCSE past papers',
    'Cambridge past papers', 'IGCSE CS revision', 'computer science revision',
    // tool type
    'free pseudocode compiler', 'online pseudocode IDE', 'browser pseudocode',
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
    title: 'IGCSE Pseudocode Compiler',
    description: DESCRIPTION,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: 'IGCSE Pseudocode Compiler',
    description: DESCRIPTION,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'IGCSE Pseudocode Compiler',
  url: SITE_URL,
  description: DESCRIPTION,
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
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
