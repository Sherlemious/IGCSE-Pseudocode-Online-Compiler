import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const CodeBlock = ({ code }) => {
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

const InlineCode = ({ children }) => (
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
          Welcome to the documentation for the pseudocode language! This guide will help you understand the supported
          syntax and usage of the IGCSE pseudocode compiler.
        </p>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-light-text">General Syntax Rules</h2>
          <ul className="list-disc pl-6 text-dark-text space-y-2">
            <li>
              Comments in the code are written using double forward slashes (<InlineCode>//</InlineCode>)
            </li>
            <li>The language is case-insensitive, making it flexible for writing statements</li>
            <li>Indentation is not required, but it is recommended for readability</li>
          </ul>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-light-text">Input and Output Operations</h2>

          <div className="space-y-4">
            <h3 className="text-xl font-medium text-light-text">Output with PRINT</h3>
            <p className="text-dark-text">
              Use the <InlineCode>PRINT</InlineCode> statement to display information:
            </p>
            <CodeBlock
              code={`PRINT "Hello, World!"
PRINT "Current score: " + score`}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-medium text-light-text">Input Operations</h3>
            <p className="text-dark-text">
              Use <InlineCode>INPUT</InlineCode> to read user input:
            </p>
            <CodeBlock
              code={`PRINT "Enter your name:"
INPUT userName
PRINT "Hello, " + userName`}
            />
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-light-text">Control Structures</h2>

          <div className="space-y-4">
            <h3 className="text-xl font-medium text-light-text">IF Statements</h3>
            <p className="text-dark-text">IF statements allow for conditional execution of code blocks:</p>
            <CodeBlock
              code={`IF age >= 18 THEN
    PRINT "You are an adult"
ELSE
    PRINT "You are a minor"
ENDIF`}
            />

            <p className="text-dark-text mt-4">
              You can use <InlineCode>AND</InlineCode>, <InlineCode>OR</InlineCode>, and <InlineCode>NOT</InlineCode>{' '}
              operators in conditions:
            </p>
            <CodeBlock
              code={`IF age >= 18 AND hasLicense = TRUE THEN
    PRINT "You can drive"
ENDIF`}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-medium text-light-text">WHILE Loops</h3>
            <p className="text-dark-text">WHILE loops continue executing while a condition remains true:</p>
            <CodeBlock
              code={`counter = 1
WHILE counter <= 5 DO
    PRINT counter
    counter = counter + 1
ENDWHILE`}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-medium text-light-text">FOR Loops</h3>
            <p className="text-dark-text">FOR loops iterate over a range of values:</p>
            <CodeBlock
              code={`FOR i = 1 TO 5
    PRINT i
NEXT`}
            />
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-light-text">Operators</h2>

          <div className="space-y-4">
            <h3 className="text-xl font-medium text-light-text">Logical Operators</h3>
            <ul className="list-disc pl-6 text-dark-text space-y-2">
              <li>
                <InlineCode>AND</InlineCode> - Logical AND
              </li>
              <li>
                <InlineCode>OR</InlineCode> - Logical OR
              </li>
              <li>
                <InlineCode>NOT</InlineCode> - Logical NOT
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-medium text-light-text">Comparison Operators</h3>
            <ul className="list-disc pl-6 text-dark-text space-y-2">
              <li>
                <InlineCode>=</InlineCode> - Equal to
              </li>
              <li>
                <InlineCode>&lt;&gt;</InlineCode> or <InlineCode>&gt;&lt;</InlineCode> - Not equal to
              </li>
              <li>
                <InlineCode>&gt;</InlineCode> - Greater than
              </li>
              <li>
                <InlineCode>&lt;</InlineCode> - Less than
              </li>
              <li>
                <InlineCode>&gt;=</InlineCode> - Greater than or equal to
              </li>
              <li>
                <InlineCode>&lt;=</InlineCode> - Less than or equal to
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-medium text-light-text">Arithmetic Operators</h3>
            <ul className="list-disc pl-6 text-dark-text space-y-2">
              <li>
                <InlineCode>MOD</InlineCode> - Modulus operator (remainder)
              </li>
              <li>
                <InlineCode>DIV</InlineCode> - Integer division
              </li>
            </ul>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-light-text">Built-in Functions</h2>

          <p className="text-dark-text">The language includes several useful built-in functions:</p>

          <div className="space-y-4">
            <div>
              <p className="text-dark-text">
                <InlineCode>RANDOM()</InlineCode> - Generates a random number between 0 and 1
              </p>
              <CodeBlock code="randomValue = RANDOM()" />
            </div>

            <div>
              <p className="text-dark-text">
                <InlineCode>INT()</InlineCode> - Converts a value to an integer
              </p>
              <CodeBlock code="wholeNumber = INT(3.14)" />
            </div>

            <div>
              <p className="text-dark-text">
                <InlineCode>LENGTH()</InlineCode> - Returns the length of arrays or strings
              </p>
              <CodeBlock
                code={`myArray = [1, 2, 3, 4, 5]
arraySize = LENGTH(myArray)`}
              />
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-light-text">Working with Arrays</h2>

          <p className="text-dark-text">Arrays are supported with both single and multi-dimensional implementations:</p>

          <div className="space-y-4">
            <h3 className="text-xl font-medium text-light-text">Single-Dimensional Arrays</h3>
            <CodeBlock
              code={`numbers = [1, 2, 3, 4, 5]
PRINT numbers[0]  // Prints first element`}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-medium text-light-text">Multi-Dimensional Arrays</h3>
            <CodeBlock
              code={`matrix = [[1, 2, 3]
          [4, 5, 6]
          [7, 8, 9]]
PRINT matrix[0][0]  // Prints first element of first row`}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-medium text-light-text">Array Operations</h3>
            <CodeBlock
              code={`// Initialize an array
scores = [85, 92, 78, 95, 88]

// Get array length
size = LENGTH(scores)

// Loop through array
FOR i = 0 TO size - 1
    PRINT scores[i]
NEXT`}
            />
          </div>
        </section>
      </div>
    </main>
  );
};

export default Documentation;
