import { useState, useEffect, useRef } from 'react';
import { ChevronRight, List, X } from 'lucide-react';
import { SEO } from '../components/layout/SEO';
import CodeBlock from '../components/common/CodeBlock';
import Kw from '../components/common/Kw';
import toc from '../data/documentationToc';

/* ────────────────────────────────────────────────────────── */
/*  Main Documentation component                              */
/* ────────────────────────────────────────────────────────── */

const Documentation = () => {
  const [activeId, setActiveId] = useState('general');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['general']));
  const [tocOpen, setTocOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);

  // Scroll spy using scroll event for robust tracking
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const handleScroll = () => {
      const headings = Array.from(container.querySelectorAll('[data-section]')) as HTMLElement[];
      const containerRect = container.getBoundingClientRect();
      const threshold = containerRect.top + 100;

      let currentActive = headings[0]?.getAttribute('data-section') || '';

      for (const h of headings) {
        const rect = h.getBoundingClientRect();
        const id = h.getAttribute('data-section');

        if (rect.top <= threshold) {
            currentActive = id || currentActive;
        } else {
            break;
        }
      }
      setActiveId(currentActive);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    // Initial check after a small delay to ensure layout
    setTimeout(handleScroll, 100);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Strict Auto-Collapse & Auto-Scroll Sidebar
  useEffect(() => {
    const parent = toc.find((t) => t.children?.some((c) => c.id === activeId));

    if (parent) {
      // Only keep the current active parent expanded
      setExpandedSections(new Set([parent.id]));
    } else {
      // If it's a top-level item that is active, maybe expand it if it has children?
      // Or just keep the set empty if no parent is found for a sub-item.
      // Checking if activeId itself is a parent in the TOC
      const isParentItself = toc.find(t => t.id === activeId);
      if (isParentItself) {
         setExpandedSections(new Set([activeId]));
      }
    }

    // Scroll active item into view in the sidebar
    if (sidebarRef.current) {
      const activeElement = sidebarRef.current.querySelector(`[data-toc-id="${activeId}"]`);
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [activeId]);

  const scrollTo = (id: string) => {
    const el = contentRef.current?.querySelector(`[data-section="${id}"]`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTocOpen(false);
  };

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        // If we want strict accordion behavior (one open at a time), we could clear `prev` first.
        // But manual toggle usually implies user intent, so keeping multiple open might be okay *until* scroll changes.
        // However, the user asked for strict behavior. Let's make manual toggle also strict?
        // "they stay expanded and yeah" -> implying too many open.
        // Let's keep manual toggle flexible but auto-scroll strict.
        next.add(id);
      }
      return next;
    });
  };

  /* ── Sidebar TOC renderer ─────────────────────────────── */
  const renderToc = () => (
    <nav className="text-sm select-none">
      {toc.map((entry) => {
        const isExpanded = expandedSections.has(entry.id);
        const isActive = activeId === entry.id || entry.children?.some((c) => c.id === activeId);
        const hasChildren = entry.children && entry.children.length > 0;

        return (
          <div key={entry.id} className="mb-1" data-toc-id={entry.id}>
            <div
              className={`flex items-center w-full rounded transition-colors pr-2
              ${isActive ? 'bg-surface text-primary font-medium' : 'text-dark-text hover:text-light-text hover:bg-surface/50'}`}
            >
              {hasChildren ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSection(entry.id);
                  }}
                  className="p-1.5 hover:bg-black/5 rounded mr-1 flex-shrink-0"
                  aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
                >
                  <ChevronRight
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                  />
                </button>
              ) : (
                <span className="w-7 flex-shrink-0" />
              )}

              <button
                onClick={() => {
                  scrollTo(entry.id);
                  if (hasChildren && !isExpanded) toggleSection(entry.id);
                }}
                className="flex-1 text-left py-1.5 truncate"
              >
                {entry.label}
              </button>
            </div>

            {hasChildren && isExpanded && (
              <div className="ml-7 border-l border-border mt-1 space-y-0.5">
                {entry.children!.map((child) => (
                  <button
                    key={child.id}
                    data-toc-id={child.id}
                    onClick={() => scrollTo(child.id)}
                    className={`block w-full text-left px-3 py-1 text-xs rounded transition-colors truncate
                      ${
                        activeId === child.id
                          ? 'text-primary font-medium bg-primary/5'
                          : 'text-dark-text hover:text-light-text hover:bg-surface/50'
                      }`}
                  >
                    {child.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );

  /* ── Section heading helper ────────────────────────────── */
  const H2 = ({ id, children }: { id: string; children: React.ReactNode }) => (
    <h2
      data-section={id}
      className="text-lg font-semibold text-light-text pt-6 pb-2 border-b border-border scroll-mt-4"
    >
      {children}
    </h2>
  );

  const H3 = ({ id, children }: { id: string; children: React.ReactNode }) => (
    <h3 data-section={id} className="text-base font-medium text-light-text pt-4 pb-1 scroll-mt-4">
      {children}
    </h3>
  );

  return (
    <div className="flex h-full overflow-hidden bg-background">
      <SEO
        title="How to Use"
        description="Complete guide to IGCSE pseudocode syntax and features. Learn variables, arrays, loops, procedures, functions, and file handling for Cambridge Computer Science 0478."
        keywords="IGCSE pseudocode tutorial, pseudocode syntax, pseudocode guide, learn pseudocode, IGCSE 0478 documentation"
        canonical="https://pseudocode-compiler.sherlemious.com/how-to-use"
      />

      {/* ── Mobile TOC toggle ────────────────────────────── */}
      <button
        onClick={() => setTocOpen(!tocOpen)}
        className="lg:hidden fixed bottom-10 right-4 z-40 p-2.5 rounded-full bg-primary text-light-text shadow-intense"
        aria-label="Table of contents"
      >
        {tocOpen ? <X className="h-5 w-5" /> : <List className="h-5 w-5" />}
      </button>

      {/* ── Mobile TOC overlay ───────────────────────────── */}
      {tocOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setTocOpen(false)}>
          <div
            className="absolute left-0 top-0 bottom-0 w-64 bg-surface border-r border-border p-3 overflow-y-auto
              scrollbar-thin scrollbar-thumb-primary scrollbar-track-background scrollbar-thumb-rounded-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-dark-text mb-3 px-3">Contents</div>
            {renderToc()}
          </div>
        </div>
      )}

      {/* ── Desktop sidebar ──────────────────────────────── */}
      <aside
        ref={sidebarRef}
        className="hidden lg:block w-56 shrink-0 border-r border-border bg-surface overflow-y-auto p-2
          scrollbar-thin scrollbar-thumb-primary scrollbar-track-background scrollbar-thumb-rounded-full"
      >
        <div className="text-xs font-semibold uppercase tracking-wider text-dark-text mb-2 px-3 pt-2">Contents</div>
        {renderToc()}
      </aside>

      {/* ── Main content ─────────────────────────────────── */}
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto px-6 pb-12
          scrollbar-thin scrollbar-thumb-primary hover:scrollbar-thumb-primary-hover
          scrollbar-track-background scrollbar-thumb-rounded-full"
      >
        <div className="max-w-3xl mx-auto">
          {/* Title */}
          <div className="pt-6 pb-4">
            <h1 className="text-xl font-bold text-light-text">IGCSE Pseudocode Reference</h1>
            <p className="text-sm text-dark-text mt-1">
              Complete language reference for the Cambridge IGCSE (0478) pseudocode syntax supported by this compiler.
            </p>
          </div>

          {/* ──────────────────────────────────────────────── */}
          {/*  General Syntax                                  */}
          {/* ──────────────────────────────────────────────── */}
          <H2 id="general">General Syntax Rules</H2>
          <ul className="list-disc pl-5 text-dark-text space-y-1 text-sm">
            <li>
              Comments use <Kw>{'//'}</Kw> — everything after is ignored until end of line
            </li>
            <li>
              Keywords are <strong className="text-light-text">case-insensitive</strong> — <Kw>IF</Kw>, <Kw>if</Kw>, and{' '}
              <Kw>If</Kw> all work
            </li>
            <li>Indentation is recommended but not enforced</li>
            <li>
              Assignment uses <Kw>{'<-'}</Kw> (preferred) or <Kw>=</Kw>
            </li>
            <li>Each statement goes on its own line</li>
          </ul>

          {/* ──────────────────────────────────────────────── */}
          {/*  Variables & Types                               */}
          {/* ──────────────────────────────────────────────── */}
          <H2 id="variables">Variables, Constants & Data Types</H2>

          <H3 id="declaring">Declaring Variables</H3>
          <p className="text-sm text-dark-text mb-2">
            Use <Kw>DECLARE</Kw> followed by the variable name, a colon, and the data type:
          </p>
          <CodeBlock
            code={`DECLARE Counter : INTEGER
DECLARE TotalToPay : REAL
DECLARE GameOver : BOOLEAN
DECLARE StudentName : STRING
DECLARE Initial : CHAR`}
          />

          <H3 id="constants">Constants</H3>
          <p className="text-sm text-dark-text mb-2">
            Use <Kw>CONSTANT</Kw> for values that never change during execution:
          </p>
          <CodeBlock
            code={`CONSTANT HourlyRate <- 6.50
CONSTANT MaxSize <- 100
CONSTANT DefaultText <- "N/A"`}
          />

          <H3 id="data-types">Data Types</H3>
          <div className="overflow-x-auto my-2">
            <table className="w-full text-sm border border-border rounded">
              <thead>
                <tr className="bg-surface text-left">
                  <th className="px-3 py-1.5 border-b border-border text-light-text font-medium">Type</th>
                  <th className="px-3 py-1.5 border-b border-border text-light-text font-medium">Description</th>
                  <th className="px-3 py-1.5 border-b border-border text-light-text font-medium">Example</th>
                </tr>
              </thead>
              <tbody className="text-dark-text">
                <tr className="border-b border-border">
                  <td className="px-3 py-1">
                    <Kw>INTEGER</Kw>
                  </td>
                  <td className="px-3 py-1">Whole numbers</td>
                  <td className="px-3 py-1 font-mono">5, -3, 0</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-3 py-1">
                    <Kw>REAL</Kw>
                  </td>
                  <td className="px-3 py-1">Decimal numbers</td>
                  <td className="px-3 py-1 font-mono">4.7, 0.3</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-3 py-1">
                    <Kw>CHAR</Kw>
                  </td>
                  <td className="px-3 py-1">Single character (single quotes)</td>
                  <td className="px-3 py-1 font-mono">'x', 'A'</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-3 py-1">
                    <Kw>STRING</Kw>
                  </td>
                  <td className="px-3 py-1">Text (double quotes)</td>
                  <td className="px-3 py-1 font-mono">"Hello"</td>
                </tr>
                <tr>
                  <td className="px-3 py-1">
                    <Kw>BOOLEAN</Kw>
                  </td>
                  <td className="px-3 py-1">Logical value</td>
                  <td className="px-3 py-1 font-mono">TRUE, FALSE</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ──────────────────────────────────────────────── */}
          {/*  Input / Output                                  */}
          {/* ──────────────────────────────────────────────── */}
          <H2 id="io">Input and Output</H2>

          <H3 id="output">OUTPUT</H3>
          <p className="text-sm text-dark-text mb-2">
            Use <Kw>OUTPUT</Kw> (or <Kw>PRINT</Kw>) to display values. Separate multiple values with commas:
          </p>
          <CodeBlock
            code={`OUTPUT "Hello, World!"
OUTPUT "You have ", Lives, " lives left"
OUTPUT "Sum = ", A + B`}
          />

          <H3 id="input">INPUT</H3>
          <p className="text-sm text-dark-text mb-2">
            Use <Kw>INPUT</Kw> to read a value from the user. The program pauses until the user types a response:
          </p>
          <CodeBlock
            code={`DECLARE Name : STRING
OUTPUT "Enter your name:"
INPUT Name
OUTPUT "Hello, ", Name`}
          />
          <p className="text-xs text-dark-text mt-1 italic">
            You can also input directly into an array element: <Kw>INPUT Scores[i]</Kw>
          </p>

          {/* ──────────────────────────────────────────────── */}
          {/*  Arrays                                          */}
          {/* ──────────────────────────────────────────────── */}
          <H2 id="arrays">Arrays</H2>

          <H3 id="arrays-1d">1D Arrays</H3>
          <p className="text-sm text-dark-text mb-2">
            Declare with <Kw>ARRAY[lower:upper] OF type</Kw>. Indices are inclusive:
          </p>
          <CodeBlock
            code={`DECLARE Names : ARRAY[1:5] OF STRING

Names[1] <- "Alice"
Names[2] <- "Bob"

FOR i <- 1 TO 5
    OUTPUT Names[i]
NEXT i`}
          />

          <H3 id="arrays-2d">2D Arrays</H3>
          <p className="text-sm text-dark-text mb-2">
            Declare with two ranges separated by a comma. Access with <Kw>[row, col]</Kw>:
          </p>
          <CodeBlock
            code={`DECLARE Grid : ARRAY[1:3, 1:3] OF CHAR

Grid[1,1] <- 'X'
Grid[2,2] <- 'O'
OUTPUT Grid[1,1]`}
          />

          {/* ──────────────────────────────────────────────── */}
          {/*  Operators                                       */}
          {/* ──────────────────────────────────────────────── */}
          <H2 id="operators">Operators</H2>

          <H3 id="arithmetic">Arithmetic Operators</H3>
          <div className="overflow-x-auto my-2">
            <table className="w-full text-sm border border-border rounded">
              <thead>
                <tr className="bg-surface text-left">
                  <th className="px-3 py-1.5 border-b border-border text-light-text font-medium">Operator</th>
                  <th className="px-3 py-1.5 border-b border-border text-light-text font-medium">Description</th>
                  <th className="px-3 py-1.5 border-b border-border text-light-text font-medium">Example</th>
                </tr>
              </thead>
              <tbody className="text-dark-text">
                <tr className="border-b border-border">
                  <td className="px-3 py-1 font-mono">+</td>
                  <td className="px-3 py-1">Addition</td>
                  <td className="px-3 py-1 font-mono">5 + 3 → 8</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-3 py-1 font-mono">-</td>
                  <td className="px-3 py-1">Subtraction</td>
                  <td className="px-3 py-1 font-mono">10 - 4 → 6</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-3 py-1 font-mono">*</td>
                  <td className="px-3 py-1">Multiplication</td>
                  <td className="px-3 py-1 font-mono">3 * 7 → 21</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-3 py-1 font-mono">/</td>
                  <td className="px-3 py-1">Division</td>
                  <td className="px-3 py-1 font-mono">10 / 3 → 3.33…</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-3 py-1 font-mono">^</td>
                  <td className="px-3 py-1">Power</td>
                  <td className="px-3 py-1 font-mono">2 ^ 3 → 8</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-3 py-1">
                    <Kw>DIV</Kw>
                  </td>
                  <td className="px-3 py-1">Integer division</td>
                  <td className="px-3 py-1 font-mono">10 DIV 3 → 3</td>
                </tr>
                <tr>
                  <td className="px-3 py-1">
                    <Kw>MOD</Kw>
                  </td>
                  <td className="px-3 py-1">Remainder (modulo)</td>
                  <td className="px-3 py-1 font-mono">10 MOD 3 → 1</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-dark-text italic">
            <Kw>DIV</Kw> and <Kw>MOD</Kw> also work as functions: <Kw>DIV(10, 3)</Kw>, <Kw>MOD(10, 3)</Kw>
          </p>
          <CodeBlock
            code={`OUTPUT DIV(10, 3)   // 3
OUTPUT MOD(10, 3)   // 1
OUTPUT 2 ^ 3        // 8`}
          />

          <H3 id="comparison">Comparison Operators</H3>
          <div className="overflow-x-auto my-2">
            <table className="w-full text-sm border border-border rounded">
              <thead>
                <tr className="bg-surface text-left">
                  <th className="px-3 py-1.5 border-b border-border text-light-text font-medium">Operator</th>
                  <th className="px-3 py-1.5 border-b border-border text-light-text font-medium">Meaning</th>
                </tr>
              </thead>
              <tbody className="text-dark-text">
                <tr className="border-b border-border">
                  <td className="px-3 py-1 font-mono">=</td>
                  <td className="px-3 py-1">Equal to</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-3 py-1 font-mono">{'<>'}</td>
                  <td className="px-3 py-1">Not equal to</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-3 py-1 font-mono">{'>'}</td>
                  <td className="px-3 py-1">Greater than</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-3 py-1 font-mono">{'<'}</td>
                  <td className="px-3 py-1">Less than</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-3 py-1 font-mono">{'>='}</td>
                  <td className="px-3 py-1">Greater than or equal to</td>
                </tr>
                <tr>
                  <td className="px-3 py-1 font-mono">{'<='}</td>
                  <td className="px-3 py-1">Less than or equal to</td>
                </tr>
              </tbody>
            </table>
          </div>

          <H3 id="logical">Logical Operators</H3>
          <div className="overflow-x-auto my-2">
            <table className="w-full text-sm border border-border rounded">
              <thead>
                <tr className="bg-surface text-left">
                  <th className="px-3 py-1.5 border-b border-border text-light-text font-medium">Operator</th>
                  <th className="px-3 py-1.5 border-b border-border text-light-text font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="text-dark-text">
                <tr className="border-b border-border">
                  <td className="px-3 py-1">
                    <Kw>AND</Kw>
                  </td>
                  <td className="px-3 py-1">Both conditions must be true</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-3 py-1">
                    <Kw>OR</Kw>
                  </td>
                  <td className="px-3 py-1">At least one condition must be true</td>
                </tr>
                <tr>
                  <td className="px-3 py-1">
                    <Kw>NOT</Kw>
                  </td>
                  <td className="px-3 py-1">Inverts a boolean value</td>
                </tr>
              </tbody>
            </table>
          </div>
          <CodeBlock
            code={`IF Age >= 18 AND HasID = TRUE THEN
    OUTPUT "Entry allowed"
ENDIF

IF NOT Found THEN
    OUTPUT "Item not found"
ENDIF`}
          />

          <H3 id="concatenation">String Concatenation</H3>
          <p className="text-sm text-dark-text mb-2">
            Use <Kw>&</Kw> to join strings together:
          </p>
          <CodeBlock
            code={`FullName <- FirstName & " " & LastName
OUTPUT "Hello " & Name & "!"`}
          />

          {/* ──────────────────────────────────────────────── */}
          {/*  Selection                                       */}
          {/* ──────────────────────────────────────────────── */}
          <H2 id="selection">Selection</H2>

          <H3 id="if">IF / ELSE / ELSEIF</H3>
          <p className="text-sm text-dark-text mb-2">Basic if-then-else:</p>
          <CodeBlock
            code={`IF Score >= 50 THEN
    OUTPUT "Pass"
ELSE
    OUTPUT "Fail"
ENDIF`}
          />
          <p className="text-sm text-dark-text mb-2">
            Multiple conditions with <Kw>ELSEIF</Kw>:
          </p>
          <CodeBlock
            code={`IF Score >= 90 THEN
    OUTPUT "A"
ELSEIF Score >= 80 THEN
    OUTPUT "B"
ELSEIF Score >= 70 THEN
    OUTPUT "C"
ELSE
    OUTPUT "F"
ENDIF`}
          />

          <H3 id="case">CASE / OTHERWISE</H3>
          <p className="text-sm text-dark-text mb-2">
            Multi-way selection on a single variable. Use <Kw>OTHERWISE</Kw> as a default:
          </p>
          <CodeBlock
            code={`CASE OF Grade
    'A' :
        OUTPUT "Excellent"
    'B' :
        OUTPUT "Good"
    'C' :
        OUTPUT "Average"
    OTHERWISE:
        OUTPUT "Below average"
ENDCASE`}
          />

          {/* ──────────────────────────────────────────────── */}
          {/*  Iteration                                       */}
          {/* ──────────────────────────────────────────────── */}
          <H2 id="iteration">Iteration (Loops)</H2>

          <H3 id="for">FOR Loop</H3>
          <p className="text-sm text-dark-text mb-2">
            Count-controlled loop. The counter variable is automatically incremented (or stepped):
          </p>
          <CodeBlock
            code={`FOR Counter <- 1 TO 10
    OUTPUT Counter
NEXT Counter`}
          />
          <p className="text-sm text-dark-text mb-2">
            Use <Kw>STEP</Kw> to control the increment (including negative values for counting down):
          </p>
          <CodeBlock
            code={`FOR i <- 10 TO 1 STEP -1
    OUTPUT i
NEXT i

FOR i <- 0 TO 20 STEP 2
    OUTPUT i      // 0, 2, 4, 6, ... 20
NEXT i`}
          />

          <H3 id="while">WHILE Loop</H3>
          <p className="text-sm text-dark-text mb-2">
            Pre-condition loop — tests the condition <strong className="text-light-text">before</strong> each iteration.
            May execute zero times:
          </p>
          <CodeBlock
            code={`DECLARE Number : INTEGER
Number <- 100
WHILE Number > 9 DO
    Number <- Number - 9
ENDWHILE
OUTPUT Number`}
          />
          <p className="text-xs text-dark-text italic">
            The <Kw>DO</Kw> keyword after the condition is optional.
          </p>

          <H3 id="repeat">REPEAT Loop</H3>
          <p className="text-sm text-dark-text mb-2">
            Post-condition loop — always executes <strong className="text-light-text">at least once</strong>, then
            checks the condition:
          </p>
          <CodeBlock
            code={`DECLARE Password : STRING
REPEAT
    OUTPUT "Enter the password:"
    INPUT Password
UNTIL Password = "Secret"`}
          />

          {/* ──────────────────────────────────────────────── */}
          {/*  Procedures & Functions                          */}
          {/* ──────────────────────────────────────────────── */}
          <H2 id="subroutines">Procedures and Functions</H2>

          <H3 id="procedures">Procedures</H3>
          <p className="text-sm text-dark-text mb-2">
            Procedures perform actions but do not return a value. Invoke with <Kw>CALL</Kw>:
          </p>
          <CodeBlock
            code={`PROCEDURE Greet(Name : STRING)
    OUTPUT "Hello, ", Name, "!"
ENDPROCEDURE

CALL Greet("Alice")
CALL Greet("Bob")`}
          />

          <H3 id="functions">Functions</H3>
          <p className="text-sm text-dark-text mb-2">
            Functions return a value with <Kw>RETURN</Kw> and can be used inside expressions:
          </p>
          <CodeBlock
            code={`FUNCTION Square(N : INTEGER) RETURNS INTEGER
    RETURN N * N
ENDFUNCTION

OUTPUT "5 squared = ", Square(5)

// Functions can call other functions
FUNCTION Max(A : INTEGER, B : INTEGER) RETURNS INTEGER
    IF A > B THEN
        RETURN A
    ELSE
        RETURN B
    ENDIF
ENDFUNCTION

OUTPUT "Larger: ", Max(10, 25)`}
          />

          {/* ──────────────────────────────────────────────── */}
          {/*  Built-in Functions                              */}
          {/* ──────────────────────────────────────────────── */}
          <H2 id="builtins">Built-in Functions</H2>

          <H3 id="string-functions">String Functions</H3>
          <div className="overflow-x-auto my-2">
            <table className="w-full text-sm border border-border rounded">
              <thead>
                <tr className="bg-surface text-left">
                  <th className="px-3 py-1.5 border-b border-border text-light-text font-medium">Function</th>
                  <th className="px-3 py-1.5 border-b border-border text-light-text font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="text-dark-text">
                <tr className="border-b border-border">
                  <td className="px-3 py-1">
                    <Kw>LENGTH(s)</Kw>
                  </td>
                  <td className="px-3 py-1">Number of characters in a string</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-3 py-1">
                    <Kw>LCASE(s)</Kw>
                  </td>
                  <td className="px-3 py-1">Convert to lowercase</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-3 py-1">
                    <Kw>UCASE(s)</Kw>
                  </td>
                  <td className="px-3 py-1">Convert to uppercase</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-3 py-1">
                    <Kw>SUBSTRING(s, start, len)</Kw>
                  </td>
                  <td className="px-3 py-1">Extract characters (1-based index)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-3 py-1">
                    <Kw>MID(s, start, len)</Kw>
                  </td>
                  <td className="px-3 py-1">Same as SUBSTRING (alias)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-3 py-1">
                    <Kw>LEFT(s, len)</Kw>
                  </td>
                  <td className="px-3 py-1">Leftmost characters</td>
                </tr>
                <tr>
                  <td className="px-3 py-1">
                    <Kw>RIGHT(s, len)</Kw>
                  </td>
                  <td className="px-3 py-1">Rightmost characters</td>
                </tr>
              </tbody>
            </table>
          </div>
          <CodeBlock
            code={`OUTPUT LENGTH("Hello")          // 5
OUTPUT UCASE("Hello")           // HELLO
OUTPUT LCASE("Hello")           // hello
OUTPUT SUBSTRING("Hello", 1, 3) // Hel
OUTPUT MID("Hello", 2, 3)       // ell
OUTPUT LEFT("Hello", 2)         // He
OUTPUT RIGHT("Hello", 3)        // llo`}
          />

          <H3 id="math-functions">Math Functions</H3>
          <div className="overflow-x-auto my-2">
            <table className="w-full text-sm border border-border rounded">
              <thead>
                <tr className="bg-surface text-left">
                  <th className="px-3 py-1.5 border-b border-border text-light-text font-medium">Function</th>
                  <th className="px-3 py-1.5 border-b border-border text-light-text font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="text-dark-text">
                <tr className="border-b border-border">
                  <td className="px-3 py-1">
                    <Kw>ROUND(n, places)</Kw>
                  </td>
                  <td className="px-3 py-1">Round to decimal places</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-3 py-1">
                    <Kw>RANDOM()</Kw>
                  </td>
                  <td className="px-3 py-1">Random number between 0 and 1</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-3 py-1">
                    <Kw>INT(n)</Kw>
                  </td>
                  <td className="px-3 py-1">Truncate to integer (towards zero)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-3 py-1">
                    <Kw>DIV(a, b)</Kw>
                  </td>
                  <td className="px-3 py-1">Integer division</td>
                </tr>
                <tr>
                  <td className="px-3 py-1">
                    <Kw>MOD(a, b)</Kw>
                  </td>
                  <td className="px-3 py-1">Remainder after division</td>
                </tr>
              </tbody>
            </table>
          </div>
          <CodeBlock
            code={`OUTPUT ROUND(3.14159, 2)   // 3.14
OUTPUT INT(7.9)            // 7
OUTPUT INT(-2.3)           // -2
OUTPUT INT(RANDOM() * 6)   // Random 0-5`}
          />

          <H3 id="type-conversion">Type Conversion</H3>
          <div className="overflow-x-auto my-2">
            <table className="w-full text-sm border border-border rounded">
              <thead>
                <tr className="bg-surface text-left">
                  <th className="px-3 py-1.5 border-b border-border text-light-text font-medium">Function</th>
                  <th className="px-3 py-1.5 border-b border-border text-light-text font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="text-dark-text">
                <tr className="border-b border-border">
                  <td className="px-3 py-1">
                    <Kw>ASC(c)</Kw>
                  </td>
                  <td className="px-3 py-1">ASCII code of a character</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-3 py-1">
                    <Kw>CHR(n)</Kw>
                  </td>
                  <td className="px-3 py-1">Character from ASCII code</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-3 py-1">
                    <Kw>NUM_TO_STRING(n)</Kw>
                  </td>
                  <td className="px-3 py-1">Convert number to string</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-3 py-1">
                    <Kw>STRING_TO_NUM(s)</Kw>
                  </td>
                  <td className="px-3 py-1">Convert string to number</td>
                </tr>
                <tr>
                  <td className="px-3 py-1">
                    <Kw>IS_NUM(s)</Kw>
                  </td>
                  <td className="px-3 py-1">Check if string is numeric (returns BOOLEAN)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <CodeBlock
            code={`OUTPUT ASC('A')            // 65
OUTPUT CHR(65)             // A
OUTPUT NUM_TO_STRING(42)   // "42"
OUTPUT STRING_TO_NUM("99") // 99
OUTPUT IS_NUM("123")       // TRUE
OUTPUT IS_NUM("abc")       // FALSE`}
          />

          {/* ──────────────────────────────────────────────── */}
          {/*  File Handling                                   */}
          {/* ──────────────────────────────────────────────── */}
          <H2 id="files">File Handling</H2>
          <p className="text-sm text-dark-text mb-2">
            Files are simulated using browser <strong className="text-light-text">localStorage</strong>. Data persists
            between sessions. You can view and manage files using the folder icon in the editor tab bar.
          </p>

          <H3 id="file-ops">File Operations</H3>
          <div className="overflow-x-auto my-2">
            <table className="w-full text-sm border border-border rounded">
              <thead>
                <tr className="bg-surface text-left">
                  <th className="px-3 py-1.5 border-b border-border text-light-text font-medium">Statement</th>
                  <th className="px-3 py-1.5 border-b border-border text-light-text font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="text-dark-text">
                <tr className="border-b border-border">
                  <td className="px-3 py-1">
                    <Kw>OPENFILE f FOR READ</Kw>
                  </td>
                  <td className="px-3 py-1">Open file for reading</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-3 py-1">
                    <Kw>OPENFILE f FOR WRITE</Kw>
                  </td>
                  <td className="px-3 py-1">Open file for writing (overwrites)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-3 py-1">
                    <Kw>OPENFILE f FOR APPEND</Kw>
                  </td>
                  <td className="px-3 py-1">Open file for appending</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-3 py-1">
                    <Kw>READFILE f, var</Kw>
                  </td>
                  <td className="px-3 py-1">Read one line into a variable</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-3 py-1">
                    <Kw>WRITEFILE f, value</Kw>
                  </td>
                  <td className="px-3 py-1">Write a line to the file</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-3 py-1">
                    <Kw>CLOSEFILE f</Kw>
                  </td>
                  <td className="px-3 py-1">Close the file</td>
                </tr>
                <tr>
                  <td className="px-3 py-1">
                    <Kw>EOF(f)</Kw>
                  </td>
                  <td className="px-3 py-1">TRUE if end of file reached</td>
                </tr>
              </tbody>
            </table>
          </div>

          <H3 id="file-write">Writing to a File</H3>
          <CodeBlock
            code={`OPENFILE "scores.txt" FOR WRITE
WRITEFILE "scores.txt", "Alice,95"
WRITEFILE "scores.txt", "Bob,87"
CLOSEFILE "scores.txt"`}
          />

          <H3 id="file-read">Reading from a File</H3>
          <CodeBlock
            code={`DECLARE Line : STRING
OPENFILE "scores.txt" FOR READ
WHILE NOT EOF("scores.txt") DO
    READFILE "scores.txt", Line
    OUTPUT Line
ENDWHILE
CLOSEFILE "scores.txt"`}
          />
          <p className="text-sm text-dark-text mt-2">Appending adds lines without overwriting existing content:</p>
          <CodeBlock
            code={`OPENFILE "log.txt" FOR APPEND
WRITEFILE "log.txt", "New entry"
CLOSEFILE "log.txt"`}
          />

          {/* ──────────────────────────────────────────────── */}
          {/*  Common Patterns                                 */}
          {/* ──────────────────────────────────────────────── */}
          <H2 id="patterns">Common Patterns</H2>
          <p className="text-sm text-dark-text mb-2">These patterns appear frequently in IGCSE exam questions:</p>

          <h4 className="text-sm font-medium text-light-text mt-4 mb-1">Totaling</h4>
          <CodeBlock
            code={`DECLARE Numbers : ARRAY[1:5] OF INTEGER
DECLARE Total : INTEGER
Total <- 0
FOR i <- 1 TO 5
    Total <- Total + Numbers[i]
NEXT i
OUTPUT "Total: ", Total`}
          />

          <h4 className="text-sm font-medium text-light-text mt-4 mb-1">Counting</h4>
          <CodeBlock
            code={`DECLARE Count : INTEGER
Count <- 0
FOR i <- 1 TO 100
    IF Numbers[i] > 50 THEN
        Count <- Count + 1
    ENDIF
NEXT i
OUTPUT "Count above 50: ", Count`}
          />

          <h4 className="text-sm font-medium text-light-text mt-4 mb-1">Finding Maximum</h4>
          <CodeBlock
            code={`DECLARE Max : INTEGER
Max <- Numbers[1]
FOR i <- 2 TO 10
    IF Numbers[i] > Max THEN
        Max <- Numbers[i]
    ENDIF
NEXT i
OUTPUT "Maximum: ", Max`}
          />

          <h4 className="text-sm font-medium text-light-text mt-4 mb-1">Linear Search</h4>
          <CodeBlock
            code={`DECLARE Found : BOOLEAN
DECLARE SearchName : STRING
Found <- FALSE
OUTPUT "Enter name to search:"
INPUT SearchName
DECLARE i : INTEGER
i <- 1
WHILE i <= 10 AND NOT Found DO
    IF Names[i] = SearchName THEN
        Found <- TRUE
        OUTPUT "Found at position ", i
    ENDIF
    i <- i + 1
ENDWHILE
IF NOT Found THEN
    OUTPUT "Not found"
ENDIF`}
          />

          <h4 className="text-sm font-medium text-light-text mt-4 mb-1">Bubble Sort</h4>
          <CodeBlock
            code={`DECLARE Temp : INTEGER
DECLARE Swapped : BOOLEAN
REPEAT
    Swapped <- FALSE
    FOR i <- 1 TO 9
        IF Numbers[i] > Numbers[i + 1] THEN
            Temp <- Numbers[i]
            Numbers[i] <- Numbers[i + 1]
            Numbers[i + 1] <- Temp
            Swapped <- TRUE
        ENDIF
    NEXT i
UNTIL NOT Swapped`}
          />

          <h4 className="text-sm font-medium text-light-text mt-4 mb-1">Input Validation</h4>
          <CodeBlock
            code={`DECLARE Mark : INTEGER
REPEAT
    OUTPUT "Enter a mark (0-100):"
    INPUT Mark
UNTIL Mark >= 0 AND Mark <= 100
OUTPUT "Valid mark entered: ", Mark`}
          />

          <div className="h-8" />
        </div>
      </div>
    </div>
  );
};

export default Documentation;
