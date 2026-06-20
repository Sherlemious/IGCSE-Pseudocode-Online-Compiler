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
    public static readonly RANDOM = 46;
    public static readonly SEEK = 47;
    public static readonly GETRECORD = 48;
    public static readonly PUTRECORD = 49;
    public static readonly TYPE = 50;
    public static readonly ENDTYPE = 51;
    public static readonly SET = 52;
    public static readonly DEFINE = 53;
    public static readonly BYREF = 54;
    public static readonly BYVAL = 55;
    public static readonly CLASS = 56;
    public static readonly ENDCLASS = 57;
    public static readonly INHERITS = 58;
    public static readonly PUBLIC = 59;
    public static readonly PRIVATE = 60;
    public static readonly NEW = 61;
    public static readonly SUPER = 62;
    public static readonly INTEGER_TYPE = 63;
    public static readonly REAL_TYPE = 64;
    public static readonly CHAR_TYPE = 65;
    public static readonly STRING_TYPE = 66;
    public static readonly BOOLEAN_TYPE = 67;
    public static readonly DATE_TYPE = 68;
    public static readonly LARROW = 69;
    public static readonly EQUALS = 70;
    public static readonly NOTEQUAL = 71;
    public static readonly LTE = 72;
    public static readonly GTE = 73;
    public static readonly LT = 74;
    public static readonly GT = 75;
    public static readonly PLUS = 76;
    public static readonly MINUS = 77;
    public static readonly STAR = 78;
    public static readonly SLASH = 79;
    public static readonly CARET = 80;
    public static readonly AMPERSAND = 81;
    public static readonly LPAREN = 82;
    public static readonly RPAREN = 83;
    public static readonly LBRACKET = 84;
    public static readonly RBRACKET = 85;
    public static readonly COMMA = 86;
    public static readonly COLON = 87;
    public static readonly DOT = 88;
    public static readonly DATE_LITERAL = 89;
    public static readonly REAL_LITERAL = 90;
    public static readonly INTEGER_LITERAL = 91;
    public static readonly STRING_LITERAL = 92;
    public static readonly CHAR_LITERAL = 93;
    public static readonly IDENTIFIER = 94;
    public static readonly NEWLINE = 95;
    public static readonly WS = 96;
    public static readonly LINE_COMMENT = 97;
    public static readonly RULE_program = 0;
    public static readonly RULE_statement = 1;
    public static readonly RULE_declareStatement = 2;
    public static readonly RULE_identifierList = 3;
    public static readonly RULE_identifier = 4;
    public static readonly RULE_constantStatement = 5;
    public static readonly RULE_dataType = 6;
    public static readonly RULE_typeDefinition = 7;
    public static readonly RULE_defineStatement = 8;
    public static readonly RULE_classDeclaration = 9;
    public static readonly RULE_classMember = 10;
    public static readonly RULE_designator = 11;
    public static readonly RULE_designatorPart = 12;
    public static readonly RULE_memberName = 13;
    public static readonly RULE_assignmentStatement = 14;
    public static readonly RULE_singleAssignment = 15;
    public static readonly RULE_inputStatement = 16;
    public static readonly RULE_outputStatement = 17;
    public static readonly RULE_exprList = 18;
    public static readonly RULE_ifStatement = 19;
    public static readonly RULE_caseStatement = 20;
    public static readonly RULE_caseClause = 21;
    public static readonly RULE_caseLabel = 22;
    public static readonly RULE_forStatement = 23;
    public static readonly RULE_whileStatement = 24;
    public static readonly RULE_repeatStatement = 25;
    public static readonly RULE_procedureDeclaration = 26;
    public static readonly RULE_functionDeclaration = 27;
    public static readonly RULE_paramList = 28;
    public static readonly RULE_param = 29;
    public static readonly RULE_callStatement = 30;
    public static readonly RULE_methodCall = 31;
    public static readonly RULE_methodCallStatement = 32;
    public static readonly RULE_returnStatement = 33;
    public static readonly RULE_openFileStatement = 34;
    public static readonly RULE_readFileStatement = 35;
    public static readonly RULE_writeFileStatement = 36;
    public static readonly RULE_closeFileStatement = 37;
    public static readonly RULE_seekStatement = 38;
    public static readonly RULE_getRecordStatement = 39;
    public static readonly RULE_putRecordStatement = 40;
    public static readonly RULE_fileMode = 41;
    public static readonly RULE_argList = 42;
    public static readonly RULE_block = 43;
    public static readonly RULE_expr = 44;
    public static readonly RULE_atom = 45;

    public static readonly literalNames = [
        null, null, null, null, null, null, null, null, null, null, null, 
        null, null, null, null, null, null, null, null, null, null, null, 
        null, null, null, null, null, null, null, null, null, null, null, 
        null, null, null, null, null, null, null, null, null, null, null, 
        null, null, null, null, null, null, null, null, null, null, null, 
        null, null, null, null, null, null, null, null, null, null, null, 
        null, null, null, null, "'='", "'<>'", "'<='", "'>='", "'<'", "'>'", 
        "'+'", "'-'", "'*'", "'/'", "'^'", "'&'", "'('", "')'", "'['", "']'", 
        "','", "':'", "'.'"
    ];

    public static readonly symbolicNames = [
        null, "DECLARE", "CONSTANT", "INPUT", "OUTPUT", "PRINT", "IF", "THEN", 
        "ELSE", "ELSEIF", "ENDIF", "CASE", "OF", "OTHERWISE", "ENDCASE", 
        "FOR", "TO", "STEP", "NEXT", "WHILE", "DO", "ENDWHILE", "REPEAT", 
        "UNTIL", "PROCEDURE", "ENDPROCEDURE", "FUNCTION", "ENDFUNCTION", 
        "RETURNS", "RETURN", "CALL", "ARRAY", "AND", "OR", "NOT", "TRUE", 
        "FALSE", "MOD", "DIV", "OPENFILE", "READFILE", "WRITEFILE", "CLOSEFILE", 
        "READ_MODE", "WRITE_MODE", "APPEND_MODE", "RANDOM", "SEEK", "GETRECORD", 
        "PUTRECORD", "TYPE", "ENDTYPE", "SET", "DEFINE", "BYREF", "BYVAL", 
        "CLASS", "ENDCLASS", "INHERITS", "PUBLIC", "PRIVATE", "NEW", "SUPER", 
        "INTEGER_TYPE", "REAL_TYPE", "CHAR_TYPE", "STRING_TYPE", "BOOLEAN_TYPE", 
        "DATE_TYPE", "LARROW", "EQUALS", "NOTEQUAL", "LTE", "GTE", "LT", 
        "GT", "PLUS", "MINUS", "STAR", "SLASH", "CARET", "AMPERSAND", "LPAREN", 
        "RPAREN", "LBRACKET", "RBRACKET", "COMMA", "COLON", "DOT", "DATE_LITERAL", 
        "REAL_LITERAL", "INTEGER_LITERAL", "STRING_LITERAL", "CHAR_LITERAL", 
        "IDENTIFIER", "NEWLINE", "WS", "LINE_COMMENT"
    ];
    public static readonly ruleNames = [
        "program", "statement", "declareStatement", "identifierList", "identifier", 
        "constantStatement", "dataType", "typeDefinition", "defineStatement", 
        "classDeclaration", "classMember", "designator", "designatorPart", 
        "memberName", "assignmentStatement", "singleAssignment", "inputStatement", 
        "outputStatement", "exprList", "ifStatement", "caseStatement", "caseClause", 
        "caseLabel", "forStatement", "whileStatement", "repeatStatement", 
        "procedureDeclaration", "functionDeclaration", "paramList", "param", 
        "callStatement", "methodCall", "methodCallStatement", "returnStatement", 
        "openFileStatement", "readFileStatement", "writeFileStatement", 
        "closeFileStatement", "seekStatement", "getRecordStatement", "putRecordStatement", 
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
            this.state = 95;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 0, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 92;
                    this.match(PseudocodeParser.NEWLINE);
                    }
                    }
                }
                this.state = 97;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 0, this.context);
            }
            this.state = 111;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 1699252350) !== 0) || ((((_la - 39)) & ~0x1F) === 0 && ((1 << (_la - 39)) & 553381775) !== 0) || _la === 94) {
                {
                this.state = 98;
                this.statement();
                this.state = 108;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 2, this.context);
                while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                    if (alternative === 1) {
                        {
                        {
                        this.state = 102;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                        while (_la === 95) {
                            {
                            {
                            this.state = 99;
                            this.match(PseudocodeParser.NEWLINE);
                            }
                            }
                            this.state = 104;
                            this.errorHandler.sync(this);
                            _la = this.tokenStream.LA(1);
                        }
                        this.state = 105;
                        this.statement();
                        }
                        }
                    }
                    this.state = 110;
                    this.errorHandler.sync(this);
                    alternative = this.interpreter.adaptivePredict(this.tokenStream, 2, this.context);
                }
                }
            }

            this.state = 116;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 95) {
                {
                {
                this.state = 113;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 118;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 119;
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
            this.state = 146;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 5, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 121;
                this.declareStatement();
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 122;
                this.constantStatement();
                }
                break;
            case 3:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 123;
                this.typeDefinition();
                }
                break;
            case 4:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 124;
                this.defineStatement();
                }
                break;
            case 5:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 125;
                this.classDeclaration();
                }
                break;
            case 6:
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 126;
                this.assignmentStatement();
                }
                break;
            case 7:
                this.enterOuterAlt(localContext, 7);
                {
                this.state = 127;
                this.inputStatement();
                }
                break;
            case 8:
                this.enterOuterAlt(localContext, 8);
                {
                this.state = 128;
                this.outputStatement();
                }
                break;
            case 9:
                this.enterOuterAlt(localContext, 9);
                {
                this.state = 129;
                this.ifStatement();
                }
                break;
            case 10:
                this.enterOuterAlt(localContext, 10);
                {
                this.state = 130;
                this.caseStatement();
                }
                break;
            case 11:
                this.enterOuterAlt(localContext, 11);
                {
                this.state = 131;
                this.forStatement();
                }
                break;
            case 12:
                this.enterOuterAlt(localContext, 12);
                {
                this.state = 132;
                this.whileStatement();
                }
                break;
            case 13:
                this.enterOuterAlt(localContext, 13);
                {
                this.state = 133;
                this.repeatStatement();
                }
                break;
            case 14:
                this.enterOuterAlt(localContext, 14);
                {
                this.state = 134;
                this.procedureDeclaration();
                }
                break;
            case 15:
                this.enterOuterAlt(localContext, 15);
                {
                this.state = 135;
                this.functionDeclaration();
                }
                break;
            case 16:
                this.enterOuterAlt(localContext, 16);
                {
                this.state = 136;
                this.callStatement();
                }
                break;
            case 17:
                this.enterOuterAlt(localContext, 17);
                {
                this.state = 137;
                this.methodCallStatement();
                }
                break;
            case 18:
                this.enterOuterAlt(localContext, 18);
                {
                this.state = 138;
                this.returnStatement();
                }
                break;
            case 19:
                this.enterOuterAlt(localContext, 19);
                {
                this.state = 139;
                this.openFileStatement();
                }
                break;
            case 20:
                this.enterOuterAlt(localContext, 20);
                {
                this.state = 140;
                this.readFileStatement();
                }
                break;
            case 21:
                this.enterOuterAlt(localContext, 21);
                {
                this.state = 141;
                this.writeFileStatement();
                }
                break;
            case 22:
                this.enterOuterAlt(localContext, 22);
                {
                this.state = 142;
                this.closeFileStatement();
                }
                break;
            case 23:
                this.enterOuterAlt(localContext, 23);
                {
                this.state = 143;
                this.seekStatement();
                }
                break;
            case 24:
                this.enterOuterAlt(localContext, 24);
                {
                this.state = 144;
                this.getRecordStatement();
                }
                break;
            case 25:
                this.enterOuterAlt(localContext, 25);
                {
                this.state = 145;
                this.putRecordStatement();
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
    public declareStatement(): DeclareStatementContext {
        let localContext = new DeclareStatementContext(this.context, this.state);
        this.enterRule(localContext, 4, PseudocodeParser.RULE_declareStatement);
        try {
            this.state = 181;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 6, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 148;
                this.match(PseudocodeParser.DECLARE);
                this.state = 149;
                this.identifierList();
                this.state = 150;
                this.match(PseudocodeParser.COLON);
                this.state = 151;
                this.match(PseudocodeParser.ARRAY);
                this.state = 152;
                this.match(PseudocodeParser.LBRACKET);
                this.state = 153;
                this.expr(0);
                this.state = 154;
                this.match(PseudocodeParser.COLON);
                this.state = 155;
                this.expr(0);
                this.state = 156;
                this.match(PseudocodeParser.RBRACKET);
                this.state = 157;
                this.match(PseudocodeParser.OF);
                this.state = 158;
                this.dataType();
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 160;
                this.match(PseudocodeParser.DECLARE);
                this.state = 161;
                this.identifier();
                this.state = 162;
                this.match(PseudocodeParser.COLON);
                this.state = 163;
                this.match(PseudocodeParser.ARRAY);
                this.state = 164;
                this.match(PseudocodeParser.LBRACKET);
                this.state = 165;
                this.expr(0);
                this.state = 166;
                this.match(PseudocodeParser.COLON);
                this.state = 167;
                this.expr(0);
                this.state = 168;
                this.match(PseudocodeParser.COMMA);
                this.state = 169;
                this.expr(0);
                this.state = 170;
                this.match(PseudocodeParser.COLON);
                this.state = 171;
                this.expr(0);
                this.state = 172;
                this.match(PseudocodeParser.RBRACKET);
                this.state = 173;
                this.match(PseudocodeParser.OF);
                this.state = 174;
                this.dataType();
                }
                break;
            case 3:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 176;
                this.match(PseudocodeParser.DECLARE);
                this.state = 177;
                this.identifierList();
                this.state = 178;
                this.match(PseudocodeParser.COLON);
                this.state = 179;
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
            this.state = 183;
            this.identifier();
            this.state = 188;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 86) {
                {
                {
                this.state = 184;
                this.match(PseudocodeParser.COMMA);
                this.state = 185;
                this.identifier();
                }
                }
                this.state = 190;
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
    public identifier(): IdentifierContext {
        let localContext = new IdentifierContext(this.context, this.state);
        this.enterRule(localContext, 8, PseudocodeParser.RULE_identifier);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 191;
            _la = this.tokenStream.LA(1);
            if(!(((((_la - 46)) & ~0x1F) === 0 && ((1 << (_la - 46)) & 4257759) !== 0) || _la === 94)) {
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
    public constantStatement(): ConstantStatementContext {
        let localContext = new ConstantStatementContext(this.context, this.state);
        this.enterRule(localContext, 10, PseudocodeParser.RULE_constantStatement);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 193;
            this.match(PseudocodeParser.CONSTANT);
            this.state = 194;
            this.identifier();
            this.state = 195;
            _la = this.tokenStream.LA(1);
            if(!(_la === 69 || _la === 70)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            this.state = 196;
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
        this.enterRule(localContext, 12, PseudocodeParser.RULE_dataType);
        let _la: number;
        try {
            this.state = 223;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case PseudocodeParser.INTEGER_TYPE:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 198;
                this.match(PseudocodeParser.INTEGER_TYPE);
                }
                break;
            case PseudocodeParser.REAL_TYPE:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 199;
                this.match(PseudocodeParser.REAL_TYPE);
                }
                break;
            case PseudocodeParser.CHAR_TYPE:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 200;
                this.match(PseudocodeParser.CHAR_TYPE);
                }
                break;
            case PseudocodeParser.STRING_TYPE:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 201;
                this.match(PseudocodeParser.STRING_TYPE);
                }
                break;
            case PseudocodeParser.BOOLEAN_TYPE:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 202;
                this.match(PseudocodeParser.BOOLEAN_TYPE);
                }
                break;
            case PseudocodeParser.DATE_TYPE:
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 203;
                this.match(PseudocodeParser.DATE_TYPE);
                }
                break;
            case PseudocodeParser.ARRAY:
                this.enterOuterAlt(localContext, 7);
                {
                this.state = 204;
                this.match(PseudocodeParser.ARRAY);
                this.state = 218;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 84) {
                    {
                    this.state = 205;
                    this.match(PseudocodeParser.LBRACKET);
                    this.state = 206;
                    this.expr(0);
                    this.state = 207;
                    this.match(PseudocodeParser.COLON);
                    this.state = 208;
                    this.expr(0);
                    this.state = 214;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    if (_la === 86) {
                        {
                        this.state = 209;
                        this.match(PseudocodeParser.COMMA);
                        this.state = 210;
                        this.expr(0);
                        this.state = 211;
                        this.match(PseudocodeParser.COLON);
                        this.state = 212;
                        this.expr(0);
                        }
                    }

                    this.state = 216;
                    this.match(PseudocodeParser.RBRACKET);
                    }
                }

                this.state = 220;
                this.match(PseudocodeParser.OF);
                this.state = 221;
                this.dataType();
                }
                break;
            case PseudocodeParser.IDENTIFIER:
                this.enterOuterAlt(localContext, 8);
                {
                this.state = 222;
                this.match(PseudocodeParser.IDENTIFIER);
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
    public typeDefinition(): TypeDefinitionContext {
        let localContext = new TypeDefinitionContext(this.context, this.state);
        this.enterRule(localContext, 14, PseudocodeParser.RULE_typeDefinition);
        let _la: number;
        try {
            this.state = 262;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 14, this.context) ) {
            case 1:
                localContext = new EnumTypeDefContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 225;
                this.match(PseudocodeParser.TYPE);
                this.state = 226;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 227;
                this.match(PseudocodeParser.EQUALS);
                this.state = 228;
                this.match(PseudocodeParser.LPAREN);
                this.state = 229;
                this.identifierList();
                this.state = 230;
                this.match(PseudocodeParser.RPAREN);
                }
                break;
            case 2:
                localContext = new PointerTypeDefContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 232;
                this.match(PseudocodeParser.TYPE);
                this.state = 233;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 234;
                this.match(PseudocodeParser.EQUALS);
                this.state = 235;
                this.match(PseudocodeParser.CARET);
                this.state = 236;
                this.dataType();
                }
                break;
            case 3:
                localContext = new SetTypeDefContext(localContext);
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 237;
                this.match(PseudocodeParser.TYPE);
                this.state = 238;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 239;
                this.match(PseudocodeParser.EQUALS);
                this.state = 240;
                this.match(PseudocodeParser.SET);
                this.state = 241;
                this.match(PseudocodeParser.OF);
                this.state = 242;
                this.dataType();
                }
                break;
            case 4:
                localContext = new RecordTypeDefContext(localContext);
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 243;
                this.match(PseudocodeParser.TYPE);
                this.state = 244;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 246;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                do {
                    {
                    {
                    this.state = 245;
                    this.match(PseudocodeParser.NEWLINE);
                    }
                    }
                    this.state = 248;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                } while (_la === 95);
                this.state = 258;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 1) {
                    {
                    {
                    this.state = 250;
                    this.declareStatement();
                    this.state = 252;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    do {
                        {
                        {
                        this.state = 251;
                        this.match(PseudocodeParser.NEWLINE);
                        }
                        }
                        this.state = 254;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                    } while (_la === 95);
                    }
                    }
                    this.state = 260;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 261;
                this.match(PseudocodeParser.ENDTYPE);
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
    public defineStatement(): DefineStatementContext {
        let localContext = new DefineStatementContext(this.context, this.state);
        this.enterRule(localContext, 16, PseudocodeParser.RULE_defineStatement);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 264;
            this.match(PseudocodeParser.DEFINE);
            this.state = 265;
            this.identifier();
            this.state = 266;
            this.match(PseudocodeParser.LPAREN);
            this.state = 268;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & 528347167) !== 0) || ((((_la - 68)) & ~0x1F) === 0 && ((1 << (_la - 68)) & 132141569) !== 0)) {
                {
                this.state = 267;
                this.exprList();
                }
            }

            this.state = 270;
            this.match(PseudocodeParser.RPAREN);
            this.state = 271;
            this.match(PseudocodeParser.COLON);
            this.state = 272;
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
    public classDeclaration(): ClassDeclarationContext {
        let localContext = new ClassDeclarationContext(this.context, this.state);
        this.enterRule(localContext, 18, PseudocodeParser.RULE_classDeclaration);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 274;
            this.match(PseudocodeParser.CLASS);
            this.state = 275;
            this.match(PseudocodeParser.IDENTIFIER);
            this.state = 278;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 58) {
                {
                this.state = 276;
                this.match(PseudocodeParser.INHERITS);
                this.state = 277;
                this.match(PseudocodeParser.IDENTIFIER);
                }
            }

            this.state = 281;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 280;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 283;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 95);
            this.state = 293;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 83886082) !== 0) || ((((_la - 46)) & ~0x1F) === 0 && ((1 << (_la - 46)) & 4257759) !== 0) || _la === 94) {
                {
                {
                this.state = 285;
                this.classMember();
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
                } while (_la === 95);
                }
                }
                this.state = 295;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 296;
            this.match(PseudocodeParser.ENDCLASS);
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
    public classMember(): ClassMemberContext {
        let localContext = new ClassMemberContext(this.context, this.state);
        this.enterRule(localContext, 20, PseudocodeParser.RULE_classMember);
        let _la: number;
        try {
            this.state = 316;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 24, this.context) ) {
            case 1:
                localContext = new ClassFieldMemberContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 299;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 20, this.context) ) {
                case 1:
                    {
                    this.state = 298;
                    _la = this.tokenStream.LA(1);
                    if(!(_la === 59 || _la === 60)) {
                    this.errorHandler.recoverInline(this);
                    }
                    else {
                        this.errorHandler.reportMatch(this);
                        this.consume();
                    }
                    }
                    break;
                }
                this.state = 302;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 1) {
                    {
                    this.state = 301;
                    this.match(PseudocodeParser.DECLARE);
                    }
                }

                this.state = 304;
                this.identifierList();
                this.state = 305;
                this.match(PseudocodeParser.COLON);
                this.state = 306;
                this.dataType();
                }
                break;
            case 2:
                localContext = new ClassProcMemberContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 309;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 59 || _la === 60) {
                    {
                    this.state = 308;
                    _la = this.tokenStream.LA(1);
                    if(!(_la === 59 || _la === 60)) {
                    this.errorHandler.recoverInline(this);
                    }
                    else {
                        this.errorHandler.reportMatch(this);
                        this.consume();
                    }
                    }
                }

                this.state = 311;
                this.procedureDeclaration();
                }
                break;
            case 3:
                localContext = new ClassFuncMemberContext(localContext);
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 313;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 59 || _la === 60) {
                    {
                    this.state = 312;
                    _la = this.tokenStream.LA(1);
                    if(!(_la === 59 || _la === 60)) {
                    this.errorHandler.recoverInline(this);
                    }
                    else {
                        this.errorHandler.reportMatch(this);
                        this.consume();
                    }
                    }
                }

                this.state = 315;
                this.functionDeclaration();
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
    public designator(): DesignatorContext {
        let localContext = new DesignatorContext(this.context, this.state);
        this.enterRule(localContext, 22, PseudocodeParser.RULE_designator);
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 320;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case PseudocodeParser.RANDOM:
            case PseudocodeParser.SEEK:
            case PseudocodeParser.GETRECORD:
            case PseudocodeParser.PUTRECORD:
            case PseudocodeParser.TYPE:
            case PseudocodeParser.SET:
            case PseudocodeParser.DEFINE:
            case PseudocodeParser.BYREF:
            case PseudocodeParser.BYVAL:
            case PseudocodeParser.CLASS:
            case PseudocodeParser.INHERITS:
            case PseudocodeParser.PUBLIC:
            case PseudocodeParser.PRIVATE:
            case PseudocodeParser.NEW:
            case PseudocodeParser.DATE_TYPE:
            case PseudocodeParser.IDENTIFIER:
                {
                this.state = 318;
                this.identifier();
                }
                break;
            case PseudocodeParser.SUPER:
                {
                this.state = 319;
                this.match(PseudocodeParser.SUPER);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
            this.state = 325;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 26, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 322;
                    this.designatorPart();
                    }
                    }
                }
                this.state = 327;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 26, this.context);
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
    public designatorPart(): DesignatorPartContext {
        let localContext = new DesignatorPartContext(this.context, this.state);
        this.enterRule(localContext, 24, PseudocodeParser.RULE_designatorPart);
        let _la: number;
        try {
            this.state = 349;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case PseudocodeParser.LBRACKET:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 328;
                this.match(PseudocodeParser.LBRACKET);
                this.state = 329;
                this.expr(0);
                this.state = 334;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 86) {
                    {
                    {
                    this.state = 330;
                    this.match(PseudocodeParser.COMMA);
                    this.state = 331;
                    this.expr(0);
                    }
                    }
                    this.state = 336;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 337;
                this.match(PseudocodeParser.RBRACKET);
                }
                break;
            case PseudocodeParser.DOT:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 339;
                this.match(PseudocodeParser.DOT);
                this.state = 340;
                this.memberName();
                this.state = 346;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 29, this.context) ) {
                case 1:
                    {
                    this.state = 341;
                    this.match(PseudocodeParser.LPAREN);
                    this.state = 343;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    if (((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & 528347167) !== 0) || ((((_la - 68)) & ~0x1F) === 0 && ((1 << (_la - 68)) & 132141569) !== 0)) {
                        {
                        this.state = 342;
                        this.argList();
                        }
                    }

                    this.state = 345;
                    this.match(PseudocodeParser.RPAREN);
                    }
                    break;
                }
                }
                break;
            case PseudocodeParser.CARET:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 348;
                this.match(PseudocodeParser.CARET);
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
    public memberName(): MemberNameContext {
        let localContext = new MemberNameContext(this.context, this.state);
        this.enterRule(localContext, 26, PseudocodeParser.RULE_memberName);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 351;
            this.identifier();
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
        this.enterRule(localContext, 28, PseudocodeParser.RULE_assignmentStatement);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 353;
            this.singleAssignment();
            this.state = 358;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 86) {
                {
                {
                this.state = 354;
                this.match(PseudocodeParser.COMMA);
                this.state = 355;
                this.singleAssignment();
                }
                }
                this.state = 360;
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
    public singleAssignment(): SingleAssignmentContext {
        let localContext = new SingleAssignmentContext(this.context, this.state);
        this.enterRule(localContext, 30, PseudocodeParser.RULE_singleAssignment);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 361;
            this.designator();
            this.state = 362;
            _la = this.tokenStream.LA(1);
            if(!(_la === 69 || _la === 70)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            this.state = 363;
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
    public inputStatement(): InputStatementContext {
        let localContext = new InputStatementContext(this.context, this.state);
        this.enterRule(localContext, 32, PseudocodeParser.RULE_inputStatement);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 365;
            this.match(PseudocodeParser.INPUT);
            this.state = 366;
            this.designator();
            this.state = 369;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 86) {
                {
                this.state = 367;
                this.match(PseudocodeParser.COMMA);
                this.state = 368;
                this.match(PseudocodeParser.STRING_LITERAL);
                }
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
    public outputStatement(): OutputStatementContext {
        let localContext = new OutputStatementContext(this.context, this.state);
        this.enterRule(localContext, 34, PseudocodeParser.RULE_outputStatement);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 371;
            _la = this.tokenStream.LA(1);
            if(!(_la === 4 || _la === 5)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            this.state = 372;
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
        this.enterRule(localContext, 36, PseudocodeParser.RULE_exprList);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 374;
            this.expr(0);
            this.state = 379;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 86) {
                {
                {
                this.state = 375;
                this.match(PseudocodeParser.COMMA);
                this.state = 376;
                this.expr(0);
                }
                }
                this.state = 381;
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
        this.enterRule(localContext, 38, PseudocodeParser.RULE_ifStatement);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 382;
            this.match(PseudocodeParser.IF);
            this.state = 383;
            this.expr(0);
            this.state = 387;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 34, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 384;
                    this.match(PseudocodeParser.NEWLINE);
                    }
                    }
                }
                this.state = 389;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 34, this.context);
            }
            this.state = 391;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 7) {
                {
                this.state = 390;
                this.match(PseudocodeParser.THEN);
                }
            }

            this.state = 396;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 36, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 393;
                    this.match(PseudocodeParser.NEWLINE);
                    }
                    }
                }
                this.state = 398;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 36, this.context);
            }
            this.state = 399;
            this.block();
            this.state = 431;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 42, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 403;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    while (_la === 95) {
                        {
                        {
                        this.state = 400;
                        this.match(PseudocodeParser.NEWLINE);
                        }
                        }
                        this.state = 405;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                    }
                    this.state = 409;
                    this.errorHandler.sync(this);
                    switch (this.tokenStream.LA(1)) {
                    case PseudocodeParser.ELSEIF:
                        {
                        this.state = 406;
                        this.match(PseudocodeParser.ELSEIF);
                        }
                        break;
                    case PseudocodeParser.ELSE:
                        {
                        this.state = 407;
                        this.match(PseudocodeParser.ELSE);
                        this.state = 408;
                        this.match(PseudocodeParser.IF);
                        }
                        break;
                    default:
                        throw new antlr.NoViableAltException(this);
                    }
                    this.state = 411;
                    this.expr(0);
                    this.state = 415;
                    this.errorHandler.sync(this);
                    alternative = this.interpreter.adaptivePredict(this.tokenStream, 39, this.context);
                    while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                        if (alternative === 1) {
                            {
                            {
                            this.state = 412;
                            this.match(PseudocodeParser.NEWLINE);
                            }
                            }
                        }
                        this.state = 417;
                        this.errorHandler.sync(this);
                        alternative = this.interpreter.adaptivePredict(this.tokenStream, 39, this.context);
                    }
                    this.state = 419;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    if (_la === 7) {
                        {
                        this.state = 418;
                        this.match(PseudocodeParser.THEN);
                        }
                    }

                    this.state = 424;
                    this.errorHandler.sync(this);
                    alternative = this.interpreter.adaptivePredict(this.tokenStream, 41, this.context);
                    while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                        if (alternative === 1) {
                            {
                            {
                            this.state = 421;
                            this.match(PseudocodeParser.NEWLINE);
                            }
                            }
                        }
                        this.state = 426;
                        this.errorHandler.sync(this);
                        alternative = this.interpreter.adaptivePredict(this.tokenStream, 41, this.context);
                    }
                    this.state = 427;
                    this.block();
                    }
                    }
                }
                this.state = 433;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 42, this.context);
            }
            this.state = 448;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 45, this.context) ) {
            case 1:
                {
                this.state = 437;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 95) {
                    {
                    {
                    this.state = 434;
                    this.match(PseudocodeParser.NEWLINE);
                    }
                    }
                    this.state = 439;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 440;
                this.match(PseudocodeParser.ELSE);
                this.state = 444;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 44, this.context);
                while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                    if (alternative === 1) {
                        {
                        {
                        this.state = 441;
                        this.match(PseudocodeParser.NEWLINE);
                        }
                        }
                    }
                    this.state = 446;
                    this.errorHandler.sync(this);
                    alternative = this.interpreter.adaptivePredict(this.tokenStream, 44, this.context);
                }
                this.state = 447;
                this.block();
                }
                break;
            }
            this.state = 453;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 95) {
                {
                {
                this.state = 450;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 455;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 456;
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
        this.enterRule(localContext, 40, PseudocodeParser.RULE_caseStatement);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 458;
            this.match(PseudocodeParser.CASE);
            this.state = 459;
            this.match(PseudocodeParser.OF);
            this.state = 460;
            this.designator();
            this.state = 464;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 95) {
                {
                {
                this.state = 461;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 466;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 468;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 467;
                this.caseClause();
                }
                }
                this.state = 470;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & 528347167) !== 0) || ((((_la - 68)) & ~0x1F) === 0 && ((1 << (_la - 68)) & 132141569) !== 0));
            this.state = 489;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 13) {
                {
                this.state = 472;
                this.match(PseudocodeParser.OTHERWISE);
                this.state = 474;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 87) {
                    {
                    this.state = 473;
                    this.match(PseudocodeParser.COLON);
                    }
                }

                this.state = 479;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 50, this.context);
                while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                    if (alternative === 1) {
                        {
                        {
                        this.state = 476;
                        this.match(PseudocodeParser.NEWLINE);
                        }
                        }
                    }
                    this.state = 481;
                    this.errorHandler.sync(this);
                    alternative = this.interpreter.adaptivePredict(this.tokenStream, 50, this.context);
                }
                this.state = 482;
                this.block();
                this.state = 486;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 51, this.context);
                while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                    if (alternative === 1) {
                        {
                        {
                        this.state = 483;
                        this.match(PseudocodeParser.NEWLINE);
                        }
                        }
                    }
                    this.state = 488;
                    this.errorHandler.sync(this);
                    alternative = this.interpreter.adaptivePredict(this.tokenStream, 51, this.context);
                }
                }
            }

            this.state = 494;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 95) {
                {
                {
                this.state = 491;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 496;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 497;
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
        this.enterRule(localContext, 42, PseudocodeParser.RULE_caseClause);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 499;
            this.caseLabel();
            this.state = 504;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 86) {
                {
                {
                this.state = 500;
                this.match(PseudocodeParser.COMMA);
                this.state = 501;
                this.caseLabel();
                }
                }
                this.state = 506;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 507;
            this.match(PseudocodeParser.COLON);
            this.state = 511;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 55, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 508;
                    this.match(PseudocodeParser.NEWLINE);
                    }
                    }
                }
                this.state = 513;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 55, this.context);
            }
            this.state = 514;
            this.block();
            this.state = 518;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 56, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 515;
                    this.match(PseudocodeParser.NEWLINE);
                    }
                    }
                }
                this.state = 520;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 56, this.context);
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
    public caseLabel(): CaseLabelContext {
        let localContext = new CaseLabelContext(this.context, this.state);
        this.enterRule(localContext, 44, PseudocodeParser.RULE_caseLabel);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 521;
            this.expr(0);
            this.state = 524;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 16) {
                {
                this.state = 522;
                this.match(PseudocodeParser.TO);
                this.state = 523;
                this.expr(0);
                }
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
        this.enterRule(localContext, 46, PseudocodeParser.RULE_forStatement);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 526;
            this.match(PseudocodeParser.FOR);
            this.state = 527;
            this.identifier();
            this.state = 528;
            _la = this.tokenStream.LA(1);
            if(!(_la === 69 || _la === 70)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            this.state = 529;
            this.expr(0);
            this.state = 530;
            this.match(PseudocodeParser.TO);
            this.state = 531;
            this.expr(0);
            this.state = 534;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 17) {
                {
                this.state = 532;
                this.match(PseudocodeParser.STEP);
                this.state = 533;
                this.expr(0);
                }
            }

            this.state = 539;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 59, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 536;
                    this.match(PseudocodeParser.NEWLINE);
                    }
                    }
                }
                this.state = 541;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 59, this.context);
            }
            this.state = 542;
            this.block();
            this.state = 546;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 95) {
                {
                {
                this.state = 543;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 548;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 549;
            this.match(PseudocodeParser.NEXT);
            this.state = 550;
            this.identifier();
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
        this.enterRule(localContext, 48, PseudocodeParser.RULE_whileStatement);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 552;
            this.match(PseudocodeParser.WHILE);
            this.state = 553;
            this.expr(0);
            this.state = 555;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 20) {
                {
                this.state = 554;
                this.match(PseudocodeParser.DO);
                }
            }

            this.state = 560;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 62, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 557;
                    this.match(PseudocodeParser.NEWLINE);
                    }
                    }
                }
                this.state = 562;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 62, this.context);
            }
            this.state = 563;
            this.block();
            this.state = 567;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 95) {
                {
                {
                this.state = 564;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 569;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 570;
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
        this.enterRule(localContext, 50, PseudocodeParser.RULE_repeatStatement);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 572;
            this.match(PseudocodeParser.REPEAT);
            this.state = 576;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 64, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 573;
                    this.match(PseudocodeParser.NEWLINE);
                    }
                    }
                }
                this.state = 578;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 64, this.context);
            }
            this.state = 579;
            this.block();
            this.state = 583;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 95) {
                {
                {
                this.state = 580;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 585;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 586;
            this.match(PseudocodeParser.UNTIL);
            this.state = 587;
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
        this.enterRule(localContext, 52, PseudocodeParser.RULE_procedureDeclaration);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 589;
            this.match(PseudocodeParser.PROCEDURE);
            this.state = 590;
            this.identifier();
            this.state = 591;
            this.match(PseudocodeParser.LPAREN);
            this.state = 593;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (((((_la - 46)) & ~0x1F) === 0 && ((1 << (_la - 46)) & 4257759) !== 0) || _la === 94) {
                {
                this.state = 592;
                this.paramList();
                }
            }

            this.state = 595;
            this.match(PseudocodeParser.RPAREN);
            this.state = 599;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 67, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 596;
                    this.match(PseudocodeParser.NEWLINE);
                    }
                    }
                }
                this.state = 601;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 67, this.context);
            }
            this.state = 602;
            this.block();
            this.state = 606;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 95) {
                {
                {
                this.state = 603;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 608;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 609;
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
        this.enterRule(localContext, 54, PseudocodeParser.RULE_functionDeclaration);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 611;
            this.match(PseudocodeParser.FUNCTION);
            this.state = 612;
            this.identifier();
            this.state = 613;
            this.match(PseudocodeParser.LPAREN);
            this.state = 615;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (((((_la - 46)) & ~0x1F) === 0 && ((1 << (_la - 46)) & 4257759) !== 0) || _la === 94) {
                {
                this.state = 614;
                this.paramList();
                }
            }

            this.state = 617;
            this.match(PseudocodeParser.RPAREN);
            this.state = 618;
            this.match(PseudocodeParser.RETURNS);
            this.state = 619;
            this.dataType();
            this.state = 623;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 70, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 620;
                    this.match(PseudocodeParser.NEWLINE);
                    }
                    }
                }
                this.state = 625;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 70, this.context);
            }
            this.state = 626;
            this.block();
            this.state = 630;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 95) {
                {
                {
                this.state = 627;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 632;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 633;
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
        this.enterRule(localContext, 56, PseudocodeParser.RULE_paramList);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 635;
            this.param();
            this.state = 640;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 86) {
                {
                {
                this.state = 636;
                this.match(PseudocodeParser.COMMA);
                this.state = 637;
                this.param();
                }
                }
                this.state = 642;
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
        this.enterRule(localContext, 58, PseudocodeParser.RULE_param);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 644;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 73, this.context) ) {
            case 1:
                {
                this.state = 643;
                _la = this.tokenStream.LA(1);
                if(!(_la === 54 || _la === 55)) {
                this.errorHandler.recoverInline(this);
                }
                else {
                    this.errorHandler.reportMatch(this);
                    this.consume();
                }
                }
                break;
            }
            this.state = 646;
            this.identifier();
            this.state = 647;
            this.match(PseudocodeParser.COLON);
            this.state = 648;
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
        this.enterRule(localContext, 60, PseudocodeParser.RULE_callStatement);
        let _la: number;
        try {
            this.state = 660;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 75, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 650;
                this.match(PseudocodeParser.CALL);
                this.state = 651;
                this.identifier();
                this.state = 652;
                this.match(PseudocodeParser.LPAREN);
                this.state = 654;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & 528347167) !== 0) || ((((_la - 68)) & ~0x1F) === 0 && ((1 << (_la - 68)) & 132141569) !== 0)) {
                    {
                    this.state = 653;
                    this.argList();
                    }
                }

                this.state = 656;
                this.match(PseudocodeParser.RPAREN);
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 658;
                this.match(PseudocodeParser.CALL);
                this.state = 659;
                this.methodCall();
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
    public methodCall(): MethodCallContext {
        let localContext = new MethodCallContext(this.context, this.state);
        this.enterRule(localContext, 62, PseudocodeParser.RULE_methodCall);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 664;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case PseudocodeParser.RANDOM:
            case PseudocodeParser.SEEK:
            case PseudocodeParser.GETRECORD:
            case PseudocodeParser.PUTRECORD:
            case PseudocodeParser.TYPE:
            case PseudocodeParser.SET:
            case PseudocodeParser.DEFINE:
            case PseudocodeParser.BYREF:
            case PseudocodeParser.BYVAL:
            case PseudocodeParser.CLASS:
            case PseudocodeParser.INHERITS:
            case PseudocodeParser.PUBLIC:
            case PseudocodeParser.PRIVATE:
            case PseudocodeParser.NEW:
            case PseudocodeParser.DATE_TYPE:
            case PseudocodeParser.IDENTIFIER:
                {
                this.state = 662;
                this.identifier();
                }
                break;
            case PseudocodeParser.SUPER:
                {
                this.state = 663;
                this.match(PseudocodeParser.SUPER);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
            this.state = 669;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 77, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 666;
                    this.designatorPart();
                    }
                    }
                }
                this.state = 671;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 77, this.context);
            }
            this.state = 672;
            this.match(PseudocodeParser.DOT);
            this.state = 673;
            this.memberName();
            this.state = 674;
            this.match(PseudocodeParser.LPAREN);
            this.state = 676;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & 528347167) !== 0) || ((((_la - 68)) & ~0x1F) === 0 && ((1 << (_la - 68)) & 132141569) !== 0)) {
                {
                this.state = 675;
                this.argList();
                }
            }

            this.state = 678;
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
    public methodCallStatement(): MethodCallStatementContext {
        let localContext = new MethodCallStatementContext(this.context, this.state);
        this.enterRule(localContext, 64, PseudocodeParser.RULE_methodCallStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 680;
            this.methodCall();
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
        this.enterRule(localContext, 66, PseudocodeParser.RULE_returnStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 682;
            this.match(PseudocodeParser.RETURN);
            this.state = 683;
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
        this.enterRule(localContext, 68, PseudocodeParser.RULE_openFileStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 685;
            this.match(PseudocodeParser.OPENFILE);
            this.state = 686;
            this.expr(0);
            this.state = 687;
            this.match(PseudocodeParser.FOR);
            this.state = 688;
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
        this.enterRule(localContext, 70, PseudocodeParser.RULE_readFileStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 690;
            this.match(PseudocodeParser.READFILE);
            this.state = 691;
            this.expr(0);
            this.state = 692;
            this.match(PseudocodeParser.COMMA);
            this.state = 693;
            this.designator();
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
        this.enterRule(localContext, 72, PseudocodeParser.RULE_writeFileStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 695;
            this.match(PseudocodeParser.WRITEFILE);
            this.state = 696;
            this.expr(0);
            this.state = 697;
            this.match(PseudocodeParser.COMMA);
            this.state = 698;
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
        this.enterRule(localContext, 74, PseudocodeParser.RULE_closeFileStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 700;
            this.match(PseudocodeParser.CLOSEFILE);
            this.state = 701;
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
    public seekStatement(): SeekStatementContext {
        let localContext = new SeekStatementContext(this.context, this.state);
        this.enterRule(localContext, 76, PseudocodeParser.RULE_seekStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 703;
            this.match(PseudocodeParser.SEEK);
            this.state = 704;
            this.expr(0);
            this.state = 705;
            this.match(PseudocodeParser.COMMA);
            this.state = 706;
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
    public getRecordStatement(): GetRecordStatementContext {
        let localContext = new GetRecordStatementContext(this.context, this.state);
        this.enterRule(localContext, 78, PseudocodeParser.RULE_getRecordStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 708;
            this.match(PseudocodeParser.GETRECORD);
            this.state = 709;
            this.expr(0);
            this.state = 710;
            this.match(PseudocodeParser.COMMA);
            this.state = 711;
            this.designator();
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
    public putRecordStatement(): PutRecordStatementContext {
        let localContext = new PutRecordStatementContext(this.context, this.state);
        this.enterRule(localContext, 80, PseudocodeParser.RULE_putRecordStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 713;
            this.match(PseudocodeParser.PUTRECORD);
            this.state = 714;
            this.expr(0);
            this.state = 715;
            this.match(PseudocodeParser.COMMA);
            this.state = 716;
            this.designator();
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
        this.enterRule(localContext, 82, PseudocodeParser.RULE_fileMode);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 718;
            _la = this.tokenStream.LA(1);
            if(!(((((_la - 43)) & ~0x1F) === 0 && ((1 << (_la - 43)) & 15) !== 0))) {
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
        this.enterRule(localContext, 84, PseudocodeParser.RULE_argList);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 720;
            this.expr(0);
            this.state = 725;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 86) {
                {
                {
                this.state = 721;
                this.match(PseudocodeParser.COMMA);
                this.state = 722;
                this.expr(0);
                }
                }
                this.state = 727;
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
        this.enterRule(localContext, 86, PseudocodeParser.RULE_block);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 741;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 82, this.context) ) {
            case 1:
                {
                this.state = 728;
                this.statement();
                this.state = 738;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 81, this.context);
                while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                    if (alternative === 1) {
                        {
                        {
                        this.state = 732;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                        while (_la === 95) {
                            {
                            {
                            this.state = 729;
                            this.match(PseudocodeParser.NEWLINE);
                            }
                            }
                            this.state = 734;
                            this.errorHandler.sync(this);
                            _la = this.tokenStream.LA(1);
                        }
                        this.state = 735;
                        this.statement();
                        }
                        }
                    }
                    this.state = 740;
                    this.errorHandler.sync(this);
                    alternative = this.interpreter.adaptivePredict(this.tokenStream, 81, this.context);
                }
                }
                break;
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
        let _startState = 88;
        this.enterRecursionRule(localContext, 88, PseudocodeParser.RULE_expr, _p);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 749;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case PseudocodeParser.NOT:
                {
                localContext = new NotExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;

                this.state = 744;
                this.match(PseudocodeParser.NOT);
                this.state = 745;
                this.expr(10);
                }
                break;
            case PseudocodeParser.MINUS:
                {
                localContext = new UnaryMinusExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 746;
                this.match(PseudocodeParser.MINUS);
                this.state = 747;
                this.expr(9);
                }
                break;
            case PseudocodeParser.TRUE:
            case PseudocodeParser.FALSE:
            case PseudocodeParser.MOD:
            case PseudocodeParser.DIV:
            case PseudocodeParser.RANDOM:
            case PseudocodeParser.SEEK:
            case PseudocodeParser.GETRECORD:
            case PseudocodeParser.PUTRECORD:
            case PseudocodeParser.TYPE:
            case PseudocodeParser.SET:
            case PseudocodeParser.DEFINE:
            case PseudocodeParser.BYREF:
            case PseudocodeParser.BYVAL:
            case PseudocodeParser.CLASS:
            case PseudocodeParser.INHERITS:
            case PseudocodeParser.PUBLIC:
            case PseudocodeParser.PRIVATE:
            case PseudocodeParser.NEW:
            case PseudocodeParser.SUPER:
            case PseudocodeParser.DATE_TYPE:
            case PseudocodeParser.CARET:
            case PseudocodeParser.LPAREN:
            case PseudocodeParser.DATE_LITERAL:
            case PseudocodeParser.REAL_LITERAL:
            case PseudocodeParser.INTEGER_LITERAL:
            case PseudocodeParser.STRING_LITERAL:
            case PseudocodeParser.CHAR_LITERAL:
            case PseudocodeParser.IDENTIFIER:
                {
                localContext = new AtomExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 748;
                this.atom();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
            this.context!.stop = this.tokenStream.LT(-1);
            this.state = 774;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 85, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    if (this.parseListeners != null) {
                        this.triggerExitRuleEvent();
                    }
                    previousContext = localContext;
                    {
                    this.state = 772;
                    this.errorHandler.sync(this);
                    switch (this.interpreter.adaptivePredict(this.tokenStream, 84, this.context) ) {
                    case 1:
                        {
                        localContext = new PowerExprContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, PseudocodeParser.RULE_expr);
                        this.state = 751;
                        if (!(this.precpred(this.context, 8))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 8)");
                        }
                        this.state = 752;
                        this.match(PseudocodeParser.CARET);
                        this.state = 753;
                        this.expr(8);
                        }
                        break;
                    case 2:
                        {
                        localContext = new MulDivExprContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, PseudocodeParser.RULE_expr);
                        this.state = 754;
                        if (!(this.precpred(this.context, 7))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 7)");
                        }
                        this.state = 755;
                        (localContext as MulDivExprContext)._op = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!(_la === 37 || _la === 38 || _la === 78 || _la === 79)) {
                            (localContext as MulDivExprContext)._op = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 756;
                        this.expr(8);
                        }
                        break;
                    case 3:
                        {
                        localContext = new AddSubExprContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, PseudocodeParser.RULE_expr);
                        this.state = 757;
                        if (!(this.precpred(this.context, 6))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 6)");
                        }
                        this.state = 758;
                        (localContext as AddSubExprContext)._op = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!(_la === 76 || _la === 77)) {
                            (localContext as AddSubExprContext)._op = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 759;
                        this.expr(7);
                        }
                        break;
                    case 4:
                        {
                        localContext = new ConcatExprContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, PseudocodeParser.RULE_expr);
                        this.state = 760;
                        if (!(this.precpred(this.context, 5))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 5)");
                        }
                        this.state = 761;
                        this.match(PseudocodeParser.AMPERSAND);
                        this.state = 762;
                        this.expr(6);
                        }
                        break;
                    case 5:
                        {
                        localContext = new ComparisonExprContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, PseudocodeParser.RULE_expr);
                        this.state = 763;
                        if (!(this.precpred(this.context, 4))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 4)");
                        }
                        this.state = 764;
                        (localContext as ComparisonExprContext)._op = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!(((((_la - 70)) & ~0x1F) === 0 && ((1 << (_la - 70)) & 63) !== 0))) {
                            (localContext as ComparisonExprContext)._op = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 765;
                        this.expr(5);
                        }
                        break;
                    case 6:
                        {
                        localContext = new AndExprContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, PseudocodeParser.RULE_expr);
                        this.state = 766;
                        if (!(this.precpred(this.context, 3))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 3)");
                        }
                        this.state = 767;
                        this.match(PseudocodeParser.AND);
                        this.state = 768;
                        this.expr(4);
                        }
                        break;
                    case 7:
                        {
                        localContext = new OrExprContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, PseudocodeParser.RULE_expr);
                        this.state = 769;
                        if (!(this.precpred(this.context, 2))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 2)");
                        }
                        this.state = 770;
                        this.match(PseudocodeParser.OR);
                        this.state = 771;
                        this.expr(3);
                        }
                        break;
                    }
                    }
                }
                this.state = 776;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 85, this.context);
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
        this.enterRule(localContext, 90, PseudocodeParser.RULE_atom);
        let _la: number;
        try {
            this.state = 819;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 88, this.context) ) {
            case 1:
                localContext = new ParenAtomContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 777;
                this.match(PseudocodeParser.LPAREN);
                this.state = 778;
                this.expr(0);
                this.state = 779;
                this.match(PseudocodeParser.RPAREN);
                }
                break;
            case 2:
                localContext = new FunctionCallAtomContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 781;
                this.identifier();
                this.state = 782;
                this.match(PseudocodeParser.LPAREN);
                this.state = 784;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & 528347167) !== 0) || ((((_la - 68)) & ~0x1F) === 0 && ((1 << (_la - 68)) & 132141569) !== 0)) {
                    {
                    this.state = 783;
                    this.argList();
                    }
                }

                this.state = 786;
                this.match(PseudocodeParser.RPAREN);
                }
                break;
            case 3:
                localContext = new NewInstanceAtomContext(localContext);
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 788;
                this.match(PseudocodeParser.NEW);
                this.state = 789;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 790;
                this.match(PseudocodeParser.LPAREN);
                this.state = 792;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & 528347167) !== 0) || ((((_la - 68)) & ~0x1F) === 0 && ((1 << (_la - 68)) & 132141569) !== 0)) {
                    {
                    this.state = 791;
                    this.argList();
                    }
                }

                this.state = 794;
                this.match(PseudocodeParser.RPAREN);
                }
                break;
            case 4:
                localContext = new AddressOfAtomContext(localContext);
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 795;
                this.match(PseudocodeParser.CARET);
                this.state = 796;
                this.designator();
                }
                break;
            case 5:
                localContext = new DivFunctionAtomContext(localContext);
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 797;
                this.match(PseudocodeParser.DIV);
                this.state = 798;
                this.match(PseudocodeParser.LPAREN);
                this.state = 799;
                this.expr(0);
                this.state = 800;
                this.match(PseudocodeParser.COMMA);
                this.state = 801;
                this.expr(0);
                this.state = 802;
                this.match(PseudocodeParser.RPAREN);
                }
                break;
            case 6:
                localContext = new ModFunctionAtomContext(localContext);
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 804;
                this.match(PseudocodeParser.MOD);
                this.state = 805;
                this.match(PseudocodeParser.LPAREN);
                this.state = 806;
                this.expr(0);
                this.state = 807;
                this.match(PseudocodeParser.COMMA);
                this.state = 808;
                this.expr(0);
                this.state = 809;
                this.match(PseudocodeParser.RPAREN);
                }
                break;
            case 7:
                localContext = new DesignatorAtomContext(localContext);
                this.enterOuterAlt(localContext, 7);
                {
                this.state = 811;
                this.designator();
                }
                break;
            case 8:
                localContext = new IntegerAtomContext(localContext);
                this.enterOuterAlt(localContext, 8);
                {
                this.state = 812;
                this.match(PseudocodeParser.INTEGER_LITERAL);
                }
                break;
            case 9:
                localContext = new RealAtomContext(localContext);
                this.enterOuterAlt(localContext, 9);
                {
                this.state = 813;
                this.match(PseudocodeParser.REAL_LITERAL);
                }
                break;
            case 10:
                localContext = new DateAtomContext(localContext);
                this.enterOuterAlt(localContext, 10);
                {
                this.state = 814;
                this.match(PseudocodeParser.DATE_LITERAL);
                }
                break;
            case 11:
                localContext = new StringAtomContext(localContext);
                this.enterOuterAlt(localContext, 11);
                {
                this.state = 815;
                this.match(PseudocodeParser.STRING_LITERAL);
                }
                break;
            case 12:
                localContext = new CharAtomContext(localContext);
                this.enterOuterAlt(localContext, 12);
                {
                this.state = 816;
                this.match(PseudocodeParser.CHAR_LITERAL);
                }
                break;
            case 13:
                localContext = new TrueAtomContext(localContext);
                this.enterOuterAlt(localContext, 13);
                {
                this.state = 817;
                this.match(PseudocodeParser.TRUE);
                }
                break;
            case 14:
                localContext = new FalseAtomContext(localContext);
                this.enterOuterAlt(localContext, 14);
                {
                this.state = 818;
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
        case 44:
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
        4,1,97,822,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,
        6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,2,11,7,11,2,12,7,12,2,13,7,13,
        2,14,7,14,2,15,7,15,2,16,7,16,2,17,7,17,2,18,7,18,2,19,7,19,2,20,
        7,20,2,21,7,21,2,22,7,22,2,23,7,23,2,24,7,24,2,25,7,25,2,26,7,26,
        2,27,7,27,2,28,7,28,2,29,7,29,2,30,7,30,2,31,7,31,2,32,7,32,2,33,
        7,33,2,34,7,34,2,35,7,35,2,36,7,36,2,37,7,37,2,38,7,38,2,39,7,39,
        2,40,7,40,2,41,7,41,2,42,7,42,2,43,7,43,2,44,7,44,2,45,7,45,1,0,
        5,0,94,8,0,10,0,12,0,97,9,0,1,0,1,0,5,0,101,8,0,10,0,12,0,104,9,
        0,1,0,5,0,107,8,0,10,0,12,0,110,9,0,3,0,112,8,0,1,0,5,0,115,8,0,
        10,0,12,0,118,9,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,
        1,147,8,1,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,
        2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,
        2,1,2,1,2,1,2,3,2,182,8,2,1,3,1,3,1,3,5,3,187,8,3,10,3,12,3,190,
        9,3,1,4,1,4,1,5,1,5,1,5,1,5,1,5,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,
        1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,3,6,215,8,6,1,6,1,6,3,6,219,8,6,
        1,6,1,6,1,6,3,6,224,8,6,1,7,1,7,1,7,1,7,1,7,1,7,1,7,1,7,1,7,1,7,
        1,7,1,7,1,7,1,7,1,7,1,7,1,7,1,7,1,7,1,7,1,7,4,7,247,8,7,11,7,12,
        7,248,1,7,1,7,4,7,253,8,7,11,7,12,7,254,5,7,257,8,7,10,7,12,7,260,
        9,7,1,7,3,7,263,8,7,1,8,1,8,1,8,1,8,3,8,269,8,8,1,8,1,8,1,8,1,8,
        1,9,1,9,1,9,1,9,3,9,279,8,9,1,9,4,9,282,8,9,11,9,12,9,283,1,9,1,
        9,4,9,288,8,9,11,9,12,9,289,5,9,292,8,9,10,9,12,9,295,9,9,1,9,1,
        9,1,10,3,10,300,8,10,1,10,3,10,303,8,10,1,10,1,10,1,10,1,10,1,10,
        3,10,310,8,10,1,10,1,10,3,10,314,8,10,1,10,3,10,317,8,10,1,11,1,
        11,3,11,321,8,11,1,11,5,11,324,8,11,10,11,12,11,327,9,11,1,12,1,
        12,1,12,1,12,5,12,333,8,12,10,12,12,12,336,9,12,1,12,1,12,1,12,1,
        12,1,12,1,12,3,12,344,8,12,1,12,3,12,347,8,12,1,12,3,12,350,8,12,
        1,13,1,13,1,14,1,14,1,14,5,14,357,8,14,10,14,12,14,360,9,14,1,15,
        1,15,1,15,1,15,1,16,1,16,1,16,1,16,3,16,370,8,16,1,17,1,17,1,17,
        1,18,1,18,1,18,5,18,378,8,18,10,18,12,18,381,9,18,1,19,1,19,1,19,
        5,19,386,8,19,10,19,12,19,389,9,19,1,19,3,19,392,8,19,1,19,5,19,
        395,8,19,10,19,12,19,398,9,19,1,19,1,19,5,19,402,8,19,10,19,12,19,
        405,9,19,1,19,1,19,1,19,3,19,410,8,19,1,19,1,19,5,19,414,8,19,10,
        19,12,19,417,9,19,1,19,3,19,420,8,19,1,19,5,19,423,8,19,10,19,12,
        19,426,9,19,1,19,1,19,5,19,430,8,19,10,19,12,19,433,9,19,1,19,5,
        19,436,8,19,10,19,12,19,439,9,19,1,19,1,19,5,19,443,8,19,10,19,12,
        19,446,9,19,1,19,3,19,449,8,19,1,19,5,19,452,8,19,10,19,12,19,455,
        9,19,1,19,1,19,1,20,1,20,1,20,1,20,5,20,463,8,20,10,20,12,20,466,
        9,20,1,20,4,20,469,8,20,11,20,12,20,470,1,20,1,20,3,20,475,8,20,
        1,20,5,20,478,8,20,10,20,12,20,481,9,20,1,20,1,20,5,20,485,8,20,
        10,20,12,20,488,9,20,3,20,490,8,20,1,20,5,20,493,8,20,10,20,12,20,
        496,9,20,1,20,1,20,1,21,1,21,1,21,5,21,503,8,21,10,21,12,21,506,
        9,21,1,21,1,21,5,21,510,8,21,10,21,12,21,513,9,21,1,21,1,21,5,21,
        517,8,21,10,21,12,21,520,9,21,1,22,1,22,1,22,3,22,525,8,22,1,23,
        1,23,1,23,1,23,1,23,1,23,1,23,1,23,3,23,535,8,23,1,23,5,23,538,8,
        23,10,23,12,23,541,9,23,1,23,1,23,5,23,545,8,23,10,23,12,23,548,
        9,23,1,23,1,23,1,23,1,24,1,24,1,24,3,24,556,8,24,1,24,5,24,559,8,
        24,10,24,12,24,562,9,24,1,24,1,24,5,24,566,8,24,10,24,12,24,569,
        9,24,1,24,1,24,1,25,1,25,5,25,575,8,25,10,25,12,25,578,9,25,1,25,
        1,25,5,25,582,8,25,10,25,12,25,585,9,25,1,25,1,25,1,25,1,26,1,26,
        1,26,1,26,3,26,594,8,26,1,26,1,26,5,26,598,8,26,10,26,12,26,601,
        9,26,1,26,1,26,5,26,605,8,26,10,26,12,26,608,9,26,1,26,1,26,1,27,
        1,27,1,27,1,27,3,27,616,8,27,1,27,1,27,1,27,1,27,5,27,622,8,27,10,
        27,12,27,625,9,27,1,27,1,27,5,27,629,8,27,10,27,12,27,632,9,27,1,
        27,1,27,1,28,1,28,1,28,5,28,639,8,28,10,28,12,28,642,9,28,1,29,3,
        29,645,8,29,1,29,1,29,1,29,1,29,1,30,1,30,1,30,1,30,3,30,655,8,30,
        1,30,1,30,1,30,1,30,3,30,661,8,30,1,31,1,31,3,31,665,8,31,1,31,5,
        31,668,8,31,10,31,12,31,671,9,31,1,31,1,31,1,31,1,31,3,31,677,8,
        31,1,31,1,31,1,32,1,32,1,33,1,33,1,33,1,34,1,34,1,34,1,34,1,34,1,
        35,1,35,1,35,1,35,1,35,1,36,1,36,1,36,1,36,1,36,1,37,1,37,1,37,1,
        38,1,38,1,38,1,38,1,38,1,39,1,39,1,39,1,39,1,39,1,40,1,40,1,40,1,
        40,1,40,1,41,1,41,1,42,1,42,1,42,5,42,724,8,42,10,42,12,42,727,9,
        42,1,43,1,43,5,43,731,8,43,10,43,12,43,734,9,43,1,43,5,43,737,8,
        43,10,43,12,43,740,9,43,3,43,742,8,43,1,44,1,44,1,44,1,44,1,44,1,
        44,3,44,750,8,44,1,44,1,44,1,44,1,44,1,44,1,44,1,44,1,44,1,44,1,
        44,1,44,1,44,1,44,1,44,1,44,1,44,1,44,1,44,1,44,1,44,1,44,5,44,773,
        8,44,10,44,12,44,776,9,44,1,45,1,45,1,45,1,45,1,45,1,45,1,45,3,45,
        785,8,45,1,45,1,45,1,45,1,45,1,45,1,45,3,45,793,8,45,1,45,1,45,1,
        45,1,45,1,45,1,45,1,45,1,45,1,45,1,45,1,45,1,45,1,45,1,45,1,45,1,
        45,1,45,1,45,1,45,1,45,1,45,1,45,1,45,1,45,1,45,3,45,820,8,45,1,
        45,0,1,88,46,0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,
        38,40,42,44,46,48,50,52,54,56,58,60,62,64,66,68,70,72,74,76,78,80,
        82,84,86,88,90,0,9,5,0,46,50,52,56,58,61,68,68,94,94,1,0,69,70,1,
        0,59,60,1,0,4,5,1,0,54,55,1,0,43,46,2,0,37,38,78,79,1,0,76,77,1,
        0,70,75,916,0,95,1,0,0,0,2,146,1,0,0,0,4,181,1,0,0,0,6,183,1,0,0,
        0,8,191,1,0,0,0,10,193,1,0,0,0,12,223,1,0,0,0,14,262,1,0,0,0,16,
        264,1,0,0,0,18,274,1,0,0,0,20,316,1,0,0,0,22,320,1,0,0,0,24,349,
        1,0,0,0,26,351,1,0,0,0,28,353,1,0,0,0,30,361,1,0,0,0,32,365,1,0,
        0,0,34,371,1,0,0,0,36,374,1,0,0,0,38,382,1,0,0,0,40,458,1,0,0,0,
        42,499,1,0,0,0,44,521,1,0,0,0,46,526,1,0,0,0,48,552,1,0,0,0,50,572,
        1,0,0,0,52,589,1,0,0,0,54,611,1,0,0,0,56,635,1,0,0,0,58,644,1,0,
        0,0,60,660,1,0,0,0,62,664,1,0,0,0,64,680,1,0,0,0,66,682,1,0,0,0,
        68,685,1,0,0,0,70,690,1,0,0,0,72,695,1,0,0,0,74,700,1,0,0,0,76,703,
        1,0,0,0,78,708,1,0,0,0,80,713,1,0,0,0,82,718,1,0,0,0,84,720,1,0,
        0,0,86,741,1,0,0,0,88,749,1,0,0,0,90,819,1,0,0,0,92,94,5,95,0,0,
        93,92,1,0,0,0,94,97,1,0,0,0,95,93,1,0,0,0,95,96,1,0,0,0,96,111,1,
        0,0,0,97,95,1,0,0,0,98,108,3,2,1,0,99,101,5,95,0,0,100,99,1,0,0,
        0,101,104,1,0,0,0,102,100,1,0,0,0,102,103,1,0,0,0,103,105,1,0,0,
        0,104,102,1,0,0,0,105,107,3,2,1,0,106,102,1,0,0,0,107,110,1,0,0,
        0,108,106,1,0,0,0,108,109,1,0,0,0,109,112,1,0,0,0,110,108,1,0,0,
        0,111,98,1,0,0,0,111,112,1,0,0,0,112,116,1,0,0,0,113,115,5,95,0,
        0,114,113,1,0,0,0,115,118,1,0,0,0,116,114,1,0,0,0,116,117,1,0,0,
        0,117,119,1,0,0,0,118,116,1,0,0,0,119,120,5,0,0,1,120,1,1,0,0,0,
        121,147,3,4,2,0,122,147,3,10,5,0,123,147,3,14,7,0,124,147,3,16,8,
        0,125,147,3,18,9,0,126,147,3,28,14,0,127,147,3,32,16,0,128,147,3,
        34,17,0,129,147,3,38,19,0,130,147,3,40,20,0,131,147,3,46,23,0,132,
        147,3,48,24,0,133,147,3,50,25,0,134,147,3,52,26,0,135,147,3,54,27,
        0,136,147,3,60,30,0,137,147,3,64,32,0,138,147,3,66,33,0,139,147,
        3,68,34,0,140,147,3,70,35,0,141,147,3,72,36,0,142,147,3,74,37,0,
        143,147,3,76,38,0,144,147,3,78,39,0,145,147,3,80,40,0,146,121,1,
        0,0,0,146,122,1,0,0,0,146,123,1,0,0,0,146,124,1,0,0,0,146,125,1,
        0,0,0,146,126,1,0,0,0,146,127,1,0,0,0,146,128,1,0,0,0,146,129,1,
        0,0,0,146,130,1,0,0,0,146,131,1,0,0,0,146,132,1,0,0,0,146,133,1,
        0,0,0,146,134,1,0,0,0,146,135,1,0,0,0,146,136,1,0,0,0,146,137,1,
        0,0,0,146,138,1,0,0,0,146,139,1,0,0,0,146,140,1,0,0,0,146,141,1,
        0,0,0,146,142,1,0,0,0,146,143,1,0,0,0,146,144,1,0,0,0,146,145,1,
        0,0,0,147,3,1,0,0,0,148,149,5,1,0,0,149,150,3,6,3,0,150,151,5,87,
        0,0,151,152,5,31,0,0,152,153,5,84,0,0,153,154,3,88,44,0,154,155,
        5,87,0,0,155,156,3,88,44,0,156,157,5,85,0,0,157,158,5,12,0,0,158,
        159,3,12,6,0,159,182,1,0,0,0,160,161,5,1,0,0,161,162,3,8,4,0,162,
        163,5,87,0,0,163,164,5,31,0,0,164,165,5,84,0,0,165,166,3,88,44,0,
        166,167,5,87,0,0,167,168,3,88,44,0,168,169,5,86,0,0,169,170,3,88,
        44,0,170,171,5,87,0,0,171,172,3,88,44,0,172,173,5,85,0,0,173,174,
        5,12,0,0,174,175,3,12,6,0,175,182,1,0,0,0,176,177,5,1,0,0,177,178,
        3,6,3,0,178,179,5,87,0,0,179,180,3,12,6,0,180,182,1,0,0,0,181,148,
        1,0,0,0,181,160,1,0,0,0,181,176,1,0,0,0,182,5,1,0,0,0,183,188,3,
        8,4,0,184,185,5,86,0,0,185,187,3,8,4,0,186,184,1,0,0,0,187,190,1,
        0,0,0,188,186,1,0,0,0,188,189,1,0,0,0,189,7,1,0,0,0,190,188,1,0,
        0,0,191,192,7,0,0,0,192,9,1,0,0,0,193,194,5,2,0,0,194,195,3,8,4,
        0,195,196,7,1,0,0,196,197,3,88,44,0,197,11,1,0,0,0,198,224,5,63,
        0,0,199,224,5,64,0,0,200,224,5,65,0,0,201,224,5,66,0,0,202,224,5,
        67,0,0,203,224,5,68,0,0,204,218,5,31,0,0,205,206,5,84,0,0,206,207,
        3,88,44,0,207,208,5,87,0,0,208,214,3,88,44,0,209,210,5,86,0,0,210,
        211,3,88,44,0,211,212,5,87,0,0,212,213,3,88,44,0,213,215,1,0,0,0,
        214,209,1,0,0,0,214,215,1,0,0,0,215,216,1,0,0,0,216,217,5,85,0,0,
        217,219,1,0,0,0,218,205,1,0,0,0,218,219,1,0,0,0,219,220,1,0,0,0,
        220,221,5,12,0,0,221,224,3,12,6,0,222,224,5,94,0,0,223,198,1,0,0,
        0,223,199,1,0,0,0,223,200,1,0,0,0,223,201,1,0,0,0,223,202,1,0,0,
        0,223,203,1,0,0,0,223,204,1,0,0,0,223,222,1,0,0,0,224,13,1,0,0,0,
        225,226,5,50,0,0,226,227,5,94,0,0,227,228,5,70,0,0,228,229,5,82,
        0,0,229,230,3,6,3,0,230,231,5,83,0,0,231,263,1,0,0,0,232,233,5,50,
        0,0,233,234,5,94,0,0,234,235,5,70,0,0,235,236,5,80,0,0,236,263,3,
        12,6,0,237,238,5,50,0,0,238,239,5,94,0,0,239,240,5,70,0,0,240,241,
        5,52,0,0,241,242,5,12,0,0,242,263,3,12,6,0,243,244,5,50,0,0,244,
        246,5,94,0,0,245,247,5,95,0,0,246,245,1,0,0,0,247,248,1,0,0,0,248,
        246,1,0,0,0,248,249,1,0,0,0,249,258,1,0,0,0,250,252,3,4,2,0,251,
        253,5,95,0,0,252,251,1,0,0,0,253,254,1,0,0,0,254,252,1,0,0,0,254,
        255,1,0,0,0,255,257,1,0,0,0,256,250,1,0,0,0,257,260,1,0,0,0,258,
        256,1,0,0,0,258,259,1,0,0,0,259,261,1,0,0,0,260,258,1,0,0,0,261,
        263,5,51,0,0,262,225,1,0,0,0,262,232,1,0,0,0,262,237,1,0,0,0,262,
        243,1,0,0,0,263,15,1,0,0,0,264,265,5,53,0,0,265,266,3,8,4,0,266,
        268,5,82,0,0,267,269,3,36,18,0,268,267,1,0,0,0,268,269,1,0,0,0,269,
        270,1,0,0,0,270,271,5,83,0,0,271,272,5,87,0,0,272,273,5,94,0,0,273,
        17,1,0,0,0,274,275,5,56,0,0,275,278,5,94,0,0,276,277,5,58,0,0,277,
        279,5,94,0,0,278,276,1,0,0,0,278,279,1,0,0,0,279,281,1,0,0,0,280,
        282,5,95,0,0,281,280,1,0,0,0,282,283,1,0,0,0,283,281,1,0,0,0,283,
        284,1,0,0,0,284,293,1,0,0,0,285,287,3,20,10,0,286,288,5,95,0,0,287,
        286,1,0,0,0,288,289,1,0,0,0,289,287,1,0,0,0,289,290,1,0,0,0,290,
        292,1,0,0,0,291,285,1,0,0,0,292,295,1,0,0,0,293,291,1,0,0,0,293,
        294,1,0,0,0,294,296,1,0,0,0,295,293,1,0,0,0,296,297,5,57,0,0,297,
        19,1,0,0,0,298,300,7,2,0,0,299,298,1,0,0,0,299,300,1,0,0,0,300,302,
        1,0,0,0,301,303,5,1,0,0,302,301,1,0,0,0,302,303,1,0,0,0,303,304,
        1,0,0,0,304,305,3,6,3,0,305,306,5,87,0,0,306,307,3,12,6,0,307,317,
        1,0,0,0,308,310,7,2,0,0,309,308,1,0,0,0,309,310,1,0,0,0,310,311,
        1,0,0,0,311,317,3,52,26,0,312,314,7,2,0,0,313,312,1,0,0,0,313,314,
        1,0,0,0,314,315,1,0,0,0,315,317,3,54,27,0,316,299,1,0,0,0,316,309,
        1,0,0,0,316,313,1,0,0,0,317,21,1,0,0,0,318,321,3,8,4,0,319,321,5,
        62,0,0,320,318,1,0,0,0,320,319,1,0,0,0,321,325,1,0,0,0,322,324,3,
        24,12,0,323,322,1,0,0,0,324,327,1,0,0,0,325,323,1,0,0,0,325,326,
        1,0,0,0,326,23,1,0,0,0,327,325,1,0,0,0,328,329,5,84,0,0,329,334,
        3,88,44,0,330,331,5,86,0,0,331,333,3,88,44,0,332,330,1,0,0,0,333,
        336,1,0,0,0,334,332,1,0,0,0,334,335,1,0,0,0,335,337,1,0,0,0,336,
        334,1,0,0,0,337,338,5,85,0,0,338,350,1,0,0,0,339,340,5,88,0,0,340,
        346,3,26,13,0,341,343,5,82,0,0,342,344,3,84,42,0,343,342,1,0,0,0,
        343,344,1,0,0,0,344,345,1,0,0,0,345,347,5,83,0,0,346,341,1,0,0,0,
        346,347,1,0,0,0,347,350,1,0,0,0,348,350,5,80,0,0,349,328,1,0,0,0,
        349,339,1,0,0,0,349,348,1,0,0,0,350,25,1,0,0,0,351,352,3,8,4,0,352,
        27,1,0,0,0,353,358,3,30,15,0,354,355,5,86,0,0,355,357,3,30,15,0,
        356,354,1,0,0,0,357,360,1,0,0,0,358,356,1,0,0,0,358,359,1,0,0,0,
        359,29,1,0,0,0,360,358,1,0,0,0,361,362,3,22,11,0,362,363,7,1,0,0,
        363,364,3,88,44,0,364,31,1,0,0,0,365,366,5,3,0,0,366,369,3,22,11,
        0,367,368,5,86,0,0,368,370,5,92,0,0,369,367,1,0,0,0,369,370,1,0,
        0,0,370,33,1,0,0,0,371,372,7,3,0,0,372,373,3,36,18,0,373,35,1,0,
        0,0,374,379,3,88,44,0,375,376,5,86,0,0,376,378,3,88,44,0,377,375,
        1,0,0,0,378,381,1,0,0,0,379,377,1,0,0,0,379,380,1,0,0,0,380,37,1,
        0,0,0,381,379,1,0,0,0,382,383,5,6,0,0,383,387,3,88,44,0,384,386,
        5,95,0,0,385,384,1,0,0,0,386,389,1,0,0,0,387,385,1,0,0,0,387,388,
        1,0,0,0,388,391,1,0,0,0,389,387,1,0,0,0,390,392,5,7,0,0,391,390,
        1,0,0,0,391,392,1,0,0,0,392,396,1,0,0,0,393,395,5,95,0,0,394,393,
        1,0,0,0,395,398,1,0,0,0,396,394,1,0,0,0,396,397,1,0,0,0,397,399,
        1,0,0,0,398,396,1,0,0,0,399,431,3,86,43,0,400,402,5,95,0,0,401,400,
        1,0,0,0,402,405,1,0,0,0,403,401,1,0,0,0,403,404,1,0,0,0,404,409,
        1,0,0,0,405,403,1,0,0,0,406,410,5,9,0,0,407,408,5,8,0,0,408,410,
        5,6,0,0,409,406,1,0,0,0,409,407,1,0,0,0,410,411,1,0,0,0,411,415,
        3,88,44,0,412,414,5,95,0,0,413,412,1,0,0,0,414,417,1,0,0,0,415,413,
        1,0,0,0,415,416,1,0,0,0,416,419,1,0,0,0,417,415,1,0,0,0,418,420,
        5,7,0,0,419,418,1,0,0,0,419,420,1,0,0,0,420,424,1,0,0,0,421,423,
        5,95,0,0,422,421,1,0,0,0,423,426,1,0,0,0,424,422,1,0,0,0,424,425,
        1,0,0,0,425,427,1,0,0,0,426,424,1,0,0,0,427,428,3,86,43,0,428,430,
        1,0,0,0,429,403,1,0,0,0,430,433,1,0,0,0,431,429,1,0,0,0,431,432,
        1,0,0,0,432,448,1,0,0,0,433,431,1,0,0,0,434,436,5,95,0,0,435,434,
        1,0,0,0,436,439,1,0,0,0,437,435,1,0,0,0,437,438,1,0,0,0,438,440,
        1,0,0,0,439,437,1,0,0,0,440,444,5,8,0,0,441,443,5,95,0,0,442,441,
        1,0,0,0,443,446,1,0,0,0,444,442,1,0,0,0,444,445,1,0,0,0,445,447,
        1,0,0,0,446,444,1,0,0,0,447,449,3,86,43,0,448,437,1,0,0,0,448,449,
        1,0,0,0,449,453,1,0,0,0,450,452,5,95,0,0,451,450,1,0,0,0,452,455,
        1,0,0,0,453,451,1,0,0,0,453,454,1,0,0,0,454,456,1,0,0,0,455,453,
        1,0,0,0,456,457,5,10,0,0,457,39,1,0,0,0,458,459,5,11,0,0,459,460,
        5,12,0,0,460,464,3,22,11,0,461,463,5,95,0,0,462,461,1,0,0,0,463,
        466,1,0,0,0,464,462,1,0,0,0,464,465,1,0,0,0,465,468,1,0,0,0,466,
        464,1,0,0,0,467,469,3,42,21,0,468,467,1,0,0,0,469,470,1,0,0,0,470,
        468,1,0,0,0,470,471,1,0,0,0,471,489,1,0,0,0,472,474,5,13,0,0,473,
        475,5,87,0,0,474,473,1,0,0,0,474,475,1,0,0,0,475,479,1,0,0,0,476,
        478,5,95,0,0,477,476,1,0,0,0,478,481,1,0,0,0,479,477,1,0,0,0,479,
        480,1,0,0,0,480,482,1,0,0,0,481,479,1,0,0,0,482,486,3,86,43,0,483,
        485,5,95,0,0,484,483,1,0,0,0,485,488,1,0,0,0,486,484,1,0,0,0,486,
        487,1,0,0,0,487,490,1,0,0,0,488,486,1,0,0,0,489,472,1,0,0,0,489,
        490,1,0,0,0,490,494,1,0,0,0,491,493,5,95,0,0,492,491,1,0,0,0,493,
        496,1,0,0,0,494,492,1,0,0,0,494,495,1,0,0,0,495,497,1,0,0,0,496,
        494,1,0,0,0,497,498,5,14,0,0,498,41,1,0,0,0,499,504,3,44,22,0,500,
        501,5,86,0,0,501,503,3,44,22,0,502,500,1,0,0,0,503,506,1,0,0,0,504,
        502,1,0,0,0,504,505,1,0,0,0,505,507,1,0,0,0,506,504,1,0,0,0,507,
        511,5,87,0,0,508,510,5,95,0,0,509,508,1,0,0,0,510,513,1,0,0,0,511,
        509,1,0,0,0,511,512,1,0,0,0,512,514,1,0,0,0,513,511,1,0,0,0,514,
        518,3,86,43,0,515,517,5,95,0,0,516,515,1,0,0,0,517,520,1,0,0,0,518,
        516,1,0,0,0,518,519,1,0,0,0,519,43,1,0,0,0,520,518,1,0,0,0,521,524,
        3,88,44,0,522,523,5,16,0,0,523,525,3,88,44,0,524,522,1,0,0,0,524,
        525,1,0,0,0,525,45,1,0,0,0,526,527,5,15,0,0,527,528,3,8,4,0,528,
        529,7,1,0,0,529,530,3,88,44,0,530,531,5,16,0,0,531,534,3,88,44,0,
        532,533,5,17,0,0,533,535,3,88,44,0,534,532,1,0,0,0,534,535,1,0,0,
        0,535,539,1,0,0,0,536,538,5,95,0,0,537,536,1,0,0,0,538,541,1,0,0,
        0,539,537,1,0,0,0,539,540,1,0,0,0,540,542,1,0,0,0,541,539,1,0,0,
        0,542,546,3,86,43,0,543,545,5,95,0,0,544,543,1,0,0,0,545,548,1,0,
        0,0,546,544,1,0,0,0,546,547,1,0,0,0,547,549,1,0,0,0,548,546,1,0,
        0,0,549,550,5,18,0,0,550,551,3,8,4,0,551,47,1,0,0,0,552,553,5,19,
        0,0,553,555,3,88,44,0,554,556,5,20,0,0,555,554,1,0,0,0,555,556,1,
        0,0,0,556,560,1,0,0,0,557,559,5,95,0,0,558,557,1,0,0,0,559,562,1,
        0,0,0,560,558,1,0,0,0,560,561,1,0,0,0,561,563,1,0,0,0,562,560,1,
        0,0,0,563,567,3,86,43,0,564,566,5,95,0,0,565,564,1,0,0,0,566,569,
        1,0,0,0,567,565,1,0,0,0,567,568,1,0,0,0,568,570,1,0,0,0,569,567,
        1,0,0,0,570,571,5,21,0,0,571,49,1,0,0,0,572,576,5,22,0,0,573,575,
        5,95,0,0,574,573,1,0,0,0,575,578,1,0,0,0,576,574,1,0,0,0,576,577,
        1,0,0,0,577,579,1,0,0,0,578,576,1,0,0,0,579,583,3,86,43,0,580,582,
        5,95,0,0,581,580,1,0,0,0,582,585,1,0,0,0,583,581,1,0,0,0,583,584,
        1,0,0,0,584,586,1,0,0,0,585,583,1,0,0,0,586,587,5,23,0,0,587,588,
        3,88,44,0,588,51,1,0,0,0,589,590,5,24,0,0,590,591,3,8,4,0,591,593,
        5,82,0,0,592,594,3,56,28,0,593,592,1,0,0,0,593,594,1,0,0,0,594,595,
        1,0,0,0,595,599,5,83,0,0,596,598,5,95,0,0,597,596,1,0,0,0,598,601,
        1,0,0,0,599,597,1,0,0,0,599,600,1,0,0,0,600,602,1,0,0,0,601,599,
        1,0,0,0,602,606,3,86,43,0,603,605,5,95,0,0,604,603,1,0,0,0,605,608,
        1,0,0,0,606,604,1,0,0,0,606,607,1,0,0,0,607,609,1,0,0,0,608,606,
        1,0,0,0,609,610,5,25,0,0,610,53,1,0,0,0,611,612,5,26,0,0,612,613,
        3,8,4,0,613,615,5,82,0,0,614,616,3,56,28,0,615,614,1,0,0,0,615,616,
        1,0,0,0,616,617,1,0,0,0,617,618,5,83,0,0,618,619,5,28,0,0,619,623,
        3,12,6,0,620,622,5,95,0,0,621,620,1,0,0,0,622,625,1,0,0,0,623,621,
        1,0,0,0,623,624,1,0,0,0,624,626,1,0,0,0,625,623,1,0,0,0,626,630,
        3,86,43,0,627,629,5,95,0,0,628,627,1,0,0,0,629,632,1,0,0,0,630,628,
        1,0,0,0,630,631,1,0,0,0,631,633,1,0,0,0,632,630,1,0,0,0,633,634,
        5,27,0,0,634,55,1,0,0,0,635,640,3,58,29,0,636,637,5,86,0,0,637,639,
        3,58,29,0,638,636,1,0,0,0,639,642,1,0,0,0,640,638,1,0,0,0,640,641,
        1,0,0,0,641,57,1,0,0,0,642,640,1,0,0,0,643,645,7,4,0,0,644,643,1,
        0,0,0,644,645,1,0,0,0,645,646,1,0,0,0,646,647,3,8,4,0,647,648,5,
        87,0,0,648,649,3,12,6,0,649,59,1,0,0,0,650,651,5,30,0,0,651,652,
        3,8,4,0,652,654,5,82,0,0,653,655,3,84,42,0,654,653,1,0,0,0,654,655,
        1,0,0,0,655,656,1,0,0,0,656,657,5,83,0,0,657,661,1,0,0,0,658,659,
        5,30,0,0,659,661,3,62,31,0,660,650,1,0,0,0,660,658,1,0,0,0,661,61,
        1,0,0,0,662,665,3,8,4,0,663,665,5,62,0,0,664,662,1,0,0,0,664,663,
        1,0,0,0,665,669,1,0,0,0,666,668,3,24,12,0,667,666,1,0,0,0,668,671,
        1,0,0,0,669,667,1,0,0,0,669,670,1,0,0,0,670,672,1,0,0,0,671,669,
        1,0,0,0,672,673,5,88,0,0,673,674,3,26,13,0,674,676,5,82,0,0,675,
        677,3,84,42,0,676,675,1,0,0,0,676,677,1,0,0,0,677,678,1,0,0,0,678,
        679,5,83,0,0,679,63,1,0,0,0,680,681,3,62,31,0,681,65,1,0,0,0,682,
        683,5,29,0,0,683,684,3,88,44,0,684,67,1,0,0,0,685,686,5,39,0,0,686,
        687,3,88,44,0,687,688,5,15,0,0,688,689,3,82,41,0,689,69,1,0,0,0,
        690,691,5,40,0,0,691,692,3,88,44,0,692,693,5,86,0,0,693,694,3,22,
        11,0,694,71,1,0,0,0,695,696,5,41,0,0,696,697,3,88,44,0,697,698,5,
        86,0,0,698,699,3,88,44,0,699,73,1,0,0,0,700,701,5,42,0,0,701,702,
        3,88,44,0,702,75,1,0,0,0,703,704,5,47,0,0,704,705,3,88,44,0,705,
        706,5,86,0,0,706,707,3,88,44,0,707,77,1,0,0,0,708,709,5,48,0,0,709,
        710,3,88,44,0,710,711,5,86,0,0,711,712,3,22,11,0,712,79,1,0,0,0,
        713,714,5,49,0,0,714,715,3,88,44,0,715,716,5,86,0,0,716,717,3,22,
        11,0,717,81,1,0,0,0,718,719,7,5,0,0,719,83,1,0,0,0,720,725,3,88,
        44,0,721,722,5,86,0,0,722,724,3,88,44,0,723,721,1,0,0,0,724,727,
        1,0,0,0,725,723,1,0,0,0,725,726,1,0,0,0,726,85,1,0,0,0,727,725,1,
        0,0,0,728,738,3,2,1,0,729,731,5,95,0,0,730,729,1,0,0,0,731,734,1,
        0,0,0,732,730,1,0,0,0,732,733,1,0,0,0,733,735,1,0,0,0,734,732,1,
        0,0,0,735,737,3,2,1,0,736,732,1,0,0,0,737,740,1,0,0,0,738,736,1,
        0,0,0,738,739,1,0,0,0,739,742,1,0,0,0,740,738,1,0,0,0,741,728,1,
        0,0,0,741,742,1,0,0,0,742,87,1,0,0,0,743,744,6,44,-1,0,744,745,5,
        34,0,0,745,750,3,88,44,10,746,747,5,77,0,0,747,750,3,88,44,9,748,
        750,3,90,45,0,749,743,1,0,0,0,749,746,1,0,0,0,749,748,1,0,0,0,750,
        774,1,0,0,0,751,752,10,8,0,0,752,753,5,80,0,0,753,773,3,88,44,8,
        754,755,10,7,0,0,755,756,7,6,0,0,756,773,3,88,44,8,757,758,10,6,
        0,0,758,759,7,7,0,0,759,773,3,88,44,7,760,761,10,5,0,0,761,762,5,
        81,0,0,762,773,3,88,44,6,763,764,10,4,0,0,764,765,7,8,0,0,765,773,
        3,88,44,5,766,767,10,3,0,0,767,768,5,32,0,0,768,773,3,88,44,4,769,
        770,10,2,0,0,770,771,5,33,0,0,771,773,3,88,44,3,772,751,1,0,0,0,
        772,754,1,0,0,0,772,757,1,0,0,0,772,760,1,0,0,0,772,763,1,0,0,0,
        772,766,1,0,0,0,772,769,1,0,0,0,773,776,1,0,0,0,774,772,1,0,0,0,
        774,775,1,0,0,0,775,89,1,0,0,0,776,774,1,0,0,0,777,778,5,82,0,0,
        778,779,3,88,44,0,779,780,5,83,0,0,780,820,1,0,0,0,781,782,3,8,4,
        0,782,784,5,82,0,0,783,785,3,84,42,0,784,783,1,0,0,0,784,785,1,0,
        0,0,785,786,1,0,0,0,786,787,5,83,0,0,787,820,1,0,0,0,788,789,5,61,
        0,0,789,790,5,94,0,0,790,792,5,82,0,0,791,793,3,84,42,0,792,791,
        1,0,0,0,792,793,1,0,0,0,793,794,1,0,0,0,794,820,5,83,0,0,795,796,
        5,80,0,0,796,820,3,22,11,0,797,798,5,38,0,0,798,799,5,82,0,0,799,
        800,3,88,44,0,800,801,5,86,0,0,801,802,3,88,44,0,802,803,5,83,0,
        0,803,820,1,0,0,0,804,805,5,37,0,0,805,806,5,82,0,0,806,807,3,88,
        44,0,807,808,5,86,0,0,808,809,3,88,44,0,809,810,5,83,0,0,810,820,
        1,0,0,0,811,820,3,22,11,0,812,820,5,91,0,0,813,820,5,90,0,0,814,
        820,5,89,0,0,815,820,5,92,0,0,816,820,5,93,0,0,817,820,5,35,0,0,
        818,820,5,36,0,0,819,777,1,0,0,0,819,781,1,0,0,0,819,788,1,0,0,0,
        819,795,1,0,0,0,819,797,1,0,0,0,819,804,1,0,0,0,819,811,1,0,0,0,
        819,812,1,0,0,0,819,813,1,0,0,0,819,814,1,0,0,0,819,815,1,0,0,0,
        819,816,1,0,0,0,819,817,1,0,0,0,819,818,1,0,0,0,820,91,1,0,0,0,89,
        95,102,108,111,116,146,181,188,214,218,223,248,254,258,262,268,278,
        283,289,293,299,302,309,313,316,320,325,334,343,346,349,358,369,
        379,387,391,396,403,409,415,419,424,431,437,444,448,453,464,470,
        474,479,486,489,494,504,511,518,524,534,539,546,555,560,567,576,
        583,593,599,606,615,623,630,640,644,654,660,664,669,676,725,732,
        738,741,749,772,774,784,792,819
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
    public typeDefinition(): TypeDefinitionContext | null {
        return this.getRuleContext(0, TypeDefinitionContext);
    }
    public defineStatement(): DefineStatementContext | null {
        return this.getRuleContext(0, DefineStatementContext);
    }
    public classDeclaration(): ClassDeclarationContext | null {
        return this.getRuleContext(0, ClassDeclarationContext);
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
    public methodCallStatement(): MethodCallStatementContext | null {
        return this.getRuleContext(0, MethodCallStatementContext);
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
    public seekStatement(): SeekStatementContext | null {
        return this.getRuleContext(0, SeekStatementContext);
    }
    public getRecordStatement(): GetRecordStatementContext | null {
        return this.getRuleContext(0, GetRecordStatementContext);
    }
    public putRecordStatement(): PutRecordStatementContext | null {
        return this.getRuleContext(0, PutRecordStatementContext);
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
    public identifier(): IdentifierContext | null {
        return this.getRuleContext(0, IdentifierContext);
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
    public identifier(): IdentifierContext[];
    public identifier(i: number): IdentifierContext | null;
    public identifier(i?: number): IdentifierContext[] | IdentifierContext | null {
        if (i === undefined) {
            return this.getRuleContexts(IdentifierContext);
        }

        return this.getRuleContext(i, IdentifierContext);
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


export class IdentifierContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public IDENTIFIER(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.IDENTIFIER, 0);
    }
    public TYPE(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.TYPE, 0);
    }
    public SET(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.SET, 0);
    }
    public DATE_TYPE(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.DATE_TYPE, 0);
    }
    public RANDOM(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.RANDOM, 0);
    }
    public NEW(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.NEW, 0);
    }
    public CLASS(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.CLASS, 0);
    }
    public SEEK(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.SEEK, 0);
    }
    public DEFINE(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.DEFINE, 0);
    }
    public INHERITS(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.INHERITS, 0);
    }
    public PUBLIC(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.PUBLIC, 0);
    }
    public PRIVATE(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.PRIVATE, 0);
    }
    public BYREF(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.BYREF, 0);
    }
    public BYVAL(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.BYVAL, 0);
    }
    public GETRECORD(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.GETRECORD, 0);
    }
    public PUTRECORD(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.PUTRECORD, 0);
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_identifier;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterIdentifier) {
             listener.enterIdentifier(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitIdentifier) {
             listener.exitIdentifier(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitIdentifier) {
            return visitor.visitIdentifier(this);
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
    public identifier(): IdentifierContext {
        return this.getRuleContext(0, IdentifierContext)!;
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
    public DATE_TYPE(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.DATE_TYPE, 0);
    }
    public ARRAY(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.ARRAY, 0);
    }
    public OF(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.OF, 0);
    }
    public dataType(): DataTypeContext | null {
        return this.getRuleContext(0, DataTypeContext);
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
    public COLON(): antlr.TerminalNode[];
    public COLON(i: number): antlr.TerminalNode | null;
    public COLON(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.COLON);
    	} else {
    		return this.getToken(PseudocodeParser.COLON, i);
    	}
    }
    public RBRACKET(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.RBRACKET, 0);
    }
    public COMMA(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.COMMA, 0);
    }
    public IDENTIFIER(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.IDENTIFIER, 0);
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


export class TypeDefinitionContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_typeDefinition;
    }
    public override copyFrom(ctx: TypeDefinitionContext): void {
        super.copyFrom(ctx);
    }
}
export class EnumTypeDefContext extends TypeDefinitionContext {
    public constructor(ctx: TypeDefinitionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public TYPE(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.TYPE, 0)!;
    }
    public IDENTIFIER(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.IDENTIFIER, 0)!;
    }
    public EQUALS(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.EQUALS, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.LPAREN, 0)!;
    }
    public identifierList(): IdentifierListContext {
        return this.getRuleContext(0, IdentifierListContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.RPAREN, 0)!;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterEnumTypeDef) {
             listener.enterEnumTypeDef(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitEnumTypeDef) {
             listener.exitEnumTypeDef(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitEnumTypeDef) {
            return visitor.visitEnumTypeDef(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class PointerTypeDefContext extends TypeDefinitionContext {
    public constructor(ctx: TypeDefinitionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public TYPE(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.TYPE, 0)!;
    }
    public IDENTIFIER(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.IDENTIFIER, 0)!;
    }
    public EQUALS(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.EQUALS, 0)!;
    }
    public CARET(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.CARET, 0)!;
    }
    public dataType(): DataTypeContext {
        return this.getRuleContext(0, DataTypeContext)!;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterPointerTypeDef) {
             listener.enterPointerTypeDef(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitPointerTypeDef) {
             listener.exitPointerTypeDef(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitPointerTypeDef) {
            return visitor.visitPointerTypeDef(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class SetTypeDefContext extends TypeDefinitionContext {
    public constructor(ctx: TypeDefinitionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public TYPE(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.TYPE, 0)!;
    }
    public IDENTIFIER(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.IDENTIFIER, 0)!;
    }
    public EQUALS(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.EQUALS, 0)!;
    }
    public SET(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.SET, 0)!;
    }
    public OF(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.OF, 0)!;
    }
    public dataType(): DataTypeContext {
        return this.getRuleContext(0, DataTypeContext)!;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterSetTypeDef) {
             listener.enterSetTypeDef(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitSetTypeDef) {
             listener.exitSetTypeDef(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitSetTypeDef) {
            return visitor.visitSetTypeDef(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class RecordTypeDefContext extends TypeDefinitionContext {
    public constructor(ctx: TypeDefinitionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public TYPE(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.TYPE, 0)!;
    }
    public IDENTIFIER(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.IDENTIFIER, 0)!;
    }
    public ENDTYPE(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.ENDTYPE, 0)!;
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
    public declareStatement(): DeclareStatementContext[];
    public declareStatement(i: number): DeclareStatementContext | null;
    public declareStatement(i?: number): DeclareStatementContext[] | DeclareStatementContext | null {
        if (i === undefined) {
            return this.getRuleContexts(DeclareStatementContext);
        }

        return this.getRuleContext(i, DeclareStatementContext);
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterRecordTypeDef) {
             listener.enterRecordTypeDef(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitRecordTypeDef) {
             listener.exitRecordTypeDef(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitRecordTypeDef) {
            return visitor.visitRecordTypeDef(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class DefineStatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public DEFINE(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.DEFINE, 0)!;
    }
    public identifier(): IdentifierContext {
        return this.getRuleContext(0, IdentifierContext)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.LPAREN, 0)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.RPAREN, 0)!;
    }
    public COLON(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.COLON, 0)!;
    }
    public IDENTIFIER(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.IDENTIFIER, 0)!;
    }
    public exprList(): ExprListContext | null {
        return this.getRuleContext(0, ExprListContext);
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_defineStatement;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterDefineStatement) {
             listener.enterDefineStatement(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitDefineStatement) {
             listener.exitDefineStatement(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitDefineStatement) {
            return visitor.visitDefineStatement(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ClassDeclarationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public CLASS(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.CLASS, 0)!;
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
    public ENDCLASS(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.ENDCLASS, 0)!;
    }
    public INHERITS(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.INHERITS, 0);
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
    public classMember(): ClassMemberContext[];
    public classMember(i: number): ClassMemberContext | null;
    public classMember(i?: number): ClassMemberContext[] | ClassMemberContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ClassMemberContext);
        }

        return this.getRuleContext(i, ClassMemberContext);
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_classDeclaration;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterClassDeclaration) {
             listener.enterClassDeclaration(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitClassDeclaration) {
             listener.exitClassDeclaration(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitClassDeclaration) {
            return visitor.visitClassDeclaration(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ClassMemberContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_classMember;
    }
    public override copyFrom(ctx: ClassMemberContext): void {
        super.copyFrom(ctx);
    }
}
export class ClassProcMemberContext extends ClassMemberContext {
    public constructor(ctx: ClassMemberContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public procedureDeclaration(): ProcedureDeclarationContext {
        return this.getRuleContext(0, ProcedureDeclarationContext)!;
    }
    public PUBLIC(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.PUBLIC, 0);
    }
    public PRIVATE(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.PRIVATE, 0);
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterClassProcMember) {
             listener.enterClassProcMember(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitClassProcMember) {
             listener.exitClassProcMember(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitClassProcMember) {
            return visitor.visitClassProcMember(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class ClassFuncMemberContext extends ClassMemberContext {
    public constructor(ctx: ClassMemberContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public functionDeclaration(): FunctionDeclarationContext {
        return this.getRuleContext(0, FunctionDeclarationContext)!;
    }
    public PUBLIC(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.PUBLIC, 0);
    }
    public PRIVATE(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.PRIVATE, 0);
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterClassFuncMember) {
             listener.enterClassFuncMember(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitClassFuncMember) {
             listener.exitClassFuncMember(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitClassFuncMember) {
            return visitor.visitClassFuncMember(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class ClassFieldMemberContext extends ClassMemberContext {
    public constructor(ctx: ClassMemberContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public identifierList(): IdentifierListContext {
        return this.getRuleContext(0, IdentifierListContext)!;
    }
    public COLON(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.COLON, 0)!;
    }
    public dataType(): DataTypeContext {
        return this.getRuleContext(0, DataTypeContext)!;
    }
    public DECLARE(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.DECLARE, 0);
    }
    public PUBLIC(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.PUBLIC, 0);
    }
    public PRIVATE(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.PRIVATE, 0);
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterClassFieldMember) {
             listener.enterClassFieldMember(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitClassFieldMember) {
             listener.exitClassFieldMember(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitClassFieldMember) {
            return visitor.visitClassFieldMember(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class DesignatorContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public identifier(): IdentifierContext | null {
        return this.getRuleContext(0, IdentifierContext);
    }
    public SUPER(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.SUPER, 0);
    }
    public designatorPart(): DesignatorPartContext[];
    public designatorPart(i: number): DesignatorPartContext | null;
    public designatorPart(i?: number): DesignatorPartContext[] | DesignatorPartContext | null {
        if (i === undefined) {
            return this.getRuleContexts(DesignatorPartContext);
        }

        return this.getRuleContext(i, DesignatorPartContext);
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_designator;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterDesignator) {
             listener.enterDesignator(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitDesignator) {
             listener.exitDesignator(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitDesignator) {
            return visitor.visitDesignator(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class DesignatorPartContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
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
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.COMMA);
    	} else {
    		return this.getToken(PseudocodeParser.COMMA, i);
    	}
    }
    public DOT(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.DOT, 0);
    }
    public memberName(): MemberNameContext | null {
        return this.getRuleContext(0, MemberNameContext);
    }
    public LPAREN(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.LPAREN, 0);
    }
    public RPAREN(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.RPAREN, 0);
    }
    public argList(): ArgListContext | null {
        return this.getRuleContext(0, ArgListContext);
    }
    public CARET(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.CARET, 0);
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_designatorPart;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterDesignatorPart) {
             listener.enterDesignatorPart(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitDesignatorPart) {
             listener.exitDesignatorPart(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitDesignatorPart) {
            return visitor.visitDesignatorPart(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class MemberNameContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public identifier(): IdentifierContext {
        return this.getRuleContext(0, IdentifierContext)!;
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_memberName;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterMemberName) {
             listener.enterMemberName(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitMemberName) {
             listener.exitMemberName(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitMemberName) {
            return visitor.visitMemberName(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class AssignmentStatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public singleAssignment(): SingleAssignmentContext[];
    public singleAssignment(i: number): SingleAssignmentContext | null;
    public singleAssignment(i?: number): SingleAssignmentContext[] | SingleAssignmentContext | null {
        if (i === undefined) {
            return this.getRuleContexts(SingleAssignmentContext);
        }

        return this.getRuleContext(i, SingleAssignmentContext);
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


export class SingleAssignmentContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public designator(): DesignatorContext {
        return this.getRuleContext(0, DesignatorContext)!;
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
        return PseudocodeParser.RULE_singleAssignment;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterSingleAssignment) {
             listener.enterSingleAssignment(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitSingleAssignment) {
             listener.exitSingleAssignment(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitSingleAssignment) {
            return visitor.visitSingleAssignment(this);
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
    public designator(): DesignatorContext {
        return this.getRuleContext(0, DesignatorContext)!;
    }
    public COMMA(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.COMMA, 0);
    }
    public STRING_LITERAL(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.STRING_LITERAL, 0);
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
    public IF(): antlr.TerminalNode[];
    public IF(i: number): antlr.TerminalNode | null;
    public IF(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.IF);
    	} else {
    		return this.getToken(PseudocodeParser.IF, i);
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
    public ELSE(): antlr.TerminalNode[];
    public ELSE(i: number): antlr.TerminalNode | null;
    public ELSE(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.ELSE);
    	} else {
    		return this.getToken(PseudocodeParser.ELSE, i);
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
    public designator(): DesignatorContext {
        return this.getRuleContext(0, DesignatorContext)!;
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
    public block(): BlockContext | null {
        return this.getRuleContext(0, BlockContext);
    }
    public COLON(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.COLON, 0);
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
    public caseLabel(): CaseLabelContext[];
    public caseLabel(i: number): CaseLabelContext | null;
    public caseLabel(i?: number): CaseLabelContext[] | CaseLabelContext | null {
        if (i === undefined) {
            return this.getRuleContexts(CaseLabelContext);
        }

        return this.getRuleContext(i, CaseLabelContext);
    }
    public COLON(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.COLON, 0)!;
    }
    public block(): BlockContext {
        return this.getRuleContext(0, BlockContext)!;
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


export class CaseLabelContext extends antlr.ParserRuleContext {
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
    public TO(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.TO, 0);
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_caseLabel;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterCaseLabel) {
             listener.enterCaseLabel(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitCaseLabel) {
             listener.exitCaseLabel(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitCaseLabel) {
            return visitor.visitCaseLabel(this);
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
    public identifier(): IdentifierContext[];
    public identifier(i: number): IdentifierContext | null;
    public identifier(i?: number): IdentifierContext[] | IdentifierContext | null {
        if (i === undefined) {
            return this.getRuleContexts(IdentifierContext);
        }

        return this.getRuleContext(i, IdentifierContext);
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
    public identifier(): IdentifierContext {
        return this.getRuleContext(0, IdentifierContext)!;
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
    public identifier(): IdentifierContext {
        return this.getRuleContext(0, IdentifierContext)!;
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
    public identifier(): IdentifierContext {
        return this.getRuleContext(0, IdentifierContext)!;
    }
    public COLON(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.COLON, 0)!;
    }
    public dataType(): DataTypeContext {
        return this.getRuleContext(0, DataTypeContext)!;
    }
    public BYREF(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.BYREF, 0);
    }
    public BYVAL(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.BYVAL, 0);
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
    public identifier(): IdentifierContext | null {
        return this.getRuleContext(0, IdentifierContext);
    }
    public LPAREN(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.LPAREN, 0);
    }
    public RPAREN(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.RPAREN, 0);
    }
    public argList(): ArgListContext | null {
        return this.getRuleContext(0, ArgListContext);
    }
    public methodCall(): MethodCallContext | null {
        return this.getRuleContext(0, MethodCallContext);
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


export class MethodCallContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public DOT(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.DOT, 0)!;
    }
    public memberName(): MemberNameContext {
        return this.getRuleContext(0, MemberNameContext)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.LPAREN, 0)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.RPAREN, 0)!;
    }
    public identifier(): IdentifierContext | null {
        return this.getRuleContext(0, IdentifierContext);
    }
    public SUPER(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.SUPER, 0);
    }
    public designatorPart(): DesignatorPartContext[];
    public designatorPart(i: number): DesignatorPartContext | null;
    public designatorPart(i?: number): DesignatorPartContext[] | DesignatorPartContext | null {
        if (i === undefined) {
            return this.getRuleContexts(DesignatorPartContext);
        }

        return this.getRuleContext(i, DesignatorPartContext);
    }
    public argList(): ArgListContext | null {
        return this.getRuleContext(0, ArgListContext);
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_methodCall;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterMethodCall) {
             listener.enterMethodCall(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitMethodCall) {
             listener.exitMethodCall(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitMethodCall) {
            return visitor.visitMethodCall(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class MethodCallStatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public methodCall(): MethodCallContext {
        return this.getRuleContext(0, MethodCallContext)!;
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_methodCallStatement;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterMethodCallStatement) {
             listener.enterMethodCallStatement(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitMethodCallStatement) {
             listener.exitMethodCallStatement(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitMethodCallStatement) {
            return visitor.visitMethodCallStatement(this);
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
    public designator(): DesignatorContext {
        return this.getRuleContext(0, DesignatorContext)!;
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


export class SeekStatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public SEEK(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.SEEK, 0)!;
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
        return PseudocodeParser.RULE_seekStatement;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterSeekStatement) {
             listener.enterSeekStatement(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitSeekStatement) {
             listener.exitSeekStatement(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitSeekStatement) {
            return visitor.visitSeekStatement(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class GetRecordStatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public GETRECORD(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.GETRECORD, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public COMMA(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.COMMA, 0)!;
    }
    public designator(): DesignatorContext {
        return this.getRuleContext(0, DesignatorContext)!;
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_getRecordStatement;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterGetRecordStatement) {
             listener.enterGetRecordStatement(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitGetRecordStatement) {
             listener.exitGetRecordStatement(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitGetRecordStatement) {
            return visitor.visitGetRecordStatement(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class PutRecordStatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public PUTRECORD(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.PUTRECORD, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public COMMA(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.COMMA, 0)!;
    }
    public designator(): DesignatorContext {
        return this.getRuleContext(0, DesignatorContext)!;
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_putRecordStatement;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterPutRecordStatement) {
             listener.enterPutRecordStatement(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitPutRecordStatement) {
             listener.exitPutRecordStatement(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitPutRecordStatement) {
            return visitor.visitPutRecordStatement(this);
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
    public RANDOM(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.RANDOM, 0);
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
export class DateAtomContext extends AtomContext {
    public constructor(ctx: AtomContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public DATE_LITERAL(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.DATE_LITERAL, 0)!;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterDateAtom) {
             listener.enterDateAtom(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitDateAtom) {
             listener.exitDateAtom(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitDateAtom) {
            return visitor.visitDateAtom(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class AddressOfAtomContext extends AtomContext {
    public constructor(ctx: AtomContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public CARET(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.CARET, 0)!;
    }
    public designator(): DesignatorContext {
        return this.getRuleContext(0, DesignatorContext)!;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterAddressOfAtom) {
             listener.enterAddressOfAtom(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitAddressOfAtom) {
             listener.exitAddressOfAtom(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitAddressOfAtom) {
            return visitor.visitAddressOfAtom(this);
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
export class DesignatorAtomContext extends AtomContext {
    public constructor(ctx: AtomContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public designator(): DesignatorContext {
        return this.getRuleContext(0, DesignatorContext)!;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterDesignatorAtom) {
             listener.enterDesignatorAtom(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitDesignatorAtom) {
             listener.exitDesignatorAtom(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitDesignatorAtom) {
            return visitor.visitDesignatorAtom(this);
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
export class FunctionCallAtomContext extends AtomContext {
    public constructor(ctx: AtomContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public identifier(): IdentifierContext {
        return this.getRuleContext(0, IdentifierContext)!;
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
export class NewInstanceAtomContext extends AtomContext {
    public constructor(ctx: AtomContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public NEW(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.NEW, 0)!;
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
        if(listener.enterNewInstanceAtom) {
             listener.enterNewInstanceAtom(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitNewInstanceAtom) {
             listener.exitNewInstanceAtom(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitNewInstanceAtom) {
            return visitor.visitNewInstanceAtom(this);
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
