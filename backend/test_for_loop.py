"""Quick test for FOR loop"""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'apps', 'api', 'execution_engine'))

from compiler import PseudocodeCompiler

compiler = PseudocodeCompiler()
code = """
FOR i = 1 TO 5
    OUTPUT i
NEXT i
"""

result = compiler.compile_with_errors(code)
if result['success']:
    print("✓ SUCCESS!")
    print("\n===== Generated Python Code =====")
    # Print only the main program part (skip runtime library)
    lines = result['python_code'].split('\n')
    main_start = 0
    for idx, line in enumerate(lines):
        if '# ===== Main Program =====' in line:
            main_start = idx
            break
    print('\n'.join(lines[main_start:]))
else:
    print("✗ FAILED:", result['error'])
