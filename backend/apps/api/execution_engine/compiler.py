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

    def _get_position(self, items, meta=None):
        """
        Extract line and column position from items or meta

        Args:
            items: List of tokens/nodes from Lark
            meta: Optional meta object from Lark Tree

        Returns:
            Tuple of (line, column)
        """
        # Try to get from meta first (most accurate for tree nodes)
        if meta is not None:
            return (getattr(meta, 'line', 1), getattr(meta, 'column', 1))

        # Try to find first token in items
        for item in items:
            if isinstance(item, Token):
                return (item.line, item.column)
            # If item is a Tree, check its meta
            if hasattr(item, 'meta'):
                line = getattr(item.meta, 'line', None)
                column = getattr(item.meta, 'column', None)
                if line is not None and column is not None:
                    return (line, column)

        # Default fallback
        return (1, 1)

    # ========================================================================
    # Program Structure
    # ========================================================================

    def program(self, items):
        """Transform program rule"""
        # Program always starts at line 1, column 1
        line, column = 1, 1
        # Filter out None values (empty statements, newlines, etc.)
        statements = [item for item in items if item is not None and not isinstance(item, Token)]
        return nodes.Program(statements=statements, line=line, column=column)

    # ========================================================================
    # Declarations
    # ========================================================================

    def declaration(self, items):
        """DECLARE x : INTEGER"""
        line, column = self._get_position(items)
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
                line=line, column=column
            )
        else:
            # Simple type
            return nodes.Declaration(
                name=name,
                type_=type_spec,
                is_array=False,
                line=line, column=column
            )

    def constant_declaration(self, items):
        """CONSTANT PI = 3.14"""
        line, column = self._get_position(items)
        name = str(items[0])
        value = items[1]
        return nodes.ConstantDeclaration(name=name, value=value, line=line, column=column)

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
            result = nodes.BinaryOp(operator="OR", left=result, right=items[i], line=line, column=column)
        return result

    def logical_and(self, items):
        """a AND b"""
        line, column = self._get_position(items)
        if len(items) == 1:
            return items[0]
        result = items[0]
        for i in range(1, len(items)):
            result = nodes.BinaryOp(operator="AND", left=result, right=items[i], line=line, column=column)
        return result

    def unary_not(self, items):
        """NOT a (old grammar)"""
        return nodes.UnaryOp(operator="NOT", operand=items[0], line=line, column=column)

    def not_op(self, items):
        """NOT a (new grammar)"""
        line, column = self._get_position(items)
        return nodes.UnaryOp(operator="NOT", operand=items[0], line=line, column=column)

    def neg(self, items):
        """-x (new grammar)"""
        return nodes.UnaryOp(operator="-", operand=items[0], line=line, column=column)

    def pos(self, items):
        """+x (new grammar)"""
        line, column = self._get_position(items)
        return nodes.UnaryOp(operator="+", operand=items[0], line=line, column=column)

    def comparison(self, items):
        """a = b, a < b, etc."""
        line, column = self._get_position(items)
        if len(items) == 1:
            return items[0]
        left = items[0]
        op = str(items[1])
        right = items[2]
        return nodes.Comparison(operator=op, left=left, right=right, line=line, column=column)

    def comp_op(self, items):
        """Comparison operator"""
        line, column = self._get_position(items)
        return str(items[0])

    def additive(self, items):
        """a + b, a - b"""
        if len(items) == 1:
            return items[0]
        result = items[0]
        i = 1
        while i < len(items):
            op = str(items[i])
            result = nodes.BinaryOp(operator=op, left=result, right=items[i+1], line=line, column=column)
            i += 2
        return result

    def multiplicative(self, items):
        """a * b, a / b, a MOD b"""
        line, column = self._get_position(items)
        if len(items) == 1:
            return items[0]
        result = items[0]
        i = 1
        while i < len(items):
            op = str(items[i])
            result = nodes.BinaryOp(operator=op, left=result, right=items[i+1], line=line, column=column)
            i += 2
        return result

    def power(self, items):
        """a ^ b"""
        if len(items) == 1:
            return items[0]
        # Right-associative: a^b^c = a^(b^c)
        result = items[-1]
        for i in range(len(items) - 2, -1, -1):
            result = nodes.BinaryOp(operator="^", left=items[i], right=result, line=line, column=column)
        return result

    def unary_minus(self, items):
        """-x"""
        line, column = self._get_position(items)
        return nodes.UnaryOp(operator="-", operand=items[0], line=line, column=column)

    def unary_plus(self, items):
        """+x"""
        return nodes.UnaryOp(operator="+", operand=items[0], line=line, column=column)

    def number(self, items):
        """Numeric literal"""
        line, column = self._get_position(items)
        value = float(items[0])
        return nodes.NumberLiteral(value=value, line=line, column=column)

    def string(self, items):
        """String literal"""
        line, column = self._get_position(items)
        # Remove quotes
        value = str(items[0])[1:-1]
        return nodes.StringLiteral(value=value, line=line, column=column)

    def true(self, items):
        """TRUE"""
        line, column = self._get_position(items)
        return nodes.BooleanLiteral(value=True, line=line, column=column)

    def false(self, items):
        """FALSE"""
        line, column = self._get_position(items)
        return nodes.BooleanLiteral(value=False, line=line, column=column)

    def identifier(self, items):
        """Variable name"""
        line, column = self._get_position(items)
        return nodes.Identifier(name=str(items[0]), line=line, column=column)

    def paren_expr(self, items):
        """Parenthesized expression - just return the inner expression"""
        return items[0]

    def ident(self, items):
        """Identifier in expression (from new grammar)"""
        line, column = self._get_position(items)
        return nodes.Identifier(name=str(items[0]), line=line, column=column)

    # ========================================================================
    # Function Calls and Array Access (new grammar names)
    # ========================================================================

    def func_call(self, items):
        """Function call from new grammar: func(a, b, c)"""
        line, column = self._get_position(items)
        name = str(items[0])
        # Remaining items are the arguments
        args = [item for item in items[1:] if item is not None]
        return nodes.FunctionCall(name=name, arguments=args, line=line, column=column)

    def arr_access(self, items):
        """Array access from new grammar: arr[i] or arr[i, j]"""
        line, column = self._get_position(items)
        name = str(items[0])
        # Remaining items are the indices
        indices = [item for item in items[1:] if item is not None]
        return nodes.ArrayAccess(name=name, indices=indices, line=line, column=column)

    # Old grammar support (kept for compatibility)
    def function_call(self, items):
        """func(a, b, c)"""
        line, column = self._get_position(items)
        name = str(items[0])
        # items[1] will be the arguments list if present
        args = items[1] if len(items) > 1 else []
        return nodes.FunctionCall(name=name, arguments=args, line=line, column=column)

    def arguments(self, items):
        """Argument list for function calls"""
        return list(items)

    def array_access(self, items):
        """arr[i] or arr[i, j]"""
        name = str(items[0])
        # items[1] will be the indices list
        indices = items[1] if len(items) > 1 else []
        return nodes.ArrayAccess(name=name, indices=indices, line=line, column=column)

    def indices(self, items):
        """Index list for array access"""
        line, column = self._get_position(items)
        return list(items)

    # ========================================================================
    # Statements
    # ========================================================================

    def assignment(self, items):
        """x = 5"""
        line, column = self._get_position(items)
        target = items[0]
        value = items[1]
        return nodes.Assignment(target=target, value=value, line=line, column=column)

    def input_statement(self, items):
        """INPUT x (old grammar)"""
        variable = items[0]
        return nodes.Input(variable=variable, line=line, column=column)

    def input_stmt(self, items):
        """INPUT x (new grammar)"""
        line, column = self._get_position(items)
        # Skip the INPUT keyword token, get the variable
        non_token_items = [item for item in items if not isinstance(item, Token)]
        if non_token_items:
            variable = non_token_items[0]
        else:
            # If all items are tokens, find the identifier token
            for item in items:
                if isinstance(item, Token) and item.type == 'IDENT':
                    variable = nodes.Identifier(name=str(item), line=line, column=column)
                    break
            else:
                variable = items[0] if items else None
        return nodes.Input(variable=variable, line=line, column=column)

    def output_statement(self, items):
        """OUTPUT "Hello", x (old grammar)"""
        line, column = self._get_position(items)
        expressions = items
        return nodes.Output(expressions=expressions, line=line, column=column)

    def output_stmt(self, items):
        """OUTPUT "Hello", x (new grammar)"""
        line, column = self._get_position(items)
        # Filter out keyword tokens, keep only expressions
        expressions = [item for item in items if not isinstance(item, Token)]
        return nodes.Output(expressions=expressions, line=line, column=column)

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
            line=line, column=column
        )

    def elif_part(self, items):
        """ELSEIF condition THEN ..."""
        line, column = self._get_position(items)
        condition = items[0]
        body = items[1:]
        return nodes.ElifPart(condition=condition, body=body, line=line, column=column)

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
            line=line, column=column
        )

    def case_branch(self, items):
        """value: statements"""
        line, column = self._get_position(items)
        value = items[0]
        body = items[1:]
        return nodes.CaseBranch(value=value, body=body, line=line, column=column)

    def otherwise_part(self, items):
        """OTHERWISE: statements"""
        return items  # Return body as list

    # ========================================================================
    # Control Flow - Loops
    # ========================================================================

    def for_loop(self, items):
        """FOR i = 1 TO 10 STEP 1 ... NEXT i"""
        line, column = self._get_position(items)

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
            line=line, column=column
        )

    def while_loop(self, items):
        """WHILE condition DO ... ENDWHILE"""
        line, column = self._get_position(items)
        # Filter out tokens
        ast_items = [item for item in items if not isinstance(item, Token)]
        condition = ast_items[0] if ast_items else None
        body = ast_items[1:] if len(ast_items) > 1 else []
        return nodes.WhileLoop(condition=condition, body=body, line=line, column=column)

    def repeat_until_loop(self, items):
        """REPEAT ... UNTIL condition"""
        line, column = self._get_position(items)
        # Filter out tokens
        ast_items = [item for item in items if not isinstance(item, Token)]
        # Last item is the condition
        condition = ast_items[-1] if ast_items else None
        body = ast_items[:-1] if len(ast_items) > 1 else []
        return nodes.RepeatUntilLoop(body=body, condition=condition, line=line, column=column)

    def repeat_loop(self, items):
        """REPEAT ... UNTIL condition (new grammar name)"""
        return self.repeat_until_loop(items)

    # ========================================================================
    # Functions and Procedures
    # ========================================================================

    def procedure_decl(self, items):
        """PROCEDURE from new grammar"""
        return self.procedure_declaration(items)

    def procedure_declaration(self, items):
        """PROCEDURE name(params) ... ENDPROCEDURE"""
        line, column = self._get_position(items)
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
            line=line, column=column
        )

    def function_decl(self, items):
        """FUNCTION from new grammar"""
        return self.function_declaration(items)

    def function_declaration(self, items):
        """FUNCTION name(params) RETURNS type ... ENDFUNCTION"""
        line, column = self._get_position(items)
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
            line=line, column=column
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
        line, column = self._get_position(items)
        value = items[0]
        return nodes.ReturnStatement(value=value, line=line, column=column)

    def call_stmt(self, items):
        """CALL from new grammar"""
        return self.call_statement(items)

    def call_statement(self, items):
        """CALL proc(a, b, c)"""
        line, column = self._get_position(items)
        name = str(items[0])
        # items[1] will be the arguments list if present
        args = items[1] if len(items) > 1 else []
        return nodes.CallStatement(name=name, arguments=args, line=line, column=column)

    # ========================================================================
    # Comments and Special
    # ========================================================================

    def comment(self, items):
        """// comment"""
        line, column = self._get_position(items)
        text = str(items[0])[2:].strip()  # Remove // and whitespace
        return nodes.Comment(text=text, line=line, column=column)


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
