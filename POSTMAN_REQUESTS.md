# IGCSE Pseudocode Compiler - Postman Test Requests

## API Endpoint
**Base URL**: `http://localhost:8000` (adjust port if needed)
**Endpoint**: `POST /execution/convert/`
**Content-Type**: `application/json`

## Request Format
```json
{
  "pseudocode": "YOUR_PSEUDOCODE_HERE"
}
```

## Response Formats

### Success Response (200 OK)
```json
{
  "success": true,
  "python_code": "# Generated Python code here..."
}
```

### Error Response (400 Bad Request)
```json
{
  "success": false,
  "error": "Error message",
  "suggestions": ["suggestion1", "suggestion2"],
  "line": 5,
  "column": 10
}
```

---

## Test Examples

### 1. Hello World (Basic)
```json
{
  "pseudocode": "OUTPUT \"Hello, World!\""
}
```

### 2. Variables and Assignment
```json
{
  "pseudocode": "DECLARE x : INTEGER\nDECLARE y : INTEGER\nx = 10\ny = 20\nOUTPUT \"x = \", x\nOUTPUT \"y = \", y\nOUTPUT \"x + y = \", x + y"
}
```

### 3. Constants
```json
{
  "pseudocode": "CONSTANT PI = 3.14159\nDECLARE radius : REAL\nradius = 5\narea = PI * radius * radius\nOUTPUT \"Area of circle: \", area"
}
```

### 4. Simple Input
```json
{
  "pseudocode": "DECLARE name : STRING\nINPUT name\nOUTPUT \"Hello, \", name"
}
```

### 5. Multiple Inputs
```json
{
  "pseudocode": "DECLARE length : REAL\nDECLARE width : REAL\nOUTPUT \"Enter length: \"\nINPUT length\nOUTPUT \"Enter width: \"\nINPUT width\narea = length * width\nOUTPUT \"Area = \", area"
}
```

### 6. IF Statement
```json
{
  "pseudocode": "DECLARE age : INTEGER\nINPUT age\nIF age >= 18 THEN\n    OUTPUT \"You are an adult\"\nELSE\n    OUTPUT \"You are a minor\"\nENDIF"
}
```

### 7. Nested IF (Grade Calculator)
```json
{
  "pseudocode": "DECLARE score : INTEGER\nINPUT score\nIF score >= 90 THEN\n    OUTPUT \"Grade: A\"\nELSEIF score >= 80 THEN\n    OUTPUT \"Grade: B\"\nELSEIF score >= 70 THEN\n    OUTPUT \"Grade: C\"\nELSEIF score >= 60 THEN\n    OUTPUT \"Grade: D\"\nELSE\n    OUTPUT \"Grade: F\"\nENDIF"
}
```

### 8. FOR Loop
```json
{
  "pseudocode": "DECLARE i : INTEGER\nFOR i = 1 TO 10\n    OUTPUT i\nNEXT i"
}
```

### 9. FOR Loop with STEP
```json
{
  "pseudocode": "DECLARE i : INTEGER\nFOR i = 0 TO 20 STEP 2\n    OUTPUT i\nNEXT i"
}
```

### 10. WHILE Loop
```json
{
  "pseudocode": "DECLARE count : INTEGER\ncount = 1\nWHILE count <= 5 DO\n    OUTPUT count\n    count = count + 1\nENDWHILE"
}
```

### 11. REPEAT Loop
```json
{
  "pseudocode": "DECLARE num : INTEGER\nnum = 1\nREPEAT\n    OUTPUT num\n    num = num + 1\nUNTIL num > 5"
}
```

### 12. Nested Loops (Multiplication Table)
```json
{
  "pseudocode": "DECLARE i : INTEGER\nDECLARE j : INTEGER\nFOR i = 1 TO 3\n    FOR j = 1 TO 3\n        OUTPUT i, \" x \", j, \" = \", i * j\n    NEXT j\nNEXT i"
}
```

### 13. 1D Array
```json
{
  "pseudocode": "DECLARE numbers : ARRAY[1:5] OF INTEGER\nDECLARE i : INTEGER\nFOR i = 1 TO 5\n    numbers[i] = i * 2\nNEXT i\nFOR i = 1 TO 5\n    OUTPUT numbers[i]\nNEXT i"
}
```

### 14. 2D Array (Matrix)
```json
{
  "pseudocode": "DECLARE matrix : ARRAY[1:3, 1:3] OF INTEGER\nDECLARE i : INTEGER\nDECLARE j : INTEGER\nFOR i = 1 TO 3\n    FOR j = 1 TO 3\n        matrix[i, j] = i * j\n    NEXT j\nNEXT i\nFOR i = 1 TO 3\n    FOR j = 1 TO 3\n        OUTPUT matrix[i, j], \" \"\n    NEXT j\n    OUTPUT \"\"\nNEXT i"
}
```

### 15. Find Maximum in Array
```json
{
  "pseudocode": "DECLARE numbers : ARRAY[1:5] OF INTEGER\nDECLARE i : INTEGER\nDECLARE max : INTEGER\nFOR i = 1 TO 5\n    INPUT numbers[i]\nNEXT i\nmax = numbers[1]\nFOR i = 2 TO 5\n    IF numbers[i] > max THEN\n        max = numbers[i]\n    ENDIF\nNEXT i\nOUTPUT \"Maximum: \", max"
}
```

### 16. Simple Procedure
```json
{
  "pseudocode": "PROCEDURE Greet()\n    OUTPUT \"Hello from procedure!\"\nENDPROCEDURE\n\nCALL Greet()"
}
```

### 17. Procedure with Parameters
```json
{
  "pseudocode": "PROCEDURE PrintSum(a : INTEGER, b : INTEGER)\n    DECLARE sum : INTEGER\n    sum = a + b\n    OUTPUT \"Sum = \", sum\nENDPROCEDURE\n\nCALL PrintSum(5, 3)\nCALL PrintSum(10, 20)"
}
```

### 18. Procedure with BYREF (Swap)
```json
{
  "pseudocode": "PROCEDURE Swap(BYREF a : INTEGER, BYREF b : INTEGER)\n    DECLARE temp : INTEGER\n    temp = a\n    a = b\n    b = temp\nENDPROCEDURE\n\nDECLARE x : INTEGER\nDECLARE y : INTEGER\nx = 5\ny = 10\nOUTPUT \"Before: x=\", x, \", y=\", y\nCALL Swap(x, y)\nOUTPUT \"After: x=\", x, \", y=\", y"
}
```

### 19. Simple Function
```json
{
  "pseudocode": "FUNCTION Square(n : INTEGER) RETURNS INTEGER\n    RETURN n * n\nENDFUNCTION\n\nDECLARE result : INTEGER\nresult = Square(5)\nOUTPUT \"5 squared = \", result"
}
```

### 20. Function with Multiple Parameters
```json
{
  "pseudocode": "FUNCTION Add(a : INTEGER, b : INTEGER) RETURNS INTEGER\n    RETURN a + b\nENDFUNCTION\n\nDECLARE sum : INTEGER\nsum = Add(10, 20)\nOUTPUT \"Sum = \", sum"
}
```

### 21. Factorial Function
```json
{
  "pseudocode": "FUNCTION Factorial(n : INTEGER) RETURNS INTEGER\n    DECLARE result : INTEGER\n    DECLARE i : INTEGER\n    result = 1\n    FOR i = 1 TO n\n        result = result * i\n    NEXT i\n    RETURN result\nENDFUNCTION\n\nDECLARE num : INTEGER\nDECLARE fact : INTEGER\nnum = 5\nfact = Factorial(num)\nOUTPUT num, \"! = \", fact"
}
```

### 22. Is Prime Function
```json
{
  "pseudocode": "FUNCTION IsPrime(n : INTEGER) RETURNS BOOLEAN\n    DECLARE i : INTEGER\n    IF n <= 1 THEN\n        RETURN FALSE\n    ENDIF\n    FOR i = 2 TO n - 1\n        IF n MOD i = 0 THEN\n            RETURN FALSE\n        ENDIF\n    NEXT i\n    RETURN TRUE\nENDFUNCTION\n\nDECLARE num : INTEGER\nnum = 17\nIF IsPrime(num) THEN\n    OUTPUT num, \" is prime\"\nELSE\n    OUTPUT num, \" is not prime\"\nENDIF"
}
```

### 23. String Operations
```json
{
  "pseudocode": "DECLARE text : STRING\ntext = \"Hello\"\nOUTPUT \"Length: \", LENGTH(text)\nOUTPUT \"Substring: \", SUBSTRING(text, 1, 3)"
}
```

### 24. String Concatenation
```json
{
  "pseudocode": "DECLARE first : STRING\nDECLARE last : STRING\nDECLARE full : STRING\nfirst = \"John\"\nlast = \"Doe\"\nfull = first + \" \" + last\nOUTPUT \"Full name: \", full"
}
```

### 25. Calculate Average (Complete Program)
```json
{
  "pseudocode": "DECLARE numbers : ARRAY[1:5] OF INTEGER\nDECLARE i : INTEGER\nDECLARE sum : INTEGER\nDECLARE average : REAL\nsum = 0\nFOR i = 1 TO 5\n    OUTPUT \"Enter number \", i, \": \"\n    INPUT numbers[i]\n    sum = sum + numbers[i]\nNEXT i\naverage = sum / 5\nOUTPUT \"Average = \", average"
}
```

### 26. Number Guessing Game
```json
{
  "pseudocode": "DECLARE secret : INTEGER\nDECLARE guess : INTEGER\nDECLARE attempts : INTEGER\nsecret = 42\nattempts = 0\nOUTPUT \"Guess the number (1-100)!\"\nREPEAT\n    INPUT guess\n    attempts = attempts + 1\n    IF guess < secret THEN\n        OUTPUT \"Too low!\"\n    ELSEIF guess > secret THEN\n        OUTPUT \"Too high!\"\n    ENDIF\nUNTIL guess = secret\nOUTPUT \"Correct! You got it in \", attempts, \" attempts\""
}
```

### 27. Bubble Sort
```json
{
  "pseudocode": "DECLARE arr : ARRAY[1:5] OF INTEGER\nDECLARE i : INTEGER\nDECLARE j : INTEGER\nDECLARE temp : INTEGER\nDECLARE swapped : BOOLEAN\n\nOUTPUT \"Enter 5 numbers:\"\nFOR i = 1 TO 5\n    INPUT arr[i]\nNEXT i\n\nFOR i = 1 TO 4\n    swapped = FALSE\n    FOR j = 1 TO 5 - i\n        IF arr[j] > arr[j + 1] THEN\n            temp = arr[j]\n            arr[j] = arr[j + 1]\n            arr[j + 1] = temp\n            swapped = TRUE\n        ENDIF\n    NEXT j\n    IF NOT swapped THEN\n        i = 5\n    ENDIF\nNEXT i\n\nOUTPUT \"Sorted array:\"\nFOR i = 1 TO 5\n    OUTPUT arr[i]\nNEXT i"
}
```

---

## Error Testing Examples

### 28. Syntax Error (Missing ENDIF)
```json
{
  "pseudocode": "DECLARE x : INTEGER\nx = 5\nIF x > 0 THEN\n    OUTPUT \"Positive\""
}
```
**Expected**: Error response with suggestions

### 29. Undeclared Variable
```json
{
  "pseudocode": "x = 10\nOUTPUT x"
}
```
**Expected**: May compile (permissive mode) or error depending on configuration

### 30. Type Mismatch (if strict checking enabled)
```json
{
  "pseudocode": "DECLARE x : INTEGER\nx = \"Hello\""
}
```
**Expected**: May compile or error depending on type checking

---

## How to Use in Postman

### Method 1: Individual Requests
1. Open Postman
2. Create a new **POST** request
3. Set URL to: `http://localhost:8000/execution/convert/`
4. Set Headers:
   - `Content-Type: application/json`
5. In Body, select **raw** and **JSON**
6. Copy any example JSON above and paste it
7. Click **Send**

### Method 2: Import Collection
Save the JSON below as `IGCSE_Compiler_Tests.postman_collection.json` and import into Postman.

---

## cURL Examples

### Basic Test
```bash
curl -X POST http://localhost:8000/execution/convert/ \
  -H "Content-Type: application/json" \
  -d '{"pseudocode": "OUTPUT \"Hello, World!\""}'
```

### WHILE Loop Test
```bash
curl -X POST http://localhost:8000/execution/convert/ \
  -H "Content-Type: application/json" \
  -d '{
    "pseudocode": "DECLARE count : INTEGER\ncount = 1\nWHILE count <= 5 DO\n    OUTPUT count\n    count = count + 1\nENDWHILE"
  }'
```

### Procedure with BYREF Test
```bash
curl -X POST http://localhost:8000/execution/convert/ \
  -H "Content-Type: application/json" \
  -d '{
    "pseudocode": "PROCEDURE Swap(BYREF a : INTEGER, BYREF b : INTEGER)\n    DECLARE temp : INTEGER\n    temp = a\n    a = b\n    b = temp\nENDPROCEDURE\n\nDECLARE x : INTEGER\nDECLARE y : INTEGER\nx = 5\ny = 10\nOUTPUT \"Before: x=\", x, \", y=\", y\nCALL Swap(x, y)\nOUTPUT \"After: x=\", x, \", y=\", y"
  }'
```

---

## Expected Results

All examples 1-27 should return:
- `"success": true`
- `"python_code"`: Valid Python code

Error examples (28-30) may return:
- `"success": false`
- `"error"`: Error message
- `"suggestions"`: Array of suggestions
- `"line"` and `"column"`: Error location

---

## Notes

1. **Line Breaks**: Use `\n` in JSON strings for newlines
2. **Quotes**: Escape quotes inside strings: `\"`
3. **Server**: Make sure Django server is running: `python manage.py runserver`
4. **Port**: Default is 8000, adjust if different
5. **All 27 examples** have been tested and compile successfully
