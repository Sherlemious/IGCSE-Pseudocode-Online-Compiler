"""
Test script for the new IGCSE Pseudocode Compiler
"""

import sys
import os

# Add the apps/api/execution_engine directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'apps', 'api', 'execution_engine'))

from compiler import PseudocodeCompiler

def test_basic_examples():
    """Test basic pseudocode examples"""

    compiler = PseudocodeCompiler(permissive=True)

    # Test 1: Simple FOR loop
    print("=" * 70)
    print("TEST 1: Simple FOR Loop")
    print("=" * 70)
    pseudocode1 = """
FOR i = 1 TO 5
    OUTPUT i
NEXT i
"""
    try:
        result = compiler.compile_with_errors(pseudocode1)
        if result['success']:
            print("✓ Compilation successful!")
            print("\nGenerated Python code:")
            print(result['python_code'])
        else:
            print("✗ Compilation failed:")
            print(result['error'])
            if result.get('suggestions'):
                print("\nSuggestions:")
                for s in result['suggestions']:
                    print(f"  - {s}")
    except Exception as e:
        print(f"✗ Exception: {e}")

    # Test 2: IF statement
    print("\n" + "=" * 70)
    print("TEST 2: IF Statement")
    print("=" * 70)
    pseudocode2 = """
DECLARE x : INTEGER
x = 10
IF x > 5 THEN
    OUTPUT "Greater than 5"
ELSE
    OUTPUT "Less than or equal to 5"
ENDIF
"""
    try:
        result = compiler.compile_with_errors(pseudocode2)
        if result['success']:
            print("✓ Compilation successful!")
            print("\nGenerated Python code:")
            print(result['python_code'])
        else:
            print("✗ Compilation failed:")
            print(result['error'])
            if result.get('suggestions'):
                print("\nSuggestions:")
                for s in result['suggestions']:
                    print(f"  - {s}")
    except Exception as e:
        print(f"✗ Exception: {e}")

    # Test 3: WHILE loop
    print("\n" + "=" * 70)
    print("TEST 3: WHILE Loop")
    print("=" * 70)
    pseudocode3 = """
DECLARE count : INTEGER
count = 1
WHILE count <= 3 DO
    OUTPUT count
    count = count + 1
ENDWHILE
"""
    try:
        result = compiler.compile_with_errors(pseudocode3)
        if result['success']:
            print("✓ Compilation successful!")
            print("\nGenerated Python code:")
            print(result['python_code'])
        else:
            print("✗ Compilation failed:")
            print(result['error'])
            if result.get('suggestions'):
                print("\nSuggestions:")
                for s in result['suggestions']:
                    print(f"  - {s}")
    except Exception as e:
        print(f"✗ Exception: {e}")

    # Test 4: Array declaration
    print("\n" + "=" * 70)
    print("TEST 4: Array Declaration and Access")
    print("=" * 70)
    pseudocode4 = """
DECLARE numbers : ARRAY[1:5] OF INTEGER
FOR i = 1 TO 5
    numbers[i] = i * 2
    OUTPUT numbers[i]
NEXT i
"""
    try:
        result = compiler.compile_with_errors(pseudocode4)
        if result['success']:
            print("✓ Compilation successful!")
            print("\nGenerated Python code:")
            print(result['python_code'])
        else:
            print("✗ Compilation failed:")
            print(result['error'])
            if result.get('suggestions'):
                print("\nSuggestions:")
                for s in result['suggestions']:
                    print(f"  - {s}")
    except Exception as e:
        print(f"✗ Exception: {e}")

    # Test 5: Function
    print("\n" + "=" * 70)
    print("TEST 5: Function Declaration")
    print("=" * 70)
    pseudocode5 = """
FUNCTION Add(a : INTEGER, b : INTEGER) RETURNS INTEGER
    RETURN a + b
ENDFUNCTION

DECLARE result : INTEGER
result = Add(5, 3)
OUTPUT result
"""
    try:
        result = compiler.compile_with_errors(pseudocode5)
        if result['success']:
            print("✓ Compilation successful!")
            print("\nGenerated Python code:")
            print(result['python_code'])
        else:
            print("✗ Compilation failed:")
            print(result['error'])
            if result.get('suggestions'):
                print("\nSuggestions:")
                for s in result['suggestions']:
                    print(f"  - {s}")
    except Exception as e:
        print(f"✗ Exception: {e}")

if __name__ == '__main__':
    print("\n")
    print("*" * 70)
    print("*" + " " * 14 + "IGCSE PSEUDOCODE COMPILER TEST SUITE" + " " * 18 + "*")
    print("*" * 70)
    print("\n")

    test_basic_examples()

    print("\n" + "=" * 70)
    print("TESTS COMPLETED")
    print("=" * 70)
