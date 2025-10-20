"""
IGCSE Pseudocode Compiler - Main Module

This module orchestrates the compilation process:
1. Parsing pseudocode using Lark
2. Transforming Lark tree to AST
3. Generating Python code from AST
"""

from lark import Lark, Transformer, Token, Tree
from lark.exceptions import LarkError
from typing import List, Optional, Union
import ast_nodes as nodes
from grammar import PSEUDOCODE_GRAMMAR
from codegen import PythonCodeGenerator
from errors import (
    CompilerError, ParseError, format_lark_error,
    format_error_with_suggestions
)


class ASTTransformer(Transformer):
    """
    Transforms Lark parse tree into our custom AST nodes

    Lark calls the methods based on the rule names in the grammar.
    Each method receives the children of that rule and returns an AST node.
    """

    def __init__(self):
        super().__init__()
        self.current_line = 1

    # ========================================================================
    # Program Structure
    # ========================================================================

    def program(self, items):
        """Transform program rule"""
        # Filter out None values (empty statements, newlines, etc.)
        statements = [item for item in items if item is not None and not isinstance(item, Token)]
        return nodes.Program(statements=statements, line=1, column=1)

    # ========================================================================
    # Declarations
    # ========================================================================

    def declaration(self, items):
        """DECLARE x : INTEGER"""
        name = str(items[0])
        type_spec = items[1]

        if isinstance(type_spec, tuple):
            # Array type
            is_array, dimensions, base_type = type_spec
            return nodes.Declaration(
                name=name,
                type_=base_type,
                is_array=is_array,
                dimensions=dimensions,
                line=1, column=1
            )
        else:
            # Simple type
            return nodes.Declaration(
                name=name,
                type_=type_spec,
                is_array=False,
                line=1, column=1
            )

    def constant_declaration(self, items):
        """CONSTANT PI = 3.14"""
        name = str(items[0])
        value = items[1]
        return nodes.ConstantDeclaration(name=name, value=value, line=1, column=1)

    def simple_type(self, items):
        """INTEGER, REAL, STRING, etc."""
        return str(items[0]).upper()

    def array_type(self, items):
        """ARRAY[1:10] OF INTEGER"""
        # items contains: dimensions + base_type
        base_type = str(items[-1]).upper()
        dimensions = items[:-1]  # All items except the last one
        return (True, dimensions, base_type)  # (is_array, dimensions, base_type)

    def array_dimension(self, items):
        """1:10"""
        start = int(items[0])
        end = int(items[1])
        return (start, end)

    # ========================================================================
    # Expressions
    # ========================================================================

    def logical_or(self, items):
        """a OR b"""
        if len(items) == 1:
            return items[0]
        result = items[0]
        for i in range(1, len(items)):
            result = nodes.BinaryOp(operator="OR", left=result, right=items[i], line=1, column=1)
        return result

    def logical_and(self, items):
        """a AND b"""
        if len(items) == 1:
            return items[0]
        result = items[0]
        for i in range(1, len(items)):
            result = nodes.BinaryOp(operator="AND", left=result, right=items[i], line=1, column=1)
        return result

    def unary_not(self, items):
        """NOT a (old grammar)"""
        return nodes.UnaryOp(operator="NOT", operand=items[0], line=1, column=1)

    def not_op(self, items):
        """NOT a (new grammar)"""
        return nodes.UnaryOp(operator="NOT", operand=items[0], line=1, column=1)

    def neg(self, items):
        """-x (new grammar)"""
        return nodes.UnaryOp(operator="-", operand=items[0], line=1, column=1)

    def pos(self, items):
        """+x (new grammar)"""
        return nodes.UnaryOp(operator="+", operand=items[0], line=1, column=1)

    def comparison(self, items):
        """a = b, a < b, etc."""
        if len(items) == 1:
            return items[0]
        left = items[0]
        op = str(items[1])
        right = items[2]
        return nodes.Comparison(operator=op, left=left, right=right, line=1, column=1)

    def comp_op(self, items):
        """Comparison operator"""
        return str(items[0])

    def additive(self, items):
        """a + b, a - b"""
        if len(items) == 1:
            return items[0]
        result = items[0]
        i = 1
        while i < len(items):
            op = str(items[i])
            result = nodes.BinaryOp(operator=op, left=result, right=items[i+1], line=1, column=1)
            i += 2
        return result

    def multiplicative(self, items):
        """a * b, a / b, a MOD b"""
        if len(items) == 1:
            return items[0]
        result = items[0]
        i = 1
        while i < len(items):
            op = str(items[i])
            result = nodes.BinaryOp(operator=op, left=result, right=items[i+1], line=1, column=1)
            i += 2
        return result

    def power(self, items):
        """a ^ b"""
        if len(items) == 1:
            return items[0]
        # Right-associative: a^b^c = a^(b^c)
        result = items[-1]
        for i in range(len(items) - 2, -1, -1):
            result = nodes.BinaryOp(operator="^", left=items[i], right=result, line=1, column=1)
        return result

    def unary_minus(self, items):
        """-x"""
        return nodes.UnaryOp(operator="-", operand=items[0], line=1, column=1)

    def unary_plus(self, items):
        """+x"""
        return nodes.UnaryOp(operator="+", operand=items[0], line=1, column=1)

    def number(self, items):
        """Numeric literal"""
        value = float(items[0])
        return nodes.NumberLiteral(value=value, line=1, column=1)

    def string(self, items):
        """String literal"""
        # Remove quotes
        value = str(items[0])[1:-1]
        return nodes.StringLiteral(value=value, line=1, column=1)

    def true(self, items):
        """TRUE"""
        return nodes.BooleanLiteral(value=True, line=1, column=1)

    def false(self, items):
        """FALSE"""
        return nodes.BooleanLiteral(value=False, line=1, column=1)

    def identifier(self, items):
        """Variable name"""
        return nodes.Identifier(name=str(items[0]), line=1, column=1)

    def paren_expr(self, items):
        """Parenthesized expression - just return the inner expression"""
        return items[0]

    def ident(self, items):
        """Identifier in expression (from new grammar)"""
        return nodes.Identifier(name=str(items[0]), line=1, column=1)

    # ========================================================================
    # Function Calls and Array Access (new grammar names)
    # ========================================================================

    def func_call(self, items):
        """Function call from new grammar: func(a, b, c)"""
        name = str(items[0])
        # Remaining items are the arguments
        args = [item for item in items[1:] if item is not None]
        return nodes.FunctionCall(name=name, arguments=args, line=1, column=1)

    def arr_access(self, items):
        """Array access from new grammar: arr[i] or arr[i, j]"""
        name = str(items[0])
        # Remaining items are the indices
        indices = [item for item in items[1:] if item is not None]
        return nodes.ArrayAccess(name=name, indices=indices, line=1, column=1)

    # Old grammar support (kept for compatibility)
    def function_call(self, items):
        """func(a, b, c)"""
        name = str(items[0])
        # items[1] will be the arguments list if present
        args = items[1] if len(items) > 1 else []
        return nodes.FunctionCall(name=name, arguments=args, line=1, column=1)

    def arguments(self, items):
        """Argument list for function calls"""
        return list(items)

    def array_access(self, items):
        """arr[i] or arr[i, j]"""
        name = str(items[0])
        # items[1] will be the indices list
        indices = items[1] if len(items) > 1 else []
        return nodes.ArrayAccess(name=name, indices=indices, line=1, column=1)

    def indices(self, items):
        """Index list for array access"""
        return list(items)

    # ========================================================================
    # Statements
    # ========================================================================

    def assignment(self, items):
        """x = 5"""
        target = items[0]
        value = items[1]
        return nodes.Assignment(target=target, value=value, line=1, column=1)

    def input_statement(self, items):
        """INPUT x (old grammar)"""
        variable = items[0]
        return nodes.Input(variable=variable, line=1, column=1)

    def input_stmt(self, items):
        """INPUT x (new grammar)"""
        # Skip the INPUT keyword token, get the variable
        variable = [item for item in items if not isinstance(item, Token)][0]
        return nodes.Input(variable=variable, line=1, column=1)

    def output_statement(self, items):
        """OUTPUT "Hello", x (old grammar)"""
        expressions = items
        return nodes.Output(expressions=expressions, line=1, column=1)

    def output_stmt(self, items):
        """OUTPUT "Hello", x (new grammar)"""
        # Filter out keyword tokens, keep only expressions
        expressions = [item for item in items if not isinstance(item, Token)]
        return nodes.Output(expressions=expressions, line=1, column=1)

    # ========================================================================
    # Control Flow - Conditionals
    # ========================================================================

    def if_statement(self, items):
        """IF condition THEN ... ENDIF"""
        condition = items[0]

        # Find elif and else parts
        then_body = []
        elif_parts = []
        else_body = None

        current_section = "then"

        for item in items[1:]:
            if isinstance(item, nodes.ElifPart):
                current_section = "elif"
                elif_parts.append(item)
            elif isinstance(item, list):  # else_part returns a list
                current_section = "else"
                else_body = item
            elif current_section == "then":
                then_body.append(item)

        return nodes.IfStatement(
            condition=condition,
            then_body=then_body,
            elif_parts=elif_parts if elif_parts else None,
            else_body=else_body,
            line=1, column=1
        )

    def elif_part(self, items):
        """ELSEIF condition THEN ..."""
        condition = items[0]
        body = items[1:]
        return nodes.ElifPart(condition=condition, body=body, line=1, column=1)

    def else_part(self, items):
        """ELSE ..."""
        return items  # Return body as list

    def case_statement(self, items):
        """CASE OF x ... ENDCASE"""
        expression = items[0]

        cases = []
        otherwise = None

        for item in items[1:]:
            if isinstance(item, nodes.CaseBranch):
                cases.append(item)
            elif isinstance(item, list):  # otherwise_part
                otherwise = item

        return nodes.CaseStatement(
            expression=expression,
            cases=cases,
            otherwise=otherwise,
            line=1, column=1
        )

    def case_branch(self, items):
        """value: statements"""
        value = items[0]
        body = items[1:]
        return nodes.CaseBranch(value=value, body=body, line=1, column=1)

    def otherwise_part(self, items):
        """OTHERWISE: statements"""
        return items  # Return body as list

    # ========================================================================
    # Control Flow - Loops
    # ========================================================================

    def for_loop(self, items):
        """FOR i = 1 TO 10 STEP 1 ... NEXT i"""
        # Filter items: separate tokens from AST nodes
        tokens = [item for item in items if isinstance(item, Token)]
        ast_items = [item for item in items if not isinstance(item, Token)]

        # Extract variable name (first identifier)
        variable = None
        for token in tokens:
            if token.type == 'IDENT':
                variable = str(token)
                break

        # Extract start, end, and optional step from AST items
        # ast_items should contain: [start_expr, end_expr, step_expr (optional), ...body statements]
        start = ast_items[0] if len(ast_items) > 0 else None
        end = ast_items[1] if len(ast_items) > 1 else None

        # Check if STEP keyword is present in tokens
        has_step = any(str(token) == 'STEP' for token in tokens)

        if has_step:
            step = ast_items[2] if len(ast_items) > 2 else None
            body = ast_items[3:] if len(ast_items) > 3 else []
        else:
            step = None
            body = ast_items[2:] if len(ast_items) > 2 else []

        return nodes.ForLoop(
            variable=variable,
            start=start,
            end=end,
            step=step,
            body=body,
            line=1, column=1
        )

    def while_loop(self, items):
        """WHILE condition DO ... ENDWHILE"""
        # Filter out tokens
        ast_items = [item for item in items if not isinstance(item, Token)]
        condition = ast_items[0] if ast_items else None
        body = ast_items[1:] if len(ast_items) > 1 else []
        return nodes.WhileLoop(condition=condition, body=body, line=1, column=1)

    def repeat_until_loop(self, items):
        """REPEAT ... UNTIL condition"""
        # Filter out tokens
        ast_items = [item for item in items if not isinstance(item, Token)]
        # Last item is the condition
        condition = ast_items[-1] if ast_items else None
        body = ast_items[:-1] if len(ast_items) > 1 else []
        return nodes.RepeatUntilLoop(body=body, condition=condition, line=1, column=1)

    def repeat_loop(self, items):
        """REPEAT ... UNTIL condition (new grammar name)"""
        return self.repeat_until_loop(items)

    # ========================================================================
    # Functions and Procedures
    # ========================================================================

    def procedure_declaration(self, items):
        """PROCEDURE name(params) ... ENDPROCEDURE"""
        name = str(items[0])

        # Find where parameters end and body begins
        params = []
        body = []
        in_body = False

        for item in items[1:]:
            if isinstance(item, nodes.Parameter):
                params.append(item)
            else:
                in_body = True

            if in_body and not isinstance(item, nodes.Parameter):
                body.append(item)

        return nodes.ProcedureDeclaration(
            name=name,
            parameters=params,
            body=body,
            line=1, column=1
        )

    def function_declaration(self, items):
        """FUNCTION name(params) RETURNS type ... ENDFUNCTION"""
        name = str(items[0])
        return_type = None
        params = []
        body = []

        for item in items[1:]:
            if isinstance(item, nodes.Parameter):
                params.append(item)
            elif isinstance(item, str):
                return_type = item
            elif item is not None:
                body.append(item)

        return nodes.FunctionDeclaration(
            name=name,
            parameters=params,
            return_type=return_type,
            body=body,
            line=1, column=1
        )

    def parameter(self, items):
        """[BYREF] name : type"""
        by_ref = False

        if len(items) == 3:
            by_ref = str(items[0]).upper() == "BYREF"
            name = str(items[1])
            type_spec = items[2]
        else:
            name = str(items[0])
            type_spec = items[1]

        # Handle array types
        if isinstance(type_spec, tuple):
            _, _, base_type = type_spec
            type_str = base_type
        else:
            type_str = type_spec

        return nodes.Parameter(name=name, type_=type_str, by_ref=by_ref)

    def return_statement(self, items):
        """RETURN value"""
        value = items[0]
        return nodes.ReturnStatement(value=value, line=1, column=1)

    def call_statement(self, items):
        """CALL proc(a, b, c)"""
        name = str(items[0])
        # items[1] will be the arguments list if present
        args = items[1] if len(items) > 1 else []
        return nodes.CallStatement(name=name, arguments=args, line=1, column=1)

    # ========================================================================
    # Comments and Special
    # ========================================================================

    def comment(self, items):
        """// comment"""
        text = str(items[0])[2:].strip()  # Remove // and whitespace
        return nodes.Comment(text=text, line=1, column=1)

    # ========================================================================
    # Handle tokens
    # ========================================================================

    def IDENTIFIER(self, token):
        """Handle identifier token"""
        return str(token)

    def NUMBER(self, token):
        """Handle number token"""
        return str(token)

    def STRING(self, token):
        """Handle string token"""
        return str(token)

    def NEWLINE(self, token):
        """Handle newline - return None to filter it out"""
        return None


class PseudocodeCompiler:
    """
    Main compiler class that orchestrates the compilation process
    """

    def __init__(self, permissive: bool = False):
        """
        Initialize the compiler

        Args:
            permissive: Not used anymore, kept for backwards compatibility
        """
        try:
            self.parser = Lark(
                PSEUDOCODE_GRAMMAR,
                start='program',
                parser='lalr',  # LALR parser for better performance
                maybe_placeholders=False
            )
        except Exception as e:
            raise CompilerError(f"Failed to initialize parser: {str(e)}")

        self.transformer = ASTTransformer()
        self.codegen = PythonCodeGenerator()

    def compile(self, pseudocode: str) -> str:
        """
        Compile pseudocode to Python

        Args:
            pseudocode: IGCSE pseudocode source code

        Returns:
            Generated Python code

        Raises:
            CompilerError: If compilation fails
        """
        try:
            # Step 1: Parse pseudocode into Lark tree
            tree = self.parser.parse(pseudocode)

            # Step 2: Transform Lark tree to AST
            ast = self.transformer.transform(tree)

            # Step 3: Generate Python code from AST
            python_code = self.codegen.generate(ast)

            return python_code

        except LarkError as e:
            # Format Lark errors nicely
            error_msg = format_lark_error(e, pseudocode)
            raise CompilerError(error_msg)

        except CompilerError:
            # Re-raise compiler errors as-is
            raise

        except Exception as e:
            # Catch-all for unexpected errors
            raise CompilerError(f"Unexpected compilation error: {str(e)}")

    def compile_with_errors(self, pseudocode: str) -> dict:
        """
        Compile pseudocode and return result with detailed error information

        Args:
            pseudocode: IGCSE pseudocode source code

        Returns:
            Dictionary with either:
                - {"success": True, "python_code": "..."}
                - {"success": False, "error": "...", "suggestions": [...]}
        """
        try:
            python_code = self.compile(pseudocode)
            return {
                "success": True,
                "python_code": python_code
            }
        except CompilerError as e:
            return {
                "success": False,
                **format_error_with_suggestions(e)
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Unexpected error: {str(e)}",
                "suggestions": []
            }


# Convenience function for quick compilation
def compile_pseudocode(pseudocode: str, permissive: bool = False) -> str:
    """
    Compile pseudocode to Python (convenience function)

    Args:
        pseudocode: IGCSE pseudocode source code
        permissive: Use permissive grammar

    Returns:
        Generated Python code

    Raises:
        CompilerError: If compilation fails
    """
    compiler = PseudocodeCompiler(permissive=permissive)
    return compiler.compile(pseudocode)
