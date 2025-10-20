"""
Lark Grammar for IGCSE Pseudocode

Formal grammar definition using Lark LALR parser for IGCSE pseudocode.
Supports all standard pseudocode constructs with proper operator precedence.
"""

PSEUDOCODE_GRAMMAR = r"""
?start: program

program: _NL* (statement _NL+)*  statement?

// Statements
?statement: declaration
          | constant_decl
          | assignment
          | input_stmt
          | output_stmt
          | if_stmt
          | for_loop
          | while_loop
          | repeat_loop
          | function_decl
          | procedure_decl
          | return_stmt
          | call_stmt

// Declarations
declaration: DECLARE IDENT COLON type_spec
constant_decl: CONSTANT IDENT EQUALS expression

type_spec: simple_type
         | array_type

simple_type: INTEGER | REAL | STRING | BOOLEAN | CHAR | DATE

array_type: ARRAY LBRACK array_dim (COMMA array_dim)* RBRACK OF simple_type

array_dim: NUMBER COLON NUMBER

// Expressions (precedence from low to high)
?expression: or_expr

?or_expr: and_expr (OR and_expr)*

?and_expr: not_expr (AND not_expr)*

?not_expr: NOT not_expr -> not_op
         | comparison

?comparison: add_expr (comp_op add_expr)?

comp_op: EQUALS | NEQ | LEQ | GEQ | LT | GT

?add_expr: mul_expr ((PLUS|MINUS) mul_expr)*

?mul_expr: power_expr ((STAR|SLASH|DIV|MOD) power_expr)*

?power_expr: unary_expr (POWER unary_expr)*

?unary_expr: MINUS unary_expr -> neg
           | PLUS unary_expr -> pos
           | atom

?atom: NUMBER -> number
     | STRING_LIT -> string
     | TRUE -> true
     | FALSE -> false
     | func_call
     | arr_access
     | IDENT -> ident
     | LPAR expression RPAR

// Function calls and array access
func_call: IDENT LPAR [expression (COMMA expression)*] RPAR
arr_access: IDENT LBRACK expression (COMMA expression)* RBRACK

// Statements
assignment: (IDENT | arr_access) (EQUALS | ARROW) expression

input_stmt: INPUT (IDENT | arr_access)

output_stmt: (OUTPUT | PRINT) expression (COMMA expression)*

// Control flow
if_stmt: IF expression THEN _NL+ (statement _NL+)* elif_part* else_part? ENDIF

elif_part: ELSEIF expression THEN _NL+ (statement _NL+)*

else_part: ELSE _NL+ (statement _NL+)*

for_loop: FOR IDENT EQUALS expression TO expression (STEP expression)? _NL+ (statement _NL+)* NEXT IDENT

while_loop: WHILE expression DO _NL+ (statement _NL+)* ENDWHILE

repeat_loop: REPEAT _NL+ (statement _NL+)* UNTIL expression

// Functions and procedures
procedure_decl: PROCEDURE IDENT LPAR [param_list] RPAR _NL+ (statement _NL+)* ENDPROCEDURE

function_decl: FUNCTION IDENT LPAR [param_list] RPAR RETURNS simple_type _NL+ (statement _NL+)* ENDFUNCTION

param_list: parameter (COMMA parameter)*

parameter: (BYREF | BYVAL)? IDENT COLON type_spec

return_stmt: RETURN expression

call_stmt: CALL IDENT LPAR [expression (COMMA expression)*] RPAR

// Terminals (case-insensitive keywords with priority)
DECLARE.2: /DECLARE/i
CONSTANT.2: /CONSTANT/i
INTEGER.2: /INTEGER/i
REAL.2: /REAL/i
STRING.2: /STRING/i
BOOLEAN.2: /BOOLEAN/i
CHAR.2: /CHAR/i
DATE.2: /DATE/i
ARRAY.2: /ARRAY/i
OF.2: /OF/i
INPUT.2: /INPUT/i
OUTPUT.2: /OUTPUT/i
PRINT.2: /PRINT/i
IF.2: /IF/i
THEN.2: /THEN/i
ELSEIF.2: /ELSEIF/i
ELSE.2: /ELSE/i
ENDIF.2: /ENDIF/i
FOR.2: /FOR/i
TO.2: /TO/i
STEP.2: /STEP/i
NEXT.2: /NEXT/i
WHILE.2: /WHILE/i
DO.2: /DO/i
ENDWHILE.2: /ENDWHILE/i
REPEAT.2: /REPEAT/i
UNTIL.2: /UNTIL/i
PROCEDURE.2: /PROCEDURE/i
ENDPROCEDURE.2: /ENDPROCEDURE/i
FUNCTION.2: /FUNCTION/i
ENDFUNCTION.2: /ENDFUNCTION/i
RETURNS.2: /RETURNS/i
RETURN.2: /RETURN/i
CALL.2: /CALL/i
BYREF.2: /BYREF/i
BYVAL.2: /BYVAL/i
AND.2: /AND/i
OR.2: /OR/i
NOT.2: /NOT/i
DIV.2: /DIV/i
MOD.2: /MOD/i
TRUE.2: /TRUE/i
FALSE.2: /FALSE/i

// Operators and punctuation
ARROW: "<-"
NEQ: "<>" | "><"
LEQ: "<="
GEQ: ">="
EQUALS: "="
LT: "<"
GT: ">"
PLUS: "+"
MINUS: "-"
STAR: "*"
SLASH: "/"
POWER: "^"
LPAR: "("
RPAR: ")"
LBRACK: "["
RBRACK: "]"
COMMA: ","
COLON: ":"

// Identifiers, numbers, strings
IDENT: /[a-zA-Z_][a-zA-Z0-9_]*/
NUMBER: /\d+(\.\d+)?/
STRING_LIT: /"[^"]*"/ | /'[^']*'/

// Whitespace and comments
COMMENT: /\/\/[^\n]*/
_NL: /\r?\n/+

%import common.WS_INLINE
%ignore WS_INLINE
%ignore COMMENT
"""
