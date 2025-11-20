#!/usr/bin/env python3
"""
Test script to verify that all examples from examplePicker.tsx compile successfully
"""

import sys
import os

# Add the execution_engine directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'apps', 'api', 'execution_engine'))

from compiler import PseudocodeCompiler
from errors import CompilerError

# All examples from examplePicker.tsx
examples = [
    ("Hello World", '''OUTPUT "Hello, World!"'''),

    ("Variables and Assignment", '''DECLARE x : INTEGER
DECLARE y : INTEGER
x = 10
y = 20
OUTPUT "x = ", x
OUTPUT "y = ", y
OUTPUT "x + y = ", x + y'''),

    ("Constants", '''CONSTANT PI = 3.14159
DECLARE radius : REAL
radius = 5
area = PI * radius * radius
OUTPUT "Area of circle: ", area'''),

    ("Simple Input", '''DECLARE name : STRING
INPUT name
OUTPUT "Hello, ", name'''),

    ("Multiple Inputs", '''DECLARE length : REAL
DECLARE width : REAL
OUTPUT "Enter length: "
INPUT length
OUTPUT "Enter width: "
INPUT width
area = length * width
OUTPUT "Area = ", area'''),

    ("IF Statement", '''DECLARE age : INTEGER
INPUT age
IF age >= 18 THEN
    OUTPUT "You are an adult"
ELSE
    OUTPUT "You are a minor"
ENDIF'''),

    ("Nested IF", '''DECLARE score : INTEGER
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
ENDIF'''),

    ("FOR Loop", '''DECLARE i : INTEGER
FOR i = 1 TO 10
    OUTPUT i
NEXT i'''),

    ("FOR Loop with STEP", '''DECLARE i : INTEGER
FOR i = 0 TO 20 STEP 2
    OUTPUT i
NEXT i'''),

    ("WHILE Loop", '''DECLARE count : INTEGER
count = 1
WHILE count <= 5 DO
    OUTPUT count
    count = count + 1
ENDWHILE'''),

    ("REPEAT Loop", '''DECLARE num : INTEGER
num = 1
REPEAT
    OUTPUT num
    num = num + 1
UNTIL num > 5'''),

    ("Nested Loops", '''DECLARE i : INTEGER
DECLARE j : INTEGER
FOR i = 1 TO 3
    FOR j = 1 TO 3
        OUTPUT i, " x ", j, " = ", i * j
    NEXT j
NEXT i'''),

    ("1D Array", '''DECLARE numbers : ARRAY[1:5] OF INTEGER
DECLARE i : INTEGER
FOR i = 1 TO 5
    numbers[i] = i * 2
NEXT i
FOR i = 1 TO 5
    OUTPUT numbers[i]
NEXT i'''),

    ("2D Array", '''DECLARE matrix : ARRAY[1:3, 1:3] OF INTEGER
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
NEXT i'''),

    ("Find Maximum in Array", '''DECLARE numbers : ARRAY[1:5] OF INTEGER
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
OUTPUT "Maximum: ", max'''),

    ("Simple Procedure", '''PROCEDURE Greet()
    OUTPUT "Hello from procedure!"
ENDPROCEDURE

CALL Greet()'''),

    ("Procedure with Parameters", '''PROCEDURE PrintSum(a : INTEGER, b : INTEGER)
    DECLARE sum : INTEGER
    sum = a + b
    OUTPUT "Sum = ", sum
ENDPROCEDURE

CALL PrintSum(5, 3)
CALL PrintSum(10, 20)'''),

    ("Procedure with BYREF", '''PROCEDURE Swap(BYREF a : INTEGER, BYREF b : INTEGER)
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
OUTPUT "After: x=", x, ", y=", y'''),

    ("Simple Function", '''FUNCTION Square(n : INTEGER) RETURNS INTEGER
    RETURN n * n
ENDFUNCTION

DECLARE result : INTEGER
result = Square(5)
OUTPUT "5 squared = ", result'''),

    ("Function with Multiple Parameters", '''FUNCTION Add(a : INTEGER, b : INTEGER) RETURNS INTEGER
    RETURN a + b
ENDFUNCTION

DECLARE sum : INTEGER
sum = Add(10, 20)
OUTPUT "Sum = ", sum'''),

    ("Factorial Function", '''FUNCTION Factorial(n : INTEGER) RETURNS INTEGER
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
OUTPUT num, "! = ", fact'''),

    ("Is Prime Function", '''FUNCTION IsPrime(n : INTEGER) RETURNS BOOLEAN
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
ENDIF'''),

    ("String Operations", '''DECLARE text : STRING
text = "Hello"
OUTPUT "Length: ", LENGTH(text)
OUTPUT "Substring: ", SUBSTRING(text, 1, 3)'''),

    ("String Concatenation", '''DECLARE first : STRING
DECLARE last : STRING
DECLARE full : STRING
first = "John"
last = "Doe"
full = first + " " + last
OUTPUT "Full name: ", full'''),

    ("Calculate Average", '''DECLARE numbers : ARRAY[1:5] OF INTEGER
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
OUTPUT "Average = ", average'''),

    ("Number Guessing Game", '''DECLARE secret : INTEGER
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
OUTPUT "Correct! You got it in ", attempts, " attempts"'''),

    ("Bubble Sort", '''DECLARE arr : ARRAY[1:5] OF INTEGER
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
NEXT i'''),
]

def test_examples():
    """Test all examples to ensure they compile"""
    compiler = PseudocodeCompiler()

    passed = 0
    failed = 0
    errors = []

    print("Testing all examples from examplePicker.tsx...\n")
    print("=" * 70)

    for title, code in examples:
        try:
            result = compiler.compile(code)
            print(f"✓ {title:40s} - Compilation successful")
            passed += 1
        except CompilerError as e:
            print(f"✗ {title:40s} - Compilation failed")
            failed += 1
            errors.append((title, str(e)))
        except Exception as e:
            print(f"✗ {title:40s} - Unexpected error")
            failed += 1
            errors.append((title, f"Unexpected error: {str(e)}"))

    print("=" * 70)
    print(f"\nResults: {passed} passed, {failed} failed out of {len(examples)} total\n")

    if errors:
        print("Failed examples:")
        print("-" * 70)
        for title, error in errors:
            print(f"\n{title}:")
            print(f"  {error}")

    return failed == 0

if __name__ == "__main__":
    success = test_examples()
    sys.exit(0 if success else 1)
