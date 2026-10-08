import type { Metadata } from 'next';
import FlowchartStudio from '@/modules/flowchart/FlowchartStudio';
import { SHARE_IMAGE, SITE_URL } from '@/shared/lib/seo';

const TITLE = 'Flowchart Maker for IGCSE Pseudocode | Draw, Run & Convert';
const DESCRIPTION =
  'Free flowchart maker for Cambridge IGCSE 0478, O Level 2210 and A Level 9618. Draw a flowchart with the exam symbols, run it with real input, step through it box by box, and see the pseudocode it stands for.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    'flowchart maker',
    'igcse flowchart',
    'flowchart to pseudocode',
    'pseudocode to flowchart',
    'flowchart online',
    'flowchart symbols igcse',
    'run a flowchart',
  ],
  alternates: { canonical: '/flowchart' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/flowchart`,
    type: 'website',
    images: [SHARE_IMAGE],
  },
};

export default function FlowchartPage() {
  return (
    <>
      <section aria-label="About the flowchart maker" className="sr-only">
        <h1>Flowchart maker for Cambridge IGCSE and A Level pseudocode</h1>
        <p>
          Draw flowcharts with the Cambridge symbols: terminators for START and STOP, rectangles for processes,
          parallelograms for INPUT and OUTPUT, diamonds for decisions and double-sided boxes for subroutines. The
          flowchart turns into pseudocode as you draw (IF, CASE, WHILE, REPEAT and FOR), runs with real INPUT, and can
          be stepped through one box at a time. Paste a program to draw its flowchart.
        </p>
      </section>
      <FlowchartStudio />
    </>
  );
}
