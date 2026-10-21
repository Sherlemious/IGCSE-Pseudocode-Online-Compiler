'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/** Same markdown rendering as a practice question. */
export default function QuestionMarkdown({ markdown }: { markdown: string }) {
  return (
    <div className="text-sm text-light-text/85 leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ ...props }) => <h3 className="display-serif text-lg font-semibold text-light-text mt-5 mb-2" {...props} />,
          h2: ({ ...props }) => <h3 className="display-serif text-lg font-semibold text-light-text mt-5 mb-2" {...props} />,
          h3: ({ ...props }) => <h4 className="text-sm font-semibold text-light-text mt-4 mb-2" {...props} />,
          p: ({ ...props }) => <p className="mb-3" {...props} />,
          strong: ({ ...props }) => <strong className="text-light-text font-semibold" {...props} />,
          ul: ({ ...props }) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
          ol: ({ ...props }) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
          li: ({ ...props }) => <li className="text-light-text/85" {...props} />,
          code: ({ className, children, ...props }) => {
            const content = String(children);
            const isInline = !className && !content.includes('\n');
            if (isInline) {
              return (
                <code
                  className="font-mono text-[0.82em] px-1 py-0.5 rounded bg-surface border border-border text-info"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code className="font-mono text-xs text-light-text" {...props}>
                {children}
              </code>
            );
          },
          pre: ({ ...props }) => (
            <pre
              className="mb-4 p-3 rounded bg-code-bg border border-border overflow-x-auto
                scrollbar-thin scrollbar-thumb-primary scrollbar-track-background"
              {...props}
            />
          ),
          table: ({ ...props }) => (
            <div className="mb-4 overflow-x-auto">
              <table className="w-full border-collapse text-xs" {...props} />
            </div>
          ),
          thead: ({ ...props }) => <thead className="bg-surface text-light-text" {...props} />,
          tbody: ({ ...props }) => <tbody className="text-light-text/85" {...props} />,
          tr: ({ ...props }) => <tr className="border-b border-border" {...props} />,
          th: ({ ...props }) => <th className="text-left px-2 py-1.5 font-semibold" {...props} />,
          td: ({ ...props }) => <td className="px-2 py-1.5" {...props} />,
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
