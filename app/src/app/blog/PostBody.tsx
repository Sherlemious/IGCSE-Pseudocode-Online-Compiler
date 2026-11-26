import type { ReactNode } from 'react';
import CodeBlock from '@/shared/ui/CodeBlock';
import type { BlogBlock } from '@/modules/content/blog';
import { BlogLink } from './BlogAnalytics';

const p = 'text-[17px] leading-[1.7] text-brand-ink';

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
              className="rounded bg-[#E4DCCB] px-1.5 py-0.5 font-mono text-[0.88em] text-brand-ink"
            >
              {part.slice(1, -1)}
            </code>
          );
        if (part.startsWith('**') && part.endsWith('**') && part.length > 4)
          return (
            <strong key={i} className="font-semibold text-brand-ink">
              {part.slice(2, -2)}
            </strong>
          );
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link)
          return (
            <BlogLink
              key={i}
              href={link[2]}
              slug={slug}
              source="inline"
              className="underline decoration-brand-ink/35 underline-offset-[3px] hover:decoration-brand-red"
            >
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
        <h2 id={block.id} className="display-serif scroll-mt-24 pt-6 text-[1.5rem] font-semibold leading-snug text-brand-ink">
          <a href={`#${block.id}`} className="hover:text-brand-red/90">
            {block.text}
          </a>
        </h2>
      );
    case 'h3':
      return <h3 className="display-serif pt-2 text-xl font-semibold text-brand-ink">{block.text}</h3>;
    case 'list': {
      const Tag = block.ordered ? 'ol' : 'ul';
      return (
        <Tag className={`${block.ordered ? 'list-decimal' : 'list-disc'} space-y-2 pl-6 marker:text-brand-ink`}>
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
              className={`mb-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider ${
                block.variant === 'wrong' ? 'text-[#8C2F24]' : 'text-[#1F6B3A]'
              }`}
            >
              {block.variant === 'wrong' ? 'Wrong' : 'Right'}
              {block.caption && (
                <span className="ml-2 font-sans text-[13px] font-normal normal-case tracking-normal text-brand-ink/75">
                  {block.caption}
                </span>
              )}
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
        <div className="grid grid-cols-1 gap-4 border-y border-brand-ink/15 py-4 sm:grid-cols-3">
          {block.items.map((item) => (
            <div key={item.label}>
              <div className="display-serif text-[1.75rem] font-semibold leading-none text-brand-ink tabular-nums">
                {item.value}
              </div>
              <div className="mt-1.5 text-sm leading-snug text-brand-ink/75">{item.label}</div>
            </div>
          ))}
        </div>
      );
    case 'callout':
      return (
        <aside className="border-l-4 border-brand-ink bg-[#E7E0D2] px-4 py-3">
          {block.title && <p className="mb-1 text-[15px] font-semibold text-brand-ink">{block.title}</p>}
          <p className="text-[15px] leading-relaxed text-brand-ink">
            <Inline text={block.text} slug={slug} />
          </p>
        </aside>
      );
    case 'table':
      return (
        <div className="overflow-x-auto border border-brand-ink/20">
          <table className="w-full text-[15px] leading-snug">
            <thead>
              <tr className="border-b border-brand-ink/20">
                {block.head.map((h) => (
                  <th key={h} className="px-3 py-2.5 text-left font-semibold text-brand-ink">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className="border-b border-brand-ink/10 last:border-b-0">
                  {row.map((cell, j) => (
                    <td key={j} className="px-3 py-2.5 align-top text-brand-ink">
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
    <div className="space-y-5">
      {blocks.map((block, i) => (
        <Block key={i} block={block} slug={slug} />
      ))}
    </div>
  );
}
