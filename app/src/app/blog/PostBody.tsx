import type { ReactNode } from 'react';
import CodeBlock from '@/shared/ui/CodeBlock';
import type { BlogBlock } from '@/modules/content/blog';
import { BlogLink } from './BlogAnalytics';

const p = 'text-[15px] text-dark-text leading-relaxed';

/** `code`, **bold** and [text](href) inside a block's text. */
export function Inline({ text, slug }: { text: string; slug: string }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i): ReactNode => {
        if (part.startsWith('`') && part.endsWith('`') && part.length > 2)
          return (
            <code
              key={i}
              className="bg-code-bg border border-border px-1 py-0.5 rounded font-mono text-primary text-[0.9em]"
            >
              {part.slice(1, -1)}
            </code>
          );
        if (part.startsWith('**') && part.endsWith('**') && part.length > 4)
          return (
            <strong key={i} className="text-light-text font-semibold">
              {part.slice(2, -2)}
            </strong>
          );
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link)
          return (
            <BlogLink key={i} href={link[2]} slug={slug} source="inline" className="text-primary hover:underline">
              {link[1]}
            </BlogLink>
          );
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function Block({ block, slug }: { block: BlogBlock; slug: string }) {
  switch (block.kind) {
    case 'p':
      return (
        <p className={p}>
          <Inline text={block.text} slug={slug} />
        </p>
      );
    case 'h2':
      return (
        <h2 id={block.id} className="scroll-mt-20 pt-4 text-xl font-semibold text-light-text">
          <a href={`#${block.id}`} className="hover:text-primary transition-colors">
            {block.text}
          </a>
        </h2>
      );
    case 'h3':
      return <h3 className="text-base font-semibold text-light-text">{block.text}</h3>;
    case 'list': {
      const Tag = block.ordered ? 'ol' : 'ul';
      return (
        <Tag className={`${block.ordered ? 'list-decimal' : 'list-disc'} pl-5 space-y-1.5`}>
          {block.items.map((item, i) => (
            <li key={i} className={p}>
              <Inline text={item} slug={slug} />
            </li>
          ))}
        </Tag>
      );
    }
    case 'code':
      return (
        <figure className="my-1">
          {block.variant && (
            <figcaption
              className={`mono-label mb-1 ${block.variant === 'wrong' ? 'text-error' : 'text-success'}`}
            >
              {block.variant === 'wrong' ? '✗ Wrong' : '✓ Right'}
              {block.caption && <span className="ml-2 normal-case tracking-normal text-dark-text">{block.caption}</span>}
            </figcaption>
          )}
          <CodeBlock
            code={block.code}
            output={block.output}
            tryItEvent={{ name: 'blog_try_it_clicked', props: { slug, variant: block.variant ?? 'plain' } }}
          />
        </figure>
      );
    case 'stats':
      return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {block.items.map((item) => (
            <div key={item.label} className="rounded-lg border border-border bg-background/60 px-4 py-3">
              <div className="text-2xl font-bold tracking-tight text-light-text tabular-nums">{item.value}</div>
              <div className="text-xs text-dark-text mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>
      );
    case 'callout':
      return (
        <div className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
          {block.title && <p className="text-sm font-semibold text-light-text mb-1">{block.title}</p>}
          <p className="text-sm text-dark-text leading-relaxed">
            <Inline text={block.text} slug={slug} />
          </p>
        </div>
      );
    case 'table':
      return (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-background/60">
              <tr>
                {block.head.map((h) => (
                  <th key={h} className="px-3 py-2 text-left font-semibold text-light-text">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {block.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className="px-3 py-2 text-dark-text align-top">
                      <Inline text={cell} slug={slug} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

export default function PostBody({ blocks, slug }: { blocks: readonly BlogBlock[]; slug: string }) {
  return (
    <div className="space-y-4">
      {blocks.map((block, i) => (
        <Block key={i} block={block} slug={slug} />
      ))}
    </div>
  );
}
