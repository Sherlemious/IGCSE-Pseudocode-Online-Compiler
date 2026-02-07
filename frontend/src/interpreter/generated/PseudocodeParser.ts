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
    public static readonly INTEGER_TYPE = 39;
    public static readonly REAL_TYPE = 40;
    public static readonly CHAR_TYPE = 41;
    public static readonly STRING_TYPE = 42;
    public static readonly BOOLEAN_TYPE = 43;
    public static readonly LARROW = 44;
    public static readonly EQUALS = 45;
    public static readonly NOTEQUAL = 46;
    public static readonly LTE = 47;
    public static readonly GTE = 48;
    public static readonly LT = 49;
    public static readonly GT = 50;
    public static readonly PLUS = 51;
    public static readonly MINUS = 52;
    public static readonly STAR = 53;
    public static readonly SLASH = 54;
    public static readonly CARET = 55;
    public static readonly AMPERSAND = 56;
    public static readonly LPAREN = 57;
    public static readonly RPAREN = 58;
    public static readonly LBRACKET = 59;
    public static readonly RBRACKET = 60;
    public static readonly COMMA = 61;
    public static readonly COLON = 62;
    public static readonly REAL_LITERAL = 63;
    public static readonly INTEGER_LITERAL = 64;
    public static readonly STRING_LITERAL = 65;
    public static readonly CHAR_LITERAL = 66;
    public static readonly IDENTIFIER = 67;
    public static readonly NEWLINE = 68;
    public static readonly WS = 69;
    public static readonly LINE_COMMENT = 70;
    public static readonly RULE_program = 0;
    public static readonly RULE_statement = 1;
    public static readonly RULE_declareStatement = 2;
    public static readonly RULE_constantStatement = 3;
    public static readonly RULE_dataType = 4;
    public static readonly RULE_assignmentStatement = 5;
    public static readonly RULE_inputStatement = 6;
    public static readonly RULE_outputStatement = 7;
    public static readonly RULE_exprList = 8;
    public static readonly RULE_ifStatement = 9;
    public static readonly RULE_caseStatement = 10;
    public static readonly RULE_caseClause = 11;
    public static readonly RULE_forStatement = 12;
    public static readonly RULE_whileStatement = 13;
    public static readonly RULE_repeatStatement = 14;
    public static readonly RULE_procedureDeclaration = 15;
    public static readonly RULE_functionDeclaration = 16;
    public static readonly RULE_paramList = 17;
    public static readonly RULE_param = 18;
    public static readonly RULE_callStatement = 19;
    public static readonly RULE_returnStatement = 20;
    public static readonly RULE_argList = 21;
    public static readonly RULE_block = 22;
    public static readonly RULE_expr = 23;
    public static readonly RULE_atom = 24;

    public static readonly literalNames = [
        null, null, null, null, null, null, null, null, null, null, null, 
        null, null, null, null, null, null, null, null, null, null, null, 
        null, null, null, null, null, null, null, null, null, null, null, 
        null, null, null, null, null, null, null, null, null, null, null, 
        null, "'='", "'<>'", "'<='", "'>='", "'<'", "'>'", "'+'", "'-'", 
        "'*'", "'/'", "'^'", "'&'", "'('", "')'", "'['", "']'", "','", "':'"
    ];

    public static readonly symbolicNames = [
        null, "DECLARE", "CONSTANT", "INPUT", "OUTPUT", "PRINT", "IF", "THEN", 
        "ELSE", "ELSEIF", "ENDIF", "CASE", "OF", "OTHERWISE", "ENDCASE", 
        "FOR", "TO", "STEP", "NEXT", "WHILE", "DO", "ENDWHILE", "REPEAT", 
        "UNTIL", "PROCEDURE", "ENDPROCEDURE", "FUNCTION", "ENDFUNCTION", 
        "RETURNS", "RETURN", "CALL", "ARRAY", "AND", "OR", "NOT", "TRUE", 
        "FALSE", "MOD", "DIV", "INTEGER_TYPE", "REAL_TYPE", "CHAR_TYPE", 
        "STRING_TYPE", "BOOLEAN_TYPE", "LARROW", "EQUALS", "NOTEQUAL", "LTE", 
        "GTE", "LT", "GT", "PLUS", "MINUS", "STAR", "SLASH", "CARET", "AMPERSAND", 
        "LPAREN", "RPAREN", "LBRACKET", "RBRACKET", "COMMA", "COLON", "REAL_LITERAL", 
        "INTEGER_LITERAL", "STRING_LITERAL", "CHAR_LITERAL", "IDENTIFIER", 
        "NEWLINE", "WS", "LINE_COMMENT"
    ];
    public static readonly ruleNames = [
        "program", "statement", "declareStatement", "constantStatement", 
        "dataType", "assignmentStatement", "inputStatement", "outputStatement", 
        "exprList", "ifStatement", "caseStatement", "caseClause", "forStatement", 
        "whileStatement", "repeatStatement", "procedureDeclaration", "functionDeclaration", 
        "paramList", "param", "callStatement", "returnStatement", "argList", 
        "block", "expr", "atom",
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
            this.state = 53;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 0, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 50;
                    this.match(PseudocodeParser.NEWLINE);
                    }
                    }
                }
                this.state = 55;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 0, this.context);
            }
            this.state = 68;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 1699252350) !== 0) || _la === 67) {
                {
                this.state = 56;
                this.statement();
                this.state = 65;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 2, this.context);
                while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                    if (alternative === 1) {
                        {
                        {
                        this.state = 58;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                        do {
                            {
                            {
                            this.state = 57;
                            this.match(PseudocodeParser.NEWLINE);
                            }
                            }
                            this.state = 60;
                            this.errorHandler.sync(this);
                            _la = this.tokenStream.LA(1);
                        } while (_la === 68);
                        this.state = 62;
                        this.statement();
                        }
                        }
                    }
                    this.state = 67;
                    this.errorHandler.sync(this);
                    alternative = this.interpreter.adaptivePredict(this.tokenStream, 2, this.context);
                }
                }
            }

            this.state = 73;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 68) {
                {
                {
                this.state = 70;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 75;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 76;
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
            this.state = 92;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case PseudocodeParser.DECLARE:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 78;
                this.declareStatement();
                }
                break;
            case PseudocodeParser.CONSTANT:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 79;
                this.constantStatement();
                }
                break;
            case PseudocodeParser.IDENTIFIER:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 80;
                this.assignmentStatement();
                }
                break;
            case PseudocodeParser.INPUT:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 81;
                this.inputStatement();
                }
                break;
            case PseudocodeParser.OUTPUT:
            case PseudocodeParser.PRINT:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 82;
                this.outputStatement();
                }
                break;
            case PseudocodeParser.IF:
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 83;
                this.ifStatement();
                }
                break;
            case PseudocodeParser.CASE:
                this.enterOuterAlt(localContext, 7);
                {
                this.state = 84;
                this.caseStatement();
                }
                break;
            case PseudocodeParser.FOR:
                this.enterOuterAlt(localContext, 8);
                {
                this.state = 85;
                this.forStatement();
                }
                break;
            case PseudocodeParser.WHILE:
                this.enterOuterAlt(localContext, 9);
                {
                this.state = 86;
                this.whileStatement();
                }
                break;
            case PseudocodeParser.REPEAT:
                this.enterOuterAlt(localContext, 10);
                {
                this.state = 87;
                this.repeatStatement();
                }
                break;
            case PseudocodeParser.PROCEDURE:
                this.enterOuterAlt(localContext, 11);
                {
                this.state = 88;
                this.procedureDeclaration();
                }
                break;
            case PseudocodeParser.FUNCTION:
                this.enterOuterAlt(localContext, 12);
                {
                this.state = 89;
                this.functionDeclaration();
                }
                break;
            case PseudocodeParser.CALL:
                this.enterOuterAlt(localContext, 13);
                {
                this.state = 90;
                this.callStatement();
                }
                break;
            case PseudocodeParser.RETURN:
                this.enterOuterAlt(localContext, 14);
                {
                this.state = 91;
                this.returnStatement();
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
            this.state = 126;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 6, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 94;
                this.match(PseudocodeParser.DECLARE);
                this.state = 95;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 96;
                this.match(PseudocodeParser.COLON);
                this.state = 97;
                this.match(PseudocodeParser.ARRAY);
                this.state = 98;
                this.match(PseudocodeParser.LBRACKET);
                this.state = 99;
                this.expr(0);
                this.state = 100;
                this.match(PseudocodeParser.COLON);
                this.state = 101;
                this.expr(0);
                this.state = 102;
                this.match(PseudocodeParser.RBRACKET);
                this.state = 103;
                this.match(PseudocodeParser.OF);
                this.state = 104;
                this.dataType();
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 106;
                this.match(PseudocodeParser.DECLARE);
                this.state = 107;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 108;
                this.match(PseudocodeParser.COLON);
                this.state = 109;
                this.match(PseudocodeParser.ARRAY);
                this.state = 110;
                this.match(PseudocodeParser.LBRACKET);
                this.state = 111;
                this.expr(0);
                this.state = 112;
                this.match(PseudocodeParser.COLON);
                this.state = 113;
                this.expr(0);
                this.state = 114;
                this.match(PseudocodeParser.COMMA);
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
            case 3:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 122;
                this.match(PseudocodeParser.DECLARE);
                this.state = 123;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 124;
                this.match(PseudocodeParser.COLON);
                this.state = 125;
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
    public constantStatement(): ConstantStatementContext {
        let localContext = new ConstantStatementContext(this.context, this.state);
        this.enterRule(localContext, 6, PseudocodeParser.RULE_constantStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 128;
            this.match(PseudocodeParser.CONSTANT);
            this.state = 129;
            this.match(PseudocodeParser.IDENTIFIER);
            this.state = 130;
            this.match(PseudocodeParser.EQUALS);
            this.state = 131;
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
        this.enterRule(localContext, 8, PseudocodeParser.RULE_dataType);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 133;
            _la = this.tokenStream.LA(1);
            if(!(((((_la - 39)) & ~0x1F) === 0 && ((1 << (_la - 39)) & 31) !== 0))) {
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
        this.enterRule(localContext, 10, PseudocodeParser.RULE_assignmentStatement);
        try {
            this.state = 173;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 7, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 135;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 136;
                this.match(PseudocodeParser.EQUALS);
                this.state = 137;
                this.expr(0);
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 138;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 139;
                this.match(PseudocodeParser.LBRACKET);
                this.state = 140;
                this.expr(0);
                this.state = 141;
                this.match(PseudocodeParser.RBRACKET);
                this.state = 142;
                this.match(PseudocodeParser.EQUALS);
                this.state = 143;
                this.expr(0);
                }
                break;
            case 3:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 145;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 146;
                this.match(PseudocodeParser.LBRACKET);
                this.state = 147;
                this.expr(0);
                this.state = 148;
                this.match(PseudocodeParser.COMMA);
                this.state = 149;
                this.expr(0);
                this.state = 150;
                this.match(PseudocodeParser.RBRACKET);
                this.state = 151;
                this.match(PseudocodeParser.EQUALS);
                this.state = 152;
                this.expr(0);
                }
                break;
            case 4:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 154;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 155;
                this.match(PseudocodeParser.LARROW);
                this.state = 156;
                this.expr(0);
                }
                break;
            case 5:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 157;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 158;
                this.match(PseudocodeParser.LBRACKET);
                this.state = 159;
                this.expr(0);
                this.state = 160;
                this.match(PseudocodeParser.RBRACKET);
                this.state = 161;
                this.match(PseudocodeParser.LARROW);
                this.state = 162;
                this.expr(0);
                }
                break;
            case 6:
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 164;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 165;
                this.match(PseudocodeParser.LBRACKET);
                this.state = 166;
                this.expr(0);
                this.state = 167;
                this.match(PseudocodeParser.COMMA);
                this.state = 168;
                this.expr(0);
                this.state = 169;
                this.match(PseudocodeParser.RBRACKET);
                this.state = 170;
                this.match(PseudocodeParser.LARROW);
                this.state = 171;
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
        this.enterRule(localContext, 12, PseudocodeParser.RULE_inputStatement);
        try {
            this.state = 183;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 8, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 175;
                this.match(PseudocodeParser.INPUT);
                this.state = 176;
                this.match(PseudocodeParser.IDENTIFIER);
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 177;
                this.match(PseudocodeParser.INPUT);
                this.state = 178;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 179;
                this.match(PseudocodeParser.LBRACKET);
                this.state = 180;
                this.expr(0);
                this.state = 181;
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
        this.enterRule(localContext, 14, PseudocodeParser.RULE_outputStatement);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 185;
            _la = this.tokenStream.LA(1);
            if(!(_la === 4 || _la === 5)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            this.state = 186;
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
        this.enterRule(localContext, 16, PseudocodeParser.RULE_exprList);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 188;
            this.expr(0);
            this.state = 193;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 61) {
                {
                {
                this.state = 189;
                this.match(PseudocodeParser.COMMA);
                this.state = 190;
                this.expr(0);
                }
                }
                this.state = 195;
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
        this.enterRule(localContext, 18, PseudocodeParser.RULE_ifStatement);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 196;
            this.match(PseudocodeParser.IF);
            this.state = 197;
            this.expr(0);
            this.state = 198;
            this.match(PseudocodeParser.THEN);
            this.state = 200;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 199;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 202;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 68);
            this.state = 204;
            this.block();
            this.state = 222;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 13, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 206;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    do {
                        {
                        {
                        this.state = 205;
                        this.match(PseudocodeParser.NEWLINE);
                        }
                        }
                        this.state = 208;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                    } while (_la === 68);
                    this.state = 210;
                    this.match(PseudocodeParser.ELSEIF);
                    this.state = 211;
                    this.expr(0);
                    this.state = 212;
                    this.match(PseudocodeParser.THEN);
                    this.state = 214;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    do {
                        {
                        {
                        this.state = 213;
                        this.match(PseudocodeParser.NEWLINE);
                        }
                        }
                        this.state = 216;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                    } while (_la === 68);
                    this.state = 218;
                    this.block();
                    }
                    }
                }
                this.state = 224;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 13, this.context);
            }
            this.state = 237;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 16, this.context) ) {
            case 1:
                {
                this.state = 226;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                do {
                    {
                    {
                    this.state = 225;
                    this.match(PseudocodeParser.NEWLINE);
                    }
                    }
                    this.state = 228;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                } while (_la === 68);
                this.state = 230;
                this.match(PseudocodeParser.ELSE);
                this.state = 232;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                do {
                    {
                    {
                    this.state = 231;
                    this.match(PseudocodeParser.NEWLINE);
                    }
                    }
                    this.state = 234;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                } while (_la === 68);
                this.state = 236;
                this.block();
                }
                break;
            }
            this.state = 240;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 239;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 242;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 68);
            this.state = 244;
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
        this.enterRule(localContext, 20, PseudocodeParser.RULE_caseStatement);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 246;
            this.match(PseudocodeParser.CASE);
            this.state = 247;
            this.match(PseudocodeParser.OF);
            this.state = 248;
            this.match(PseudocodeParser.IDENTIFIER);
            this.state = 250;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 249;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 252;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 68);
            this.state = 255;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 254;
                this.caseClause();
                }
                }
                this.state = 257;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & 3766747143) !== 0) || _la === 66 || _la === 67);
            this.state = 272;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 13) {
                {
                this.state = 259;
                this.match(PseudocodeParser.OTHERWISE);
                this.state = 260;
                this.match(PseudocodeParser.COLON);
                this.state = 262;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                do {
                    {
                    {
                    this.state = 261;
                    this.match(PseudocodeParser.NEWLINE);
                    }
                    }
                    this.state = 264;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                } while (_la === 68);
                this.state = 266;
                this.block();
                this.state = 268;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                do {
                    {
                    {
                    this.state = 267;
                    this.match(PseudocodeParser.NEWLINE);
                    }
                    }
                    this.state = 270;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                } while (_la === 68);
                }
            }

            this.state = 274;
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
        this.enterRule(localContext, 22, PseudocodeParser.RULE_caseClause);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 276;
            this.expr(0);
            this.state = 277;
            this.match(PseudocodeParser.COLON);
            this.state = 279;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 278;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 281;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 68);
            this.state = 283;
            this.block();
            this.state = 285;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 284;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 287;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 68);
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
        this.enterRule(localContext, 24, PseudocodeParser.RULE_forStatement);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 289;
            this.match(PseudocodeParser.FOR);
            this.state = 290;
            this.match(PseudocodeParser.IDENTIFIER);
            this.state = 291;
            this.match(PseudocodeParser.EQUALS);
            this.state = 292;
            this.expr(0);
            this.state = 293;
            this.match(PseudocodeParser.TO);
            this.state = 294;
            this.expr(0);
            this.state = 297;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 17) {
                {
                this.state = 295;
                this.match(PseudocodeParser.STEP);
                this.state = 296;
                this.expr(0);
                }
            }

            this.state = 300;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 299;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 302;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 68);
            this.state = 304;
            this.block();
            this.state = 306;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 305;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 308;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 68);
            this.state = 310;
            this.match(PseudocodeParser.NEXT);
            this.state = 311;
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
        this.enterRule(localContext, 26, PseudocodeParser.RULE_whileStatement);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 313;
            this.match(PseudocodeParser.WHILE);
            this.state = 314;
            this.expr(0);
            this.state = 316;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 20) {
                {
                this.state = 315;
                this.match(PseudocodeParser.DO);
                }
            }

            this.state = 319;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 318;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 321;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 68);
            this.state = 323;
            this.block();
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
            } while (_la === 68);
            this.state = 329;
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
        this.enterRule(localContext, 28, PseudocodeParser.RULE_repeatStatement);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 331;
            this.match(PseudocodeParser.REPEAT);
            this.state = 333;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 332;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 335;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 68);
            this.state = 337;
            this.block();
            this.state = 339;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 338;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 341;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 68);
            this.state = 343;
            this.match(PseudocodeParser.UNTIL);
            this.state = 344;
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
        this.enterRule(localContext, 30, PseudocodeParser.RULE_procedureDeclaration);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 346;
            this.match(PseudocodeParser.PROCEDURE);
            this.state = 347;
            this.match(PseudocodeParser.IDENTIFIER);
            this.state = 348;
            this.match(PseudocodeParser.LPAREN);
            this.state = 350;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 67) {
                {
                this.state = 349;
                this.paramList();
                }
            }

            this.state = 352;
            this.match(PseudocodeParser.RPAREN);
            this.state = 354;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 353;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 356;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 68);
            this.state = 358;
            this.block();
            this.state = 360;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 359;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 362;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 68);
            this.state = 364;
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
        this.enterRule(localContext, 32, PseudocodeParser.RULE_functionDeclaration);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 366;
            this.match(PseudocodeParser.FUNCTION);
            this.state = 367;
            this.match(PseudocodeParser.IDENTIFIER);
            this.state = 368;
            this.match(PseudocodeParser.LPAREN);
            this.state = 370;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 67) {
                {
                this.state = 369;
                this.paramList();
                }
            }

            this.state = 372;
            this.match(PseudocodeParser.RPAREN);
            this.state = 373;
            this.match(PseudocodeParser.RETURNS);
            this.state = 374;
            this.dataType();
            this.state = 376;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 375;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 378;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 68);
            this.state = 380;
            this.block();
            this.state = 382;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 381;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 384;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 68);
            this.state = 386;
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
        this.enterRule(localContext, 34, PseudocodeParser.RULE_paramList);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 388;
            this.param();
            this.state = 393;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 61) {
                {
                {
                this.state = 389;
                this.match(PseudocodeParser.COMMA);
                this.state = 390;
                this.param();
                }
                }
                this.state = 395;
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
        this.enterRule(localContext, 36, PseudocodeParser.RULE_param);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 396;
            this.match(PseudocodeParser.IDENTIFIER);
            this.state = 397;
            this.match(PseudocodeParser.COLON);
            this.state = 398;
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
        this.enterRule(localContext, 38, PseudocodeParser.RULE_callStatement);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 400;
            this.match(PseudocodeParser.CALL);
            this.state = 401;
            this.match(PseudocodeParser.IDENTIFIER);
            this.state = 402;
            this.match(PseudocodeParser.LPAREN);
            this.state = 404;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & 3766747143) !== 0) || _la === 66 || _la === 67) {
                {
                this.state = 403;
                this.argList();
                }
            }

            this.state = 406;
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
        this.enterRule(localContext, 40, PseudocodeParser.RULE_returnStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 408;
            this.match(PseudocodeParser.RETURN);
            this.state = 409;
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
    public argList(): ArgListContext {
        let localContext = new ArgListContext(this.context, this.state);
        this.enterRule(localContext, 42, PseudocodeParser.RULE_argList);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 411;
            this.expr(0);
            this.state = 416;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 61) {
                {
                {
                this.state = 412;
                this.match(PseudocodeParser.COMMA);
                this.state = 413;
                this.expr(0);
                }
                }
                this.state = 418;
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
        this.enterRule(localContext, 44, PseudocodeParser.RULE_block);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 419;
            this.statement();
            this.state = 428;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 43, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 421;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    do {
                        {
                        {
                        this.state = 420;
                        this.match(PseudocodeParser.NEWLINE);
                        }
                        }
                        this.state = 423;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                    } while (_la === 68);
                    this.state = 425;
                    this.statement();
                    }
                    }
                }
                this.state = 430;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 43, this.context);
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
        let _startState = 46;
        this.enterRecursionRule(localContext, 46, PseudocodeParser.RULE_expr, _p);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 437;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case PseudocodeParser.NOT:
                {
                localContext = new NotExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;

                this.state = 432;
                this.match(PseudocodeParser.NOT);
                this.state = 433;
                this.expr(10);
                }
                break;
            case PseudocodeParser.MINUS:
                {
                localContext = new UnaryMinusExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 434;
                this.match(PseudocodeParser.MINUS);
                this.state = 435;
                this.expr(9);
                }
                break;
            case PseudocodeParser.TRUE:
            case PseudocodeParser.FALSE:
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
                this.state = 436;
                this.atom();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
            this.context!.stop = this.tokenStream.LT(-1);
            this.state = 462;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 46, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    if (this.parseListeners != null) {
                        this.triggerExitRuleEvent();
                    }
                    previousContext = localContext;
                    {
                    this.state = 460;
                    this.errorHandler.sync(this);
                    switch (this.interpreter.adaptivePredict(this.tokenStream, 45, this.context) ) {
                    case 1:
                        {
                        localContext = new PowerExprContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, PseudocodeParser.RULE_expr);
                        this.state = 439;
                        if (!(this.precpred(this.context, 8))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 8)");
                        }
                        this.state = 440;
                        this.match(PseudocodeParser.CARET);
                        this.state = 441;
                        this.expr(8);
                        }
                        break;
                    case 2:
                        {
                        localContext = new MulDivExprContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, PseudocodeParser.RULE_expr);
                        this.state = 442;
                        if (!(this.precpred(this.context, 7))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 7)");
                        }
                        this.state = 443;
                        (localContext as MulDivExprContext)._op = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!(((((_la - 37)) & ~0x1F) === 0 && ((1 << (_la - 37)) & 196611) !== 0))) {
                            (localContext as MulDivExprContext)._op = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 444;
                        this.expr(8);
                        }
                        break;
                    case 3:
                        {
                        localContext = new AddSubExprContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, PseudocodeParser.RULE_expr);
                        this.state = 445;
                        if (!(this.precpred(this.context, 6))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 6)");
                        }
                        this.state = 446;
                        (localContext as AddSubExprContext)._op = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!(_la === 51 || _la === 52)) {
                            (localContext as AddSubExprContext)._op = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 447;
                        this.expr(7);
                        }
                        break;
                    case 4:
                        {
                        localContext = new ConcatExprContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, PseudocodeParser.RULE_expr);
                        this.state = 448;
                        if (!(this.precpred(this.context, 5))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 5)");
                        }
                        this.state = 449;
                        this.match(PseudocodeParser.AMPERSAND);
                        this.state = 450;
                        this.expr(6);
                        }
                        break;
                    case 5:
                        {
                        localContext = new ComparisonExprContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, PseudocodeParser.RULE_expr);
                        this.state = 451;
                        if (!(this.precpred(this.context, 4))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 4)");
                        }
                        this.state = 452;
                        (localContext as ComparisonExprContext)._op = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!(((((_la - 45)) & ~0x1F) === 0 && ((1 << (_la - 45)) & 63) !== 0))) {
                            (localContext as ComparisonExprContext)._op = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 453;
                        this.expr(5);
                        }
                        break;
                    case 6:
                        {
                        localContext = new AndExprContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, PseudocodeParser.RULE_expr);
                        this.state = 454;
                        if (!(this.precpred(this.context, 3))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 3)");
                        }
                        this.state = 455;
                        this.match(PseudocodeParser.AND);
                        this.state = 456;
                        this.expr(4);
                        }
                        break;
                    case 7:
                        {
                        localContext = new OrExprContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, PseudocodeParser.RULE_expr);
                        this.state = 457;
                        if (!(this.precpred(this.context, 2))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 2)");
                        }
                        this.state = 458;
                        this.match(PseudocodeParser.OR);
                        this.state = 459;
                        this.expr(3);
                        }
                        break;
                    }
                    }
                }
                this.state = 464;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 46, this.context);
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
        this.enterRule(localContext, 48, PseudocodeParser.RULE_atom);
        let _la: number;
        try {
            this.state = 494;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 48, this.context) ) {
            case 1:
                localContext = new ParenAtomContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 465;
                this.match(PseudocodeParser.LPAREN);
                this.state = 466;
                this.expr(0);
                this.state = 467;
                this.match(PseudocodeParser.RPAREN);
                }
                break;
            case 2:
                localContext = new FunctionCallAtomContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 469;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 470;
                this.match(PseudocodeParser.LPAREN);
                this.state = 472;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & 3766747143) !== 0) || _la === 66 || _la === 67) {
                    {
                    this.state = 471;
                    this.argList();
                    }
                }

                this.state = 474;
                this.match(PseudocodeParser.RPAREN);
                }
                break;
            case 3:
                localContext = new ArrayAccess1DAtomContext(localContext);
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 475;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 476;
                this.match(PseudocodeParser.LBRACKET);
                this.state = 477;
                this.expr(0);
                this.state = 478;
                this.match(PseudocodeParser.RBRACKET);
                }
                break;
            case 4:
                localContext = new ArrayAccess2DAtomContext(localContext);
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 480;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 481;
                this.match(PseudocodeParser.LBRACKET);
                this.state = 482;
                this.expr(0);
                this.state = 483;
                this.match(PseudocodeParser.COMMA);
                this.state = 484;
                this.expr(0);
                this.state = 485;
                this.match(PseudocodeParser.RBRACKET);
                }
                break;
            case 5:
                localContext = new IdentifierAtomContext(localContext);
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 487;
                this.match(PseudocodeParser.IDENTIFIER);
                }
                break;
            case 6:
                localContext = new IntegerAtomContext(localContext);
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 488;
                this.match(PseudocodeParser.INTEGER_LITERAL);
                }
                break;
            case 7:
                localContext = new RealAtomContext(localContext);
                this.enterOuterAlt(localContext, 7);
                {
                this.state = 489;
                this.match(PseudocodeParser.REAL_LITERAL);
                }
                break;
            case 8:
                localContext = new StringAtomContext(localContext);
                this.enterOuterAlt(localContext, 8);
                {
                this.state = 490;
                this.match(PseudocodeParser.STRING_LITERAL);
                }
                break;
            case 9:
                localContext = new CharAtomContext(localContext);
                this.enterOuterAlt(localContext, 9);
                {
                this.state = 491;
                this.match(PseudocodeParser.CHAR_LITERAL);
                }
                break;
            case 10:
                localContext = new TrueAtomContext(localContext);
                this.enterOuterAlt(localContext, 10);
                {
                this.state = 492;
                this.match(PseudocodeParser.TRUE);
                }
                break;
            case 11:
                localContext = new FalseAtomContext(localContext);
                this.enterOuterAlt(localContext, 11);
                {
                this.state = 493;
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
        case 23:
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
        4,1,70,497,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,
        6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,2,11,7,11,2,12,7,12,2,13,7,13,
        2,14,7,14,2,15,7,15,2,16,7,16,2,17,7,17,2,18,7,18,2,19,7,19,2,20,
        7,20,2,21,7,21,2,22,7,22,2,23,7,23,2,24,7,24,1,0,5,0,52,8,0,10,0,
        12,0,55,9,0,1,0,1,0,4,0,59,8,0,11,0,12,0,60,1,0,5,0,64,8,0,10,0,
        12,0,67,9,0,3,0,69,8,0,1,0,5,0,72,8,0,10,0,12,0,75,9,0,1,0,1,0,1,
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,1,93,8,1,
        1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,
        1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,
        3,2,127,8,2,1,3,1,3,1,3,1,3,1,3,1,4,1,4,1,5,1,5,1,5,1,5,1,5,1,5,
        1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,
        1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,
        3,5,174,8,5,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,3,6,184,8,6,1,7,1,7,
        1,7,1,8,1,8,1,8,5,8,192,8,8,10,8,12,8,195,9,8,1,9,1,9,1,9,1,9,4,
        9,201,8,9,11,9,12,9,202,1,9,1,9,4,9,207,8,9,11,9,12,9,208,1,9,1,
        9,1,9,1,9,4,9,215,8,9,11,9,12,9,216,1,9,1,9,5,9,221,8,9,10,9,12,
        9,224,9,9,1,9,4,9,227,8,9,11,9,12,9,228,1,9,1,9,4,9,233,8,9,11,9,
        12,9,234,1,9,3,9,238,8,9,1,9,4,9,241,8,9,11,9,12,9,242,1,9,1,9,1,
        10,1,10,1,10,1,10,4,10,251,8,10,11,10,12,10,252,1,10,4,10,256,8,
        10,11,10,12,10,257,1,10,1,10,1,10,4,10,263,8,10,11,10,12,10,264,
        1,10,1,10,4,10,269,8,10,11,10,12,10,270,3,10,273,8,10,1,10,1,10,
        1,11,1,11,1,11,4,11,280,8,11,11,11,12,11,281,1,11,1,11,4,11,286,
        8,11,11,11,12,11,287,1,12,1,12,1,12,1,12,1,12,1,12,1,12,1,12,3,12,
        298,8,12,1,12,4,12,301,8,12,11,12,12,12,302,1,12,1,12,4,12,307,8,
        12,11,12,12,12,308,1,12,1,12,1,12,1,13,1,13,1,13,3,13,317,8,13,1,
        13,4,13,320,8,13,11,13,12,13,321,1,13,1,13,4,13,326,8,13,11,13,12,
        13,327,1,13,1,13,1,14,1,14,4,14,334,8,14,11,14,12,14,335,1,14,1,
        14,4,14,340,8,14,11,14,12,14,341,1,14,1,14,1,14,1,15,1,15,1,15,1,
        15,3,15,351,8,15,1,15,1,15,4,15,355,8,15,11,15,12,15,356,1,15,1,
        15,4,15,361,8,15,11,15,12,15,362,1,15,1,15,1,16,1,16,1,16,1,16,3,
        16,371,8,16,1,16,1,16,1,16,1,16,4,16,377,8,16,11,16,12,16,378,1,
        16,1,16,4,16,383,8,16,11,16,12,16,384,1,16,1,16,1,17,1,17,1,17,5,
        17,392,8,17,10,17,12,17,395,9,17,1,18,1,18,1,18,1,18,1,19,1,19,1,
        19,1,19,3,19,405,8,19,1,19,1,19,1,20,1,20,1,20,1,21,1,21,1,21,5,
        21,415,8,21,10,21,12,21,418,9,21,1,22,1,22,4,22,422,8,22,11,22,12,
        22,423,1,22,5,22,427,8,22,10,22,12,22,430,9,22,1,23,1,23,1,23,1,
        23,1,23,1,23,3,23,438,8,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,
        23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,
        23,5,23,461,8,23,10,23,12,23,464,9,23,1,24,1,24,1,24,1,24,1,24,1,
        24,1,24,3,24,473,8,24,1,24,1,24,1,24,1,24,1,24,1,24,1,24,1,24,1,
        24,1,24,1,24,1,24,1,24,1,24,1,24,1,24,1,24,1,24,1,24,1,24,3,24,495,
        8,24,1,24,0,1,46,25,0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,
        34,36,38,40,42,44,46,48,0,5,1,0,39,43,1,0,4,5,2,0,37,38,53,54,1,
        0,51,52,1,0,45,50,552,0,53,1,0,0,0,2,92,1,0,0,0,4,126,1,0,0,0,6,
        128,1,0,0,0,8,133,1,0,0,0,10,173,1,0,0,0,12,183,1,0,0,0,14,185,1,
        0,0,0,16,188,1,0,0,0,18,196,1,0,0,0,20,246,1,0,0,0,22,276,1,0,0,
        0,24,289,1,0,0,0,26,313,1,0,0,0,28,331,1,0,0,0,30,346,1,0,0,0,32,
        366,1,0,0,0,34,388,1,0,0,0,36,396,1,0,0,0,38,400,1,0,0,0,40,408,
        1,0,0,0,42,411,1,0,0,0,44,419,1,0,0,0,46,437,1,0,0,0,48,494,1,0,
        0,0,50,52,5,68,0,0,51,50,1,0,0,0,52,55,1,0,0,0,53,51,1,0,0,0,53,
        54,1,0,0,0,54,68,1,0,0,0,55,53,1,0,0,0,56,65,3,2,1,0,57,59,5,68,
        0,0,58,57,1,0,0,0,59,60,1,0,0,0,60,58,1,0,0,0,60,61,1,0,0,0,61,62,
        1,0,0,0,62,64,3,2,1,0,63,58,1,0,0,0,64,67,1,0,0,0,65,63,1,0,0,0,
        65,66,1,0,0,0,66,69,1,0,0,0,67,65,1,0,0,0,68,56,1,0,0,0,68,69,1,
        0,0,0,69,73,1,0,0,0,70,72,5,68,0,0,71,70,1,0,0,0,72,75,1,0,0,0,73,
        71,1,0,0,0,73,74,1,0,0,0,74,76,1,0,0,0,75,73,1,0,0,0,76,77,5,0,0,
        1,77,1,1,0,0,0,78,93,3,4,2,0,79,93,3,6,3,0,80,93,3,10,5,0,81,93,
        3,12,6,0,82,93,3,14,7,0,83,93,3,18,9,0,84,93,3,20,10,0,85,93,3,24,
        12,0,86,93,3,26,13,0,87,93,3,28,14,0,88,93,3,30,15,0,89,93,3,32,
        16,0,90,93,3,38,19,0,91,93,3,40,20,0,92,78,1,0,0,0,92,79,1,0,0,0,
        92,80,1,0,0,0,92,81,1,0,0,0,92,82,1,0,0,0,92,83,1,0,0,0,92,84,1,
        0,0,0,92,85,1,0,0,0,92,86,1,0,0,0,92,87,1,0,0,0,92,88,1,0,0,0,92,
        89,1,0,0,0,92,90,1,0,0,0,92,91,1,0,0,0,93,3,1,0,0,0,94,95,5,1,0,
        0,95,96,5,67,0,0,96,97,5,62,0,0,97,98,5,31,0,0,98,99,5,59,0,0,99,
        100,3,46,23,0,100,101,5,62,0,0,101,102,3,46,23,0,102,103,5,60,0,
        0,103,104,5,12,0,0,104,105,3,8,4,0,105,127,1,0,0,0,106,107,5,1,0,
        0,107,108,5,67,0,0,108,109,5,62,0,0,109,110,5,31,0,0,110,111,5,59,
        0,0,111,112,3,46,23,0,112,113,5,62,0,0,113,114,3,46,23,0,114,115,
        5,61,0,0,115,116,3,46,23,0,116,117,5,62,0,0,117,118,3,46,23,0,118,
        119,5,60,0,0,119,120,5,12,0,0,120,121,3,8,4,0,121,127,1,0,0,0,122,
        123,5,1,0,0,123,124,5,67,0,0,124,125,5,62,0,0,125,127,3,8,4,0,126,
        94,1,0,0,0,126,106,1,0,0,0,126,122,1,0,0,0,127,5,1,0,0,0,128,129,
        5,2,0,0,129,130,5,67,0,0,130,131,5,45,0,0,131,132,3,46,23,0,132,
        7,1,0,0,0,133,134,7,0,0,0,134,9,1,0,0,0,135,136,5,67,0,0,136,137,
        5,45,0,0,137,174,3,46,23,0,138,139,5,67,0,0,139,140,5,59,0,0,140,
        141,3,46,23,0,141,142,5,60,0,0,142,143,5,45,0,0,143,144,3,46,23,
        0,144,174,1,0,0,0,145,146,5,67,0,0,146,147,5,59,0,0,147,148,3,46,
        23,0,148,149,5,61,0,0,149,150,3,46,23,0,150,151,5,60,0,0,151,152,
        5,45,0,0,152,153,3,46,23,0,153,174,1,0,0,0,154,155,5,67,0,0,155,
        156,5,44,0,0,156,174,3,46,23,0,157,158,5,67,0,0,158,159,5,59,0,0,
        159,160,3,46,23,0,160,161,5,60,0,0,161,162,5,44,0,0,162,163,3,46,
        23,0,163,174,1,0,0,0,164,165,5,67,0,0,165,166,5,59,0,0,166,167,3,
        46,23,0,167,168,5,61,0,0,168,169,3,46,23,0,169,170,5,60,0,0,170,
        171,5,44,0,0,171,172,3,46,23,0,172,174,1,0,0,0,173,135,1,0,0,0,173,
        138,1,0,0,0,173,145,1,0,0,0,173,154,1,0,0,0,173,157,1,0,0,0,173,
        164,1,0,0,0,174,11,1,0,0,0,175,176,5,3,0,0,176,184,5,67,0,0,177,
        178,5,3,0,0,178,179,5,67,0,0,179,180,5,59,0,0,180,181,3,46,23,0,
        181,182,5,60,0,0,182,184,1,0,0,0,183,175,1,0,0,0,183,177,1,0,0,0,
        184,13,1,0,0,0,185,186,7,1,0,0,186,187,3,16,8,0,187,15,1,0,0,0,188,
        193,3,46,23,0,189,190,5,61,0,0,190,192,3,46,23,0,191,189,1,0,0,0,
        192,195,1,0,0,0,193,191,1,0,0,0,193,194,1,0,0,0,194,17,1,0,0,0,195,
        193,1,0,0,0,196,197,5,6,0,0,197,198,3,46,23,0,198,200,5,7,0,0,199,
        201,5,68,0,0,200,199,1,0,0,0,201,202,1,0,0,0,202,200,1,0,0,0,202,
        203,1,0,0,0,203,204,1,0,0,0,204,222,3,44,22,0,205,207,5,68,0,0,206,
        205,1,0,0,0,207,208,1,0,0,0,208,206,1,0,0,0,208,209,1,0,0,0,209,
        210,1,0,0,0,210,211,5,9,0,0,211,212,3,46,23,0,212,214,5,7,0,0,213,
        215,5,68,0,0,214,213,1,0,0,0,215,216,1,0,0,0,216,214,1,0,0,0,216,
        217,1,0,0,0,217,218,1,0,0,0,218,219,3,44,22,0,219,221,1,0,0,0,220,
        206,1,0,0,0,221,224,1,0,0,0,222,220,1,0,0,0,222,223,1,0,0,0,223,
        237,1,0,0,0,224,222,1,0,0,0,225,227,5,68,0,0,226,225,1,0,0,0,227,
        228,1,0,0,0,228,226,1,0,0,0,228,229,1,0,0,0,229,230,1,0,0,0,230,
        232,5,8,0,0,231,233,5,68,0,0,232,231,1,0,0,0,233,234,1,0,0,0,234,
        232,1,0,0,0,234,235,1,0,0,0,235,236,1,0,0,0,236,238,3,44,22,0,237,
        226,1,0,0,0,237,238,1,0,0,0,238,240,1,0,0,0,239,241,5,68,0,0,240,
        239,1,0,0,0,241,242,1,0,0,0,242,240,1,0,0,0,242,243,1,0,0,0,243,
        244,1,0,0,0,244,245,5,10,0,0,245,19,1,0,0,0,246,247,5,11,0,0,247,
        248,5,12,0,0,248,250,5,67,0,0,249,251,5,68,0,0,250,249,1,0,0,0,251,
        252,1,0,0,0,252,250,1,0,0,0,252,253,1,0,0,0,253,255,1,0,0,0,254,
        256,3,22,11,0,255,254,1,0,0,0,256,257,1,0,0,0,257,255,1,0,0,0,257,
        258,1,0,0,0,258,272,1,0,0,0,259,260,5,13,0,0,260,262,5,62,0,0,261,
        263,5,68,0,0,262,261,1,0,0,0,263,264,1,0,0,0,264,262,1,0,0,0,264,
        265,1,0,0,0,265,266,1,0,0,0,266,268,3,44,22,0,267,269,5,68,0,0,268,
        267,1,0,0,0,269,270,1,0,0,0,270,268,1,0,0,0,270,271,1,0,0,0,271,
        273,1,0,0,0,272,259,1,0,0,0,272,273,1,0,0,0,273,274,1,0,0,0,274,
        275,5,14,0,0,275,21,1,0,0,0,276,277,3,46,23,0,277,279,5,62,0,0,278,
        280,5,68,0,0,279,278,1,0,0,0,280,281,1,0,0,0,281,279,1,0,0,0,281,
        282,1,0,0,0,282,283,1,0,0,0,283,285,3,44,22,0,284,286,5,68,0,0,285,
        284,1,0,0,0,286,287,1,0,0,0,287,285,1,0,0,0,287,288,1,0,0,0,288,
        23,1,0,0,0,289,290,5,15,0,0,290,291,5,67,0,0,291,292,5,45,0,0,292,
        293,3,46,23,0,293,294,5,16,0,0,294,297,3,46,23,0,295,296,5,17,0,
        0,296,298,3,46,23,0,297,295,1,0,0,0,297,298,1,0,0,0,298,300,1,0,
        0,0,299,301,5,68,0,0,300,299,1,0,0,0,301,302,1,0,0,0,302,300,1,0,
        0,0,302,303,1,0,0,0,303,304,1,0,0,0,304,306,3,44,22,0,305,307,5,
        68,0,0,306,305,1,0,0,0,307,308,1,0,0,0,308,306,1,0,0,0,308,309,1,
        0,0,0,309,310,1,0,0,0,310,311,5,18,0,0,311,312,5,67,0,0,312,25,1,
        0,0,0,313,314,5,19,0,0,314,316,3,46,23,0,315,317,5,20,0,0,316,315,
        1,0,0,0,316,317,1,0,0,0,317,319,1,0,0,0,318,320,5,68,0,0,319,318,
        1,0,0,0,320,321,1,0,0,0,321,319,1,0,0,0,321,322,1,0,0,0,322,323,
        1,0,0,0,323,325,3,44,22,0,324,326,5,68,0,0,325,324,1,0,0,0,326,327,
        1,0,0,0,327,325,1,0,0,0,327,328,1,0,0,0,328,329,1,0,0,0,329,330,
        5,21,0,0,330,27,1,0,0,0,331,333,5,22,0,0,332,334,5,68,0,0,333,332,
        1,0,0,0,334,335,1,0,0,0,335,333,1,0,0,0,335,336,1,0,0,0,336,337,
        1,0,0,0,337,339,3,44,22,0,338,340,5,68,0,0,339,338,1,0,0,0,340,341,
        1,0,0,0,341,339,1,0,0,0,341,342,1,0,0,0,342,343,1,0,0,0,343,344,
        5,23,0,0,344,345,3,46,23,0,345,29,1,0,0,0,346,347,5,24,0,0,347,348,
        5,67,0,0,348,350,5,57,0,0,349,351,3,34,17,0,350,349,1,0,0,0,350,
        351,1,0,0,0,351,352,1,0,0,0,352,354,5,58,0,0,353,355,5,68,0,0,354,
        353,1,0,0,0,355,356,1,0,0,0,356,354,1,0,0,0,356,357,1,0,0,0,357,
        358,1,0,0,0,358,360,3,44,22,0,359,361,5,68,0,0,360,359,1,0,0,0,361,
        362,1,0,0,0,362,360,1,0,0,0,362,363,1,0,0,0,363,364,1,0,0,0,364,
        365,5,25,0,0,365,31,1,0,0,0,366,367,5,26,0,0,367,368,5,67,0,0,368,
        370,5,57,0,0,369,371,3,34,17,0,370,369,1,0,0,0,370,371,1,0,0,0,371,
        372,1,0,0,0,372,373,5,58,0,0,373,374,5,28,0,0,374,376,3,8,4,0,375,
        377,5,68,0,0,376,375,1,0,0,0,377,378,1,0,0,0,378,376,1,0,0,0,378,
        379,1,0,0,0,379,380,1,0,0,0,380,382,3,44,22,0,381,383,5,68,0,0,382,
        381,1,0,0,0,383,384,1,0,0,0,384,382,1,0,0,0,384,385,1,0,0,0,385,
        386,1,0,0,0,386,387,5,27,0,0,387,33,1,0,0,0,388,393,3,36,18,0,389,
        390,5,61,0,0,390,392,3,36,18,0,391,389,1,0,0,0,392,395,1,0,0,0,393,
        391,1,0,0,0,393,394,1,0,0,0,394,35,1,0,0,0,395,393,1,0,0,0,396,397,
        5,67,0,0,397,398,5,62,0,0,398,399,3,8,4,0,399,37,1,0,0,0,400,401,
        5,30,0,0,401,402,5,67,0,0,402,404,5,57,0,0,403,405,3,42,21,0,404,
        403,1,0,0,0,404,405,1,0,0,0,405,406,1,0,0,0,406,407,5,58,0,0,407,
        39,1,0,0,0,408,409,5,29,0,0,409,410,3,46,23,0,410,41,1,0,0,0,411,
        416,3,46,23,0,412,413,5,61,0,0,413,415,3,46,23,0,414,412,1,0,0,0,
        415,418,1,0,0,0,416,414,1,0,0,0,416,417,1,0,0,0,417,43,1,0,0,0,418,
        416,1,0,0,0,419,428,3,2,1,0,420,422,5,68,0,0,421,420,1,0,0,0,422,
        423,1,0,0,0,423,421,1,0,0,0,423,424,1,0,0,0,424,425,1,0,0,0,425,
        427,3,2,1,0,426,421,1,0,0,0,427,430,1,0,0,0,428,426,1,0,0,0,428,
        429,1,0,0,0,429,45,1,0,0,0,430,428,1,0,0,0,431,432,6,23,-1,0,432,
        433,5,34,0,0,433,438,3,46,23,10,434,435,5,52,0,0,435,438,3,46,23,
        9,436,438,3,48,24,0,437,431,1,0,0,0,437,434,1,0,0,0,437,436,1,0,
        0,0,438,462,1,0,0,0,439,440,10,8,0,0,440,441,5,55,0,0,441,461,3,
        46,23,8,442,443,10,7,0,0,443,444,7,2,0,0,444,461,3,46,23,8,445,446,
        10,6,0,0,446,447,7,3,0,0,447,461,3,46,23,7,448,449,10,5,0,0,449,
        450,5,56,0,0,450,461,3,46,23,6,451,452,10,4,0,0,452,453,7,4,0,0,
        453,461,3,46,23,5,454,455,10,3,0,0,455,456,5,32,0,0,456,461,3,46,
        23,4,457,458,10,2,0,0,458,459,5,33,0,0,459,461,3,46,23,3,460,439,
        1,0,0,0,460,442,1,0,0,0,460,445,1,0,0,0,460,448,1,0,0,0,460,451,
        1,0,0,0,460,454,1,0,0,0,460,457,1,0,0,0,461,464,1,0,0,0,462,460,
        1,0,0,0,462,463,1,0,0,0,463,47,1,0,0,0,464,462,1,0,0,0,465,466,5,
        57,0,0,466,467,3,46,23,0,467,468,5,58,0,0,468,495,1,0,0,0,469,470,
        5,67,0,0,470,472,5,57,0,0,471,473,3,42,21,0,472,471,1,0,0,0,472,
        473,1,0,0,0,473,474,1,0,0,0,474,495,5,58,0,0,475,476,5,67,0,0,476,
        477,5,59,0,0,477,478,3,46,23,0,478,479,5,60,0,0,479,495,1,0,0,0,
        480,481,5,67,0,0,481,482,5,59,0,0,482,483,3,46,23,0,483,484,5,61,
        0,0,484,485,3,46,23,0,485,486,5,60,0,0,486,495,1,0,0,0,487,495,5,
        67,0,0,488,495,5,64,0,0,489,495,5,63,0,0,490,495,5,65,0,0,491,495,
        5,66,0,0,492,495,5,35,0,0,493,495,5,36,0,0,494,465,1,0,0,0,494,469,
        1,0,0,0,494,475,1,0,0,0,494,480,1,0,0,0,494,487,1,0,0,0,494,488,
        1,0,0,0,494,489,1,0,0,0,494,490,1,0,0,0,494,491,1,0,0,0,494,492,
        1,0,0,0,494,493,1,0,0,0,495,49,1,0,0,0,49,53,60,65,68,73,92,126,
        173,183,193,202,208,216,222,228,234,237,242,252,257,264,270,272,
        281,287,297,302,308,316,321,327,335,341,350,356,362,370,378,384,
        393,404,416,423,428,437,460,462,472,494
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
    public IDENTIFIER(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.IDENTIFIER, 0)!;
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
    public EQUALS(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.EQUALS, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
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
    public EQUALS(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.EQUALS, 0)!;
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
