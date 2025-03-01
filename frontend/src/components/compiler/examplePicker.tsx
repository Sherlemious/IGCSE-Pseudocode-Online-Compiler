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
    code: `INPUT name
OUTPUT "Hello, ", name`,
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
    title: 'Calculate Average',
    category: 'Math',
    code: `DECLARE numbers : ARRAY[1:5] OF INTEGER
sum = 0

FOR i = 1 TO 5
    INPUT numbers[i]
    sum = sum + numbers[i]
NEXT i

average = sum / 5
OUTPUT "The average is: ", average`,
  },
  {
    title: 'Find Maximum',
    category: 'Arrays',
    code: `DECLARE numbers : ARRAY[1:5] OF INTEGER
FOR i = 1 TO 5
    INPUT numbers[i]
NEXT i

max = numbers[1]
FOR i = 2 TO 5
    IF numbers[i] > max THEN
        max = numbers[i]
    ENDIF
NEXT i

OUTPUT "Maximum number is: ", max`,
  },
  {
    title: 'Temperature Converter',
    category: 'Math',
    code: `INPUT celsius
fahrenheit = (celsius * 9/5) + 32
OUTPUT celsius, "°C is ", fahrenheit, "°F"`,
  },
  {
    title: 'Simple Calculator',
    category: 'Math',
    code: `INPUT num1
INPUT op
INPUT num2

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

OUTPUT num1, " ", op, " ", num2, " = ", result`,
  },
  {
    title: 'UserInput Example',
    category: 'Input/Output',
    code: `name = UserInput
age = UserInput
OUTPUT "Hello, ", name, "! You are ", age, " years old."`,
  },
  {
    title: 'Array with UserInput',
    category: 'Arrays',
    code: `DECLARE scores : ARRAY[1:5] OF INTEGER
sum = 0

FOR i = 1 TO 5
    scores[i] = UserInput
    sum = sum + scores[i]
NEXT i

average = sum / 5
OUTPUT "The average score is: ", average`,
  },
  {
    title: 'Input Validation Loop',
    category: 'Input/Output',
    code: `valid = FALSE
WHILE NOT valid DO
    password = UserInput
    IF LENGTH(password) < 8 THEN
        OUTPUT "Password too short, must be at least 8 characters"
    ELSE
        valid = TRUE
        OUTPUT "Password accepted"
    ENDIF
ENDWHILE`,
  },
  {
    title: 'Interactive Menu',
    category: 'Input/Output',
    code: `choice = 0
WHILE choice <> 4 DO
    OUTPUT "===== MENU ====="
    OUTPUT "1. Option One"
    OUTPUT "2. Option Two"
    OUTPUT "3. Option Three"
    OUTPUT "4. Exit"
    
    choice = UserInput
    
    IF choice = 1 THEN
        OUTPUT "You selected Option One"
    ELSEIF choice = 2 THEN
        OUTPUT "You selected Option Two"
    ELSEIF choice = 3 THEN
        OUTPUT "You selected Option Three"
    ELSEIF choice <> 4 THEN
        OUTPUT "Invalid choice, please try again"
    ENDIF
ENDWHILE`,
  },
  {
    title: 'Compound Interest Calculator',
    category: 'Finance',
    code: `OUTPUT "Enter principal amount: "
principal = UserInput
OUTPUT "Enter annual interest rate (as decimal): "
rate = UserInput
OUTPUT "Enter time period in years: "
time = UserInput
OUTPUT "Enter number of times interest is compounded per year: "
n = UserInput

amount = principal * (1 + rate/n) ^ (n * time)
interest = amount - principal

OUTPUT "Final amount: ", amount
OUTPUT "Interest earned: ", interest`,
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
