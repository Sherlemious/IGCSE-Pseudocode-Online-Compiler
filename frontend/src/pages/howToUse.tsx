import React from 'react';

const HowToUse: React.FC = () => {
  return (
    <main className="min-h-screen bg-background dark:bg-dark-bg p-6">
      <h1 className="text-3xl font-bold text-dark-text dark:text-light-text mb-6">How to Use</h1>
      <p className="text-lg text-dark-text dark:text-light-text mb-4">
        Welcome to the documentation for the pseudocode language! This page will help you understand the supported
        syntax and usage of the pseudocode compiler.
      </p>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-dark-text dark:text-light-text mb-4">General Syntax Rules</h2>
        <ul className="list-disc pl-6 text-dark-text dark:text-light-text">
          <li>
            Comments start with <code>//</code>.
          </li>
          <li>Statements are generally written in a case-insensitive manner.</li>
          <li>Indentation is used to define blocks (e.g., for loops, conditionals).</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-dark-text dark:text-light-text mb-4">
          Supported Control Structures
        </h2>
        <ul className="list-disc pl-6 text-dark-text dark:text-light-text">
          <li>
            <strong>IF Statements:</strong>
            <p>
              <code>IF condition THEN</code> - Conditions use operators like <code>AND</code>, <code>OR</code>, and{' '}
              <code>NOT</code>.
            </p>
          </li>
          <li>
            <strong>WHILE Loops:</strong>
            <p>
              <code>WHILE condition DO</code> - Loops until the condition is false.
            </p>
          </li>
          <li>
            <strong>FOR Loops:</strong>
            <p>
              <code>FOR variable = start TO end</code> - Loops from <code>start</code> to <code>end</code> (inclusive).
            </p>
          </li>
          <li>
            Block endings include <code>ENDIF</code>, <code>ENDWHILE</code>, and <code>NEXT</code>.
          </li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-dark-text dark:text-light-text mb-4">Input/Output</h2>
        <ul className="list-disc pl-6 text-dark-text dark:text-light-text">
          <li>
            <strong>PRINT:</strong> Use <code>PRINT</code> to display output. For example,{' '}
            <code>PRINT "Hello, World!"</code>.
          </li>
          <li>
            <strong>INPUT:</strong> Use <code>INPUT variable</code> to read user input.
          </li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-dark-text dark:text-light-text mb-4">Operators</h2>
        <ul className="list-disc pl-6 text-dark-text dark:text-light-text">
          <li>
            <code>AND</code>, <code>OR</code>, <code>NOT</code> - Logical operators.
          </li>
          <li>
            <code>=</code>, <code>&lt;&gt;</code> (or <code>&gt;&lt;</code>) - Equality and inequality.
          </li>
          <li>
            <code>MOD</code>, <code>DIV</code> - Modulus and integer division.
          </li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-dark-text dark:text-light-text mb-4">Built-in Functions</h2>
        <ul className="list-disc pl-6 text-dark-text dark:text-light-text">
          <li>
            <code>RANDOM</code> - Generates a random number (maps to Python's <code>random.random()</code>).
          </li>
          <li>
            <code>INT</code> - Converts a value to an integer.
          </li>
          <li>
            <code>LENGTH</code> or <code>length</code> - Gets the length of an array or string.
          </li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-dark-text dark:text-light-text mb-4">Arrays</h2>
        <ul className="list-disc pl-6 text-dark-text dark:text-light-text">
          <li>
            Arrays can be initialized using square brackets. For example, <code>myArray = [1, 2, 3]</code>.
          </li>
          <li>
            Multi-dimensional arrays are supported. Example: <code>myArray = [[1, 2, 3][4, 5, 6]]</code>.
          </li>
        </ul>
      </section>
    </main>
  );
};

export default HowToUse;
