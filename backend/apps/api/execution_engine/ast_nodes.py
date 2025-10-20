"""
Abstract Syntax Tree (AST) Node Definitions for IGCSE Pseudocode

This module defines all AST node classes that represent the structure
of parsed pseudocode. Each node type corresponds to a language construct.
"""

from typing import List, Optional, Any
from dataclasses import dataclass


@dataclass
class ASTNode:
    """Base class for all AST nodes"""
    line: int
    column: int


# ============================================================================
# Program Structure
# ============================================================================

@dataclass
class Program(ASTNode):
    """Root node representing the entire program"""
    statements: List[ASTNode]


# ============================================================================
# Declarations
# ============================================================================

@dataclass
class Declaration(ASTNode):
    """Variable declaration: DECLARE x : INTEGER"""
    name: str
    type_: str
    is_array: bool = False
    dimensions: Optional[List[Any]] = None  # For arrays: [1:10] or [1:10, 1:5]


@dataclass
class ConstantDeclaration(ASTNode):
    """Constant declaration: CONSTANT PI = 3.14"""
    name: str
    value: Any


# ============================================================================
# Expressions
# ============================================================================

@dataclass
class NumberLiteral(ASTNode):
    """Numeric literal: 42, 3.14"""
    value: float


@dataclass
class StringLiteral(ASTNode):
    """String literal: "Hello World" """
    value: str


@dataclass
class BooleanLiteral(ASTNode):
    """Boolean literal: TRUE, FALSE"""
    value: bool


@dataclass
class Identifier(ASTNode):
    """Variable or function name"""
    name: str


@dataclass
class BinaryOp(ASTNode):
    """Binary operation: a + b, x * y"""
    operator: str  # +, -, *, /, MOD, DIV, AND, OR, etc.
    left: ASTNode
    right: ASTNode


@dataclass
class UnaryOp(ASTNode):
    """Unary operation: -x, NOT flag"""
    operator: str  # -, NOT
    operand: ASTNode


@dataclass
class Comparison(ASTNode):
    """Comparison: a = b, x < y"""
    operator: str  # =, <>, <, >, <=, >=
    left: ASTNode
    right: ASTNode


@dataclass
class ArrayAccess(ASTNode):
    """Array access: arr[i] or arr[i, j]"""
    name: str
    indices: List[ASTNode]


@dataclass
class FunctionCall(ASTNode):
    """Function call: LENGTH(str), ROUND(x, 2)"""
    name: str
    arguments: List[ASTNode]


# ============================================================================
# Statements
# ============================================================================

@dataclass
class Assignment(ASTNode):
    """Assignment: x = 5 or x <- 5"""
    target: ASTNode  # Can be Identifier or ArrayAccess
    value: ASTNode


@dataclass
class Input(ASTNode):
    """Input statement: INPUT x"""
    variable: ASTNode  # Can be Identifier or ArrayAccess


@dataclass
class Output(ASTNode):
    """Output statement: OUTPUT "Result:", x"""
    expressions: List[ASTNode]


# ============================================================================
# Control Flow - Conditionals
# ============================================================================

@dataclass
class IfStatement(ASTNode):
    """
    If statement:
    IF condition THEN
        statements
    ENDIF
    """
    condition: ASTNode
    then_body: List[ASTNode]
    elif_parts: Optional[List['ElifPart']] = None
    else_body: Optional[List[ASTNode]] = None


@dataclass
class ElifPart(ASTNode):
    """ELSEIF part of an if statement"""
    condition: ASTNode
    body: List[ASTNode]


@dataclass
class CaseStatement(ASTNode):
    """
    Case statement:
    CASE OF variable
        value1: statements
        value2: statements
        OTHERWISE: statements
    ENDCASE
    """
    expression: ASTNode
    cases: List['CaseBranch']
    otherwise: Optional[List[ASTNode]] = None


@dataclass
class CaseBranch(ASTNode):
    """Single branch in a case statement"""
    value: ASTNode
    body: List[ASTNode]


# ============================================================================
# Control Flow - Loops
# ============================================================================

@dataclass
class ForLoop(ASTNode):
    """
    For loop:
    FOR i = 1 TO 10 STEP 1
        statements
    NEXT i
    """
    variable: str
    start: ASTNode
    end: ASTNode
    step: Optional[ASTNode] = None
    body: List[ASTNode] = None


@dataclass
class WhileLoop(ASTNode):
    """
    While loop:
    WHILE condition DO
        statements
    ENDWHILE
    """
    condition: ASTNode
    body: List[ASTNode]


@dataclass
class RepeatUntilLoop(ASTNode):
    """
    Repeat-until loop:
    REPEAT
        statements
    UNTIL condition
    """
    body: List[ASTNode]
    condition: ASTNode


# ============================================================================
# Functions and Procedures
# ============================================================================

@dataclass
class Parameter:
    """Function/procedure parameter"""
    name: str
    type_: str
    by_ref: bool = False  # BYREF vs BYVAL


@dataclass
class ProcedureDeclaration(ASTNode):
    """
    Procedure declaration:
    PROCEDURE MyProc(x : INTEGER, BYREF y : REAL)
        statements
    ENDPROCEDURE
    """
    name: str
    parameters: List[Parameter]
    body: List[ASTNode]


@dataclass
class FunctionDeclaration(ASTNode):
    """
    Function declaration:
    FUNCTION Add(a : INTEGER, b : INTEGER) RETURNS INTEGER
        statements
        RETURN result
    ENDFUNCTION
    """
    name: str
    parameters: List[Parameter]
    return_type: str
    body: List[ASTNode]


@dataclass
class ReturnStatement(ASTNode):
    """Return statement: RETURN value"""
    value: ASTNode


@dataclass
class CallStatement(ASTNode):
    """Procedure call: CALL MyProc(x, y)"""
    name: str
    arguments: List[ASTNode]


# ============================================================================
# File Operations
# ============================================================================

@dataclass
class OpenFile(ASTNode):
    """OPENFILE filename FOR mode"""
    filename: ASTNode
    mode: str  # READ, WRITE, APPEND


@dataclass
class ReadFile(ASTNode):
    """READFILE filename, variable"""
    filename: ASTNode
    variable: ASTNode


@dataclass
class WriteFile(ASTNode):
    """WRITEFILE filename, data"""
    filename: ASTNode
    data: ASTNode


@dataclass
class CloseFile(ASTNode):
    """CLOSEFILE filename"""
    filename: ASTNode


# ============================================================================
# Special Nodes
# ============================================================================

@dataclass
class Comment(ASTNode):
    """Comment node (usually filtered out)"""
    text: str


@dataclass
class EmptyStatement(ASTNode):
    """Empty statement (placeholder)"""
    pass
