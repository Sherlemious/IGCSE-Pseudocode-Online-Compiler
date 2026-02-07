// Generated from src/interpreter/grammar/Pseudocode.g4 by ANTLR 4.13.1

import { ErrorNode, ParseTreeListener, ParserRuleContext, TerminalNode } from "antlr4ng";


import { ProgramContext } from "./PseudocodeParser.js";
import { StatementContext } from "./PseudocodeParser.js";
import { DeclareStatementContext } from "./PseudocodeParser.js";
import { ConstantStatementContext } from "./PseudocodeParser.js";
import { DataTypeContext } from "./PseudocodeParser.js";
import { AssignmentStatementContext } from "./PseudocodeParser.js";
import { InputStatementContext } from "./PseudocodeParser.js";
import { OutputStatementContext } from "./PseudocodeParser.js";
import { ExprListContext } from "./PseudocodeParser.js";
import { IfStatementContext } from "./PseudocodeParser.js";
import { CaseStatementContext } from "./PseudocodeParser.js";
import { CaseClauseContext } from "./PseudocodeParser.js";
import { ForStatementContext } from "./PseudocodeParser.js";
import { WhileStatementContext } from "./PseudocodeParser.js";
import { RepeatStatementContext } from "./PseudocodeParser.js";
import { ProcedureDeclarationContext } from "./PseudocodeParser.js";
import { FunctionDeclarationContext } from "./PseudocodeParser.js";
import { ParamListContext } from "./PseudocodeParser.js";
import { ParamContext } from "./PseudocodeParser.js";
import { CallStatementContext } from "./PseudocodeParser.js";
import { ReturnStatementContext } from "./PseudocodeParser.js";
import { ArgListContext } from "./PseudocodeParser.js";
import { BlockContext } from "./PseudocodeParser.js";
import { NotExprContext } from "./PseudocodeParser.js";
import { PowerExprContext } from "./PseudocodeParser.js";
import { AddSubExprContext } from "./PseudocodeParser.js";
import { UnaryMinusExprContext } from "./PseudocodeParser.js";
import { AtomExprContext } from "./PseudocodeParser.js";
import { OrExprContext } from "./PseudocodeParser.js";
import { ComparisonExprContext } from "./PseudocodeParser.js";
import { MulDivExprContext } from "./PseudocodeParser.js";
import { ConcatExprContext } from "./PseudocodeParser.js";
import { AndExprContext } from "./PseudocodeParser.js";
import { ParenAtomContext } from "./PseudocodeParser.js";
import { FunctionCallAtomContext } from "./PseudocodeParser.js";
import { ArrayAccess1DAtomContext } from "./PseudocodeParser.js";
import { ArrayAccess2DAtomContext } from "./PseudocodeParser.js";
import { IdentifierAtomContext } from "./PseudocodeParser.js";
import { IntegerAtomContext } from "./PseudocodeParser.js";
import { RealAtomContext } from "./PseudocodeParser.js";
import { StringAtomContext } from "./PseudocodeParser.js";
import { CharAtomContext } from "./PseudocodeParser.js";
import { TrueAtomContext } from "./PseudocodeParser.js";
import { FalseAtomContext } from "./PseudocodeParser.js";


/**
 * This interface defines a complete listener for a parse tree produced by
 * `PseudocodeParser`.
 */
export class PseudocodeListener implements ParseTreeListener {
    /**
     * Enter a parse tree produced by `PseudocodeParser.program`.
     * @param ctx the parse tree
     */
    enterProgram?: (ctx: ProgramContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.program`.
     * @param ctx the parse tree
     */
    exitProgram?: (ctx: ProgramContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.statement`.
     * @param ctx the parse tree
     */
    enterStatement?: (ctx: StatementContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.statement`.
     * @param ctx the parse tree
     */
    exitStatement?: (ctx: StatementContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.declareStatement`.
     * @param ctx the parse tree
     */
    enterDeclareStatement?: (ctx: DeclareStatementContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.declareStatement`.
     * @param ctx the parse tree
     */
    exitDeclareStatement?: (ctx: DeclareStatementContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.constantStatement`.
     * @param ctx the parse tree
     */
    enterConstantStatement?: (ctx: ConstantStatementContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.constantStatement`.
     * @param ctx the parse tree
     */
    exitConstantStatement?: (ctx: ConstantStatementContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.dataType`.
     * @param ctx the parse tree
     */
    enterDataType?: (ctx: DataTypeContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.dataType`.
     * @param ctx the parse tree
     */
    exitDataType?: (ctx: DataTypeContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.assignmentStatement`.
     * @param ctx the parse tree
     */
    enterAssignmentStatement?: (ctx: AssignmentStatementContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.assignmentStatement`.
     * @param ctx the parse tree
     */
    exitAssignmentStatement?: (ctx: AssignmentStatementContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.inputStatement`.
     * @param ctx the parse tree
     */
    enterInputStatement?: (ctx: InputStatementContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.inputStatement`.
     * @param ctx the parse tree
     */
    exitInputStatement?: (ctx: InputStatementContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.outputStatement`.
     * @param ctx the parse tree
     */
    enterOutputStatement?: (ctx: OutputStatementContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.outputStatement`.
     * @param ctx the parse tree
     */
    exitOutputStatement?: (ctx: OutputStatementContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.exprList`.
     * @param ctx the parse tree
     */
    enterExprList?: (ctx: ExprListContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.exprList`.
     * @param ctx the parse tree
     */
    exitExprList?: (ctx: ExprListContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.ifStatement`.
     * @param ctx the parse tree
     */
    enterIfStatement?: (ctx: IfStatementContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.ifStatement`.
     * @param ctx the parse tree
     */
    exitIfStatement?: (ctx: IfStatementContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.caseStatement`.
     * @param ctx the parse tree
     */
    enterCaseStatement?: (ctx: CaseStatementContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.caseStatement`.
     * @param ctx the parse tree
     */
    exitCaseStatement?: (ctx: CaseStatementContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.caseClause`.
     * @param ctx the parse tree
     */
    enterCaseClause?: (ctx: CaseClauseContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.caseClause`.
     * @param ctx the parse tree
     */
    exitCaseClause?: (ctx: CaseClauseContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.forStatement`.
     * @param ctx the parse tree
     */
    enterForStatement?: (ctx: ForStatementContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.forStatement`.
     * @param ctx the parse tree
     */
    exitForStatement?: (ctx: ForStatementContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.whileStatement`.
     * @param ctx the parse tree
     */
    enterWhileStatement?: (ctx: WhileStatementContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.whileStatement`.
     * @param ctx the parse tree
     */
    exitWhileStatement?: (ctx: WhileStatementContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.repeatStatement`.
     * @param ctx the parse tree
     */
    enterRepeatStatement?: (ctx: RepeatStatementContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.repeatStatement`.
     * @param ctx the parse tree
     */
    exitRepeatStatement?: (ctx: RepeatStatementContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.procedureDeclaration`.
     * @param ctx the parse tree
     */
    enterProcedureDeclaration?: (ctx: ProcedureDeclarationContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.procedureDeclaration`.
     * @param ctx the parse tree
     */
    exitProcedureDeclaration?: (ctx: ProcedureDeclarationContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.functionDeclaration`.
     * @param ctx the parse tree
     */
    enterFunctionDeclaration?: (ctx: FunctionDeclarationContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.functionDeclaration`.
     * @param ctx the parse tree
     */
    exitFunctionDeclaration?: (ctx: FunctionDeclarationContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.paramList`.
     * @param ctx the parse tree
     */
    enterParamList?: (ctx: ParamListContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.paramList`.
     * @param ctx the parse tree
     */
    exitParamList?: (ctx: ParamListContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.param`.
     * @param ctx the parse tree
     */
    enterParam?: (ctx: ParamContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.param`.
     * @param ctx the parse tree
     */
    exitParam?: (ctx: ParamContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.callStatement`.
     * @param ctx the parse tree
     */
    enterCallStatement?: (ctx: CallStatementContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.callStatement`.
     * @param ctx the parse tree
     */
    exitCallStatement?: (ctx: CallStatementContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.returnStatement`.
     * @param ctx the parse tree
     */
    enterReturnStatement?: (ctx: ReturnStatementContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.returnStatement`.
     * @param ctx the parse tree
     */
    exitReturnStatement?: (ctx: ReturnStatementContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.argList`.
     * @param ctx the parse tree
     */
    enterArgList?: (ctx: ArgListContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.argList`.
     * @param ctx the parse tree
     */
    exitArgList?: (ctx: ArgListContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.block`.
     * @param ctx the parse tree
     */
    enterBlock?: (ctx: BlockContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.block`.
     * @param ctx the parse tree
     */
    exitBlock?: (ctx: BlockContext) => void;
    /**
     * Enter a parse tree produced by the `notExpr`
     * labeled alternative in `PseudocodeParser.expr`.
     * @param ctx the parse tree
     */
    enterNotExpr?: (ctx: NotExprContext) => void;
    /**
     * Exit a parse tree produced by the `notExpr`
     * labeled alternative in `PseudocodeParser.expr`.
     * @param ctx the parse tree
     */
    exitNotExpr?: (ctx: NotExprContext) => void;
    /**
     * Enter a parse tree produced by the `powerExpr`
     * labeled alternative in `PseudocodeParser.expr`.
     * @param ctx the parse tree
     */
    enterPowerExpr?: (ctx: PowerExprContext) => void;
    /**
     * Exit a parse tree produced by the `powerExpr`
     * labeled alternative in `PseudocodeParser.expr`.
     * @param ctx the parse tree
     */
    exitPowerExpr?: (ctx: PowerExprContext) => void;
    /**
     * Enter a parse tree produced by the `addSubExpr`
     * labeled alternative in `PseudocodeParser.expr`.
     * @param ctx the parse tree
     */
    enterAddSubExpr?: (ctx: AddSubExprContext) => void;
    /**
     * Exit a parse tree produced by the `addSubExpr`
     * labeled alternative in `PseudocodeParser.expr`.
     * @param ctx the parse tree
     */
    exitAddSubExpr?: (ctx: AddSubExprContext) => void;
    /**
     * Enter a parse tree produced by the `unaryMinusExpr`
     * labeled alternative in `PseudocodeParser.expr`.
     * @param ctx the parse tree
     */
    enterUnaryMinusExpr?: (ctx: UnaryMinusExprContext) => void;
    /**
     * Exit a parse tree produced by the `unaryMinusExpr`
     * labeled alternative in `PseudocodeParser.expr`.
     * @param ctx the parse tree
     */
    exitUnaryMinusExpr?: (ctx: UnaryMinusExprContext) => void;
    /**
     * Enter a parse tree produced by the `atomExpr`
     * labeled alternative in `PseudocodeParser.expr`.
     * @param ctx the parse tree
     */
    enterAtomExpr?: (ctx: AtomExprContext) => void;
    /**
     * Exit a parse tree produced by the `atomExpr`
     * labeled alternative in `PseudocodeParser.expr`.
     * @param ctx the parse tree
     */
    exitAtomExpr?: (ctx: AtomExprContext) => void;
    /**
     * Enter a parse tree produced by the `orExpr`
     * labeled alternative in `PseudocodeParser.expr`.
     * @param ctx the parse tree
     */
    enterOrExpr?: (ctx: OrExprContext) => void;
    /**
     * Exit a parse tree produced by the `orExpr`
     * labeled alternative in `PseudocodeParser.expr`.
     * @param ctx the parse tree
     */
    exitOrExpr?: (ctx: OrExprContext) => void;
    /**
     * Enter a parse tree produced by the `comparisonExpr`
     * labeled alternative in `PseudocodeParser.expr`.
     * @param ctx the parse tree
     */
    enterComparisonExpr?: (ctx: ComparisonExprContext) => void;
    /**
     * Exit a parse tree produced by the `comparisonExpr`
     * labeled alternative in `PseudocodeParser.expr`.
     * @param ctx the parse tree
     */
    exitComparisonExpr?: (ctx: ComparisonExprContext) => void;
    /**
     * Enter a parse tree produced by the `mulDivExpr`
     * labeled alternative in `PseudocodeParser.expr`.
     * @param ctx the parse tree
     */
    enterMulDivExpr?: (ctx: MulDivExprContext) => void;
    /**
     * Exit a parse tree produced by the `mulDivExpr`
     * labeled alternative in `PseudocodeParser.expr`.
     * @param ctx the parse tree
     */
    exitMulDivExpr?: (ctx: MulDivExprContext) => void;
    /**
     * Enter a parse tree produced by the `concatExpr`
     * labeled alternative in `PseudocodeParser.expr`.
     * @param ctx the parse tree
     */
    enterConcatExpr?: (ctx: ConcatExprContext) => void;
    /**
     * Exit a parse tree produced by the `concatExpr`
     * labeled alternative in `PseudocodeParser.expr`.
     * @param ctx the parse tree
     */
    exitConcatExpr?: (ctx: ConcatExprContext) => void;
    /**
     * Enter a parse tree produced by the `andExpr`
     * labeled alternative in `PseudocodeParser.expr`.
     * @param ctx the parse tree
     */
    enterAndExpr?: (ctx: AndExprContext) => void;
    /**
     * Exit a parse tree produced by the `andExpr`
     * labeled alternative in `PseudocodeParser.expr`.
     * @param ctx the parse tree
     */
    exitAndExpr?: (ctx: AndExprContext) => void;
    /**
     * Enter a parse tree produced by the `parenAtom`
     * labeled alternative in `PseudocodeParser.atom`.
     * @param ctx the parse tree
     */
    enterParenAtom?: (ctx: ParenAtomContext) => void;
    /**
     * Exit a parse tree produced by the `parenAtom`
     * labeled alternative in `PseudocodeParser.atom`.
     * @param ctx the parse tree
     */
    exitParenAtom?: (ctx: ParenAtomContext) => void;
    /**
     * Enter a parse tree produced by the `functionCallAtom`
     * labeled alternative in `PseudocodeParser.atom`.
     * @param ctx the parse tree
     */
    enterFunctionCallAtom?: (ctx: FunctionCallAtomContext) => void;
    /**
     * Exit a parse tree produced by the `functionCallAtom`
     * labeled alternative in `PseudocodeParser.atom`.
     * @param ctx the parse tree
     */
    exitFunctionCallAtom?: (ctx: FunctionCallAtomContext) => void;
    /**
     * Enter a parse tree produced by the `arrayAccess1DAtom`
     * labeled alternative in `PseudocodeParser.atom`.
     * @param ctx the parse tree
     */
    enterArrayAccess1DAtom?: (ctx: ArrayAccess1DAtomContext) => void;
    /**
     * Exit a parse tree produced by the `arrayAccess1DAtom`
     * labeled alternative in `PseudocodeParser.atom`.
     * @param ctx the parse tree
     */
    exitArrayAccess1DAtom?: (ctx: ArrayAccess1DAtomContext) => void;
    /**
     * Enter a parse tree produced by the `arrayAccess2DAtom`
     * labeled alternative in `PseudocodeParser.atom`.
     * @param ctx the parse tree
     */
    enterArrayAccess2DAtom?: (ctx: ArrayAccess2DAtomContext) => void;
    /**
     * Exit a parse tree produced by the `arrayAccess2DAtom`
     * labeled alternative in `PseudocodeParser.atom`.
     * @param ctx the parse tree
     */
    exitArrayAccess2DAtom?: (ctx: ArrayAccess2DAtomContext) => void;
    /**
     * Enter a parse tree produced by the `identifierAtom`
     * labeled alternative in `PseudocodeParser.atom`.
     * @param ctx the parse tree
     */
    enterIdentifierAtom?: (ctx: IdentifierAtomContext) => void;
    /**
     * Exit a parse tree produced by the `identifierAtom`
     * labeled alternative in `PseudocodeParser.atom`.
     * @param ctx the parse tree
     */
    exitIdentifierAtom?: (ctx: IdentifierAtomContext) => void;
    /**
     * Enter a parse tree produced by the `integerAtom`
     * labeled alternative in `PseudocodeParser.atom`.
     * @param ctx the parse tree
     */
    enterIntegerAtom?: (ctx: IntegerAtomContext) => void;
    /**
     * Exit a parse tree produced by the `integerAtom`
     * labeled alternative in `PseudocodeParser.atom`.
     * @param ctx the parse tree
     */
    exitIntegerAtom?: (ctx: IntegerAtomContext) => void;
    /**
     * Enter a parse tree produced by the `realAtom`
     * labeled alternative in `PseudocodeParser.atom`.
     * @param ctx the parse tree
     */
    enterRealAtom?: (ctx: RealAtomContext) => void;
    /**
     * Exit a parse tree produced by the `realAtom`
     * labeled alternative in `PseudocodeParser.atom`.
     * @param ctx the parse tree
     */
    exitRealAtom?: (ctx: RealAtomContext) => void;
    /**
     * Enter a parse tree produced by the `stringAtom`
     * labeled alternative in `PseudocodeParser.atom`.
     * @param ctx the parse tree
     */
    enterStringAtom?: (ctx: StringAtomContext) => void;
    /**
     * Exit a parse tree produced by the `stringAtom`
     * labeled alternative in `PseudocodeParser.atom`.
     * @param ctx the parse tree
     */
    exitStringAtom?: (ctx: StringAtomContext) => void;
    /**
     * Enter a parse tree produced by the `charAtom`
     * labeled alternative in `PseudocodeParser.atom`.
     * @param ctx the parse tree
     */
    enterCharAtom?: (ctx: CharAtomContext) => void;
    /**
     * Exit a parse tree produced by the `charAtom`
     * labeled alternative in `PseudocodeParser.atom`.
     * @param ctx the parse tree
     */
    exitCharAtom?: (ctx: CharAtomContext) => void;
    /**
     * Enter a parse tree produced by the `trueAtom`
     * labeled alternative in `PseudocodeParser.atom`.
     * @param ctx the parse tree
     */
    enterTrueAtom?: (ctx: TrueAtomContext) => void;
    /**
     * Exit a parse tree produced by the `trueAtom`
     * labeled alternative in `PseudocodeParser.atom`.
     * @param ctx the parse tree
     */
    exitTrueAtom?: (ctx: TrueAtomContext) => void;
    /**
     * Enter a parse tree produced by the `falseAtom`
     * labeled alternative in `PseudocodeParser.atom`.
     * @param ctx the parse tree
     */
    enterFalseAtom?: (ctx: FalseAtomContext) => void;
    /**
     * Exit a parse tree produced by the `falseAtom`
     * labeled alternative in `PseudocodeParser.atom`.
     * @param ctx the parse tree
     */
    exitFalseAtom?: (ctx: FalseAtomContext) => void;

    visitTerminal(node: TerminalNode): void {}
    visitErrorNode(node: ErrorNode): void {}
    enterEveryRule(node: ParserRuleContext): void {}
    exitEveryRule(node: ParserRuleContext): void {}
}

