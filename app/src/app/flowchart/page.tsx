import type { Metadata } from 'next';
import FlowchartEditorPage from '../../components/flowchart/FlowchartEditorPage';

export const metadata: Metadata = {
  title: 'Flowchart Maker — Draw, Convert to Pseudocode & Run',
  description:
    'Build IGCSE-style flowcharts with terminator, process, decision, input/output and subroutine symbols, then convert them to Cambridge pseudocode and run them with a live trace table and debugger.',
  alternates: { canonical: '/flowchart' },
  openGraph: {
    title: 'Flowchart Maker — Draw, Convert to Pseudocode & Run',
    description:
      'Draw a flowchart, convert it to Cambridge IGCSE pseudocode, and run it with trace and debugging.',
    url: '/flowchart',
  },
};

export default function FlowchartRoute() {
  return (
    <>
      <section aria-label="About the flowchart maker" className="sr-only">
        <h1>Flowchart maker for Cambridge IGCSE pseudocode</h1>
        <p>
          Draw flowcharts using the standard Cambridge symbols — terminator, process, decision,
          input/output and subroutine — then convert them to IGCSE pseudocode and run them in the
          browser with a trace table and step-through debugger.
        </p>
      </section>
      <FlowchartEditorPage />
    </>
  );
}
