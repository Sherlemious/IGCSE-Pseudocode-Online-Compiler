"""Test BYREF parameter support with Swap procedure"""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'apps', 'api', 'execution_engine'))

from compiler import PseudocodeCompiler

compiler = PseudocodeCompiler()

# Test Swap procedure with BYREF parameters
code = """
PROCEDURE Swap(BYREF a : INTEGER, BYREF b : INTEGER)
    DECLARE temp : INTEGER
    temp = a
    a = b
    b = temp
ENDPROCEDURE

DECLARE x : INTEGER
DECLARE y : INTEGER
x = 5
y = 10
OUTPUT "Before swap: x =", x, "y =", y
CALL Swap(x, y)
OUTPUT "After swap: x =", x, "y =", y
"""

try:
    result = compiler.compile_with_errors(code)
except Exception as e:
    import traceback
    print("✗ Exception during compilation:")
    traceback.print_exc()
    sys.exit(1)

if result['success']:
    print("✓ BYREF Compilation successful!")
    print("\n===== Generated Python Code =====")
    # Print only the main program part (skip runtime library)
    lines = result['python_code'].split('\n')
    main_start = 0
    for idx, line in enumerate(lines):
        if '# ===== Main Program =====' in line:
            main_start = idx
            break

    # Also print the Swap function
    swap_start = 0
    for idx, line in enumerate(lines):
        if 'def Swap(' in line:
            swap_start = idx - 1  # Include line before def
            break

    print('\n'.join(lines[swap_start:]))

    print("\n===== Testing Execution =====")
    try:
        exec(result['python_code'])
    except Exception as e:
        print(f"✗ Execution error: {e}")
else:
    print("✗ FAILED:", result['error'])
    if result.get('suggestions'):
        print("\nSuggestions:")
        for s in result['suggestions']:
            print(f"  - {s}")
