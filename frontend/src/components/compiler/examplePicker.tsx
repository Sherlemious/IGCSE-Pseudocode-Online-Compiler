import React, { useState, useEffect, useRef } from 'react';
import { Book, Search, X } from 'lucide-react';

interface Example {
  title: string;
  category: string;
  code: string;
}

const examples: Example[] = [
  // ========== Basics ==========
  {
    title: 'Hello World',
    category: 'Basics',
    code: `OUTPUT "Hello, World!"`,
  },
  {
    title: 'Variables and Assignment',
    category: 'Basics',
    code: `DECLARE x : INTEGER
DECLARE y : INTEGER
x = 10
y = 20
OUTPUT "x = ", x
OUTPUT "y = ", y
OUTPUT "x + y = ", x + y`,
  },
  {
    title: 'Constants',
    category: 'Basics',
    code: `CONSTANT PI = 3.14159
DECLARE radius : REAL
radius = 5
area = PI * radius * radius
OUTPUT "Area of circle: ", area`,
  },

  // ========== Input/Output ==========
  {
    title: 'Simple Input',
    category: 'Input/Output',
    code: `DECLARE name : STRING
INPUT name
OUTPUT "Hello, ", name`,
  },
  {
    title: 'Multiple Inputs',
    category: 'Input/Output',
    code: `DECLARE length : REAL
DECLARE width : REAL
OUTPUT "Enter length: "
INPUT length
OUTPUT "Enter width: "
INPUT width
area = length * width
OUTPUT "Area = ", area`,
  },

  // ========== Conditionals ==========
  {
    title: 'IF Statement',
    category: 'Conditionals',
    code: `DECLARE age : INTEGER
INPUT age
IF age >= 18 THEN
    OUTPUT "You are an adult"
ELSE
    OUTPUT "You are a minor"
ENDIF`,
  },
  {
    title: 'Nested IF',
    category: 'Conditionals',
    code: `DECLARE score : INTEGER
INPUT score
IF score >= 90 THEN
    OUTPUT "Grade: A"
ELSEIF score >= 80 THEN
    OUTPUT "Grade: B"
ELSEIF score >= 70 THEN
    OUTPUT "Grade: C"
ELSEIF score >= 60 THEN
    OUTPUT "Grade: D"
ELSE
    OUTPUT "Grade: F"
ENDIF`,
  },

  // ========== Loops ==========
  {
    title: 'FOR Loop',
    category: 'Loops',
    code: `DECLARE i : INTEGER
FOR i = 1 TO 10
    OUTPUT i
NEXT i`,
  },
  {
    title: 'FOR Loop with STEP',
    category: 'Loops',
    code: `DECLARE i : INTEGER
FOR i = 0 TO 20 STEP 2
    OUTPUT i
NEXT i`,
  },
  {
    title: 'WHILE Loop',
    category: 'Loops',
    code: `DECLARE count : INTEGER
count = 1
WHILE count <= 5 DO
    OUTPUT count
    count = count + 1
ENDWHILE`,
  },
  {
    title: 'REPEAT Loop',
    category: 'Loops',
    code: `DECLARE num : INTEGER
num = 1
REPEAT
    OUTPUT num
    num = num + 1
UNTIL num > 5`,
  },
  {
    title: 'Nested Loops',
    category: 'Loops',
    code: `DECLARE i : INTEGER
DECLARE j : INTEGER
FOR i = 1 TO 3
    FOR j = 1 TO 3
        OUTPUT i, " x ", j, " = ", i * j
    NEXT j
NEXT i`,
  },

  // ========== Arrays ==========
  {
    title: '1D Array',
    category: 'Arrays',
    code: `DECLARE numbers : ARRAY[1:5] OF INTEGER
DECLARE i : INTEGER
FOR i = 1 TO 5
    numbers[i] = i * 2
NEXT i
FOR i = 1 TO 5
    OUTPUT numbers[i]
NEXT i`,
  },
  {
    title: '2D Array',
    category: 'Arrays',
    code: `DECLARE matrix : ARRAY[1:3, 1:3] OF INTEGER
DECLARE i : INTEGER
DECLARE j : INTEGER
FOR i = 1 TO 3
    FOR j = 1 TO 3
        matrix[i, j] = i * j
    NEXT j
NEXT i
FOR i = 1 TO 3
    FOR j = 1 TO 3
        OUTPUT matrix[i, j], " "
    NEXT j
    OUTPUT ""
NEXT i`,
  },
  {
    title: 'Find Maximum in Array',
    category: 'Arrays',
    code: `DECLARE numbers : ARRAY[1:5] OF INTEGER
DECLARE i : INTEGER
DECLARE max : INTEGER
FOR i = 1 TO 5
    INPUT numbers[i]
NEXT i
max = numbers[1]
FOR i = 2 TO 5
    IF numbers[i] > max THEN
        max = numbers[i]
    ENDIF
NEXT i
OUTPUT "Maximum: ", max`,
  },

  // ========== Procedures ==========
  {
    title: 'Simple Procedure',
    category: 'Procedures',
    code: `PROCEDURE Greet()
    OUTPUT "Hello from procedure!"
ENDPROCEDURE

CALL Greet()`,
  },
  {
    title: 'Procedure with Parameters',
    category: 'Procedures',
    code: `PROCEDURE PrintSum(a : INTEGER, b : INTEGER)
    DECLARE sum : INTEGER
    sum = a + b
    OUTPUT "Sum = ", sum
ENDPROCEDURE

CALL PrintSum(5, 3)
CALL PrintSum(10, 20)`,
  },
  {
    title: 'Procedure with BYREF',
    category: 'Procedures',
    code: `PROCEDURE Swap(BYREF a : INTEGER, BYREF b : INTEGER)
    DECLARE temp : INTEGER
    temp = a
    a = b
    b = temp
ENDPROCEDURE

DECLARE x : INTEGER
DECLARE y : INTEGER
x = 5
y = 10
OUTPUT "Before: x=", x, ", y=", y
CALL Swap(x, y)
OUTPUT "After: x=", x, ", y=", y`,
  },

  // ========== Functions ==========
  {
    title: 'Simple Function',
    category: 'Functions',
    code: `FUNCTION Square(n : INTEGER) RETURNS INTEGER
    RETURN n * n
ENDFUNCTION

DECLARE result : INTEGER
result = Square(5)
OUTPUT "5 squared = ", result`,
  },
  {
    title: 'Function with Multiple Parameters',
    category: 'Functions',
    code: `FUNCTION Add(a : INTEGER, b : INTEGER) RETURNS INTEGER
    RETURN a + b
ENDFUNCTION

DECLARE sum : INTEGER
sum = Add(10, 20)
OUTPUT "Sum = ", sum`,
  },
  {
    title: 'Factorial Function',
    category: 'Functions',
    code: `FUNCTION Factorial(n : INTEGER) RETURNS INTEGER
    DECLARE result : INTEGER
    DECLARE i : INTEGER
    result = 1
    FOR i = 1 TO n
        result = result * i
    NEXT i
    RETURN result
ENDFUNCTION

DECLARE num : INTEGER
DECLARE fact : INTEGER
num = 5
fact = Factorial(num)
OUTPUT num, "! = ", fact`,
  },
  {
    title: 'Is Prime Function',
    category: 'Functions',
    code: `FUNCTION IsPrime(n : INTEGER) RETURNS BOOLEAN
    DECLARE i : INTEGER
    IF n <= 1 THEN
        RETURN FALSE
    ENDIF
    FOR i = 2 TO n - 1
        IF n MOD i = 0 THEN
            RETURN FALSE
        ENDIF
    NEXT i
    RETURN TRUE
ENDFUNCTION

DECLARE num : INTEGER
num = 17
IF IsPrime(num) THEN
    OUTPUT num, " is prime"
ELSE
    OUTPUT num, " is not prime"
ENDIF`,
  },

  // ========== Strings ==========
  {
    title: 'String Operations',
    category: 'Strings',
    code: `DECLARE text : STRING
text = "Hello"
OUTPUT "Length: ", LENGTH(text)
OUTPUT "Substring: ", SUBSTRING(text, 1, 3)`,
  },
  {
    title: 'String Concatenation',
    category: 'Strings',
    code: `DECLARE first : STRING
DECLARE last : STRING
DECLARE full : STRING
first = "John"
last = "Doe"
full = first + " " + last
OUTPUT "Full name: ", full`,
  },

  // ========== Complete Programs ==========
  {
    title: 'Calculate Average',
    category: 'Complete Programs',
    code: `DECLARE numbers : ARRAY[1:5] OF INTEGER
DECLARE i : INTEGER
DECLARE sum : INTEGER
DECLARE average : REAL
sum = 0
FOR i = 1 TO 5
    OUTPUT "Enter number ", i, ": "
    INPUT numbers[i]
    sum = sum + numbers[i]
NEXT i
average = sum / 5
OUTPUT "Average = ", average`,
  },
  {
    title: 'Number Guessing Game',
    category: 'Complete Programs',
    code: `DECLARE secret : INTEGER
DECLARE guess : INTEGER
DECLARE attempts : INTEGER
secret = 42
attempts = 0
OUTPUT "Guess the number (1-100)!"
REPEAT
    INPUT guess
    attempts = attempts + 1
    IF guess < secret THEN
        OUTPUT "Too low!"
    ELSEIF guess > secret THEN
        OUTPUT "Too high!"
    ENDIF
UNTIL guess = secret
OUTPUT "Correct! You got it in ", attempts, " attempts"`,
  },
  {
    title: 'Bubble Sort',
    category: 'Complete Programs',
    code: `DECLARE arr : ARRAY[1:5] OF INTEGER
DECLARE i : INTEGER
DECLARE j : INTEGER
DECLARE temp : INTEGER
DECLARE swapped : BOOLEAN

OUTPUT "Enter 5 numbers:"
FOR i = 1 TO 5
    INPUT arr[i]
NEXT i

FOR i = 1 TO 4
    swapped = FALSE
    FOR j = 1 TO 5 - i
        IF arr[j] > arr[j + 1] THEN
            temp = arr[j]
            arr[j] = arr[j + 1]
            arr[j + 1] = temp
            swapped = TRUE
        ENDIF
    NEXT j
    IF NOT swapped THEN
        i = 5
    ENDIF
NEXT i

OUTPUT "Sorted array:"
FOR i = 1 TO 5
    OUTPUT arr[i]
NEXT i`,
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
