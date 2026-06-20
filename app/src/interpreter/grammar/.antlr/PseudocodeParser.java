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
		RULE_identifier = 4, RULE_constantStatement = 5, RULE_dataType = 6, RULE_typeDefinition = 7, 
		RULE_defineStatement = 8, RULE_classDeclaration = 9, RULE_classMember = 10, 
		RULE_designator = 11, RULE_designatorPart = 12, RULE_memberName = 13, 
		RULE_assignmentStatement = 14, RULE_singleAssignment = 15, RULE_inputStatement = 16, 
		RULE_outputStatement = 17, RULE_exprList = 18, RULE_ifStatement = 19, 
		RULE_caseStatement = 20, RULE_caseClause = 21, RULE_caseLabel = 22, RULE_forStatement = 23, 
		RULE_whileStatement = 24, RULE_repeatStatement = 25, RULE_procedureDeclaration = 26, 
		RULE_functionDeclaration = 27, RULE_paramList = 28, RULE_param = 29, RULE_callStatement = 30, 
		RULE_methodCall = 31, RULE_methodCallStatement = 32, RULE_returnStatement = 33, 
		RULE_openFileStatement = 34, RULE_readFileStatement = 35, RULE_writeFileStatement = 36, 
		RULE_closeFileStatement = 37, RULE_seekStatement = 38, RULE_getRecordStatement = 39, 
		RULE_putRecordStatement = 40, RULE_fileMode = 41, RULE_argList = 42, RULE_block = 43, 
		RULE_expr = 44, RULE_atom = 45;
	private static String[] makeRuleNames() {
		return new String[] {
			"program", "statement", "declareStatement", "identifierList", "identifier", 
			"constantStatement", "dataType", "typeDefinition", "defineStatement", 
			"classDeclaration", "classMember", "designator", "designatorPart", "memberName", 
			"assignmentStatement", "singleAssignment", "inputStatement", "outputStatement", 
			"exprList", "ifStatement", "caseStatement", "caseClause", "caseLabel", 
			"forStatement", "whileStatement", "repeatStatement", "procedureDeclaration", 
			"functionDeclaration", "paramList", "param", "callStatement", "methodCall", 
			"methodCallStatement", "returnStatement", "openFileStatement", "readFileStatement", 
			"writeFileStatement", "closeFileStatement", "seekStatement", "getRecordStatement", 
			"putRecordStatement", "fileMode", "argList", "block", "expr", "atom"
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
			setState(95);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,0,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(92);
					match(NEWLINE);
					}
					} 
				}
				setState(97);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,0,_ctx);
			}
			setState(111);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if ((((_la) & ~0x3f) == 0 && ((1L << _la) & 9076942928257517694L) != 0) || _la==DATE_TYPE || _la==IDENTIFIER) {
				{
				setState(98);
				statement();
				setState(108);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,2,_ctx);
				while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
					if ( _alt==1 ) {
						{
						{
						setState(102);
						_errHandler.sync(this);
						_la = _input.LA(1);
						while (_la==NEWLINE) {
							{
							{
							setState(99);
							match(NEWLINE);
							}
							}
							setState(104);
							_errHandler.sync(this);
							_la = _input.LA(1);
						}
						setState(105);
						statement();
						}
						} 
					}
					setState(110);
					_errHandler.sync(this);
					_alt = getInterpreter().adaptivePredict(_input,2,_ctx);
				}
				}
			}

			setState(116);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==NEWLINE) {
				{
				{
				setState(113);
				match(NEWLINE);
				}
				}
				setState(118);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(119);
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
			setState(146);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,5,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(121);
				declareStatement();
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(122);
				constantStatement();
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(123);
				typeDefinition();
				}
				break;
			case 4:
				enterOuterAlt(_localctx, 4);
				{
				setState(124);
				defineStatement();
				}
				break;
			case 5:
				enterOuterAlt(_localctx, 5);
				{
				setState(125);
				classDeclaration();
				}
				break;
			case 6:
				enterOuterAlt(_localctx, 6);
				{
				setState(126);
				assignmentStatement();
				}
				break;
			case 7:
				enterOuterAlt(_localctx, 7);
				{
				setState(127);
				inputStatement();
				}
				break;
			case 8:
				enterOuterAlt(_localctx, 8);
				{
				setState(128);
				outputStatement();
				}
				break;
			case 9:
				enterOuterAlt(_localctx, 9);
				{
				setState(129);
				ifStatement();
				}
				break;
			case 10:
				enterOuterAlt(_localctx, 10);
				{
				setState(130);
				caseStatement();
				}
				break;
			case 11:
				enterOuterAlt(_localctx, 11);
				{
				setState(131);
				forStatement();
				}
				break;
			case 12:
				enterOuterAlt(_localctx, 12);
				{
				setState(132);
				whileStatement();
				}
				break;
			case 13:
				enterOuterAlt(_localctx, 13);
				{
				setState(133);
				repeatStatement();
				}
				break;
			case 14:
				enterOuterAlt(_localctx, 14);
				{
				setState(134);
				procedureDeclaration();
				}
				break;
			case 15:
				enterOuterAlt(_localctx, 15);
				{
				setState(135);
				functionDeclaration();
				}
				break;
			case 16:
				enterOuterAlt(_localctx, 16);
				{
				setState(136);
				callStatement();
				}
				break;
			case 17:
				enterOuterAlt(_localctx, 17);
				{
				setState(137);
				methodCallStatement();
				}
				break;
			case 18:
				enterOuterAlt(_localctx, 18);
				{
				setState(138);
				returnStatement();
				}
				break;
			case 19:
				enterOuterAlt(_localctx, 19);
				{
				setState(139);
				openFileStatement();
				}
				break;
			case 20:
				enterOuterAlt(_localctx, 20);
				{
				setState(140);
				readFileStatement();
				}
				break;
			case 21:
				enterOuterAlt(_localctx, 21);
				{
				setState(141);
				writeFileStatement();
				}
				break;
			case 22:
				enterOuterAlt(_localctx, 22);
				{
				setState(142);
				closeFileStatement();
				}
				break;
			case 23:
				enterOuterAlt(_localctx, 23);
				{
				setState(143);
				seekStatement();
				}
				break;
			case 24:
				enterOuterAlt(_localctx, 24);
				{
				setState(144);
				getRecordStatement();
				}
				break;
			case 25:
				enterOuterAlt(_localctx, 25);
				{
				setState(145);
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
		public IdentifierContext identifier() {
			return getRuleContext(IdentifierContext.class,0);
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
			setState(181);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,6,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(148);
				match(DECLARE);
				setState(149);
				identifierList();
				setState(150);
				match(COLON);
				setState(151);
				match(ARRAY);
				setState(152);
				match(LBRACKET);
				setState(153);
				expr(0);
				setState(154);
				match(COLON);
				setState(155);
				expr(0);
				setState(156);
				match(RBRACKET);
				setState(157);
				match(OF);
				setState(158);
				dataType();
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(160);
				match(DECLARE);
				setState(161);
				identifier();
				setState(162);
				match(COLON);
				setState(163);
				match(ARRAY);
				setState(164);
				match(LBRACKET);
				setState(165);
				expr(0);
				setState(166);
				match(COLON);
				setState(167);
				expr(0);
				setState(168);
				match(COMMA);
				setState(169);
				expr(0);
				setState(170);
				match(COLON);
				setState(171);
				expr(0);
				setState(172);
				match(RBRACKET);
				setState(173);
				match(OF);
				setState(174);
				dataType();
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(176);
				match(DECLARE);
				setState(177);
				identifierList();
				setState(178);
				match(COLON);
				setState(179);
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
		public List<IdentifierContext> identifier() {
			return getRuleContexts(IdentifierContext.class);
		}
		public IdentifierContext identifier(int i) {
			return getRuleContext(IdentifierContext.class,i);
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
			setState(183);
			identifier();
			setState(188);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==COMMA) {
				{
				{
				setState(184);
				match(COMMA);
				setState(185);
				identifier();
				}
				}
				setState(190);
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
	public static class IdentifierContext extends ParserRuleContext {
		public TerminalNode IDENTIFIER() { return getToken(PseudocodeParser.IDENTIFIER, 0); }
		public TerminalNode TYPE() { return getToken(PseudocodeParser.TYPE, 0); }
		public TerminalNode SET() { return getToken(PseudocodeParser.SET, 0); }
		public TerminalNode DATE_TYPE() { return getToken(PseudocodeParser.DATE_TYPE, 0); }
		public TerminalNode RANDOM() { return getToken(PseudocodeParser.RANDOM, 0); }
		public TerminalNode NEW() { return getToken(PseudocodeParser.NEW, 0); }
		public TerminalNode CLASS() { return getToken(PseudocodeParser.CLASS, 0); }
		public TerminalNode SEEK() { return getToken(PseudocodeParser.SEEK, 0); }
		public TerminalNode DEFINE() { return getToken(PseudocodeParser.DEFINE, 0); }
		public TerminalNode INHERITS() { return getToken(PseudocodeParser.INHERITS, 0); }
		public TerminalNode PUBLIC() { return getToken(PseudocodeParser.PUBLIC, 0); }
		public TerminalNode PRIVATE() { return getToken(PseudocodeParser.PRIVATE, 0); }
		public TerminalNode BYREF() { return getToken(PseudocodeParser.BYREF, 0); }
		public TerminalNode BYVAL() { return getToken(PseudocodeParser.BYVAL, 0); }
		public TerminalNode GETRECORD() { return getToken(PseudocodeParser.GETRECORD, 0); }
		public TerminalNode PUTRECORD() { return getToken(PseudocodeParser.PUTRECORD, 0); }
		public IdentifierContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_identifier; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).enterIdentifier(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof PseudocodeListener ) ((PseudocodeListener)listener).exitIdentifier(this);
		}
	}

	public final IdentifierContext identifier() throws RecognitionException {
		IdentifierContext _localctx = new IdentifierContext(_ctx, getState());
		enterRule(_localctx, 8, RULE_identifier);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(191);
			_la = _input.LA(1);
			if ( !(((((_la - 46)) & ~0x3f) == 0 && ((1L << (_la - 46)) & 281474980968415L) != 0)) ) {
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
	public static class ConstantStatementContext extends ParserRuleContext {
		public TerminalNode CONSTANT() { return getToken(PseudocodeParser.CONSTANT, 0); }
		public IdentifierContext identifier() {
			return getRuleContext(IdentifierContext.class,0);
		}
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
		enterRule(_localctx, 10, RULE_constantStatement);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(193);
			match(CONSTANT);
			setState(194);
			identifier();
			setState(195);
			_la = _input.LA(1);
			if ( !(_la==LARROW || _la==EQUALS) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			setState(196);
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
		enterRule(_localctx, 12, RULE_dataType);
		int _la;
		try {
			setState(223);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case INTEGER_TYPE:
				enterOuterAlt(_localctx, 1);
				{
				setState(198);
				match(INTEGER_TYPE);
				}
				break;
			case REAL_TYPE:
				enterOuterAlt(_localctx, 2);
				{
				setState(199);
				match(REAL_TYPE);
				}
				break;
			case CHAR_TYPE:
				enterOuterAlt(_localctx, 3);
				{
				setState(200);
				match(CHAR_TYPE);
				}
				break;
			case STRING_TYPE:
				enterOuterAlt(_localctx, 4);
				{
				setState(201);
				match(STRING_TYPE);
				}
				break;
			case BOOLEAN_TYPE:
				enterOuterAlt(_localctx, 5);
				{
				setState(202);
				match(BOOLEAN_TYPE);
				}
				break;
			case DATE_TYPE:
				enterOuterAlt(_localctx, 6);
				{
				setState(203);
				match(DATE_TYPE);
				}
				break;
			case ARRAY:
				enterOuterAlt(_localctx, 7);
				{
				setState(204);
				match(ARRAY);
				setState(218);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==LBRACKET) {
					{
					setState(205);
					match(LBRACKET);
					setState(206);
					expr(0);
					setState(207);
					match(COLON);
					setState(208);
					expr(0);
					setState(214);
					_errHandler.sync(this);
					_la = _input.LA(1);
					if (_la==COMMA) {
						{
						setState(209);
						match(COMMA);
						setState(210);
						expr(0);
						setState(211);
						match(COLON);
						setState(212);
						expr(0);
						}
					}

					setState(216);
					match(RBRACKET);
					}
				}

				setState(220);
				match(OF);
				setState(221);
				dataType();
				}
				break;
			case IDENTIFIER:
				enterOuterAlt(_localctx, 8);
				{
				setState(222);
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
		enterRule(_localctx, 14, RULE_typeDefinition);
		int _la;
		try {
			setState(262);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,14,_ctx) ) {
			case 1:
				_localctx = new EnumTypeDefContext(_localctx);
				enterOuterAlt(_localctx, 1);
				{
				setState(225);
				match(TYPE);
				setState(226);
				match(IDENTIFIER);
				setState(227);
				match(EQUALS);
				setState(228);
				match(LPAREN);
				setState(229);
				identifierList();
				setState(230);
				match(RPAREN);
				}
				break;
			case 2:
				_localctx = new PointerTypeDefContext(_localctx);
				enterOuterAlt(_localctx, 2);
				{
				setState(232);
				match(TYPE);
				setState(233);
				match(IDENTIFIER);
				setState(234);
				match(EQUALS);
				setState(235);
				match(CARET);
				setState(236);
				dataType();
				}
				break;
			case 3:
				_localctx = new SetTypeDefContext(_localctx);
				enterOuterAlt(_localctx, 3);
				{
				setState(237);
				match(TYPE);
				setState(238);
				match(IDENTIFIER);
				setState(239);
				match(EQUALS);
				setState(240);
				match(SET);
				setState(241);
				match(OF);
				setState(242);
				dataType();
				}
				break;
			case 4:
				_localctx = new RecordTypeDefContext(_localctx);
				enterOuterAlt(_localctx, 4);
				{
				setState(243);
				match(TYPE);
				setState(244);
				match(IDENTIFIER);
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
				setState(258);
				_errHandler.sync(this);
				_la = _input.LA(1);
				while (_la==DECLARE) {
					{
					{
					setState(250);
					declareStatement();
					setState(252); 
					_errHandler.sync(this);
					_la = _input.LA(1);
					do {
						{
						{
						setState(251);
						match(NEWLINE);
						}
						}
						setState(254); 
						_errHandler.sync(this);
						_la = _input.LA(1);
					} while ( _la==NEWLINE );
					}
					}
					setState(260);
					_errHandler.sync(this);
					_la = _input.LA(1);
				}
				setState(261);
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
		public IdentifierContext identifier() {
			return getRuleContext(IdentifierContext.class,0);
		}
		public TerminalNode LPAREN() { return getToken(PseudocodeParser.LPAREN, 0); }
		public TerminalNode RPAREN() { return getToken(PseudocodeParser.RPAREN, 0); }
		public TerminalNode COLON() { return getToken(PseudocodeParser.COLON, 0); }
		public TerminalNode IDENTIFIER() { return getToken(PseudocodeParser.IDENTIFIER, 0); }
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
		enterRule(_localctx, 16, RULE_defineStatement);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(264);
			match(DEFINE);
			setState(265);
			identifier();
			setState(266);
			match(LPAREN);
			setState(268);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (((((_la - 34)) & ~0x3f) == 0 && ((1L << (_la - 34)) & 2270174869716856863L) != 0)) {
				{
				setState(267);
				exprList();
				}
			}

			setState(270);
			match(RPAREN);
			setState(271);
			match(COLON);
			setState(272);
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
		enterRule(_localctx, 18, RULE_classDeclaration);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(274);
			match(CLASS);
			setState(275);
			match(IDENTIFIER);
			setState(278);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==INHERITS) {
				{
				setState(276);
				match(INHERITS);
				setState(277);
				match(IDENTIFIER);
				}
			}

			setState(281); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(280);
				match(NEWLINE);
				}
				}
				setState(283); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==NEWLINE );
			setState(293);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while ((((_la) & ~0x3f) == 0 && ((1L << _la) & 4465248661877555202L) != 0) || _la==DATE_TYPE || _la==IDENTIFIER) {
				{
				{
				setState(285);
				classMember();
				setState(287); 
				_errHandler.sync(this);
				_la = _input.LA(1);
				do {
					{
					{
					setState(286);
					match(NEWLINE);
					}
					}
					setState(289); 
					_errHandler.sync(this);
					_la = _input.LA(1);
				} while ( _la==NEWLINE );
				}
				}
				setState(295);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(296);
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
		enterRule(_localctx, 20, RULE_classMember);
		int _la;
		try {
			setState(316);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,24,_ctx) ) {
			case 1:
				_localctx = new ClassFieldMemberContext(_localctx);
				enterOuterAlt(_localctx, 1);
				{
				setState(299);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,20,_ctx) ) {
				case 1:
					{
					setState(298);
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
					break;
				}
				setState(302);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==DECLARE) {
					{
					setState(301);
					match(DECLARE);
					}
				}

				setState(304);
				identifierList();
				setState(305);
				match(COLON);
				setState(306);
				dataType();
				}
				break;
			case 2:
				_localctx = new ClassProcMemberContext(_localctx);
				enterOuterAlt(_localctx, 2);
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
				procedureDeclaration();
				}
				break;
			case 3:
				_localctx = new ClassFuncMemberContext(_localctx);
				enterOuterAlt(_localctx, 3);
				{
				setState(313);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==PUBLIC || _la==PRIVATE) {
					{
					setState(312);
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

				setState(315);
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
		public IdentifierContext identifier() {
			return getRuleContext(IdentifierContext.class,0);
		}
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
		enterRule(_localctx, 22, RULE_designator);
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(320);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case RANDOM:
			case SEEK:
			case GETRECORD:
			case PUTRECORD:
			case TYPE:
			case SET:
			case DEFINE:
			case BYREF:
			case BYVAL:
			case CLASS:
			case INHERITS:
			case PUBLIC:
			case PRIVATE:
			case NEW:
			case DATE_TYPE:
			case IDENTIFIER:
				{
				setState(318);
				identifier();
				}
				break;
			case SUPER:
				{
				setState(319);
				match(SUPER);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			setState(325);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,26,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(322);
					designatorPart();
					}
					} 
				}
				setState(327);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,26,_ctx);
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
		enterRule(_localctx, 24, RULE_designatorPart);
		int _la;
		try {
			setState(349);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case LBRACKET:
				enterOuterAlt(_localctx, 1);
				{
				setState(328);
				match(LBRACKET);
				setState(329);
				expr(0);
				setState(334);
				_errHandler.sync(this);
				_la = _input.LA(1);
				while (_la==COMMA) {
					{
					{
					setState(330);
					match(COMMA);
					setState(331);
					expr(0);
					}
					}
					setState(336);
					_errHandler.sync(this);
					_la = _input.LA(1);
				}
				setState(337);
				match(RBRACKET);
				}
				break;
			case DOT:
				enterOuterAlt(_localctx, 2);
				{
				setState(339);
				match(DOT);
				setState(340);
				memberName();
				setState(346);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,29,_ctx) ) {
				case 1:
					{
					setState(341);
					match(LPAREN);
					setState(343);
					_errHandler.sync(this);
					_la = _input.LA(1);
					if (((((_la - 34)) & ~0x3f) == 0 && ((1L << (_la - 34)) & 2270174869716856863L) != 0)) {
						{
						setState(342);
						argList();
						}
					}

					setState(345);
					match(RPAREN);
					}
					break;
				}
				}
				break;
			case CARET:
				enterOuterAlt(_localctx, 3);
				{
				setState(348);
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
		public IdentifierContext identifier() {
			return getRuleContext(IdentifierContext.class,0);
		}
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
		enterRule(_localctx, 26, RULE_memberName);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(351);
			identifier();
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
		enterRule(_localctx, 28, RULE_assignmentStatement);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(353);
			singleAssignment();
			setState(358);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==COMMA) {
				{
				{
				setState(354);
				match(COMMA);
				setState(355);
				singleAssignment();
				}
				}
				setState(360);
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
		enterRule(_localctx, 30, RULE_singleAssignment);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(361);
			designator();
			setState(362);
			_la = _input.LA(1);
			if ( !(_la==LARROW || _la==EQUALS) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			setState(363);
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
		enterRule(_localctx, 32, RULE_inputStatement);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(365);
			match(INPUT);
			setState(366);
			designator();
			setState(369);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==COMMA) {
				{
				setState(367);
				match(COMMA);
				setState(368);
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
		enterRule(_localctx, 34, RULE_outputStatement);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(371);
			_la = _input.LA(1);
			if ( !(_la==OUTPUT || _la==PRINT) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			setState(372);
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
		enterRule(_localctx, 36, RULE_exprList);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(374);
			expr(0);
			setState(379);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==COMMA) {
				{
				{
				setState(375);
				match(COMMA);
				setState(376);
				expr(0);
				}
				}
				setState(381);
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
		public List<TerminalNode> IF() { return getTokens(PseudocodeParser.IF); }
		public TerminalNode IF(int i) {
			return getToken(PseudocodeParser.IF, i);
		}
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
		public List<TerminalNode> ELSE() { return getTokens(PseudocodeParser.ELSE); }
		public TerminalNode ELSE(int i) {
			return getToken(PseudocodeParser.ELSE, i);
		}
		public List<TerminalNode> ELSEIF() { return getTokens(PseudocodeParser.ELSEIF); }
		public TerminalNode ELSEIF(int i) {
			return getToken(PseudocodeParser.ELSEIF, i);
		}
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
		enterRule(_localctx, 38, RULE_ifStatement);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(382);
			match(IF);
			setState(383);
			expr(0);
			setState(387);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,34,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(384);
					match(NEWLINE);
					}
					} 
				}
				setState(389);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,34,_ctx);
			}
			setState(391);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==THEN) {
				{
				setState(390);
				match(THEN);
				}
			}

			setState(396);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,36,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(393);
					match(NEWLINE);
					}
					} 
				}
				setState(398);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,36,_ctx);
			}
			setState(399);
			block();
			setState(431);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,42,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(403);
					_errHandler.sync(this);
					_la = _input.LA(1);
					while (_la==NEWLINE) {
						{
						{
						setState(400);
						match(NEWLINE);
						}
						}
						setState(405);
						_errHandler.sync(this);
						_la = _input.LA(1);
					}
					setState(409);
					_errHandler.sync(this);
					switch (_input.LA(1)) {
					case ELSEIF:
						{
						setState(406);
						match(ELSEIF);
						}
						break;
					case ELSE:
						{
						setState(407);
						match(ELSE);
						setState(408);
						match(IF);
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					setState(411);
					expr(0);
					setState(415);
					_errHandler.sync(this);
					_alt = getInterpreter().adaptivePredict(_input,39,_ctx);
					while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
						if ( _alt==1 ) {
							{
							{
							setState(412);
							match(NEWLINE);
							}
							} 
						}
						setState(417);
						_errHandler.sync(this);
						_alt = getInterpreter().adaptivePredict(_input,39,_ctx);
					}
					setState(419);
					_errHandler.sync(this);
					_la = _input.LA(1);
					if (_la==THEN) {
						{
						setState(418);
						match(THEN);
						}
					}

					setState(424);
					_errHandler.sync(this);
					_alt = getInterpreter().adaptivePredict(_input,41,_ctx);
					while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
						if ( _alt==1 ) {
							{
							{
							setState(421);
							match(NEWLINE);
							}
							} 
						}
						setState(426);
						_errHandler.sync(this);
						_alt = getInterpreter().adaptivePredict(_input,41,_ctx);
					}
					setState(427);
					block();
					}
					} 
				}
				setState(433);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,42,_ctx);
			}
			setState(448);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,45,_ctx) ) {
			case 1:
				{
				setState(437);
				_errHandler.sync(this);
				_la = _input.LA(1);
				while (_la==NEWLINE) {
					{
					{
					setState(434);
					match(NEWLINE);
					}
					}
					setState(439);
					_errHandler.sync(this);
					_la = _input.LA(1);
				}
				setState(440);
				match(ELSE);
				setState(444);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,44,_ctx);
				while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
					if ( _alt==1 ) {
						{
						{
						setState(441);
						match(NEWLINE);
						}
						} 
					}
					setState(446);
					_errHandler.sync(this);
					_alt = getInterpreter().adaptivePredict(_input,44,_ctx);
				}
				setState(447);
				block();
				}
				break;
			}
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
			setState(456);
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
		enterRule(_localctx, 40, RULE_caseStatement);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(458);
			match(CASE);
			setState(459);
			match(OF);
			setState(460);
			designator();
			setState(464);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==NEWLINE) {
				{
				{
				setState(461);
				match(NEWLINE);
				}
				}
				setState(466);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(468); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(467);
				caseClause();
				}
				}
				setState(470); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( ((((_la - 34)) & ~0x3f) == 0 && ((1L << (_la - 34)) & 2270174869716856863L) != 0) );
			setState(489);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==OTHERWISE) {
				{
				setState(472);
				match(OTHERWISE);
				setState(474);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==COLON) {
					{
					setState(473);
					match(COLON);
					}
				}

				setState(479);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,50,_ctx);
				while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
					if ( _alt==1 ) {
						{
						{
						setState(476);
						match(NEWLINE);
						}
						} 
					}
					setState(481);
					_errHandler.sync(this);
					_alt = getInterpreter().adaptivePredict(_input,50,_ctx);
				}
				setState(482);
				block();
				setState(486);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,51,_ctx);
				while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
					if ( _alt==1 ) {
						{
						{
						setState(483);
						match(NEWLINE);
						}
						} 
					}
					setState(488);
					_errHandler.sync(this);
					_alt = getInterpreter().adaptivePredict(_input,51,_ctx);
				}
				}
			}

			setState(494);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==NEWLINE) {
				{
				{
				setState(491);
				match(NEWLINE);
				}
				}
				setState(496);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(497);
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
		enterRule(_localctx, 42, RULE_caseClause);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(499);
			caseLabel();
			setState(504);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==COMMA) {
				{
				{
				setState(500);
				match(COMMA);
				setState(501);
				caseLabel();
				}
				}
				setState(506);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(507);
			match(COLON);
			setState(511);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,55,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(508);
					match(NEWLINE);
					}
					} 
				}
				setState(513);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,55,_ctx);
			}
			setState(514);
			block();
			setState(518);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,56,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(515);
					match(NEWLINE);
					}
					} 
				}
				setState(520);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,56,_ctx);
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
		enterRule(_localctx, 44, RULE_caseLabel);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(521);
			expr(0);
			setState(524);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==TO) {
				{
				setState(522);
				match(TO);
				setState(523);
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
		public List<IdentifierContext> identifier() {
			return getRuleContexts(IdentifierContext.class);
		}
		public IdentifierContext identifier(int i) {
			return getRuleContext(IdentifierContext.class,i);
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
		enterRule(_localctx, 46, RULE_forStatement);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(526);
			match(FOR);
			setState(527);
			identifier();
			setState(528);
			_la = _input.LA(1);
			if ( !(_la==LARROW || _la==EQUALS) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			setState(529);
			expr(0);
			setState(530);
			match(TO);
			setState(531);
			expr(0);
			setState(534);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==STEP) {
				{
				setState(532);
				match(STEP);
				setState(533);
				expr(0);
				}
			}

			setState(539);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,59,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(536);
					match(NEWLINE);
					}
					} 
				}
				setState(541);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,59,_ctx);
			}
			setState(542);
			block();
			setState(546);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==NEWLINE) {
				{
				{
				setState(543);
				match(NEWLINE);
				}
				}
				setState(548);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(549);
			match(NEXT);
			setState(550);
			identifier();
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
		enterRule(_localctx, 48, RULE_whileStatement);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(552);
			match(WHILE);
			setState(553);
			expr(0);
			setState(555);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==DO) {
				{
				setState(554);
				match(DO);
				}
			}

			setState(560);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,62,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(557);
					match(NEWLINE);
					}
					} 
				}
				setState(562);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,62,_ctx);
			}
			setState(563);
			block();
			setState(567);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==NEWLINE) {
				{
				{
				setState(564);
				match(NEWLINE);
				}
				}
				setState(569);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(570);
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
		enterRule(_localctx, 50, RULE_repeatStatement);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(572);
			match(REPEAT);
			setState(576);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,64,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(573);
					match(NEWLINE);
					}
					} 
				}
				setState(578);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,64,_ctx);
			}
			setState(579);
			block();
			setState(583);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==NEWLINE) {
				{
				{
				setState(580);
				match(NEWLINE);
				}
				}
				setState(585);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(586);
			match(UNTIL);
			setState(587);
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
		public IdentifierContext identifier() {
			return getRuleContext(IdentifierContext.class,0);
		}
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
		enterRule(_localctx, 52, RULE_procedureDeclaration);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(589);
			match(PROCEDURE);
			setState(590);
			identifier();
			setState(591);
			match(LPAREN);
			setState(593);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (((((_la - 46)) & ~0x3f) == 0 && ((1L << (_la - 46)) & 281474980968415L) != 0)) {
				{
				setState(592);
				paramList();
				}
			}

			setState(595);
			match(RPAREN);
			setState(599);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,67,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(596);
					match(NEWLINE);
					}
					} 
				}
				setState(601);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,67,_ctx);
			}
			setState(602);
			block();
			setState(606);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==NEWLINE) {
				{
				{
				setState(603);
				match(NEWLINE);
				}
				}
				setState(608);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(609);
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
		public IdentifierContext identifier() {
			return getRuleContext(IdentifierContext.class,0);
		}
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
		enterRule(_localctx, 54, RULE_functionDeclaration);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(611);
			match(FUNCTION);
			setState(612);
			identifier();
			setState(613);
			match(LPAREN);
			setState(615);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (((((_la - 46)) & ~0x3f) == 0 && ((1L << (_la - 46)) & 281474980968415L) != 0)) {
				{
				setState(614);
				paramList();
				}
			}

			setState(617);
			match(RPAREN);
			setState(618);
			match(RETURNS);
			setState(619);
			dataType();
			setState(623);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,70,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(620);
					match(NEWLINE);
					}
					} 
				}
				setState(625);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,70,_ctx);
			}
			setState(626);
			block();
			setState(630);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==NEWLINE) {
				{
				{
				setState(627);
				match(NEWLINE);
				}
				}
				setState(632);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(633);
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
		enterRule(_localctx, 56, RULE_paramList);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(635);
			param();
			setState(640);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==COMMA) {
				{
				{
				setState(636);
				match(COMMA);
				setState(637);
				param();
				}
				}
				setState(642);
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
		public IdentifierContext identifier() {
			return getRuleContext(IdentifierContext.class,0);
		}
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
		enterRule(_localctx, 58, RULE_param);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(644);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,73,_ctx) ) {
			case 1:
				{
				setState(643);
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
				break;
			}
			setState(646);
			identifier();
			setState(647);
			match(COLON);
			setState(648);
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
		public IdentifierContext identifier() {
			return getRuleContext(IdentifierContext.class,0);
		}
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
		enterRule(_localctx, 60, RULE_callStatement);
		int _la;
		try {
			setState(660);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,75,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(650);
				match(CALL);
				setState(651);
				identifier();
				setState(652);
				match(LPAREN);
				setState(654);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (((((_la - 34)) & ~0x3f) == 0 && ((1L << (_la - 34)) & 2270174869716856863L) != 0)) {
					{
					setState(653);
					argList();
					}
				}

				setState(656);
				match(RPAREN);
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(658);
				match(CALL);
				setState(659);
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
		public IdentifierContext identifier() {
			return getRuleContext(IdentifierContext.class,0);
		}
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
		enterRule(_localctx, 62, RULE_methodCall);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(664);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case RANDOM:
			case SEEK:
			case GETRECORD:
			case PUTRECORD:
			case TYPE:
			case SET:
			case DEFINE:
			case BYREF:
			case BYVAL:
			case CLASS:
			case INHERITS:
			case PUBLIC:
			case PRIVATE:
			case NEW:
			case DATE_TYPE:
			case IDENTIFIER:
				{
				setState(662);
				identifier();
				}
				break;
			case SUPER:
				{
				setState(663);
				match(SUPER);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			setState(669);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,77,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(666);
					designatorPart();
					}
					} 
				}
				setState(671);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,77,_ctx);
			}
			setState(672);
			match(DOT);
			setState(673);
			memberName();
			setState(674);
			match(LPAREN);
			setState(676);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (((((_la - 34)) & ~0x3f) == 0 && ((1L << (_la - 34)) & 2270174869716856863L) != 0)) {
				{
				setState(675);
				argList();
				}
			}

			setState(678);
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
		enterRule(_localctx, 64, RULE_methodCallStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(680);
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
		enterRule(_localctx, 66, RULE_returnStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(682);
			match(RETURN);
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
		enterRule(_localctx, 68, RULE_openFileStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(685);
			match(OPENFILE);
			setState(686);
			expr(0);
			setState(687);
			match(FOR);
			setState(688);
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
		enterRule(_localctx, 70, RULE_readFileStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(690);
			match(READFILE);
			setState(691);
			expr(0);
			setState(692);
			match(COMMA);
			setState(693);
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
		enterRule(_localctx, 72, RULE_writeFileStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(695);
			match(WRITEFILE);
			setState(696);
			expr(0);
			setState(697);
			match(COMMA);
			setState(698);
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
		enterRule(_localctx, 74, RULE_closeFileStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(700);
			match(CLOSEFILE);
			setState(701);
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
		enterRule(_localctx, 76, RULE_seekStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(703);
			match(SEEK);
			setState(704);
			expr(0);
			setState(705);
			match(COMMA);
			setState(706);
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
		enterRule(_localctx, 78, RULE_getRecordStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(708);
			match(GETRECORD);
			setState(709);
			expr(0);
			setState(710);
			match(COMMA);
			setState(711);
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
		enterRule(_localctx, 80, RULE_putRecordStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(713);
			match(PUTRECORD);
			setState(714);
			expr(0);
			setState(715);
			match(COMMA);
			setState(716);
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
		enterRule(_localctx, 82, RULE_fileMode);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(718);
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
		enterRule(_localctx, 84, RULE_argList);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(720);
			expr(0);
			setState(725);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==COMMA) {
				{
				{
				setState(721);
				match(COMMA);
				setState(722);
				expr(0);
				}
				}
				setState(727);
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
		enterRule(_localctx, 86, RULE_block);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(741);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,82,_ctx) ) {
			case 1:
				{
				setState(728);
				statement();
				setState(738);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,81,_ctx);
				while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
					if ( _alt==1 ) {
						{
						{
						setState(732);
						_errHandler.sync(this);
						_la = _input.LA(1);
						while (_la==NEWLINE) {
							{
							{
							setState(729);
							match(NEWLINE);
							}
							}
							setState(734);
							_errHandler.sync(this);
							_la = _input.LA(1);
						}
						setState(735);
						statement();
						}
						} 
					}
					setState(740);
					_errHandler.sync(this);
					_alt = getInterpreter().adaptivePredict(_input,81,_ctx);
				}
				}
				break;
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
		int _startState = 88;
		enterRecursionRule(_localctx, 88, RULE_expr, _p);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(749);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case NOT:
				{
				_localctx = new NotExprContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;

				setState(744);
				match(NOT);
				setState(745);
				expr(10);
				}
				break;
			case MINUS:
				{
				_localctx = new UnaryMinusExprContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(746);
				match(MINUS);
				setState(747);
				expr(9);
				}
				break;
			case TRUE:
			case FALSE:
			case MOD:
			case DIV:
			case RANDOM:
			case SEEK:
			case GETRECORD:
			case PUTRECORD:
			case TYPE:
			case SET:
			case DEFINE:
			case BYREF:
			case BYVAL:
			case CLASS:
			case INHERITS:
			case PUBLIC:
			case PRIVATE:
			case NEW:
			case SUPER:
			case DATE_TYPE:
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
				setState(748);
				atom();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			_ctx.stop = _input.LT(-1);
			setState(774);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,85,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					if ( _parseListeners!=null ) triggerExitRuleEvent();
					_prevctx = _localctx;
					{
					setState(772);
					_errHandler.sync(this);
					switch ( getInterpreter().adaptivePredict(_input,84,_ctx) ) {
					case 1:
						{
						_localctx = new PowerExprContext(new ExprContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_expr);
						setState(751);
						if (!(precpred(_ctx, 8))) throw new FailedPredicateException(this, "precpred(_ctx, 8)");
						setState(752);
						match(CARET);
						setState(753);
						expr(8);
						}
						break;
					case 2:
						{
						_localctx = new MulDivExprContext(new ExprContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_expr);
						setState(754);
						if (!(precpred(_ctx, 7))) throw new FailedPredicateException(this, "precpred(_ctx, 7)");
						setState(755);
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
						setState(756);
						expr(8);
						}
						break;
					case 3:
						{
						_localctx = new AddSubExprContext(new ExprContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_expr);
						setState(757);
						if (!(precpred(_ctx, 6))) throw new FailedPredicateException(this, "precpred(_ctx, 6)");
						setState(758);
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
						setState(759);
						expr(7);
						}
						break;
					case 4:
						{
						_localctx = new ConcatExprContext(new ExprContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_expr);
						setState(760);
						if (!(precpred(_ctx, 5))) throw new FailedPredicateException(this, "precpred(_ctx, 5)");
						setState(761);
						match(AMPERSAND);
						setState(762);
						expr(6);
						}
						break;
					case 5:
						{
						_localctx = new ComparisonExprContext(new ExprContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_expr);
						setState(763);
						if (!(precpred(_ctx, 4))) throw new FailedPredicateException(this, "precpred(_ctx, 4)");
						setState(764);
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
						setState(765);
						expr(5);
						}
						break;
					case 6:
						{
						_localctx = new AndExprContext(new ExprContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_expr);
						setState(766);
						if (!(precpred(_ctx, 3))) throw new FailedPredicateException(this, "precpred(_ctx, 3)");
						setState(767);
						match(AND);
						setState(768);
						expr(4);
						}
						break;
					case 7:
						{
						_localctx = new OrExprContext(new ExprContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_expr);
						setState(769);
						if (!(precpred(_ctx, 2))) throw new FailedPredicateException(this, "precpred(_ctx, 2)");
						setState(770);
						match(OR);
						setState(771);
						expr(3);
						}
						break;
					}
					} 
				}
				setState(776);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,85,_ctx);
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
		public IdentifierContext identifier() {
			return getRuleContext(IdentifierContext.class,0);
		}
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
		enterRule(_localctx, 90, RULE_atom);
		int _la;
		try {
			setState(819);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,88,_ctx) ) {
			case 1:
				_localctx = new ParenAtomContext(_localctx);
				enterOuterAlt(_localctx, 1);
				{
				setState(777);
				match(LPAREN);
				setState(778);
				expr(0);
				setState(779);
				match(RPAREN);
				}
				break;
			case 2:
				_localctx = new FunctionCallAtomContext(_localctx);
				enterOuterAlt(_localctx, 2);
				{
				setState(781);
				identifier();
				setState(782);
				match(LPAREN);
				setState(784);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (((((_la - 34)) & ~0x3f) == 0 && ((1L << (_la - 34)) & 2270174869716856863L) != 0)) {
					{
					setState(783);
					argList();
					}
				}

				setState(786);
				match(RPAREN);
				}
				break;
			case 3:
				_localctx = new NewInstanceAtomContext(_localctx);
				enterOuterAlt(_localctx, 3);
				{
				setState(788);
				match(NEW);
				setState(789);
				match(IDENTIFIER);
				setState(790);
				match(LPAREN);
				setState(792);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (((((_la - 34)) & ~0x3f) == 0 && ((1L << (_la - 34)) & 2270174869716856863L) != 0)) {
					{
					setState(791);
					argList();
					}
				}

				setState(794);
				match(RPAREN);
				}
				break;
			case 4:
				_localctx = new AddressOfAtomContext(_localctx);
				enterOuterAlt(_localctx, 4);
				{
				setState(795);
				match(CARET);
				setState(796);
				designator();
				}
				break;
			case 5:
				_localctx = new DivFunctionAtomContext(_localctx);
				enterOuterAlt(_localctx, 5);
				{
				setState(797);
				match(DIV);
				setState(798);
				match(LPAREN);
				setState(799);
				expr(0);
				setState(800);
				match(COMMA);
				setState(801);
				expr(0);
				setState(802);
				match(RPAREN);
				}
				break;
			case 6:
				_localctx = new ModFunctionAtomContext(_localctx);
				enterOuterAlt(_localctx, 6);
				{
				setState(804);
				match(MOD);
				setState(805);
				match(LPAREN);
				setState(806);
				expr(0);
				setState(807);
				match(COMMA);
				setState(808);
				expr(0);
				setState(809);
				match(RPAREN);
				}
				break;
			case 7:
				_localctx = new DesignatorAtomContext(_localctx);
				enterOuterAlt(_localctx, 7);
				{
				setState(811);
				designator();
				}
				break;
			case 8:
				_localctx = new IntegerAtomContext(_localctx);
				enterOuterAlt(_localctx, 8);
				{
				setState(812);
				match(INTEGER_LITERAL);
				}
				break;
			case 9:
				_localctx = new RealAtomContext(_localctx);
				enterOuterAlt(_localctx, 9);
				{
				setState(813);
				match(REAL_LITERAL);
				}
				break;
			case 10:
				_localctx = new DateAtomContext(_localctx);
				enterOuterAlt(_localctx, 10);
				{
				setState(814);
				match(DATE_LITERAL);
				}
				break;
			case 11:
				_localctx = new StringAtomContext(_localctx);
				enterOuterAlt(_localctx, 11);
				{
				setState(815);
				match(STRING_LITERAL);
				}
				break;
			case 12:
				_localctx = new CharAtomContext(_localctx);
				enterOuterAlt(_localctx, 12);
				{
				setState(816);
				match(CHAR_LITERAL);
				}
				break;
			case 13:
				_localctx = new TrueAtomContext(_localctx);
				enterOuterAlt(_localctx, 13);
				{
				setState(817);
				match(TRUE);
				}
				break;
			case 14:
				_localctx = new FalseAtomContext(_localctx);
				enterOuterAlt(_localctx, 14);
				{
				setState(818);
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
		case 44:
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
		"\u0004\u0001a\u0336\u0002\u0000\u0007\u0000\u0002\u0001\u0007\u0001\u0002"+
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
		"(\u0007(\u0002)\u0007)\u0002*\u0007*\u0002+\u0007+\u0002,\u0007,\u0002"+
		"-\u0007-\u0001\u0000\u0005\u0000^\b\u0000\n\u0000\f\u0000a\t\u0000\u0001"+
		"\u0000\u0001\u0000\u0005\u0000e\b\u0000\n\u0000\f\u0000h\t\u0000\u0001"+
		"\u0000\u0005\u0000k\b\u0000\n\u0000\f\u0000n\t\u0000\u0003\u0000p\b\u0000"+
		"\u0001\u0000\u0005\u0000s\b\u0000\n\u0000\f\u0000v\t\u0000\u0001\u0000"+
		"\u0001\u0000\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001"+
		"\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001"+
		"\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001"+
		"\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001"+
		"\u0001\u0001\u0001\u0001\u0003\u0001\u0093\b\u0001\u0001\u0002\u0001\u0002"+
		"\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002"+
		"\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002"+
		"\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002"+
		"\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002"+
		"\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002"+
		"\u0001\u0002\u0003\u0002\u00b6\b\u0002\u0001\u0003\u0001\u0003\u0001\u0003"+
		"\u0005\u0003\u00bb\b\u0003\n\u0003\f\u0003\u00be\t\u0003\u0001\u0004\u0001"+
		"\u0004\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001"+
		"\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001"+
		"\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001"+
		"\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0003\u0006\u00d7\b\u0006\u0001"+
		"\u0006\u0001\u0006\u0003\u0006\u00db\b\u0006\u0001\u0006\u0001\u0006\u0001"+
		"\u0006\u0003\u0006\u00e0\b\u0006\u0001\u0007\u0001\u0007\u0001\u0007\u0001"+
		"\u0007\u0001\u0007\u0001\u0007\u0001\u0007\u0001\u0007\u0001\u0007\u0001"+
		"\u0007\u0001\u0007\u0001\u0007\u0001\u0007\u0001\u0007\u0001\u0007\u0001"+
		"\u0007\u0001\u0007\u0001\u0007\u0001\u0007\u0001\u0007\u0001\u0007\u0004"+
		"\u0007\u00f7\b\u0007\u000b\u0007\f\u0007\u00f8\u0001\u0007\u0001\u0007"+
		"\u0004\u0007\u00fd\b\u0007\u000b\u0007\f\u0007\u00fe\u0005\u0007\u0101"+
		"\b\u0007\n\u0007\f\u0007\u0104\t\u0007\u0001\u0007\u0003\u0007\u0107\b"+
		"\u0007\u0001\b\u0001\b\u0001\b\u0001\b\u0003\b\u010d\b\b\u0001\b\u0001"+
		"\b\u0001\b\u0001\b\u0001\t\u0001\t\u0001\t\u0001\t\u0003\t\u0117\b\t\u0001"+
		"\t\u0004\t\u011a\b\t\u000b\t\f\t\u011b\u0001\t\u0001\t\u0004\t\u0120\b"+
		"\t\u000b\t\f\t\u0121\u0005\t\u0124\b\t\n\t\f\t\u0127\t\t\u0001\t\u0001"+
		"\t\u0001\n\u0003\n\u012c\b\n\u0001\n\u0003\n\u012f\b\n\u0001\n\u0001\n"+
		"\u0001\n\u0001\n\u0001\n\u0003\n\u0136\b\n\u0001\n\u0001\n\u0003\n\u013a"+
		"\b\n\u0001\n\u0003\n\u013d\b\n\u0001\u000b\u0001\u000b\u0003\u000b\u0141"+
		"\b\u000b\u0001\u000b\u0005\u000b\u0144\b\u000b\n\u000b\f\u000b\u0147\t"+
		"\u000b\u0001\f\u0001\f\u0001\f\u0001\f\u0005\f\u014d\b\f\n\f\f\f\u0150"+
		"\t\f\u0001\f\u0001\f\u0001\f\u0001\f\u0001\f\u0001\f\u0003\f\u0158\b\f"+
		"\u0001\f\u0003\f\u015b\b\f\u0001\f\u0003\f\u015e\b\f\u0001\r\u0001\r\u0001"+
		"\u000e\u0001\u000e\u0001\u000e\u0005\u000e\u0165\b\u000e\n\u000e\f\u000e"+
		"\u0168\t\u000e\u0001\u000f\u0001\u000f\u0001\u000f\u0001\u000f\u0001\u0010"+
		"\u0001\u0010\u0001\u0010\u0001\u0010\u0003\u0010\u0172\b\u0010\u0001\u0011"+
		"\u0001\u0011\u0001\u0011\u0001\u0012\u0001\u0012\u0001\u0012\u0005\u0012"+
		"\u017a\b\u0012\n\u0012\f\u0012\u017d\t\u0012\u0001\u0013\u0001\u0013\u0001"+
		"\u0013\u0005\u0013\u0182\b\u0013\n\u0013\f\u0013\u0185\t\u0013\u0001\u0013"+
		"\u0003\u0013\u0188\b\u0013\u0001\u0013\u0005\u0013\u018b\b\u0013\n\u0013"+
		"\f\u0013\u018e\t\u0013\u0001\u0013\u0001\u0013\u0005\u0013\u0192\b\u0013"+
		"\n\u0013\f\u0013\u0195\t\u0013\u0001\u0013\u0001\u0013\u0001\u0013\u0003"+
		"\u0013\u019a\b\u0013\u0001\u0013\u0001\u0013\u0005\u0013\u019e\b\u0013"+
		"\n\u0013\f\u0013\u01a1\t\u0013\u0001\u0013\u0003\u0013\u01a4\b\u0013\u0001"+
		"\u0013\u0005\u0013\u01a7\b\u0013\n\u0013\f\u0013\u01aa\t\u0013\u0001\u0013"+
		"\u0001\u0013\u0005\u0013\u01ae\b\u0013\n\u0013\f\u0013\u01b1\t\u0013\u0001"+
		"\u0013\u0005\u0013\u01b4\b\u0013\n\u0013\f\u0013\u01b7\t\u0013\u0001\u0013"+
		"\u0001\u0013\u0005\u0013\u01bb\b\u0013\n\u0013\f\u0013\u01be\t\u0013\u0001"+
		"\u0013\u0003\u0013\u01c1\b\u0013\u0001\u0013\u0005\u0013\u01c4\b\u0013"+
		"\n\u0013\f\u0013\u01c7\t\u0013\u0001\u0013\u0001\u0013\u0001\u0014\u0001"+
		"\u0014\u0001\u0014\u0001\u0014\u0005\u0014\u01cf\b\u0014\n\u0014\f\u0014"+
		"\u01d2\t\u0014\u0001\u0014\u0004\u0014\u01d5\b\u0014\u000b\u0014\f\u0014"+
		"\u01d6\u0001\u0014\u0001\u0014\u0003\u0014\u01db\b\u0014\u0001\u0014\u0005"+
		"\u0014\u01de\b\u0014\n\u0014\f\u0014\u01e1\t\u0014\u0001\u0014\u0001\u0014"+
		"\u0005\u0014\u01e5\b\u0014\n\u0014\f\u0014\u01e8\t\u0014\u0003\u0014\u01ea"+
		"\b\u0014\u0001\u0014\u0005\u0014\u01ed\b\u0014\n\u0014\f\u0014\u01f0\t"+
		"\u0014\u0001\u0014\u0001\u0014\u0001\u0015\u0001\u0015\u0001\u0015\u0005"+
		"\u0015\u01f7\b\u0015\n\u0015\f\u0015\u01fa\t\u0015\u0001\u0015\u0001\u0015"+
		"\u0005\u0015\u01fe\b\u0015\n\u0015\f\u0015\u0201\t\u0015\u0001\u0015\u0001"+
		"\u0015\u0005\u0015\u0205\b\u0015\n\u0015\f\u0015\u0208\t\u0015\u0001\u0016"+
		"\u0001\u0016\u0001\u0016\u0003\u0016\u020d\b\u0016\u0001\u0017\u0001\u0017"+
		"\u0001\u0017\u0001\u0017\u0001\u0017\u0001\u0017\u0001\u0017\u0001\u0017"+
		"\u0003\u0017\u0217\b\u0017\u0001\u0017\u0005\u0017\u021a\b\u0017\n\u0017"+
		"\f\u0017\u021d\t\u0017\u0001\u0017\u0001\u0017\u0005\u0017\u0221\b\u0017"+
		"\n\u0017\f\u0017\u0224\t\u0017\u0001\u0017\u0001\u0017\u0001\u0017\u0001"+
		"\u0018\u0001\u0018\u0001\u0018\u0003\u0018\u022c\b\u0018\u0001\u0018\u0005"+
		"\u0018\u022f\b\u0018\n\u0018\f\u0018\u0232\t\u0018\u0001\u0018\u0001\u0018"+
		"\u0005\u0018\u0236\b\u0018\n\u0018\f\u0018\u0239\t\u0018\u0001\u0018\u0001"+
		"\u0018\u0001\u0019\u0001\u0019\u0005\u0019\u023f\b\u0019\n\u0019\f\u0019"+
		"\u0242\t\u0019\u0001\u0019\u0001\u0019\u0005\u0019\u0246\b\u0019\n\u0019"+
		"\f\u0019\u0249\t\u0019\u0001\u0019\u0001\u0019\u0001\u0019\u0001\u001a"+
		"\u0001\u001a\u0001\u001a\u0001\u001a\u0003\u001a\u0252\b\u001a\u0001\u001a"+
		"\u0001\u001a\u0005\u001a\u0256\b\u001a\n\u001a\f\u001a\u0259\t\u001a\u0001"+
		"\u001a\u0001\u001a\u0005\u001a\u025d\b\u001a\n\u001a\f\u001a\u0260\t\u001a"+
		"\u0001\u001a\u0001\u001a\u0001\u001b\u0001\u001b\u0001\u001b\u0001\u001b"+
		"\u0003\u001b\u0268\b\u001b\u0001\u001b\u0001\u001b\u0001\u001b\u0001\u001b"+
		"\u0005\u001b\u026e\b\u001b\n\u001b\f\u001b\u0271\t\u001b\u0001\u001b\u0001"+
		"\u001b\u0005\u001b\u0275\b\u001b\n\u001b\f\u001b\u0278\t\u001b\u0001\u001b"+
		"\u0001\u001b\u0001\u001c\u0001\u001c\u0001\u001c\u0005\u001c\u027f\b\u001c"+
		"\n\u001c\f\u001c\u0282\t\u001c\u0001\u001d\u0003\u001d\u0285\b\u001d\u0001"+
		"\u001d\u0001\u001d\u0001\u001d\u0001\u001d\u0001\u001e\u0001\u001e\u0001"+
		"\u001e\u0001\u001e\u0003\u001e\u028f\b\u001e\u0001\u001e\u0001\u001e\u0001"+
		"\u001e\u0001\u001e\u0003\u001e\u0295\b\u001e\u0001\u001f\u0001\u001f\u0003"+
		"\u001f\u0299\b\u001f\u0001\u001f\u0005\u001f\u029c\b\u001f\n\u001f\f\u001f"+
		"\u029f\t\u001f\u0001\u001f\u0001\u001f\u0001\u001f\u0001\u001f\u0003\u001f"+
		"\u02a5\b\u001f\u0001\u001f\u0001\u001f\u0001 \u0001 \u0001!\u0001!\u0001"+
		"!\u0001\"\u0001\"\u0001\"\u0001\"\u0001\"\u0001#\u0001#\u0001#\u0001#"+
		"\u0001#\u0001$\u0001$\u0001$\u0001$\u0001$\u0001%\u0001%\u0001%\u0001"+
		"&\u0001&\u0001&\u0001&\u0001&\u0001\'\u0001\'\u0001\'\u0001\'\u0001\'"+
		"\u0001(\u0001(\u0001(\u0001(\u0001(\u0001)\u0001)\u0001*\u0001*\u0001"+
		"*\u0005*\u02d4\b*\n*\f*\u02d7\t*\u0001+\u0001+\u0005+\u02db\b+\n+\f+\u02de"+
		"\t+\u0001+\u0005+\u02e1\b+\n+\f+\u02e4\t+\u0003+\u02e6\b+\u0001,\u0001"+
		",\u0001,\u0001,\u0001,\u0001,\u0003,\u02ee\b,\u0001,\u0001,\u0001,\u0001"+
		",\u0001,\u0001,\u0001,\u0001,\u0001,\u0001,\u0001,\u0001,\u0001,\u0001"+
		",\u0001,\u0001,\u0001,\u0001,\u0001,\u0001,\u0001,\u0005,\u0305\b,\n,"+
		"\f,\u0308\t,\u0001-\u0001-\u0001-\u0001-\u0001-\u0001-\u0001-\u0003-\u0311"+
		"\b-\u0001-\u0001-\u0001-\u0001-\u0001-\u0001-\u0003-\u0319\b-\u0001-\u0001"+
		"-\u0001-\u0001-\u0001-\u0001-\u0001-\u0001-\u0001-\u0001-\u0001-\u0001"+
		"-\u0001-\u0001-\u0001-\u0001-\u0001-\u0001-\u0001-\u0001-\u0001-\u0001"+
		"-\u0001-\u0001-\u0001-\u0003-\u0334\b-\u0001-\u0000\u0001X.\u0000\u0002"+
		"\u0004\u0006\b\n\f\u000e\u0010\u0012\u0014\u0016\u0018\u001a\u001c\u001e"+
		" \"$&(*,.02468:<>@BDFHJLNPRTVXZ\u0000\t\u0005\u0000.248:=DD^^\u0001\u0000"+
		"EF\u0001\u0000;<\u0001\u0000\u0004\u0005\u0001\u000067\u0001\u0000+.\u0002"+
		"\u0000%&NO\u0001\u0000LM\u0001\u0000FK\u0394\u0000_\u0001\u0000\u0000"+
		"\u0000\u0002\u0092\u0001\u0000\u0000\u0000\u0004\u00b5\u0001\u0000\u0000"+
		"\u0000\u0006\u00b7\u0001\u0000\u0000\u0000\b\u00bf\u0001\u0000\u0000\u0000"+
		"\n\u00c1\u0001\u0000\u0000\u0000\f\u00df\u0001\u0000\u0000\u0000\u000e"+
		"\u0106\u0001\u0000\u0000\u0000\u0010\u0108\u0001\u0000\u0000\u0000\u0012"+
		"\u0112\u0001\u0000\u0000\u0000\u0014\u013c\u0001\u0000\u0000\u0000\u0016"+
		"\u0140\u0001\u0000\u0000\u0000\u0018\u015d\u0001\u0000\u0000\u0000\u001a"+
		"\u015f\u0001\u0000\u0000\u0000\u001c\u0161\u0001\u0000\u0000\u0000\u001e"+
		"\u0169\u0001\u0000\u0000\u0000 \u016d\u0001\u0000\u0000\u0000\"\u0173"+
		"\u0001\u0000\u0000\u0000$\u0176\u0001\u0000\u0000\u0000&\u017e\u0001\u0000"+
		"\u0000\u0000(\u01ca\u0001\u0000\u0000\u0000*\u01f3\u0001\u0000\u0000\u0000"+
		",\u0209\u0001\u0000\u0000\u0000.\u020e\u0001\u0000\u0000\u00000\u0228"+
		"\u0001\u0000\u0000\u00002\u023c\u0001\u0000\u0000\u00004\u024d\u0001\u0000"+
		"\u0000\u00006\u0263\u0001\u0000\u0000\u00008\u027b\u0001\u0000\u0000\u0000"+
		":\u0284\u0001\u0000\u0000\u0000<\u0294\u0001\u0000\u0000\u0000>\u0298"+
		"\u0001\u0000\u0000\u0000@\u02a8\u0001\u0000\u0000\u0000B\u02aa\u0001\u0000"+
		"\u0000\u0000D\u02ad\u0001\u0000\u0000\u0000F\u02b2\u0001\u0000\u0000\u0000"+
		"H\u02b7\u0001\u0000\u0000\u0000J\u02bc\u0001\u0000\u0000\u0000L\u02bf"+
		"\u0001\u0000\u0000\u0000N\u02c4\u0001\u0000\u0000\u0000P\u02c9\u0001\u0000"+
		"\u0000\u0000R\u02ce\u0001\u0000\u0000\u0000T\u02d0\u0001\u0000\u0000\u0000"+
		"V\u02e5\u0001\u0000\u0000\u0000X\u02ed\u0001\u0000\u0000\u0000Z\u0333"+
		"\u0001\u0000\u0000\u0000\\^\u0005_\u0000\u0000]\\\u0001\u0000\u0000\u0000"+
		"^a\u0001\u0000\u0000\u0000_]\u0001\u0000\u0000\u0000_`\u0001\u0000\u0000"+
		"\u0000`o\u0001\u0000\u0000\u0000a_\u0001\u0000\u0000\u0000bl\u0003\u0002"+
		"\u0001\u0000ce\u0005_\u0000\u0000dc\u0001\u0000\u0000\u0000eh\u0001\u0000"+
		"\u0000\u0000fd\u0001\u0000\u0000\u0000fg\u0001\u0000\u0000\u0000gi\u0001"+
		"\u0000\u0000\u0000hf\u0001\u0000\u0000\u0000ik\u0003\u0002\u0001\u0000"+
		"jf\u0001\u0000\u0000\u0000kn\u0001\u0000\u0000\u0000lj\u0001\u0000\u0000"+
		"\u0000lm\u0001\u0000\u0000\u0000mp\u0001\u0000\u0000\u0000nl\u0001\u0000"+
		"\u0000\u0000ob\u0001\u0000\u0000\u0000op\u0001\u0000\u0000\u0000pt\u0001"+
		"\u0000\u0000\u0000qs\u0005_\u0000\u0000rq\u0001\u0000\u0000\u0000sv\u0001"+
		"\u0000\u0000\u0000tr\u0001\u0000\u0000\u0000tu\u0001\u0000\u0000\u0000"+
		"uw\u0001\u0000\u0000\u0000vt\u0001\u0000\u0000\u0000wx\u0005\u0000\u0000"+
		"\u0001x\u0001\u0001\u0000\u0000\u0000y\u0093\u0003\u0004\u0002\u0000z"+
		"\u0093\u0003\n\u0005\u0000{\u0093\u0003\u000e\u0007\u0000|\u0093\u0003"+
		"\u0010\b\u0000}\u0093\u0003\u0012\t\u0000~\u0093\u0003\u001c\u000e\u0000"+
		"\u007f\u0093\u0003 \u0010\u0000\u0080\u0093\u0003\"\u0011\u0000\u0081"+
		"\u0093\u0003&\u0013\u0000\u0082\u0093\u0003(\u0014\u0000\u0083\u0093\u0003"+
		".\u0017\u0000\u0084\u0093\u00030\u0018\u0000\u0085\u0093\u00032\u0019"+
		"\u0000\u0086\u0093\u00034\u001a\u0000\u0087\u0093\u00036\u001b\u0000\u0088"+
		"\u0093\u0003<\u001e\u0000\u0089\u0093\u0003@ \u0000\u008a\u0093\u0003"+
		"B!\u0000\u008b\u0093\u0003D\"\u0000\u008c\u0093\u0003F#\u0000\u008d\u0093"+
		"\u0003H$\u0000\u008e\u0093\u0003J%\u0000\u008f\u0093\u0003L&\u0000\u0090"+
		"\u0093\u0003N\'\u0000\u0091\u0093\u0003P(\u0000\u0092y\u0001\u0000\u0000"+
		"\u0000\u0092z\u0001\u0000\u0000\u0000\u0092{\u0001\u0000\u0000\u0000\u0092"+
		"|\u0001\u0000\u0000\u0000\u0092}\u0001\u0000\u0000\u0000\u0092~\u0001"+
		"\u0000\u0000\u0000\u0092\u007f\u0001\u0000\u0000\u0000\u0092\u0080\u0001"+
		"\u0000\u0000\u0000\u0092\u0081\u0001\u0000\u0000\u0000\u0092\u0082\u0001"+
		"\u0000\u0000\u0000\u0092\u0083\u0001\u0000\u0000\u0000\u0092\u0084\u0001"+
		"\u0000\u0000\u0000\u0092\u0085\u0001\u0000\u0000\u0000\u0092\u0086\u0001"+
		"\u0000\u0000\u0000\u0092\u0087\u0001\u0000\u0000\u0000\u0092\u0088\u0001"+
		"\u0000\u0000\u0000\u0092\u0089\u0001\u0000\u0000\u0000\u0092\u008a\u0001"+
		"\u0000\u0000\u0000\u0092\u008b\u0001\u0000\u0000\u0000\u0092\u008c\u0001"+
		"\u0000\u0000\u0000\u0092\u008d\u0001\u0000\u0000\u0000\u0092\u008e\u0001"+
		"\u0000\u0000\u0000\u0092\u008f\u0001\u0000\u0000\u0000\u0092\u0090\u0001"+
		"\u0000\u0000\u0000\u0092\u0091\u0001\u0000\u0000\u0000\u0093\u0003\u0001"+
		"\u0000\u0000\u0000\u0094\u0095\u0005\u0001\u0000\u0000\u0095\u0096\u0003"+
		"\u0006\u0003\u0000\u0096\u0097\u0005W\u0000\u0000\u0097\u0098\u0005\u001f"+
		"\u0000\u0000\u0098\u0099\u0005T\u0000\u0000\u0099\u009a\u0003X,\u0000"+
		"\u009a\u009b\u0005W\u0000\u0000\u009b\u009c\u0003X,\u0000\u009c\u009d"+
		"\u0005U\u0000\u0000\u009d\u009e\u0005\f\u0000\u0000\u009e\u009f\u0003"+
		"\f\u0006\u0000\u009f\u00b6\u0001\u0000\u0000\u0000\u00a0\u00a1\u0005\u0001"+
		"\u0000\u0000\u00a1\u00a2\u0003\b\u0004\u0000\u00a2\u00a3\u0005W\u0000"+
		"\u0000\u00a3\u00a4\u0005\u001f\u0000\u0000\u00a4\u00a5\u0005T\u0000\u0000"+
		"\u00a5\u00a6\u0003X,\u0000\u00a6\u00a7\u0005W\u0000\u0000\u00a7\u00a8"+
		"\u0003X,\u0000\u00a8\u00a9\u0005V\u0000\u0000\u00a9\u00aa\u0003X,\u0000"+
		"\u00aa\u00ab\u0005W\u0000\u0000\u00ab\u00ac\u0003X,\u0000\u00ac\u00ad"+
		"\u0005U\u0000\u0000\u00ad\u00ae\u0005\f\u0000\u0000\u00ae\u00af\u0003"+
		"\f\u0006\u0000\u00af\u00b6\u0001\u0000\u0000\u0000\u00b0\u00b1\u0005\u0001"+
		"\u0000\u0000\u00b1\u00b2\u0003\u0006\u0003\u0000\u00b2\u00b3\u0005W\u0000"+
		"\u0000\u00b3\u00b4\u0003\f\u0006\u0000\u00b4\u00b6\u0001\u0000\u0000\u0000"+
		"\u00b5\u0094\u0001\u0000\u0000\u0000\u00b5\u00a0\u0001\u0000\u0000\u0000"+
		"\u00b5\u00b0\u0001\u0000\u0000\u0000\u00b6\u0005\u0001\u0000\u0000\u0000"+
		"\u00b7\u00bc\u0003\b\u0004\u0000\u00b8\u00b9\u0005V\u0000\u0000\u00b9"+
		"\u00bb\u0003\b\u0004\u0000\u00ba\u00b8\u0001\u0000\u0000\u0000\u00bb\u00be"+
		"\u0001\u0000\u0000\u0000\u00bc\u00ba\u0001\u0000\u0000\u0000\u00bc\u00bd"+
		"\u0001\u0000\u0000\u0000\u00bd\u0007\u0001\u0000\u0000\u0000\u00be\u00bc"+
		"\u0001\u0000\u0000\u0000\u00bf\u00c0\u0007\u0000\u0000\u0000\u00c0\t\u0001"+
		"\u0000\u0000\u0000\u00c1\u00c2\u0005\u0002\u0000\u0000\u00c2\u00c3\u0003"+
		"\b\u0004\u0000\u00c3\u00c4\u0007\u0001\u0000\u0000\u00c4\u00c5\u0003X"+
		",\u0000\u00c5\u000b\u0001\u0000\u0000\u0000\u00c6\u00e0\u0005?\u0000\u0000"+
		"\u00c7\u00e0\u0005@\u0000\u0000\u00c8\u00e0\u0005A\u0000\u0000\u00c9\u00e0"+
		"\u0005B\u0000\u0000\u00ca\u00e0\u0005C\u0000\u0000\u00cb\u00e0\u0005D"+
		"\u0000\u0000\u00cc\u00da\u0005\u001f\u0000\u0000\u00cd\u00ce\u0005T\u0000"+
		"\u0000\u00ce\u00cf\u0003X,\u0000\u00cf\u00d0\u0005W\u0000\u0000\u00d0"+
		"\u00d6\u0003X,\u0000\u00d1\u00d2\u0005V\u0000\u0000\u00d2\u00d3\u0003"+
		"X,\u0000\u00d3\u00d4\u0005W\u0000\u0000\u00d4\u00d5\u0003X,\u0000\u00d5"+
		"\u00d7\u0001\u0000\u0000\u0000\u00d6\u00d1\u0001\u0000\u0000\u0000\u00d6"+
		"\u00d7\u0001\u0000\u0000\u0000\u00d7\u00d8\u0001\u0000\u0000\u0000\u00d8"+
		"\u00d9\u0005U\u0000\u0000\u00d9\u00db\u0001\u0000\u0000\u0000\u00da\u00cd"+
		"\u0001\u0000\u0000\u0000\u00da\u00db\u0001\u0000\u0000\u0000\u00db\u00dc"+
		"\u0001\u0000\u0000\u0000\u00dc\u00dd\u0005\f\u0000\u0000\u00dd\u00e0\u0003"+
		"\f\u0006\u0000\u00de\u00e0\u0005^\u0000\u0000\u00df\u00c6\u0001\u0000"+
		"\u0000\u0000\u00df\u00c7\u0001\u0000\u0000\u0000\u00df\u00c8\u0001\u0000"+
		"\u0000\u0000\u00df\u00c9\u0001\u0000\u0000\u0000\u00df\u00ca\u0001\u0000"+
		"\u0000\u0000\u00df\u00cb\u0001\u0000\u0000\u0000\u00df\u00cc\u0001\u0000"+
		"\u0000\u0000\u00df\u00de\u0001\u0000\u0000\u0000\u00e0\r\u0001\u0000\u0000"+
		"\u0000\u00e1\u00e2\u00052\u0000\u0000\u00e2\u00e3\u0005^\u0000\u0000\u00e3"+
		"\u00e4\u0005F\u0000\u0000\u00e4\u00e5\u0005R\u0000\u0000\u00e5\u00e6\u0003"+
		"\u0006\u0003\u0000\u00e6\u00e7\u0005S\u0000\u0000\u00e7\u0107\u0001\u0000"+
		"\u0000\u0000\u00e8\u00e9\u00052\u0000\u0000\u00e9\u00ea\u0005^\u0000\u0000"+
		"\u00ea\u00eb\u0005F\u0000\u0000\u00eb\u00ec\u0005P\u0000\u0000\u00ec\u0107"+
		"\u0003\f\u0006\u0000\u00ed\u00ee\u00052\u0000\u0000\u00ee\u00ef\u0005"+
		"^\u0000\u0000\u00ef\u00f0\u0005F\u0000\u0000\u00f0\u00f1\u00054\u0000"+
		"\u0000\u00f1\u00f2\u0005\f\u0000\u0000\u00f2\u0107\u0003\f\u0006\u0000"+
		"\u00f3\u00f4\u00052\u0000\u0000\u00f4\u00f6\u0005^\u0000\u0000\u00f5\u00f7"+
		"\u0005_\u0000\u0000\u00f6\u00f5\u0001\u0000\u0000\u0000\u00f7\u00f8\u0001"+
		"\u0000\u0000\u0000\u00f8\u00f6\u0001\u0000\u0000\u0000\u00f8\u00f9\u0001"+
		"\u0000\u0000\u0000\u00f9\u0102\u0001\u0000\u0000\u0000\u00fa\u00fc\u0003"+
		"\u0004\u0002\u0000\u00fb\u00fd\u0005_\u0000\u0000\u00fc\u00fb\u0001\u0000"+
		"\u0000\u0000\u00fd\u00fe\u0001\u0000\u0000\u0000\u00fe\u00fc\u0001\u0000"+
		"\u0000\u0000\u00fe\u00ff\u0001\u0000\u0000\u0000\u00ff\u0101\u0001\u0000"+
		"\u0000\u0000\u0100\u00fa\u0001\u0000\u0000\u0000\u0101\u0104\u0001\u0000"+
		"\u0000\u0000\u0102\u0100\u0001\u0000\u0000\u0000\u0102\u0103\u0001\u0000"+
		"\u0000\u0000\u0103\u0105\u0001\u0000\u0000\u0000\u0104\u0102\u0001\u0000"+
		"\u0000\u0000\u0105\u0107\u00053\u0000\u0000\u0106\u00e1\u0001\u0000\u0000"+
		"\u0000\u0106\u00e8\u0001\u0000\u0000\u0000\u0106\u00ed\u0001\u0000\u0000"+
		"\u0000\u0106\u00f3\u0001\u0000\u0000\u0000\u0107\u000f\u0001\u0000\u0000"+
		"\u0000\u0108\u0109\u00055\u0000\u0000\u0109\u010a\u0003\b\u0004\u0000"+
		"\u010a\u010c\u0005R\u0000\u0000\u010b\u010d\u0003$\u0012\u0000\u010c\u010b"+
		"\u0001\u0000\u0000\u0000\u010c\u010d\u0001\u0000\u0000\u0000\u010d\u010e"+
		"\u0001\u0000\u0000\u0000\u010e\u010f\u0005S\u0000\u0000\u010f\u0110\u0005"+
		"W\u0000\u0000\u0110\u0111\u0005^\u0000\u0000\u0111\u0011\u0001\u0000\u0000"+
		"\u0000\u0112\u0113\u00058\u0000\u0000\u0113\u0116\u0005^\u0000\u0000\u0114"+
		"\u0115\u0005:\u0000\u0000\u0115\u0117\u0005^\u0000\u0000\u0116\u0114\u0001"+
		"\u0000\u0000\u0000\u0116\u0117\u0001\u0000\u0000\u0000\u0117\u0119\u0001"+
		"\u0000\u0000\u0000\u0118\u011a\u0005_\u0000\u0000\u0119\u0118\u0001\u0000"+
		"\u0000\u0000\u011a\u011b\u0001\u0000\u0000\u0000\u011b\u0119\u0001\u0000"+
		"\u0000\u0000\u011b\u011c\u0001\u0000\u0000\u0000\u011c\u0125\u0001\u0000"+
		"\u0000\u0000\u011d\u011f\u0003\u0014\n\u0000\u011e\u0120\u0005_\u0000"+
		"\u0000\u011f\u011e\u0001\u0000\u0000\u0000\u0120\u0121\u0001\u0000\u0000"+
		"\u0000\u0121\u011f\u0001\u0000\u0000\u0000\u0121\u0122\u0001\u0000\u0000"+
		"\u0000\u0122\u0124\u0001\u0000\u0000\u0000\u0123\u011d\u0001\u0000\u0000"+
		"\u0000\u0124\u0127\u0001\u0000\u0000\u0000\u0125\u0123\u0001\u0000\u0000"+
		"\u0000\u0125\u0126\u0001\u0000\u0000\u0000\u0126\u0128\u0001\u0000\u0000"+
		"\u0000\u0127\u0125\u0001\u0000\u0000\u0000\u0128\u0129\u00059\u0000\u0000"+
		"\u0129\u0013\u0001\u0000\u0000\u0000\u012a\u012c\u0007\u0002\u0000\u0000"+
		"\u012b\u012a\u0001\u0000\u0000\u0000\u012b\u012c\u0001\u0000\u0000\u0000"+
		"\u012c\u012e\u0001\u0000\u0000\u0000\u012d\u012f\u0005\u0001\u0000\u0000"+
		"\u012e\u012d\u0001\u0000\u0000\u0000\u012e\u012f\u0001\u0000\u0000\u0000"+
		"\u012f\u0130\u0001\u0000\u0000\u0000\u0130\u0131\u0003\u0006\u0003\u0000"+
		"\u0131\u0132\u0005W\u0000\u0000\u0132\u0133\u0003\f\u0006\u0000\u0133"+
		"\u013d\u0001\u0000\u0000\u0000\u0134\u0136\u0007\u0002\u0000\u0000\u0135"+
		"\u0134\u0001\u0000\u0000\u0000\u0135\u0136\u0001\u0000\u0000\u0000\u0136"+
		"\u0137\u0001\u0000\u0000\u0000\u0137\u013d\u00034\u001a\u0000\u0138\u013a"+
		"\u0007\u0002\u0000\u0000\u0139\u0138\u0001\u0000\u0000\u0000\u0139\u013a"+
		"\u0001\u0000\u0000\u0000\u013a\u013b\u0001\u0000\u0000\u0000\u013b\u013d"+
		"\u00036\u001b\u0000\u013c\u012b\u0001\u0000\u0000\u0000\u013c\u0135\u0001"+
		"\u0000\u0000\u0000\u013c\u0139\u0001\u0000\u0000\u0000\u013d\u0015\u0001"+
		"\u0000\u0000\u0000\u013e\u0141\u0003\b\u0004\u0000\u013f\u0141\u0005>"+
		"\u0000\u0000\u0140\u013e\u0001\u0000\u0000\u0000\u0140\u013f\u0001\u0000"+
		"\u0000\u0000\u0141\u0145\u0001\u0000\u0000\u0000\u0142\u0144\u0003\u0018"+
		"\f\u0000\u0143\u0142\u0001\u0000\u0000\u0000\u0144\u0147\u0001\u0000\u0000"+
		"\u0000\u0145\u0143\u0001\u0000\u0000\u0000\u0145\u0146\u0001\u0000\u0000"+
		"\u0000\u0146\u0017\u0001\u0000\u0000\u0000\u0147\u0145\u0001\u0000\u0000"+
		"\u0000\u0148\u0149\u0005T\u0000\u0000\u0149\u014e\u0003X,\u0000\u014a"+
		"\u014b\u0005V\u0000\u0000\u014b\u014d\u0003X,\u0000\u014c\u014a\u0001"+
		"\u0000\u0000\u0000\u014d\u0150\u0001\u0000\u0000\u0000\u014e\u014c\u0001"+
		"\u0000\u0000\u0000\u014e\u014f\u0001\u0000\u0000\u0000\u014f\u0151\u0001"+
		"\u0000\u0000\u0000\u0150\u014e\u0001\u0000\u0000\u0000\u0151\u0152\u0005"+
		"U\u0000\u0000\u0152\u015e\u0001\u0000\u0000\u0000\u0153\u0154\u0005X\u0000"+
		"\u0000\u0154\u015a\u0003\u001a\r\u0000\u0155\u0157\u0005R\u0000\u0000"+
		"\u0156\u0158\u0003T*\u0000\u0157\u0156\u0001\u0000\u0000\u0000\u0157\u0158"+
		"\u0001\u0000\u0000\u0000\u0158\u0159\u0001\u0000\u0000\u0000\u0159\u015b"+
		"\u0005S\u0000\u0000\u015a\u0155\u0001\u0000\u0000\u0000\u015a\u015b\u0001"+
		"\u0000\u0000\u0000\u015b\u015e\u0001\u0000\u0000\u0000\u015c\u015e\u0005"+
		"P\u0000\u0000\u015d\u0148\u0001\u0000\u0000\u0000\u015d\u0153\u0001\u0000"+
		"\u0000\u0000\u015d\u015c\u0001\u0000\u0000\u0000\u015e\u0019\u0001\u0000"+
		"\u0000\u0000\u015f\u0160\u0003\b\u0004\u0000\u0160\u001b\u0001\u0000\u0000"+
		"\u0000\u0161\u0166\u0003\u001e\u000f\u0000\u0162\u0163\u0005V\u0000\u0000"+
		"\u0163\u0165\u0003\u001e\u000f\u0000\u0164\u0162\u0001\u0000\u0000\u0000"+
		"\u0165\u0168\u0001\u0000\u0000\u0000\u0166\u0164\u0001\u0000\u0000\u0000"+
		"\u0166\u0167\u0001\u0000\u0000\u0000\u0167\u001d\u0001\u0000\u0000\u0000"+
		"\u0168\u0166\u0001\u0000\u0000\u0000\u0169\u016a\u0003\u0016\u000b\u0000"+
		"\u016a\u016b\u0007\u0001\u0000\u0000\u016b\u016c\u0003X,\u0000\u016c\u001f"+
		"\u0001\u0000\u0000\u0000\u016d\u016e\u0005\u0003\u0000\u0000\u016e\u0171"+
		"\u0003\u0016\u000b\u0000\u016f\u0170\u0005V\u0000\u0000\u0170\u0172\u0005"+
		"\\\u0000\u0000\u0171\u016f\u0001\u0000\u0000\u0000\u0171\u0172\u0001\u0000"+
		"\u0000\u0000\u0172!\u0001\u0000\u0000\u0000\u0173\u0174\u0007\u0003\u0000"+
		"\u0000\u0174\u0175\u0003$\u0012\u0000\u0175#\u0001\u0000\u0000\u0000\u0176"+
		"\u017b\u0003X,\u0000\u0177\u0178\u0005V\u0000\u0000\u0178\u017a\u0003"+
		"X,\u0000\u0179\u0177\u0001\u0000\u0000\u0000\u017a\u017d\u0001\u0000\u0000"+
		"\u0000\u017b\u0179\u0001\u0000\u0000\u0000\u017b\u017c\u0001\u0000\u0000"+
		"\u0000\u017c%\u0001\u0000\u0000\u0000\u017d\u017b\u0001\u0000\u0000\u0000"+
		"\u017e\u017f\u0005\u0006\u0000\u0000\u017f\u0183\u0003X,\u0000\u0180\u0182"+
		"\u0005_\u0000\u0000\u0181\u0180\u0001\u0000\u0000\u0000\u0182\u0185\u0001"+
		"\u0000\u0000\u0000\u0183\u0181\u0001\u0000\u0000\u0000\u0183\u0184\u0001"+
		"\u0000\u0000\u0000\u0184\u0187\u0001\u0000\u0000\u0000\u0185\u0183\u0001"+
		"\u0000\u0000\u0000\u0186\u0188\u0005\u0007\u0000\u0000\u0187\u0186\u0001"+
		"\u0000\u0000\u0000\u0187\u0188\u0001\u0000\u0000\u0000\u0188\u018c\u0001"+
		"\u0000\u0000\u0000\u0189\u018b\u0005_\u0000\u0000\u018a\u0189\u0001\u0000"+
		"\u0000\u0000\u018b\u018e\u0001\u0000\u0000\u0000\u018c\u018a\u0001\u0000"+
		"\u0000\u0000\u018c\u018d\u0001\u0000\u0000\u0000\u018d\u018f\u0001\u0000"+
		"\u0000\u0000\u018e\u018c\u0001\u0000\u0000\u0000\u018f\u01af\u0003V+\u0000"+
		"\u0190\u0192\u0005_\u0000\u0000\u0191\u0190\u0001\u0000\u0000\u0000\u0192"+
		"\u0195\u0001\u0000\u0000\u0000\u0193\u0191\u0001\u0000\u0000\u0000\u0193"+
		"\u0194\u0001\u0000\u0000\u0000\u0194\u0199\u0001\u0000\u0000\u0000\u0195"+
		"\u0193\u0001\u0000\u0000\u0000\u0196\u019a\u0005\t\u0000\u0000\u0197\u0198"+
		"\u0005\b\u0000\u0000\u0198\u019a\u0005\u0006\u0000\u0000\u0199\u0196\u0001"+
		"\u0000\u0000\u0000\u0199\u0197\u0001\u0000\u0000\u0000\u019a\u019b\u0001"+
		"\u0000\u0000\u0000\u019b\u019f\u0003X,\u0000\u019c\u019e\u0005_\u0000"+
		"\u0000\u019d\u019c\u0001\u0000\u0000\u0000\u019e\u01a1\u0001\u0000\u0000"+
		"\u0000\u019f\u019d\u0001\u0000\u0000\u0000\u019f\u01a0\u0001\u0000\u0000"+
		"\u0000\u01a0\u01a3\u0001\u0000\u0000\u0000\u01a1\u019f\u0001\u0000\u0000"+
		"\u0000\u01a2\u01a4\u0005\u0007\u0000\u0000\u01a3\u01a2\u0001\u0000\u0000"+
		"\u0000\u01a3\u01a4\u0001\u0000\u0000\u0000\u01a4\u01a8\u0001\u0000\u0000"+
		"\u0000\u01a5\u01a7\u0005_\u0000\u0000\u01a6\u01a5\u0001\u0000\u0000\u0000"+
		"\u01a7\u01aa\u0001\u0000\u0000\u0000\u01a8\u01a6\u0001\u0000\u0000\u0000"+
		"\u01a8\u01a9\u0001\u0000\u0000\u0000\u01a9\u01ab\u0001\u0000\u0000\u0000"+
		"\u01aa\u01a8\u0001\u0000\u0000\u0000\u01ab\u01ac\u0003V+\u0000\u01ac\u01ae"+
		"\u0001\u0000\u0000\u0000\u01ad\u0193\u0001\u0000\u0000\u0000\u01ae\u01b1"+
		"\u0001\u0000\u0000\u0000\u01af\u01ad\u0001\u0000\u0000\u0000\u01af\u01b0"+
		"\u0001\u0000\u0000\u0000\u01b0\u01c0\u0001\u0000\u0000\u0000\u01b1\u01af"+
		"\u0001\u0000\u0000\u0000\u01b2\u01b4\u0005_\u0000\u0000\u01b3\u01b2\u0001"+
		"\u0000\u0000\u0000\u01b4\u01b7\u0001\u0000\u0000\u0000\u01b5\u01b3\u0001"+
		"\u0000\u0000\u0000\u01b5\u01b6\u0001\u0000\u0000\u0000\u01b6\u01b8\u0001"+
		"\u0000\u0000\u0000\u01b7\u01b5\u0001\u0000\u0000\u0000\u01b8\u01bc\u0005"+
		"\b\u0000\u0000\u01b9\u01bb\u0005_\u0000\u0000\u01ba\u01b9\u0001\u0000"+
		"\u0000\u0000\u01bb\u01be\u0001\u0000\u0000\u0000\u01bc\u01ba\u0001\u0000"+
		"\u0000\u0000\u01bc\u01bd\u0001\u0000\u0000\u0000\u01bd\u01bf\u0001\u0000"+
		"\u0000\u0000\u01be\u01bc\u0001\u0000\u0000\u0000\u01bf\u01c1\u0003V+\u0000"+
		"\u01c0\u01b5\u0001\u0000\u0000\u0000\u01c0\u01c1\u0001\u0000\u0000\u0000"+
		"\u01c1\u01c5\u0001\u0000\u0000\u0000\u01c2\u01c4\u0005_\u0000\u0000\u01c3"+
		"\u01c2\u0001\u0000\u0000\u0000\u01c4\u01c7\u0001\u0000\u0000\u0000\u01c5"+
		"\u01c3\u0001\u0000\u0000\u0000\u01c5\u01c6\u0001\u0000\u0000\u0000\u01c6"+
		"\u01c8\u0001\u0000\u0000\u0000\u01c7\u01c5\u0001\u0000\u0000\u0000\u01c8"+
		"\u01c9\u0005\n\u0000\u0000\u01c9\'\u0001\u0000\u0000\u0000\u01ca\u01cb"+
		"\u0005\u000b\u0000\u0000\u01cb\u01cc\u0005\f\u0000\u0000\u01cc\u01d0\u0003"+
		"\u0016\u000b\u0000\u01cd\u01cf\u0005_\u0000\u0000\u01ce\u01cd\u0001\u0000"+
		"\u0000\u0000\u01cf\u01d2\u0001\u0000\u0000\u0000\u01d0\u01ce\u0001\u0000"+
		"\u0000\u0000\u01d0\u01d1\u0001\u0000\u0000\u0000\u01d1\u01d4\u0001\u0000"+
		"\u0000\u0000\u01d2\u01d0\u0001\u0000\u0000\u0000\u01d3\u01d5\u0003*\u0015"+
		"\u0000\u01d4\u01d3\u0001\u0000\u0000\u0000\u01d5\u01d6\u0001\u0000\u0000"+
		"\u0000\u01d6\u01d4\u0001\u0000\u0000\u0000\u01d6\u01d7\u0001\u0000\u0000"+
		"\u0000\u01d7\u01e9\u0001\u0000\u0000\u0000\u01d8\u01da\u0005\r\u0000\u0000"+
		"\u01d9\u01db\u0005W\u0000\u0000\u01da\u01d9\u0001\u0000\u0000\u0000\u01da"+
		"\u01db\u0001\u0000\u0000\u0000\u01db\u01df\u0001\u0000\u0000\u0000\u01dc"+
		"\u01de\u0005_\u0000\u0000\u01dd\u01dc\u0001\u0000\u0000\u0000\u01de\u01e1"+
		"\u0001\u0000\u0000\u0000\u01df\u01dd\u0001\u0000\u0000\u0000\u01df\u01e0"+
		"\u0001\u0000\u0000\u0000\u01e0\u01e2\u0001\u0000\u0000\u0000\u01e1\u01df"+
		"\u0001\u0000\u0000\u0000\u01e2\u01e6\u0003V+\u0000\u01e3\u01e5\u0005_"+
		"\u0000\u0000\u01e4\u01e3\u0001\u0000\u0000\u0000\u01e5\u01e8\u0001\u0000"+
		"\u0000\u0000\u01e6\u01e4\u0001\u0000\u0000\u0000\u01e6\u01e7\u0001\u0000"+
		"\u0000\u0000\u01e7\u01ea\u0001\u0000\u0000\u0000\u01e8\u01e6\u0001\u0000"+
		"\u0000\u0000\u01e9\u01d8\u0001\u0000\u0000\u0000\u01e9\u01ea\u0001\u0000"+
		"\u0000\u0000\u01ea\u01ee\u0001\u0000\u0000\u0000\u01eb\u01ed\u0005_\u0000"+
		"\u0000\u01ec\u01eb\u0001\u0000\u0000\u0000\u01ed\u01f0\u0001\u0000\u0000"+
		"\u0000\u01ee\u01ec\u0001\u0000\u0000\u0000\u01ee\u01ef\u0001\u0000\u0000"+
		"\u0000\u01ef\u01f1\u0001\u0000\u0000\u0000\u01f0\u01ee\u0001\u0000\u0000"+
		"\u0000\u01f1\u01f2\u0005\u000e\u0000\u0000\u01f2)\u0001\u0000\u0000\u0000"+
		"\u01f3\u01f8\u0003,\u0016\u0000\u01f4\u01f5\u0005V\u0000\u0000\u01f5\u01f7"+
		"\u0003,\u0016\u0000\u01f6\u01f4\u0001\u0000\u0000\u0000\u01f7\u01fa\u0001"+
		"\u0000\u0000\u0000\u01f8\u01f6\u0001\u0000\u0000\u0000\u01f8\u01f9\u0001"+
		"\u0000\u0000\u0000\u01f9\u01fb\u0001\u0000\u0000\u0000\u01fa\u01f8\u0001"+
		"\u0000\u0000\u0000\u01fb\u01ff\u0005W\u0000\u0000\u01fc\u01fe\u0005_\u0000"+
		"\u0000\u01fd\u01fc\u0001\u0000\u0000\u0000\u01fe\u0201\u0001\u0000\u0000"+
		"\u0000\u01ff\u01fd\u0001\u0000\u0000\u0000\u01ff\u0200\u0001\u0000\u0000"+
		"\u0000\u0200\u0202\u0001\u0000\u0000\u0000\u0201\u01ff\u0001\u0000\u0000"+
		"\u0000\u0202\u0206\u0003V+\u0000\u0203\u0205\u0005_\u0000\u0000\u0204"+
		"\u0203\u0001\u0000\u0000\u0000\u0205\u0208\u0001\u0000\u0000\u0000\u0206"+
		"\u0204\u0001\u0000\u0000\u0000\u0206\u0207\u0001\u0000\u0000\u0000\u0207"+
		"+\u0001\u0000\u0000\u0000\u0208\u0206\u0001\u0000\u0000\u0000\u0209\u020c"+
		"\u0003X,\u0000\u020a\u020b\u0005\u0010\u0000\u0000\u020b\u020d\u0003X"+
		",\u0000\u020c\u020a\u0001\u0000\u0000\u0000\u020c\u020d\u0001\u0000\u0000"+
		"\u0000\u020d-\u0001\u0000\u0000\u0000\u020e\u020f\u0005\u000f\u0000\u0000"+
		"\u020f\u0210\u0003\b\u0004\u0000\u0210\u0211\u0007\u0001\u0000\u0000\u0211"+
		"\u0212\u0003X,\u0000\u0212\u0213\u0005\u0010\u0000\u0000\u0213\u0216\u0003"+
		"X,\u0000\u0214\u0215\u0005\u0011\u0000\u0000\u0215\u0217\u0003X,\u0000"+
		"\u0216\u0214\u0001\u0000\u0000\u0000\u0216\u0217\u0001\u0000\u0000\u0000"+
		"\u0217\u021b\u0001\u0000\u0000\u0000\u0218\u021a\u0005_\u0000\u0000\u0219"+
		"\u0218\u0001\u0000\u0000\u0000\u021a\u021d\u0001\u0000\u0000\u0000\u021b"+
		"\u0219\u0001\u0000\u0000\u0000\u021b\u021c\u0001\u0000\u0000\u0000\u021c"+
		"\u021e\u0001\u0000\u0000\u0000\u021d\u021b\u0001\u0000\u0000\u0000\u021e"+
		"\u0222\u0003V+\u0000\u021f\u0221\u0005_\u0000\u0000\u0220\u021f\u0001"+
		"\u0000\u0000\u0000\u0221\u0224\u0001\u0000\u0000\u0000\u0222\u0220\u0001"+
		"\u0000\u0000\u0000\u0222\u0223\u0001\u0000\u0000\u0000\u0223\u0225\u0001"+
		"\u0000\u0000\u0000\u0224\u0222\u0001\u0000\u0000\u0000\u0225\u0226\u0005"+
		"\u0012\u0000\u0000\u0226\u0227\u0003\b\u0004\u0000\u0227/\u0001\u0000"+
		"\u0000\u0000\u0228\u0229\u0005\u0013\u0000\u0000\u0229\u022b\u0003X,\u0000"+
		"\u022a\u022c\u0005\u0014\u0000\u0000\u022b\u022a\u0001\u0000\u0000\u0000"+
		"\u022b\u022c\u0001\u0000\u0000\u0000\u022c\u0230\u0001\u0000\u0000\u0000"+
		"\u022d\u022f\u0005_\u0000\u0000\u022e\u022d\u0001\u0000\u0000\u0000\u022f"+
		"\u0232\u0001\u0000\u0000\u0000\u0230\u022e\u0001\u0000\u0000\u0000\u0230"+
		"\u0231\u0001\u0000\u0000\u0000\u0231\u0233\u0001\u0000\u0000\u0000\u0232"+
		"\u0230\u0001\u0000\u0000\u0000\u0233\u0237\u0003V+\u0000\u0234\u0236\u0005"+
		"_\u0000\u0000\u0235\u0234\u0001\u0000\u0000\u0000\u0236\u0239\u0001\u0000"+
		"\u0000\u0000\u0237\u0235\u0001\u0000\u0000\u0000\u0237\u0238\u0001\u0000"+
		"\u0000\u0000\u0238\u023a\u0001\u0000\u0000\u0000\u0239\u0237\u0001\u0000"+
		"\u0000\u0000\u023a\u023b\u0005\u0015\u0000\u0000\u023b1\u0001\u0000\u0000"+
		"\u0000\u023c\u0240\u0005\u0016\u0000\u0000\u023d\u023f\u0005_\u0000\u0000"+
		"\u023e\u023d\u0001\u0000\u0000\u0000\u023f\u0242\u0001\u0000\u0000\u0000"+
		"\u0240\u023e\u0001\u0000\u0000\u0000\u0240\u0241\u0001\u0000\u0000\u0000"+
		"\u0241\u0243\u0001\u0000\u0000\u0000\u0242\u0240\u0001\u0000\u0000\u0000"+
		"\u0243\u0247\u0003V+\u0000\u0244\u0246\u0005_\u0000\u0000\u0245\u0244"+
		"\u0001\u0000\u0000\u0000\u0246\u0249\u0001\u0000\u0000\u0000\u0247\u0245"+
		"\u0001\u0000\u0000\u0000\u0247\u0248\u0001\u0000\u0000\u0000\u0248\u024a"+
		"\u0001\u0000\u0000\u0000\u0249\u0247\u0001\u0000\u0000\u0000\u024a\u024b"+
		"\u0005\u0017\u0000\u0000\u024b\u024c\u0003X,\u0000\u024c3\u0001\u0000"+
		"\u0000\u0000\u024d\u024e\u0005\u0018\u0000\u0000\u024e\u024f\u0003\b\u0004"+
		"\u0000\u024f\u0251\u0005R\u0000\u0000\u0250\u0252\u00038\u001c\u0000\u0251"+
		"\u0250\u0001\u0000\u0000\u0000\u0251\u0252\u0001\u0000\u0000\u0000\u0252"+
		"\u0253\u0001\u0000\u0000\u0000\u0253\u0257\u0005S\u0000\u0000\u0254\u0256"+
		"\u0005_\u0000\u0000\u0255\u0254\u0001\u0000\u0000\u0000\u0256\u0259\u0001"+
		"\u0000\u0000\u0000\u0257\u0255\u0001\u0000\u0000\u0000\u0257\u0258\u0001"+
		"\u0000\u0000\u0000\u0258\u025a\u0001\u0000\u0000\u0000\u0259\u0257\u0001"+
		"\u0000\u0000\u0000\u025a\u025e\u0003V+\u0000\u025b\u025d\u0005_\u0000"+
		"\u0000\u025c\u025b\u0001\u0000\u0000\u0000\u025d\u0260\u0001\u0000\u0000"+
		"\u0000\u025e\u025c\u0001\u0000\u0000\u0000\u025e\u025f\u0001\u0000\u0000"+
		"\u0000\u025f\u0261\u0001\u0000\u0000\u0000\u0260\u025e\u0001\u0000\u0000"+
		"\u0000\u0261\u0262\u0005\u0019\u0000\u0000\u02625\u0001\u0000\u0000\u0000"+
		"\u0263\u0264\u0005\u001a\u0000\u0000\u0264\u0265\u0003\b\u0004\u0000\u0265"+
		"\u0267\u0005R\u0000\u0000\u0266\u0268\u00038\u001c\u0000\u0267\u0266\u0001"+
		"\u0000\u0000\u0000\u0267\u0268\u0001\u0000\u0000\u0000\u0268\u0269\u0001"+
		"\u0000\u0000\u0000\u0269\u026a\u0005S\u0000\u0000\u026a\u026b\u0005\u001c"+
		"\u0000\u0000\u026b\u026f\u0003\f\u0006\u0000\u026c\u026e\u0005_\u0000"+
		"\u0000\u026d\u026c\u0001\u0000\u0000\u0000\u026e\u0271\u0001\u0000\u0000"+
		"\u0000\u026f\u026d\u0001\u0000\u0000\u0000\u026f\u0270\u0001\u0000\u0000"+
		"\u0000\u0270\u0272\u0001\u0000\u0000\u0000\u0271\u026f\u0001\u0000\u0000"+
		"\u0000\u0272\u0276\u0003V+\u0000\u0273\u0275\u0005_\u0000\u0000\u0274"+
		"\u0273\u0001\u0000\u0000\u0000\u0275\u0278\u0001\u0000\u0000\u0000\u0276"+
		"\u0274\u0001\u0000\u0000\u0000\u0276\u0277\u0001\u0000\u0000\u0000\u0277"+
		"\u0279\u0001\u0000\u0000\u0000\u0278\u0276\u0001\u0000\u0000\u0000\u0279"+
		"\u027a\u0005\u001b\u0000\u0000\u027a7\u0001\u0000\u0000\u0000\u027b\u0280"+
		"\u0003:\u001d\u0000\u027c\u027d\u0005V\u0000\u0000\u027d\u027f\u0003:"+
		"\u001d\u0000\u027e\u027c\u0001\u0000\u0000\u0000\u027f\u0282\u0001\u0000"+
		"\u0000\u0000\u0280\u027e\u0001\u0000\u0000\u0000\u0280\u0281\u0001\u0000"+
		"\u0000\u0000\u02819\u0001\u0000\u0000\u0000\u0282\u0280\u0001\u0000\u0000"+
		"\u0000\u0283\u0285\u0007\u0004\u0000\u0000\u0284\u0283\u0001\u0000\u0000"+
		"\u0000\u0284\u0285\u0001\u0000\u0000\u0000\u0285\u0286\u0001\u0000\u0000"+
		"\u0000\u0286\u0287\u0003\b\u0004\u0000\u0287\u0288\u0005W\u0000\u0000"+
		"\u0288\u0289\u0003\f\u0006\u0000\u0289;\u0001\u0000\u0000\u0000\u028a"+
		"\u028b\u0005\u001e\u0000\u0000\u028b\u028c\u0003\b\u0004\u0000\u028c\u028e"+
		"\u0005R\u0000\u0000\u028d\u028f\u0003T*\u0000\u028e\u028d\u0001\u0000"+
		"\u0000\u0000\u028e\u028f\u0001\u0000\u0000\u0000\u028f\u0290\u0001\u0000"+
		"\u0000\u0000\u0290\u0291\u0005S\u0000\u0000\u0291\u0295\u0001\u0000\u0000"+
		"\u0000\u0292\u0293\u0005\u001e\u0000\u0000\u0293\u0295\u0003>\u001f\u0000"+
		"\u0294\u028a\u0001\u0000\u0000\u0000\u0294\u0292\u0001\u0000\u0000\u0000"+
		"\u0295=\u0001\u0000\u0000\u0000\u0296\u0299\u0003\b\u0004\u0000\u0297"+
		"\u0299\u0005>\u0000\u0000\u0298\u0296\u0001\u0000\u0000\u0000\u0298\u0297"+
		"\u0001\u0000\u0000\u0000\u0299\u029d\u0001\u0000\u0000\u0000\u029a\u029c"+
		"\u0003\u0018\f\u0000\u029b\u029a\u0001\u0000\u0000\u0000\u029c\u029f\u0001"+
		"\u0000\u0000\u0000\u029d\u029b\u0001\u0000\u0000\u0000\u029d\u029e\u0001"+
		"\u0000\u0000\u0000\u029e\u02a0\u0001\u0000\u0000\u0000\u029f\u029d\u0001"+
		"\u0000\u0000\u0000\u02a0\u02a1\u0005X\u0000\u0000\u02a1\u02a2\u0003\u001a"+
		"\r\u0000\u02a2\u02a4\u0005R\u0000\u0000\u02a3\u02a5\u0003T*\u0000\u02a4"+
		"\u02a3\u0001\u0000\u0000\u0000\u02a4\u02a5\u0001\u0000\u0000\u0000\u02a5"+
		"\u02a6\u0001\u0000\u0000\u0000\u02a6\u02a7\u0005S\u0000\u0000\u02a7?\u0001"+
		"\u0000\u0000\u0000\u02a8\u02a9\u0003>\u001f\u0000\u02a9A\u0001\u0000\u0000"+
		"\u0000\u02aa\u02ab\u0005\u001d\u0000\u0000\u02ab\u02ac\u0003X,\u0000\u02ac"+
		"C\u0001\u0000\u0000\u0000\u02ad\u02ae\u0005\'\u0000\u0000\u02ae\u02af"+
		"\u0003X,\u0000\u02af\u02b0\u0005\u000f\u0000\u0000\u02b0\u02b1\u0003R"+
		")\u0000\u02b1E\u0001\u0000\u0000\u0000\u02b2\u02b3\u0005(\u0000\u0000"+
		"\u02b3\u02b4\u0003X,\u0000\u02b4\u02b5\u0005V\u0000\u0000\u02b5\u02b6"+
		"\u0003\u0016\u000b\u0000\u02b6G\u0001\u0000\u0000\u0000\u02b7\u02b8\u0005"+
		")\u0000\u0000\u02b8\u02b9\u0003X,\u0000\u02b9\u02ba\u0005V\u0000\u0000"+
		"\u02ba\u02bb\u0003X,\u0000\u02bbI\u0001\u0000\u0000\u0000\u02bc\u02bd"+
		"\u0005*\u0000\u0000\u02bd\u02be\u0003X,\u0000\u02beK\u0001\u0000\u0000"+
		"\u0000\u02bf\u02c0\u0005/\u0000\u0000\u02c0\u02c1\u0003X,\u0000\u02c1"+
		"\u02c2\u0005V\u0000\u0000\u02c2\u02c3\u0003X,\u0000\u02c3M\u0001\u0000"+
		"\u0000\u0000\u02c4\u02c5\u00050\u0000\u0000\u02c5\u02c6\u0003X,\u0000"+
		"\u02c6\u02c7\u0005V\u0000\u0000\u02c7\u02c8\u0003\u0016\u000b\u0000\u02c8"+
		"O\u0001\u0000\u0000\u0000\u02c9\u02ca\u00051\u0000\u0000\u02ca\u02cb\u0003"+
		"X,\u0000\u02cb\u02cc\u0005V\u0000\u0000\u02cc\u02cd\u0003\u0016\u000b"+
		"\u0000\u02cdQ\u0001\u0000\u0000\u0000\u02ce\u02cf\u0007\u0005\u0000\u0000"+
		"\u02cfS\u0001\u0000\u0000\u0000\u02d0\u02d5\u0003X,\u0000\u02d1\u02d2"+
		"\u0005V\u0000\u0000\u02d2\u02d4\u0003X,\u0000\u02d3\u02d1\u0001\u0000"+
		"\u0000\u0000\u02d4\u02d7\u0001\u0000\u0000\u0000\u02d5\u02d3\u0001\u0000"+
		"\u0000\u0000\u02d5\u02d6\u0001\u0000\u0000\u0000\u02d6U\u0001\u0000\u0000"+
		"\u0000\u02d7\u02d5\u0001\u0000\u0000\u0000\u02d8\u02e2\u0003\u0002\u0001"+
		"\u0000\u02d9\u02db\u0005_\u0000\u0000\u02da\u02d9\u0001\u0000\u0000\u0000"+
		"\u02db\u02de\u0001\u0000\u0000\u0000\u02dc\u02da\u0001\u0000\u0000\u0000"+
		"\u02dc\u02dd\u0001\u0000\u0000\u0000\u02dd\u02df\u0001\u0000\u0000\u0000"+
		"\u02de\u02dc\u0001\u0000\u0000\u0000\u02df\u02e1\u0003\u0002\u0001\u0000"+
		"\u02e0\u02dc\u0001\u0000\u0000\u0000\u02e1\u02e4\u0001\u0000\u0000\u0000"+
		"\u02e2\u02e0\u0001\u0000\u0000\u0000\u02e2\u02e3\u0001\u0000\u0000\u0000"+
		"\u02e3\u02e6\u0001\u0000\u0000\u0000\u02e4\u02e2\u0001\u0000\u0000\u0000"+
		"\u02e5\u02d8\u0001\u0000\u0000\u0000\u02e5\u02e6\u0001\u0000\u0000\u0000"+
		"\u02e6W\u0001\u0000\u0000\u0000\u02e7\u02e8\u0006,\uffff\uffff\u0000\u02e8"+
		"\u02e9\u0005\"\u0000\u0000\u02e9\u02ee\u0003X,\n\u02ea\u02eb\u0005M\u0000"+
		"\u0000\u02eb\u02ee\u0003X,\t\u02ec\u02ee\u0003Z-\u0000\u02ed\u02e7\u0001"+
		"\u0000\u0000\u0000\u02ed\u02ea\u0001\u0000\u0000\u0000\u02ed\u02ec\u0001"+
		"\u0000\u0000\u0000\u02ee\u0306\u0001\u0000\u0000\u0000\u02ef\u02f0\n\b"+
		"\u0000\u0000\u02f0\u02f1\u0005P\u0000\u0000\u02f1\u0305\u0003X,\b\u02f2"+
		"\u02f3\n\u0007\u0000\u0000\u02f3\u02f4\u0007\u0006\u0000\u0000\u02f4\u0305"+
		"\u0003X,\b\u02f5\u02f6\n\u0006\u0000\u0000\u02f6\u02f7\u0007\u0007\u0000"+
		"\u0000\u02f7\u0305\u0003X,\u0007\u02f8\u02f9\n\u0005\u0000\u0000\u02f9"+
		"\u02fa\u0005Q\u0000\u0000\u02fa\u0305\u0003X,\u0006\u02fb\u02fc\n\u0004"+
		"\u0000\u0000\u02fc\u02fd\u0007\b\u0000\u0000\u02fd\u0305\u0003X,\u0005"+
		"\u02fe\u02ff\n\u0003\u0000\u0000\u02ff\u0300\u0005 \u0000\u0000\u0300"+
		"\u0305\u0003X,\u0004\u0301\u0302\n\u0002\u0000\u0000\u0302\u0303\u0005"+
		"!\u0000\u0000\u0303\u0305\u0003X,\u0003\u0304\u02ef\u0001\u0000\u0000"+
		"\u0000\u0304\u02f2\u0001\u0000\u0000\u0000\u0304\u02f5\u0001\u0000\u0000"+
		"\u0000\u0304\u02f8\u0001\u0000\u0000\u0000\u0304\u02fb\u0001\u0000\u0000"+
		"\u0000\u0304\u02fe\u0001\u0000\u0000\u0000\u0304\u0301\u0001\u0000\u0000"+
		"\u0000\u0305\u0308\u0001\u0000\u0000\u0000\u0306\u0304\u0001\u0000\u0000"+
		"\u0000\u0306\u0307\u0001\u0000\u0000\u0000\u0307Y\u0001\u0000\u0000\u0000"+
		"\u0308\u0306\u0001\u0000\u0000\u0000\u0309\u030a\u0005R\u0000\u0000\u030a"+
		"\u030b\u0003X,\u0000\u030b\u030c\u0005S\u0000\u0000\u030c\u0334\u0001"+
		"\u0000\u0000\u0000\u030d\u030e\u0003\b\u0004\u0000\u030e\u0310\u0005R"+
		"\u0000\u0000\u030f\u0311\u0003T*\u0000\u0310\u030f\u0001\u0000\u0000\u0000"+
		"\u0310\u0311\u0001\u0000\u0000\u0000\u0311\u0312\u0001\u0000\u0000\u0000"+
		"\u0312\u0313\u0005S\u0000\u0000\u0313\u0334\u0001\u0000\u0000\u0000\u0314"+
		"\u0315\u0005=\u0000\u0000\u0315\u0316\u0005^\u0000\u0000\u0316\u0318\u0005"+
		"R\u0000\u0000\u0317\u0319\u0003T*\u0000\u0318\u0317\u0001\u0000\u0000"+
		"\u0000\u0318\u0319\u0001\u0000\u0000\u0000\u0319\u031a\u0001\u0000\u0000"+
		"\u0000\u031a\u0334\u0005S\u0000\u0000\u031b\u031c\u0005P\u0000\u0000\u031c"+
		"\u0334\u0003\u0016\u000b\u0000\u031d\u031e\u0005&\u0000\u0000\u031e\u031f"+
		"\u0005R\u0000\u0000\u031f\u0320\u0003X,\u0000\u0320\u0321\u0005V\u0000"+
		"\u0000\u0321\u0322\u0003X,\u0000\u0322\u0323\u0005S\u0000\u0000\u0323"+
		"\u0334\u0001\u0000\u0000\u0000\u0324\u0325\u0005%\u0000\u0000\u0325\u0326"+
		"\u0005R\u0000\u0000\u0326\u0327\u0003X,\u0000\u0327\u0328\u0005V\u0000"+
		"\u0000\u0328\u0329\u0003X,\u0000\u0329\u032a\u0005S\u0000\u0000\u032a"+
		"\u0334\u0001\u0000\u0000\u0000\u032b\u0334\u0003\u0016\u000b\u0000\u032c"+
		"\u0334\u0005[\u0000\u0000\u032d\u0334\u0005Z\u0000\u0000\u032e\u0334\u0005"+
		"Y\u0000\u0000\u032f\u0334\u0005\\\u0000\u0000\u0330\u0334\u0005]\u0000"+
		"\u0000\u0331\u0334\u0005#\u0000\u0000\u0332\u0334\u0005$\u0000\u0000\u0333"+
		"\u0309\u0001\u0000\u0000\u0000\u0333\u030d\u0001\u0000\u0000\u0000\u0333"+
		"\u0314\u0001\u0000\u0000\u0000\u0333\u031b\u0001\u0000\u0000\u0000\u0333"+
		"\u031d\u0001\u0000\u0000\u0000\u0333\u0324\u0001\u0000\u0000\u0000\u0333"+
		"\u032b\u0001\u0000\u0000\u0000\u0333\u032c\u0001\u0000\u0000\u0000\u0333"+
		"\u032d\u0001\u0000\u0000\u0000\u0333\u032e\u0001\u0000\u0000\u0000\u0333"+
		"\u032f\u0001\u0000\u0000\u0000\u0333\u0330\u0001\u0000\u0000\u0000\u0333"+
		"\u0331\u0001\u0000\u0000\u0000\u0333\u0332\u0001\u0000\u0000\u0000\u0334"+
		"[\u0001\u0000\u0000\u0000Y_flot\u0092\u00b5\u00bc\u00d6\u00da\u00df\u00f8"+
		"\u00fe\u0102\u0106\u010c\u0116\u011b\u0121\u0125\u012b\u012e\u0135\u0139"+
		"\u013c\u0140\u0145\u014e\u0157\u015a\u015d\u0166\u0171\u017b\u0183\u0187"+
		"\u018c\u0193\u0199\u019f\u01a3\u01a8\u01af\u01b5\u01bc\u01c0\u01c5\u01d0"+
		"\u01d6\u01da\u01df\u01e6\u01e9\u01ee\u01f8\u01ff\u0206\u020c\u0216\u021b"+
		"\u0222\u022b\u0230\u0237\u0240\u0247\u0251\u0257\u025e\u0267\u026f\u0276"+
		"\u0280\u0284\u028e\u0294\u0298\u029d\u02a4\u02d5\u02dc\u02e2\u02e5\u02ed"+
		"\u0304\u0306\u0310\u0318\u0333";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}