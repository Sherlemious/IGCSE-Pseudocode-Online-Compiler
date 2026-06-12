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
    public static readonly RULE_constantStatement = 4;
    public static readonly RULE_dataType = 5;
    public static readonly RULE_typeDefinition = 6;
    public static readonly RULE_defineStatement = 7;
    public static readonly RULE_classDeclaration = 8;
    public static readonly RULE_classMember = 9;
    public static readonly RULE_designator = 10;
    public static readonly RULE_designatorPart = 11;
    public static readonly RULE_memberName = 12;
    public static readonly RULE_assignmentStatement = 13;
    public static readonly RULE_singleAssignment = 14;
    public static readonly RULE_inputStatement = 15;
    public static readonly RULE_outputStatement = 16;
    public static readonly RULE_exprList = 17;
    public static readonly RULE_ifStatement = 18;
    public static readonly RULE_caseStatement = 19;
    public static readonly RULE_caseClause = 20;
    public static readonly RULE_caseLabel = 21;
    public static readonly RULE_forStatement = 22;
    public static readonly RULE_whileStatement = 23;
    public static readonly RULE_repeatStatement = 24;
    public static readonly RULE_procedureDeclaration = 25;
    public static readonly RULE_functionDeclaration = 26;
    public static readonly RULE_paramList = 27;
    public static readonly RULE_param = 28;
    public static readonly RULE_callStatement = 29;
    public static readonly RULE_methodCall = 30;
    public static readonly RULE_methodCallStatement = 31;
    public static readonly RULE_returnStatement = 32;
    public static readonly RULE_openFileStatement = 33;
    public static readonly RULE_readFileStatement = 34;
    public static readonly RULE_writeFileStatement = 35;
    public static readonly RULE_closeFileStatement = 36;
    public static readonly RULE_seekStatement = 37;
    public static readonly RULE_getRecordStatement = 38;
    public static readonly RULE_putRecordStatement = 39;
    public static readonly RULE_fileMode = 40;
    public static readonly RULE_argList = 41;
    public static readonly RULE_block = 42;
    public static readonly RULE_expr = 43;
    public static readonly RULE_atom = 44;

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
        "program", "statement", "declareStatement", "identifierList", "constantStatement", 
        "dataType", "typeDefinition", "defineStatement", "classDeclaration", 
        "classMember", "designator", "designatorPart", "memberName", "assignmentStatement", 
        "singleAssignment", "inputStatement", "outputStatement", "exprList", 
        "ifStatement", "caseStatement", "caseClause", "caseLabel", "forStatement", 
        "whileStatement", "repeatStatement", "procedureDeclaration", "functionDeclaration", 
        "paramList", "param", "callStatement", "methodCall", "methodCallStatement", 
        "returnStatement", "openFileStatement", "readFileStatement", "writeFileStatement", 
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
            this.state = 93;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 0, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 90;
                    this.match(PseudocodeParser.NEWLINE);
                    }
                    }
                }
                this.state = 95;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 0, this.context);
            }
            this.state = 109;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 1699252350) !== 0) || ((((_la - 39)) & ~0x1F) === 0 && ((1 << (_la - 39)) & 8539919) !== 0) || _la === 94) {
                {
                this.state = 96;
                this.statement();
                this.state = 106;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 2, this.context);
                while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                    if (alternative === 1) {
                        {
                        {
                        this.state = 100;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                        while (_la === 95) {
                            {
                            {
                            this.state = 97;
                            this.match(PseudocodeParser.NEWLINE);
                            }
                            }
                            this.state = 102;
                            this.errorHandler.sync(this);
                            _la = this.tokenStream.LA(1);
                        }
                        this.state = 103;
                        this.statement();
                        }
                        }
                    }
                    this.state = 108;
                    this.errorHandler.sync(this);
                    alternative = this.interpreter.adaptivePredict(this.tokenStream, 2, this.context);
                }
                }
            }

            this.state = 114;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 95) {
                {
                {
                this.state = 111;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 116;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 117;
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
            this.state = 144;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 5, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 119;
                this.declareStatement();
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 120;
                this.constantStatement();
                }
                break;
            case 3:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 121;
                this.typeDefinition();
                }
                break;
            case 4:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 122;
                this.defineStatement();
                }
                break;
            case 5:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 123;
                this.classDeclaration();
                }
                break;
            case 6:
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 124;
                this.assignmentStatement();
                }
                break;
            case 7:
                this.enterOuterAlt(localContext, 7);
                {
                this.state = 125;
                this.inputStatement();
                }
                break;
            case 8:
                this.enterOuterAlt(localContext, 8);
                {
                this.state = 126;
                this.outputStatement();
                }
                break;
            case 9:
                this.enterOuterAlt(localContext, 9);
                {
                this.state = 127;
                this.ifStatement();
                }
                break;
            case 10:
                this.enterOuterAlt(localContext, 10);
                {
                this.state = 128;
                this.caseStatement();
                }
                break;
            case 11:
                this.enterOuterAlt(localContext, 11);
                {
                this.state = 129;
                this.forStatement();
                }
                break;
            case 12:
                this.enterOuterAlt(localContext, 12);
                {
                this.state = 130;
                this.whileStatement();
                }
                break;
            case 13:
                this.enterOuterAlt(localContext, 13);
                {
                this.state = 131;
                this.repeatStatement();
                }
                break;
            case 14:
                this.enterOuterAlt(localContext, 14);
                {
                this.state = 132;
                this.procedureDeclaration();
                }
                break;
            case 15:
                this.enterOuterAlt(localContext, 15);
                {
                this.state = 133;
                this.functionDeclaration();
                }
                break;
            case 16:
                this.enterOuterAlt(localContext, 16);
                {
                this.state = 134;
                this.callStatement();
                }
                break;
            case 17:
                this.enterOuterAlt(localContext, 17);
                {
                this.state = 135;
                this.methodCallStatement();
                }
                break;
            case 18:
                this.enterOuterAlt(localContext, 18);
                {
                this.state = 136;
                this.returnStatement();
                }
                break;
            case 19:
                this.enterOuterAlt(localContext, 19);
                {
                this.state = 137;
                this.openFileStatement();
                }
                break;
            case 20:
                this.enterOuterAlt(localContext, 20);
                {
                this.state = 138;
                this.readFileStatement();
                }
                break;
            case 21:
                this.enterOuterAlt(localContext, 21);
                {
                this.state = 139;
                this.writeFileStatement();
                }
                break;
            case 22:
                this.enterOuterAlt(localContext, 22);
                {
                this.state = 140;
                this.closeFileStatement();
                }
                break;
            case 23:
                this.enterOuterAlt(localContext, 23);
                {
                this.state = 141;
                this.seekStatement();
                }
                break;
            case 24:
                this.enterOuterAlt(localContext, 24);
                {
                this.state = 142;
                this.getRecordStatement();
                }
                break;
            case 25:
                this.enterOuterAlt(localContext, 25);
                {
                this.state = 143;
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
            this.state = 179;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 6, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 146;
                this.match(PseudocodeParser.DECLARE);
                this.state = 147;
                this.identifierList();
                this.state = 148;
                this.match(PseudocodeParser.COLON);
                this.state = 149;
                this.match(PseudocodeParser.ARRAY);
                this.state = 150;
                this.match(PseudocodeParser.LBRACKET);
                this.state = 151;
                this.expr(0);
                this.state = 152;
                this.match(PseudocodeParser.COLON);
                this.state = 153;
                this.expr(0);
                this.state = 154;
                this.match(PseudocodeParser.RBRACKET);
                this.state = 155;
                this.match(PseudocodeParser.OF);
                this.state = 156;
                this.dataType();
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 158;
                this.match(PseudocodeParser.DECLARE);
                this.state = 159;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 160;
                this.match(PseudocodeParser.COLON);
                this.state = 161;
                this.match(PseudocodeParser.ARRAY);
                this.state = 162;
                this.match(PseudocodeParser.LBRACKET);
                this.state = 163;
                this.expr(0);
                this.state = 164;
                this.match(PseudocodeParser.COLON);
                this.state = 165;
                this.expr(0);
                this.state = 166;
                this.match(PseudocodeParser.COMMA);
                this.state = 167;
                this.expr(0);
                this.state = 168;
                this.match(PseudocodeParser.COLON);
                this.state = 169;
                this.expr(0);
                this.state = 170;
                this.match(PseudocodeParser.RBRACKET);
                this.state = 171;
                this.match(PseudocodeParser.OF);
                this.state = 172;
                this.dataType();
                }
                break;
            case 3:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 174;
                this.match(PseudocodeParser.DECLARE);
                this.state = 175;
                this.identifierList();
                this.state = 176;
                this.match(PseudocodeParser.COLON);
                this.state = 177;
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
            this.state = 181;
            this.match(PseudocodeParser.IDENTIFIER);
            this.state = 186;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 86) {
                {
                {
                this.state = 182;
                this.match(PseudocodeParser.COMMA);
                this.state = 183;
                this.match(PseudocodeParser.IDENTIFIER);
                }
                }
                this.state = 188;
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
            this.state = 189;
            this.match(PseudocodeParser.CONSTANT);
            this.state = 190;
            this.match(PseudocodeParser.IDENTIFIER);
            this.state = 191;
            _la = this.tokenStream.LA(1);
            if(!(_la === 69 || _la === 70)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            this.state = 192;
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
            this.state = 219;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case PseudocodeParser.INTEGER_TYPE:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 194;
                this.match(PseudocodeParser.INTEGER_TYPE);
                }
                break;
            case PseudocodeParser.REAL_TYPE:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 195;
                this.match(PseudocodeParser.REAL_TYPE);
                }
                break;
            case PseudocodeParser.CHAR_TYPE:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 196;
                this.match(PseudocodeParser.CHAR_TYPE);
                }
                break;
            case PseudocodeParser.STRING_TYPE:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 197;
                this.match(PseudocodeParser.STRING_TYPE);
                }
                break;
            case PseudocodeParser.BOOLEAN_TYPE:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 198;
                this.match(PseudocodeParser.BOOLEAN_TYPE);
                }
                break;
            case PseudocodeParser.DATE_TYPE:
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 199;
                this.match(PseudocodeParser.DATE_TYPE);
                }
                break;
            case PseudocodeParser.ARRAY:
                this.enterOuterAlt(localContext, 7);
                {
                this.state = 200;
                this.match(PseudocodeParser.ARRAY);
                this.state = 214;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 84) {
                    {
                    this.state = 201;
                    this.match(PseudocodeParser.LBRACKET);
                    this.state = 202;
                    this.expr(0);
                    this.state = 203;
                    this.match(PseudocodeParser.COLON);
                    this.state = 204;
                    this.expr(0);
                    this.state = 210;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    if (_la === 86) {
                        {
                        this.state = 205;
                        this.match(PseudocodeParser.COMMA);
                        this.state = 206;
                        this.expr(0);
                        this.state = 207;
                        this.match(PseudocodeParser.COLON);
                        this.state = 208;
                        this.expr(0);
                        }
                    }

                    this.state = 212;
                    this.match(PseudocodeParser.RBRACKET);
                    }
                }

                this.state = 216;
                this.match(PseudocodeParser.OF);
                this.state = 217;
                this.dataType();
                }
                break;
            case PseudocodeParser.IDENTIFIER:
                this.enterOuterAlt(localContext, 8);
                {
                this.state = 218;
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
        this.enterRule(localContext, 12, PseudocodeParser.RULE_typeDefinition);
        let _la: number;
        try {
            this.state = 258;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 14, this.context) ) {
            case 1:
                localContext = new EnumTypeDefContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 221;
                this.match(PseudocodeParser.TYPE);
                this.state = 222;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 223;
                this.match(PseudocodeParser.EQUALS);
                this.state = 224;
                this.match(PseudocodeParser.LPAREN);
                this.state = 225;
                this.identifierList();
                this.state = 226;
                this.match(PseudocodeParser.RPAREN);
                }
                break;
            case 2:
                localContext = new PointerTypeDefContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 228;
                this.match(PseudocodeParser.TYPE);
                this.state = 229;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 230;
                this.match(PseudocodeParser.EQUALS);
                this.state = 231;
                this.match(PseudocodeParser.CARET);
                this.state = 232;
                this.dataType();
                }
                break;
            case 3:
                localContext = new SetTypeDefContext(localContext);
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 233;
                this.match(PseudocodeParser.TYPE);
                this.state = 234;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 235;
                this.match(PseudocodeParser.EQUALS);
                this.state = 236;
                this.match(PseudocodeParser.SET);
                this.state = 237;
                this.match(PseudocodeParser.OF);
                this.state = 238;
                this.dataType();
                }
                break;
            case 4:
                localContext = new RecordTypeDefContext(localContext);
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 239;
                this.match(PseudocodeParser.TYPE);
                this.state = 240;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 242;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                do {
                    {
                    {
                    this.state = 241;
                    this.match(PseudocodeParser.NEWLINE);
                    }
                    }
                    this.state = 244;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                } while (_la === 95);
                this.state = 254;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 1) {
                    {
                    {
                    this.state = 246;
                    this.declareStatement();
                    this.state = 248;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    do {
                        {
                        {
                        this.state = 247;
                        this.match(PseudocodeParser.NEWLINE);
                        }
                        }
                        this.state = 250;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                    } while (_la === 95);
                    }
                    }
                    this.state = 256;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 257;
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
        this.enterRule(localContext, 14, PseudocodeParser.RULE_defineStatement);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 260;
            this.match(PseudocodeParser.DEFINE);
            this.state = 261;
            this.match(PseudocodeParser.IDENTIFIER);
            this.state = 262;
            this.match(PseudocodeParser.LPAREN);
            this.state = 264;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & 402657311) !== 0) || ((((_la - 77)) & ~0x1F) === 0 && ((1 << (_la - 77)) & 258089) !== 0)) {
                {
                this.state = 263;
                this.exprList();
                }
            }

            this.state = 266;
            this.match(PseudocodeParser.RPAREN);
            this.state = 267;
            this.match(PseudocodeParser.COLON);
            this.state = 268;
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
        this.enterRule(localContext, 16, PseudocodeParser.RULE_classDeclaration);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 270;
            this.match(PseudocodeParser.CLASS);
            this.state = 271;
            this.match(PseudocodeParser.IDENTIFIER);
            this.state = 274;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 58) {
                {
                this.state = 272;
                this.match(PseudocodeParser.INHERITS);
                this.state = 273;
                this.match(PseudocodeParser.IDENTIFIER);
                }
            }

            this.state = 277;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 276;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 279;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 95);
            this.state = 289;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 83886082) !== 0) || _la === 59 || _la === 60 || _la === 94) {
                {
                {
                this.state = 281;
                this.classMember();
                this.state = 283;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                do {
                    {
                    {
                    this.state = 282;
                    this.match(PseudocodeParser.NEWLINE);
                    }
                    }
                    this.state = 285;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                } while (_la === 95);
                }
                }
                this.state = 291;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 292;
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
        this.enterRule(localContext, 18, PseudocodeParser.RULE_classMember);
        let _la: number;
        try {
            this.state = 312;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 24, this.context) ) {
            case 1:
                localContext = new ClassFieldMemberContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 295;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 59 || _la === 60) {
                    {
                    this.state = 294;
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

                this.state = 298;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 1) {
                    {
                    this.state = 297;
                    this.match(PseudocodeParser.DECLARE);
                    }
                }

                this.state = 300;
                this.identifierList();
                this.state = 301;
                this.match(PseudocodeParser.COLON);
                this.state = 302;
                this.dataType();
                }
                break;
            case 2:
                localContext = new ClassProcMemberContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 305;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 59 || _la === 60) {
                    {
                    this.state = 304;
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

                this.state = 307;
                this.procedureDeclaration();
                }
                break;
            case 3:
                localContext = new ClassFuncMemberContext(localContext);
                this.enterOuterAlt(localContext, 3);
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
        this.enterRule(localContext, 20, PseudocodeParser.RULE_designator);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 314;
            _la = this.tokenStream.LA(1);
            if(!(_la === 62 || _la === 94)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            this.state = 318;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 25, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 315;
                    this.designatorPart();
                    }
                    }
                }
                this.state = 320;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 25, this.context);
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
        this.enterRule(localContext, 22, PseudocodeParser.RULE_designatorPart);
        let _la: number;
        try {
            this.state = 342;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case PseudocodeParser.LBRACKET:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 321;
                this.match(PseudocodeParser.LBRACKET);
                this.state = 322;
                this.expr(0);
                this.state = 327;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 86) {
                    {
                    {
                    this.state = 323;
                    this.match(PseudocodeParser.COMMA);
                    this.state = 324;
                    this.expr(0);
                    }
                    }
                    this.state = 329;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 330;
                this.match(PseudocodeParser.RBRACKET);
                }
                break;
            case PseudocodeParser.DOT:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 332;
                this.match(PseudocodeParser.DOT);
                this.state = 333;
                this.memberName();
                this.state = 339;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 28, this.context) ) {
                case 1:
                    {
                    this.state = 334;
                    this.match(PseudocodeParser.LPAREN);
                    this.state = 336;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    if (((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & 402657311) !== 0) || ((((_la - 77)) & ~0x1F) === 0 && ((1 << (_la - 77)) & 258089) !== 0)) {
                        {
                        this.state = 335;
                        this.argList();
                        }
                    }

                    this.state = 338;
                    this.match(PseudocodeParser.RPAREN);
                    }
                    break;
                }
                }
                break;
            case PseudocodeParser.CARET:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 341;
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
        this.enterRule(localContext, 24, PseudocodeParser.RULE_memberName);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 344;
            _la = this.tokenStream.LA(1);
            if(!(_la === 61 || _la === 94)) {
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
        this.enterRule(localContext, 26, PseudocodeParser.RULE_assignmentStatement);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 346;
            this.singleAssignment();
            this.state = 351;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 86) {
                {
                {
                this.state = 347;
                this.match(PseudocodeParser.COMMA);
                this.state = 348;
                this.singleAssignment();
                }
                }
                this.state = 353;
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
        this.enterRule(localContext, 28, PseudocodeParser.RULE_singleAssignment);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 354;
            this.designator();
            this.state = 355;
            _la = this.tokenStream.LA(1);
            if(!(_la === 69 || _la === 70)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            this.state = 356;
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
        this.enterRule(localContext, 30, PseudocodeParser.RULE_inputStatement);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 358;
            this.match(PseudocodeParser.INPUT);
            this.state = 359;
            this.designator();
            this.state = 362;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 86) {
                {
                this.state = 360;
                this.match(PseudocodeParser.COMMA);
                this.state = 361;
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
        this.enterRule(localContext, 32, PseudocodeParser.RULE_outputStatement);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 364;
            _la = this.tokenStream.LA(1);
            if(!(_la === 4 || _la === 5)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            this.state = 365;
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
        this.enterRule(localContext, 34, PseudocodeParser.RULE_exprList);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 367;
            this.expr(0);
            this.state = 372;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 86) {
                {
                {
                this.state = 368;
                this.match(PseudocodeParser.COMMA);
                this.state = 369;
                this.expr(0);
                }
                }
                this.state = 374;
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
        this.enterRule(localContext, 36, PseudocodeParser.RULE_ifStatement);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 375;
            this.match(PseudocodeParser.IF);
            this.state = 376;
            this.expr(0);
            this.state = 380;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 33, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 377;
                    this.match(PseudocodeParser.NEWLINE);
                    }
                    }
                }
                this.state = 382;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 33, this.context);
            }
            this.state = 384;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 7) {
                {
                this.state = 383;
                this.match(PseudocodeParser.THEN);
                }
            }

            this.state = 389;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 95) {
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
            this.state = 420;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 40, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 396;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    while (_la === 95) {
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
                    this.match(PseudocodeParser.ELSEIF);
                    this.state = 400;
                    this.expr(0);
                    this.state = 404;
                    this.errorHandler.sync(this);
                    alternative = this.interpreter.adaptivePredict(this.tokenStream, 37, this.context);
                    while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                        if (alternative === 1) {
                            {
                            {
                            this.state = 401;
                            this.match(PseudocodeParser.NEWLINE);
                            }
                            }
                        }
                        this.state = 406;
                        this.errorHandler.sync(this);
                        alternative = this.interpreter.adaptivePredict(this.tokenStream, 37, this.context);
                    }
                    this.state = 408;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    if (_la === 7) {
                        {
                        this.state = 407;
                        this.match(PseudocodeParser.THEN);
                        }
                    }

                    this.state = 413;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    while (_la === 95) {
                        {
                        {
                        this.state = 410;
                        this.match(PseudocodeParser.NEWLINE);
                        }
                        }
                        this.state = 415;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                    }
                    this.state = 416;
                    this.block();
                    }
                    }
                }
                this.state = 422;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 40, this.context);
            }
            this.state = 437;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 43, this.context) ) {
            case 1:
                {
                this.state = 426;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 95) {
                    {
                    {
                    this.state = 423;
                    this.match(PseudocodeParser.NEWLINE);
                    }
                    }
                    this.state = 428;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 429;
                this.match(PseudocodeParser.ELSE);
                this.state = 433;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 95) {
                    {
                    {
                    this.state = 430;
                    this.match(PseudocodeParser.NEWLINE);
                    }
                    }
                    this.state = 435;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 436;
                this.block();
                }
                break;
            }
            this.state = 442;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 95) {
                {
                {
                this.state = 439;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 444;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 445;
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
        this.enterRule(localContext, 38, PseudocodeParser.RULE_caseStatement);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 447;
            this.match(PseudocodeParser.CASE);
            this.state = 448;
            this.match(PseudocodeParser.OF);
            this.state = 449;
            this.designator();
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
            this.state = 457;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 456;
                this.caseClause();
                }
                }
                this.state = 459;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & 402657311) !== 0) || ((((_la - 77)) & ~0x1F) === 0 && ((1 << (_la - 77)) & 258089) !== 0));
            this.state = 478;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 13) {
                {
                this.state = 461;
                this.match(PseudocodeParser.OTHERWISE);
                this.state = 463;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 87) {
                    {
                    this.state = 462;
                    this.match(PseudocodeParser.COLON);
                    }
                }

                this.state = 468;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 95) {
                    {
                    {
                    this.state = 465;
                    this.match(PseudocodeParser.NEWLINE);
                    }
                    }
                    this.state = 470;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 471;
                this.block();
                this.state = 475;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 49, this.context);
                while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                    if (alternative === 1) {
                        {
                        {
                        this.state = 472;
                        this.match(PseudocodeParser.NEWLINE);
                        }
                        }
                    }
                    this.state = 477;
                    this.errorHandler.sync(this);
                    alternative = this.interpreter.adaptivePredict(this.tokenStream, 49, this.context);
                }
                }
            }

            this.state = 483;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 95) {
                {
                {
                this.state = 480;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 485;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 486;
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
        this.enterRule(localContext, 40, PseudocodeParser.RULE_caseClause);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 488;
            this.caseLabel();
            this.state = 493;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 86) {
                {
                {
                this.state = 489;
                this.match(PseudocodeParser.COMMA);
                this.state = 490;
                this.caseLabel();
                }
                }
                this.state = 495;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 496;
            this.match(PseudocodeParser.COLON);
            this.state = 500;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 95) {
                {
                {
                this.state = 497;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 502;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 503;
            this.block();
            this.state = 507;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 54, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 504;
                    this.match(PseudocodeParser.NEWLINE);
                    }
                    }
                }
                this.state = 509;
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
            this.exitRule();
        }
        return localContext;
    }
    public caseLabel(): CaseLabelContext {
        let localContext = new CaseLabelContext(this.context, this.state);
        this.enterRule(localContext, 42, PseudocodeParser.RULE_caseLabel);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 510;
            this.expr(0);
            this.state = 513;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 16) {
                {
                this.state = 511;
                this.match(PseudocodeParser.TO);
                this.state = 512;
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
        this.enterRule(localContext, 44, PseudocodeParser.RULE_forStatement);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 515;
            this.match(PseudocodeParser.FOR);
            this.state = 516;
            this.match(PseudocodeParser.IDENTIFIER);
            this.state = 517;
            _la = this.tokenStream.LA(1);
            if(!(_la === 69 || _la === 70)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            this.state = 518;
            this.expr(0);
            this.state = 519;
            this.match(PseudocodeParser.TO);
            this.state = 520;
            this.expr(0);
            this.state = 523;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 17) {
                {
                this.state = 521;
                this.match(PseudocodeParser.STEP);
                this.state = 522;
                this.expr(0);
                }
            }

            this.state = 528;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 95) {
                {
                {
                this.state = 525;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 530;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 531;
            this.block();
            this.state = 535;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 95) {
                {
                {
                this.state = 532;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 537;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 538;
            this.match(PseudocodeParser.NEXT);
            this.state = 539;
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
        this.enterRule(localContext, 46, PseudocodeParser.RULE_whileStatement);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 541;
            this.match(PseudocodeParser.WHILE);
            this.state = 542;
            this.expr(0);
            this.state = 544;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 20) {
                {
                this.state = 543;
                this.match(PseudocodeParser.DO);
                }
            }

            this.state = 549;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 95) {
                {
                {
                this.state = 546;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 551;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 552;
            this.block();
            this.state = 556;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 95) {
                {
                {
                this.state = 553;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 558;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 559;
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
        this.enterRule(localContext, 48, PseudocodeParser.RULE_repeatStatement);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 561;
            this.match(PseudocodeParser.REPEAT);
            this.state = 565;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 95) {
                {
                {
                this.state = 562;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 567;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 568;
            this.block();
            this.state = 572;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 95) {
                {
                {
                this.state = 569;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 574;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 575;
            this.match(PseudocodeParser.UNTIL);
            this.state = 576;
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
        this.enterRule(localContext, 50, PseudocodeParser.RULE_procedureDeclaration);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 578;
            this.match(PseudocodeParser.PROCEDURE);
            this.state = 579;
            localContext._name = this.tokenStream.LT(1);
            _la = this.tokenStream.LA(1);
            if(!(_la === 61 || _la === 94)) {
                localContext._name = this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            this.state = 580;
            this.match(PseudocodeParser.LPAREN);
            this.state = 582;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 54 || _la === 55 || _la === 94) {
                {
                this.state = 581;
                this.paramList();
                }
            }

            this.state = 584;
            this.match(PseudocodeParser.RPAREN);
            this.state = 588;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 95) {
                {
                {
                this.state = 585;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 590;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 591;
            this.block();
            this.state = 595;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 95) {
                {
                {
                this.state = 592;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 597;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 598;
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
        this.enterRule(localContext, 52, PseudocodeParser.RULE_functionDeclaration);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 600;
            this.match(PseudocodeParser.FUNCTION);
            this.state = 601;
            this.match(PseudocodeParser.IDENTIFIER);
            this.state = 602;
            this.match(PseudocodeParser.LPAREN);
            this.state = 604;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 54 || _la === 55 || _la === 94) {
                {
                this.state = 603;
                this.paramList();
                }
            }

            this.state = 606;
            this.match(PseudocodeParser.RPAREN);
            this.state = 607;
            this.match(PseudocodeParser.RETURNS);
            this.state = 608;
            this.dataType();
            this.state = 612;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 95) {
                {
                {
                this.state = 609;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 614;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 615;
            this.block();
            this.state = 619;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 95) {
                {
                {
                this.state = 616;
                this.match(PseudocodeParser.NEWLINE);
                }
                }
                this.state = 621;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 622;
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
        this.enterRule(localContext, 54, PseudocodeParser.RULE_paramList);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 624;
            this.param();
            this.state = 629;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 86) {
                {
                {
                this.state = 625;
                this.match(PseudocodeParser.COMMA);
                this.state = 626;
                this.param();
                }
                }
                this.state = 631;
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
        this.enterRule(localContext, 56, PseudocodeParser.RULE_param);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 633;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 54 || _la === 55) {
                {
                this.state = 632;
                _la = this.tokenStream.LA(1);
                if(!(_la === 54 || _la === 55)) {
                this.errorHandler.recoverInline(this);
                }
                else {
                    this.errorHandler.reportMatch(this);
                    this.consume();
                }
                }
            }

            this.state = 635;
            this.match(PseudocodeParser.IDENTIFIER);
            this.state = 636;
            this.match(PseudocodeParser.COLON);
            this.state = 637;
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
        this.enterRule(localContext, 58, PseudocodeParser.RULE_callStatement);
        let _la: number;
        try {
            this.state = 648;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 73, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 639;
                this.match(PseudocodeParser.CALL);
                this.state = 640;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 641;
                this.match(PseudocodeParser.LPAREN);
                this.state = 643;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & 402657311) !== 0) || ((((_la - 77)) & ~0x1F) === 0 && ((1 << (_la - 77)) & 258089) !== 0)) {
                    {
                    this.state = 642;
                    this.argList();
                    }
                }

                this.state = 645;
                this.match(PseudocodeParser.RPAREN);
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 646;
                this.match(PseudocodeParser.CALL);
                this.state = 647;
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
        this.enterRule(localContext, 60, PseudocodeParser.RULE_methodCall);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 650;
            _la = this.tokenStream.LA(1);
            if(!(_la === 62 || _la === 94)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            this.state = 654;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 74, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 651;
                    this.designatorPart();
                    }
                    }
                }
                this.state = 656;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 74, this.context);
            }
            this.state = 657;
            this.match(PseudocodeParser.DOT);
            this.state = 658;
            this.memberName();
            this.state = 659;
            this.match(PseudocodeParser.LPAREN);
            this.state = 661;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & 402657311) !== 0) || ((((_la - 77)) & ~0x1F) === 0 && ((1 << (_la - 77)) & 258089) !== 0)) {
                {
                this.state = 660;
                this.argList();
                }
            }

            this.state = 663;
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
        this.enterRule(localContext, 62, PseudocodeParser.RULE_methodCallStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 665;
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
        this.enterRule(localContext, 64, PseudocodeParser.RULE_returnStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 667;
            this.match(PseudocodeParser.RETURN);
            this.state = 668;
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
        this.enterRule(localContext, 66, PseudocodeParser.RULE_openFileStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 670;
            this.match(PseudocodeParser.OPENFILE);
            this.state = 671;
            this.expr(0);
            this.state = 672;
            this.match(PseudocodeParser.FOR);
            this.state = 673;
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
        this.enterRule(localContext, 68, PseudocodeParser.RULE_readFileStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 675;
            this.match(PseudocodeParser.READFILE);
            this.state = 676;
            this.expr(0);
            this.state = 677;
            this.match(PseudocodeParser.COMMA);
            this.state = 678;
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
        this.enterRule(localContext, 70, PseudocodeParser.RULE_writeFileStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 680;
            this.match(PseudocodeParser.WRITEFILE);
            this.state = 681;
            this.expr(0);
            this.state = 682;
            this.match(PseudocodeParser.COMMA);
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
    public closeFileStatement(): CloseFileStatementContext {
        let localContext = new CloseFileStatementContext(this.context, this.state);
        this.enterRule(localContext, 72, PseudocodeParser.RULE_closeFileStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 685;
            this.match(PseudocodeParser.CLOSEFILE);
            this.state = 686;
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
        this.enterRule(localContext, 74, PseudocodeParser.RULE_seekStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 688;
            this.match(PseudocodeParser.SEEK);
            this.state = 689;
            this.expr(0);
            this.state = 690;
            this.match(PseudocodeParser.COMMA);
            this.state = 691;
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
        this.enterRule(localContext, 76, PseudocodeParser.RULE_getRecordStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 693;
            this.match(PseudocodeParser.GETRECORD);
            this.state = 694;
            this.expr(0);
            this.state = 695;
            this.match(PseudocodeParser.COMMA);
            this.state = 696;
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
        this.enterRule(localContext, 78, PseudocodeParser.RULE_putRecordStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 698;
            this.match(PseudocodeParser.PUTRECORD);
            this.state = 699;
            this.expr(0);
            this.state = 700;
            this.match(PseudocodeParser.COMMA);
            this.state = 701;
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
        this.enterRule(localContext, 80, PseudocodeParser.RULE_fileMode);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 703;
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
        this.enterRule(localContext, 82, PseudocodeParser.RULE_argList);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 705;
            this.expr(0);
            this.state = 710;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 86) {
                {
                {
                this.state = 706;
                this.match(PseudocodeParser.COMMA);
                this.state = 707;
                this.expr(0);
                }
                }
                this.state = 712;
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
        this.enterRule(localContext, 84, PseudocodeParser.RULE_block);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 713;
            this.statement();
            this.state = 723;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 78, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 717;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    while (_la === 95) {
                        {
                        {
                        this.state = 714;
                        this.match(PseudocodeParser.NEWLINE);
                        }
                        }
                        this.state = 719;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                    }
                    this.state = 720;
                    this.statement();
                    }
                    }
                }
                this.state = 725;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 78, this.context);
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
        let _startState = 86;
        this.enterRecursionRule(localContext, 86, PseudocodeParser.RULE_expr, _p);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 732;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case PseudocodeParser.NOT:
                {
                localContext = new NotExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;

                this.state = 727;
                this.match(PseudocodeParser.NOT);
                this.state = 728;
                this.expr(10);
                }
                break;
            case PseudocodeParser.MINUS:
                {
                localContext = new UnaryMinusExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 729;
                this.match(PseudocodeParser.MINUS);
                this.state = 730;
                this.expr(9);
                }
                break;
            case PseudocodeParser.TRUE:
            case PseudocodeParser.FALSE:
            case PseudocodeParser.MOD:
            case PseudocodeParser.DIV:
            case PseudocodeParser.RANDOM:
            case PseudocodeParser.NEW:
            case PseudocodeParser.SUPER:
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
                this.state = 731;
                this.atom();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
            this.context!.stop = this.tokenStream.LT(-1);
            this.state = 757;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 81, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    if (this.parseListeners != null) {
                        this.triggerExitRuleEvent();
                    }
                    previousContext = localContext;
                    {
                    this.state = 755;
                    this.errorHandler.sync(this);
                    switch (this.interpreter.adaptivePredict(this.tokenStream, 80, this.context) ) {
                    case 1:
                        {
                        localContext = new PowerExprContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, PseudocodeParser.RULE_expr);
                        this.state = 734;
                        if (!(this.precpred(this.context, 8))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 8)");
                        }
                        this.state = 735;
                        this.match(PseudocodeParser.CARET);
                        this.state = 736;
                        this.expr(8);
                        }
                        break;
                    case 2:
                        {
                        localContext = new MulDivExprContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, PseudocodeParser.RULE_expr);
                        this.state = 737;
                        if (!(this.precpred(this.context, 7))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 7)");
                        }
                        this.state = 738;
                        (localContext as MulDivExprContext)._op = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!(_la === 37 || _la === 38 || _la === 78 || _la === 79)) {
                            (localContext as MulDivExprContext)._op = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 739;
                        this.expr(8);
                        }
                        break;
                    case 3:
                        {
                        localContext = new AddSubExprContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, PseudocodeParser.RULE_expr);
                        this.state = 740;
                        if (!(this.precpred(this.context, 6))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 6)");
                        }
                        this.state = 741;
                        (localContext as AddSubExprContext)._op = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!(_la === 76 || _la === 77)) {
                            (localContext as AddSubExprContext)._op = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 742;
                        this.expr(7);
                        }
                        break;
                    case 4:
                        {
                        localContext = new ConcatExprContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, PseudocodeParser.RULE_expr);
                        this.state = 743;
                        if (!(this.precpred(this.context, 5))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 5)");
                        }
                        this.state = 744;
                        this.match(PseudocodeParser.AMPERSAND);
                        this.state = 745;
                        this.expr(6);
                        }
                        break;
                    case 5:
                        {
                        localContext = new ComparisonExprContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, PseudocodeParser.RULE_expr);
                        this.state = 746;
                        if (!(this.precpred(this.context, 4))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 4)");
                        }
                        this.state = 747;
                        (localContext as ComparisonExprContext)._op = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!(((((_la - 70)) & ~0x1F) === 0 && ((1 << (_la - 70)) & 63) !== 0))) {
                            (localContext as ComparisonExprContext)._op = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 748;
                        this.expr(5);
                        }
                        break;
                    case 6:
                        {
                        localContext = new AndExprContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, PseudocodeParser.RULE_expr);
                        this.state = 749;
                        if (!(this.precpred(this.context, 3))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 3)");
                        }
                        this.state = 750;
                        this.match(PseudocodeParser.AND);
                        this.state = 751;
                        this.expr(4);
                        }
                        break;
                    case 7:
                        {
                        localContext = new OrExprContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, PseudocodeParser.RULE_expr);
                        this.state = 752;
                        if (!(this.precpred(this.context, 2))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 2)");
                        }
                        this.state = 753;
                        this.match(PseudocodeParser.OR);
                        this.state = 754;
                        this.expr(3);
                        }
                        break;
                    }
                    }
                }
                this.state = 759;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 81, this.context);
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
        this.enterRule(localContext, 88, PseudocodeParser.RULE_atom);
        let _la: number;
        try {
            this.state = 804;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 84, this.context) ) {
            case 1:
                localContext = new ParenAtomContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 760;
                this.match(PseudocodeParser.LPAREN);
                this.state = 761;
                this.expr(0);
                this.state = 762;
                this.match(PseudocodeParser.RPAREN);
                }
                break;
            case 2:
                localContext = new FunctionCallAtomContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 764;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 765;
                this.match(PseudocodeParser.LPAREN);
                this.state = 767;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & 402657311) !== 0) || ((((_la - 77)) & ~0x1F) === 0 && ((1 << (_la - 77)) & 258089) !== 0)) {
                    {
                    this.state = 766;
                    this.argList();
                    }
                }

                this.state = 769;
                this.match(PseudocodeParser.RPAREN);
                }
                break;
            case 3:
                localContext = new NewInstanceAtomContext(localContext);
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 770;
                this.match(PseudocodeParser.NEW);
                this.state = 771;
                this.match(PseudocodeParser.IDENTIFIER);
                this.state = 772;
                this.match(PseudocodeParser.LPAREN);
                this.state = 774;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & 402657311) !== 0) || ((((_la - 77)) & ~0x1F) === 0 && ((1 << (_la - 77)) & 258089) !== 0)) {
                    {
                    this.state = 773;
                    this.argList();
                    }
                }

                this.state = 776;
                this.match(PseudocodeParser.RPAREN);
                }
                break;
            case 4:
                localContext = new AddressOfAtomContext(localContext);
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 777;
                this.match(PseudocodeParser.CARET);
                this.state = 778;
                this.designator();
                }
                break;
            case 5:
                localContext = new DivFunctionAtomContext(localContext);
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 779;
                this.match(PseudocodeParser.DIV);
                this.state = 780;
                this.match(PseudocodeParser.LPAREN);
                this.state = 781;
                this.expr(0);
                this.state = 782;
                this.match(PseudocodeParser.COMMA);
                this.state = 783;
                this.expr(0);
                this.state = 784;
                this.match(PseudocodeParser.RPAREN);
                }
                break;
            case 6:
                localContext = new ModFunctionAtomContext(localContext);
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 786;
                this.match(PseudocodeParser.MOD);
                this.state = 787;
                this.match(PseudocodeParser.LPAREN);
                this.state = 788;
                this.expr(0);
                this.state = 789;
                this.match(PseudocodeParser.COMMA);
                this.state = 790;
                this.expr(0);
                this.state = 791;
                this.match(PseudocodeParser.RPAREN);
                }
                break;
            case 7:
                localContext = new RandomFunctionAtomContext(localContext);
                this.enterOuterAlt(localContext, 7);
                {
                this.state = 793;
                this.match(PseudocodeParser.RANDOM);
                this.state = 794;
                this.match(PseudocodeParser.LPAREN);
                this.state = 795;
                this.match(PseudocodeParser.RPAREN);
                }
                break;
            case 8:
                localContext = new DesignatorAtomContext(localContext);
                this.enterOuterAlt(localContext, 8);
                {
                this.state = 796;
                this.designator();
                }
                break;
            case 9:
                localContext = new IntegerAtomContext(localContext);
                this.enterOuterAlt(localContext, 9);
                {
                this.state = 797;
                this.match(PseudocodeParser.INTEGER_LITERAL);
                }
                break;
            case 10:
                localContext = new RealAtomContext(localContext);
                this.enterOuterAlt(localContext, 10);
                {
                this.state = 798;
                this.match(PseudocodeParser.REAL_LITERAL);
                }
                break;
            case 11:
                localContext = new DateAtomContext(localContext);
                this.enterOuterAlt(localContext, 11);
                {
                this.state = 799;
                this.match(PseudocodeParser.DATE_LITERAL);
                }
                break;
            case 12:
                localContext = new StringAtomContext(localContext);
                this.enterOuterAlt(localContext, 12);
                {
                this.state = 800;
                this.match(PseudocodeParser.STRING_LITERAL);
                }
                break;
            case 13:
                localContext = new CharAtomContext(localContext);
                this.enterOuterAlt(localContext, 13);
                {
                this.state = 801;
                this.match(PseudocodeParser.CHAR_LITERAL);
                }
                break;
            case 14:
                localContext = new TrueAtomContext(localContext);
                this.enterOuterAlt(localContext, 14);
                {
                this.state = 802;
                this.match(PseudocodeParser.TRUE);
                }
                break;
            case 15:
                localContext = new FalseAtomContext(localContext);
                this.enterOuterAlt(localContext, 15);
                {
                this.state = 803;
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
        case 43:
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
        4,1,97,807,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,
        6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,2,11,7,11,2,12,7,12,2,13,7,13,
        2,14,7,14,2,15,7,15,2,16,7,16,2,17,7,17,2,18,7,18,2,19,7,19,2,20,
        7,20,2,21,7,21,2,22,7,22,2,23,7,23,2,24,7,24,2,25,7,25,2,26,7,26,
        2,27,7,27,2,28,7,28,2,29,7,29,2,30,7,30,2,31,7,31,2,32,7,32,2,33,
        7,33,2,34,7,34,2,35,7,35,2,36,7,36,2,37,7,37,2,38,7,38,2,39,7,39,
        2,40,7,40,2,41,7,41,2,42,7,42,2,43,7,43,2,44,7,44,1,0,5,0,92,8,0,
        10,0,12,0,95,9,0,1,0,1,0,5,0,99,8,0,10,0,12,0,102,9,0,1,0,5,0,105,
        8,0,10,0,12,0,108,9,0,3,0,110,8,0,1,0,5,0,113,8,0,10,0,12,0,116,
        9,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,1,145,8,1,1,2,
        1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,
        1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,
        3,2,180,8,2,1,3,1,3,1,3,5,3,185,8,3,10,3,12,3,188,9,3,1,4,1,4,1,
        4,1,4,1,4,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,
        5,1,5,1,5,3,5,211,8,5,1,5,1,5,3,5,215,8,5,1,5,1,5,1,5,3,5,220,8,
        5,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,
        6,1,6,1,6,1,6,1,6,1,6,4,6,243,8,6,11,6,12,6,244,1,6,1,6,4,6,249,
        8,6,11,6,12,6,250,5,6,253,8,6,10,6,12,6,256,9,6,1,6,3,6,259,8,6,
        1,7,1,7,1,7,1,7,3,7,265,8,7,1,7,1,7,1,7,1,7,1,8,1,8,1,8,1,8,3,8,
        275,8,8,1,8,4,8,278,8,8,11,8,12,8,279,1,8,1,8,4,8,284,8,8,11,8,12,
        8,285,5,8,288,8,8,10,8,12,8,291,9,8,1,8,1,8,1,9,3,9,296,8,9,1,9,
        3,9,299,8,9,1,9,1,9,1,9,1,9,1,9,3,9,306,8,9,1,9,1,9,3,9,310,8,9,
        1,9,3,9,313,8,9,1,10,1,10,5,10,317,8,10,10,10,12,10,320,9,10,1,11,
        1,11,1,11,1,11,5,11,326,8,11,10,11,12,11,329,9,11,1,11,1,11,1,11,
        1,11,1,11,1,11,3,11,337,8,11,1,11,3,11,340,8,11,1,11,3,11,343,8,
        11,1,12,1,12,1,13,1,13,1,13,5,13,350,8,13,10,13,12,13,353,9,13,1,
        14,1,14,1,14,1,14,1,15,1,15,1,15,1,15,3,15,363,8,15,1,16,1,16,1,
        16,1,17,1,17,1,17,5,17,371,8,17,10,17,12,17,374,9,17,1,18,1,18,1,
        18,5,18,379,8,18,10,18,12,18,382,9,18,1,18,3,18,385,8,18,1,18,5,
        18,388,8,18,10,18,12,18,391,9,18,1,18,1,18,5,18,395,8,18,10,18,12,
        18,398,9,18,1,18,1,18,1,18,5,18,403,8,18,10,18,12,18,406,9,18,1,
        18,3,18,409,8,18,1,18,5,18,412,8,18,10,18,12,18,415,9,18,1,18,1,
        18,5,18,419,8,18,10,18,12,18,422,9,18,1,18,5,18,425,8,18,10,18,12,
        18,428,9,18,1,18,1,18,5,18,432,8,18,10,18,12,18,435,9,18,1,18,3,
        18,438,8,18,1,18,5,18,441,8,18,10,18,12,18,444,9,18,1,18,1,18,1,
        19,1,19,1,19,1,19,5,19,452,8,19,10,19,12,19,455,9,19,1,19,4,19,458,
        8,19,11,19,12,19,459,1,19,1,19,3,19,464,8,19,1,19,5,19,467,8,19,
        10,19,12,19,470,9,19,1,19,1,19,5,19,474,8,19,10,19,12,19,477,9,19,
        3,19,479,8,19,1,19,5,19,482,8,19,10,19,12,19,485,9,19,1,19,1,19,
        1,20,1,20,1,20,5,20,492,8,20,10,20,12,20,495,9,20,1,20,1,20,5,20,
        499,8,20,10,20,12,20,502,9,20,1,20,1,20,5,20,506,8,20,10,20,12,20,
        509,9,20,1,21,1,21,1,21,3,21,514,8,21,1,22,1,22,1,22,1,22,1,22,1,
        22,1,22,1,22,3,22,524,8,22,1,22,5,22,527,8,22,10,22,12,22,530,9,
        22,1,22,1,22,5,22,534,8,22,10,22,12,22,537,9,22,1,22,1,22,1,22,1,
        23,1,23,1,23,3,23,545,8,23,1,23,5,23,548,8,23,10,23,12,23,551,9,
        23,1,23,1,23,5,23,555,8,23,10,23,12,23,558,9,23,1,23,1,23,1,24,1,
        24,5,24,564,8,24,10,24,12,24,567,9,24,1,24,1,24,5,24,571,8,24,10,
        24,12,24,574,9,24,1,24,1,24,1,24,1,25,1,25,1,25,1,25,3,25,583,8,
        25,1,25,1,25,5,25,587,8,25,10,25,12,25,590,9,25,1,25,1,25,5,25,594,
        8,25,10,25,12,25,597,9,25,1,25,1,25,1,26,1,26,1,26,1,26,3,26,605,
        8,26,1,26,1,26,1,26,1,26,5,26,611,8,26,10,26,12,26,614,9,26,1,26,
        1,26,5,26,618,8,26,10,26,12,26,621,9,26,1,26,1,26,1,27,1,27,1,27,
        5,27,628,8,27,10,27,12,27,631,9,27,1,28,3,28,634,8,28,1,28,1,28,
        1,28,1,28,1,29,1,29,1,29,1,29,3,29,644,8,29,1,29,1,29,1,29,3,29,
        649,8,29,1,30,1,30,5,30,653,8,30,10,30,12,30,656,9,30,1,30,1,30,
        1,30,1,30,3,30,662,8,30,1,30,1,30,1,31,1,31,1,32,1,32,1,32,1,33,
        1,33,1,33,1,33,1,33,1,34,1,34,1,34,1,34,1,34,1,35,1,35,1,35,1,35,
        1,35,1,36,1,36,1,36,1,37,1,37,1,37,1,37,1,37,1,38,1,38,1,38,1,38,
        1,38,1,39,1,39,1,39,1,39,1,39,1,40,1,40,1,41,1,41,1,41,5,41,709,
        8,41,10,41,12,41,712,9,41,1,42,1,42,5,42,716,8,42,10,42,12,42,719,
        9,42,1,42,5,42,722,8,42,10,42,12,42,725,9,42,1,43,1,43,1,43,1,43,
        1,43,1,43,3,43,733,8,43,1,43,1,43,1,43,1,43,1,43,1,43,1,43,1,43,
        1,43,1,43,1,43,1,43,1,43,1,43,1,43,1,43,1,43,1,43,1,43,1,43,1,43,
        5,43,756,8,43,10,43,12,43,759,9,43,1,44,1,44,1,44,1,44,1,44,1,44,
        1,44,3,44,768,8,44,1,44,1,44,1,44,1,44,1,44,3,44,775,8,44,1,44,1,
        44,1,44,1,44,1,44,1,44,1,44,1,44,1,44,1,44,1,44,1,44,1,44,1,44,1,
        44,1,44,1,44,1,44,1,44,1,44,1,44,1,44,1,44,1,44,1,44,1,44,1,44,1,
        44,3,44,805,8,44,1,44,0,1,86,45,0,2,4,6,8,10,12,14,16,18,20,22,24,
        26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58,60,62,64,66,68,
        70,72,74,76,78,80,82,84,86,88,0,10,1,0,69,70,1,0,59,60,2,0,62,62,
        94,94,2,0,61,61,94,94,1,0,4,5,1,0,54,55,1,0,43,46,2,0,37,38,78,79,
        1,0,76,77,1,0,70,75,899,0,93,1,0,0,0,2,144,1,0,0,0,4,179,1,0,0,0,
        6,181,1,0,0,0,8,189,1,0,0,0,10,219,1,0,0,0,12,258,1,0,0,0,14,260,
        1,0,0,0,16,270,1,0,0,0,18,312,1,0,0,0,20,314,1,0,0,0,22,342,1,0,
        0,0,24,344,1,0,0,0,26,346,1,0,0,0,28,354,1,0,0,0,30,358,1,0,0,0,
        32,364,1,0,0,0,34,367,1,0,0,0,36,375,1,0,0,0,38,447,1,0,0,0,40,488,
        1,0,0,0,42,510,1,0,0,0,44,515,1,0,0,0,46,541,1,0,0,0,48,561,1,0,
        0,0,50,578,1,0,0,0,52,600,1,0,0,0,54,624,1,0,0,0,56,633,1,0,0,0,
        58,648,1,0,0,0,60,650,1,0,0,0,62,665,1,0,0,0,64,667,1,0,0,0,66,670,
        1,0,0,0,68,675,1,0,0,0,70,680,1,0,0,0,72,685,1,0,0,0,74,688,1,0,
        0,0,76,693,1,0,0,0,78,698,1,0,0,0,80,703,1,0,0,0,82,705,1,0,0,0,
        84,713,1,0,0,0,86,732,1,0,0,0,88,804,1,0,0,0,90,92,5,95,0,0,91,90,
        1,0,0,0,92,95,1,0,0,0,93,91,1,0,0,0,93,94,1,0,0,0,94,109,1,0,0,0,
        95,93,1,0,0,0,96,106,3,2,1,0,97,99,5,95,0,0,98,97,1,0,0,0,99,102,
        1,0,0,0,100,98,1,0,0,0,100,101,1,0,0,0,101,103,1,0,0,0,102,100,1,
        0,0,0,103,105,3,2,1,0,104,100,1,0,0,0,105,108,1,0,0,0,106,104,1,
        0,0,0,106,107,1,0,0,0,107,110,1,0,0,0,108,106,1,0,0,0,109,96,1,0,
        0,0,109,110,1,0,0,0,110,114,1,0,0,0,111,113,5,95,0,0,112,111,1,0,
        0,0,113,116,1,0,0,0,114,112,1,0,0,0,114,115,1,0,0,0,115,117,1,0,
        0,0,116,114,1,0,0,0,117,118,5,0,0,1,118,1,1,0,0,0,119,145,3,4,2,
        0,120,145,3,8,4,0,121,145,3,12,6,0,122,145,3,14,7,0,123,145,3,16,
        8,0,124,145,3,26,13,0,125,145,3,30,15,0,126,145,3,32,16,0,127,145,
        3,36,18,0,128,145,3,38,19,0,129,145,3,44,22,0,130,145,3,46,23,0,
        131,145,3,48,24,0,132,145,3,50,25,0,133,145,3,52,26,0,134,145,3,
        58,29,0,135,145,3,62,31,0,136,145,3,64,32,0,137,145,3,66,33,0,138,
        145,3,68,34,0,139,145,3,70,35,0,140,145,3,72,36,0,141,145,3,74,37,
        0,142,145,3,76,38,0,143,145,3,78,39,0,144,119,1,0,0,0,144,120,1,
        0,0,0,144,121,1,0,0,0,144,122,1,0,0,0,144,123,1,0,0,0,144,124,1,
        0,0,0,144,125,1,0,0,0,144,126,1,0,0,0,144,127,1,0,0,0,144,128,1,
        0,0,0,144,129,1,0,0,0,144,130,1,0,0,0,144,131,1,0,0,0,144,132,1,
        0,0,0,144,133,1,0,0,0,144,134,1,0,0,0,144,135,1,0,0,0,144,136,1,
        0,0,0,144,137,1,0,0,0,144,138,1,0,0,0,144,139,1,0,0,0,144,140,1,
        0,0,0,144,141,1,0,0,0,144,142,1,0,0,0,144,143,1,0,0,0,145,3,1,0,
        0,0,146,147,5,1,0,0,147,148,3,6,3,0,148,149,5,87,0,0,149,150,5,31,
        0,0,150,151,5,84,0,0,151,152,3,86,43,0,152,153,5,87,0,0,153,154,
        3,86,43,0,154,155,5,85,0,0,155,156,5,12,0,0,156,157,3,10,5,0,157,
        180,1,0,0,0,158,159,5,1,0,0,159,160,5,94,0,0,160,161,5,87,0,0,161,
        162,5,31,0,0,162,163,5,84,0,0,163,164,3,86,43,0,164,165,5,87,0,0,
        165,166,3,86,43,0,166,167,5,86,0,0,167,168,3,86,43,0,168,169,5,87,
        0,0,169,170,3,86,43,0,170,171,5,85,0,0,171,172,5,12,0,0,172,173,
        3,10,5,0,173,180,1,0,0,0,174,175,5,1,0,0,175,176,3,6,3,0,176,177,
        5,87,0,0,177,178,3,10,5,0,178,180,1,0,0,0,179,146,1,0,0,0,179,158,
        1,0,0,0,179,174,1,0,0,0,180,5,1,0,0,0,181,186,5,94,0,0,182,183,5,
        86,0,0,183,185,5,94,0,0,184,182,1,0,0,0,185,188,1,0,0,0,186,184,
        1,0,0,0,186,187,1,0,0,0,187,7,1,0,0,0,188,186,1,0,0,0,189,190,5,
        2,0,0,190,191,5,94,0,0,191,192,7,0,0,0,192,193,3,86,43,0,193,9,1,
        0,0,0,194,220,5,63,0,0,195,220,5,64,0,0,196,220,5,65,0,0,197,220,
        5,66,0,0,198,220,5,67,0,0,199,220,5,68,0,0,200,214,5,31,0,0,201,
        202,5,84,0,0,202,203,3,86,43,0,203,204,5,87,0,0,204,210,3,86,43,
        0,205,206,5,86,0,0,206,207,3,86,43,0,207,208,5,87,0,0,208,209,3,
        86,43,0,209,211,1,0,0,0,210,205,1,0,0,0,210,211,1,0,0,0,211,212,
        1,0,0,0,212,213,5,85,0,0,213,215,1,0,0,0,214,201,1,0,0,0,214,215,
        1,0,0,0,215,216,1,0,0,0,216,217,5,12,0,0,217,220,3,10,5,0,218,220,
        5,94,0,0,219,194,1,0,0,0,219,195,1,0,0,0,219,196,1,0,0,0,219,197,
        1,0,0,0,219,198,1,0,0,0,219,199,1,0,0,0,219,200,1,0,0,0,219,218,
        1,0,0,0,220,11,1,0,0,0,221,222,5,50,0,0,222,223,5,94,0,0,223,224,
        5,70,0,0,224,225,5,82,0,0,225,226,3,6,3,0,226,227,5,83,0,0,227,259,
        1,0,0,0,228,229,5,50,0,0,229,230,5,94,0,0,230,231,5,70,0,0,231,232,
        5,80,0,0,232,259,3,10,5,0,233,234,5,50,0,0,234,235,5,94,0,0,235,
        236,5,70,0,0,236,237,5,52,0,0,237,238,5,12,0,0,238,259,3,10,5,0,
        239,240,5,50,0,0,240,242,5,94,0,0,241,243,5,95,0,0,242,241,1,0,0,
        0,243,244,1,0,0,0,244,242,1,0,0,0,244,245,1,0,0,0,245,254,1,0,0,
        0,246,248,3,4,2,0,247,249,5,95,0,0,248,247,1,0,0,0,249,250,1,0,0,
        0,250,248,1,0,0,0,250,251,1,0,0,0,251,253,1,0,0,0,252,246,1,0,0,
        0,253,256,1,0,0,0,254,252,1,0,0,0,254,255,1,0,0,0,255,257,1,0,0,
        0,256,254,1,0,0,0,257,259,5,51,0,0,258,221,1,0,0,0,258,228,1,0,0,
        0,258,233,1,0,0,0,258,239,1,0,0,0,259,13,1,0,0,0,260,261,5,53,0,
        0,261,262,5,94,0,0,262,264,5,82,0,0,263,265,3,34,17,0,264,263,1,
        0,0,0,264,265,1,0,0,0,265,266,1,0,0,0,266,267,5,83,0,0,267,268,5,
        87,0,0,268,269,5,94,0,0,269,15,1,0,0,0,270,271,5,56,0,0,271,274,
        5,94,0,0,272,273,5,58,0,0,273,275,5,94,0,0,274,272,1,0,0,0,274,275,
        1,0,0,0,275,277,1,0,0,0,276,278,5,95,0,0,277,276,1,0,0,0,278,279,
        1,0,0,0,279,277,1,0,0,0,279,280,1,0,0,0,280,289,1,0,0,0,281,283,
        3,18,9,0,282,284,5,95,0,0,283,282,1,0,0,0,284,285,1,0,0,0,285,283,
        1,0,0,0,285,286,1,0,0,0,286,288,1,0,0,0,287,281,1,0,0,0,288,291,
        1,0,0,0,289,287,1,0,0,0,289,290,1,0,0,0,290,292,1,0,0,0,291,289,
        1,0,0,0,292,293,5,57,0,0,293,17,1,0,0,0,294,296,7,1,0,0,295,294,
        1,0,0,0,295,296,1,0,0,0,296,298,1,0,0,0,297,299,5,1,0,0,298,297,
        1,0,0,0,298,299,1,0,0,0,299,300,1,0,0,0,300,301,3,6,3,0,301,302,
        5,87,0,0,302,303,3,10,5,0,303,313,1,0,0,0,304,306,7,1,0,0,305,304,
        1,0,0,0,305,306,1,0,0,0,306,307,1,0,0,0,307,313,3,50,25,0,308,310,
        7,1,0,0,309,308,1,0,0,0,309,310,1,0,0,0,310,311,1,0,0,0,311,313,
        3,52,26,0,312,295,1,0,0,0,312,305,1,0,0,0,312,309,1,0,0,0,313,19,
        1,0,0,0,314,318,7,2,0,0,315,317,3,22,11,0,316,315,1,0,0,0,317,320,
        1,0,0,0,318,316,1,0,0,0,318,319,1,0,0,0,319,21,1,0,0,0,320,318,1,
        0,0,0,321,322,5,84,0,0,322,327,3,86,43,0,323,324,5,86,0,0,324,326,
        3,86,43,0,325,323,1,0,0,0,326,329,1,0,0,0,327,325,1,0,0,0,327,328,
        1,0,0,0,328,330,1,0,0,0,329,327,1,0,0,0,330,331,5,85,0,0,331,343,
        1,0,0,0,332,333,5,88,0,0,333,339,3,24,12,0,334,336,5,82,0,0,335,
        337,3,82,41,0,336,335,1,0,0,0,336,337,1,0,0,0,337,338,1,0,0,0,338,
        340,5,83,0,0,339,334,1,0,0,0,339,340,1,0,0,0,340,343,1,0,0,0,341,
        343,5,80,0,0,342,321,1,0,0,0,342,332,1,0,0,0,342,341,1,0,0,0,343,
        23,1,0,0,0,344,345,7,3,0,0,345,25,1,0,0,0,346,351,3,28,14,0,347,
        348,5,86,0,0,348,350,3,28,14,0,349,347,1,0,0,0,350,353,1,0,0,0,351,
        349,1,0,0,0,351,352,1,0,0,0,352,27,1,0,0,0,353,351,1,0,0,0,354,355,
        3,20,10,0,355,356,7,0,0,0,356,357,3,86,43,0,357,29,1,0,0,0,358,359,
        5,3,0,0,359,362,3,20,10,0,360,361,5,86,0,0,361,363,5,92,0,0,362,
        360,1,0,0,0,362,363,1,0,0,0,363,31,1,0,0,0,364,365,7,4,0,0,365,366,
        3,34,17,0,366,33,1,0,0,0,367,372,3,86,43,0,368,369,5,86,0,0,369,
        371,3,86,43,0,370,368,1,0,0,0,371,374,1,0,0,0,372,370,1,0,0,0,372,
        373,1,0,0,0,373,35,1,0,0,0,374,372,1,0,0,0,375,376,5,6,0,0,376,380,
        3,86,43,0,377,379,5,95,0,0,378,377,1,0,0,0,379,382,1,0,0,0,380,378,
        1,0,0,0,380,381,1,0,0,0,381,384,1,0,0,0,382,380,1,0,0,0,383,385,
        5,7,0,0,384,383,1,0,0,0,384,385,1,0,0,0,385,389,1,0,0,0,386,388,
        5,95,0,0,387,386,1,0,0,0,388,391,1,0,0,0,389,387,1,0,0,0,389,390,
        1,0,0,0,390,392,1,0,0,0,391,389,1,0,0,0,392,420,3,84,42,0,393,395,
        5,95,0,0,394,393,1,0,0,0,395,398,1,0,0,0,396,394,1,0,0,0,396,397,
        1,0,0,0,397,399,1,0,0,0,398,396,1,0,0,0,399,400,5,9,0,0,400,404,
        3,86,43,0,401,403,5,95,0,0,402,401,1,0,0,0,403,406,1,0,0,0,404,402,
        1,0,0,0,404,405,1,0,0,0,405,408,1,0,0,0,406,404,1,0,0,0,407,409,
        5,7,0,0,408,407,1,0,0,0,408,409,1,0,0,0,409,413,1,0,0,0,410,412,
        5,95,0,0,411,410,1,0,0,0,412,415,1,0,0,0,413,411,1,0,0,0,413,414,
        1,0,0,0,414,416,1,0,0,0,415,413,1,0,0,0,416,417,3,84,42,0,417,419,
        1,0,0,0,418,396,1,0,0,0,419,422,1,0,0,0,420,418,1,0,0,0,420,421,
        1,0,0,0,421,437,1,0,0,0,422,420,1,0,0,0,423,425,5,95,0,0,424,423,
        1,0,0,0,425,428,1,0,0,0,426,424,1,0,0,0,426,427,1,0,0,0,427,429,
        1,0,0,0,428,426,1,0,0,0,429,433,5,8,0,0,430,432,5,95,0,0,431,430,
        1,0,0,0,432,435,1,0,0,0,433,431,1,0,0,0,433,434,1,0,0,0,434,436,
        1,0,0,0,435,433,1,0,0,0,436,438,3,84,42,0,437,426,1,0,0,0,437,438,
        1,0,0,0,438,442,1,0,0,0,439,441,5,95,0,0,440,439,1,0,0,0,441,444,
        1,0,0,0,442,440,1,0,0,0,442,443,1,0,0,0,443,445,1,0,0,0,444,442,
        1,0,0,0,445,446,5,10,0,0,446,37,1,0,0,0,447,448,5,11,0,0,448,449,
        5,12,0,0,449,453,3,20,10,0,450,452,5,95,0,0,451,450,1,0,0,0,452,
        455,1,0,0,0,453,451,1,0,0,0,453,454,1,0,0,0,454,457,1,0,0,0,455,
        453,1,0,0,0,456,458,3,40,20,0,457,456,1,0,0,0,458,459,1,0,0,0,459,
        457,1,0,0,0,459,460,1,0,0,0,460,478,1,0,0,0,461,463,5,13,0,0,462,
        464,5,87,0,0,463,462,1,0,0,0,463,464,1,0,0,0,464,468,1,0,0,0,465,
        467,5,95,0,0,466,465,1,0,0,0,467,470,1,0,0,0,468,466,1,0,0,0,468,
        469,1,0,0,0,469,471,1,0,0,0,470,468,1,0,0,0,471,475,3,84,42,0,472,
        474,5,95,0,0,473,472,1,0,0,0,474,477,1,0,0,0,475,473,1,0,0,0,475,
        476,1,0,0,0,476,479,1,0,0,0,477,475,1,0,0,0,478,461,1,0,0,0,478,
        479,1,0,0,0,479,483,1,0,0,0,480,482,5,95,0,0,481,480,1,0,0,0,482,
        485,1,0,0,0,483,481,1,0,0,0,483,484,1,0,0,0,484,486,1,0,0,0,485,
        483,1,0,0,0,486,487,5,14,0,0,487,39,1,0,0,0,488,493,3,42,21,0,489,
        490,5,86,0,0,490,492,3,42,21,0,491,489,1,0,0,0,492,495,1,0,0,0,493,
        491,1,0,0,0,493,494,1,0,0,0,494,496,1,0,0,0,495,493,1,0,0,0,496,
        500,5,87,0,0,497,499,5,95,0,0,498,497,1,0,0,0,499,502,1,0,0,0,500,
        498,1,0,0,0,500,501,1,0,0,0,501,503,1,0,0,0,502,500,1,0,0,0,503,
        507,3,84,42,0,504,506,5,95,0,0,505,504,1,0,0,0,506,509,1,0,0,0,507,
        505,1,0,0,0,507,508,1,0,0,0,508,41,1,0,0,0,509,507,1,0,0,0,510,513,
        3,86,43,0,511,512,5,16,0,0,512,514,3,86,43,0,513,511,1,0,0,0,513,
        514,1,0,0,0,514,43,1,0,0,0,515,516,5,15,0,0,516,517,5,94,0,0,517,
        518,7,0,0,0,518,519,3,86,43,0,519,520,5,16,0,0,520,523,3,86,43,0,
        521,522,5,17,0,0,522,524,3,86,43,0,523,521,1,0,0,0,523,524,1,0,0,
        0,524,528,1,0,0,0,525,527,5,95,0,0,526,525,1,0,0,0,527,530,1,0,0,
        0,528,526,1,0,0,0,528,529,1,0,0,0,529,531,1,0,0,0,530,528,1,0,0,
        0,531,535,3,84,42,0,532,534,5,95,0,0,533,532,1,0,0,0,534,537,1,0,
        0,0,535,533,1,0,0,0,535,536,1,0,0,0,536,538,1,0,0,0,537,535,1,0,
        0,0,538,539,5,18,0,0,539,540,5,94,0,0,540,45,1,0,0,0,541,542,5,19,
        0,0,542,544,3,86,43,0,543,545,5,20,0,0,544,543,1,0,0,0,544,545,1,
        0,0,0,545,549,1,0,0,0,546,548,5,95,0,0,547,546,1,0,0,0,548,551,1,
        0,0,0,549,547,1,0,0,0,549,550,1,0,0,0,550,552,1,0,0,0,551,549,1,
        0,0,0,552,556,3,84,42,0,553,555,5,95,0,0,554,553,1,0,0,0,555,558,
        1,0,0,0,556,554,1,0,0,0,556,557,1,0,0,0,557,559,1,0,0,0,558,556,
        1,0,0,0,559,560,5,21,0,0,560,47,1,0,0,0,561,565,5,22,0,0,562,564,
        5,95,0,0,563,562,1,0,0,0,564,567,1,0,0,0,565,563,1,0,0,0,565,566,
        1,0,0,0,566,568,1,0,0,0,567,565,1,0,0,0,568,572,3,84,42,0,569,571,
        5,95,0,0,570,569,1,0,0,0,571,574,1,0,0,0,572,570,1,0,0,0,572,573,
        1,0,0,0,573,575,1,0,0,0,574,572,1,0,0,0,575,576,5,23,0,0,576,577,
        3,86,43,0,577,49,1,0,0,0,578,579,5,24,0,0,579,580,7,3,0,0,580,582,
        5,82,0,0,581,583,3,54,27,0,582,581,1,0,0,0,582,583,1,0,0,0,583,584,
        1,0,0,0,584,588,5,83,0,0,585,587,5,95,0,0,586,585,1,0,0,0,587,590,
        1,0,0,0,588,586,1,0,0,0,588,589,1,0,0,0,589,591,1,0,0,0,590,588,
        1,0,0,0,591,595,3,84,42,0,592,594,5,95,0,0,593,592,1,0,0,0,594,597,
        1,0,0,0,595,593,1,0,0,0,595,596,1,0,0,0,596,598,1,0,0,0,597,595,
        1,0,0,0,598,599,5,25,0,0,599,51,1,0,0,0,600,601,5,26,0,0,601,602,
        5,94,0,0,602,604,5,82,0,0,603,605,3,54,27,0,604,603,1,0,0,0,604,
        605,1,0,0,0,605,606,1,0,0,0,606,607,5,83,0,0,607,608,5,28,0,0,608,
        612,3,10,5,0,609,611,5,95,0,0,610,609,1,0,0,0,611,614,1,0,0,0,612,
        610,1,0,0,0,612,613,1,0,0,0,613,615,1,0,0,0,614,612,1,0,0,0,615,
        619,3,84,42,0,616,618,5,95,0,0,617,616,1,0,0,0,618,621,1,0,0,0,619,
        617,1,0,0,0,619,620,1,0,0,0,620,622,1,0,0,0,621,619,1,0,0,0,622,
        623,5,27,0,0,623,53,1,0,0,0,624,629,3,56,28,0,625,626,5,86,0,0,626,
        628,3,56,28,0,627,625,1,0,0,0,628,631,1,0,0,0,629,627,1,0,0,0,629,
        630,1,0,0,0,630,55,1,0,0,0,631,629,1,0,0,0,632,634,7,5,0,0,633,632,
        1,0,0,0,633,634,1,0,0,0,634,635,1,0,0,0,635,636,5,94,0,0,636,637,
        5,87,0,0,637,638,3,10,5,0,638,57,1,0,0,0,639,640,5,30,0,0,640,641,
        5,94,0,0,641,643,5,82,0,0,642,644,3,82,41,0,643,642,1,0,0,0,643,
        644,1,0,0,0,644,645,1,0,0,0,645,649,5,83,0,0,646,647,5,30,0,0,647,
        649,3,60,30,0,648,639,1,0,0,0,648,646,1,0,0,0,649,59,1,0,0,0,650,
        654,7,2,0,0,651,653,3,22,11,0,652,651,1,0,0,0,653,656,1,0,0,0,654,
        652,1,0,0,0,654,655,1,0,0,0,655,657,1,0,0,0,656,654,1,0,0,0,657,
        658,5,88,0,0,658,659,3,24,12,0,659,661,5,82,0,0,660,662,3,82,41,
        0,661,660,1,0,0,0,661,662,1,0,0,0,662,663,1,0,0,0,663,664,5,83,0,
        0,664,61,1,0,0,0,665,666,3,60,30,0,666,63,1,0,0,0,667,668,5,29,0,
        0,668,669,3,86,43,0,669,65,1,0,0,0,670,671,5,39,0,0,671,672,3,86,
        43,0,672,673,5,15,0,0,673,674,3,80,40,0,674,67,1,0,0,0,675,676,5,
        40,0,0,676,677,3,86,43,0,677,678,5,86,0,0,678,679,3,20,10,0,679,
        69,1,0,0,0,680,681,5,41,0,0,681,682,3,86,43,0,682,683,5,86,0,0,683,
        684,3,86,43,0,684,71,1,0,0,0,685,686,5,42,0,0,686,687,3,86,43,0,
        687,73,1,0,0,0,688,689,5,47,0,0,689,690,3,86,43,0,690,691,5,86,0,
        0,691,692,3,86,43,0,692,75,1,0,0,0,693,694,5,48,0,0,694,695,3,86,
        43,0,695,696,5,86,0,0,696,697,3,20,10,0,697,77,1,0,0,0,698,699,5,
        49,0,0,699,700,3,86,43,0,700,701,5,86,0,0,701,702,3,20,10,0,702,
        79,1,0,0,0,703,704,7,6,0,0,704,81,1,0,0,0,705,710,3,86,43,0,706,
        707,5,86,0,0,707,709,3,86,43,0,708,706,1,0,0,0,709,712,1,0,0,0,710,
        708,1,0,0,0,710,711,1,0,0,0,711,83,1,0,0,0,712,710,1,0,0,0,713,723,
        3,2,1,0,714,716,5,95,0,0,715,714,1,0,0,0,716,719,1,0,0,0,717,715,
        1,0,0,0,717,718,1,0,0,0,718,720,1,0,0,0,719,717,1,0,0,0,720,722,
        3,2,1,0,721,717,1,0,0,0,722,725,1,0,0,0,723,721,1,0,0,0,723,724,
        1,0,0,0,724,85,1,0,0,0,725,723,1,0,0,0,726,727,6,43,-1,0,727,728,
        5,34,0,0,728,733,3,86,43,10,729,730,5,77,0,0,730,733,3,86,43,9,731,
        733,3,88,44,0,732,726,1,0,0,0,732,729,1,0,0,0,732,731,1,0,0,0,733,
        757,1,0,0,0,734,735,10,8,0,0,735,736,5,80,0,0,736,756,3,86,43,8,
        737,738,10,7,0,0,738,739,7,7,0,0,739,756,3,86,43,8,740,741,10,6,
        0,0,741,742,7,8,0,0,742,756,3,86,43,7,743,744,10,5,0,0,744,745,5,
        81,0,0,745,756,3,86,43,6,746,747,10,4,0,0,747,748,7,9,0,0,748,756,
        3,86,43,5,749,750,10,3,0,0,750,751,5,32,0,0,751,756,3,86,43,4,752,
        753,10,2,0,0,753,754,5,33,0,0,754,756,3,86,43,3,755,734,1,0,0,0,
        755,737,1,0,0,0,755,740,1,0,0,0,755,743,1,0,0,0,755,746,1,0,0,0,
        755,749,1,0,0,0,755,752,1,0,0,0,756,759,1,0,0,0,757,755,1,0,0,0,
        757,758,1,0,0,0,758,87,1,0,0,0,759,757,1,0,0,0,760,761,5,82,0,0,
        761,762,3,86,43,0,762,763,5,83,0,0,763,805,1,0,0,0,764,765,5,94,
        0,0,765,767,5,82,0,0,766,768,3,82,41,0,767,766,1,0,0,0,767,768,1,
        0,0,0,768,769,1,0,0,0,769,805,5,83,0,0,770,771,5,61,0,0,771,772,
        5,94,0,0,772,774,5,82,0,0,773,775,3,82,41,0,774,773,1,0,0,0,774,
        775,1,0,0,0,775,776,1,0,0,0,776,805,5,83,0,0,777,778,5,80,0,0,778,
        805,3,20,10,0,779,780,5,38,0,0,780,781,5,82,0,0,781,782,3,86,43,
        0,782,783,5,86,0,0,783,784,3,86,43,0,784,785,5,83,0,0,785,805,1,
        0,0,0,786,787,5,37,0,0,787,788,5,82,0,0,788,789,3,86,43,0,789,790,
        5,86,0,0,790,791,3,86,43,0,791,792,5,83,0,0,792,805,1,0,0,0,793,
        794,5,46,0,0,794,795,5,82,0,0,795,805,5,83,0,0,796,805,3,20,10,0,
        797,805,5,91,0,0,798,805,5,90,0,0,799,805,5,89,0,0,800,805,5,92,
        0,0,801,805,5,93,0,0,802,805,5,35,0,0,803,805,5,36,0,0,804,760,1,
        0,0,0,804,764,1,0,0,0,804,770,1,0,0,0,804,777,1,0,0,0,804,779,1,
        0,0,0,804,786,1,0,0,0,804,793,1,0,0,0,804,796,1,0,0,0,804,797,1,
        0,0,0,804,798,1,0,0,0,804,799,1,0,0,0,804,800,1,0,0,0,804,801,1,
        0,0,0,804,802,1,0,0,0,804,803,1,0,0,0,805,89,1,0,0,0,85,93,100,106,
        109,114,144,179,186,210,214,219,244,250,254,258,264,274,279,285,
        289,295,298,305,309,312,318,327,336,339,342,351,362,372,380,384,
        389,396,404,408,413,420,426,433,437,442,453,459,463,468,475,478,
        483,493,500,507,513,523,528,535,544,549,556,565,572,582,588,595,
        604,612,619,629,633,643,648,654,661,710,717,723,732,755,757,767,
        774,804
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
    public IDENTIFIER(): antlr.TerminalNode[];
    public IDENTIFIER(i: number): antlr.TerminalNode | null;
    public IDENTIFIER(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.IDENTIFIER);
    	} else {
    		return this.getToken(PseudocodeParser.IDENTIFIER, i);
    	}
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
    public IDENTIFIER(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.IDENTIFIER, 0);
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
    public IDENTIFIER(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.IDENTIFIER, 0);
    }
    public NEW(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.NEW, 0);
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
    public _name?: Token | null;
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public PROCEDURE(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.PROCEDURE, 0)!;
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
    public IDENTIFIER(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.IDENTIFIER, 0);
    }
    public NEW(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.NEW, 0);
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
    public IDENTIFIER(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.IDENTIFIER, 0);
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
    public IDENTIFIER(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.IDENTIFIER, 0);
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
export class RandomFunctionAtomContext extends AtomContext {
    public constructor(ctx: AtomContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public RANDOM(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.RANDOM, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.LPAREN, 0)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.RPAREN, 0)!;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterRandomFunctionAtom) {
             listener.enterRandomFunctionAtom(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitRandomFunctionAtom) {
             listener.exitRandomFunctionAtom(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitRandomFunctionAtom) {
            return visitor.visitRandomFunctionAtom(this);
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
