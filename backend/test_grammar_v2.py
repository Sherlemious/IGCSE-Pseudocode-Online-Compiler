"""
Test the new grammar v2
"""

from lark import Lark
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'apps', 'api', 'execution_engine'))

from grammar_v2 import PSEUDOCODE_GRAMMAR_V2

try:
    parser = Lark(PSEUDOCODE_GRAMMAR_V2, start='program', parser='lalr')
    print("✓ Grammar V2 loaded successfully!")

    # Test simple pseudocode
    test_code = """
OUTPUT 42
"""
    result = parser.parse(test_code)
    print(f"✓ Parsed simple code: {result.pretty()}")

    # Test FOR loop
    test_code2 = """
FOR i = 1 TO 5
    OUTPUT i
NEXT i
"""
    result2 = parser.parse(test_code2)
    print(f"✓ Parsed FOR loop: {result2.pretty()}")

except Exception as e:
    print(f"✗ Error: {e}")
    import traceback
    traceback.print_exc()
