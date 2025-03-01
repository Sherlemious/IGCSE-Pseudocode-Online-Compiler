import os
from dataclasses import dataclass
import re
from typing import List, Optional, Dict, Set, Tuple

@dataclass
class CodeState:
    indent_level: int = 0
    
class PseudocodeConverter:
    OPERATORS_MAPPING = {
        'MOD': '%',
        'DIV': '//',
        '<>': '!=',
        '><': '!=',
        'OR': 'or',
        'AND': 'and',
        'NOT': 'not',
    }
    
    BUILTIN_MAPPINGS = {
        'random': 'random.random',
        'INT': 'int',
        'LENGTH': 'len',
        'length': 'len',
        'LCASE': 'LCASE',
        'UCASE': 'UCASE',
        'SUBSTRING': 'SUBSTRING',
        'ROUND': 'round'
    }

    def __init__(self):
        self.state = CodeState()
        self.output_lines = [
            "import random",
            "import math",
            "",
            "# Helper class for 1-indexed array implementation",
            "class Array(dict):",
            "    def __init__(self, *args, **kwargs):",
            "        super().__init__(*args, **kwargs)",
            "",
            "    def __getitem__(self, key):",
            "        if isinstance(key, tuple):",
            "            # Handle multi-dimensional access",
            "            return super().__getitem__(key)",
            "        return super().__getitem__(key)",
            "",
            "    def __setitem__(self, key, value):",
            "        super().__setitem__(key, value)",
            "",
            "def init_array(values=None, dimensions=None):",
            "    \"\"\"Initialize a 1-indexed array\"\"\"",
            "    array = Array()",
            "    if values is not None:",
            "        # If initializing with list values, convert to 1-indexed dictionary",
            "        if isinstance(values, list):",
            "            for i, value in enumerate(values, 1):  # Start indexing at 1",
            "                array[i] = value",
            "        return array",
            "    return array",
            "",
            "def LCASE(s):",
            "    return s.lower()",
            "",
            "def UCASE(s):",
            "    return s.upper()",
            "",
            "def SUBSTRING(s, start, length):",
            "    # Adjust for 1-based indexing",
            "    return s[start-1:start-1+length]",
            "",
            "# Start of main program",
        ]        
        self.array_declarations: Set[str] = set()
        self.explicit_arrays: Dict[str, bool] = {}  # Tracks arrays with explicit initialization

    def preprocess_code(self, lines: List[str]) -> List[str]:
        """
        Preprocesses the input pseudocode by:
        1. Removing empty lines
        2. Removing comments (lines starting with //)
        3. Removing inline comments (anything after // on a line) while preserving string literals
        4. Stripping whitespace
        
        Args:
            lines: The original pseudocode lines
            
        Returns:
            A cleaned list of pseudocode lines
        """
        processed_lines = []
        
        for line in lines:
            # Skip empty lines and comment-only lines
            if not line.strip() or line.strip().startswith('//'):
                continue
            
            # Handle inline comments while preserving string literals
            result_line = ""
            i = 0
            in_string = False
            string_char = None
            
            while i < len(line):
                # Check for string boundaries
                if line[i] in ('"', "'") and (i == 0 or line[i-1] != '\\'):
                    if not in_string:
                        in_string = True
                        string_char = line[i]
                    elif line[i] == string_char:
                        in_string = False
                
                # Check for comment start but only if we're not inside a string
                if i < len(line) - 1 and line[i:i+2] == '//' and not in_string:
                    break  # Found a comment start outside of strings, stop processing
                
                result_line += line[i]
                i += 1
            
            # Strip whitespace and add to processed lines
            result_line = result_line.strip()
            if result_line:
                processed_lines.append(result_line)
            
        return processed_lines

    def insensitive_replace(self, text: str, old: str, new: str) -> str:
        """
        Replaces occurrences of 'old' with 'new' in 'text', case-insensitively,
        but preserves text within string literals.
        """
        result = ""
        i = 0
        in_string = False
        string_char = None
        
        while i < len(text):
            # Check for string boundaries
            if text[i] in ('"', "'") and (i == 0 or text[i-1] != '\\'):
                if not in_string:
                    in_string = True
                    string_char = text[i]
                    result += text[i]
                elif text[i] == string_char:
                    in_string = False
                    result += text[i]
                else:
                    result += text[i]
                i += 1
                continue
            
            # If we're inside a string, add the character as-is
            if in_string:
                result += text[i]
                i += 1
                continue
            
            # If we're not in a string and we find the pattern, replace it
            if i + len(old) <= len(text) and text[i:i+len(old)].upper() == old.upper():
                result += new
                i += len(old)
            else:
                result += text[i]
                i += 1
        
        return result
    
    def handle_string_concatenation(self, expression: str) -> str:
        """
        Detects plus operators between a string literal and a numeric expression,
        and wraps the numeric expression with str() to avoid type errors.
        This is a simple heuristic; more robust handling might require proper parsing.
        """
        import re
        # Split the expression by the plus operator while preserving it.
        tokens = re.split(r'(\+)', expression)
        # Check if any token is a string literal.
        has_string = any(token.strip().startswith(('"', "'")) for token in tokens if token.strip() and token != '+')
        if not has_string:
            return expression

        new_tokens = []
        for token in tokens:
            stripped = token.strip()
            # Skip the plus operator.
            if token == '+':
                new_tokens.append(token)
            # Leave string literals untouched.
            elif stripped.startswith(('"', "'")) and stripped.endswith(('"', "'")):
                new_tokens.append(token)
            # For other tokens, wrap with str() if they are not already wrapped.
            elif stripped:
                # Avoid double-wrapping if already a str(...) call.
                if not re.match(r'str\s*\(.*\)', token):
                    new_tokens.append(f"str({token.strip()})")
                else:
                    new_tokens.append(token)
            else:
                new_tokens.append(token)
        return ''.join(new_tokens)

    def convert_array_access(self, expr: str) -> str:
        """
        Converts array access notation in expressions, preserving 1-indexed access.
        This handles both simple array[index] and 2D array[row,col] notations.
        """
        # Pattern for array access with comma-separated indices (2D arrays)
        pattern_2d = r'(\w+)\[([^,\]]+),([^,\]]+)\]'
        # Replace 2D array access with tuple key format
        while re.search(pattern_2d, expr):
            expr = re.sub(pattern_2d, r'\1[(\2, \3)]', expr)
        
        return expr

    def convert_array_initialization(self, expr: str) -> str:
        """Converts array initialization to use our custom init_array function."""
        if expr.strip().startswith('[') and expr.strip().endswith(']'):
            return f"init_array({expr})"
        return expr

    def convert_condition(self, statement: str) -> str:
        """Converts pseudocode conditional statements to Python syntax."""
        statement = re.sub(r'\bthen\b', '', statement, flags=re.IGNORECASE).strip()
        
        result = statement
        for old, new in self.OPERATORS_MAPPING.items():
            result = self.insensitive_replace(result, old, new)
        
        # Use regex to replace lone '=' with '==' but not inside strings
        result = self.replace_equality_operator(result)
        
        # Handle array access in conditions
        result = self.convert_array_access(result)
        result = self.evaluate_expression(result)
        
        return result
    
    def replace_equality_operator(self, text: str) -> str:
        """
        Replaces '=' with '==' in conditions, but only outside of string literals.
        """
        result = ""
        i = 0
        in_string = False
        string_char = None
        
        while i < len(text):
            # Check for string boundaries
            if text[i] in ('"', "'") and (i == 0 or text[i-1] != '\\'):
                if not in_string:
                    in_string = True
                    string_char = text[i]
                    result += text[i]
                elif text[i] == string_char:
                    in_string = False
                    result += text[i]
                else:
                    result += text[i]
                i += 1
                continue
            
            # If we're inside a string, add the character as-is
            if in_string:
                result += text[i]
                i += 1
                continue
            
            # If not in a string and we find a standalone '=', replace with '=='
            if text[i] == '=' and (i == 0 or text[i-1] not in '!<>=') and (i == len(text)-1 or text[i+1] != '='):
                result += '=='
            else:
                result += text[i]
            i += 1
        
        return result

    def evaluate_expression(self, statement: str) -> str:
        """Evaluates and converts pseudocode expressions to Python syntax."""
        result = statement
        
        for old, new in self.OPERATORS_MAPPING.items():
            result = self.insensitive_replace(result, old, new)
            
        for old, new in self.BUILTIN_MAPPINGS.items():
            result = self.insensitive_replace(result, old, new)
        
        # Handle array access
        result = self.convert_array_access(result)
        
        # Handle cases where '+' is used between strings and numbers
        result = self.handle_string_concatenation(result)
        
        # Handle array initialization with square brackets
        if '[' in result and ']' in result and '=' in result:
            parts = result.split('=', 1)
            lhs = parts[0].strip()
            rhs = parts[1].strip()
            if rhs.startswith('[') and rhs.endswith(']'):
                result = f"{lhs} = init_array({rhs})"
        
        return result

    def parse_for_loop(self, line: str) -> Tuple[str, str, str, Optional[str]]:
        """
        Parse FOR loop components: "FOR <identifier> ← <value1> TO <value2> STEP <increment>"
        STEP clause is optional.
        """
        pattern = r"FOR\s+(\w+)\s*[←=]\s*(.+?)\s+TO\s+(.+?)(?:\s+STEP\s+(.+))?$"
        match = re.match(pattern, line, re.IGNORECASE)
        if not match:
            raise ValueError(f"Invalid FOR loop syntax: {line}")
        var, start, end, step = match.groups()
        return var, start.strip(), end.strip(), step.strip() if step else None

    def process_input_line(self, line: str) -> Optional[str]:
        """Processes a single line of pseudocode and returns Python equivalent."""
        line = line.strip()
        if not line or line.startswith('//'):
            return None

        indent = " " * self.state.indent_level
        upper_line = line.upper()

        if upper_line.startswith('PROCEDURE'):
            return self.handle_procedure(line, indent)
        elif upper_line.startswith('FUNCTION'):
            return self.handle_function(line, indent)
        elif upper_line.startswith('RETURN'):
            return self.handle_return(line, indent)
        elif upper_line.startswith('DECLARE'):
            return self.handle_declaration(line, indent)
        elif upper_line.startswith('CONSTANT'):
            return self.handle_constant(line, indent)
        elif upper_line.startswith('CALL'):
            return self.handle_call(line, indent)
        # Array initialization must be checked before generic assignment.
        elif upper_line.startswith('WHILE'):
            return self.handle_while(line, indent)
        elif upper_line.startswith('IF'):
            return self.handle_if(line, indent)
        elif upper_line.startswith('ELSE'):
            return self.handle_else(line, indent)
        elif upper_line.startswith('FOR'):
            return self.handle_for(line, indent)
        elif re.search(r"\b(ENDWHILE|ENDIF|NEXT|ENDFUNCTION|ENDPROCEDURE)\b", upper_line):
            self.state.indent_level -= 4
            return None
        elif upper_line.startswith('PRINT'):
            return self.handle_print(line, indent)
        elif upper_line.startswith('OUTPUT'):
            return self.handle_output(line, indent)
        elif upper_line.startswith('INPUT'):
            return self.handle_input(line, indent)
        elif '=' in line and '[' in line:
            return self.handle_array_initialization(line, indent)
        elif '=' in line:
            return f"{indent}{self.evaluate_expression(line)}"
        return None
    
    
    def handle_procedure(self, line: str, indent: str) -> str:
        """Converts a PROCEDURE definition to a Python function."""
        match = re.match(r'PROCEDURE\s+(\w+)\((.*?)\)', line, re.IGNORECASE)
        if match:
            proc_name, params = match.groups()
            param_list = []
            for param in params.split(','):
                param_name = param.split(':')[0].strip()
                param_list.append(param_name)
            params_str = ", ".join(param_list)
            self.state.indent_level += 4
            return f"{indent}def {proc_name}({params_str}):"
        else:
            match = re.match(r'PROCEDURE\s+(\w+)', line, re.IGNORECASE)
            if match:
                proc_name = match.group(1)
                self.state.indent_level += 4
                return f"{indent}def {proc_name}():"
            else:
                raise ValueError(f"Invalid PROCEDURE syntax: {line}")
    
    
    def handle_function(self, line: str, indent: str) -> str:
        """Converts a FUNCTION definition to a Python function."""
        match = re.match(r"FUNCTION\s+(\w+)\s*\((.*?)\)\s+RETURNS\s+(\w+)", line, re.IGNORECASE)
        if match:
            func_name, params, ret_type = match.groups()
            param_list = []
            for param in params.split(','):
                if param.strip():
                    param_name = param.split(':')[0].strip()
                    param_list.append(param_name)
            params_str = ", ".join(param_list)
            self.state.indent_level += 4
            return f"{indent}def {func_name}({params_str}):  # Returns {ret_type}"
        else:
            match = re.match(r"FUNCTION\s+(\w+)\s+RETURNS\s+(\w+)", line, re.IGNORECASE)
            if match:
                func_name, ret_type = match.groups()
                self.state.indent_level += 4
                return f"{indent}def {func_name}():  # Returns {ret_type}"
            else:
                raise ValueError(f"Invalid FUNCTION syntax: {line}")
    
    
    def handle_return(self, line: str, indent: str) -> str:
        """Converts a RETURN statement."""
        expr = line[len("RETURN"):].strip()
        expr = self.evaluate_expression(expr)
        return f"{indent}return {expr}"
    
    
    def handle_declaration(self, line: str, indent: str) -> str:
        """Converts a DECLARE statement for scalars or arrays."""
        upper_line = line.upper()
        if 'ARRAY' in upper_line:
            pattern = r"DECLARE\s+(\w+)\s*:\s*ARRAY\[(.*?)\]\s+OF\s+(\w+)"
            match = re.match(pattern, line, re.IGNORECASE)
            if match:
                var_name, dims, type_name = match.groups()
                dims = dims.strip()
                
                # Add to our explicit arrays tracking
                self.explicit_arrays[var_name] = True
                
                # Process dimensions for 2D arrays
                dim_parts = dims.split(',')
                if len(dim_parts) == 2:
                    # Handle 2D array with format like "1:10, 1:5"
                    dim_init_args = []
                    for dim_part in dim_parts:
                        bounds = dim_part.split(':')
                        if len(bounds) == 2:
                            dim_init_args.append(int(bounds[0].strip()))
                            dim_init_args.append(int(bounds[1].strip()))
                    
                    if len(dim_init_args) == 4:
                        # Format is min_row:max_row, min_col:max_col
                        return f"{indent}{var_name} = init_array(dimensions=({dim_init_args[0]}, {dim_init_args[1]}, {dim_init_args[2]}, {dim_init_args[3]}))  # 2D Array with dimensions [{dims}] of type {type_name}"
                
                # Initialize as our custom Array type (default case)
                return f"{indent}{var_name} = init_array()  # Array with dimensions [{dims}] of type {type_name}"
            else:
                raise ValueError(f"Invalid DECLARE ARRAY syntax: {line}")
        else:
            pattern = r"DECLARE\s+(\w+)\s*:\s*(\w+)"
            match = re.match(pattern, line, re.IGNORECASE)
            if match:
                var_name, type_name = match.groups()
                return f"{indent}{var_name} = None  # Declared as {type_name}"
            else:
                raise ValueError(f"Invalid DECLARE syntax: {line}")
    
    
    def handle_constant(self, line: str, indent: str) -> str:
        """Converts a CONSTANT declaration."""
        pattern = r"CONSTANT\s+(\w+)\s*=\s*(.+)"
        match = re.match(pattern, line, re.IGNORECASE)
        if match:
            var_name, value = match.groups()
            return f"{indent}{var_name} = {value}"
        else:
            raise ValueError(f"Invalid CONSTANT syntax: {line}")
    
    
    def handle_call(self, line: str, indent: str) -> str:
        """Converts a CALL statement to a function call."""
        call_content = line[4:].strip()
        if '(' in call_content and call_content.endswith(')'):
            proc_name = call_content[:call_content.find('(')].strip()
            params = call_content[call_content.find('(')+1: call_content.rfind(')')].strip()
            params_eval = self.evaluate_expression(params)
            return f"{indent}{proc_name}({params_eval})"
        else:
            proc_name = call_content.strip()
            return f"{indent}{proc_name}()"
    
    
    def handle_array_initialization(self, line: str, indent: str) -> str:
        """Handles explicit array initialization lines."""
        var_name = line[:line.find('=')].strip()
        # If the LHS contains an array access, then simply evaluate the expression
        if '[' in var_name:
            return f"{indent}{self.evaluate_expression(line)}"
        
        value = line[line.find('=')+1:].strip()
        
        # Mark this as an explicit array
        if '[' in value:
            self.explicit_arrays[var_name] = True
            
            # If it's a standard-looking array initialization, use our init_array function
            if value.startswith('[') and value.endswith(']'):
                # Check if it's a 2D array initialization by looking for nested lists
                if re.search(r'\[\s*\[', value):
                    # This is likely a 2D array initialization like [[1,2], [3,4]]
                    return f"{indent}{var_name} = init_array({value})"
                else:
                    # This is a 1D array initialization
                    return f"{indent}{var_name} = init_array({value})"
            
        return f"{indent}{self.evaluate_expression(line)}"
    
    
    def handle_while(self, line: str, indent: str) -> str:
        """Converts a WHILE loop."""
        self.state.indent_level += 4
        condition = line[5:].split('DO')[0].strip()
        return f"{indent}while {self.convert_condition(condition)}:"
    
    
    def handle_if(self, line: str, indent: str) -> str:
        """Converts an IF statement."""
        self.state.indent_level += 4
        condition = line[2:].strip()
        if 'THEN' in condition.upper():
            condition = condition[:condition.upper().find('THEN')].strip()
        converted_condition = self.convert_condition(condition)
        return f"{indent}if {converted_condition}:"
    
    
    def handle_else(self, line: str, indent: str) -> str:
        """Converts an ELSE or ELSE IF statement."""
        self.state.indent_level -= 4
        indent = " " * self.state.indent_level
        self.state.indent_level += 4
        upper_line = line.upper()
        if 'IF' in upper_line:
            # For ELSE IF, skip the "ELSE " portion (7 characters)
            condition = line[7:].strip()
            if 'THEN' in condition.upper():
                condition = condition[:condition.upper().find('THEN')].strip()
            return f"{indent}elif {self.convert_condition(condition)}:"
        return f"{indent}else:"
    
    
    def handle_for(self, line: str, indent: str) -> str:
        """Converts a FOR loop."""
        self.state.indent_level += 4
        var, start, end, step = self.parse_for_loop(line)
        if step:
            return f"{indent}for {var} in range({start}, ({end})+1, {step}):"
        else:
            return f"{indent}for {var} in range({start}, ({end})+1):"
    
    
    def handle_print(self, line: str, indent: str) -> str:
        """Converts a PRINT statement."""
        content = line[5:].strip()
        if content == '':
            return f"{indent}print()"
        content = self.evaluate_expression(content)
        return f"{indent}print({content})"
    
    
    def handle_output(self, line: str, indent: str) -> str:
        """Converts an OUTPUT statement."""
        content = line[6:].strip()
        if content == '':
            return f"{indent}print('')"
        content = self.evaluate_expression(content)
        return f"{indent}print({content})"
    
    
    def handle_input(self, line: str, indent: str) -> str:
        """Converts an INPUT statement."""
        content = line[5:].strip()
        parts = content.rsplit(maxsplit=1)
        if len(parts) == 2:
            prompt_expr, var = parts
            prompt_expr_evaluated = self.evaluate_expression(prompt_expr)
            return f"{indent}{var} = eval(input({prompt_expr_evaluated}))"
        else:
            if content and content[0] in ('"', "'"):
                quote_char = content[0]
                end_quote_index = content.find(quote_char, 1)
                if end_quote_index == -1:
                    raise ValueError("INPUT prompt string not terminated")
                prompt = content[:end_quote_index+1]
                var = content[end_quote_index+1:].strip()
                return f"{indent}{var} = eval(input({prompt}))"
            else:
                var = content
                return f"{indent}{var} = eval(input())"
            
    def find_arrays(self, lines: List[str]) -> None:
        """
        Identifies arrays used in the code and their dimensions.
        
        Explicit array declarations (via DECLARE or assignment statement using [ ) 
        are flagged as "explicit" while implicit accesses are captured separately.
        Multi-dimensional access (e.g., arr[i][j]) is partially handled by a simple regex.
        """
        for line in lines:
            stripped = line.strip()
            upper_line = stripped.upper()

            # Process explicit array declarations
            if upper_line.startswith("DECLARE") and "ARRAY" in upper_line:
                pattern = r"DECLARE\s+(\w+)\s*:\s*ARRAY\[(.*?)\]\s+OF\s+(\w+)"
                match = re.match(pattern, stripped, re.IGNORECASE)
                if match:
                    var_name, dims, type_name = match.groups()
                    dims = dims.strip()
                    # Flag as explicitly declared (could also store dims/type if needed)
                    self.explicit_arrays[var_name] = True
                continue

            # Process assignment lines for explicit array initialization
            if '=' in line:
                parts = line.split('=')
                lhs = parts[0].strip()
                rhs = parts[1].strip()
                # If the RHS starts with '[' (suggesting explicit initialization), mark it.
                if rhs.startswith('['):
                    self.explicit_arrays[lhs] = True
                    continue

            # Process implicit array accesses:
            # The regex handles single or multi-dimensional array accesses (e.g., arr[ or matrix[)
            # by matching the first occurrence of an identifier followed by '['.
            for match in re.findall(r"(\w+)\s*\[", line):
                if match not in self.explicit_arrays:
                    self.array_declarations.add(match)
                    self.explicit_arrays[match] = False

    def generate_array_initializations(self) -> List[str]:
        """
        Generates initialization code for arrays that were accessed implicitly.
        All arrays are initialized as our custom Array class.
        """
        result = []
        for name in self.array_declarations:
            # Only auto-initialize if not explicitly declared/initialized.
            if name in self.explicit_arrays and self.explicit_arrays[name]:
                continue
            result.append(f"{name} = init_array()")
        return result

    def convert(self, lines: List[str]) -> List[str]:
        """Converts pseudocode lines to Python and executes it."""
        
        # Preprocess the code to remove comments and empty lines
        cleaned_lines = self.preprocess_code(lines)
            
        self.find_arrays(cleaned_lines)
        array_inits = self.generate_array_initializations()
        if array_inits:
            self.output_lines.extend(array_inits)
        
        for line in cleaned_lines:
            # Skip lines that are just array declarations we've already handled
            if '=' in line and any(line.strip().startswith(arr_name) for arr_name in self.array_declarations):
                continue
                
            result = self.process_input_line(line)
            if result:
                self.output_lines.append(result)

        return self.output_lines

def main():
    base_path = os.path.dirname(os.path.abspath(__file__))
    input_path = os.path.join(base_path, "input.txt")
    output_path = os.path.join(base_path, "output.py")
    
    converter = PseudocodeConverter()
    with open(input_path, 'r') as file:
        lines = file.readlines()
    converted_lines = converter.convert(lines)

    with open(output_path, 'w') as file:
        file.write('\n'.join(converted_lines))

if __name__ == "__main__":
    main()