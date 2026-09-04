import { useState } from 'react';
import { Copy, Check, Play, Terminal } from 'lucide-react';
import { usePostHog } from 'posthog-js/react';
import highlightPseudocode from './highlightPseudocode';

interface CodeBlockProps {
  code: string;
  /** Expected terminal output, shown in a strip below the code. */
  output?: string;
  /** Hide the "Try it" button for fragments that aren't worth opening. */
  tryIt?: boolean;
}

const CodeBlock = ({ code, output, tryIt = true }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const ph = usePostHog();

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Same encoding the share button uses; CompilerPage decodes ?code= on load.
  const tryItHref = `/?code=${encodeURIComponent(btoa(encodeURIComponent(code)))}`;

  return (
    <div className="my-3 overflow-hidden rounded-md border border-border bg-code-bg">
      <div className="relative">
        <pre
          style={{ fontSize: 'var(--editor-font-size)' }}
          className="p-3 pr-24 font-mono text-light-text overflow-x-auto
            scrollbar-thin scrollbar-thumb-primary hover:scrollbar-thumb-primary-hover
            scrollbar-track-background scrollbar-thumb-rounded-full leading-relaxed"
        >
          <code>{highlightPseudocode(code)}</code>
        </pre>

        {/* Always-visible toolbar (most students are on touch devices) */}
        <div className="absolute top-1.5 right-1.5 flex items-center gap-1">
          <button
            onClick={copyToClipboard}
            className="p-1.5 rounded bg-background/80 hover:bg-surface transition-colors duration-200"
            aria-label="Copy code"
            title="Copy code"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5 text-dark-text" />}
          </button>
          {tryIt && (
            <a
              href={tryItHref}
              target="_blank"
              rel="noopener"
              onClick={() => ph?.capture('docs_try_it_clicked', { snippet_first_line: code.split('\n')[0]?.slice(0, 80) })}
              className="flex items-center gap-1 rounded bg-primary/15 px-2 py-1 text-[11px] font-semibold
                text-primary hover:bg-primary/30 transition-colors duration-200"
              title="Open this code in the editor"
            >
              <Play className="h-3 w-3" />
              Try it
            </a>
          )}
        </div>
      </div>

      {output !== undefined && (
        <div className="border-t border-border bg-background/70 px-3 py-2">
          <div className="flex items-center gap-1.5 mb-1 text-[10px] font-semibold uppercase tracking-wider text-dark-text/60 select-none">
            <Terminal className="h-3 w-3" />
            Output
          </div>
          <pre
            style={{ fontSize: 'var(--editor-font-size)' }}
            className="font-mono text-light-text/90 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto
              scrollbar-thin scrollbar-thumb-primary scrollbar-track-background scrollbar-thumb-rounded-full"
          >
            {output}
          </pre>
        </div>
      )}
    </div>
  );
};

export default CodeBlock;
