"""
Error Handling for IGCSE Pseudocode Compiler

This module provides custom exception classes and error formatting
to give users clear, helpful error messages with line numbers and context.
"""

from typing import Optional


class CompilerError(Exception):
    """Base class for all compiler errors"""

    def __init__(self, message: str, line: Optional[int] = None,
                 column: Optional[int] = None, source_line: Optional[str] = None):
        self.message = message
        self.line = line
        self.column = column
        self.source_line = source_line
        super().__init__(self.format_error())

    def format_error(self) -> str:
        """Format error message with line and column information"""
        if self.line is not None:
            error = f"Error at line {self.line}"
            if self.column is not None:
                error += f", column {self.column}"
            error += f": {self.message}"

            if self.source_line:
                error += f"\n  {self.source_line}"
                if self.column is not None:
                    # Add a pointer to the error location
                    error += f"\n  {' ' * (self.column - 1)}^"

            return error
        else:
            return f"Error: {self.message}"


class LexerError(CompilerError):
    """Error during lexical analysis (tokenization)"""
    pass


class ParseError(CompilerError):
    """Error during parsing (syntax error)"""
    pass


class SemanticError(CompilerError):
    """Error during semantic analysis (type checking, scope, etc.)"""
    pass


class CodeGenerationError(CompilerError):
    """Error during code generation"""
    pass


class UndeclaredVariableError(SemanticError):
    """Variable used without declaration"""

    def __init__(self, variable_name: str, line: int, column: int):
        message = f"Variable '{variable_name}' is used but not declared"
        super().__init__(message, line, column)


class TypeMismatchError(SemanticError):
    """Type mismatch in operation or assignment"""

    def __init__(self, expected: str, got: str, line: int, column: int):
        message = f"Type mismatch: expected {expected}, got {got}"
        super().__init__(message, line, column)


class ArrayIndexError(SemanticError):
    """Invalid array index or dimension"""

    def __init__(self, array_name: str, message: str, line: int, column: int):
        full_message = f"Array '{array_name}': {message}"
        super().__init__(full_message, line, column)


class DuplicateDeclarationError(SemanticError):
    """Variable or function declared multiple times"""

    def __init__(self, name: str, line: int, column: int):
        message = f"'{name}' is already declared"
        super().__init__(message, line, column)


class FunctionError(SemanticError):
    """Error related to function/procedure"""

    def __init__(self, function_name: str, message: str, line: int, column: int):
        full_message = f"Function '{function_name}': {message}"
        super().__init__(full_message, line, column)


def format_lark_error(error: Exception, source_code: str) -> str:
    """
    Format Lark parsing errors into user-friendly messages

    Args:
        error: The Lark exception
        source_code: The original pseudocode

    Returns:
        Formatted error message
    """
    from lark.exceptions import (
        UnexpectedToken,
        UnexpectedCharacters,
        UnexpectedEOF,
        ParseError as LarkParseError
    )

    lines = source_code.split('\n')

    if isinstance(error, UnexpectedToken):
        line = error.line
        column = error.column
        expected = error.expected
        token = error.token

        # Get the source line
        source_line = lines[line - 1] if 0 < line <= len(lines) else ""

        message = f"Unexpected token '{token}'"
        if expected:
            expected_str = ", ".join(expected[:5])  # Show first 5 expected tokens
            if len(expected) > 5:
                expected_str += "..."
            message += f" (expected: {expected_str})"

        return ParseError(message, line, column, source_line).format_error()

    elif isinstance(error, UnexpectedCharacters):
        line = error.line
        column = error.column
        source_line = lines[line - 1] if 0 < line <= len(lines) else ""

        message = f"Unexpected character(s)"
        return LexerError(message, line, column, source_line).format_error()

    elif isinstance(error, UnexpectedEOF):
        # End of file reached unexpectedly
        line = len(lines)
        message = "Unexpected end of file. Did you forget to close a block (ENDIF, ENDWHILE, etc.)?"
        return ParseError(message, line).format_error()

    elif isinstance(error, LarkParseError):
        # Generic parse error
        message = str(error)
        return ParseError(message).format_error()

    else:
        # Unknown error
        return f"Compilation error: {str(error)}"


def get_error_suggestions(error: CompilerError) -> list:
    """
    Get helpful suggestions based on the error type

    Args:
        error: The compiler error

    Returns:
        List of suggestion strings
    """
    suggestions = []

    error_msg = error.message.lower()

    # Common mistakes and suggestions
    if "unexpected token" in error_msg:
        suggestions.append("Check for missing keywords (THEN, DO, ENDIF, ENDWHILE, etc.)")
        suggestions.append("Ensure all parentheses and brackets are balanced")

    if "undeclared" in error_msg or "not declared" in error_msg:
        suggestions.append("Use DECLARE to declare variables before using them")
        suggestions.append("Check spelling of variable names (pseudocode is case-insensitive)")

    if "type mismatch" in error_msg:
        suggestions.append("Check that variables are used consistently with their declared types")
        suggestions.append("Ensure operations are valid for the data types involved")

    if "array" in error_msg:
        suggestions.append("Arrays in IGCSE pseudocode are 1-indexed (start at 1, not 0)")
        suggestions.append("Declare arrays with: DECLARE arr : ARRAY[1:10] OF INTEGER")

    if "end of file" in error_msg or "eof" in error_msg:
        suggestions.append("Check that all control structures are properly closed:")
        suggestions.append("  - IF must have ENDIF")
        suggestions.append("  - WHILE must have ENDWHILE")
        suggestions.append("  - FOR must have NEXT")
        suggestions.append("  - PROCEDURE must have ENDPROCEDURE")
        suggestions.append("  - FUNCTION must have ENDFUNCTION")
        suggestions.append("  - CASE must have ENDCASE")

    if "function" in error_msg or "procedure" in error_msg:
        suggestions.append("Functions must have a RETURN statement")
        suggestions.append("Procedures are called with CALL, functions are used in expressions")

    return suggestions


def format_error_with_suggestions(error: CompilerError) -> dict:
    """
    Format error as a dictionary with suggestions

    Args:
        error: The compiler error

    Returns:
        Dictionary with error message and suggestions
    """
    suggestions = get_error_suggestions(error)

    return {
        "error": error.format_error(),
        "line": error.line,
        "column": error.column,
        "suggestions": suggestions
    }
