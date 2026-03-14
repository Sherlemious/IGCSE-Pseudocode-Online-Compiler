import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '../theme/ThemeContext';
import Header from '../components/layout/header';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: {
    default: 'IGCSE Pseudocode Compiler',
    template: '%s | IGCSE Pseudocode Compiler',
  },
  description:
    'Write and run IGCSE pseudocode online. Free browser-based compiler for Cambridge Computer Science 0478 syllabus.',
  keywords: ['pseudocode', 'IGCSE', 'compiler', 'Cambridge', 'Computer Science', '0478'],
  authors: [{ name: 'Sherlemious' }],
  icons: { icon: '/favicon.svg', shortcut: '/favicon.svg' },
  openGraph: {
    type: 'website',
    siteName: 'IGCSE Pseudocode Compiler',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="h-screen flex flex-col overflow-hidden">
        <ThemeProvider>
          <Header />
          <main className="flex-1 min-h-0 flex flex-col overflow-hidden">{children}</main>
          <Toaster position="top-center" theme="dark" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
