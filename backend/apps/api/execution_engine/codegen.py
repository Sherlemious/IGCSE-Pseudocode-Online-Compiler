"""
Python Code Generator for IGCSE Pseudocode AST

This module converts an Abstract Syntax Tree (AST) into executable Python code.
It walks through the AST nodes and generates corresponding Python statements.
"""

from typing import List
import ast_nodes as nodes


class PythonCodeGenerator:
    """Generates Python code from an AST"""

    def __init__(self):
        self.indent_level = 0
        self.indent_string = "    "  # 4 spaces
        self.declared_arrays = set()
        self.in_function = False

    def generate(self, ast: nodes.Program) -> str:
        """
        Generate Python code from the AST

        Args:
            ast: The root Program node of the AST

        Returns:
            Complete Python code as a string
        """
        # Generate runtime library (helper functions)
        code = self._generate_runtime_library()

        # Generate main program code
        code += "\n# ===== Main Program =====\n\n"

        for statement in ast.statements:
            code += self._generate_statement(statement)

        return code

    def _generate_runtime_library(self) -> str:
        """Generate helper functions and classes for runtime support"""
        return '''"""
IGCSE Pseudocode Runtime Library
Auto-generated helper functions for pseudocode execution
"""

import random
import math
import sys
from typing import Any, Union


class Array(dict):
    """
    1-indexed array implementation for IGCSE pseudocode
    Supports both 1D and multi-dimensional arrays
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def __getitem__(self, key):
        if key not in self:
            raise IndexError(f"Array index {key} is out of bounds or not initialized")
        return super().__getitem__(key)

    def __setitem__(self, key, value):
        super().__setitem__(key, value)


def init_array(dimensions=None, default_value=None):
    """
    Initialize a 1-indexed array with given dimensions

    Args:
        dimensions: List of tuples [(start, end), ...] for each dimension
        default_value: Default value to initialize array elements

    Returns:
        Array object
    """
    arr = Array()

    if dimensions is None:
        return arr

    if len(dimensions) == 1:
        # 1D array
        start, end = dimensions[0]
        for i in range(start, end + 1):
            arr[i] = default_value if default_value is not None else 0
    elif len(dimensions) == 2:
        # 2D array
        start_row, end_row = dimensions[0]
        start_col, end_col = dimensions[1]
        for i in range(start_row, end_row + 1):
            for j in range(start_col, end_col + 1):
                arr[(i, j)] = default_value if default_value is not None else 0
    else:
        # Multi-dimensional array (3D+)
        # Use recursive initialization for higher dimensions
        pass

    return arr


def LCASE(s: str) -> str:
    """Convert string to lowercase"""
    return str(s).lower()


def UCASE(s: str) -> str:
    """Convert string to uppercase"""
    return str(s).upper()


def LENGTH(s: str) -> int:
    """Get length of string"""
    return len(str(s))


def SUBSTRING(s: str, start: int, length: int) -> str:
    """
    Extract substring (1-indexed)

    Args:
        s: Input string
        start: Starting position (1-indexed)
        length: Number of characters to extract

    Returns:
        Extracted substring
    """
    return str(s)[start - 1:start - 1 + length]


def INT(x: Union[int, float, str]) -> int:
    """Convert to integer (truncate, don't round)"""
    return int(float(x))


def ROUND(x: Union[int, float], decimals: int = 0) -> float:
    """Round to specified decimal places"""
    return round(float(x), int(decimals))


def RANDOM() -> float:
    """Generate random float between 0 and 1"""
    return random.random()


def safe_input(prompt: str = "") -> str:
    """
    Safe input function for pseudocode
    Replaces dangerous eval(input())
    """
    return input(prompt)


def safe_numeric_input(prompt: str = "") -> Union[int, float]:
    """
    Safe numeric input - tries to parse as number
    """
    value = input(prompt)
    try:
        if '.' in value:
            return float(value)
        else:
            return int(value)
    except ValueError:
        # If not a number, return as string
        return value

'''

    def _indent(self) -> str:
        """Return current indentation string"""
        return self.indent_string * self.indent_level

    def _generate_statement(self, node: nodes.ASTNode) -> str:
        """Generate code for a single statement"""
        if isinstance(node, nodes.Declaration):
            return self._generate_declaration(node)
        elif isinstance(node, nodes.ConstantDeclaration):
            return self._generate_constant(node)
        elif isinstance(node, nodes.Assignment):
            return self._generate_assignment(node)
        elif isinstance(node, nodes.Input):
            return self._generate_input(node)
        elif isinstance(node, nodes.Output):
            return self._generate_output(node)
        elif isinstance(node, nodes.IfStatement):
            return self._generate_if(node)
        elif isinstance(node, nodes.CaseStatement):
            return self._generate_case(node)
        elif isinstance(node, nodes.ForLoop):
            return self._generate_for_loop(node)
        elif isinstance(node, nodes.WhileLoop):
            return self._generate_while_loop(node)
        elif isinstance(node, nodes.RepeatUntilLoop):
            return self._generate_repeat_until(node)
        elif isinstance(node, nodes.ProcedureDeclaration):
            return self._generate_procedure(node)
        elif isinstance(node, nodes.FunctionDeclaration):
            return self._generate_function(node)
        elif isinstance(node, nodes.ReturnStatement):
            return self._generate_return(node)
        elif isinstance(node, nodes.CallStatement):
            return self._generate_call(node)
        elif isinstance(node, nodes.Comment):
            return self._generate_comment(node)
        elif isinstance(node, nodes.EmptyStatement):
            return ""
        else:
            return f"{self._indent()}# Unknown statement type: {type(node).__name__}\n"

    def _generate_declaration(self, node: nodes.Declaration) -> str:
        """Generate variable declaration"""
        code = ""

        if node.is_array:
            # Array declaration
            self.declared_arrays.add(node.name)
            if node.dimensions:
                # Extract dimension bounds
                dims = []
                for dim in node.dimensions:
                    # dim should be a tuple or list [start, end]
                    dims.append(dim)

                code += f"{self._indent()}{node.name} = init_array({dims})\n"
            else:
                code += f"{self._indent()}{node.name} = init_array()\n"
        else:
            # Simple variable declaration - initialize to default value
            default_value = self._get_default_value(node.type_)
            code += f"{self._indent()}{node.name} = {default_value}\n"

        return code

    def _get_default_value(self, type_: str) -> str:
        """Get default value for a type"""
        defaults = {
            'INTEGER': '0',
            'REAL': '0.0',
            'STRING': '""',
            'BOOLEAN': 'False',
            'CHAR': '""',
            'DATE': '""'
        }
        return defaults.get(type_.upper(), 'None')

    def _generate_constant(self, node: nodes.ConstantDeclaration) -> str:
        """Generate constant declaration"""
        value = self._generate_expression(node.value)
        return f"{self._indent()}{node.name} = {value}\n"

    def _generate_assignment(self, node: nodes.Assignment) -> str:
        """Generate assignment statement"""
        target = self._generate_expression(node.target)
        value = self._generate_expression(node.value)
        return f"{self._indent()}{target} = {value}\n"

    def _generate_input(self, node: nodes.Input) -> str:
        """Generate input statement"""
        var = self._generate_expression(node.variable)
        # Use safe_numeric_input to try parsing as number
        return f"{self._indent()}{var} = safe_numeric_input()\n"

    def _generate_output(self, node: nodes.Output) -> str:
        """Generate output statement"""
        expressions = [self._generate_expression(expr) for expr in node.expressions]
        args = ", ".join(expressions)
        return f"{self._indent()}print({args})\n"

    def _generate_if(self, node: nodes.IfStatement) -> str:
        """Generate if statement"""
        code = ""

        # IF condition
        condition = self._generate_expression(node.condition)
        code += f"{self._indent()}if {condition}:\n"

        # THEN body
        self.indent_level += 1
        if node.then_body:
            for stmt in node.then_body:
                code += self._generate_statement(stmt)
        else:
            code += f"{self._indent()}pass\n"
        self.indent_level -= 1

        # ELSEIF parts
        if node.elif_parts:
            for elif_part in node.elif_parts:
                condition = self._generate_expression(elif_part.condition)
                code += f"{self._indent()}elif {condition}:\n"
                self.indent_level += 1
                if elif_part.body:
                    for stmt in elif_part.body:
                        code += self._generate_statement(stmt)
                else:
                    code += f"{self._indent()}pass\n"
                self.indent_level -= 1

        # ELSE part
        if node.else_body:
            code += f"{self._indent()}else:\n"
            self.indent_level += 1
            for stmt in node.else_body:
                code += self._generate_statement(stmt)
            self.indent_level -= 1

        return code

    def _generate_case(self, node: nodes.CaseStatement) -> str:
        """Generate case statement using if-elif-else"""
        code = ""
        expr = self._generate_expression(node.expression)

        # Generate as if-elif chain
        first = True
        for case in node.cases:
            case_value = self._generate_expression(case.value)
            if first:
                code += f"{self._indent()}if {expr} == {case_value}:\n"
                first = False
            else:
                code += f"{self._indent()}elif {expr} == {case_value}:\n"

            self.indent_level += 1
            for stmt in case.body:
                code += self._generate_statement(stmt)
            self.indent_level -= 1

        # OTHERWISE part
        if node.otherwise:
            code += f"{self._indent()}else:\n"
            self.indent_level += 1
            for stmt in node.otherwise:
                code += self._generate_statement(stmt)
            self.indent_level -= 1

        return code

    def _generate_for_loop(self, node: nodes.ForLoop) -> str:
        """Generate for loop"""
        start = self._generate_expression(node.start)
        end = self._generate_expression(node.end)
        step = self._generate_expression(node.step) if node.step else "1"

        code = f"{self._indent()}for {node.variable} in range({start}, ({end}) + 1, {step}):\n"

        self.indent_level += 1
        if node.body:
            for stmt in node.body:
                code += self._generate_statement(stmt)
        else:
            code += f"{self._indent()}pass\n"
        self.indent_level -= 1

        return code

    def _generate_while_loop(self, node: nodes.WhileLoop) -> str:
        """Generate while loop"""
        condition = self._generate_expression(node.condition)
        code = f"{self._indent()}while {condition}:\n"

        self.indent_level += 1
        if node.body:
            for stmt in node.body:
                code += self._generate_statement(stmt)
        else:
            code += f"{self._indent()}pass\n"
        self.indent_level -= 1

        return code

    def _generate_repeat_until(self, node: nodes.RepeatUntilLoop) -> str:
        """Generate repeat-until loop (do-while in Python)"""
        # Python doesn't have do-while, so we use while True with break
        code = f"{self._indent()}while True:\n"

        self.indent_level += 1
        if node.body:
            for stmt in node.body:
                code += self._generate_statement(stmt)

        # Break condition (negated because UNTIL means "stop when true")
        condition = self._generate_expression(node.condition)
        code += f"{self._indent()}if {condition}:\n"
        self.indent_level += 1
        code += f"{self._indent()}break\n"
        self.indent_level -= 1
        self.indent_level -= 1

        return code

    def _generate_procedure(self, node: nodes.ProcedureDeclaration) -> str:
        """Generate procedure (function without return)"""
        params = ", ".join(p.name for p in node.parameters)
        code = f"{self._indent()}def {node.name}({params}):\n"

        self.indent_level += 1
        self.in_function = True

        if node.body:
            for stmt in node.body:
                code += self._generate_statement(stmt)
        else:
            code += f"{self._indent()}pass\n"

        self.in_function = False
        self.indent_level -= 1

        return code + "\n"

    def _generate_function(self, node: nodes.FunctionDeclaration) -> str:
        """Generate function"""
        params = ", ".join(p.name for p in node.parameters)
        code = f"{self._indent()}def {node.name}({params}):\n"

        self.indent_level += 1
        self.in_function = True

        if node.body:
            for stmt in node.body:
                code += self._generate_statement(stmt)
        else:
            code += f"{self._indent()}pass\n"

        self.in_function = False
        self.indent_level -= 1

        return code + "\n"

    def _generate_return(self, node: nodes.ReturnStatement) -> str:
        """Generate return statement"""
        value = self._generate_expression(node.value)
        return f"{self._indent()}return {value}\n"

    def _generate_call(self, node: nodes.CallStatement) -> str:
        """Generate procedure call"""
        args = [self._generate_expression(arg) for arg in node.arguments]
        args_str = ", ".join(args)
        return f"{self._indent()}{node.name}({args_str})\n"

    def _generate_comment(self, node: nodes.Comment) -> str:
        """Generate comment"""
        return f"{self._indent()}# {node.text}\n"

    def _generate_expression(self, node: nodes.ASTNode) -> str:
        """Generate code for an expression"""
        if isinstance(node, nodes.NumberLiteral):
            return str(node.value)
        elif isinstance(node, nodes.StringLiteral):
            # Ensure proper escaping
            escaped = node.value.replace('\\', '\\\\').replace('"', '\\"')
            return f'"{escaped}"'
        elif isinstance(node, nodes.BooleanLiteral):
            return "True" if node.value else "False"
        elif isinstance(node, nodes.Identifier):
            return node.name
        elif isinstance(node, nodes.BinaryOp):
            return self._generate_binary_op(node)
        elif isinstance(node, nodes.UnaryOp):
            return self._generate_unary_op(node)
        elif isinstance(node, nodes.Comparison):
            return self._generate_comparison(node)
        elif isinstance(node, nodes.ArrayAccess):
            return self._generate_array_access(node)
        elif isinstance(node, nodes.FunctionCall):
            return self._generate_function_call(node)
        else:
            return f"UnknownExpr({type(node).__name__})"

    def _generate_binary_op(self, node: nodes.BinaryOp) -> str:
        """Generate binary operation"""
        left = self._generate_expression(node.left)
        right = self._generate_expression(node.right)

        # Map operators
        op_map = {
            '+': '+',
            '-': '-',
            '*': '*',
            '/': '/',
            'DIV': '//',
            'MOD': '%',
            '^': '**',
            'AND': 'and',
            'OR': 'or',
            '&': '+'  # String concatenation in pseudocode
        }

        op = op_map.get(node.operator.upper(), node.operator)

        # Add parentheses for clarity
        return f"({left} {op} {right})"

    def _generate_unary_op(self, node: nodes.UnaryOp) -> str:
        """Generate unary operation"""
        operand = self._generate_expression(node.operand)

        op_map = {
            '-': '-',
            '+': '+',
            'NOT': 'not '
        }

        op = op_map.get(node.operator.upper(), node.operator)
        return f"({op}{operand})"

    def _generate_comparison(self, node: nodes.Comparison) -> str:
        """Generate comparison"""
        left = self._generate_expression(node.left)
        right = self._generate_expression(node.right)

        # Map operators
        op_map = {
            '=': '==',
            '<>': '!=',
            '><': '!=',
            '<': '<',
            '>': '>',
            '<=': '<=',
            '>=': '>='
        }

        op = op_map.get(node.operator, node.operator)
        return f"({left} {op} {right})"

    def _generate_array_access(self, node: nodes.ArrayAccess) -> str:
        """Generate array access"""
        if len(node.indices) == 1:
            # 1D array
            index = self._generate_expression(node.indices[0])
            return f"{node.name}[{index}]"
        else:
            # Multi-dimensional array
            indices = [self._generate_expression(idx) for idx in node.indices]
            indices_str = ", ".join(indices)
            return f"{node.name}[({indices_str})]"

    def _generate_function_call(self, node: nodes.FunctionCall) -> str:
        """Generate function call"""
        args = [self._generate_expression(arg) for arg in node.arguments]
        args_str = ", ".join(args)
        return f"{node.name}({args_str})"
