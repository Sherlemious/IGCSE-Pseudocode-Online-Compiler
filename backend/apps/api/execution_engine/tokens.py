"""
Token definitions for IGCSE Pseudocode Parser

This module defines all token types used in the lexer and parser.
Tokens represent the basic building blocks of the pseudocode language.
"""

from enum import Enum, auto


class TokenType(Enum):
    """Enumeration of all token types in IGCSE Pseudocode"""

    # Keywords - Control Flow
    IF = auto()
    THEN = auto()
    ELSE = auto()
    ELSEIF = auto()
    ENDIF = auto()

    FOR = auto()
    TO = auto()
    STEP = auto()
    NEXT = auto()

    WHILE = auto()
    DO = auto()
    ENDWHILE = auto()

    REPEAT = auto()
    UNTIL = auto()

    CASE = auto()
    OF = auto()
    OTHERWISE = auto()
    ENDCASE = auto()

    # Keywords - Declarations
    DECLARE = auto()
    CONSTANT = auto()

    # Keywords - Functions and Procedures
    PROCEDURE = auto()
    FUNCTION = auto()
    ENDPROCEDURE = auto()
    ENDFUNCTION = auto()
    RETURNS = auto()
    RETURN = auto()
    CALL = auto()
    BYREF = auto()
    BYVAL = auto()

    # Keywords - I/O
    INPUT = auto()
    OUTPUT = auto()
    PRINT = auto()

    # Keywords - File Operations
    OPENFILE = auto()
    READFILE = auto()
    WRITEFILE = auto()
    CLOSEFILE = auto()
    READ = auto()
    WRITE = auto()
    APPEND = auto()

    # Keywords - Boolean Operators
    AND = auto()
    OR = auto()
    NOT = auto()

    # Keywords - Boolean Literals
    TRUE = auto()
    FALSE = auto()

    # Keywords - Arithmetic Operators (word-based)
    MOD = auto()
    DIV = auto()

    # Operators - Arithmetic
    PLUS = auto()          # +
    MINUS = auto()         # -
    MULTIPLY = auto()      # *
    DIVIDE = auto()        # /
    POWER = auto()         # ^

    # Operators - Comparison
    EQUALS = auto()        # =
    NOT_EQUALS = auto()    # <> or ><
    LESS_THAN = auto()     # <
    GREATER_THAN = auto()  # >
    LESS_EQUAL = auto()    # <=
    GREATER_EQUAL = auto() # >=

    # Operators - Assignment
    ASSIGN = auto()        # ← or =

    # Operators - String
    AMPERSAND = auto()     # & (string concatenation)

    # Delimiters
    LPAREN = auto()        # (
    RPAREN = auto()        # )
    LBRACKET = auto()      # [
    RBRACKET = auto()      # ]
    COMMA = auto()         # ,
    COLON = auto()         # :
    DOT = auto()           # .

    # Literals
    NUMBER = auto()        # Integer or float
    STRING = auto()        # String literal
    BOOLEAN = auto()       # TRUE or FALSE

    # Identifiers
    IDENTIFIER = auto()    # Variable names, function names, etc.

    # Data Types (for DECLARE statements)
    INTEGER = auto()
    REAL = auto()
    STRING_TYPE = auto()
    BOOLEAN_TYPE = auto()
    CHAR = auto()
    DATE = auto()
    ARRAY = auto()

    # Built-in Functions
    LENGTH = auto()
    LCASE = auto()
    UCASE = auto()
    SUBSTRING = auto()
    ROUND = auto()
    RANDOM = auto()
    INT_FUNC = auto()

    # Special
    NEWLINE = auto()
    EOF = auto()
    COMMENT = auto()


# Reserved keywords mapping (case-insensitive)
KEYWORDS = {
    # Control Flow
    'IF': TokenType.IF,
    'THEN': TokenType.THEN,
    'ELSE': TokenType.ELSE,
    'ELSEIF': TokenType.ELSEIF,
    'ENDIF': TokenType.ENDIF,

    'FOR': TokenType.FOR,
    'TO': TokenType.TO,
    'STEP': TokenType.STEP,
    'NEXT': TokenType.NEXT,

    'WHILE': TokenType.WHILE,
    'DO': TokenType.DO,
    'ENDWHILE': TokenType.ENDWHILE,

    'REPEAT': TokenType.REPEAT,
    'UNTIL': TokenType.UNTIL,

    'CASE': TokenType.CASE,
    'OF': TokenType.OF,
    'OTHERWISE': TokenType.OTHERWISE,
    'ENDCASE': TokenType.ENDCASE,

    # Declarations
    'DECLARE': TokenType.DECLARE,
    'CONSTANT': TokenType.CONSTANT,

    # Functions and Procedures
    'PROCEDURE': TokenType.PROCEDURE,
    'FUNCTION': TokenType.FUNCTION,
    'ENDPROCEDURE': TokenType.ENDPROCEDURE,
    'ENDFUNCTION': TokenType.ENDFUNCTION,
    'RETURNS': TokenType.RETURNS,
    'RETURN': TokenType.RETURN,
    'CALL': TokenType.CALL,
    'BYREF': TokenType.BYREF,
    'BYVAL': TokenType.BYVAL,

    # I/O
    'INPUT': TokenType.INPUT,
    'OUTPUT': TokenType.OUTPUT,
    'PRINT': TokenType.PRINT,

    # File Operations
    'OPENFILE': TokenType.OPENFILE,
    'READFILE': TokenType.READFILE,
    'WRITEFILE': TokenType.WRITEFILE,
    'CLOSEFILE': TokenType.CLOSEFILE,
    'READ': TokenType.READ,
    'WRITE': TokenType.WRITE,
    'APPEND': TokenType.APPEND,

    # Boolean Operators
    'AND': TokenType.AND,
    'OR': TokenType.OR,
    'NOT': TokenType.NOT,

    # Boolean Literals
    'TRUE': TokenType.TRUE,
    'FALSE': TokenType.FALSE,

    # Arithmetic Operators
    'MOD': TokenType.MOD,
    'DIV': TokenType.DIV,

    # Data Types
    'INTEGER': TokenType.INTEGER,
    'REAL': TokenType.REAL,
    'STRING': TokenType.STRING_TYPE,
    'BOOLEAN': TokenType.BOOLEAN_TYPE,
    'CHAR': TokenType.CHAR,
    'DATE': TokenType.DATE,
    'ARRAY': TokenType.ARRAY,

    # Built-in Functions
    'LENGTH': TokenType.LENGTH,
    'LCASE': TokenType.LCASE,
    'UCASE': TokenType.UCASE,
    'SUBSTRING': TokenType.SUBSTRING,
    'ROUND': TokenType.ROUND,
    'RANDOM': TokenType.RANDOM,
    'INT': TokenType.INT_FUNC,
}


class Token:
    """Represents a single token in the source code"""

    def __init__(self, type_: TokenType, value: any, line: int, column: int):
        """
        Initialize a token

        Args:
            type_: The type of the token
            value: The actual value of the token
            line: The line number where the token appears
            column: The column number where the token starts
        """
        self.type = type_
        self.value = value
        self.line = line
        self.column = column

    def __repr__(self):
        return f"Token({self.type}, {self.value!r}, {self.line}:{self.column})"

    def __str__(self):
        return f"{self.type.name}({self.value})"
