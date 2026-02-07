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
];
