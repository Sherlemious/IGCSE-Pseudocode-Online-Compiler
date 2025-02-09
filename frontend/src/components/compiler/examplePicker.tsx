import React, { useState, useEffect, useRef } from 'react';
import { Book, Search, X } from 'lucide-react';

interface Example {
  title: string;
  category: string;
  code: string;
}

const examples: Example[] = [
  {
    title: 'Hello World',
    category: 'Basics',
    code: `OUTPUT "Hello, World!"`,
  },
  {
    title: 'User Input',
    category: 'Input/Output',
    code: `INPUT "Enter your name: " name
OUTPUT "Hello, " + name`,
  },
  {
    title: 'Simple Loop',
    category: 'Loops',
    code: `FOR i = 1 TO 5
    OUTPUT i
NEXT i`,
  },
  {
    title: 'While Loop',
    category: 'Loops',
    code: `count = 1
WHILE count <= 5 DO
    OUTPUT count
    count = count + 1
ENDWHILE`,
  },
  {
    title: 'Array Operations',
    category: 'Arrays',
    code: `DECLARE numbers : ARRAY[1:5] OF INTEGER
FOR i = 1 TO 5
    numbers[i] = i * 2
NEXT i
FOR i = 1 TO 5
    OUTPUT numbers[i]
NEXT i`,
  },
  {
    title: 'Number Guessing Game',
    category: 'Games',
    code: `secret = RANDOM(1, 100)
guesses = 0
guess = 0

WHILE guess <> secret DO
    INPUT "Enter your guess (1-100): " guess
    guesses = guesses + 1

    IF guess < secret THEN
        OUTPUT "Too low!"
    ELSEIF guess > secret THEN
        OUTPUT "Too high!"
    ENDIF
ENDWHILE

OUTPUT "Congratulations! You found it in " + guesses + " guesses!"`,
  },
  {
    title: 'Calculate Average',
    category: 'Math',
    code: `DECLARE numbers : ARRAY[1:5] OF INTEGER
sum = 0

FOR i = 1 TO 5
    INPUT "Enter number " + i + ": " numbers[i]
    sum = sum + numbers[i]
NEXT i

average = sum / 5
OUTPUT "The average is: " + average`,
  },
  {
    title: 'Find Maximum',
    category: 'Arrays',
    code: `DECLARE numbers : ARRAY[1:5] OF INTEGER
FOR i = 1 TO 5
    INPUT "Enter number " + i + ": " numbers[i]
NEXT i

max = numbers[1]
FOR i = 2 TO 5
    IF numbers[i] > max THEN
        max = numbers[i]
    ENDIF
NEXT i

OUTPUT "Maximum number is: " + max`,
  },
  {
    title: 'Temperature Converter',
    category: 'Math',
    code: `INPUT "Enter temperature in Celsius: " celsius
fahrenheit = (celsius * 9/5) + 32
OUTPUT celsius + "°C is " + fahrenheit + "°F"`,
  },
  {
    title: 'Simple Calculator',
    category: 'Math',
    code: `INPUT "Enter first number: " num1
INPUT "Enter operator (+,-,*,/): " op
INPUT "Enter second number: " num2

IF op = "+" THEN
    result = num1 + num2
ELSEIF op = "-" THEN
    result = num1 - num2
ELSEIF op = "*" THEN
    result = num1 * num2
ELSEIF op = "/" THEN
    IF num2 = 0 THEN
        OUTPUT "Error: Cannot divide by zero"
    ELSE
        result = num1 / num2
    ENDIF
ENDIF

OUTPUT num1 + " " + op + " " + num2 + " = " + result`,
  },
];

const ExamplePicker: React.FC<{ onSelectExample: (code: string) => void }> = ({ onSelectExample }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedExample, setSelectedExample] = useState<Example | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const filteredExamples = examples.filter(
    (ex) =>
      ex.title.toLowerCase().includes(search.toLowerCase()) || ex.category.toLowerCase().includes(search.toLowerCase())
  );

  const categories = [...new Set(examples.map((ex) => ex.category))];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-background 
    border-2 border-dark-text rounded-lg hover:border-primary
    transition-all duration-200"
      >
        <Book size={18} className="text-primary" />
        <span className="font-medium">Examples</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div ref={modalRef} className="bg-background rounded-lg w-full max-w-6xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b-2 border-dark-text">
              <h2 className="text-xl font-semibold text-primary">Example Code</h2>
              <button onClick={() => setIsOpen(false)} className="text-dark-text hover:text-primary">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 flex flex-col md:flex-row min-h-0">
              {/* Left Panel */}
              <div className="w-full md:w-72 border-r-2 border-dark-text flex flex-col min-h-0">
                {/* Search */}
                <div className="p-2 border-b-2 border-dark-text">
                  <div className="relative">
                    <Search size={18} className="absolute left-2 top-2.5 text-dark-text" />
                    <input
                      type="text"
                      placeholder="Search examples..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-background border-2 
                        border-dark-text rounded-md focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                {/* Examples List */}
                <div
                  className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary 
                  hover:scrollbar-thumb-secondary scrollbar-track-background scrollbar-thumb-rounded-full"
                >
                  {categories.map((category) => {
                    const categoryExamples = filteredExamples.filter((ex) => ex.category === category);
                    if (categoryExamples.length === 0) return null;

                    return (
                      <div key={category} className="p-2">
                        <div className="text-primary font-semibold px-2 py-1">{category}</div>
                        {categoryExamples.map((example) => (
                          <button
                            key={example.title}
                            onClick={() => setSelectedExample(example)}
                            className={`w-full text-left px-4 py-2 rounded-md transition-colors duration-150
                              ${
                                selectedExample?.title === example.title
                                  ? 'bg-dark-bg text-primary'
                                  : 'hover:bg-dark-bg'
                              }`}
                          >
                            {example.title}
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Panel */}
              <div className="flex-1 flex flex-col min-h-0 p-4">
                {selectedExample ? (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-primary">{selectedExample.title}</h3>
                      <button
                        onClick={() => {
                          onSelectExample(selectedExample.code);
                          setIsOpen(false);
                        }}
                        className="px-4 py-2 bg-primary text-background rounded-md 
                          hover:bg-secondary transition-colors duration-200"
                      >
                        Use This Example
                      </button>
                    </div>
                    <pre
                      className="flex-1 bg-gray-800 p-4 rounded-lg overflow-y-auto
                      scrollbar-thin scrollbar-thumb-primary hover:scrollbar-thumb-secondary
                      scrollbar-track-background scrollbar-thumb-rounded-full"
                    >
                      <code className="text-light-text">{selectedExample.code}</code>
                    </pre>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-dark-text">
                    Select an example to view the code
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExamplePicker;
