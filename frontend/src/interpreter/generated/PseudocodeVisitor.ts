// Generated from src/interpreter/grammar/Pseudocode.g4 by ANTLR 4.13.1

import { AbstractParseTreeVisitor } from "antlr4ng";


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
import { OpenFileStatementContext } from "./PseudocodeParser.js";
import { ReadFileStatementContext } from "./PseudocodeParser.js";
import { WriteFileStatementContext } from "./PseudocodeParser.js";
import { CloseFileStatementContext } from "./PseudocodeParser.js";
import { FileModeContext } from "./PseudocodeParser.js";
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
import { DivFunctionAtomContext } from "./PseudocodeParser.js";
import { ModFunctionAtomContext } from "./PseudocodeParser.js";
import { IdentifierAtomContext } from "./PseudocodeParser.js";
import { IntegerAtomContext } from "./PseudocodeParser.js";
import { RealAtomContext } from "./PseudocodeParser.js";
import { StringAtomContext } from "./PseudocodeParser.js";
import { CharAtomContext } from "./PseudocodeParser.js";
import { TrueAtomContext } from "./PseudocodeParser.js";
import { FalseAtomContext } from "./PseudocodeParser.js";


/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `PseudocodeParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export class PseudocodeVisitor<Result> extends AbstractParseTreeVisitor<Result> {
    /**
     * Visit a parse tree produced by `PseudocodeParser.program`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitProgram?: (ctx: ProgramContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.statement`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitStatement?: (ctx: StatementContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.declareStatement`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitDeclareStatement?: (ctx: DeclareStatementContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.constantStatement`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitConstantStatement?: (ctx: ConstantStatementContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.dataType`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitDataType?: (ctx: DataTypeContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.assignmentStatement`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitAssignmentStatement?: (ctx: AssignmentStatementContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.inputStatement`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitInputStatement?: (ctx: InputStatementContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.outputStatement`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitOutputStatement?: (ctx: OutputStatementContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.exprList`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitExprList?: (ctx: ExprListContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.ifStatement`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIfStatement?: (ctx: IfStatementContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.caseStatement`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitCaseStatement?: (ctx: CaseStatementContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.caseClause`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitCaseClause?: (ctx: CaseClauseContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.forStatement`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitForStatement?: (ctx: ForStatementContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.whileStatement`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitWhileStatement?: (ctx: WhileStatementContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.repeatStatement`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitRepeatStatement?: (ctx: RepeatStatementContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.procedureDeclaration`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitProcedureDeclaration?: (ctx: ProcedureDeclarationContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.functionDeclaration`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitFunctionDeclaration?: (ctx: FunctionDeclarationContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.paramList`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitParamList?: (ctx: ParamListContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.param`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitParam?: (ctx: ParamContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.callStatement`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitCallStatement?: (ctx: CallStatementContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.returnStatement`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitReturnStatement?: (ctx: ReturnStatementContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.openFileStatement`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitOpenFileStatement?: (ctx: OpenFileStatementContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.readFileStatement`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitReadFileStatement?: (ctx: ReadFileStatementContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.writeFileStatement`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitWriteFileStatement?: (ctx: WriteFileStatementContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.closeFileStatement`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitCloseFileStatement?: (ctx: CloseFileStatementContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.fileMode`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitFileMode?: (ctx: FileModeContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.argList`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitArgList?: (ctx: ArgListContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.block`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitBlock?: (ctx: BlockContext) => Result;
    /**
     * Visit a parse tree produced by the `notExpr`
     * labeled alternative in `PseudocodeParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitNotExpr?: (ctx: NotExprContext) => Result;
    /**
     * Visit a parse tree produced by the `powerExpr`
     * labeled alternative in `PseudocodeParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitPowerExpr?: (ctx: PowerExprContext) => Result;
    /**
     * Visit a parse tree produced by the `addSubExpr`
     * labeled alternative in `PseudocodeParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitAddSubExpr?: (ctx: AddSubExprContext) => Result;
    /**
     * Visit a parse tree produced by the `unaryMinusExpr`
     * labeled alternative in `PseudocodeParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitUnaryMinusExpr?: (ctx: UnaryMinusExprContext) => Result;
    /**
     * Visit a parse tree produced by the `atomExpr`
     * labeled alternative in `PseudocodeParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitAtomExpr?: (ctx: AtomExprContext) => Result;
    /**
     * Visit a parse tree produced by the `orExpr`
     * labeled alternative in `PseudocodeParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitOrExpr?: (ctx: OrExprContext) => Result;
    /**
     * Visit a parse tree produced by the `comparisonExpr`
     * labeled alternative in `PseudocodeParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitComparisonExpr?: (ctx: ComparisonExprContext) => Result;
    /**
     * Visit a parse tree produced by the `mulDivExpr`
     * labeled alternative in `PseudocodeParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitMulDivExpr?: (ctx: MulDivExprContext) => Result;
    /**
     * Visit a parse tree produced by the `concatExpr`
     * labeled alternative in `PseudocodeParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitConcatExpr?: (ctx: ConcatExprContext) => Result;
    /**
     * Visit a parse tree produced by the `andExpr`
     * labeled alternative in `PseudocodeParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitAndExpr?: (ctx: AndExprContext) => Result;
    /**
     * Visit a parse tree produced by the `parenAtom`
     * labeled alternative in `PseudocodeParser.atom`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitParenAtom?: (ctx: ParenAtomContext) => Result;
    /**
     * Visit a parse tree produced by the `functionCallAtom`
     * labeled alternative in `PseudocodeParser.atom`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitFunctionCallAtom?: (ctx: FunctionCallAtomContext) => Result;
    /**
     * Visit a parse tree produced by the `arrayAccess1DAtom`
     * labeled alternative in `PseudocodeParser.atom`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitArrayAccess1DAtom?: (ctx: ArrayAccess1DAtomContext) => Result;
    /**
     * Visit a parse tree produced by the `arrayAccess2DAtom`
     * labeled alternative in `PseudocodeParser.atom`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitArrayAccess2DAtom?: (ctx: ArrayAccess2DAtomContext) => Result;
    /**
     * Visit a parse tree produced by the `divFunctionAtom`
     * labeled alternative in `PseudocodeParser.atom`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitDivFunctionAtom?: (ctx: DivFunctionAtomContext) => Result;
    /**
     * Visit a parse tree produced by the `modFunctionAtom`
     * labeled alternative in `PseudocodeParser.atom`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitModFunctionAtom?: (ctx: ModFunctionAtomContext) => Result;
    /**
     * Visit a parse tree produced by the `identifierAtom`
     * labeled alternative in `PseudocodeParser.atom`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIdentifierAtom?: (ctx: IdentifierAtomContext) => Result;
    /**
     * Visit a parse tree produced by the `integerAtom`
     * labeled alternative in `PseudocodeParser.atom`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIntegerAtom?: (ctx: IntegerAtomContext) => Result;
    /**
     * Visit a parse tree produced by the `realAtom`
     * labeled alternative in `PseudocodeParser.atom`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitRealAtom?: (ctx: RealAtomContext) => Result;
    /**
     * Visit a parse tree produced by the `stringAtom`
     * labeled alternative in `PseudocodeParser.atom`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitStringAtom?: (ctx: StringAtomContext) => Result;
    /**
     * Visit a parse tree produced by the `charAtom`
     * labeled alternative in `PseudocodeParser.atom`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitCharAtom?: (ctx: CharAtomContext) => Result;
    /**
     * Visit a parse tree produced by the `trueAtom`
     * labeled alternative in `PseudocodeParser.atom`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitTrueAtom?: (ctx: TrueAtomContext) => Result;
    /**
     * Visit a parse tree produced by the `falseAtom`
     * labeled alternative in `PseudocodeParser.atom`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitFalseAtom?: (ctx: FalseAtomContext) => Result;
}

