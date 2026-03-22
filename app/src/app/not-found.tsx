import Link from 'next/link';
import { Braces, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center bg-background bg-dot-grid relative p-8 select-none">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(var(--color-primary-rgb), 0.05) 0%, transparent 70%)',
        }}
      />
      <div className="relative text-center max-w-sm">
        <div className="text-[96px] font-mono font-bold text-border/50 leading-none mb-4 tracking-tighter">
          404
        </div>
        <div className="flex items-center justify-center gap-2 mb-3">
          <Braces className="h-4 w-4 text-primary" />
          <span className="text-base font-bold text-light-text">Page not found</span>
        </div>
        <p className="text-xs text-dark-text mb-8 leading-relaxed">
          This page doesn&apos;t exist or has been moved.<br />
          Head back to the compiler to keep writing pseudocode.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-on-primary
            text-sm font-semibold hover:opacity-90 transition-opacity
            shadow-[0_0_20px_-4px_rgba(var(--color-primary-rgb),0.4)]"
        >
          <ArrowLeft size={14} />
          Back to Compiler
        </Link>
      </div>
    </div>
  );
}
