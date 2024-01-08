import {Parser} from "../Parser.ts";
import {Token, TokenType} from "../Token.ts";
import {Message} from "../../message/Message.ts";
import {MessageType} from "../../message/MessageType.ts";
import {PascalTokenType} from "./PascalTokenType.ts";
import {PascalErrorHandler} from "./PascalErrorHandler.ts";
import {PascalErrorCode} from "./PascalErrorCode.ts";
import {ICodeFactory} from "../../intermediate/ICodeFactory.ts";
import {ICodeNode} from "../../intermediate/ICodeNode.ts";
import {PascalScanner} from "./PascalScanner.ts";
import {ICodeNodeTypeImpl} from "../../intermediate/icodeimpl/ICodeNodeTypeImpl.ts";
import {ICodeKeyImpl} from "../../intermediate/icodeimpl/ICodeKeyImpl.ts";
import {EofToken} from "../EofToken.ts";
import {ICodeNodeType} from "../../intermediate/ICodeNodeType.ts";

export class PascalParserTD extends Parser {

    protected errorHandler: PascalErrorHandler = new PascalErrorHandler();
    /**
     * @constructor
     * @param scanner the scanner to be used with this parser.
     */
    constructor(arg: PascalScanner | PascalParserTD) {
        super(arg instanceof PascalScanner ? arg : arg.getScanner());
    }

    public getErrorHandler(): PascalErrorHandler {
        return this.errorHandler;
    }

    /**
     *
     */
    public parse(): void {
        let token: Token;
        const starTime = Date.now();
        this.iCode = ICodeFactory.createICode();

        token = this.nextToken();
        let rootNode: ICodeNode = undefined!;

        // Look for the BEGIN token to parse a compound statement.
        if (token.getType() === PascalTokenType.BEGIN) {
            let statementParser = new StatementParser(this);
            rootNode = statementParser.parse(token);
            token = this.currentToken();
        } else {
            this.errorHandler.flag(token, PascalErrorCode.UNEXPECTED_TOKEN, this);
        }

        // Look for the final period.
        if (token.getType() !== PascalTokenType.DOT) {
            this.errorHandler.flag(token, PascalErrorCode.MISSING_PERIOD, this);
        }

        token = this.currentToken();

        // Set the parse tree root node.
        if (rootNode !== undefined) {
            this.iCode.setRoot(rootNode);
        }

        // Send the parser summary message.
        const endTime = Date.now();
        const elapsedTime = (endTime - starTime)/1000;
        this.sendMessage(new Message(MessageType.PARSER_SUMMARY, {
            line_number: token.getLineNum(),
            parser_error_count: this.getErrorCount(),
            elapsed_time: elapsedTime,
        }));
    }

    /**
     * Returns the syntax error count for this parser.
     * @return the error count for this parser.
     */
    public getErrorCount(): number {
        return this.errorHandler.getErrorCount();
    }

}

/**
 * <h1>StatementParser</h1>
 * <p>Parse a Pascal statement.</p>
 */
export class StatementParser extends PascalParserTD {

    /**
     * @constructor
     * @param parent the parent parser.
     */
    constructor(parent: PascalParserTD) {
        super(parent);
        this.messageHandler = parent.getMessageHandler();
        this.errorHandler = parent.getErrorHandler();
        this.symTabStack = parent.getSymTabStack();
        this.iCode = parent.getICode();
    }

    /**
     * Parse a statement
     * to be overridden by the specialized statement parser subclass.
     * @param token the initial token.
     * @return the root node of the generated parse tree.
     */
    // @ts-ignore
    public parse(token: Token): ICodeNode {
        let statementNode: ICodeNode = undefined!;
        switch (token.getType() as PascalTokenType) {
            case PascalTokenType.BEGIN: {
                let compoundParser = new CompoundStatementParser(this as unknown as PascalParserTD);
                statementNode = compoundParser.parse(token);
                break;
            }

            // An assignment statement begins with a variable's identifier.
            case PascalTokenType.IDENTIFIER: {
                let assignmentParser = new AssignmentStatementParser(this as unknown as PascalParserTD);
                statementNode = assignmentParser.parse(token);
                break;
            }

            default: {
                statementNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.NO_OP);
                break;
            }
        }

        // Set the current line number as an attribute.
        this.setLineNumber(statementNode, token);

        return statementNode;
    }

    /**
     * Set the current line number as a statement node attribute.
     * @param node
     * @param token
     * @protected
     */
    protected setLineNumber(node: ICodeNode, token: Token): void {
        node?.setAttribute(ICodeKeyImpl.LINE, token.getLineNum());
    }

    /**
     * Parse a statement list.
     * @param token the current token.
     * @param parentNode the parent node of the statement list.
     * @param terminator the token type of the node that terminates the list.
     * @param errorCode the error code if the terminator token is missing.
     * @protected
     */
    public parseList(token: Token, parentNode: ICodeNode, terminator: PascalTokenType, errorCode: PascalErrorCode): void {
        // Loop to parse each statement until the END token.
        // or the end of the source file.
        while (!(token instanceof EofToken) && (token.getType() !== terminator)) {

            // Parser a statement. The parent node adopts the statement node.
            let statementNode = this.parse(token);
            parentNode.addChild(statementNode);

            token = this.currentToken();
            let tokenType = token.getType() as PascalTokenType;

            // look for the semicolon between statements.
            if (tokenType === PascalTokenType.SEMICOLON) {
                token = this.nextToken();   // consume the ';'
            }
            // If at the start of the next assignment statement,
            // then missing a semicolon.
            else if (tokenType === PascalTokenType.IDENTIFIER) {
                this.errorHandler.flag(token, PascalErrorCode.MISSING_SEMICOLON, this as unknown as PascalParserTD);
            }
            // Unexpected token.
            else if (tokenType !== terminator) {
                this.errorHandler.flag(token, PascalErrorCode.UNEXPECTED_TOKEN, this as unknown as PascalParserTD);
                token = this.nextToken(); // consume the unexpected token.
            }
        }

        // Look for the terminator token.
        if (token.getType() === terminator) {
            token = this.nextToken();   // consume the terminator token.
        } else {
            this.errorHandler.flag(token, errorCode, this as unknown as PascalParserTD);
        }
    }
}

/**
 * <h1>AssignmentStatementParser</h1>
 * <p>Parse a Pascal assignment statement.</p>
 */
export class AssignmentStatementParser extends StatementParser {

    /**
     * @constructor
     * @param parent the parent parser.
     */
    constructor(parent: PascalParserTD) {
        super(parent);
        this.messageHandler = parent.getMessageHandler();
        this.errorHandler = parent.getErrorHandler();
        this.symTabStack = parent.getSymTabStack();
        this.iCode = parent.getICode();
    }

    /**
     * Parse an assignment statement.
     * @param token the initial token.
     * @return the root node of the generated parse tree.
     */
    // @ts-ignore
    public parse(token: Token): ICodeNode {
        // Create an ASSIGN node.

        let assignNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.ASSIGN);

        // Look up the target identifier in the symbol table stack.
        // Enter the identifier into the table if it's not found.
        let targetName = token.getText().toLowerCase();
        let targetId = this.symTabStack.lookup(targetName);
        if (targetId === undefined) {
            targetId = this.symTabStack.enterLocal(targetName);
        }
        targetId?.appendLineNumber(token.getLineNum());

        token = this.nextToken();   // consume the identifier token.

        // Create the variable node and set its name attribute.
        let variableNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.VARIABLE);
        variableNode.setAttribute(ICodeKeyImpl.ID, targetId);

        // The assign node adopts the variable node as its first child.
        assignNode.addChild(variableNode);

        // Look for the ':=' token
        if (token.getType() === PascalTokenType.COLON_EQUALS) {
            token = this.nextToken();   // consume the :=
        } else {
            this.errorHandler.flag(token, PascalErrorCode.MISSING_COLON_EQUALS, this as unknown as PascalParserTD);
        }

        // Parse the expression. The assign node adopts the expression's
        // node as it second child.
        let expressionParser = new ExpressionParser(this as unknown as PascalParserTD);
        assignNode.addChild(expressionParser.parse(token));

        return assignNode;
    }
}

/**
 * <h1>CompoundStatementParser</h1>
 * <p>Parse a Pascal compound statement.</p>
 */
export class CompoundStatementParser extends StatementParser {

    /**
     * @constructor
     * @param parent the parent parser.
     */
    constructor(parent: PascalParserTD) {
        super(parent);
        this.messageHandler = parent.getMessageHandler();
        this.errorHandler = parent.getErrorHandler();
        this.symTabStack = parent.getSymTabStack();
        this.iCode = parent.getICode();
    }

    /**
     * Parse a compound statement.
     * @param token the initial token.
     * @return the root node of the generated parse tree.
     */
    // @ts-ignore
    public parse(token: Token): ICodeNode {
        token = this.nextToken();   // consume the BEGIN

        // Create a compound node.
        let compoundNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.COMPOUND);

        // Parse the statement list terminated by the END token.
        let statementParser = new StatementParser(this as unknown as PascalParserTD);
        statementParser.parseList(token, compoundNode, PascalTokenType.END, PascalErrorCode.MISSING_END);

        return compoundNode;
    }
}

/**
 * <h1>ExpressionParser</h1>
 * <p>Parse a Pascal expression.</p>
 */
export class ExpressionParser extends StatementParser {


    // Set of relational operators.
    private static readonly REL_OPS: Set<PascalTokenType> = new Set<PascalTokenType>([
        PascalTokenType.EQUALS,
        PascalTokenType.NOT_EQUALS,
        PascalTokenType.LESS_THAN,
        PascalTokenType.LESS_EQUALS,
        PascalTokenType.GREATER_THAN,
        PascalTokenType.GREATER_EQUALS
    ]);

    // Map relational operators tokens to node types.
    private static readonly REL_OPS_MAP: Map<PascalTokenType, ICodeNodeType> = new Map<PascalTokenType, ICodeNodeType>();

    static {
        ExpressionParser.REL_OPS_MAP.set(PascalTokenType.EQUALS, ICodeNodeTypeImpl.EQ);
        ExpressionParser.REL_OPS_MAP.set(PascalTokenType.NOT_EQUALS, ICodeNodeTypeImpl.NE);
        ExpressionParser.REL_OPS_MAP.set(PascalTokenType.LESS_THAN, ICodeNodeTypeImpl.LT);
        ExpressionParser.REL_OPS_MAP.set(PascalTokenType.LESS_EQUALS, ICodeNodeTypeImpl.LE);
        ExpressionParser.REL_OPS_MAP.set(PascalTokenType.GREATER_THAN, ICodeNodeTypeImpl.GT);
        ExpressionParser.REL_OPS_MAP.set(PascalTokenType.GREATER_EQUALS, ICodeNodeTypeImpl.GE);
    }

    /**
     * @constructor
     * @param parser the parent parser.
     */
    constructor(parent: PascalParserTD) {
        super(parent);
        this.messageHandler = parent.getMessageHandler();
        this.errorHandler = parent.getErrorHandler();
        this.symTabStack = parent.getSymTabStack();
        this.iCode = parent.getICode();
    }

    /**
     * Parse an expression
     * @param token
     * @return the root node of the generated parse tree.
     */
    public parse(token: Token): ICodeNode {
        return this.parseExpression(token);
    }


    private parseExpression(token: Token): ICodeNode {
        // Parse a simple expression and make the root of its tree
        // the root node.
        let rootNode = this.parseSimpleExpression(token);

        token = this.currentToken();
        let tokenType = token.getType();

        // Look for relational operator.
        if (ExpressionParser.REL_OPS.has(tokenType as PascalTokenType)) {

            // Create a new operator node and adopt the current tree
            // as its first child.
            let nodeType = ExpressionParser.REL_OPS_MAP.get(tokenType as PascalTokenType);
            let opNode = ICodeFactory.createICodeNode(nodeType as ICodeNodeType);
            opNode.addChild(rootNode);

            token = this.nextToken();   // consume the operator.

            // Parse the second simple expression. The operator node adopts
            // the simple expression's tree as its second child.
            opNode.addChild(this.parseSimpleExpression(token));

            // The operator node become the new root node.
            rootNode = opNode;
        }

        return rootNode;
    }

    // Set of additive operators.
    private static readonly ADD_OPS: Set<PascalTokenType> = new Set<PascalTokenType>([
        PascalTokenType.PLUS,
        PascalTokenType.MINUS,
        PascalTokenType.OR
    ]);

    // Map additive operator tokens to node types.
    private static readonly ADD_OPS_OPS_MAP = new Map<PascalTokenType, ICodeNodeTypeImpl>();
    static {
        ExpressionParser.ADD_OPS_OPS_MAP.set(PascalTokenType.PLUS, ICodeNodeTypeImpl.ADD);
        ExpressionParser.ADD_OPS_OPS_MAP.set(PascalTokenType.MINUS, ICodeNodeTypeImpl.SUBTRACT);
        ExpressionParser.ADD_OPS_OPS_MAP.set(PascalTokenType.OR, ICodeNodeTypeImpl.OR);
    }

    /**
     * Parse a simple expression.
     * @param token the initial token.
     * @return the root of the generated parse subtree.
     * @private
     */
    private parseSimpleExpression(token: Token): ICodeNode {

        let signType: TokenType = undefined!; // type of leading sign (if any).

        // Look for a leading + or - sign
        let tokenType = token.getType();
        if ((tokenType === PascalTokenType.PLUS) || (tokenType === PascalTokenType.MINUS)) {
            signType = tokenType;
            token = this.nextToken();   // consume the + or -
        }

        // Parse a term and make the root of its tree the root node.
        let rootNode = this.parseTerm(token);

        // Was there a leading - sign?
        if (signType === PascalTokenType.MINUS) {

            // Create a NEGATE node and adopt the current tree
            // as its child. The NEGATE node becomes the new root node.
            let negateNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.NEGATE);
            negateNode.addChild(rootNode);
            rootNode = negateNode;
        }

        token = this.currentToken();
        tokenType = token.getType();

        // Loop over the additive operators
        while (ExpressionParser.ADD_OPS.has(tokenType as PascalTokenType)) {

            // Create a new operator node and adopt the current tree
            // as its first child.
            let nodeType = ExpressionParser.ADD_OPS_OPS_MAP.get(tokenType as PascalTokenType);
            let opNode = ICodeFactory.createICodeNode(nodeType as ICodeNodeTypeImpl);
            opNode.addChild(rootNode);

            token = this.nextToken();   // consume the operator.

            // Parse another term. The operator node adopts
            // the term's tree as itf second child.
            opNode.addChild(this.parseTerm(token));

            // The operator node becomes the new root node.
            rootNode = opNode;

            token = this.currentToken();
            tokenType = token.getType();
        }

        return rootNode;
    }


    // Set of multiplicative operators.
    private static readonly MULT_OPS = new Set<PascalTokenType>([
        PascalTokenType.START,
        PascalTokenType.SLASH,
        PascalTokenType.DIV,
        PascalTokenType.MOD,
        PascalTokenType.AND
    ]);
    // Map multiplicative operator tokens to node types.
    private static readonly MULT_OPS_OPS_MAP = new Map<PascalTokenType, ICodeNodeType>();
    static{
        ExpressionParser.MULT_OPS_OPS_MAP.set(PascalTokenType.START, ICodeNodeTypeImpl.MULTIPLY);
        ExpressionParser.MULT_OPS_OPS_MAP.set(PascalTokenType.SLASH, ICodeNodeTypeImpl.FLOAT_DIVIDE);
        ExpressionParser.MULT_OPS_OPS_MAP.set(PascalTokenType.DIV, ICodeNodeTypeImpl.INTEGER_DIVIDE);
        ExpressionParser.MULT_OPS_OPS_MAP.set(PascalTokenType.MOD, ICodeNodeTypeImpl.MOD);
        ExpressionParser.MULT_OPS_OPS_MAP.set(PascalTokenType.AND, ICodeNodeTypeImpl.AND);
    }

    /**
     * Parse a term
     * @param token the initial token.
     * @return the root of the generated parse subtree.
     * @private
     */
    private parseTerm(token: Token): ICodeNode {
        // Parse a factor and make its node the root node.
        let rootNode = this.parseFactor(token);

        token = this.currentToken();
        let tokenType = token.getType();

        // Loop over multiplicative opeartors.
        while (ExpressionParser.MULT_OPS.has(tokenType as PascalTokenType)) {

            // Create a new operator node and adopt the current tree
            // as its first child.
            let nodeType = ExpressionParser.MULT_OPS_OPS_MAP.get(tokenType as PascalTokenType);
            let opNode = ICodeFactory.createICodeNode(nodeType as ICodeNodeType);
            opNode.addChild(rootNode);

            token = this.nextToken();   // consume the operator.

            // Parse another factor. The operator node adopts
            // the term's tree as its second child.
            opNode.addChild(this.parseFactor(token));

            // The operator node becomes the new root node.
            rootNode = opNode;

            token = this.currentToken();
            tokenType = token.getType();
        }

        return rootNode;
    }


    /**
     * Parse a factor
     * @param token the initial token.
     * @return the root node of the generated parse subtree.
     */
    private parseFactor(token: Token): ICodeNode {
        let tokenType = token.getType();
        let rootNode: ICodeNode = undefined!;

        switch (tokenType as PascalTokenType) {
            case PascalTokenType.IDENTIFIER: {
                // Look up the identifier in the symbol table stack.
                // Flag the identifier as undefined if it's not found.
                let name = token.getText().toLowerCase();
                let id = this.symTabStack.lookup(name);
                if (id === undefined) {
                    this.errorHandler.flag(token, PascalErrorCode.IDENTIFIER_UNDEFINED, this as unknown as PascalParserTD);
                    id = this.symTabStack.enterLocal(name);
                }

                rootNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.VARIABLE);
                rootNode.setAttribute(ICodeKeyImpl.ID, id);
                id?.appendLineNumber(token.getLineNum());

                token = this.nextToken(); // consume the identifier.
                break;
            }

            case PascalTokenType.INTEGER: {
                // Create an INTEGER_CONSTANT node as the root node.
                rootNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.INTEGER_CONSTANT);
                rootNode.setAttribute(ICodeKeyImpl.VALUE, token.getValue());

                token = this.nextToken(); // consume the number.
                break;
            }

            case PascalTokenType.REAL: {
                // Create an REAL_CONSTANT node as the root node.
                rootNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.REAL_CONSTANT);
                rootNode.setAttribute(ICodeKeyImpl.VALUE, token.getValue());

                token = this.nextToken(); // consume the number
                break;
            }

            case PascalTokenType.STRING: {
                let value = String(token.getValue());

                // Create a STRING_CONSTANT node as the root node.
                rootNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.STRING_CONSTANT);
                rootNode.setAttribute(ICodeKeyImpl.VALUE, value);

                token = this.nextToken(); // consume the string
                break;
            }

            case PascalTokenType.NOT: {
                token = this.nextToken(); // consume the NOT

                // Create a NOT node as the root node.
                rootNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.NOT);

                // Parse the factor. The NOT node adopts the
                // factor node as its child.
                rootNode.addChild(this.parseFactor(token));

                break;
            }

            case PascalTokenType.LEFT_PAREN: {
                token = this.nextToken(); // consume the (

                // Parse an expression and make its node the root node.
                rootNode = this.parseExpression(token);

                // Look for the matching ) token.
                token = this.currentToken();
                if (token.getType() === PascalTokenType.RIGHT_PAREN) {
                    token = this.nextToken(); // consume the )
                } else {
                    this.errorHandler.flag(token, PascalErrorCode.MISSING_RIGHT_PAREN, this as unknown as PascalParserTD);
                }

                break;
            }

            default: {
                this.errorHandler.flag(token, PascalErrorCode.UNEXPECTED_TOKEN, this as unknown as PascalParserTD);
                break;
            }
        }

        return rootNode;
    }
}