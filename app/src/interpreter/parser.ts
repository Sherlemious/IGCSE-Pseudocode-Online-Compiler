import { CharStream, CommonTokenStream, BaseErrorListener, RecognitionException, Recognizer, Token, ATNSimulator } from 'antlr4ng';
import { PseudocodeLexer } from './generated/PseudocodeLexer';
import { PseudocodeParser, ProgramContext } from './generated/PseudocodeParser';
import { PseudocodeError } from './core/types';

class CollectingErrorListener extends BaseErrorListener {
  errors: PseudocodeError[] = [];

  override syntaxError<S extends Token, T extends ATNSimulator>(
    _recognizer: Recognizer<T>,
    _offendingSymbol: S | null,
    line: number,
    charPositionInLine: number,
    msg: string,
    _e: RecognitionException | null,
  ): void {
    this.errors.push(new PseudocodeError(msg, line, charPositionInLine));
  }
}

export interface ParseResult {
  tree: ProgramContext | null;
  errors: PseudocodeError[];
}

function expandMultiDeclare(source: string): string {
  // Expand "DECLARE x, y, z : TYPE" into separate DECLARE statements
  // Matches: optional indent + DECLARE + (id, id, ...) + : rest-of-line
  return source.replace(
    /^([ \t]*declare[ \t]+)((?:\w+[ \t]*,[ \t]*)+\w+)([ \t]*:.*)$/gim,
    (_, prefix, identifiers, typeAndRest) => {
      const names = identifiers.split(',').map((id: string) => id.trim());
      return names.map((name: string) => `${prefix}${name}${typeAndRest}`).join('\n');
    }
  );
}

export function parse(source: string): ParseResult {
  // Expand multi-identifier DECLARE statements before parsing
  const expanded = expandMultiDeclare(source);
  // Ensure source ends with newline for grammar consistency
  const input = expanded.endsWith('\n') ? expanded : expanded + '\n';

  const chars = CharStream.fromString(input);
  const lexer = new PseudocodeLexer(chars);

  const errorListener = new CollectingErrorListener();
  lexer.removeErrorListeners();
  lexer.addErrorListener(errorListener);

  const tokens = new CommonTokenStream(lexer);
  const parser = new PseudocodeParser(tokens);

  parser.removeErrorListeners();
  parser.addErrorListener(errorListener);

  const tree = parser.program();

  return {
    tree: errorListener.errors.length === 0 ? tree : tree,
    errors: errorListener.errors,
  };
}
