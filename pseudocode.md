# IGCSE Computer Science 0478 Pseudocode Language Guide

This guide documents the pseudocode language used in the Cambridge IGCSE Computer Science 0478 course, based on the syllabus specification.

## General Style Conventions

- **Font**: Pseudocode is presented in Courier New
- **Indentation**: Lines are indented by 4 spaces within statements
- **Case**: Keywords are in UPPERCASE (e.g., IF, REPEAT, PROCEDURE)
- **Identifiers**: Variables and function names use Pascal case (e.g., NumberOfPlayers)

## Basic Data Types

- `INTEGER`: whole numbers
- `REAL`: numbers with decimal parts
- `CHAR`: single character (delimited by single quotes, e.g., 'x')
- `STRING`: sequence of characters (delimited by double quotes, e.g., "text")
- `BOOLEAN`: logical values TRUE or FALSE

## Variables and Constants

### Declaring Variables
```
DECLARE <identifier> : <data type>
```

Example:
```
DECLARE Counter : INTEGER
DECLARE TotalToPay : REAL
DECLARE GameOver : BOOLEAN
```

### Declaring Constants
```
CONSTANT <identifier> = <value>
```

Example:
```
CONSTANT HourlyRate = 6.50
CONSTANT DefaultText = "N/A"
```

## Assignment

Assignment uses the = operator (or ← in the syllabus):
```
<identifier> = <value>
```

Example:
```
Counter = 0
Counter = Counter + 1
TotalToPay = NumberOfHours * HourlyRate
```

## Arrays

### Declaring 1D Arrays
```
DECLARE <identifier> : ARRAY[<lower>:<upper>] OF <data type>
```

Example:
```
DECLARE StudentNames : ARRAY[1:30] OF STRING
```

### Declaring 2D Arrays
```
DECLARE <identifier> : ARRAY[<lower1>:<upper1>, <lower2>:<upper2>] OF <data type>
```

Example:
```
DECLARE NoughtsAndCrosses : ARRAY[1:3, 1:3] OF CHAR
```

### Using Arrays
```
StudentNames[1] = "Ali"
NoughtsAndCrosses[2,3] = 'X'
```

## Input and Output

### Input
```
INPUT <identifier>
```

For user input, you can also use:
```
X = UserInput
```

### Output
```
OUTPUT <value(s)>
```

For displaying output, you can also use:
```
PRINT x
```

Example:
```
INPUT Answer
OUTPUT "You have ", Lives, " lives left"
```

## Operators

### Arithmetic Operators
- `+` addition
- `-` subtraction
- `*` multiplication
- `/` division
- `^` power
- `MOD` modulus (remainder)
- `DIV` integer division

### Logical Operators
- `=` equal to
- `<` less than
- `<=` less than or equal to
- `>` greater than
- `>=` greater than or equal to
- `<>` not equal to

### Boolean Operators
- `AND` logical and
- `OR` logical or
- `NOT` logical negation

## Selection

### IF Statement
```
IF <condition> THEN
    <statements>
ENDIF
```

### IF-ELSE Statement
```
IF <condition> THEN
    <statements>
ELSE
    <statements>
ENDIF
```

### CASE Statement
```
CASE OF <identifier>
    <value 1> : <statement>
    <value 2> : <statement>
    ...
    OTHERWISE <statement>
ENDCASE
```

## Iteration

### Count-controlled Loop (FOR)
```
FOR <identifier> = <value1> TO <value2>
    <statements>
NEXT <identifier>
```

With increment:
```
FOR <identifier> = <value1> TO <value2> STEP <increment>
    <statements>
NEXT <identifier>
```

### Post-condition Loop (REPEAT)
```
REPEAT
    <statements>
UNTIL <condition>
```

### Pre-condition Loop (WHILE)
```
WHILE <condition> DO
    <statements>
ENDWHILE
```

## Procedures and Functions

### Procedure with No Parameters
```
PROCEDURE <identifier>
    <statements>
ENDPROCEDURE
```

### Procedure with Parameters
```
PROCEDURE <identifier>(<param1>:<datatype>, <param2>:<datatype>...)
    <statements>
ENDPROCEDURE
```

### Calling Procedures
```
CALL <identifier>
CALL <identifier>(value1, value2...)
```

### Function with No Parameters
```
FUNCTION <identifier> RETURNS <data type>
    <statements>
    RETURN <value>
ENDFUNCTION
```

### Function with Parameters
```
FUNCTION <identifier>(<param1>:<datatype>, <param2>:<datatype>...) RETURNS <data type>
    <statements>
    RETURN <value>
ENDFUNCTION
```

### Calling Functions
Functions are called as part of expressions:
```
OUTPUT "Sum of squares = ", SumSquare(10, 20)
```

## File Handling

### Opening Files
```
OPENFILE <file identifier> FOR <file mode>
```

File modes: `READ`, `WRITE`

### Reading from Files
```
READFILE <file identifier>, <variable>
```

### Writing to Files
```
WRITEFILE <file identifier>, <variable>
```

### Closing Files
```
CLOSEFILE <file identifier>
```

## String Operations

- `LENGTH(<string>)`: returns the length of a string
- `LCASE(<string>)`: converts to lowercase
- `UCASE(<string>)`: converts to uppercase
- `SUBSTRING(<string>, <start>, <length>)`: extracts part of a string

## Other Library Routines

- `ROUND(<number>, <places>)`: rounds a value to specified decimal places
- `RANDOM()`: returns a random number between 0 and 1
