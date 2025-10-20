"""
Script to automatically add line/column extraction to all transformer methods
"""

import re

compiler_file = 'apps/api/execution_engine/compiler.py'

with open(compiler_file, 'r') as f:
    content = f.read()

# Pattern to find method definitions that create AST nodes with line=1, column=1
# We need to:
# 1. Find each method that has "line=1, column=1"
# 2. Add "line, column = self._get_position(items)" at the start
# 3. Replace "line=1, column=1" with "line=line, column=column"

# Split into lines for easier processing
lines = content.split('\n')
result_lines = []
i = 0

while i < len(lines):
    line = lines[i]

    # Check if this is a method definition (def ...)
    if line.strip().startswith('def ') and not line.strip().startswith('def _get_position'):
        # Check if this method or upcoming lines have "line=1, column=1"
        # Look ahead up to 30 lines
        has_hardcoded_pos = False
        for j in range(i, min(i + 30, len(lines))):
            if 'line=1, column=1' in lines[j]:
                has_hardcoded_pos = True
                break
            # Stop at next method definition
            if j > i and lines[j].strip().startswith('def '):
                break

        result_lines.append(line)  # Add the def line
        i += 1

        if has_hardcoded_pos:
            # Add the docstring line (if present)
            if i < len(lines) and ('"""' in lines[i] or "'''" in lines[i]):
                result_lines.append(lines[i])
                i += 1
                # Multi-line docstring - continue until closing quotes
                while i < len(lines) and not (lines[i].strip().endswith('"""') or lines[i].strip().endswith("'''")):
                    result_lines.append(lines[i])
                    i += 1
                if i < len(lines):
                    result_lines.append(lines[i])  # Closing docstring line
                    i += 1

            # Check if next line already has position extraction
            if i < len(lines) and 'line, column = self._get_position' not in lines[i]:
                # Get the indentation from the next line
                next_line = lines[i] if i < len(lines) else ''
                indent = len(next_line) - len(next_line.lstrip())
                indent_str = ' ' * indent

                # Add position extraction line
                result_lines.append(f'{indent_str}line, column = self._get_position(items)')
    else:
        result_lines.append(line)
        i += 1

# Join back together
content = '\n'.join(result_lines)

# Now replace all "line=1, column=1" with "line=line, column=column"
content = content.replace('line=1, column=1', 'line=line, column=column')

# Write back
with open(compiler_file, 'w') as f:
    f.write(content)

print("✓ Fixed all hardcoded line/column positions!")
print(f"✓ Updated {compiler_file}")
