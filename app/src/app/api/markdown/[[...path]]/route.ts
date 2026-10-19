import { htmlToMarkdown } from '@/shared/lib/htmlToMarkdown';

// Target of the `Accept: text/markdown` rewrite in next.config.ts. Renders the
// requested public page as HTML (the normal, cached path) and converts it.
const MAX_HTML_CHARS = 2_000_000;

export async function GET(req: Request, { params }: { params: Promise<{ path?: string[] }> }) {
  const url = new URL(req.url);
  const path = '/' + ((await params).path ?? []).join('/');
  // Same-origin pages only: never `//host`, an absolute URL, or our own API.
  if (!path.startsWith('/') || path.startsWith('//') || path.startsWith('/api/') || path.includes('\\')) {
    return new Response('Not found', { status: 404 });
  }

  const target = new URL(path, url.origin);
  // Explicit text/html so this request does not match the markdown rewrite again.
  const res = await fetch(target, { headers: { accept: 'text/html' }, redirect: 'manual' });
  const type = res.headers.get('content-type') ?? '';
  if (res.status >= 300 || !type.includes('text/html')) {
    const notFound = res.status === 404;
    return new Response(notFound ? 'Not found' : 'No markdown version of this page', {
      status: notFound ? 404 : 406,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', Vary: 'Accept' },
    });
  }

  const html = (await res.text()).slice(0, MAX_HTML_CHARS);
  const { title, markdown } = htmlToMarkdown(html, target.toString());
  const body = `${title ? `# ${title}\n\n` : ''}${markdown}\n`;
  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=3600',
      Vary: 'Accept',
      'X-Markdown-Tokens': String(Math.ceil(body.length / 4)),
    },
  });
}
