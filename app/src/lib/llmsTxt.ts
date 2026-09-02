import toc from '@/data/documentationToc';
import { examples, exampleSlug } from '@/data/examples';
import { faqItems } from '@/data/faq';
import { prisma } from '@/lib/prisma';
import { paperReference, SITE_NAME, SITE_URL } from '@/lib/seo';

function line(href: string, title: string, note?: string) {
  const url = href.startsWith('http') ? href : `${SITE_URL}${href}`;
  return note ? `- [${title}](${url}): ${note}` : `- [${title}](${url})`;
}

export async function buildLlmsTxt() {
  const sections: string[] = [
    `# ${SITE_NAME}`,
    '',
    '> Free in-browser compiler and practice environment for Cambridge IGCSE Computer Science (0478/0984), O Level (2210), and AS & A Level Computer Science (9618) pseudocode.',
    '',
    'Programs are parsed and executed in the browser. Practice questions and exams are graded server-side by comparing printed output to test cases. This is not an official Cambridge International product.',
    '',
    '## Product',
    line('/', 'Online compiler', 'write and run Cambridge pseudocode'),
    line('/docs', 'Syntax documentation', 'IGCSE and 9618 reference'),
    line('/practice', 'Practice questions', 'past-paper style tasks with autograding'),
    line('/examples', 'Cambridge pseudocode examples', 'runnable snippets by topic'),
    line('/faq', 'FAQ', 'how the site works, DECLARE, teachers, grading'),
    line('/privacy', 'Privacy policy'),
    line('/terms', 'Terms'),
    line('/refund', 'Refund policy'),
    '',
    '## Syntax documentation',
  ];

  for (const entry of toc) {
    sections.push(line(`/docs#${entry.id}`, entry.label));
    for (const child of entry.children ?? []) {
      sections.push(line(`/docs#${child.id}`, `${entry.label}: ${child.label}`));
    }
  }

  sections.push('', '## Examples');
  for (const example of examples) {
    sections.push(
      line(`/examples#${exampleSlug(example.title)}`, example.title, example.category),
    );
  }

  sections.push('', '## FAQ');
  for (const item of faqItems) {
    sections.push(line(`/faq#${item.id}`, item.question));
  }

  try {
    const questions = await prisma.question.findMany({
      select: {
        id: true,
        title: true,
        topic: true,
        difficulty: true,
        year: true,
        session: true,
        variant: true,
        questionNumber: true,
        part: true,
        paper: true,
      },
      orderBy: [{ year: 'desc' }, { title: 'asc' }],
      take: 1000,
    });

    if (questions.length > 0) {
      sections.push('', '## Practice questions');
      for (const question of questions) {
        const ref = paperReference(question);
        const bits = [question.topic, question.difficulty, ref].filter(Boolean);
        sections.push(
          line(
            `/practice/${question.id}`,
            question.title,
            bits.length > 0 ? bits.join(' · ') : undefined,
          ),
        );
      }
    }
  } catch {
    // Same fallback as sitemap: omit the bank if the database is unreachable.
  }

  sections.push('');
  return sections.join('\n');
}
