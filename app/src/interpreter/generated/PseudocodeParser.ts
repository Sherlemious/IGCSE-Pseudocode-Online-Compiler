// Generated from src/interpreter/grammar/Pseudocode.g4 by ANTLR 4.13.1

import * as antlr from "antlr4ng";
import { Token } from "antlr4ng";

import { PseudocodeListener } from "./PseudocodeListener.js";
import { PseudocodeVisitor } from "./PseudocodeVisitor.js";

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
            this.state = 81;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 1699252350) !== 0) || ((((_la - 39)) & ~0x1F) === 0 && ((1 << (_la - 39)) & 15) !== 0) || _la === 74) {
                {
                this.state = 68;
                this.statement();
                this.state = 78;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 2, this.context);
                while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                    if (alternative === 1) {
                        {
                        {
                        this.state = 72;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                        while (_la === 75) {
                            {
                            {
                            this.state = 69;
                            this.match(PseudocodeParser.NEWLINE);
                            }
                            }
                            this.state = 74;
                            this.errorHandler.sync(this);
                            _la = this.tokenStream.LA(1);
                        }
                        this.state = 75;
                        this.statement();
                        }
                        }
                    }
                    this.state = 80;
                    this.errorHandler.sync(this);
                    alternative = this.interpreter.adaptivePredict(this.tokenStream, 2, this.context);
                }
                }
            }

            this.state = 86;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 75) {
                {
                {
                this.state = 83;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 88;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 89;
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
            this.state = 109;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case PseudocodeParser.DECLARE:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 91;
                this.declareStatement();
                }
                break;
            case PseudocodeParser.CONSTANT:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 92;
                this.constantStatement();
                }
                break;
            case PseudocodeParser.IDENTIFIER:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 93;
                this.assignmentStatement();
                }
                break;
            case PseudocodeParser.INPUT:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 94;
                this.inputStatement();
                }
                break;
            case PseudocodeParser.OUTPUT:
            case PseudocodeParser.PRINT:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 95;
                this.outputStatement();
                }
                break;
            case PseudocodeParser.IF:
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 96;
                this.ifStatement();
                }
                break;
            case PseudocodeParser.CASE:
                this.enterOuterAlt(localContext, 7);
                {
                this.state = 97;
                this.caseStatement();
                }
                break;
            case PseudocodeParser.FOR:
                this.enterOuterAlt(localContext, 8);
                {
                this.state = 98;
                this.forStatement();
                }
                break;
            case PseudocodeParser.WHILE:
                this.enterOuterAlt(localContext, 9);
                {
                this.state = 99;
                this.whileStatement();
                }
                break;
            case PseudocodeParser.REPEAT:
                this.enterOuterAlt(localContext, 10);
                {
                this.state = 100;
                this.repeatStatement();
                }
                break;
            case PseudocodeParser.PROCEDURE:
                this.enterOuterAlt(localContext, 11);
                {
                this.state = 101;
                this.procedureDeclaration();
                }
                break;
            case PseudocodeParser.FUNCTION:
                this.enterOuterAlt(localContext, 12);
                {
                this.state = 102;
                this.functionDeclaration();
                }
                break;
            case PseudocodeParser.CALL:
                this.enterOuterAlt(localContext, 13);
                {
                this.state = 103;
                this.callStatement();
                }
                break;
            case PseudocodeParser.RETURN:
                this.enterOuterAlt(localContext, 14);
                {
                this.state = 104;
                this.returnStatement();
                }
                break;
            case PseudocodeParser.OPENFILE:
                this.enterOuterAlt(localContext, 15);
                {
                this.state = 105;
                this.openFileStatement();
                }
                break;
            case PseudocodeParser.READFILE:
                this.enterOuterAlt(localContext, 16);
                {
                this.state = 106;
                this.readFileStatement();
                }
                break;
            case PseudocodeParser.WRITEFILE:
                this.enterOuterAlt(localContext, 17);
                {
                this.state = 107;
                this.writeFileStatement();
                }
                break;
            case PseudocodeParser.CLOSEFILE:
                this.enterOuterAlt(localContext, 18);
                {
                this.state = 108;
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
            this.state = 144;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 6, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 111;
                this.match(PseudocodeParser.DECLARE);
                this.state = 112;
                this.identifierList();
                this.state = 113;
                this.match(PseudocodeParser.COLON);
                this.state = 114;
                this.match(PseudocodeParser.ARRAY);
                this.state = 115;
                this.match(PseudocodeParser.LBRACKET);
                this.state = 116;
                this.expr(0);
                this.state = 117;
                this.match(PseudocodeParser.COLON);
                this.state = 118;
                this.expr(0);
                this.state = 119;
                this.match(PseudocodeParser.RBRACKET);
                this.state = 120;
                this.match(PseudocodeParser.OF);
                this.state = 121;
                this.dataType();
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 123;
                this.match(PseudocodeParser.DECLARE);
                this.state = 124;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 125;
                this.match(PseudocodeParser.COLON);
                this.state = 126;
                this.match(PseudocodeParser.ARRAY);
                this.state = 127;
                this.match(PseudocodeParser.LBRACKET);
                this.state = 128;
                this.expr(0);
                this.state = 129;
                this.match(PseudocodeParser.COLON);
                this.state = 130;
                this.expr(0);
                this.state = 131;
                this.match(PseudocodeParser.COMMA);
                this.state = 132;
                this.expr(0);
                this.state = 133;
                this.match(PseudocodeParser.COLON);
                this.state = 134;
                this.expr(0);
                this.state = 135;
                this.match(PseudocodeParser.RBRACKET);
                this.state = 136;
                this.match(PseudocodeParser.OF);
                this.state = 137;
                this.dataType();
                }
                break;
            case 3:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 139;
                this.match(PseudocodeParser.DECLARE);
                this.state = 140;
                this.identifierList();
                this.state = 141;
                this.match(PseudocodeParser.COLON);
                this.state = 142;
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
            this.state = 146;
            this.match(PseudocodeParser.IDENTIFIER);
            this.state = 151;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 68) {
                {
                {
                this.state = 147;
                this.match(PseudocodeParser.COMMA);
                this.state = 148;
                this.match(PseudocodeParser.IDENTIFIER);
                }
                }
                this.state = 153;
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
            this.state = 154;
            this.match(PseudocodeParser.CONSTANT);
            this.state = 155;
            this.match(PseudocodeParser.IDENTIFIER);
            this.state = 156;
            _la = this.tokenStream.LA(1);
            if(!(_la === 51 || _la === 52)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            this.state = 157;
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
            this.state = 159;
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
            this.state = 199;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 8, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 161;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 162;
                this.match(PseudocodeParser.EQUALS);
                this.state = 163;
                this.expr(0);
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 164;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 165;
                this.match(PseudocodeParser.LBRACKET);
                this.state = 166;
                this.expr(0);
                this.state = 167;
                this.match(PseudocodeParser.RBRACKET);
                this.state = 168;
                this.match(PseudocodeParser.EQUALS);
                this.state = 169;
                this.expr(0);
                }
                break;
            case 3:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 171;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 172;
                this.match(PseudocodeParser.LBRACKET);
                this.state = 173;
                this.expr(0);
                this.state = 174;
                this.match(PseudocodeParser.COMMA);
                this.state = 175;
                this.expr(0);
                this.state = 176;
                this.match(PseudocodeParser.RBRACKET);
                this.state = 177;
                this.match(PseudocodeParser.EQUALS);
                this.state = 178;
                this.expr(0);
                }
                break;
            case 4:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 180;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 181;
                this.match(PseudocodeParser.LARROW);
                this.state = 182;
                this.expr(0);
                }
                break;
            case 5:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 183;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 184;
                this.match(PseudocodeParser.LBRACKET);
                this.state = 185;
                this.expr(0);
                this.state = 186;
                this.match(PseudocodeParser.RBRACKET);
                this.state = 187;
                this.match(PseudocodeParser.LARROW);
                this.state = 188;
                this.expr(0);
                }
                break;
            case 6:
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 190;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 191;
                this.match(PseudocodeParser.LBRACKET);
                this.state = 192;
                this.expr(0);
                this.state = 193;
                this.match(PseudocodeParser.COMMA);
                this.state = 194;
                this.expr(0);
                this.state = 195;
                this.match(PseudocodeParser.RBRACKET);
                this.state = 196;
                this.match(PseudocodeParser.LARROW);
                this.state = 197;
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
        let _la: number;
        try {
            this.state = 216;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 11, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 201;
                this.match(PseudocodeParser.INPUT);
                this.state = 202;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 205;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 68) {
                    {
                    this.state = 203;
                    this.match(PseudocodeParser.COMMA);
                    this.state = 204;
                    this.match(PseudocodeParser.STRING_LITERAL);
                    }
                }

                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 207;
                this.match(PseudocodeParser.INPUT);
                this.state = 208;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 209;
                this.match(PseudocodeParser.LBRACKET);
                this.state = 210;
                this.expr(0);
                this.state = 211;
                this.match(PseudocodeParser.RBRACKET);
                this.state = 214;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 68) {
                    {
                    this.state = 212;
                    this.match(PseudocodeParser.COMMA);
                    this.state = 213;
                    this.match(PseudocodeParser.STRING_LITERAL);
                    }
                }

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
            this.state = 218;
            _la = this.tokenStream.LA(1);
            if(!(_la === 4 || _la === 5)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            this.state = 219;
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
            this.state = 221;
            this.expr(0);
            this.state = 226;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 68) {
                {
                {
                this.state = 222;
                this.match(PseudocodeParser.COMMA);
                this.state = 223;
                this.expr(0);
                }
                }
                this.state = 228;
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
            this.state = 229;
            this.match(PseudocodeParser.IF);
            this.state = 230;
            this.expr(0);
            this.state = 234;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 13, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 231;
                    this.match(PseudocodeParser.NEWLINE);
                    }
                    }
                }
                this.state = 236;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 13, this.context);
            }
            this.state = 238;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 7) {
                {
                this.state = 237;
                this.match(PseudocodeParser.THEN);
                }
            }

            this.state = 243;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 75) {
                {
                {
                this.state = 240;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 245;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 246;
            this.block();
            this.state = 274;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 20, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 250;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    while (_la === 75) {
                        {
                        {
                        this.state = 247;
                        this.match(PseudocodeParser.NEWLINE);
                        }
                        }
                        this.state = 252;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                    }
                    this.state = 253;
                    this.match(PseudocodeParser.ELSEIF);
                    this.state = 254;
                    this.expr(0);
                    this.state = 258;
                    this.errorHandler.sync(this);
                    alternative = this.interpreter.adaptivePredict(this.tokenStream, 17, this.context);
                    while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                        if (alternative === 1) {
                            {
                            {
                            this.state = 255;
                            this.match(PseudocodeParser.NEWLINE);
                            }
                            }
                        }
                        this.state = 260;
                        this.errorHandler.sync(this);
                        alternative = this.interpreter.adaptivePredict(this.tokenStream, 17, this.context);
                    }
                    this.state = 262;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    if (_la === 7) {
                        {
                        this.state = 261;
                        this.match(PseudocodeParser.THEN);
                        }
                    }

                    this.state = 267;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    while (_la === 75) {
                        {
                        {
                        this.state = 264;
                        this.match(PseudocodeParser.NEWLINE);
                        }
                        }
                        this.state = 269;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                    }
                    this.state = 270;
                    this.block();
                    }
                    }
                }
                this.state = 276;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 20, this.context);
            }
            this.state = 291;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 23, this.context) ) {
            case 1:
                {
                this.state = 280;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 75) {
                    {
                    {
                    this.state = 277;
                    this.match(PseudocodeParser.NEWLINE);
                    }
                    }
                    this.state = 282;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 283;
                this.match(PseudocodeParser.ELSE);
                this.state = 287;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 75) {
                    {
                    {
                    this.state = 284;
                    this.match(PseudocodeParser.NEWLINE);
                    }
                    }
                    this.state = 289;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 290;
                this.block();
                }
                break;
            }
            this.state = 296;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 75) {
                {
                {
                this.state = 293;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 298;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 299;
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
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 301;
            this.match(PseudocodeParser.CASE);
            this.state = 302;
            this.match(PseudocodeParser.OF);
            this.state = 303;
            this.match(PseudocodeParser.IDENTIFIER);
            this.state = 307;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 75) {
                {
                {
                this.state = 304;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 309;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 311;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 310;
                this.caseClause();
                }
                }
                this.state = 313;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & 1107296287) !== 0) || ((((_la - 70)) & ~0x1F) === 0 && ((1 << (_la - 70)) & 31) !== 0));
            this.state = 330;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 13) {
                {
                this.state = 315;
                this.match(PseudocodeParser.OTHERWISE);
                this.state = 316;
                this.match(PseudocodeParser.COLON);
                this.state = 320;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 75) {
                    {
                    {
                    this.state = 317;
                    this.match(PseudocodeParser.NEWLINE);
                    }
                    }
                    this.state = 322;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 323;
                this.block();
                this.state = 327;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 28, this.context);
                while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                    if (alternative === 1) {
                        {
                        {
                        this.state = 324;
                        this.match(PseudocodeParser.NEWLINE);
                        }
                        }
                    }
                    this.state = 329;
                    this.errorHandler.sync(this);
                    alternative = this.interpreter.adaptivePredict(this.tokenStream, 28, this.context);
                }
                }
            }

            this.state = 335;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 75) {
                {
                {
                this.state = 332;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 337;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 338;
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
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 340;
            this.expr(0);
            this.state = 341;
            this.match(PseudocodeParser.COLON);
            this.state = 345;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 75) {
                {
                {
                this.state = 342;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 347;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 348;
            this.block();
            this.state = 352;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 32, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 349;
                    this.match(PseudocodeParser.NEWLINE);
                    }
                    }
                }
                this.state = 354;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 32, this.context);
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
    public forStatement(): ForStatementContext {
        let localContext = new ForStatementContext(this.context, this.state);
        this.enterRule(localContext, 26, PseudocodeParser.RULE_forStatement);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 355;
            this.match(PseudocodeParser.FOR);
            this.state = 356;
            this.match(PseudocodeParser.IDENTIFIER);
            this.state = 357;
            _la = this.tokenStream.LA(1);
            if(!(_la === 51 || _la === 52)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            this.state = 358;
            this.expr(0);
            this.state = 359;
            this.match(PseudocodeParser.TO);
            this.state = 360;
            this.expr(0);
            this.state = 363;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 17) {
                {
                this.state = 361;
                this.match(PseudocodeParser.STEP);
                this.state = 362;
                this.expr(0);
                }
            }

            this.state = 368;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 75) {
                {
                {
                this.state = 365;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 370;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 371;
            this.block();
            this.state = 375;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 75) {
                {
                {
                this.state = 372;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 377;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 378;
            this.match(PseudocodeParser.NEXT);
            this.state = 379;
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
            this.state = 381;
            this.match(PseudocodeParser.WHILE);
            this.state = 382;
            this.expr(0);
            this.state = 384;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 20) {
                {
                this.state = 383;
                this.match(PseudocodeParser.DO);
                }
            }

            this.state = 389;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 75) {
                {
                {
                this.state = 386;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 391;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 392;
            this.block();
            this.state = 396;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 75) {
                {
                {
                this.state = 393;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 398;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 399;
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
            this.state = 401;
            this.match(PseudocodeParser.REPEAT);
            this.state = 405;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 75) {
                {
                {
                this.state = 402;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 407;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 408;
            this.block();
            this.state = 412;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 75) {
                {
                {
                this.state = 409;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 414;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 415;
            this.match(PseudocodeParser.UNTIL);
            this.state = 416;
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
            this.state = 418;
            this.match(PseudocodeParser.PROCEDURE);
            this.state = 419;
            this.match(PseudocodeParser.IDENTIFIER);
            this.state = 420;
            this.match(PseudocodeParser.LPAREN);
            this.state = 422;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 74) {
                {
                this.state = 421;
                this.paramList();
                }
            }

            this.state = 424;
            this.match(PseudocodeParser.RPAREN);
            this.state = 428;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 75) {
                {
                {
                this.state = 425;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 430;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 431;
            this.block();
            this.state = 435;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 75) {
                {
                {
                this.state = 432;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 437;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 438;
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
            this.state = 440;
            this.match(PseudocodeParser.FUNCTION);
            this.state = 441;
            this.match(PseudocodeParser.IDENTIFIER);
            this.state = 442;
            this.match(PseudocodeParser.LPAREN);
            this.state = 444;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 74) {
                {
                this.state = 443;
                this.paramList();
                }
            }

            this.state = 446;
            this.match(PseudocodeParser.RPAREN);
            this.state = 447;
            this.match(PseudocodeParser.RETURNS);
            this.state = 448;
            this.dataType();
            this.state = 452;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 75) {
                {
                {
                this.state = 449;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 454;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 455;
            this.block();
            this.state = 459;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 75) {
                {
                {
                this.state = 456;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 461;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 462;
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
            this.state = 464;
            this.param();
            this.state = 469;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 68) {
                {
                {
                this.state = 465;
                this.match(PseudocodeParser.COMMA);
                this.state = 466;
                this.param();
                }
                }
                this.state = 471;
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
            this.state = 472;
            this.match(PseudocodeParser.IDENTIFIER);
            this.state = 473;
            this.match(PseudocodeParser.COLON);
            this.state = 474;
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
            this.state = 476;
            this.match(PseudocodeParser.CALL);
            this.state = 477;
            this.match(PseudocodeParser.IDENTIFIER);
            this.state = 478;
            this.match(PseudocodeParser.LPAREN);
            this.state = 480;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & 1107296287) !== 0) || ((((_la - 70)) & ~0x1F) === 0 && ((1 << (_la - 70)) & 31) !== 0)) {
                {
                this.state = 479;
                this.argList();
                }
            }

            this.state = 482;
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
            this.state = 484;
            this.match(PseudocodeParser.RETURN);
            this.state = 485;
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
            this.state = 487;
            this.match(PseudocodeParser.OPENFILE);
            this.state = 488;
            this.expr(0);
            this.state = 489;
            this.match(PseudocodeParser.FOR);
            this.state = 490;
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
            this.state = 492;
            this.match(PseudocodeParser.READFILE);
            this.state = 493;
            this.expr(0);
            this.state = 494;
            this.match(PseudocodeParser.COMMA);
            this.state = 495;
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
            this.state = 497;
            this.match(PseudocodeParser.WRITEFILE);
            this.state = 498;
            this.expr(0);
            this.state = 499;
            this.match(PseudocodeParser.COMMA);
            this.state = 500;
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
            this.state = 502;
            this.match(PseudocodeParser.CLOSEFILE);
            this.state = 503;
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
            this.state = 505;
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
            this.state = 507;
            this.expr(0);
            this.state = 512;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 68) {
                {
                {
                this.state = 508;
                this.match(PseudocodeParser.COMMA);
                this.state = 509;
                this.expr(0);
                }
                }
                this.state = 514;
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
            this.state = 515;
            this.statement();
            this.state = 525;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 51, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 519;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    while (_la === 75) {
                        {
                        {
                        this.state = 516;
                        this.match(PseudocodeParser.NEWLINE);
                        }
                        }
                        this.state = 521;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                    }
                    this.state = 522;
                    this.statement();
                    }
                    }
                }
                this.state = 527;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 51, this.context);
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
            this.state = 534;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case PseudocodeParser.NOT:
                {
                localContext = new NotExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;

                this.state = 529;
                this.match(PseudocodeParser.NOT);
                this.state = 530;
                this.expr(10);
                }
                break;
            case PseudocodeParser.MINUS:
                {
                localContext = new UnaryMinusExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 531;
                this.match(PseudocodeParser.MINUS);
                this.state = 532;
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
                this.state = 533;
                this.atom();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
            this.context!.stop = this.tokenStream.LT(-1);
            this.state = 559;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 54, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    if (this.parseListeners != null) {
                        this.triggerExitRuleEvent();
                    }
                    previousContext = localContext;
                    {
                    this.state = 557;
                    this.errorHandler.sync(this);
                    switch (this.interpreter.adaptivePredict(this.tokenStream, 53, this.context) ) {
                    case 1:
                        {
                        localContext = new PowerExprContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, PseudocodeParser.RULE_expr);
                        this.state = 536;
                        if (!(this.precpred(this.context, 8))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 8)");
                        }
                        this.state = 537;
                        this.match(PseudocodeParser.CARET);
                        this.state = 538;
                        this.expr(8);
                        }
                        break;
                    case 2:
                        {
                        localContext = new MulDivExprContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, PseudocodeParser.RULE_expr);
                        this.state = 539;
                        if (!(this.precpred(this.context, 7))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 7)");
                        }
                        this.state = 540;
                        (localContext as MulDivExprContext)._op = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!(((((_la - 37)) & ~0x1F) === 0 && ((1 << (_la - 37)) & 25165827) !== 0))) {
                            (localContext as MulDivExprContext)._op = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 541;
                        this.expr(8);
                        }
                        break;
                    case 3:
                        {
                        localContext = new AddSubExprContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, PseudocodeParser.RULE_expr);
                        this.state = 542;
                        if (!(this.precpred(this.context, 6))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 6)");
                        }
                        this.state = 543;
                        (localContext as AddSubExprContext)._op = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!(_la === 58 || _la === 59)) {
                            (localContext as AddSubExprContext)._op = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 544;
                        this.expr(7);
                        }
                        break;
                    case 4:
                        {
                        localContext = new ConcatExprContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, PseudocodeParser.RULE_expr);
                        this.state = 545;
                        if (!(this.precpred(this.context, 5))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 5)");
                        }
                        this.state = 546;
                        this.match(PseudocodeParser.AMPERSAND);
                        this.state = 547;
                        this.expr(6);
                        }
                        break;
                    case 5:
                        {
                        localContext = new ComparisonExprContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, PseudocodeParser.RULE_expr);
                        this.state = 548;
                        if (!(this.precpred(this.context, 4))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 4)");
                        }
                        this.state = 549;
                        (localContext as ComparisonExprContext)._op = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!(((((_la - 52)) & ~0x1F) === 0 && ((1 << (_la - 52)) & 63) !== 0))) {
                            (localContext as ComparisonExprContext)._op = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 550;
                        this.expr(5);
                        }
                        break;
                    case 6:
                        {
                        localContext = new AndExprContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, PseudocodeParser.RULE_expr);
                        this.state = 551;
                        if (!(this.precpred(this.context, 3))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 3)");
                        }
                        this.state = 552;
                        this.match(PseudocodeParser.AND);
                        this.state = 553;
                        this.expr(4);
                        }
                        break;
                    case 7:
                        {
                        localContext = new OrExprContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, PseudocodeParser.RULE_expr);
                        this.state = 554;
                        if (!(this.precpred(this.context, 2))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 2)");
                        }
                        this.state = 555;
                        this.match(PseudocodeParser.OR);
                        this.state = 556;
                        this.expr(3);
                        }
                        break;
                    }
                    }
                }
                this.state = 561;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 54, this.context);
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
            this.state = 605;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 56, this.context) ) {
            case 1:
                localContext = new ParenAtomContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 562;
                this.match(PseudocodeParser.LPAREN);
                this.state = 563;
                this.expr(0);
                this.state = 564;
                this.match(PseudocodeParser.RPAREN);
                }
                break;
            case 2:
                localContext = new FunctionCallAtomContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 566;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 567;
                this.match(PseudocodeParser.LPAREN);
                this.state = 569;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & 1107296287) !== 0) || ((((_la - 70)) & ~0x1F) === 0 && ((1 << (_la - 70)) & 31) !== 0)) {
                    {
                    this.state = 568;
                    this.argList();
                    }
                }

                this.state = 571;
                this.match(PseudocodeParser.RPAREN);
                }
                break;
            case 3:
                localContext = new ArrayAccess1DAtomContext(localContext);
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 572;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 573;
                this.match(PseudocodeParser.LBRACKET);
                this.state = 574;
                this.expr(0);
                this.state = 575;
                this.match(PseudocodeParser.RBRACKET);
                }
                break;
            case 4:
                localContext = new ArrayAccess2DAtomContext(localContext);
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 577;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 578;
                this.match(PseudocodeParser.LBRACKET);
                this.state = 579;
                this.expr(0);
                this.state = 580;
                this.match(PseudocodeParser.COMMA);
                this.state = 581;
                this.expr(0);
                this.state = 582;
                this.match(PseudocodeParser.RBRACKET);
                }
                break;
            case 5:
                localContext = new DivFunctionAtomContext(localContext);
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 584;
                this.match(PseudocodeParser.DIV);
                this.state = 585;
                this.match(PseudocodeParser.LPAREN);
                this.state = 586;
                this.expr(0);
                this.state = 587;
                this.match(PseudocodeParser.COMMA);
                this.state = 588;
                this.expr(0);
                this.state = 589;
                this.match(PseudocodeParser.RPAREN);
                }
                break;
            case 6:
                localContext = new ModFunctionAtomContext(localContext);
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 591;
                this.match(PseudocodeParser.MOD);
                this.state = 592;
                this.match(PseudocodeParser.LPAREN);
                this.state = 593;
                this.expr(0);
                this.state = 594;
                this.match(PseudocodeParser.COMMA);
                this.state = 595;
                this.expr(0);
                this.state = 596;
                this.match(PseudocodeParser.RPAREN);
                }
                break;
            case 7:
                localContext = new IdentifierAtomContext(localContext);
                this.enterOuterAlt(localContext, 7);
                {
                this.state = 598;
                this.match(PseudocodeParser.IDENTIFIER);
                }
                break;
            case 8:
                localContext = new IntegerAtomContext(localContext);
                this.enterOuterAlt(localContext, 8);
                {
                this.state = 599;
                this.match(PseudocodeParser.INTEGER_LITERAL);
                }
                break;
            case 9:
                localContext = new RealAtomContext(localContext);
                this.enterOuterAlt(localContext, 9);
                {
                this.state = 600;
                this.match(PseudocodeParser.REAL_LITERAL);
                }
                break;
            case 10:
                localContext = new StringAtomContext(localContext);
                this.enterOuterAlt(localContext, 10);
                {
                this.state = 601;
                this.match(PseudocodeParser.STRING_LITERAL);
                }
                break;
            case 11:
                localContext = new CharAtomContext(localContext);
                this.enterOuterAlt(localContext, 11);
                {
                this.state = 602;
                this.match(PseudocodeParser.CHAR_LITERAL);
                }
                break;
            case 12:
                localContext = new TrueAtomContext(localContext);
                this.enterOuterAlt(localContext, 12);
                {
                this.state = 603;
                this.match(PseudocodeParser.TRUE);
                }
                break;
            case 13:
                localContext = new FalseAtomContext(localContext);
                this.enterOuterAlt(localContext, 13);
                {
                this.state = 604;
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
        4,1,77,608,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,
        6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,2,11,7,11,2,12,7,12,2,13,7,13,
        2,14,7,14,2,15,7,15,2,16,7,16,2,17,7,17,2,18,7,18,2,19,7,19,2,20,
        7,20,2,21,7,21,2,22,7,22,2,23,7,23,2,24,7,24,2,25,7,25,2,26,7,26,
        2,27,7,27,2,28,7,28,2,29,7,29,2,30,7,30,1,0,5,0,64,8,0,10,0,12,0,
        67,9,0,1,0,1,0,5,0,71,8,0,10,0,12,0,74,9,0,1,0,5,0,77,8,0,10,0,12,
        0,80,9,0,3,0,82,8,0,1,0,5,0,85,8,0,10,0,12,0,88,9,0,1,0,1,0,1,1,
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
        1,1,3,1,110,8,1,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,
        1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,
        1,2,1,2,1,2,1,2,1,2,3,2,145,8,2,1,3,1,3,1,3,5,3,150,8,3,10,3,12,
        3,153,9,3,1,4,1,4,1,4,1,4,1,4,1,5,1,5,1,6,1,6,1,6,1,6,1,6,1,6,1,
        6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,
        6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,3,
        6,200,8,6,1,7,1,7,1,7,1,7,3,7,206,8,7,1,7,1,7,1,7,1,7,1,7,1,7,1,
        7,3,7,215,8,7,3,7,217,8,7,1,8,1,8,1,8,1,9,1,9,1,9,5,9,225,8,9,10,
        9,12,9,228,9,9,1,10,1,10,1,10,5,10,233,8,10,10,10,12,10,236,9,10,
        1,10,3,10,239,8,10,1,10,5,10,242,8,10,10,10,12,10,245,9,10,1,10,
        1,10,5,10,249,8,10,10,10,12,10,252,9,10,1,10,1,10,1,10,5,10,257,
        8,10,10,10,12,10,260,9,10,1,10,3,10,263,8,10,1,10,5,10,266,8,10,
        10,10,12,10,269,9,10,1,10,1,10,5,10,273,8,10,10,10,12,10,276,9,10,
        1,10,5,10,279,8,10,10,10,12,10,282,9,10,1,10,1,10,5,10,286,8,10,
        10,10,12,10,289,9,10,1,10,3,10,292,8,10,1,10,5,10,295,8,10,10,10,
        12,10,298,9,10,1,10,1,10,1,11,1,11,1,11,1,11,5,11,306,8,11,10,11,
        12,11,309,9,11,1,11,4,11,312,8,11,11,11,12,11,313,1,11,1,11,1,11,
        5,11,319,8,11,10,11,12,11,322,9,11,1,11,1,11,5,11,326,8,11,10,11,
        12,11,329,9,11,3,11,331,8,11,1,11,5,11,334,8,11,10,11,12,11,337,
        9,11,1,11,1,11,1,12,1,12,1,12,5,12,344,8,12,10,12,12,12,347,9,12,
        1,12,1,12,5,12,351,8,12,10,12,12,12,354,9,12,1,13,1,13,1,13,1,13,
        1,13,1,13,1,13,1,13,3,13,364,8,13,1,13,5,13,367,8,13,10,13,12,13,
        370,9,13,1,13,1,13,5,13,374,8,13,10,13,12,13,377,9,13,1,13,1,13,
        1,13,1,14,1,14,1,14,3,14,385,8,14,1,14,5,14,388,8,14,10,14,12,14,
        391,9,14,1,14,1,14,5,14,395,8,14,10,14,12,14,398,9,14,1,14,1,14,
        1,15,1,15,5,15,404,8,15,10,15,12,15,407,9,15,1,15,1,15,5,15,411,
        8,15,10,15,12,15,414,9,15,1,15,1,15,1,15,1,16,1,16,1,16,1,16,3,16,
        423,8,16,1,16,1,16,5,16,427,8,16,10,16,12,16,430,9,16,1,16,1,16,
        5,16,434,8,16,10,16,12,16,437,9,16,1,16,1,16,1,17,1,17,1,17,1,17,
        3,17,445,8,17,1,17,1,17,1,17,1,17,5,17,451,8,17,10,17,12,17,454,
        9,17,1,17,1,17,5,17,458,8,17,10,17,12,17,461,9,17,1,17,1,17,1,18,
        1,18,1,18,5,18,468,8,18,10,18,12,18,471,9,18,1,19,1,19,1,19,1,19,
        1,20,1,20,1,20,1,20,3,20,481,8,20,1,20,1,20,1,21,1,21,1,21,1,22,
        1,22,1,22,1,22,1,22,1,23,1,23,1,23,1,23,1,23,1,24,1,24,1,24,1,24,
        1,24,1,25,1,25,1,25,1,26,1,26,1,27,1,27,1,27,5,27,511,8,27,10,27,
        12,27,514,9,27,1,28,1,28,5,28,518,8,28,10,28,12,28,521,9,28,1,28,
        5,28,524,8,28,10,28,12,28,527,9,28,1,29,1,29,1,29,1,29,1,29,1,29,
        3,29,535,8,29,1,29,1,29,1,29,1,29,1,29,1,29,1,29,1,29,1,29,1,29,
        1,29,1,29,1,29,1,29,1,29,1,29,1,29,1,29,1,29,1,29,1,29,5,29,558,
        8,29,10,29,12,29,561,9,29,1,30,1,30,1,30,1,30,1,30,1,30,1,30,3,30,
        570,8,30,1,30,1,30,1,30,1,30,1,30,1,30,1,30,1,30,1,30,1,30,1,30,
        1,30,1,30,1,30,1,30,1,30,1,30,1,30,1,30,1,30,1,30,1,30,1,30,1,30,
        1,30,1,30,1,30,1,30,1,30,1,30,1,30,1,30,1,30,1,30,3,30,606,8,30,
        1,30,0,1,58,31,0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,
        36,38,40,42,44,46,48,50,52,54,56,58,60,0,7,1,0,51,52,1,0,46,50,1,
        0,4,5,1,0,43,45,2,0,37,38,60,61,1,0,58,59,1,0,52,57,671,0,65,1,0,
        0,0,2,109,1,0,0,0,4,144,1,0,0,0,6,146,1,0,0,0,8,154,1,0,0,0,10,159,
        1,0,0,0,12,199,1,0,0,0,14,216,1,0,0,0,16,218,1,0,0,0,18,221,1,0,
        0,0,20,229,1,0,0,0,22,301,1,0,0,0,24,340,1,0,0,0,26,355,1,0,0,0,
        28,381,1,0,0,0,30,401,1,0,0,0,32,418,1,0,0,0,34,440,1,0,0,0,36,464,
        1,0,0,0,38,472,1,0,0,0,40,476,1,0,0,0,42,484,1,0,0,0,44,487,1,0,
        0,0,46,492,1,0,0,0,48,497,1,0,0,0,50,502,1,0,0,0,52,505,1,0,0,0,
        54,507,1,0,0,0,56,515,1,0,0,0,58,534,1,0,0,0,60,605,1,0,0,0,62,64,
        5,75,0,0,63,62,1,0,0,0,64,67,1,0,0,0,65,63,1,0,0,0,65,66,1,0,0,0,
        66,81,1,0,0,0,67,65,1,0,0,0,68,78,3,2,1,0,69,71,5,75,0,0,70,69,1,
        0,0,0,71,74,1,0,0,0,72,70,1,0,0,0,72,73,1,0,0,0,73,75,1,0,0,0,74,
        72,1,0,0,0,75,77,3,2,1,0,76,72,1,0,0,0,77,80,1,0,0,0,78,76,1,0,0,
        0,78,79,1,0,0,0,79,82,1,0,0,0,80,78,1,0,0,0,81,68,1,0,0,0,81,82,
        1,0,0,0,82,86,1,0,0,0,83,85,5,75,0,0,84,83,1,0,0,0,85,88,1,0,0,0,
        86,84,1,0,0,0,86,87,1,0,0,0,87,89,1,0,0,0,88,86,1,0,0,0,89,90,5,
        0,0,1,90,1,1,0,0,0,91,110,3,4,2,0,92,110,3,8,4,0,93,110,3,12,6,0,
        94,110,3,14,7,0,95,110,3,16,8,0,96,110,3,20,10,0,97,110,3,22,11,
        0,98,110,3,26,13,0,99,110,3,28,14,0,100,110,3,30,15,0,101,110,3,
        32,16,0,102,110,3,34,17,0,103,110,3,40,20,0,104,110,3,42,21,0,105,
        110,3,44,22,0,106,110,3,46,23,0,107,110,3,48,24,0,108,110,3,50,25,
        0,109,91,1,0,0,0,109,92,1,0,0,0,109,93,1,0,0,0,109,94,1,0,0,0,109,
        95,1,0,0,0,109,96,1,0,0,0,109,97,1,0,0,0,109,98,1,0,0,0,109,99,1,
        0,0,0,109,100,1,0,0,0,109,101,1,0,0,0,109,102,1,0,0,0,109,103,1,
        0,0,0,109,104,1,0,0,0,109,105,1,0,0,0,109,106,1,0,0,0,109,107,1,
        0,0,0,109,108,1,0,0,0,110,3,1,0,0,0,111,112,5,1,0,0,112,113,3,6,
        3,0,113,114,5,69,0,0,114,115,5,31,0,0,115,116,5,66,0,0,116,117,3,
        58,29,0,117,118,5,69,0,0,118,119,3,58,29,0,119,120,5,67,0,0,120,
        121,5,12,0,0,121,122,3,10,5,0,122,145,1,0,0,0,123,124,5,1,0,0,124,
        125,5,74,0,0,125,126,5,69,0,0,126,127,5,31,0,0,127,128,5,66,0,0,
        128,129,3,58,29,0,129,130,5,69,0,0,130,131,3,58,29,0,131,132,5,68,
        0,0,132,133,3,58,29,0,133,134,5,69,0,0,134,135,3,58,29,0,135,136,
        5,67,0,0,136,137,5,12,0,0,137,138,3,10,5,0,138,145,1,0,0,0,139,140,
        5,1,0,0,140,141,3,6,3,0,141,142,5,69,0,0,142,143,3,10,5,0,143,145,
        1,0,0,0,144,111,1,0,0,0,144,123,1,0,0,0,144,139,1,0,0,0,145,5,1,
        0,0,0,146,151,5,74,0,0,147,148,5,68,0,0,148,150,5,74,0,0,149,147,
        1,0,0,0,150,153,1,0,0,0,151,149,1,0,0,0,151,152,1,0,0,0,152,7,1,
        0,0,0,153,151,1,0,0,0,154,155,5,2,0,0,155,156,5,74,0,0,156,157,7,
        0,0,0,157,158,3,58,29,0,158,9,1,0,0,0,159,160,7,1,0,0,160,11,1,0,
        0,0,161,162,5,74,0,0,162,163,5,52,0,0,163,200,3,58,29,0,164,165,
        5,74,0,0,165,166,5,66,0,0,166,167,3,58,29,0,167,168,5,67,0,0,168,
        169,5,52,0,0,169,170,3,58,29,0,170,200,1,0,0,0,171,172,5,74,0,0,
        172,173,5,66,0,0,173,174,3,58,29,0,174,175,5,68,0,0,175,176,3,58,
        29,0,176,177,5,67,0,0,177,178,5,52,0,0,178,179,3,58,29,0,179,200,
        1,0,0,0,180,181,5,74,0,0,181,182,5,51,0,0,182,200,3,58,29,0,183,
        184,5,74,0,0,184,185,5,66,0,0,185,186,3,58,29,0,186,187,5,67,0,0,
        187,188,5,51,0,0,188,189,3,58,29,0,189,200,1,0,0,0,190,191,5,74,
        0,0,191,192,5,66,0,0,192,193,3,58,29,0,193,194,5,68,0,0,194,195,
        3,58,29,0,195,196,5,67,0,0,196,197,5,51,0,0,197,198,3,58,29,0,198,
        200,1,0,0,0,199,161,1,0,0,0,199,164,1,0,0,0,199,171,1,0,0,0,199,
        180,1,0,0,0,199,183,1,0,0,0,199,190,1,0,0,0,200,13,1,0,0,0,201,202,
        5,3,0,0,202,205,5,74,0,0,203,204,5,68,0,0,204,206,5,72,0,0,205,203,
        1,0,0,0,205,206,1,0,0,0,206,217,1,0,0,0,207,208,5,3,0,0,208,209,
        5,74,0,0,209,210,5,66,0,0,210,211,3,58,29,0,211,214,5,67,0,0,212,
        213,5,68,0,0,213,215,5,72,0,0,214,212,1,0,0,0,214,215,1,0,0,0,215,
        217,1,0,0,0,216,201,1,0,0,0,216,207,1,0,0,0,217,15,1,0,0,0,218,219,
        7,2,0,0,219,220,3,18,9,0,220,17,1,0,0,0,221,226,3,58,29,0,222,223,
        5,68,0,0,223,225,3,58,29,0,224,222,1,0,0,0,225,228,1,0,0,0,226,224,
        1,0,0,0,226,227,1,0,0,0,227,19,1,0,0,0,228,226,1,0,0,0,229,230,5,
        6,0,0,230,234,3,58,29,0,231,233,5,75,0,0,232,231,1,0,0,0,233,236,
        1,0,0,0,234,232,1,0,0,0,234,235,1,0,0,0,235,238,1,0,0,0,236,234,
        1,0,0,0,237,239,5,7,0,0,238,237,1,0,0,0,238,239,1,0,0,0,239,243,
        1,0,0,0,240,242,5,75,0,0,241,240,1,0,0,0,242,245,1,0,0,0,243,241,
        1,0,0,0,243,244,1,0,0,0,244,246,1,0,0,0,245,243,1,0,0,0,246,274,
        3,56,28,0,247,249,5,75,0,0,248,247,1,0,0,0,249,252,1,0,0,0,250,248,
        1,0,0,0,250,251,1,0,0,0,251,253,1,0,0,0,252,250,1,0,0,0,253,254,
        5,9,0,0,254,258,3,58,29,0,255,257,5,75,0,0,256,255,1,0,0,0,257,260,
        1,0,0,0,258,256,1,0,0,0,258,259,1,0,0,0,259,262,1,0,0,0,260,258,
        1,0,0,0,261,263,5,7,0,0,262,261,1,0,0,0,262,263,1,0,0,0,263,267,
        1,0,0,0,264,266,5,75,0,0,265,264,1,0,0,0,266,269,1,0,0,0,267,265,
        1,0,0,0,267,268,1,0,0,0,268,270,1,0,0,0,269,267,1,0,0,0,270,271,
        3,56,28,0,271,273,1,0,0,0,272,250,1,0,0,0,273,276,1,0,0,0,274,272,
        1,0,0,0,274,275,1,0,0,0,275,291,1,0,0,0,276,274,1,0,0,0,277,279,
        5,75,0,0,278,277,1,0,0,0,279,282,1,0,0,0,280,278,1,0,0,0,280,281,
        1,0,0,0,281,283,1,0,0,0,282,280,1,0,0,0,283,287,5,8,0,0,284,286,
        5,75,0,0,285,284,1,0,0,0,286,289,1,0,0,0,287,285,1,0,0,0,287,288,
        1,0,0,0,288,290,1,0,0,0,289,287,1,0,0,0,290,292,3,56,28,0,291,280,
        1,0,0,0,291,292,1,0,0,0,292,296,1,0,0,0,293,295,5,75,0,0,294,293,
        1,0,0,0,295,298,1,0,0,0,296,294,1,0,0,0,296,297,1,0,0,0,297,299,
        1,0,0,0,298,296,1,0,0,0,299,300,5,10,0,0,300,21,1,0,0,0,301,302,
        5,11,0,0,302,303,5,12,0,0,303,307,5,74,0,0,304,306,5,75,0,0,305,
        304,1,0,0,0,306,309,1,0,0,0,307,305,1,0,0,0,307,308,1,0,0,0,308,
        311,1,0,0,0,309,307,1,0,0,0,310,312,3,24,12,0,311,310,1,0,0,0,312,
        313,1,0,0,0,313,311,1,0,0,0,313,314,1,0,0,0,314,330,1,0,0,0,315,
        316,5,13,0,0,316,320,5,69,0,0,317,319,5,75,0,0,318,317,1,0,0,0,319,
        322,1,0,0,0,320,318,1,0,0,0,320,321,1,0,0,0,321,323,1,0,0,0,322,
        320,1,0,0,0,323,327,3,56,28,0,324,326,5,75,0,0,325,324,1,0,0,0,326,
        329,1,0,0,0,327,325,1,0,0,0,327,328,1,0,0,0,328,331,1,0,0,0,329,
        327,1,0,0,0,330,315,1,0,0,0,330,331,1,0,0,0,331,335,1,0,0,0,332,
        334,5,75,0,0,333,332,1,0,0,0,334,337,1,0,0,0,335,333,1,0,0,0,335,
        336,1,0,0,0,336,338,1,0,0,0,337,335,1,0,0,0,338,339,5,14,0,0,339,
        23,1,0,0,0,340,341,3,58,29,0,341,345,5,69,0,0,342,344,5,75,0,0,343,
        342,1,0,0,0,344,347,1,0,0,0,345,343,1,0,0,0,345,346,1,0,0,0,346,
        348,1,0,0,0,347,345,1,0,0,0,348,352,3,56,28,0,349,351,5,75,0,0,350,
        349,1,0,0,0,351,354,1,0,0,0,352,350,1,0,0,0,352,353,1,0,0,0,353,
        25,1,0,0,0,354,352,1,0,0,0,355,356,5,15,0,0,356,357,5,74,0,0,357,
        358,7,0,0,0,358,359,3,58,29,0,359,360,5,16,0,0,360,363,3,58,29,0,
        361,362,5,17,0,0,362,364,3,58,29,0,363,361,1,0,0,0,363,364,1,0,0,
        0,364,368,1,0,0,0,365,367,5,75,0,0,366,365,1,0,0,0,367,370,1,0,0,
        0,368,366,1,0,0,0,368,369,1,0,0,0,369,371,1,0,0,0,370,368,1,0,0,
        0,371,375,3,56,28,0,372,374,5,75,0,0,373,372,1,0,0,0,374,377,1,0,
        0,0,375,373,1,0,0,0,375,376,1,0,0,0,376,378,1,0,0,0,377,375,1,0,
        0,0,378,379,5,18,0,0,379,380,5,74,0,0,380,27,1,0,0,0,381,382,5,19,
        0,0,382,384,3,58,29,0,383,385,5,20,0,0,384,383,1,0,0,0,384,385,1,
        0,0,0,385,389,1,0,0,0,386,388,5,75,0,0,387,386,1,0,0,0,388,391,1,
        0,0,0,389,387,1,0,0,0,389,390,1,0,0,0,390,392,1,0,0,0,391,389,1,
        0,0,0,392,396,3,56,28,0,393,395,5,75,0,0,394,393,1,0,0,0,395,398,
        1,0,0,0,396,394,1,0,0,0,396,397,1,0,0,0,397,399,1,0,0,0,398,396,
        1,0,0,0,399,400,5,21,0,0,400,29,1,0,0,0,401,405,5,22,0,0,402,404,
        5,75,0,0,403,402,1,0,0,0,404,407,1,0,0,0,405,403,1,0,0,0,405,406,
        1,0,0,0,406,408,1,0,0,0,407,405,1,0,0,0,408,412,3,56,28,0,409,411,
        5,75,0,0,410,409,1,0,0,0,411,414,1,0,0,0,412,410,1,0,0,0,412,413,
        1,0,0,0,413,415,1,0,0,0,414,412,1,0,0,0,415,416,5,23,0,0,416,417,
        3,58,29,0,417,31,1,0,0,0,418,419,5,24,0,0,419,420,5,74,0,0,420,422,
        5,64,0,0,421,423,3,36,18,0,422,421,1,0,0,0,422,423,1,0,0,0,423,424,
        1,0,0,0,424,428,5,65,0,0,425,427,5,75,0,0,426,425,1,0,0,0,427,430,
        1,0,0,0,428,426,1,0,0,0,428,429,1,0,0,0,429,431,1,0,0,0,430,428,
        1,0,0,0,431,435,3,56,28,0,432,434,5,75,0,0,433,432,1,0,0,0,434,437,
        1,0,0,0,435,433,1,0,0,0,435,436,1,0,0,0,436,438,1,0,0,0,437,435,
        1,0,0,0,438,439,5,25,0,0,439,33,1,0,0,0,440,441,5,26,0,0,441,442,
        5,74,0,0,442,444,5,64,0,0,443,445,3,36,18,0,444,443,1,0,0,0,444,
        445,1,0,0,0,445,446,1,0,0,0,446,447,5,65,0,0,447,448,5,28,0,0,448,
        452,3,10,5,0,449,451,5,75,0,0,450,449,1,0,0,0,451,454,1,0,0,0,452,
        450,1,0,0,0,452,453,1,0,0,0,453,455,1,0,0,0,454,452,1,0,0,0,455,
        459,3,56,28,0,456,458,5,75,0,0,457,456,1,0,0,0,458,461,1,0,0,0,459,
        457,1,0,0,0,459,460,1,0,0,0,460,462,1,0,0,0,461,459,1,0,0,0,462,
        463,5,27,0,0,463,35,1,0,0,0,464,469,3,38,19,0,465,466,5,68,0,0,466,
        468,3,38,19,0,467,465,1,0,0,0,468,471,1,0,0,0,469,467,1,0,0,0,469,
        470,1,0,0,0,470,37,1,0,0,0,471,469,1,0,0,0,472,473,5,74,0,0,473,
        474,5,69,0,0,474,475,3,10,5,0,475,39,1,0,0,0,476,477,5,30,0,0,477,
        478,5,74,0,0,478,480,5,64,0,0,479,481,3,54,27,0,480,479,1,0,0,0,
        480,481,1,0,0,0,481,482,1,0,0,0,482,483,5,65,0,0,483,41,1,0,0,0,
        484,485,5,29,0,0,485,486,3,58,29,0,486,43,1,0,0,0,487,488,5,39,0,
        0,488,489,3,58,29,0,489,490,5,15,0,0,490,491,3,52,26,0,491,45,1,
        0,0,0,492,493,5,40,0,0,493,494,3,58,29,0,494,495,5,68,0,0,495,496,
        5,74,0,0,496,47,1,0,0,0,497,498,5,41,0,0,498,499,3,58,29,0,499,500,
        5,68,0,0,500,501,3,58,29,0,501,49,1,0,0,0,502,503,5,42,0,0,503,504,
        3,58,29,0,504,51,1,0,0,0,505,506,7,3,0,0,506,53,1,0,0,0,507,512,
        3,58,29,0,508,509,5,68,0,0,509,511,3,58,29,0,510,508,1,0,0,0,511,
        514,1,0,0,0,512,510,1,0,0,0,512,513,1,0,0,0,513,55,1,0,0,0,514,512,
        1,0,0,0,515,525,3,2,1,0,516,518,5,75,0,0,517,516,1,0,0,0,518,521,
        1,0,0,0,519,517,1,0,0,0,519,520,1,0,0,0,520,522,1,0,0,0,521,519,
        1,0,0,0,522,524,3,2,1,0,523,519,1,0,0,0,524,527,1,0,0,0,525,523,
        1,0,0,0,525,526,1,0,0,0,526,57,1,0,0,0,527,525,1,0,0,0,528,529,6,
        29,-1,0,529,530,5,34,0,0,530,535,3,58,29,10,531,532,5,59,0,0,532,
        535,3,58,29,9,533,535,3,60,30,0,534,528,1,0,0,0,534,531,1,0,0,0,
        534,533,1,0,0,0,535,559,1,0,0,0,536,537,10,8,0,0,537,538,5,62,0,
        0,538,558,3,58,29,8,539,540,10,7,0,0,540,541,7,4,0,0,541,558,3,58,
        29,8,542,543,10,6,0,0,543,544,7,5,0,0,544,558,3,58,29,7,545,546,
        10,5,0,0,546,547,5,63,0,0,547,558,3,58,29,6,548,549,10,4,0,0,549,
        550,7,6,0,0,550,558,3,58,29,5,551,552,10,3,0,0,552,553,5,32,0,0,
        553,558,3,58,29,4,554,555,10,2,0,0,555,556,5,33,0,0,556,558,3,58,
        29,3,557,536,1,0,0,0,557,539,1,0,0,0,557,542,1,0,0,0,557,545,1,0,
        0,0,557,548,1,0,0,0,557,551,1,0,0,0,557,554,1,0,0,0,558,561,1,0,
        0,0,559,557,1,0,0,0,559,560,1,0,0,0,560,59,1,0,0,0,561,559,1,0,0,
        0,562,563,5,64,0,0,563,564,3,58,29,0,564,565,5,65,0,0,565,606,1,
        0,0,0,566,567,5,74,0,0,567,569,5,64,0,0,568,570,3,54,27,0,569,568,
        1,0,0,0,569,570,1,0,0,0,570,571,1,0,0,0,571,606,5,65,0,0,572,573,
        5,74,0,0,573,574,5,66,0,0,574,575,3,58,29,0,575,576,5,67,0,0,576,
        606,1,0,0,0,577,578,5,74,0,0,578,579,5,66,0,0,579,580,3,58,29,0,
        580,581,5,68,0,0,581,582,3,58,29,0,582,583,5,67,0,0,583,606,1,0,
        0,0,584,585,5,38,0,0,585,586,5,64,0,0,586,587,3,58,29,0,587,588,
        5,68,0,0,588,589,3,58,29,0,589,590,5,65,0,0,590,606,1,0,0,0,591,
        592,5,37,0,0,592,593,5,64,0,0,593,594,3,58,29,0,594,595,5,68,0,0,
        595,596,3,58,29,0,596,597,5,65,0,0,597,606,1,0,0,0,598,606,5,74,
        0,0,599,606,5,71,0,0,600,606,5,70,0,0,601,606,5,72,0,0,602,606,5,
        73,0,0,603,606,5,35,0,0,604,606,5,36,0,0,605,562,1,0,0,0,605,566,
        1,0,0,0,605,572,1,0,0,0,605,577,1,0,0,0,605,584,1,0,0,0,605,591,
        1,0,0,0,605,598,1,0,0,0,605,599,1,0,0,0,605,600,1,0,0,0,605,601,
        1,0,0,0,605,602,1,0,0,0,605,603,1,0,0,0,605,604,1,0,0,0,606,61,1,
        0,0,0,57,65,72,78,81,86,109,144,151,199,205,214,216,226,234,238,
        243,250,258,262,267,274,280,287,291,296,307,313,320,327,330,335,
        345,352,363,368,375,384,389,396,405,412,422,428,435,444,452,459,
        469,480,512,519,525,534,557,559,569,605
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterProgram) {
             listener.enterProgram(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitProgram) {
             listener.exitProgram(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitProgram) {
            return visitor.visitProgram(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterStatement) {
             listener.enterStatement(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitStatement) {
             listener.exitStatement(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitStatement) {
            return visitor.visitStatement(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterDeclareStatement) {
             listener.enterDeclareStatement(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitDeclareStatement) {
             listener.exitDeclareStatement(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitDeclareStatement) {
            return visitor.visitDeclareStatement(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterIdentifierList) {
             listener.enterIdentifierList(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitIdentifierList) {
             listener.exitIdentifierList(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitIdentifierList) {
            return visitor.visitIdentifierList(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterConstantStatement) {
             listener.enterConstantStatement(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitConstantStatement) {
             listener.exitConstantStatement(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitConstantStatement) {
            return visitor.visitConstantStatement(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterDataType) {
             listener.enterDataType(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitDataType) {
             listener.exitDataType(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitDataType) {
            return visitor.visitDataType(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterAssignmentStatement) {
             listener.enterAssignmentStatement(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitAssignmentStatement) {
             listener.exitAssignmentStatement(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitAssignmentStatement) {
            return visitor.visitAssignmentStatement(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public COMMA(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.COMMA, 0);
    }
    public STRING_LITERAL(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.STRING_LITERAL, 0);
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterInputStatement) {
             listener.enterInputStatement(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitInputStatement) {
             listener.exitInputStatement(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitInputStatement) {
            return visitor.visitInputStatement(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterOutputStatement) {
             listener.enterOutputStatement(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitOutputStatement) {
             listener.exitOutputStatement(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitOutputStatement) {
            return visitor.visitOutputStatement(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterExprList) {
             listener.enterExprList(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitExprList) {
             listener.exitExprList(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitExprList) {
            return visitor.visitExprList(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public THEN(): antlr.TerminalNode[];
    public THEN(i: number): antlr.TerminalNode | null;
    public THEN(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.THEN);
    	} else {
    		return this.getToken(PseudocodeParser.THEN, i);
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterIfStatement) {
             listener.enterIfStatement(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitIfStatement) {
             listener.exitIfStatement(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitIfStatement) {
            return visitor.visitIfStatement(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterCaseStatement) {
             listener.enterCaseStatement(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitCaseStatement) {
             listener.exitCaseStatement(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitCaseStatement) {
            return visitor.visitCaseStatement(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterCaseClause) {
             listener.enterCaseClause(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitCaseClause) {
             listener.exitCaseClause(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitCaseClause) {
            return visitor.visitCaseClause(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterForStatement) {
             listener.enterForStatement(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitForStatement) {
             listener.exitForStatement(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitForStatement) {
            return visitor.visitForStatement(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterWhileStatement) {
             listener.enterWhileStatement(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitWhileStatement) {
             listener.exitWhileStatement(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitWhileStatement) {
            return visitor.visitWhileStatement(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterRepeatStatement) {
             listener.enterRepeatStatement(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitRepeatStatement) {
             listener.exitRepeatStatement(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitRepeatStatement) {
            return visitor.visitRepeatStatement(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterProcedureDeclaration) {
             listener.enterProcedureDeclaration(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitProcedureDeclaration) {
             listener.exitProcedureDeclaration(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitProcedureDeclaration) {
            return visitor.visitProcedureDeclaration(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterFunctionDeclaration) {
             listener.enterFunctionDeclaration(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitFunctionDeclaration) {
             listener.exitFunctionDeclaration(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitFunctionDeclaration) {
            return visitor.visitFunctionDeclaration(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterParamList) {
             listener.enterParamList(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitParamList) {
             listener.exitParamList(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitParamList) {
            return visitor.visitParamList(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterParam) {
             listener.enterParam(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitParam) {
             listener.exitParam(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitParam) {
            return visitor.visitParam(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterCallStatement) {
             listener.enterCallStatement(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitCallStatement) {
             listener.exitCallStatement(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitCallStatement) {
            return visitor.visitCallStatement(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterReturnStatement) {
             listener.enterReturnStatement(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitReturnStatement) {
             listener.exitReturnStatement(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitReturnStatement) {
            return visitor.visitReturnStatement(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterOpenFileStatement) {
             listener.enterOpenFileStatement(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitOpenFileStatement) {
             listener.exitOpenFileStatement(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitOpenFileStatement) {
            return visitor.visitOpenFileStatement(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterReadFileStatement) {
             listener.enterReadFileStatement(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitReadFileStatement) {
             listener.exitReadFileStatement(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitReadFileStatement) {
            return visitor.visitReadFileStatement(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterWriteFileStatement) {
             listener.enterWriteFileStatement(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitWriteFileStatement) {
             listener.exitWriteFileStatement(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitWriteFileStatement) {
            return visitor.visitWriteFileStatement(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterCloseFileStatement) {
             listener.enterCloseFileStatement(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitCloseFileStatement) {
             listener.exitCloseFileStatement(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitCloseFileStatement) {
            return visitor.visitCloseFileStatement(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterFileMode) {
             listener.enterFileMode(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitFileMode) {
             listener.exitFileMode(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitFileMode) {
            return visitor.visitFileMode(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterArgList) {
             listener.enterArgList(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitArgList) {
             listener.exitArgList(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitArgList) {
            return visitor.visitArgList(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterBlock) {
             listener.enterBlock(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitBlock) {
             listener.exitBlock(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitBlock) {
            return visitor.visitBlock(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterNotExpr) {
             listener.enterNotExpr(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitNotExpr) {
             listener.exitNotExpr(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitNotExpr) {
            return visitor.visitNotExpr(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterPowerExpr) {
             listener.enterPowerExpr(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitPowerExpr) {
             listener.exitPowerExpr(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitPowerExpr) {
            return visitor.visitPowerExpr(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterAddSubExpr) {
             listener.enterAddSubExpr(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitAddSubExpr) {
             listener.exitAddSubExpr(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitAddSubExpr) {
            return visitor.visitAddSubExpr(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterUnaryMinusExpr) {
             listener.enterUnaryMinusExpr(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitUnaryMinusExpr) {
             listener.exitUnaryMinusExpr(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitUnaryMinusExpr) {
            return visitor.visitUnaryMinusExpr(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterAtomExpr) {
             listener.enterAtomExpr(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitAtomExpr) {
             listener.exitAtomExpr(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitAtomExpr) {
            return visitor.visitAtomExpr(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterOrExpr) {
             listener.enterOrExpr(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitOrExpr) {
             listener.exitOrExpr(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitOrExpr) {
            return visitor.visitOrExpr(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterComparisonExpr) {
             listener.enterComparisonExpr(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitComparisonExpr) {
             listener.exitComparisonExpr(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitComparisonExpr) {
            return visitor.visitComparisonExpr(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterMulDivExpr) {
             listener.enterMulDivExpr(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitMulDivExpr) {
             listener.exitMulDivExpr(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitMulDivExpr) {
            return visitor.visitMulDivExpr(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterConcatExpr) {
             listener.enterConcatExpr(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitConcatExpr) {
             listener.exitConcatExpr(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitConcatExpr) {
            return visitor.visitConcatExpr(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterAndExpr) {
             listener.enterAndExpr(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitAndExpr) {
             listener.exitAndExpr(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitAndExpr) {
            return visitor.visitAndExpr(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterArrayAccess1DAtom) {
             listener.enterArrayAccess1DAtom(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitArrayAccess1DAtom) {
             listener.exitArrayAccess1DAtom(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitArrayAccess1DAtom) {
            return visitor.visitArrayAccess1DAtom(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterDivFunctionAtom) {
             listener.enterDivFunctionAtom(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitDivFunctionAtom) {
             listener.exitDivFunctionAtom(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitDivFunctionAtom) {
            return visitor.visitDivFunctionAtom(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterIdentifierAtom) {
             listener.enterIdentifierAtom(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitIdentifierAtom) {
             listener.exitIdentifierAtom(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitIdentifierAtom) {
            return visitor.visitIdentifierAtom(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterCharAtom) {
             listener.enterCharAtom(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitCharAtom) {
             listener.exitCharAtom(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitCharAtom) {
            return visitor.visitCharAtom(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterParenAtom) {
             listener.enterParenAtom(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitParenAtom) {
             listener.exitParenAtom(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitParenAtom) {
            return visitor.visitParenAtom(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterArrayAccess2DAtom) {
             listener.enterArrayAccess2DAtom(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitArrayAccess2DAtom) {
             listener.exitArrayAccess2DAtom(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitArrayAccess2DAtom) {
            return visitor.visitArrayAccess2DAtom(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterFunctionCallAtom) {
             listener.enterFunctionCallAtom(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitFunctionCallAtom) {
             listener.exitFunctionCallAtom(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitFunctionCallAtom) {
            return visitor.visitFunctionCallAtom(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterStringAtom) {
             listener.enterStringAtom(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitStringAtom) {
             listener.exitStringAtom(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitStringAtom) {
            return visitor.visitStringAtom(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterFalseAtom) {
             listener.enterFalseAtom(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitFalseAtom) {
             listener.exitFalseAtom(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitFalseAtom) {
            return visitor.visitFalseAtom(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterModFunctionAtom) {
             listener.enterModFunctionAtom(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitModFunctionAtom) {
             listener.exitModFunctionAtom(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitModFunctionAtom) {
            return visitor.visitModFunctionAtom(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterIntegerAtom) {
             listener.enterIntegerAtom(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitIntegerAtom) {
             listener.exitIntegerAtom(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitIntegerAtom) {
            return visitor.visitIntegerAtom(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterTrueAtom) {
             listener.enterTrueAtom(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitTrueAtom) {
             listener.exitTrueAtom(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitTrueAtom) {
            return visitor.visitTrueAtom(this);
        } else {
            return visitor.visitChildren(this);
        }
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
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterRealAtom) {
             listener.enterRealAtom(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitRealAtom) {
             listener.exitRealAtom(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitRealAtom) {
            return visitor.visitRealAtom(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
