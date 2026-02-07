// Generated from i:/Projects/Web Apps/PseudoCode Online Compiler/IGCSE-Pseudocode-Online-Compiler/frontend/src/interpreter/grammar/Pseudocode.g4 by ANTLR 4.13.1
import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.dfa.DFA;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.misc.*;
import org.antlr.v4.runtime.tree.*;
import java.util.List;
import java.util.Iterator;
import java.util.ArrayList;

@SuppressWarnings({"all", "warnings", "unchecked", "unused", "cast", "CheckReturnValue"})
public class PseudocodeParser extends Parser {
	static { RuntimeMetaData.checkVersion("4.13.1", RuntimeMetaData.VERSION); }

	protected static final DFA[] _decisionToDFA;
	protected static final PredictionContextCache _sharedContextCache =
		new PredictionContextCache();
	public static final int
		DECLARE=1, CONSTANT=2, INPUT=3, OUTPUT=4, PRINT=5, IF=6, THEN=7, ELSE=8, 
		ELSEIF=9, ENDIF=10, CASE=11, OF=12, OTHERWISE=13, ENDCASE=14, FOR=15, 
		TO=16, STEP=17, NEXT=18, WHILE=19, DO=20, ENDWHILE=21, REPEAT=22, UNTIL=23, 
		PROCEDURE=24, ENDPROCEDURE=25, FUNCTION=26, ENDFUNCTION=27, RETURNS=28, 
		RETURN=29, CALL=30, ARRAY=31, AND=32, OR=33, NOT=34, TRUE=35, FALSE=36, 
		MOD=37, DIV=38, OPENFILE=39, READFILE=40, WRITEFILE=41, CLOSEFILE=42, 
		READ_MODE=43, WRITE_MODE=44, APPEND_MODE=45, INTEGER_TYPE=46, REAL_TYPE=47, 
		CHAR_TYPE=48, STRING_TYPE=49, BOOLEAN_TYPE=50, LARROW=51, EQUALS=52, NOTEQUAL=53, 
		LTE=54, GTE=55, LT=56, GT=57, PLUS=58, MINUS=59, STAR=60, SLASH=61, CARET=62, 
		AMPERSAND=63, LPAREN=64, RPAREN=65, LBRACKET=66, RBRACKET=67, COMMA=68, 
		COLON=69, REAL_LITERAL=70, INTEGER_LITERAL=71, STRING_LITERAL=72, CHAR_LITERAL=73, 
		IDENTIFIER=74, NEWLINE=75, WS=76, LINE_COMMENT=77;
	public static final int
		RULE_program = 0, RULE_statement = 1, RULE_declareStatement = 2, RULE_constantStatement = 3, 
		RULE_dataType = 4, RULE_assignmentStatement = 5, RULE_inputStatement = 6, 
		RULE_outputStatement = 7, RULE_exprList = 8, RULE_ifStatement = 9, RULE_caseStatement = 10, 
		RULE_caseClause = 11, RULE_forStatement = 12, RULE_whileStatement = 13, 
		RULE_repeatStatement = 14, RULE_procedureDeclaration = 15, RULE_functionDeclaration = 16, 
		RULE_paramList = 17, RULE_param = 18, RULE_callStatement = 19, RULE_returnStatement = 20, 
		RULE_openFileStatement = 21, RULE_readFileStatement = 22, RULE_writeFileStatement = 23, 
		RULE_closeFileStatement = 24, RULE_fileMode = 25, RULE_argList = 26, RULE_block = 27, 
		RULE_expr = 28, RULE_atom = 29;
	private static String[] makeRuleNames() {
		return new String[] {
			"program", "statement", "declareStatement", "constantStatement", "dataType", 
			"assignmentStatement", "inputStatement", "outputStatement", "exprList", 
			"ifStatement", "caseStatement", "caseClause", "forStatement", "whileStatement", 
			"repeatStatement", "procedureDeclaration", "functionDeclaration", "paramList", 
			"param", "callStatement", "returnStatement", "openFileStatement", "readFileStatement", 
			"writeFileStatement", "closeFileStatement", "fileMode", "argList", "block", 
			"expr", "atom"
		};
	}
	public static final String[] ruleNames = makeRuleNames();

	private static String[] makeLiteralNames() {
		return new String[] {
			null, null, null, null, null, null, null, null, null, null, null, null, 
			null, null, null, null, null, null, null, null, null, null, null, null, 
			null, null, null, null, null, null, null, null, null, null, null, null, 
			null, null, null, null, null, null, null, null, null, null, null, null, 
			null, null, null, null, "'='", "'<>'", "'<='", "'>='", "'<'", "'>'", 
			"'+'", "'-'", "'*'", "'/'", "'^'", "'&'", "'('", "')'", "'['", "']'", 
			"','", "':'"
		};
	}
	private static final String[] _LITERAL_NAMES = makeLiteralNames();
	private static String[] makeSymbolicNames() {
		return new String[] {
			null, "DECLARE", "CONSTANT", "INPUT", "OUTPUT", "PRINT", "IF", "THEN", 
			"ELSE", "ELSEIF", "ENDIF", "CASE", "OF", "OTHERWISE", "ENDCASE", "FOR", 
			"TO", "STEP", "NEXT", "WHILE", "DO", "ENDWHILE", "REPEAT", "UNTIL", "PROCEDURE", 
			"ENDPROCEDURE", "FUNCTION", "ENDFUNCTION", "RETURNS", "RETURN", "CALL", 
			"ARRAY", "AND", "OR", "NOT", "TRUE", "FALSE", "MOD", "DIV", "OPENFILE", 
			"READFILE", "WRITEFILE", "CLOSEFILE", "READ_MODE", "WRITE_MODE", "APPEND_MODE", 
			"INTEGER_TYPE", "REAL_TYPE", "CHAR_TYPE", "STRING_TYPE", "BOOLEAN_TYPE", 
			"LARROW", "EQUALS", "NOTEQUAL", "LTE", "GTE", "LT", "GT", "PLUS", "MINUS", 
			"STAR", "SLASH", "CARET", "AMPERSAND", "LPAREN", "RPAREN", "LBRACKET", 
			"RBRACKET", "COMMA", "COLON", "REAL_LITERAL", "INTEGER_LITERAL", "STRING_LITERAL", 
			"CHAR_LITERAL", "IDENTIFIER", "NEWLINE", "WS", "LINE_COMMENT"
		};
	}
	private static final String[] _SYMBOLIC_NAMES = makeSymbolicNames();
	public static final Vocabulary VOCABULARY = new VocabularyImpl(_LITERAL_NAMES, _SYMBOLIC_NAMES);

	/**
	 * @deprecated Use {@link #VOCABULARY} instead.
	 */
	@Deprecated
	public static final String[] tokenNames;
	static {
		tokenNames = new String[_SYMBOLIC_NAMES.length];
		for (int i = 0; i < tokenNames.length; i++) {
			tokenNames[i] = VOCABULARY.getLiteralName(i);
			if (tokenNames[i] == null) {
				tokenNames[i] = VOCABULARY.getSymbolicName(i);
			}

			if (tokenNames[i] == null) {
				tokenNames[i] = "<INVALID>";
			}
		}
	}

	@Override
	@Deprecated
	public String[] getTokenNames() {
		return tokenNames;
	}

	@Override

	public Vocabulary getVocabulary() {
		return VOCABULARY;
	}

	@Override
	public String getGrammarFileName() { return "Pseudocode.g4"; }

	@Override
	public String[] getRuleNames() { return ruleNames; }

	@Override
	public String getSerializedATN() { return _serializedATN; }

	@Override
	public ATN getATN() { return _ATN; }

	public PseudocodeParser(TokenStream input) {
		super(input);
		_interp = new ParserATNSimulator(this,_ATN,_decisionToDFA,_sharedContextCache);
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ProgramContext extends ParserRuleContext {
		public TerminalNode EOF() { return getToken(PseudocodeParser.EOF, 0); }
		public List<TerminalNode> NEWLINE() { return getTokens(PseudocodeParser.NEWLINE); }
		public TerminalNode NEWLINE(int i) {
			return getToken(PseudocodeParser.NEWLINE, i);
		}
		public List<StatementContext> statement() {
			return getRuleContexts(StatementContext.class);
		}
		public StatementContext statement(int i) {
			return getRuleContext(StatementContext.class,i);
		}
		public ProgramContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_program; }
	}

	public final ProgramContext program() throws RecognitionException {
		ProgramContext _localctx = new ProgramContext(_ctx, getState());
		enterRule(_localctx, 0, RULE_program);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(63);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,0,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(60);
					match(NEWLINE);
					}
					} 
				}
				setState(65);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,0,_ctx);
			}
			setState(78);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if ((((_la) & ~0x3f) == 0 && ((1L << _la) & 8248036460670L) != 0) || _la==IDENTIFIER) {
				{
				setState(66);
				statement();
				setState(75);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,2,_ctx);
				while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
					if ( _alt==1 ) {
						{
						{
						setState(68); 
						_errHandler.sync(this);
						_la = _input.LA(1);
						do {
							{
							{
							setState(67);
							match(NEWLINE);
							}
							}
							setState(70); 
							_errHandler.sync(this);
							_la = _input.LA(1);
						} while ( _la==NEWLINE );
						setState(72);
						statement();
						}
						} 
					}
					setState(77);
					_errHandler.sync(this);
					_alt = getInterpreter().adaptivePredict(_input,2,_ctx);
				}
				}
			}

			setState(83);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==NEWLINE) {
				{
				{
				setState(80);
				match(NEWLINE);
				}
				}
				setState(85);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(86);
			match(EOF);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class StatementContext extends ParserRuleContext {
		public DeclareStatementContext declareStatement() {
			return getRuleContext(DeclareStatementContext.class,0);
		}
		public ConstantStatementContext constantStatement() {
			return getRuleContext(ConstantStatementContext.class,0);
		}
		public AssignmentStatementContext assignmentStatement() {
			return getRuleContext(AssignmentStatementContext.class,0);
		}
		public InputStatementContext inputStatement() {
			return getRuleContext(InputStatementContext.class,0);
		}
		public OutputStatementContext outputStatement() {
			return getRuleContext(OutputStatementContext.class,0);
		}
		public IfStatementContext ifStatement() {
			return getRuleContext(IfStatementContext.class,0);
		}
		public CaseStatementContext caseStatement() {
			return getRuleContext(CaseStatementContext.class,0);
		}
		public ForStatementContext forStatement() {
			return getRuleContext(ForStatementContext.class,0);
		}
		public WhileStatementContext whileStatement() {
			return getRuleContext(WhileStatementContext.class,0);
		}
		public RepeatStatementContext repeatStatement() {
			return getRuleContext(RepeatStatementContext.class,0);
		}
		public ProcedureDeclarationContext procedureDeclaration() {
			return getRuleContext(ProcedureDeclarationContext.class,0);
		}
		public FunctionDeclarationContext functionDeclaration() {
			return getRuleContext(FunctionDeclarationContext.class,0);
		}
		public CallStatementContext callStatement() {
			return getRuleContext(CallStatementContext.class,0);
		}
		public ReturnStatementContext returnStatement() {
			return getRuleContext(ReturnStatementContext.class,0);
		}
		public OpenFileStatementContext openFileStatement() {
			return getRuleContext(OpenFileStatementContext.class,0);
		}
		public ReadFileStatementContext readFileStatement() {
			return getRuleContext(ReadFileStatementContext.class,0);
		}
		public WriteFileStatementContext writeFileStatement() {
			return getRuleContext(WriteFileStatementContext.class,0);
		}
		public CloseFileStatementContext closeFileStatement() {
			return getRuleContext(CloseFileStatementContext.class,0);
		}
		public StatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_statement; }
	}

	public final StatementContext statement() throws RecognitionException {
		StatementContext _localctx = new StatementContext(_ctx, getState());
		enterRule(_localctx, 2, RULE_statement);
		try {
			setState(106);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case DECLARE:
				enterOuterAlt(_localctx, 1);
				{
				setState(88);
				declareStatement();
				}
				break;
			case CONSTANT:
				enterOuterAlt(_localctx, 2);
				{
				setState(89);
				constantStatement();
				}
				break;
			case IDENTIFIER:
				enterOuterAlt(_localctx, 3);
				{
				setState(90);
				assignmentStatement();
				}
				break;
			case INPUT:
				enterOuterAlt(_localctx, 4);
				{
				setState(91);
				inputStatement();
				}
				break;
			case OUTPUT:
			case PRINT:
				enterOuterAlt(_localctx, 5);
				{
				setState(92);
				outputStatement();
				}
				break;
			case IF:
				enterOuterAlt(_localctx, 6);
				{
				setState(93);
				ifStatement();
				}
				break;
			case CASE:
				enterOuterAlt(_localctx, 7);
				{
				setState(94);
				caseStatement();
				}
				break;
			case FOR:
				enterOuterAlt(_localctx, 8);
				{
				setState(95);
				forStatement();
				}
				break;
			case WHILE:
				enterOuterAlt(_localctx, 9);
				{
				setState(96);
				whileStatement();
				}
				break;
			case REPEAT:
				enterOuterAlt(_localctx, 10);
				{
				setState(97);
				repeatStatement();
				}
				break;
			case PROCEDURE:
				enterOuterAlt(_localctx, 11);
				{
				setState(98);
				procedureDeclaration();
				}
				break;
			case FUNCTION:
				enterOuterAlt(_localctx, 12);
				{
				setState(99);
				functionDeclaration();
				}
				break;
			case CALL:
				enterOuterAlt(_localctx, 13);
				{
				setState(100);
				callStatement();
				}
				break;
			case RETURN:
				enterOuterAlt(_localctx, 14);
				{
				setState(101);
				returnStatement();
				}
				break;
			case OPENFILE:
				enterOuterAlt(_localctx, 15);
				{
				setState(102);
				openFileStatement();
				}
				break;
			case READFILE:
				enterOuterAlt(_localctx, 16);
				{
				setState(103);
				readFileStatement();
				}
				break;
			case WRITEFILE:
				enterOuterAlt(_localctx, 17);
				{
				setState(104);
				writeFileStatement();
				}
				break;
			case CLOSEFILE:
				enterOuterAlt(_localctx, 18);
				{
				setState(105);
				closeFileStatement();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class DeclareStatementContext extends ParserRuleContext {
		public TerminalNode DECLARE() { return getToken(PseudocodeParser.DECLARE, 0); }
		public TerminalNode IDENTIFIER() { return getToken(PseudocodeParser.IDENTIFIER, 0); }
		public List<TerminalNode> COLON() { return getTokens(PseudocodeParser.COLON); }
		public TerminalNode COLON(int i) {
			return getToken(PseudocodeParser.COLON, i);
		}
		public TerminalNode ARRAY() { return getToken(PseudocodeParser.ARRAY, 0); }
		public TerminalNode LBRACKET() { return getToken(PseudocodeParser.LBRACKET, 0); }
		public List<ExprContext> expr() {
			return getRuleContexts(ExprContext.class);
		}
		public ExprContext expr(int i) {
			return getRuleContext(ExprContext.class,i);
		}
		public TerminalNode RBRACKET() { return getToken(PseudocodeParser.RBRACKET, 0); }
		public TerminalNode OF() { return getToken(PseudocodeParser.OF, 0); }
		public DataTypeContext dataType() {
			return getRuleContext(DataTypeContext.class,0);
		}
		public TerminalNode COMMA() { return getToken(PseudocodeParser.COMMA, 0); }
		public DeclareStatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_declareStatement; }
	}

	public final DeclareStatementContext declareStatement() throws RecognitionException {
		DeclareStatementContext _localctx = new DeclareStatementContext(_ctx, getState());
		enterRule(_localctx, 4, RULE_declareStatement);
		try {
			setState(140);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,6,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(108);
				match(DECLARE);
				setState(109);
				match(IDENTIFIER);
				setState(110);
				match(COLON);
				setState(111);
				match(ARRAY);
				setState(112);
				match(LBRACKET);
				setState(113);
				expr(0);
				setState(114);
				match(COLON);
				setState(115);
				expr(0);
				setState(116);
				match(RBRACKET);
				setState(117);
				match(OF);
				setState(118);
				dataType();
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(120);
				match(DECLARE);
				setState(121);
				match(IDENTIFIER);
				setState(122);
				match(COLON);
				setState(123);
				match(ARRAY);
				setState(124);
				match(LBRACKET);
				setState(125);
				expr(0);
				setState(126);
				match(COLON);
				setState(127);
				expr(0);
				setState(128);
				match(COMMA);
				setState(129);
				expr(0);
				setState(130);
				match(COLON);
				setState(131);
				expr(0);
				setState(132);
				match(RBRACKET);
				setState(133);
				match(OF);
				setState(134);
				dataType();
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(136);
				match(DECLARE);
				setState(137);
				match(IDENTIFIER);
				setState(138);
				match(COLON);
				setState(139);
				dataType();
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ConstantStatementContext extends ParserRuleContext {
		public TerminalNode CONSTANT() { return getToken(PseudocodeParser.CONSTANT, 0); }
		public TerminalNode IDENTIFIER() { return getToken(PseudocodeParser.IDENTIFIER, 0); }
		public ExprContext expr() {
			return getRuleContext(ExprContext.class,0);
		}
		public TerminalNode LARROW() { return getToken(PseudocodeParser.LARROW, 0); }
		public TerminalNode EQUALS() { return getToken(PseudocodeParser.EQUALS, 0); }
		public ConstantStatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_constantStatement; }
	}

	public final ConstantStatementContext constantStatement() throws RecognitionException {
		ConstantStatementContext _localctx = new ConstantStatementContext(_ctx, getState());
		enterRule(_localctx, 6, RULE_constantStatement);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(142);
			match(CONSTANT);
			setState(143);
			match(IDENTIFIER);
			setState(144);
			_la = _input.LA(1);
			if ( !(_la==LARROW || _la==EQUALS) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			setState(145);
			expr(0);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class DataTypeContext extends ParserRuleContext {
		public TerminalNode INTEGER_TYPE() { return getToken(PseudocodeParser.INTEGER_TYPE, 0); }
		public TerminalNode REAL_TYPE() { return getToken(PseudocodeParser.REAL_TYPE, 0); }
		public TerminalNode CHAR_TYPE() { return getToken(PseudocodeParser.CHAR_TYPE, 0); }
		public TerminalNode STRING_TYPE() { return getToken(PseudocodeParser.STRING_TYPE, 0); }
		public TerminalNode BOOLEAN_TYPE() { return getToken(PseudocodeParser.BOOLEAN_TYPE, 0); }
		public DataTypeContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_dataType; }
	}

	public final DataTypeContext dataType() throws RecognitionException {
		DataTypeContext _localctx = new DataTypeContext(_ctx, getState());
		enterRule(_localctx, 8, RULE_dataType);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(147);
			_la = _input.LA(1);
			if ( !((((_la) & ~0x3f) == 0 && ((1L << _la) & 2181431069507584L) != 0)) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class AssignmentStatementContext extends ParserRuleContext {
		public TerminalNode IDENTIFIER() { return getToken(PseudocodeParser.IDENTIFIER, 0); }
		public TerminalNode EQUALS() { return getToken(PseudocodeParser.EQUALS, 0); }
		public List<ExprContext> expr() {
			return getRuleContexts(ExprContext.class);
		}
		public ExprContext expr(int i) {
			return getRuleContext(ExprContext.class,i);
		}
		public TerminalNode LBRACKET() { return getToken(PseudocodeParser.LBRACKET, 0); }
		public TerminalNode RBRACKET() { return getToken(PseudocodeParser.RBRACKET, 0); }
		public TerminalNode COMMA() { return getToken(PseudocodeParser.COMMA, 0); }
		public TerminalNode LARROW() { return getToken(PseudocodeParser.LARROW, 0); }
		public AssignmentStatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_assignmentStatement; }
	}

	public final AssignmentStatementContext assignmentStatement() throws RecognitionException {
		AssignmentStatementContext _localctx = new AssignmentStatementContext(_ctx, getState());
		enterRule(_localctx, 10, RULE_assignmentStatement);
		try {
			setState(187);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,7,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(149);
				match(IDENTIFIER);
				setState(150);
				match(EQUALS);
				setState(151);
				expr(0);
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(152);
				match(IDENTIFIER);
				setState(153);
				match(LBRACKET);
				setState(154);
				expr(0);
				setState(155);
				match(RBRACKET);
				setState(156);
				match(EQUALS);
				setState(157);
				expr(0);
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(159);
				match(IDENTIFIER);
				setState(160);
				match(LBRACKET);
				setState(161);
				expr(0);
				setState(162);
				match(COMMA);
				setState(163);
				expr(0);
				setState(164);
				match(RBRACKET);
				setState(165);
				match(EQUALS);
				setState(166);
				expr(0);
				}
				break;
			case 4:
				enterOuterAlt(_localctx, 4);
				{
				setState(168);
				match(IDENTIFIER);
				setState(169);
				match(LARROW);
				setState(170);
				expr(0);
				}
				break;
			case 5:
				enterOuterAlt(_localctx, 5);
				{
				setState(171);
				match(IDENTIFIER);
				setState(172);
				match(LBRACKET);
				setState(173);
				expr(0);
				setState(174);
				match(RBRACKET);
				setState(175);
				match(LARROW);
				setState(176);
				expr(0);
				}
				break;
			case 6:
				enterOuterAlt(_localctx, 6);
				{
				setState(178);
				match(IDENTIFIER);
				setState(179);
				match(LBRACKET);
				setState(180);
				expr(0);
				setState(181);
				match(COMMA);
				setState(182);
				expr(0);
				setState(183);
				match(RBRACKET);
				setState(184);
				match(LARROW);
				setState(185);
				expr(0);
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class InputStatementContext extends ParserRuleContext {
		public TerminalNode INPUT() { return getToken(PseudocodeParser.INPUT, 0); }
		public TerminalNode IDENTIFIER() { return getToken(PseudocodeParser.IDENTIFIER, 0); }
		public TerminalNode LBRACKET() { return getToken(PseudocodeParser.LBRACKET, 0); }
		public ExprContext expr() {
			return getRuleContext(ExprContext.class,0);
		}
		public TerminalNode RBRACKET() { return getToken(PseudocodeParser.RBRACKET, 0); }
		public InputStatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_inputStatement; }
	}

	public final InputStatementContext inputStatement() throws RecognitionException {
		InputStatementContext _localctx = new InputStatementContext(_ctx, getState());
		enterRule(_localctx, 12, RULE_inputStatement);
		try {
			setState(197);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,8,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(189);
				match(INPUT);
				setState(190);
				match(IDENTIFIER);
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(191);
				match(INPUT);
				setState(192);
				match(IDENTIFIER);
				setState(193);
				match(LBRACKET);
				setState(194);
				expr(0);
				setState(195);
				match(RBRACKET);
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class OutputStatementContext extends ParserRuleContext {
		public ExprListContext exprList() {
			return getRuleContext(ExprListContext.class,0);
		}
		public TerminalNode OUTPUT() { return getToken(PseudocodeParser.OUTPUT, 0); }
		public TerminalNode PRINT() { return getToken(PseudocodeParser.PRINT, 0); }
		public OutputStatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_outputStatement; }
	}

	public final OutputStatementContext outputStatement() throws RecognitionException {
		OutputStatementContext _localctx = new OutputStatementContext(_ctx, getState());
		enterRule(_localctx, 14, RULE_outputStatement);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(199);
			_la = _input.LA(1);
			if ( !(_la==OUTPUT || _la==PRINT) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			setState(200);
			exprList();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ExprListContext extends ParserRuleContext {
		public List<ExprContext> expr() {
			return getRuleContexts(ExprContext.class);
		}
		public ExprContext expr(int i) {
			return getRuleContext(ExprContext.class,i);
		}
		public List<TerminalNode> COMMA() { return getTokens(PseudocodeParser.COMMA); }
		public TerminalNode COMMA(int i) {
			return getToken(PseudocodeParser.COMMA, i);
		}
		public ExprListContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_exprList; }
	}

	public final ExprListContext exprList() throws RecognitionException {
		ExprListContext _localctx = new ExprListContext(_ctx, getState());
		enterRule(_localctx, 16, RULE_exprList);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(202);
			expr(0);
			setState(207);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==COMMA) {
				{
				{
				setState(203);
				match(COMMA);
				setState(204);
				expr(0);
				}
				}
				setState(209);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class IfStatementContext extends ParserRuleContext {
		public TerminalNode IF() { return getToken(PseudocodeParser.IF, 0); }
		public List<ExprContext> expr() {
			return getRuleContexts(ExprContext.class);
		}
		public ExprContext expr(int i) {
			return getRuleContext(ExprContext.class,i);
		}
		public List<TerminalNode> THEN() { return getTokens(PseudocodeParser.THEN); }
		public TerminalNode THEN(int i) {
			return getToken(PseudocodeParser.THEN, i);
		}
		public List<BlockContext> block() {
			return getRuleContexts(BlockContext.class);
		}
		public BlockContext block(int i) {
			return getRuleContext(BlockContext.class,i);
		}
		public TerminalNode ENDIF() { return getToken(PseudocodeParser.ENDIF, 0); }
		public List<TerminalNode> NEWLINE() { return getTokens(PseudocodeParser.NEWLINE); }
		public TerminalNode NEWLINE(int i) {
			return getToken(PseudocodeParser.NEWLINE, i);
		}
		public List<TerminalNode> ELSEIF() { return getTokens(PseudocodeParser.ELSEIF); }
		public TerminalNode ELSEIF(int i) {
			return getToken(PseudocodeParser.ELSEIF, i);
		}
		public TerminalNode ELSE() { return getToken(PseudocodeParser.ELSE, 0); }
		public IfStatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_ifStatement; }
	}

	public final IfStatementContext ifStatement() throws RecognitionException {
		IfStatementContext _localctx = new IfStatementContext(_ctx, getState());
		enterRule(_localctx, 18, RULE_ifStatement);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(210);
			match(IF);
			setState(211);
			expr(0);
			setState(212);
			match(THEN);
			setState(214); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(213);
				match(NEWLINE);
				}
				}
				setState(216); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==NEWLINE );
			setState(218);
			block();
			setState(236);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,13,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(220); 
					_errHandler.sync(this);
					_la = _input.LA(1);
					do {
						{
						{
						setState(219);
						match(NEWLINE);
						}
						}
						setState(222); 
						_errHandler.sync(this);
						_la = _input.LA(1);
					} while ( _la==NEWLINE );
					setState(224);
					match(ELSEIF);
					setState(225);
					expr(0);
					setState(226);
					match(THEN);
					setState(228); 
					_errHandler.sync(this);
					_la = _input.LA(1);
					do {
						{
						{
						setState(227);
						match(NEWLINE);
						}
						}
						setState(230); 
						_errHandler.sync(this);
						_la = _input.LA(1);
					} while ( _la==NEWLINE );
					setState(232);
					block();
					}
					} 
				}
				setState(238);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,13,_ctx);
			}
			setState(251);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,16,_ctx) ) {
			case 1:
				{
				setState(240); 
				_errHandler.sync(this);
				_la = _input.LA(1);
				do {
					{
					{
					setState(239);
					match(NEWLINE);
					}
					}
					setState(242); 
					_errHandler.sync(this);
					_la = _input.LA(1);
				} while ( _la==NEWLINE );
				setState(244);
				match(ELSE);
				setState(246); 
				_errHandler.sync(this);
				_la = _input.LA(1);
				do {
					{
					{
					setState(245);
					match(NEWLINE);
					}
					}
					setState(248); 
					_errHandler.sync(this);
					_la = _input.LA(1);
				} while ( _la==NEWLINE );
				setState(250);
				block();
				}
				break;
			}
			setState(254); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(253);
				match(NEWLINE);
				}
				}
				setState(256); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==NEWLINE );
			setState(258);
			match(ENDIF);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class CaseStatementContext extends ParserRuleContext {
		public TerminalNode CASE() { return getToken(PseudocodeParser.CASE, 0); }
		public TerminalNode OF() { return getToken(PseudocodeParser.OF, 0); }
		public TerminalNode IDENTIFIER() { return getToken(PseudocodeParser.IDENTIFIER, 0); }
		public TerminalNode ENDCASE() { return getToken(PseudocodeParser.ENDCASE, 0); }
		public List<TerminalNode> NEWLINE() { return getTokens(PseudocodeParser.NEWLINE); }
		public TerminalNode NEWLINE(int i) {
			return getToken(PseudocodeParser.NEWLINE, i);
		}
		public List<CaseClauseContext> caseClause() {
			return getRuleContexts(CaseClauseContext.class);
		}
		public CaseClauseContext caseClause(int i) {
			return getRuleContext(CaseClauseContext.class,i);
		}
		public TerminalNode OTHERWISE() { return getToken(PseudocodeParser.OTHERWISE, 0); }
		public TerminalNode COLON() { return getToken(PseudocodeParser.COLON, 0); }
		public BlockContext block() {
			return getRuleContext(BlockContext.class,0);
		}
		public CaseStatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_caseStatement; }
	}

	public final CaseStatementContext caseStatement() throws RecognitionException {
		CaseStatementContext _localctx = new CaseStatementContext(_ctx, getState());
		enterRule(_localctx, 20, RULE_caseStatement);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(260);
			match(CASE);
			setState(261);
			match(OF);
			setState(262);
			match(IDENTIFIER);
			setState(264); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(263);
				match(NEWLINE);
				}
				}
				setState(266); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==NEWLINE );
			setState(269); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(268);
				caseClause();
				}
				}
				setState(271); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( ((((_la - 34)) & ~0x3f) == 0 && ((1L << (_la - 34)) & 2131411075103L) != 0) );
			setState(286);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==OTHERWISE) {
				{
				setState(273);
				match(OTHERWISE);
				setState(274);
				match(COLON);
				setState(276); 
				_errHandler.sync(this);
				_la = _input.LA(1);
				do {
					{
					{
					setState(275);
					match(NEWLINE);
					}
					}
					setState(278); 
					_errHandler.sync(this);
					_la = _input.LA(1);
				} while ( _la==NEWLINE );
				setState(280);
				block();
				setState(282); 
				_errHandler.sync(this);
				_la = _input.LA(1);
				do {
					{
					{
					setState(281);
					match(NEWLINE);
					}
					}
					setState(284); 
					_errHandler.sync(this);
					_la = _input.LA(1);
				} while ( _la==NEWLINE );
				}
			}

			setState(288);
			match(ENDCASE);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class CaseClauseContext extends ParserRuleContext {
		public ExprContext expr() {
			return getRuleContext(ExprContext.class,0);
		}
		public TerminalNode COLON() { return getToken(PseudocodeParser.COLON, 0); }
		public BlockContext block() {
			return getRuleContext(BlockContext.class,0);
		}
		public List<TerminalNode> NEWLINE() { return getTokens(PseudocodeParser.NEWLINE); }
		public TerminalNode NEWLINE(int i) {
			return getToken(PseudocodeParser.NEWLINE, i);
		}
		public CaseClauseContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_caseClause; }
	}

	public final CaseClauseContext caseClause() throws RecognitionException {
		CaseClauseContext _localctx = new CaseClauseContext(_ctx, getState());
		enterRule(_localctx, 22, RULE_caseClause);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(290);
			expr(0);
			setState(291);
			match(COLON);
			setState(293); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(292);
				match(NEWLINE);
				}
				}
				setState(295); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==NEWLINE );
			setState(297);
			block();
			setState(299); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(298);
				match(NEWLINE);
				}
				}
				setState(301); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==NEWLINE );
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ForStatementContext extends ParserRuleContext {
		public TerminalNode FOR() { return getToken(PseudocodeParser.FOR, 0); }
		public List<TerminalNode> IDENTIFIER() { return getTokens(PseudocodeParser.IDENTIFIER); }
		public TerminalNode IDENTIFIER(int i) {
			return getToken(PseudocodeParser.IDENTIFIER, i);
		}
		public List<ExprContext> expr() {
			return getRuleContexts(ExprContext.class);
		}
		public ExprContext expr(int i) {
			return getRuleContext(ExprContext.class,i);
		}
		public TerminalNode TO() { return getToken(PseudocodeParser.TO, 0); }
		public BlockContext block() {
			return getRuleContext(BlockContext.class,0);
		}
		public TerminalNode NEXT() { return getToken(PseudocodeParser.NEXT, 0); }
		public TerminalNode LARROW() { return getToken(PseudocodeParser.LARROW, 0); }
		public TerminalNode EQUALS() { return getToken(PseudocodeParser.EQUALS, 0); }
		public TerminalNode STEP() { return getToken(PseudocodeParser.STEP, 0); }
		public List<TerminalNode> NEWLINE() { return getTokens(PseudocodeParser.NEWLINE); }
		public TerminalNode NEWLINE(int i) {
			return getToken(PseudocodeParser.NEWLINE, i);
		}
		public ForStatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_forStatement; }
	}

	public final ForStatementContext forStatement() throws RecognitionException {
		ForStatementContext _localctx = new ForStatementContext(_ctx, getState());
		enterRule(_localctx, 24, RULE_forStatement);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(303);
			match(FOR);
			setState(304);
			match(IDENTIFIER);
			setState(305);
			_la = _input.LA(1);
			if ( !(_la==LARROW || _la==EQUALS) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			setState(306);
			expr(0);
			setState(307);
			match(TO);
			setState(308);
			expr(0);
			setState(311);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==STEP) {
				{
				setState(309);
				match(STEP);
				setState(310);
				expr(0);
				}
			}

			setState(314); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(313);
				match(NEWLINE);
				}
				}
				setState(316); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==NEWLINE );
			setState(318);
			block();
			setState(320); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(319);
				match(NEWLINE);
				}
				}
				setState(322); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==NEWLINE );
			setState(324);
			match(NEXT);
			setState(325);
			match(IDENTIFIER);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class WhileStatementContext extends ParserRuleContext {
		public TerminalNode WHILE() { return getToken(PseudocodeParser.WHILE, 0); }
		public ExprContext expr() {
			return getRuleContext(ExprContext.class,0);
		}
		public BlockContext block() {
			return getRuleContext(BlockContext.class,0);
		}
		public TerminalNode ENDWHILE() { return getToken(PseudocodeParser.ENDWHILE, 0); }
		public TerminalNode DO() { return getToken(PseudocodeParser.DO, 0); }
		public List<TerminalNode> NEWLINE() { return getTokens(PseudocodeParser.NEWLINE); }
		public TerminalNode NEWLINE(int i) {
			return getToken(PseudocodeParser.NEWLINE, i);
		}
		public WhileStatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_whileStatement; }
	}

	public final WhileStatementContext whileStatement() throws RecognitionException {
		WhileStatementContext _localctx = new WhileStatementContext(_ctx, getState());
		enterRule(_localctx, 26, RULE_whileStatement);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(327);
			match(WHILE);
			setState(328);
			expr(0);
			setState(330);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==DO) {
				{
				setState(329);
				match(DO);
				}
			}

			setState(333); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(332);
				match(NEWLINE);
				}
				}
				setState(335); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==NEWLINE );
			setState(337);
			block();
			setState(339); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(338);
				match(NEWLINE);
				}
				}
				setState(341); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==NEWLINE );
			setState(343);
			match(ENDWHILE);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class RepeatStatementContext extends ParserRuleContext {
		public TerminalNode REPEAT() { return getToken(PseudocodeParser.REPEAT, 0); }
		public BlockContext block() {
			return getRuleContext(BlockContext.class,0);
		}
		public TerminalNode UNTIL() { return getToken(PseudocodeParser.UNTIL, 0); }
		public ExprContext expr() {
			return getRuleContext(ExprContext.class,0);
		}
		public List<TerminalNode> NEWLINE() { return getTokens(PseudocodeParser.NEWLINE); }
		public TerminalNode NEWLINE(int i) {
			return getToken(PseudocodeParser.NEWLINE, i);
		}
		public RepeatStatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_repeatStatement; }
	}

	public final RepeatStatementContext repeatStatement() throws RecognitionException {
		RepeatStatementContext _localctx = new RepeatStatementContext(_ctx, getState());
		enterRule(_localctx, 28, RULE_repeatStatement);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(345);
			match(REPEAT);
			setState(347); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(346);
				match(NEWLINE);
				}
				}
				setState(349); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==NEWLINE );
			setState(351);
			block();
			setState(353); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(352);
				match(NEWLINE);
				}
				}
				setState(355); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==NEWLINE );
			setState(357);
			match(UNTIL);
			setState(358);
			expr(0);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ProcedureDeclarationContext extends ParserRuleContext {
		public TerminalNode PROCEDURE() { return getToken(PseudocodeParser.PROCEDURE, 0); }
		public TerminalNode IDENTIFIER() { return getToken(PseudocodeParser.IDENTIFIER, 0); }
		public TerminalNode LPAREN() { return getToken(PseudocodeParser.LPAREN, 0); }
		public TerminalNode RPAREN() { return getToken(PseudocodeParser.RPAREN, 0); }
		public BlockContext block() {
			return getRuleContext(BlockContext.class,0);
		}
		public TerminalNode ENDPROCEDURE() { return getToken(PseudocodeParser.ENDPROCEDURE, 0); }
		public ParamListContext paramList() {
			return getRuleContext(ParamListContext.class,0);
		}
		public List<TerminalNode> NEWLINE() { return getTokens(PseudocodeParser.NEWLINE); }
		public TerminalNode NEWLINE(int i) {
			return getToken(PseudocodeParser.NEWLINE, i);
		}
		public ProcedureDeclarationContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_procedureDeclaration; }
	}

	public final ProcedureDeclarationContext procedureDeclaration() throws RecognitionException {
		ProcedureDeclarationContext _localctx = new ProcedureDeclarationContext(_ctx, getState());
		enterRule(_localctx, 30, RULE_procedureDeclaration);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(360);
			match(PROCEDURE);
			setState(361);
			match(IDENTIFIER);
			setState(362);
			match(LPAREN);
			setState(364);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==IDENTIFIER) {
				{
				setState(363);
				paramList();
				}
			}

			setState(366);
			match(RPAREN);
			setState(368); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(367);
				match(NEWLINE);
				}
				}
				setState(370); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==NEWLINE );
			setState(372);
			block();
			setState(374); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(373);
				match(NEWLINE);
				}
				}
				setState(376); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==NEWLINE );
			setState(378);
			match(ENDPROCEDURE);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class FunctionDeclarationContext extends ParserRuleContext {
		public TerminalNode FUNCTION() { return getToken(PseudocodeParser.FUNCTION, 0); }
		public TerminalNode IDENTIFIER() { return getToken(PseudocodeParser.IDENTIFIER, 0); }
		public TerminalNode LPAREN() { return getToken(PseudocodeParser.LPAREN, 0); }
		public TerminalNode RPAREN() { return getToken(PseudocodeParser.RPAREN, 0); }
		public TerminalNode RETURNS() { return getToken(PseudocodeParser.RETURNS, 0); }
		public DataTypeContext dataType() {
			return getRuleContext(DataTypeContext.class,0);
		}
		public BlockContext block() {
			return getRuleContext(BlockContext.class,0);
		}
		public TerminalNode ENDFUNCTION() { return getToken(PseudocodeParser.ENDFUNCTION, 0); }
		public ParamListContext paramList() {
			return getRuleContext(ParamListContext.class,0);
		}
		public List<TerminalNode> NEWLINE() { return getTokens(PseudocodeParser.NEWLINE); }
		public TerminalNode NEWLINE(int i) {
			return getToken(PseudocodeParser.NEWLINE, i);
		}
		public FunctionDeclarationContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_functionDeclaration; }
	}

	public final FunctionDeclarationContext functionDeclaration() throws RecognitionException {
		FunctionDeclarationContext _localctx = new FunctionDeclarationContext(_ctx, getState());
		enterRule(_localctx, 32, RULE_functionDeclaration);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(380);
			match(FUNCTION);
			setState(381);
			match(IDENTIFIER);
			setState(382);
			match(LPAREN);
			setState(384);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==IDENTIFIER) {
				{
				setState(383);
				paramList();
				}
			}

			setState(386);
			match(RPAREN);
			setState(387);
			match(RETURNS);
			setState(388);
			dataType();
			setState(390); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(389);
				match(NEWLINE);
				}
				}
				setState(392); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==NEWLINE );
			setState(394);
			block();
			setState(396); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(395);
				match(NEWLINE);
				}
				}
				setState(398); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==NEWLINE );
			setState(400);
			match(ENDFUNCTION);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ParamListContext extends ParserRuleContext {
		public List<ParamContext> param() {
			return getRuleContexts(ParamContext.class);
		}
		public ParamContext param(int i) {
			return getRuleContext(ParamContext.class,i);
		}
		public List<TerminalNode> COMMA() { return getTokens(PseudocodeParser.COMMA); }
		public TerminalNode COMMA(int i) {
			return getToken(PseudocodeParser.COMMA, i);
		}
		public ParamListContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_paramList; }
	}

	public final ParamListContext paramList() throws RecognitionException {
		ParamListContext _localctx = new ParamListContext(_ctx, getState());
		enterRule(_localctx, 34, RULE_paramList);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(402);
			param();
			setState(407);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==COMMA) {
				{
				{
				setState(403);
				match(COMMA);
				setState(404);
				param();
				}
				}
				setState(409);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ParamContext extends ParserRuleContext {
		public TerminalNode IDENTIFIER() { return getToken(PseudocodeParser.IDENTIFIER, 0); }
		public TerminalNode COLON() { return getToken(PseudocodeParser.COLON, 0); }
		public DataTypeContext dataType() {
			return getRuleContext(DataTypeContext.class,0);
		}
		public ParamContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_param; }
	}

	public final ParamContext param() throws RecognitionException {
		ParamContext _localctx = new ParamContext(_ctx, getState());
		enterRule(_localctx, 36, RULE_param);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(410);
			match(IDENTIFIER);
			setState(411);
			match(COLON);
			setState(412);
			dataType();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class CallStatementContext extends ParserRuleContext {
		public TerminalNode CALL() { return getToken(PseudocodeParser.CALL, 0); }
		public TerminalNode IDENTIFIER() { return getToken(PseudocodeParser.IDENTIFIER, 0); }
		public TerminalNode LPAREN() { return getToken(PseudocodeParser.LPAREN, 0); }
		public TerminalNode RPAREN() { return getToken(PseudocodeParser.RPAREN, 0); }
		public ArgListContext argList() {
			return getRuleContext(ArgListContext.class,0);
		}
		public CallStatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_callStatement; }
	}

	public final CallStatementContext callStatement() throws RecognitionException {
		CallStatementContext _localctx = new CallStatementContext(_ctx, getState());
		enterRule(_localctx, 38, RULE_callStatement);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(414);
			match(CALL);
			setState(415);
			match(IDENTIFIER);
			setState(416);
			match(LPAREN);
			setState(418);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (((((_la - 34)) & ~0x3f) == 0 && ((1L << (_la - 34)) & 2131411075103L) != 0)) {
				{
				setState(417);
				argList();
				}
			}

			setState(420);
			match(RPAREN);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ReturnStatementContext extends ParserRuleContext {
		public TerminalNode RETURN() { return getToken(PseudocodeParser.RETURN, 0); }
		public ExprContext expr() {
			return getRuleContext(ExprContext.class,0);
		}
		public ReturnStatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_returnStatement; }
	}

	public final ReturnStatementContext returnStatement() throws RecognitionException {
		ReturnStatementContext _localctx = new ReturnStatementContext(_ctx, getState());
		enterRule(_localctx, 40, RULE_returnStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(422);
			match(RETURN);
			setState(423);
			expr(0);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class OpenFileStatementContext extends ParserRuleContext {
		public TerminalNode OPENFILE() { return getToken(PseudocodeParser.OPENFILE, 0); }
		public ExprContext expr() {
			return getRuleContext(ExprContext.class,0);
		}
		public TerminalNode FOR() { return getToken(PseudocodeParser.FOR, 0); }
		public FileModeContext fileMode() {
			return getRuleContext(FileModeContext.class,0);
		}
		public OpenFileStatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_openFileStatement; }
	}

	public final OpenFileStatementContext openFileStatement() throws RecognitionException {
		OpenFileStatementContext _localctx = new OpenFileStatementContext(_ctx, getState());
		enterRule(_localctx, 42, RULE_openFileStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(425);
			match(OPENFILE);
			setState(426);
			expr(0);
			setState(427);
			match(FOR);
			setState(428);
			fileMode();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ReadFileStatementContext extends ParserRuleContext {
		public TerminalNode READFILE() { return getToken(PseudocodeParser.READFILE, 0); }
		public ExprContext expr() {
			return getRuleContext(ExprContext.class,0);
		}
		public TerminalNode COMMA() { return getToken(PseudocodeParser.COMMA, 0); }
		public TerminalNode IDENTIFIER() { return getToken(PseudocodeParser.IDENTIFIER, 0); }
		public ReadFileStatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_readFileStatement; }
	}

	public final ReadFileStatementContext readFileStatement() throws RecognitionException {
		ReadFileStatementContext _localctx = new ReadFileStatementContext(_ctx, getState());
		enterRule(_localctx, 44, RULE_readFileStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(430);
			match(READFILE);
			setState(431);
			expr(0);
			setState(432);
			match(COMMA);
			setState(433);
			match(IDENTIFIER);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class WriteFileStatementContext extends ParserRuleContext {
		public TerminalNode WRITEFILE() { return getToken(PseudocodeParser.WRITEFILE, 0); }
		public List<ExprContext> expr() {
			return getRuleContexts(ExprContext.class);
		}
		public ExprContext expr(int i) {
			return getRuleContext(ExprContext.class,i);
		}
		public TerminalNode COMMA() { return getToken(PseudocodeParser.COMMA, 0); }
		public WriteFileStatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_writeFileStatement; }
	}

	public final WriteFileStatementContext writeFileStatement() throws RecognitionException {
		WriteFileStatementContext _localctx = new WriteFileStatementContext(_ctx, getState());
		enterRule(_localctx, 46, RULE_writeFileStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(435);
			match(WRITEFILE);
			setState(436);
			expr(0);
			setState(437);
			match(COMMA);
			setState(438);
			expr(0);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class CloseFileStatementContext extends ParserRuleContext {
		public TerminalNode CLOSEFILE() { return getToken(PseudocodeParser.CLOSEFILE, 0); }
		public ExprContext expr() {
			return getRuleContext(ExprContext.class,0);
		}
		public CloseFileStatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_closeFileStatement; }
	}

	public final CloseFileStatementContext closeFileStatement() throws RecognitionException {
		CloseFileStatementContext _localctx = new CloseFileStatementContext(_ctx, getState());
		enterRule(_localctx, 48, RULE_closeFileStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(440);
			match(CLOSEFILE);
			setState(441);
			expr(0);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class FileModeContext extends ParserRuleContext {
		public TerminalNode READ_MODE() { return getToken(PseudocodeParser.READ_MODE, 0); }
		public TerminalNode WRITE_MODE() { return getToken(PseudocodeParser.WRITE_MODE, 0); }
		public TerminalNode APPEND_MODE() { return getToken(PseudocodeParser.APPEND_MODE, 0); }
		public FileModeContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_fileMode; }
	}

	public final FileModeContext fileMode() throws RecognitionException {
		FileModeContext _localctx = new FileModeContext(_ctx, getState());
		enterRule(_localctx, 50, RULE_fileMode);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(443);
			_la = _input.LA(1);
			if ( !((((_la) & ~0x3f) == 0 && ((1L << _la) & 61572651155456L) != 0)) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ArgListContext extends ParserRuleContext {
		public List<ExprContext> expr() {
			return getRuleContexts(ExprContext.class);
		}
		public ExprContext expr(int i) {
			return getRuleContext(ExprContext.class,i);
		}
		public List<TerminalNode> COMMA() { return getTokens(PseudocodeParser.COMMA); }
		public TerminalNode COMMA(int i) {
			return getToken(PseudocodeParser.COMMA, i);
		}
		public ArgListContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_argList; }
	}

	public final ArgListContext argList() throws RecognitionException {
		ArgListContext _localctx = new ArgListContext(_ctx, getState());
		enterRule(_localctx, 52, RULE_argList);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(445);
			expr(0);
			setState(450);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==COMMA) {
				{
				{
				setState(446);
				match(COMMA);
				setState(447);
				expr(0);
				}
				}
				setState(452);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class BlockContext extends ParserRuleContext {
		public List<StatementContext> statement() {
			return getRuleContexts(StatementContext.class);
		}
		public StatementContext statement(int i) {
			return getRuleContext(StatementContext.class,i);
		}
		public List<TerminalNode> NEWLINE() { return getTokens(PseudocodeParser.NEWLINE); }
		public TerminalNode NEWLINE(int i) {
			return getToken(PseudocodeParser.NEWLINE, i);
		}
		public BlockContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_block; }
	}

	public final BlockContext block() throws RecognitionException {
		BlockContext _localctx = new BlockContext(_ctx, getState());
		enterRule(_localctx, 54, RULE_block);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(453);
			statement();
			setState(462);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,43,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(455); 
					_errHandler.sync(this);
					_la = _input.LA(1);
					do {
						{
						{
						setState(454);
						match(NEWLINE);
						}
						}
						setState(457); 
						_errHandler.sync(this);
						_la = _input.LA(1);
					} while ( _la==NEWLINE );
					setState(459);
					statement();
					}
					} 
				}
				setState(464);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,43,_ctx);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ExprContext extends ParserRuleContext {
		public ExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_expr; }
	 
		public ExprContext() { }
		public void copyFrom(ExprContext ctx) {
			super.copyFrom(ctx);
		}
	}
	@SuppressWarnings("CheckReturnValue")
	public static class NotExprContext extends ExprContext {
		public TerminalNode NOT() { return getToken(PseudocodeParser.NOT, 0); }
		public ExprContext expr() {
			return getRuleContext(ExprContext.class,0);
		}
		public NotExprContext(ExprContext ctx) { copyFrom(ctx); }
	}
	@SuppressWarnings("CheckReturnValue")
	public static class PowerExprContext extends ExprContext {
		public List<ExprContext> expr() {
			return getRuleContexts(ExprContext.class);
		}
		public ExprContext expr(int i) {
			return getRuleContext(ExprContext.class,i);
		}
		public TerminalNode CARET() { return getToken(PseudocodeParser.CARET, 0); }
		public PowerExprContext(ExprContext ctx) { copyFrom(ctx); }
	}
	@SuppressWarnings("CheckReturnValue")
	public static class AddSubExprContext extends ExprContext {
		public Token op;
		public List<ExprContext> expr() {
			return getRuleContexts(ExprContext.class);
		}
		public ExprContext expr(int i) {
			return getRuleContext(ExprContext.class,i);
		}
		public TerminalNode PLUS() { return getToken(PseudocodeParser.PLUS, 0); }
		public TerminalNode MINUS() { return getToken(PseudocodeParser.MINUS, 0); }
		public AddSubExprContext(ExprContext ctx) { copyFrom(ctx); }
	}
	@SuppressWarnings("CheckReturnValue")
	public static class UnaryMinusExprContext extends ExprContext {
		public TerminalNode MINUS() { return getToken(PseudocodeParser.MINUS, 0); }
		public ExprContext expr() {
			return getRuleContext(ExprContext.class,0);
		}
		public UnaryMinusExprContext(ExprContext ctx) { copyFrom(ctx); }
	}
	@SuppressWarnings("CheckReturnValue")
	public static class AtomExprContext extends ExprContext {
		public AtomContext atom() {
			return getRuleContext(AtomContext.class,0);
		}
		public AtomExprContext(ExprContext ctx) { copyFrom(ctx); }
	}
	@SuppressWarnings("CheckReturnValue")
	public static class OrExprContext extends ExprContext {
		public List<ExprContext> expr() {
			return getRuleContexts(ExprContext.class);
		}
		public ExprContext expr(int i) {
			return getRuleContext(ExprContext.class,i);
		}
		public TerminalNode OR() { return getToken(PseudocodeParser.OR, 0); }
		public OrExprContext(ExprContext ctx) { copyFrom(ctx); }
	}
	@SuppressWarnings("CheckReturnValue")
	public static class ComparisonExprContext extends ExprContext {
		public Token op;
		public List<ExprContext> expr() {
			return getRuleContexts(ExprContext.class);
		}
		public ExprContext expr(int i) {
			return getRuleContext(ExprContext.class,i);
		}
		public TerminalNode EQUALS() { return getToken(PseudocodeParser.EQUALS, 0); }
		public TerminalNode NOTEQUAL() { return getToken(PseudocodeParser.NOTEQUAL, 0); }
		public TerminalNode LT() { return getToken(PseudocodeParser.LT, 0); }
		public TerminalNode GT() { return getToken(PseudocodeParser.GT, 0); }
		public TerminalNode LTE() { return getToken(PseudocodeParser.LTE, 0); }
		public TerminalNode GTE() { return getToken(PseudocodeParser.GTE, 0); }
		public ComparisonExprContext(ExprContext ctx) { copyFrom(ctx); }
	}
	@SuppressWarnings("CheckReturnValue")
	public static class MulDivExprContext extends ExprContext {
		public Token op;
		public List<ExprContext> expr() {
			return getRuleContexts(ExprContext.class);
		}
		public ExprContext expr(int i) {
			return getRuleContext(ExprContext.class,i);
		}
		public TerminalNode STAR() { return getToken(PseudocodeParser.STAR, 0); }
		public TerminalNode SLASH() { return getToken(PseudocodeParser.SLASH, 0); }
		public TerminalNode DIV() { return getToken(PseudocodeParser.DIV, 0); }
		public TerminalNode MOD() { return getToken(PseudocodeParser.MOD, 0); }
		public MulDivExprContext(ExprContext ctx) { copyFrom(ctx); }
	}
	@SuppressWarnings("CheckReturnValue")
	public static class ConcatExprContext extends ExprContext {
		public List<ExprContext> expr() {
			return getRuleContexts(ExprContext.class);
		}
		public ExprContext expr(int i) {
			return getRuleContext(ExprContext.class,i);
		}
		public TerminalNode AMPERSAND() { return getToken(PseudocodeParser.AMPERSAND, 0); }
		public ConcatExprContext(ExprContext ctx) { copyFrom(ctx); }
	}
	@SuppressWarnings("CheckReturnValue")
	public static class AndExprContext extends ExprContext {
		public List<ExprContext> expr() {
			return getRuleContexts(ExprContext.class);
		}
		public ExprContext expr(int i) {
			return getRuleContext(ExprContext.class,i);
		}
		public TerminalNode AND() { return getToken(PseudocodeParser.AND, 0); }
		public AndExprContext(ExprContext ctx) { copyFrom(ctx); }
	}

	public final ExprContext expr() throws RecognitionException {
		return expr(0);
	}

	private ExprContext expr(int _p) throws RecognitionException {
		ParserRuleContext _parentctx = _ctx;
		int _parentState = getState();
		ExprContext _localctx = new ExprContext(_ctx, _parentState);
		ExprContext _prevctx = _localctx;
		int _startState = 56;
		enterRecursionRule(_localctx, 56, RULE_expr, _p);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(471);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case NOT:
				{
				_localctx = new NotExprContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;

				setState(466);
				match(NOT);
				setState(467);
				expr(10);
				}
				break;
			case MINUS:
				{
				_localctx = new UnaryMinusExprContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(468);
				match(MINUS);
				setState(469);
				expr(9);
				}
				break;
			case TRUE:
			case FALSE:
			case MOD:
			case DIV:
			case LPAREN:
			case REAL_LITERAL:
			case INTEGER_LITERAL:
			case STRING_LITERAL:
			case CHAR_LITERAL:
			case IDENTIFIER:
				{
				_localctx = new AtomExprContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(470);
				atom();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			_ctx.stop = _input.LT(-1);
			setState(496);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,46,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					if ( _parseListeners!=null ) triggerExitRuleEvent();
					_prevctx = _localctx;
					{
					setState(494);
					_errHandler.sync(this);
					switch ( getInterpreter().adaptivePredict(_input,45,_ctx) ) {
					case 1:
						{
						_localctx = new PowerExprContext(new ExprContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_expr);
						setState(473);
						if (!(precpred(_ctx, 8))) throw new FailedPredicateException(this, "precpred(_ctx, 8)");
						setState(474);
						match(CARET);
						setState(475);
						expr(8);
						}
						break;
					case 2:
						{
						_localctx = new MulDivExprContext(new ExprContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_expr);
						setState(476);
						if (!(precpred(_ctx, 7))) throw new FailedPredicateException(this, "precpred(_ctx, 7)");
						setState(477);
						((MulDivExprContext)_localctx).op = _input.LT(1);
						_la = _input.LA(1);
						if ( !((((_la) & ~0x3f) == 0 && ((1L << _la) & 3458764926137401344L) != 0)) ) {
							((MulDivExprContext)_localctx).op = (Token)_errHandler.recoverInline(this);
						}
						else {
							if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
							_errHandler.reportMatch(this);
							consume();
						}
						setState(478);
						expr(8);
						}
						break;
					case 3:
						{
						_localctx = new AddSubExprContext(new ExprContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_expr);
						setState(479);
						if (!(precpred(_ctx, 6))) throw new FailedPredicateException(this, "precpred(_ctx, 6)");
						setState(480);
						((AddSubExprContext)_localctx).op = _input.LT(1);
						_la = _input.LA(1);
						if ( !(_la==PLUS || _la==MINUS) ) {
							((AddSubExprContext)_localctx).op = (Token)_errHandler.recoverInline(this);
						}
						else {
							if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
							_errHandler.reportMatch(this);
							consume();
						}
						setState(481);
						expr(7);
						}
						break;
					case 4:
						{
						_localctx = new ConcatExprContext(new ExprContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_expr);
						setState(482);
						if (!(precpred(_ctx, 5))) throw new FailedPredicateException(this, "precpred(_ctx, 5)");
						setState(483);
						match(AMPERSAND);
						setState(484);
						expr(6);
						}
						break;
					case 5:
						{
						_localctx = new ComparisonExprContext(new ExprContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_expr);
						setState(485);
						if (!(precpred(_ctx, 4))) throw new FailedPredicateException(this, "precpred(_ctx, 4)");
						setState(486);
						((ComparisonExprContext)_localctx).op = _input.LT(1);
						_la = _input.LA(1);
						if ( !((((_la) & ~0x3f) == 0 && ((1L << _la) & 283726776524341248L) != 0)) ) {
							((ComparisonExprContext)_localctx).op = (Token)_errHandler.recoverInline(this);
						}
						else {
							if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
							_errHandler.reportMatch(this);
							consume();
						}
						setState(487);
						expr(5);
						}
						break;
					case 6:
						{
						_localctx = new AndExprContext(new ExprContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_expr);
						setState(488);
						if (!(precpred(_ctx, 3))) throw new FailedPredicateException(this, "precpred(_ctx, 3)");
						setState(489);
						match(AND);
						setState(490);
						expr(4);
						}
						break;
					case 7:
						{
						_localctx = new OrExprContext(new ExprContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_expr);
						setState(491);
						if (!(precpred(_ctx, 2))) throw new FailedPredicateException(this, "precpred(_ctx, 2)");
						setState(492);
						match(OR);
						setState(493);
						expr(3);
						}
						break;
					}
					} 
				}
				setState(498);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,46,_ctx);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class AtomContext extends ParserRuleContext {
		public AtomContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_atom; }
	 
		public AtomContext() { }
		public void copyFrom(AtomContext ctx) {
			super.copyFrom(ctx);
		}
	}
	@SuppressWarnings("CheckReturnValue")
	public static class ArrayAccess1DAtomContext extends AtomContext {
		public TerminalNode IDENTIFIER() { return getToken(PseudocodeParser.IDENTIFIER, 0); }
		public TerminalNode LBRACKET() { return getToken(PseudocodeParser.LBRACKET, 0); }
		public ExprContext expr() {
			return getRuleContext(ExprContext.class,0);
		}
		public TerminalNode RBRACKET() { return getToken(PseudocodeParser.RBRACKET, 0); }
		public ArrayAccess1DAtomContext(AtomContext ctx) { copyFrom(ctx); }
	}
	@SuppressWarnings("CheckReturnValue")
	public static class DivFunctionAtomContext extends AtomContext {
		public TerminalNode DIV() { return getToken(PseudocodeParser.DIV, 0); }
		public TerminalNode LPAREN() { return getToken(PseudocodeParser.LPAREN, 0); }
		public List<ExprContext> expr() {
			return getRuleContexts(ExprContext.class);
		}
		public ExprContext expr(int i) {
			return getRuleContext(ExprContext.class,i);
		}
		public TerminalNode COMMA() { return getToken(PseudocodeParser.COMMA, 0); }
		public TerminalNode RPAREN() { return getToken(PseudocodeParser.RPAREN, 0); }
		public DivFunctionAtomContext(AtomContext ctx) { copyFrom(ctx); }
	}
	@SuppressWarnings("CheckReturnValue")
	public static class IdentifierAtomContext extends AtomContext {
		public TerminalNode IDENTIFIER() { return getToken(PseudocodeParser.IDENTIFIER, 0); }
		public IdentifierAtomContext(AtomContext ctx) { copyFrom(ctx); }
	}
	@SuppressWarnings("CheckReturnValue")
	public static class CharAtomContext extends AtomContext {
		public TerminalNode CHAR_LITERAL() { return getToken(PseudocodeParser.CHAR_LITERAL, 0); }
		public CharAtomContext(AtomContext ctx) { copyFrom(ctx); }
	}
	@SuppressWarnings("CheckReturnValue")
	public static class ParenAtomContext extends AtomContext {
		public TerminalNode LPAREN() { return getToken(PseudocodeParser.LPAREN, 0); }
		public ExprContext expr() {
			return getRuleContext(ExprContext.class,0);
		}
		public TerminalNode RPAREN() { return getToken(PseudocodeParser.RPAREN, 0); }
		public ParenAtomContext(AtomContext ctx) { copyFrom(ctx); }
	}
	@SuppressWarnings("CheckReturnValue")
	public static class ArrayAccess2DAtomContext extends AtomContext {
		public TerminalNode IDENTIFIER() { return getToken(PseudocodeParser.IDENTIFIER, 0); }
		public TerminalNode LBRACKET() { return getToken(PseudocodeParser.LBRACKET, 0); }
		public List<ExprContext> expr() {
			return getRuleContexts(ExprContext.class);
		}
		public ExprContext expr(int i) {
			return getRuleContext(ExprContext.class,i);
		}
		public TerminalNode COMMA() { return getToken(PseudocodeParser.COMMA, 0); }
		public TerminalNode RBRACKET() { return getToken(PseudocodeParser.RBRACKET, 0); }
		public ArrayAccess2DAtomContext(AtomContext ctx) { copyFrom(ctx); }
	}
	@SuppressWarnings("CheckReturnValue")
	public static class FunctionCallAtomContext extends AtomContext {
		public TerminalNode IDENTIFIER() { return getToken(PseudocodeParser.IDENTIFIER, 0); }
		public TerminalNode LPAREN() { return getToken(PseudocodeParser.LPAREN, 0); }
		public TerminalNode RPAREN() { return getToken(PseudocodeParser.RPAREN, 0); }
		public ArgListContext argList() {
			return getRuleContext(ArgListContext.class,0);
		}
		public FunctionCallAtomContext(AtomContext ctx) { copyFrom(ctx); }
	}
	@SuppressWarnings("CheckReturnValue")
	public static class StringAtomContext extends AtomContext {
		public TerminalNode STRING_LITERAL() { return getToken(PseudocodeParser.STRING_LITERAL, 0); }
		public StringAtomContext(AtomContext ctx) { copyFrom(ctx); }
	}
	@SuppressWarnings("CheckReturnValue")
	public static class FalseAtomContext extends AtomContext {
		public TerminalNode FALSE() { return getToken(PseudocodeParser.FALSE, 0); }
		public FalseAtomContext(AtomContext ctx) { copyFrom(ctx); }
	}
	@SuppressWarnings("CheckReturnValue")
	public static class ModFunctionAtomContext extends AtomContext {
		public TerminalNode MOD() { return getToken(PseudocodeParser.MOD, 0); }
		public TerminalNode LPAREN() { return getToken(PseudocodeParser.LPAREN, 0); }
		public List<ExprContext> expr() {
			return getRuleContexts(ExprContext.class);
		}
		public ExprContext expr(int i) {
			return getRuleContext(ExprContext.class,i);
		}
		public TerminalNode COMMA() { return getToken(PseudocodeParser.COMMA, 0); }
		public TerminalNode RPAREN() { return getToken(PseudocodeParser.RPAREN, 0); }
		public ModFunctionAtomContext(AtomContext ctx) { copyFrom(ctx); }
	}
	@SuppressWarnings("CheckReturnValue")
	public static class IntegerAtomContext extends AtomContext {
		public TerminalNode INTEGER_LITERAL() { return getToken(PseudocodeParser.INTEGER_LITERAL, 0); }
		public IntegerAtomContext(AtomContext ctx) { copyFrom(ctx); }
	}
	@SuppressWarnings("CheckReturnValue")
	public static class TrueAtomContext extends AtomContext {
		public TerminalNode TRUE() { return getToken(PseudocodeParser.TRUE, 0); }
		public TrueAtomContext(AtomContext ctx) { copyFrom(ctx); }
	}
	@SuppressWarnings("CheckReturnValue")
	public static class RealAtomContext extends AtomContext {
		public TerminalNode REAL_LITERAL() { return getToken(PseudocodeParser.REAL_LITERAL, 0); }
		public RealAtomContext(AtomContext ctx) { copyFrom(ctx); }
	}

	public final AtomContext atom() throws RecognitionException {
		AtomContext _localctx = new AtomContext(_ctx, getState());
		enterRule(_localctx, 58, RULE_atom);
		int _la;
		try {
			setState(542);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,48,_ctx) ) {
			case 1:
				_localctx = new ParenAtomContext(_localctx);
				enterOuterAlt(_localctx, 1);
				{
				setState(499);
				match(LPAREN);
				setState(500);
				expr(0);
				setState(501);
				match(RPAREN);
				}
				break;
			case 2:
				_localctx = new FunctionCallAtomContext(_localctx);
				enterOuterAlt(_localctx, 2);
				{
				setState(503);
				match(IDENTIFIER);
				setState(504);
				match(LPAREN);
				setState(506);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (((((_la - 34)) & ~0x3f) == 0 && ((1L << (_la - 34)) & 2131411075103L) != 0)) {
					{
					setState(505);
					argList();
					}
				}

				setState(508);
				match(RPAREN);
				}
				break;
			case 3:
				_localctx = new ArrayAccess1DAtomContext(_localctx);
				enterOuterAlt(_localctx, 3);
				{
				setState(509);
				match(IDENTIFIER);
				setState(510);
				match(LBRACKET);
				setState(511);
				expr(0);
				setState(512);
				match(RBRACKET);
				}
				break;
			case 4:
				_localctx = new ArrayAccess2DAtomContext(_localctx);
				enterOuterAlt(_localctx, 4);
				{
				setState(514);
				match(IDENTIFIER);
				setState(515);
				match(LBRACKET);
				setState(516);
				expr(0);
				setState(517);
				match(COMMA);
				setState(518);
				expr(0);
				setState(519);
				match(RBRACKET);
				}
				break;
			case 5:
				_localctx = new DivFunctionAtomContext(_localctx);
				enterOuterAlt(_localctx, 5);
				{
				setState(521);
				match(DIV);
				setState(522);
				match(LPAREN);
				setState(523);
				expr(0);
				setState(524);
				match(COMMA);
				setState(525);
				expr(0);
				setState(526);
				match(RPAREN);
				}
				break;
			case 6:
				_localctx = new ModFunctionAtomContext(_localctx);
				enterOuterAlt(_localctx, 6);
				{
				setState(528);
				match(MOD);
				setState(529);
				match(LPAREN);
				setState(530);
				expr(0);
				setState(531);
				match(COMMA);
				setState(532);
				expr(0);
				setState(533);
				match(RPAREN);
				}
				break;
			case 7:
				_localctx = new IdentifierAtomContext(_localctx);
				enterOuterAlt(_localctx, 7);
				{
				setState(535);
				match(IDENTIFIER);
				}
				break;
			case 8:
				_localctx = new IntegerAtomContext(_localctx);
				enterOuterAlt(_localctx, 8);
				{
				setState(536);
				match(INTEGER_LITERAL);
				}
				break;
			case 9:
				_localctx = new RealAtomContext(_localctx);
				enterOuterAlt(_localctx, 9);
				{
				setState(537);
				match(REAL_LITERAL);
				}
				break;
			case 10:
				_localctx = new StringAtomContext(_localctx);
				enterOuterAlt(_localctx, 10);
				{
				setState(538);
				match(STRING_LITERAL);
				}
				break;
			case 11:
				_localctx = new CharAtomContext(_localctx);
				enterOuterAlt(_localctx, 11);
				{
				setState(539);
				match(CHAR_LITERAL);
				}
				break;
			case 12:
				_localctx = new TrueAtomContext(_localctx);
				enterOuterAlt(_localctx, 12);
				{
				setState(540);
				match(TRUE);
				}
				break;
			case 13:
				_localctx = new FalseAtomContext(_localctx);
				enterOuterAlt(_localctx, 13);
				{
				setState(541);
				match(FALSE);
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public boolean sempred(RuleContext _localctx, int ruleIndex, int predIndex) {
		switch (ruleIndex) {
		case 28:
			return expr_sempred((ExprContext)_localctx, predIndex);
		}
		return true;
	}
	private boolean expr_sempred(ExprContext _localctx, int predIndex) {
		switch (predIndex) {
		case 0:
			return precpred(_ctx, 8);
		case 1:
			return precpred(_ctx, 7);
		case 2:
			return precpred(_ctx, 6);
		case 3:
			return precpred(_ctx, 5);
		case 4:
			return precpred(_ctx, 4);
		case 5:
			return precpred(_ctx, 3);
		case 6:
			return precpred(_ctx, 2);
		}
		return true;
	}

	public static final String _serializedATN =
		"\u0004\u0001M\u0221\u0002\u0000\u0007\u0000\u0002\u0001\u0007\u0001\u0002"+
		"\u0002\u0007\u0002\u0002\u0003\u0007\u0003\u0002\u0004\u0007\u0004\u0002"+
		"\u0005\u0007\u0005\u0002\u0006\u0007\u0006\u0002\u0007\u0007\u0007\u0002"+
		"\b\u0007\b\u0002\t\u0007\t\u0002\n\u0007\n\u0002\u000b\u0007\u000b\u0002"+
		"\f\u0007\f\u0002\r\u0007\r\u0002\u000e\u0007\u000e\u0002\u000f\u0007\u000f"+
		"\u0002\u0010\u0007\u0010\u0002\u0011\u0007\u0011\u0002\u0012\u0007\u0012"+
		"\u0002\u0013\u0007\u0013\u0002\u0014\u0007\u0014\u0002\u0015\u0007\u0015"+
		"\u0002\u0016\u0007\u0016\u0002\u0017\u0007\u0017\u0002\u0018\u0007\u0018"+
		"\u0002\u0019\u0007\u0019\u0002\u001a\u0007\u001a\u0002\u001b\u0007\u001b"+
		"\u0002\u001c\u0007\u001c\u0002\u001d\u0007\u001d\u0001\u0000\u0005\u0000"+
		">\b\u0000\n\u0000\f\u0000A\t\u0000\u0001\u0000\u0001\u0000\u0004\u0000"+
		"E\b\u0000\u000b\u0000\f\u0000F\u0001\u0000\u0005\u0000J\b\u0000\n\u0000"+
		"\f\u0000M\t\u0000\u0003\u0000O\b\u0000\u0001\u0000\u0005\u0000R\b\u0000"+
		"\n\u0000\f\u0000U\t\u0000\u0001\u0000\u0001\u0000\u0001\u0001\u0001\u0001"+
		"\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001"+
		"\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001"+
		"\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0003\u0001k\b\u0001"+
		"\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002"+
		"\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002"+
		"\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002"+
		"\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002"+
		"\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002"+
		"\u0001\u0002\u0001\u0002\u0003\u0002\u008d\b\u0002\u0001\u0003\u0001\u0003"+
		"\u0001\u0003\u0001\u0003\u0001\u0003\u0001\u0004\u0001\u0004\u0001\u0005"+
		"\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005"+
		"\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005"+
		"\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005"+
		"\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005"+
		"\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005"+
		"\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005"+
		"\u0001\u0005\u0003\u0005\u00bc\b\u0005\u0001\u0006\u0001\u0006\u0001\u0006"+
		"\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0003\u0006"+
		"\u00c6\b\u0006\u0001\u0007\u0001\u0007\u0001\u0007\u0001\b\u0001\b\u0001"+
		"\b\u0005\b\u00ce\b\b\n\b\f\b\u00d1\t\b\u0001\t\u0001\t\u0001\t\u0001\t"+
		"\u0004\t\u00d7\b\t\u000b\t\f\t\u00d8\u0001\t\u0001\t\u0004\t\u00dd\b\t"+
		"\u000b\t\f\t\u00de\u0001\t\u0001\t\u0001\t\u0001\t\u0004\t\u00e5\b\t\u000b"+
		"\t\f\t\u00e6\u0001\t\u0001\t\u0005\t\u00eb\b\t\n\t\f\t\u00ee\t\t\u0001"+
		"\t\u0004\t\u00f1\b\t\u000b\t\f\t\u00f2\u0001\t\u0001\t\u0004\t\u00f7\b"+
		"\t\u000b\t\f\t\u00f8\u0001\t\u0003\t\u00fc\b\t\u0001\t\u0004\t\u00ff\b"+
		"\t\u000b\t\f\t\u0100\u0001\t\u0001\t\u0001\n\u0001\n\u0001\n\u0001\n\u0004"+
		"\n\u0109\b\n\u000b\n\f\n\u010a\u0001\n\u0004\n\u010e\b\n\u000b\n\f\n\u010f"+
		"\u0001\n\u0001\n\u0001\n\u0004\n\u0115\b\n\u000b\n\f\n\u0116\u0001\n\u0001"+
		"\n\u0004\n\u011b\b\n\u000b\n\f\n\u011c\u0003\n\u011f\b\n\u0001\n\u0001"+
		"\n\u0001\u000b\u0001\u000b\u0001\u000b\u0004\u000b\u0126\b\u000b\u000b"+
		"\u000b\f\u000b\u0127\u0001\u000b\u0001\u000b\u0004\u000b\u012c\b\u000b"+
		"\u000b\u000b\f\u000b\u012d\u0001\f\u0001\f\u0001\f\u0001\f\u0001\f\u0001"+
		"\f\u0001\f\u0001\f\u0003\f\u0138\b\f\u0001\f\u0004\f\u013b\b\f\u000b\f"+
		"\f\f\u013c\u0001\f\u0001\f\u0004\f\u0141\b\f\u000b\f\f\f\u0142\u0001\f"+
		"\u0001\f\u0001\f\u0001\r\u0001\r\u0001\r\u0003\r\u014b\b\r\u0001\r\u0004"+
		"\r\u014e\b\r\u000b\r\f\r\u014f\u0001\r\u0001\r\u0004\r\u0154\b\r\u000b"+
		"\r\f\r\u0155\u0001\r\u0001\r\u0001\u000e\u0001\u000e\u0004\u000e\u015c"+
		"\b\u000e\u000b\u000e\f\u000e\u015d\u0001\u000e\u0001\u000e\u0004\u000e"+
		"\u0162\b\u000e\u000b\u000e\f\u000e\u0163\u0001\u000e\u0001\u000e\u0001"+
		"\u000e\u0001\u000f\u0001\u000f\u0001\u000f\u0001\u000f\u0003\u000f\u016d"+
		"\b\u000f\u0001\u000f\u0001\u000f\u0004\u000f\u0171\b\u000f\u000b\u000f"+
		"\f\u000f\u0172\u0001\u000f\u0001\u000f\u0004\u000f\u0177\b\u000f\u000b"+
		"\u000f\f\u000f\u0178\u0001\u000f\u0001\u000f\u0001\u0010\u0001\u0010\u0001"+
		"\u0010\u0001\u0010\u0003\u0010\u0181\b\u0010\u0001\u0010\u0001\u0010\u0001"+
		"\u0010\u0001\u0010\u0004\u0010\u0187\b\u0010\u000b\u0010\f\u0010\u0188"+
		"\u0001\u0010\u0001\u0010\u0004\u0010\u018d\b\u0010\u000b\u0010\f\u0010"+
		"\u018e\u0001\u0010\u0001\u0010\u0001\u0011\u0001\u0011\u0001\u0011\u0005"+
		"\u0011\u0196\b\u0011\n\u0011\f\u0011\u0199\t\u0011\u0001\u0012\u0001\u0012"+
		"\u0001\u0012\u0001\u0012\u0001\u0013\u0001\u0013\u0001\u0013\u0001\u0013"+
		"\u0003\u0013\u01a3\b\u0013\u0001\u0013\u0001\u0013\u0001\u0014\u0001\u0014"+
		"\u0001\u0014\u0001\u0015\u0001\u0015\u0001\u0015\u0001\u0015\u0001\u0015"+
		"\u0001\u0016\u0001\u0016\u0001\u0016\u0001\u0016\u0001\u0016\u0001\u0017"+
		"\u0001\u0017\u0001\u0017\u0001\u0017\u0001\u0017\u0001\u0018\u0001\u0018"+
		"\u0001\u0018\u0001\u0019\u0001\u0019\u0001\u001a\u0001\u001a\u0001\u001a"+
		"\u0005\u001a\u01c1\b\u001a\n\u001a\f\u001a\u01c4\t\u001a\u0001\u001b\u0001"+
		"\u001b\u0004\u001b\u01c8\b\u001b\u000b\u001b\f\u001b\u01c9\u0001\u001b"+
		"\u0005\u001b\u01cd\b\u001b\n\u001b\f\u001b\u01d0\t\u001b\u0001\u001c\u0001"+
		"\u001c\u0001\u001c\u0001\u001c\u0001\u001c\u0001\u001c\u0003\u001c\u01d8"+
		"\b\u001c\u0001\u001c\u0001\u001c\u0001\u001c\u0001\u001c\u0001\u001c\u0001"+
		"\u001c\u0001\u001c\u0001\u001c\u0001\u001c\u0001\u001c\u0001\u001c\u0001"+
		"\u001c\u0001\u001c\u0001\u001c\u0001\u001c\u0001\u001c\u0001\u001c\u0001"+
		"\u001c\u0001\u001c\u0001\u001c\u0001\u001c\u0005\u001c\u01ef\b\u001c\n"+
		"\u001c\f\u001c\u01f2\t\u001c\u0001\u001d\u0001\u001d\u0001\u001d\u0001"+
		"\u001d\u0001\u001d\u0001\u001d\u0001\u001d\u0003\u001d\u01fb\b\u001d\u0001"+
		"\u001d\u0001\u001d\u0001\u001d\u0001\u001d\u0001\u001d\u0001\u001d\u0001"+
		"\u001d\u0001\u001d\u0001\u001d\u0001\u001d\u0001\u001d\u0001\u001d\u0001"+
		"\u001d\u0001\u001d\u0001\u001d\u0001\u001d\u0001\u001d\u0001\u001d\u0001"+
		"\u001d\u0001\u001d\u0001\u001d\u0001\u001d\u0001\u001d\u0001\u001d\u0001"+
		"\u001d\u0001\u001d\u0001\u001d\u0001\u001d\u0001\u001d\u0001\u001d\u0001"+
		"\u001d\u0001\u001d\u0001\u001d\u0001\u001d\u0003\u001d\u021f\b\u001d\u0001"+
		"\u001d\u0000\u00018\u001e\u0000\u0002\u0004\u0006\b\n\f\u000e\u0010\u0012"+
		"\u0014\u0016\u0018\u001a\u001c\u001e \"$&(*,.02468:\u0000\u0007\u0001"+
		"\u000034\u0001\u0000.2\u0001\u0000\u0004\u0005\u0001\u0000+-\u0002\u0000"+
		"%&<=\u0001\u0000:;\u0001\u000049\u0259\u0000?\u0001\u0000\u0000\u0000"+
		"\u0002j\u0001\u0000\u0000\u0000\u0004\u008c\u0001\u0000\u0000\u0000\u0006"+
		"\u008e\u0001\u0000\u0000\u0000\b\u0093\u0001\u0000\u0000\u0000\n\u00bb"+
		"\u0001\u0000\u0000\u0000\f\u00c5\u0001\u0000\u0000\u0000\u000e\u00c7\u0001"+
		"\u0000\u0000\u0000\u0010\u00ca\u0001\u0000\u0000\u0000\u0012\u00d2\u0001"+
		"\u0000\u0000\u0000\u0014\u0104\u0001\u0000\u0000\u0000\u0016\u0122\u0001"+
		"\u0000\u0000\u0000\u0018\u012f\u0001\u0000\u0000\u0000\u001a\u0147\u0001"+
		"\u0000\u0000\u0000\u001c\u0159\u0001\u0000\u0000\u0000\u001e\u0168\u0001"+
		"\u0000\u0000\u0000 \u017c\u0001\u0000\u0000\u0000\"\u0192\u0001\u0000"+
		"\u0000\u0000$\u019a\u0001\u0000\u0000\u0000&\u019e\u0001\u0000\u0000\u0000"+
		"(\u01a6\u0001\u0000\u0000\u0000*\u01a9\u0001\u0000\u0000\u0000,\u01ae"+
		"\u0001\u0000\u0000\u0000.\u01b3\u0001\u0000\u0000\u00000\u01b8\u0001\u0000"+
		"\u0000\u00002\u01bb\u0001\u0000\u0000\u00004\u01bd\u0001\u0000\u0000\u0000"+
		"6\u01c5\u0001\u0000\u0000\u00008\u01d7\u0001\u0000\u0000\u0000:\u021e"+
		"\u0001\u0000\u0000\u0000<>\u0005K\u0000\u0000=<\u0001\u0000\u0000\u0000"+
		">A\u0001\u0000\u0000\u0000?=\u0001\u0000\u0000\u0000?@\u0001\u0000\u0000"+
		"\u0000@N\u0001\u0000\u0000\u0000A?\u0001\u0000\u0000\u0000BK\u0003\u0002"+
		"\u0001\u0000CE\u0005K\u0000\u0000DC\u0001\u0000\u0000\u0000EF\u0001\u0000"+
		"\u0000\u0000FD\u0001\u0000\u0000\u0000FG\u0001\u0000\u0000\u0000GH\u0001"+
		"\u0000\u0000\u0000HJ\u0003\u0002\u0001\u0000ID\u0001\u0000\u0000\u0000"+
		"JM\u0001\u0000\u0000\u0000KI\u0001\u0000\u0000\u0000KL\u0001\u0000\u0000"+
		"\u0000LO\u0001\u0000\u0000\u0000MK\u0001\u0000\u0000\u0000NB\u0001\u0000"+
		"\u0000\u0000NO\u0001\u0000\u0000\u0000OS\u0001\u0000\u0000\u0000PR\u0005"+
		"K\u0000\u0000QP\u0001\u0000\u0000\u0000RU\u0001\u0000\u0000\u0000SQ\u0001"+
		"\u0000\u0000\u0000ST\u0001\u0000\u0000\u0000TV\u0001\u0000\u0000\u0000"+
		"US\u0001\u0000\u0000\u0000VW\u0005\u0000\u0000\u0001W\u0001\u0001\u0000"+
		"\u0000\u0000Xk\u0003\u0004\u0002\u0000Yk\u0003\u0006\u0003\u0000Zk\u0003"+
		"\n\u0005\u0000[k\u0003\f\u0006\u0000\\k\u0003\u000e\u0007\u0000]k\u0003"+
		"\u0012\t\u0000^k\u0003\u0014\n\u0000_k\u0003\u0018\f\u0000`k\u0003\u001a"+
		"\r\u0000ak\u0003\u001c\u000e\u0000bk\u0003\u001e\u000f\u0000ck\u0003 "+
		"\u0010\u0000dk\u0003&\u0013\u0000ek\u0003(\u0014\u0000fk\u0003*\u0015"+
		"\u0000gk\u0003,\u0016\u0000hk\u0003.\u0017\u0000ik\u00030\u0018\u0000"+
		"jX\u0001\u0000\u0000\u0000jY\u0001\u0000\u0000\u0000jZ\u0001\u0000\u0000"+
		"\u0000j[\u0001\u0000\u0000\u0000j\\\u0001\u0000\u0000\u0000j]\u0001\u0000"+
		"\u0000\u0000j^\u0001\u0000\u0000\u0000j_\u0001\u0000\u0000\u0000j`\u0001"+
		"\u0000\u0000\u0000ja\u0001\u0000\u0000\u0000jb\u0001\u0000\u0000\u0000"+
		"jc\u0001\u0000\u0000\u0000jd\u0001\u0000\u0000\u0000je\u0001\u0000\u0000"+
		"\u0000jf\u0001\u0000\u0000\u0000jg\u0001\u0000\u0000\u0000jh\u0001\u0000"+
		"\u0000\u0000ji\u0001\u0000\u0000\u0000k\u0003\u0001\u0000\u0000\u0000"+
		"lm\u0005\u0001\u0000\u0000mn\u0005J\u0000\u0000no\u0005E\u0000\u0000o"+
		"p\u0005\u001f\u0000\u0000pq\u0005B\u0000\u0000qr\u00038\u001c\u0000rs"+
		"\u0005E\u0000\u0000st\u00038\u001c\u0000tu\u0005C\u0000\u0000uv\u0005"+
		"\f\u0000\u0000vw\u0003\b\u0004\u0000w\u008d\u0001\u0000\u0000\u0000xy"+
		"\u0005\u0001\u0000\u0000yz\u0005J\u0000\u0000z{\u0005E\u0000\u0000{|\u0005"+
		"\u001f\u0000\u0000|}\u0005B\u0000\u0000}~\u00038\u001c\u0000~\u007f\u0005"+
		"E\u0000\u0000\u007f\u0080\u00038\u001c\u0000\u0080\u0081\u0005D\u0000"+
		"\u0000\u0081\u0082\u00038\u001c\u0000\u0082\u0083\u0005E\u0000\u0000\u0083"+
		"\u0084\u00038\u001c\u0000\u0084\u0085\u0005C\u0000\u0000\u0085\u0086\u0005"+
		"\f\u0000\u0000\u0086\u0087\u0003\b\u0004\u0000\u0087\u008d\u0001\u0000"+
		"\u0000\u0000\u0088\u0089\u0005\u0001\u0000\u0000\u0089\u008a\u0005J\u0000"+
		"\u0000\u008a\u008b\u0005E\u0000\u0000\u008b\u008d\u0003\b\u0004\u0000"+
		"\u008cl\u0001\u0000\u0000\u0000\u008cx\u0001\u0000\u0000\u0000\u008c\u0088"+
		"\u0001\u0000\u0000\u0000\u008d\u0005\u0001\u0000\u0000\u0000\u008e\u008f"+
		"\u0005\u0002\u0000\u0000\u008f\u0090\u0005J\u0000\u0000\u0090\u0091\u0007"+
		"\u0000\u0000\u0000\u0091\u0092\u00038\u001c\u0000\u0092\u0007\u0001\u0000"+
		"\u0000\u0000\u0093\u0094\u0007\u0001\u0000\u0000\u0094\t\u0001\u0000\u0000"+
		"\u0000\u0095\u0096\u0005J\u0000\u0000\u0096\u0097\u00054\u0000\u0000\u0097"+
		"\u00bc\u00038\u001c\u0000\u0098\u0099\u0005J\u0000\u0000\u0099\u009a\u0005"+
		"B\u0000\u0000\u009a\u009b\u00038\u001c\u0000\u009b\u009c\u0005C\u0000"+
		"\u0000\u009c\u009d\u00054\u0000\u0000\u009d\u009e\u00038\u001c\u0000\u009e"+
		"\u00bc\u0001\u0000\u0000\u0000\u009f\u00a0\u0005J\u0000\u0000\u00a0\u00a1"+
		"\u0005B\u0000\u0000\u00a1\u00a2\u00038\u001c\u0000\u00a2\u00a3\u0005D"+
		"\u0000\u0000\u00a3\u00a4\u00038\u001c\u0000\u00a4\u00a5\u0005C\u0000\u0000"+
		"\u00a5\u00a6\u00054\u0000\u0000\u00a6\u00a7\u00038\u001c\u0000\u00a7\u00bc"+
		"\u0001\u0000\u0000\u0000\u00a8\u00a9\u0005J\u0000\u0000\u00a9\u00aa\u0005"+
		"3\u0000\u0000\u00aa\u00bc\u00038\u001c\u0000\u00ab\u00ac\u0005J\u0000"+
		"\u0000\u00ac\u00ad\u0005B\u0000\u0000\u00ad\u00ae\u00038\u001c\u0000\u00ae"+
		"\u00af\u0005C\u0000\u0000\u00af\u00b0\u00053\u0000\u0000\u00b0\u00b1\u0003"+
		"8\u001c\u0000\u00b1\u00bc\u0001\u0000\u0000\u0000\u00b2\u00b3\u0005J\u0000"+
		"\u0000\u00b3\u00b4\u0005B\u0000\u0000\u00b4\u00b5\u00038\u001c\u0000\u00b5"+
		"\u00b6\u0005D\u0000\u0000\u00b6\u00b7\u00038\u001c\u0000\u00b7\u00b8\u0005"+
		"C\u0000\u0000\u00b8\u00b9\u00053\u0000\u0000\u00b9\u00ba\u00038\u001c"+
		"\u0000\u00ba\u00bc\u0001\u0000\u0000\u0000\u00bb\u0095\u0001\u0000\u0000"+
		"\u0000\u00bb\u0098\u0001\u0000\u0000\u0000\u00bb\u009f\u0001\u0000\u0000"+
		"\u0000\u00bb\u00a8\u0001\u0000\u0000\u0000\u00bb\u00ab\u0001\u0000\u0000"+
		"\u0000\u00bb\u00b2\u0001\u0000\u0000\u0000\u00bc\u000b\u0001\u0000\u0000"+
		"\u0000\u00bd\u00be\u0005\u0003\u0000\u0000\u00be\u00c6\u0005J\u0000\u0000"+
		"\u00bf\u00c0\u0005\u0003\u0000\u0000\u00c0\u00c1\u0005J\u0000\u0000\u00c1"+
		"\u00c2\u0005B\u0000\u0000\u00c2\u00c3\u00038\u001c\u0000\u00c3\u00c4\u0005"+
		"C\u0000\u0000\u00c4\u00c6\u0001\u0000\u0000\u0000\u00c5\u00bd\u0001\u0000"+
		"\u0000\u0000\u00c5\u00bf\u0001\u0000\u0000\u0000\u00c6\r\u0001\u0000\u0000"+
		"\u0000\u00c7\u00c8\u0007\u0002\u0000\u0000\u00c8\u00c9\u0003\u0010\b\u0000"+
		"\u00c9\u000f\u0001\u0000\u0000\u0000\u00ca\u00cf\u00038\u001c\u0000\u00cb"+
		"\u00cc\u0005D\u0000\u0000\u00cc\u00ce\u00038\u001c\u0000\u00cd\u00cb\u0001"+
		"\u0000\u0000\u0000\u00ce\u00d1\u0001\u0000\u0000\u0000\u00cf\u00cd\u0001"+
		"\u0000\u0000\u0000\u00cf\u00d0\u0001\u0000\u0000\u0000\u00d0\u0011\u0001"+
		"\u0000\u0000\u0000\u00d1\u00cf\u0001\u0000\u0000\u0000\u00d2\u00d3\u0005"+
		"\u0006\u0000\u0000\u00d3\u00d4\u00038\u001c\u0000\u00d4\u00d6\u0005\u0007"+
		"\u0000\u0000\u00d5\u00d7\u0005K\u0000\u0000\u00d6\u00d5\u0001\u0000\u0000"+
		"\u0000\u00d7\u00d8\u0001\u0000\u0000\u0000\u00d8\u00d6\u0001\u0000\u0000"+
		"\u0000\u00d8\u00d9\u0001\u0000\u0000\u0000\u00d9\u00da\u0001\u0000\u0000"+
		"\u0000\u00da\u00ec\u00036\u001b\u0000\u00db\u00dd\u0005K\u0000\u0000\u00dc"+
		"\u00db\u0001\u0000\u0000\u0000\u00dd\u00de\u0001\u0000\u0000\u0000\u00de"+
		"\u00dc\u0001\u0000\u0000\u0000\u00de\u00df\u0001\u0000\u0000\u0000\u00df"+
		"\u00e0\u0001\u0000\u0000\u0000\u00e0\u00e1\u0005\t\u0000\u0000\u00e1\u00e2"+
		"\u00038\u001c\u0000\u00e2\u00e4\u0005\u0007\u0000\u0000\u00e3\u00e5\u0005"+
		"K\u0000\u0000\u00e4\u00e3\u0001\u0000\u0000\u0000\u00e5\u00e6\u0001\u0000"+
		"\u0000\u0000\u00e6\u00e4\u0001\u0000\u0000\u0000\u00e6\u00e7\u0001\u0000"+
		"\u0000\u0000\u00e7\u00e8\u0001\u0000\u0000\u0000\u00e8\u00e9\u00036\u001b"+
		"\u0000\u00e9\u00eb\u0001\u0000\u0000\u0000\u00ea\u00dc\u0001\u0000\u0000"+
		"\u0000\u00eb\u00ee\u0001\u0000\u0000\u0000\u00ec\u00ea\u0001\u0000\u0000"+
		"\u0000\u00ec\u00ed\u0001\u0000\u0000\u0000\u00ed\u00fb\u0001\u0000\u0000"+
		"\u0000\u00ee\u00ec\u0001\u0000\u0000\u0000\u00ef\u00f1\u0005K\u0000\u0000"+
		"\u00f0\u00ef\u0001\u0000\u0000\u0000\u00f1\u00f2\u0001\u0000\u0000\u0000"+
		"\u00f2\u00f0\u0001\u0000\u0000\u0000\u00f2\u00f3\u0001\u0000\u0000\u0000"+
		"\u00f3\u00f4\u0001\u0000\u0000\u0000\u00f4\u00f6\u0005\b\u0000\u0000\u00f5"+
		"\u00f7\u0005K\u0000\u0000\u00f6\u00f5\u0001\u0000\u0000\u0000\u00f7\u00f8"+
		"\u0001\u0000\u0000\u0000\u00f8\u00f6\u0001\u0000\u0000\u0000\u00f8\u00f9"+
		"\u0001\u0000\u0000\u0000\u00f9\u00fa\u0001\u0000\u0000\u0000\u00fa\u00fc"+
		"\u00036\u001b\u0000\u00fb\u00f0\u0001\u0000\u0000\u0000\u00fb\u00fc\u0001"+
		"\u0000\u0000\u0000\u00fc\u00fe\u0001\u0000\u0000\u0000\u00fd\u00ff\u0005"+
		"K\u0000\u0000\u00fe\u00fd\u0001\u0000\u0000\u0000\u00ff\u0100\u0001\u0000"+
		"\u0000\u0000\u0100\u00fe\u0001\u0000\u0000\u0000\u0100\u0101\u0001\u0000"+
		"\u0000\u0000\u0101\u0102\u0001\u0000\u0000\u0000\u0102\u0103\u0005\n\u0000"+
		"\u0000\u0103\u0013\u0001\u0000\u0000\u0000\u0104\u0105\u0005\u000b\u0000"+
		"\u0000\u0105\u0106\u0005\f\u0000\u0000\u0106\u0108\u0005J\u0000\u0000"+
		"\u0107\u0109\u0005K\u0000\u0000\u0108\u0107\u0001\u0000\u0000\u0000\u0109"+
		"\u010a\u0001\u0000\u0000\u0000\u010a\u0108\u0001\u0000\u0000\u0000\u010a"+
		"\u010b\u0001\u0000\u0000\u0000\u010b\u010d\u0001\u0000\u0000\u0000\u010c"+
		"\u010e\u0003\u0016\u000b\u0000\u010d\u010c\u0001\u0000\u0000\u0000\u010e"+
		"\u010f\u0001\u0000\u0000\u0000\u010f\u010d\u0001\u0000\u0000\u0000\u010f"+
		"\u0110\u0001\u0000\u0000\u0000\u0110\u011e\u0001\u0000\u0000\u0000\u0111"+
		"\u0112\u0005\r\u0000\u0000\u0112\u0114\u0005E\u0000\u0000\u0113\u0115"+
		"\u0005K\u0000\u0000\u0114\u0113\u0001\u0000\u0000\u0000\u0115\u0116\u0001"+
		"\u0000\u0000\u0000\u0116\u0114\u0001\u0000\u0000\u0000\u0116\u0117\u0001"+
		"\u0000\u0000\u0000\u0117\u0118\u0001\u0000\u0000\u0000\u0118\u011a\u0003"+
		"6\u001b\u0000\u0119\u011b\u0005K\u0000\u0000\u011a\u0119\u0001\u0000\u0000"+
		"\u0000\u011b\u011c\u0001\u0000\u0000\u0000\u011c\u011a\u0001\u0000\u0000"+
		"\u0000\u011c\u011d\u0001\u0000\u0000\u0000\u011d\u011f\u0001\u0000\u0000"+
		"\u0000\u011e\u0111\u0001\u0000\u0000\u0000\u011e\u011f\u0001\u0000\u0000"+
		"\u0000\u011f\u0120\u0001\u0000\u0000\u0000\u0120\u0121\u0005\u000e\u0000"+
		"\u0000\u0121\u0015\u0001\u0000\u0000\u0000\u0122\u0123\u00038\u001c\u0000"+
		"\u0123\u0125\u0005E\u0000\u0000\u0124\u0126\u0005K\u0000\u0000\u0125\u0124"+
		"\u0001\u0000\u0000\u0000\u0126\u0127\u0001\u0000\u0000\u0000\u0127\u0125"+
		"\u0001\u0000\u0000\u0000\u0127\u0128\u0001\u0000\u0000\u0000\u0128\u0129"+
		"\u0001\u0000\u0000\u0000\u0129\u012b\u00036\u001b\u0000\u012a\u012c\u0005"+
		"K\u0000\u0000\u012b\u012a\u0001\u0000\u0000\u0000\u012c\u012d\u0001\u0000"+
		"\u0000\u0000\u012d\u012b\u0001\u0000\u0000\u0000\u012d\u012e\u0001\u0000"+
		"\u0000\u0000\u012e\u0017\u0001\u0000\u0000\u0000\u012f\u0130\u0005\u000f"+
		"\u0000\u0000\u0130\u0131\u0005J\u0000\u0000\u0131\u0132\u0007\u0000\u0000"+
		"\u0000\u0132\u0133\u00038\u001c\u0000\u0133\u0134\u0005\u0010\u0000\u0000"+
		"\u0134\u0137\u00038\u001c\u0000\u0135\u0136\u0005\u0011\u0000\u0000\u0136"+
		"\u0138\u00038\u001c\u0000\u0137\u0135\u0001\u0000\u0000\u0000\u0137\u0138"+
		"\u0001\u0000\u0000\u0000\u0138\u013a\u0001\u0000\u0000\u0000\u0139\u013b"+
		"\u0005K\u0000\u0000\u013a\u0139\u0001\u0000\u0000\u0000\u013b\u013c\u0001"+
		"\u0000\u0000\u0000\u013c\u013a\u0001\u0000\u0000\u0000\u013c\u013d\u0001"+
		"\u0000\u0000\u0000\u013d\u013e\u0001\u0000\u0000\u0000\u013e\u0140\u0003"+
		"6\u001b\u0000\u013f\u0141\u0005K\u0000\u0000\u0140\u013f\u0001\u0000\u0000"+
		"\u0000\u0141\u0142\u0001\u0000\u0000\u0000\u0142\u0140\u0001\u0000\u0000"+
		"\u0000\u0142\u0143\u0001\u0000\u0000\u0000\u0143\u0144\u0001\u0000\u0000"+
		"\u0000\u0144\u0145\u0005\u0012\u0000\u0000\u0145\u0146\u0005J\u0000\u0000"+
		"\u0146\u0019\u0001\u0000\u0000\u0000\u0147\u0148\u0005\u0013\u0000\u0000"+
		"\u0148\u014a\u00038\u001c\u0000\u0149\u014b\u0005\u0014\u0000\u0000\u014a"+
		"\u0149\u0001\u0000\u0000\u0000\u014a\u014b\u0001\u0000\u0000\u0000\u014b"+
		"\u014d\u0001\u0000\u0000\u0000\u014c\u014e\u0005K\u0000\u0000\u014d\u014c"+
		"\u0001\u0000\u0000\u0000\u014e\u014f\u0001\u0000\u0000\u0000\u014f\u014d"+
		"\u0001\u0000\u0000\u0000\u014f\u0150\u0001\u0000\u0000\u0000\u0150\u0151"+
		"\u0001\u0000\u0000\u0000\u0151\u0153\u00036\u001b\u0000\u0152\u0154\u0005"+
		"K\u0000\u0000\u0153\u0152\u0001\u0000\u0000\u0000\u0154\u0155\u0001\u0000"+
		"\u0000\u0000\u0155\u0153\u0001\u0000\u0000\u0000\u0155\u0156\u0001\u0000"+
		"\u0000\u0000\u0156\u0157\u0001\u0000\u0000\u0000\u0157\u0158\u0005\u0015"+
		"\u0000\u0000\u0158\u001b\u0001\u0000\u0000\u0000\u0159\u015b\u0005\u0016"+
		"\u0000\u0000\u015a\u015c\u0005K\u0000\u0000\u015b\u015a\u0001\u0000\u0000"+
		"\u0000\u015c\u015d\u0001\u0000\u0000\u0000\u015d\u015b\u0001\u0000\u0000"+
		"\u0000\u015d\u015e\u0001\u0000\u0000\u0000\u015e\u015f\u0001\u0000\u0000"+
		"\u0000\u015f\u0161\u00036\u001b\u0000\u0160\u0162\u0005K\u0000\u0000\u0161"+
		"\u0160\u0001\u0000\u0000\u0000\u0162\u0163\u0001\u0000\u0000\u0000\u0163"+
		"\u0161\u0001\u0000\u0000\u0000\u0163\u0164\u0001\u0000\u0000\u0000\u0164"+
		"\u0165\u0001\u0000\u0000\u0000\u0165\u0166\u0005\u0017\u0000\u0000\u0166"+
		"\u0167\u00038\u001c\u0000\u0167\u001d\u0001\u0000\u0000\u0000\u0168\u0169"+
		"\u0005\u0018\u0000\u0000\u0169\u016a\u0005J\u0000\u0000\u016a\u016c\u0005"+
		"@\u0000\u0000\u016b\u016d\u0003\"\u0011\u0000\u016c\u016b\u0001\u0000"+
		"\u0000\u0000\u016c\u016d\u0001\u0000\u0000\u0000\u016d\u016e\u0001\u0000"+
		"\u0000\u0000\u016e\u0170\u0005A\u0000\u0000\u016f\u0171\u0005K\u0000\u0000"+
		"\u0170\u016f\u0001\u0000\u0000\u0000\u0171\u0172\u0001\u0000\u0000\u0000"+
		"\u0172\u0170\u0001\u0000\u0000\u0000\u0172\u0173\u0001\u0000\u0000\u0000"+
		"\u0173\u0174\u0001\u0000\u0000\u0000\u0174\u0176\u00036\u001b\u0000\u0175"+
		"\u0177\u0005K\u0000\u0000\u0176\u0175\u0001\u0000\u0000\u0000\u0177\u0178"+
		"\u0001\u0000\u0000\u0000\u0178\u0176\u0001\u0000\u0000\u0000\u0178\u0179"+
		"\u0001\u0000\u0000\u0000\u0179\u017a\u0001\u0000\u0000\u0000\u017a\u017b"+
		"\u0005\u0019\u0000\u0000\u017b\u001f\u0001\u0000\u0000\u0000\u017c\u017d"+
		"\u0005\u001a\u0000\u0000\u017d\u017e\u0005J\u0000\u0000\u017e\u0180\u0005"+
		"@\u0000\u0000\u017f\u0181\u0003\"\u0011\u0000\u0180\u017f\u0001\u0000"+
		"\u0000\u0000\u0180\u0181\u0001\u0000\u0000\u0000\u0181\u0182\u0001\u0000"+
		"\u0000\u0000\u0182\u0183\u0005A\u0000\u0000\u0183\u0184\u0005\u001c\u0000"+
		"\u0000\u0184\u0186\u0003\b\u0004\u0000\u0185\u0187\u0005K\u0000\u0000"+
		"\u0186\u0185\u0001\u0000\u0000\u0000\u0187\u0188\u0001\u0000\u0000\u0000"+
		"\u0188\u0186\u0001\u0000\u0000\u0000\u0188\u0189\u0001\u0000\u0000\u0000"+
		"\u0189\u018a\u0001\u0000\u0000\u0000\u018a\u018c\u00036\u001b\u0000\u018b"+
		"\u018d\u0005K\u0000\u0000\u018c\u018b\u0001\u0000\u0000\u0000\u018d\u018e"+
		"\u0001\u0000\u0000\u0000\u018e\u018c\u0001\u0000\u0000\u0000\u018e\u018f"+
		"\u0001\u0000\u0000\u0000\u018f\u0190\u0001\u0000\u0000\u0000\u0190\u0191"+
		"\u0005\u001b\u0000\u0000\u0191!\u0001\u0000\u0000\u0000\u0192\u0197\u0003"+
		"$\u0012\u0000\u0193\u0194\u0005D\u0000\u0000\u0194\u0196\u0003$\u0012"+
		"\u0000\u0195\u0193\u0001\u0000\u0000\u0000\u0196\u0199\u0001\u0000\u0000"+
		"\u0000\u0197\u0195\u0001\u0000\u0000\u0000\u0197\u0198\u0001\u0000\u0000"+
		"\u0000\u0198#\u0001\u0000\u0000\u0000\u0199\u0197\u0001\u0000\u0000\u0000"+
		"\u019a\u019b\u0005J\u0000\u0000\u019b\u019c\u0005E\u0000\u0000\u019c\u019d"+
		"\u0003\b\u0004\u0000\u019d%\u0001\u0000\u0000\u0000\u019e\u019f\u0005"+
		"\u001e\u0000\u0000\u019f\u01a0\u0005J\u0000\u0000\u01a0\u01a2\u0005@\u0000"+
		"\u0000\u01a1\u01a3\u00034\u001a\u0000\u01a2\u01a1\u0001\u0000\u0000\u0000"+
		"\u01a2\u01a3\u0001\u0000\u0000\u0000\u01a3\u01a4\u0001\u0000\u0000\u0000"+
		"\u01a4\u01a5\u0005A\u0000\u0000\u01a5\'\u0001\u0000\u0000\u0000\u01a6"+
		"\u01a7\u0005\u001d\u0000\u0000\u01a7\u01a8\u00038\u001c\u0000\u01a8)\u0001"+
		"\u0000\u0000\u0000\u01a9\u01aa\u0005\'\u0000\u0000\u01aa\u01ab\u00038"+
		"\u001c\u0000\u01ab\u01ac\u0005\u000f\u0000\u0000\u01ac\u01ad\u00032\u0019"+
		"\u0000\u01ad+\u0001\u0000\u0000\u0000\u01ae\u01af\u0005(\u0000\u0000\u01af"+
		"\u01b0\u00038\u001c\u0000\u01b0\u01b1\u0005D\u0000\u0000\u01b1\u01b2\u0005"+
		"J\u0000\u0000\u01b2-\u0001\u0000\u0000\u0000\u01b3\u01b4\u0005)\u0000"+
		"\u0000\u01b4\u01b5\u00038\u001c\u0000\u01b5\u01b6\u0005D\u0000\u0000\u01b6"+
		"\u01b7\u00038\u001c\u0000\u01b7/\u0001\u0000\u0000\u0000\u01b8\u01b9\u0005"+
		"*\u0000\u0000\u01b9\u01ba\u00038\u001c\u0000\u01ba1\u0001\u0000\u0000"+
		"\u0000\u01bb\u01bc\u0007\u0003\u0000\u0000\u01bc3\u0001\u0000\u0000\u0000"+
		"\u01bd\u01c2\u00038\u001c\u0000\u01be\u01bf\u0005D\u0000\u0000\u01bf\u01c1"+
		"\u00038\u001c\u0000\u01c0\u01be\u0001\u0000\u0000\u0000\u01c1\u01c4\u0001"+
		"\u0000\u0000\u0000\u01c2\u01c0\u0001\u0000\u0000\u0000\u01c2\u01c3\u0001"+
		"\u0000\u0000\u0000\u01c35\u0001\u0000\u0000\u0000\u01c4\u01c2\u0001\u0000"+
		"\u0000\u0000\u01c5\u01ce\u0003\u0002\u0001\u0000\u01c6\u01c8\u0005K\u0000"+
		"\u0000\u01c7\u01c6\u0001\u0000\u0000\u0000\u01c8\u01c9\u0001\u0000\u0000"+
		"\u0000\u01c9\u01c7\u0001\u0000\u0000\u0000\u01c9\u01ca\u0001\u0000\u0000"+
		"\u0000\u01ca\u01cb\u0001\u0000\u0000\u0000\u01cb\u01cd\u0003\u0002\u0001"+
		"\u0000\u01cc\u01c7\u0001\u0000\u0000\u0000\u01cd\u01d0\u0001\u0000\u0000"+
		"\u0000\u01ce\u01cc\u0001\u0000\u0000\u0000\u01ce\u01cf\u0001\u0000\u0000"+
		"\u0000\u01cf7\u0001\u0000\u0000\u0000\u01d0\u01ce\u0001\u0000\u0000\u0000"+
		"\u01d1\u01d2\u0006\u001c\uffff\uffff\u0000\u01d2\u01d3\u0005\"\u0000\u0000"+
		"\u01d3\u01d8\u00038\u001c\n\u01d4\u01d5\u0005;\u0000\u0000\u01d5\u01d8"+
		"\u00038\u001c\t\u01d6\u01d8\u0003:\u001d\u0000\u01d7\u01d1\u0001\u0000"+
		"\u0000\u0000\u01d7\u01d4\u0001\u0000\u0000\u0000\u01d7\u01d6\u0001\u0000"+
		"\u0000\u0000\u01d8\u01f0\u0001\u0000\u0000\u0000\u01d9\u01da\n\b\u0000"+
		"\u0000\u01da\u01db\u0005>\u0000\u0000\u01db\u01ef\u00038\u001c\b\u01dc"+
		"\u01dd\n\u0007\u0000\u0000\u01dd\u01de\u0007\u0004\u0000\u0000\u01de\u01ef"+
		"\u00038\u001c\b\u01df\u01e0\n\u0006\u0000\u0000\u01e0\u01e1\u0007\u0005"+
		"\u0000\u0000\u01e1\u01ef\u00038\u001c\u0007\u01e2\u01e3\n\u0005\u0000"+
		"\u0000\u01e3\u01e4\u0005?\u0000\u0000\u01e4\u01ef\u00038\u001c\u0006\u01e5"+
		"\u01e6\n\u0004\u0000\u0000\u01e6\u01e7\u0007\u0006\u0000\u0000\u01e7\u01ef"+
		"\u00038\u001c\u0005\u01e8\u01e9\n\u0003\u0000\u0000\u01e9\u01ea\u0005"+
		" \u0000\u0000\u01ea\u01ef\u00038\u001c\u0004\u01eb\u01ec\n\u0002\u0000"+
		"\u0000\u01ec\u01ed\u0005!\u0000\u0000\u01ed\u01ef\u00038\u001c\u0003\u01ee"+
		"\u01d9\u0001\u0000\u0000\u0000\u01ee\u01dc\u0001\u0000\u0000\u0000\u01ee"+
		"\u01df\u0001\u0000\u0000\u0000\u01ee\u01e2\u0001\u0000\u0000\u0000\u01ee"+
		"\u01e5\u0001\u0000\u0000\u0000\u01ee\u01e8\u0001\u0000\u0000\u0000\u01ee"+
		"\u01eb\u0001\u0000\u0000\u0000\u01ef\u01f2\u0001\u0000\u0000\u0000\u01f0"+
		"\u01ee\u0001\u0000\u0000\u0000\u01f0\u01f1\u0001\u0000\u0000\u0000\u01f1"+
		"9\u0001\u0000\u0000\u0000\u01f2\u01f0\u0001\u0000\u0000\u0000\u01f3\u01f4"+
		"\u0005@\u0000\u0000\u01f4\u01f5\u00038\u001c\u0000\u01f5\u01f6\u0005A"+
		"\u0000\u0000\u01f6\u021f\u0001\u0000\u0000\u0000\u01f7\u01f8\u0005J\u0000"+
		"\u0000\u01f8\u01fa\u0005@\u0000\u0000\u01f9\u01fb\u00034\u001a\u0000\u01fa"+
		"\u01f9\u0001\u0000\u0000\u0000\u01fa\u01fb\u0001\u0000\u0000\u0000\u01fb"+
		"\u01fc\u0001\u0000\u0000\u0000\u01fc\u021f\u0005A\u0000\u0000\u01fd\u01fe"+
		"\u0005J\u0000\u0000\u01fe\u01ff\u0005B\u0000\u0000\u01ff\u0200\u00038"+
		"\u001c\u0000\u0200\u0201\u0005C\u0000\u0000\u0201\u021f\u0001\u0000\u0000"+
		"\u0000\u0202\u0203\u0005J\u0000\u0000\u0203\u0204\u0005B\u0000\u0000\u0204"+
		"\u0205\u00038\u001c\u0000\u0205\u0206\u0005D\u0000\u0000\u0206\u0207\u0003"+
		"8\u001c\u0000\u0207\u0208\u0005C\u0000\u0000\u0208\u021f\u0001\u0000\u0000"+
		"\u0000\u0209\u020a\u0005&\u0000\u0000\u020a\u020b\u0005@\u0000\u0000\u020b"+
		"\u020c\u00038\u001c\u0000\u020c\u020d\u0005D\u0000\u0000\u020d\u020e\u0003"+
		"8\u001c\u0000\u020e\u020f\u0005A\u0000\u0000\u020f\u021f\u0001\u0000\u0000"+
		"\u0000\u0210\u0211\u0005%\u0000\u0000\u0211\u0212\u0005@\u0000\u0000\u0212"+
		"\u0213\u00038\u001c\u0000\u0213\u0214\u0005D\u0000\u0000\u0214\u0215\u0003"+
		"8\u001c\u0000\u0215\u0216\u0005A\u0000\u0000\u0216\u021f\u0001\u0000\u0000"+
		"\u0000\u0217\u021f\u0005J\u0000\u0000\u0218\u021f\u0005G\u0000\u0000\u0219"+
		"\u021f\u0005F\u0000\u0000\u021a\u021f\u0005H\u0000\u0000\u021b\u021f\u0005"+
		"I\u0000\u0000\u021c\u021f\u0005#\u0000\u0000\u021d\u021f\u0005$\u0000"+
		"\u0000\u021e\u01f3\u0001\u0000\u0000\u0000\u021e\u01f7\u0001\u0000\u0000"+
		"\u0000\u021e\u01fd\u0001\u0000\u0000\u0000\u021e\u0202\u0001\u0000\u0000"+
		"\u0000\u021e\u0209\u0001\u0000\u0000\u0000\u021e\u0210\u0001\u0000\u0000"+
		"\u0000\u021e\u0217\u0001\u0000\u0000\u0000\u021e\u0218\u0001\u0000\u0000"+
		"\u0000\u021e\u0219\u0001\u0000\u0000\u0000\u021e\u021a\u0001\u0000\u0000"+
		"\u0000\u021e\u021b\u0001\u0000\u0000\u0000\u021e\u021c\u0001\u0000\u0000"+
		"\u0000\u021e\u021d\u0001\u0000\u0000\u0000\u021f;\u0001\u0000\u0000\u0000"+
		"1?FKNSj\u008c\u00bb\u00c5\u00cf\u00d8\u00de\u00e6\u00ec\u00f2\u00f8\u00fb"+
		"\u0100\u010a\u010f\u0116\u011c\u011e\u0127\u012d\u0137\u013c\u0142\u014a"+
		"\u014f\u0155\u015d\u0163\u016c\u0172\u0178\u0180\u0188\u018e\u0197\u01a2"+
		"\u01c2\u01c9\u01ce\u01d7\u01ee\u01f0\u01fa\u021e";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}