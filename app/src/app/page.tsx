import type { Metadata } from 'next';
import CompilerPage from '../components/compiler/CompilerPage';

export const metadata: Metadata = {
  title: 'Compiler',
  description:
    'Write and run IGCSE pseudocode online. Free browser-based compiler for Cambridge Computer Science 0478 syllabus.',
};

export default function Home() {
  return <CompilerPage />;
}
