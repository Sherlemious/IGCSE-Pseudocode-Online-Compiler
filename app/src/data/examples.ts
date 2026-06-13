export interface Example {
  title: string;
  category: string;
  code: string;
}

export const examples: Example[] = [
  // Basics
  {
    title: 'Hello World',
    category: 'Basics',
    code: `OUTPUT "Hello, World!"`,
  },
  {
    title: 'Variables and Constants',
    category: 'Basics',
    code: `// Declare variables
DECLARE Name : STRING
DECLARE Age : INTEGER
DECLARE Height : REAL

// Declare constants
CONSTANT PI <- 3.14159
CONSTANT TAX_RATE <- 0.15

OUTPUT "Enter your name:"
INPUT Name
OUTPUT "Enter your age:"
INPUT Age

OUTPUT "Hello, ", Name, "!"
OUTPUT "You are ", Age, " years old"
OUTPUT "Pi value: ", PI`,
  },

  // Input/Output
  {
    title: 'Basic Input',
    category: 'Input/Output',
    code: `DECLARE Name : STRING
OUTPUT "Enter your name:"
INPUT Name
OUTPUT "Hello, ", Name`,
  },
  {
    title: 'Multiple Inputs',
    category: 'Input/Output',
    code: `DECLARE FirstName : STRING
DECLARE LastName : STRING
DECLARE Age : INTEGER

OUTPUT "Enter first name:"
INPUT FirstName
OUTPUT "Enter last name:"
INPUT LastName
OUTPUT "Enter age:"
INPUT Age

OUTPUT "Full name: ", FirstName, " ", LastName
OUTPUT "Age: ", Age`,
  },

  // Operators
  {
    title: 'Arithmetic Operators',
    category: 'Operators',
    code: `DECLARE A : INTEGER
DECLARE B : INTEGER

OUTPUT "Enter first number:"
INPUT A
OUTPUT "Enter second number:"
INPUT B

OUTPUT "Addition: ", A + B
OUTPUT "Subtraction: ", A - B
OUTPUT "Multiplication: ", A * B
OUTPUT "Division: ", A / B
OUTPUT "Power: ", A ^ B
OUTPUT "DIV (quotient): ", DIV(A, B)
OUTPUT "MOD (remainder): ", MOD(A, B)`,
  },
  {
    title: 'Comparison & Logical',
    category: 'Operators',
    code: `DECLARE Age : INTEGER
DECLARE HasLicense : BOOLEAN

OUTPUT "Enter your age:"
INPUT Age
OUTPUT "Do you have a license? (TRUE/FALSE):"
INPUT HasLicense

IF Age >= 18 AND HasLicense = TRUE THEN
    OUTPUT "You can drive"
ELSEIF Age >= 18 AND HasLicense = FALSE THEN
    OUTPUT "You need to get a license"
ELSE
    OUTPUT "You are too young"
ENDIF`,
  },

  // Selection
  {
    title: 'IF-ELSE Statement',
    category: 'Selection',
    code: `DECLARE Score : INTEGER

OUTPUT "Enter your score:"
INPUT Score

IF Score >= 50 THEN
    OUTPUT "Pass"
ELSE
    OUTPUT "Fail"
ENDIF`,
  },
  {
    title: 'IF-ELSEIF Grading',
    category: 'Selection',
    code: `DECLARE Score : INTEGER
DECLARE Grade : CHAR

OUTPUT "Enter score (0-100):"
INPUT Score

IF Score >= 90 THEN
    Grade <- 'A'
ELSEIF Score >= 80 THEN
    Grade <- 'B'
ELSEIF Score >= 70 THEN
    Grade <- 'C'
ELSEIF Score >= 60 THEN
    Grade <- 'D'
ELSE
    Grade <- 'F'
ENDIF

OUTPUT "Your grade is: ", Grade`,
  },
  {
    title: 'CASE Statement',
    category: 'Selection',
    code: `DECLARE Choice : CHAR

OUTPUT "=== Menu ==="
OUTPUT "A - Add"
OUTPUT "S - Subtract"
OUTPUT "M - Multiply"
OUTPUT "D - Divide"
OUTPUT "Enter choice:"
INPUT Choice

CASE OF Choice
    'A' :
        OUTPUT "Addition selected"
    'S' :
        OUTPUT "Subtraction selected"
    'M' :
        OUTPUT "Multiplication selected"
    'D' :
        OUTPUT "Division selected"
    OTHERWISE:
        OUTPUT "Invalid choice"
ENDCASE`,
  },

  // Loops
  {
    title: 'FOR Loop',
    category: 'Loops',
    code: `DECLARE i : INTEGER

OUTPUT "Counting 1 to 10:"
FOR i <- 1 TO 10
    OUTPUT i
NEXT i`,
  },
  {
    title: 'FOR Loop with STEP',
    category: 'Loops',
    code: `DECLARE i : INTEGER

OUTPUT "Counting down from 10 to 1:"
FOR i <- 10 TO 1 STEP -1
    OUTPUT i
NEXT i

OUTPUT ""
OUTPUT "Even numbers from 2 to 20:"
FOR i <- 2 TO 20 STEP 2
    OUTPUT i
NEXT i`,
  },
  {
    title: 'WHILE Loop',
    category: 'Loops',
    code: `DECLARE Count : INTEGER

Count <- 1
WHILE Count <= 5 DO
    OUTPUT Count
    Count <- Count + 1
ENDWHILE`,
  },
  {
    title: 'REPEAT-UNTIL Loop',
    category: 'Loops',
    code: `DECLARE Password : STRING

REPEAT
    OUTPUT "Enter password:"
    INPUT Password
    IF Password <> "secret" THEN
        OUTPUT "Incorrect! Try again."
    ENDIF
UNTIL Password = "secret"

OUTPUT "Access granted!"`,
  },
  {
    title: 'Number Guessing Game',
    category: 'Loops',
    code: `DECLARE Number : INTEGER
DECLARE Guess : INTEGER
DECLARE Count : INTEGER

Number <- INT(RANDOM() * 10) + 1
Count <- 0

OUTPUT "Guess a number between 1 and 10"

REPEAT
    INPUT Guess
    Count <- Count + 1

    IF Guess < Number THEN
        OUTPUT "Too low!"
    ELSEIF Guess > Number THEN
        OUTPUT "Too high!"
    ENDIF
UNTIL Guess = Number

OUTPUT "Correct! You got it in ", Count, " guesses!"`,
  },

  // Arrays
  {
    title: '1D Array - Input & Display',
    category: 'Arrays',
    code: `DECLARE Numbers : ARRAY[1:5] OF INTEGER
DECLARE i : INTEGER

OUTPUT "Enter 5 numbers:"
FOR i <- 1 TO 5
    INPUT Numbers[i]
NEXT i

OUTPUT "You entered:"
FOR i <- 1 TO 5
    OUTPUT Numbers[i]
NEXT i`,
  },
  {
    title: '1D Array - Find Maximum',
    category: 'Arrays',
    code: `DECLARE Numbers : ARRAY[1:5] OF INTEGER
DECLARE i : INTEGER
DECLARE Max : INTEGER

OUTPUT "Enter 5 numbers:"
FOR i <- 1 TO 5
    INPUT Numbers[i]
NEXT i

Max <- Numbers[1]
FOR i <- 2 TO 5
    IF Numbers[i] > Max THEN
        Max <- Numbers[i]
    ENDIF
NEXT i

OUTPUT "Maximum: ", Max`,
  },
  {
    title: '1D Array - Calculate Average',
    category: 'Arrays',
    code: `DECLARE Scores : ARRAY[1:5] OF INTEGER
DECLARE i : INTEGER
DECLARE Total : INTEGER
DECLARE Average : REAL

Total <- 0

OUTPUT "Enter 5 scores:"
FOR i <- 1 TO 5
    INPUT Scores[i]
    Total <- Total + Scores[i]
NEXT i

Average <- Total / 5.0
OUTPUT "Average score: ", ROUND(Average, 2)`,
  },
  {
    title: '2D Array - Grid',
    category: 'Arrays',
    code: `DECLARE Grid : ARRAY[1:3, 1:3] OF CHAR
DECLARE i : INTEGER
DECLARE j : INTEGER

// Initialize grid
FOR i <- 1 TO 3
    FOR j <- 1 TO 3
        Grid[i,j] <- '-'
    NEXT j
NEXT i

// Place some values
Grid[1,1] <- 'X'
Grid[2,2] <- 'O'
Grid[3,3] <- 'X'

// Display grid
OUTPUT "Grid:"
FOR i <- 1 TO 3
    FOR j <- 1 TO 3
        OUTPUT Grid[i,j], " "
    NEXT j
    OUTPUT ""
NEXT i`,
  },

  // String Functions
  {
    title: 'String Functions',
    category: 'String Functions',
    code: `DECLARE Text : STRING

OUTPUT "Enter your name:"
INPUT Text

OUTPUT "Length: ", LENGTH(Text)
OUTPUT "Uppercase: ", UCASE(Text)
OUTPUT "Lowercase: ", LCASE(Text)
OUTPUT "First 3 chars: ", SUBSTRING(Text, 1, 3)
OUTPUT "Left 2 chars: ", LEFT(Text, 2)
OUTPUT "Right 2 chars: ", RIGHT(Text, 2)`,
  },
  {
    title: 'String Concatenation',
    category: 'String Functions',
    code: `DECLARE FirstName : STRING
DECLARE LastName : STRING
DECLARE FullName : STRING

OUTPUT "Enter first name:"
INPUT FirstName
OUTPUT "Enter last name:"
INPUT LastName

FullName <- FirstName & " " & LastName
OUTPUT "Full name: ", FullName

// Create email
DECLARE Email : STRING
Email <- LCASE(FirstName) & "." & LCASE(LastName) & "@school.edu"
OUTPUT "Email: ", Email`,
  },

  // Procedures & Functions
  {
    title: 'Simple Procedure',
    category: 'Procedures & Functions',
    code: `PROCEDURE Greet(Name : STRING)
    OUTPUT "Hello, ", Name, "!"
ENDPROCEDURE

DECLARE UserName : STRING

OUTPUT "Enter your name:"
INPUT UserName

CALL Greet(UserName)`,
  },
  {
    title: 'Function - Square',
    category: 'Procedures & Functions',
    code: `FUNCTION Square(N : INTEGER) RETURNS INTEGER
    RETURN N * N
ENDFUNCTION

DECLARE Num : INTEGER

OUTPUT "Enter a number:"
INPUT Num

OUTPUT "Square of ", Num, " is ", Square(Num)`,
  },
  {
    title: 'Function - Factorial',
    category: 'Procedures & Functions',
    code: `FUNCTION Factorial(N : INTEGER) RETURNS INTEGER
    DECLARE Result : INTEGER
    DECLARE i : INTEGER

    Result <- 1
    FOR i <- 1 TO N
        Result <- Result * i
    NEXT i

    RETURN Result
ENDFUNCTION

DECLARE Number : INTEGER

OUTPUT "Enter a number:"
INPUT Number

OUTPUT "Factorial of ", Number, " is ", Factorial(Number)`,
  },

  // File Handling
  {
    title: 'Write to File',
    category: 'File Handling',
    code: `// Write student scores to a file
DECLARE Name : STRING
DECLARE Score : INTEGER
DECLARE i : INTEGER

OPENFILE "scores.txt" FOR WRITE

FOR i <- 1 TO 3
    OUTPUT "Enter student ", i, " name:"
    INPUT Name
    OUTPUT "Enter score:"
    INPUT Score

    WRITEFILE "scores.txt", Name & "," & NUM_TO_STRING(Score)
NEXT i

CLOSEFILE "scores.txt"

OUTPUT "Data saved to scores.txt"`,
  },
  {
    title: 'Read from File',
    category: 'File Handling',
    code: `// Read and display all lines from file
DECLARE Line : STRING

OUTPUT "Reading from scores.txt:"
OUTPUT ""

OPENFILE "scores.txt" FOR READ

WHILE NOT EOF("scores.txt") DO
    READFILE "scores.txt", Line
    OUTPUT Line
ENDWHILE

CLOSEFILE "scores.txt"

OUTPUT ""
OUTPUT "File read complete"`,
  },
  {
    title: 'Append to File',
    category: 'File Handling',
    code: `// Add more data to existing file
DECLARE Name : STRING
DECLARE Score : INTEGER

OUTPUT "Add a new student"
OUTPUT "Enter name:"
INPUT Name
OUTPUT "Enter score:"
INPUT Score

OPENFILE "scores.txt" FOR APPEND
WRITEFILE "scores.txt", Name & "," & NUM_TO_STRING(Score)
CLOSEFILE "scores.txt"

OUTPUT "New student added to file"`,
  },

  // Math & Random
  {
    title: 'Math Functions',
    category: 'Math',
    code: `DECLARE Number : REAL

OUTPUT "Enter a decimal number:"
INPUT Number

OUTPUT "Original: ", Number
OUTPUT "Rounded (0 places): ", ROUND(Number, 0)
OUTPUT "Rounded (2 places): ", ROUND(Number, 2)
OUTPUT "Integer part: ", INT(Number)

OUTPUT ""
OUTPUT "Random number (0-1): ", RANDOM()
OUTPUT "Random 1-10: ", INT(RANDOM() * 10) + 1
OUTPUT "Random 1-100: ", INT(RANDOM() * 100) + 1`,
  },
  {
    title: 'Temperature Converter',
    category: 'Math',
    code: `DECLARE Celsius : REAL
DECLARE Fahrenheit : REAL

OUTPUT "Enter temperature in Celsius:"
INPUT Celsius

Fahrenheit <- (Celsius * 9.0 / 5.0) + 32.0

OUTPUT Celsius, "°C = ", ROUND(Fahrenheit, 2), "°F"`,
  },

  // Type Conversion
  {
    title: 'Type Conversion',
    category: 'Type Conversion',
    code: `DECLARE NumText : STRING
DECLARE Number : INTEGER
DECLARE Ch : CHAR

OUTPUT "Enter a number as text:"
INPUT NumText

IF IS_NUM(NumText) = TRUE THEN
    Number <- STRING_TO_NUM(NumText)
    OUTPUT "Number value: ", Number
    OUTPUT "Double: ", Number * 2
ELSE
    OUTPUT "Not a valid number"
ENDIF

OUTPUT ""
OUTPUT "Enter a character:"
INPUT Ch
OUTPUT "ASCII code: ", ASC(Ch)
OUTPUT "Character from code 65: ", CHR(65)`,
  },

  // Complete Programs
  {
    title: 'Student Grade Manager',
    category: 'Complete Programs',
    code: `DECLARE Names : ARRAY[1:5] OF STRING
DECLARE Scores : ARRAY[1:5] OF INTEGER
DECLARE i : INTEGER
DECLARE Total : INTEGER
DECLARE Average : REAL

OUTPUT "=== Student Grade Manager ==="
OUTPUT ""

// Input
FOR i <- 1 TO 5
    OUTPUT "Student ", i, " name:"
    INPUT Names[i]
    OUTPUT "Student ", i, " score:"
    INPUT Scores[i]
NEXT i

// Calculate average
Total <- 0
FOR i <- 1 TO 5
    Total <- Total + Scores[i]
NEXT i
Average <- Total / 5.0

// Display results
OUTPUT ""
OUTPUT "=== Results ==="
FOR i <- 1 TO 5
    OUTPUT Names[i], ": ", Scores[i]
NEXT i

OUTPUT ""
OUTPUT "Class average: ", ROUND(Average, 2)`,
  },
  {
    title: 'Simple Calculator',
    category: 'Complete Programs',
    code: `DECLARE Num1 : REAL
DECLARE Num2 : REAL
DECLARE Op : CHAR
DECLARE Result : REAL

OUTPUT "Enter first number:"
INPUT Num1

OUTPUT "Enter operator (+, -, *, /):"
INPUT Op

OUTPUT "Enter second number:"
INPUT Num2

CASE OF Op
    '+' :
        Result <- Num1 + Num2
    '-' :
        Result <- Num1 - Num2
    '*' :
        Result <- Num1 * Num2
    '/' :
        IF Num2 = 0 THEN
            OUTPUT "Error: Division by zero"
        ELSE
            Result <- Num1 / Num2
        ENDIF
    OTHERWISE:
        OUTPUT "Invalid operator"
ENDCASE

IF Op = '+' OR Op = '-' OR Op = '*' OR (Op = '/' AND Num2 <> 0) THEN
    OUTPUT Num1, " ", Op, " ", Num2, " = ", Result
ENDIF`,
  },

  // Algorithms - Searching
  {
    title: 'Linear Search',
    category: 'Algorithms',
    code: `DECLARE Numbers : ARRAY[1:10] OF INTEGER
DECLARE i : INTEGER
DECLARE Target : INTEGER
DECLARE Found : BOOLEAN
DECLARE Position : INTEGER

// Initialize array
Numbers[1] <- 34
Numbers[2] <- 78
Numbers[3] <- 12
Numbers[4] <- 56
Numbers[5] <- 90
Numbers[6] <- 23
Numbers[7] <- 45
Numbers[8] <- 67
Numbers[9] <- 89
Numbers[10] <- 11

OUTPUT "Array contents:"
FOR i <- 1 TO 10
    OUTPUT Numbers[i], " "
NEXT i

OUTPUT ""
OUTPUT "Enter number to search:"
INPUT Target

Found <- FALSE
Position <- -1

FOR i <- 1 TO 10
    IF Numbers[i] = Target THEN
        Found <- TRUE
        Position <- i
    ENDIF
NEXT i

IF Found = TRUE THEN
    OUTPUT "Found at position ", Position
ELSE
    OUTPUT "Not found"
ENDIF`,
  },
  {
    title: 'Binary Search',
    category: 'Algorithms',
    code: `DECLARE Numbers : ARRAY[1:10] OF INTEGER
DECLARE Target : INTEGER
DECLARE Low : INTEGER
DECLARE High : INTEGER
DECLARE Mid : INTEGER
DECLARE Found : BOOLEAN
DECLARE i : INTEGER

// Sorted array required for binary search
Numbers[1] <- 11
Numbers[2] <- 23
Numbers[3] <- 34
Numbers[4] <- 45
Numbers[5] <- 56
Numbers[6] <- 67
Numbers[7] <- 78
Numbers[8] <- 89
Numbers[9] <- 90
Numbers[10] <- 95

OUTPUT "Sorted array:"
FOR i <- 1 TO 10
    OUTPUT Numbers[i], " "
NEXT i

OUTPUT ""
OUTPUT "Enter number to search:"
INPUT Target

Low <- 1
High <- 10
Found <- FALSE

WHILE Low <= High AND Found = FALSE DO
    Mid <- INT((Low + High) / 2)
    
    IF Numbers[Mid] = Target THEN
        Found <- TRUE
        OUTPUT "Found at position ", Mid
    ELSEIF Numbers[Mid] < Target THEN
        Low <- Mid + 1
    ELSE
        High <- Mid - 1
    ENDIF
ENDWHILE

IF Found = FALSE THEN
    OUTPUT "Not found"
ENDIF`,
  },

  // Algorithms - Sorting
  {
    title: 'Bubble Sort',
    category: 'Algorithms',
    code: `DECLARE Numbers : ARRAY[1:8] OF INTEGER
DECLARE i : INTEGER
DECLARE j : INTEGER
DECLARE Temp : INTEGER
DECLARE Swapped : BOOLEAN

// Initialize unsorted array
Numbers[1] <- 64
Numbers[2] <- 34
Numbers[3] <- 25
Numbers[4] <- 12
Numbers[5] <- 22
Numbers[6] <- 11
Numbers[7] <- 90
Numbers[8] <- 88

OUTPUT "Before sorting:"
FOR i <- 1 TO 8
    OUTPUT Numbers[i], " "
NEXT i

// Bubble Sort algorithm
FOR i <- 1 TO 7
    Swapped <- FALSE
    FOR j <- 1 TO 8 - i
        IF Numbers[j] > Numbers[j + 1] THEN
            // Swap
            Temp <- Numbers[j]
            Numbers[j] <- Numbers[j + 1]
            Numbers[j + 1] <- Temp
            Swapped <- TRUE
        ENDIF
    NEXT j
    
    // Early exit if no swaps
    IF Swapped = FALSE THEN
        i <- 7
    ENDIF
NEXT i

OUTPUT ""
OUTPUT "After sorting:"
FOR i <- 1 TO 8
    OUTPUT Numbers[i], " "
NEXT i`,
  },
  {
    title: 'Selection Sort',
    category: 'Algorithms',
    code: `DECLARE Numbers : ARRAY[1:8] OF INTEGER
DECLARE i : INTEGER
DECLARE j : INTEGER
DECLARE MinIndex : INTEGER
DECLARE Temp : INTEGER

// Initialize unsorted array
Numbers[1] <- 64
Numbers[2] <- 25
Numbers[3] <- 12
Numbers[4] <- 22
Numbers[5] <- 11
Numbers[6] <- 90
Numbers[7] <- 88
Numbers[8] <- 34

OUTPUT "Before sorting:"
FOR i <- 1 TO 8
    OUTPUT Numbers[i], " "
NEXT i

// Selection Sort algorithm
FOR i <- 1 TO 7
    MinIndex <- i
    
    // Find minimum in unsorted portion
    FOR j <- i + 1 TO 8
        IF Numbers[j] < Numbers[MinIndex] THEN
            MinIndex <- j
        ENDIF
    NEXT j
    
    // Swap if needed
    IF MinIndex <> i THEN
        Temp <- Numbers[i]
        Numbers[i] <- Numbers[MinIndex]
        Numbers[MinIndex] <- Temp
    ENDIF
NEXT i

OUTPUT ""
OUTPUT "After sorting:"
FOR i <- 1 TO 8
    OUTPUT Numbers[i], " "
NEXT i`,
  },
  {
    title: 'Insertion Sort',
    category: 'Algorithms',
    code: `DECLARE Numbers : ARRAY[1:8] OF INTEGER
DECLARE i : INTEGER
DECLARE j : INTEGER
DECLARE Key : INTEGER

// Initialize unsorted array
Numbers[1] <- 64
Numbers[2] <- 25
Numbers[3] <- 12
Numbers[4] <- 22
Numbers[5] <- 11
Numbers[6] <- 90
Numbers[7] <- 88
Numbers[8] <- 34

OUTPUT "Before sorting:"
FOR i <- 1 TO 8
    OUTPUT Numbers[i], " "
NEXT i

// Insertion Sort algorithm
FOR i <- 2 TO 8
    Key <- Numbers[i]
    j <- i - 1
    
    WHILE j >= 1 AND Numbers[j] > Key DO
        Numbers[j + 1] <- Numbers[j]
        j <- j - 1
    ENDWHILE
    
    Numbers[j + 1] <- Key
NEXT i

OUTPUT ""
OUTPUT "After sorting:"
FOR i <- 1 TO 8
    OUTPUT Numbers[i], " "
NEXT i`,
  },

  // Algorithms - Number Theory
  {
    title: 'Prime Number Checker',
    category: 'Algorithms',
    code: `DECLARE Number : INTEGER
DECLARE i : INTEGER
DECLARE IsPrime : BOOLEAN

OUTPUT "Enter a number:"
INPUT Number

IF Number < 2 THEN
    OUTPUT Number, " is not a prime number"
ELSE
    IsPrime <- TRUE
    
    FOR i <- 2 TO INT(Number / 2)
        IF MOD(Number, i) = 0 THEN
            IsPrime <- FALSE
        ENDIF
    NEXT i
    
    IF IsPrime = TRUE THEN
        OUTPUT Number, " is a prime number"
    ELSE
        OUTPUT Number, " is not a prime number"
    ENDIF
ENDIF`,
  },
  {
    title: 'Prime Numbers in Range',
    category: 'Algorithms',
    code: `DECLARE Start : INTEGER
DECLARE Finish : INTEGER
DECLARE Number : INTEGER
DECLARE i : INTEGER
DECLARE IsPrime : BOOLEAN
DECLARE Count : INTEGER

OUTPUT "Enter start of range:"
INPUT Start
OUTPUT "Enter end of range:"
INPUT Finish

OUTPUT "Prime numbers between ", Start, " and ", Finish, ":"
Count <- 0

FOR Number <- Start TO Finish
    IF Number >= 2 THEN
        IsPrime <- TRUE
        
        FOR i <- 2 TO INT(Number / 2)
            IF MOD(Number, i) = 0 THEN
                IsPrime <- FALSE
            ENDIF
        NEXT i
        
        IF IsPrime = TRUE THEN
            OUTPUT Number, " "
            Count <- Count + 1
        ENDIF
    ENDIF
NEXT Number

OUTPUT ""
OUTPUT "Total: ", Count, " prime numbers"`,
  },
  {
    title: 'Fibonacci Sequence',
    category: 'Algorithms',
    code: `DECLARE N : INTEGER
DECLARE First : INTEGER
DECLARE Second : INTEGER
DECLARE NextTerm : INTEGER
DECLARE i : INTEGER

OUTPUT "How many Fibonacci numbers?"
INPUT N

OUTPUT "Fibonacci sequence:"

First <- 0
Second <- 1

IF N >= 1 THEN
    OUTPUT First, " "
ENDIF

IF N >= 2 THEN
    OUTPUT Second, " "
ENDIF

FOR i <- 3 TO N
    NextTerm <- First + Second
    OUTPUT NextTerm, " "
    First <- Second
    Second <- NextTerm
NEXT i`,
  },
  {
    title: 'Greatest Common Divisor (GCD)',
    category: 'Algorithms',
    code: `DECLARE A : INTEGER
DECLARE B : INTEGER
DECLARE Temp : INTEGER

OUTPUT "Enter first number:"
INPUT A
OUTPUT "Enter second number:"
INPUT B

// Euclidean algorithm
WHILE B <> 0 DO
    Temp <- B
    B <- MOD(A, B)
    A <- Temp
ENDWHILE

OUTPUT "GCD: ", A`,
  },
  {
    title: 'Factorial (Iterative)',
    category: 'Algorithms',
    code: `DECLARE Number : INTEGER
DECLARE Factorial : INTEGER
DECLARE i : INTEGER

OUTPUT "Enter a number:"
INPUT Number

IF Number < 0 THEN
    OUTPUT "Factorial not defined for negative numbers"
ELSE
    Factorial <- 1
    
    FOR i <- 1 TO Number
        Factorial <- Factorial * i
    NEXT i
    
    OUTPUT "Factorial of ", Number, " is ", Factorial
ENDIF`,
  },

  // Algorithms - String Processing
  {
    title: 'Palindrome Checker',
    category: 'Algorithms',
    code: `DECLARE Text : STRING
DECLARE Reversed : STRING
DECLARE i : INTEGER
DECLARE Len : INTEGER

OUTPUT "Enter a word:"
INPUT Text

Len <- LENGTH(Text)
Reversed <- ""

FOR i <- Len TO 1 STEP -1
    Reversed <- Reversed & SUBSTRING(Text, i, 1)
NEXT i

OUTPUT "Original: ", Text
OUTPUT "Reversed: ", Reversed

IF LCASE(Text) = LCASE(Reversed) THEN
    OUTPUT "It is a palindrome!"
ELSE
    OUTPUT "Not a palindrome"
ENDIF`,
  },
  {
    title: 'Count Vowels in String',
    category: 'Algorithms',
    code: `DECLARE Text : STRING
DECLARE i : INTEGER
DECLARE Ch : CHAR
DECLARE VowelCount : INTEGER
DECLARE Len : INTEGER

OUTPUT "Enter a sentence:"
INPUT Text

VowelCount <- 0
Len <- LENGTH(Text)

FOR i <- 1 TO Len
    Ch <- LCASE(SUBSTRING(Text, i, 1))
    
    IF Ch = 'a' OR Ch = 'e' OR Ch = 'i' OR Ch = 'o' OR Ch = 'u' THEN
        VowelCount <- VowelCount + 1
    ENDIF
NEXT i

OUTPUT "Number of vowels: ", VowelCount`,
  },
  {
    title: 'Reverse Words in String',
    category: 'Algorithms',
    code: `DECLARE Text : STRING
DECLARE Result : STRING
DECLARE CurrentWord : STRING
DECLARE i : INTEGER
DECLARE Ch : STRING
DECLARE Len : INTEGER

OUTPUT "Enter a sentence:"
INPUT Text

Result <- ""
CurrentWord <- ""
Len <- LENGTH(Text)

FOR i <- Len TO 1 STEP -1
    Ch <- SUBSTRING(Text, i, 1)
    
    IF Ch = " " THEN
        IF LENGTH(CurrentWord) > 0 THEN
            Result <- Result & CurrentWord & " "
            CurrentWord <- ""
        ENDIF
    ELSE
        CurrentWord <- Ch & CurrentWord
    ENDIF
NEXT i

// Add last word
IF LENGTH(CurrentWord) > 0 THEN
    Result <- Result & CurrentWord
ENDIF

OUTPUT "Original: ", Text
OUTPUT "Reversed words: ", Result`,
  },

  // Algorithms - Array Operations
  {
    title: 'Find Second Largest',
    category: 'Algorithms',
    code: `DECLARE Numbers : ARRAY[1:8] OF INTEGER
DECLARE i : INTEGER
DECLARE Largest : INTEGER
DECLARE SecondLargest : INTEGER

// Initialize array
Numbers[1] <- 45
Numbers[2] <- 23
Numbers[3] <- 89
Numbers[4] <- 12
Numbers[5] <- 67
Numbers[6] <- 34
Numbers[7] <- 78
Numbers[8] <- 56

OUTPUT "Array:"
FOR i <- 1 TO 8
    OUTPUT Numbers[i], " "
NEXT i

Largest <- Numbers[1]
SecondLargest <- Numbers[1]

FOR i <- 2 TO 8
    IF Numbers[i] > Largest THEN
        SecondLargest <- Largest
        Largest <- Numbers[i]
    ELSEIF Numbers[i] > SecondLargest AND Numbers[i] <> Largest THEN
        SecondLargest <- Numbers[i]
    ENDIF
NEXT i

OUTPUT ""
OUTPUT "Largest: ", Largest
OUTPUT "Second Largest: ", SecondLargest`,
  },
  {
    title: 'Remove Duplicates from Array',
    category: 'Algorithms',
    code: `DECLARE Numbers : ARRAY[1:10] OF INTEGER
DECLARE Unique : ARRAY[1:10] OF INTEGER
DECLARE i : INTEGER
DECLARE j : INTEGER
DECLARE UniqueCount : INTEGER
DECLARE IsDuplicate : BOOLEAN

// Initialize array with duplicates
Numbers[1] <- 5
Numbers[2] <- 3
Numbers[3] <- 5
Numbers[4] <- 7
Numbers[5] <- 3
Numbers[6] <- 9
Numbers[7] <- 7
Numbers[8] <- 5
Numbers[9] <- 2
Numbers[10] <- 9

OUTPUT "Original array:"
FOR i <- 1 TO 10
    OUTPUT Numbers[i], " "
NEXT i

UniqueCount <- 0

FOR i <- 1 TO 10
    IsDuplicate <- FALSE
    
    // Check if already in unique array
    FOR j <- 1 TO UniqueCount
        IF Numbers[i] = Unique[j] THEN
            IsDuplicate <- TRUE
        ENDIF
    NEXT j
    
    // Add if not duplicate
    IF IsDuplicate = FALSE THEN
        UniqueCount <- UniqueCount + 1
        Unique[UniqueCount] <- Numbers[i]
    ENDIF
NEXT i

OUTPUT ""
OUTPUT "Unique values:"
FOR i <- 1 TO UniqueCount
    OUTPUT Unique[i], " "
NEXT i`,
  },
  {
    title: 'Merge Two Sorted Arrays',
    category: 'Algorithms',
    code: `DECLARE Array1 : ARRAY[1:5] OF INTEGER
DECLARE Array2 : ARRAY[1:5] OF INTEGER
DECLARE Merged : ARRAY[1:10] OF INTEGER
DECLARE i : INTEGER
DECLARE j : INTEGER
DECLARE k : INTEGER

// Initialize sorted arrays
Array1[1] <- 1
Array1[2] <- 3
Array1[3] <- 5
Array1[4] <- 7
Array1[5] <- 9

Array2[1] <- 2
Array2[2] <- 4
Array2[3] <- 6
Array2[4] <- 8
Array2[5] <- 10

OUTPUT "Array 1:"
FOR i <- 1 TO 5
    OUTPUT Array1[i], " "
NEXT i

OUTPUT ""
OUTPUT "Array 2:"
FOR i <- 1 TO 5
    OUTPUT Array2[i], " "
NEXT i

// Merge arrays
i <- 1
j <- 1
k <- 1

WHILE i <= 5 AND j <= 5 DO
    IF Array1[i] <= Array2[j] THEN
        Merged[k] <- Array1[i]
        i <- i + 1
    ELSE
        Merged[k] <- Array2[j]
        j <- j + 1
    ENDIF
    k <- k + 1
ENDWHILE

// Copy remaining elements
WHILE i <= 5 DO
    Merged[k] <- Array1[i]
    i <- i + 1
    k <- k + 1
ENDWHILE

WHILE j <= 5 DO
    Merged[k] <- Array2[j]
    j <- j + 1
    k <- k + 1
ENDWHILE

OUTPUT ""
OUTPUT "Merged array:"
FOR i <- 1 TO 10
    OUTPUT Merged[i], " "
NEXT i`,
  },

  // AS & A Level (9618)
  {
    title: 'Records (TYPE ... ENDTYPE)',
    category: 'AS & A Level (9618)',
    code: `// A record groups related data under one identifier
TYPE StudentRecord
    DECLARE LastName : STRING
    DECLARE FirstName : STRING
    DECLARE YearGroup : INTEGER
    DECLARE FormGroup : CHAR
ENDTYPE

DECLARE Pupil1 : StudentRecord
DECLARE Pupil2 : StudentRecord

Pupil1.LastName <- "Johnson"
Pupil1.FirstName <- "Leroy"
Pupil1.YearGroup <- 6
Pupil1.FormGroup <- 'A'

// Records are copied by value
Pupil2 <- Pupil1
Pupil2.FirstName <- "Leona"

OUTPUT Pupil1.FirstName, " ", Pupil1.LastName, " (", Pupil1.YearGroup, Pupil1.FormGroup, ")"
OUTPUT Pupil2.FirstName, " ", Pupil2.LastName, " (", Pupil2.YearGroup, Pupil2.FormGroup, ")"`,
  },
  {
    title: 'Enumerated Types & Pointers',
    category: 'AS & A Level (9618)',
    code: `// Enumerated type: a fixed list of named values
TYPE Season = (Spring, Summer, Autumn, Winter)

// Pointer type: holds the address of another variable
TYPE TSeasonPointer = ^Season

DECLARE ThisSeason : Season
DECLARE NextSeason : Season
DECLARE MyPointer : TSeasonPointer

ThisSeason <- Spring
MyPointer <- ^ThisSeason       // ^ takes the address of ThisSeason

// MyPointer^ reads the value at the address; + 1 moves to the next enum value
NextSeason <- MyPointer^ + 1

OUTPUT "This season: ", ThisSeason
OUTPUT "Next season: ", NextSeason

// Writing through the pointer changes ThisSeason itself
MyPointer^ <- Winter
OUTPUT "Now: ", ThisSeason`,
  },
  {
    title: 'BYREF and BYVAL Parameters',
    category: 'AS & A Level (9618)',
    code: `// BYREF passes a reference: the procedure changes the caller's variables.
// BYREF applies to the following parameters too, until BYVAL appears.
PROCEDURE SWAP(BYREF X : INTEGER, Y : INTEGER)
    DECLARE Temp : INTEGER
    Temp <- X
    X <- Y
    Y <- Temp
ENDPROCEDURE

DECLARE a : INTEGER
DECLARE b : INTEGER
a <- 1
b <- 2

OUTPUT "Before: a = ", a, ", b = ", b
CALL SWAP(a, b)
OUTPUT "After:  a = ", a, ", b = ", b`,
  },
  {
    title: 'CASE with Ranges',
    category: 'AS & A Level (9618)',
    code: `DECLARE Mark : INTEGER
OUTPUT "Enter a mark (0-100):"
INPUT Mark

CASE OF Mark
    80 TO 100 : OUTPUT "Grade A"
    60 TO 79  : OUTPUT "Grade B"
    40 TO 59  : OUTPUT "Grade C"
    OTHERWISE : OUTPUT "Ungraded"
ENDCASE`,
  },
  {
    title: 'Random-Access Files',
    category: 'AS & A Level (9618)',
    code: `// Random files store fixed records at numbered positions
TYPE Student
    DECLARE Name : STRING
    DECLARE YearGroup : INTEGER
ENDTYPE

DECLARE Pupil : Student
DECLARE Found : Student

Pupil.Name <- "Leroy Johnson"
Pupil.YearGroup <- 6

OPENFILE "StudentFile.dat" FOR RANDOM
SEEK "StudentFile.dat", 10            // move the file pointer to position 10
PUTRECORD "StudentFile.dat", Pupil    // write the record there
CLOSEFILE "StudentFile.dat"

OPENFILE "StudentFile.dat" FOR RANDOM
SEEK "StudentFile.dat", 10
GETRECORD "StudentFile.dat", Found    // read the record back
CLOSEFILE "StudentFile.dat"

OUTPUT "Found: ", Found.Name, " (Year ", Found.YearGroup, ")"`,
  },
  {
    title: 'Classes & Inheritance (OOP)',
    category: 'AS & A Level (9618)',
    code: `CLASS Pet
    PRIVATE Name : STRING

    PUBLIC PROCEDURE NEW(GivenName : STRING)
        Name <- GivenName
    ENDPROCEDURE

    PUBLIC FUNCTION GetName() RETURNS STRING
        RETURN Name
    ENDFUNCTION
ENDCLASS

CLASS Cat INHERITS Pet
    PRIVATE Breed : STRING

    PUBLIC PROCEDURE NEW(GivenName : STRING, GivenBreed : STRING)
        SUPER.NEW(GivenName)          // call the parent constructor
        Breed <- GivenBreed
    ENDPROCEDURE

    PUBLIC FUNCTION Describe() RETURNS STRING
        RETURN GetName() & " is a " & Breed & " cat"
    ENDFUNCTION
ENDCLASS

MyCat <- NEW Cat("Kitty", "Shorthaired")
OUTPUT MyCat.Describe()`,
  },
  {
    title: 'May/June 2024 Paper 41 - Sort and Search',
    category: 'AS & A Level (9618)',
    code: `DECLARE DataStored : ARRAY[0:19] OF INTEGER
DECLARE NumberItems : INTEGER

PROCEDURE Initialise()
    DECLARE Count : INTEGER
    REPEAT
        OUTPUT "How many numbers will you enter?"
        INPUT NumberItems
    UNTIL NumberItems > 0 AND NumberItems < 21

    FOR Count <- 0 TO NumberItems - 1
        OUTPUT "Enter number"
        INPUT DataStored[Count]
    NEXT Count
ENDPROCEDURE

PROCEDURE BubbleSort()
    DECLARE Count, Count2, Temp : INTEGER
    FOR Count <- 0 TO NumberItems - 2
        FOR Count2 <- 0 TO NumberItems - Count - 2
            IF DataStored[Count2] > DataStored[Count2 + 1] THEN
                Temp <- DataStored[Count2]
                DataStored[Count2] <- DataStored[Count2 + 1]
                DataStored[Count2 + 1] <- Temp
            ENDIF
        NEXT Count2
    NEXT Count
ENDPROCEDURE

FUNCTION BinarySearch(DataToFind : INTEGER) RETURNS INTEGER
    DECLARE First, Last, MidValue : INTEGER
    First <- 0
    Last <- NumberItems - 1

    WHILE First <= Last DO
        MidValue <- DIV(First + Last, 2)
        IF DataStored[MidValue] = DataToFind THEN
            RETURN MidValue
        ELSE
            IF DataToFind < DataStored[MidValue] THEN
                Last <- MidValue - 1
            ELSE
                First <- MidValue + 1
            ENDIF
        ENDIF
    ENDWHILE

    RETURN -1
ENDFUNCTION

CALL Initialise()
CALL BubbleSort()
OUTPUT "Index: ", BinarySearch(7)`,
  },
  {
    title: 'May/June 2024 Paper 41 - Tree Class',
    category: 'AS & A Level (9618)',
    code: `CLASS Tree
    PRIVATE TreeName : STRING
    PRIVATE HeightGrowth : INTEGER
    PRIVATE MaxHeight : INTEGER
    PRIVATE MaxWidth : INTEGER
    PRIVATE Evergreen : STRING

    PUBLIC PROCEDURE NEW(Name : STRING, HGrowth : INTEGER, MaxH : INTEGER, MaxW : INTEGER, PEvergreen : STRING)
        TreeName <- Name
        HeightGrowth <- HGrowth
        MaxHeight <- MaxH
        MaxWidth <- MaxW
        Evergreen <- PEvergreen
    ENDPROCEDURE

    PUBLIC FUNCTION GetTreeName() RETURNS STRING
        RETURN TreeName
    ENDFUNCTION

    PUBLIC FUNCTION GetGrowth() RETURNS INTEGER
        RETURN HeightGrowth
    ENDFUNCTION

    PUBLIC FUNCTION GetMaxHeight() RETURNS INTEGER
        RETURN MaxHeight
    ENDFUNCTION

    PUBLIC FUNCTION GetMaxWidth() RETURNS INTEGER
        RETURN MaxWidth
    ENDFUNCTION

    PUBLIC FUNCTION GetEvergreen() RETURNS STRING
        RETURN Evergreen
    ENDFUNCTION
ENDCLASS

PROCEDURE PrintTree(Item : Tree)
    DECLARE Final : STRING
    Final <- "does not lose its leaves"
    IF Item.GetEvergreen() = "No" THEN
        Final <- "loses its leaves each year"
    ENDIF

    OUTPUT Item.GetTreeName(), " has a maximum height ", Item.GetMaxHeight(), " a maximum width ", Item.GetMaxWidth(), " and grows ", Item.GetGrowth(), " cm a year. It ", Final
ENDPROCEDURE

Oak <- NEW Tree("Oak", 30, 20, 12, "No")
CALL PrintTree(Oak)`,
  },
  {
    title: 'May/June 2024 Paper 41 - Linear Queue',
    category: 'AS & A Level (9618)',
    code: `DECLARE QueueData : ARRAY[0:19] OF STRING
DECLARE QueueHead : INTEGER
DECLARE QueueTail : INTEGER

QueueHead <- -1
QueueTail <- -1

FUNCTION Enqueue(DataToInsert : STRING) RETURNS BOOLEAN
    IF QueueTail = 19 THEN
        RETURN FALSE
    ENDIF

    IF QueueHead = -1 THEN
        QueueHead <- 0
    ENDIF

    QueueTail <- QueueTail + 1
    QueueData[QueueTail] <- DataToInsert
    RETURN TRUE
ENDFUNCTION

FUNCTION Dequeue() RETURNS STRING
    DECLARE Item : STRING
    IF QueueHead = -1 OR QueueHead > QueueTail THEN
        RETURN "false"
    ENDIF

    Item <- QueueData[QueueHead]
    QueueHead <- QueueHead + 1
    RETURN Item
ENDFUNCTION

OUTPUT Enqueue("Oak")
OUTPUT Enqueue("Pine")
OUTPUT Dequeue()
OUTPUT Dequeue()
OUTPUT Dequeue()`,
  },
  {
    title: 'May/June 2024 Paper 21 - Odd and Even Index Totals',
    category: 'AS & A Level (9618)',
    code: `DECLARE Data : ARRAY[1:10] OF INTEGER

FUNCTION Check() RETURNS STRING
    DECLARE Odd, Even, Index : INTEGER
    Odd <- 0
    Even <- 0

    FOR Index <- 1 TO 10
        IF MOD(Index, 2) = 0 THEN
            Even <- Even + Data[Index]
        ELSE
            Odd <- Odd + Data[Index]
        ENDIF
    NEXT Index

    IF Odd > Even THEN
        RETURN "Odd"
    ELSE
        IF Even > Odd THEN
            RETURN "Even"
        ELSE
            RETURN "Same"
        ENDIF
    ENDIF
ENDFUNCTION`,
  },
  {
    title: 'May/June 2024 Paper 21 - Right-Angled Triangle',
    category: 'AS & A Level (9618)',
    code: `FUNCTION ISRA(x1 : INTEGER, y1 : INTEGER, x2 : INTEGER, y2 : INTEGER, x3 : INTEGER, y3 : INTEGER) RETURNS BOOLEAN
    DECLARE Len1, Len2, Len3 : INTEGER
    Len1 <- (x1 - x2)^2 + (y1 - y2)^2
    Len2 <- (x1 - x3)^2 + (y1 - y3)^2
    Len3 <- (x2 - x3)^2 + (y2 - y3)^2

    IF (Len1 = Len2 + Len3) OR (Len2 = Len1 + Len3) OR (Len3 = Len1 + Len2) THEN
        RETURN TRUE
    ELSE
        RETURN FALSE
    ENDIF
ENDFUNCTION

OUTPUT ISRA(0, 0, 3, 0, 0, 4)`,
  },
  {
    title: 'May/June 2024 Paper 21 - Remove Comments from a File',
    category: 'AS & A Level (9618)',
    code: `FUNCTION DeleteComment(Line : STRING) RETURNS STRING
    DECLARE NewLine, TwoChars : STRING
    DECLARE Count, TrimTo : INTEGER
    CONSTANT Comment <- "//"

    NewLine <- Line
    TrimTo <- 0
    Count <- 1

    WHILE Count < LENGTH(Line) AND TrimTo = 0 DO
        TwoChars <- MID(Line, Count, 2)
        IF TwoChars = Comment THEN
            TrimTo <- Count
        ENDIF
        Count <- Count + 1
    ENDWHILE

    IF TrimTo <> 0 THEN
        NewLine <- LEFT(Line, TrimTo - 1)
    ENDIF

    RETURN NewLine
ENDFUNCTION

FUNCTION Stage_1(StudentName : STRING) RETURNS INTEGER
    DECLARE OldFile, NewFile, Line : STRING
    DECLARE Count : INTEGER

    OldFile <- StudentName & "_src.txt"
    NewFile <- StudentName & "_S1.txt"
    OPENFILE OldFile FOR READ
    OPENFILE NewFile FOR WRITE

    Count <- 0
    WHILE NOT EOF(OldFile) DO
        READFILE OldFile, Line
        Line <- DeleteComment(Line)
        IF LENGTH(Line) <> 0 THEN
            WRITEFILE NewFile, Line
            Count <- Count + 1
        ENDIF
    ENDWHILE

    CLOSEFILE OldFile
    CLOSEFILE NewFile
    RETURN Count
ENDFUNCTION`,
  },
];
