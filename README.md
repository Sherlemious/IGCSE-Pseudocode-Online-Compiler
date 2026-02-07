# IGCSE Pseudocode Online Compiler

A **browser-based pseudocode interpreter** for the Cambridge IGCSE Computer Science (0478) syllabus. Write and run pseudocode directly in the browser with no backend required.

## Tech Stack

- **React 18** with **TypeScript** for the UI
- **Tailwind CSS** for styling
- **Vite** for development and builds
- **antlr4ng v3** for parsing pseudocode via a custom ANTLR4 grammar

## Features

- **Direct interpretation**: Pseudocode is parsed and executed in the browser using an ANTLR4 grammar and a custom tree-walking interpreter. No transpilation step.
- **Interactive editor**: Write pseudocode and see output instantly.
- **INPUT support**: Programs that use `INPUT` pause execution and prompt the user interactively.
- **File handling**: `OPENFILE`, `READFILE`, `WRITEFILE`, and `CLOSEFILE` are simulated using browser localStorage.
- **Responsive design**: Works on desktops, tablets, and phones.

## How It Works

1. The user writes pseudocode in the editor.
2. The ANTLR4 lexer/parser tokenizes and parses the code into a parse tree.
3. A tree-walking interpreter executes the parse tree directly, evaluating expressions, managing variables/arrays, and handling control flow.
4. Output is displayed beside the editor. Programs requiring user input pause and show an input prompt.

## Supported Language Features

See the full [Pseudocode Language Reference](pseudocode.md) for details.

- **Data types**: `INTEGER`, `REAL`, `CHAR`, `STRING`, `BOOLEAN`
- **Variables & constants**: `DECLARE`, `CONSTANT`
- **Assignment**: Using `<-` or `=`
- **Arrays**: 1D and 2D with custom bounds
- **I/O**: `INPUT`, `OUTPUT`, `PRINT`
- **Arithmetic**: `+`, `-`, `*`, `/`, `^`, `DIV()`, `MOD()`
- **Comparison**: `=`, `<>`, `<`, `>`, `<=`, `>=`
- **Logical**: `AND`, `OR`, `NOT`
- **Selection**: `IF/THEN/ELSE/ENDIF`, `CASE OF/OTHERWISE/ENDCASE`
- **Iteration**: `FOR/TO/STEP/NEXT`, `WHILE/DO/ENDWHILE`, `REPEAT/UNTIL`
- **Subprograms**: `PROCEDURE/ENDPROCEDURE`, `FUNCTION/RETURNS/ENDFUNCTION`, `CALL`, `RETURN`
- **File handling**: `OPENFILE`, `READFILE`, `WRITEFILE`, `CLOSEFILE` (localStorage-backed)
- **String functions**: `LENGTH()`, `LCASE()`, `UCASE()`, `SUBSTRING()`
- **Library routines**: `ROUND()`, `RANDOM()`, `INT()`, `EOF()`
- **Comments**: `// single line`

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Sherlemious/IGCSE-Pseudocode-Online-Compiler
   cd IGCSE-Pseudocode-Online-Compiler/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser.

### Regenerating the Parser

If you modify the ANTLR4 grammar (`src/interpreter/grammar/Pseudocode.g4`), regenerate the parser:

```bash
npm run antlr:generate
```

## Contributing

Contributions are welcome. Please:

- Fork the repository
- Create a branch for your feature or fix
- Write clear commit messages
- Make sure the project builds before submitting a PR

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
