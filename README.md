# IGCSE-Pseudocode-Online-Compiler

A **Web-based Pseudocode Interpreter** that allows users to write pseudocode, which is then compiled into Python and executed in the browser. The project aims to bridge the gap between the IGCSE Computer Science Pseudocode syntax and actual programming languages.
## Tech Stack

- **Frontend:**
  - **React** with **TypeScript** for building the user interface.
  - **Tailwind CSS** for utility-first, responsive styling.
  - **Vite** for fast and modern development with React.
  - **Pyodide** for running Python code in the browser.

- **Backend:**
  - **Django**: A powerful Python framework used to handle the logic of compiling pseudocode into Python. It exposes a simple API for the frontend to interact with.
  - **Python**: Used for pseudocode-to-Python compilation and for executing Python code.

- **APIs:**
  - Custom API to compile pseudocode into Python code and return it.
  - Backend communication via **Fetch**/`Axios` for making HTTP requests from the frontend.

- **Deployment:**
  - Hosted on **Render** for the backend.

---

## Features

- **Real-time pseudocode-to-Python compilation**: Converts pseudocode to Python code and runs it in the browser.
- **Interactive editor**: A user-friendly interface to enter pseudocode and instantly see the output.
- **Output Display**: Once compiled, the output is displayed beside the editor so users can see the results.
- **Responsive Design**: The application is fully responsive, ensuring a smooth experience on desktops, tablets, and smartphones.

---

## How It Works

1. **User Input:**
   - The user enters pseudocode into the code editor on the frontend.
   
2. **Pseudocode Compilation:**
   - The frontend sends the pseudocode to the backend via a `POST` request to the `/execution/convert/` endpoint.
   - The backend compiles the pseudocode into Python code and returns the result.

3. **Python Code Execution:**
   - The frontend then sends the Python code to a Python interpreter running in the browser (**Pyodide**) for execution.
   - The output or errors from the execution are returned and displayed to the user in the output section.

---

## Features and Functionality

- **Code Input**:
  - Write pseudocode in a user-friendly editor.
  - Clear the code with a single click.

- **Compilation**:
  - The pseudocode is compiled into Python code via a REST API.

- **Execution**:
  - Run the generated Python code directly in the browser using Pyodide.

- **Responsive Design**:
  - The app works on various devices, including desktops, tablets, and smartphones.

---

## Installation

To get started with the project locally, follow these steps:

### **Frontend Setup**

1. Clone the repository:
   ```bash
   git clone https://github.com/Sherlemious/IGCSE-Pseudocode-Online-Compiler
   cd IGCSE-Pseudocode-Online-Compiler
   cd frontend
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open the app in your browser at `http://localhost:5173`.

### **Backend Setup**

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install the required dependencies (if using Django):
   ```bash
   pip install -r requirements.txt
   ```

3. Set up your database (if applicable):
   ```bash
   python manage.py migrate
   ```

4. Run the Django server:
   ```bash
   python manage.py runserver
   ```

5. Open the backend in your browser at `http://localhost:8000`.

---

## API Endpoints

- **POST `/execution/convert/`**:
  - **Request Body**: Pseudocode string.
  - **Response**: Python code (string).
  
---



## Contributing

If you'd like to contribute to the project, feel free to submit a pull request with your changes! Please make sure to follow the below guidelines:

- Fork the repository.
- Create a new branch for each feature or bug fix.
- Write clear commit messages.
- Make sure tests pass before submitting a pull request.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Let me know if you need any more changes or additions!

# Pseudocode Language Documentation

## Introduction
This documentation outlines the syntax and structure of a pseudocode language designed for educational purposes. It progresses from basic input/output to advanced file handling.

---

## 1. Comments
Comments provide explanations and are ignored during execution.
```pseudocode
// Single-line comment
/* 
Multi-line comment 
(Note: Based on examples, single-line `//` is shown)
*/

// Example:
// This procedure swaps values of X and Y
PROCEDURE SWAP(X : INTEGER, Y : INTEGER)
  Temp ← X  // Temporarily store X
  X ← Y
  Y ← Temp
ENDPROCEDURE
```

---

## 2. Basic Input/Output
### Output
```pseudocode
OUTPUT "Hello, World!"       // Print text
OUTPUT Score                 // Print variable
OUTPUT "Lives left: ", Lives // Combine text and variables
```

### Input
```pseudocode
INPUT Answer  // Read user input into a variable
```

---

## 3. Variables and Constants
### Variable Declaration
```pseudocode
DECLARE Counter : INTEGER
DECLARE TotalToPay : REAL
DECLARE GameOver : BOOLEAN
```

### Constant Declaration
```pseudocode
CONSTANT HourlyRate ← 6.50
CONSTANT DefaultText ← "N/A"
```

---

## 4. Data Types and Assignments
### Supported Data Types
- `INTEGER`, `REAL`, `BOOLEAN`, `CHAR`, `STRING`

### Assignments
```pseudocode
Counter ← 0                      // Direct assignment
Counter ← Counter + 1            // Arithmetic operation
TotalToPay ← NumberOfHours * HourlyRate  // Expression
```

---

## 5. Arithmetic and Boolean Operations
### Arithmetic Operators
```pseudocode
Answer ← Score * 100 / MaxMark   // Basic operations
Area ← Pi * Radius ^ 2           // Exponentiation
```

### MOD and DIV
```pseudocode
DIV(10, 3)  // Returns 3 (integer division)
MOD(10, 3)  // Returns 1 (remainder)
```

### Comparison Operators
- `=`, `<`, `<=`, `>`, `>=`, `<>` (not equal)
- Result is always `BOOLEAN`.

### Boolean Operators
- `AND`, `OR`, `NOT`
- Use parentheses for clarity:  
  ```pseudocode
  IF (Age < 18) OR (Age > 65) THEN ...
  ```

---

## 6. Control Structures
### Selection: `IF` Statements
```pseudocode
IF Temperature > 100 THEN
  OUTPUT "Boiling"
ELSE
  OUTPUT "Not boiling"
ENDIF
```

### Selection: `CASE` Statements
```pseudocode
CASE OF Grade
  'A' : OUTPUT "Excellent"
  'B' : OUTPUT "Good"
  OTHERWISE OUTPUT "Needs improvement"
ENDCASE
```

---

## 7. Loops
### `REPEAT UNTIL` (Post-Condition)
```pseudocode
REPEAT
  OUTPUT "Enter password:"
  INPUT Password
UNTIL Password = "Secret"
```

### `WHILE` Loop (Pre-Condition)
```pseudocode
WHILE Number > 9 DO
  Number ← Number - 9
ENDWHILE
```

### `FOR` Loop (Count-Controlled)
```pseudocode
FOR Index ← 1 TO 30
  StudentNames[Index] ← ""
NEXT Index
```

---

## 8. Arrays
### Declaration
```pseudocode
DECLARE StudentNames : ARRAY[1:30] OF STRING         // 1D
DECLARE Grid : ARRAY[1:3, 1:3] OF CHAR               // 2D
```

### Usage
```pseudocode
StudentNames[1] ← "Ali"           // Assign value
Grid[2, 3] ← 'X'                  // 2D assignment
StudentNames[n+1] ← StudentNames[n]  // Dynamic index
```

---

## 9. String Operations
```pseudocode
LENGTH("Hello")        // Returns 5
LCASE('A')             // Returns 'a'
UCASE("test")          // Returns "TEST"
SUBSTRING("Hello", 1, 3)  // Returns "Hel"
```

---

## 10. Built-In Functions
### Math Functions
```pseudocode
Value ← ROUND(3.1415, 2)  // Returns 3.14
DiceRoll ← ROUND(RANDOM() * 6, 0)  // Random integer 0-6
```

---

## 11. Procedures and Functions
### Procedure (No Return Value)
```pseudocode
PROCEDURE Greet(Name : STRING)
  OUTPUT "Hello, ", Name
ENDPROCEDURE

CALL Greet("Alice")  // Usage
```

### Function (Returns Value)
```pseudocode
FUNCTION SumSquare(A : INTEGER, B : INTEGER) RETURNS INTEGER
  RETURN A^2 + B^2
ENDFUNCTION

Result ← SumSquare(3, 4)  // Result = 25
```

---

## 12. File Handling
### File Operations
```pseudocode
DECLARE Data : STRING
OPENFILE "input.txt" FOR READ
OPENFILE "output.txt" FOR WRITE

READFILE "input.txt", Data     // Read from file
WRITEFILE "output.txt", Data   // Write to file

CLOSEFILE "input.txt"
CLOSEFILE "output.txt"
```

### Modes
- `READ`: Read existing data.
- `WRITE`: Overwrite/create new file.

---

## Best Practices
1. Use parentheses to clarify complex expressions.
2. Always close files after use.
3. Declare variables and constants before use.
```pseudocode
// Example: Full Program Structure
DECLARE Name : STRING
INPUT Name
OUTPUT "Welcome, ", Name
```
