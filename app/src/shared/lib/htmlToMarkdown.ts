// Small HTML → Markdown converter for the `Accept: text/markdown` view of our
// own server-rendered pages. Not a general converter: it covers the tags the
// site emits and drops chrome (nav, header, footer, scripts, svg).

const DROP = new Set(['script', 'style', 'noscript', 'svg', 'nav', 'header', 'footer', 'form', 'button', 'template', 'iframe', 'canvas']);
const VOID = new Set(['br', 'hr', 'img', 'input', 'meta', 'link', 'source', 'wbr']);
const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', rarr: '→', larr: '←', hellip: '…' };
const CELL = '\u0000';

function decode(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === '#') {
      const code = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) && code > 0 && code < 0x110000 ? String.fromCodePoint(code) : m;
    }
    return ENTITIES[e.toLowerCase()] ?? m;
  });
}

function attr(tag: string, name: string): string | undefined {
  const m = new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i').exec(tag);
  const v = m?.[1] ?? m?.[2] ?? m?.[3];
  return v === undefined ? undefined : decode(v);
}

export function htmlToMarkdown(html: string, baseUrl: string): { title: string; markdown: string } {
  const title = decode(/<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1] ?? '').trim();
  const main = /<main[\s\S]*?<\/main>/i.exec(html)?.[0] ?? /<body[\s\S]*<\/body>/i.exec(html)?.[0] ?? html;
  const resolve = (u: string) => {
    try {
      return new URL(u, baseUrl).toString();
    } catch {
      return u;
    }
  };

  let out = '';
  let skip = 0; // depth inside a dropped element
  let skipName = '';
  const lists: { ordered: boolean; n: number }[] = [];
  const links: string[] = [];
  let inPre = false;
  let row: string[] | null = null;
  let rows: string[][] = [];

  for (const tok of main.replace(/<!--[\s\S]*?-->/g, '').split(/(<[^>]+>)/)) {
    if (!tok) continue;
    if (tok[0] !== '<') {
      if (skip) continue;
      const text = decode(tok);
      out += inPre ? text : text.replace(/\s+/g, ' ');
      continue;
    }
    const m = /^<(\/?)([a-z0-9]+)/i.exec(tok);
    if (!m) continue;
    const closing = m[1] === '/';
    const name = m[2].toLowerCase();
    const selfClosed = VOID.has(name) || tok.endsWith('/>');

    if (skip) {
      if (name === skipName && !selfClosed) skip += closing ? -1 : 1;
      continue;
    }
    // Dropped chrome, or a decorative aria-hidden wrapper: skip through its matching close tag.
    if (!closing && !selfClosed && (DROP.has(name) || attr(tok, 'aria-hidden') === 'true')) {
      skip = 1;
      skipName = name;
      continue;
    }

    switch (name) {
      case 'h1': case 'h2': case 'h3': case 'h4': case 'h5': case 'h6':
        out += closing ? '\n\n' : `\n\n${'#'.repeat(Number(name[1]))} `;
        break;
      case 'p': case 'div': case 'section': case 'article': case 'blockquote': case 'figure': case 'figcaption': case 'details': case 'summary':
        out += name === 'blockquote' && !closing ? '\n\n> ' : '\n\n';
        break;
      case 'br':
        out += '  \n';
        break;
      case 'hr':
        out += '\n\n---\n\n';
        break;
      case 'ul': case 'ol':
        if (closing) lists.pop();
        else lists.push({ ordered: name === 'ol', n: 0 });
        out += '\n';
        break;
      case 'li':
        if (!closing) {
          const l = lists[lists.length - 1];
          if (l) l.n++;
          out += `\n${'  '.repeat(Math.max(0, lists.length - 1))}${l?.ordered ? `${l.n}.` : '-'} `;
        }
        break;
      case 'strong': case 'b':
        out += '**';
        break;
      case 'em': case 'i':
        out += '*';
        break;
      case 'pre':
        inPre = !closing;
        out += closing ? '\n```\n\n' : '\n\n```\n';
        break;
      case 'code':
        if (!inPre) out += '`';
        break;
      case 'a':
        if (closing) {
          const u = links.pop();
          if (u) out += `](${u})`;
        } else {
          const h = attr(tok, 'href');
          const useful = !!h && !h.startsWith('#') && !/^(javascript|mailto|tel):/i.test(h);
          links.push(useful ? resolve(h) : '');
          if (useful) out += '[';
        }
        break;
      case 'img': {
        const alt = attr(tok, 'alt');
        const src = attr(tok, 'src');
        if (alt && src) out += `![${alt}](${resolve(src)})`;
        break;
      }
      case 'table':
        if (closing) {
          const filled = rows.filter((r) => r.length);
          if (filled.length) {
            const cols = Math.max(...filled.map((r) => r.length));
            const fmt = (r: string[]) => `| ${Array.from({ length: cols }, (_, i) => r[i] ?? '').join(' | ')} |`;
            out += `\n\n${fmt(filled[0])}\n| ${Array(cols).fill('---').join(' | ')} |\n${filled.slice(1).map(fmt).join('\n')}\n\n`;
          }
          rows = [];
        }
        break;
      case 'tr':
        if (closing) {
          if (row) rows.push(row);
          row = null;
        } else row = [];
        break;
      case 'th': case 'td':
        if (!closing) out += CELL;
        else {
          // Move the cell text (everything since the opening marker) into the row.
          const at = out.lastIndexOf(CELL);
          if (at >= 0 && row) {
            row.push(out.slice(at + 1).replace(/\s+/g, ' ').replace(/\|/g, '\\|').trim());
            out = out.slice(0, at);
          }
        }
        break;
    }
  }

  const markdown = out
    .replaceAll(CELL, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\*\*\s*\*\*/g, '')
    .trim();
  return { title, markdown };
}
