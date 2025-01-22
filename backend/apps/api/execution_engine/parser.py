import os
from dataclasses import dataclass
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
        'length': 'len'
    }

    def __init__(self):
        self.state = CodeState()
        self.output_lines = ["import random", "import math"]
        self.array_declarations: Set[str] = set()
        self.explicit_arrays: Dict[str, bool] = {}  # Tracks arrays with explicit initialization

    def convert_condition(self, statement: str) -> str:
        """Converts pseudocode conditional statements to Python syntax."""
        result = statement
        for old, new in self.OPERATORS_MAPPING.items():
            result = result.replace(old, new)
            
        # Handle single equals for comparison
        for i, char in enumerate(result):
            if (char == "=" and i > 0 and i < len(result) - 1 and
                result[i-1] != '!' and result[i-1] != '=' and result[i+1] != '='):
                result = f"{result[:i]}=={result[i+1:]}"
                
        return result

    def evaluate_expression(self, statement: str) -> str:
        """Evaluates and converts pseudocode expressions to Python syntax."""
        result = statement
        
        for old, new in self.OPERATORS_MAPPING.items():
            result = result.replace(old, new)
            
        for old, new in self.BUILTIN_MAPPINGS.items():
            result = result.replace(old, new)
            
        return result

    def parse_for_loop(self, line: str) -> tuple[str, int, str]:
        """Parse FOR loop components safely."""
        parts = line[3:].strip().split(None, 1)
        if not parts:
            raise ValueError("Invalid FOR loop syntax")
            
        var_part = parts[0]
        rest = parts[1] if len(parts) > 1 else ""
        
        to_split = None
        for to_variant in ['TO', 'To', 'to']:
            if to_variant in rest:
                to_split = rest.split(to_variant)
                break
                
        if not to_split or len(to_split) != 2:
            raise ValueError("Invalid FOR loop syntax: missing TO")
            
        start_val = to_split[0].replace('=', '').strip()
        end_val = to_split[1].strip()
        
        try:
            start_num = int(start_val) - 1
        except ValueError:
            raise ValueError(f"Invalid start value in FOR loop: {start_val}")
            
        return var_part, start_num, end_val

    def process_input_line(self, line: str) -> Optional[str]:
        """Processes a single line of pseudocode and returns Python equivalent."""
        line = line.strip()
        if not line or line.startswith('//'):
            return None
            
        indent = " " * self.state.indent_level
        upper_line = line.upper()

        # Handle array initialization
        if '=' in line and '[' in line:
            var_name = line[:line.find('=')].strip()
            if '[' in var_name:  # This is an array access, not initialization
                return f"{indent}{self.evaluate_expression(line)}"
            value = line[line.find('=')+1:].strip()
            if '[' in value:  # This is array initialization
                self.explicit_arrays[var_name] = '][' in value
                return f"{indent}{var_name} = {value}"
            
        # Control structures
        if upper_line.startswith('WHILE'):
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
            
        elif upper_line.startswith('FOR'):
            self.state.indent_level += 4
            var, start, end = self.parse_for_loop(line)
            return f"{indent}for {var} in range({start}, {end}):"
            
        # Block endings
        elif upper_line in ('ENDWHILE', 'ENDIF', 'NEXT'):
            self.state.indent_level -= 4
            return None
            
        # Input/Output
        elif upper_line.startswith('PRINT'):
            content = line[5:].strip()
            if content == '':  # Empty print
                return f"{indent}print()"
            return f"{indent}print({content})"
            
        elif upper_line.startswith('INPUT'):
            var = line[5:].strip()
            return f"{indent}{var} = eval(input())"
            
        # Assignment
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
