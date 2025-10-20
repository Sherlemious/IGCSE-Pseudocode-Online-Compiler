"""
Lark Grammar for IGCSE Pseudocode

This module contains the formal grammar definition for IGCSE pseudocode
using Lark's EBNF-like syntax. The grammar is case-insensitive.
"""

PSEUDOCODE_GRAMMAR = r"""
    // ========================================================================
    // Program Structure
    // ========================================================================

    ?start: program

    program: (statement | NEWLINE)*

    ?statement: declaration
              | constant_declaration
              | assignment
              | input_statement
              | output_statement
              | if_statement
              | case_statement
              | for_loop
              | while_loop
              | repeat_until_loop
              | procedure_declaration
              | function_declaration
              | return_statement
              | call_statement
              | file_operation
              | comment

    // ========================================================================
    // Declarations
    // ========================================================================

    declaration: "DECLARE"i IDENTIFIER ":" type_spec

    constant_declaration: "CONSTANT"i IDENTIFIER "=" expression

    type_spec: simple_type
             | array_type

    simple_type: "INTEGER"i
               | "REAL"i
               | "STRING"i
               | "BOOLEAN"i
               | "CHAR"i
               | "DATE"i

    array_type: "ARRAY"i "[" array_dimension ("," array_dimension)* "]" "OF"i simple_type

    array_dimension: NUMBER ":" NUMBER

    // ========================================================================
    // Expressions
    // ========================================================================

    ?expression: logical_or

    ?logical_or: logical_and ("OR"i logical_and)*

    ?logical_and: logical_not ("AND"i logical_not)*

    ?logical_not: "NOT"i logical_not -> unary_not
                | comparison

    ?comparison: additive (comp_op additive)?

    comp_op: "="
           | "<>"
           | "><"
           | "<="
           | ">="
           | "<"
           | ">"

    ?additive: multiplicative (("+"|"-") multiplicative)*

    ?multiplicative: power (("*"|"/"|"DIV"i|"MOD"i) power)*

    ?power: unary ("^" unary)*

    ?unary: "-" unary -> unary_minus
          | "+" unary -> unary_plus
          | primary

    ?primary: NUMBER -> number
            | STRING -> string
            | "TRUE"i -> true
            | "FALSE"i -> false
            | function_call
            | array_access
            | IDENTIFIER -> identifier
            | paren_expr

    paren_expr: "(" expression ")"

    // ========================================================================
    // Function Calls
    // ========================================================================

    function_call: IDENTIFIER "(" [arguments] ")"

    arguments: expression ("," expression)*

    // ========================================================================
    // Array Access
    // ========================================================================

    array_access: IDENTIFIER "[" indices "]"

    indices: expression ("," expression)*

    // ========================================================================
    // Statements
    // ========================================================================

    assignment: (IDENTIFIER | array_access) ("=" | "<-") expression

    input_statement: "INPUT"i (IDENTIFIER | array_access)

    output_statement: ("OUTPUT"i | "PRINT"i) expression ("," expression)*

    // ========================================================================
    // Control Flow - Conditionals
    // ========================================================================

    if_statement: "IF"i expression "THEN"i NEWLINE
                  (statement | NEWLINE)*
                  elif_part*
                  [else_part]
                  "ENDIF"i

    elif_part: "ELSEIF"i expression "THEN"i NEWLINE
               (statement | NEWLINE)*

    else_part: "ELSE"i NEWLINE
               (statement | NEWLINE)*

    case_statement: "CASE"i "OF"i expression NEWLINE
                    case_branch+
                    [otherwise_part]
                    "ENDCASE"i

    case_branch: expression ":" NEWLINE
                 (statement | NEWLINE)+

    otherwise_part: "OTHERWISE"i ":" NEWLINE
                    (statement | NEWLINE)+

    // ========================================================================
    // Control Flow - Loops
    // ========================================================================

    for_loop: "FOR"i IDENTIFIER "=" expression "TO"i expression ["STEP"i expression] NEWLINE
              (statement | NEWLINE)*
              "NEXT"i IDENTIFIER

    while_loop: "WHILE"i expression "DO"i NEWLINE
                (statement | NEWLINE)*
                "ENDWHILE"i

    repeat_until_loop: "REPEAT"i NEWLINE
                       (statement | NEWLINE)*
                       "UNTIL"i expression

    // ========================================================================
    // Functions and Procedures
    // ========================================================================

    procedure_declaration: "PROCEDURE"i IDENTIFIER "(" [parameter_list] ")" NEWLINE
                          (statement | NEWLINE)*
                          "ENDPROCEDURE"i

    function_declaration: "FUNCTION"i IDENTIFIER "(" [parameter_list] ")" "RETURNS"i simple_type NEWLINE
                         (statement | NEWLINE)*
                         "ENDFUNCTION"i

    parameter_list: parameter ("," parameter)*

    parameter: ["BYREF"i | "BYVAL"i] IDENTIFIER ":" type_spec

    return_statement: "RETURN"i expression

    call_statement: "CALL"i IDENTIFIER "(" [arguments] ")"

    // ========================================================================
    // File Operations
    // ========================================================================

    file_operation: open_file
                  | read_file
                  | write_file
                  | close_file

    open_file: "OPENFILE"i expression "FOR"i file_mode

    file_mode: "READ"i
             | "WRITE"i
             | "APPEND"i

    read_file: "READFILE"i expression "," (IDENTIFIER | array_access)

    write_file: "WRITEFILE"i expression "," expression

    close_file: "CLOSEFILE"i expression

    // ========================================================================
    // Comments
    // ========================================================================

    comment: COMMENT

    // ========================================================================
    // Terminals (Lexer Rules)
    // ========================================================================

    IDENTIFIER: /[a-zA-Z_][a-zA-Z0-9_]*/

    NUMBER: /\d+\.?\d*/

    STRING: /"[^"]*"/ | /'[^']*'/

    COMMENT: /\/\/[^\n]*/

    NEWLINE: /\r?\n/+

    // Ignore whitespace (except newlines, which are significant)
    %import common.WS_INLINE
    %ignore WS_INLINE
"""

# Alternative: More permissive grammar that handles various edge cases
PSEUDOCODE_GRAMMAR_PERMISSIVE = r"""
    // This is a more permissive version that allows optional THEN, DO keywords
    // and handles cases where users might write slightly non-standard pseudocode

    ?start: program

    program: (statement | NEWLINE)*

    ?statement: declaration
              | constant_declaration
              | assignment
              | input_statement
              | output_statement
              | if_statement
              | case_statement
              | for_loop
              | while_loop
              | repeat_until_loop
              | procedure_declaration
              | function_declaration
              | return_statement
              | call_statement
              | comment

    declaration: "DECLARE"i IDENTIFIER ":" type_spec

    constant_declaration: "CONSTANT"i IDENTIFIER "=" expression

    type_spec: simple_type
             | array_type

    simple_type: "INTEGER"i
               | "REAL"i
               | "STRING"i
               | "BOOLEAN"i
               | "CHAR"i
               | "DATE"i

    array_type: "ARRAY"i "[" array_dimension ("," array_dimension)* "]" "OF"i simple_type

    array_dimension: NUMBER ":" NUMBER

    ?expression: logical_or

    ?logical_or: logical_and ("OR"i logical_and)*

    ?logical_and: logical_not ("AND"i logical_not)*

    ?logical_not: "NOT"i logical_not -> unary_not
                | comparison

    ?comparison: additive (comp_op additive)?

    comp_op: "="
           | "<>"
           | "><"
           | "<="
           | ">="
           | "<"
           | ">"

    ?additive: multiplicative (("+"|"-"|"&") multiplicative)*

    ?multiplicative: power (("*"|"/"|"DIV"i|"MOD"i) power)*

    ?power: unary ("^" unary)*

    ?unary: "-" unary -> unary_minus
          | "+" unary -> unary_plus
          | primary

    ?primary: NUMBER -> number
            | STRING -> string
            | "TRUE"i -> true
            | "FALSE"i -> false
            | function_call
            | array_access
            | IDENTIFIER -> identifier
            | paren_expr

    paren_expr: "(" expression ")"

    function_call: IDENTIFIER "(" [arguments] ")"

    arguments: expression ("," expression)*

    array_access: IDENTIFIER "[" indices "]"

    indices: expression ("," expression)*

    assignment: (IDENTIFIER | array_access) ("=" | "<-") expression

    input_statement: "INPUT"i (IDENTIFIER | array_access)

    output_statement: ("OUTPUT"i | "PRINT"i) expression ("," expression)*

    if_statement: "IF"i expression ["THEN"i] NEWLINE
                  (statement | NEWLINE)*
                  elif_part*
                  [else_part]
                  "ENDIF"i

    elif_part: "ELSEIF"i expression ["THEN"i] NEWLINE
               (statement | NEWLINE)*

    else_part: "ELSE"i NEWLINE
               (statement | NEWLINE)*

    case_statement: "CASE"i "OF"i expression NEWLINE
                    case_branch+
                    [otherwise_part]
                    "ENDCASE"i

    case_branch: expression ":" NEWLINE
                 (statement | NEWLINE)+

    otherwise_part: "OTHERWISE"i ":" NEWLINE
                    (statement | NEWLINE)+

    for_loop: "FOR"i IDENTIFIER "=" expression "TO"i expression ["STEP"i expression] NEWLINE
              (statement | NEWLINE)*
              "NEXT"i IDENTIFIER

    while_loop: "WHILE"i expression ["DO"i] NEWLINE
                (statement | NEWLINE)*
                "ENDWHILE"i

    repeat_until_loop: "REPEAT"i NEWLINE
                       (statement | NEWLINE)*
                       "UNTIL"i expression

    procedure_declaration: "PROCEDURE"i IDENTIFIER "(" [parameter_list] ")" NEWLINE
                          (statement | NEWLINE)*
                          "ENDPROCEDURE"i

    function_declaration: "FUNCTION"i IDENTIFIER "(" [parameter_list] ")" "RETURNS"i simple_type NEWLINE
                         (statement | NEWLINE)*
                         "ENDFUNCTION"i

    parameter_list: parameter ("," parameter)*

    parameter: ["BYREF"i | "BYVAL"i] IDENTIFIER ":" type_spec

    return_statement: "RETURN"i expression

    call_statement: "CALL"i IDENTIFIER "(" [arguments] ")"

    comment: COMMENT

    IDENTIFIER: /[a-zA-Z_][a-zA-Z0-9_]*/

    NUMBER: /\d+\.?\d*/

    STRING: /"[^"]*"/ | /'[^']*'/

    COMMENT: /\/\/[^\n]*/

    NEWLINE: /\r?\n/+

    %import common.WS_INLINE
    %ignore WS_INLINE
"""
