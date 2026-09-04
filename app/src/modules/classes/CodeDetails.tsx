import { Code2 } from 'lucide-react';

/** Read-only, collapsible code viewer for the teacher dashboard. Server-safe
 *  (native <details>, no client JS). */
export default function CodeDetails({ label, code }: { label: string; code: string | null }) {
  if (!code || !code.trim()) {
    return <p className="text-[11px] text-dark-text/50 italic">No code submitted.</p>;
  }
  return (
    <details className="group">
      <summary className="flex items-center gap-1.5 cursor-pointer text-[11px] text-primary hover:underline list-none">
        <Code2 size={12} />
        {label}
      </summary>
      <pre className="mt-2 bg-background border border-border rounded-lg p-3 text-xs font-mono text-light-text overflow-x-auto whitespace-pre scrollbar-pretty">
        {code}
      </pre>
    </details>
  );
}
