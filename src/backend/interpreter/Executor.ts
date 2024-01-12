import {ICode} from "../../intermediate/ICode.ts";
import {Backend} from "../Backend.ts";
import {Message} from "../../message/Message.ts";
import {MessageType} from "../../message/MessageType.ts";
import {SymTabStack} from "../../intermediate/SymTabStack.ts";
import {RuntimeErrorHandler} from "./RuntimeErrorHandler.ts";
import {ICodeNode} from "../../intermediate/ICodeNode.ts";
import {ICodeKeyImpl} from "../../intermediate/icodeimpl/ICodeKeyImpl.ts";
import {ICodeNodeTypeImpl} from "../../intermediate/icodeimpl/ICodeNodeTypeImpl.ts";
import {RuntimeErrorCode} from "./RuntimeErrorCode.ts";
import {SymTabEntry} from "../../intermediate/SymTabEntry.ts";
import {SymTabKeyImpl} from "../../intermediate/symtabimpl/SymTabKeyImpl.ts";
import {PascalParserTD} from "../../frontend/pascal/PascalParserTD.ts";
import {ICodeNodeImpl} from "../../intermediate/icodeimpl/ICodeNodeImpl.ts";

export class Executor extends Backend {


    protected errorHandler: RuntimeErrorHandler = new RuntimeErrorHandler();
    protected static executionCount: number = 0;

    /**
     * @constructor
     * @param parent the parent executor.
     */
    // @ts-ignore
    constructor(parent?: Executor) {
        super();
    }

    public getErrorHandler(): RuntimeErrorHandler {
        return this.errorHandler;
    }

    /**
     * Process the intermediate code and the symbol table generated by
     * the parser to execute the source program.
     * @param iCode
     * @param symTab
     */
    public process(iCode: ICode, symTabStack: SymTabStack): void {
        this.symTabStack = symTabStack;
        this.iCode = iCode;

        const startTime = Date.now();

        // Get the root node of the intermediate code and execute.
        let rootNode: ICodeNode = iCode.getRoot()!;
        let statementExecutor = new StatementExecutor(this);
        statementExecutor.execute(rootNode);

        const endTime = Date.now();
        let elapsedTime = (endTime - startTime)/1000;

        let runtimeErrors = this.errorHandler.getErrorCount();

        // Send the interpreter summary message.
        this.sendMessage(new Message(MessageType.INTERPRETER_SUMMARY, {
            execution_count: Executor.executionCount,
            runtime_errors: runtimeErrors,
            elapsed_time: elapsedTime,
        }));
    }
}


class StatementExecutor extends Executor {
    /**
     * @constructor
     * @param parent the parent executor.
     */
    constructor(parent: Executor) {
        super(parent);
        this.errorHandler = parent.getErrorHandler();
        this.messageHandler = parent.getMessageHandler();
    }

    public execute(node: ICodeNode): any {
        let nodeType = node.getType() as ICodeNodeTypeImpl;

        // Send a message about the current source line.
        this.sendSourceLineMessage(node);

        switch (nodeType) {
            case ICodeNodeTypeImpl.COMPOUND: {
                let compoundExecutor = new CompoundExecutor(this);
                return compoundExecutor.execute(node);
            }

            case ICodeNodeTypeImpl.ASSIGN: {
                let assignmentExecutor = new AssignmentExecutor(this);
                return assignmentExecutor.execute(node);
            }

            case ICodeNodeTypeImpl.LOOP: {
                let loopExecutor = new LoopExecutor(this);
                return loopExecutor.execute(node);
            }

            case ICodeNodeTypeImpl.IF: {
                let ifExecutor = new IfExecutor(this);
                return ifExecutor.execute(node);
            }

            case ICodeNodeTypeImpl.SELECT: {
                let selectExecutor = new SelectExecutor(this);
                return selectExecutor.execute(node);
            }

            case ICodeNodeTypeImpl.NO_OP: {
                return undefined;
            }

            default: {
                this.errorHandler.flag(node, RuntimeErrorCode.UNIMPLEMENTED_FEATURE, this);
                return undefined;
            }
        }
    }

    /**
     * Send a message about the current source line.
     * @param node the statement node.
     * @private
     */
    private sendSourceLineMessage(node: ICodeNode): void {
        let lineNumber: any = node.getAttribute(ICodeKeyImpl.LINE);

        // Send the SOURCE_LINE message
        if (lineNumber !== undefined) {
            this.sendMessage(new Message(MessageType.SOURCE_LINE, lineNumber))
        }
    }
}

class AssignmentExecutor extends StatementExecutor {

    /**
     * @constructor
     * @param parent the parent Executor.
     */
    constructor(parent: Executor) {
        super(parent);
        this.errorHandler = parent.getErrorHandler();
        this.messageHandler = parent.getMessageHandler();
    }


    public execute(node: ICodeNode): any {
        // The ASSIGN node's children are the target variable
        // and the expression.
        let children = node.getChildren();
        let variableName = children[0];
        let expressionNode = children[1];

        // Execute the expression and get its value.
        let expressionExecutor = new ExpressionExecutor(this);
        let value = expressionExecutor.execute(expressionNode);

        // Set the value of an attribute of the variable's symbol table.
        let variableId = variableName.getAttribute(ICodeKeyImpl.ID) as SymTabEntry;
        variableId.setAttribute(SymTabKeyImpl.DATA_VALUE, value);

        this.sendAMessage(node, variableId.getName(), value);

        ++Executor.executionCount;
        return null;
    }

    public sendAMessage(node: ICodeNode, variableName: string, value: any): void {
        let lineNumber: any = node.getAttribute(ICodeKeyImpl.LINE);

        // Send a message
        if (lineNumber !== undefined) {
            this.sendMessage(new Message(MessageType.ASSIGN, {
                line_number: lineNumber,
                variable_name: variableName,
                value: value
            }));
        }
    }
}

class CompoundExecutor extends StatementExecutor {

    /**
     * @constructor
     * @param parent the parent Executor
     */
    constructor(parent: Executor) {
        super(parent);
        this.errorHandler = parent.getErrorHandler();
        this.messageHandler = parent.getMessageHandler();
    }

    public execute(node: ICodeNode): any {
        // Loop over the children of the COMPOUND node and execute each child.
        let statementExecutor = new StatementExecutor(this);
        let children = node.getChildren();
        for (let child of children) {
            statementExecutor.execute(child);
        }

        return null;
    }
}


class ExpressionExecutor extends StatementExecutor {

    /**
     * @constructor
     * @param parent the parent Executor.
     */
    constructor(parent: Executor) {
        super(parent);
        this.errorHandler = parent.getErrorHandler();
        this.messageHandler = parent.getMessageHandler();
    }

    public execute(node: ICodeNode): any {
        let nodeType = node.getType() as ICodeNodeTypeImpl;
        switch (nodeType) {

            case ICodeNodeTypeImpl.VARIABLE: {
                // Get the variable's symbol table entry and return its value.
                let entry = node.getAttribute(ICodeKeyImpl.ID) as SymTabEntry;
                return entry.getAttribute(SymTabKeyImpl.DATA_VALUE);
            }

            case ICodeNodeTypeImpl.INTEGER_CONSTANT: {
                return parseInt(node.getAttribute(ICodeKeyImpl.VALUE), 10);
            }

            case ICodeNodeTypeImpl.REAL_CONSTANT: {
                return Number(node.getAttribute(ICodeKeyImpl.VALUE));
            }

            case ICodeNodeTypeImpl.STRING_CONSTANT: {
                return node.getAttribute(ICodeKeyImpl.VALUE).toString();
            }

            case ICodeNodeTypeImpl.NEGATE: {
                // Get the NEGATE node's expression node child.
                let children = node.getChildren();
                let expressionNode = children[0];

                // Execute the expression and return the negative of its value.
                let value = this.execute(expressionNode);
                if (Number.isInteger(value)) {
                    return -parseInt(value);
                } else {
                    return -value;
                }
            }

            case ICodeNodeTypeImpl.NOT: {

                // Get the NOT node's expression node child.
                let children = node.getChildren();
                let expressionNode = children[0];

                // Execute the expression and return the "not" of its value.
                let value = this.execute(expressionNode) as boolean;
                return !value;
            }

            default: {
                return this.executeBinaryOperator(node, nodeType);
            }
        }
    }

    private static readonly ARITH_OPS = new Set<ICodeNodeTypeImpl>([
        ICodeNodeTypeImpl.ADD,
        ICodeNodeTypeImpl.SUBTRACT,
        ICodeNodeTypeImpl.MULTIPLY,
        ICodeNodeTypeImpl.FLOAT_DIVIDE,
        ICodeNodeTypeImpl.INTEGER_DIVIDE,
        ICodeNodeTypeImpl.MOD
    ]);

    private executeBinaryOperator(node: ICodeNode, nodeType: ICodeNodeTypeImpl): any {

        // Get the two operand children of the operator node.
        let children = node.getChildren();
        let operandNode1 = children[0];
        let operandNode2 = children[1];

        // Operands
        let operand1 = this.execute(operandNode1);
        let operand2 = this.execute(operandNode2);

        let integerMode = Number.isInteger(operand1) && Number.isInteger(operand2);

        // =============================
        // Arithmetic operators
        // =============================

        if (ExpressionExecutor.ARITH_OPS.has(nodeType)) {
            if (integerMode) {
                let value1 = operand1 as number;
                let value2 = operand2 as number;

                // Integer operations
                switch (nodeType) {
                    case ICodeNodeTypeImpl.ADD: {
                        return value1 + value2;
                    }
                    case ICodeNodeTypeImpl.SUBTRACT: {
                        return value1 - value2;
                    }
                    case ICodeNodeTypeImpl.MULTIPLY: {
                        return value1 * value2;
                    }

                    case ICodeNodeTypeImpl.FLOAT_DIVIDE: {

                        // Check for division by zero.
                        if (value2 !== 0) {
                            return (value1/value2);
                        } else {
                            this.errorHandler.flag(node, RuntimeErrorCode.DIVISION_BY_ZERO, this);
                            return 0;
                        }
                    }

                    case ICodeNodeTypeImpl.INTEGER_DIVIDE: {

                        // Check for division by zero.
                        if (value2 !== 0) {
                            return value1/value2;
                        } else {
                            this.errorHandler.flag(node, RuntimeErrorCode.DIVISION_BY_ZERO, this);
                            return 0;
                        }
                    }

                    case ICodeNodeTypeImpl.MOD: {

                        // Check for division by zero.
                        if (value2 !== 0) {
                            return value1%value2;
                        } else {
                            this.errorHandler.flag(node, RuntimeErrorCode.DIVISION_BY_ZERO, this);
                            return 0;
                        }
                    }
                }
            } else {
                let value1 = Number.isInteger(operand1) ? parseInt(operand1, 10) : operand1;
                let value2 = Number.isInteger(operand2) ? parseInt(operand2, 10) : operand2;

                // Float operands
                switch (nodeType) {
                    case ICodeNodeTypeImpl.ADD: {
                        return value1 + value2;
                    }
                    case ICodeNodeTypeImpl.SUBTRACT: {
                        return value1 - value2;
                    }
                    case ICodeNodeTypeImpl.MULTIPLY: {
                        return value1 * value2;
                    }

                    case ICodeNodeTypeImpl.FLOAT_DIVIDE: {

                        // Check for division by zero.
                        if (value2 !== 0.0) {
                            return value1/value2;
                        } else {
                            this.errorHandler.flag(node, RuntimeErrorCode.DIVISION_BY_ZERO, this);
                            return 0.0;
                        }
                    }
                }
            }
        }

        // ================
        // AND and OR
        // ================
        else if ((nodeType === ICodeNodeTypeImpl.AND) || (nodeType === ICodeNodeTypeImpl.OR)) {
            let value1 = operand1 as boolean;
            let value2 = operand2 as boolean;

            switch (nodeType) {
                case ICodeNodeTypeImpl.AND: {
                    return value1 && value2;
                }
                case ICodeNodeTypeImpl.OR: {
                    return value1 || value2;
                }
            }
        }

        // =====================
        // relational operators
        // =====================

        else if (integerMode) {
            let value1 = operand1 as Number;
            let value2 = operand2 as Number;

            // Integer operands
            switch (nodeType) {
                case ICodeNodeTypeImpl.EQ: {
                    return value1 === value2;
                }
                case ICodeNodeTypeImpl.NE: {
                    return value1 !== value2;
                }
                case ICodeNodeTypeImpl.LT: {
                    return value1 < value2;
                }
                case ICodeNodeTypeImpl.LE: {
                    return value1 <= value2;
                }
                case ICodeNodeTypeImpl.GT: {
                    return value1 > value2;
                }
                case ICodeNodeTypeImpl.GE: {
                    return value1 >= value2;
                }
            }
        } else {
            let value1 = Number.isInteger(operand1) ? parseInt(operand1, 10) : operand1;
            let value2 = Number.isInteger(operand2) ? parseInt(operand2, 10) : operand2;

            // Float operands
            switch (nodeType) {
                case ICodeNodeTypeImpl.EQ: {
                    return value1 === value2;
                }
                case ICodeNodeTypeImpl.NE: {
                    return value1 !== value2;
                }
                case ICodeNodeTypeImpl.LT: {
                    return value1 < value2;
                }
                case ICodeNodeTypeImpl.LE: {
                    return value1 <= value2;
                }
                case ICodeNodeTypeImpl.GT: {
                    return value1 > value2;
                }
                case ICodeNodeTypeImpl.GE: {
                    return value1 >= value2;
                }
            }
        }

        return 0; // should never get here.
    }

}

/**
 * <h1>LoopExecutor</h1>
 * <p>Execute a loop statement</p>
 */
export class LoopExecutor extends StatementExecutor {

    /**
     * @constructor
     * @param parent the parent executor.
     */
    constructor(parent: Executor) {
        super(parent);
        this.errorHandler = parent.getErrorHandler();
        this.messageHandler = parent.getMessageHandler();
    }


    /**
     * Execute a loop statement
     * @param node the root node of the statement.
     * @return undefined
     */
    public execute(node: ICodeNode): any {
        let exitLoop = false;
        let exprNode: ICodeNode = undefined!;
        let loopChildren = node.getChildren();

        let expressionExecutor = new ExpressionExecutor(this);
        let statementExecutor = new StatementExecutor(this);

        // Loop until the TEST expression value is true.
        while (!exitLoop) {
            ++Executor.executionCount; // count the loop statement itself.

            // Execute the children of the LOOP node.
            for (let child of loopChildren) {
                let childType = child.getType() as ICodeNodeTypeImpl;

                // Test node?
                if (childType === ICodeNodeTypeImpl.TEST) {
                    if (exprNode === undefined) {
                        exprNode = child.getChildren()[0];
                    }
                    exitLoop = expressionExecutor.execute(exprNode) as boolean;
                }
                // Statement node
                else {
                    statementExecutor.execute(child);
                }

                // Exit if the TEST expression value is true.
                if (exitLoop) {
                    break;
                }
            }
        }

        return undefined;
    }
}

/**
 * <h1>IfExecutor</h1>
 * <p>Execute an IF statement</p>
 */
export class IfExecutor extends StatementExecutor {


    constructor(parent: Executor) {
        super(parent);
        this.errorHandler = parent.getErrorHandler();
        this.messageHandler = parent.getMessageHandler();
    }

    /**
     * Execute an IF statement.
     * @param node the root node of the statement.
     * @return undefined.
     */
    public execute(node: ICodeNode): any {
        return undefined;
    }
}

/**
 * <h1>SelectExecutor</h1>
 * <p>Execute a SELECT statement.</p>
 */
export class SelectExecutor extends StatementExecutor {

    constructor(parent: Executor) {
        super(parent);
        this.errorHandler = parent.getErrorHandler();
        this.messageHandler = parent.getMessageHandler();
    }

    public execute(node: ICodeNode): any {
        return undefined;
    }
}