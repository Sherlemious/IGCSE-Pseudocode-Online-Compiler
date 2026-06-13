// Generated from src/interpreter/grammar/Pseudocode.g4 by ANTLR 4.13.1

import { AbstractParseTreeVisitor } from "antlr4ng";


import { ProgramContext } from "./PseudocodeParser.js";
import { StatementContext } from "./PseudocodeParser.js";
import { DeclareStatementContext } from "./PseudocodeParser.js";
import { IdentifierListContext } from "./PseudocodeParser.js";
import { IdentifierContext } from "./PseudocodeParser.js";
import { ConstantStatementContext } from "./PseudocodeParser.js";
import { DataTypeContext } from "./PseudocodeParser.js";
import { EnumTypeDefContext } from "./PseudocodeParser.js";
import { PointerTypeDefContext } from "./PseudocodeParser.js";
import { SetTypeDefContext } from "./PseudocodeParser.js";
import { RecordTypeDefContext } from "./PseudocodeParser.js";
import { DefineStatementContext } from "./PseudocodeParser.js";
import { ClassDeclarationContext } from "./PseudocodeParser.js";
import { ClassFieldMemberContext } from "./PseudocodeParser.js";
import { ClassProcMemberContext } from "./PseudocodeParser.js";
import { ClassFuncMemberContext } from "./PseudocodeParser.js";
import { DesignatorContext } from "./PseudocodeParser.js";
import { DesignatorPartContext } from "./PseudocodeParser.js";
import { MemberNameContext } from "./PseudocodeParser.js";
import { AssignmentStatementContext } from "./PseudocodeParser.js";
import { SingleAssignmentContext } from "./PseudocodeParser.js";
import { InputStatementContext } from "./PseudocodeParser.js";
import { OutputStatementContext } from "./PseudocodeParser.js";
import { ExprListContext } from "./PseudocodeParser.js";
import { IfStatementContext } from "./PseudocodeParser.js";
import { CaseStatementContext } from "./PseudocodeParser.js";
import { CaseClauseContext } from "./PseudocodeParser.js";
import { CaseLabelContext } from "./PseudocodeParser.js";
import { ForStatementContext } from "./PseudocodeParser.js";
import { WhileStatementContext } from "./PseudocodeParser.js";
import { RepeatStatementContext } from "./PseudocodeParser.js";
import { ProcedureDeclarationContext } from "./PseudocodeParser.js";
import { FunctionDeclarationContext } from "./PseudocodeParser.js";
import { ParamListContext } from "./PseudocodeParser.js";
import { ParamContext } from "./PseudocodeParser.js";
import { CallStatementContext } from "./PseudocodeParser.js";
import { MethodCallContext } from "./PseudocodeParser.js";
import { MethodCallStatementContext } from "./PseudocodeParser.js";
import { ReturnStatementContext } from "./PseudocodeParser.js";
import { OpenFileStatementContext } from "./PseudocodeParser.js";
import { ReadFileStatementContext } from "./PseudocodeParser.js";
import { WriteFileStatementContext } from "./PseudocodeParser.js";
import { CloseFileStatementContext } from "./PseudocodeParser.js";
import { SeekStatementContext } from "./PseudocodeParser.js";
import { GetRecordStatementContext } from "./PseudocodeParser.js";
import { PutRecordStatementContext } from "./PseudocodeParser.js";
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
import { NewInstanceAtomContext } from "./PseudocodeParser.js";
import { AddressOfAtomContext } from "./PseudocodeParser.js";
import { DivFunctionAtomContext } from "./PseudocodeParser.js";
import { ModFunctionAtomContext } from "./PseudocodeParser.js";
import { DesignatorAtomContext } from "./PseudocodeParser.js";
import { IntegerAtomContext } from "./PseudocodeParser.js";
import { RealAtomContext } from "./PseudocodeParser.js";
import { DateAtomContext } from "./PseudocodeParser.js";
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
     * Visit a parse tree produced by `PseudocodeParser.identifierList`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIdentifierList?: (ctx: IdentifierListContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.identifier`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIdentifier?: (ctx: IdentifierContext) => Result;
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
     * Visit a parse tree produced by the `enumTypeDef`
     * labeled alternative in `PseudocodeParser.typeDefinition`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitEnumTypeDef?: (ctx: EnumTypeDefContext) => Result;
    /**
     * Visit a parse tree produced by the `pointerTypeDef`
     * labeled alternative in `PseudocodeParser.typeDefinition`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitPointerTypeDef?: (ctx: PointerTypeDefContext) => Result;
    /**
     * Visit a parse tree produced by the `setTypeDef`
     * labeled alternative in `PseudocodeParser.typeDefinition`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitSetTypeDef?: (ctx: SetTypeDefContext) => Result;
    /**
     * Visit a parse tree produced by the `recordTypeDef`
     * labeled alternative in `PseudocodeParser.typeDefinition`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitRecordTypeDef?: (ctx: RecordTypeDefContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.defineStatement`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitDefineStatement?: (ctx: DefineStatementContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.classDeclaration`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitClassDeclaration?: (ctx: ClassDeclarationContext) => Result;
    /**
     * Visit a parse tree produced by the `classFieldMember`
     * labeled alternative in `PseudocodeParser.classMember`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitClassFieldMember?: (ctx: ClassFieldMemberContext) => Result;
    /**
     * Visit a parse tree produced by the `classProcMember`
     * labeled alternative in `PseudocodeParser.classMember`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitClassProcMember?: (ctx: ClassProcMemberContext) => Result;
    /**
     * Visit a parse tree produced by the `classFuncMember`
     * labeled alternative in `PseudocodeParser.classMember`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitClassFuncMember?: (ctx: ClassFuncMemberContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.designator`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitDesignator?: (ctx: DesignatorContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.designatorPart`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitDesignatorPart?: (ctx: DesignatorPartContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.memberName`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitMemberName?: (ctx: MemberNameContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.assignmentStatement`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitAssignmentStatement?: (ctx: AssignmentStatementContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.singleAssignment`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitSingleAssignment?: (ctx: SingleAssignmentContext) => Result;
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
     * Visit a parse tree produced by `PseudocodeParser.caseLabel`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitCaseLabel?: (ctx: CaseLabelContext) => Result;
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
     * Visit a parse tree produced by `PseudocodeParser.methodCall`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitMethodCall?: (ctx: MethodCallContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.methodCallStatement`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitMethodCallStatement?: (ctx: MethodCallStatementContext) => Result;
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
     * Visit a parse tree produced by `PseudocodeParser.seekStatement`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitSeekStatement?: (ctx: SeekStatementContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.getRecordStatement`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitGetRecordStatement?: (ctx: GetRecordStatementContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.putRecordStatement`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitPutRecordStatement?: (ctx: PutRecordStatementContext) => Result;
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
     * Visit a parse tree produced by the `newInstanceAtom`
     * labeled alternative in `PseudocodeParser.atom`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitNewInstanceAtom?: (ctx: NewInstanceAtomContext) => Result;
    /**
     * Visit a parse tree produced by the `addressOfAtom`
     * labeled alternative in `PseudocodeParser.atom`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitAddressOfAtom?: (ctx: AddressOfAtomContext) => Result;
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
     * Visit a parse tree produced by the `designatorAtom`
     * labeled alternative in `PseudocodeParser.atom`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitDesignatorAtom?: (ctx: DesignatorAtomContext) => Result;
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
     * Visit a parse tree produced by the `dateAtom`
     * labeled alternative in `PseudocodeParser.atom`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitDateAtom?: (ctx: DateAtomContext) => Result;
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

