import os
from dataclasses import dataclass
import re
from typing import List, Optional, Dict, Set

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
            "# ROUND is provided by Python's built-in round function",
        ]        
        self.array_declarations: Set[str] = set()
        self.explicit_arrays: Dict[str, bool] = {}  # Tracks arrays with explicit initialization

    def insensitive_replace(self, text: str, old: str, new: str) -> str:
        pattern = re.compile(re.escape(old), re.IGNORECASE)
        return pattern.sub(new, text)
    
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


    def convert_condition(self, statement: str) -> str:
        """Converts pseudocode conditional statements to Python syntax."""
        result = statement
        for old, new in self.OPERATORS_MAPPING.items():
            result = result.replace(old, new)
            
        # Handle single equals for comparison
        for i, char in enumerate(result):
            if (char == "=" and i > 0 and i < len(result) - 1 and
                result[i-1] != '!' and result[i-1] != '=' and result[i+1] != '=' and
                result[i-1] != '<' and result[i-1] != '>'):
                result = f"{result[:i]}=={result[i+1:]}"
                
        return result

    def evaluate_expression(self, statement: str) -> str:
        """Evaluates and converts pseudocode expressions to Python syntax."""
        result = statement
        
        for old, new in self.OPERATORS_MAPPING.items():
            result = result.replace(old, new)
            
        for old, new in self.BUILTIN_MAPPINGS.items():
            result = self.insensitive_replace(result, old, new)
        
        # Handle cases where '+' is used between strings and numbers
        result = self.handle_string_concatenation(result)
        return result

    def parse_for_loop(self, line: str) -> tuple[str, str, str, Optional[str]]:
        """
        Parse FOR loop components: "FOR <identifier> ← <value1> TO <value2> STEP <increment>"
        STEP clause is optional.
        """
        pattern = r"FOR\s+(\w+)\s*[←=]\s*(.+?)\s+TO\s+(.+?)(?:\s+STEP\s+(.+))?$"
        match = re.match(pattern, line, re.IGNORECASE)
        if not match:
            raise ValueError("Invalid FOR loop syntax")
        var, start, end, step = match.groups()
        return var, start.strip(), end.strip(), step.strip() if step else None

    def process_input_line(self, line: str) -> Optional[str]:
        """Processes a single line of pseudocode and returns Python equivalent."""
        line = line.strip()
        if not line or line.startswith('//'):
            return None
            
        indent = " " * self.state.indent_level
        upper_line = line.upper()

        # Handle procedure definitions
        # In the PROCEDURE branch, remove .lower():
        if upper_line.startswith('PROCEDURE'):
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
                raise ValueError("Invalid PROCEDURE syntax")

        # In the FUNCTION branch, remove .lower() for both versions:
        elif upper_line.startswith('FUNCTION'):
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
                    raise ValueError("Invalid FUNCTION syntax")
        elif upper_line.startswith('RETURN'):
            expr = line[len("RETURN"):].strip()
            expr = self.evaluate_expression(expr)
            return f"{indent}return {expr}"

        # Handle DECLARE statements (including arrays and scalar variables)
        elif upper_line.startswith('DECLARE'):
            if 'ARRAY' in upper_line:
                # Handles array declarations as empty dictionaries.
                # Example: DECLARE StudentNames : ARRAY[1:30] OF STRING
                pattern = r"DECLARE\s+(\w+)\s*:\s*ARRAY\[(.*?)\]\s+OF\s+(\w+)"
                match = re.match(pattern, line, re.IGNORECASE)
                if match:
                    var_name, dims, type_name = match.groups()
                    dims = dims.strip()
                    return f"{indent}{var_name} = {{}}  # Array with dimensions [{dims}] of type {type_name}"
                else:
                    raise ValueError("Invalid DECLARE ARRAY syntax")
            else:
                # Handles scalar declarations, e.g.: DECLARE Counter : INTEGER
                pattern = r"DECLARE\s+(\w+)\s*:\s*(\w+)"
                match = re.match(pattern, line, re.IGNORECASE)
                if match:
                    var_name, type_name = match.groups()
                    return f"{indent}{var_name} = None  # Declared as {type_name}"
                else:
                    raise ValueError("Invalid DECLARE syntax")

        # Handle CONSTANT declarations, for example:
        # CONSTANT HourlyRate ← 6.50
        # CONSTANT DefaultText ← "N/A"
        elif upper_line.startswith('CONSTANT'):
            pattern = r"CONSTANT\s+(\w+)\s*=\s*(.+)"
            match = re.match(pattern, line, re.IGNORECASE)
            if match:
                var_name, value = match.groups()
                return f"{indent}{var_name} = {value}"
            else:
                raise ValueError("Invalid CONSTANT syntax")

        elif upper_line.startswith('CALL'):
            call_content = line[4:].strip()
            if '(' in call_content and call_content.endswith(')'):
                proc_name = call_content[:call_content.find('(')].strip()  # no .lower()
                params = call_content[call_content.find('(')+1: call_content.rfind(')')].strip()
                params_eval = self.evaluate_expression(params)
                return f"{indent}{proc_name}({params_eval})"
            else:
                proc_name = call_content.strip()
                return f"{indent}{proc_name}()"

        # Handle array initialization
        elif '=' in line and '[' in line:
            var_name = line[:line.find('=')].strip()
            if '[' in var_name:  # This is an array access, not initialization
                return f"{indent}{self.evaluate_expression(line)}"
            value = line[line.find('=')+1:].strip()
            if '[' in value:  # This is array initialization
                self.explicit_arrays[var_name] = '][' in value
                return f"{indent}{var_name} = {value}"
            
        # Control structures
        elif upper_line.startswith('WHILE'):
            self.state.indent_level += 4
            condition = line[5:].split('DO')[0].strip()
            return f"{indent}while {self.convert_condition(condition)}:"
            
        elif upper_line.startswith('IF'):
            self.state.indent_level += 4
            # Remove 'THEN' from the condition
            condition = line[2:].strip()
            if 'THEN' in condition.upper():
                condition = condition[:condition.upper().find('THEN')].strip()
            return f"{indent}if {self.convert_condition(condition)}:"
        
        elif upper_line.startswith('ELSE'):
            # Handle the else indentation
            self.state.indent_level -= 4
            indent = " " * self.state.indent_level
            self.state.indent_level += 4

            # Check if the ELSE is part of an ELSE IF, and convert it to elif
            if 'IF' in upper_line:
                # 'ELSE IF' is the same as 'ELSEIF' in pseudocode, 'ELSE IF' is 7 characters long
                condition = line[7:].strip()
                # Remove the Then if it exists
                if 'THEN' in condition.upper():
                    condition = condition[:condition.upper().find('THEN')].strip()
                return f"{indent}elif {self.convert_condition(condition)}:"

            return f"{indent}else:"

        elif upper_line.startswith('FOR'):
            self.state.indent_level += 4
            var, start, end, step = self.parse_for_loop(line)
            if step:
                return f"{indent}for {var} in range({start}, {end}, {step}):"
            else:
                return f"{indent}for {var} in range({start}, {end}):"
            
        # Block endings
        elif re.search(r"\b(ENDWHILE|ENDIF|NEXT|ENDFUNCTION|ENDPROCEDURE)\b", upper_line):
            self.state.indent_level -= 4
            return None
            
        # Input/Output
        elif upper_line.startswith('PRINT'):
            content = line[5:].strip()
            if content == '':  # Empty print
                return f"{indent}print()"
            content = self.evaluate_expression(content)
            return f"{indent}print({content})"
        
        elif upper_line.startswith('OUTPUT'):
            content = line[6:].strip()
            if content == '':
                return f"{indent}print('')"
            content = self.evaluate_expression(content)
            return f"{indent}print({content})"
            
        elif upper_line.startswith('INPUT'):
            content = line[5:].strip()
            # Check if the input line contains a prompt expression and a variable separated by whitespace
            parts = content.rsplit(maxsplit=1)
            if len(parts) == 2:
                prompt_expr, var = parts
                # Evaluate the prompt expression to apply concatenation handling and built-in mappings
                prompt_expr_evaluated = self.evaluate_expression(prompt_expr)
                return f"{indent}{var} = eval(input({prompt_expr_evaluated}))"
            else:
                # Fallback: if there's no variable part, assume entire content is a prompt
                # Check if a prompt string is included (starts with a quote)
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
    
        elif '=' in line:
            return f"{indent}{self.evaluate_expression(line)}"
        
        return None
            
    def find_arrays(self, lines: List[str]) -> None:
        """Identifies arrays used in the code and their dimensions."""
        for line in lines:
            if '=' in line:
                parts = line.split('=')
                var_name = parts[0].strip()
                value = parts[1].strip()
                
                # Check explicit array initialization
                if value.startswith('['):
                    self.explicit_arrays[var_name] = '][' in value
                    continue
                    
            # Check array access
            if '[' in line and '=' in line:
                var_name = line[:line.find('[')].strip()
                if var_name not in self.explicit_arrays and not any(op in var_name.upper() for op in self.OPERATORS_MAPPING):
                    self.array_declarations.add(var_name)
                    self.explicit_arrays[var_name] = '][' in line

    def generate_array_initializations(self) -> List[str]:
        """Generates initialization code for arrays."""
        result = []
        for name in self.array_declarations:
            if name in self.explicit_arrays:
                if self.explicit_arrays[name]:
                    result.append(f"{name}=[[0 for i in range(1000)] for f in range(1000)]")
                else:
                    result.append(f"{name}=[0 for i in range(1000)]")
        return result

    def convert(self, lines: List[str]) -> List[str]:
        """Converts pseudocode lines to Python and executes it."""
            
        self.find_arrays(lines)
        array_inits = self.generate_array_initializations()
        if array_inits:
            self.output_lines.extend(array_inits)
        
        for line in lines:
            if not line.strip() or line.strip().startswith('//'):
                continue
                
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
