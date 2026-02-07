import { CharStream, CommonTokenStream, BaseErrorListener, RecognitionException, Recognizer, Token } from 'antlr4ng';
import { PseudocodeLexer } from './generated/PseudocodeLexer';
import { PseudocodeParser, ProgramContext } from './generated/PseudocodeParser';
import { PseudocodeError } from './core/types';

class CollectingErrorListener extends BaseErrorListener {
  errors: PseudocodeError[] = [];

  syntaxError(
    _recognizer: Recognizer<Token>,
    _offendingSymbol: Token | null,
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

export function parse(source: string): ParseResult {
  // Ensure source ends with newline for grammar consistency
  const input = source.endsWith('\n') ? source : source + '\n';

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
