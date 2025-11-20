"""
Test a simple Lark grammar to verify basic syntax
"""

from lark import Lark

# Very simple test grammar
test_grammar = r"""
    start: statement+

    statement: "OUTPUT"i expression

    expression: NUMBER
              | STRING

    NUMBER: /\d+/
    STRING: /"[^"]*"/

    %import common.WS
    %ignore WS
"""

try:
    parser = Lark(test_grammar, start='start')
    print("✓ Simple grammar loaded successfully!")

    # Test parsing
    result = parser.parse('OUTPUT 42')
    print(f"✓ Parsed: {result.pretty()}")

except Exception as e:
    print(f"✗ Error: {e}")
