import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '../theme/ThemeContext';
import SessionWrapper from '../components/auth/SessionWrapper';
import Header from '../components/layout/header';
import { Toaster } from 'sonner';

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
  keywords: ['pseudocode', 'IGCSE', 'compiler', 'Cambridge', 'Computer Science', '0478', 'pseudocode online', 'IGCSE CS'],
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
      <body className="h-screen flex flex-col overflow-hidden">
        <SessionWrapper>
          <ThemeProvider>
            <Header />
            <main className="flex-1 min-h-0 flex flex-col overflow-hidden">{children}</main>
            <Toaster position="top-center" theme="dark" richColors />
          </ThemeProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
