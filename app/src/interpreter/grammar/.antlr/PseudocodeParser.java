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
		READ_MODE=43, WRITE_MODE=44, APPEND_MODE=45, RANDOM=46, SEEK=47, GETRECORD=48, 
		PUTRECORD=49, TYPE=50, ENDTYPE=51, SET=52, DEFINE=53, BYREF=54, BYVAL=55, 
		CLASS=56, ENDCLASS=57, INHERITS=58, PUBLIC=59, PRIVATE=60, NEW=61, SUPER=62, 
		INTEGER_TYPE=63, REAL_TYPE=64, CHAR_TYPE=65, STRING_TYPE=66, BOOLEAN_TYPE=67, 
		DATE_TYPE=68, LARROW=69, EQUALS=70, NOTEQUAL=71, LTE=72, GTE=73, LT=74, 
		GT=75, PLUS=76, MINUS=77, STAR=78, SLASH=79, CARET=80, AMPERSAND=81, LPAREN=82, 
		RPAREN=83, LBRACKET=84, RBRACKET=85, COMMA=86, COLON=87, DOT=88, DATE_LITERAL=89, 
		REAL_LITERAL=90, INTEGER_LITERAL=91, STRING_LITERAL=92, CHAR_LITERAL=93, 
		IDENTIFIER=94, NEWLINE=95, WS=96, LINE_COMMENT=97;
	public static final int
		RULE_program = 0, RULE_statement = 1, RULE_declareStatement = 2, RULE_identifierList = 3, 
		RULE_constantStatement = 4, RULE_dataType = 5, RULE_typeDefinition = 6, 
		RULE_defineStatement = 7, RULE_classDeclaration = 8, RULE_classMember = 9, 
		RULE_designator = 10, RULE_designatorPart = 11, RULE_memberName = 12, 
		RULE_assignmentStatement = 13, RULE_singleAssignment = 14, RULE_inputStatement = 15, 
		RULE_outputStatement = 16, RULE_exprList = 17, RULE_ifStatement = 18, 
		RULE_caseStatement = 19, RULE_caseClause = 20, RULE_caseLabel = 21, RULE_forStatement = 22, 
		RULE_whileStatement = 23, RULE_repeatStatement = 24, RULE_procedureDeclaration = 25, 
		RULE_functionDeclaration = 26, RULE_paramList = 27, RULE_param = 28, RULE_callStatement = 29, 
		RULE_methodCall = 30, RULE_methodCallStatement = 31, RULE_returnStatement = 32, 
		RULE_openFileStatement = 33, RULE_readFileStatement = 34, RULE_writeFileStatement = 35, 
		RULE_closeFileStatement = 36, RULE_seekStatement = 37, RULE_getRecordStatement = 38, 
		RULE_putRecordStatement = 39, RULE_fileMode = 40, RULE_argList = 41, RULE_block = 42, 
		RULE_expr = 43, RULE_atom = 44;
	private static String[] makeRuleNames() {
		return new String[] {
			"program", "statement", "declareStatement", "identifierList", "constantStatement", 
			"dataType", "typeDefinition", "defineStatement", "classDeclaration", 
			"classMember", "designator", "designatorPart", "memberName", "assignmentStatement", 
			"singleAssignment", "inputStatement", "outputStatement", "exprList", 
			"ifStatement", "caseStatement", "caseClause", "caseLabel", "forStatement", 
			"whileStatement", "repeatStatement", "procedureDeclaration", "functionDeclaration", 
			"paramList", "param", "callStatement", "methodCall", "methodCallStatement", 
			"returnStatement", "openFileStatement", "readFileStatement", "writeFileStatement", 
			"closeFileStatement", "seekStatement", "getRecordStatement", "putRecordStatement", 
			"fileMode", "argList", "block", "expr", "atom"
		};
	}
	public static final String[] ruleNames = makeRuleNames();

	private static String[] makeLiteralNames() {
		return new String[] {
			null, null, null, null, null, null, null, null, null, null, null, null, 
			null, null, null, null, null, null, null, null, null, null, null, null, 
			null, null, null, null, null, null, null, null, null, null, null, null, 
			null, null, null, null, null, null, null, null, null, null, null, null, 
			null, null, null, null, null, null, null, null, null, null, null, null, 
			null, null, null, null, null, null, null, null, null, null, "'='", "'<>'", 
			"'<='", "'>='", "'<'", "'>'", "'+'", "'-'", "'*'", "'/'", "'^'", "'&'", 
			"'('", "')'", "'['", "']'", "','", "':'", "'.'"
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
			"RANDOM", "SEEK", "GETRECORD", "PUTRECORD", "TYPE", "ENDTYPE", "SET", 
			"DEFINE", "BYREF", "BYVAL", "CLASS", "ENDCLASS", "INHERITS", "PUBLIC", 
			"PRIVATE", "NEW", "SUPER", "INTEGER_TYPE", "REAL_TYPE", "CHAR_TYPE", 
			"STRING_TYPE", "BOOLEAN_TYPE", "DATE_TYPE", "LARROW", "EQUALS", "NOTEQUAL", 
			"LTE", "GTE", "LT", "GT", "PLUS", "MINUS", "STAR", "SLASH", "CARET", 
			"AMPERSAND", "LPAREN", "RPAREN", "LBRACKET", "RBRACKET", "COMMA", "COLON", 
			"DOT", "DATE_LITERAL", "REAL_LITERAL", "INTEGER_LITERAL", "STRING_LITERAL", 
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
			setState(93);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,0,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(90);
					match(NEWLINE);
					}
					} 
				}
				setState(95);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,0,_ctx);
			}
			setState(109);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if ((((_la) & ~0x3f) == 0 && ((1L << _la) & 4694870122081847422L) != 0) || _la==IDENTIFIER) {
				{
				setState(96);
				statement();
				setState(106);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,2,_ctx);
				while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
					if ( _alt==1 ) {
						{
						{
						setState(100);
						_errHandler.sync(this);
						_la = _input.LA(1);
						while (_la==NEWLINE) {
							{
							{
							setState(97);
							match(NEWLINE);
							}
							}
							setState(102);
							_errHandler.sync(this);
							_la = _input.LA(1);
						}
						setState(103);
						statement();
						}
						} 
					}
					setState(108);
					_errHandler.sync(this);
					_alt = getInterpreter().adaptivePredict(_input,2,_ctx);
				}
				}
			}

			setState(114);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==NEWLINE) {
				{
				{
				setState(111);
				match(NEWLINE);
				}
				}
				setState(116);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(117);
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
		public TypeDefinitionContext typeDefinition() {
			return getRuleContext(TypeDefinitionContext.class,0);
		}
		public DefineStatementContext defineStatement() {
			return getRuleContext(DefineStatementContext.class,0);
		}
		public ClassDeclarationContext classDeclaration() {
			return getRuleContext(ClassDeclarationContext.class,0);
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
		public MethodCallStatementContext methodCallStatement() {
			return getRuleContext(MethodCallStatementContext.class,0);
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
		public SeekStatementContext seekStatement() {
			return getRuleContext(SeekStatementContext.class,0);
		}
		public GetRecordStatementContext getRecordStatement() {
			return getRuleContext(GetRecordStatementContext.class,0);
		}
		public PutRecordStatementContext putRecordStatement() {
			return getRuleContext(PutRecordStatementContext.class,0);
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
			setState(144);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,5,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(119);
				declareStatement();
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(120);
				constantStatement();
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(121);
				typeDefinition();
				}
				break;
			case 4:
				enterOuterAlt(_localctx, 4);
				{
				setState(122);
				defineStatement();
				}
				break;
			case 5:
				enterOuterAlt(_localctx, 5);
				{
				setState(123);
				classDeclaration();
				}
				break;
			case 6:
				enterOuterAlt(_localctx, 6);
				{
				setState(124);
				assignmentStatement();
				}
				break;
			case 7:
				enterOuterAlt(_localctx, 7);
				{
				setState(125);
				inputStatement();
				}
				break;
			case 8:
				enterOuterAlt(_localctx, 8);
				{
				setState(126);
				outputStatement();
				}
				break;
			case 9:
				enterOuterAlt(_localctx, 9);
				{
				setState(127);
				ifStatement();
				}
				break;
			case 10:
				enterOuterAlt(_localctx, 10);
				{
				setState(128);
				caseStatement();
				}
				break;
			case 11:
				enterOuterAlt(_localctx, 11);
				{
				setState(129);
				forStatement();
				}
				break;
			case 12:
				enterOuterAlt(_localctx, 12);
				{
				setState(130);
				whileStatement();
				}
				break;
			case 13:
				enterOuterAlt(_localctx, 13);
				{
				setState(131);
				repeatStatement();
				}
				break;
			case 14:
				enterOuterAlt(_localctx, 14);
				{
				setState(132);
				procedureDeclaration();
				}
				break;
			case 15:
				enterOuterAlt(_localctx, 15);
				{
				setState(133);
				functionDeclaration();
				}
				break;
			case 16:
				enterOuterAlt(_localctx, 16);
				{
				setState(134);
				callStatement();
				}
				break;
			case 17:
				enterOuterAlt(_localctx, 17);
				{
				setState(135);
				methodCallStatement();
				}
				break;
			case 18:
				enterOuterAlt(_localctx, 18);
				{
				setState(136);
				returnStatement();
				}
				break;
			case 19:
				enterOuterAlt(_localctx, 19);
				{
				setState(137);
				openFileStatement();
				}
				break;
			case 20:
				enterOuterAlt(_localctx, 20);
				{
				setState(138);
				readFileStatement();
				}
				break;
			case 21:
				enterOuterAlt(_localctx, 21);
				{
				setState(139);
				writeFileStatement();
				}
				break;
			case 22:
				enterOuterAlt(_localctx, 22);
				{
				setState(140);
				closeFileStatement();
				}
				break;
			case 23:
				enterOuterAlt(_localctx, 23);
				{
				setState(141);
				seekStatement();
				}
				break;
			case 24:
				enterOuterAlt(_localctx, 24);
				{
				setState(142);
				getRecordStatement();
				}
				break;
			case 25:
				enterOuterAlt(_localctx, 25);
				{
				setState(143);
				putRecordStatement();
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
			setState(179);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,6,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(146);
				match(DECLARE);
				setState(147);
				identifierList();
				setState(148);
				match(COLON);
				setState(149);
				match(ARRAY);
				setState(150);
				match(LBRACKET);
				setState(151);
				expr(0);
				setState(152);
				match(COLON);
				setState(153);
				expr(0);
				setState(154);
				match(RBRACKET);
				setState(155);
				match(OF);
				setState(156);
				dataType();
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(158);
				match(DECLARE);
				setState(159);
				match(IDENTIFIER);
				setState(160);
				match(COLON);
				setState(161);
				match(ARRAY);
				setState(162);
				match(LBRACKET);
				setState(163);
				expr(0);
				setState(164);
				match(COLON);
				setState(165);
				expr(0);
				setState(166);
				match(COMMA);
				setState(167);
				expr(0);
				setState(168);
				match(COLON);
				setState(169);
				expr(0);
				setState(170);
				match(RBRACKET);
				setState(171);
				match(OF);
				setState(172);
				dataType();
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(174);
				match(DECLARE);
				setState(175);
				identifierList();
				setState(176);
				match(COLON);
				setState(177);
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
			setState(181);
			match(IDENTIFIER);
			setState(186);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==COMMA) {
				{
				{
				setState(182);
				match(COMMA);
				setState(183);
				match(IDENTIFIER);
				}
				}
				setState(188);
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
			setState(189);
			match(CONSTANT);
			setState(190);
			match(IDENTIFIER);
			setState(191);
			_la = _input.LA(1);
			if ( !(_la==LARROW || _la==EQUALS) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			setState(192);
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
		public TerminalNode DATE_TYPE() { return getToken(PseudocodeParser.DATE_TYPE, 0); }
		public TerminalNode ARRAY() { return getToken(PseudocodeParser.ARRAY, 0); }
		public TerminalNode OF() { return getToken(PseudocodeParser.OF, 0); }
		public DataTypeContext dataType() {
			return getRuleContext(DataTypeContext.class,0);
		}
		public TerminalNode LBRACKET() { return getToken(PseudocodeParser.LBRACKET, 0); }
		public List<ExprContext> expr() {
			return getRuleContexts(ExprContext.class);
		}
		public ExprContext expr(int i) {
			return getRuleContext(ExprContext.class,i);
		}
		public List<TerminalNode> COLON() { return getTokens(PseudocodeParser.COLON); }
		public TerminalNode COLON(int i) {
			return getToken(PseudocodeParser.COLON, i);
		}
		public TerminalNode RBRACKET() { return getToken(PseudocodeParser.RBRACKET, 0); }
		public TerminalNode COMMA() { return getToken(PseudocodeParser.COMMA, 0); }
		public TerminalNode IDENTIFIER() { return getToken(PseudocodeParser.IDENTIFIER, 0); }
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
			setState(219);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case INTEGER_TYPE:
				enterOuterAlt(_localctx, 1);
				{
				setState(194);
				match(INTEGER_TYPE);
				}
				break;
			case REAL_TYPE:
				enterOuterAlt(_localctx, 2);
				{
				setState(195);
				match(REAL_TYPE);
				}
				break;
			case CHAR_TYPE:
				enterOuterAlt(_localctx, 3);
				{
				setState(196);
				match(CHAR_TYPE);
				}
				break;
			case STRING_TYPE:
				enterOuterAlt(_localctx, 4);
				{
				setState(197);
				match(STRING_TYPE);
				}
				break;
			case BOOLEAN_TYPE:
				enterOuterAlt(_localctx, 5);
				{
				setState(198);
				match(BOOLEAN_TYPE);
				}
				break;
			case DATE_TYPE:
				enterOuterAlt(_localctx, 6);
				{
				setState(199);
				match(DATE_TYPE);
				}
				break;
			case ARRAY:
				enterOuterAlt(_localctx, 7);
				{
				setState(200);
				match(ARRAY);
				setState(214);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==LBRACKET) {
					{
					setState(201);
					match(LBRACKET);
					setState(202);
					expr(0);
					setState(203);
					match(COLON);
					setState(204);
					expr(0);
					setState(210);
					_errHandler.sync(this);
					_la = _input.LA(1);
					if (_la==COMMA) {
						{
						setState(205);
						match(COMMA);
						setState(206);
						expr(0);
						setState(207);
						match(COLON);
						setState(208);
						expr(0);
						}
					}

					setState(212);
					match(RBRACKET);
					}
				}

				setState(216);
				match(OF);
				setState(217);
				dataType();
				}
				break;
			case IDENTIFIER:
				enterOuterAlt(_localctx, 8);
				{
				setState(218);
				match(IDENTIFIER);
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
	public static class TypeDefinitionContext extends ParserRuleContext {
		public TypeDefinitionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_typeDefinition; }
	 
		public TypeDefinitionContext() { }
		public void copyFrom(TypeDefinitionContext ctx) {
			super.copyFrom(ctx);
		}
	}
	@SuppressWarnings("CheckReturnValue")
	public static class EnumTypeDefContext extends TypeDefinitionContext {
		public TerminalNode TYPE() { return getToken(PseudocodeParser.TYPE, 0); }
		public TerminalNode IDENTIFIER() { return getToken(PseudocodeParser.IDENTIFIER, 0); }
		public TerminalNode EQUALS() { return getToken(PseudocodeParser.EQUALS, 0); }
		public TerminalNode LPAREN() { return getToken(PseudocodeParser.LPAREN, 0); }
		public IdentifierListContext identifierList() {
			return getRuleContext(IdentifierListContext.class,0);
		}
		public TerminalNode RPAREN() { return getToken(PseudocodeParser.RPAREN, 0); }
		public EnumTypeDefContext(TypeDefinitionContext ctx) { copyFrom(ctx); }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterEnumTypeDef(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitEnumTypeDef(this);
		}
	}
	@SuppressWarnings("CheckReturnValue")
	public static class PointerTypeDefContext extends TypeDefinitionContext {
		public TerminalNode TYPE() { return getToken(PseudocodeParser.TYPE, 0); }
		public TerminalNode IDENTIFIER() { return getToken(PseudocodeParser.IDENTIFIER, 0); }
		public TerminalNode EQUALS() { return getToken(PseudocodeParser.EQUALS, 0); }
		public TerminalNode CARET() { return getToken(PseudocodeParser.CARET, 0); }
		public DataTypeContext dataType() {
			return getRuleContext(DataTypeContext.class,0);
		}
		public PointerTypeDefContext(TypeDefinitionContext ctx) { copyFrom(ctx); }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterPointerTypeDef(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitPointerTypeDef(this);
		}
	}
	@SuppressWarnings("CheckReturnValue")
	public static class SetTypeDefContext extends TypeDefinitionContext {
		public TerminalNode TYPE() { return getToken(PseudocodeParser.TYPE, 0); }
		public TerminalNode IDENTIFIER() { return getToken(PseudocodeParser.IDENTIFIER, 0); }
		public TerminalNode EQUALS() { return getToken(PseudocodeParser.EQUALS, 0); }
		public TerminalNode SET() { return getToken(PseudocodeParser.SET, 0); }
		public TerminalNode OF() { return getToken(PseudocodeParser.OF, 0); }
		public DataTypeContext dataType() {
			return getRuleContext(DataTypeContext.class,0);
		}
		public SetTypeDefContext(TypeDefinitionContext ctx) { copyFrom(ctx); }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterSetTypeDef(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitSetTypeDef(this);
		}
	}
	@SuppressWarnings("CheckReturnValue")
	public static class RecordTypeDefContext extends TypeDefinitionContext {
		public TerminalNode TYPE() { return getToken(PseudocodeParser.TYPE, 0); }
		public TerminalNode IDENTIFIER() { return getToken(PseudocodeParser.IDENTIFIER, 0); }
		public TerminalNode ENDTYPE() { return getToken(PseudocodeParser.ENDTYPE, 0); }
		public List<TerminalNode> NEWLINE() { return getTokens(PseudocodeParser.NEWLINE); }
		public TerminalNode NEWLINE(int i) {
			return getToken(PseudocodeParser.NEWLINE, i);
		}
		public List<DeclareStatementContext> declareStatement() {
			return getRuleContexts(DeclareStatementContext.class);
		}
		public DeclareStatementContext declareStatement(int i) {
			return getRuleContext(DeclareStatementContext.class,i);
		}
		public RecordTypeDefContext(TypeDefinitionContext ctx) { copyFrom(ctx); }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterRecordTypeDef(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitRecordTypeDef(this);
		}
	}

	public final TypeDefinitionContext typeDefinition() throws RecognitionException {
		TypeDefinitionContext _localctx = new TypeDefinitionContext(_ctx, getState());
		enterRule(_localctx, 12, RULE_typeDefinition);
		int _la;
		try {
			setState(258);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,14,_ctx) ) {
			case 1:
				_localctx = new EnumTypeDefContext(_localctx);
				enterOuterAlt(_localctx, 1);
				{
				setState(221);
				match(TYPE);
				setState(222);
				match(IDENTIFIER);
				setState(223);
				match(EQUALS);
				setState(224);
				match(LPAREN);
				setState(225);
				identifierList();
				setState(226);
				match(RPAREN);
				}
				break;
			case 2:
				_localctx = new PointerTypeDefContext(_localctx);
				enterOuterAlt(_localctx, 2);
				{
				setState(228);
				match(TYPE);
				setState(229);
				match(IDENTIFIER);
				setState(230);
				match(EQUALS);
				setState(231);
				match(CARET);
				setState(232);
				dataType();
				}
				break;
			case 3:
				_localctx = new SetTypeDefContext(_localctx);
				enterOuterAlt(_localctx, 3);
				{
				setState(233);
				match(TYPE);
				setState(234);
				match(IDENTIFIER);
				setState(235);
				match(EQUALS);
				setState(236);
				match(SET);
				setState(237);
				match(OF);
				setState(238);
				dataType();
				}
				break;
			case 4:
				_localctx = new RecordTypeDefContext(_localctx);
				enterOuterAlt(_localctx, 4);
				{
				setState(239);
				match(TYPE);
				setState(240);
				match(IDENTIFIER);
				setState(242); 
				_errHandler.sync(this);
				_la = _input.LA(1);
				do {
					{
					{
					setState(241);
					match(NEWLINE);
					}
					}
					setState(244); 
					_errHandler.sync(this);
					_la = _input.LA(1);
				} while ( _la==NEWLINE );
				setState(254);
				_errHandler.sync(this);
				_la = _input.LA(1);
				while (_la==DECLARE) {
					{
					{
					setState(246);
					declareStatement();
					setState(248); 
					_errHandler.sync(this);
					_la = _input.LA(1);
					do {
						{
						{
						setState(247);
						match(NEWLINE);
						}
						}
						setState(250); 
						_errHandler.sync(this);
						_la = _input.LA(1);
					} while ( _la==NEWLINE );
					}
					}
					setState(256);
					_errHandler.sync(this);
					_la = _input.LA(1);
				}
				setState(257);
				match(ENDTYPE);
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
	public static class DefineStatementContext extends ParserRuleContext {
		public TerminalNode DEFINE() { return getToken(PseudocodeParser.DEFINE, 0); }
		public List<TerminalNode> IDENTIFIER() { return getTokens(PseudocodeParser.IDENTIFIER); }
		public TerminalNode IDENTIFIER(int i) {
			return getToken(PseudocodeParser.IDENTIFIER, i);
		}
		public TerminalNode LPAREN() { return getToken(PseudocodeParser.LPAREN, 0); }
		public TerminalNode RPAREN() { return getToken(PseudocodeParser.RPAREN, 0); }
		public TerminalNode COLON() { return getToken(PseudocodeParser.COLON, 0); }
		public ExprListContext exprList() {
			return getRuleContext(ExprListContext.class,0);
		}
		public DefineStatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_defineStatement; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterDefineStatement(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitDefineStatement(this);
		}
	}

	public final DefineStatementContext defineStatement() throws RecognitionException {
		DefineStatementContext _localctx = new DefineStatementContext(_ctx, getState());
		enterRule(_localctx, 14, RULE_defineStatement);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(260);
			match(DEFINE);
			setState(261);
			match(IDENTIFIER);
			setState(262);
			match(LPAREN);
			setState(264);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (((((_la - 34)) & ~0x3f) == 0 && ((1L << (_la - 34)) & 2270174852411297823L) != 0)) {
				{
				setState(263);
				exprList();
				}
			}

			setState(266);
			match(RPAREN);
			setState(267);
			match(COLON);
			setState(268);
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
	public static class ClassDeclarationContext extends ParserRuleContext {
		public TerminalNode CLASS() { return getToken(PseudocodeParser.CLASS, 0); }
		public List<TerminalNode> IDENTIFIER() { return getTokens(PseudocodeParser.IDENTIFIER); }
		public TerminalNode IDENTIFIER(int i) {
			return getToken(PseudocodeParser.IDENTIFIER, i);
		}
		public TerminalNode ENDCLASS() { return getToken(PseudocodeParser.ENDCLASS, 0); }
		public TerminalNode INHERITS() { return getToken(PseudocodeParser.INHERITS, 0); }
		public List<TerminalNode> NEWLINE() { return getTokens(PseudocodeParser.NEWLINE); }
		public TerminalNode NEWLINE(int i) {
			return getToken(PseudocodeParser.NEWLINE, i);
		}
		public List<ClassMemberContext> classMember() {
			return getRuleContexts(ClassMemberContext.class);
		}
		public ClassMemberContext classMember(int i) {
			return getRuleContext(ClassMemberContext.class,i);
		}
		public ClassDeclarationContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_classDeclaration; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterClassDeclaration(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitClassDeclaration(this);
		}
	}

	public final ClassDeclarationContext classDeclaration() throws RecognitionException {
		ClassDeclarationContext _localctx = new ClassDeclarationContext(_ctx, getState());
		enterRule(_localctx, 16, RULE_classDeclaration);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(270);
			match(CLASS);
			setState(271);
			match(IDENTIFIER);
			setState(274);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==INHERITS) {
				{
				setState(272);
				match(INHERITS);
				setState(273);
				match(IDENTIFIER);
				}
			}

			setState(277); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(276);
				match(NEWLINE);
				}
				}
				setState(279); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==NEWLINE );
			setState(289);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while ((((_la) & ~0x3f) == 0 && ((1L << _la) & 1729382256994156546L) != 0) || _la==IDENTIFIER) {
				{
				{
				setState(281);
				classMember();
				setState(283); 
				_errHandler.sync(this);
				_la = _input.LA(1);
				do {
					{
					{
					setState(282);
					match(NEWLINE);
					}
					}
					setState(285); 
					_errHandler.sync(this);
					_la = _input.LA(1);
				} while ( _la==NEWLINE );
				}
				}
				setState(291);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(292);
			match(ENDCLASS);
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
	public static class ClassMemberContext extends ParserRuleContext {
		public ClassMemberContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_classMember; }
	 
		public ClassMemberContext() { }
		public void copyFrom(ClassMemberContext ctx) {
			super.copyFrom(ctx);
		}
	}
	@SuppressWarnings("CheckReturnValue")
	public static class ClassProcMemberContext extends ClassMemberContext {
		public ProcedureDeclarationContext procedureDeclaration() {
			return getRuleContext(ProcedureDeclarationContext.class,0);
		}
		public TerminalNode PUBLIC() { return getToken(PseudocodeParser.PUBLIC, 0); }
		public TerminalNode PRIVATE() { return getToken(PseudocodeParser.PRIVATE, 0); }
		public ClassProcMemberContext(ClassMemberContext ctx) { copyFrom(ctx); }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterClassProcMember(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitClassProcMember(this);
		}
	}
	@SuppressWarnings("CheckReturnValue")
	public static class ClassFuncMemberContext extends ClassMemberContext {
		public FunctionDeclarationContext functionDeclaration() {
			return getRuleContext(FunctionDeclarationContext.class,0);
		}
		public TerminalNode PUBLIC() { return getToken(PseudocodeParser.PUBLIC, 0); }
		public TerminalNode PRIVATE() { return getToken(PseudocodeParser.PRIVATE, 0); }
		public ClassFuncMemberContext(ClassMemberContext ctx) { copyFrom(ctx); }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterClassFuncMember(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitClassFuncMember(this);
		}
	}
	@SuppressWarnings("CheckReturnValue")
	public static class ClassFieldMemberContext extends ClassMemberContext {
		public IdentifierListContext identifierList() {
			return getRuleContext(IdentifierListContext.class,0);
		}
		public TerminalNode COLON() { return getToken(PseudocodeParser.COLON, 0); }
		public DataTypeContext dataType() {
			return getRuleContext(DataTypeContext.class,0);
		}
		public TerminalNode DECLARE() { return getToken(PseudocodeParser.DECLARE, 0); }
		public TerminalNode PUBLIC() { return getToken(PseudocodeParser.PUBLIC, 0); }
		public TerminalNode PRIVATE() { return getToken(PseudocodeParser.PRIVATE, 0); }
		public ClassFieldMemberContext(ClassMemberContext ctx) { copyFrom(ctx); }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterClassFieldMember(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitClassFieldMember(this);
		}
	}

	public final ClassMemberContext classMember() throws RecognitionException {
		ClassMemberContext _localctx = new ClassMemberContext(_ctx, getState());
		enterRule(_localctx, 18, RULE_classMember);
		int _la;
		try {
			setState(312);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,24,_ctx) ) {
			case 1:
				_localctx = new ClassFieldMemberContext(_localctx);
				enterOuterAlt(_localctx, 1);
				{
				setState(295);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==PUBLIC || _la==PRIVATE) {
					{
					setState(294);
					_la = _input.LA(1);
					if ( !(_la==PUBLIC || _la==PRIVATE) ) {
					_errHandler.recoverInline(this);
					}
					else {
						if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
						_errHandler.reportMatch(this);
						consume();
					}
					}
				}

				setState(298);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==DECLARE) {
					{
					setState(297);
					match(DECLARE);
					}
				}

				setState(300);
				identifierList();
				setState(301);
				match(COLON);
				setState(302);
				dataType();
				}
				break;
			case 2:
				_localctx = new ClassProcMemberContext(_localctx);
				enterOuterAlt(_localctx, 2);
				{
				setState(305);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==PUBLIC || _la==PRIVATE) {
					{
					setState(304);
					_la = _input.LA(1);
					if ( !(_la==PUBLIC || _la==PRIVATE) ) {
					_errHandler.recoverInline(this);
					}
					else {
						if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
						_errHandler.reportMatch(this);
						consume();
					}
					}
				}

				setState(307);
				procedureDeclaration();
				}
				break;
			case 3:
				_localctx = new ClassFuncMemberContext(_localctx);
				enterOuterAlt(_localctx, 3);
				{
				setState(309);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==PUBLIC || _la==PRIVATE) {
					{
					setState(308);
					_la = _input.LA(1);
					if ( !(_la==PUBLIC || _la==PRIVATE) ) {
					_errHandler.recoverInline(this);
					}
					else {
						if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
						_errHandler.reportMatch(this);
						consume();
					}
					}
				}

				setState(311);
				functionDeclaration();
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
	public static class DesignatorContext extends ParserRuleContext {
		public TerminalNode IDENTIFIER() { return getToken(PseudocodeParser.IDENTIFIER, 0); }
		public TerminalNode SUPER() { return getToken(PseudocodeParser.SUPER, 0); }
		public List<DesignatorPartContext> designatorPart() {
			return getRuleContexts(DesignatorPartContext.class);
		}
		public DesignatorPartContext designatorPart(int i) {
			return getRuleContext(DesignatorPartContext.class,i);
		}
		public DesignatorContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_designator; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterDesignator(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitDesignator(this);
		}
	}

	public final DesignatorContext designator() throws RecognitionException {
		DesignatorContext _localctx = new DesignatorContext(_ctx, getState());
		enterRule(_localctx, 20, RULE_designator);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(314);
			_la = _input.LA(1);
			if ( !(_la==SUPER || _la==IDENTIFIER) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			setState(318);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,25,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(315);
					designatorPart();
					}
					} 
				}
				setState(320);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,25,_ctx);
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
	public static class DesignatorPartContext extends ParserRuleContext {
		public TerminalNode LBRACKET() { return getToken(PseudocodeParser.LBRACKET, 0); }
		public List<ExprContext> expr() {
			return getRuleContexts(ExprContext.class);
		}
		public ExprContext expr(int i) {
			return getRuleContext(ExprContext.class,i);
		}
		public TerminalNode RBRACKET() { return getToken(PseudocodeParser.RBRACKET, 0); }
		public List<TerminalNode> COMMA() { return getTokens(PseudocodeParser.COMMA); }
		public TerminalNode COMMA(int i) {
			return getToken(PseudocodeParser.COMMA, i);
		}
		public TerminalNode DOT() { return getToken(PseudocodeParser.DOT, 0); }
		public MemberNameContext memberName() {
			return getRuleContext(MemberNameContext.class,0);
		}
		public TerminalNode LPAREN() { return getToken(PseudocodeParser.LPAREN, 0); }
		public TerminalNode RPAREN() { return getToken(PseudocodeParser.RPAREN, 0); }
		public ArgListContext argList() {
			return getRuleContext(ArgListContext.class,0);
		}
		public TerminalNode CARET() { return getToken(PseudocodeParser.CARET, 0); }
		public DesignatorPartContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_designatorPart; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterDesignatorPart(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitDesignatorPart(this);
		}
	}

	public final DesignatorPartContext designatorPart() throws RecognitionException {
		DesignatorPartContext _localctx = new DesignatorPartContext(_ctx, getState());
		enterRule(_localctx, 22, RULE_designatorPart);
		int _la;
		try {
			setState(342);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case LBRACKET:
				enterOuterAlt(_localctx, 1);
				{
				setState(321);
				match(LBRACKET);
				setState(322);
				expr(0);
				setState(327);
				_errHandler.sync(this);
				_la = _input.LA(1);
				while (_la==COMMA) {
					{
					{
					setState(323);
					match(COMMA);
					setState(324);
					expr(0);
					}
					}
					setState(329);
					_errHandler.sync(this);
					_la = _input.LA(1);
				}
				setState(330);
				match(RBRACKET);
				}
				break;
			case DOT:
				enterOuterAlt(_localctx, 2);
				{
				setState(332);
				match(DOT);
				setState(333);
				memberName();
				setState(339);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,28,_ctx) ) {
				case 1:
					{
					setState(334);
					match(LPAREN);
					setState(336);
					_errHandler.sync(this);
					_la = _input.LA(1);
					if (((((_la - 34)) & ~0x3f) == 0 && ((1L << (_la - 34)) & 2270174852411297823L) != 0)) {
						{
						setState(335);
						argList();
						}
					}

					setState(338);
					match(RPAREN);
					}
					break;
				}
				}
				break;
			case CARET:
				enterOuterAlt(_localctx, 3);
				{
				setState(341);
				match(CARET);
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
	public static class MemberNameContext extends ParserRuleContext {
		public TerminalNode IDENTIFIER() { return getToken(PseudocodeParser.IDENTIFIER, 0); }
		public TerminalNode NEW() { return getToken(PseudocodeParser.NEW, 0); }
		public MemberNameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_memberName; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterMemberName(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitMemberName(this);
		}
	}

	public final MemberNameContext memberName() throws RecognitionException {
		MemberNameContext _localctx = new MemberNameContext(_ctx, getState());
		enterRule(_localctx, 24, RULE_memberName);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(344);
			_la = _input.LA(1);
			if ( !(_la==NEW || _la==IDENTIFIER) ) {
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
		public List<SingleAssignmentContext> singleAssignment() {
			return getRuleContexts(SingleAssignmentContext.class);
		}
		public SingleAssignmentContext singleAssignment(int i) {
			return getRuleContext(SingleAssignmentContext.class,i);
		}
		public List<TerminalNode> COMMA() { return getTokens(PseudocodeParser.COMMA); }
		public TerminalNode COMMA(int i) {
			return getToken(PseudocodeParser.COMMA, i);
		}
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
		enterRule(_localctx, 26, RULE_assignmentStatement);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(346);
			singleAssignment();
			setState(351);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==COMMA) {
				{
				{
				setState(347);
				match(COMMA);
				setState(348);
				singleAssignment();
				}
				}
				setState(353);
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
	public static class SingleAssignmentContext extends ParserRuleContext {
		public DesignatorContext designator() {
			return getRuleContext(DesignatorContext.class,0);
		}
		public ExprContext expr() {
			return getRuleContext(ExprContext.class,0);
		}
		public TerminalNode LARROW() { return getToken(PseudocodeParser.LARROW, 0); }
		public TerminalNode EQUALS() { return getToken(PseudocodeParser.EQUALS, 0); }
		public SingleAssignmentContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_singleAssignment; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterSingleAssignment(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitSingleAssignment(this);
		}
	}

	public final SingleAssignmentContext singleAssignment() throws RecognitionException {
		SingleAssignmentContext _localctx = new SingleAssignmentContext(_ctx, getState());
		enterRule(_localctx, 28, RULE_singleAssignment);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(354);
			designator();
			setState(355);
			_la = _input.LA(1);
			if ( !(_la==LARROW || _la==EQUALS) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			setState(356);
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
	public static class InputStatementContext extends ParserRuleContext {
		public TerminalNode INPUT() { return getToken(PseudocodeParser.INPUT, 0); }
		public DesignatorContext designator() {
			return getRuleContext(DesignatorContext.class,0);
		}
		public TerminalNode COMMA() { return getToken(PseudocodeParser.COMMA, 0); }
		public TerminalNode STRING_LITERAL() { return getToken(PseudocodeParser.STRING_LITERAL, 0); }
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
		enterRule(_localctx, 30, RULE_inputStatement);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(358);
			match(INPUT);
			setState(359);
			designator();
			setState(362);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==COMMA) {
				{
				setState(360);
				match(COMMA);
				setState(361);
				match(STRING_LITERAL);
				}
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
		enterRule(_localctx, 32, RULE_outputStatement);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(364);
			_la = _input.LA(1);
			if ( !(_la==OUTPUT || _la==PRINT) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			setState(365);
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
		enterRule(_localctx, 34, RULE_exprList);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(367);
			expr(0);
			setState(372);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==COMMA) {
				{
				{
				setState(368);
				match(COMMA);
				setState(369);
				expr(0);
				}
				}
				setState(374);
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
		enterRule(_localctx, 36, RULE_ifStatement);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(375);
			match(IF);
			setState(376);
			expr(0);
			setState(380);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,33,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(377);
					match(NEWLINE);
					}
					} 
				}
				setState(382);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,33,_ctx);
			}
			setState(384);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==THEN) {
				{
				setState(383);
				match(THEN);
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
			setState(420);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,40,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
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
					match(ELSEIF);
					setState(400);
					expr(0);
					setState(404);
					_errHandler.sync(this);
					_alt = getInterpreter().adaptivePredict(_input,37,_ctx);
					while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
						if ( _alt==1 ) {
							{
							{
							setState(401);
							match(NEWLINE);
							}
							} 
						}
						setState(406);
						_errHandler.sync(this);
						_alt = getInterpreter().adaptivePredict(_input,37,_ctx);
					}
					setState(408);
					_errHandler.sync(this);
					_la = _input.LA(1);
					if (_la==THEN) {
						{
						setState(407);
						match(THEN);
						}
					}

					setState(413);
					_errHandler.sync(this);
					_la = _input.LA(1);
					while (_la==NEWLINE) {
						{
						{
						setState(410);
						match(NEWLINE);
						}
						}
						setState(415);
						_errHandler.sync(this);
						_la = _input.LA(1);
					}
					setState(416);
					block();
					}
					} 
				}
				setState(422);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,40,_ctx);
			}
			setState(437);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,43,_ctx) ) {
			case 1:
				{
				setState(426);
				_errHandler.sync(this);
				_la = _input.LA(1);
				while (_la==NEWLINE) {
					{
					{
					setState(423);
					match(NEWLINE);
					}
					}
					setState(428);
					_errHandler.sync(this);
					_la = _input.LA(1);
				}
				setState(429);
				match(ELSE);
				setState(433);
				_errHandler.sync(this);
				_la = _input.LA(1);
				while (_la==NEWLINE) {
					{
					{
					setState(430);
					match(NEWLINE);
					}
					}
					setState(435);
					_errHandler.sync(this);
					_la = _input.LA(1);
				}
				setState(436);
				block();
				}
				break;
			}
			setState(442);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==NEWLINE) {
				{
				{
				setState(439);
				match(NEWLINE);
				}
				}
				setState(444);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(445);
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
		public DesignatorContext designator() {
			return getRuleContext(DesignatorContext.class,0);
		}
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
		public BlockContext block() {
			return getRuleContext(BlockContext.class,0);
		}
		public TerminalNode COLON() { return getToken(PseudocodeParser.COLON, 0); }
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
		enterRule(_localctx, 38, RULE_caseStatement);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(447);
			match(CASE);
			setState(448);
			match(OF);
			setState(449);
			designator();
			setState(453);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==NEWLINE) {
				{
				{
				setState(450);
				match(NEWLINE);
				}
				}
				setState(455);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(457); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(456);
				caseClause();
				}
				}
				setState(459); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( ((((_la - 34)) & ~0x3f) == 0 && ((1L << (_la - 34)) & 2270174852411297823L) != 0) );
			setState(478);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==OTHERWISE) {
				{
				setState(461);
				match(OTHERWISE);
				setState(463);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==COLON) {
					{
					setState(462);
					match(COLON);
					}
				}

				setState(468);
				_errHandler.sync(this);
				_la = _input.LA(1);
				while (_la==NEWLINE) {
					{
					{
					setState(465);
					match(NEWLINE);
					}
					}
					setState(470);
					_errHandler.sync(this);
					_la = _input.LA(1);
				}
				setState(471);
				block();
				setState(475);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,49,_ctx);
				while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
					if ( _alt==1 ) {
						{
						{
						setState(472);
						match(NEWLINE);
						}
						} 
					}
					setState(477);
					_errHandler.sync(this);
					_alt = getInterpreter().adaptivePredict(_input,49,_ctx);
				}
				}
			}

			setState(483);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==NEWLINE) {
				{
				{
				setState(480);
				match(NEWLINE);
				}
				}
				setState(485);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(486);
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
		public List<CaseLabelContext> caseLabel() {
			return getRuleContexts(CaseLabelContext.class);
		}
		public CaseLabelContext caseLabel(int i) {
			return getRuleContext(CaseLabelContext.class,i);
		}
		public TerminalNode COLON() { return getToken(PseudocodeParser.COLON, 0); }
		public BlockContext block() {
			return getRuleContext(BlockContext.class,0);
		}
		public List<TerminalNode> COMMA() { return getTokens(PseudocodeParser.COMMA); }
		public TerminalNode COMMA(int i) {
			return getToken(PseudocodeParser.COMMA, i);
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
		enterRule(_localctx, 40, RULE_caseClause);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(488);
			caseLabel();
			setState(493);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==COMMA) {
				{
				{
				setState(489);
				match(COMMA);
				setState(490);
				caseLabel();
				}
				}
				setState(495);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(496);
			match(COLON);
			setState(500);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==NEWLINE) {
				{
				{
				setState(497);
				match(NEWLINE);
				}
				}
				setState(502);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(503);
			block();
			setState(507);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,54,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(504);
					match(NEWLINE);
					}
					} 
				}
				setState(509);
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
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class CaseLabelContext extends ParserRuleContext {
		public List<ExprContext> expr() {
			return getRuleContexts(ExprContext.class);
		}
		public ExprContext expr(int i) {
			return getRuleContext(ExprContext.class,i);
		}
		public TerminalNode TO() { return getToken(PseudocodeParser.TO, 0); }
		public CaseLabelContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_caseLabel; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterCaseLabel(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitCaseLabel(this);
		}
	}

	public final CaseLabelContext caseLabel() throws RecognitionException {
		CaseLabelContext _localctx = new CaseLabelContext(_ctx, getState());
		enterRule(_localctx, 42, RULE_caseLabel);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(510);
			expr(0);
			setState(513);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==TO) {
				{
				setState(511);
				match(TO);
				setState(512);
				expr(0);
				}
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
		enterRule(_localctx, 44, RULE_forStatement);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(515);
			match(FOR);
			setState(516);
			match(IDENTIFIER);
			setState(517);
			_la = _input.LA(1);
			if ( !(_la==LARROW || _la==EQUALS) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			setState(518);
			expr(0);
			setState(519);
			match(TO);
			setState(520);
			expr(0);
			setState(523);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==STEP) {
				{
				setState(521);
				match(STEP);
				setState(522);
				expr(0);
				}
			}

			setState(528);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==NEWLINE) {
				{
				{
				setState(525);
				match(NEWLINE);
				}
				}
				setState(530);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(531);
			block();
			setState(535);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==NEWLINE) {
				{
				{
				setState(532);
				match(NEWLINE);
				}
				}
				setState(537);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(538);
			match(NEXT);
			setState(539);
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
		enterRule(_localctx, 46, RULE_whileStatement);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(541);
			match(WHILE);
			setState(542);
			expr(0);
			setState(544);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==DO) {
				{
				setState(543);
				match(DO);
				}
			}

			setState(549);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==NEWLINE) {
				{
				{
				setState(546);
				match(NEWLINE);
				}
				}
				setState(551);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(552);
			block();
			setState(556);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==NEWLINE) {
				{
				{
				setState(553);
				match(NEWLINE);
				}
				}
				setState(558);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(559);
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
		enterRule(_localctx, 48, RULE_repeatStatement);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(561);
			match(REPEAT);
			setState(565);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==NEWLINE) {
				{
				{
				setState(562);
				match(NEWLINE);
				}
				}
				setState(567);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(568);
			block();
			setState(572);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==NEWLINE) {
				{
				{
				setState(569);
				match(NEWLINE);
				}
				}
				setState(574);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(575);
			match(UNTIL);
			setState(576);
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
		public Token name;
		public TerminalNode PROCEDURE() { return getToken(PseudocodeParser.PROCEDURE, 0); }
		public TerminalNode LPAREN() { return getToken(PseudocodeParser.LPAREN, 0); }
		public TerminalNode RPAREN() { return getToken(PseudocodeParser.RPAREN, 0); }
		public BlockContext block() {
			return getRuleContext(BlockContext.class,0);
		}
		public TerminalNode ENDPROCEDURE() { return getToken(PseudocodeParser.ENDPROCEDURE, 0); }
		public TerminalNode IDENTIFIER() { return getToken(PseudocodeParser.IDENTIFIER, 0); }
		public TerminalNode NEW() { return getToken(PseudocodeParser.NEW, 0); }
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
		enterRule(_localctx, 50, RULE_procedureDeclaration);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(578);
			match(PROCEDURE);
			setState(579);
			((ProcedureDeclarationContext)_localctx).name = _input.LT(1);
			_la = _input.LA(1);
			if ( !(_la==NEW || _la==IDENTIFIER) ) {
				((ProcedureDeclarationContext)_localctx).name = (Token)_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			setState(580);
			match(LPAREN);
			setState(582);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (((((_la - 54)) & ~0x3f) == 0 && ((1L << (_la - 54)) & 1099511627779L) != 0)) {
				{
				setState(581);
				paramList();
				}
			}

			setState(584);
			match(RPAREN);
			setState(588);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==NEWLINE) {
				{
				{
				setState(585);
				match(NEWLINE);
				}
				}
				setState(590);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(591);
			block();
			setState(595);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==NEWLINE) {
				{
				{
				setState(592);
				match(NEWLINE);
				}
				}
				setState(597);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(598);
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
		enterRule(_localctx, 52, RULE_functionDeclaration);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(600);
			match(FUNCTION);
			setState(601);
			match(IDENTIFIER);
			setState(602);
			match(LPAREN);
			setState(604);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (((((_la - 54)) & ~0x3f) == 0 && ((1L << (_la - 54)) & 1099511627779L) != 0)) {
				{
				setState(603);
				paramList();
				}
			}

			setState(606);
			match(RPAREN);
			setState(607);
			match(RETURNS);
			setState(608);
			dataType();
			setState(612);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==NEWLINE) {
				{
				{
				setState(609);
				match(NEWLINE);
				}
				}
				setState(614);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(615);
			block();
			setState(619);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==NEWLINE) {
				{
				{
				setState(616);
				match(NEWLINE);
				}
				}
				setState(621);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(622);
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
		enterRule(_localctx, 54, RULE_paramList);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(624);
			param();
			setState(629);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==COMMA) {
				{
				{
				setState(625);
				match(COMMA);
				setState(626);
				param();
				}
				}
				setState(631);
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
		public TerminalNode BYREF() { return getToken(PseudocodeParser.BYREF, 0); }
		public TerminalNode BYVAL() { return getToken(PseudocodeParser.BYVAL, 0); }
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
		enterRule(_localctx, 56, RULE_param);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(633);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==BYREF || _la==BYVAL) {
				{
				setState(632);
				_la = _input.LA(1);
				if ( !(_la==BYREF || _la==BYVAL) ) {
				_errHandler.recoverInline(this);
				}
				else {
					if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
					_errHandler.reportMatch(this);
					consume();
				}
				}
			}

			setState(635);
			match(IDENTIFIER);
			setState(636);
			match(COLON);
			setState(637);
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
		public MethodCallContext methodCall() {
			return getRuleContext(MethodCallContext.class,0);
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
		enterRule(_localctx, 58, RULE_callStatement);
		int _la;
		try {
			setState(648);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,73,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(639);
				match(CALL);
				setState(640);
				match(IDENTIFIER);
				setState(641);
				match(LPAREN);
				setState(643);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (((((_la - 34)) & ~0x3f) == 0 && ((1L << (_la - 34)) & 2270174852411297823L) != 0)) {
					{
					setState(642);
					argList();
					}
				}

				setState(645);
				match(RPAREN);
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(646);
				match(CALL);
				setState(647);
				methodCall();
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
	public static class MethodCallContext extends ParserRuleContext {
		public TerminalNode DOT() { return getToken(PseudocodeParser.DOT, 0); }
		public MemberNameContext memberName() {
			return getRuleContext(MemberNameContext.class,0);
		}
		public TerminalNode LPAREN() { return getToken(PseudocodeParser.LPAREN, 0); }
		public TerminalNode RPAREN() { return getToken(PseudocodeParser.RPAREN, 0); }
		public TerminalNode IDENTIFIER() { return getToken(PseudocodeParser.IDENTIFIER, 0); }
		public TerminalNode SUPER() { return getToken(PseudocodeParser.SUPER, 0); }
		public List<DesignatorPartContext> designatorPart() {
			return getRuleContexts(DesignatorPartContext.class);
		}
		public DesignatorPartContext designatorPart(int i) {
			return getRuleContext(DesignatorPartContext.class,i);
		}
		public ArgListContext argList() {
			return getRuleContext(ArgListContext.class,0);
		}
		public MethodCallContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_methodCall; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterMethodCall(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitMethodCall(this);
		}
	}

	public final MethodCallContext methodCall() throws RecognitionException {
		MethodCallContext _localctx = new MethodCallContext(_ctx, getState());
		enterRule(_localctx, 60, RULE_methodCall);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(650);
			_la = _input.LA(1);
			if ( !(_la==SUPER || _la==IDENTIFIER) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			setState(654);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,74,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(651);
					designatorPart();
					}
					} 
				}
				setState(656);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,74,_ctx);
			}
			setState(657);
			match(DOT);
			setState(658);
			memberName();
			setState(659);
			match(LPAREN);
			setState(661);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (((((_la - 34)) & ~0x3f) == 0 && ((1L << (_la - 34)) & 2270174852411297823L) != 0)) {
				{
				setState(660);
				argList();
				}
			}

			setState(663);
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
	public static class MethodCallStatementContext extends ParserRuleContext {
		public MethodCallContext methodCall() {
			return getRuleContext(MethodCallContext.class,0);
		}
		public MethodCallStatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_methodCallStatement; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterMethodCallStatement(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitMethodCallStatement(this);
		}
	}

	public final MethodCallStatementContext methodCallStatement() throws RecognitionException {
		MethodCallStatementContext _localctx = new MethodCallStatementContext(_ctx, getState());
		enterRule(_localctx, 62, RULE_methodCallStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(665);
			methodCall();
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
		enterRule(_localctx, 64, RULE_returnStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(667);
			match(RETURN);
			setState(668);
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
		enterRule(_localctx, 66, RULE_openFileStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(670);
			match(OPENFILE);
			setState(671);
			expr(0);
			setState(672);
			match(FOR);
			setState(673);
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
		public DesignatorContext designator() {
			return getRuleContext(DesignatorContext.class,0);
		}
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
		enterRule(_localctx, 68, RULE_readFileStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(675);
			match(READFILE);
			setState(676);
			expr(0);
			setState(677);
			match(COMMA);
			setState(678);
			designator();
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
		enterRule(_localctx, 70, RULE_writeFileStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(680);
			match(WRITEFILE);
			setState(681);
			expr(0);
			setState(682);
			match(COMMA);
			setState(683);
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
		enterRule(_localctx, 72, RULE_closeFileStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(685);
			match(CLOSEFILE);
			setState(686);
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
	public static class SeekStatementContext extends ParserRuleContext {
		public TerminalNode SEEK() { return getToken(PseudocodeParser.SEEK, 0); }
		public List<ExprContext> expr() {
			return getRuleContexts(ExprContext.class);
		}
		public ExprContext expr(int i) {
			return getRuleContext(ExprContext.class,i);
		}
		public TerminalNode COMMA() { return getToken(PseudocodeParser.COMMA, 0); }
		public SeekStatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_seekStatement; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterSeekStatement(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitSeekStatement(this);
		}
	}

	public final SeekStatementContext seekStatement() throws RecognitionException {
		SeekStatementContext _localctx = new SeekStatementContext(_ctx, getState());
		enterRule(_localctx, 74, RULE_seekStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(688);
			match(SEEK);
			setState(689);
			expr(0);
			setState(690);
			match(COMMA);
			setState(691);
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
	public static class GetRecordStatementContext extends ParserRuleContext {
		public TerminalNode GETRECORD() { return getToken(PseudocodeParser.GETRECORD, 0); }
		public ExprContext expr() {
			return getRuleContext(ExprContext.class,0);
		}
		public TerminalNode COMMA() { return getToken(PseudocodeParser.COMMA, 0); }
		public DesignatorContext designator() {
			return getRuleContext(DesignatorContext.class,0);
		}
		public GetRecordStatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_getRecordStatement; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterGetRecordStatement(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitGetRecordStatement(this);
		}
	}

	public final GetRecordStatementContext getRecordStatement() throws RecognitionException {
		GetRecordStatementContext _localctx = new GetRecordStatementContext(_ctx, getState());
		enterRule(_localctx, 76, RULE_getRecordStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(693);
			match(GETRECORD);
			setState(694);
			expr(0);
			setState(695);
			match(COMMA);
			setState(696);
			designator();
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
	public static class PutRecordStatementContext extends ParserRuleContext {
		public TerminalNode PUTRECORD() { return getToken(PseudocodeParser.PUTRECORD, 0); }
		public ExprContext expr() {
			return getRuleContext(ExprContext.class,0);
		}
		public TerminalNode COMMA() { return getToken(PseudocodeParser.COMMA, 0); }
		public DesignatorContext designator() {
			return getRuleContext(DesignatorContext.class,0);
		}
		public PutRecordStatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_putRecordStatement; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterPutRecordStatement(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitPutRecordStatement(this);
		}
	}

	public final PutRecordStatementContext putRecordStatement() throws RecognitionException {
		PutRecordStatementContext _localctx = new PutRecordStatementContext(_ctx, getState());
		enterRule(_localctx, 78, RULE_putRecordStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(698);
			match(PUTRECORD);
			setState(699);
			expr(0);
			setState(700);
			match(COMMA);
			setState(701);
			designator();
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
		public TerminalNode RANDOM() { return getToken(PseudocodeParser.RANDOM, 0); }
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
		enterRule(_localctx, 80, RULE_fileMode);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(703);
			_la = _input.LA(1);
			if ( !((((_la) & ~0x3f) == 0 && ((1L << _la) & 131941395333120L) != 0)) ) {
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
		enterRule(_localctx, 82, RULE_argList);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(705);
			expr(0);
			setState(710);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==COMMA) {
				{
				{
				setState(706);
				match(COMMA);
				setState(707);
				expr(0);
				}
				}
				setState(712);
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
		enterRule(_localctx, 84, RULE_block);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(713);
			statement();
			setState(723);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,78,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(717);
					_errHandler.sync(this);
					_la = _input.LA(1);
					while (_la==NEWLINE) {
						{
						{
						setState(714);
						match(NEWLINE);
						}
						}
						setState(719);
						_errHandler.sync(this);
						_la = _input.LA(1);
					}
					setState(720);
					statement();
					}
					} 
				}
				setState(725);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,78,_ctx);
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
		int _startState = 86;
		enterRecursionRule(_localctx, 86, RULE_expr, _p);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(732);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case NOT:
				{
				_localctx = new NotExprContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;

				setState(727);
				match(NOT);
				setState(728);
				expr(10);
				}
				break;
			case MINUS:
				{
				_localctx = new UnaryMinusExprContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(729);
				match(MINUS);
				setState(730);
				expr(9);
				}
				break;
			case TRUE:
			case FALSE:
			case MOD:
			case DIV:
			case RANDOM:
			case NEW:
			case SUPER:
			case CARET:
			case LPAREN:
			case DATE_LITERAL:
			case REAL_LITERAL:
			case INTEGER_LITERAL:
			case STRING_LITERAL:
			case CHAR_LITERAL:
			case IDENTIFIER:
				{
				_localctx = new AtomExprContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(731);
				atom();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			_ctx.stop = _input.LT(-1);
			setState(757);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,81,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					if ( _parseListeners!=null ) triggerExitRuleEvent();
					_prevctx = _localctx;
					{
					setState(755);
					_errHandler.sync(this);
					switch ( getInterpreter().adaptivePredict(_input,80,_ctx) ) {
					case 1:
						{
						_localctx = new PowerExprContext(new ExprContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_expr);
						setState(734);
						if (!(precpred(_ctx, 8))) throw new FailedPredicateException(this, "precpred(_ctx, 8)");
						setState(735);
						match(CARET);
						setState(736);
						expr(8);
						}
						break;
					case 2:
						{
						_localctx = new MulDivExprContext(new ExprContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_expr);
						setState(737);
						if (!(precpred(_ctx, 7))) throw new FailedPredicateException(this, "precpred(_ctx, 7)");
						setState(738);
						((MulDivExprContext)_localctx).op = _input.LT(1);
						_la = _input.LA(1);
						if ( !(((((_la - 37)) & ~0x3f) == 0 && ((1L << (_la - 37)) & 6597069766659L) != 0)) ) {
							((MulDivExprContext)_localctx).op = (Token)_errHandler.recoverInline(this);
						}
						else {
							if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
							_errHandler.reportMatch(this);
							consume();
						}
						setState(739);
						expr(8);
						}
						break;
					case 3:
						{
						_localctx = new AddSubExprContext(new ExprContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_expr);
						setState(740);
						if (!(precpred(_ctx, 6))) throw new FailedPredicateException(this, "precpred(_ctx, 6)");
						setState(741);
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
						setState(742);
						expr(7);
						}
						break;
					case 4:
						{
						_localctx = new ConcatExprContext(new ExprContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_expr);
						setState(743);
						if (!(precpred(_ctx, 5))) throw new FailedPredicateException(this, "precpred(_ctx, 5)");
						setState(744);
						match(AMPERSAND);
						setState(745);
						expr(6);
						}
						break;
					case 5:
						{
						_localctx = new ComparisonExprContext(new ExprContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_expr);
						setState(746);
						if (!(precpred(_ctx, 4))) throw new FailedPredicateException(this, "precpred(_ctx, 4)");
						setState(747);
						((ComparisonExprContext)_localctx).op = _input.LT(1);
						_la = _input.LA(1);
						if ( !(((((_la - 70)) & ~0x3f) == 0 && ((1L << (_la - 70)) & 63L) != 0)) ) {
							((ComparisonExprContext)_localctx).op = (Token)_errHandler.recoverInline(this);
						}
						else {
							if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
							_errHandler.reportMatch(this);
							consume();
						}
						setState(748);
						expr(5);
						}
						break;
					case 6:
						{
						_localctx = new AndExprContext(new ExprContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_expr);
						setState(749);
						if (!(precpred(_ctx, 3))) throw new FailedPredicateException(this, "precpred(_ctx, 3)");
						setState(750);
						match(AND);
						setState(751);
						expr(4);
						}
						break;
					case 7:
						{
						_localctx = new OrExprContext(new ExprContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_expr);
						setState(752);
						if (!(precpred(_ctx, 2))) throw new FailedPredicateException(this, "precpred(_ctx, 2)");
						setState(753);
						match(OR);
						setState(754);
						expr(3);
						}
						break;
					}
					} 
				}
				setState(759);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,81,_ctx);
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
	public static class DateAtomContext extends AtomContext {
		public TerminalNode DATE_LITERAL() { return getToken(PseudocodeParser.DATE_LITERAL, 0); }
		public DateAtomContext(AtomContext ctx) { copyFrom(ctx); }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterDateAtom(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitDateAtom(this);
		}
	}
	@SuppressWarnings("CheckReturnValue")
	public static class AddressOfAtomContext extends AtomContext {
		public TerminalNode CARET() { return getToken(PseudocodeParser.CARET, 0); }
		public DesignatorContext designator() {
			return getRuleContext(DesignatorContext.class,0);
		}
		public AddressOfAtomContext(AtomContext ctx) { copyFrom(ctx); }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterAddressOfAtom(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitAddressOfAtom(this);
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
	public static class DesignatorAtomContext extends AtomContext {
		public DesignatorContext designator() {
			return getRuleContext(DesignatorContext.class,0);
		}
		public DesignatorAtomContext(AtomContext ctx) { copyFrom(ctx); }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterDesignatorAtom(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitDesignatorAtom(this);
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
	public static class RandomFunctionAtomContext extends AtomContext {
		public TerminalNode RANDOM() { return getToken(PseudocodeParser.RANDOM, 0); }
		public TerminalNode LPAREN() { return getToken(PseudocodeParser.LPAREN, 0); }
		public TerminalNode RPAREN() { return getToken(PseudocodeParser.RPAREN, 0); }
		public RandomFunctionAtomContext(AtomContext ctx) { copyFrom(ctx); }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterRandomFunctionAtom(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitRandomFunctionAtom(this);
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
	public static class NewInstanceAtomContext extends AtomContext {
		public TerminalNode NEW() { return getToken(PseudocodeParser.NEW, 0); }
		public TerminalNode IDENTIFIER() { return getToken(PseudocodeParser.IDENTIFIER, 0); }
		public TerminalNode LPAREN() { return getToken(PseudocodeParser.LPAREN, 0); }
		public TerminalNode RPAREN() { return getToken(PseudocodeParser.RPAREN, 0); }
		public ArgListContext argList() {
			return getRuleContext(ArgListContext.class,0);
		}
		public NewInstanceAtomContext(AtomContext ctx) { copyFrom(ctx); }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterNewInstanceAtom(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitNewInstanceAtom(this);
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
		enterRule(_localctx, 88, RULE_atom);
		int _la;
		try {
			setState(804);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,84,_ctx) ) {
			case 1:
				_localctx = new ParenAtomContext(_localctx);
				enterOuterAlt(_localctx, 1);
				{
				setState(760);
				match(LPAREN);
				setState(761);
				expr(0);
				setState(762);
				match(RPAREN);
				}
				break;
			case 2:
				_localctx = new FunctionCallAtomContext(_localctx);
				enterOuterAlt(_localctx, 2);
				{
				setState(764);
				match(IDENTIFIER);
				setState(765);
				match(LPAREN);
				setState(767);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (((((_la - 34)) & ~0x3f) == 0 && ((1L << (_la - 34)) & 2270174852411297823L) != 0)) {
					{
					setState(766);
					argList();
					}
				}

				setState(769);
				match(RPAREN);
				}
				break;
			case 3:
				_localctx = new NewInstanceAtomContext(_localctx);
				enterOuterAlt(_localctx, 3);
				{
				setState(770);
				match(NEW);
				setState(771);
				match(IDENTIFIER);
				setState(772);
				match(LPAREN);
				setState(774);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (((((_la - 34)) & ~0x3f) == 0 && ((1L << (_la - 34)) & 2270174852411297823L) != 0)) {
					{
					setState(773);
					argList();
					}
				}

				setState(776);
				match(RPAREN);
				}
				break;
			case 4:
				_localctx = new AddressOfAtomContext(_localctx);
				enterOuterAlt(_localctx, 4);
				{
				setState(777);
				match(CARET);
				setState(778);
				designator();
				}
				break;
			case 5:
				_localctx = new DivFunctionAtomContext(_localctx);
				enterOuterAlt(_localctx, 5);
				{
				setState(779);
				match(DIV);
				setState(780);
				match(LPAREN);
				setState(781);
				expr(0);
				setState(782);
				match(COMMA);
				setState(783);
				expr(0);
				setState(784);
				match(RPAREN);
				}
				break;
			case 6:
				_localctx = new ModFunctionAtomContext(_localctx);
				enterOuterAlt(_localctx, 6);
				{
				setState(786);
				match(MOD);
				setState(787);
				match(LPAREN);
				setState(788);
				expr(0);
				setState(789);
				match(COMMA);
				setState(790);
				expr(0);
				setState(791);
				match(RPAREN);
				}
				break;
			case 7:
				_localctx = new RandomFunctionAtomContext(_localctx);
				enterOuterAlt(_localctx, 7);
				{
				setState(793);
				match(RANDOM);
				setState(794);
				match(LPAREN);
				setState(795);
				match(RPAREN);
				}
				break;
			case 8:
				_localctx = new DesignatorAtomContext(_localctx);
				enterOuterAlt(_localctx, 8);
				{
				setState(796);
				designator();
				}
				break;
			case 9:
				_localctx = new IntegerAtomContext(_localctx);
				enterOuterAlt(_localctx, 9);
				{
				setState(797);
				match(INTEGER_LITERAL);
				}
				break;
			case 10:
				_localctx = new RealAtomContext(_localctx);
				enterOuterAlt(_localctx, 10);
				{
				setState(798);
				match(REAL_LITERAL);
				}
				break;
			case 11:
				_localctx = new DateAtomContext(_localctx);
				enterOuterAlt(_localctx, 11);
				{
				setState(799);
				match(DATE_LITERAL);
				}
				break;
			case 12:
				_localctx = new StringAtomContext(_localctx);
				enterOuterAlt(_localctx, 12);
				{
				setState(800);
				match(STRING_LITERAL);
				}
				break;
			case 13:
				_localctx = new CharAtomContext(_localctx);
				enterOuterAlt(_localctx, 13);
				{
				setState(801);
				match(CHAR_LITERAL);
				}
				break;
			case 14:
				_localctx = new TrueAtomContext(_localctx);
				enterOuterAlt(_localctx, 14);
				{
				setState(802);
				match(TRUE);
				}
				break;
			case 15:
				_localctx = new FalseAtomContext(_localctx);
				enterOuterAlt(_localctx, 15);
				{
				setState(803);
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
		case 43:
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
		"\u0004\u0001a\u0327\u0002\u0000\u0007\u0000\u0002\u0001\u0007\u0001\u0002"+
		"\u0002\u0007\u0002\u0002\u0003\u0007\u0003\u0002\u0004\u0007\u0004\u0002"+
		"\u0005\u0007\u0005\u0002\u0006\u0007\u0006\u0002\u0007\u0007\u0007\u0002"+
		"\b\u0007\b\u0002\t\u0007\t\u0002\n\u0007\n\u0002\u000b\u0007\u000b\u0002"+
		"\f\u0007\f\u0002\r\u0007\r\u0002\u000e\u0007\u000e\u0002\u000f\u0007\u000f"+
		"\u0002\u0010\u0007\u0010\u0002\u0011\u0007\u0011\u0002\u0012\u0007\u0012"+
		"\u0002\u0013\u0007\u0013\u0002\u0014\u0007\u0014\u0002\u0015\u0007\u0015"+
		"\u0002\u0016\u0007\u0016\u0002\u0017\u0007\u0017\u0002\u0018\u0007\u0018"+
		"\u0002\u0019\u0007\u0019\u0002\u001a\u0007\u001a\u0002\u001b\u0007\u001b"+
		"\u0002\u001c\u0007\u001c\u0002\u001d\u0007\u001d\u0002\u001e\u0007\u001e"+
		"\u0002\u001f\u0007\u001f\u0002 \u0007 \u0002!\u0007!\u0002\"\u0007\"\u0002"+
		"#\u0007#\u0002$\u0007$\u0002%\u0007%\u0002&\u0007&\u0002\'\u0007\'\u0002"+
		"(\u0007(\u0002)\u0007)\u0002*\u0007*\u0002+\u0007+\u0002,\u0007,\u0001"+
		"\u0000\u0005\u0000\\\b\u0000\n\u0000\f\u0000_\t\u0000\u0001\u0000\u0001"+
		"\u0000\u0005\u0000c\b\u0000\n\u0000\f\u0000f\t\u0000\u0001\u0000\u0005"+
		"\u0000i\b\u0000\n\u0000\f\u0000l\t\u0000\u0003\u0000n\b\u0000\u0001\u0000"+
		"\u0005\u0000q\b\u0000\n\u0000\f\u0000t\t\u0000\u0001\u0000\u0001\u0000"+
		"\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001"+
		"\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001"+
		"\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001"+
		"\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001"+
		"\u0001\u0001\u0003\u0001\u0091\b\u0001\u0001\u0002\u0001\u0002\u0001\u0002"+
		"\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002"+
		"\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002"+
		"\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002"+
		"\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002"+
		"\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002"+
		"\u0003\u0002\u00b4\b\u0002\u0001\u0003\u0001\u0003\u0001\u0003\u0005\u0003"+
		"\u00b9\b\u0003\n\u0003\f\u0003\u00bc\t\u0003\u0001\u0004\u0001\u0004\u0001"+
		"\u0004\u0001\u0004\u0001\u0004\u0001\u0005\u0001\u0005\u0001\u0005\u0001"+
		"\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001"+
		"\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001"+
		"\u0005\u0003\u0005\u00d3\b\u0005\u0001\u0005\u0001\u0005\u0003\u0005\u00d7"+
		"\b\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0003\u0005\u00dc\b\u0005"+
		"\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006"+
		"\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006"+
		"\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006"+
		"\u0001\u0006\u0001\u0006\u0001\u0006\u0004\u0006\u00f3\b\u0006\u000b\u0006"+
		"\f\u0006\u00f4\u0001\u0006\u0001\u0006\u0004\u0006\u00f9\b\u0006\u000b"+
		"\u0006\f\u0006\u00fa\u0005\u0006\u00fd\b\u0006\n\u0006\f\u0006\u0100\t"+
		"\u0006\u0001\u0006\u0003\u0006\u0103\b\u0006\u0001\u0007\u0001\u0007\u0001"+
		"\u0007\u0001\u0007\u0003\u0007\u0109\b\u0007\u0001\u0007\u0001\u0007\u0001"+
		"\u0007\u0001\u0007\u0001\b\u0001\b\u0001\b\u0001\b\u0003\b\u0113\b\b\u0001"+
		"\b\u0004\b\u0116\b\b\u000b\b\f\b\u0117\u0001\b\u0001\b\u0004\b\u011c\b"+
		"\b\u000b\b\f\b\u011d\u0005\b\u0120\b\b\n\b\f\b\u0123\t\b\u0001\b\u0001"+
		"\b\u0001\t\u0003\t\u0128\b\t\u0001\t\u0003\t\u012b\b\t\u0001\t\u0001\t"+
		"\u0001\t\u0001\t\u0001\t\u0003\t\u0132\b\t\u0001\t\u0001\t\u0003\t\u0136"+
		"\b\t\u0001\t\u0003\t\u0139\b\t\u0001\n\u0001\n\u0005\n\u013d\b\n\n\n\f"+
		"\n\u0140\t\n\u0001\u000b\u0001\u000b\u0001\u000b\u0001\u000b\u0005\u000b"+
		"\u0146\b\u000b\n\u000b\f\u000b\u0149\t\u000b\u0001\u000b\u0001\u000b\u0001"+
		"\u000b\u0001\u000b\u0001\u000b\u0001\u000b\u0003\u000b\u0151\b\u000b\u0001"+
		"\u000b\u0003\u000b\u0154\b\u000b\u0001\u000b\u0003\u000b\u0157\b\u000b"+
		"\u0001\f\u0001\f\u0001\r\u0001\r\u0001\r\u0005\r\u015e\b\r\n\r\f\r\u0161"+
		"\t\r\u0001\u000e\u0001\u000e\u0001\u000e\u0001\u000e\u0001\u000f\u0001"+
		"\u000f\u0001\u000f\u0001\u000f\u0003\u000f\u016b\b\u000f\u0001\u0010\u0001"+
		"\u0010\u0001\u0010\u0001\u0011\u0001\u0011\u0001\u0011\u0005\u0011\u0173"+
		"\b\u0011\n\u0011\f\u0011\u0176\t\u0011\u0001\u0012\u0001\u0012\u0001\u0012"+
		"\u0005\u0012\u017b\b\u0012\n\u0012\f\u0012\u017e\t\u0012\u0001\u0012\u0003"+
		"\u0012\u0181\b\u0012\u0001\u0012\u0005\u0012\u0184\b\u0012\n\u0012\f\u0012"+
		"\u0187\t\u0012\u0001\u0012\u0001\u0012\u0005\u0012\u018b\b\u0012\n\u0012"+
		"\f\u0012\u018e\t\u0012\u0001\u0012\u0001\u0012\u0001\u0012\u0005\u0012"+
		"\u0193\b\u0012\n\u0012\f\u0012\u0196\t\u0012\u0001\u0012\u0003\u0012\u0199"+
		"\b\u0012\u0001\u0012\u0005\u0012\u019c\b\u0012\n\u0012\f\u0012\u019f\t"+
		"\u0012\u0001\u0012\u0001\u0012\u0005\u0012\u01a3\b\u0012\n\u0012\f\u0012"+
		"\u01a6\t\u0012\u0001\u0012\u0005\u0012\u01a9\b\u0012\n\u0012\f\u0012\u01ac"+
		"\t\u0012\u0001\u0012\u0001\u0012\u0005\u0012\u01b0\b\u0012\n\u0012\f\u0012"+
		"\u01b3\t\u0012\u0001\u0012\u0003\u0012\u01b6\b\u0012\u0001\u0012\u0005"+
		"\u0012\u01b9\b\u0012\n\u0012\f\u0012\u01bc\t\u0012\u0001\u0012\u0001\u0012"+
		"\u0001\u0013\u0001\u0013\u0001\u0013\u0001\u0013\u0005\u0013\u01c4\b\u0013"+
		"\n\u0013\f\u0013\u01c7\t\u0013\u0001\u0013\u0004\u0013\u01ca\b\u0013\u000b"+
		"\u0013\f\u0013\u01cb\u0001\u0013\u0001\u0013\u0003\u0013\u01d0\b\u0013"+
		"\u0001\u0013\u0005\u0013\u01d3\b\u0013\n\u0013\f\u0013\u01d6\t\u0013\u0001"+
		"\u0013\u0001\u0013\u0005\u0013\u01da\b\u0013\n\u0013\f\u0013\u01dd\t\u0013"+
		"\u0003\u0013\u01df\b\u0013\u0001\u0013\u0005\u0013\u01e2\b\u0013\n\u0013"+
		"\f\u0013\u01e5\t\u0013\u0001\u0013\u0001\u0013\u0001\u0014\u0001\u0014"+
		"\u0001\u0014\u0005\u0014\u01ec\b\u0014\n\u0014\f\u0014\u01ef\t\u0014\u0001"+
		"\u0014\u0001\u0014\u0005\u0014\u01f3\b\u0014\n\u0014\f\u0014\u01f6\t\u0014"+
		"\u0001\u0014\u0001\u0014\u0005\u0014\u01fa\b\u0014\n\u0014\f\u0014\u01fd"+
		"\t\u0014\u0001\u0015\u0001\u0015\u0001\u0015\u0003\u0015\u0202\b\u0015"+
		"\u0001\u0016\u0001\u0016\u0001\u0016\u0001\u0016\u0001\u0016\u0001\u0016"+
		"\u0001\u0016\u0001\u0016\u0003\u0016\u020c\b\u0016\u0001\u0016\u0005\u0016"+
		"\u020f\b\u0016\n\u0016\f\u0016\u0212\t\u0016\u0001\u0016\u0001\u0016\u0005"+
		"\u0016\u0216\b\u0016\n\u0016\f\u0016\u0219\t\u0016\u0001\u0016\u0001\u0016"+
		"\u0001\u0016\u0001\u0017\u0001\u0017\u0001\u0017\u0003\u0017\u0221\b\u0017"+
		"\u0001\u0017\u0005\u0017\u0224\b\u0017\n\u0017\f\u0017\u0227\t\u0017\u0001"+
		"\u0017\u0001\u0017\u0005\u0017\u022b\b\u0017\n\u0017\f\u0017\u022e\t\u0017"+
		"\u0001\u0017\u0001\u0017\u0001\u0018\u0001\u0018\u0005\u0018\u0234\b\u0018"+
		"\n\u0018\f\u0018\u0237\t\u0018\u0001\u0018\u0001\u0018\u0005\u0018\u023b"+
		"\b\u0018\n\u0018\f\u0018\u023e\t\u0018\u0001\u0018\u0001\u0018\u0001\u0018"+
		"\u0001\u0019\u0001\u0019\u0001\u0019\u0001\u0019\u0003\u0019\u0247\b\u0019"+
		"\u0001\u0019\u0001\u0019\u0005\u0019\u024b\b\u0019\n\u0019\f\u0019\u024e"+
		"\t\u0019\u0001\u0019\u0001\u0019\u0005\u0019\u0252\b\u0019\n\u0019\f\u0019"+
		"\u0255\t\u0019\u0001\u0019\u0001\u0019\u0001\u001a\u0001\u001a\u0001\u001a"+
		"\u0001\u001a\u0003\u001a\u025d\b\u001a\u0001\u001a\u0001\u001a\u0001\u001a"+
		"\u0001\u001a\u0005\u001a\u0263\b\u001a\n\u001a\f\u001a\u0266\t\u001a\u0001"+
		"\u001a\u0001\u001a\u0005\u001a\u026a\b\u001a\n\u001a\f\u001a\u026d\t\u001a"+
		"\u0001\u001a\u0001\u001a\u0001\u001b\u0001\u001b\u0001\u001b\u0005\u001b"+
		"\u0274\b\u001b\n\u001b\f\u001b\u0277\t\u001b\u0001\u001c\u0003\u001c\u027a"+
		"\b\u001c\u0001\u001c\u0001\u001c\u0001\u001c\u0001\u001c\u0001\u001d\u0001"+
		"\u001d\u0001\u001d\u0001\u001d\u0003\u001d\u0284\b\u001d\u0001\u001d\u0001"+
		"\u001d\u0001\u001d\u0003\u001d\u0289\b\u001d\u0001\u001e\u0001\u001e\u0005"+
		"\u001e\u028d\b\u001e\n\u001e\f\u001e\u0290\t\u001e\u0001\u001e\u0001\u001e"+
		"\u0001\u001e\u0001\u001e\u0003\u001e\u0296\b\u001e\u0001\u001e\u0001\u001e"+
		"\u0001\u001f\u0001\u001f\u0001 \u0001 \u0001 \u0001!\u0001!\u0001!\u0001"+
		"!\u0001!\u0001\"\u0001\"\u0001\"\u0001\"\u0001\"\u0001#\u0001#\u0001#"+
		"\u0001#\u0001#\u0001$\u0001$\u0001$\u0001%\u0001%\u0001%\u0001%\u0001"+
		"%\u0001&\u0001&\u0001&\u0001&\u0001&\u0001\'\u0001\'\u0001\'\u0001\'\u0001"+
		"\'\u0001(\u0001(\u0001)\u0001)\u0001)\u0005)\u02c5\b)\n)\f)\u02c8\t)\u0001"+
		"*\u0001*\u0005*\u02cc\b*\n*\f*\u02cf\t*\u0001*\u0005*\u02d2\b*\n*\f*\u02d5"+
		"\t*\u0001+\u0001+\u0001+\u0001+\u0001+\u0001+\u0003+\u02dd\b+\u0001+\u0001"+
		"+\u0001+\u0001+\u0001+\u0001+\u0001+\u0001+\u0001+\u0001+\u0001+\u0001"+
		"+\u0001+\u0001+\u0001+\u0001+\u0001+\u0001+\u0001+\u0001+\u0001+\u0005"+
		"+\u02f4\b+\n+\f+\u02f7\t+\u0001,\u0001,\u0001,\u0001,\u0001,\u0001,\u0001"+
		",\u0003,\u0300\b,\u0001,\u0001,\u0001,\u0001,\u0001,\u0003,\u0307\b,\u0001"+
		",\u0001,\u0001,\u0001,\u0001,\u0001,\u0001,\u0001,\u0001,\u0001,\u0001"+
		",\u0001,\u0001,\u0001,\u0001,\u0001,\u0001,\u0001,\u0001,\u0001,\u0001"+
		",\u0001,\u0001,\u0001,\u0001,\u0001,\u0001,\u0001,\u0003,\u0325\b,\u0001"+
		",\u0000\u0001V-\u0000\u0002\u0004\u0006\b\n\f\u000e\u0010\u0012\u0014"+
		"\u0016\u0018\u001a\u001c\u001e \"$&(*,.02468:<>@BDFHJLNPRTVX\u0000\n\u0001"+
		"\u0000EF\u0001\u0000;<\u0002\u0000>>^^\u0002\u0000==^^\u0001\u0000\u0004"+
		"\u0005\u0001\u000067\u0001\u0000+.\u0002\u0000%&NO\u0001\u0000LM\u0001"+
		"\u0000FK\u0383\u0000]\u0001\u0000\u0000\u0000\u0002\u0090\u0001\u0000"+
		"\u0000\u0000\u0004\u00b3\u0001\u0000\u0000\u0000\u0006\u00b5\u0001\u0000"+
		"\u0000\u0000\b\u00bd\u0001\u0000\u0000\u0000\n\u00db\u0001\u0000\u0000"+
		"\u0000\f\u0102\u0001\u0000\u0000\u0000\u000e\u0104\u0001\u0000\u0000\u0000"+
		"\u0010\u010e\u0001\u0000\u0000\u0000\u0012\u0138\u0001\u0000\u0000\u0000"+
		"\u0014\u013a\u0001\u0000\u0000\u0000\u0016\u0156\u0001\u0000\u0000\u0000"+
		"\u0018\u0158\u0001\u0000\u0000\u0000\u001a\u015a\u0001\u0000\u0000\u0000"+
		"\u001c\u0162\u0001\u0000\u0000\u0000\u001e\u0166\u0001\u0000\u0000\u0000"+
		" \u016c\u0001\u0000\u0000\u0000\"\u016f\u0001\u0000\u0000\u0000$\u0177"+
		"\u0001\u0000\u0000\u0000&\u01bf\u0001\u0000\u0000\u0000(\u01e8\u0001\u0000"+
		"\u0000\u0000*\u01fe\u0001\u0000\u0000\u0000,\u0203\u0001\u0000\u0000\u0000"+
		".\u021d\u0001\u0000\u0000\u00000\u0231\u0001\u0000\u0000\u00002\u0242"+
		"\u0001\u0000\u0000\u00004\u0258\u0001\u0000\u0000\u00006\u0270\u0001\u0000"+
		"\u0000\u00008\u0279\u0001\u0000\u0000\u0000:\u0288\u0001\u0000\u0000\u0000"+
		"<\u028a\u0001\u0000\u0000\u0000>\u0299\u0001\u0000\u0000\u0000@\u029b"+
		"\u0001\u0000\u0000\u0000B\u029e\u0001\u0000\u0000\u0000D\u02a3\u0001\u0000"+
		"\u0000\u0000F\u02a8\u0001\u0000\u0000\u0000H\u02ad\u0001\u0000\u0000\u0000"+
		"J\u02b0\u0001\u0000\u0000\u0000L\u02b5\u0001\u0000\u0000\u0000N\u02ba"+
		"\u0001\u0000\u0000\u0000P\u02bf\u0001\u0000\u0000\u0000R\u02c1\u0001\u0000"+
		"\u0000\u0000T\u02c9\u0001\u0000\u0000\u0000V\u02dc\u0001\u0000\u0000\u0000"+
		"X\u0324\u0001\u0000\u0000\u0000Z\\\u0005_\u0000\u0000[Z\u0001\u0000\u0000"+
		"\u0000\\_\u0001\u0000\u0000\u0000][\u0001\u0000\u0000\u0000]^\u0001\u0000"+
		"\u0000\u0000^m\u0001\u0000\u0000\u0000_]\u0001\u0000\u0000\u0000`j\u0003"+
		"\u0002\u0001\u0000ac\u0005_\u0000\u0000ba\u0001\u0000\u0000\u0000cf\u0001"+
		"\u0000\u0000\u0000db\u0001\u0000\u0000\u0000de\u0001\u0000\u0000\u0000"+
		"eg\u0001\u0000\u0000\u0000fd\u0001\u0000\u0000\u0000gi\u0003\u0002\u0001"+
		"\u0000hd\u0001\u0000\u0000\u0000il\u0001\u0000\u0000\u0000jh\u0001\u0000"+
		"\u0000\u0000jk\u0001\u0000\u0000\u0000kn\u0001\u0000\u0000\u0000lj\u0001"+
		"\u0000\u0000\u0000m`\u0001\u0000\u0000\u0000mn\u0001\u0000\u0000\u0000"+
		"nr\u0001\u0000\u0000\u0000oq\u0005_\u0000\u0000po\u0001\u0000\u0000\u0000"+
		"qt\u0001\u0000\u0000\u0000rp\u0001\u0000\u0000\u0000rs\u0001\u0000\u0000"+
		"\u0000su\u0001\u0000\u0000\u0000tr\u0001\u0000\u0000\u0000uv\u0005\u0000"+
		"\u0000\u0001v\u0001\u0001\u0000\u0000\u0000w\u0091\u0003\u0004\u0002\u0000"+
		"x\u0091\u0003\b\u0004\u0000y\u0091\u0003\f\u0006\u0000z\u0091\u0003\u000e"+
		"\u0007\u0000{\u0091\u0003\u0010\b\u0000|\u0091\u0003\u001a\r\u0000}\u0091"+
		"\u0003\u001e\u000f\u0000~\u0091\u0003 \u0010\u0000\u007f\u0091\u0003$"+
		"\u0012\u0000\u0080\u0091\u0003&\u0013\u0000\u0081\u0091\u0003,\u0016\u0000"+
		"\u0082\u0091\u0003.\u0017\u0000\u0083\u0091\u00030\u0018\u0000\u0084\u0091"+
		"\u00032\u0019\u0000\u0085\u0091\u00034\u001a\u0000\u0086\u0091\u0003:"+
		"\u001d\u0000\u0087\u0091\u0003>\u001f\u0000\u0088\u0091\u0003@ \u0000"+
		"\u0089\u0091\u0003B!\u0000\u008a\u0091\u0003D\"\u0000\u008b\u0091\u0003"+
		"F#\u0000\u008c\u0091\u0003H$\u0000\u008d\u0091\u0003J%\u0000\u008e\u0091"+
		"\u0003L&\u0000\u008f\u0091\u0003N\'\u0000\u0090w\u0001\u0000\u0000\u0000"+
		"\u0090x\u0001\u0000\u0000\u0000\u0090y\u0001\u0000\u0000\u0000\u0090z"+
		"\u0001\u0000\u0000\u0000\u0090{\u0001\u0000\u0000\u0000\u0090|\u0001\u0000"+
		"\u0000\u0000\u0090}\u0001\u0000\u0000\u0000\u0090~\u0001\u0000\u0000\u0000"+
		"\u0090\u007f\u0001\u0000\u0000\u0000\u0090\u0080\u0001\u0000\u0000\u0000"+
		"\u0090\u0081\u0001\u0000\u0000\u0000\u0090\u0082\u0001\u0000\u0000\u0000"+
		"\u0090\u0083\u0001\u0000\u0000\u0000\u0090\u0084\u0001\u0000\u0000\u0000"+
		"\u0090\u0085\u0001\u0000\u0000\u0000\u0090\u0086\u0001\u0000\u0000\u0000"+
		"\u0090\u0087\u0001\u0000\u0000\u0000\u0090\u0088\u0001\u0000\u0000\u0000"+
		"\u0090\u0089\u0001\u0000\u0000\u0000\u0090\u008a\u0001\u0000\u0000\u0000"+
		"\u0090\u008b\u0001\u0000\u0000\u0000\u0090\u008c\u0001\u0000\u0000\u0000"+
		"\u0090\u008d\u0001\u0000\u0000\u0000\u0090\u008e\u0001\u0000\u0000\u0000"+
		"\u0090\u008f\u0001\u0000\u0000\u0000\u0091\u0003\u0001\u0000\u0000\u0000"+
		"\u0092\u0093\u0005\u0001\u0000\u0000\u0093\u0094\u0003\u0006\u0003\u0000"+
		"\u0094\u0095\u0005W\u0000\u0000\u0095\u0096\u0005\u001f\u0000\u0000\u0096"+
		"\u0097\u0005T\u0000\u0000\u0097\u0098\u0003V+\u0000\u0098\u0099\u0005"+
		"W\u0000\u0000\u0099\u009a\u0003V+\u0000\u009a\u009b\u0005U\u0000\u0000"+
		"\u009b\u009c\u0005\f\u0000\u0000\u009c\u009d\u0003\n\u0005\u0000\u009d"+
		"\u00b4\u0001\u0000\u0000\u0000\u009e\u009f\u0005\u0001\u0000\u0000\u009f"+
		"\u00a0\u0005^\u0000\u0000\u00a0\u00a1\u0005W\u0000\u0000\u00a1\u00a2\u0005"+
		"\u001f\u0000\u0000\u00a2\u00a3\u0005T\u0000\u0000\u00a3\u00a4\u0003V+"+
		"\u0000\u00a4\u00a5\u0005W\u0000\u0000\u00a5\u00a6\u0003V+\u0000\u00a6"+
		"\u00a7\u0005V\u0000\u0000\u00a7\u00a8\u0003V+\u0000\u00a8\u00a9\u0005"+
		"W\u0000\u0000\u00a9\u00aa\u0003V+\u0000\u00aa\u00ab\u0005U\u0000\u0000"+
		"\u00ab\u00ac\u0005\f\u0000\u0000\u00ac\u00ad\u0003\n\u0005\u0000\u00ad"+
		"\u00b4\u0001\u0000\u0000\u0000\u00ae\u00af\u0005\u0001\u0000\u0000\u00af"+
		"\u00b0\u0003\u0006\u0003\u0000\u00b0\u00b1\u0005W\u0000\u0000\u00b1\u00b2"+
		"\u0003\n\u0005\u0000\u00b2\u00b4\u0001\u0000\u0000\u0000\u00b3\u0092\u0001"+
		"\u0000\u0000\u0000\u00b3\u009e\u0001\u0000\u0000\u0000\u00b3\u00ae\u0001"+
		"\u0000\u0000\u0000\u00b4\u0005\u0001\u0000\u0000\u0000\u00b5\u00ba\u0005"+
		"^\u0000\u0000\u00b6\u00b7\u0005V\u0000\u0000\u00b7\u00b9\u0005^\u0000"+
		"\u0000\u00b8\u00b6\u0001\u0000\u0000\u0000\u00b9\u00bc\u0001\u0000\u0000"+
		"\u0000\u00ba\u00b8\u0001\u0000\u0000\u0000\u00ba\u00bb\u0001\u0000\u0000"+
		"\u0000\u00bb\u0007\u0001\u0000\u0000\u0000\u00bc\u00ba\u0001\u0000\u0000"+
		"\u0000\u00bd\u00be\u0005\u0002\u0000\u0000\u00be\u00bf\u0005^\u0000\u0000"+
		"\u00bf\u00c0\u0007\u0000\u0000\u0000\u00c0\u00c1\u0003V+\u0000\u00c1\t"+
		"\u0001\u0000\u0000\u0000\u00c2\u00dc\u0005?\u0000\u0000\u00c3\u00dc\u0005"+
		"@\u0000\u0000\u00c4\u00dc\u0005A\u0000\u0000\u00c5\u00dc\u0005B\u0000"+
		"\u0000\u00c6\u00dc\u0005C\u0000\u0000\u00c7\u00dc\u0005D\u0000\u0000\u00c8"+
		"\u00d6\u0005\u001f\u0000\u0000\u00c9\u00ca\u0005T\u0000\u0000\u00ca\u00cb"+
		"\u0003V+\u0000\u00cb\u00cc\u0005W\u0000\u0000\u00cc\u00d2\u0003V+\u0000"+
		"\u00cd\u00ce\u0005V\u0000\u0000\u00ce\u00cf\u0003V+\u0000\u00cf\u00d0"+
		"\u0005W\u0000\u0000\u00d0\u00d1\u0003V+\u0000\u00d1\u00d3\u0001\u0000"+
		"\u0000\u0000\u00d2\u00cd\u0001\u0000\u0000\u0000\u00d2\u00d3\u0001\u0000"+
		"\u0000\u0000\u00d3\u00d4\u0001\u0000\u0000\u0000\u00d4\u00d5\u0005U\u0000"+
		"\u0000\u00d5\u00d7\u0001\u0000\u0000\u0000\u00d6\u00c9\u0001\u0000\u0000"+
		"\u0000\u00d6\u00d7\u0001\u0000\u0000\u0000\u00d7\u00d8\u0001\u0000\u0000"+
		"\u0000\u00d8\u00d9\u0005\f\u0000\u0000\u00d9\u00dc\u0003\n\u0005\u0000"+
		"\u00da\u00dc\u0005^\u0000\u0000\u00db\u00c2\u0001\u0000\u0000\u0000\u00db"+
		"\u00c3\u0001\u0000\u0000\u0000\u00db\u00c4\u0001\u0000\u0000\u0000\u00db"+
		"\u00c5\u0001\u0000\u0000\u0000\u00db\u00c6\u0001\u0000\u0000\u0000\u00db"+
		"\u00c7\u0001\u0000\u0000\u0000\u00db\u00c8\u0001\u0000\u0000\u0000\u00db"+
		"\u00da\u0001\u0000\u0000\u0000\u00dc\u000b\u0001\u0000\u0000\u0000\u00dd"+
		"\u00de\u00052\u0000\u0000\u00de\u00df\u0005^\u0000\u0000\u00df\u00e0\u0005"+
		"F\u0000\u0000\u00e0\u00e1\u0005R\u0000\u0000\u00e1\u00e2\u0003\u0006\u0003"+
		"\u0000\u00e2\u00e3\u0005S\u0000\u0000\u00e3\u0103\u0001\u0000\u0000\u0000"+
		"\u00e4\u00e5\u00052\u0000\u0000\u00e5\u00e6\u0005^\u0000\u0000\u00e6\u00e7"+
		"\u0005F\u0000\u0000\u00e7\u00e8\u0005P\u0000\u0000\u00e8\u0103\u0003\n"+
		"\u0005\u0000\u00e9\u00ea\u00052\u0000\u0000\u00ea\u00eb\u0005^\u0000\u0000"+
		"\u00eb\u00ec\u0005F\u0000\u0000\u00ec\u00ed\u00054\u0000\u0000\u00ed\u00ee"+
		"\u0005\f\u0000\u0000\u00ee\u0103\u0003\n\u0005\u0000\u00ef\u00f0\u0005"+
		"2\u0000\u0000\u00f0\u00f2\u0005^\u0000\u0000\u00f1\u00f3\u0005_\u0000"+
		"\u0000\u00f2\u00f1\u0001\u0000\u0000\u0000\u00f3\u00f4\u0001\u0000\u0000"+
		"\u0000\u00f4\u00f2\u0001\u0000\u0000\u0000\u00f4\u00f5\u0001\u0000\u0000"+
		"\u0000\u00f5\u00fe\u0001\u0000\u0000\u0000\u00f6\u00f8\u0003\u0004\u0002"+
		"\u0000\u00f7\u00f9\u0005_\u0000\u0000\u00f8\u00f7\u0001\u0000\u0000\u0000"+
		"\u00f9\u00fa\u0001\u0000\u0000\u0000\u00fa\u00f8\u0001\u0000\u0000\u0000"+
		"\u00fa\u00fb\u0001\u0000\u0000\u0000\u00fb\u00fd\u0001\u0000\u0000\u0000"+
		"\u00fc\u00f6\u0001\u0000\u0000\u0000\u00fd\u0100\u0001\u0000\u0000\u0000"+
		"\u00fe\u00fc\u0001\u0000\u0000\u0000\u00fe\u00ff\u0001\u0000\u0000\u0000"+
		"\u00ff\u0101\u0001\u0000\u0000\u0000\u0100\u00fe\u0001\u0000\u0000\u0000"+
		"\u0101\u0103\u00053\u0000\u0000\u0102\u00dd\u0001\u0000\u0000\u0000\u0102"+
		"\u00e4\u0001\u0000\u0000\u0000\u0102\u00e9\u0001\u0000\u0000\u0000\u0102"+
		"\u00ef\u0001\u0000\u0000\u0000\u0103\r\u0001\u0000\u0000\u0000\u0104\u0105"+
		"\u00055\u0000\u0000\u0105\u0106\u0005^\u0000\u0000\u0106\u0108\u0005R"+
		"\u0000\u0000\u0107\u0109\u0003\"\u0011\u0000\u0108\u0107\u0001\u0000\u0000"+
		"\u0000\u0108\u0109\u0001\u0000\u0000\u0000\u0109\u010a\u0001\u0000\u0000"+
		"\u0000\u010a\u010b\u0005S\u0000\u0000\u010b\u010c\u0005W\u0000\u0000\u010c"+
		"\u010d\u0005^\u0000\u0000\u010d\u000f\u0001\u0000\u0000\u0000\u010e\u010f"+
		"\u00058\u0000\u0000\u010f\u0112\u0005^\u0000\u0000\u0110\u0111\u0005:"+
		"\u0000\u0000\u0111\u0113\u0005^\u0000\u0000\u0112\u0110\u0001\u0000\u0000"+
		"\u0000\u0112\u0113\u0001\u0000\u0000\u0000\u0113\u0115\u0001\u0000\u0000"+
		"\u0000\u0114\u0116\u0005_\u0000\u0000\u0115\u0114\u0001\u0000\u0000\u0000"+
		"\u0116\u0117\u0001\u0000\u0000\u0000\u0117\u0115\u0001\u0000\u0000\u0000"+
		"\u0117\u0118\u0001\u0000\u0000\u0000\u0118\u0121\u0001\u0000\u0000\u0000"+
		"\u0119\u011b\u0003\u0012\t\u0000\u011a\u011c\u0005_\u0000\u0000\u011b"+
		"\u011a\u0001\u0000\u0000\u0000\u011c\u011d\u0001\u0000\u0000\u0000\u011d"+
		"\u011b\u0001\u0000\u0000\u0000\u011d\u011e\u0001\u0000\u0000\u0000\u011e"+
		"\u0120\u0001\u0000\u0000\u0000\u011f\u0119\u0001\u0000\u0000\u0000\u0120"+
		"\u0123\u0001\u0000\u0000\u0000\u0121\u011f\u0001\u0000\u0000\u0000\u0121"+
		"\u0122\u0001\u0000\u0000\u0000\u0122\u0124\u0001\u0000\u0000\u0000\u0123"+
		"\u0121\u0001\u0000\u0000\u0000\u0124\u0125\u00059\u0000\u0000\u0125\u0011"+
		"\u0001\u0000\u0000\u0000\u0126\u0128\u0007\u0001\u0000\u0000\u0127\u0126"+
		"\u0001\u0000\u0000\u0000\u0127\u0128\u0001\u0000\u0000\u0000\u0128\u012a"+
		"\u0001\u0000\u0000\u0000\u0129\u012b\u0005\u0001\u0000\u0000\u012a\u0129"+
		"\u0001\u0000\u0000\u0000\u012a\u012b\u0001\u0000\u0000\u0000\u012b\u012c"+
		"\u0001\u0000\u0000\u0000\u012c\u012d\u0003\u0006\u0003\u0000\u012d\u012e"+
		"\u0005W\u0000\u0000\u012e\u012f\u0003\n\u0005\u0000\u012f\u0139\u0001"+
		"\u0000\u0000\u0000\u0130\u0132\u0007\u0001\u0000\u0000\u0131\u0130\u0001"+
		"\u0000\u0000\u0000\u0131\u0132\u0001\u0000\u0000\u0000\u0132\u0133\u0001"+
		"\u0000\u0000\u0000\u0133\u0139\u00032\u0019\u0000\u0134\u0136\u0007\u0001"+
		"\u0000\u0000\u0135\u0134\u0001\u0000\u0000\u0000\u0135\u0136\u0001\u0000"+
		"\u0000\u0000\u0136\u0137\u0001\u0000\u0000\u0000\u0137\u0139\u00034\u001a"+
		"\u0000\u0138\u0127\u0001\u0000\u0000\u0000\u0138\u0131\u0001\u0000\u0000"+
		"\u0000\u0138\u0135\u0001\u0000\u0000\u0000\u0139\u0013\u0001\u0000\u0000"+
		"\u0000\u013a\u013e\u0007\u0002\u0000\u0000\u013b\u013d\u0003\u0016\u000b"+
		"\u0000\u013c\u013b\u0001\u0000\u0000\u0000\u013d\u0140\u0001\u0000\u0000"+
		"\u0000\u013e\u013c\u0001\u0000\u0000\u0000\u013e\u013f\u0001\u0000\u0000"+
		"\u0000\u013f\u0015\u0001\u0000\u0000\u0000\u0140\u013e\u0001\u0000\u0000"+
		"\u0000\u0141\u0142\u0005T\u0000\u0000\u0142\u0147\u0003V+\u0000\u0143"+
		"\u0144\u0005V\u0000\u0000\u0144\u0146\u0003V+\u0000\u0145\u0143\u0001"+
		"\u0000\u0000\u0000\u0146\u0149\u0001\u0000\u0000\u0000\u0147\u0145\u0001"+
		"\u0000\u0000\u0000\u0147\u0148\u0001\u0000\u0000\u0000\u0148\u014a\u0001"+
		"\u0000\u0000\u0000\u0149\u0147\u0001\u0000\u0000\u0000\u014a\u014b\u0005"+
		"U\u0000\u0000\u014b\u0157\u0001\u0000\u0000\u0000\u014c\u014d\u0005X\u0000"+
		"\u0000\u014d\u0153\u0003\u0018\f\u0000\u014e\u0150\u0005R\u0000\u0000"+
		"\u014f\u0151\u0003R)\u0000\u0150\u014f\u0001\u0000\u0000\u0000\u0150\u0151"+
		"\u0001\u0000\u0000\u0000\u0151\u0152\u0001\u0000\u0000\u0000\u0152\u0154"+
		"\u0005S\u0000\u0000\u0153\u014e\u0001\u0000\u0000\u0000\u0153\u0154\u0001"+
		"\u0000\u0000\u0000\u0154\u0157\u0001\u0000\u0000\u0000\u0155\u0157\u0005"+
		"P\u0000\u0000\u0156\u0141\u0001\u0000\u0000\u0000\u0156\u014c\u0001\u0000"+
		"\u0000\u0000\u0156\u0155\u0001\u0000\u0000\u0000\u0157\u0017\u0001\u0000"+
		"\u0000\u0000\u0158\u0159\u0007\u0003\u0000\u0000\u0159\u0019\u0001\u0000"+
		"\u0000\u0000\u015a\u015f\u0003\u001c\u000e\u0000\u015b\u015c\u0005V\u0000"+
		"\u0000\u015c\u015e\u0003\u001c\u000e\u0000\u015d\u015b\u0001\u0000\u0000"+
		"\u0000\u015e\u0161\u0001\u0000\u0000\u0000\u015f\u015d\u0001\u0000\u0000"+
		"\u0000\u015f\u0160\u0001\u0000\u0000\u0000\u0160\u001b\u0001\u0000\u0000"+
		"\u0000\u0161\u015f\u0001\u0000\u0000\u0000\u0162\u0163\u0003\u0014\n\u0000"+
		"\u0163\u0164\u0007\u0000\u0000\u0000\u0164\u0165\u0003V+\u0000\u0165\u001d"+
		"\u0001\u0000\u0000\u0000\u0166\u0167\u0005\u0003\u0000\u0000\u0167\u016a"+
		"\u0003\u0014\n\u0000\u0168\u0169\u0005V\u0000\u0000\u0169\u016b\u0005"+
		"\\\u0000\u0000\u016a\u0168\u0001\u0000\u0000\u0000\u016a\u016b\u0001\u0000"+
		"\u0000\u0000\u016b\u001f\u0001\u0000\u0000\u0000\u016c\u016d\u0007\u0004"+
		"\u0000\u0000\u016d\u016e\u0003\"\u0011\u0000\u016e!\u0001\u0000\u0000"+
		"\u0000\u016f\u0174\u0003V+\u0000\u0170\u0171\u0005V\u0000\u0000\u0171"+
		"\u0173\u0003V+\u0000\u0172\u0170\u0001\u0000\u0000\u0000\u0173\u0176\u0001"+
		"\u0000\u0000\u0000\u0174\u0172\u0001\u0000\u0000\u0000\u0174\u0175\u0001"+
		"\u0000\u0000\u0000\u0175#\u0001\u0000\u0000\u0000\u0176\u0174\u0001\u0000"+
		"\u0000\u0000\u0177\u0178\u0005\u0006\u0000\u0000\u0178\u017c\u0003V+\u0000"+
		"\u0179\u017b\u0005_\u0000\u0000\u017a\u0179\u0001\u0000\u0000\u0000\u017b"+
		"\u017e\u0001\u0000\u0000\u0000\u017c\u017a\u0001\u0000\u0000\u0000\u017c"+
		"\u017d\u0001\u0000\u0000\u0000\u017d\u0180\u0001\u0000\u0000\u0000\u017e"+
		"\u017c\u0001\u0000\u0000\u0000\u017f\u0181\u0005\u0007\u0000\u0000\u0180"+
		"\u017f\u0001\u0000\u0000\u0000\u0180\u0181\u0001\u0000\u0000\u0000\u0181"+
		"\u0185\u0001\u0000\u0000\u0000\u0182\u0184\u0005_\u0000\u0000\u0183\u0182"+
		"\u0001\u0000\u0000\u0000\u0184\u0187\u0001\u0000\u0000\u0000\u0185\u0183"+
		"\u0001\u0000\u0000\u0000\u0185\u0186\u0001\u0000\u0000\u0000\u0186\u0188"+
		"\u0001\u0000\u0000\u0000\u0187\u0185\u0001\u0000\u0000\u0000\u0188\u01a4"+
		"\u0003T*\u0000\u0189\u018b\u0005_\u0000\u0000\u018a\u0189\u0001\u0000"+
		"\u0000\u0000\u018b\u018e\u0001\u0000\u0000\u0000\u018c\u018a\u0001\u0000"+
		"\u0000\u0000\u018c\u018d\u0001\u0000\u0000\u0000\u018d\u018f\u0001\u0000"+
		"\u0000\u0000\u018e\u018c\u0001\u0000\u0000\u0000\u018f\u0190\u0005\t\u0000"+
		"\u0000\u0190\u0194\u0003V+\u0000\u0191\u0193\u0005_\u0000\u0000\u0192"+
		"\u0191\u0001\u0000\u0000\u0000\u0193\u0196\u0001\u0000\u0000\u0000\u0194"+
		"\u0192\u0001\u0000\u0000\u0000\u0194\u0195\u0001\u0000\u0000\u0000\u0195"+
		"\u0198\u0001\u0000\u0000\u0000\u0196\u0194\u0001\u0000\u0000\u0000\u0197"+
		"\u0199\u0005\u0007\u0000\u0000\u0198\u0197\u0001\u0000\u0000\u0000\u0198"+
		"\u0199\u0001\u0000\u0000\u0000\u0199\u019d\u0001\u0000\u0000\u0000\u019a"+
		"\u019c\u0005_\u0000\u0000\u019b\u019a\u0001\u0000\u0000\u0000\u019c\u019f"+
		"\u0001\u0000\u0000\u0000\u019d\u019b\u0001\u0000\u0000\u0000\u019d\u019e"+
		"\u0001\u0000\u0000\u0000\u019e\u01a0\u0001\u0000\u0000\u0000\u019f\u019d"+
		"\u0001\u0000\u0000\u0000\u01a0\u01a1\u0003T*\u0000\u01a1\u01a3\u0001\u0000"+
		"\u0000\u0000\u01a2\u018c\u0001\u0000\u0000\u0000\u01a3\u01a6\u0001\u0000"+
		"\u0000\u0000\u01a4\u01a2\u0001\u0000\u0000\u0000\u01a4\u01a5\u0001\u0000"+
		"\u0000\u0000\u01a5\u01b5\u0001\u0000\u0000\u0000\u01a6\u01a4\u0001\u0000"+
		"\u0000\u0000\u01a7\u01a9\u0005_\u0000\u0000\u01a8\u01a7\u0001\u0000\u0000"+
		"\u0000\u01a9\u01ac\u0001\u0000\u0000\u0000\u01aa\u01a8\u0001\u0000\u0000"+
		"\u0000\u01aa\u01ab\u0001\u0000\u0000\u0000\u01ab\u01ad\u0001\u0000\u0000"+
		"\u0000\u01ac\u01aa\u0001\u0000\u0000\u0000\u01ad\u01b1\u0005\b\u0000\u0000"+
		"\u01ae\u01b0\u0005_\u0000\u0000\u01af\u01ae\u0001\u0000\u0000\u0000\u01b0"+
		"\u01b3\u0001\u0000\u0000\u0000\u01b1\u01af\u0001\u0000\u0000\u0000\u01b1"+
		"\u01b2\u0001\u0000\u0000\u0000\u01b2\u01b4\u0001\u0000\u0000\u0000\u01b3"+
		"\u01b1\u0001\u0000\u0000\u0000\u01b4\u01b6\u0003T*\u0000\u01b5\u01aa\u0001"+
		"\u0000\u0000\u0000\u01b5\u01b6\u0001\u0000\u0000\u0000\u01b6\u01ba\u0001"+
		"\u0000\u0000\u0000\u01b7\u01b9\u0005_\u0000\u0000\u01b8\u01b7\u0001\u0000"+
		"\u0000\u0000\u01b9\u01bc\u0001\u0000\u0000\u0000\u01ba\u01b8\u0001\u0000"+
		"\u0000\u0000\u01ba\u01bb\u0001\u0000\u0000\u0000\u01bb\u01bd\u0001\u0000"+
		"\u0000\u0000\u01bc\u01ba\u0001\u0000\u0000\u0000\u01bd\u01be\u0005\n\u0000"+
		"\u0000\u01be%\u0001\u0000\u0000\u0000\u01bf\u01c0\u0005\u000b\u0000\u0000"+
		"\u01c0\u01c1\u0005\f\u0000\u0000\u01c1\u01c5\u0003\u0014\n\u0000\u01c2"+
		"\u01c4\u0005_\u0000\u0000\u01c3\u01c2\u0001\u0000\u0000\u0000\u01c4\u01c7"+
		"\u0001\u0000\u0000\u0000\u01c5\u01c3\u0001\u0000\u0000\u0000\u01c5\u01c6"+
		"\u0001\u0000\u0000\u0000\u01c6\u01c9\u0001\u0000\u0000\u0000\u01c7\u01c5"+
		"\u0001\u0000\u0000\u0000\u01c8\u01ca\u0003(\u0014\u0000\u01c9\u01c8\u0001"+
		"\u0000\u0000\u0000\u01ca\u01cb\u0001\u0000\u0000\u0000\u01cb\u01c9\u0001"+
		"\u0000\u0000\u0000\u01cb\u01cc\u0001\u0000\u0000\u0000\u01cc\u01de\u0001"+
		"\u0000\u0000\u0000\u01cd\u01cf\u0005\r\u0000\u0000\u01ce\u01d0\u0005W"+
		"\u0000\u0000\u01cf\u01ce\u0001\u0000\u0000\u0000\u01cf\u01d0\u0001\u0000"+
		"\u0000\u0000\u01d0\u01d4\u0001\u0000\u0000\u0000\u01d1\u01d3\u0005_\u0000"+
		"\u0000\u01d2\u01d1\u0001\u0000\u0000\u0000\u01d3\u01d6\u0001\u0000\u0000"+
		"\u0000\u01d4\u01d2\u0001\u0000\u0000\u0000\u01d4\u01d5\u0001\u0000\u0000"+
		"\u0000\u01d5\u01d7\u0001\u0000\u0000\u0000\u01d6\u01d4\u0001\u0000\u0000"+
		"\u0000\u01d7\u01db\u0003T*\u0000\u01d8\u01da\u0005_\u0000\u0000\u01d9"+
		"\u01d8\u0001\u0000\u0000\u0000\u01da\u01dd\u0001\u0000\u0000\u0000\u01db"+
		"\u01d9\u0001\u0000\u0000\u0000\u01db\u01dc\u0001\u0000\u0000\u0000\u01dc"+
		"\u01df\u0001\u0000\u0000\u0000\u01dd\u01db\u0001\u0000\u0000\u0000\u01de"+
		"\u01cd\u0001\u0000\u0000\u0000\u01de\u01df\u0001\u0000\u0000\u0000\u01df"+
		"\u01e3\u0001\u0000\u0000\u0000\u01e0\u01e2\u0005_\u0000\u0000\u01e1\u01e0"+
		"\u0001\u0000\u0000\u0000\u01e2\u01e5\u0001\u0000\u0000\u0000\u01e3\u01e1"+
		"\u0001\u0000\u0000\u0000\u01e3\u01e4\u0001\u0000\u0000\u0000\u01e4\u01e6"+
		"\u0001\u0000\u0000\u0000\u01e5\u01e3\u0001\u0000\u0000\u0000\u01e6\u01e7"+
		"\u0005\u000e\u0000\u0000\u01e7\'\u0001\u0000\u0000\u0000\u01e8\u01ed\u0003"+
		"*\u0015\u0000\u01e9\u01ea\u0005V\u0000\u0000\u01ea\u01ec\u0003*\u0015"+
		"\u0000\u01eb\u01e9\u0001\u0000\u0000\u0000\u01ec\u01ef\u0001\u0000\u0000"+
		"\u0000\u01ed\u01eb\u0001\u0000\u0000\u0000\u01ed\u01ee\u0001\u0000\u0000"+
		"\u0000\u01ee\u01f0\u0001\u0000\u0000\u0000\u01ef\u01ed\u0001\u0000\u0000"+
		"\u0000\u01f0\u01f4\u0005W\u0000\u0000\u01f1\u01f3\u0005_\u0000\u0000\u01f2"+
		"\u01f1\u0001\u0000\u0000\u0000\u01f3\u01f6\u0001\u0000\u0000\u0000\u01f4"+
		"\u01f2\u0001\u0000\u0000\u0000\u01f4\u01f5\u0001\u0000\u0000\u0000\u01f5"+
		"\u01f7\u0001\u0000\u0000\u0000\u01f6\u01f4\u0001\u0000\u0000\u0000\u01f7"+
		"\u01fb\u0003T*\u0000\u01f8\u01fa\u0005_\u0000\u0000\u01f9\u01f8\u0001"+
		"\u0000\u0000\u0000\u01fa\u01fd\u0001\u0000\u0000\u0000\u01fb\u01f9\u0001"+
		"\u0000\u0000\u0000\u01fb\u01fc\u0001\u0000\u0000\u0000\u01fc)\u0001\u0000"+
		"\u0000\u0000\u01fd\u01fb\u0001\u0000\u0000\u0000\u01fe\u0201\u0003V+\u0000"+
		"\u01ff\u0200\u0005\u0010\u0000\u0000\u0200\u0202\u0003V+\u0000\u0201\u01ff"+
		"\u0001\u0000\u0000\u0000\u0201\u0202\u0001\u0000\u0000\u0000\u0202+\u0001"+
		"\u0000\u0000\u0000\u0203\u0204\u0005\u000f\u0000\u0000\u0204\u0205\u0005"+
		"^\u0000\u0000\u0205\u0206\u0007\u0000\u0000\u0000\u0206\u0207\u0003V+"+
		"\u0000\u0207\u0208\u0005\u0010\u0000\u0000\u0208\u020b\u0003V+\u0000\u0209"+
		"\u020a\u0005\u0011\u0000\u0000\u020a\u020c\u0003V+\u0000\u020b\u0209\u0001"+
		"\u0000\u0000\u0000\u020b\u020c\u0001\u0000\u0000\u0000\u020c\u0210\u0001"+
		"\u0000\u0000\u0000\u020d\u020f\u0005_\u0000\u0000\u020e\u020d\u0001\u0000"+
		"\u0000\u0000\u020f\u0212\u0001\u0000\u0000\u0000\u0210\u020e\u0001\u0000"+
		"\u0000\u0000\u0210\u0211\u0001\u0000\u0000\u0000\u0211\u0213\u0001\u0000"+
		"\u0000\u0000\u0212\u0210\u0001\u0000\u0000\u0000\u0213\u0217\u0003T*\u0000"+
		"\u0214\u0216\u0005_\u0000\u0000\u0215\u0214\u0001\u0000\u0000\u0000\u0216"+
		"\u0219\u0001\u0000\u0000\u0000\u0217\u0215\u0001\u0000\u0000\u0000\u0217"+
		"\u0218\u0001\u0000\u0000\u0000\u0218\u021a\u0001\u0000\u0000\u0000\u0219"+
		"\u0217\u0001\u0000\u0000\u0000\u021a\u021b\u0005\u0012\u0000\u0000\u021b"+
		"\u021c\u0005^\u0000\u0000\u021c-\u0001\u0000\u0000\u0000\u021d\u021e\u0005"+
		"\u0013\u0000\u0000\u021e\u0220\u0003V+\u0000\u021f\u0221\u0005\u0014\u0000"+
		"\u0000\u0220\u021f\u0001\u0000\u0000\u0000\u0220\u0221\u0001\u0000\u0000"+
		"\u0000\u0221\u0225\u0001\u0000\u0000\u0000\u0222\u0224\u0005_\u0000\u0000"+
		"\u0223\u0222\u0001\u0000\u0000\u0000\u0224\u0227\u0001\u0000\u0000\u0000"+
		"\u0225\u0223\u0001\u0000\u0000\u0000\u0225\u0226\u0001\u0000\u0000\u0000"+
		"\u0226\u0228\u0001\u0000\u0000\u0000\u0227\u0225\u0001\u0000\u0000\u0000"+
		"\u0228\u022c\u0003T*\u0000\u0229\u022b\u0005_\u0000\u0000\u022a\u0229"+
		"\u0001\u0000\u0000\u0000\u022b\u022e\u0001\u0000\u0000\u0000\u022c\u022a"+
		"\u0001\u0000\u0000\u0000\u022c\u022d\u0001\u0000\u0000\u0000\u022d\u022f"+
		"\u0001\u0000\u0000\u0000\u022e\u022c\u0001\u0000\u0000\u0000\u022f\u0230"+
		"\u0005\u0015\u0000\u0000\u0230/\u0001\u0000\u0000\u0000\u0231\u0235\u0005"+
		"\u0016\u0000\u0000\u0232\u0234\u0005_\u0000\u0000\u0233\u0232\u0001\u0000"+
		"\u0000\u0000\u0234\u0237\u0001\u0000\u0000\u0000\u0235\u0233\u0001\u0000"+
		"\u0000\u0000\u0235\u0236\u0001\u0000\u0000\u0000\u0236\u0238\u0001\u0000"+
		"\u0000\u0000\u0237\u0235\u0001\u0000\u0000\u0000\u0238\u023c\u0003T*\u0000"+
		"\u0239\u023b\u0005_\u0000\u0000\u023a\u0239\u0001\u0000\u0000\u0000\u023b"+
		"\u023e\u0001\u0000\u0000\u0000\u023c\u023a\u0001\u0000\u0000\u0000\u023c"+
		"\u023d\u0001\u0000\u0000\u0000\u023d\u023f\u0001\u0000\u0000\u0000\u023e"+
		"\u023c\u0001\u0000\u0000\u0000\u023f\u0240\u0005\u0017\u0000\u0000\u0240"+
		"\u0241\u0003V+\u0000\u02411\u0001\u0000\u0000\u0000\u0242\u0243\u0005"+
		"\u0018\u0000\u0000\u0243\u0244\u0007\u0003\u0000\u0000\u0244\u0246\u0005"+
		"R\u0000\u0000\u0245\u0247\u00036\u001b\u0000\u0246\u0245\u0001\u0000\u0000"+
		"\u0000\u0246\u0247\u0001\u0000\u0000\u0000\u0247\u0248\u0001\u0000\u0000"+
		"\u0000\u0248\u024c\u0005S\u0000\u0000\u0249\u024b\u0005_\u0000\u0000\u024a"+
		"\u0249\u0001\u0000\u0000\u0000\u024b\u024e\u0001\u0000\u0000\u0000\u024c"+
		"\u024a\u0001\u0000\u0000\u0000\u024c\u024d\u0001\u0000\u0000\u0000\u024d"+
		"\u024f\u0001\u0000\u0000\u0000\u024e\u024c\u0001\u0000\u0000\u0000\u024f"+
		"\u0253\u0003T*\u0000\u0250\u0252\u0005_\u0000\u0000\u0251\u0250\u0001"+
		"\u0000\u0000\u0000\u0252\u0255\u0001\u0000\u0000\u0000\u0253\u0251\u0001"+
		"\u0000\u0000\u0000\u0253\u0254\u0001\u0000\u0000\u0000\u0254\u0256\u0001"+
		"\u0000\u0000\u0000\u0255\u0253\u0001\u0000\u0000\u0000\u0256\u0257\u0005"+
		"\u0019\u0000\u0000\u02573\u0001\u0000\u0000\u0000\u0258\u0259\u0005\u001a"+
		"\u0000\u0000\u0259\u025a\u0005^\u0000\u0000\u025a\u025c\u0005R\u0000\u0000"+
		"\u025b\u025d\u00036\u001b\u0000\u025c\u025b\u0001\u0000\u0000\u0000\u025c"+
		"\u025d\u0001\u0000\u0000\u0000\u025d\u025e\u0001\u0000\u0000\u0000\u025e"+
		"\u025f\u0005S\u0000\u0000\u025f\u0260\u0005\u001c\u0000\u0000\u0260\u0264"+
		"\u0003\n\u0005\u0000\u0261\u0263\u0005_\u0000\u0000\u0262\u0261\u0001"+
		"\u0000\u0000\u0000\u0263\u0266\u0001\u0000\u0000\u0000\u0264\u0262\u0001"+
		"\u0000\u0000\u0000\u0264\u0265\u0001\u0000\u0000\u0000\u0265\u0267\u0001"+
		"\u0000\u0000\u0000\u0266\u0264\u0001\u0000\u0000\u0000\u0267\u026b\u0003"+
		"T*\u0000\u0268\u026a\u0005_\u0000\u0000\u0269\u0268\u0001\u0000\u0000"+
		"\u0000\u026a\u026d\u0001\u0000\u0000\u0000\u026b\u0269\u0001\u0000\u0000"+
		"\u0000\u026b\u026c\u0001\u0000\u0000\u0000\u026c\u026e\u0001\u0000\u0000"+
		"\u0000\u026d\u026b\u0001\u0000\u0000\u0000\u026e\u026f\u0005\u001b\u0000"+
		"\u0000\u026f5\u0001\u0000\u0000\u0000\u0270\u0275\u00038\u001c\u0000\u0271"+
		"\u0272\u0005V\u0000\u0000\u0272\u0274\u00038\u001c\u0000\u0273\u0271\u0001"+
		"\u0000\u0000\u0000\u0274\u0277\u0001\u0000\u0000\u0000\u0275\u0273\u0001"+
		"\u0000\u0000\u0000\u0275\u0276\u0001\u0000\u0000\u0000\u02767\u0001\u0000"+
		"\u0000\u0000\u0277\u0275\u0001\u0000\u0000\u0000\u0278\u027a\u0007\u0005"+
		"\u0000\u0000\u0279\u0278\u0001\u0000\u0000\u0000\u0279\u027a\u0001\u0000"+
		"\u0000\u0000\u027a\u027b\u0001\u0000\u0000\u0000\u027b\u027c\u0005^\u0000"+
		"\u0000\u027c\u027d\u0005W\u0000\u0000\u027d\u027e\u0003\n\u0005\u0000"+
		"\u027e9\u0001\u0000\u0000\u0000\u027f\u0280\u0005\u001e\u0000\u0000\u0280"+
		"\u0281\u0005^\u0000\u0000\u0281\u0283\u0005R\u0000\u0000\u0282\u0284\u0003"+
		"R)\u0000\u0283\u0282\u0001\u0000\u0000\u0000\u0283\u0284\u0001\u0000\u0000"+
		"\u0000\u0284\u0285\u0001\u0000\u0000\u0000\u0285\u0289\u0005S\u0000\u0000"+
		"\u0286\u0287\u0005\u001e\u0000\u0000\u0287\u0289\u0003<\u001e\u0000\u0288"+
		"\u027f\u0001\u0000\u0000\u0000\u0288\u0286\u0001\u0000\u0000\u0000\u0289"+
		";\u0001\u0000\u0000\u0000\u028a\u028e\u0007\u0002\u0000\u0000\u028b\u028d"+
		"\u0003\u0016\u000b\u0000\u028c\u028b\u0001\u0000\u0000\u0000\u028d\u0290"+
		"\u0001\u0000\u0000\u0000\u028e\u028c\u0001\u0000\u0000\u0000\u028e\u028f"+
		"\u0001\u0000\u0000\u0000\u028f\u0291\u0001\u0000\u0000\u0000\u0290\u028e"+
		"\u0001\u0000\u0000\u0000\u0291\u0292\u0005X\u0000\u0000\u0292\u0293\u0003"+
		"\u0018\f\u0000\u0293\u0295\u0005R\u0000\u0000\u0294\u0296\u0003R)\u0000"+
		"\u0295\u0294\u0001\u0000\u0000\u0000\u0295\u0296\u0001\u0000\u0000\u0000"+
		"\u0296\u0297\u0001\u0000\u0000\u0000\u0297\u0298\u0005S\u0000\u0000\u0298"+
		"=\u0001\u0000\u0000\u0000\u0299\u029a\u0003<\u001e\u0000\u029a?\u0001"+
		"\u0000\u0000\u0000\u029b\u029c\u0005\u001d\u0000\u0000\u029c\u029d\u0003"+
		"V+\u0000\u029dA\u0001\u0000\u0000\u0000\u029e\u029f\u0005\'\u0000\u0000"+
		"\u029f\u02a0\u0003V+\u0000\u02a0\u02a1\u0005\u000f\u0000\u0000\u02a1\u02a2"+
		"\u0003P(\u0000\u02a2C\u0001\u0000\u0000\u0000\u02a3\u02a4\u0005(\u0000"+
		"\u0000\u02a4\u02a5\u0003V+\u0000\u02a5\u02a6\u0005V\u0000\u0000\u02a6"+
		"\u02a7\u0003\u0014\n\u0000\u02a7E\u0001\u0000\u0000\u0000\u02a8\u02a9"+
		"\u0005)\u0000\u0000\u02a9\u02aa\u0003V+\u0000\u02aa\u02ab\u0005V\u0000"+
		"\u0000\u02ab\u02ac\u0003V+\u0000\u02acG\u0001\u0000\u0000\u0000\u02ad"+
		"\u02ae\u0005*\u0000\u0000\u02ae\u02af\u0003V+\u0000\u02afI\u0001\u0000"+
		"\u0000\u0000\u02b0\u02b1\u0005/\u0000\u0000\u02b1\u02b2\u0003V+\u0000"+
		"\u02b2\u02b3\u0005V\u0000\u0000\u02b3\u02b4\u0003V+\u0000\u02b4K\u0001"+
		"\u0000\u0000\u0000\u02b5\u02b6\u00050\u0000\u0000\u02b6\u02b7\u0003V+"+
		"\u0000\u02b7\u02b8\u0005V\u0000\u0000\u02b8\u02b9\u0003\u0014\n\u0000"+
		"\u02b9M\u0001\u0000\u0000\u0000\u02ba\u02bb\u00051\u0000\u0000\u02bb\u02bc"+
		"\u0003V+\u0000\u02bc\u02bd\u0005V\u0000\u0000\u02bd\u02be\u0003\u0014"+
		"\n\u0000\u02beO\u0001\u0000\u0000\u0000\u02bf\u02c0\u0007\u0006\u0000"+
		"\u0000\u02c0Q\u0001\u0000\u0000\u0000\u02c1\u02c6\u0003V+\u0000\u02c2"+
		"\u02c3\u0005V\u0000\u0000\u02c3\u02c5\u0003V+\u0000\u02c4\u02c2\u0001"+
		"\u0000\u0000\u0000\u02c5\u02c8\u0001\u0000\u0000\u0000\u02c6\u02c4\u0001"+
		"\u0000\u0000\u0000\u02c6\u02c7\u0001\u0000\u0000\u0000\u02c7S\u0001\u0000"+
		"\u0000\u0000\u02c8\u02c6\u0001\u0000\u0000\u0000\u02c9\u02d3\u0003\u0002"+
		"\u0001\u0000\u02ca\u02cc\u0005_\u0000\u0000\u02cb\u02ca\u0001\u0000\u0000"+
		"\u0000\u02cc\u02cf\u0001\u0000\u0000\u0000\u02cd\u02cb\u0001\u0000\u0000"+
		"\u0000\u02cd\u02ce\u0001\u0000\u0000\u0000\u02ce\u02d0\u0001\u0000\u0000"+
		"\u0000\u02cf\u02cd\u0001\u0000\u0000\u0000\u02d0\u02d2\u0003\u0002\u0001"+
		"\u0000\u02d1\u02cd\u0001\u0000\u0000\u0000\u02d2\u02d5\u0001\u0000\u0000"+
		"\u0000\u02d3\u02d1\u0001\u0000\u0000\u0000\u02d3\u02d4\u0001\u0000\u0000"+
		"\u0000\u02d4U\u0001\u0000\u0000\u0000\u02d5\u02d3\u0001\u0000\u0000\u0000"+
		"\u02d6\u02d7\u0006+\uffff\uffff\u0000\u02d7\u02d8\u0005\"\u0000\u0000"+
		"\u02d8\u02dd\u0003V+\n\u02d9\u02da\u0005M\u0000\u0000\u02da\u02dd\u0003"+
		"V+\t\u02db\u02dd\u0003X,\u0000\u02dc\u02d6\u0001\u0000\u0000\u0000\u02dc"+
		"\u02d9\u0001\u0000\u0000\u0000\u02dc\u02db\u0001\u0000\u0000\u0000\u02dd"+
		"\u02f5\u0001\u0000\u0000\u0000\u02de\u02df\n\b\u0000\u0000\u02df\u02e0"+
		"\u0005P\u0000\u0000\u02e0\u02f4\u0003V+\b\u02e1\u02e2\n\u0007\u0000\u0000"+
		"\u02e2\u02e3\u0007\u0007\u0000\u0000\u02e3\u02f4\u0003V+\b\u02e4\u02e5"+
		"\n\u0006\u0000\u0000\u02e5\u02e6\u0007\b\u0000\u0000\u02e6\u02f4\u0003"+
		"V+\u0007\u02e7\u02e8\n\u0005\u0000\u0000\u02e8\u02e9\u0005Q\u0000\u0000"+
		"\u02e9\u02f4\u0003V+\u0006\u02ea\u02eb\n\u0004\u0000\u0000\u02eb\u02ec"+
		"\u0007\t\u0000\u0000\u02ec\u02f4\u0003V+\u0005\u02ed\u02ee\n\u0003\u0000"+
		"\u0000\u02ee\u02ef\u0005 \u0000\u0000\u02ef\u02f4\u0003V+\u0004\u02f0"+
		"\u02f1\n\u0002\u0000\u0000\u02f1\u02f2\u0005!\u0000\u0000\u02f2\u02f4"+
		"\u0003V+\u0003\u02f3\u02de\u0001\u0000\u0000\u0000\u02f3\u02e1\u0001\u0000"+
		"\u0000\u0000\u02f3\u02e4\u0001\u0000\u0000\u0000\u02f3\u02e7\u0001\u0000"+
		"\u0000\u0000\u02f3\u02ea\u0001\u0000\u0000\u0000\u02f3\u02ed\u0001\u0000"+
		"\u0000\u0000\u02f3\u02f0\u0001\u0000\u0000\u0000\u02f4\u02f7\u0001\u0000"+
		"\u0000\u0000\u02f5\u02f3\u0001\u0000\u0000\u0000\u02f5\u02f6\u0001\u0000"+
		"\u0000\u0000\u02f6W\u0001\u0000\u0000\u0000\u02f7\u02f5\u0001\u0000\u0000"+
		"\u0000\u02f8\u02f9\u0005R\u0000\u0000\u02f9\u02fa\u0003V+\u0000\u02fa"+
		"\u02fb\u0005S\u0000\u0000\u02fb\u0325\u0001\u0000\u0000\u0000\u02fc\u02fd"+
		"\u0005^\u0000\u0000\u02fd\u02ff\u0005R\u0000\u0000\u02fe\u0300\u0003R"+
		")\u0000\u02ff\u02fe\u0001\u0000\u0000\u0000\u02ff\u0300\u0001\u0000\u0000"+
		"\u0000\u0300\u0301\u0001\u0000\u0000\u0000\u0301\u0325\u0005S\u0000\u0000"+
		"\u0302\u0303\u0005=\u0000\u0000\u0303\u0304\u0005^\u0000\u0000\u0304\u0306"+
		"\u0005R\u0000\u0000\u0305\u0307\u0003R)\u0000\u0306\u0305\u0001\u0000"+
		"\u0000\u0000\u0306\u0307\u0001\u0000\u0000\u0000\u0307\u0308\u0001\u0000"+
		"\u0000\u0000\u0308\u0325\u0005S\u0000\u0000\u0309\u030a\u0005P\u0000\u0000"+
		"\u030a\u0325\u0003\u0014\n\u0000\u030b\u030c\u0005&\u0000\u0000\u030c"+
		"\u030d\u0005R\u0000\u0000\u030d\u030e\u0003V+\u0000\u030e\u030f\u0005"+
		"V\u0000\u0000\u030f\u0310\u0003V+\u0000\u0310\u0311\u0005S\u0000\u0000"+
		"\u0311\u0325\u0001\u0000\u0000\u0000\u0312\u0313\u0005%\u0000\u0000\u0313"+
		"\u0314\u0005R\u0000\u0000\u0314\u0315\u0003V+\u0000\u0315\u0316\u0005"+
		"V\u0000\u0000\u0316\u0317\u0003V+\u0000\u0317\u0318\u0005S\u0000\u0000"+
		"\u0318\u0325\u0001\u0000\u0000\u0000\u0319\u031a\u0005.\u0000\u0000\u031a"+
		"\u031b\u0005R\u0000\u0000\u031b\u0325\u0005S\u0000\u0000\u031c\u0325\u0003"+
		"\u0014\n\u0000\u031d\u0325\u0005[\u0000\u0000\u031e\u0325\u0005Z\u0000"+
		"\u0000\u031f\u0325\u0005Y\u0000\u0000\u0320\u0325\u0005\\\u0000\u0000"+
		"\u0321\u0325\u0005]\u0000\u0000\u0322\u0325\u0005#\u0000\u0000\u0323\u0325"+
		"\u0005$\u0000\u0000\u0324\u02f8\u0001\u0000\u0000\u0000\u0324\u02fc\u0001"+
		"\u0000\u0000\u0000\u0324\u0302\u0001\u0000\u0000\u0000\u0324\u0309\u0001"+
		"\u0000\u0000\u0000\u0324\u030b\u0001\u0000\u0000\u0000\u0324\u0312\u0001"+
		"\u0000\u0000\u0000\u0324\u0319\u0001\u0000\u0000\u0000\u0324\u031c\u0001"+
		"\u0000\u0000\u0000\u0324\u031d\u0001\u0000\u0000\u0000\u0324\u031e\u0001"+
		"\u0000\u0000\u0000\u0324\u031f\u0001\u0000\u0000\u0000\u0324\u0320\u0001"+
		"\u0000\u0000\u0000\u0324\u0321\u0001\u0000\u0000\u0000\u0324\u0322\u0001"+
		"\u0000\u0000\u0000\u0324\u0323\u0001\u0000\u0000\u0000\u0325Y\u0001\u0000"+
		"\u0000\u0000U]djmr\u0090\u00b3\u00ba\u00d2\u00d6\u00db\u00f4\u00fa\u00fe"+
		"\u0102\u0108\u0112\u0117\u011d\u0121\u0127\u012a\u0131\u0135\u0138\u013e"+
		"\u0147\u0150\u0153\u0156\u015f\u016a\u0174\u017c\u0180\u0185\u018c\u0194"+
		"\u0198\u019d\u01a4\u01aa\u01b1\u01b5\u01ba\u01c5\u01cb\u01cf\u01d4\u01db"+
		"\u01de\u01e3\u01ed\u01f4\u01fb\u0201\u020b\u0210\u0217\u0220\u0225\u022c"+
		"\u0235\u023c\u0246\u024c\u0253\u025c\u0264\u026b\u0275\u0279\u0283\u0288"+
		"\u028e\u0295\u02c6\u02cd\u02d3\u02dc\u02f3\u02f5\u02ff\u0306\u0324";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}