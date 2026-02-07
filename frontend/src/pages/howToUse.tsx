import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const CodeBlock = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <pre
        className="bg-gray-800 p-4 rounded-lg font-mono text-light-text overflow-x-auto scrollbar-thin scrollbar-thumb-primary hover:scrollbar-thumb-secondary
            scrollbar-track-background scrollbar-thumb-rounded-full"
      >
        <code>{code}</code>
      </pre>
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 p-2 rounded-md bg-background hover:bg-gray-700
                 transition-colors duration-200 opacity-0 group-hover:opacity-100"
        aria-label="Copy code"
      >
        {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4 text-light-text" />}
      </button>
    </div>
  );
};

const InlineCode = ({ children }: { children: React.ReactNode }) => (
  <code className="bg-gray-800 px-1 py-0.5 rounded font-mono text-primary">{children}</code>
);

const Documentation = () => {
  return (
    <main
      className="flex-1 h-full overflow-y-auto bg-background scrollbar-thin scrollbar-thumb-primary hover:scrollbar-thumb-secondary
            scrollbar-track-background scrollbar-thumb-rounded-full"
    >
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <h1 className="text-3xl font-bold text-light-text">IGCSE Pseudocode Language Documentation</h1>

        <p className="text-dark-text">
          Welcome to the documentation for the IGCSE Pseudocode compiler. This guide covers all supported
          syntax based on the Cambridge IGCSE Computer Science (0478) syllabus.
        </p>

        {/* General Syntax */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-light-text">General Syntax Rules</h2>
          <ul className="list-disc pl-6 text-dark-text space-y-2">
            <li>
              Comments are written using double forward slashes (<InlineCode>//</InlineCode>)
            </li>
            <li>Keywords are case-insensitive (<InlineCode>IF</InlineCode>, <InlineCode>if</InlineCode>, and <InlineCode>If</InlineCode> are all valid)</li>
            <li>Indentation is recommended for readability but not enforced</li>
            <li>
              Assignment uses <InlineCode>{'<-'}</InlineCode> (preferred) or <InlineCode>=</InlineCode>
            </li>
          </ul>
        </section>

        {/* Data Types & Variables */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-light-text">Variables, Constants & Data Types</h2>

          <div className="space-y-4">
            <h3 className="text-xl font-medium text-light-text">Declaring Variables</h3>
            <p className="text-dark-text">
              Use <InlineCode>DECLARE</InlineCode> to declare variables with a data type:
            </p>
            <CodeBlock
              code={`DECLARE Counter : INTEGER
DECLARE TotalToPay : REAL
DECLARE GameOver : BOOLEAN
DECLARE StudentName : STRING
DECLARE Initial : CHAR`}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-medium text-light-text">Constants</h3>
            <p className="text-dark-text">
              Use <InlineCode>CONSTANT</InlineCode> to declare values that do not change:
            </p>
            <CodeBlock
              code={`CONSTANT HourlyRate <- 6.50
CONSTANT MaxSize <- 100
CONSTANT DefaultText <- "N/A"`}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-medium text-light-text">Data Types</h3>
            <ul className="list-disc pl-6 text-dark-text space-y-2">
              <li><InlineCode>INTEGER</InlineCode> - Whole numbers: <InlineCode>5</InlineCode>, <InlineCode>-3</InlineCode></li>
              <li><InlineCode>REAL</InlineCode> - Decimal numbers: <InlineCode>4.7</InlineCode>, <InlineCode>0.3</InlineCode></li>
              <li><InlineCode>CHAR</InlineCode> - Single character in single quotes: <InlineCode>'x'</InlineCode></li>
              <li><InlineCode>STRING</InlineCode> - Text in double quotes: <InlineCode>"Hello"</InlineCode></li>
              <li><InlineCode>BOOLEAN</InlineCode> - Logical values: <InlineCode>TRUE</InlineCode> or <InlineCode>FALSE</InlineCode></li>
            </ul>
          </div>
        </section>

        {/* Input and Output */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-light-text">Input and Output</h2>

          <div className="space-y-4">
            <h3 className="text-xl font-medium text-light-text">Output</h3>
            <p className="text-dark-text">
              Use <InlineCode>OUTPUT</InlineCode> (or <InlineCode>PRINT</InlineCode>) to display values. Multiple values are separated by commas:
            </p>
            <CodeBlock
              code={`OUTPUT "Hello, World!"
OUTPUT "You have ", Lives, " lives left"`}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-medium text-light-text">Input</h3>
            <p className="text-dark-text">
              Use <InlineCode>INPUT</InlineCode> to read a value from the user:
            </p>
            <CodeBlock
              code={`DECLARE Name : STRING
OUTPUT "Enter your name:"
INPUT Name
OUTPUT "Hello, ", Name`}
            />
          </div>
        </section>

        {/* Arrays */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-light-text">Arrays</h2>

          <div className="space-y-4">
            <h3 className="text-xl font-medium text-light-text">1D Arrays</h3>
            <CodeBlock
              code={`DECLARE Names : ARRAY[1:5] OF STRING

Names[1] <- "Alice"
Names[2] <- "Bob"

FOR i <- 1 TO 5
    OUTPUT Names[i]
NEXT i`}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-medium text-light-text">2D Arrays</h3>
            <CodeBlock
              code={`DECLARE Grid : ARRAY[1:3, 1:3] OF CHAR

Grid[1,1] <- 'X'
Grid[2,2] <- 'O'
OUTPUT Grid[1,1]`}
            />
          </div>
        </section>

        {/* Operators */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-light-text">Operators</h2>

          <div className="space-y-4">
            <h3 className="text-xl font-medium text-light-text">Arithmetic Operators</h3>
            <ul className="list-disc pl-6 text-dark-text space-y-2">
              <li><InlineCode>+</InlineCode> Addition</li>
              <li><InlineCode>-</InlineCode> Subtraction</li>
              <li><InlineCode>*</InlineCode> Multiplication</li>
              <li><InlineCode>/</InlineCode> Division</li>
              <li><InlineCode>^</InlineCode> Power</li>
              <li><InlineCode>DIV(a, b)</InlineCode> or <InlineCode>a DIV b</InlineCode> - Integer division</li>
              <li><InlineCode>MOD(a, b)</InlineCode> or <InlineCode>a MOD b</InlineCode> - Remainder</li>
            </ul>
            <CodeBlock
              code={`OUTPUT DIV(10, 3)   // 3
OUTPUT MOD(10, 3)   // 1
OUTPUT 2 ^ 3        // 8`}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-medium text-light-text">Comparison Operators</h3>
            <ul className="list-disc pl-6 text-dark-text space-y-2">
              <li><InlineCode>=</InlineCode> Equal to</li>
              <li><InlineCode>{'<>'}</InlineCode> Not equal to</li>
              <li><InlineCode>{'>'}</InlineCode> Greater than</li>
              <li><InlineCode>{'<'}</InlineCode> Less than</li>
              <li><InlineCode>{'>='}</InlineCode> Greater than or equal to</li>
              <li><InlineCode>{'<='}</InlineCode> Less than or equal to</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-medium text-light-text">Logical Operators</h3>
            <ul className="list-disc pl-6 text-dark-text space-y-2">
              <li><InlineCode>AND</InlineCode> - Logical AND</li>
              <li><InlineCode>OR</InlineCode> - Logical OR</li>
              <li><InlineCode>NOT</InlineCode> - Logical NOT</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-medium text-light-text">String Concatenation</h3>
            <p className="text-dark-text">
              Use <InlineCode>&</InlineCode> to join strings:
            </p>
            <CodeBlock code={`FullName <- FirstName & " " & LastName`} />
          </div>
        </section>

        {/* Control Structures */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-light-text">Selection</h2>

          <div className="space-y-4">
            <h3 className="text-xl font-medium text-light-text">IF Statements</h3>
            <CodeBlock
              code={`IF Score >= 50 THEN
    OUTPUT "Pass"
ELSE
    OUTPUT "Fail"
ENDIF`}
            />
            <p className="text-dark-text mt-2">
              Use <InlineCode>ELSEIF</InlineCode> for multiple conditions:
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
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-medium text-light-text">CASE Statements</h3>
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
          </div>
        </section>

        {/* Iteration */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-light-text">Iteration</h2>

          <div className="space-y-4">
            <h3 className="text-xl font-medium text-light-text">FOR Loops</h3>
            <p className="text-dark-text">Count-controlled loop:</p>
            <CodeBlock
              code={`FOR Counter <- 1 TO 10
    OUTPUT Counter
NEXT Counter

// With STEP
FOR i <- 10 TO 1 STEP -1
    OUTPUT i
NEXT i`}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-medium text-light-text">WHILE Loops</h3>
            <p className="text-dark-text">Pre-condition loop (tests condition before each iteration):</p>
            <CodeBlock
              code={`DECLARE Number : INTEGER
Number <- 100
WHILE Number > 9 DO
    Number <- Number - 9
ENDWHILE
OUTPUT Number`}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-medium text-light-text">REPEAT Loops</h3>
            <p className="text-dark-text">Post-condition loop (always executes at least once):</p>
            <CodeBlock
              code={`DECLARE Password : STRING
REPEAT
    OUTPUT "Enter the password:"
    INPUT Password
UNTIL Password = "Secret"`}
            />
          </div>
        </section>

        {/* Procedures and Functions */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-light-text">Procedures and Functions</h2>

          <div className="space-y-4">
            <h3 className="text-xl font-medium text-light-text">Procedures</h3>
            <p className="text-dark-text">
              Procedures perform actions but do not return a value. Call them with <InlineCode>CALL</InlineCode>:
            </p>
            <CodeBlock
              code={`PROCEDURE Greet(Name : STRING)
    OUTPUT "Hello, ", Name, "!"
ENDPROCEDURE

CALL Greet("Alice")`}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-medium text-light-text">Functions</h3>
            <p className="text-dark-text">
              Functions return a value and are used inside expressions:
            </p>
            <CodeBlock
              code={`FUNCTION Square(N : INTEGER) RETURNS INTEGER
    RETURN N * N
ENDFUNCTION

OUTPUT "Result: ", Square(5)`}
            />
          </div>
        </section>

        {/* Built-in Functions */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-light-text">Built-in Functions</h2>

          <div className="space-y-4">
            <h3 className="text-xl font-medium text-light-text">String Functions</h3>
            <ul className="list-disc pl-6 text-dark-text space-y-2">
              <li><InlineCode>LENGTH(s)</InlineCode> - Returns the length of a string</li>
              <li><InlineCode>LCASE(s)</InlineCode> - Converts to lowercase</li>
              <li><InlineCode>UCASE(s)</InlineCode> - Converts to uppercase</li>
              <li><InlineCode>SUBSTRING(s, start, length)</InlineCode> - Extracts a substring (1-based)</li>
              <li><InlineCode>LEFT(s, length)</InlineCode> - Returns leftmost characters</li>
              <li><InlineCode>RIGHT(s, length)</InlineCode> - Returns rightmost characters</li>
            </ul>
            <CodeBlock
              code={`OUTPUT LENGTH("Hello")          // 5
OUTPUT UCASE("Hello")           // HELLO
OUTPUT SUBSTRING("Hello", 1, 3) // Hel`}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-medium text-light-text">Math Functions</h3>
            <ul className="list-disc pl-6 text-dark-text space-y-2">
              <li><InlineCode>ROUND(n, places)</InlineCode> - Rounds to specified decimal places</li>
              <li><InlineCode>RANDOM()</InlineCode> - Returns a random number between 0 and 1</li>
              <li><InlineCode>INT(n)</InlineCode> - Truncates to an integer</li>
              <li><InlineCode>DIV(a, b)</InlineCode> - Integer division</li>
              <li><InlineCode>MOD(a, b)</InlineCode> - Remainder</li>
            </ul>
            <CodeBlock
              code={`OUTPUT ROUND(3.14159, 2)  // 3.14
OUTPUT INT(RANDOM() * 6)  // Random 0-5`}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-medium text-light-text">Type Conversion</h3>
            <ul className="list-disc pl-6 text-dark-text space-y-2">
              <li><InlineCode>ASC(c)</InlineCode> - ASCII code of a character</li>
              <li><InlineCode>CHR(n)</InlineCode> - Character from ASCII code</li>
              <li><InlineCode>NUM_TO_STRING(n)</InlineCode> - Number to string</li>
              <li><InlineCode>STRING_TO_NUM(s)</InlineCode> - String to number</li>
              <li><InlineCode>IS_NUM(s)</InlineCode> - Checks if string is numeric</li>
            </ul>
          </div>
        </section>

        {/* File Handling */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-light-text">File Handling</h2>

          <p className="text-dark-text">
            Files are simulated using browser localStorage. Data persists between sessions.
          </p>

          <div className="space-y-4">
            <h3 className="text-xl font-medium text-light-text">File Operations</h3>
            <ul className="list-disc pl-6 text-dark-text space-y-2">
              <li><InlineCode>OPENFILE filename FOR READ</InlineCode> - Open for reading</li>
              <li><InlineCode>OPENFILE filename FOR WRITE</InlineCode> - Open for writing (overwrites existing)</li>
              <li><InlineCode>OPENFILE filename FOR APPEND</InlineCode> - Open for appending</li>
              <li><InlineCode>READFILE filename, variable</InlineCode> - Read one line</li>
              <li><InlineCode>WRITEFILE filename, value</InlineCode> - Write one line</li>
              <li><InlineCode>CLOSEFILE filename</InlineCode> - Close the file</li>
              <li><InlineCode>EOF(filename)</InlineCode> - Check if end of file reached</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-medium text-light-text">Writing to a File</h3>
            <CodeBlock
              code={`OPENFILE "scores.txt" FOR WRITE
WRITEFILE "scores.txt", "Alice,95"
WRITEFILE "scores.txt", "Bob,87"
CLOSEFILE "scores.txt"`}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-medium text-light-text">Reading from a File</h3>
            <CodeBlock
              code={`DECLARE Line : STRING
OPENFILE "scores.txt" FOR READ
WHILE NOT EOF("scores.txt") DO
    READFILE "scores.txt", Line
    OUTPUT Line
ENDWHILE
CLOSEFILE "scores.txt"`}
            />
          </div>
        </section>

        {/* Common Patterns */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-light-text">Common Patterns</h2>

          <div className="space-y-4">
            <h3 className="text-xl font-medium text-light-text">Totaling</h3>
            <CodeBlock
              code={`DECLARE Numbers : ARRAY[1:5] OF INTEGER
DECLARE Total : INTEGER
Total <- 0
FOR i <- 1 TO 5
    Total <- Total + Numbers[i]
NEXT i
OUTPUT "Total: ", Total`}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-medium text-light-text">Counting</h3>
            <CodeBlock
              code={`DECLARE Count : INTEGER
Count <- 0
FOR i <- 1 TO 100
    IF Numbers[i] > 50 THEN
        Count <- Count + 1
    ENDIF
NEXT i`}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-medium text-light-text">Linear Search</h3>
            <CodeBlock
              code={`DECLARE Found : BOOLEAN
Found <- FALSE
DECLARE i : INTEGER
i <- 1
WHILE i <= 10 AND NOT Found DO
    IF Names[i] = SearchName THEN
        Found <- TRUE
        OUTPUT "Found at position ", i
    ENDIF
    i <- i + 1
ENDWHILE`}
            />
          </div>
        </section>
      </div>
    </main>
  );
};

export default Documentation;
