// Generated from i:/Projects/Web Apps/PseudoCode Online Compiler/IGCSE-Pseudocode-Online-Compiler/frontend/src/interpreter/grammar/Pseudocode.g4 by ANTLR 4.13.1
import org.antlr.v4.runtime.tree.ParseTreeListener;

/**
 * This interface defines a complete listener for a parse tree produced by
 * {@link PseudocodeParser}.
 */
public interface PseudocodeListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by {@link PseudocodeParser#program}.
	 * @param ctx the parse tree
	 */
	void enterProgram(PseudocodeParser.ProgramContext ctx);
	/**
	 * Exit a parse tree produced by {@link PseudocodeParser#program}.
	 * @param ctx the parse tree
	 */
	void exitProgram(PseudocodeParser.ProgramContext ctx);
	/**
	 * Enter a parse tree produced by {@link PseudocodeParser#statement}.
	 * @param ctx the parse tree
	 */
	void enterStatement(PseudocodeParser.StatementContext ctx);
	/**
	 * Exit a parse tree produced by {@link PseudocodeParser#statement}.
	 * @param ctx the parse tree
	 */
	void exitStatement(PseudocodeParser.StatementContext ctx);
	/**
	 * Enter a parse tree produced by {@link PseudocodeParser#declareStatement}.
	 * @param ctx the parse tree
	 */
	void enterDeclareStatement(PseudocodeParser.DeclareStatementContext ctx);
	/**
	 * Exit a parse tree produced by {@link PseudocodeParser#declareStatement}.
	 * @param ctx the parse tree
	 */
	void exitDeclareStatement(PseudocodeParser.DeclareStatementContext ctx);
	/**
	 * Enter a parse tree produced by {@link PseudocodeParser#constantStatement}.
	 * @param ctx the parse tree
	 */
	void enterConstantStatement(PseudocodeParser.ConstantStatementContext ctx);
	/**
	 * Exit a parse tree produced by {@link PseudocodeParser#constantStatement}.
	 * @param ctx the parse tree
	 */
	void exitConstantStatement(PseudocodeParser.ConstantStatementContext ctx);
	/**
	 * Enter a parse tree produced by {@link PseudocodeParser#dataType}.
	 * @param ctx the parse tree
	 */
	void enterDataType(PseudocodeParser.DataTypeContext ctx);
	/**
	 * Exit a parse tree produced by {@link PseudocodeParser#dataType}.
	 * @param ctx the parse tree
	 */
	void exitDataType(PseudocodeParser.DataTypeContext ctx);
	/**
	 * Enter a parse tree produced by {@link PseudocodeParser#assignmentStatement}.
	 * @param ctx the parse tree
	 */
	void enterAssignmentStatement(PseudocodeParser.AssignmentStatementContext ctx);
	/**
	 * Exit a parse tree produced by {@link PseudocodeParser#assignmentStatement}.
	 * @param ctx the parse tree
	 */
	void exitAssignmentStatement(PseudocodeParser.AssignmentStatementContext ctx);
	/**
	 * Enter a parse tree produced by {@link PseudocodeParser#inputStatement}.
	 * @param ctx the parse tree
	 */
	void enterInputStatement(PseudocodeParser.InputStatementContext ctx);
	/**
	 * Exit a parse tree produced by {@link PseudocodeParser#inputStatement}.
	 * @param ctx the parse tree
	 */
	void exitInputStatement(PseudocodeParser.InputStatementContext ctx);
	/**
	 * Enter a parse tree produced by {@link PseudocodeParser#outputStatement}.
	 * @param ctx the parse tree
	 */
	void enterOutputStatement(PseudocodeParser.OutputStatementContext ctx);
	/**
	 * Exit a parse tree produced by {@link PseudocodeParser#outputStatement}.
	 * @param ctx the parse tree
	 */
	void exitOutputStatement(PseudocodeParser.OutputStatementContext ctx);
	/**
	 * Enter a parse tree produced by {@link PseudocodeParser#exprList}.
	 * @param ctx the parse tree
	 */
	void enterExprList(PseudocodeParser.ExprListContext ctx);
	/**
	 * Exit a parse tree produced by {@link PseudocodeParser#exprList}.
	 * @param ctx the parse tree
	 */
	void exitExprList(PseudocodeParser.ExprListContext ctx);
	/**
	 * Enter a parse tree produced by {@link PseudocodeParser#ifStatement}.
	 * @param ctx the parse tree
	 */
	void enterIfStatement(PseudocodeParser.IfStatementContext ctx);
	/**
	 * Exit a parse tree produced by {@link PseudocodeParser#ifStatement}.
	 * @param ctx the parse tree
	 */
	void exitIfStatement(PseudocodeParser.IfStatementContext ctx);
	/**
	 * Enter a parse tree produced by {@link PseudocodeParser#caseStatement}.
	 * @param ctx the parse tree
	 */
	void enterCaseStatement(PseudocodeParser.CaseStatementContext ctx);
	/**
	 * Exit a parse tree produced by {@link PseudocodeParser#caseStatement}.
	 * @param ctx the parse tree
	 */
	void exitCaseStatement(PseudocodeParser.CaseStatementContext ctx);
	/**
	 * Enter a parse tree produced by {@link PseudocodeParser#caseClause}.
	 * @param ctx the parse tree
	 */
	void enterCaseClause(PseudocodeParser.CaseClauseContext ctx);
	/**
	 * Exit a parse tree produced by {@link PseudocodeParser#caseClause}.
	 * @param ctx the parse tree
	 */
	void exitCaseClause(PseudocodeParser.CaseClauseContext ctx);
	/**
	 * Enter a parse tree produced by {@link PseudocodeParser#forStatement}.
	 * @param ctx the parse tree
	 */
	void enterForStatement(PseudocodeParser.ForStatementContext ctx);
	/**
	 * Exit a parse tree produced by {@link PseudocodeParser#forStatement}.
	 * @param ctx the parse tree
	 */
	void exitForStatement(PseudocodeParser.ForStatementContext ctx);
	/**
	 * Enter a parse tree produced by {@link PseudocodeParser#whileStatement}.
	 * @param ctx the parse tree
	 */
	void enterWhileStatement(PseudocodeParser.WhileStatementContext ctx);
	/**
	 * Exit a parse tree produced by {@link PseudocodeParser#whileStatement}.
	 * @param ctx the parse tree
	 */
	void exitWhileStatement(PseudocodeParser.WhileStatementContext ctx);
	/**
	 * Enter a parse tree produced by {@link PseudocodeParser#repeatStatement}.
	 * @param ctx the parse tree
	 */
	void enterRepeatStatement(PseudocodeParser.RepeatStatementContext ctx);
	/**
	 * Exit a parse tree produced by {@link PseudocodeParser#repeatStatement}.
	 * @param ctx the parse tree
	 */
	void exitRepeatStatement(PseudocodeParser.RepeatStatementContext ctx);
	/**
	 * Enter a parse tree produced by {@link PseudocodeParser#procedureDeclaration}.
	 * @param ctx the parse tree
	 */
	void enterProcedureDeclaration(PseudocodeParser.ProcedureDeclarationContext ctx);
	/**
	 * Exit a parse tree produced by {@link PseudocodeParser#procedureDeclaration}.
	 * @param ctx the parse tree
	 */
	void exitProcedureDeclaration(PseudocodeParser.ProcedureDeclarationContext ctx);
	/**
	 * Enter a parse tree produced by {@link PseudocodeParser#functionDeclaration}.
	 * @param ctx the parse tree
	 */
	void enterFunctionDeclaration(PseudocodeParser.FunctionDeclarationContext ctx);
	/**
	 * Exit a parse tree produced by {@link PseudocodeParser#functionDeclaration}.
	 * @param ctx the parse tree
	 */
	void exitFunctionDeclaration(PseudocodeParser.FunctionDeclarationContext ctx);
	/**
	 * Enter a parse tree produced by {@link PseudocodeParser#paramList}.
	 * @param ctx the parse tree
	 */
	void enterParamList(PseudocodeParser.ParamListContext ctx);
	/**
	 * Exit a parse tree produced by {@link PseudocodeParser#paramList}.
	 * @param ctx the parse tree
	 */
	void exitParamList(PseudocodeParser.ParamListContext ctx);
	/**
	 * Enter a parse tree produced by {@link PseudocodeParser#param}.
	 * @param ctx the parse tree
	 */
	void enterParam(PseudocodeParser.ParamContext ctx);
	/**
	 * Exit a parse tree produced by {@link PseudocodeParser#param}.
	 * @param ctx the parse tree
	 */
	void exitParam(PseudocodeParser.ParamContext ctx);
	/**
	 * Enter a parse tree produced by {@link PseudocodeParser#callStatement}.
	 * @param ctx the parse tree
	 */
	void enterCallStatement(PseudocodeParser.CallStatementContext ctx);
	/**
	 * Exit a parse tree produced by {@link PseudocodeParser#callStatement}.
	 * @param ctx the parse tree
	 */
	void exitCallStatement(PseudocodeParser.CallStatementContext ctx);
	/**
	 * Enter a parse tree produced by {@link PseudocodeParser#returnStatement}.
	 * @param ctx the parse tree
	 */
	void enterReturnStatement(PseudocodeParser.ReturnStatementContext ctx);
	/**
	 * Exit a parse tree produced by {@link PseudocodeParser#returnStatement}.
	 * @param ctx the parse tree
	 */
	void exitReturnStatement(PseudocodeParser.ReturnStatementContext ctx);
	/**
	 * Enter a parse tree produced by {@link PseudocodeParser#argList}.
	 * @param ctx the parse tree
	 */
	void enterArgList(PseudocodeParser.ArgListContext ctx);
	/**
	 * Exit a parse tree produced by {@link PseudocodeParser#argList}.
	 * @param ctx the parse tree
	 */
	void exitArgList(PseudocodeParser.ArgListContext ctx);
	/**
	 * Enter a parse tree produced by {@link PseudocodeParser#block}.
	 * @param ctx the parse tree
	 */
	void enterBlock(PseudocodeParser.BlockContext ctx);
	/**
	 * Exit a parse tree produced by {@link PseudocodeParser#block}.
	 * @param ctx the parse tree
	 */
	void exitBlock(PseudocodeParser.BlockContext ctx);
	/**
	 * Enter a parse tree produced by the {@code notExpr}
	 * labeled alternative in {@link PseudocodeParser#expr}.
	 * @param ctx the parse tree
	 */
	void enterNotExpr(PseudocodeParser.NotExprContext ctx);
	/**
	 * Exit a parse tree produced by the {@code notExpr}
	 * labeled alternative in {@link PseudocodeParser#expr}.
	 * @param ctx the parse tree
	 */
	void exitNotExpr(PseudocodeParser.NotExprContext ctx);
	/**
	 * Enter a parse tree produced by the {@code powerExpr}
	 * labeled alternative in {@link PseudocodeParser#expr}.
	 * @param ctx the parse tree
	 */
	void enterPowerExpr(PseudocodeParser.PowerExprContext ctx);
	/**
	 * Exit a parse tree produced by the {@code powerExpr}
	 * labeled alternative in {@link PseudocodeParser#expr}.
	 * @param ctx the parse tree
	 */
	void exitPowerExpr(PseudocodeParser.PowerExprContext ctx);
	/**
	 * Enter a parse tree produced by the {@code addSubExpr}
	 * labeled alternative in {@link PseudocodeParser#expr}.
	 * @param ctx the parse tree
	 */
	void enterAddSubExpr(PseudocodeParser.AddSubExprContext ctx);
	/**
	 * Exit a parse tree produced by the {@code addSubExpr}
	 * labeled alternative in {@link PseudocodeParser#expr}.
	 * @param ctx the parse tree
	 */
	void exitAddSubExpr(PseudocodeParser.AddSubExprContext ctx);
	/**
	 * Enter a parse tree produced by the {@code unaryMinusExpr}
	 * labeled alternative in {@link PseudocodeParser#expr}.
	 * @param ctx the parse tree
	 */
	void enterUnaryMinusExpr(PseudocodeParser.UnaryMinusExprContext ctx);
	/**
	 * Exit a parse tree produced by the {@code unaryMinusExpr}
	 * labeled alternative in {@link PseudocodeParser#expr}.
	 * @param ctx the parse tree
	 */
	void exitUnaryMinusExpr(PseudocodeParser.UnaryMinusExprContext ctx);
	/**
	 * Enter a parse tree produced by the {@code atomExpr}
	 * labeled alternative in {@link PseudocodeParser#expr}.
	 * @param ctx the parse tree
	 */
	void enterAtomExpr(PseudocodeParser.AtomExprContext ctx);
	/**
	 * Exit a parse tree produced by the {@code atomExpr}
	 * labeled alternative in {@link PseudocodeParser#expr}.
	 * @param ctx the parse tree
	 */
	void exitAtomExpr(PseudocodeParser.AtomExprContext ctx);
	/**
	 * Enter a parse tree produced by the {@code orExpr}
	 * labeled alternative in {@link PseudocodeParser#expr}.
	 * @param ctx the parse tree
	 */
	void enterOrExpr(PseudocodeParser.OrExprContext ctx);
	/**
	 * Exit a parse tree produced by the {@code orExpr}
	 * labeled alternative in {@link PseudocodeParser#expr}.
	 * @param ctx the parse tree
	 */
	void exitOrExpr(PseudocodeParser.OrExprContext ctx);
	/**
	 * Enter a parse tree produced by the {@code comparisonExpr}
	 * labeled alternative in {@link PseudocodeParser#expr}.
	 * @param ctx the parse tree
	 */
	void enterComparisonExpr(PseudocodeParser.ComparisonExprContext ctx);
	/**
	 * Exit a parse tree produced by the {@code comparisonExpr}
	 * labeled alternative in {@link PseudocodeParser#expr}.
	 * @param ctx the parse tree
	 */
	void exitComparisonExpr(PseudocodeParser.ComparisonExprContext ctx);
	/**
	 * Enter a parse tree produced by the {@code mulDivExpr}
	 * labeled alternative in {@link PseudocodeParser#expr}.
	 * @param ctx the parse tree
	 */
	void enterMulDivExpr(PseudocodeParser.MulDivExprContext ctx);
	/**
	 * Exit a parse tree produced by the {@code mulDivExpr}
	 * labeled alternative in {@link PseudocodeParser#expr}.
	 * @param ctx the parse tree
	 */
	void exitMulDivExpr(PseudocodeParser.MulDivExprContext ctx);
	/**
	 * Enter a parse tree produced by the {@code concatExpr}
	 * labeled alternative in {@link PseudocodeParser#expr}.
	 * @param ctx the parse tree
	 */
	void enterConcatExpr(PseudocodeParser.ConcatExprContext ctx);
	/**
	 * Exit a parse tree produced by the {@code concatExpr}
	 * labeled alternative in {@link PseudocodeParser#expr}.
	 * @param ctx the parse tree
	 */
	void exitConcatExpr(PseudocodeParser.ConcatExprContext ctx);
	/**
	 * Enter a parse tree produced by the {@code andExpr}
	 * labeled alternative in {@link PseudocodeParser#expr}.
	 * @param ctx the parse tree
	 */
	void enterAndExpr(PseudocodeParser.AndExprContext ctx);
	/**
	 * Exit a parse tree produced by the {@code andExpr}
	 * labeled alternative in {@link PseudocodeParser#expr}.
	 * @param ctx the parse tree
	 */
	void exitAndExpr(PseudocodeParser.AndExprContext ctx);
	/**
	 * Enter a parse tree produced by the {@code parenAtom}
	 * labeled alternative in {@link PseudocodeParser#atom}.
	 * @param ctx the parse tree
	 */
	void enterParenAtom(PseudocodeParser.ParenAtomContext ctx);
	/**
	 * Exit a parse tree produced by the {@code parenAtom}
	 * labeled alternative in {@link PseudocodeParser#atom}.
	 * @param ctx the parse tree
	 */
	void exitParenAtom(PseudocodeParser.ParenAtomContext ctx);
	/**
	 * Enter a parse tree produced by the {@code functionCallAtom}
	 * labeled alternative in {@link PseudocodeParser#atom}.
	 * @param ctx the parse tree
	 */
	void enterFunctionCallAtom(PseudocodeParser.FunctionCallAtomContext ctx);
	/**
	 * Exit a parse tree produced by the {@code functionCallAtom}
	 * labeled alternative in {@link PseudocodeParser#atom}.
	 * @param ctx the parse tree
	 */
	void exitFunctionCallAtom(PseudocodeParser.FunctionCallAtomContext ctx);
	/**
	 * Enter a parse tree produced by the {@code arrayAccess1DAtom}
	 * labeled alternative in {@link PseudocodeParser#atom}.
	 * @param ctx the parse tree
	 */
	void enterArrayAccess1DAtom(PseudocodeParser.ArrayAccess1DAtomContext ctx);
	/**
	 * Exit a parse tree produced by the {@code arrayAccess1DAtom}
	 * labeled alternative in {@link PseudocodeParser#atom}.
	 * @param ctx the parse tree
	 */
	void exitArrayAccess1DAtom(PseudocodeParser.ArrayAccess1DAtomContext ctx);
	/**
	 * Enter a parse tree produced by the {@code arrayAccess2DAtom}
	 * labeled alternative in {@link PseudocodeParser#atom}.
	 * @param ctx the parse tree
	 */
	void enterArrayAccess2DAtom(PseudocodeParser.ArrayAccess2DAtomContext ctx);
	/**
	 * Exit a parse tree produced by the {@code arrayAccess2DAtom}
	 * labeled alternative in {@link PseudocodeParser#atom}.
	 * @param ctx the parse tree
	 */
	void exitArrayAccess2DAtom(PseudocodeParser.ArrayAccess2DAtomContext ctx);
	/**
	 * Enter a parse tree produced by the {@code identifierAtom}
	 * labeled alternative in {@link PseudocodeParser#atom}.
	 * @param ctx the parse tree
	 */
	void enterIdentifierAtom(PseudocodeParser.IdentifierAtomContext ctx);
	/**
	 * Exit a parse tree produced by the {@code identifierAtom}
	 * labeled alternative in {@link PseudocodeParser#atom}.
	 * @param ctx the parse tree
	 */
	void exitIdentifierAtom(PseudocodeParser.IdentifierAtomContext ctx);
	/**
	 * Enter a parse tree produced by the {@code integerAtom}
	 * labeled alternative in {@link PseudocodeParser#atom}.
	 * @param ctx the parse tree
	 */
	void enterIntegerAtom(PseudocodeParser.IntegerAtomContext ctx);
	/**
	 * Exit a parse tree produced by the {@code integerAtom}
	 * labeled alternative in {@link PseudocodeParser#atom}.
	 * @param ctx the parse tree
	 */
	void exitIntegerAtom(PseudocodeParser.IntegerAtomContext ctx);
	/**
	 * Enter a parse tree produced by the {@code realAtom}
	 * labeled alternative in {@link PseudocodeParser#atom}.
	 * @param ctx the parse tree
	 */
	void enterRealAtom(PseudocodeParser.RealAtomContext ctx);
	/**
	 * Exit a parse tree produced by the {@code realAtom}
	 * labeled alternative in {@link PseudocodeParser#atom}.
	 * @param ctx the parse tree
	 */
	void exitRealAtom(PseudocodeParser.RealAtomContext ctx);
	/**
	 * Enter a parse tree produced by the {@code stringAtom}
	 * labeled alternative in {@link PseudocodeParser#atom}.
	 * @param ctx the parse tree
	 */
	void enterStringAtom(PseudocodeParser.StringAtomContext ctx);
	/**
	 * Exit a parse tree produced by the {@code stringAtom}
	 * labeled alternative in {@link PseudocodeParser#atom}.
	 * @param ctx the parse tree
	 */
	void exitStringAtom(PseudocodeParser.StringAtomContext ctx);
	/**
	 * Enter a parse tree produced by the {@code charAtom}
	 * labeled alternative in {@link PseudocodeParser#atom}.
	 * @param ctx the parse tree
	 */
	void enterCharAtom(PseudocodeParser.CharAtomContext ctx);
	/**
	 * Exit a parse tree produced by the {@code charAtom}
	 * labeled alternative in {@link PseudocodeParser#atom}.
	 * @param ctx the parse tree
	 */
	void exitCharAtom(PseudocodeParser.CharAtomContext ctx);
	/**
	 * Enter a parse tree produced by the {@code trueAtom}
	 * labeled alternative in {@link PseudocodeParser#atom}.
	 * @param ctx the parse tree
	 */
	void enterTrueAtom(PseudocodeParser.TrueAtomContext ctx);
	/**
	 * Exit a parse tree produced by the {@code trueAtom}
	 * labeled alternative in {@link PseudocodeParser#atom}.
	 * @param ctx the parse tree
	 */
	void exitTrueAtom(PseudocodeParser.TrueAtomContext ctx);
	/**
	 * Enter a parse tree produced by the {@code falseAtom}
	 * labeled alternative in {@link PseudocodeParser#atom}.
	 * @param ctx the parse tree
	 */
	void enterFalseAtom(PseudocodeParser.FalseAtomContext ctx);
	/**
	 * Exit a parse tree produced by the {@code falseAtom}
	 * labeled alternative in {@link PseudocodeParser#atom}.
	 * @param ctx the parse tree
	 */
	void exitFalseAtom(PseudocodeParser.FalseAtomContext ctx);
}