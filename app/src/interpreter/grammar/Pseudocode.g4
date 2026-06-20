grammar Pseudocode;

// Superset grammar covering Cambridge IGCSE (0478) and AS & A Level (9618)
// pseudocode. IGCSE is a subset — every IGCSE program remains valid.

// ─── Parser Rules ───────────────────────────────────────────────────────────

program
    : NEWLINE* (statement (NEWLINE* statement)*)? NEWLINE* EOF
    ;

statement
    : declareStatement
    | constantStatement
    | typeDefinition
    | defineStatement
    | classDeclaration
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
    | methodCallStatement
    | returnStatement
    | openFileStatement
    | readFileStatement
    | writeFileStatement
    | closeFileStatement
    | seekStatement
    | getRecordStatement
    | putRecordStatement
    ;

// ─── DECLARE / CONSTANT ────────────────────────────────────────────────────

declareStatement
    : DECLARE identifierList COLON ARRAY LBRACKET expr COLON expr RBRACKET OF dataType
    | DECLARE identifier COLON ARRAY LBRACKET expr COLON expr COMMA expr COLON expr RBRACKET OF dataType
    | DECLARE identifierList COLON dataType
    ;

identifierList
    : identifier (COMMA identifier)*
    ;

// Variable-name positions accept "soft" keywords: the A Level keywords below are
// reserved only where their construct needs them, so existing student code like
// DECLARE Date : STRING or DECLARE Class : STRING keeps working.
identifier
    : IDENTIFIER
    | TYPE | SET | DATE_TYPE | RANDOM | NEW | CLASS | SEEK | DEFINE
    | INHERITS | PUBLIC | PRIVATE | BYREF | BYVAL | GETRECORD | PUTRECORD
    ;

constantStatement
    : CONSTANT identifier (LARROW | EQUALS) expr
    ;

dataType
    : INTEGER_TYPE
    | REAL_TYPE
    | CHAR_TYPE
    | STRING_TYPE
    | BOOLEAN_TYPE
    | DATE_TYPE
    | ARRAY (LBRACKET expr COLON expr (COMMA expr COLON expr)? RBRACKET)? OF dataType
    | IDENTIFIER
    ;

// ─── User-defined types (A Level) ──────────────────────────────────────────

typeDefinition
    : TYPE IDENTIFIER EQUALS LPAREN identifierList RPAREN                  # enumTypeDef
    | TYPE IDENTIFIER EQUALS CARET dataType                                # pointerTypeDef
    | TYPE IDENTIFIER EQUALS SET OF dataType                               # setTypeDef
    | TYPE IDENTIFIER NEWLINE+ (declareStatement NEWLINE+)* ENDTYPE        # recordTypeDef
    ;

defineStatement
    : DEFINE identifier LPAREN exprList? RPAREN COLON IDENTIFIER
    ;

// ─── Classes (A Level OOP) ─────────────────────────────────────────────────

classDeclaration
    : CLASS IDENTIFIER (INHERITS IDENTIFIER)? NEWLINE+
      (classMember NEWLINE+)*
      ENDCLASS
    ;

classMember
    : (PUBLIC | PRIVATE)? DECLARE? identifierList COLON dataType           # classFieldMember
    | (PUBLIC | PRIVATE)? procedureDeclaration                             # classProcMember
    | (PUBLIC | PRIVATE)? functionDeclaration                              # classFuncMember
    ;

// ─── Designators (variables, array elements, record fields, dereferences) ──

designator
    : (identifier | SUPER) designatorPart*
    ;

designatorPart
    : LBRACKET expr (COMMA expr)* RBRACKET
    | DOT memberName (LPAREN argList? RPAREN)?
    | CARET
    ;

memberName
    : identifier
    ;

// ─── Assignment ─────────────────────────────────────────────────────────────

// Supports: x <- 1   or   x <- 1, y <- 2, z <- 3  (comma-separated on one line)
assignmentStatement
    : singleAssignment (COMMA singleAssignment)*
    ;

singleAssignment
    : designator (LARROW | EQUALS) expr
    ;

// ─── INPUT / OUTPUT ─────────────────────────────────────────────────────────

inputStatement
    : INPUT designator (COMMA STRING_LITERAL)?
    ;

outputStatement
    : (OUTPUT | PRINT) exprList
    ;

exprList
    : expr (COMMA expr)*
    ;

// ─── IF / ELSE ──────────────────────────────────────────────────────────────

// An else-if branch may be written ELSEIF (one word) or ELSE IF (two words, on the
// same line). ELSE directly followed by IF chains as an else-if; ELSE on its own line
// followed by a nested IF stays an ordinary ELSE block (matched by the optional ELSE
// below), so both styles keep working.
ifStatement
    : IF expr NEWLINE* THEN? NEWLINE* block
      (NEWLINE* (ELSEIF | ELSE IF) expr NEWLINE* THEN? NEWLINE* block)*
      (NEWLINE* ELSE NEWLINE* block)?
      NEWLINE* ENDIF
    ;

// ─── CASE / OTHERWISE ──────────────────────────────────────────────────────

caseStatement
    : CASE OF designator NEWLINE*
      caseClause+
      (OTHERWISE COLON? NEWLINE* block NEWLINE*)?
      NEWLINE* ENDCASE
    ;

caseClause
    : caseLabel (COMMA caseLabel)* COLON NEWLINE* block NEWLINE*
    ;

caseLabel
    : expr (TO expr)?
    ;

// ─── FOR / NEXT ─────────────────────────────────────────────────────────────

forStatement
    : FOR identifier (LARROW | EQUALS) expr TO expr (STEP expr)? NEWLINE* block NEWLINE* NEXT identifier
    ;

// ─── WHILE / ENDWHILE ──────────────────────────────────────────────────────

whileStatement
    : WHILE expr DO? NEWLINE* block NEWLINE* ENDWHILE
    ;

// ─── REPEAT / UNTIL ─────────────────────────────────────────────────────────

repeatStatement
    : REPEAT NEWLINE* block NEWLINE* UNTIL expr
    ;

// ─── PROCEDURE / FUNCTION ───────────────────────────────────────────────────

procedureDeclaration
    : PROCEDURE identifier LPAREN paramList? RPAREN NEWLINE* block NEWLINE* ENDPROCEDURE
    ;

functionDeclaration
    : FUNCTION identifier LPAREN paramList? RPAREN RETURNS dataType NEWLINE* block NEWLINE* ENDFUNCTION
    ;

paramList
    : param (COMMA param)*
    ;

param
    : (BYREF | BYVAL)? identifier COLON dataType
    ;

callStatement
    : CALL identifier LPAREN argList? RPAREN
    | CALL methodCall
    ;

methodCall
    : (identifier | SUPER) designatorPart* DOT memberName LPAREN argList? RPAREN
    ;

methodCallStatement
    : methodCall
    ;

returnStatement
    : RETURN expr
    ;

// ─── FILE HANDLING ─────────────────────────────────────────────────────────

openFileStatement
    : OPENFILE expr FOR fileMode
    ;

readFileStatement
    : READFILE expr COMMA designator
    ;

writeFileStatement
    : WRITEFILE expr COMMA expr
    ;

closeFileStatement
    : CLOSEFILE expr
    ;

seekStatement
    : SEEK expr COMMA expr
    ;

getRecordStatement
    : GETRECORD expr COMMA designator
    ;

putRecordStatement
    : PUTRECORD expr COMMA designator
    ;

fileMode
    : READ_MODE
    | WRITE_MODE
    | APPEND_MODE
    | RANDOM
    ;

argList
    : expr (COMMA expr)*
    ;

// ─── Block (sequence of statements) ────────────────────────────────────────

// A block may be empty (e.g. an IF branch holding only a comment) — comments are
// skipped by the lexer, and scaffold/starter code often has not-yet-filled bodies.
block
    : (statement (NEWLINE* statement)*)?
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
    | identifier LPAREN argList? RPAREN                 # functionCallAtom
    | NEW IDENTIFIER LPAREN argList? RPAREN             # newInstanceAtom
    | CARET designator                                  # addressOfAtom
    | DIV LPAREN expr COMMA expr RPAREN                 # divFunctionAtom
    | MOD LPAREN expr COMMA expr RPAREN                 # modFunctionAtom
    | designator                                        # designatorAtom
    | INTEGER_LITERAL                                   # integerAtom
    | REAL_LITERAL                                      # realAtom
    | DATE_LITERAL                                      # dateAtom
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
RANDOM      : R A N D O M ;
SEEK        : S E E K ;
GETRECORD   : G E T R E C O R D ;
PUTRECORD   : P U T R E C O R D ;
TYPE        : T Y P E ;
ENDTYPE     : E N D T Y P E ;
SET         : S E T ;
DEFINE      : D E F I N E ;
BYREF       : B Y R E F ;
BYVAL       : B Y V A L ;
CLASS       : C L A S S ;
ENDCLASS    : E N D C L A S S ;
INHERITS    : I N H E R I T S ;
PUBLIC      : P U B L I C ;
PRIVATE     : P R I V A T E ;
NEW         : N E W ;
SUPER       : S U P E R ;

// Data type keywords
INTEGER_TYPE : I N T E G E R ;
REAL_TYPE    : R E A L ;
CHAR_TYPE    : C H A R ;
STRING_TYPE  : S T R I N G ;
BOOLEAN_TYPE : B O O L E A N ;
DATE_TYPE    : D A T E ;

// Operators and punctuation
LARROW      : '<-' | '←' ;
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
DOT         : '.' ;

// Literals
DATE_LITERAL    : DIGIT DIGIT '/' DIGIT DIGIT '/' DIGIT DIGIT DIGIT DIGIT ;
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
