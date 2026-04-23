// Generated from i:/Projects/Web Apps/PseudoCode Online Compiler/IGCSE-Pseudocode-Online-Compiler/app/src/interpreter/grammar/Pseudocode.g4 by ANTLR 4.13.1
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
		RULE_program = 0, RULE_statement = 1, RULE_declareStatement = 2, RULE_identifierList = 3, 
		RULE_constantStatement = 4, RULE_dataType = 5, RULE_assignmentStatement = 6, 
		RULE_inputStatement = 7, RULE_outputStatement = 8, RULE_exprList = 9, 
		RULE_ifStatement = 10, RULE_caseStatement = 11, RULE_caseClause = 12, 
		RULE_forStatement = 13, RULE_whileStatement = 14, RULE_repeatStatement = 15, 
		RULE_procedureDeclaration = 16, RULE_functionDeclaration = 17, RULE_paramList = 18, 
		RULE_param = 19, RULE_callStatement = 20, RULE_returnStatement = 21, RULE_openFileStatement = 22, 
		RULE_readFileStatement = 23, RULE_writeFileStatement = 24, RULE_closeFileStatement = 25, 
		RULE_fileMode = 26, RULE_argList = 27, RULE_block = 28, RULE_expr = 29, 
		RULE_atom = 30;
	private static String[] makeRuleNames() {
		return new String[] {
			"program", "statement", "declareStatement", "identifierList", "constantStatement", 
			"dataType", "assignmentStatement", "inputStatement", "outputStatement", 
			"exprList", "ifStatement", "caseStatement", "caseClause", "forStatement", 
			"whileStatement", "repeatStatement", "procedureDeclaration", "functionDeclaration", 
			"paramList", "param", "callStatement", "returnStatement", "openFileStatement", 
			"readFileStatement", "writeFileStatement", "closeFileStatement", "fileMode", 
			"argList", "block", "expr", "atom"
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterProgram(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitProgram(this);
		}
	}

	public final ProgramContext program() throws RecognitionException {
		ProgramContext _localctx = new ProgramContext(_ctx, getState());
		enterRule(_localctx, 0, RULE_program);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(65);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,0,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(62);
					match(NEWLINE);
					}
					} 
				}
				setState(67);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,0,_ctx);
			}
			setState(81);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if ((((_la) & ~0x3f) == 0 && ((1L << _la) & 8248036460670L) != 0) || _la==IDENTIFIER) {
				{
				setState(68);
				statement();
				setState(78);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,2,_ctx);
				while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
					if ( _alt==1 ) {
						{
						{
						setState(72);
						_errHandler.sync(this);
						_la = _input.LA(1);
						while (_la==NEWLINE) {
							{
							{
							setState(69);
							match(NEWLINE);
							}
							}
							setState(74);
							_errHandler.sync(this);
							_la = _input.LA(1);
						}
						setState(75);
						statement();
						}
						} 
					}
					setState(80);
					_errHandler.sync(this);
					_alt = getInterpreter().adaptivePredict(_input,2,_ctx);
				}
				}
			}

			setState(86);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==NEWLINE) {
				{
				{
				setState(83);
				match(NEWLINE);
				}
				}
				setState(88);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(89);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterStatement(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitStatement(this);
		}
	}

	public final StatementContext statement() throws RecognitionException {
		StatementContext _localctx = new StatementContext(_ctx, getState());
		enterRule(_localctx, 2, RULE_statement);
		try {
			setState(109);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case DECLARE:
				enterOuterAlt(_localctx, 1);
				{
				setState(91);
				declareStatement();
				}
				break;
			case CONSTANT:
				enterOuterAlt(_localctx, 2);
				{
				setState(92);
				constantStatement();
				}
				break;
			case IDENTIFIER:
				enterOuterAlt(_localctx, 3);
				{
				setState(93);
				assignmentStatement();
				}
				break;
			case INPUT:
				enterOuterAlt(_localctx, 4);
				{
				setState(94);
				inputStatement();
				}
				break;
			case OUTPUT:
			case PRINT:
				enterOuterAlt(_localctx, 5);
				{
				setState(95);
				outputStatement();
				}
				break;
			case IF:
				enterOuterAlt(_localctx, 6);
				{
				setState(96);
				ifStatement();
				}
				break;
			case CASE:
				enterOuterAlt(_localctx, 7);
				{
				setState(97);
				caseStatement();
				}
				break;
			case FOR:
				enterOuterAlt(_localctx, 8);
				{
				setState(98);
				forStatement();
				}
				break;
			case WHILE:
				enterOuterAlt(_localctx, 9);
				{
				setState(99);
				whileStatement();
				}
				break;
			case REPEAT:
				enterOuterAlt(_localctx, 10);
				{
				setState(100);
				repeatStatement();
				}
				break;
			case PROCEDURE:
				enterOuterAlt(_localctx, 11);
				{
				setState(101);
				procedureDeclaration();
				}
				break;
			case FUNCTION:
				enterOuterAlt(_localctx, 12);
				{
				setState(102);
				functionDeclaration();
				}
				break;
			case CALL:
				enterOuterAlt(_localctx, 13);
				{
				setState(103);
				callStatement();
				}
				break;
			case RETURN:
				enterOuterAlt(_localctx, 14);
				{
				setState(104);
				returnStatement();
				}
				break;
			case OPENFILE:
				enterOuterAlt(_localctx, 15);
				{
				setState(105);
				openFileStatement();
				}
				break;
			case READFILE:
				enterOuterAlt(_localctx, 16);
				{
				setState(106);
				readFileStatement();
				}
				break;
			case WRITEFILE:
				enterOuterAlt(_localctx, 17);
				{
				setState(107);
				writeFileStatement();
				}
				break;
			case CLOSEFILE:
				enterOuterAlt(_localctx, 18);
				{
				setState(108);
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
		public IdentifierListContext identifierList() {
			return getRuleContext(IdentifierListContext.class,0);
		}
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
		public TerminalNode IDENTIFIER() { return getToken(PseudocodeParser.IDENTIFIER, 0); }
		public TerminalNode COMMA() { return getToken(PseudocodeParser.COMMA, 0); }
		public DeclareStatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_declareStatement; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterDeclareStatement(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitDeclareStatement(this);
		}
	}

	public final DeclareStatementContext declareStatement() throws RecognitionException {
		DeclareStatementContext _localctx = new DeclareStatementContext(_ctx, getState());
		enterRule(_localctx, 4, RULE_declareStatement);
		try {
			setState(144);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,6,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(111);
				match(DECLARE);
				setState(112);
				identifierList();
				setState(113);
				match(COLON);
				setState(114);
				match(ARRAY);
				setState(115);
				match(LBRACKET);
				setState(116);
				expr(0);
				setState(117);
				match(COLON);
				setState(118);
				expr(0);
				setState(119);
				match(RBRACKET);
				setState(120);
				match(OF);
				setState(121);
				dataType();
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(123);
				match(DECLARE);
				setState(124);
				match(IDENTIFIER);
				setState(125);
				match(COLON);
				setState(126);
				match(ARRAY);
				setState(127);
				match(LBRACKET);
				setState(128);
				expr(0);
				setState(129);
				match(COLON);
				setState(130);
				expr(0);
				setState(131);
				match(COMMA);
				setState(132);
				expr(0);
				setState(133);
				match(COLON);
				setState(134);
				expr(0);
				setState(135);
				match(RBRACKET);
				setState(136);
				match(OF);
				setState(137);
				dataType();
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(139);
				match(DECLARE);
				setState(140);
				identifierList();
				setState(141);
				match(COLON);
				setState(142);
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
	public static class IdentifierListContext extends ParserRuleContext {
		public List<TerminalNode> IDENTIFIER() { return getTokens(PseudocodeParser.IDENTIFIER); }
		public TerminalNode IDENTIFIER(int i) {
			return getToken(PseudocodeParser.IDENTIFIER, i);
		}
		public List<TerminalNode> COMMA() { return getTokens(PseudocodeParser.COMMA); }
		public TerminalNode COMMA(int i) {
			return getToken(PseudocodeParser.COMMA, i);
		}
		public IdentifierListContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_identifierList; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterIdentifierList(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitIdentifierList(this);
		}
	}

	public final IdentifierListContext identifierList() throws RecognitionException {
		IdentifierListContext _localctx = new IdentifierListContext(_ctx, getState());
		enterRule(_localctx, 6, RULE_identifierList);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(146);
			match(IDENTIFIER);
			setState(151);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==COMMA) {
				{
				{
				setState(147);
				match(COMMA);
				setState(148);
				match(IDENTIFIER);
				}
				}
				setState(153);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterConstantStatement(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitConstantStatement(this);
		}
	}

	public final ConstantStatementContext constantStatement() throws RecognitionException {
		ConstantStatementContext _localctx = new ConstantStatementContext(_ctx, getState());
		enterRule(_localctx, 8, RULE_constantStatement);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(154);
			match(CONSTANT);
			setState(155);
			match(IDENTIFIER);
			setState(156);
			_la = _input.LA(1);
			if ( !(_la==LARROW || _la==EQUALS) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			setState(157);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterDataType(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitDataType(this);
		}
	}

	public final DataTypeContext dataType() throws RecognitionException {
		DataTypeContext _localctx = new DataTypeContext(_ctx, getState());
		enterRule(_localctx, 10, RULE_dataType);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(159);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterAssignmentStatement(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitAssignmentStatement(this);
		}
	}

	public final AssignmentStatementContext assignmentStatement() throws RecognitionException {
		AssignmentStatementContext _localctx = new AssignmentStatementContext(_ctx, getState());
		enterRule(_localctx, 12, RULE_assignmentStatement);
		try {
			setState(199);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,8,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(161);
				match(IDENTIFIER);
				setState(162);
				match(EQUALS);
				setState(163);
				expr(0);
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(164);
				match(IDENTIFIER);
				setState(165);
				match(LBRACKET);
				setState(166);
				expr(0);
				setState(167);
				match(RBRACKET);
				setState(168);
				match(EQUALS);
				setState(169);
				expr(0);
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(171);
				match(IDENTIFIER);
				setState(172);
				match(LBRACKET);
				setState(173);
				expr(0);
				setState(174);
				match(COMMA);
				setState(175);
				expr(0);
				setState(176);
				match(RBRACKET);
				setState(177);
				match(EQUALS);
				setState(178);
				expr(0);
				}
				break;
			case 4:
				enterOuterAlt(_localctx, 4);
				{
				setState(180);
				match(IDENTIFIER);
				setState(181);
				match(LARROW);
				setState(182);
				expr(0);
				}
				break;
			case 5:
				enterOuterAlt(_localctx, 5);
				{
				setState(183);
				match(IDENTIFIER);
				setState(184);
				match(LBRACKET);
				setState(185);
				expr(0);
				setState(186);
				match(RBRACKET);
				setState(187);
				match(LARROW);
				setState(188);
				expr(0);
				}
				break;
			case 6:
				enterOuterAlt(_localctx, 6);
				{
				setState(190);
				match(IDENTIFIER);
				setState(191);
				match(LBRACKET);
				setState(192);
				expr(0);
				setState(193);
				match(COMMA);
				setState(194);
				expr(0);
				setState(195);
				match(RBRACKET);
				setState(196);
				match(LARROW);
				setState(197);
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
		public TerminalNode COMMA() { return getToken(PseudocodeParser.COMMA, 0); }
		public TerminalNode STRING_LITERAL() { return getToken(PseudocodeParser.STRING_LITERAL, 0); }
		public TerminalNode LBRACKET() { return getToken(PseudocodeParser.LBRACKET, 0); }
		public ExprContext expr() {
			return getRuleContext(ExprContext.class,0);
		}
		public TerminalNode RBRACKET() { return getToken(PseudocodeParser.RBRACKET, 0); }
		public InputStatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_inputStatement; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterInputStatement(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitInputStatement(this);
		}
	}

	public final InputStatementContext inputStatement() throws RecognitionException {
		InputStatementContext _localctx = new InputStatementContext(_ctx, getState());
		enterRule(_localctx, 14, RULE_inputStatement);
		int _la;
		try {
			setState(216);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,11,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(201);
				match(INPUT);
				setState(202);
				match(IDENTIFIER);
				setState(205);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==COMMA) {
					{
					setState(203);
					match(COMMA);
					setState(204);
					match(STRING_LITERAL);
					}
				}

				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(207);
				match(INPUT);
				setState(208);
				match(IDENTIFIER);
				setState(209);
				match(LBRACKET);
				setState(210);
				expr(0);
				setState(211);
				match(RBRACKET);
				setState(214);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==COMMA) {
					{
					setState(212);
					match(COMMA);
					setState(213);
					match(STRING_LITERAL);
					}
				}

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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterOutputStatement(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitOutputStatement(this);
		}
	}

	public final OutputStatementContext outputStatement() throws RecognitionException {
		OutputStatementContext _localctx = new OutputStatementContext(_ctx, getState());
		enterRule(_localctx, 16, RULE_outputStatement);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(218);
			_la = _input.LA(1);
			if ( !(_la==OUTPUT || _la==PRINT) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			setState(219);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterExprList(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitExprList(this);
		}
	}

	public final ExprListContext exprList() throws RecognitionException {
		ExprListContext _localctx = new ExprListContext(_ctx, getState());
		enterRule(_localctx, 18, RULE_exprList);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(221);
			expr(0);
			setState(226);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==COMMA) {
				{
				{
				setState(222);
				match(COMMA);
				setState(223);
				expr(0);
				}
				}
				setState(228);
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
		public List<TerminalNode> THEN() { return getTokens(PseudocodeParser.THEN); }
		public TerminalNode THEN(int i) {
			return getToken(PseudocodeParser.THEN, i);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterIfStatement(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitIfStatement(this);
		}
	}

	public final IfStatementContext ifStatement() throws RecognitionException {
		IfStatementContext _localctx = new IfStatementContext(_ctx, getState());
		enterRule(_localctx, 20, RULE_ifStatement);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(229);
			match(IF);
			setState(230);
			expr(0);
			setState(234);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,13,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(231);
					match(NEWLINE);
					}
					} 
				}
				setState(236);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,13,_ctx);
			}
			setState(238);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==THEN) {
				{
				setState(237);
				match(THEN);
				}
			}

			setState(243);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==NEWLINE) {
				{
				{
				setState(240);
				match(NEWLINE);
				}
				}
				setState(245);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(246);
			block();
			setState(274);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,20,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(250);
					_errHandler.sync(this);
					_la = _input.LA(1);
					while (_la==NEWLINE) {
						{
						{
						setState(247);
						match(NEWLINE);
						}
						}
						setState(252);
						_errHandler.sync(this);
						_la = _input.LA(1);
					}
					setState(253);
					match(ELSEIF);
					setState(254);
					expr(0);
					setState(258);
					_errHandler.sync(this);
					_alt = getInterpreter().adaptivePredict(_input,17,_ctx);
					while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
						if ( _alt==1 ) {
							{
							{
							setState(255);
							match(NEWLINE);
							}
							} 
						}
						setState(260);
						_errHandler.sync(this);
						_alt = getInterpreter().adaptivePredict(_input,17,_ctx);
					}
					setState(262);
					_errHandler.sync(this);
					_la = _input.LA(1);
					if (_la==THEN) {
						{
						setState(261);
						match(THEN);
						}
					}

					setState(267);
					_errHandler.sync(this);
					_la = _input.LA(1);
					while (_la==NEWLINE) {
						{
						{
						setState(264);
						match(NEWLINE);
						}
						}
						setState(269);
						_errHandler.sync(this);
						_la = _input.LA(1);
					}
					setState(270);
					block();
					}
					} 
				}
				setState(276);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,20,_ctx);
			}
			setState(291);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,23,_ctx) ) {
			case 1:
				{
				setState(280);
				_errHandler.sync(this);
				_la = _input.LA(1);
				while (_la==NEWLINE) {
					{
					{
					setState(277);
					match(NEWLINE);
					}
					}
					setState(282);
					_errHandler.sync(this);
					_la = _input.LA(1);
				}
				setState(283);
				match(ELSE);
				setState(287);
				_errHandler.sync(this);
				_la = _input.LA(1);
				while (_la==NEWLINE) {
					{
					{
					setState(284);
					match(NEWLINE);
					}
					}
					setState(289);
					_errHandler.sync(this);
					_la = _input.LA(1);
				}
				setState(290);
				block();
				}
				break;
			}
			setState(296);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==NEWLINE) {
				{
				{
				setState(293);
				match(NEWLINE);
				}
				}
				setState(298);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(299);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterCaseStatement(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitCaseStatement(this);
		}
	}

	public final CaseStatementContext caseStatement() throws RecognitionException {
		CaseStatementContext _localctx = new CaseStatementContext(_ctx, getState());
		enterRule(_localctx, 22, RULE_caseStatement);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(301);
			match(CASE);
			setState(302);
			match(OF);
			setState(303);
			match(IDENTIFIER);
			setState(307);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==NEWLINE) {
				{
				{
				setState(304);
				match(NEWLINE);
				}
				}
				setState(309);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(311); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(310);
				caseClause();
				}
				}
				setState(313); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( ((((_la - 34)) & ~0x3f) == 0 && ((1L << (_la - 34)) & 2131411075103L) != 0) );
			setState(330);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==OTHERWISE) {
				{
				setState(315);
				match(OTHERWISE);
				setState(316);
				match(COLON);
				setState(320);
				_errHandler.sync(this);
				_la = _input.LA(1);
				while (_la==NEWLINE) {
					{
					{
					setState(317);
					match(NEWLINE);
					}
					}
					setState(322);
					_errHandler.sync(this);
					_la = _input.LA(1);
				}
				setState(323);
				block();
				setState(327);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,28,_ctx);
				while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
					if ( _alt==1 ) {
						{
						{
						setState(324);
						match(NEWLINE);
						}
						} 
					}
					setState(329);
					_errHandler.sync(this);
					_alt = getInterpreter().adaptivePredict(_input,28,_ctx);
				}
				}
			}

			setState(335);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==NEWLINE) {
				{
				{
				setState(332);
				match(NEWLINE);
				}
				}
				setState(337);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(338);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterCaseClause(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitCaseClause(this);
		}
	}

	public final CaseClauseContext caseClause() throws RecognitionException {
		CaseClauseContext _localctx = new CaseClauseContext(_ctx, getState());
		enterRule(_localctx, 24, RULE_caseClause);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(340);
			expr(0);
			setState(341);
			match(COLON);
			setState(345);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==NEWLINE) {
				{
				{
				setState(342);
				match(NEWLINE);
				}
				}
				setState(347);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(348);
			block();
			setState(352);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,32,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(349);
					match(NEWLINE);
					}
					} 
				}
				setState(354);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,32,_ctx);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterForStatement(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitForStatement(this);
		}
	}

	public final ForStatementContext forStatement() throws RecognitionException {
		ForStatementContext _localctx = new ForStatementContext(_ctx, getState());
		enterRule(_localctx, 26, RULE_forStatement);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(355);
			match(FOR);
			setState(356);
			match(IDENTIFIER);
			setState(357);
			_la = _input.LA(1);
			if ( !(_la==LARROW || _la==EQUALS) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			setState(358);
			expr(0);
			setState(359);
			match(TO);
			setState(360);
			expr(0);
			setState(363);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==STEP) {
				{
				setState(361);
				match(STEP);
				setState(362);
				expr(0);
				}
			}

			setState(368);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==NEWLINE) {
				{
				{
				setState(365);
				match(NEWLINE);
				}
				}
				setState(370);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(371);
			block();
			setState(375);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==NEWLINE) {
				{
				{
				setState(372);
				match(NEWLINE);
				}
				}
				setState(377);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(378);
			match(NEXT);
			setState(379);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterWhileStatement(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitWhileStatement(this);
		}
	}

	public final WhileStatementContext whileStatement() throws RecognitionException {
		WhileStatementContext _localctx = new WhileStatementContext(_ctx, getState());
		enterRule(_localctx, 28, RULE_whileStatement);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(381);
			match(WHILE);
			setState(382);
			expr(0);
			setState(384);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==DO) {
				{
				setState(383);
				match(DO);
				}
			}

			setState(389);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==NEWLINE) {
				{
				{
				setState(386);
				match(NEWLINE);
				}
				}
				setState(391);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(392);
			block();
			setState(396);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==NEWLINE) {
				{
				{
				setState(393);
				match(NEWLINE);
				}
				}
				setState(398);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(399);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterRepeatStatement(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitRepeatStatement(this);
		}
	}

	public final RepeatStatementContext repeatStatement() throws RecognitionException {
		RepeatStatementContext _localctx = new RepeatStatementContext(_ctx, getState());
		enterRule(_localctx, 30, RULE_repeatStatement);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(401);
			match(REPEAT);
			setState(405);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==NEWLINE) {
				{
				{
				setState(402);
				match(NEWLINE);
				}
				}
				setState(407);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(408);
			block();
			setState(412);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==NEWLINE) {
				{
				{
				setState(409);
				match(NEWLINE);
				}
				}
				setState(414);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(415);
			match(UNTIL);
			setState(416);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterProcedureDeclaration(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitProcedureDeclaration(this);
		}
	}

	public final ProcedureDeclarationContext procedureDeclaration() throws RecognitionException {
		ProcedureDeclarationContext _localctx = new ProcedureDeclarationContext(_ctx, getState());
		enterRule(_localctx, 32, RULE_procedureDeclaration);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(418);
			match(PROCEDURE);
			setState(419);
			match(IDENTIFIER);
			setState(420);
			match(LPAREN);
			setState(422);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==IDENTIFIER) {
				{
				setState(421);
				paramList();
				}
			}

			setState(424);
			match(RPAREN);
			setState(428);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==NEWLINE) {
				{
				{
				setState(425);
				match(NEWLINE);
				}
				}
				setState(430);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(431);
			block();
			setState(435);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==NEWLINE) {
				{
				{
				setState(432);
				match(NEWLINE);
				}
				}
				setState(437);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(438);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterFunctionDeclaration(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitFunctionDeclaration(this);
		}
	}

	public final FunctionDeclarationContext functionDeclaration() throws RecognitionException {
		FunctionDeclarationContext _localctx = new FunctionDeclarationContext(_ctx, getState());
		enterRule(_localctx, 34, RULE_functionDeclaration);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(440);
			match(FUNCTION);
			setState(441);
			match(IDENTIFIER);
			setState(442);
			match(LPAREN);
			setState(444);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==IDENTIFIER) {
				{
				setState(443);
				paramList();
				}
			}

			setState(446);
			match(RPAREN);
			setState(447);
			match(RETURNS);
			setState(448);
			dataType();
			setState(452);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==NEWLINE) {
				{
				{
				setState(449);
				match(NEWLINE);
				}
				}
				setState(454);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(455);
			block();
			setState(459);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==NEWLINE) {
				{
				{
				setState(456);
				match(NEWLINE);
				}
				}
				setState(461);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(462);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterParamList(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitParamList(this);
		}
	}

	public final ParamListContext paramList() throws RecognitionException {
		ParamListContext _localctx = new ParamListContext(_ctx, getState());
		enterRule(_localctx, 36, RULE_paramList);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(464);
			param();
			setState(469);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==COMMA) {
				{
				{
				setState(465);
				match(COMMA);
				setState(466);
				param();
				}
				}
				setState(471);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterParam(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitParam(this);
		}
	}

	public final ParamContext param() throws RecognitionException {
		ParamContext _localctx = new ParamContext(_ctx, getState());
		enterRule(_localctx, 38, RULE_param);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(472);
			match(IDENTIFIER);
			setState(473);
			match(COLON);
			setState(474);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterCallStatement(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitCallStatement(this);
		}
	}

	public final CallStatementContext callStatement() throws RecognitionException {
		CallStatementContext _localctx = new CallStatementContext(_ctx, getState());
		enterRule(_localctx, 40, RULE_callStatement);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(476);
			match(CALL);
			setState(477);
			match(IDENTIFIER);
			setState(478);
			match(LPAREN);
			setState(480);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (((((_la - 34)) & ~0x3f) == 0 && ((1L << (_la - 34)) & 2131411075103L) != 0)) {
				{
				setState(479);
				argList();
				}
			}

			setState(482);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterReturnStatement(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitReturnStatement(this);
		}
	}

	public final ReturnStatementContext returnStatement() throws RecognitionException {
		ReturnStatementContext _localctx = new ReturnStatementContext(_ctx, getState());
		enterRule(_localctx, 42, RULE_returnStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(484);
			match(RETURN);
			setState(485);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterOpenFileStatement(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitOpenFileStatement(this);
		}
	}

	public final OpenFileStatementContext openFileStatement() throws RecognitionException {
		OpenFileStatementContext _localctx = new OpenFileStatementContext(_ctx, getState());
		enterRule(_localctx, 44, RULE_openFileStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(487);
			match(OPENFILE);
			setState(488);
			expr(0);
			setState(489);
			match(FOR);
			setState(490);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterReadFileStatement(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitReadFileStatement(this);
		}
	}

	public final ReadFileStatementContext readFileStatement() throws RecognitionException {
		ReadFileStatementContext _localctx = new ReadFileStatementContext(_ctx, getState());
		enterRule(_localctx, 46, RULE_readFileStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(492);
			match(READFILE);
			setState(493);
			expr(0);
			setState(494);
			match(COMMA);
			setState(495);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterWriteFileStatement(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitWriteFileStatement(this);
		}
	}

	public final WriteFileStatementContext writeFileStatement() throws RecognitionException {
		WriteFileStatementContext _localctx = new WriteFileStatementContext(_ctx, getState());
		enterRule(_localctx, 48, RULE_writeFileStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(497);
			match(WRITEFILE);
			setState(498);
			expr(0);
			setState(499);
			match(COMMA);
			setState(500);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterCloseFileStatement(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitCloseFileStatement(this);
		}
	}

	public final CloseFileStatementContext closeFileStatement() throws RecognitionException {
		CloseFileStatementContext _localctx = new CloseFileStatementContext(_ctx, getState());
		enterRule(_localctx, 50, RULE_closeFileStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(502);
			match(CLOSEFILE);
			setState(503);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterFileMode(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitFileMode(this);
		}
	}

	public final FileModeContext fileMode() throws RecognitionException {
		FileModeContext _localctx = new FileModeContext(_ctx, getState());
		enterRule(_localctx, 52, RULE_fileMode);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(505);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterArgList(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitArgList(this);
		}
	}

	public final ArgListContext argList() throws RecognitionException {
		ArgListContext _localctx = new ArgListContext(_ctx, getState());
		enterRule(_localctx, 54, RULE_argList);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(507);
			expr(0);
			setState(512);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==COMMA) {
				{
				{
				setState(508);
				match(COMMA);
				setState(509);
				expr(0);
				}
				}
				setState(514);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterBlock(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitBlock(this);
		}
	}

	public final BlockContext block() throws RecognitionException {
		BlockContext _localctx = new BlockContext(_ctx, getState());
		enterRule(_localctx, 56, RULE_block);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(515);
			statement();
			setState(525);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,51,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(519);
					_errHandler.sync(this);
					_la = _input.LA(1);
					while (_la==NEWLINE) {
						{
						{
						setState(516);
						match(NEWLINE);
						}
						}
						setState(521);
						_errHandler.sync(this);
						_la = _input.LA(1);
					}
					setState(522);
					statement();
					}
					} 
				}
				setState(527);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,51,_ctx);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterNotExpr(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitNotExpr(this);
		}
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterPowerExpr(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitPowerExpr(this);
		}
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterAddSubExpr(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitAddSubExpr(this);
		}
	}
	@SuppressWarnings("CheckReturnValue")
	public static class UnaryMinusExprContext extends ExprContext {
		public TerminalNode MINUS() { return getToken(PseudocodeParser.MINUS, 0); }
		public ExprContext expr() {
			return getRuleContext(ExprContext.class,0);
		}
		public UnaryMinusExprContext(ExprContext ctx) { copyFrom(ctx); }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterUnaryMinusExpr(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitUnaryMinusExpr(this);
		}
	}
	@SuppressWarnings("CheckReturnValue")
	public static class AtomExprContext extends ExprContext {
		public AtomContext atom() {
			return getRuleContext(AtomContext.class,0);
		}
		public AtomExprContext(ExprContext ctx) { copyFrom(ctx); }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterAtomExpr(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitAtomExpr(this);
		}
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterOrExpr(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitOrExpr(this);
		}
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterComparisonExpr(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitComparisonExpr(this);
		}
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterMulDivExpr(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitMulDivExpr(this);
		}
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterConcatExpr(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitConcatExpr(this);
		}
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterAndExpr(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitAndExpr(this);
		}
	}

	public final ExprContext expr() throws RecognitionException {
		return expr(0);
	}

	private ExprContext expr(int _p) throws RecognitionException {
		ParserRuleContext _parentctx = _ctx;
		int _parentState = getState();
		ExprContext _localctx = new ExprContext(_ctx, _parentState);
		ExprContext _prevctx = _localctx;
		int _startState = 58;
		enterRecursionRule(_localctx, 58, RULE_expr, _p);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(534);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case NOT:
				{
				_localctx = new NotExprContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;

				setState(529);
				match(NOT);
				setState(530);
				expr(10);
				}
				break;
			case MINUS:
				{
				_localctx = new UnaryMinusExprContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(531);
				match(MINUS);
				setState(532);
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
				setState(533);
				atom();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			_ctx.stop = _input.LT(-1);
			setState(559);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,54,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					if ( _parseListeners!=null ) triggerExitRuleEvent();
					_prevctx = _localctx;
					{
					setState(557);
					_errHandler.sync(this);
					switch ( getInterpreter().adaptivePredict(_input,53,_ctx) ) {
					case 1:
						{
						_localctx = new PowerExprContext(new ExprContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_expr);
						setState(536);
						if (!(precpred(_ctx, 8))) throw new FailedPredicateException(this, "precpred(_ctx, 8)");
						setState(537);
						match(CARET);
						setState(538);
						expr(8);
						}
						break;
					case 2:
						{
						_localctx = new MulDivExprContext(new ExprContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_expr);
						setState(539);
						if (!(precpred(_ctx, 7))) throw new FailedPredicateException(this, "precpred(_ctx, 7)");
						setState(540);
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
						setState(541);
						expr(8);
						}
						break;
					case 3:
						{
						_localctx = new AddSubExprContext(new ExprContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_expr);
						setState(542);
						if (!(precpred(_ctx, 6))) throw new FailedPredicateException(this, "precpred(_ctx, 6)");
						setState(543);
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
						setState(544);
						expr(7);
						}
						break;
					case 4:
						{
						_localctx = new ConcatExprContext(new ExprContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_expr);
						setState(545);
						if (!(precpred(_ctx, 5))) throw new FailedPredicateException(this, "precpred(_ctx, 5)");
						setState(546);
						match(AMPERSAND);
						setState(547);
						expr(6);
						}
						break;
					case 5:
						{
						_localctx = new ComparisonExprContext(new ExprContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_expr);
						setState(548);
						if (!(precpred(_ctx, 4))) throw new FailedPredicateException(this, "precpred(_ctx, 4)");
						setState(549);
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
						setState(550);
						expr(5);
						}
						break;
					case 6:
						{
						_localctx = new AndExprContext(new ExprContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_expr);
						setState(551);
						if (!(precpred(_ctx, 3))) throw new FailedPredicateException(this, "precpred(_ctx, 3)");
						setState(552);
						match(AND);
						setState(553);
						expr(4);
						}
						break;
					case 7:
						{
						_localctx = new OrExprContext(new ExprContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_expr);
						setState(554);
						if (!(precpred(_ctx, 2))) throw new FailedPredicateException(this, "precpred(_ctx, 2)");
						setState(555);
						match(OR);
						setState(556);
						expr(3);
						}
						break;
					}
					} 
				}
				setState(561);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,54,_ctx);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterArrayAccess1DAtom(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitArrayAccess1DAtom(this);
		}
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterDivFunctionAtom(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitDivFunctionAtom(this);
		}
	}
	@SuppressWarnings("CheckReturnValue")
	public static class IdentifierAtomContext extends AtomContext {
		public TerminalNode IDENTIFIER() { return getToken(PseudocodeParser.IDENTIFIER, 0); }
		public IdentifierAtomContext(AtomContext ctx) { copyFrom(ctx); }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterIdentifierAtom(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitIdentifierAtom(this);
		}
	}
	@SuppressWarnings("CheckReturnValue")
	public static class CharAtomContext extends AtomContext {
		public TerminalNode CHAR_LITERAL() { return getToken(PseudocodeParser.CHAR_LITERAL, 0); }
		public CharAtomContext(AtomContext ctx) { copyFrom(ctx); }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterCharAtom(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitCharAtom(this);
		}
	}
	@SuppressWarnings("CheckReturnValue")
	public static class ParenAtomContext extends AtomContext {
		public TerminalNode LPAREN() { return getToken(PseudocodeParser.LPAREN, 0); }
		public ExprContext expr() {
			return getRuleContext(ExprContext.class,0);
		}
		public TerminalNode RPAREN() { return getToken(PseudocodeParser.RPAREN, 0); }
		public ParenAtomContext(AtomContext ctx) { copyFrom(ctx); }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterParenAtom(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitParenAtom(this);
		}
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterArrayAccess2DAtom(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitArrayAccess2DAtom(this);
		}
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterFunctionCallAtom(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitFunctionCallAtom(this);
		}
	}
	@SuppressWarnings("CheckReturnValue")
	public static class StringAtomContext extends AtomContext {
		public TerminalNode STRING_LITERAL() { return getToken(PseudocodeParser.STRING_LITERAL, 0); }
		public StringAtomContext(AtomContext ctx) { copyFrom(ctx); }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterStringAtom(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitStringAtom(this);
		}
	}
	@SuppressWarnings("CheckReturnValue")
	public static class FalseAtomContext extends AtomContext {
		public TerminalNode FALSE() { return getToken(PseudocodeParser.FALSE, 0); }
		public FalseAtomContext(AtomContext ctx) { copyFrom(ctx); }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterFalseAtom(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitFalseAtom(this);
		}
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterModFunctionAtom(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitModFunctionAtom(this);
		}
	}
	@SuppressWarnings("CheckReturnValue")
	public static class IntegerAtomContext extends AtomContext {
		public TerminalNode INTEGER_LITERAL() { return getToken(PseudocodeParser.INTEGER_LITERAL, 0); }
		public IntegerAtomContext(AtomContext ctx) { copyFrom(ctx); }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterIntegerAtom(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitIntegerAtom(this);
		}
	}
	@SuppressWarnings("CheckReturnValue")
	public static class TrueAtomContext extends AtomContext {
		public TerminalNode TRUE() { return getToken(PseudocodeParser.TRUE, 0); }
		public TrueAtomContext(AtomContext ctx) { copyFrom(ctx); }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterTrueAtom(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitTrueAtom(this);
		}
	}
	@SuppressWarnings("CheckReturnValue")
	public static class RealAtomContext extends AtomContext {
		public TerminalNode REAL_LITERAL() { return getToken(PseudocodeParser.REAL_LITERAL, 0); }
		public RealAtomContext(AtomContext ctx) { copyFrom(ctx); }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterRealAtom(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitRealAtom(this);
		}
	}

	public final AtomContext atom() throws RecognitionException {
		AtomContext _localctx = new AtomContext(_ctx, getState());
		enterRule(_localctx, 60, RULE_atom);
		int _la;
		try {
			setState(605);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,56,_ctx) ) {
			case 1:
				_localctx = new ParenAtomContext(_localctx);
				enterOuterAlt(_localctx, 1);
				{
				setState(562);
				match(LPAREN);
				setState(563);
				expr(0);
				setState(564);
				match(RPAREN);
				}
				break;
			case 2:
				_localctx = new FunctionCallAtomContext(_localctx);
				enterOuterAlt(_localctx, 2);
				{
				setState(566);
				match(IDENTIFIER);
				setState(567);
				match(LPAREN);
				setState(569);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (((((_la - 34)) & ~0x3f) == 0 && ((1L << (_la - 34)) & 2131411075103L) != 0)) {
					{
					setState(568);
					argList();
					}
				}

				setState(571);
				match(RPAREN);
				}
				break;
			case 3:
				_localctx = new ArrayAccess1DAtomContext(_localctx);
				enterOuterAlt(_localctx, 3);
				{
				setState(572);
				match(IDENTIFIER);
				setState(573);
				match(LBRACKET);
				setState(574);
				expr(0);
				setState(575);
				match(RBRACKET);
				}
				break;
			case 4:
				_localctx = new ArrayAccess2DAtomContext(_localctx);
				enterOuterAlt(_localctx, 4);
				{
				setState(577);
				match(IDENTIFIER);
				setState(578);
				match(LBRACKET);
				setState(579);
				expr(0);
				setState(580);
				match(COMMA);
				setState(581);
				expr(0);
				setState(582);
				match(RBRACKET);
				}
				break;
			case 5:
				_localctx = new DivFunctionAtomContext(_localctx);
				enterOuterAlt(_localctx, 5);
				{
				setState(584);
				match(DIV);
				setState(585);
				match(LPAREN);
				setState(586);
				expr(0);
				setState(587);
				match(COMMA);
				setState(588);
				expr(0);
				setState(589);
				match(RPAREN);
				}
				break;
			case 6:
				_localctx = new ModFunctionAtomContext(_localctx);
				enterOuterAlt(_localctx, 6);
				{
				setState(591);
				match(MOD);
				setState(592);
				match(LPAREN);
				setState(593);
				expr(0);
				setState(594);
				match(COMMA);
				setState(595);
				expr(0);
				setState(596);
				match(RPAREN);
				}
				break;
			case 7:
				_localctx = new IdentifierAtomContext(_localctx);
				enterOuterAlt(_localctx, 7);
				{
				setState(598);
				match(IDENTIFIER);
				}
				break;
			case 8:
				_localctx = new IntegerAtomContext(_localctx);
				enterOuterAlt(_localctx, 8);
				{
				setState(599);
				match(INTEGER_LITERAL);
				}
				break;
			case 9:
				_localctx = new RealAtomContext(_localctx);
				enterOuterAlt(_localctx, 9);
				{
				setState(600);
				match(REAL_LITERAL);
				}
				break;
			case 10:
				_localctx = new StringAtomContext(_localctx);
				enterOuterAlt(_localctx, 10);
				{
				setState(601);
				match(STRING_LITERAL);
				}
				break;
			case 11:
				_localctx = new CharAtomContext(_localctx);
				enterOuterAlt(_localctx, 11);
				{
				setState(602);
				match(CHAR_LITERAL);
				}
				break;
			case 12:
				_localctx = new TrueAtomContext(_localctx);
				enterOuterAlt(_localctx, 12);
				{
				setState(603);
				match(TRUE);
				}
				break;
			case 13:
				_localctx = new FalseAtomContext(_localctx);
				enterOuterAlt(_localctx, 13);
				{
				setState(604);
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
		case 29:
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
		"\u0004\u0001M\u0260\u0002\u0000\u0007\u0000\u0002\u0001\u0007\u0001\u0002"+
		"\u0002\u0007\u0002\u0002\u0003\u0007\u0003\u0002\u0004\u0007\u0004\u0002"+
		"\u0005\u0007\u0005\u0002\u0006\u0007\u0006\u0002\u0007\u0007\u0007\u0002"+
		"\b\u0007\b\u0002\t\u0007\t\u0002\n\u0007\n\u0002\u000b\u0007\u000b\u0002"+
		"\f\u0007\f\u0002\r\u0007\r\u0002\u000e\u0007\u000e\u0002\u000f\u0007\u000f"+
		"\u0002\u0010\u0007\u0010\u0002\u0011\u0007\u0011\u0002\u0012\u0007\u0012"+
		"\u0002\u0013\u0007\u0013\u0002\u0014\u0007\u0014\u0002\u0015\u0007\u0015"+
		"\u0002\u0016\u0007\u0016\u0002\u0017\u0007\u0017\u0002\u0018\u0007\u0018"+
		"\u0002\u0019\u0007\u0019\u0002\u001a\u0007\u001a\u0002\u001b\u0007\u001b"+
		"\u0002\u001c\u0007\u001c\u0002\u001d\u0007\u001d\u0002\u001e\u0007\u001e"+
		"\u0001\u0000\u0005\u0000@\b\u0000\n\u0000\f\u0000C\t\u0000\u0001\u0000"+
		"\u0001\u0000\u0005\u0000G\b\u0000\n\u0000\f\u0000J\t\u0000\u0001\u0000"+
		"\u0005\u0000M\b\u0000\n\u0000\f\u0000P\t\u0000\u0003\u0000R\b\u0000\u0001"+
		"\u0000\u0005\u0000U\b\u0000\n\u0000\f\u0000X\t\u0000\u0001\u0000\u0001"+
		"\u0000\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001"+
		"\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001"+
		"\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001"+
		"\u0001\u0003\u0001n\b\u0001\u0001\u0002\u0001\u0002\u0001\u0002\u0001"+
		"\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001"+
		"\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001"+
		"\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001"+
		"\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001"+
		"\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0003"+
		"\u0002\u0091\b\u0002\u0001\u0003\u0001\u0003\u0001\u0003\u0005\u0003\u0096"+
		"\b\u0003\n\u0003\f\u0003\u0099\t\u0003\u0001\u0004\u0001\u0004\u0001\u0004"+
		"\u0001\u0004\u0001\u0004\u0001\u0005\u0001\u0005\u0001\u0006\u0001\u0006"+
		"\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006"+
		"\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006"+
		"\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006"+
		"\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006"+
		"\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006"+
		"\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006"+
		"\u0003\u0006\u00c8\b\u0006\u0001\u0007\u0001\u0007\u0001\u0007\u0001\u0007"+
		"\u0003\u0007\u00ce\b\u0007\u0001\u0007\u0001\u0007\u0001\u0007\u0001\u0007"+
		"\u0001\u0007\u0001\u0007\u0001\u0007\u0003\u0007\u00d7\b\u0007\u0003\u0007"+
		"\u00d9\b\u0007\u0001\b\u0001\b\u0001\b\u0001\t\u0001\t\u0001\t\u0005\t"+
		"\u00e1\b\t\n\t\f\t\u00e4\t\t\u0001\n\u0001\n\u0001\n\u0005\n\u00e9\b\n"+
		"\n\n\f\n\u00ec\t\n\u0001\n\u0003\n\u00ef\b\n\u0001\n\u0005\n\u00f2\b\n"+
		"\n\n\f\n\u00f5\t\n\u0001\n\u0001\n\u0005\n\u00f9\b\n\n\n\f\n\u00fc\t\n"+
		"\u0001\n\u0001\n\u0001\n\u0005\n\u0101\b\n\n\n\f\n\u0104\t\n\u0001\n\u0003"+
		"\n\u0107\b\n\u0001\n\u0005\n\u010a\b\n\n\n\f\n\u010d\t\n\u0001\n\u0001"+
		"\n\u0005\n\u0111\b\n\n\n\f\n\u0114\t\n\u0001\n\u0005\n\u0117\b\n\n\n\f"+
		"\n\u011a\t\n\u0001\n\u0001\n\u0005\n\u011e\b\n\n\n\f\n\u0121\t\n\u0001"+
		"\n\u0003\n\u0124\b\n\u0001\n\u0005\n\u0127\b\n\n\n\f\n\u012a\t\n\u0001"+
		"\n\u0001\n\u0001\u000b\u0001\u000b\u0001\u000b\u0001\u000b\u0005\u000b"+
		"\u0132\b\u000b\n\u000b\f\u000b\u0135\t\u000b\u0001\u000b\u0004\u000b\u0138"+
		"\b\u000b\u000b\u000b\f\u000b\u0139\u0001\u000b\u0001\u000b\u0001\u000b"+
		"\u0005\u000b\u013f\b\u000b\n\u000b\f\u000b\u0142\t\u000b\u0001\u000b\u0001"+
		"\u000b\u0005\u000b\u0146\b\u000b\n\u000b\f\u000b\u0149\t\u000b\u0003\u000b"+
		"\u014b\b\u000b\u0001\u000b\u0005\u000b\u014e\b\u000b\n\u000b\f\u000b\u0151"+
		"\t\u000b\u0001\u000b\u0001\u000b\u0001\f\u0001\f\u0001\f\u0005\f\u0158"+
		"\b\f\n\f\f\f\u015b\t\f\u0001\f\u0001\f\u0005\f\u015f\b\f\n\f\f\f\u0162"+
		"\t\f\u0001\r\u0001\r\u0001\r\u0001\r\u0001\r\u0001\r\u0001\r\u0001\r\u0003"+
		"\r\u016c\b\r\u0001\r\u0005\r\u016f\b\r\n\r\f\r\u0172\t\r\u0001\r\u0001"+
		"\r\u0005\r\u0176\b\r\n\r\f\r\u0179\t\r\u0001\r\u0001\r\u0001\r\u0001\u000e"+
		"\u0001\u000e\u0001\u000e\u0003\u000e\u0181\b\u000e\u0001\u000e\u0005\u000e"+
		"\u0184\b\u000e\n\u000e\f\u000e\u0187\t\u000e\u0001\u000e\u0001\u000e\u0005"+
		"\u000e\u018b\b\u000e\n\u000e\f\u000e\u018e\t\u000e\u0001\u000e\u0001\u000e"+
		"\u0001\u000f\u0001\u000f\u0005\u000f\u0194\b\u000f\n\u000f\f\u000f\u0197"+
		"\t\u000f\u0001\u000f\u0001\u000f\u0005\u000f\u019b\b\u000f\n\u000f\f\u000f"+
		"\u019e\t\u000f\u0001\u000f\u0001\u000f\u0001\u000f\u0001\u0010\u0001\u0010"+
		"\u0001\u0010\u0001\u0010\u0003\u0010\u01a7\b\u0010\u0001\u0010\u0001\u0010"+
		"\u0005\u0010\u01ab\b\u0010\n\u0010\f\u0010\u01ae\t\u0010\u0001\u0010\u0001"+
		"\u0010\u0005\u0010\u01b2\b\u0010\n\u0010\f\u0010\u01b5\t\u0010\u0001\u0010"+
		"\u0001\u0010\u0001\u0011\u0001\u0011\u0001\u0011\u0001\u0011\u0003\u0011"+
		"\u01bd\b\u0011\u0001\u0011\u0001\u0011\u0001\u0011\u0001\u0011\u0005\u0011"+
		"\u01c3\b\u0011\n\u0011\f\u0011\u01c6\t\u0011\u0001\u0011\u0001\u0011\u0005"+
		"\u0011\u01ca\b\u0011\n\u0011\f\u0011\u01cd\t\u0011\u0001\u0011\u0001\u0011"+
		"\u0001\u0012\u0001\u0012\u0001\u0012\u0005\u0012\u01d4\b\u0012\n\u0012"+
		"\f\u0012\u01d7\t\u0012\u0001\u0013\u0001\u0013\u0001\u0013\u0001\u0013"+
		"\u0001\u0014\u0001\u0014\u0001\u0014\u0001\u0014\u0003\u0014\u01e1\b\u0014"+
		"\u0001\u0014\u0001\u0014\u0001\u0015\u0001\u0015\u0001\u0015\u0001\u0016"+
		"\u0001\u0016\u0001\u0016\u0001\u0016\u0001\u0016\u0001\u0017\u0001\u0017"+
		"\u0001\u0017\u0001\u0017\u0001\u0017\u0001\u0018\u0001\u0018\u0001\u0018"+
		"\u0001\u0018\u0001\u0018\u0001\u0019\u0001\u0019\u0001\u0019\u0001\u001a"+
		"\u0001\u001a\u0001\u001b\u0001\u001b\u0001\u001b\u0005\u001b\u01ff\b\u001b"+
		"\n\u001b\f\u001b\u0202\t\u001b\u0001\u001c\u0001\u001c\u0005\u001c\u0206"+
		"\b\u001c\n\u001c\f\u001c\u0209\t\u001c\u0001\u001c\u0005\u001c\u020c\b"+
		"\u001c\n\u001c\f\u001c\u020f\t\u001c\u0001\u001d\u0001\u001d\u0001\u001d"+
		"\u0001\u001d\u0001\u001d\u0001\u001d\u0003\u001d\u0217\b\u001d\u0001\u001d"+
		"\u0001\u001d\u0001\u001d\u0001\u001d\u0001\u001d\u0001\u001d\u0001\u001d"+
		"\u0001\u001d\u0001\u001d\u0001\u001d\u0001\u001d\u0001\u001d\u0001\u001d"+
		"\u0001\u001d\u0001\u001d\u0001\u001d\u0001\u001d\u0001\u001d\u0001\u001d"+
		"\u0001\u001d\u0001\u001d\u0005\u001d\u022e\b\u001d\n\u001d\f\u001d\u0231"+
		"\t\u001d\u0001\u001e\u0001\u001e\u0001\u001e\u0001\u001e\u0001\u001e\u0001"+
		"\u001e\u0001\u001e\u0003\u001e\u023a\b\u001e\u0001\u001e\u0001\u001e\u0001"+
		"\u001e\u0001\u001e\u0001\u001e\u0001\u001e\u0001\u001e\u0001\u001e\u0001"+
		"\u001e\u0001\u001e\u0001\u001e\u0001\u001e\u0001\u001e\u0001\u001e\u0001"+
		"\u001e\u0001\u001e\u0001\u001e\u0001\u001e\u0001\u001e\u0001\u001e\u0001"+
		"\u001e\u0001\u001e\u0001\u001e\u0001\u001e\u0001\u001e\u0001\u001e\u0001"+
		"\u001e\u0001\u001e\u0001\u001e\u0001\u001e\u0001\u001e\u0001\u001e\u0001"+
		"\u001e\u0001\u001e\u0003\u001e\u025e\b\u001e\u0001\u001e\u0000\u0001:"+
		"\u001f\u0000\u0002\u0004\u0006\b\n\f\u000e\u0010\u0012\u0014\u0016\u0018"+
		"\u001a\u001c\u001e \"$&(*,.02468:<\u0000\u0007\u0001\u000034\u0001\u0000"+
		".2\u0001\u0000\u0004\u0005\u0001\u0000+-\u0002\u0000%&<=\u0001\u0000:"+
		";\u0001\u000049\u029f\u0000A\u0001\u0000\u0000\u0000\u0002m\u0001\u0000"+
		"\u0000\u0000\u0004\u0090\u0001\u0000\u0000\u0000\u0006\u0092\u0001\u0000"+
		"\u0000\u0000\b\u009a\u0001\u0000\u0000\u0000\n\u009f\u0001\u0000\u0000"+
		"\u0000\f\u00c7\u0001\u0000\u0000\u0000\u000e\u00d8\u0001\u0000\u0000\u0000"+
		"\u0010\u00da\u0001\u0000\u0000\u0000\u0012\u00dd\u0001\u0000\u0000\u0000"+
		"\u0014\u00e5\u0001\u0000\u0000\u0000\u0016\u012d\u0001\u0000\u0000\u0000"+
		"\u0018\u0154\u0001\u0000\u0000\u0000\u001a\u0163\u0001\u0000\u0000\u0000"+
		"\u001c\u017d\u0001\u0000\u0000\u0000\u001e\u0191\u0001\u0000\u0000\u0000"+
		" \u01a2\u0001\u0000\u0000\u0000\"\u01b8\u0001\u0000\u0000\u0000$\u01d0"+
		"\u0001\u0000\u0000\u0000&\u01d8\u0001\u0000\u0000\u0000(\u01dc\u0001\u0000"+
		"\u0000\u0000*\u01e4\u0001\u0000\u0000\u0000,\u01e7\u0001\u0000\u0000\u0000"+
		".\u01ec\u0001\u0000\u0000\u00000\u01f1\u0001\u0000\u0000\u00002\u01f6"+
		"\u0001\u0000\u0000\u00004\u01f9\u0001\u0000\u0000\u00006\u01fb\u0001\u0000"+
		"\u0000\u00008\u0203\u0001\u0000\u0000\u0000:\u0216\u0001\u0000\u0000\u0000"+
		"<\u025d\u0001\u0000\u0000\u0000>@\u0005K\u0000\u0000?>\u0001\u0000\u0000"+
		"\u0000@C\u0001\u0000\u0000\u0000A?\u0001\u0000\u0000\u0000AB\u0001\u0000"+
		"\u0000\u0000BQ\u0001\u0000\u0000\u0000CA\u0001\u0000\u0000\u0000DN\u0003"+
		"\u0002\u0001\u0000EG\u0005K\u0000\u0000FE\u0001\u0000\u0000\u0000GJ\u0001"+
		"\u0000\u0000\u0000HF\u0001\u0000\u0000\u0000HI\u0001\u0000\u0000\u0000"+
		"IK\u0001\u0000\u0000\u0000JH\u0001\u0000\u0000\u0000KM\u0003\u0002\u0001"+
		"\u0000LH\u0001\u0000\u0000\u0000MP\u0001\u0000\u0000\u0000NL\u0001\u0000"+
		"\u0000\u0000NO\u0001\u0000\u0000\u0000OR\u0001\u0000\u0000\u0000PN\u0001"+
		"\u0000\u0000\u0000QD\u0001\u0000\u0000\u0000QR\u0001\u0000\u0000\u0000"+
		"RV\u0001\u0000\u0000\u0000SU\u0005K\u0000\u0000TS\u0001\u0000\u0000\u0000"+
		"UX\u0001\u0000\u0000\u0000VT\u0001\u0000\u0000\u0000VW\u0001\u0000\u0000"+
		"\u0000WY\u0001\u0000\u0000\u0000XV\u0001\u0000\u0000\u0000YZ\u0005\u0000"+
		"\u0000\u0001Z\u0001\u0001\u0000\u0000\u0000[n\u0003\u0004\u0002\u0000"+
		"\\n\u0003\b\u0004\u0000]n\u0003\f\u0006\u0000^n\u0003\u000e\u0007\u0000"+
		"_n\u0003\u0010\b\u0000`n\u0003\u0014\n\u0000an\u0003\u0016\u000b\u0000"+
		"bn\u0003\u001a\r\u0000cn\u0003\u001c\u000e\u0000dn\u0003\u001e\u000f\u0000"+
		"en\u0003 \u0010\u0000fn\u0003\"\u0011\u0000gn\u0003(\u0014\u0000hn\u0003"+
		"*\u0015\u0000in\u0003,\u0016\u0000jn\u0003.\u0017\u0000kn\u00030\u0018"+
		"\u0000ln\u00032\u0019\u0000m[\u0001\u0000\u0000\u0000m\\\u0001\u0000\u0000"+
		"\u0000m]\u0001\u0000\u0000\u0000m^\u0001\u0000\u0000\u0000m_\u0001\u0000"+
		"\u0000\u0000m`\u0001\u0000\u0000\u0000ma\u0001\u0000\u0000\u0000mb\u0001"+
		"\u0000\u0000\u0000mc\u0001\u0000\u0000\u0000md\u0001\u0000\u0000\u0000"+
		"me\u0001\u0000\u0000\u0000mf\u0001\u0000\u0000\u0000mg\u0001\u0000\u0000"+
		"\u0000mh\u0001\u0000\u0000\u0000mi\u0001\u0000\u0000\u0000mj\u0001\u0000"+
		"\u0000\u0000mk\u0001\u0000\u0000\u0000ml\u0001\u0000\u0000\u0000n\u0003"+
		"\u0001\u0000\u0000\u0000op\u0005\u0001\u0000\u0000pq\u0003\u0006\u0003"+
		"\u0000qr\u0005E\u0000\u0000rs\u0005\u001f\u0000\u0000st\u0005B\u0000\u0000"+
		"tu\u0003:\u001d\u0000uv\u0005E\u0000\u0000vw\u0003:\u001d\u0000wx\u0005"+
		"C\u0000\u0000xy\u0005\f\u0000\u0000yz\u0003\n\u0005\u0000z\u0091\u0001"+
		"\u0000\u0000\u0000{|\u0005\u0001\u0000\u0000|}\u0005J\u0000\u0000}~\u0005"+
		"E\u0000\u0000~\u007f\u0005\u001f\u0000\u0000\u007f\u0080\u0005B\u0000"+
		"\u0000\u0080\u0081\u0003:\u001d\u0000\u0081\u0082\u0005E\u0000\u0000\u0082"+
		"\u0083\u0003:\u001d\u0000\u0083\u0084\u0005D\u0000\u0000\u0084\u0085\u0003"+
		":\u001d\u0000\u0085\u0086\u0005E\u0000\u0000\u0086\u0087\u0003:\u001d"+
		"\u0000\u0087\u0088\u0005C\u0000\u0000\u0088\u0089\u0005\f\u0000\u0000"+
		"\u0089\u008a\u0003\n\u0005\u0000\u008a\u0091\u0001\u0000\u0000\u0000\u008b"+
		"\u008c\u0005\u0001\u0000\u0000\u008c\u008d\u0003\u0006\u0003\u0000\u008d"+
		"\u008e\u0005E\u0000\u0000\u008e\u008f\u0003\n\u0005\u0000\u008f\u0091"+
		"\u0001\u0000\u0000\u0000\u0090o\u0001\u0000\u0000\u0000\u0090{\u0001\u0000"+
		"\u0000\u0000\u0090\u008b\u0001\u0000\u0000\u0000\u0091\u0005\u0001\u0000"+
		"\u0000\u0000\u0092\u0097\u0005J\u0000\u0000\u0093\u0094\u0005D\u0000\u0000"+
		"\u0094\u0096\u0005J\u0000\u0000\u0095\u0093\u0001\u0000\u0000\u0000\u0096"+
		"\u0099\u0001\u0000\u0000\u0000\u0097\u0095\u0001\u0000\u0000\u0000\u0097"+
		"\u0098\u0001\u0000\u0000\u0000\u0098\u0007\u0001\u0000\u0000\u0000\u0099"+
		"\u0097\u0001\u0000\u0000\u0000\u009a\u009b\u0005\u0002\u0000\u0000\u009b"+
		"\u009c\u0005J\u0000\u0000\u009c\u009d\u0007\u0000\u0000\u0000\u009d\u009e"+
		"\u0003:\u001d\u0000\u009e\t\u0001\u0000\u0000\u0000\u009f\u00a0\u0007"+
		"\u0001\u0000\u0000\u00a0\u000b\u0001\u0000\u0000\u0000\u00a1\u00a2\u0005"+
		"J\u0000\u0000\u00a2\u00a3\u00054\u0000\u0000\u00a3\u00c8\u0003:\u001d"+
		"\u0000\u00a4\u00a5\u0005J\u0000\u0000\u00a5\u00a6\u0005B\u0000\u0000\u00a6"+
		"\u00a7\u0003:\u001d\u0000\u00a7\u00a8\u0005C\u0000\u0000\u00a8\u00a9\u0005"+
		"4\u0000\u0000\u00a9\u00aa\u0003:\u001d\u0000\u00aa\u00c8\u0001\u0000\u0000"+
		"\u0000\u00ab\u00ac\u0005J\u0000\u0000\u00ac\u00ad\u0005B\u0000\u0000\u00ad"+
		"\u00ae\u0003:\u001d\u0000\u00ae\u00af\u0005D\u0000\u0000\u00af\u00b0\u0003"+
		":\u001d\u0000\u00b0\u00b1\u0005C\u0000\u0000\u00b1\u00b2\u00054\u0000"+
		"\u0000\u00b2\u00b3\u0003:\u001d\u0000\u00b3\u00c8\u0001\u0000\u0000\u0000"+
		"\u00b4\u00b5\u0005J\u0000\u0000\u00b5\u00b6\u00053\u0000\u0000\u00b6\u00c8"+
		"\u0003:\u001d\u0000\u00b7\u00b8\u0005J\u0000\u0000\u00b8\u00b9\u0005B"+
		"\u0000\u0000\u00b9\u00ba\u0003:\u001d\u0000\u00ba\u00bb\u0005C\u0000\u0000"+
		"\u00bb\u00bc\u00053\u0000\u0000\u00bc\u00bd\u0003:\u001d\u0000\u00bd\u00c8"+
		"\u0001\u0000\u0000\u0000\u00be\u00bf\u0005J\u0000\u0000\u00bf\u00c0\u0005"+
		"B\u0000\u0000\u00c0\u00c1\u0003:\u001d\u0000\u00c1\u00c2\u0005D\u0000"+
		"\u0000\u00c2\u00c3\u0003:\u001d\u0000\u00c3\u00c4\u0005C\u0000\u0000\u00c4"+
		"\u00c5\u00053\u0000\u0000\u00c5\u00c6\u0003:\u001d\u0000\u00c6\u00c8\u0001"+
		"\u0000\u0000\u0000\u00c7\u00a1\u0001\u0000\u0000\u0000\u00c7\u00a4\u0001"+
		"\u0000\u0000\u0000\u00c7\u00ab\u0001\u0000\u0000\u0000\u00c7\u00b4\u0001"+
		"\u0000\u0000\u0000\u00c7\u00b7\u0001\u0000\u0000\u0000\u00c7\u00be\u0001"+
		"\u0000\u0000\u0000\u00c8\r\u0001\u0000\u0000\u0000\u00c9\u00ca\u0005\u0003"+
		"\u0000\u0000\u00ca\u00cd\u0005J\u0000\u0000\u00cb\u00cc\u0005D\u0000\u0000"+
		"\u00cc\u00ce\u0005H\u0000\u0000\u00cd\u00cb\u0001\u0000\u0000\u0000\u00cd"+
		"\u00ce\u0001\u0000\u0000\u0000\u00ce\u00d9\u0001\u0000\u0000\u0000\u00cf"+
		"\u00d0\u0005\u0003\u0000\u0000\u00d0\u00d1\u0005J\u0000\u0000\u00d1\u00d2"+
		"\u0005B\u0000\u0000\u00d2\u00d3\u0003:\u001d\u0000\u00d3\u00d6\u0005C"+
		"\u0000\u0000\u00d4\u00d5\u0005D\u0000\u0000\u00d5\u00d7\u0005H\u0000\u0000"+
		"\u00d6\u00d4\u0001\u0000\u0000\u0000\u00d6\u00d7\u0001\u0000\u0000\u0000"+
		"\u00d7\u00d9\u0001\u0000\u0000\u0000\u00d8\u00c9\u0001\u0000\u0000\u0000"+
		"\u00d8\u00cf\u0001\u0000\u0000\u0000\u00d9\u000f\u0001\u0000\u0000\u0000"+
		"\u00da\u00db\u0007\u0002\u0000\u0000\u00db\u00dc\u0003\u0012\t\u0000\u00dc"+
		"\u0011\u0001\u0000\u0000\u0000\u00dd\u00e2\u0003:\u001d\u0000\u00de\u00df"+
		"\u0005D\u0000\u0000\u00df\u00e1\u0003:\u001d\u0000\u00e0\u00de\u0001\u0000"+
		"\u0000\u0000\u00e1\u00e4\u0001\u0000\u0000\u0000\u00e2\u00e0\u0001\u0000"+
		"\u0000\u0000\u00e2\u00e3\u0001\u0000\u0000\u0000\u00e3\u0013\u0001\u0000"+
		"\u0000\u0000\u00e4\u00e2\u0001\u0000\u0000\u0000\u00e5\u00e6\u0005\u0006"+
		"\u0000\u0000\u00e6\u00ea\u0003:\u001d\u0000\u00e7\u00e9\u0005K\u0000\u0000"+
		"\u00e8\u00e7\u0001\u0000\u0000\u0000\u00e9\u00ec\u0001\u0000\u0000\u0000"+
		"\u00ea\u00e8\u0001\u0000\u0000\u0000\u00ea\u00eb\u0001\u0000\u0000\u0000"+
		"\u00eb\u00ee\u0001\u0000\u0000\u0000\u00ec\u00ea\u0001\u0000\u0000\u0000"+
		"\u00ed\u00ef\u0005\u0007\u0000\u0000\u00ee\u00ed\u0001\u0000\u0000\u0000"+
		"\u00ee\u00ef\u0001\u0000\u0000\u0000\u00ef\u00f3\u0001\u0000\u0000\u0000"+
		"\u00f0\u00f2\u0005K\u0000\u0000\u00f1\u00f0\u0001\u0000\u0000\u0000\u00f2"+
		"\u00f5\u0001\u0000\u0000\u0000\u00f3\u00f1\u0001\u0000\u0000\u0000\u00f3"+
		"\u00f4\u0001\u0000\u0000\u0000\u00f4\u00f6\u0001\u0000\u0000\u0000\u00f5"+
		"\u00f3\u0001\u0000\u0000\u0000\u00f6\u0112\u00038\u001c\u0000\u00f7\u00f9"+
		"\u0005K\u0000\u0000\u00f8\u00f7\u0001\u0000\u0000\u0000\u00f9\u00fc\u0001"+
		"\u0000\u0000\u0000\u00fa\u00f8\u0001\u0000\u0000\u0000\u00fa\u00fb\u0001"+
		"\u0000\u0000\u0000\u00fb\u00fd\u0001\u0000\u0000\u0000\u00fc\u00fa\u0001"+
		"\u0000\u0000\u0000\u00fd\u00fe\u0005\t\u0000\u0000\u00fe\u0102\u0003:"+
		"\u001d\u0000\u00ff\u0101\u0005K\u0000\u0000\u0100\u00ff\u0001\u0000\u0000"+
		"\u0000\u0101\u0104\u0001\u0000\u0000\u0000\u0102\u0100\u0001\u0000\u0000"+
		"\u0000\u0102\u0103\u0001\u0000\u0000\u0000\u0103\u0106\u0001\u0000\u0000"+
		"\u0000\u0104\u0102\u0001\u0000\u0000\u0000\u0105\u0107\u0005\u0007\u0000"+
		"\u0000\u0106\u0105\u0001\u0000\u0000\u0000\u0106\u0107\u0001\u0000\u0000"+
		"\u0000\u0107\u010b\u0001\u0000\u0000\u0000\u0108\u010a\u0005K\u0000\u0000"+
		"\u0109\u0108\u0001\u0000\u0000\u0000\u010a\u010d\u0001\u0000\u0000\u0000"+
		"\u010b\u0109\u0001\u0000\u0000\u0000\u010b\u010c\u0001\u0000\u0000\u0000"+
		"\u010c\u010e\u0001\u0000\u0000\u0000\u010d\u010b\u0001\u0000\u0000\u0000"+
		"\u010e\u010f\u00038\u001c\u0000\u010f\u0111\u0001\u0000\u0000\u0000\u0110"+
		"\u00fa\u0001\u0000\u0000\u0000\u0111\u0114\u0001\u0000\u0000\u0000\u0112"+
		"\u0110\u0001\u0000\u0000\u0000\u0112\u0113\u0001\u0000\u0000\u0000\u0113"+
		"\u0123\u0001\u0000\u0000\u0000\u0114\u0112\u0001\u0000\u0000\u0000\u0115"+
		"\u0117\u0005K\u0000\u0000\u0116\u0115\u0001\u0000\u0000\u0000\u0117\u011a"+
		"\u0001\u0000\u0000\u0000\u0118\u0116\u0001\u0000\u0000\u0000\u0118\u0119"+
		"\u0001\u0000\u0000\u0000\u0119\u011b\u0001\u0000\u0000\u0000\u011a\u0118"+
		"\u0001\u0000\u0000\u0000\u011b\u011f\u0005\b\u0000\u0000\u011c\u011e\u0005"+
		"K\u0000\u0000\u011d\u011c\u0001\u0000\u0000\u0000\u011e\u0121\u0001\u0000"+
		"\u0000\u0000\u011f\u011d\u0001\u0000\u0000\u0000\u011f\u0120\u0001\u0000"+
		"\u0000\u0000\u0120\u0122\u0001\u0000\u0000\u0000\u0121\u011f\u0001\u0000"+
		"\u0000\u0000\u0122\u0124\u00038\u001c\u0000\u0123\u0118\u0001\u0000\u0000"+
		"\u0000\u0123\u0124\u0001\u0000\u0000\u0000\u0124\u0128\u0001\u0000\u0000"+
		"\u0000\u0125\u0127\u0005K\u0000\u0000\u0126\u0125\u0001\u0000\u0000\u0000"+
		"\u0127\u012a\u0001\u0000\u0000\u0000\u0128\u0126\u0001\u0000\u0000\u0000"+
		"\u0128\u0129\u0001\u0000\u0000\u0000\u0129\u012b\u0001\u0000\u0000\u0000"+
		"\u012a\u0128\u0001\u0000\u0000\u0000\u012b\u012c\u0005\n\u0000\u0000\u012c"+
		"\u0015\u0001\u0000\u0000\u0000\u012d\u012e\u0005\u000b\u0000\u0000\u012e"+
		"\u012f\u0005\f\u0000\u0000\u012f\u0133\u0005J\u0000\u0000\u0130\u0132"+
		"\u0005K\u0000\u0000\u0131\u0130\u0001\u0000\u0000\u0000\u0132\u0135\u0001"+
		"\u0000\u0000\u0000\u0133\u0131\u0001\u0000\u0000\u0000\u0133\u0134\u0001"+
		"\u0000\u0000\u0000\u0134\u0137\u0001\u0000\u0000\u0000\u0135\u0133\u0001"+
		"\u0000\u0000\u0000\u0136\u0138\u0003\u0018\f\u0000\u0137\u0136\u0001\u0000"+
		"\u0000\u0000\u0138\u0139\u0001\u0000\u0000\u0000\u0139\u0137\u0001\u0000"+
		"\u0000\u0000\u0139\u013a\u0001\u0000\u0000\u0000\u013a\u014a\u0001\u0000"+
		"\u0000\u0000\u013b\u013c\u0005\r\u0000\u0000\u013c\u0140\u0005E\u0000"+
		"\u0000\u013d\u013f\u0005K\u0000\u0000\u013e\u013d\u0001\u0000\u0000\u0000"+
		"\u013f\u0142\u0001\u0000\u0000\u0000\u0140\u013e\u0001\u0000\u0000\u0000"+
		"\u0140\u0141\u0001\u0000\u0000\u0000\u0141\u0143\u0001\u0000\u0000\u0000"+
		"\u0142\u0140\u0001\u0000\u0000\u0000\u0143\u0147\u00038\u001c\u0000\u0144"+
		"\u0146\u0005K\u0000\u0000\u0145\u0144\u0001\u0000\u0000\u0000\u0146\u0149"+
		"\u0001\u0000\u0000\u0000\u0147\u0145\u0001\u0000\u0000\u0000\u0147\u0148"+
		"\u0001\u0000\u0000\u0000\u0148\u014b\u0001\u0000\u0000\u0000\u0149\u0147"+
		"\u0001\u0000\u0000\u0000\u014a\u013b\u0001\u0000\u0000\u0000\u014a\u014b"+
		"\u0001\u0000\u0000\u0000\u014b\u014f\u0001\u0000\u0000\u0000\u014c\u014e"+
		"\u0005K\u0000\u0000\u014d\u014c\u0001\u0000\u0000\u0000\u014e\u0151\u0001"+
		"\u0000\u0000\u0000\u014f\u014d\u0001\u0000\u0000\u0000\u014f\u0150\u0001"+
		"\u0000\u0000\u0000\u0150\u0152\u0001\u0000\u0000\u0000\u0151\u014f\u0001"+
		"\u0000\u0000\u0000\u0152\u0153\u0005\u000e\u0000\u0000\u0153\u0017\u0001"+
		"\u0000\u0000\u0000\u0154\u0155\u0003:\u001d\u0000\u0155\u0159\u0005E\u0000"+
		"\u0000\u0156\u0158\u0005K\u0000\u0000\u0157\u0156\u0001\u0000\u0000\u0000"+
		"\u0158\u015b\u0001\u0000\u0000\u0000\u0159\u0157\u0001\u0000\u0000\u0000"+
		"\u0159\u015a\u0001\u0000\u0000\u0000\u015a\u015c\u0001\u0000\u0000\u0000"+
		"\u015b\u0159\u0001\u0000\u0000\u0000\u015c\u0160\u00038\u001c\u0000\u015d"+
		"\u015f\u0005K\u0000\u0000\u015e\u015d\u0001\u0000\u0000\u0000\u015f\u0162"+
		"\u0001\u0000\u0000\u0000\u0160\u015e\u0001\u0000\u0000\u0000\u0160\u0161"+
		"\u0001\u0000\u0000\u0000\u0161\u0019\u0001\u0000\u0000\u0000\u0162\u0160"+
		"\u0001\u0000\u0000\u0000\u0163\u0164\u0005\u000f\u0000\u0000\u0164\u0165"+
		"\u0005J\u0000\u0000\u0165\u0166\u0007\u0000\u0000\u0000\u0166\u0167\u0003"+
		":\u001d\u0000\u0167\u0168\u0005\u0010\u0000\u0000\u0168\u016b\u0003:\u001d"+
		"\u0000\u0169\u016a\u0005\u0011\u0000\u0000\u016a\u016c\u0003:\u001d\u0000"+
		"\u016b\u0169\u0001\u0000\u0000\u0000\u016b\u016c\u0001\u0000\u0000\u0000"+
		"\u016c\u0170\u0001\u0000\u0000\u0000\u016d\u016f\u0005K\u0000\u0000\u016e"+
		"\u016d\u0001\u0000\u0000\u0000\u016f\u0172\u0001\u0000\u0000\u0000\u0170"+
		"\u016e\u0001\u0000\u0000\u0000\u0170\u0171\u0001\u0000\u0000\u0000\u0171"+
		"\u0173\u0001\u0000\u0000\u0000\u0172\u0170\u0001\u0000\u0000\u0000\u0173"+
		"\u0177\u00038\u001c\u0000\u0174\u0176\u0005K\u0000\u0000\u0175\u0174\u0001"+
		"\u0000\u0000\u0000\u0176\u0179\u0001\u0000\u0000\u0000\u0177\u0175\u0001"+
		"\u0000\u0000\u0000\u0177\u0178\u0001\u0000\u0000\u0000\u0178\u017a\u0001"+
		"\u0000\u0000\u0000\u0179\u0177\u0001\u0000\u0000\u0000\u017a\u017b\u0005"+
		"\u0012\u0000\u0000\u017b\u017c\u0005J\u0000\u0000\u017c\u001b\u0001\u0000"+
		"\u0000\u0000\u017d\u017e\u0005\u0013\u0000\u0000\u017e\u0180\u0003:\u001d"+
		"\u0000\u017f\u0181\u0005\u0014\u0000\u0000\u0180\u017f\u0001\u0000\u0000"+
		"\u0000\u0180\u0181\u0001\u0000\u0000\u0000\u0181\u0185\u0001\u0000\u0000"+
		"\u0000\u0182\u0184\u0005K\u0000\u0000\u0183\u0182\u0001\u0000\u0000\u0000"+
		"\u0184\u0187\u0001\u0000\u0000\u0000\u0185\u0183\u0001\u0000\u0000\u0000"+
		"\u0185\u0186\u0001\u0000\u0000\u0000\u0186\u0188\u0001\u0000\u0000\u0000"+
		"\u0187\u0185\u0001\u0000\u0000\u0000\u0188\u018c\u00038\u001c\u0000\u0189"+
		"\u018b\u0005K\u0000\u0000\u018a\u0189\u0001\u0000\u0000\u0000\u018b\u018e"+
		"\u0001\u0000\u0000\u0000\u018c\u018a\u0001\u0000\u0000\u0000\u018c\u018d"+
		"\u0001\u0000\u0000\u0000\u018d\u018f\u0001\u0000\u0000\u0000\u018e\u018c"+
		"\u0001\u0000\u0000\u0000\u018f\u0190\u0005\u0015\u0000\u0000\u0190\u001d"+
		"\u0001\u0000\u0000\u0000\u0191\u0195\u0005\u0016\u0000\u0000\u0192\u0194"+
		"\u0005K\u0000\u0000\u0193\u0192\u0001\u0000\u0000\u0000\u0194\u0197\u0001"+
		"\u0000\u0000\u0000\u0195\u0193\u0001\u0000\u0000\u0000\u0195\u0196\u0001"+
		"\u0000\u0000\u0000\u0196\u0198\u0001\u0000\u0000\u0000\u0197\u0195\u0001"+
		"\u0000\u0000\u0000\u0198\u019c\u00038\u001c\u0000\u0199\u019b\u0005K\u0000"+
		"\u0000\u019a\u0199\u0001\u0000\u0000\u0000\u019b\u019e\u0001\u0000\u0000"+
		"\u0000\u019c\u019a\u0001\u0000\u0000\u0000\u019c\u019d\u0001\u0000\u0000"+
		"\u0000\u019d\u019f\u0001\u0000\u0000\u0000\u019e\u019c\u0001\u0000\u0000"+
		"\u0000\u019f\u01a0\u0005\u0017\u0000\u0000\u01a0\u01a1\u0003:\u001d\u0000"+
		"\u01a1\u001f\u0001\u0000\u0000\u0000\u01a2\u01a3\u0005\u0018\u0000\u0000"+
		"\u01a3\u01a4\u0005J\u0000\u0000\u01a4\u01a6\u0005@\u0000\u0000\u01a5\u01a7"+
		"\u0003$\u0012\u0000\u01a6\u01a5\u0001\u0000\u0000\u0000\u01a6\u01a7\u0001"+
		"\u0000\u0000\u0000\u01a7\u01a8\u0001\u0000\u0000\u0000\u01a8\u01ac\u0005"+
		"A\u0000\u0000\u01a9\u01ab\u0005K\u0000\u0000\u01aa\u01a9\u0001\u0000\u0000"+
		"\u0000\u01ab\u01ae\u0001\u0000\u0000\u0000\u01ac\u01aa\u0001\u0000\u0000"+
		"\u0000\u01ac\u01ad\u0001\u0000\u0000\u0000\u01ad\u01af\u0001\u0000\u0000"+
		"\u0000\u01ae\u01ac\u0001\u0000\u0000\u0000\u01af\u01b3\u00038\u001c\u0000"+
		"\u01b0\u01b2\u0005K\u0000\u0000\u01b1\u01b0\u0001\u0000\u0000\u0000\u01b2"+
		"\u01b5\u0001\u0000\u0000\u0000\u01b3\u01b1\u0001\u0000\u0000\u0000\u01b3"+
		"\u01b4\u0001\u0000\u0000\u0000\u01b4\u01b6\u0001\u0000\u0000\u0000\u01b5"+
		"\u01b3\u0001\u0000\u0000\u0000\u01b6\u01b7\u0005\u0019\u0000\u0000\u01b7"+
		"!\u0001\u0000\u0000\u0000\u01b8\u01b9\u0005\u001a\u0000\u0000\u01b9\u01ba"+
		"\u0005J\u0000\u0000\u01ba\u01bc\u0005@\u0000\u0000\u01bb\u01bd\u0003$"+
		"\u0012\u0000\u01bc\u01bb\u0001\u0000\u0000\u0000\u01bc\u01bd\u0001\u0000"+
		"\u0000\u0000\u01bd\u01be\u0001\u0000\u0000\u0000\u01be\u01bf\u0005A\u0000"+
		"\u0000\u01bf\u01c0\u0005\u001c\u0000\u0000\u01c0\u01c4\u0003\n\u0005\u0000"+
		"\u01c1\u01c3\u0005K\u0000\u0000\u01c2\u01c1\u0001\u0000\u0000\u0000\u01c3"+
		"\u01c6\u0001\u0000\u0000\u0000\u01c4\u01c2\u0001\u0000\u0000\u0000\u01c4"+
		"\u01c5\u0001\u0000\u0000\u0000\u01c5\u01c7\u0001\u0000\u0000\u0000\u01c6"+
		"\u01c4\u0001\u0000\u0000\u0000\u01c7\u01cb\u00038\u001c\u0000\u01c8\u01ca"+
		"\u0005K\u0000\u0000\u01c9\u01c8\u0001\u0000\u0000\u0000\u01ca\u01cd\u0001"+
		"\u0000\u0000\u0000\u01cb\u01c9\u0001\u0000\u0000\u0000\u01cb\u01cc\u0001"+
		"\u0000\u0000\u0000\u01cc\u01ce\u0001\u0000\u0000\u0000\u01cd\u01cb\u0001"+
		"\u0000\u0000\u0000\u01ce\u01cf\u0005\u001b\u0000\u0000\u01cf#\u0001\u0000"+
		"\u0000\u0000\u01d0\u01d5\u0003&\u0013\u0000\u01d1\u01d2\u0005D\u0000\u0000"+
		"\u01d2\u01d4\u0003&\u0013\u0000\u01d3\u01d1\u0001\u0000\u0000\u0000\u01d4"+
		"\u01d7\u0001\u0000\u0000\u0000\u01d5\u01d3\u0001\u0000\u0000\u0000\u01d5"+
		"\u01d6\u0001\u0000\u0000\u0000\u01d6%\u0001\u0000\u0000\u0000\u01d7\u01d5"+
		"\u0001\u0000\u0000\u0000\u01d8\u01d9\u0005J\u0000\u0000\u01d9\u01da\u0005"+
		"E\u0000\u0000\u01da\u01db\u0003\n\u0005\u0000\u01db\'\u0001\u0000\u0000"+
		"\u0000\u01dc\u01dd\u0005\u001e\u0000\u0000\u01dd\u01de\u0005J\u0000\u0000"+
		"\u01de\u01e0\u0005@\u0000\u0000\u01df\u01e1\u00036\u001b\u0000\u01e0\u01df"+
		"\u0001\u0000\u0000\u0000\u01e0\u01e1\u0001\u0000\u0000\u0000\u01e1\u01e2"+
		"\u0001\u0000\u0000\u0000\u01e2\u01e3\u0005A\u0000\u0000\u01e3)\u0001\u0000"+
		"\u0000\u0000\u01e4\u01e5\u0005\u001d\u0000\u0000\u01e5\u01e6\u0003:\u001d"+
		"\u0000\u01e6+\u0001\u0000\u0000\u0000\u01e7\u01e8\u0005\'\u0000\u0000"+
		"\u01e8\u01e9\u0003:\u001d\u0000\u01e9\u01ea\u0005\u000f\u0000\u0000\u01ea"+
		"\u01eb\u00034\u001a\u0000\u01eb-\u0001\u0000\u0000\u0000\u01ec\u01ed\u0005"+
		"(\u0000\u0000\u01ed\u01ee\u0003:\u001d\u0000\u01ee\u01ef\u0005D\u0000"+
		"\u0000\u01ef\u01f0\u0005J\u0000\u0000\u01f0/\u0001\u0000\u0000\u0000\u01f1"+
		"\u01f2\u0005)\u0000\u0000\u01f2\u01f3\u0003:\u001d\u0000\u01f3\u01f4\u0005"+
		"D\u0000\u0000\u01f4\u01f5\u0003:\u001d\u0000\u01f51\u0001\u0000\u0000"+
		"\u0000\u01f6\u01f7\u0005*\u0000\u0000\u01f7\u01f8\u0003:\u001d\u0000\u01f8"+
		"3\u0001\u0000\u0000\u0000\u01f9\u01fa\u0007\u0003\u0000\u0000\u01fa5\u0001"+
		"\u0000\u0000\u0000\u01fb\u0200\u0003:\u001d\u0000\u01fc\u01fd\u0005D\u0000"+
		"\u0000\u01fd\u01ff\u0003:\u001d\u0000\u01fe\u01fc\u0001\u0000\u0000\u0000"+
		"\u01ff\u0202\u0001\u0000\u0000\u0000\u0200\u01fe\u0001\u0000\u0000\u0000"+
		"\u0200\u0201\u0001\u0000\u0000\u0000\u02017\u0001\u0000\u0000\u0000\u0202"+
		"\u0200\u0001\u0000\u0000\u0000\u0203\u020d\u0003\u0002\u0001\u0000\u0204"+
		"\u0206\u0005K\u0000\u0000\u0205\u0204\u0001\u0000\u0000\u0000\u0206\u0209"+
		"\u0001\u0000\u0000\u0000\u0207\u0205\u0001\u0000\u0000\u0000\u0207\u0208"+
		"\u0001\u0000\u0000\u0000\u0208\u020a\u0001\u0000\u0000\u0000\u0209\u0207"+
		"\u0001\u0000\u0000\u0000\u020a\u020c\u0003\u0002\u0001\u0000\u020b\u0207"+
		"\u0001\u0000\u0000\u0000\u020c\u020f\u0001\u0000\u0000\u0000\u020d\u020b"+
		"\u0001\u0000\u0000\u0000\u020d\u020e\u0001\u0000\u0000\u0000\u020e9\u0001"+
		"\u0000\u0000\u0000\u020f\u020d\u0001\u0000\u0000\u0000\u0210\u0211\u0006"+
		"\u001d\uffff\uffff\u0000\u0211\u0212\u0005\"\u0000\u0000\u0212\u0217\u0003"+
		":\u001d\n\u0213\u0214\u0005;\u0000\u0000\u0214\u0217\u0003:\u001d\t\u0215"+
		"\u0217\u0003<\u001e\u0000\u0216\u0210\u0001\u0000\u0000\u0000\u0216\u0213"+
		"\u0001\u0000\u0000\u0000\u0216\u0215\u0001\u0000\u0000\u0000\u0217\u022f"+
		"\u0001\u0000\u0000\u0000\u0218\u0219\n\b\u0000\u0000\u0219\u021a\u0005"+
		">\u0000\u0000\u021a\u022e\u0003:\u001d\b\u021b\u021c\n\u0007\u0000\u0000"+
		"\u021c\u021d\u0007\u0004\u0000\u0000\u021d\u022e\u0003:\u001d\b\u021e"+
		"\u021f\n\u0006\u0000\u0000\u021f\u0220\u0007\u0005\u0000\u0000\u0220\u022e"+
		"\u0003:\u001d\u0007\u0221\u0222\n\u0005\u0000\u0000\u0222\u0223\u0005"+
		"?\u0000\u0000\u0223\u022e\u0003:\u001d\u0006\u0224\u0225\n\u0004\u0000"+
		"\u0000\u0225\u0226\u0007\u0006\u0000\u0000\u0226\u022e\u0003:\u001d\u0005"+
		"\u0227\u0228\n\u0003\u0000\u0000\u0228\u0229\u0005 \u0000\u0000\u0229"+
		"\u022e\u0003:\u001d\u0004\u022a\u022b\n\u0002\u0000\u0000\u022b\u022c"+
		"\u0005!\u0000\u0000\u022c\u022e\u0003:\u001d\u0003\u022d\u0218\u0001\u0000"+
		"\u0000\u0000\u022d\u021b\u0001\u0000\u0000\u0000\u022d\u021e\u0001\u0000"+
		"\u0000\u0000\u022d\u0221\u0001\u0000\u0000\u0000\u022d\u0224\u0001\u0000"+
		"\u0000\u0000\u022d\u0227\u0001\u0000\u0000\u0000\u022d\u022a\u0001\u0000"+
		"\u0000\u0000\u022e\u0231\u0001\u0000\u0000\u0000\u022f\u022d\u0001\u0000"+
		"\u0000\u0000\u022f\u0230\u0001\u0000\u0000\u0000\u0230;\u0001\u0000\u0000"+
		"\u0000\u0231\u022f\u0001\u0000\u0000\u0000\u0232\u0233\u0005@\u0000\u0000"+
		"\u0233\u0234\u0003:\u001d\u0000\u0234\u0235\u0005A\u0000\u0000\u0235\u025e"+
		"\u0001\u0000\u0000\u0000\u0236\u0237\u0005J\u0000\u0000\u0237\u0239\u0005"+
		"@\u0000\u0000\u0238\u023a\u00036\u001b\u0000\u0239\u0238\u0001\u0000\u0000"+
		"\u0000\u0239\u023a\u0001\u0000\u0000\u0000\u023a\u023b\u0001\u0000\u0000"+
		"\u0000\u023b\u025e\u0005A\u0000\u0000\u023c\u023d\u0005J\u0000\u0000\u023d"+
		"\u023e\u0005B\u0000\u0000\u023e\u023f\u0003:\u001d\u0000\u023f\u0240\u0005"+
		"C\u0000\u0000\u0240\u025e\u0001\u0000\u0000\u0000\u0241\u0242\u0005J\u0000"+
		"\u0000\u0242\u0243\u0005B\u0000\u0000\u0243\u0244\u0003:\u001d\u0000\u0244"+
		"\u0245\u0005D\u0000\u0000\u0245\u0246\u0003:\u001d\u0000\u0246\u0247\u0005"+
		"C\u0000\u0000\u0247\u025e\u0001\u0000\u0000\u0000\u0248\u0249\u0005&\u0000"+
		"\u0000\u0249\u024a\u0005@\u0000\u0000\u024a\u024b\u0003:\u001d\u0000\u024b"+
		"\u024c\u0005D\u0000\u0000\u024c\u024d\u0003:\u001d\u0000\u024d\u024e\u0005"+
		"A\u0000\u0000\u024e\u025e\u0001\u0000\u0000\u0000\u024f\u0250\u0005%\u0000"+
		"\u0000\u0250\u0251\u0005@\u0000\u0000\u0251\u0252\u0003:\u001d\u0000\u0252"+
		"\u0253\u0005D\u0000\u0000\u0253\u0254\u0003:\u001d\u0000\u0254\u0255\u0005"+
		"A\u0000\u0000\u0255\u025e\u0001\u0000\u0000\u0000\u0256\u025e\u0005J\u0000"+
		"\u0000\u0257\u025e\u0005G\u0000\u0000\u0258\u025e\u0005F\u0000\u0000\u0259"+
		"\u025e\u0005H\u0000\u0000\u025a\u025e\u0005I\u0000\u0000\u025b\u025e\u0005"+
		"#\u0000\u0000\u025c\u025e\u0005$\u0000\u0000\u025d\u0232\u0001\u0000\u0000"+
		"\u0000\u025d\u0236\u0001\u0000\u0000\u0000\u025d\u023c\u0001\u0000\u0000"+
		"\u0000\u025d\u0241\u0001\u0000\u0000\u0000\u025d\u0248\u0001\u0000\u0000"+
		"\u0000\u025d\u024f\u0001\u0000\u0000\u0000\u025d\u0256\u0001\u0000\u0000"+
		"\u0000\u025d\u0257\u0001\u0000\u0000\u0000\u025d\u0258\u0001\u0000\u0000"+
		"\u0000\u025d\u0259\u0001\u0000\u0000\u0000\u025d\u025a\u0001\u0000\u0000"+
		"\u0000\u025d\u025b\u0001\u0000\u0000\u0000\u025d\u025c\u0001\u0000\u0000"+
		"\u0000\u025e=\u0001\u0000\u0000\u00009AHNQVm\u0090\u0097\u00c7\u00cd\u00d6"+
		"\u00d8\u00e2\u00ea\u00ee\u00f3\u00fa\u0102\u0106\u010b\u0112\u0118\u011f"+
		"\u0123\u0128\u0133\u0139\u0140\u0147\u014a\u014f\u0159\u0160\u016b\u0170"+
		"\u0177\u0180\u0185\u018c\u0195\u019c\u01a6\u01ac\u01b3\u01bc\u01c4\u01cb"+
		"\u01d5\u01e0\u0200\u0207\u020d\u0216\u022d\u022f\u0239\u025d";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}