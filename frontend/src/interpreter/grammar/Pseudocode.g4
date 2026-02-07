grammar Pseudocode;

// ─── Parser Rules ───────────────────────────────────────────────────────────

program
    : NEWLINE* (statement (NEWLINE+ statement)*)? NEWLINE* EOF
    ;

statement
    : declareStatement
    | constantStatement
    | assignmentStatement
    | inputStatement
    | outputStatement
    | ifStatement
    | caseStatement
    | forStatement
    | whileStatement
    | repeatStatement
    | procedureDeclaration
    | functionDeclaration
    | callStatement
    | returnStatement
    | openFileStatement
    | readFileStatement
    | writeFileStatement
    | closeFileStatement
    ;

// ─── DECLARE / CONSTANT ────────────────────────────────────────────────────

declareStatement
    : DECLARE IDENTIFIER COLON ARRAY LBRACKET expr COLON expr RBRACKET OF dataType
    | DECLARE IDENTIFIER COLON ARRAY LBRACKET expr COLON expr COMMA expr COLON expr RBRACKET OF dataType
    | DECLARE IDENTIFIER COLON dataType
    ;

constantStatement
    : CONSTANT IDENTIFIER (LARROW | EQUALS) expr
    ;

dataType
    : INTEGER_TYPE
    | REAL_TYPE
    | CHAR_TYPE
    | STRING_TYPE
    | BOOLEAN_TYPE
    ;

// ─── Assignment ─────────────────────────────────────────────────────────────

assignmentStatement
    : IDENTIFIER EQUALS expr
    | IDENTIFIER LBRACKET expr RBRACKET EQUALS expr
    | IDENTIFIER LBRACKET expr COMMA expr RBRACKET EQUALS expr
    | IDENTIFIER LARROW expr
    | IDENTIFIER LBRACKET expr RBRACKET LARROW expr
    | IDENTIFIER LBRACKET expr COMMA expr RBRACKET LARROW expr
    ;

// ─── INPUT / OUTPUT ─────────────────────────────────────────────────────────

inputStatement
    : INPUT IDENTIFIER
    | INPUT IDENTIFIER LBRACKET expr RBRACKET
    ;

outputStatement
    : (OUTPUT | PRINT) exprList
    ;

exprList
    : expr (COMMA expr)*
    ;

// ─── IF / ELSE ──────────────────────────────────────────────────────────────

ifStatement
    : IF expr THEN NEWLINE+ block
      (NEWLINE+ ELSEIF expr THEN NEWLINE+ block)*
      (NEWLINE+ ELSE NEWLINE+ block)?
      NEWLINE+ ENDIF
    ;

// ─── CASE / OTHERWISE ──────────────────────────────────────────────────────

caseStatement
    : CASE OF IDENTIFIER NEWLINE+
      caseClause+
      (OTHERWISE COLON NEWLINE+ block NEWLINE+)?
      ENDCASE
    ;

caseClause
    : expr COLON NEWLINE+ block NEWLINE+
    ;

// ─── FOR / NEXT ─────────────────────────────────────────────────────────────

forStatement
    : FOR IDENTIFIER (LARROW | EQUALS) expr TO expr (STEP expr)? NEWLINE+ block NEWLINE+ NEXT IDENTIFIER
    ;

// ─── WHILE / ENDWHILE ──────────────────────────────────────────────────────

whileStatement
    : WHILE expr DO? NEWLINE+ block NEWLINE+ ENDWHILE
    ;

// ─── REPEAT / UNTIL ─────────────────────────────────────────────────────────

repeatStatement
    : REPEAT NEWLINE+ block NEWLINE+ UNTIL expr
    ;

// ─── PROCEDURE / FUNCTION ───────────────────────────────────────────────────

procedureDeclaration
    : PROCEDURE IDENTIFIER LPAREN paramList? RPAREN NEWLINE+ block NEWLINE+ ENDPROCEDURE
    ;

functionDeclaration
    : FUNCTION IDENTIFIER LPAREN paramList? RPAREN RETURNS dataType NEWLINE+ block NEWLINE+ ENDFUNCTION
    ;

paramList
    : param (COMMA param)*
    ;

param
    : IDENTIFIER COLON dataType
    ;

callStatement
    : CALL IDENTIFIER LPAREN argList? RPAREN
    ;

returnStatement
    : RETURN expr
    ;

// ─── FILE HANDLING ─────────────────────────────────────────────────────────

openFileStatement
    : OPENFILE expr FOR fileMode
    ;

readFileStatement
    : READFILE expr COMMA IDENTIFIER
    ;

writeFileStatement
    : WRITEFILE expr COMMA expr
    ;

closeFileStatement
    : CLOSEFILE expr
    ;

fileMode
    : READ_MODE
    | WRITE_MODE
    | APPEND_MODE
    ;

argList
    : expr (COMMA expr)*
    ;

// ─── Block (sequence of statements) ────────────────────────────────────────

block
    : statement (NEWLINE+ statement)*
    ;

// ─── Expressions ────────────────────────────────────────────────────────────

expr
    : NOT expr                                          # notExpr
    | MINUS expr                                        # unaryMinusExpr
    | <assoc=right> expr CARET expr                     # powerExpr
    | expr op=(STAR | SLASH | DIV | MOD) expr           # mulDivExpr
    | expr op=(PLUS | MINUS) expr                       # addSubExpr
    | expr AMPERSAND expr                               # concatExpr
    | expr op=(EQUALS | NOTEQUAL | LT | GT | LTE | GTE) expr # comparisonExpr
    | expr AND expr                                     # andExpr
    | expr OR expr                                      # orExpr
    | atom                                              # atomExpr
    ;

atom
    : LPAREN expr RPAREN                                # parenAtom
    | IDENTIFIER LPAREN argList? RPAREN                 # functionCallAtom
    | IDENTIFIER LBRACKET expr RBRACKET                 # arrayAccess1DAtom
    | IDENTIFIER LBRACKET expr COMMA expr RBRACKET      # arrayAccess2DAtom
    | DIV LPAREN expr COMMA expr RPAREN                 # divFunctionAtom
    | MOD LPAREN expr COMMA expr RPAREN                 # modFunctionAtom
    | IDENTIFIER                                        # identifierAtom
    | INTEGER_LITERAL                                   # integerAtom
    | REAL_LITERAL                                      # realAtom
    | STRING_LITERAL                                    # stringAtom
    | CHAR_LITERAL                                      # charAtom
    | TRUE                                              # trueAtom
    | FALSE                                             # falseAtom
    ;

// ─── Lexer Rules ────────────────────────────────────────────────────────────

// Keywords (case-insensitive via fragments)
DECLARE     : D E C L A R E ;
CONSTANT    : C O N S T A N T ;
INPUT       : I N P U T ;
OUTPUT      : O U T P U T ;
PRINT       : P R I N T ;
IF          : I F ;
THEN        : T H E N ;
ELSE        : E L S E ;
ELSEIF      : E L S E I F ;
ENDIF       : E N D I F ;
CASE        : C A S E ;
OF          : O F ;
OTHERWISE   : O T H E R W I S E ;
ENDCASE     : E N D C A S E ;
FOR         : F O R ;
TO          : T O ;
STEP        : S T E P ;
NEXT        : N E X T ;
WHILE       : W H I L E ;
DO          : D O ;
ENDWHILE    : E N D W H I L E ;
REPEAT      : R E P E A T ;
UNTIL       : U N T I L ;
PROCEDURE   : P R O C E D U R E ;
ENDPROCEDURE: E N D P R O C E D U R E ;
FUNCTION    : F U N C T I O N ;
ENDFUNCTION : E N D F U N C T I O N ;
RETURNS     : R E T U R N S ;
RETURN      : R E T U R N ;
CALL        : C A L L ;
ARRAY       : A R R A Y ;
AND         : A N D ;
OR          : O R ;
NOT         : N O T ;
TRUE        : T R U E ;
FALSE       : F A L S E ;
MOD         : M O D ;
DIV         : D I V ;
OPENFILE    : O P E N F I L E ;
READFILE    : R E A D F I L E ;
WRITEFILE   : W R I T E F I L E ;
CLOSEFILE   : C L O S E F I L E ;
READ_MODE   : R E A D ;
WRITE_MODE  : W R I T E ;
APPEND_MODE : A P P E N D ;

// Data type keywords
INTEGER_TYPE : I N T E G E R ;
REAL_TYPE    : R E A L ;
CHAR_TYPE    : C H A R ;
STRING_TYPE  : S T R I N G ;
BOOLEAN_TYPE : B O O L E A N ;

// Operators and punctuation
LARROW      : '<-' | '\u2190' ;
EQUALS      : '=' ;
NOTEQUAL    : '<>' ;
LTE         : '<=' ;
GTE         : '>=' ;
LT          : '<' ;
GT          : '>' ;
PLUS        : '+' ;
MINUS       : '-' ;
STAR        : '*' ;
SLASH       : '/' ;
CARET       : '^' ;
AMPERSAND   : '&' ;
LPAREN      : '(' ;
RPAREN      : ')' ;
LBRACKET    : '[' ;
RBRACKET    : ']' ;
COMMA       : ',' ;
COLON       : ':' ;

// Literals
REAL_LITERAL    : DIGIT+ '.' DIGIT+ ;
INTEGER_LITERAL : DIGIT+ ;
STRING_LITERAL  : '"' (~["\r\n])* '"' ;
CHAR_LITERAL    : '\'' (~['\r\n]) '\'' ;

// Identifiers
IDENTIFIER  : LETTER (LETTER | DIGIT | '_')* ;

// Whitespace and comments
NEWLINE     : '\r'? '\n' ;
WS          : [ \t]+ -> skip ;
LINE_COMMENT: '//' ~[\r\n]* -> skip ;

// ─── Fragments ──────────────────────────────────────────────────────────────

fragment DIGIT  : [0-9] ;
fragment LETTER : [a-zA-Z] ;
fragment A : [aA] ; fragment B : [bB] ; fragment C : [cC] ; fragment D : [dD] ;
fragment E : [eE] ; fragment F : [fF] ; fragment G : [gG] ; fragment H : [hH] ;
fragment I : [iI] ; fragment J : [jJ] ; fragment K : [kK] ; fragment L : [lL] ;
fragment M : [mM] ; fragment N : [nN] ; fragment O : [oO] ; fragment P : [pP] ;
fragment Q : [qQ] ; fragment R : [rR] ; fragment S : [sS] ; fragment T : [tT] ;
fragment U : [uU] ; fragment V : [vV] ; fragment W : [wW] ; fragment X : [xX] ;
fragment Y : [yY] ; fragment Z : [zZ] ;
