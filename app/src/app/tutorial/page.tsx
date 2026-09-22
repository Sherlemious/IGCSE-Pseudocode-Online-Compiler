import type { Metadata } from 'next';
import IndexLinks from '@/shared/layout/IndexLinks';
import CodeBlock from '@/shared/ui/CodeBlock';
import Kw from '@/shared/ui/Kw';
import {
  TUTORIAL_ABSOLUTE_TITLE,
  TUTORIAL_DESCRIPTION,
  TUTORIAL_FAQS,
  TUTORIAL_KEYWORDS,
  TUTORIAL_PATH,
  TUTORIAL_PATH_LEVELS,
  TUTORIAL_SNIPPETS,
  TUTORIAL_TITLE,
} from '@/modules/content/tutorial';
import { SHARE_IMAGE, SITE_NAME, SITE_URL } from '@/shared/lib/seo';
import { TutorialCtaLink, TutorialTracker } from './TutorialAnalytics';
import { AnswerLines, LogoMark, PaperGrain } from '@/shared/brand';

export const metadata: Metadata = {
  title: {
    absolute: TUTORIAL_ABSOLUTE_TITLE,
  },
  description: TUTORIAL_DESCRIPTION,
  keywords: [...TUTORIAL_KEYWORDS],
  alternates: {
    canonical: TUTORIAL_PATH,
  },
  openGraph: {
    title: TUTORIAL_ABSOLUTE_TITLE,
    description: TUTORIAL_DESCRIPTION,
    url: `${SITE_URL}${TUTORIAL_PATH}`,
    type: 'article',
    images: [SHARE_IMAGE],
  },
};

const ctaPrimary =
  'inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-colors';
const ctaSecondary =
  'inline-flex items-center justify-center rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-light-text hover:border-primary/40 hover:text-primary transition-colors';
const navChip =
  'text-[11px] px-2 py-1 rounded border border-border text-dark-text hover:text-primary hover:border-primary/40 transition-colors';
const h2 = 'text-lg font-semibold text-light-text border-b border-border pb-2';
const p = 'text-sm text-dark-text leading-relaxed';
const li = 'text-sm text-dark-text leading-relaxed';

const SECTIONS = [
  { href: '#who', label: 'Who this is for' },
  { href: '#first-program', label: 'First program' },
  { href: '#declare', label: 'DECLARE' },
  { href: '#input', label: 'INPUT' },
  { href: '#selection', label: 'IF / CASE' },
  { href: '#loops', label: 'Loops' },
  { href: '#arrays', label: 'Arrays' },
  { href: '#routines', label: 'Procedures' },
  { href: '#files', label: 'Files' },
  { href: '#trace', label: 'Trace tables' },
  { href: '#traps', label: 'Exam traps' },
  { href: '#path', label: 'Paper 2 Path' },
  { href: '#faq', label: 'FAQ' },
] as const;

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        {
          '@type': 'ListItem',
          position: 2,
          name: TUTORIAL_TITLE,
          item: `${SITE_URL}${TUTORIAL_PATH}`,
        },
      ],
    },
    {
      '@type': 'Course',
      name: TUTORIAL_TITLE,
      description: TUTORIAL_DESCRIPTION,
      url: `${SITE_URL}${TUTORIAL_PATH}`,
      inLanguage: 'en',
      isAccessibleForFree: true,
      educationalLevel: ['Cambridge O Level', 'IGCSE'],
      teaches: [
        'Cambridge O Level Computer Science 2210 pseudocode',
        'Cambridge IGCSE Computer Science 0478 Paper 2 algorithms',
        'DECLARE, INPUT, OUTPUT, IF, CASE, FOR, WHILE, REPEAT',
        'arrays, procedures, functions, file handling, trace tables',
      ],
      about: [
        'Cambridge O Level Computer Science 2210',
        'Cambridge IGCSE Computer Science 0478',
        'Cambridge IGCSE Computer Science 0984',
        'Paper 2 Algorithms, Programming and Logic',
      ],
      provider: {
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
      },
      hasCourseInstance: {
        '@type': 'CourseInstance',
        courseMode: 'online',
        instructor: { '@type': 'Organization', name: SITE_NAME },
      },
    },
    {
      '@type': 'HowTo',
      name: 'How to write Cambridge O Level Paper 2 pseudocode',
      description:
        'Write a first Cambridge 2210 / IGCSE 0478 program with OUTPUT, DECLARE and <-, then run it in the browser compiler.',
      step: [
        {
          '@type': 'HowToStep',
          name: 'Print a line',
          text: 'Start with OUTPUT and a string in double quotes. Keywords are UPPERCASE.',
        },
        {
          '@type': 'HowToStep',
          name: 'Declare and assign',
          text: 'DECLARE the identifier and type, then store a value with <-. Do not use = for assignment.',
        },
        {
          '@type': 'HowToStep',
          name: 'Read input',
          text: 'Use INPUT before you process, then OUTPUT the result. That is the IPO skeleton used on 15-mark questions.',
        },
        {
          '@type': 'HowToStep',
          name: 'Practise in the path',
          text: 'Continue on the Paper 2 Path and check each lesson in the same compiler.',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      url: `${SITE_URL}${TUTORIAL_PATH}`,
      mainEntity: TUTORIAL_FAQS.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.paragraphs.join(' ') },
      })),
    },
  ],
};

function Inline({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((part, index) =>
        part.startsWith('`') && part.endsWith('`') && part.length > 2 ? (
          <code
            key={index}
            className="bg-code-bg border border-border px-1 py-0.5 rounded font-mono text-primary text-[0.9em]"
          >
            {part.slice(1, -1)}
          </code>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
}

export default function TutorialPage() {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-background bg-dot-grid scrollbar-pretty">
      <TutorialTracker />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 45% at 50% -10%, rgba(var(--color-primary-rgb), 0.12) 0%, transparent 70%)',
        }}
      />

      <article className="relative mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface/80 backdrop-blur-sm p-6 sm:p-8 shadow-intense">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-3 sm:left-4 w-[3px] border-x border-brand-red/45"
          />
          <div className="relative -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 mb-8 overflow-hidden px-6 pt-6 pb-6 sm:px-8 sm:pt-8">
            <PaperGrain className="absolute inset-0 w-full h-full pointer-events-none opacity-30 mix-blend-soft-light" />
            <AnswerLines className="absolute inset-0 w-full h-full pointer-events-none opacity-40" />
            <div className="relative">
              <p className="mono-label text-primary mb-3">Cambridge O Level 2210 · IGCSE 0478 / 0984</p>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-light-text flex items-center gap-2.5">
                <LogoMark size={30} className="text-light-text shrink-0 hidden sm:block" />
                {TUTORIAL_TITLE}
              </h1>
              <p className={`${p} mt-3`}>
                A free Paper 2 tutorial for <strong className="text-light-text">Cambridge O Level Computer Science 2210</strong>.
                The language is the same as IGCSE 0478 and 0984, so one set of keywords covers both courses.
                Every snippet below runs in this site&apos;s compiler — not a screenshot, not a PDF.
              </p>
              <p className={`${p} mt-2`}>
                Independent learning tool, not an official Cambridge International product. Write the syllabus
                forms (<Kw>DECLARE</Kw>, <Kw>&lt;-</Kw>, <Kw>ENDIF</Kw>, <Kw>NEXT</Kw>) so a marker can follow
                the algorithm on paper.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <TutorialCtaLink href="/learn/1/output" destination="learn" source="hero" className={ctaPrimary}>
                  Start the interactive path
                </TutorialCtaLink>
                <TutorialCtaLink href="/" destination="compiler" source="hero" className={ctaSecondary}>
                  Open the compiler
                </TutorialCtaLink>
                <TutorialCtaLink href="/docs" destination="docs" source="hero" className={ctaSecondary}>
                  Full syntax guide
                </TutorialCtaLink>
              </div>

              <nav aria-label="On this page" className="mt-6 flex flex-wrap gap-2">
                {SECTIONS.map((link) => (
                  <a key={link.href} href={link.href} className={navChip}>
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          <section id="who" className="mt-10 scroll-mt-4 space-y-3">
            <h2 className={h2}>Who this Cambridge O Level pseudocode tutorial is for</h2>
            <p className={p}>
              Paper 2 (Algorithms, Programming and Logic) is where 2210 students write algorithms,
              complete trace tables, and read printed pseudocode. The questions are not “describe a
              computer system”. They are “write the algorithm”, “correct the error”, “dry-run this
              loop”.
            </p>
            <p className={p}>
              If you have been using Python <Kw>print</Kw>, <Kw>=</Kw> for assignment, or{' '}
              <Kw>for i in range</Kw>, this page is the translation layer into Cambridge form. If you
              already know the keywords, skip to the{' '}
              <a href="#path" className="text-primary hover:text-primary-hover">
                Paper 2 Path
              </a>{' '}
              and practise with an autograder.
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li className={li}>
                <strong className="text-light-text">O Level 2210</strong> — this is the syllabus named
                in the title. Section 8 of the subject content is the programming language used here.
              </li>
              <li className={li}>
                <strong className="text-light-text">IGCSE 0478 and 0984</strong> — same Paper 2
                pseudocode. Follow this tutorial as-is.
              </li>
              <li className={li}>
                <strong className="text-light-text">AS &amp; A Level 9618</strong> — start here for the
                shared core, then use the{' '}
                <TutorialCtaLink href="/docs" destination="docs" source="who" className="text-primary hover:text-primary-hover">
                  syntax guide
                </TutorialCtaLink>{' '}
                for records, pointers, classes and random-access files.
              </li>
            </ul>
          </section>

          <section id="first-program" className="mt-10 scroll-mt-4 space-y-3">
            <h2 className={h2}>Your first Cambridge program</h2>
            <p className={p}>
              The smallest useful program prints a line. Keywords are <strong className="text-light-text">UPPERCASE</strong>{' '}
              in the exam. Strings use double quotes. This interpreter also accepts lowercase, but write
              the Cambridge form so muscle memory matches the paper.
            </p>
            <CodeBlock code={TUTORIAL_SNIPPETS.firstProgram.code} output={TUTORIAL_SNIPPETS.firstProgram.output} />
            <p className={p}>
              Several values on one <Kw>OUTPUT</Kw> are separated by commas. There is no{' '}
              <Kw>print()</Kw>, no <Kw>console.log</Kw>, and no semicolon. Comments start with{' '}
              <Kw>{'//'}</Kw> and run to the end of the line.
            </p>
            <p className={p}>
              Next: open{' '}
              <TutorialCtaLink
                href="/learn/1/output"
                destination="learn"
                source="first-program"
                className="text-primary hover:text-primary-hover"
              >
                Level 1 — OUTPUT a string
              </TutorialCtaLink>{' '}
              and press Check. The path will not let a Python habit through.
            </p>
          </section>

          <section id="declare" className="mt-10 scroll-mt-4 space-y-3">
            <h2 className={h2}>DECLARE, types and assignment</h2>
            <p className={p}>
              Cambridge wants identifiers named before they are used.{' '}
              <Kw>DECLARE Score : INTEGER</Kw> is the form. Then assignment is an arrow, not an equals
              sign: <Kw>Score &lt;- 42</Kw>. On paper, <Kw>=</Kw> means “is equal to” inside a condition.
            </p>
            <CodeBlock code={TUTORIAL_SNIPPETS.declare.code} output={TUTORIAL_SNIPPETS.declare.output} />
            <p className={p}>The five basic types on 2210 / 0478 Paper 2:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li className={li}>
                <Kw>INTEGER</Kw> — whole numbers, including negatives
              </li>
              <li className={li}>
                <Kw>REAL</Kw> — numbers that may have a fractional part
              </li>
              <li className={li}>
                <Kw>CHAR</Kw> — a single character
              </li>
              <li className={li}>
                <Kw>STRING</Kw> — zero or more characters
              </li>
              <li className={li}>
                <Kw>BOOLEAN</Kw> — <Kw>TRUE</Kw> or <Kw>FALSE</Kw>
              </li>
            </ul>
            <p className={p}>
              Constants use <Kw>CONSTANT MaxSize &lt;- 30</Kw>. Integer division is <Kw>DIV</Kw>; remainder
              is <Kw>MOD</Kw>. Those two operators show up on almost every paper that needs grouping or
              wrapping an index.
            </p>
          </section>

          <section id="input" className="mt-10 scroll-mt-4 space-y-3">
            <h2 className={h2}>INPUT and the IPO skeleton</h2>
            <p className={p}>
              Most 15-mark algorithms start by reading data. <Kw>INPUT Name</Kw> pauses until a value is
              provided. An optional string after a comma is a prompt — useful here, optional on paper.
            </p>
            <CodeBlock code={TUTORIAL_SNIPPETS.input.code} output={TUTORIAL_SNIPPETS.input.output} />
            <p className={p}>
              Examiners mark <strong className="text-light-text">input → process → output</strong>. If you
              OUTPUT before you INPUT, the trace table will not match the mark scheme. Declare, read,
              calculate, print — in that order — unless the question already pre-populates an array.
            </p>
          </section>

          <section id="selection" className="mt-10 scroll-mt-4 space-y-3">
            <h2 className={h2}>IF, ELSE and CASE OF</h2>
            <p className={p}>
              Selection needs a closer. <Kw>IF</Kw> ends with <Kw>ENDIF</Kw>. Remember <Kw>THEN</Kw>. Extra
              branches are <Kw>ELSEIF</Kw> (one word) and <Kw>ELSE</Kw>. Conditions use{' '}
              <Kw>=</Kw> <Kw>&lt;</Kw> <Kw>&gt;</Kw> <Kw>&lt;=</Kw> <Kw>&gt;=</Kw> and not-equal{' '}
              <Kw>&lt;&gt;</Kw> — never <Kw>!=</Kw>.
            </p>
            <CodeBlock code={TUTORIAL_SNIPPETS.selection.code} output={TUTORIAL_SNIPPETS.selection.output} />
            <p className={p}>
              <Kw>CASE OF</Kw> is cleaner when one variable has several discrete labels. Close it with{' '}
              <Kw>ENDCASE</Kw> and give a fallback with <Kw>OTHERWISE</Kw>. On 2210 you will also see
              nested IF inside a loop — indent the body so the marker can see which <Kw>ENDIF</Kw> belongs
              where.
            </p>
          </section>

          <section id="loops" className="mt-10 scroll-mt-4 space-y-3">
            <h2 className={h2}>FOR, WHILE and REPEAT UNTIL</h2>
            <p className={p}>
              Pick the loop the question is describing, not the one you used last week.
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li className={li}>
                <Kw>FOR Counter &lt;- 1 TO 5 ... NEXT Counter</Kw> — you know how many times. Count-controlled.
              </li>
              <li className={li}>
                <Kw>WHILE Condition DO ... ENDWHILE</Kw> — test first. May run zero times. Pre-condition.
              </li>
              <li className={li}>
                <Kw>REPEAT ... UNTIL Condition</Kw> — body always runs once. Post-condition. The UNTIL
                test is the stop condition (loop while it is still false).
              </li>
            </ul>
            <CodeBlock code={TUTORIAL_SNIPPETS.forLoop.code} output={TUTORIAL_SNIPPETS.forLoop.output} />
            <p className={p}>
              Paper 2 loves a totaller (<Kw>Total &lt;- Total + Value</Kw>), a counter, and a BOOLEAN flag
              inside these loops. Initialise before the loop. Forget that and the first trace-table row
              is already wrong.
            </p>
          </section>

          <section id="arrays" className="mt-10 scroll-mt-4 space-y-3">
            <h2 className={h2}>Arrays are 1-based</h2>
            <p className={p}>
              Unless the question says otherwise, the first element is index 1:{' '}
              <Kw>DECLARE Names : ARRAY[1:30] OF STRING</Kw>. Two-dimensional arrays use{' '}
              <Kw>ARRAY[1:rows, 1:cols]</Kw>. A linear search walks <Kw>1 TO n</Kw> with a Found flag and
              stops when the item is found — that algorithm is in almost every 2210 series.
            </p>
            <CodeBlock code={TUTORIAL_SNIPPETS.array.code} output={TUTORIAL_SNIPPETS.array.output} />
            <p className={p}>
              Strings are not arrays of characters in the IGCSE/O Level subset. Use <Kw>LENGTH</Kw> and{' '}
              <Kw>SUBSTRING(ThisString, Start, Length)</Kw> with a <strong className="text-light-text">1-based</strong>{' '}
              start position — another silent Python trap.
            </p>
          </section>

          <section id="routines" className="mt-10 scroll-mt-4 space-y-3">
            <h2 className={h2}>Procedures and functions</h2>
            <p className={p}>
              A <Kw>PROCEDURE</Kw> does work (often OUTPUT) and does not return a value. A{' '}
              <Kw>FUNCTION</Kw> returns a typed result with <Kw>RETURNS</Kw> / <Kw>RETURN</Kw>. Call a
              procedure with <Kw>CALL</Kw>. The 2210 guide expects at most three parameters on a student-designed
              routine.
            </p>
            <CodeBlock code={TUTORIAL_SNIPPETS.procedure.code} output={TUTORIAL_SNIPPETS.procedure.output} />
            <p className={p}>
              Library functions you must recognise: <Kw>LENGTH</Kw>, <Kw>SUBSTRING</Kw>, <Kw>ROUND</Kw>,{' '}
              <Kw>INT</Kw>, <Kw>RANDOM</Kw>, <Kw>LCASE</Kw>, <Kw>UCASE</Kw>, <Kw>ASC</Kw>, <Kw>CHR</Kw>.
              Worked examples live in the{' '}
              <TutorialCtaLink href="/docs#subroutines" destination="docs" source="routines" className="text-primary hover:text-primary-hover">
                procedures section of the guide
              </TutorialCtaLink>
              .
            </p>
          </section>

          <section id="files" className="mt-10 scroll-mt-4 space-y-3">
            <h2 className={h2}>Text files</h2>
            <p className={p}>
              O Level file handling is sequential text:{' '}
              <Kw>OPENFILE &quot;Data.txt&quot; FOR READ</Kw> (or <Kw>WRITE</Kw> / <Kw>APPEND</Kw>), then{' '}
              <Kw>READFILE</Kw> / <Kw>WRITEFILE</Kw>, then <Kw>CLOSEFILE</Kw>. A read loop continues until{' '}
              <Kw>EOF(FileName)</Kw>. This compiler simulates files in the browser — the keywords you type
              are the ones on the paper.
            </p>
          </section>

          <section id="trace" className="mt-10 scroll-mt-4 space-y-3">
            <h2 className={h2}>Trace tables</h2>
            <p className={p}>
              A trace table is a dry run: one column per variable (and sometimes OUTPUT), one row each
              time a watched variable changes. Cambridge will give you the headings. You fill cells, not
              rewrite the algorithm.
            </p>
            <p className={p}>
              The editor can emit a trace while the program runs. Use it to check your paper trace, then
              put the compiler away and do the next one by hand — the exam will not highlight line 7 for
              you. Open a{' '}
              <TutorialCtaLink href="/" destination="compiler" source="trace" className="text-primary hover:text-primary-hover">
                blank compiler
              </TutorialCtaLink>{' '}
              and turn on the trace table from the output pane.
            </p>
          </section>

          <section id="traps" className="mt-10 scroll-mt-4 space-y-3">
            <h2 className={h2}>Exam traps this compiler will catch</h2>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[28rem] text-left text-[13px]">
                <thead className="bg-header-bg/60 text-light-text">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Habit from another language</th>
                    <th className="px-3 py-2 font-semibold">Cambridge O Level / IGCSE form</th>
                  </tr>
                </thead>
                <tbody className="text-dark-text">
                  <tr className="border-t border-border">
                    <td className="px-3 py-2">
                      <Kw>print()</Kw>, <Kw>console.log</Kw>
                    </td>
                    <td className="px-3 py-2 text-light-text">
                      <Kw>OUTPUT</Kw>
                    </td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="px-3 py-2">
                      <Kw>=</Kw> to store a value
                    </td>
                    <td className="px-3 py-2 text-light-text">
                      <Kw>&lt;-</Kw> to store, <Kw>=</Kw> only to compare
                    </td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="px-3 py-2">
                      <Kw>!=</Kw> or <Kw>/=</Kw>
                    </td>
                    <td className="px-3 py-2 text-light-text">
                      <Kw>&lt;&gt;</Kw>
                    </td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="px-3 py-2">
                      <Kw>for i in range(5):</Kw>
                    </td>
                    <td className="px-3 py-2 text-light-text">
                      <Kw>FOR I &lt;- 1 TO 5</Kw> … <Kw>NEXT I</Kw>
                    </td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="px-3 py-2">Arrays start at 0</td>
                    <td className="px-3 py-2 text-light-text">
                      Arrays start at 1 unless DECLARE says otherwise
                    </td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="px-3 py-2">
                      <Kw>END IF</Kw>, <Kw>ENDFOR</Kw>, bare <Kw>END</Kw>
                    </td>
                    <td className="px-3 py-2 text-light-text">
                      <Kw>ENDIF</Kw>, <Kw>NEXT &lt;var&gt;</Kw>, <Kw>ENDWHILE</Kw>, <Kw>ENDCASE</Kw>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={p}>
              Error messages here name the IGCSE/O Level equivalent instead of dumping parser jargon.
              That is deliberate: the paper will not.
            </p>
          </section>

          <section id="path" className="mt-10 scroll-mt-4 space-y-3">
            <h2 className={h2}>Interactive Paper 2 Path (write, run, check)</h2>
            <p className={p}>
              Reading a tutorial is not the exam skill. The sequenced path is: a short lesson, a starter
              in the editor, then Check against expected output. Levels 1–3 are free. This is the 2210 /
              0478 programming language only — no A Level OOP in the path.
            </p>
            <ol className="space-y-2">
              {TUTORIAL_PATH_LEVELS.map((level) => (
                <li key={level.number} className="text-sm text-dark-text">
                  <TutorialCtaLink
                    href={level.href}
                    destination="learn"
                    source="path"
                    className="text-primary hover:text-primary-hover font-medium"
                  >
                    Level {level.number} · {level.name}
                  </TutorialCtaLink>
                  <span className="text-dark-text/70"> · syllabus {level.syllabus}</span>
                  {level.free ? (
                    <span className="ml-2 text-[11px] uppercase tracking-wide text-primary">Free</span>
                  ) : null}
                  <div className="text-dark-text">{level.leaveWith}</div>
                </li>
              ))}
            </ol>
            <div className="flex flex-wrap gap-2 pt-2">
              <TutorialCtaLink href="/learn" destination="learn" source="path-cta" className={ctaPrimary}>
                Open the full path map
              </TutorialCtaLink>
              <TutorialCtaLink href="/practice" destination="practice" source="path-cta" className={ctaSecondary}>
                Autograded past-paper style questions
              </TutorialCtaLink>
            </div>
          </section>

          <section id="faq" className="mt-10 scroll-mt-4 space-y-5">
            <h2 className={h2}>Cambridge O Level pseudocode FAQ</h2>
            {TUTORIAL_FAQS.map((item) => (
              <article key={item.id} id={item.id} className="scroll-mt-4 space-y-2">
                <h3 className="text-sm font-semibold text-light-text">{item.question}</h3>
                {item.paragraphs.map((paragraph) => (
                  <p key={paragraph} className={p}>
                    <Inline text={paragraph} />
                  </p>
                ))}
              </article>
            ))}
            <p className={p}>
              More compiler, plan and teacher answers are in the{' '}
              <TutorialCtaLink href="/faq" destination="faq" source="faq" className="text-primary hover:text-primary-hover">
                site FAQ
              </TutorialCtaLink>
              .
            </p>
          </section>

          <IndexLinks current={TUTORIAL_PATH} />
        </div>
      </article>
    </div>
  );
}
