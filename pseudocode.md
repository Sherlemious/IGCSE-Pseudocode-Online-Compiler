# IGCSE Computer Science 0478 Pseudocode Language Guide

This guide documents the pseudocode language supported by the compiler, based on the Cambridge IGCSE Computer Science 0478 syllabus specification.

## General Style Conventions

- **Keywords** are in UPPERCASE (e.g., `IF`, `REPEAT`, `PROCEDURE`)
- **Identifiers** use PascalCase (e.g., `NumberOfPlayers`, `StudentName`)
- **Comments** start with `//`
- **Indentation** is recommended (4 spaces) but not enforced
- The language is **case-insensitive** for keywords

## Basic Data Types

| Type | Description | Example Literals |
|------|-------------|------------------|
| `INTEGER` | Whole number | `5`, `-3` |
| `REAL` | Decimal number | `4.7`, `0.3`, `-4.0` |
| `CHAR` | Single character | `'x'`, `'@'` |
| `STRING` | Sequence of characters | `"Hello"`, `""` |
| `BOOLEAN` | Logical value | `TRUE`, `FALSE` |

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
DECLARE StudentName : STRING
```

### Declaring Constants
```
CONSTANT <identifier> <- <value>
```

Example:
```
CONSTANT HourlyRate <- 6.50
CONSTANT DefaultText <- "N/A"
```

Only literals can be used as constant values.

## Assignment

Assignment uses the `<-` operator (or `=`):
```
<identifier> <- <value>
```

Example:
```
Counter <- 0
Counter <- Counter + 1
TotalToPay <- NumberOfHours * HourlyRate
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
StudentNames[1] <- "Ali"
NoughtsAndCrosses[2,3] <- 'X'
StudentNames[n+1] <- StudentNames[n]
```

## Input and Output

### Input
```
INPUT <identifier>
```

### Output
```
OUTPUT <value(s)>
```

Multiple values can be output in one statement, separated by commas. `PRINT` is also accepted as an alias for `OUTPUT`.

Example:
```
INPUT Answer
OUTPUT "You have ", Lives, " lives left"
```

## Operators

### Arithmetic Operators

| Operator | Operation | Example |
|----------|-----------|---------|
| `+` | Addition | `5 + 3` |
| `-` | Subtraction | `5 - 3` |
| `*` | Multiplication | `5 * 3` |
| `/` | Division | `10 / 3` |
| `^` | Power | `2 ^ 3` |

### Integer Division

**DIV** returns the quotient (whole number part):
```
DIV(10, 3)    // returns 3
10 DIV 3      // also supported
```

**MOD** returns the remainder:
```
MOD(10, 3)    // returns 1
10 MOD 3      // also supported
```

### Comparison Operators

| Operator | Meaning |
|----------|---------|
| `=` | Equal to |
| `<>` | Not equal to |
| `<` | Less than |
| `>` | Greater than |
| `<=` | Less than or equal to |
| `>=` | Greater than or equal to |

### Logical Operators

| Operator | Operation |
|----------|-----------|
| `AND` | Logical AND |
| `OR` | Logical OR |
| `NOT` | Logical NOT |

### String Concatenation
Use `&` to concatenate strings:
```
FullName <- FirstName & " " & LastName
```

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

### IF-ELSEIF Statement
```
IF <condition> THEN
    <statements>
ELSEIF <condition> THEN
    <statements>
ELSE
    <statements>
ENDIF
```

### CASE Statement
```
CASE OF <identifier>
    <value1> :
        <statement>
    <value2> :
        <statement>
    OTHERWISE:
        <statement>
ENDCASE
```

Example:
```
CASE OF Move
    'W' :
        Position <- Position - 10
    'S' :
        Position <- Position + 10
    OTHERWISE:
        OUTPUT "Invalid move"
ENDCASE
```

## Iteration

### Count-controlled Loop (FOR)
```
FOR <identifier> <- <value1> TO <value2>
    <statements>
NEXT <identifier>
```

With step:
```
FOR <identifier> <- <value1> TO <value2> STEP <increment>
    <statements>
NEXT <identifier>
```

Example:
```
FOR Counter <- 1 TO 10
    OUTPUT Counter
NEXT Counter

FOR Index <- 10 TO 1 STEP -1
    OUTPUT Index
NEXT Index
```

### Post-condition Loop (REPEAT)
```
REPEAT
    <statements>
UNTIL <condition>
```

Executes at least once; tests condition after each iteration.

### Pre-condition Loop (WHILE)
```
WHILE <condition> DO
    <statements>
ENDWHILE
```

Tests condition before each iteration; may not execute at all.

## Procedures and Functions

### Procedure Declaration
```
PROCEDURE <identifier>(<param1>:<datatype>, <param2>:<datatype>...)
    <statements>
ENDPROCEDURE
```

### Calling Procedures
```
CALL <identifier>(value1, value2...)
```

### Function Declaration
```
FUNCTION <identifier>(<param1>:<datatype>, <param2>:<datatype>...) RETURNS <data type>
    <statements>
    RETURN <value>
ENDFUNCTION
```

### Calling Functions
Functions are called as part of expressions (not with `CALL`):
```
OUTPUT "Sum of squares = ", SumSquare(10, 20)
```

Example:
```
FUNCTION SumSquare(Number1:INTEGER, Number2:INTEGER) RETURNS INTEGER
    RETURN Number1 * Number1 + Number2 * Number2
ENDFUNCTION

OUTPUT SumSquare(3, 4)
```

## File Handling

Files are simulated using browser localStorage. Each file is stored as a key-value pair.

### Opening Files
```
OPENFILE <file identifier> FOR <file mode>
```

File modes:
- `READ` - open for reading
- `WRITE` - open for writing (creates new / overwrites existing)
- `APPEND` - open for appending to existing content

### Reading from Files
```
READFILE <file identifier>, <variable>
```

Reads one line at a time into the variable.

### Writing to Files
```
WRITEFILE <file identifier>, <variable>
```

Writes a line to the file.

### Closing Files
```
CLOSEFILE <file identifier>
```

Always close files when done. Written data is saved to localStorage on close.

### Checking End of File
```
EOF(<file identifier>)
```

Returns `TRUE` if there are no more lines to read.

### Example
```
// Writing to a file
OPENFILE "data.txt" FOR WRITE
WRITEFILE "data.txt", "Hello"
WRITEFILE "data.txt", "World"
CLOSEFILE "data.txt"

// Reading from a file
DECLARE LineOfText : STRING
OPENFILE "data.txt" FOR READ
WHILE NOT EOF("data.txt") DO
    READFILE "data.txt", LineOfText
    OUTPUT LineOfText
ENDWHILE
CLOSEFILE "data.txt"
```

## String Operations

| Function | Description | Example |
|----------|-------------|---------|
| `LENGTH(s)` | Returns the length of a string | `LENGTH("Hello")` returns `5` |
| `LCASE(s)` | Converts to lowercase | `LCASE("Hello")` returns `"hello"` |
| `UCASE(s)` | Converts to uppercase | `UCASE("Hello")` returns `"HELLO"` |
| `SUBSTRING(s, start, length)` | Extracts a substring (1-based) | `SUBSTRING("Hello", 1, 3)` returns `"Hel"` |
| `LEFT(s, length)` | Returns leftmost characters | `LEFT("Hello", 3)` returns `"Hel"` |
| `RIGHT(s, length)` | Returns rightmost characters | `RIGHT("Hello", 3)` returns `"llo"` |
| `MID(s, start, length)` | Same as SUBSTRING | `MID("Hello", 2, 3)` returns `"ell"` |

## Other Library Routines

| Function | Description | Example |
|----------|-------------|---------|
| `ROUND(n, places)` | Rounds to specified decimal places | `ROUND(3.14159, 2)` returns `3.14` |
| `RANDOM()` | Returns a random number between 0 and 1 | `RANDOM()` |
| `INT(n)` | Truncates to integer | `INT(3.7)` returns `3` |
| `DIV(a, b)` | Integer division | `DIV(10, 3)` returns `3` |
| `MOD(a, b)` | Remainder | `MOD(10, 3)` returns `1` |
| `ASC(c)` | Returns the ASCII code of a character | `ASC('A')` returns `65` |
| `CHR(n)` | Returns the character for an ASCII code | `CHR(65)` returns `'A'` |
| `NUM_TO_STRING(n)` | Converts number to string | `NUM_TO_STRING(42)` returns `"42"` |
| `STRING_TO_NUM(s)` | Converts string to number | `STRING_TO_NUM("42")` returns `42` |
| `IS_NUM(s)` | Checks if a string is numeric | `IS_NUM("42")` returns `TRUE` |
| `EOF(f)` | Checks if end of file reached | `EOF("data.txt")` |
