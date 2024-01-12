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


    /**
     * Synchronize the parser.
     * @param syncSet the set of token types for synchronizing the parser.
     * @return the token where the parser has synchronized.
     */
    public synchronize(syncSet: Set<PascalTokenType>): Token {
        let token = this.currentToken();

        // If the current token is not in the synchronization set,
        // then it is unexpected and the parser must recover.
        if (!syncSet.has(token.getType() as PascalTokenType)) {

            // Flag the unexpected token.
            this.errorHandler.flag(token, PascalErrorCode.UNEXPECTED_TOKEN, this as unknown as PascalParserTD);

            // Recover by skipping tokens that are not
            // in the synchronization set.
            do {
                token = this.nextToken();
            } while (!(token instanceof EofToken) && !syncSet.has(token.getType() as PascalTokenType));
        }

        return token;
    }
}

/**
 * <h1>StatementParser</h1>
 * <p>Parse a Pascal statement.</p>
 */
export class StatementParser extends PascalParserTD {


    // Synchronization set for starting a statement.
    private static readonly STMT_START_SET = new Set<PascalTokenType>([
        PascalTokenType.BEGIN,
        PascalTokenType.CASE,
        PascalTokenType.FOR,
        PascalTokenType.IF,
        PascalTokenType.REPEAT,
        PascalTokenType.WHILE,
        PascalTokenType.IDENTIFIER,
        PascalTokenType.SEMICOLON
    ]);

    // Synchronization set for following a statement.
    private static readonly STMT_FOLLOW_SET = new Set<PascalTokenType>([
        PascalTokenType.SEMICOLON,
        PascalTokenType.END,
        PascalTokenType.ELSE,
        PascalTokenType.UNTIL,
        PascalTokenType.DOT
    ]);


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

            case PascalTokenType.REPEAT: {
                let repeatParser = new RepeatStatementParser(this as unknown as PascalParserTD);
                statementNode = repeatParser.parse(token);
                break;
            }

            case PascalTokenType.WHILE: {
                let whileParser = new WhileStatementParser(this as unknown as PascalParserTD);
                statementNode = whileParser.parse(token);
                break;
            }

            case PascalTokenType.FOR: {
                let forParser = new ForStatementParser(this as unknown as PascalParserTD);
                statementNode = forParser.parse(token);
                break;
            }

            case PascalTokenType.IF: {
                let ifParser = new IfStatementParser(this as unknown as PascalParserTD);
                statementNode = ifParser.parse(token);
                break;
            }

            case PascalTokenType.CASE: {
                let caseParser = new CaseStatementParser(this as unknown as PascalParserTD);
                statementNode = caseParser.parse(token);
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

        // Synchronization set for the terminator.
        let terminatorSet = new Set<PascalTokenType>(StatementParser.STMT_START_SET);
        terminatorSet.add(terminator);

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

            // If at the start of the next statement, then missing a semicolon.
            else if (StatementParser.STMT_START_SET.has(tokenType)) {
                    this.errorHandler.flag(token, PascalErrorCode.MISSING_SEMICOLON, this as unknown as PascalParserTD);
            }

            // Synchronize at the start of the next statement
            // or at the terminator.
            token = this.synchronize(terminatorSet);
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


    // Synchronization set for the := token.
    private static readonly COLON_EQUALS_SET = new Set<PascalTokenType>([
        PascalTokenType.PLUS,
        PascalTokenType.MINUS,
        PascalTokenType.IDENTIFIER,
        PascalTokenType.INTEGER,
        PascalTokenType.REAL,
        PascalTokenType.STRING,
        PascalTokenType.NOT,
        PascalTokenType.LEFT_PAREN
    ]);

    static {
        AssignmentStatementParser.COLON_EQUALS_SET.add(PascalTokenType.COLON_EQUALS);
        // Add all StatementParser.STMT_FOLLOW_SET
        AssignmentStatementParser.COLON_EQUALS_SET.add(PascalTokenType.SEMICOLON);
        AssignmentStatementParser.COLON_EQUALS_SET.add(PascalTokenType.END);
        AssignmentStatementParser.COLON_EQUALS_SET.add(PascalTokenType.ELSE);
        AssignmentStatementParser.COLON_EQUALS_SET.add(PascalTokenType.UNTIL);
        AssignmentStatementParser.COLON_EQUALS_SET.add(PascalTokenType.DOT);
    }

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

        // Synchronize on the := token.
        token = this.synchronize(AssignmentStatementParser.COLON_EQUALS_SET);
        if (token.getType() === PascalTokenType.COLON_EQUALS) {
            token = this.nextToken(); // consume the :=
        } else {
            this.errorHandler.flag(token, PascalErrorCode.MISSING_COLON_EQUALS, this as unknown as PascalParserTD);
        }

        // Parse the expression. The ASSIGN node adopts the expression's
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


    // Synchronization set for starting an expression.
    public static readonly EXPR_START_SET = new Set<PascalTokenType>([
        PascalTokenType.PLUS,
        PascalTokenType.MINUS,
        PascalTokenType.IDENTIFIER,
        PascalTokenType.INTEGER,
        PascalTokenType.REAL,
        PascalTokenType.STRING,
        PascalTokenType.NOT,
        PascalTokenType.LEFT_PAREN
    ]);

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

        // Loop over multiplicative operators..
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


/**
 * <h1>CaseStatementParser</h1>
 * <p>Parse a Pascal CASE statement.</p>
 */
export class CaseStatementParser extends StatementParser {

    // Synchronization set for starting a CASE option constant.
    private static readonly CONSTANT_START_SET = new Set<PascalTokenType>([
        PascalTokenType.IDENTIFIER,
        PascalTokenType.INTEGER,
        PascalTokenType.PLUS,
        PascalTokenType.MINUS,
        PascalTokenType.STRING
    ]);

    // Synchronization set for OF
    private static readonly OF_SET: Set<PascalTokenType> = new Set<PascalTokenType>([
        PascalTokenType.IDENTIFIER,
        PascalTokenType.INTEGER,
        PascalTokenType.PLUS,
        PascalTokenType.MINUS,
        PascalTokenType.STRING
    ]);
    static {
        CaseStatementParser.OF_SET.add(PascalTokenType.OF);
        // StatementParser.STMT_FOLLOW_SET
        CaseStatementParser.OF_SET.add(PascalTokenType.SEMICOLON);
        CaseStatementParser.OF_SET.add(PascalTokenType.END);
        CaseStatementParser.OF_SET.add(PascalTokenType.ELSE);
        CaseStatementParser.OF_SET.add(PascalTokenType.UNTIL);
        CaseStatementParser.OF_SET.add(PascalTokenType.DOT);
    }


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
     * @constructor
     * @param token the initial token
     */
    public parse(token: Token): ICodeNode {
        token = this.nextToken(); // consume the CASE

        // Create a SELECT node.
        let selectNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.SELECT);

        // Parse the CASE expression
        // The SELECT node adopts the expression subtree as its first child.
        let expressionParse = new ExpressionParser(this as unknown as PascalParserTD);
        selectNode.addChild(expressionParse.parse(token));

        // Synchronize at the OF.
        token = this.synchronize(CaseStatementParser.OF_SET);
        if (token.getType() === PascalTokenType.OF) {
            token = this.nextToken(); // consume the OF
        } else {
            this.errorHandler.flag(token, PascalErrorCode.MISSING_OF, this as unknown as PascalParserTD);
        }

        // Set the CASE branch constant.
        let constantSet = new Set<any>();

        // Loop to parse each CASE branch until the END token.
        // or the end of the source file.
        while (!(token instanceof EofToken) && (token.getType() !== PascalTokenType.END)) {

            // The SELECT node adopts the CASE branch subtree.
            selectNode.addChild(this.parseBranch(token, constantSet));

            token = this.currentToken();
            let tokenType = token.getType() as PascalTokenType;

            // Look for the semicolon between CASE branches.
            if (tokenType === PascalTokenType.SEMICOLON) {
                token = this.nextToken(); // consume the ;
            }

            // If at the start of the next constant, then missing a semicolon.
            else if (CaseStatementParser.CONSTANT_START_SET.has(tokenType)) {
                this.errorHandler.flag(token, PascalErrorCode.MISSING_SEMICOLON, this as unknown as PascalParserTD);
            }
        }

        // Look for the END token.
        if (token.getType() === PascalTokenType.END) {
            token = this.nextToken(); // consume END
        } else {
            this.errorHandler.flag(token, PascalErrorCode.MISSING_END, this as unknown as PascalParserTD);
        }

        return selectNode;
    }

    /**
     * Parse a CASE branch.
     * @param token the initial token.
     * @param constantSet the set of CASE branch constants.
     * @return the root SELECT_BRANCH node of the subtree.
     * @private
     */
    private parseBranch(token: Token, constantSet: Set<any>): ICodeNode {

        // Create a SELECT_BRANCH node and a SELECT_CONSTANT node.
        // The SELECT_BRANCH node adopts the SELECT_CONSTANT node as its
        // first child.
        let branchNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.SELECT_BRANCH);
        let constantNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.SELECT_CONSTANTS);
        branchNode.addChild(constantNode);

        // Parse the list of CASE branch constant.
        // The SELECT_CONSTANT node adopts each constant.
        this.parseConstantList(token, constantNode, constantSet);

        // Look for the : token
        token = this.currentToken();
        if (token.getType() === PascalTokenType.COLON) {
            token = this.nextToken(); // consume the :
        } else {
            this.errorHandler.flag(token, PascalErrorCode.MISSING_COLON, this as unknown as PascalParserTD);
        }

        // Parse the CASE branch statement. The SELECT_BRANCH node adopts
        // the statement subtree as its second child.
        let statementParser = new StatementParser(this as unknown as PascalParserTD);
        branchNode.addChild(statementParser.parse(token));

        return branchNode;
    }

    // Synchronization set for COMMA.
    private static readonly COMMA_SET = new Set<PascalTokenType>([
        PascalTokenType.IDENTIFIER,
        PascalTokenType.INTEGER,
        PascalTokenType.PLUS,
        PascalTokenType.MINUS,
        PascalTokenType.STRING
    ]);
    static {
        CaseStatementParser.COMMA_SET.add(PascalTokenType.COMMA);
        CaseStatementParser.COMMA_SET.add(PascalTokenType.COLON);
        // StatementParser.STMT_START_SET
        CaseStatementParser.COMMA_SET.add(PascalTokenType.BEGIN);
        CaseStatementParser.COMMA_SET.add(PascalTokenType.CASE);
        CaseStatementParser.COMMA_SET.add(PascalTokenType.FOR);
        CaseStatementParser.COMMA_SET.add(PascalTokenType.IF);
        CaseStatementParser.COMMA_SET.add(PascalTokenType.REPEAT);
        CaseStatementParser.COMMA_SET.add(PascalTokenType.WHILE);
        CaseStatementParser.COMMA_SET.add(PascalTokenType.IDENTIFIER,);
        CaseStatementParser.COMMA_SET.add(PascalTokenType.SEMICOLON);
        // StatementParser.STMT_FOLLOW_SET
        CaseStatementParser.COMMA_SET.add(PascalTokenType.SEMICOLON);
        CaseStatementParser.COMMA_SET.add(PascalTokenType.END);
        CaseStatementParser.COMMA_SET.add(PascalTokenType.ELSE);
        CaseStatementParser.COMMA_SET.add(PascalTokenType.UNTIL);
        CaseStatementParser.COMMA_SET.add(PascalTokenType.DOT);
    }

    /**
     * Parse a list of CASE branch constants.
     * @param token the current token.
     * @param constantNode the parent SELECT_CONSTANT node.
     * @param constantSet the set of CASE branch constants.
     * @private
     */
    private parseConstantList(token: Token, constantNode: ICodeNode, constantSet: Set<any>): void {

        // Loop to parse each constant
        while (CaseStatementParser.CONSTANT_START_SET.has(token.getType() as PascalTokenType)) {

            // The constants list node adopts the constant node.
            constantNode.addChild(this.parseConstant(token, constantSet));

            // Synchronize at the comma between constants.
            token = this.synchronize(CaseStatementParser.COMMA_SET);

            // Look of the comma
            if (token.getType() === PascalTokenType.COMMA) {
                token = this.nextToken(); // consume the ,
            }

            // If at the start of the next constant, then missing a comma.
            else if (CaseStatementParser.CONSTANT_START_SET.has(token.getType() as PascalTokenType)) {
                this.errorHandler.flag(token, PascalErrorCode.MISSING_COMMA, this as unknown as PascalParserTD);
            }
        }
    }

    /**
     * Parse CASE branch constant.
     * @param token the current token.
     * @param constantSet the set of CASE branch constants.
     * @return the constant node.
     * @private
     */
    private parseConstant(token: Token, constantSet: Set<any>): ICodeNode {
        let sign: TokenType = undefined!;
        let constantNode: ICodeNode = undefined!;

        // Synchronize at the start of a constant
        token = this.synchronize(CaseStatementParser.CONSTANT_START_SET);
        let tokenType = token.getType() as PascalTokenType;

        // Plus or minus sign?
        if ((tokenType === PascalTokenType.PLUS) || (tokenType === PascalTokenType.MINUS)) {
            sign = tokenType;
            token = this.nextToken(); // consume sing
        }

        // Parse the constant.
        switch (token.getType() as PascalTokenType) {

            case PascalTokenType.IDENTIFIER: {
                constantNode = this.parseIdentifierConstant(token, sign);
                break;
            }

            case PascalTokenType.INTEGER: {
                constantNode = this.parseIntegerConstant(token.getText(), sign);
                break;
            }

            case PascalTokenType.STRING: {
                constantNode = this.parseCharacterConstant(token, String(token.getValue()), sign);
                break;
            }

            default: {
                this.errorHandler.flag(token, PascalErrorCode.INVALID_CONSTANT, this as unknown as PascalParserTD);
                break;
            }
        }

        // Check for reused constants
        if (constantNode !== undefined) {
            let value: any = constantNode.getAttribute(ICodeKeyImpl.VALUE);

            if (constantSet.has(value)) {
                this.errorHandler.flag(token, PascalErrorCode.CASE_CONSTANT_REUSED, this as unknown as PascalParserTD);
            } else {
                constantSet.add(value);
            }
        }

        this.nextToken(); // consume the constant.
        return constantNode;
    }

    /**
     * Parse an identifier CASE constant.
     * @param token the current token value string.
     * @param sign the sing, if any.
     * @return the constant node.
     * @private
     */
    private parseIdentifierConstant(token: Token, sign: TokenType): ICodeNode {
        // PlaceHolder: Don't allow for now.
        this.errorHandler.flag(token, PascalErrorCode.INVALID_CONSTANT, this as unknown as PascalParserTD);
        return undefined!;
    }

    /**
     * Parse an integer CASE constant.
     * @param value the current token value string
     * @param sign the sign if any.
     * @return the constant node.
     * @private
     */
    private parseIntegerConstant(value: string, sign: TokenType): ICodeNode {
        let constantNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.INTEGER_CONSTANT);
        let intValue: number = Number.parseInt(value, 10);

        if (sign === PascalTokenType.MINUS) {
            intValue = -intValue;
        }

        constantNode.setAttribute(ICodeKeyImpl.VALUE, intValue);
        return constantNode;
    }

    /**
     * Parse a character CASE constant.
     * @param token the current token.
     * @param value the token value string.
     * @param sign the sing, if any.
     * @return the constant node.
     * @private
     */
    private parseCharacterConstant(token: Token, value: string, sign: TokenType): ICodeNode {
        let constantNode: ICodeNode = undefined!;

        if (sign !== undefined) {
            this.errorHandler.flag(token, PascalErrorCode.INVALID_CONSTANT, this as unknown as PascalParserTD);
        } else {
            if (value.length === 1) {
                constantNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.STRING_CONSTANT);
                constantNode.setAttribute(ICodeKeyImpl.VALUE, value);
            } else {
                this.errorHandler.flag(token, PascalErrorCode.INVALID_CONSTANT, this as unknown as PascalParserTD);
            }
        }

        return constantNode;
    }

}


/**
 * <h1>ForStatementParser</h1>
 * <p>Parse a FOR statement</p>
 */
export class ForStatementParser extends StatementParser {


    // Synchronization set for TO or DOWNTO
    // The same as the StatementParser.STMT_START_SET
    private static readonly TO_DOWNTO_SET = new Set<PascalTokenType>([
        PascalTokenType.PLUS,
        PascalTokenType.MINUS,
        PascalTokenType.IDENTIFIER,
        PascalTokenType.INTEGER,
        PascalTokenType.REAL,
        PascalTokenType.STRING,
        PascalTokenType.NOT,
        PascalTokenType.LEFT_PAREN
    ]);
    static {
        ForStatementParser.TO_DOWNTO_SET.add(PascalTokenType.TO);
        ForStatementParser.TO_DOWNTO_SET.add(PascalTokenType.DOWNTO);
        // StatementParser.STMT_FOLLOW_SET
        ForStatementParser.TO_DOWNTO_SET.add(PascalTokenType.SEMICOLON);
        ForStatementParser.TO_DOWNTO_SET.add(PascalTokenType.END);
        ForStatementParser.TO_DOWNTO_SET.add(PascalTokenType.ELSE);
        ForStatementParser.TO_DOWNTO_SET.add(PascalTokenType.UNTIL);
        ForStatementParser.TO_DOWNTO_SET.add(PascalTokenType.DOT);
    }

    // Synchronization set for DO.
    private static readonly DO_SET = new Set<PascalTokenType>([
        PascalTokenType.PLUS,
        PascalTokenType.MINUS,
        PascalTokenType.IDENTIFIER,
        PascalTokenType.INTEGER,
        PascalTokenType.REAL,
        PascalTokenType.STRING,
        PascalTokenType.NOT,
        PascalTokenType.LEFT_PAREN
    ]);
    static {
        ForStatementParser.DO_SET.add(PascalTokenType.DO);
        // StatementParser.STMT_FOLLOW_SET
        ForStatementParser.TO_DOWNTO_SET.add(PascalTokenType.SEMICOLON);
        ForStatementParser.TO_DOWNTO_SET.add(PascalTokenType.END);
        ForStatementParser.TO_DOWNTO_SET.add(PascalTokenType.ELSE);
        ForStatementParser.TO_DOWNTO_SET.add(PascalTokenType.UNTIL);
        ForStatementParser.TO_DOWNTO_SET.add(PascalTokenType.DOT);
    }
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
     * Parse the FOR Statement.
     * @param token the initial token.
     * @return the root node of the generated parse tree.
     */
    public parse(token: Token): ICodeNode {
        token = this.nextToken(); // consume the FOR
        let targetToken = token;

        // Create the loop COMPOUND, LOOP, and TEST nodes.
        let compoundNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.COMPOUND);
        let loopNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.LOOP);
        let testNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.TEST);

        // Parse the embedded initial assignment.
        let assignmentParser = new AssignmentStatementParser(this as unknown as PascalParserTD);
        let initAssignNode = assignmentParser.parse(token);

        // Set the current line number attribute
        this.setLineNumber(initAssignNode, targetToken);

        // The COMPOUND node adopts the initial ASSIGN node and the LOOP node.
        // as its first and second child.
        compoundNode.addChild(initAssignNode);
        compoundNode.addChild(loopNode);

        // Synchronize at the TO or DOWNTO
        token = this.synchronize(ForStatementParser.TO_DOWNTO_SET);
        let direction = token.getType() as PascalTokenType;

        // look for the TO or DOWNTO
        if ((direction === PascalTokenType.TO) || (direction === PascalTokenType.DOWNTO)) {
            token = this. nextToken(); // consume the TO or DOWNTO
        } else {
            direction = PascalTokenType.TO;
            this.errorHandler.flag(token, PascalErrorCode.MISSING_TO_DOWNTO, this as unknown as PascalParserTD);
        }

        // Create a reilational operator node: GT for TO, or LT for DOWNTO.
        let relOpNode = ICodeFactory.createICodeNode(direction === PascalTokenType.TO
                                                                            ? ICodeNodeTypeImpl.GT
                                                                            : ICodeNodeTypeImpl.LT);

        // Copy the control VARIABLE node. The relational operator
        // node adopts the copied VARIABLE node as its first child.
        let controlVarNode = initAssignNode.getChildren()[0];
        relOpNode.addChild(controlVarNode.copy());

        // Parse the terminator expression. The relational operator node
        // adopts the expression as its second child.
        let expressionParse = new ExpressionParser(this as unknown as PascalParserTD);
        relOpNode.addChild(expressionParse.parse(token));

        // The TEST node adopts the relational operator node as its only child
        // the LOOP node adopts the TEST node as its first child.
        testNode.addChild(relOpNode);
        loopNode.addChild(testNode);

        // Synchronize at the DO.
        token = this.synchronize(ForStatementParser.DO_SET);
        if (token.getType() === PascalTokenType.DO) {
            token = this.nextToken(); // consume the DO
        } else {
            this.errorHandler.flag(token, PascalErrorCode.MISSING_DO, this as unknown as PascalParserTD);
        }

        // Parse the nested statement. The LOOP node adopts the statement
        // node as its second child.
        let statementParser = new StatementParser(this as unknown as PascalParserTD);
        loopNode.addChild(statementParser.parse(token));

        // Create an assignment with a copy of the control variable
        // to advance the value of the variable.
        let nextAssignNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.ASSIGN);
        nextAssignNode.addChild(controlVarNode.copy());

        // Create the arithmetic operator node:
        // ADD for TO, or SUBTRACT for DOWNTO.
        let arithOpNode = ICodeFactory.createICodeNode(direction === PascalTokenType.TO ?
                                                                                        ICodeNodeTypeImpl.ADD :
                                                                                        ICodeNodeTypeImpl.SUBTRACT);

        // The operator node adopts a copy of the loop variable as its
        // first child and the value 1 as its second child.
        arithOpNode.addChild(controlVarNode.copy());
        let oneNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.INTEGER_CONSTANT);
        oneNode.setAttribute(ICodeKeyImpl.VALUE, 1);
        arithOpNode.addChild(oneNode);

        // The next ASSIGN node adopts the arithmetic operator node as its
        // second child. The loop adopts the next ASSIGN node as its
        // third child.
        nextAssignNode.addChild(arithOpNode);
        loopNode.addChild(nextAssignNode);

        // Set the current line number attribute.
        this.setLineNumber(nextAssignNode, targetToken);

        return compoundNode;
    }

}


/**
 * <h1>IfStatementParser</h1>
 * <p>Parse a Pascal IF statement.</p>
 */
export class IfStatementParser extends StatementParser {


    // Synchronization set for THEN
    private static readonly THEN_SET = new Set<PascalTokenType>([
        PascalTokenType.BEGIN,
        PascalTokenType.CASE,
        PascalTokenType.FOR,
        PascalTokenType.IF,
        PascalTokenType.REPEAT,
        PascalTokenType.WHILE,
        PascalTokenType.IDENTIFIER,
        PascalTokenType.SEMICOLON
    ]);
    static {
        IfStatementParser.THEN_SET.add(PascalTokenType.THEN);
        // StatementParser.STMT_FOLLOW_SET
        IfStatementParser.THEN_SET.add(PascalTokenType.SEMICOLON);
        IfStatementParser.THEN_SET.add(PascalTokenType.END);
        IfStatementParser.THEN_SET.add(PascalTokenType.ELSE);
        IfStatementParser.THEN_SET.add(PascalTokenType.UNTIL);
        IfStatementParser.THEN_SET.add(PascalTokenType.DOT);
    }

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
     * Parse an IF statement.
     * @param token the initial token.
     * @return the root node of the generated parse tree.
     */
    public parse(token: Token): ICodeNode {
        token = this.nextToken(); // consume the IF

        // Create an IF node.
        let ifNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.IF);

        // Parse the expression
        // The IF node adopts the expression subtree as its first child.
        let expressionNode = new ExpressionParser(this as unknown as PascalParserTD);
        ifNode.addChild(expressionNode.parse(token));

        // Synchronize at the THEN.
        token = this.synchronize(IfStatementParser.THEN_SET);
        if (token.getType() === PascalTokenType.THEN) {
            token = this.nextToken(); // consume the THEN
        } else {
            this.errorHandler.flag(token, PascalErrorCode.MISSING_THEN, this as unknown as PascalParserTD);
        }

        // Parse the THEN statement
        let statementParser = new StatementParser(this as unknown as PascalParserTD);
        ifNode.addChild(statementParser.parse(token));
        token = this.currentToken();

        // Look for the ELSE.
        if (token.getType() === PascalTokenType.ELSE) {
            token = this.nextToken(); // consume the THEN

            // Parse the ELSE statement.
            // The IF node adopts the statement subtree as its third child.
            ifNode.addChild(statementParser.parse(token));
        }

        return ifNode;
    }
}

/**
 * <h1>RepeatStatementParser</h1>
 * <p>Parse a Pascal REPEAT statement.</p>
 */
export class RepeatStatementParser extends StatementParser {

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
     * Parse a REPEAT statement.
     * @param token the initial token.
     * @return the root node of the generated parse tree.
     */
    public parse(token: Token): ICodeNode {
        token = this.nextToken(); // consume the REPEAT

        // Create the LOOP and TEST node.
        let loopNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.LOOP);
        let testNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.TEST);

        // Parse the statement list terminated by the UNTIL token.
        let statementParser = new StatementParser(this as unknown as PascalParserTD);
        statementParser.parseList(token, loopNode, PascalTokenType.UNTIL, PascalErrorCode.MISSING_UNTIL);
        token = this.currentToken();

        // Parse the expression.
        // The TEST node adopts the expression subtree as its only child.
        // The LOOP node adopts the TEST node.
        let expressionParser = new ExpressionParser(this as unknown as PascalParserTD);
        testNode.addChild(expressionParser.parse(token));
        loopNode.addChild(testNode);

        return loopNode;
    }
}


/**
 * <h1>WhileStatementParser</h1>
 * <p>Parse a Pascal WHILE statement.</p>
 */
export class WhileStatementParser extends StatementParser {

    // Synchronization set for DO.
    private static readonly DO_SET = new Set<PascalTokenType>([
        PascalTokenType.BEGIN,
        PascalTokenType.CASE,
        PascalTokenType.FOR,
        PascalTokenType.IF,
        PascalTokenType.REPEAT,
        PascalTokenType.WHILE,
        PascalTokenType.IDENTIFIER,
        PascalTokenType.SEMICOLON
    ]);

    static {
        WhileStatementParser.DO_SET.add(PascalTokenType.DO);
        // Add all of StatementParser.STMT_FOLLOW_SET
        WhileStatementParser.DO_SET.add(PascalTokenType.SEMICOLON);
        WhileStatementParser.DO_SET.add(PascalTokenType.END);
        WhileStatementParser.DO_SET.add(PascalTokenType.ELSE);
        WhileStatementParser.DO_SET.add(PascalTokenType.UNTIL);
        WhileStatementParser.DO_SET.add(PascalTokenType.DOT);
    }
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
     * Parse a WHILE statement.
     * @param token the initial token.
     * @return the root node of the generated parse tree.
     */
    public parse(token: Token): ICodeNode {
        token = this.nextToken(); // consume the WHILE

        // Create the LOOP, TEST and NOT nodes.
        let loopNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.LOOP);
        let breakNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.TEST);
        let notNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.NOT);

        // The LOOP node adopts the TEST node as its first child.
        // The TEST node adopts the NOT node as its only child.
        loopNode.addChild(breakNode);
        breakNode.addChild(notNode);

        // Parse the expression.
        // The NOT node adopts the expression subtree as its only child.
        let expressionParser = new ExpressionParser(this as unknown as PascalParserTD);
        notNode.addChild(expressionParser.parse(token));

        // Synchronize at the DO.
        token = this.synchronize(WhileStatementParser.DO_SET);
        if (token.getType() === PascalTokenType.DO) {
            token = this.nextToken(); // consume the DO.
        } else {
            this.errorHandler.flag(token, PascalErrorCode.MISSING_DO, this as unknown as PascalParserTD);
        }

        // Parse the statement.
        // The LOOP node adopts the statement subtree and its second child.
        let statementParser = new StatementParser(this as unknown as PascalParserTD);
        loopNode.addChild(statementParser.parse(token));

        return loopNode;
    }
}