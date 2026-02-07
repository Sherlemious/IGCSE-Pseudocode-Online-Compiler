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
		MOD=37, DIV=38, INTEGER_TYPE=39, REAL_TYPE=40, CHAR_TYPE=41, STRING_TYPE=42, 
		BOOLEAN_TYPE=43, LARROW=44, EQUALS=45, NOTEQUAL=46, LTE=47, GTE=48, LT=49, 
		GT=50, PLUS=51, MINUS=52, STAR=53, SLASH=54, CARET=55, AMPERSAND=56, LPAREN=57, 
		RPAREN=58, LBRACKET=59, RBRACKET=60, COMMA=61, COLON=62, REAL_LITERAL=63, 
		INTEGER_LITERAL=64, STRING_LITERAL=65, CHAR_LITERAL=66, IDENTIFIER=67, 
		NEWLINE=68, WS=69, LINE_COMMENT=70;
	public static final int
		RULE_program = 0, RULE_statement = 1, RULE_declareStatement = 2, RULE_constantStatement = 3, 
		RULE_dataType = 4, RULE_assignmentStatement = 5, RULE_inputStatement = 6, 
		RULE_outputStatement = 7, RULE_exprList = 8, RULE_ifStatement = 9, RULE_caseStatement = 10, 
		RULE_caseClause = 11, RULE_forStatement = 12, RULE_whileStatement = 13, 
		RULE_repeatStatement = 14, RULE_procedureDeclaration = 15, RULE_functionDeclaration = 16, 
		RULE_paramList = 17, RULE_param = 18, RULE_callStatement = 19, RULE_returnStatement = 20, 
		RULE_argList = 21, RULE_block = 22, RULE_expr = 23, RULE_atom = 24;
	private static String[] makeRuleNames() {
		return new String[] {
			"program", "statement", "declareStatement", "constantStatement", "dataType", 
			"assignmentStatement", "inputStatement", "outputStatement", "exprList", 
			"ifStatement", "caseStatement", "caseClause", "forStatement", "whileStatement", 
			"repeatStatement", "procedureDeclaration", "functionDeclaration", "paramList", 
			"param", "callStatement", "returnStatement", "argList", "block", "expr", 
			"atom"
		};
	}
	public static final String[] ruleNames = makeRuleNames();

	private static String[] makeLiteralNames() {
		return new String[] {
			null, null, null, null, null, null, null, null, null, null, null, null, 
			null, null, null, null, null, null, null, null, null, null, null, null, 
			null, null, null, null, null, null, null, null, null, null, null, null, 
			null, null, null, null, null, null, null, null, null, "'='", "'<>'", 
			"'<='", "'>='", "'<'", "'>'", "'+'", "'-'", "'*'", "'/'", "'^'", "'&'", 
			"'('", "')'", "'['", "']'", "','", "':'"
		};
	}
	private static final String[] _LITERAL_NAMES = makeLiteralNames();
	private static String[] makeSymbolicNames() {
		return new String[] {
			null, "DECLARE", "CONSTANT", "INPUT", "OUTPUT", "PRINT", "IF", "THEN", 
			"ELSE", "ELSEIF", "ENDIF", "CASE", "OF", "OTHERWISE", "ENDCASE", "FOR", 
			"TO", "STEP", "NEXT", "WHILE", "DO", "ENDWHILE", "REPEAT", "UNTIL", "PROCEDURE", 
			"ENDPROCEDURE", "FUNCTION", "ENDFUNCTION", "RETURNS", "RETURN", "CALL", 
			"ARRAY", "AND", "OR", "NOT", "TRUE", "FALSE", "MOD", "DIV", "INTEGER_TYPE", 
			"REAL_TYPE", "CHAR_TYPE", "STRING_TYPE", "BOOLEAN_TYPE", "LARROW", "EQUALS", 
			"NOTEQUAL", "LTE", "GTE", "LT", "GT", "PLUS", "MINUS", "STAR", "SLASH", 
			"CARET", "AMPERSAND", "LPAREN", "RPAREN", "LBRACKET", "RBRACKET", "COMMA", 
			"COLON", "REAL_LITERAL", "INTEGER_LITERAL", "STRING_LITERAL", "CHAR_LITERAL", 
			"IDENTIFIER", "NEWLINE", "WS", "LINE_COMMENT"
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
			setState(53);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,0,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(50);
					match(NEWLINE);
					}
					} 
				}
				setState(55);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,0,_ctx);
			}
			setState(68);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if ((((_la) & ~0x3f) == 0 && ((1L << _la) & 1699252350L) != 0) || _la==IDENTIFIER) {
				{
				setState(56);
				statement();
				setState(65);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,2,_ctx);
				while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
					if ( _alt==1 ) {
						{
						{
						setState(58); 
						_errHandler.sync(this);
						_la = _input.LA(1);
						do {
							{
							{
							setState(57);
							match(NEWLINE);
							}
							}
							setState(60); 
							_errHandler.sync(this);
							_la = _input.LA(1);
						} while ( _la==NEWLINE );
						setState(62);
						statement();
						}
						} 
					}
					setState(67);
					_errHandler.sync(this);
					_alt = getInterpreter().adaptivePredict(_input,2,_ctx);
				}
				}
			}

			setState(73);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==NEWLINE) {
				{
				{
				setState(70);
				match(NEWLINE);
				}
				}
				setState(75);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(76);
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
			setState(92);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case DECLARE:
				enterOuterAlt(_localctx, 1);
				{
				setState(78);
				declareStatement();
				}
				break;
			case CONSTANT:
				enterOuterAlt(_localctx, 2);
				{
				setState(79);
				constantStatement();
				}
				break;
			case IDENTIFIER:
				enterOuterAlt(_localctx, 3);
				{
				setState(80);
				assignmentStatement();
				}
				break;
			case INPUT:
				enterOuterAlt(_localctx, 4);
				{
				setState(81);
				inputStatement();
				}
				break;
			case OUTPUT:
			case PRINT:
				enterOuterAlt(_localctx, 5);
				{
				setState(82);
				outputStatement();
				}
				break;
			case IF:
				enterOuterAlt(_localctx, 6);
				{
				setState(83);
				ifStatement();
				}
				break;
			case CASE:
				enterOuterAlt(_localctx, 7);
				{
				setState(84);
				caseStatement();
				}
				break;
			case FOR:
				enterOuterAlt(_localctx, 8);
				{
				setState(85);
				forStatement();
				}
				break;
			case WHILE:
				enterOuterAlt(_localctx, 9);
				{
				setState(86);
				whileStatement();
				}
				break;
			case REPEAT:
				enterOuterAlt(_localctx, 10);
				{
				setState(87);
				repeatStatement();
				}
				break;
			case PROCEDURE:
				enterOuterAlt(_localctx, 11);
				{
				setState(88);
				procedureDeclaration();
				}
				break;
			case FUNCTION:
				enterOuterAlt(_localctx, 12);
				{
				setState(89);
				functionDeclaration();
				}
				break;
			case CALL:
				enterOuterAlt(_localctx, 13);
				{
				setState(90);
				callStatement();
				}
				break;
			case RETURN:
				enterOuterAlt(_localctx, 14);
				{
				setState(91);
				returnStatement();
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
			setState(126);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,6,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(94);
				match(DECLARE);
				setState(95);
				match(IDENTIFIER);
				setState(96);
				match(COLON);
				setState(97);
				match(ARRAY);
				setState(98);
				match(LBRACKET);
				setState(99);
				expr(0);
				setState(100);
				match(COLON);
				setState(101);
				expr(0);
				setState(102);
				match(RBRACKET);
				setState(103);
				match(OF);
				setState(104);
				dataType();
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(106);
				match(DECLARE);
				setState(107);
				match(IDENTIFIER);
				setState(108);
				match(COLON);
				setState(109);
				match(ARRAY);
				setState(110);
				match(LBRACKET);
				setState(111);
				expr(0);
				setState(112);
				match(COLON);
				setState(113);
				expr(0);
				setState(114);
				match(COMMA);
				setState(115);
				expr(0);
				setState(116);
				match(COLON);
				setState(117);
				expr(0);
				setState(118);
				match(RBRACKET);
				setState(119);
				match(OF);
				setState(120);
				dataType();
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(122);
				match(DECLARE);
				setState(123);
				match(IDENTIFIER);
				setState(124);
				match(COLON);
				setState(125);
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
		public TerminalNode EQUALS() { return getToken(PseudocodeParser.EQUALS, 0); }
		public ExprContext expr() {
			return getRuleContext(ExprContext.class,0);
		}
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
		enterRule(_localctx, 6, RULE_constantStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(128);
			match(CONSTANT);
			setState(129);
			match(IDENTIFIER);
			setState(130);
			match(EQUALS);
			setState(131);
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
		enterRule(_localctx, 8, RULE_dataType);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(133);
			_la = _input.LA(1);
			if ( !((((_la) & ~0x3f) == 0 && ((1L << _la) & 17042430230528L) != 0)) ) {
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
		enterRule(_localctx, 10, RULE_assignmentStatement);
		try {
			setState(173);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,7,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(135);
				match(IDENTIFIER);
				setState(136);
				match(EQUALS);
				setState(137);
				expr(0);
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(138);
				match(IDENTIFIER);
				setState(139);
				match(LBRACKET);
				setState(140);
				expr(0);
				setState(141);
				match(RBRACKET);
				setState(142);
				match(EQUALS);
				setState(143);
				expr(0);
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(145);
				match(IDENTIFIER);
				setState(146);
				match(LBRACKET);
				setState(147);
				expr(0);
				setState(148);
				match(COMMA);
				setState(149);
				expr(0);
				setState(150);
				match(RBRACKET);
				setState(151);
				match(EQUALS);
				setState(152);
				expr(0);
				}
				break;
			case 4:
				enterOuterAlt(_localctx, 4);
				{
				setState(154);
				match(IDENTIFIER);
				setState(155);
				match(LARROW);
				setState(156);
				expr(0);
				}
				break;
			case 5:
				enterOuterAlt(_localctx, 5);
				{
				setState(157);
				match(IDENTIFIER);
				setState(158);
				match(LBRACKET);
				setState(159);
				expr(0);
				setState(160);
				match(RBRACKET);
				setState(161);
				match(LARROW);
				setState(162);
				expr(0);
				}
				break;
			case 6:
				enterOuterAlt(_localctx, 6);
				{
				setState(164);
				match(IDENTIFIER);
				setState(165);
				match(LBRACKET);
				setState(166);
				expr(0);
				setState(167);
				match(COMMA);
				setState(168);
				expr(0);
				setState(169);
				match(RBRACKET);
				setState(170);
				match(LARROW);
				setState(171);
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
		enterRule(_localctx, 12, RULE_inputStatement);
		try {
			setState(183);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,8,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(175);
				match(INPUT);
				setState(176);
				match(IDENTIFIER);
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(177);
				match(INPUT);
				setState(178);
				match(IDENTIFIER);
				setState(179);
				match(LBRACKET);
				setState(180);
				expr(0);
				setState(181);
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
		enterRule(_localctx, 14, RULE_outputStatement);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(185);
			_la = _input.LA(1);
			if ( !(_la==OUTPUT || _la==PRINT) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			setState(186);
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
		enterRule(_localctx, 16, RULE_exprList);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(188);
			expr(0);
			setState(193);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==COMMA) {
				{
				{
				setState(189);
				match(COMMA);
				setState(190);
				expr(0);
				}
				}
				setState(195);
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
		enterRule(_localctx, 18, RULE_ifStatement);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(196);
			match(IF);
			setState(197);
			expr(0);
			setState(198);
			match(THEN);
			setState(200); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(199);
				match(NEWLINE);
				}
				}
				setState(202); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==NEWLINE );
			setState(204);
			block();
			setState(222);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,13,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(206); 
					_errHandler.sync(this);
					_la = _input.LA(1);
					do {
						{
						{
						setState(205);
						match(NEWLINE);
						}
						}
						setState(208); 
						_errHandler.sync(this);
						_la = _input.LA(1);
					} while ( _la==NEWLINE );
					setState(210);
					match(ELSEIF);
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
					}
					} 
				}
				setState(224);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,13,_ctx);
			}
			setState(237);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,16,_ctx) ) {
			case 1:
				{
				setState(226); 
				_errHandler.sync(this);
				_la = _input.LA(1);
				do {
					{
					{
					setState(225);
					match(NEWLINE);
					}
					}
					setState(228); 
					_errHandler.sync(this);
					_la = _input.LA(1);
				} while ( _la==NEWLINE );
				setState(230);
				match(ELSE);
				setState(232); 
				_errHandler.sync(this);
				_la = _input.LA(1);
				do {
					{
					{
					setState(231);
					match(NEWLINE);
					}
					}
					setState(234); 
					_errHandler.sync(this);
					_la = _input.LA(1);
				} while ( _la==NEWLINE );
				setState(236);
				block();
				}
				break;
			}
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
		enterRule(_localctx, 20, RULE_caseStatement);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(246);
			match(CASE);
			setState(247);
			match(OF);
			setState(248);
			match(IDENTIFIER);
			setState(250); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(249);
				match(NEWLINE);
				}
				}
				setState(252); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==NEWLINE );
			setState(255); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(254);
				caseClause();
				}
				}
				setState(257); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( ((((_la - 34)) & ~0x3f) == 0 && ((1L << (_la - 34)) & 16651649031L) != 0) );
			setState(272);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==OTHERWISE) {
				{
				setState(259);
				match(OTHERWISE);
				setState(260);
				match(COLON);
				setState(262); 
				_errHandler.sync(this);
				_la = _input.LA(1);
				do {
					{
					{
					setState(261);
					match(NEWLINE);
					}
					}
					setState(264); 
					_errHandler.sync(this);
					_la = _input.LA(1);
				} while ( _la==NEWLINE );
				setState(266);
				block();
				setState(268); 
				_errHandler.sync(this);
				_la = _input.LA(1);
				do {
					{
					{
					setState(267);
					match(NEWLINE);
					}
					}
					setState(270); 
					_errHandler.sync(this);
					_la = _input.LA(1);
				} while ( _la==NEWLINE );
				}
			}

			setState(274);
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
		enterRule(_localctx, 22, RULE_caseClause);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(276);
			expr(0);
			setState(277);
			match(COLON);
			setState(279); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(278);
				match(NEWLINE);
				}
				}
				setState(281); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==NEWLINE );
			setState(283);
			block();
			setState(285); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(284);
				match(NEWLINE);
				}
				}
				setState(287); 
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
		public TerminalNode EQUALS() { return getToken(PseudocodeParser.EQUALS, 0); }
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
		enterRule(_localctx, 24, RULE_forStatement);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(289);
			match(FOR);
			setState(290);
			match(IDENTIFIER);
			setState(291);
			match(EQUALS);
			setState(292);
			expr(0);
			setState(293);
			match(TO);
			setState(294);
			expr(0);
			setState(297);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==STEP) {
				{
				setState(295);
				match(STEP);
				setState(296);
				expr(0);
				}
			}

			setState(300); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(299);
				match(NEWLINE);
				}
				}
				setState(302); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==NEWLINE );
			setState(304);
			block();
			setState(306); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(305);
				match(NEWLINE);
				}
				}
				setState(308); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==NEWLINE );
			setState(310);
			match(NEXT);
			setState(311);
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
		enterRule(_localctx, 26, RULE_whileStatement);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(313);
			match(WHILE);
			setState(314);
			expr(0);
			setState(316);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==DO) {
				{
				setState(315);
				match(DO);
				}
			}

			setState(319); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(318);
				match(NEWLINE);
				}
				}
				setState(321); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==NEWLINE );
			setState(323);
			block();
			setState(325); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(324);
				match(NEWLINE);
				}
				}
				setState(327); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==NEWLINE );
			setState(329);
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
		enterRule(_localctx, 28, RULE_repeatStatement);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(331);
			match(REPEAT);
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
			match(UNTIL);
			setState(344);
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
		enterRule(_localctx, 30, RULE_procedureDeclaration);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(346);
			match(PROCEDURE);
			setState(347);
			match(IDENTIFIER);
			setState(348);
			match(LPAREN);
			setState(350);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==IDENTIFIER) {
				{
				setState(349);
				paramList();
				}
			}

			setState(352);
			match(RPAREN);
			setState(354); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(353);
				match(NEWLINE);
				}
				}
				setState(356); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==NEWLINE );
			setState(358);
			block();
			setState(360); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(359);
				match(NEWLINE);
				}
				}
				setState(362); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==NEWLINE );
			setState(364);
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
		enterRule(_localctx, 32, RULE_functionDeclaration);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(366);
			match(FUNCTION);
			setState(367);
			match(IDENTIFIER);
			setState(368);
			match(LPAREN);
			setState(370);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==IDENTIFIER) {
				{
				setState(369);
				paramList();
				}
			}

			setState(372);
			match(RPAREN);
			setState(373);
			match(RETURNS);
			setState(374);
			dataType();
			setState(376); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(375);
				match(NEWLINE);
				}
				}
				setState(378); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==NEWLINE );
			setState(380);
			block();
			setState(382); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(381);
				match(NEWLINE);
				}
				}
				setState(384); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==NEWLINE );
			setState(386);
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
		enterRule(_localctx, 34, RULE_paramList);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(388);
			param();
			setState(393);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==COMMA) {
				{
				{
				setState(389);
				match(COMMA);
				setState(390);
				param();
				}
				}
				setState(395);
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
		enterRule(_localctx, 36, RULE_param);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(396);
			match(IDENTIFIER);
			setState(397);
			match(COLON);
			setState(398);
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
		enterRule(_localctx, 38, RULE_callStatement);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(400);
			match(CALL);
			setState(401);
			match(IDENTIFIER);
			setState(402);
			match(LPAREN);
			setState(404);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (((((_la - 34)) & ~0x3f) == 0 && ((1L << (_la - 34)) & 16651649031L) != 0)) {
				{
				setState(403);
				argList();
				}
			}

			setState(406);
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
		enterRule(_localctx, 40, RULE_returnStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(408);
			match(RETURN);
			setState(409);
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
		enterRule(_localctx, 42, RULE_argList);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(411);
			expr(0);
			setState(416);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==COMMA) {
				{
				{
				setState(412);
				match(COMMA);
				setState(413);
				expr(0);
				}
				}
				setState(418);
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
		enterRule(_localctx, 44, RULE_block);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(419);
			statement();
			setState(428);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,43,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(421); 
					_errHandler.sync(this);
					_la = _input.LA(1);
					do {
						{
						{
						setState(420);
						match(NEWLINE);
						}
						}
						setState(423); 
						_errHandler.sync(this);
						_la = _input.LA(1);
					} while ( _la==NEWLINE );
					setState(425);
					statement();
					}
					} 
				}
				setState(430);
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
		int _startState = 46;
		enterRecursionRule(_localctx, 46, RULE_expr, _p);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(437);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case NOT:
				{
				_localctx = new NotExprContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;

				setState(432);
				match(NOT);
				setState(433);
				expr(10);
				}
				break;
			case MINUS:
				{
				_localctx = new UnaryMinusExprContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(434);
				match(MINUS);
				setState(435);
				expr(9);
				}
				break;
			case TRUE:
			case FALSE:
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
				setState(436);
				atom();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			_ctx.stop = _input.LT(-1);
			setState(462);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,46,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					if ( _parseListeners!=null ) triggerExitRuleEvent();
					_prevctx = _localctx;
					{
					setState(460);
					_errHandler.sync(this);
					switch ( getInterpreter().adaptivePredict(_input,45,_ctx) ) {
					case 1:
						{
						_localctx = new PowerExprContext(new ExprContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_expr);
						setState(439);
						if (!(precpred(_ctx, 8))) throw new FailedPredicateException(this, "precpred(_ctx, 8)");
						setState(440);
						match(CARET);
						setState(441);
						expr(8);
						}
						break;
					case 2:
						{
						_localctx = new MulDivExprContext(new ExprContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_expr);
						setState(442);
						if (!(precpred(_ctx, 7))) throw new FailedPredicateException(this, "precpred(_ctx, 7)");
						setState(443);
						((MulDivExprContext)_localctx).op = _input.LT(1);
						_la = _input.LA(1);
						if ( !((((_la) & ~0x3f) == 0 && ((1L << _la) & 27022010081083392L) != 0)) ) {
							((MulDivExprContext)_localctx).op = (Token)_errHandler.recoverInline(this);
						}
						else {
							if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
							_errHandler.reportMatch(this);
							consume();
						}
						setState(444);
						expr(8);
						}
						break;
					case 3:
						{
						_localctx = new AddSubExprContext(new ExprContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_expr);
						setState(445);
						if (!(precpred(_ctx, 6))) throw new FailedPredicateException(this, "precpred(_ctx, 6)");
						setState(446);
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
						setState(447);
						expr(7);
						}
						break;
					case 4:
						{
						_localctx = new ConcatExprContext(new ExprContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_expr);
						setState(448);
						if (!(precpred(_ctx, 5))) throw new FailedPredicateException(this, "precpred(_ctx, 5)");
						setState(449);
						match(AMPERSAND);
						setState(450);
						expr(6);
						}
						break;
					case 5:
						{
						_localctx = new ComparisonExprContext(new ExprContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_expr);
						setState(451);
						if (!(precpred(_ctx, 4))) throw new FailedPredicateException(this, "precpred(_ctx, 4)");
						setState(452);
						((ComparisonExprContext)_localctx).op = _input.LT(1);
						_la = _input.LA(1);
						if ( !((((_la) & ~0x3f) == 0 && ((1L << _la) & 2216615441596416L) != 0)) ) {
							((ComparisonExprContext)_localctx).op = (Token)_errHandler.recoverInline(this);
						}
						else {
							if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
							_errHandler.reportMatch(this);
							consume();
						}
						setState(453);
						expr(5);
						}
						break;
					case 6:
						{
						_localctx = new AndExprContext(new ExprContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_expr);
						setState(454);
						if (!(precpred(_ctx, 3))) throw new FailedPredicateException(this, "precpred(_ctx, 3)");
						setState(455);
						match(AND);
						setState(456);
						expr(4);
						}
						break;
					case 7:
						{
						_localctx = new OrExprContext(new ExprContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_expr);
						setState(457);
						if (!(precpred(_ctx, 2))) throw new FailedPredicateException(this, "precpred(_ctx, 2)");
						setState(458);
						match(OR);
						setState(459);
						expr(3);
						}
						break;
					}
					} 
				}
				setState(464);
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

	public final AtomContext atom() throws RecognitionException {
		AtomContext _localctx = new AtomContext(_ctx, getState());
		enterRule(_localctx, 48, RULE_atom);
		int _la;
		try {
			setState(494);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,48,_ctx) ) {
			case 1:
				_localctx = new ParenAtomContext(_localctx);
				enterOuterAlt(_localctx, 1);
				{
				setState(465);
				match(LPAREN);
				setState(466);
				expr(0);
				setState(467);
				match(RPAREN);
				}
				break;
			case 2:
				_localctx = new FunctionCallAtomContext(_localctx);
				enterOuterAlt(_localctx, 2);
				{
				setState(469);
				match(IDENTIFIER);
				setState(470);
				match(LPAREN);
				setState(472);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (((((_la - 34)) & ~0x3f) == 0 && ((1L << (_la - 34)) & 16651649031L) != 0)) {
					{
					setState(471);
					argList();
					}
				}

				setState(474);
				match(RPAREN);
				}
				break;
			case 3:
				_localctx = new ArrayAccess1DAtomContext(_localctx);
				enterOuterAlt(_localctx, 3);
				{
				setState(475);
				match(IDENTIFIER);
				setState(476);
				match(LBRACKET);
				setState(477);
				expr(0);
				setState(478);
				match(RBRACKET);
				}
				break;
			case 4:
				_localctx = new ArrayAccess2DAtomContext(_localctx);
				enterOuterAlt(_localctx, 4);
				{
				setState(480);
				match(IDENTIFIER);
				setState(481);
				match(LBRACKET);
				setState(482);
				expr(0);
				setState(483);
				match(COMMA);
				setState(484);
				expr(0);
				setState(485);
				match(RBRACKET);
				}
				break;
			case 5:
				_localctx = new IdentifierAtomContext(_localctx);
				enterOuterAlt(_localctx, 5);
				{
				setState(487);
				match(IDENTIFIER);
				}
				break;
			case 6:
				_localctx = new IntegerAtomContext(_localctx);
				enterOuterAlt(_localctx, 6);
				{
				setState(488);
				match(INTEGER_LITERAL);
				}
				break;
			case 7:
				_localctx = new RealAtomContext(_localctx);
				enterOuterAlt(_localctx, 7);
				{
				setState(489);
				match(REAL_LITERAL);
				}
				break;
			case 8:
				_localctx = new StringAtomContext(_localctx);
				enterOuterAlt(_localctx, 8);
				{
				setState(490);
				match(STRING_LITERAL);
				}
				break;
			case 9:
				_localctx = new CharAtomContext(_localctx);
				enterOuterAlt(_localctx, 9);
				{
				setState(491);
				match(CHAR_LITERAL);
				}
				break;
			case 10:
				_localctx = new TrueAtomContext(_localctx);
				enterOuterAlt(_localctx, 10);
				{
				setState(492);
				match(TRUE);
				}
				break;
			case 11:
				_localctx = new FalseAtomContext(_localctx);
				enterOuterAlt(_localctx, 11);
				{
				setState(493);
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
		case 23:
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
		"\u0004\u0001F\u01f1\u0002\u0000\u0007\u0000\u0002\u0001\u0007\u0001\u0002"+
		"\u0002\u0007\u0002\u0002\u0003\u0007\u0003\u0002\u0004\u0007\u0004\u0002"+
		"\u0005\u0007\u0005\u0002\u0006\u0007\u0006\u0002\u0007\u0007\u0007\u0002"+
		"\b\u0007\b\u0002\t\u0007\t\u0002\n\u0007\n\u0002\u000b\u0007\u000b\u0002"+
		"\f\u0007\f\u0002\r\u0007\r\u0002\u000e\u0007\u000e\u0002\u000f\u0007\u000f"+
		"\u0002\u0010\u0007\u0010\u0002\u0011\u0007\u0011\u0002\u0012\u0007\u0012"+
		"\u0002\u0013\u0007\u0013\u0002\u0014\u0007\u0014\u0002\u0015\u0007\u0015"+
		"\u0002\u0016\u0007\u0016\u0002\u0017\u0007\u0017\u0002\u0018\u0007\u0018"+
		"\u0001\u0000\u0005\u00004\b\u0000\n\u0000\f\u00007\t\u0000\u0001\u0000"+
		"\u0001\u0000\u0004\u0000;\b\u0000\u000b\u0000\f\u0000<\u0001\u0000\u0005"+
		"\u0000@\b\u0000\n\u0000\f\u0000C\t\u0000\u0003\u0000E\b\u0000\u0001\u0000"+
		"\u0005\u0000H\b\u0000\n\u0000\f\u0000K\t\u0000\u0001\u0000\u0001\u0000"+
		"\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001"+
		"\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001"+
		"\u0001\u0001\u0001\u0001\u0003\u0001]\b\u0001\u0001\u0002\u0001\u0002"+
		"\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002"+
		"\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002"+
		"\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002"+
		"\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002"+
		"\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002"+
		"\u0003\u0002\u007f\b\u0002\u0001\u0003\u0001\u0003\u0001\u0003\u0001\u0003"+
		"\u0001\u0003\u0001\u0004\u0001\u0004\u0001\u0005\u0001\u0005\u0001\u0005"+
		"\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005"+
		"\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005"+
		"\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005"+
		"\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005"+
		"\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005"+
		"\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0003\u0005"+
		"\u00ae\b\u0005\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006"+
		"\u0001\u0006\u0001\u0006\u0001\u0006\u0003\u0006\u00b8\b\u0006\u0001\u0007"+
		"\u0001\u0007\u0001\u0007\u0001\b\u0001\b\u0001\b\u0005\b\u00c0\b\b\n\b"+
		"\f\b\u00c3\t\b\u0001\t\u0001\t\u0001\t\u0001\t\u0004\t\u00c9\b\t\u000b"+
		"\t\f\t\u00ca\u0001\t\u0001\t\u0004\t\u00cf\b\t\u000b\t\f\t\u00d0\u0001"+
		"\t\u0001\t\u0001\t\u0001\t\u0004\t\u00d7\b\t\u000b\t\f\t\u00d8\u0001\t"+
		"\u0001\t\u0005\t\u00dd\b\t\n\t\f\t\u00e0\t\t\u0001\t\u0004\t\u00e3\b\t"+
		"\u000b\t\f\t\u00e4\u0001\t\u0001\t\u0004\t\u00e9\b\t\u000b\t\f\t\u00ea"+
		"\u0001\t\u0003\t\u00ee\b\t\u0001\t\u0004\t\u00f1\b\t\u000b\t\f\t\u00f2"+
		"\u0001\t\u0001\t\u0001\n\u0001\n\u0001\n\u0001\n\u0004\n\u00fb\b\n\u000b"+
		"\n\f\n\u00fc\u0001\n\u0004\n\u0100\b\n\u000b\n\f\n\u0101\u0001\n\u0001"+
		"\n\u0001\n\u0004\n\u0107\b\n\u000b\n\f\n\u0108\u0001\n\u0001\n\u0004\n"+
		"\u010d\b\n\u000b\n\f\n\u010e\u0003\n\u0111\b\n\u0001\n\u0001\n\u0001\u000b"+
		"\u0001\u000b\u0001\u000b\u0004\u000b\u0118\b\u000b\u000b\u000b\f\u000b"+
		"\u0119\u0001\u000b\u0001\u000b\u0004\u000b\u011e\b\u000b\u000b\u000b\f"+
		"\u000b\u011f\u0001\f\u0001\f\u0001\f\u0001\f\u0001\f\u0001\f\u0001\f\u0001"+
		"\f\u0003\f\u012a\b\f\u0001\f\u0004\f\u012d\b\f\u000b\f\f\f\u012e\u0001"+
		"\f\u0001\f\u0004\f\u0133\b\f\u000b\f\f\f\u0134\u0001\f\u0001\f\u0001\f"+
		"\u0001\r\u0001\r\u0001\r\u0003\r\u013d\b\r\u0001\r\u0004\r\u0140\b\r\u000b"+
		"\r\f\r\u0141\u0001\r\u0001\r\u0004\r\u0146\b\r\u000b\r\f\r\u0147\u0001"+
		"\r\u0001\r\u0001\u000e\u0001\u000e\u0004\u000e\u014e\b\u000e\u000b\u000e"+
		"\f\u000e\u014f\u0001\u000e\u0001\u000e\u0004\u000e\u0154\b\u000e\u000b"+
		"\u000e\f\u000e\u0155\u0001\u000e\u0001\u000e\u0001\u000e\u0001\u000f\u0001"+
		"\u000f\u0001\u000f\u0001\u000f\u0003\u000f\u015f\b\u000f\u0001\u000f\u0001"+
		"\u000f\u0004\u000f\u0163\b\u000f\u000b\u000f\f\u000f\u0164\u0001\u000f"+
		"\u0001\u000f\u0004\u000f\u0169\b\u000f\u000b\u000f\f\u000f\u016a\u0001"+
		"\u000f\u0001\u000f\u0001\u0010\u0001\u0010\u0001\u0010\u0001\u0010\u0003"+
		"\u0010\u0173\b\u0010\u0001\u0010\u0001\u0010\u0001\u0010\u0001\u0010\u0004"+
		"\u0010\u0179\b\u0010\u000b\u0010\f\u0010\u017a\u0001\u0010\u0001\u0010"+
		"\u0004\u0010\u017f\b\u0010\u000b\u0010\f\u0010\u0180\u0001\u0010\u0001"+
		"\u0010\u0001\u0011\u0001\u0011\u0001\u0011\u0005\u0011\u0188\b\u0011\n"+
		"\u0011\f\u0011\u018b\t\u0011\u0001\u0012\u0001\u0012\u0001\u0012\u0001"+
		"\u0012\u0001\u0013\u0001\u0013\u0001\u0013\u0001\u0013\u0003\u0013\u0195"+
		"\b\u0013\u0001\u0013\u0001\u0013\u0001\u0014\u0001\u0014\u0001\u0014\u0001"+
		"\u0015\u0001\u0015\u0001\u0015\u0005\u0015\u019f\b\u0015\n\u0015\f\u0015"+
		"\u01a2\t\u0015\u0001\u0016\u0001\u0016\u0004\u0016\u01a6\b\u0016\u000b"+
		"\u0016\f\u0016\u01a7\u0001\u0016\u0005\u0016\u01ab\b\u0016\n\u0016\f\u0016"+
		"\u01ae\t\u0016\u0001\u0017\u0001\u0017\u0001\u0017\u0001\u0017\u0001\u0017"+
		"\u0001\u0017\u0003\u0017\u01b6\b\u0017\u0001\u0017\u0001\u0017\u0001\u0017"+
		"\u0001\u0017\u0001\u0017\u0001\u0017\u0001\u0017\u0001\u0017\u0001\u0017"+
		"\u0001\u0017\u0001\u0017\u0001\u0017\u0001\u0017\u0001\u0017\u0001\u0017"+
		"\u0001\u0017\u0001\u0017\u0001\u0017\u0001\u0017\u0001\u0017\u0001\u0017"+
		"\u0005\u0017\u01cd\b\u0017\n\u0017\f\u0017\u01d0\t\u0017\u0001\u0018\u0001"+
		"\u0018\u0001\u0018\u0001\u0018\u0001\u0018\u0001\u0018\u0001\u0018\u0003"+
		"\u0018\u01d9\b\u0018\u0001\u0018\u0001\u0018\u0001\u0018\u0001\u0018\u0001"+
		"\u0018\u0001\u0018\u0001\u0018\u0001\u0018\u0001\u0018\u0001\u0018\u0001"+
		"\u0018\u0001\u0018\u0001\u0018\u0001\u0018\u0001\u0018\u0001\u0018\u0001"+
		"\u0018\u0001\u0018\u0001\u0018\u0001\u0018\u0003\u0018\u01ef\b\u0018\u0001"+
		"\u0018\u0000\u0001.\u0019\u0000\u0002\u0004\u0006\b\n\f\u000e\u0010\u0012"+
		"\u0014\u0016\u0018\u001a\u001c\u001e \"$&(*,.0\u0000\u0005\u0001\u0000"+
		"\'+\u0001\u0000\u0004\u0005\u0002\u0000%&56\u0001\u000034\u0001\u0000"+
		"-2\u0228\u00005\u0001\u0000\u0000\u0000\u0002\\\u0001\u0000\u0000\u0000"+
		"\u0004~\u0001\u0000\u0000\u0000\u0006\u0080\u0001\u0000\u0000\u0000\b"+
		"\u0085\u0001\u0000\u0000\u0000\n\u00ad\u0001\u0000\u0000\u0000\f\u00b7"+
		"\u0001\u0000\u0000\u0000\u000e\u00b9\u0001\u0000\u0000\u0000\u0010\u00bc"+
		"\u0001\u0000\u0000\u0000\u0012\u00c4\u0001\u0000\u0000\u0000\u0014\u00f6"+
		"\u0001\u0000\u0000\u0000\u0016\u0114\u0001\u0000\u0000\u0000\u0018\u0121"+
		"\u0001\u0000\u0000\u0000\u001a\u0139\u0001\u0000\u0000\u0000\u001c\u014b"+
		"\u0001\u0000\u0000\u0000\u001e\u015a\u0001\u0000\u0000\u0000 \u016e\u0001"+
		"\u0000\u0000\u0000\"\u0184\u0001\u0000\u0000\u0000$\u018c\u0001\u0000"+
		"\u0000\u0000&\u0190\u0001\u0000\u0000\u0000(\u0198\u0001\u0000\u0000\u0000"+
		"*\u019b\u0001\u0000\u0000\u0000,\u01a3\u0001\u0000\u0000\u0000.\u01b5"+
		"\u0001\u0000\u0000\u00000\u01ee\u0001\u0000\u0000\u000024\u0005D\u0000"+
		"\u000032\u0001\u0000\u0000\u000047\u0001\u0000\u0000\u000053\u0001\u0000"+
		"\u0000\u000056\u0001\u0000\u0000\u00006D\u0001\u0000\u0000\u000075\u0001"+
		"\u0000\u0000\u00008A\u0003\u0002\u0001\u00009;\u0005D\u0000\u0000:9\u0001"+
		"\u0000\u0000\u0000;<\u0001\u0000\u0000\u0000<:\u0001\u0000\u0000\u0000"+
		"<=\u0001\u0000\u0000\u0000=>\u0001\u0000\u0000\u0000>@\u0003\u0002\u0001"+
		"\u0000?:\u0001\u0000\u0000\u0000@C\u0001\u0000\u0000\u0000A?\u0001\u0000"+
		"\u0000\u0000AB\u0001\u0000\u0000\u0000BE\u0001\u0000\u0000\u0000CA\u0001"+
		"\u0000\u0000\u0000D8\u0001\u0000\u0000\u0000DE\u0001\u0000\u0000\u0000"+
		"EI\u0001\u0000\u0000\u0000FH\u0005D\u0000\u0000GF\u0001\u0000\u0000\u0000"+
		"HK\u0001\u0000\u0000\u0000IG\u0001\u0000\u0000\u0000IJ\u0001\u0000\u0000"+
		"\u0000JL\u0001\u0000\u0000\u0000KI\u0001\u0000\u0000\u0000LM\u0005\u0000"+
		"\u0000\u0001M\u0001\u0001\u0000\u0000\u0000N]\u0003\u0004\u0002\u0000"+
		"O]\u0003\u0006\u0003\u0000P]\u0003\n\u0005\u0000Q]\u0003\f\u0006\u0000"+
		"R]\u0003\u000e\u0007\u0000S]\u0003\u0012\t\u0000T]\u0003\u0014\n\u0000"+
		"U]\u0003\u0018\f\u0000V]\u0003\u001a\r\u0000W]\u0003\u001c\u000e\u0000"+
		"X]\u0003\u001e\u000f\u0000Y]\u0003 \u0010\u0000Z]\u0003&\u0013\u0000["+
		"]\u0003(\u0014\u0000\\N\u0001\u0000\u0000\u0000\\O\u0001\u0000\u0000\u0000"+
		"\\P\u0001\u0000\u0000\u0000\\Q\u0001\u0000\u0000\u0000\\R\u0001\u0000"+
		"\u0000\u0000\\S\u0001\u0000\u0000\u0000\\T\u0001\u0000\u0000\u0000\\U"+
		"\u0001\u0000\u0000\u0000\\V\u0001\u0000\u0000\u0000\\W\u0001\u0000\u0000"+
		"\u0000\\X\u0001\u0000\u0000\u0000\\Y\u0001\u0000\u0000\u0000\\Z\u0001"+
		"\u0000\u0000\u0000\\[\u0001\u0000\u0000\u0000]\u0003\u0001\u0000\u0000"+
		"\u0000^_\u0005\u0001\u0000\u0000_`\u0005C\u0000\u0000`a\u0005>\u0000\u0000"+
		"ab\u0005\u001f\u0000\u0000bc\u0005;\u0000\u0000cd\u0003.\u0017\u0000d"+
		"e\u0005>\u0000\u0000ef\u0003.\u0017\u0000fg\u0005<\u0000\u0000gh\u0005"+
		"\f\u0000\u0000hi\u0003\b\u0004\u0000i\u007f\u0001\u0000\u0000\u0000jk"+
		"\u0005\u0001\u0000\u0000kl\u0005C\u0000\u0000lm\u0005>\u0000\u0000mn\u0005"+
		"\u001f\u0000\u0000no\u0005;\u0000\u0000op\u0003.\u0017\u0000pq\u0005>"+
		"\u0000\u0000qr\u0003.\u0017\u0000rs\u0005=\u0000\u0000st\u0003.\u0017"+
		"\u0000tu\u0005>\u0000\u0000uv\u0003.\u0017\u0000vw\u0005<\u0000\u0000"+
		"wx\u0005\f\u0000\u0000xy\u0003\b\u0004\u0000y\u007f\u0001\u0000\u0000"+
		"\u0000z{\u0005\u0001\u0000\u0000{|\u0005C\u0000\u0000|}\u0005>\u0000\u0000"+
		"}\u007f\u0003\b\u0004\u0000~^\u0001\u0000\u0000\u0000~j\u0001\u0000\u0000"+
		"\u0000~z\u0001\u0000\u0000\u0000\u007f\u0005\u0001\u0000\u0000\u0000\u0080"+
		"\u0081\u0005\u0002\u0000\u0000\u0081\u0082\u0005C\u0000\u0000\u0082\u0083"+
		"\u0005-\u0000\u0000\u0083\u0084\u0003.\u0017\u0000\u0084\u0007\u0001\u0000"+
		"\u0000\u0000\u0085\u0086\u0007\u0000\u0000\u0000\u0086\t\u0001\u0000\u0000"+
		"\u0000\u0087\u0088\u0005C\u0000\u0000\u0088\u0089\u0005-\u0000\u0000\u0089"+
		"\u00ae\u0003.\u0017\u0000\u008a\u008b\u0005C\u0000\u0000\u008b\u008c\u0005"+
		";\u0000\u0000\u008c\u008d\u0003.\u0017\u0000\u008d\u008e\u0005<\u0000"+
		"\u0000\u008e\u008f\u0005-\u0000\u0000\u008f\u0090\u0003.\u0017\u0000\u0090"+
		"\u00ae\u0001\u0000\u0000\u0000\u0091\u0092\u0005C\u0000\u0000\u0092\u0093"+
		"\u0005;\u0000\u0000\u0093\u0094\u0003.\u0017\u0000\u0094\u0095\u0005="+
		"\u0000\u0000\u0095\u0096\u0003.\u0017\u0000\u0096\u0097\u0005<\u0000\u0000"+
		"\u0097\u0098\u0005-\u0000\u0000\u0098\u0099\u0003.\u0017\u0000\u0099\u00ae"+
		"\u0001\u0000\u0000\u0000\u009a\u009b\u0005C\u0000\u0000\u009b\u009c\u0005"+
		",\u0000\u0000\u009c\u00ae\u0003.\u0017\u0000\u009d\u009e\u0005C\u0000"+
		"\u0000\u009e\u009f\u0005;\u0000\u0000\u009f\u00a0\u0003.\u0017\u0000\u00a0"+
		"\u00a1\u0005<\u0000\u0000\u00a1\u00a2\u0005,\u0000\u0000\u00a2\u00a3\u0003"+
		".\u0017\u0000\u00a3\u00ae\u0001\u0000\u0000\u0000\u00a4\u00a5\u0005C\u0000"+
		"\u0000\u00a5\u00a6\u0005;\u0000\u0000\u00a6\u00a7\u0003.\u0017\u0000\u00a7"+
		"\u00a8\u0005=\u0000\u0000\u00a8\u00a9\u0003.\u0017\u0000\u00a9\u00aa\u0005"+
		"<\u0000\u0000\u00aa\u00ab\u0005,\u0000\u0000\u00ab\u00ac\u0003.\u0017"+
		"\u0000\u00ac\u00ae\u0001\u0000\u0000\u0000\u00ad\u0087\u0001\u0000\u0000"+
		"\u0000\u00ad\u008a\u0001\u0000\u0000\u0000\u00ad\u0091\u0001\u0000\u0000"+
		"\u0000\u00ad\u009a\u0001\u0000\u0000\u0000\u00ad\u009d\u0001\u0000\u0000"+
		"\u0000\u00ad\u00a4\u0001\u0000\u0000\u0000\u00ae\u000b\u0001\u0000\u0000"+
		"\u0000\u00af\u00b0\u0005\u0003\u0000\u0000\u00b0\u00b8\u0005C\u0000\u0000"+
		"\u00b1\u00b2\u0005\u0003\u0000\u0000\u00b2\u00b3\u0005C\u0000\u0000\u00b3"+
		"\u00b4\u0005;\u0000\u0000\u00b4\u00b5\u0003.\u0017\u0000\u00b5\u00b6\u0005"+
		"<\u0000\u0000\u00b6\u00b8\u0001\u0000\u0000\u0000\u00b7\u00af\u0001\u0000"+
		"\u0000\u0000\u00b7\u00b1\u0001\u0000\u0000\u0000\u00b8\r\u0001\u0000\u0000"+
		"\u0000\u00b9\u00ba\u0007\u0001\u0000\u0000\u00ba\u00bb\u0003\u0010\b\u0000"+
		"\u00bb\u000f\u0001\u0000\u0000\u0000\u00bc\u00c1\u0003.\u0017\u0000\u00bd"+
		"\u00be\u0005=\u0000\u0000\u00be\u00c0\u0003.\u0017\u0000\u00bf\u00bd\u0001"+
		"\u0000\u0000\u0000\u00c0\u00c3\u0001\u0000\u0000\u0000\u00c1\u00bf\u0001"+
		"\u0000\u0000\u0000\u00c1\u00c2\u0001\u0000\u0000\u0000\u00c2\u0011\u0001"+
		"\u0000\u0000\u0000\u00c3\u00c1\u0001\u0000\u0000\u0000\u00c4\u00c5\u0005"+
		"\u0006\u0000\u0000\u00c5\u00c6\u0003.\u0017\u0000\u00c6\u00c8\u0005\u0007"+
		"\u0000\u0000\u00c7\u00c9\u0005D\u0000\u0000\u00c8\u00c7\u0001\u0000\u0000"+
		"\u0000\u00c9\u00ca\u0001\u0000\u0000\u0000\u00ca\u00c8\u0001\u0000\u0000"+
		"\u0000\u00ca\u00cb\u0001\u0000\u0000\u0000\u00cb\u00cc\u0001\u0000\u0000"+
		"\u0000\u00cc\u00de\u0003,\u0016\u0000\u00cd\u00cf\u0005D\u0000\u0000\u00ce"+
		"\u00cd\u0001\u0000\u0000\u0000\u00cf\u00d0\u0001\u0000\u0000\u0000\u00d0"+
		"\u00ce\u0001\u0000\u0000\u0000\u00d0\u00d1\u0001\u0000\u0000\u0000\u00d1"+
		"\u00d2\u0001\u0000\u0000\u0000\u00d2\u00d3\u0005\t\u0000\u0000\u00d3\u00d4"+
		"\u0003.\u0017\u0000\u00d4\u00d6\u0005\u0007\u0000\u0000\u00d5\u00d7\u0005"+
		"D\u0000\u0000\u00d6\u00d5\u0001\u0000\u0000\u0000\u00d7\u00d8\u0001\u0000"+
		"\u0000\u0000\u00d8\u00d6\u0001\u0000\u0000\u0000\u00d8\u00d9\u0001\u0000"+
		"\u0000\u0000\u00d9\u00da\u0001\u0000\u0000\u0000\u00da\u00db\u0003,\u0016"+
		"\u0000\u00db\u00dd\u0001\u0000\u0000\u0000\u00dc\u00ce\u0001\u0000\u0000"+
		"\u0000\u00dd\u00e0\u0001\u0000\u0000\u0000\u00de\u00dc\u0001\u0000\u0000"+
		"\u0000\u00de\u00df\u0001\u0000\u0000\u0000\u00df\u00ed\u0001\u0000\u0000"+
		"\u0000\u00e0\u00de\u0001\u0000\u0000\u0000\u00e1\u00e3\u0005D\u0000\u0000"+
		"\u00e2\u00e1\u0001\u0000\u0000\u0000\u00e3\u00e4\u0001\u0000\u0000\u0000"+
		"\u00e4\u00e2\u0001\u0000\u0000\u0000\u00e4\u00e5\u0001\u0000\u0000\u0000"+
		"\u00e5\u00e6\u0001\u0000\u0000\u0000\u00e6\u00e8\u0005\b\u0000\u0000\u00e7"+
		"\u00e9\u0005D\u0000\u0000\u00e8\u00e7\u0001\u0000\u0000\u0000\u00e9\u00ea"+
		"\u0001\u0000\u0000\u0000\u00ea\u00e8\u0001\u0000\u0000\u0000\u00ea\u00eb"+
		"\u0001\u0000\u0000\u0000\u00eb\u00ec\u0001\u0000\u0000\u0000\u00ec\u00ee"+
		"\u0003,\u0016\u0000\u00ed\u00e2\u0001\u0000\u0000\u0000\u00ed\u00ee\u0001"+
		"\u0000\u0000\u0000\u00ee\u00f0\u0001\u0000\u0000\u0000\u00ef\u00f1\u0005"+
		"D\u0000\u0000\u00f0\u00ef\u0001\u0000\u0000\u0000\u00f1\u00f2\u0001\u0000"+
		"\u0000\u0000\u00f2\u00f0\u0001\u0000\u0000\u0000\u00f2\u00f3\u0001\u0000"+
		"\u0000\u0000\u00f3\u00f4\u0001\u0000\u0000\u0000\u00f4\u00f5\u0005\n\u0000"+
		"\u0000\u00f5\u0013\u0001\u0000\u0000\u0000\u00f6\u00f7\u0005\u000b\u0000"+
		"\u0000\u00f7\u00f8\u0005\f\u0000\u0000\u00f8\u00fa\u0005C\u0000\u0000"+
		"\u00f9\u00fb\u0005D\u0000\u0000\u00fa\u00f9\u0001\u0000\u0000\u0000\u00fb"+
		"\u00fc\u0001\u0000\u0000\u0000\u00fc\u00fa\u0001\u0000\u0000\u0000\u00fc"+
		"\u00fd\u0001\u0000\u0000\u0000\u00fd\u00ff\u0001\u0000\u0000\u0000\u00fe"+
		"\u0100\u0003\u0016\u000b\u0000\u00ff\u00fe\u0001\u0000\u0000\u0000\u0100"+
		"\u0101\u0001\u0000\u0000\u0000\u0101\u00ff\u0001\u0000\u0000\u0000\u0101"+
		"\u0102\u0001\u0000\u0000\u0000\u0102\u0110\u0001\u0000\u0000\u0000\u0103"+
		"\u0104\u0005\r\u0000\u0000\u0104\u0106\u0005>\u0000\u0000\u0105\u0107"+
		"\u0005D\u0000\u0000\u0106\u0105\u0001\u0000\u0000\u0000\u0107\u0108\u0001"+
		"\u0000\u0000\u0000\u0108\u0106\u0001\u0000\u0000\u0000\u0108\u0109\u0001"+
		"\u0000\u0000\u0000\u0109\u010a\u0001\u0000\u0000\u0000\u010a\u010c\u0003"+
		",\u0016\u0000\u010b\u010d\u0005D\u0000\u0000\u010c\u010b\u0001\u0000\u0000"+
		"\u0000\u010d\u010e\u0001\u0000\u0000\u0000\u010e\u010c\u0001\u0000\u0000"+
		"\u0000\u010e\u010f\u0001\u0000\u0000\u0000\u010f\u0111\u0001\u0000\u0000"+
		"\u0000\u0110\u0103\u0001\u0000\u0000\u0000\u0110\u0111\u0001\u0000\u0000"+
		"\u0000\u0111\u0112\u0001\u0000\u0000\u0000\u0112\u0113\u0005\u000e\u0000"+
		"\u0000\u0113\u0015\u0001\u0000\u0000\u0000\u0114\u0115\u0003.\u0017\u0000"+
		"\u0115\u0117\u0005>\u0000\u0000\u0116\u0118\u0005D\u0000\u0000\u0117\u0116"+
		"\u0001\u0000\u0000\u0000\u0118\u0119\u0001\u0000\u0000\u0000\u0119\u0117"+
		"\u0001\u0000\u0000\u0000\u0119\u011a\u0001\u0000\u0000\u0000\u011a\u011b"+
		"\u0001\u0000\u0000\u0000\u011b\u011d\u0003,\u0016\u0000\u011c\u011e\u0005"+
		"D\u0000\u0000\u011d\u011c\u0001\u0000\u0000\u0000\u011e\u011f\u0001\u0000"+
		"\u0000\u0000\u011f\u011d\u0001\u0000\u0000\u0000\u011f\u0120\u0001\u0000"+
		"\u0000\u0000\u0120\u0017\u0001\u0000\u0000\u0000\u0121\u0122\u0005\u000f"+
		"\u0000\u0000\u0122\u0123\u0005C\u0000\u0000\u0123\u0124\u0005-\u0000\u0000"+
		"\u0124\u0125\u0003.\u0017\u0000\u0125\u0126\u0005\u0010\u0000\u0000\u0126"+
		"\u0129\u0003.\u0017\u0000\u0127\u0128\u0005\u0011\u0000\u0000\u0128\u012a"+
		"\u0003.\u0017\u0000\u0129\u0127\u0001\u0000\u0000\u0000\u0129\u012a\u0001"+
		"\u0000\u0000\u0000\u012a\u012c\u0001\u0000\u0000\u0000\u012b\u012d\u0005"+
		"D\u0000\u0000\u012c\u012b\u0001\u0000\u0000\u0000\u012d\u012e\u0001\u0000"+
		"\u0000\u0000\u012e\u012c\u0001\u0000\u0000\u0000\u012e\u012f\u0001\u0000"+
		"\u0000\u0000\u012f\u0130\u0001\u0000\u0000\u0000\u0130\u0132\u0003,\u0016"+
		"\u0000\u0131\u0133\u0005D\u0000\u0000\u0132\u0131\u0001\u0000\u0000\u0000"+
		"\u0133\u0134\u0001\u0000\u0000\u0000\u0134\u0132\u0001\u0000\u0000\u0000"+
		"\u0134\u0135\u0001\u0000\u0000\u0000\u0135\u0136\u0001\u0000\u0000\u0000"+
		"\u0136\u0137\u0005\u0012\u0000\u0000\u0137\u0138\u0005C\u0000\u0000\u0138"+
		"\u0019\u0001\u0000\u0000\u0000\u0139\u013a\u0005\u0013\u0000\u0000\u013a"+
		"\u013c\u0003.\u0017\u0000\u013b\u013d\u0005\u0014\u0000\u0000\u013c\u013b"+
		"\u0001\u0000\u0000\u0000\u013c\u013d\u0001\u0000\u0000\u0000\u013d\u013f"+
		"\u0001\u0000\u0000\u0000\u013e\u0140\u0005D\u0000\u0000\u013f\u013e\u0001"+
		"\u0000\u0000\u0000\u0140\u0141\u0001\u0000\u0000\u0000\u0141\u013f\u0001"+
		"\u0000\u0000\u0000\u0141\u0142\u0001\u0000\u0000\u0000\u0142\u0143\u0001"+
		"\u0000\u0000\u0000\u0143\u0145\u0003,\u0016\u0000\u0144\u0146\u0005D\u0000"+
		"\u0000\u0145\u0144\u0001\u0000\u0000\u0000\u0146\u0147\u0001\u0000\u0000"+
		"\u0000\u0147\u0145\u0001\u0000\u0000\u0000\u0147\u0148\u0001\u0000\u0000"+
		"\u0000\u0148\u0149\u0001\u0000\u0000\u0000\u0149\u014a\u0005\u0015\u0000"+
		"\u0000\u014a\u001b\u0001\u0000\u0000\u0000\u014b\u014d\u0005\u0016\u0000"+
		"\u0000\u014c\u014e\u0005D\u0000\u0000\u014d\u014c\u0001\u0000\u0000\u0000"+
		"\u014e\u014f\u0001\u0000\u0000\u0000\u014f\u014d\u0001\u0000\u0000\u0000"+
		"\u014f\u0150\u0001\u0000\u0000\u0000\u0150\u0151\u0001\u0000\u0000\u0000"+
		"\u0151\u0153\u0003,\u0016\u0000\u0152\u0154\u0005D\u0000\u0000\u0153\u0152"+
		"\u0001\u0000\u0000\u0000\u0154\u0155\u0001\u0000\u0000\u0000\u0155\u0153"+
		"\u0001\u0000\u0000\u0000\u0155\u0156\u0001\u0000\u0000\u0000\u0156\u0157"+
		"\u0001\u0000\u0000\u0000\u0157\u0158\u0005\u0017\u0000\u0000\u0158\u0159"+
		"\u0003.\u0017\u0000\u0159\u001d\u0001\u0000\u0000\u0000\u015a\u015b\u0005"+
		"\u0018\u0000\u0000\u015b\u015c\u0005C\u0000\u0000\u015c\u015e\u00059\u0000"+
		"\u0000\u015d\u015f\u0003\"\u0011\u0000\u015e\u015d\u0001\u0000\u0000\u0000"+
		"\u015e\u015f\u0001\u0000\u0000\u0000\u015f\u0160\u0001\u0000\u0000\u0000"+
		"\u0160\u0162\u0005:\u0000\u0000\u0161\u0163\u0005D\u0000\u0000\u0162\u0161"+
		"\u0001\u0000\u0000\u0000\u0163\u0164\u0001\u0000\u0000\u0000\u0164\u0162"+
		"\u0001\u0000\u0000\u0000\u0164\u0165\u0001\u0000\u0000\u0000\u0165\u0166"+
		"\u0001\u0000\u0000\u0000\u0166\u0168\u0003,\u0016\u0000\u0167\u0169\u0005"+
		"D\u0000\u0000\u0168\u0167\u0001\u0000\u0000\u0000\u0169\u016a\u0001\u0000"+
		"\u0000\u0000\u016a\u0168\u0001\u0000\u0000\u0000\u016a\u016b\u0001\u0000"+
		"\u0000\u0000\u016b\u016c\u0001\u0000\u0000\u0000\u016c\u016d\u0005\u0019"+
		"\u0000\u0000\u016d\u001f\u0001\u0000\u0000\u0000\u016e\u016f\u0005\u001a"+
		"\u0000\u0000\u016f\u0170\u0005C\u0000\u0000\u0170\u0172\u00059\u0000\u0000"+
		"\u0171\u0173\u0003\"\u0011\u0000\u0172\u0171\u0001\u0000\u0000\u0000\u0172"+
		"\u0173\u0001\u0000\u0000\u0000\u0173\u0174\u0001\u0000\u0000\u0000\u0174"+
		"\u0175\u0005:\u0000\u0000\u0175\u0176\u0005\u001c\u0000\u0000\u0176\u0178"+
		"\u0003\b\u0004\u0000\u0177\u0179\u0005D\u0000\u0000\u0178\u0177\u0001"+
		"\u0000\u0000\u0000\u0179\u017a\u0001\u0000\u0000\u0000\u017a\u0178\u0001"+
		"\u0000\u0000\u0000\u017a\u017b\u0001\u0000\u0000\u0000\u017b\u017c\u0001"+
		"\u0000\u0000\u0000\u017c\u017e\u0003,\u0016\u0000\u017d\u017f\u0005D\u0000"+
		"\u0000\u017e\u017d\u0001\u0000\u0000\u0000\u017f\u0180\u0001\u0000\u0000"+
		"\u0000\u0180\u017e\u0001\u0000\u0000\u0000\u0180\u0181\u0001\u0000\u0000"+
		"\u0000\u0181\u0182\u0001\u0000\u0000\u0000\u0182\u0183\u0005\u001b\u0000"+
		"\u0000\u0183!\u0001\u0000\u0000\u0000\u0184\u0189\u0003$\u0012\u0000\u0185"+
		"\u0186\u0005=\u0000\u0000\u0186\u0188\u0003$\u0012\u0000\u0187\u0185\u0001"+
		"\u0000\u0000\u0000\u0188\u018b\u0001\u0000\u0000\u0000\u0189\u0187\u0001"+
		"\u0000\u0000\u0000\u0189\u018a\u0001\u0000\u0000\u0000\u018a#\u0001\u0000"+
		"\u0000\u0000\u018b\u0189\u0001\u0000\u0000\u0000\u018c\u018d\u0005C\u0000"+
		"\u0000\u018d\u018e\u0005>\u0000\u0000\u018e\u018f\u0003\b\u0004\u0000"+
		"\u018f%\u0001\u0000\u0000\u0000\u0190\u0191\u0005\u001e\u0000\u0000\u0191"+
		"\u0192\u0005C\u0000\u0000\u0192\u0194\u00059\u0000\u0000\u0193\u0195\u0003"+
		"*\u0015\u0000\u0194\u0193\u0001\u0000\u0000\u0000\u0194\u0195\u0001\u0000"+
		"\u0000\u0000\u0195\u0196\u0001\u0000\u0000\u0000\u0196\u0197\u0005:\u0000"+
		"\u0000\u0197\'\u0001\u0000\u0000\u0000\u0198\u0199\u0005\u001d\u0000\u0000"+
		"\u0199\u019a\u0003.\u0017\u0000\u019a)\u0001\u0000\u0000\u0000\u019b\u01a0"+
		"\u0003.\u0017\u0000\u019c\u019d\u0005=\u0000\u0000\u019d\u019f\u0003."+
		"\u0017\u0000\u019e\u019c\u0001\u0000\u0000\u0000\u019f\u01a2\u0001\u0000"+
		"\u0000\u0000\u01a0\u019e\u0001\u0000\u0000\u0000\u01a0\u01a1\u0001\u0000"+
		"\u0000\u0000\u01a1+\u0001\u0000\u0000\u0000\u01a2\u01a0\u0001\u0000\u0000"+
		"\u0000\u01a3\u01ac\u0003\u0002\u0001\u0000\u01a4\u01a6\u0005D\u0000\u0000"+
		"\u01a5\u01a4\u0001\u0000\u0000\u0000\u01a6\u01a7\u0001\u0000\u0000\u0000"+
		"\u01a7\u01a5\u0001\u0000\u0000\u0000\u01a7\u01a8\u0001\u0000\u0000\u0000"+
		"\u01a8\u01a9\u0001\u0000\u0000\u0000\u01a9\u01ab\u0003\u0002\u0001\u0000"+
		"\u01aa\u01a5\u0001\u0000\u0000\u0000\u01ab\u01ae\u0001\u0000\u0000\u0000"+
		"\u01ac\u01aa\u0001\u0000\u0000\u0000\u01ac\u01ad\u0001\u0000\u0000\u0000"+
		"\u01ad-\u0001\u0000\u0000\u0000\u01ae\u01ac\u0001\u0000\u0000\u0000\u01af"+
		"\u01b0\u0006\u0017\uffff\uffff\u0000\u01b0\u01b1\u0005\"\u0000\u0000\u01b1"+
		"\u01b6\u0003.\u0017\n\u01b2\u01b3\u00054\u0000\u0000\u01b3\u01b6\u0003"+
		".\u0017\t\u01b4\u01b6\u00030\u0018\u0000\u01b5\u01af\u0001\u0000\u0000"+
		"\u0000\u01b5\u01b2\u0001\u0000\u0000\u0000\u01b5\u01b4\u0001\u0000\u0000"+
		"\u0000\u01b6\u01ce\u0001\u0000\u0000\u0000\u01b7\u01b8\n\b\u0000\u0000"+
		"\u01b8\u01b9\u00057\u0000\u0000\u01b9\u01cd\u0003.\u0017\b\u01ba\u01bb"+
		"\n\u0007\u0000\u0000\u01bb\u01bc\u0007\u0002\u0000\u0000\u01bc\u01cd\u0003"+
		".\u0017\b\u01bd\u01be\n\u0006\u0000\u0000\u01be\u01bf\u0007\u0003\u0000"+
		"\u0000\u01bf\u01cd\u0003.\u0017\u0007\u01c0\u01c1\n\u0005\u0000\u0000"+
		"\u01c1\u01c2\u00058\u0000\u0000\u01c2\u01cd\u0003.\u0017\u0006\u01c3\u01c4"+
		"\n\u0004\u0000\u0000\u01c4\u01c5\u0007\u0004\u0000\u0000\u01c5\u01cd\u0003"+
		".\u0017\u0005\u01c6\u01c7\n\u0003\u0000\u0000\u01c7\u01c8\u0005 \u0000"+
		"\u0000\u01c8\u01cd\u0003.\u0017\u0004\u01c9\u01ca\n\u0002\u0000\u0000"+
		"\u01ca\u01cb\u0005!\u0000\u0000\u01cb\u01cd\u0003.\u0017\u0003\u01cc\u01b7"+
		"\u0001\u0000\u0000\u0000\u01cc\u01ba\u0001\u0000\u0000\u0000\u01cc\u01bd"+
		"\u0001\u0000\u0000\u0000\u01cc\u01c0\u0001\u0000\u0000\u0000\u01cc\u01c3"+
		"\u0001\u0000\u0000\u0000\u01cc\u01c6\u0001\u0000\u0000\u0000\u01cc\u01c9"+
		"\u0001\u0000\u0000\u0000\u01cd\u01d0\u0001\u0000\u0000\u0000\u01ce\u01cc"+
		"\u0001\u0000\u0000\u0000\u01ce\u01cf\u0001\u0000\u0000\u0000\u01cf/\u0001"+
		"\u0000\u0000\u0000\u01d0\u01ce\u0001\u0000\u0000\u0000\u01d1\u01d2\u0005"+
		"9\u0000\u0000\u01d2\u01d3\u0003.\u0017\u0000\u01d3\u01d4\u0005:\u0000"+
		"\u0000\u01d4\u01ef\u0001\u0000\u0000\u0000\u01d5\u01d6\u0005C\u0000\u0000"+
		"\u01d6\u01d8\u00059\u0000\u0000\u01d7\u01d9\u0003*\u0015\u0000\u01d8\u01d7"+
		"\u0001\u0000\u0000\u0000\u01d8\u01d9\u0001\u0000\u0000\u0000\u01d9\u01da"+
		"\u0001\u0000\u0000\u0000\u01da\u01ef\u0005:\u0000\u0000\u01db\u01dc\u0005"+
		"C\u0000\u0000\u01dc\u01dd\u0005;\u0000\u0000\u01dd\u01de\u0003.\u0017"+
		"\u0000\u01de\u01df\u0005<\u0000\u0000\u01df\u01ef\u0001\u0000\u0000\u0000"+
		"\u01e0\u01e1\u0005C\u0000\u0000\u01e1\u01e2\u0005;\u0000\u0000\u01e2\u01e3"+
		"\u0003.\u0017\u0000\u01e3\u01e4\u0005=\u0000\u0000\u01e4\u01e5\u0003."+
		"\u0017\u0000\u01e5\u01e6\u0005<\u0000\u0000\u01e6\u01ef\u0001\u0000\u0000"+
		"\u0000\u01e7\u01ef\u0005C\u0000\u0000\u01e8\u01ef\u0005@\u0000\u0000\u01e9"+
		"\u01ef\u0005?\u0000\u0000\u01ea\u01ef\u0005A\u0000\u0000\u01eb\u01ef\u0005"+
		"B\u0000\u0000\u01ec\u01ef\u0005#\u0000\u0000\u01ed\u01ef\u0005$\u0000"+
		"\u0000\u01ee\u01d1\u0001\u0000\u0000\u0000\u01ee\u01d5\u0001\u0000\u0000"+
		"\u0000\u01ee\u01db\u0001\u0000\u0000\u0000\u01ee\u01e0\u0001\u0000\u0000"+
		"\u0000\u01ee\u01e7\u0001\u0000\u0000\u0000\u01ee\u01e8\u0001\u0000\u0000"+
		"\u0000\u01ee\u01e9\u0001\u0000\u0000\u0000\u01ee\u01ea\u0001\u0000\u0000"+
		"\u0000\u01ee\u01eb\u0001\u0000\u0000\u0000\u01ee\u01ec\u0001\u0000\u0000"+
		"\u0000\u01ee\u01ed\u0001\u0000\u0000\u0000\u01ef1\u0001\u0000\u0000\u0000"+
		"15<ADI\\~\u00ad\u00b7\u00c1\u00ca\u00d0\u00d8\u00de\u00e4\u00ea\u00ed"+
		"\u00f2\u00fc\u0101\u0108\u010e\u0110\u0119\u011f\u0129\u012e\u0134\u013c"+
		"\u0141\u0147\u014f\u0155\u015e\u0164\u016a\u0172\u017a\u0180\u0189\u0194"+
		"\u01a0\u01a7\u01ac\u01b5\u01cc\u01ce\u01d8\u01ee";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}