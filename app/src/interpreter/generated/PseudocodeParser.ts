
import * as antlr from "antlr4ng";
import { Token } from "antlr4ng";

// for running tests with parameters, TODO: discuss strategy for typed parameters in CI
// eslint-disable-next-line no-unused-vars
type int = number;


export class PseudocodeParser extends antlr.Parser {
    public static readonly DECLARE = 1;
    public static readonly CONSTANT = 2;
    public static readonly INPUT = 3;
    public static readonly OUTPUT = 4;
    public static readonly PRINT = 5;
    public static readonly IF = 6;
    public static readonly THEN = 7;
    public static readonly ELSE = 8;
    public static readonly ELSEIF = 9;
    public static readonly ENDIF = 10;
    public static readonly CASE = 11;
    public static readonly OF = 12;
    public static readonly OTHERWISE = 13;
    public static readonly ENDCASE = 14;
    public static readonly FOR = 15;
    public static readonly TO = 16;
    public static readonly STEP = 17;
    public static readonly NEXT = 18;
    public static readonly WHILE = 19;
    public static readonly DO = 20;
    public static readonly ENDWHILE = 21;
    public static readonly REPEAT = 22;
    public static readonly UNTIL = 23;
    public static readonly PROCEDURE = 24;
    public static readonly ENDPROCEDURE = 25;
    public static readonly FUNCTION = 26;
    public static readonly ENDFUNCTION = 27;
    public static readonly RETURNS = 28;
    public static readonly RETURN = 29;
    public static readonly CALL = 30;
    public static readonly ARRAY = 31;
    public static readonly AND = 32;
    public static readonly OR = 33;
    public static readonly NOT = 34;
    public static readonly TRUE = 35;
    public static readonly FALSE = 36;
    public static readonly MOD = 37;
    public static readonly DIV = 38;
    public static readonly OPENFILE = 39;
    public static readonly READFILE = 40;
    public static readonly WRITEFILE = 41;
    public static readonly CLOSEFILE = 42;
    public static readonly READ_MODE = 43;
    public static readonly WRITE_MODE = 44;
    public static readonly APPEND_MODE = 45;
    public static readonly INTEGER_TYPE = 46;
    public static readonly REAL_TYPE = 47;
    public static readonly CHAR_TYPE = 48;
    public static readonly STRING_TYPE = 49;
    public static readonly BOOLEAN_TYPE = 50;
    public static readonly LARROW = 51;
    public static readonly EQUALS = 52;
    public static readonly NOTEQUAL = 53;
    public static readonly LTE = 54;
    public static readonly GTE = 55;
    public static readonly LT = 56;
    public static readonly GT = 57;
    public static readonly PLUS = 58;
    public static readonly MINUS = 59;
    public static readonly STAR = 60;
    public static readonly SLASH = 61;
    public static readonly CARET = 62;
    public static readonly AMPERSAND = 63;
    public static readonly LPAREN = 64;
    public static readonly RPAREN = 65;
    public static readonly LBRACKET = 66;
    public static readonly RBRACKET = 67;
    public static readonly COMMA = 68;
    public static readonly COLON = 69;
    public static readonly REAL_LITERAL = 70;
    public static readonly INTEGER_LITERAL = 71;
    public static readonly STRING_LITERAL = 72;
    public static readonly CHAR_LITERAL = 73;
    public static readonly IDENTIFIER = 74;
    public static readonly NEWLINE = 75;
    public static readonly WS = 76;
    public static readonly LINE_COMMENT = 77;
    public static readonly RULE_program = 0;
    public static readonly RULE_statement = 1;
    public static readonly RULE_declareStatement = 2;
    public static readonly RULE_identifierList = 3;
    public static readonly RULE_constantStatement = 4;
    public static readonly RULE_dataType = 5;
    public static readonly RULE_assignmentStatement = 6;
    public static readonly RULE_inputStatement = 7;
    public static readonly RULE_outputStatement = 8;
    public static readonly RULE_exprList = 9;
    public static readonly RULE_ifStatement = 10;
    public static readonly RULE_caseStatement = 11;
    public static readonly RULE_caseClause = 12;
    public static readonly RULE_forStatement = 13;
    public static readonly RULE_whileStatement = 14;
    public static readonly RULE_repeatStatement = 15;
    public static readonly RULE_procedureDeclaration = 16;
    public static readonly RULE_functionDeclaration = 17;
    public static readonly RULE_paramList = 18;
    public static readonly RULE_param = 19;
    public static readonly RULE_callStatement = 20;
    public static readonly RULE_returnStatement = 21;
    public static readonly RULE_openFileStatement = 22;
    public static readonly RULE_readFileStatement = 23;
    public static readonly RULE_writeFileStatement = 24;
    public static readonly RULE_closeFileStatement = 25;
    public static readonly RULE_fileMode = 26;
    public static readonly RULE_argList = 27;
    public static readonly RULE_block = 28;
    public static readonly RULE_expr = 29;
    public static readonly RULE_atom = 30;

    public static readonly literalNames = [
        null, null, null, null, null, null, null, null, null, null, null, 
        null, null, null, null, null, null, null, null, null, null, null, 
        null, null, null, null, null, null, null, null, null, null, null, 
        null, null, null, null, null, null, null, null, null, null, null, 
        null, null, null, null, null, null, null, null, "'='", "'<>'", "'<='", 
        "'>='", "'<'", "'>'", "'+'", "'-'", "'*'", "'/'", "'^'", "'&'", 
        "'('", "')'", "'['", "']'", "','", "':'"
    ];

    public static readonly symbolicNames = [
        null, "DECLARE", "CONSTANT", "INPUT", "OUTPUT", "PRINT", "IF", "THEN", 
        "ELSE", "ELSEIF", "ENDIF", "CASE", "OF", "OTHERWISE", "ENDCASE", 
        "FOR", "TO", "STEP", "NEXT", "WHILE", "DO", "ENDWHILE", "REPEAT", 
        "UNTIL", "PROCEDURE", "ENDPROCEDURE", "FUNCTION", "ENDFUNCTION", 
        "RETURNS", "RETURN", "CALL", "ARRAY", "AND", "OR", "NOT", "TRUE", 
        "FALSE", "MOD", "DIV", "OPENFILE", "READFILE", "WRITEFILE", "CLOSEFILE", 
        "READ_MODE", "WRITE_MODE", "APPEND_MODE", "INTEGER_TYPE", "REAL_TYPE", 
        "CHAR_TYPE", "STRING_TYPE", "BOOLEAN_TYPE", "LARROW", "EQUALS", 
        "NOTEQUAL", "LTE", "GTE", "LT", "GT", "PLUS", "MINUS", "STAR", "SLASH", 
        "CARET", "AMPERSAND", "LPAREN", "RPAREN", "LBRACKET", "RBRACKET", 
        "COMMA", "COLON", "REAL_LITERAL", "INTEGER_LITERAL", "STRING_LITERAL", 
        "CHAR_LITERAL", "IDENTIFIER", "NEWLINE", "WS", "LINE_COMMENT"
    ];
    public static readonly ruleNames = [
        "program", "statement", "declareStatement", "identifierList", "constantStatement", 
        "dataType", "assignmentStatement", "inputStatement", "outputStatement", 
        "exprList", "ifStatement", "caseStatement", "caseClause", "forStatement", 
        "whileStatement", "repeatStatement", "procedureDeclaration", "functionDeclaration", 
        "paramList", "param", "callStatement", "returnStatement", "openFileStatement", 
        "readFileStatement", "writeFileStatement", "closeFileStatement", 
        "fileMode", "argList", "block", "expr", "atom",
    ];

    public get grammarFileName(): string { return "Pseudocode.g4"; }
    public get literalNames(): (string | null)[] { return PseudocodeParser.literalNames; }
    public get symbolicNames(): (string | null)[] { return PseudocodeParser.symbolicNames; }
    public get ruleNames(): string[] { return PseudocodeParser.ruleNames; }
    public get serializedATN(): number[] { return PseudocodeParser._serializedATN; }

    protected createFailedPredicateException(predicate?: string, message?: string): antlr.FailedPredicateException {
        return new antlr.FailedPredicateException(this, predicate, message);
    }

    public constructor(input: antlr.TokenStream) {
        super(input);
        this.interpreter = new antlr.ParserATNSimulator(this, PseudocodeParser._ATN, PseudocodeParser.decisionsToDFA, new antlr.PredictionContextCache());
    }
    public program(): ProgramContext {
        let localContext = new ProgramContext(this.context, this.state);
        this.enterRule(localContext, 0, PseudocodeParser.RULE_program);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 65;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 0, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 62;
                    this.match(PseudocodeParser.NEWLINE);
                    }
                    }
                }
                this.state = 67;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 0, this.context);
            }
            this.state = 80;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 1699252350) !== 0) || ((((_la - 39)) & ~0x1F) === 0 && ((1 << (_la - 39)) & 15) !== 0) || _la === 74) {
                {
                this.state = 68;
                this.statement();
                this.state = 77;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 2, this.context);
                while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                    if (alternative === 1) {
                        {
                        {
                        this.state = 70;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                        do {
                            {
                            {
                            this.state = 69;
                            this.match(PseudocodeParser.NEWLINE);
                            }
                            }
                            this.state = 72;
                            this.errorHandler.sync(this);
                            _la = this.tokenStream.LA(1);
                        } while (_la === 75);
                        this.state = 74;
                        this.statement();
                        }
                        }
                    }
                    this.state = 79;
                    this.errorHandler.sync(this);
                    alternative = this.interpreter.adaptivePredict(this.tokenStream, 2, this.context);
                }
                }
            }

            this.state = 85;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 75) {
                {
                {
                this.state = 82;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 87;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 88;
            this.match(PseudocodeParser.EOF);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public statement(): StatementContext {
        let localContext = new StatementContext(this.context, this.state);
        this.enterRule(localContext, 2, PseudocodeParser.RULE_statement);
        try {
            this.state = 108;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case PseudocodeParser.DECLARE:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 90;
                this.declareStatement();
                }
                break;
            case PseudocodeParser.CONSTANT:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 91;
                this.constantStatement();
                }
                break;
            case PseudocodeParser.IDENTIFIER:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 92;
                this.assignmentStatement();
                }
                break;
            case PseudocodeParser.INPUT:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 93;
                this.inputStatement();
                }
                break;
            case PseudocodeParser.OUTPUT:
            case PseudocodeParser.PRINT:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 94;
                this.outputStatement();
                }
                break;
            case PseudocodeParser.IF:
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 95;
                this.ifStatement();
                }
                break;
            case PseudocodeParser.CASE:
                this.enterOuterAlt(localContext, 7);
                {
                this.state = 96;
                this.caseStatement();
                }
                break;
            case PseudocodeParser.FOR:
                this.enterOuterAlt(localContext, 8);
                {
                this.state = 97;
                this.forStatement();
                }
                break;
            case PseudocodeParser.WHILE:
                this.enterOuterAlt(localContext, 9);
                {
                this.state = 98;
                this.whileStatement();
                }
                break;
            case PseudocodeParser.REPEAT:
                this.enterOuterAlt(localContext, 10);
                {
                this.state = 99;
                this.repeatStatement();
                }
                break;
            case PseudocodeParser.PROCEDURE:
                this.enterOuterAlt(localContext, 11);
                {
                this.state = 100;
                this.procedureDeclaration();
                }
                break;
            case PseudocodeParser.FUNCTION:
                this.enterOuterAlt(localContext, 12);
                {
                this.state = 101;
                this.functionDeclaration();
                }
                break;
            case PseudocodeParser.CALL:
                this.enterOuterAlt(localContext, 13);
                {
                this.state = 102;
                this.callStatement();
                }
                break;
            case PseudocodeParser.RETURN:
                this.enterOuterAlt(localContext, 14);
                {
                this.state = 103;
                this.returnStatement();
                }
                break;
            case PseudocodeParser.OPENFILE:
                this.enterOuterAlt(localContext, 15);
                {
                this.state = 104;
                this.openFileStatement();
                }
                break;
            case PseudocodeParser.READFILE:
                this.enterOuterAlt(localContext, 16);
                {
                this.state = 105;
                this.readFileStatement();
                }
                break;
            case PseudocodeParser.WRITEFILE:
                this.enterOuterAlt(localContext, 17);
                {
                this.state = 106;
                this.writeFileStatement();
                }
                break;
            case PseudocodeParser.CLOSEFILE:
                this.enterOuterAlt(localContext, 18);
                {
                this.state = 107;
                this.closeFileStatement();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public declareStatement(): DeclareStatementContext {
        let localContext = new DeclareStatementContext(this.context, this.state);
        this.enterRule(localContext, 4, PseudocodeParser.RULE_declareStatement);
        try {
            this.state = 143;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 6, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 110;
                this.match(PseudocodeParser.DECLARE);
                this.state = 111;
                this.identifierList();
                this.state = 112;
                this.match(PseudocodeParser.COLON);
                this.state = 113;
                this.match(PseudocodeParser.ARRAY);
                this.state = 114;
                this.match(PseudocodeParser.LBRACKET);
                this.state = 115;
                this.expr(0);
                this.state = 116;
                this.match(PseudocodeParser.COLON);
                this.state = 117;
                this.expr(0);
                this.state = 118;
                this.match(PseudocodeParser.RBRACKET);
                this.state = 119;
                this.match(PseudocodeParser.OF);
                this.state = 120;
                this.dataType();
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 122;
                this.match(PseudocodeParser.DECLARE);
                this.state = 123;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 124;
                this.match(PseudocodeParser.COLON);
                this.state = 125;
                this.match(PseudocodeParser.ARRAY);
                this.state = 126;
                this.match(PseudocodeParser.LBRACKET);
                this.state = 127;
                this.expr(0);
                this.state = 128;
                this.match(PseudocodeParser.COLON);
                this.state = 129;
                this.expr(0);
                this.state = 130;
                this.match(PseudocodeParser.COMMA);
                this.state = 131;
                this.expr(0);
                this.state = 132;
                this.match(PseudocodeParser.COLON);
                this.state = 133;
                this.expr(0);
                this.state = 134;
                this.match(PseudocodeParser.RBRACKET);
                this.state = 135;
                this.match(PseudocodeParser.OF);
                this.state = 136;
                this.dataType();
                }
                break;
            case 3:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 138;
                this.match(PseudocodeParser.DECLARE);
                this.state = 139;
                this.identifierList();
                this.state = 140;
                this.match(PseudocodeParser.COLON);
                this.state = 141;
                this.dataType();
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public identifierList(): IdentifierListContext {
        let localContext = new IdentifierListContext(this.context, this.state);
        this.enterRule(localContext, 6, PseudocodeParser.RULE_identifierList);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 145;
            this.match(PseudocodeParser.IDENTIFIER);
            this.state = 150;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 68) {
                {
                {
                this.state = 146;
                this.match(PseudocodeParser.COMMA);
                this.state = 147;
                this.match(PseudocodeParser.IDENTIFIER);
                }
                }
                this.state = 152;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public constantStatement(): ConstantStatementContext {
        let localContext = new ConstantStatementContext(this.context, this.state);
        this.enterRule(localContext, 8, PseudocodeParser.RULE_constantStatement);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 153;
            this.match(PseudocodeParser.CONSTANT);
            this.state = 154;
            this.match(PseudocodeParser.IDENTIFIER);
            this.state = 155;
            _la = this.tokenStream.LA(1);
            if(!(_la === 51 || _la === 52)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            this.state = 156;
            this.expr(0);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public dataType(): DataTypeContext {
        let localContext = new DataTypeContext(this.context, this.state);
        this.enterRule(localContext, 10, PseudocodeParser.RULE_dataType);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 158;
            _la = this.tokenStream.LA(1);
            if(!(((((_la - 46)) & ~0x1F) === 0 && ((1 << (_la - 46)) & 31) !== 0))) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public assignmentStatement(): AssignmentStatementContext {
        let localContext = new AssignmentStatementContext(this.context, this.state);
        this.enterRule(localContext, 12, PseudocodeParser.RULE_assignmentStatement);
        try {
            this.state = 198;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 8, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 160;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 161;
                this.match(PseudocodeParser.EQUALS);
                this.state = 162;
                this.expr(0);
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 163;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 164;
                this.match(PseudocodeParser.LBRACKET);
                this.state = 165;
                this.expr(0);
                this.state = 166;
                this.match(PseudocodeParser.RBRACKET);
                this.state = 167;
                this.match(PseudocodeParser.EQUALS);
                this.state = 168;
                this.expr(0);
                }
                break;
            case 3:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 170;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 171;
                this.match(PseudocodeParser.LBRACKET);
                this.state = 172;
                this.expr(0);
                this.state = 173;
                this.match(PseudocodeParser.COMMA);
                this.state = 174;
                this.expr(0);
                this.state = 175;
                this.match(PseudocodeParser.RBRACKET);
                this.state = 176;
                this.match(PseudocodeParser.EQUALS);
                this.state = 177;
                this.expr(0);
                }
                break;
            case 4:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 179;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 180;
                this.match(PseudocodeParser.LARROW);
                this.state = 181;
                this.expr(0);
                }
                break;
            case 5:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 182;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 183;
                this.match(PseudocodeParser.LBRACKET);
                this.state = 184;
                this.expr(0);
                this.state = 185;
                this.match(PseudocodeParser.RBRACKET);
                this.state = 186;
                this.match(PseudocodeParser.LARROW);
                this.state = 187;
                this.expr(0);
                }
                break;
            case 6:
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 189;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 190;
                this.match(PseudocodeParser.LBRACKET);
                this.state = 191;
                this.expr(0);
                this.state = 192;
                this.match(PseudocodeParser.COMMA);
                this.state = 193;
                this.expr(0);
                this.state = 194;
                this.match(PseudocodeParser.RBRACKET);
                this.state = 195;
                this.match(PseudocodeParser.LARROW);
                this.state = 196;
                this.expr(0);
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public inputStatement(): InputStatementContext {
        let localContext = new InputStatementContext(this.context, this.state);
        this.enterRule(localContext, 14, PseudocodeParser.RULE_inputStatement);
        try {
            this.state = 208;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 9, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 200;
                this.match(PseudocodeParser.INPUT);
                this.state = 201;
                this.match(PseudocodeParser.IDENTIFIER);
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 202;
                this.match(PseudocodeParser.INPUT);
                this.state = 203;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 204;
                this.match(PseudocodeParser.LBRACKET);
                this.state = 205;
                this.expr(0);
                this.state = 206;
                this.match(PseudocodeParser.RBRACKET);
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public outputStatement(): OutputStatementContext {
        let localContext = new OutputStatementContext(this.context, this.state);
        this.enterRule(localContext, 16, PseudocodeParser.RULE_outputStatement);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 210;
            _la = this.tokenStream.LA(1);
            if(!(_la === 4 || _la === 5)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            this.state = 211;
            this.exprList();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public exprList(): ExprListContext {
        let localContext = new ExprListContext(this.context, this.state);
        this.enterRule(localContext, 18, PseudocodeParser.RULE_exprList);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 213;
            this.expr(0);
            this.state = 218;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 68) {
                {
                {
                this.state = 214;
                this.match(PseudocodeParser.COMMA);
                this.state = 215;
                this.expr(0);
                }
                }
                this.state = 220;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public ifStatement(): IfStatementContext {
        let localContext = new IfStatementContext(this.context, this.state);
        this.enterRule(localContext, 20, PseudocodeParser.RULE_ifStatement);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 221;
            this.match(PseudocodeParser.IF);
            this.state = 222;
            this.expr(0);
            this.state = 223;
            this.match(PseudocodeParser.THEN);
            this.state = 225;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 224;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 227;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 75);
            this.state = 229;
            this.block();
            this.state = 247;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 14, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 231;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    do {
                        {
                        {
                        this.state = 230;
                        this.match(PseudocodeParser.NEWLINE);
                        }
                        }
                        this.state = 233;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                    } while (_la === 75);
                    this.state = 235;
                    this.match(PseudocodeParser.ELSEIF);
                    this.state = 236;
                    this.expr(0);
                    this.state = 237;
                    this.match(PseudocodeParser.THEN);
                    this.state = 239;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    do {
                        {
                        {
                        this.state = 238;
                        this.match(PseudocodeParser.NEWLINE);
                        }
                        }
                        this.state = 241;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                    } while (_la === 75);
                    this.state = 243;
                    this.block();
                    }
                    }
                }
                this.state = 249;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 14, this.context);
            }
            this.state = 262;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 17, this.context) ) {
            case 1:
                {
                this.state = 251;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                do {
                    {
                    {
                    this.state = 250;
                    this.match(PseudocodeParser.NEWLINE);
                    }
                    }
                    this.state = 253;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                } while (_la === 75);
                this.state = 255;
                this.match(PseudocodeParser.ELSE);
                this.state = 257;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                do {
                    {
                    {
                    this.state = 256;
                    this.match(PseudocodeParser.NEWLINE);
                    }
                    }
                    this.state = 259;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                } while (_la === 75);
                this.state = 261;
                this.block();
                }
                break;
            }
            this.state = 265;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 264;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 267;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 75);
            this.state = 269;
            this.match(PseudocodeParser.ENDIF);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public caseStatement(): CaseStatementContext {
        let localContext = new CaseStatementContext(this.context, this.state);
        this.enterRule(localContext, 22, PseudocodeParser.RULE_caseStatement);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 271;
            this.match(PseudocodeParser.CASE);
            this.state = 272;
            this.match(PseudocodeParser.OF);
            this.state = 273;
            this.match(PseudocodeParser.IDENTIFIER);
            this.state = 275;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 274;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 277;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 75);
            this.state = 280;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 279;
                this.caseClause();
                }
                }
                this.state = 282;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & 1107296287) !== 0) || ((((_la - 70)) & ~0x1F) === 0 && ((1 << (_la - 70)) & 31) !== 0));
            this.state = 297;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 13) {
                {
                this.state = 284;
                this.match(PseudocodeParser.OTHERWISE);
                this.state = 285;
                this.match(PseudocodeParser.COLON);
                this.state = 287;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                do {
                    {
                    {
                    this.state = 286;
                    this.match(PseudocodeParser.NEWLINE);
                    }
                    }
                    this.state = 289;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                } while (_la === 75);
                this.state = 291;
                this.block();
                this.state = 293;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                do {
                    {
                    {
                    this.state = 292;
                    this.match(PseudocodeParser.NEWLINE);
                    }
                    }
                    this.state = 295;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                } while (_la === 75);
                }
            }

            this.state = 299;
            this.match(PseudocodeParser.ENDCASE);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public caseClause(): CaseClauseContext {
        let localContext = new CaseClauseContext(this.context, this.state);
        this.enterRule(localContext, 24, PseudocodeParser.RULE_caseClause);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 301;
            this.expr(0);
            this.state = 302;
            this.match(PseudocodeParser.COLON);
            this.state = 304;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 303;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 306;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 75);
            this.state = 308;
            this.block();
            this.state = 310;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 309;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 312;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 75);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public forStatement(): ForStatementContext {
        let localContext = new ForStatementContext(this.context, this.state);
        this.enterRule(localContext, 26, PseudocodeParser.RULE_forStatement);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 314;
            this.match(PseudocodeParser.FOR);
            this.state = 315;
            this.match(PseudocodeParser.IDENTIFIER);
            this.state = 316;
            _la = this.tokenStream.LA(1);
            if(!(_la === 51 || _la === 52)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            this.state = 317;
            this.expr(0);
            this.state = 318;
            this.match(PseudocodeParser.TO);
            this.state = 319;
            this.expr(0);
            this.state = 322;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 17) {
                {
                this.state = 320;
                this.match(PseudocodeParser.STEP);
                this.state = 321;
                this.expr(0);
                }
            }

            this.state = 325;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 324;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 327;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 75);
            this.state = 329;
            this.block();
            this.state = 331;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 330;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 333;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 75);
            this.state = 335;
            this.match(PseudocodeParser.NEXT);
            this.state = 336;
            this.match(PseudocodeParser.IDENTIFIER);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public whileStatement(): WhileStatementContext {
        let localContext = new WhileStatementContext(this.context, this.state);
        this.enterRule(localContext, 28, PseudocodeParser.RULE_whileStatement);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 338;
            this.match(PseudocodeParser.WHILE);
            this.state = 339;
            this.expr(0);
            this.state = 341;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 20) {
                {
                this.state = 340;
                this.match(PseudocodeParser.DO);
                }
            }

            this.state = 344;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 343;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 346;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 75);
            this.state = 348;
            this.block();
            this.state = 350;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 349;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 352;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 75);
            this.state = 354;
            this.match(PseudocodeParser.ENDWHILE);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public repeatStatement(): RepeatStatementContext {
        let localContext = new RepeatStatementContext(this.context, this.state);
        this.enterRule(localContext, 30, PseudocodeParser.RULE_repeatStatement);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 356;
            this.match(PseudocodeParser.REPEAT);
            this.state = 358;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 357;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 360;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 75);
            this.state = 362;
            this.block();
            this.state = 364;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 363;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 366;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 75);
            this.state = 368;
            this.match(PseudocodeParser.UNTIL);
            this.state = 369;
            this.expr(0);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public procedureDeclaration(): ProcedureDeclarationContext {
        let localContext = new ProcedureDeclarationContext(this.context, this.state);
        this.enterRule(localContext, 32, PseudocodeParser.RULE_procedureDeclaration);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 371;
            this.match(PseudocodeParser.PROCEDURE);
            this.state = 372;
            this.match(PseudocodeParser.IDENTIFIER);
            this.state = 373;
            this.match(PseudocodeParser.LPAREN);
            this.state = 375;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 74) {
                {
                this.state = 374;
                this.paramList();
                }
            }

            this.state = 377;
            this.match(PseudocodeParser.RPAREN);
            this.state = 379;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 378;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 381;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 75);
            this.state = 383;
            this.block();
            this.state = 385;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 384;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 387;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 75);
            this.state = 389;
            this.match(PseudocodeParser.ENDPROCEDURE);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public functionDeclaration(): FunctionDeclarationContext {
        let localContext = new FunctionDeclarationContext(this.context, this.state);
        this.enterRule(localContext, 34, PseudocodeParser.RULE_functionDeclaration);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 391;
            this.match(PseudocodeParser.FUNCTION);
            this.state = 392;
            this.match(PseudocodeParser.IDENTIFIER);
            this.state = 393;
            this.match(PseudocodeParser.LPAREN);
            this.state = 395;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 74) {
                {
                this.state = 394;
                this.paramList();
                }
            }

            this.state = 397;
            this.match(PseudocodeParser.RPAREN);
            this.state = 398;
            this.match(PseudocodeParser.RETURNS);
            this.state = 399;
            this.dataType();
            this.state = 401;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 400;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 403;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 75);
            this.state = 405;
            this.block();
            this.state = 407;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 406;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 409;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 75);
            this.state = 411;
            this.match(PseudocodeParser.ENDFUNCTION);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public paramList(): ParamListContext {
        let localContext = new ParamListContext(this.context, this.state);
        this.enterRule(localContext, 36, PseudocodeParser.RULE_paramList);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 413;
            this.param();
            this.state = 418;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 68) {
                {
                {
                this.state = 414;
                this.match(PseudocodeParser.COMMA);
                this.state = 415;
                this.param();
                }
                }
                this.state = 420;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public param(): ParamContext {
        let localContext = new ParamContext(this.context, this.state);
        this.enterRule(localContext, 38, PseudocodeParser.RULE_param);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 421;
            this.match(PseudocodeParser.IDENTIFIER);
            this.state = 422;
            this.match(PseudocodeParser.COLON);
            this.state = 423;
            this.dataType();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public callStatement(): CallStatementContext {
        let localContext = new CallStatementContext(this.context, this.state);
        this.enterRule(localContext, 40, PseudocodeParser.RULE_callStatement);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 425;
            this.match(PseudocodeParser.CALL);
            this.state = 426;
            this.match(PseudocodeParser.IDENTIFIER);
            this.state = 427;
            this.match(PseudocodeParser.LPAREN);
            this.state = 429;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & 1107296287) !== 0) || ((((_la - 70)) & ~0x1F) === 0 && ((1 << (_la - 70)) & 31) !== 0)) {
                {
                this.state = 428;
                this.argList();
                }
            }

            this.state = 431;
            this.match(PseudocodeParser.RPAREN);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public returnStatement(): ReturnStatementContext {
        let localContext = new ReturnStatementContext(this.context, this.state);
        this.enterRule(localContext, 42, PseudocodeParser.RULE_returnStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 433;
            this.match(PseudocodeParser.RETURN);
            this.state = 434;
            this.expr(0);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public openFileStatement(): OpenFileStatementContext {
        let localContext = new OpenFileStatementContext(this.context, this.state);
        this.enterRule(localContext, 44, PseudocodeParser.RULE_openFileStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 436;
            this.match(PseudocodeParser.OPENFILE);
            this.state = 437;
            this.expr(0);
            this.state = 438;
            this.match(PseudocodeParser.FOR);
            this.state = 439;
            this.fileMode();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public readFileStatement(): ReadFileStatementContext {
        let localContext = new ReadFileStatementContext(this.context, this.state);
        this.enterRule(localContext, 46, PseudocodeParser.RULE_readFileStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 441;
            this.match(PseudocodeParser.READFILE);
            this.state = 442;
            this.expr(0);
            this.state = 443;
            this.match(PseudocodeParser.COMMA);
            this.state = 444;
            this.match(PseudocodeParser.IDENTIFIER);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public writeFileStatement(): WriteFileStatementContext {
        let localContext = new WriteFileStatementContext(this.context, this.state);
        this.enterRule(localContext, 48, PseudocodeParser.RULE_writeFileStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 446;
            this.match(PseudocodeParser.WRITEFILE);
            this.state = 447;
            this.expr(0);
            this.state = 448;
            this.match(PseudocodeParser.COMMA);
            this.state = 449;
            this.expr(0);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public closeFileStatement(): CloseFileStatementContext {
        let localContext = new CloseFileStatementContext(this.context, this.state);
        this.enterRule(localContext, 50, PseudocodeParser.RULE_closeFileStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 451;
            this.match(PseudocodeParser.CLOSEFILE);
            this.state = 452;
            this.expr(0);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public fileMode(): FileModeContext {
        let localContext = new FileModeContext(this.context, this.state);
        this.enterRule(localContext, 52, PseudocodeParser.RULE_fileMode);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 454;
            _la = this.tokenStream.LA(1);
            if(!(((((_la - 43)) & ~0x1F) === 0 && ((1 << (_la - 43)) & 7) !== 0))) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public argList(): ArgListContext {
        let localContext = new ArgListContext(this.context, this.state);
        this.enterRule(localContext, 54, PseudocodeParser.RULE_argList);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 456;
            this.expr(0);
            this.state = 461;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 68) {
                {
                {
                this.state = 457;
                this.match(PseudocodeParser.COMMA);
                this.state = 458;
                this.expr(0);
                }
                }
                this.state = 463;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public block(): BlockContext {
        let localContext = new BlockContext(this.context, this.state);
        this.enterRule(localContext, 56, PseudocodeParser.RULE_block);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 464;
            this.statement();
            this.state = 473;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 44, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 466;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    do {
                        {
                        {
                        this.state = 465;
                        this.match(PseudocodeParser.NEWLINE);
                        }
                        }
                        this.state = 468;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                    } while (_la === 75);
                    this.state = 470;
                    this.statement();
                    }
                    }
                }
                this.state = 475;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 44, this.context);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }

    public expr(): ExprContext;
    public expr(_p: number): ExprContext;
    public expr(_p?: number): ExprContext {
        if (_p === undefined) {
            _p = 0;
        }

        let parentContext = this.context;
        let parentState = this.state;
        let localContext = new ExprContext(this.context, parentState);
        let previousContext = localContext;
        let _startState = 58;
        this.enterRecursionRule(localContext, 58, PseudocodeParser.RULE_expr, _p);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 482;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case PseudocodeParser.NOT:
                {
                localContext = new NotExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;

                this.state = 477;
                this.match(PseudocodeParser.NOT);
                this.state = 478;
                this.expr(10);
                }
                break;
            case PseudocodeParser.MINUS:
                {
                localContext = new UnaryMinusExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 479;
                this.match(PseudocodeParser.MINUS);
                this.state = 480;
                this.expr(9);
                }
                break;
            case PseudocodeParser.TRUE:
            case PseudocodeParser.FALSE:
            case PseudocodeParser.MOD:
            case PseudocodeParser.DIV:
            case PseudocodeParser.LPAREN:
            case PseudocodeParser.REAL_LITERAL:
            case PseudocodeParser.INTEGER_LITERAL:
            case PseudocodeParser.STRING_LITERAL:
            case PseudocodeParser.CHAR_LITERAL:
            case PseudocodeParser.IDENTIFIER:
                {
                localContext = new AtomExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 481;
                this.atom();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
            this.context!.stop = this.tokenStream.LT(-1);
            this.state = 507;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 47, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    if (this.parseListeners != null) {
                        this.triggerExitRuleEvent();
                    }
                    previousContext = localContext;
                    {
                    this.state = 505;
                    this.errorHandler.sync(this);
                    switch (this.interpreter.adaptivePredict(this.tokenStream, 46, this.context) ) {
                    case 1:
                        {
                        localContext = new PowerExprContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, PseudocodeParser.RULE_expr);
                        this.state = 484;
                        if (!(this.precpred(this.context, 8))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 8)");
                        }
                        this.state = 485;
                        this.match(PseudocodeParser.CARET);
                        this.state = 486;
                        this.expr(8);
                        }
                        break;
                    case 2:
                        {
                        localContext = new MulDivExprContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, PseudocodeParser.RULE_expr);
                        this.state = 487;
                        if (!(this.precpred(this.context, 7))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 7)");
                        }
                        this.state = 488;
                        (localContext as MulDivExprContext)._op = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!(((((_la - 37)) & ~0x1F) === 0 && ((1 << (_la - 37)) & 25165827) !== 0))) {
                            (localContext as MulDivExprContext)._op = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 489;
                        this.expr(8);
                        }
                        break;
                    case 3:
                        {
                        localContext = new AddSubExprContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, PseudocodeParser.RULE_expr);
                        this.state = 490;
                        if (!(this.precpred(this.context, 6))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 6)");
                        }
                        this.state = 491;
                        (localContext as AddSubExprContext)._op = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!(_la === 58 || _la === 59)) {
                            (localContext as AddSubExprContext)._op = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 492;
                        this.expr(7);
                        }
                        break;
                    case 4:
                        {
                        localContext = new ConcatExprContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, PseudocodeParser.RULE_expr);
                        this.state = 493;
                        if (!(this.precpred(this.context, 5))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 5)");
                        }
                        this.state = 494;
                        this.match(PseudocodeParser.AMPERSAND);
                        this.state = 495;
                        this.expr(6);
                        }
                        break;
                    case 5:
                        {
                        localContext = new ComparisonExprContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, PseudocodeParser.RULE_expr);
                        this.state = 496;
                        if (!(this.precpred(this.context, 4))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 4)");
                        }
                        this.state = 497;
                        (localContext as ComparisonExprContext)._op = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!(((((_la - 52)) & ~0x1F) === 0 && ((1 << (_la - 52)) & 63) !== 0))) {
                            (localContext as ComparisonExprContext)._op = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 498;
                        this.expr(5);
                        }
                        break;
                    case 6:
                        {
                        localContext = new AndExprContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, PseudocodeParser.RULE_expr);
                        this.state = 499;
                        if (!(this.precpred(this.context, 3))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 3)");
                        }
                        this.state = 500;
                        this.match(PseudocodeParser.AND);
                        this.state = 501;
                        this.expr(4);
                        }
                        break;
                    case 7:
                        {
                        localContext = new OrExprContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, PseudocodeParser.RULE_expr);
                        this.state = 502;
                        if (!(this.precpred(this.context, 2))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 2)");
                        }
                        this.state = 503;
                        this.match(PseudocodeParser.OR);
                        this.state = 504;
                        this.expr(3);
                        }
                        break;
                    }
                    }
                }
                this.state = 509;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 47, this.context);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.unrollRecursionContexts(parentContext);
        }
        return localContext;
    }
    public atom(): AtomContext {
        let localContext = new AtomContext(this.context, this.state);
        this.enterRule(localContext, 60, PseudocodeParser.RULE_atom);
        let _la: number;
        try {
            this.state = 553;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 49, this.context) ) {
            case 1:
                localContext = new ParenAtomContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 510;
                this.match(PseudocodeParser.LPAREN);
                this.state = 511;
                this.expr(0);
                this.state = 512;
                this.match(PseudocodeParser.RPAREN);
                }
                break;
            case 2:
                localContext = new FunctionCallAtomContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 514;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 515;
                this.match(PseudocodeParser.LPAREN);
                this.state = 517;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & 1107296287) !== 0) || ((((_la - 70)) & ~0x1F) === 0 && ((1 << (_la - 70)) & 31) !== 0)) {
                    {
                    this.state = 516;
                    this.argList();
                    }
                }

                this.state = 519;
                this.match(PseudocodeParser.RPAREN);
                }
                break;
            case 3:
                localContext = new ArrayAccess1DAtomContext(localContext);
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 520;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 521;
                this.match(PseudocodeParser.LBRACKET);
                this.state = 522;
                this.expr(0);
                this.state = 523;
                this.match(PseudocodeParser.RBRACKET);
                }
                break;
            case 4:
                localContext = new ArrayAccess2DAtomContext(localContext);
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 525;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 526;
                this.match(PseudocodeParser.LBRACKET);
                this.state = 527;
                this.expr(0);
                this.state = 528;
                this.match(PseudocodeParser.COMMA);
                this.state = 529;
                this.expr(0);
                this.state = 530;
                this.match(PseudocodeParser.RBRACKET);
                }
                break;
            case 5:
                localContext = new DivFunctionAtomContext(localContext);
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 532;
                this.match(PseudocodeParser.DIV);
                this.state = 533;
                this.match(PseudocodeParser.LPAREN);
                this.state = 534;
                this.expr(0);
                this.state = 535;
                this.match(PseudocodeParser.COMMA);
                this.state = 536;
                this.expr(0);
                this.state = 537;
                this.match(PseudocodeParser.RPAREN);
                }
                break;
            case 6:
                localContext = new ModFunctionAtomContext(localContext);
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 539;
                this.match(PseudocodeParser.MOD);
                this.state = 540;
                this.match(PseudocodeParser.LPAREN);
                this.state = 541;
                this.expr(0);
                this.state = 542;
                this.match(PseudocodeParser.COMMA);
                this.state = 543;
                this.expr(0);
                this.state = 544;
                this.match(PseudocodeParser.RPAREN);
                }
                break;
            case 7:
                localContext = new IdentifierAtomContext(localContext);
                this.enterOuterAlt(localContext, 7);
                {
                this.state = 546;
                this.match(PseudocodeParser.IDENTIFIER);
                }
                break;
            case 8:
                localContext = new IntegerAtomContext(localContext);
                this.enterOuterAlt(localContext, 8);
                {
                this.state = 547;
                this.match(PseudocodeParser.INTEGER_LITERAL);
                }
                break;
            case 9:
                localContext = new RealAtomContext(localContext);
                this.enterOuterAlt(localContext, 9);
                {
                this.state = 548;
                this.match(PseudocodeParser.REAL_LITERAL);
                }
                break;
            case 10:
                localContext = new StringAtomContext(localContext);
                this.enterOuterAlt(localContext, 10);
                {
                this.state = 549;
                this.match(PseudocodeParser.STRING_LITERAL);
                }
                break;
            case 11:
                localContext = new CharAtomContext(localContext);
                this.enterOuterAlt(localContext, 11);
                {
                this.state = 550;
                this.match(PseudocodeParser.CHAR_LITERAL);
                }
                break;
            case 12:
                localContext = new TrueAtomContext(localContext);
                this.enterOuterAlt(localContext, 12);
                {
                this.state = 551;
                this.match(PseudocodeParser.TRUE);
                }
                break;
            case 13:
                localContext = new FalseAtomContext(localContext);
                this.enterOuterAlt(localContext, 13);
                {
                this.state = 552;
                this.match(PseudocodeParser.FALSE);
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }

    public override sempred(localContext: antlr.ParserRuleContext | null, ruleIndex: number, predIndex: number): boolean {
        switch (ruleIndex) {
        case 29:
            return this.expr_sempred(localContext as ExprContext, predIndex);
        }
        return true;
    }
    private expr_sempred(localContext: ExprContext | null, predIndex: number): boolean {
        switch (predIndex) {
        case 0:
            return this.precpred(this.context, 8);
        case 1:
            return this.precpred(this.context, 7);
        case 2:
            return this.precpred(this.context, 6);
        case 3:
            return this.precpred(this.context, 5);
        case 4:
            return this.precpred(this.context, 4);
        case 5:
            return this.precpred(this.context, 3);
        case 6:
            return this.precpred(this.context, 2);
        }
        return true;
    }

    public static readonly _serializedATN: number[] = [
        4,1,77,556,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,
        6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,2,11,7,11,2,12,7,12,2,13,7,13,
        2,14,7,14,2,15,7,15,2,16,7,16,2,17,7,17,2,18,7,18,2,19,7,19,2,20,
        7,20,2,21,7,21,2,22,7,22,2,23,7,23,2,24,7,24,2,25,7,25,2,26,7,26,
        2,27,7,27,2,28,7,28,2,29,7,29,2,30,7,30,1,0,5,0,64,8,0,10,0,12,0,
        67,9,0,1,0,1,0,4,0,71,8,0,11,0,12,0,72,1,0,5,0,76,8,0,10,0,12,0,
        79,9,0,3,0,81,8,0,1,0,5,0,84,8,0,10,0,12,0,87,9,0,1,0,1,0,1,1,1,
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
        1,3,1,109,8,1,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,
        2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,
        2,1,2,1,2,1,2,1,2,3,2,144,8,2,1,3,1,3,1,3,5,3,149,8,3,10,3,12,3,
        152,9,3,1,4,1,4,1,4,1,4,1,4,1,5,1,5,1,6,1,6,1,6,1,6,1,6,1,6,1,6,
        1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,
        1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,3,6,
        199,8,6,1,7,1,7,1,7,1,7,1,7,1,7,1,7,1,7,3,7,209,8,7,1,8,1,8,1,8,
        1,9,1,9,1,9,5,9,217,8,9,10,9,12,9,220,9,9,1,10,1,10,1,10,1,10,4,
        10,226,8,10,11,10,12,10,227,1,10,1,10,4,10,232,8,10,11,10,12,10,
        233,1,10,1,10,1,10,1,10,4,10,240,8,10,11,10,12,10,241,1,10,1,10,
        5,10,246,8,10,10,10,12,10,249,9,10,1,10,4,10,252,8,10,11,10,12,10,
        253,1,10,1,10,4,10,258,8,10,11,10,12,10,259,1,10,3,10,263,8,10,1,
        10,4,10,266,8,10,11,10,12,10,267,1,10,1,10,1,11,1,11,1,11,1,11,4,
        11,276,8,11,11,11,12,11,277,1,11,4,11,281,8,11,11,11,12,11,282,1,
        11,1,11,1,11,4,11,288,8,11,11,11,12,11,289,1,11,1,11,4,11,294,8,
        11,11,11,12,11,295,3,11,298,8,11,1,11,1,11,1,12,1,12,1,12,4,12,305,
        8,12,11,12,12,12,306,1,12,1,12,4,12,311,8,12,11,12,12,12,312,1,13,
        1,13,1,13,1,13,1,13,1,13,1,13,1,13,3,13,323,8,13,1,13,4,13,326,8,
        13,11,13,12,13,327,1,13,1,13,4,13,332,8,13,11,13,12,13,333,1,13,
        1,13,1,13,1,14,1,14,1,14,3,14,342,8,14,1,14,4,14,345,8,14,11,14,
        12,14,346,1,14,1,14,4,14,351,8,14,11,14,12,14,352,1,14,1,14,1,15,
        1,15,4,15,359,8,15,11,15,12,15,360,1,15,1,15,4,15,365,8,15,11,15,
        12,15,366,1,15,1,15,1,15,1,16,1,16,1,16,1,16,3,16,376,8,16,1,16,
        1,16,4,16,380,8,16,11,16,12,16,381,1,16,1,16,4,16,386,8,16,11,16,
        12,16,387,1,16,1,16,1,17,1,17,1,17,1,17,3,17,396,8,17,1,17,1,17,
        1,17,1,17,4,17,402,8,17,11,17,12,17,403,1,17,1,17,4,17,408,8,17,
        11,17,12,17,409,1,17,1,17,1,18,1,18,1,18,5,18,417,8,18,10,18,12,
        18,420,9,18,1,19,1,19,1,19,1,19,1,20,1,20,1,20,1,20,3,20,430,8,20,
        1,20,1,20,1,21,1,21,1,21,1,22,1,22,1,22,1,22,1,22,1,23,1,23,1,23,
        1,23,1,23,1,24,1,24,1,24,1,24,1,24,1,25,1,25,1,25,1,26,1,26,1,27,
        1,27,1,27,5,27,460,8,27,10,27,12,27,463,9,27,1,28,1,28,4,28,467,
        8,28,11,28,12,28,468,1,28,5,28,472,8,28,10,28,12,28,475,9,28,1,29,
        1,29,1,29,1,29,1,29,1,29,3,29,483,8,29,1,29,1,29,1,29,1,29,1,29,
        1,29,1,29,1,29,1,29,1,29,1,29,1,29,1,29,1,29,1,29,1,29,1,29,1,29,
        1,29,1,29,1,29,5,29,506,8,29,10,29,12,29,509,9,29,1,30,1,30,1,30,
        1,30,1,30,1,30,1,30,3,30,518,8,30,1,30,1,30,1,30,1,30,1,30,1,30,
        1,30,1,30,1,30,1,30,1,30,1,30,1,30,1,30,1,30,1,30,1,30,1,30,1,30,
        1,30,1,30,1,30,1,30,1,30,1,30,1,30,1,30,1,30,1,30,1,30,1,30,1,30,
        1,30,1,30,3,30,554,8,30,1,30,0,1,58,31,0,2,4,6,8,10,12,14,16,18,
        20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58,60,0,
        7,1,0,51,52,1,0,46,50,1,0,4,5,1,0,43,45,2,0,37,38,60,61,1,0,58,59,
        1,0,52,57,612,0,65,1,0,0,0,2,108,1,0,0,0,4,143,1,0,0,0,6,145,1,0,
        0,0,8,153,1,0,0,0,10,158,1,0,0,0,12,198,1,0,0,0,14,208,1,0,0,0,16,
        210,1,0,0,0,18,213,1,0,0,0,20,221,1,0,0,0,22,271,1,0,0,0,24,301,
        1,0,0,0,26,314,1,0,0,0,28,338,1,0,0,0,30,356,1,0,0,0,32,371,1,0,
        0,0,34,391,1,0,0,0,36,413,1,0,0,0,38,421,1,0,0,0,40,425,1,0,0,0,
        42,433,1,0,0,0,44,436,1,0,0,0,46,441,1,0,0,0,48,446,1,0,0,0,50,451,
        1,0,0,0,52,454,1,0,0,0,54,456,1,0,0,0,56,464,1,0,0,0,58,482,1,0,
        0,0,60,553,1,0,0,0,62,64,5,75,0,0,63,62,1,0,0,0,64,67,1,0,0,0,65,
        63,1,0,0,0,65,66,1,0,0,0,66,80,1,0,0,0,67,65,1,0,0,0,68,77,3,2,1,
        0,69,71,5,75,0,0,70,69,1,0,0,0,71,72,1,0,0,0,72,70,1,0,0,0,72,73,
        1,0,0,0,73,74,1,0,0,0,74,76,3,2,1,0,75,70,1,0,0,0,76,79,1,0,0,0,
        77,75,1,0,0,0,77,78,1,0,0,0,78,81,1,0,0,0,79,77,1,0,0,0,80,68,1,
        0,0,0,80,81,1,0,0,0,81,85,1,0,0,0,82,84,5,75,0,0,83,82,1,0,0,0,84,
        87,1,0,0,0,85,83,1,0,0,0,85,86,1,0,0,0,86,88,1,0,0,0,87,85,1,0,0,
        0,88,89,5,0,0,1,89,1,1,0,0,0,90,109,3,4,2,0,91,109,3,8,4,0,92,109,
        3,12,6,0,93,109,3,14,7,0,94,109,3,16,8,0,95,109,3,20,10,0,96,109,
        3,22,11,0,97,109,3,26,13,0,98,109,3,28,14,0,99,109,3,30,15,0,100,
        109,3,32,16,0,101,109,3,34,17,0,102,109,3,40,20,0,103,109,3,42,21,
        0,104,109,3,44,22,0,105,109,3,46,23,0,106,109,3,48,24,0,107,109,
        3,50,25,0,108,90,1,0,0,0,108,91,1,0,0,0,108,92,1,0,0,0,108,93,1,
        0,0,0,108,94,1,0,0,0,108,95,1,0,0,0,108,96,1,0,0,0,108,97,1,0,0,
        0,108,98,1,0,0,0,108,99,1,0,0,0,108,100,1,0,0,0,108,101,1,0,0,0,
        108,102,1,0,0,0,108,103,1,0,0,0,108,104,1,0,0,0,108,105,1,0,0,0,
        108,106,1,0,0,0,108,107,1,0,0,0,109,3,1,0,0,0,110,111,5,1,0,0,111,
        112,3,6,3,0,112,113,5,69,0,0,113,114,5,31,0,0,114,115,5,66,0,0,115,
        116,3,58,29,0,116,117,5,69,0,0,117,118,3,58,29,0,118,119,5,67,0,
        0,119,120,5,12,0,0,120,121,3,10,5,0,121,144,1,0,0,0,122,123,5,1,
        0,0,123,124,5,74,0,0,124,125,5,69,0,0,125,126,5,31,0,0,126,127,5,
        66,0,0,127,128,3,58,29,0,128,129,5,69,0,0,129,130,3,58,29,0,130,
        131,5,68,0,0,131,132,3,58,29,0,132,133,5,69,0,0,133,134,3,58,29,
        0,134,135,5,67,0,0,135,136,5,12,0,0,136,137,3,10,5,0,137,144,1,0,
        0,0,138,139,5,1,0,0,139,140,3,6,3,0,140,141,5,69,0,0,141,142,3,10,
        5,0,142,144,1,0,0,0,143,110,1,0,0,0,143,122,1,0,0,0,143,138,1,0,
        0,0,144,5,1,0,0,0,145,150,5,74,0,0,146,147,5,68,0,0,147,149,5,74,
        0,0,148,146,1,0,0,0,149,152,1,0,0,0,150,148,1,0,0,0,150,151,1,0,
        0,0,151,7,1,0,0,0,152,150,1,0,0,0,153,154,5,2,0,0,154,155,5,74,0,
        0,155,156,7,0,0,0,156,157,3,58,29,0,157,9,1,0,0,0,158,159,7,1,0,
        0,159,11,1,0,0,0,160,161,5,74,0,0,161,162,5,52,0,0,162,199,3,58,
        29,0,163,164,5,74,0,0,164,165,5,66,0,0,165,166,3,58,29,0,166,167,
        5,67,0,0,167,168,5,52,0,0,168,169,3,58,29,0,169,199,1,0,0,0,170,
        171,5,74,0,0,171,172,5,66,0,0,172,173,3,58,29,0,173,174,5,68,0,0,
        174,175,3,58,29,0,175,176,5,67,0,0,176,177,5,52,0,0,177,178,3,58,
        29,0,178,199,1,0,0,0,179,180,5,74,0,0,180,181,5,51,0,0,181,199,3,
        58,29,0,182,183,5,74,0,0,183,184,5,66,0,0,184,185,3,58,29,0,185,
        186,5,67,0,0,186,187,5,51,0,0,187,188,3,58,29,0,188,199,1,0,0,0,
        189,190,5,74,0,0,190,191,5,66,0,0,191,192,3,58,29,0,192,193,5,68,
        0,0,193,194,3,58,29,0,194,195,5,67,0,0,195,196,5,51,0,0,196,197,
        3,58,29,0,197,199,1,0,0,0,198,160,1,0,0,0,198,163,1,0,0,0,198,170,
        1,0,0,0,198,179,1,0,0,0,198,182,1,0,0,0,198,189,1,0,0,0,199,13,1,
        0,0,0,200,201,5,3,0,0,201,209,5,74,0,0,202,203,5,3,0,0,203,204,5,
        74,0,0,204,205,5,66,0,0,205,206,3,58,29,0,206,207,5,67,0,0,207,209,
        1,0,0,0,208,200,1,0,0,0,208,202,1,0,0,0,209,15,1,0,0,0,210,211,7,
        2,0,0,211,212,3,18,9,0,212,17,1,0,0,0,213,218,3,58,29,0,214,215,
        5,68,0,0,215,217,3,58,29,0,216,214,1,0,0,0,217,220,1,0,0,0,218,216,
        1,0,0,0,218,219,1,0,0,0,219,19,1,0,0,0,220,218,1,0,0,0,221,222,5,
        6,0,0,222,223,3,58,29,0,223,225,5,7,0,0,224,226,5,75,0,0,225,224,
        1,0,0,0,226,227,1,0,0,0,227,225,1,0,0,0,227,228,1,0,0,0,228,229,
        1,0,0,0,229,247,3,56,28,0,230,232,5,75,0,0,231,230,1,0,0,0,232,233,
        1,0,0,0,233,231,1,0,0,0,233,234,1,0,0,0,234,235,1,0,0,0,235,236,
        5,9,0,0,236,237,3,58,29,0,237,239,5,7,0,0,238,240,5,75,0,0,239,238,
        1,0,0,0,240,241,1,0,0,0,241,239,1,0,0,0,241,242,1,0,0,0,242,243,
        1,0,0,0,243,244,3,56,28,0,244,246,1,0,0,0,245,231,1,0,0,0,246,249,
        1,0,0,0,247,245,1,0,0,0,247,248,1,0,0,0,248,262,1,0,0,0,249,247,
        1,0,0,0,250,252,5,75,0,0,251,250,1,0,0,0,252,253,1,0,0,0,253,251,
        1,0,0,0,253,254,1,0,0,0,254,255,1,0,0,0,255,257,5,8,0,0,256,258,
        5,75,0,0,257,256,1,0,0,0,258,259,1,0,0,0,259,257,1,0,0,0,259,260,
        1,0,0,0,260,261,1,0,0,0,261,263,3,56,28,0,262,251,1,0,0,0,262,263,
        1,0,0,0,263,265,1,0,0,0,264,266,5,75,0,0,265,264,1,0,0,0,266,267,
        1,0,0,0,267,265,1,0,0,0,267,268,1,0,0,0,268,269,1,0,0,0,269,270,
        5,10,0,0,270,21,1,0,0,0,271,272,5,11,0,0,272,273,5,12,0,0,273,275,
        5,74,0,0,274,276,5,75,0,0,275,274,1,0,0,0,276,277,1,0,0,0,277,275,
        1,0,0,0,277,278,1,0,0,0,278,280,1,0,0,0,279,281,3,24,12,0,280,279,
        1,0,0,0,281,282,1,0,0,0,282,280,1,0,0,0,282,283,1,0,0,0,283,297,
        1,0,0,0,284,285,5,13,0,0,285,287,5,69,0,0,286,288,5,75,0,0,287,286,
        1,0,0,0,288,289,1,0,0,0,289,287,1,0,0,0,289,290,1,0,0,0,290,291,
        1,0,0,0,291,293,3,56,28,0,292,294,5,75,0,0,293,292,1,0,0,0,294,295,
        1,0,0,0,295,293,1,0,0,0,295,296,1,0,0,0,296,298,1,0,0,0,297,284,
        1,0,0,0,297,298,1,0,0,0,298,299,1,0,0,0,299,300,5,14,0,0,300,23,
        1,0,0,0,301,302,3,58,29,0,302,304,5,69,0,0,303,305,5,75,0,0,304,
        303,1,0,0,0,305,306,1,0,0,0,306,304,1,0,0,0,306,307,1,0,0,0,307,
        308,1,0,0,0,308,310,3,56,28,0,309,311,5,75,0,0,310,309,1,0,0,0,311,
        312,1,0,0,0,312,310,1,0,0,0,312,313,1,0,0,0,313,25,1,0,0,0,314,315,
        5,15,0,0,315,316,5,74,0,0,316,317,7,0,0,0,317,318,3,58,29,0,318,
        319,5,16,0,0,319,322,3,58,29,0,320,321,5,17,0,0,321,323,3,58,29,
        0,322,320,1,0,0,0,322,323,1,0,0,0,323,325,1,0,0,0,324,326,5,75,0,
        0,325,324,1,0,0,0,326,327,1,0,0,0,327,325,1,0,0,0,327,328,1,0,0,
        0,328,329,1,0,0,0,329,331,3,56,28,0,330,332,5,75,0,0,331,330,1,0,
        0,0,332,333,1,0,0,0,333,331,1,0,0,0,333,334,1,0,0,0,334,335,1,0,
        0,0,335,336,5,18,0,0,336,337,5,74,0,0,337,27,1,0,0,0,338,339,5,19,
        0,0,339,341,3,58,29,0,340,342,5,20,0,0,341,340,1,0,0,0,341,342,1,
        0,0,0,342,344,1,0,0,0,343,345,5,75,0,0,344,343,1,0,0,0,345,346,1,
        0,0,0,346,344,1,0,0,0,346,347,1,0,0,0,347,348,1,0,0,0,348,350,3,
        56,28,0,349,351,5,75,0,0,350,349,1,0,0,0,351,352,1,0,0,0,352,350,
        1,0,0,0,352,353,1,0,0,0,353,354,1,0,0,0,354,355,5,21,0,0,355,29,
        1,0,0,0,356,358,5,22,0,0,357,359,5,75,0,0,358,357,1,0,0,0,359,360,
        1,0,0,0,360,358,1,0,0,0,360,361,1,0,0,0,361,362,1,0,0,0,362,364,
        3,56,28,0,363,365,5,75,0,0,364,363,1,0,0,0,365,366,1,0,0,0,366,364,
        1,0,0,0,366,367,1,0,0,0,367,368,1,0,0,0,368,369,5,23,0,0,369,370,
        3,58,29,0,370,31,1,0,0,0,371,372,5,24,0,0,372,373,5,74,0,0,373,375,
        5,64,0,0,374,376,3,36,18,0,375,374,1,0,0,0,375,376,1,0,0,0,376,377,
        1,0,0,0,377,379,5,65,0,0,378,380,5,75,0,0,379,378,1,0,0,0,380,381,
        1,0,0,0,381,379,1,0,0,0,381,382,1,0,0,0,382,383,1,0,0,0,383,385,
        3,56,28,0,384,386,5,75,0,0,385,384,1,0,0,0,386,387,1,0,0,0,387,385,
        1,0,0,0,387,388,1,0,0,0,388,389,1,0,0,0,389,390,5,25,0,0,390,33,
        1,0,0,0,391,392,5,26,0,0,392,393,5,74,0,0,393,395,5,64,0,0,394,396,
        3,36,18,0,395,394,1,0,0,0,395,396,1,0,0,0,396,397,1,0,0,0,397,398,
        5,65,0,0,398,399,5,28,0,0,399,401,3,10,5,0,400,402,5,75,0,0,401,
        400,1,0,0,0,402,403,1,0,0,0,403,401,1,0,0,0,403,404,1,0,0,0,404,
        405,1,0,0,0,405,407,3,56,28,0,406,408,5,75,0,0,407,406,1,0,0,0,408,
        409,1,0,0,0,409,407,1,0,0,0,409,410,1,0,0,0,410,411,1,0,0,0,411,
        412,5,27,0,0,412,35,1,0,0,0,413,418,3,38,19,0,414,415,5,68,0,0,415,
        417,3,38,19,0,416,414,1,0,0,0,417,420,1,0,0,0,418,416,1,0,0,0,418,
        419,1,0,0,0,419,37,1,0,0,0,420,418,1,0,0,0,421,422,5,74,0,0,422,
        423,5,69,0,0,423,424,3,10,5,0,424,39,1,0,0,0,425,426,5,30,0,0,426,
        427,5,74,0,0,427,429,5,64,0,0,428,430,3,54,27,0,429,428,1,0,0,0,
        429,430,1,0,0,0,430,431,1,0,0,0,431,432,5,65,0,0,432,41,1,0,0,0,
        433,434,5,29,0,0,434,435,3,58,29,0,435,43,1,0,0,0,436,437,5,39,0,
        0,437,438,3,58,29,0,438,439,5,15,0,0,439,440,3,52,26,0,440,45,1,
        0,0,0,441,442,5,40,0,0,442,443,3,58,29,0,443,444,5,68,0,0,444,445,
        5,74,0,0,445,47,1,0,0,0,446,447,5,41,0,0,447,448,3,58,29,0,448,449,
        5,68,0,0,449,450,3,58,29,0,450,49,1,0,0,0,451,452,5,42,0,0,452,453,
        3,58,29,0,453,51,1,0,0,0,454,455,7,3,0,0,455,53,1,0,0,0,456,461,
        3,58,29,0,457,458,5,68,0,0,458,460,3,58,29,0,459,457,1,0,0,0,460,
        463,1,0,0,0,461,459,1,0,0,0,461,462,1,0,0,0,462,55,1,0,0,0,463,461,
        1,0,0,0,464,473,3,2,1,0,465,467,5,75,0,0,466,465,1,0,0,0,467,468,
        1,0,0,0,468,466,1,0,0,0,468,469,1,0,0,0,469,470,1,0,0,0,470,472,
        3,2,1,0,471,466,1,0,0,0,472,475,1,0,0,0,473,471,1,0,0,0,473,474,
        1,0,0,0,474,57,1,0,0,0,475,473,1,0,0,0,476,477,6,29,-1,0,477,478,
        5,34,0,0,478,483,3,58,29,10,479,480,5,59,0,0,480,483,3,58,29,9,481,
        483,3,60,30,0,482,476,1,0,0,0,482,479,1,0,0,0,482,481,1,0,0,0,483,
        507,1,0,0,0,484,485,10,8,0,0,485,486,5,62,0,0,486,506,3,58,29,8,
        487,488,10,7,0,0,488,489,7,4,0,0,489,506,3,58,29,8,490,491,10,6,
        0,0,491,492,7,5,0,0,492,506,3,58,29,7,493,494,10,5,0,0,494,495,5,
        63,0,0,495,506,3,58,29,6,496,497,10,4,0,0,497,498,7,6,0,0,498,506,
        3,58,29,5,499,500,10,3,0,0,500,501,5,32,0,0,501,506,3,58,29,4,502,
        503,10,2,0,0,503,504,5,33,0,0,504,506,3,58,29,3,505,484,1,0,0,0,
        505,487,1,0,0,0,505,490,1,0,0,0,505,493,1,0,0,0,505,496,1,0,0,0,
        505,499,1,0,0,0,505,502,1,0,0,0,506,509,1,0,0,0,507,505,1,0,0,0,
        507,508,1,0,0,0,508,59,1,0,0,0,509,507,1,0,0,0,510,511,5,64,0,0,
        511,512,3,58,29,0,512,513,5,65,0,0,513,554,1,0,0,0,514,515,5,74,
        0,0,515,517,5,64,0,0,516,518,3,54,27,0,517,516,1,0,0,0,517,518,1,
        0,0,0,518,519,1,0,0,0,519,554,5,65,0,0,520,521,5,74,0,0,521,522,
        5,66,0,0,522,523,3,58,29,0,523,524,5,67,0,0,524,554,1,0,0,0,525,
        526,5,74,0,0,526,527,5,66,0,0,527,528,3,58,29,0,528,529,5,68,0,0,
        529,530,3,58,29,0,530,531,5,67,0,0,531,554,1,0,0,0,532,533,5,38,
        0,0,533,534,5,64,0,0,534,535,3,58,29,0,535,536,5,68,0,0,536,537,
        3,58,29,0,537,538,5,65,0,0,538,554,1,0,0,0,539,540,5,37,0,0,540,
        541,5,64,0,0,541,542,3,58,29,0,542,543,5,68,0,0,543,544,3,58,29,
        0,544,545,5,65,0,0,545,554,1,0,0,0,546,554,5,74,0,0,547,554,5,71,
        0,0,548,554,5,70,0,0,549,554,5,72,0,0,550,554,5,73,0,0,551,554,5,
        35,0,0,552,554,5,36,0,0,553,510,1,0,0,0,553,514,1,0,0,0,553,520,
        1,0,0,0,553,525,1,0,0,0,553,532,1,0,0,0,553,539,1,0,0,0,553,546,
        1,0,0,0,553,547,1,0,0,0,553,548,1,0,0,0,553,549,1,0,0,0,553,550,
        1,0,0,0,553,551,1,0,0,0,553,552,1,0,0,0,554,61,1,0,0,0,50,65,72,
        77,80,85,108,143,150,198,208,218,227,233,241,247,253,259,262,267,
        277,282,289,295,297,306,312,322,327,333,341,346,352,360,366,375,
        381,387,395,403,409,418,429,461,468,473,482,505,507,517,553
    ];

    private static __ATN: antlr.ATN;
    public static get _ATN(): antlr.ATN {
        if (!PseudocodeParser.__ATN) {
            PseudocodeParser.__ATN = new antlr.ATNDeserializer().deserialize(PseudocodeParser._serializedATN);
        }

        return PseudocodeParser.__ATN;
    }


    private static readonly vocabulary = new antlr.Vocabulary(PseudocodeParser.literalNames, PseudocodeParser.symbolicNames, []);

    public override get vocabulary(): antlr.Vocabulary {
        return PseudocodeParser.vocabulary;
    }

    private static readonly decisionsToDFA = PseudocodeParser._ATN.decisionToState.map( (ds: antlr.DecisionState, index: number) => new antlr.DFA(ds, index) );
}

export class ProgramContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public EOF(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.EOF, 0)!;
    }
    public NEWLINE(): antlr.TerminalNode[];
    public NEWLINE(i: number): antlr.TerminalNode | null;
    public NEWLINE(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.NEWLINE);
    	} else {
    		return this.getToken(PseudocodeParser.NEWLINE, i);
    	}
    }
    public statement(): StatementContext[];
    public statement(i: number): StatementContext | null;
    public statement(i?: number): StatementContext[] | StatementContext | null {
        if (i === undefined) {
            return this.getRuleContexts(StatementContext);
        }

        return this.getRuleContext(i, StatementContext);
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_program;
    }
}


export class StatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public declareStatement(): DeclareStatementContext | null {
        return this.getRuleContext(0, DeclareStatementContext);
    }
    public constantStatement(): ConstantStatementContext | null {
        return this.getRuleContext(0, ConstantStatementContext);
    }
    public assignmentStatement(): AssignmentStatementContext | null {
        return this.getRuleContext(0, AssignmentStatementContext);
    }
    public inputStatement(): InputStatementContext | null {
        return this.getRuleContext(0, InputStatementContext);
    }
    public outputStatement(): OutputStatementContext | null {
        return this.getRuleContext(0, OutputStatementContext);
    }
    public ifStatement(): IfStatementContext | null {
        return this.getRuleContext(0, IfStatementContext);
    }
    public caseStatement(): CaseStatementContext | null {
        return this.getRuleContext(0, CaseStatementContext);
    }
    public forStatement(): ForStatementContext | null {
        return this.getRuleContext(0, ForStatementContext);
    }
    public whileStatement(): WhileStatementContext | null {
        return this.getRuleContext(0, WhileStatementContext);
    }
    public repeatStatement(): RepeatStatementContext | null {
        return this.getRuleContext(0, RepeatStatementContext);
    }
    public procedureDeclaration(): ProcedureDeclarationContext | null {
        return this.getRuleContext(0, ProcedureDeclarationContext);
    }
    public functionDeclaration(): FunctionDeclarationContext | null {
        return this.getRuleContext(0, FunctionDeclarationContext);
    }
    public callStatement(): CallStatementContext | null {
        return this.getRuleContext(0, CallStatementContext);
    }
    public returnStatement(): ReturnStatementContext | null {
        return this.getRuleContext(0, ReturnStatementContext);
    }
    public openFileStatement(): OpenFileStatementContext | null {
        return this.getRuleContext(0, OpenFileStatementContext);
    }
    public readFileStatement(): ReadFileStatementContext | null {
        return this.getRuleContext(0, ReadFileStatementContext);
    }
    public writeFileStatement(): WriteFileStatementContext | null {
        return this.getRuleContext(0, WriteFileStatementContext);
    }
    public closeFileStatement(): CloseFileStatementContext | null {
        return this.getRuleContext(0, CloseFileStatementContext);
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_statement;
    }
}


export class DeclareStatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public DECLARE(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.DECLARE, 0)!;
    }
    public identifierList(): IdentifierListContext | null {
        return this.getRuleContext(0, IdentifierListContext);
    }
    public COLON(): antlr.TerminalNode[];
    public COLON(i: number): antlr.TerminalNode | null;
    public COLON(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.COLON);
    	} else {
    		return this.getToken(PseudocodeParser.COLON, i);
    	}
    }
    public ARRAY(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.ARRAY, 0);
    }
    public LBRACKET(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.LBRACKET, 0);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public RBRACKET(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.RBRACKET, 0);
    }
    public OF(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.OF, 0);
    }
    public dataType(): DataTypeContext {
        return this.getRuleContext(0, DataTypeContext)!;
    }
    public IDENTIFIER(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.IDENTIFIER, 0);
    }
    public COMMA(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.COMMA, 0);
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_declareStatement;
    }
}


export class IdentifierListContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public IDENTIFIER(): antlr.TerminalNode[];
    public IDENTIFIER(i: number): antlr.TerminalNode | null;
    public IDENTIFIER(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.IDENTIFIER);
    	} else {
    		return this.getToken(PseudocodeParser.IDENTIFIER, i);
    	}
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.COMMA);
    	} else {
    		return this.getToken(PseudocodeParser.COMMA, i);
    	}
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_identifierList;
    }
}


export class ConstantStatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public CONSTANT(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.CONSTANT, 0)!;
    }
    public IDENTIFIER(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.IDENTIFIER, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public LARROW(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.LARROW, 0);
    }
    public EQUALS(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.EQUALS, 0);
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_constantStatement;
    }
}


export class DataTypeContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INTEGER_TYPE(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.INTEGER_TYPE, 0);
    }
    public REAL_TYPE(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.REAL_TYPE, 0);
    }
    public CHAR_TYPE(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.CHAR_TYPE, 0);
    }
    public STRING_TYPE(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.STRING_TYPE, 0);
    }
    public BOOLEAN_TYPE(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.BOOLEAN_TYPE, 0);
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_dataType;
    }
}


export class AssignmentStatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public IDENTIFIER(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.IDENTIFIER, 0)!;
    }
    public EQUALS(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.EQUALS, 0);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public LBRACKET(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.LBRACKET, 0);
    }
    public RBRACKET(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.RBRACKET, 0);
    }
    public COMMA(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.COMMA, 0);
    }
    public LARROW(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.LARROW, 0);
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_assignmentStatement;
    }
}


export class InputStatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INPUT(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.INPUT, 0)!;
    }
    public IDENTIFIER(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.IDENTIFIER, 0)!;
    }
    public LBRACKET(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.LBRACKET, 0);
    }
    public expr(): ExprContext | null {
        return this.getRuleContext(0, ExprContext);
    }
    public RBRACKET(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.RBRACKET, 0);
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_inputStatement;
    }
}


export class OutputStatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public exprList(): ExprListContext {
        return this.getRuleContext(0, ExprListContext)!;
    }
    public OUTPUT(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.OUTPUT, 0);
    }
    public PRINT(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.PRINT, 0);
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_outputStatement;
    }
}


export class ExprListContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.COMMA);
    	} else {
    		return this.getToken(PseudocodeParser.COMMA, i);
    	}
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_exprList;
    }
}


export class IfStatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public IF(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.IF, 0)!;
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public THEN(): antlr.TerminalNode[];
    public THEN(i: number): antlr.TerminalNode | null;
    public THEN(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.THEN);
    	} else {
    		return this.getToken(PseudocodeParser.THEN, i);
    	}
    }
    public block(): BlockContext[];
    public block(i: number): BlockContext | null;
    public block(i?: number): BlockContext[] | BlockContext | null {
        if (i === undefined) {
            return this.getRuleContexts(BlockContext);
        }

        return this.getRuleContext(i, BlockContext);
    }
    public ENDIF(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.ENDIF, 0)!;
    }
    public NEWLINE(): antlr.TerminalNode[];
    public NEWLINE(i: number): antlr.TerminalNode | null;
    public NEWLINE(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.NEWLINE);
    	} else {
    		return this.getToken(PseudocodeParser.NEWLINE, i);
    	}
    }
    public ELSEIF(): antlr.TerminalNode[];
    public ELSEIF(i: number): antlr.TerminalNode | null;
    public ELSEIF(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.ELSEIF);
    	} else {
    		return this.getToken(PseudocodeParser.ELSEIF, i);
    	}
    }
    public ELSE(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.ELSE, 0);
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_ifStatement;
    }
}


export class CaseStatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public CASE(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.CASE, 0)!;
    }
    public OF(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.OF, 0)!;
    }
    public IDENTIFIER(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.IDENTIFIER, 0)!;
    }
    public ENDCASE(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.ENDCASE, 0)!;
    }
    public NEWLINE(): antlr.TerminalNode[];
    public NEWLINE(i: number): antlr.TerminalNode | null;
    public NEWLINE(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.NEWLINE);
    	} else {
    		return this.getToken(PseudocodeParser.NEWLINE, i);
    	}
    }
    public caseClause(): CaseClauseContext[];
    public caseClause(i: number): CaseClauseContext | null;
    public caseClause(i?: number): CaseClauseContext[] | CaseClauseContext | null {
        if (i === undefined) {
            return this.getRuleContexts(CaseClauseContext);
        }

        return this.getRuleContext(i, CaseClauseContext);
    }
    public OTHERWISE(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.OTHERWISE, 0);
    }
    public COLON(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.COLON, 0);
    }
    public block(): BlockContext | null {
        return this.getRuleContext(0, BlockContext);
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_caseStatement;
    }
}


export class CaseClauseContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public COLON(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.COLON, 0)!;
    }
    public block(): BlockContext {
        return this.getRuleContext(0, BlockContext)!;
    }
    public NEWLINE(): antlr.TerminalNode[];
    public NEWLINE(i: number): antlr.TerminalNode | null;
    public NEWLINE(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.NEWLINE);
    	} else {
    		return this.getToken(PseudocodeParser.NEWLINE, i);
    	}
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_caseClause;
    }
}


export class ForStatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public FOR(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.FOR, 0)!;
    }
    public IDENTIFIER(): antlr.TerminalNode[];
    public IDENTIFIER(i: number): antlr.TerminalNode | null;
    public IDENTIFIER(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.IDENTIFIER);
    	} else {
    		return this.getToken(PseudocodeParser.IDENTIFIER, i);
    	}
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public TO(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.TO, 0)!;
    }
    public block(): BlockContext {
        return this.getRuleContext(0, BlockContext)!;
    }
    public NEXT(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.NEXT, 0)!;
    }
    public LARROW(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.LARROW, 0);
    }
    public EQUALS(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.EQUALS, 0);
    }
    public STEP(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.STEP, 0);
    }
    public NEWLINE(): antlr.TerminalNode[];
    public NEWLINE(i: number): antlr.TerminalNode | null;
    public NEWLINE(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.NEWLINE);
    	} else {
    		return this.getToken(PseudocodeParser.NEWLINE, i);
    	}
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_forStatement;
    }
}


export class WhileStatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public WHILE(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.WHILE, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public block(): BlockContext {
        return this.getRuleContext(0, BlockContext)!;
    }
    public ENDWHILE(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.ENDWHILE, 0)!;
    }
    public DO(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.DO, 0);
    }
    public NEWLINE(): antlr.TerminalNode[];
    public NEWLINE(i: number): antlr.TerminalNode | null;
    public NEWLINE(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.NEWLINE);
    	} else {
    		return this.getToken(PseudocodeParser.NEWLINE, i);
    	}
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_whileStatement;
    }
}


export class RepeatStatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public REPEAT(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.REPEAT, 0)!;
    }
    public block(): BlockContext {
        return this.getRuleContext(0, BlockContext)!;
    }
    public UNTIL(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.UNTIL, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public NEWLINE(): antlr.TerminalNode[];
    public NEWLINE(i: number): antlr.TerminalNode | null;
    public NEWLINE(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.NEWLINE);
    	} else {
    		return this.getToken(PseudocodeParser.NEWLINE, i);
    	}
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_repeatStatement;
    }
}


export class ProcedureDeclarationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public PROCEDURE(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.PROCEDURE, 0)!;
    }
    public IDENTIFIER(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.IDENTIFIER, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.LPAREN, 0)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.RPAREN, 0)!;
    }
    public block(): BlockContext {
        return this.getRuleContext(0, BlockContext)!;
    }
    public ENDPROCEDURE(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.ENDPROCEDURE, 0)!;
    }
    public paramList(): ParamListContext | null {
        return this.getRuleContext(0, ParamListContext);
    }
    public NEWLINE(): antlr.TerminalNode[];
    public NEWLINE(i: number): antlr.TerminalNode | null;
    public NEWLINE(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.NEWLINE);
    	} else {
    		return this.getToken(PseudocodeParser.NEWLINE, i);
    	}
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_procedureDeclaration;
    }
}


export class FunctionDeclarationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public FUNCTION(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.FUNCTION, 0)!;
    }
    public IDENTIFIER(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.IDENTIFIER, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.LPAREN, 0)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.RPAREN, 0)!;
    }
    public RETURNS(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.RETURNS, 0)!;
    }
    public dataType(): DataTypeContext {
        return this.getRuleContext(0, DataTypeContext)!;
    }
    public block(): BlockContext {
        return this.getRuleContext(0, BlockContext)!;
    }
    public ENDFUNCTION(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.ENDFUNCTION, 0)!;
    }
    public paramList(): ParamListContext | null {
        return this.getRuleContext(0, ParamListContext);
    }
    public NEWLINE(): antlr.TerminalNode[];
    public NEWLINE(i: number): antlr.TerminalNode | null;
    public NEWLINE(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.NEWLINE);
    	} else {
    		return this.getToken(PseudocodeParser.NEWLINE, i);
    	}
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_functionDeclaration;
    }
}


export class ParamListContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public param(): ParamContext[];
    public param(i: number): ParamContext | null;
    public param(i?: number): ParamContext[] | ParamContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ParamContext);
        }

        return this.getRuleContext(i, ParamContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.COMMA);
    	} else {
    		return this.getToken(PseudocodeParser.COMMA, i);
    	}
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_paramList;
    }
}


export class ParamContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public IDENTIFIER(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.IDENTIFIER, 0)!;
    }
    public COLON(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.COLON, 0)!;
    }
    public dataType(): DataTypeContext {
        return this.getRuleContext(0, DataTypeContext)!;
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_param;
    }
}


export class CallStatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public CALL(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.CALL, 0)!;
    }
    public IDENTIFIER(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.IDENTIFIER, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.LPAREN, 0)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.RPAREN, 0)!;
    }
    public argList(): ArgListContext | null {
        return this.getRuleContext(0, ArgListContext);
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_callStatement;
    }
}


export class ReturnStatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public RETURN(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.RETURN, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_returnStatement;
    }
}


export class OpenFileStatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public OPENFILE(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.OPENFILE, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public FOR(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.FOR, 0)!;
    }
    public fileMode(): FileModeContext {
        return this.getRuleContext(0, FileModeContext)!;
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_openFileStatement;
    }
}


export class ReadFileStatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public READFILE(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.READFILE, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public COMMA(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.COMMA, 0)!;
    }
    public IDENTIFIER(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.IDENTIFIER, 0)!;
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_readFileStatement;
    }
}


export class WriteFileStatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public WRITEFILE(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.WRITEFILE, 0)!;
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public COMMA(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.COMMA, 0)!;
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_writeFileStatement;
    }
}


export class CloseFileStatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public CLOSEFILE(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.CLOSEFILE, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_closeFileStatement;
    }
}


export class FileModeContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public READ_MODE(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.READ_MODE, 0);
    }
    public WRITE_MODE(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.WRITE_MODE, 0);
    }
    public APPEND_MODE(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.APPEND_MODE, 0);
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_fileMode;
    }
}


export class ArgListContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.COMMA);
    	} else {
    		return this.getToken(PseudocodeParser.COMMA, i);
    	}
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_argList;
    }
}


export class BlockContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public statement(): StatementContext[];
    public statement(i: number): StatementContext | null;
    public statement(i?: number): StatementContext[] | StatementContext | null {
        if (i === undefined) {
            return this.getRuleContexts(StatementContext);
        }

        return this.getRuleContext(i, StatementContext);
    }
    public NEWLINE(): antlr.TerminalNode[];
    public NEWLINE(i: number): antlr.TerminalNode | null;
    public NEWLINE(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.NEWLINE);
    	} else {
    		return this.getToken(PseudocodeParser.NEWLINE, i);
    	}
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_block;
    }
}


export class ExprContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_expr;
    }
    public override copyFrom(ctx: ExprContext): void {
        super.copyFrom(ctx);
    }
}
export class NotExprContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public NOT(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.NOT, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
}
export class UnaryMinusExprContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public MINUS(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.MINUS, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
}
export class AtomExprContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public atom(): AtomContext {
        return this.getRuleContext(0, AtomContext)!;
    }
}
export class PowerExprContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public CARET(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.CARET, 0)!;
    }
}
export class MulDivExprContext extends ExprContext {
    public _op?: Token | null;
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public STAR(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.STAR, 0);
    }
    public SLASH(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.SLASH, 0);
    }
    public DIV(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.DIV, 0);
    }
    public MOD(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.MOD, 0);
    }
}
export class AddSubExprContext extends ExprContext {
    public _op?: Token | null;
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public PLUS(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.PLUS, 0);
    }
    public MINUS(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.MINUS, 0);
    }
}
export class ConcatExprContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public AMPERSAND(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.AMPERSAND, 0)!;
    }
}
export class ComparisonExprContext extends ExprContext {
    public _op?: Token | null;
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public EQUALS(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.EQUALS, 0);
    }
    public NOTEQUAL(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.NOTEQUAL, 0);
    }
    public LT(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.LT, 0);
    }
    public GT(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.GT, 0);
    }
    public LTE(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.LTE, 0);
    }
    public GTE(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.GTE, 0);
    }
}
export class AndExprContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public AND(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.AND, 0)!;
    }
}
export class OrExprContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public OR(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.OR, 0)!;
    }
}


export class AtomContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_atom;
    }
    public override copyFrom(ctx: AtomContext): void {
        super.copyFrom(ctx);
    }
}
export class ParenAtomContext extends AtomContext {
    public constructor(ctx: AtomContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.LPAREN, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.RPAREN, 0)!;
    }
}
export class FunctionCallAtomContext extends AtomContext {
    public constructor(ctx: AtomContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public IDENTIFIER(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.IDENTIFIER, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.LPAREN, 0)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.RPAREN, 0)!;
    }
    public argList(): ArgListContext | null {
        return this.getRuleContext(0, ArgListContext);
    }
}
export class ArrayAccess1DAtomContext extends AtomContext {
    public constructor(ctx: AtomContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public IDENTIFIER(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.IDENTIFIER, 0)!;
    }
    public LBRACKET(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.LBRACKET, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public RBRACKET(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.RBRACKET, 0)!;
    }
}
export class ArrayAccess2DAtomContext extends AtomContext {
    public constructor(ctx: AtomContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public IDENTIFIER(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.IDENTIFIER, 0)!;
    }
    public LBRACKET(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.LBRACKET, 0)!;
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public COMMA(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.COMMA, 0)!;
    }
    public RBRACKET(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.RBRACKET, 0)!;
    }
}
export class DivFunctionAtomContext extends AtomContext {
    public constructor(ctx: AtomContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public DIV(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.DIV, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.LPAREN, 0)!;
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public COMMA(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.COMMA, 0)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.RPAREN, 0)!;
    }
}
export class ModFunctionAtomContext extends AtomContext {
    public constructor(ctx: AtomContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public MOD(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.MOD, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.LPAREN, 0)!;
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public COMMA(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.COMMA, 0)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.RPAREN, 0)!;
    }
}
export class IdentifierAtomContext extends AtomContext {
    public constructor(ctx: AtomContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public IDENTIFIER(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.IDENTIFIER, 0)!;
    }
}
export class IntegerAtomContext extends AtomContext {
    public constructor(ctx: AtomContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public INTEGER_LITERAL(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.INTEGER_LITERAL, 0)!;
    }
}
export class RealAtomContext extends AtomContext {
    public constructor(ctx: AtomContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public REAL_LITERAL(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.REAL_LITERAL, 0)!;
    }
}
export class StringAtomContext extends AtomContext {
    public constructor(ctx: AtomContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public STRING_LITERAL(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.STRING_LITERAL, 0)!;
    }
}
export class CharAtomContext extends AtomContext {
    public constructor(ctx: AtomContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public CHAR_LITERAL(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.CHAR_LITERAL, 0)!;
    }
}
export class TrueAtomContext extends AtomContext {
    public constructor(ctx: AtomContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public TRUE(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.TRUE, 0)!;
    }
}
export class FalseAtomContext extends AtomContext {
    public constructor(ctx: AtomContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public FALSE(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.FALSE, 0)!;
    }
}
