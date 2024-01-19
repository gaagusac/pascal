import {Parser} from "../Parser.ts";
import {Token, TokenType} from "../Token.ts";
import {Message} from "../../message/Message.ts";
import {MessageType} from "../../message/MessageType.ts";
import {PascalTokenType} from "./PascalTokenType.ts";
import {PascalErrorHandler} from "./PascalErrorHandler.ts";
import {PascalErrorCode} from "./PascalErrorCode.ts";
import {ICodeFactory} from "../../intermediate/ICodeFactory.ts";
import {ICodeNode} from "../../intermediate/ICodeNode.ts";
import {ICodeNodeTypeImpl} from "../../intermediate/icodeimpl/ICodeNodeTypeImpl.ts";
import {ICodeKeyImpl} from "../../intermediate/icodeimpl/ICodeKeyImpl.ts";
import {EofToken} from "../EofToken.ts";
import {ICodeNodeType} from "../../intermediate/ICodeNodeType.ts";
import {SymTabEntry} from "../../intermediate/SymTabEntry.ts";
import {Predefined} from "../../intermediate/symtabimpl/Predefined.ts";
import {DefinitionImpl} from "../../intermediate/symtabimpl/DefinitionImpl.ts";
import {SymTabKeyImpl} from "../../intermediate/symtabimpl/SymTabKeyImpl.ts";
import {TypeSpec} from "../../intermediate/TypeSpec.ts";
import {Definition} from "../../intermediate/Definition.ts";
import {TypeFactory} from "../../intermediate/TypeFactory.ts";
import {TypeFormImpl} from "../../intermediate/typeimpl/TypeFormImpl.ts";
import {TypeKeyImpl} from "../../intermediate/typeimpl/TypeKeyImpl.ts";
import {Scanner} from "../Scanner.ts";

export class PascalParserTD extends Parser {

    protected static errorHandler: PascalErrorHandler = new PascalErrorHandler();
    private routineId: SymTabEntry = undefined!;     // Name of the routine being parsed.
    /**
     * @constructor
     * @param scanner the scanner to be used with this parser.
     */
    constructor(scanner: Scanner) {
        super(scanner);
    }

    /**
     * @getter
     * @return the error handler.
     */
    public getErrorHandler(): PascalErrorHandler {
        return PascalParserTD.errorHandler;
    }

    /**
     * @getter
     * @return the routine identifier's symbol table entry.
     */
    public getRoutineId(): SymTabEntry {
        return this.routineId;
    }


    /**
     * Parse a Pascal source program and generate the symbol table
     * and the intermediate code.
     */
    public parse(): void {

        const starTime = Date.now();
        let iCode = ICodeFactory.createICode();
        Predefined.initialize(this.getSymTabStack());

        // Create a dummy program identifier symbol table entry.
        this.routineId = this.getSymTabStack().enterLocal("DummyProgramName".toLowerCase())!;
        this.routineId.setDefinition(DefinitionImpl.PROGRAM);
        this.getSymTabStack().setProgramId(this.routineId);

        // console.log(JSON.stringify(this.getSymTabStack().getProgramId(), null, 4));
        // console.log(JSON.stringify(this.getSymTabStack(), null, 4));

        // Push a new symbol table onto the symbol table stack and set
        // the routine's symbol table and intermediate code.
        this.routineId.setAttribute(SymTabKeyImpl.ROUTINE_SYMTAB, PascalParserTD.symTabStack.push());
        this.routineId.setAttribute(SymTabKeyImpl.ROUTINE_ICODE, iCode);

        let blockParser = new BlockParser(this as unknown as PascalParserTD);

        let token = this.nextToken();

        // Parse a block.
        let rootNode = blockParser.parse(token, this.routineId);
        iCode.setRoot(rootNode);
        PascalParserTD.symTabStack.pop();

        // Look for the final period.
        token = this.currentToken();
        if (token.getType() !== PascalTokenType.DOT) {
            PascalParserTD.errorHandler.flag(token, PascalErrorCode.MISSING_PERIOD, this as unknown as PascalParserTD);
        }
        token = this.currentToken();

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
        return PascalParserTD.errorHandler.getErrorCount();
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
            PascalParserTD.errorHandler.flag(token, PascalErrorCode.UNEXPECTED_TOKEN, this as unknown as PascalParserTD);

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
    public static readonly STMT_START_SET = new Set<PascalTokenType>([
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
    public static readonly STMT_FOLLOW_SET = new Set<PascalTokenType>([
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
        super(parent.getScanner());
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
                    StatementParser.errorHandler.flag(token, PascalErrorCode.MISSING_SEMICOLON, this as unknown as PascalParserTD);
            }

            // Synchronize at the start of the next statement
            // or at the terminator.
            token = this.synchronize(terminatorSet);
        }

        // Look for the terminator token.
        if (token.getType() === terminator) {
            token = this.nextToken();   // consume the terminator token.
        } else {
            StatementParser.errorHandler.flag(token, errorCode, this as unknown as PascalParserTD);
        }
    }
}

/**
 * <h1>AssignmentStatementParser</h1>
 * <p>Parse a Pascal assignment statement.</p>
 */
export class AssignmentStatementParser extends StatementParser {


    // Synchronization set for the := token.
    public static readonly COLON_EQUALS_SET = new Set<PascalTokenType>([
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
        let targetId = AssignmentStatementParser.symTabStack.lookup(targetName);
        if (targetId === undefined) {
            targetId = AssignmentStatementParser.symTabStack.enterLocal(targetName);
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
            AssignmentStatementParser.errorHandler.flag(token, PascalErrorCode.MISSING_COLON_EQUALS, this as unknown as PascalParserTD);
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
                let id = ExpressionParser.symTabStack.lookup(name);
                if (id === undefined) {
                    ExpressionParser.errorHandler.flag(token, PascalErrorCode.IDENTIFIER_UNDEFINED, this as unknown as PascalParserTD);
                    id = ExpressionParser.symTabStack.enterLocal(name);
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
                    ExpressionParser.errorHandler.flag(token, PascalErrorCode.MISSING_RIGHT_PAREN, this as unknown as PascalParserTD);
                }

                break;
            }

            default: {
                ExpressionParser.errorHandler.flag(token, PascalErrorCode.UNEXPECTED_TOKEN, this as unknown as PascalParserTD);
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
            CaseStatementParser.errorHandler.flag(token, PascalErrorCode.MISSING_OF, this as unknown as PascalParserTD);
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
                CaseStatementParser.errorHandler.flag(token, PascalErrorCode.MISSING_SEMICOLON, this as unknown as PascalParserTD);
            }
        }

        // Look for the END token.
        if (token.getType() === PascalTokenType.END) {
            token = this.nextToken(); // consume END
        } else {
            CaseStatementParser.errorHandler.flag(token, PascalErrorCode.MISSING_END, this as unknown as PascalParserTD);
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
            CaseStatementParser.errorHandler.flag(token, PascalErrorCode.MISSING_COLON, this as unknown as PascalParserTD);
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
                CaseStatementParser.errorHandler.flag(token, PascalErrorCode.MISSING_COMMA, this as unknown as PascalParserTD);
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
                CaseStatementParser.errorHandler.flag(token, PascalErrorCode.INVALID_CONSTANT, this as unknown as PascalParserTD);
                break;
            }
        }

        // Check for reused constants
        if (constantNode !== undefined) {
            let value: any = constantNode.getAttribute(ICodeKeyImpl.VALUE);

            if (constantSet.has(value)) {
                CaseStatementParser.errorHandler.flag(token, PascalErrorCode.CASE_CONSTANT_REUSED, this as unknown as PascalParserTD);
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
        CaseStatementParser.errorHandler.flag(token, PascalErrorCode.INVALID_CONSTANT, this as unknown as PascalParserTD);
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
            CaseStatementParser.errorHandler.flag(token, PascalErrorCode.INVALID_CONSTANT, this as unknown as PascalParserTD);
        } else {
            if (value.length === 1) {
                constantNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.STRING_CONSTANT);
                constantNode.setAttribute(ICodeKeyImpl.VALUE, value);
            } else {
                CaseStatementParser.errorHandler.flag(token, PascalErrorCode.INVALID_CONSTANT, this as unknown as PascalParserTD);
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
    public static readonly TO_DOWNTO_SET = new Set<PascalTokenType>([
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
    public static readonly DO_SET = new Set<PascalTokenType>([
        // StatementParser.STMT_START_SET
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
            ForStatementParser.errorHandler.flag(token, PascalErrorCode.MISSING_TO_DOWNTO, this as unknown as PascalParserTD);
        }

        // Create a relational operator node: GT for TO, or LT for DOWNTO.
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
            ForStatementParser.errorHandler.flag(token, PascalErrorCode.MISSING_DO, this as unknown as PascalParserTD);
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
            IfStatementParser.errorHandler.flag(token, PascalErrorCode.MISSING_THEN, this as unknown as PascalParserTD);
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
        // StatementParser.STMT_START_SET
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
            WhileStatementParser.errorHandler.flag(token, PascalErrorCode.MISSING_DO, this as unknown as PascalParserTD);
        }

        // Parse the statement.
        // The LOOP node adopts the statement subtree and its second child.
        let statementParser = new StatementParser(this as unknown as PascalParserTD);
        loopNode.addChild(statementParser.parse(token));

        return loopNode;
    }
}


/**
 * <h1>BLockParser</h1>
 * <p>Parse a Pascal Block.</p>
 */
export class BlockParser extends PascalParserTD {

    /**
     * @constructor
     * @param parent the parent parser.
     */
    constructor(parent: PascalParserTD) {
        super(parent.getScanner());
    }

    /**
     * Parse a block.
     * @param token the initial token.
     * @param routineId the symbol table entry of the routine name.
     * @return the root node of the parse tree.
     */
    // @ts-ignore
    public parse(token: Token, routineId: SymTabEntry): ICodeNode {
        let declarationParser = new DeclarationsParser(this as unknown as PascalParserTD);
        let statementParser = new StatementParser(this as unknown as PascalParserTD);

        // Parse any declaration.
        declarationParser.parse(token);

        token = this.synchronize(StatementParser.STMT_START_SET);
        let tokenType = token.getType();
        let rootNode: ICodeNode = undefined!;

        // look for the BEGIN token to parse a compound statement.
        if (tokenType === PascalTokenType.BEGIN) {
            rootNode = statementParser.parse(token);
        }
        // Missing BEGIN: Attempt to parse anyway if possible.
        else {
            BlockParser.errorHandler.flag(token, PascalErrorCode.MISSING_BEGIN, this as unknown as PascalParserTD);

            if (StatementParser.STMT_START_SET.has(tokenType as PascalTokenType)) {
                rootNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.COMPOUND);
                statementParser.parseList(token, rootNode, PascalTokenType.END, PascalErrorCode.MISSING_END);
            }
        }

        return rootNode;
    }
}

/**
 * <h1>DeclarationParser</h1>
 * <p>Parse Pascal declarations.</p>
 */
export class DeclarationsParser extends PascalParserTD {

    public static readonly DECLARATION_START_SET = new Set<PascalTokenType>([
        PascalTokenType.CONST,
        PascalTokenType.TYPE,
        PascalTokenType.VAR,
        PascalTokenType.PROCEDURE,
        PascalTokenType.FUNCTION,
        PascalTokenType.BEGIN
    ]);

    public static readonly TYPE_START_SET = new Set<PascalTokenType>([
        PascalTokenType.TYPE,
        PascalTokenType.VAR,
        PascalTokenType.PROCEDURE,
        PascalTokenType.FUNCTION,
        PascalTokenType.BEGIN
    ]);

    public static readonly VAR_START_SET = new Set<PascalTokenType>([
        PascalTokenType.VAR,
        PascalTokenType.PROCEDURE,
        PascalTokenType.FUNCTION,
        PascalTokenType.BEGIN
    ]);

    public static readonly ROUTINE_START_SET = new Set<PascalTokenType>([
        PascalTokenType.PROCEDURE,
        PascalTokenType.FUNCTION,
        PascalTokenType.BEGIN
    ]);

    /**
     * @constructor
     * @param parent
     */
    constructor(parent: PascalParserTD) {
        super(parent.getScanner());
    }

    /**
     * Parse declarations.
     * To be overridden by the specialized declarations parser subclasses.
     * @param token the initial token.
     */
    // @ts-ignore
    public parse(token: Token): void {
        token = this.synchronize(DeclarationsParser.DECLARATION_START_SET);

        if (token.getType() === PascalTokenType.CONST) {
            token = this.nextToken(); // consume CONST.

            let constantDefinitionsParser = new ConstantDefinitionsParser(this as unknown as PascalParserTD);
            constantDefinitionsParser.parse(token);
        }

        token = this.synchronize(DeclarationsParser.TYPE_START_SET);

        if (token.getType() === PascalTokenType.TYPE) {
            token = this.nextToken(); // consume the TYPE

            let typeDefinitionsParser = new TypeDefinitionsParser(this as unknown as PascalParserTD);
            typeDefinitionsParser.parse(token);
        }

        token = this.synchronize(DeclarationsParser.VAR_START_SET);

        if (token.getType() === PascalTokenType.VAR) {

            token = this.nextToken(); // consume VAR

            let variableDeclarationsParser = new VariableDeclarationsParser(this as unknown as PascalParserTD);
            variableDeclarationsParser.setDefinition(DefinitionImpl.VARIABLE);
            variableDeclarationsParser.parse(token);
        }

        token = this.synchronize(DeclarationsParser.ROUTINE_START_SET);
    }
}

export class ConstantDefinitionsParser extends DeclarationsParser {


    // Synchronization set for a constant identifier.
    public static readonly IDENTIFIER_SET = new Set<PascalTokenType>([
        // DeclarationsParser.TYPE_START_SET
        PascalTokenType.TYPE,
        PascalTokenType.VAR,
        PascalTokenType.PROCEDURE,
        PascalTokenType.FUNCTION,
        PascalTokenType.BEGIN,
        PascalTokenType.IDENTIFIER,
    ]);

    // Synchronization set for starting a constant.
    public static readonly CONSTANT_START_SET = new Set<PascalTokenType>([
        PascalTokenType.IDENTIFIER,
        PascalTokenType.INTEGER,
        PascalTokenType.REAL,
        PascalTokenType.PLUS,
        PascalTokenType.MINUS,
        PascalTokenType.STRING,
        PascalTokenType.SEMICOLON
    ]);

    // Synchronization set for the = token.
    public static readonly EQUALS_SET = new Set<PascalTokenType>([
        PascalTokenType.IDENTIFIER,
        PascalTokenType.INTEGER,
        PascalTokenType.REAL,
        PascalTokenType.PLUS,
        PascalTokenType.MINUS,
        PascalTokenType.STRING,
        PascalTokenType.SEMICOLON,
        PascalTokenType.EQUALS
    ]);

    // Synchronization set for the start of the next definition or declaration.
    public static readonly NEXT_START_SET = new Set<PascalTokenType>([
        // DeclarationsParser.TYPE_START_SET
        PascalTokenType.TYPE,
        PascalTokenType.VAR,
        PascalTokenType.PROCEDURE,
        PascalTokenType.FUNCTION,
        PascalTokenType.BEGIN,
        PascalTokenType.SEMICOLON,
        PascalTokenType.IDENTIFIER
    ]);

    /**
     * @constructor
     * @param parent the parent parser.
     */
    constructor(parent: PascalParserTD) {
        super(parent);
    }


    /**
     * Parse constant definitions.
     * @param token the initial token.
     */
    public parse(token: Token) {
        token = this.synchronize(ConstantDefinitionsParser.IDENTIFIER_SET);

        // Loop to parse a sequence of constant definitions.
        // separated by semicolons.
        while (token.getType() === PascalTokenType.IDENTIFIER) {
            let name = token.getText().toLowerCase();
            let constantId = ConstantDefinitionsParser.symTabStack.lookupLocal(name);

            // Enter the new identifier into the symbol table
            // but don't set how it's defined yet.
            if (constantId === undefined) {
                constantId = ConstantDefinitionsParser.symTabStack.enterLocal(name);
                constantId?.appendLineNumber(token.getLineNum());
            } else {
                ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode.IDENTIFIER_REDIFINED, this as unknown as PascalParserTD);
                constantId = undefined!;
            }

            token = this.nextToken(); // consume the identifier token

            // Synchronize on the = token
            token = this.synchronize(ConstantDefinitionsParser.EQUALS_SET);
            if (token.getType() === PascalTokenType.EQUALS) {
                token = this.nextToken(); // consume the =
            } else {
                ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode.MISSING_EQUALS, this as unknown as PascalParserTD);
            }

            // Parse the constant value
            let constantToken = token;
            let value = this.parseConstant(token);

            // Set identifier to be a constant and set its value
            if (constantId !== undefined) {
                constantId.setDefinition(DefinitionImpl.CONSTANT);
                constantId.setAttribute(SymTabKeyImpl.CONSTANT_VALUE, value);

                // Set the constant type
                let constantType = constantToken.getType() === PascalTokenType.IDENTIFIER ?
                                                this.getConstantType(constantToken) :
                                                    this.getConstantType(value);
                constantId.setTypeSpec(constantType);
            }

            token = this.currentToken();
            let tokenType = token.getType();

            // Look for one or more semicolons after a definition.
            if (tokenType === PascalTokenType.SEMICOLON) {
                while (token.getType() === PascalTokenType.SEMICOLON) {
                    token = this.nextToken(); // consume the ;
                }
            }

            // If at the start of the next definition or declaration,
            // then missing a semicolon.
            else if (ConstantDefinitionsParser.NEXT_START_SET.has(tokenType as PascalTokenType)) {
                ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode.MISSING_SEMICOLON, this as unknown as PascalParserTD);
            }
            token = this.synchronize(ConstantDefinitionsParser.IDENTIFIER_SET);
        }
    }

    /**
     * Parse a constant value.
     * @param token the current token.
     * @private
     * @return the constant value.
     */
    public parseConstant(token: Token): any {
        let sign: TokenType = undefined!;

        // Synchronize at the start of a constant.
        token = this.synchronize(ConstantDefinitionsParser.CONSTANT_START_SET);
        let tokenType = token.getType();

        // Plus or minus sign
        if ((tokenType === PascalTokenType.PLUS) || (tokenType === PascalTokenType.MINUS)) {
            sign = tokenType;
            token = this.nextToken(); // consume sign
        }

        // Parse the constant
        switch (token.getType() as PascalTokenType) {

            case PascalTokenType.IDENTIFIER: {
                return this.parseIdentifierConstant(token, sign);
            }

            case PascalTokenType.INTEGER: {
                let value = Number(token.getValue());
                this.nextToken(); // consume the number.
                return sign === PascalTokenType.MINUS ? -value : value;
            }

            case PascalTokenType.REAL: {
                // Js only has Number types: so 20.0 is an integer in the eyes of js
                // we fix this by adding a very small value "0.0000000001" to the value
                // of the token to "coarse" it to a float representation.
                let value = Number(token.getValue()) + (/.\.0+$/.test(token.getText()) ? 1e-9 : 0.0);
                this.nextToken(); // consume the number.
                return sign === PascalTokenType.MINUS ? -value : value;
            }

            case PascalTokenType.STRING: {
                if (sign !== undefined) {
                    ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode.INVALID_CONSTANT, this as unknown as PascalParserTD);
                }

                this.nextToken(); // consume the string.
                return String(token.getValue());
            }

            default: {
                ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode.INVALID_CONSTANT, this as unknown as PascalParserTD);
                return undefined;
            }
        }
    }


    /**
     * Parse an identifier constant.
     * @param token the current token.
     * @param sign the sign, if any.
     * @return the constant value
     * @private
     */
    public parseIdentifierConstant(token: Token, sign: TokenType): any {
        let name = token.getText().toLowerCase();
        let id = ConstantDefinitionsParser.symTabStack.lookup(name);
        this.nextToken(); // consume the identifier.

        // The identifier must have already been defined.
        // as a constant identifier.
        if (id === undefined) {
            ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode.IDENTIFIER_UNDEFINED, this as unknown as PascalParserTD);
            return undefined;
        }

        let definition = id.getDefinition();

        if (definition === DefinitionImpl.CONSTANT) {
            let value = id.getAttribute(SymTabKeyImpl.CONSTANT_VALUE);
            id.appendLineNumber(token.getLineNum());

            if (typeof value === "number") {
                return sign === PascalTokenType.MINUS ? Number(-value) : Number(value);
            } else if (typeof value === "string") {
                if (sign !== undefined) {
                    ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode.INVALID_CONSTANT, this as unknown as PascalParserTD);
                }
                return String(value);
            } else {
                return undefined;
            }
        }
        else if (definition === DefinitionImpl.ENUMERATION_CONSNTANT) {
            let value = id.getAttribute(SymTabKeyImpl.CONSTANT_VALUE);
            id.appendLineNumber(token.getLineNum());

            if (sign !== undefined) {
                ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode.INVALID_CONSTANT, this as unknown as PascalParserTD);
            }

            return value;
        }
        else if (definition === undefined) {
            ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode.NOT_CONSTANT_IDENTIFIER, this as unknown as PascalParserTD);
            return undefined;
        }
        else {
            ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode.INVALID_CONSTANT, this as unknown as PascalParserTD);
            return undefined;
        }
    }

    /**
     * Return the type of constant given its value.
     * @param value the constant value.
     * @pram tok the token.
     * @return the type specification.
     * @private
     */
    public getConstantType(value: any): TypeSpec {
        // If value is an identifier
        if (value instanceof Token) {
            let name = value.getText().toLowerCase();
            let id = ConstantDefinitionsParser.symTabStack.lookup(name);

            if (id === undefined) {
                return undefined!;
            }

            let definition = id.getDefinition();

            if ((definition === DefinitionImpl.CONSTANT) || (definition === DefinitionImpl.ENUMERATION_CONSNTANT)) {
                return id.getTypeSpec();
            } else {
                return undefined!;
            }
        }

        // For any other constants.
        let constantType: TypeSpec = undefined!;

        if (typeof value === "number") {
            if (Number.isInteger(value)) {
                constantType = Predefined.integerType;
            } else {
                constantType = Predefined.realType;
            }
        } else if (typeof value === "string") {
            if (value.length === 1) {
                constantType = Predefined.charType;
            } else {
                constantType = TypeFactory.createStringType(String(value));
            }
        }

        return constantType;
    }
}

/**
 * <h1>TypeDefinitionsParser</h1>
 * <p>Parse Pascal type definitions.</p>
 */
export class TypeDefinitionsParser extends DeclarationsParser {

    // Synchronization set for a type identifier.
    public static readonly IDENTIFIER_SET = new Set<PascalTokenType>([
        // DeclarationsParser.VAR_START_SET
        PascalTokenType.VAR,
        PascalTokenType.PROCEDURE,
        PascalTokenType.FUNCTION,
        PascalTokenType.BEGIN,
        PascalTokenType.IDENTIFIER
    ]);

    // Synchronization set for the = token
    public static readonly EQUALS_SET = new Set<PascalTokenType>([
        // ConstantDefinitionParser.CONSTANT_START_SET
        PascalTokenType.IDENTIFIER,
        PascalTokenType.INTEGER,
        PascalTokenType.REAL,
        PascalTokenType.PLUS,
        PascalTokenType.MINUS,
        PascalTokenType.STRING,
        PascalTokenType.SEMICOLON,
        PascalTokenType.EQUALS,
    ]);

    // Synchronization set for what follows a definition or declaration.
    public static readonly FOLLOW_SET = new Set<PascalTokenType>([
        PascalTokenType.SEMICOLON
    ]);

    // Synchronization set for the start of the next definition of declaration.
    public static readonly NEXT_START_SET = new Set<PascalTokenType>([
        // DeclarationsParser.VAR_START_SET
        PascalTokenType.VAR,
        PascalTokenType.PROCEDURE,
        PascalTokenType.FUNCTION,
        PascalTokenType.BEGIN,
        PascalTokenType.SEMICOLON,
        PascalTokenType.IDENTIFIER
    ]);

    /**
     * @constructor
     * @param parent the parent parser.
     */
    constructor(parent: PascalParserTD) {
        super(parent);
    }


    /**
     * Parse type definitions.
     * @param token
     */
    public parse(token: Token) {
        token = this.synchronize(TypeDefinitionsParser.IDENTIFIER_SET);

        // Loop to parse a sequence of type definitions.
        // separated by semicolons.
        while (token.getType() === PascalTokenType.IDENTIFIER) {
            let name = token.getText().toLowerCase();
            let typeId = TypeDefinitionsParser.symTabStack.lookupLocal(name);

            // Enter the new identifier into the symbol table
            // but don't set how it's defined yet.
            if (typeId === undefined) {
                typeId = TypeDefinitionsParser.symTabStack.enterLocal(name);
                typeId?.appendLineNumber(token.getLineNum());
            } else {
                TypeDefinitionsParser.errorHandler.flag(token, PascalErrorCode.IDENTIFIER_REDIFINED, this as unknown as PascalParserTD);
                typeId = undefined;
            }

            token = this.nextToken(); // consume the identifier token.

            // Synchronize on the = token
            token = this.synchronize(TypeDefinitionsParser.EQUALS_SET);
            if (token.getType() === PascalTokenType.EQUALS) {
                token = this.nextToken(); // consume the =
            } else {
                TypeDefinitionsParser.errorHandler.flag(token, PascalErrorCode.MISSING_END, this as unknown as PascalParserTD);
            }

            // Parse the type specification.
            let typeSpecificationParser = new TypeSpecificationParser(this as unknown as PascalParserTD);
            let type = typeSpecificationParser.parse(token);

            // Set identifier to be a type and set its type specification.
            if (type !== undefined) {
                typeId?.setDefinition(DefinitionImpl.TYPE);
            }

            // Cross-link the type identifier and the type specification.
            if ((type !== undefined) && (typeId !== undefined)) {
                if (type.getIdentifier() !== undefined) {
                    type.setIdentifier(typeId);
                }
                typeId.setTypeSpec(type);
            } else {
                token = this.synchronize(TypeDefinitionsParser.FOLLOW_SET);
            }

            token = this.currentToken();
            let tokenType = token.getType();

            // Look for one or more semicolons after a definition.
            if (tokenType === PascalTokenType.SEMICOLON) {
                while (token.getType() === PascalTokenType.SEMICOLON) {
                    token = this.nextToken(); // consume the ;
                }
            }
            else if (TypeDefinitionsParser.NEXT_START_SET.has(tokenType as PascalTokenType)) {
                TypeDefinitionsParser.errorHandler.flag(token, PascalErrorCode.MISSING_SEMICOLON, this as unknown as PascalParserTD);
            }

            token = this.synchronize(TypeDefinitionsParser.IDENTIFIER_SET);
        }
    }
}

/**
 * <h1>VariableDeclarationsParser</h1>
 * <p>Parse Pascal variable declaration</p>
 */
export class VariableDeclarationsParser extends DeclarationsParser {

    private definition: Definition = undefined!;

    // Synchronization set for a variable identifier.
    public static readonly IDENTIFIER_SET = new Set<PascalTokenType>([
        // DeclarationsParser.VAR_START_SET
        PascalTokenType.VAR,
        PascalTokenType.PROCEDURE,
        PascalTokenType.FUNCTION,
        PascalTokenType.BEGIN,
        PascalTokenType.IDENTIFIER,
        PascalTokenType.END,
        PascalTokenType.SEMICOLON
    ]);

    // Synchronization set for the start of the next definition or declaration.
    public static readonly NEXT_START_SET = new Set<PascalTokenType>([
        // DeclarationsParser.ROUTINE_START_SET
        PascalTokenType.PROCEDURE,
        PascalTokenType.FUNCTION,
        PascalTokenType.BEGIN,
        PascalTokenType.IDENTIFIER,
        PascalTokenType.SEMICOLON
    ]);

    /**
     * @constructor
     * @param parent the parent parser.
     */
    constructor(parent: PascalParserTD) {
        super(parent);
    }


    /**
     * Parse variable declarations.
     * @param token the initial token.
     */
    public parse(token: Token) {
        token = this.synchronize(VariableDeclarationsParser.IDENTIFIER_SET);

        // Loop to parse a sequence of variable declarations.
        // separated by semicolons.
        while (token.getType() === PascalTokenType.IDENTIFIER) {
            // Parse the identifier sublist and its type specification.
            this.parseIdentifierSublist(token);

            token = this.currentToken();
            let tokenType = token.getType();

            // Look for one or more semicolons after a definition.
            if (tokenType === PascalTokenType.SEMICOLON) {
                while (token.getType() === PascalTokenType.SEMICOLON) {
                    token = this.nextToken(); // consume the ;
                }
            }

            else if (VariableDeclarationsParser.NEXT_START_SET.has(tokenType as PascalTokenType)) {
                VariableDeclarationsParser.errorHandler.flag(token, PascalErrorCode.MISSING_SEMICOLON, this as unknown as PascalParserTD);
            }

            token = this.synchronize(VariableDeclarationsParser.IDENTIFIER_SET);
        }
    }

    // Synchronization set to start a sublist identifier.
    public static readonly IDENTIFIER_START_SET = new Set<PascalTokenType>([
        PascalTokenType.IDENTIFIER,
        PascalTokenType.COMMA
    ]);

    // Synchronization set to follow a sublist identifier.
    public static readonly IDENTIFIER_FOLLOW_SET = new Set<PascalTokenType>([
        PascalTokenType.COLON,
        PascalTokenType.SEMICOLON,
        // DeclarationsParser.VAR_START_SET
        PascalTokenType.VAR,
        PascalTokenType.PROCEDURE,
        PascalTokenType.FUNCTION,
        PascalTokenType.BEGIN
    ]);

    // Synchronization set for the , token.
    public static readonly COMMA_SET = new Set<PascalTokenType>([
        PascalTokenType.COMMA,
        PascalTokenType.COLON,
        PascalTokenType.IDENTIFIER,
        PascalTokenType.SEMICOLON
    ]);

    /**
     * Parse a sublist of identifiers and their type specification.
     * @param token the current token.
     * @return the sublist of identifiers in a declaration.
     */
    public parseIdentifierSublist(token: Token): SymTabEntry[] {
        let subList: SymTabEntry[] = [];

        do {
            token = this.synchronize(VariableDeclarationsParser.IDENTIFIER_START_SET);
            let id = this.parseIdentifier(token);

            if (id !== undefined) {
                subList.push(id);
            }

            token = this.synchronize(VariableDeclarationsParser.COMMA_SET);
            let tokenType = token.getType();

            // Look for a comma
            if (tokenType === PascalTokenType.COMMA) {
                token = this.nextToken(); // consume the comma

                if (VariableDeclarationsParser.IDENTIFIER_FOLLOW_SET.has(token.getType() as PascalTokenType)) {
                    VariableDeclarationsParser.errorHandler.flag(token, PascalErrorCode.MISSING_IDENTIFIER, this as unknown as PascalParserTD);
                }
            }

            else if (VariableDeclarationsParser.IDENTIFIER_START_SET.has(tokenType as PascalTokenType)) {
                VariableDeclarationsParser.errorHandler.flag(token, PascalErrorCode.MISSING_COMMA, this as unknown as PascalParserTD);
            }
        } while (!VariableDeclarationsParser.IDENTIFIER_FOLLOW_SET.has(token.getType() as PascalTokenType));

        // Parse the type specification.
        let type = this.parseTypeSpec(token);

        // Assign the type specification to each identifier in the list.
        for (let variableId of subList) {
            variableId.setTypeSpec(type);
        }

        return subList;
    }

    /**
     * Parse an identifier.
     * @param token the current token.
     * @return the symbol table entry of the identifier.
     */
    public parseIdentifier(token: Token): SymTabEntry {
            let id: SymTabEntry = undefined!;

            if (token.getType() === PascalTokenType.IDENTIFIER) {
                let name = token.getText().toLowerCase();
                id = VariableDeclarationsParser.symTabStack.lookupLocal(name)!;

                // Enter a new identifier into the symbol table.
                if (id === undefined) {
                    id = VariableDeclarationsParser.symTabStack.enterLocal(name)!;
                    id.setDefinition(this.definition);
                    id.appendLineNumber(token.getLineNum());
                } else {
                    VariableDeclarationsParser.errorHandler.flag(token, PascalErrorCode.IDENTIFIER_REDIFINED, this as unknown as PascalParserTD);
                }

                token = this.nextToken(); // consume the identifier token.
            } else {
                VariableDeclarationsParser.errorHandler.flag(token, PascalErrorCode.MISSING_IDENTIFIER, this as unknown as PascalParserTD);
            }

            return id;

    }

    // Synchronization set for the : token
    public static readonly COLON_SET = new Set<PascalTokenType>([
        PascalTokenType.COLON,
        PascalTokenType.SEMICOLON
    ]);

    /**
     * Parse the type specification.
     * @param token the current token.
     * @return the type specification.
     */
    public parseTypeSpec(token: Token): TypeSpec {
        // Synchronize on the : token
        token = this.synchronize(VariableDeclarationsParser.COLON_SET);
        if (token.getType() === PascalTokenType.COLON) {
            token = this.nextToken(); // consume the :
        } else {
            VariableDeclarationsParser.errorHandler.flag(token, PascalErrorCode.MISSING_COLON, this as unknown as PascalParserTD);
        }

        // Parse the type specification.
        let typeSpecificationParser = new TypeSpecificationParser(this as unknown as PascalParserTD);
        let type = typeSpecificationParser.parse(token);

        return type;
    }

    /**
     * @setter
     * @param definition the definition to set.
     */
    public setDefinition(definition: Definition): void {
        this.definition = definition;
    }
}

/**
 * <h1>TypeSpecificationParser</h1>
 * <p>Parse a Pascal type specification.<p>
 */
export class TypeSpecificationParser extends PascalParserTD {

    // Synchronization set for starting a type specification.
    public static readonly TYPE_START_SET = new Set<PascalTokenType>([
        PascalTokenType.IDENTIFIER,
        PascalTokenType.INTEGER,
        PascalTokenType.REAL,
        PascalTokenType.PLUS,
        PascalTokenType.MINUS,
        PascalTokenType.STRING,

        PascalTokenType.LEFT_PAREN,
        PascalTokenType.COMMA,

        PascalTokenType.ARRAY,
        PascalTokenType.RECORD,
        PascalTokenType.SEMICOLON
    ]);
    /**
     * @constructor
     * @param parent the parent constructor.
     */
    constructor(parent: PascalParserTD) {
        super(parent.getScanner());
    }

    /**
     * Parse a Pascal type specification.
     * @param token the current token.
     * @return the type specification.
     */
    // @ts-ignore
    public parse(token: Token): TypeSpec {
        // Synchronize at the start of a type specification.
        token = this.synchronize(TypeSpecificationParser.TYPE_START_SET);

        switch (token.getType() as PascalTokenType) {

            case PascalTokenType.ARRAY: {
                let arrayTypeParser = new ArrayTypeParser(this as unknown as PascalParserTD);
                return arrayTypeParser.parse(token);
            }

            case PascalTokenType.RECORD: {
                let recordTypeParser = new RecordTypeParser(this as unknown as PascalParserTD);
                return recordTypeParser.parse(token);
            }

            default: {
                let simpleTypeParser = new SimpleTypeParser(this as unknown as PascalParserTD);
                return simpleTypeParser.parse(token);
            }
        }
    }
}

/**
 * <h1>SimpleTypeParser</h1>
 * <p>Parse a simple Pascal type (identifier, subrange, enumeration).</p>
 */
export class SimpleTypeParser extends TypeSpecificationParser {

    // Synchronization set for starting a simple type specification.
    public static readonly SIMPLE_TYPE_START_SET = new Set<PascalTokenType>([
        PascalTokenType.IDENTIFIER,
        PascalTokenType.INTEGER,
        PascalTokenType.REAL,
        PascalTokenType.PLUS,
        PascalTokenType.MINUS,
        PascalTokenType.STRING,
        PascalTokenType.SEMICOLON,
        PascalTokenType.LEFT_PAREN,
        PascalTokenType.COMMA
    ]);

    /**
     * @constructor
     * @param parent
     */
    constructor(parent: PascalParserTD) {
        super(parent);
    }

    /**
     * Parse a simple Pascal type specification.
     * @param token the current token.
     * @return the simple type specification.
     */
    public parse(token: Token): TypeSpec {
        // Synchronize at the start of a simple type specification.
        token = this.synchronize(SimpleTypeParser.SIMPLE_TYPE_START_SET);

        switch (token.getType() as PascalTokenType) {

            case PascalTokenType.IDENTIFIER: {

                let name = token.getText().toLowerCase();
                let id = SimpleTypeParser.symTabStack.lookup(name);

                if (id !== undefined) {
                    let definition = id.getDefinition();

                    // It's either a type identifier
                    // or the start of a subrange type.
                    if (definition === DefinitionImpl.TYPE) {
                        id.appendLineNumber(token.getLineNum());
                        token = this.nextToken(); // consume the identifier.

                        // Return the type of the referent type.
                        return id.getTypeSpec();
                    }
                    else if((definition !== DefinitionImpl.CONSTANT) && (definition !== DefinitionImpl.ENUMERATION_CONSNTANT)) {
                        SimpleTypeParser.errorHandler.flag(token, PascalErrorCode.NOT_TYPE_IDENTIFIER, this as unknown as PascalParserTD);
                        token = this.nextToken(); // consume the identifier
                        return undefined!;
                    } else {
                        let subrangeTypeParser = new SubrangeTypeParser(this as unknown as PascalParserTD);
                        return subrangeTypeParser.parse(token);
                    }
                } else {
                    SimpleTypeParser.errorHandler.flag(token, PascalErrorCode.IDENTIFIER_UNDEFINED, this as unknown as PascalParserTD);
                    token = this.nextToken(); // consume the identifier.
                    return undefined!;
                }
            }

            case PascalTokenType.LEFT_PAREN: {
                let enumerationTypeParser = new EnumerationTypeParser(this as unknown as PascalParserTD);
                return enumerationTypeParser.parse(token);
            }

            case PascalTokenType.COMMA:
            case PascalTokenType.SEMICOLON: {
                SimpleTypeParser.errorHandler.flag(token, PascalErrorCode.INVALID_TYPE, this as unknown as PascalParserTD);
                return undefined!;
            }

            default: {
                let subrangeTypeParse = new SubrangeTypeParser(this as unknown as PascalParserTD);
                return subrangeTypeParse.parse(token);
            }
        }
    }
}

export class SubrangeTypeParser extends TypeSpecificationParser {

    /**
     * @constructor
     * @param parent
     */
    constructor(parent: PascalParserTD) {
        super(parent);
    }

    /**
     * Parse a Pascal subrange type specification.
     * @param token the current token.
     * @return the subrange type specification.
     */
    public parse(token: Token): TypeSpec {
        let subrangeType = TypeFactory.createType(TypeFormImpl.SUBRANGE);
        let minValue: any = undefined;
        let maxValue: any = undefined;

        // Parse the minimum constant.
        let constantToken = token;
        let constantParser = new ConstantDefinitionsParser(this as unknown as PascalParserTD);
        minValue = constantParser.parseConstant(token);

        // Set the minimum constant's type.
        let minType = constantToken.getType() === PascalTokenType.IDENTIFIER ?
                                    constantParser.getConstantType(constantToken) :
                                    constantParser.getConstantType(minValue);
        minValue = this.checkValueType(constantToken, minValue, minType);

        token = this.currentToken();
        let sawDotDot = false;

        // Look for the .. token
        if (token.getType() === PascalTokenType.DOT_DOT) {
            token = this.nextToken(); // consume the .. token
            sawDotDot = true;
        }

        let tokenType = token.getType();

        // At the start of the maximum constant?
        if (ConstantDefinitionsParser.CONSTANT_START_SET.has(tokenType as PascalTokenType)) {
            if (!sawDotDot) {
                SubrangeTypeParser.errorHandler.flag(token, PascalErrorCode.MISSING_DOT_DOT, this as unknown as PascalParserTD);
            }

            // Parse the maximum constant
            token = this.synchronize(ConstantDefinitionsParser.CONSTANT_START_SET);
            constantToken = token;
            maxValue = constantParser.parseConstant(token);

            // Set the maximum constant's type.
            let maxType = constantToken.getType() === PascalTokenType.IDENTIFIER ?
                                    constantParser.getConstantType(constantToken) :
                                    constantParser.getConstantType(maxValue);

            maxValue = this.checkValueType(constantToken, maxValue, maxType);

            // Are the max and min value types valid?
            if ((minType === undefined) || (maxType === undefined)) {
                SubrangeTypeParser.errorHandler.flag(constantToken, PascalErrorCode.INCOMPATIBLE_TYPES, this as unknown as PascalParserTD);
            }

            else if (minType !== maxType) {
                SubrangeTypeParser.errorHandler.flag(constantToken, PascalErrorCode.INVALID_SUBRANGE, this as unknown as PascalParserTD);
            }
            // Are the min and max values types the same?
            else if((minValue !== undefined) && (maxValue !== undefined) && (minValue >= maxValue)) {
                SubrangeTypeParser.errorHandler.flag(constantToken, PascalErrorCode.MIN_GT_MAX, this as unknown as PascalParserTD);
            }
        } else {
            SubrangeTypeParser.errorHandler.flag(constantToken, PascalErrorCode.INVALID_SUBRANGE, this as unknown as PascalParserTD);
        }

        subrangeType.setAttribute(TypeKeyImpl.SUBRANGE_BASE_TYPE, minType);
        subrangeType.setAttribute(TypeKeyImpl.SUBRANGE_MIN_VALUE, minValue);
        subrangeType.setAttribute(TypeKeyImpl.SUBRANGE_MAX_VALUE, maxValue);

        return subrangeType;
    }

    /**
     * Check a value of a type specification.
     * @param token the current token.
     * @param value the value.
     * @param type the type specification.
     * @return the value.
     */
    public checkValueType(token: Token, value: any, type: TypeSpec): any {
        if (type === undefined) {
            return value;
        }
        if (type === Predefined.integerType) {
            return value;
        }
        else if (type === Predefined.charType) {
            let ch = (value as String).charAt(0);
            return parseInt(ch, 36);
        } else if (type.getForm() === TypeFormImpl.ENUMERATION) {
            return value;
        } else {
            SubrangeTypeParser.errorHandler.flag(token, PascalErrorCode.INVALID_SUBRANGE, this as unknown as PascalParserTD);
            return value;
        }
    }
}

export class EnumerationTypeParser extends TypeSpecificationParser {

    // Synchronization set to start an enumeration constant.
    public static readonly ENUM_CONSTANT_START_SET = new Set<PascalTokenType>([
        PascalTokenType.IDENTIFIER,
        PascalTokenType.COMMA
    ]);

    // Synchronization set to follow an enumeration definition.
    public static readonly ENUM_DEFINITION_FOLLOW_SET = new Set<PascalTokenType>([
        PascalTokenType.RIGHT_PAREN,
        PascalTokenType.SEMICOLON,
        PascalTokenType.VAR,
        PascalTokenType.PROCEDURE,
        PascalTokenType.FUNCTION,
        PascalTokenType.BEGIN
    ]);


    /**
     * @constructor
     * @param parent
     */
    constructor(parent: PascalParserTD) {
        super(parent);
    }

    /**
     * Parse a Pascal enumeration type specification.
     * @param token the current token.
     * @return the enumeration type specification.
     */
    public parse(token: Token): TypeSpec {
        let enumerationType = TypeFactory.createType(TypeFormImpl.ENUMERATION);
        let value = -1;
        let constants: SymTabEntry[] = [];

        token = this.nextToken(); // consume the opening (

        do {
            token = this.synchronize(EnumerationTypeParser.ENUM_CONSTANT_START_SET);
            this.parseEnumerationIdentifier(token, ++value, enumerationType, constants);

            token = this.currentToken();
            let tokenType = token.getType();

            // Look for the comma
            if (tokenType === PascalTokenType.COMMA) {
                token = this.nextToken(); // consume the comma

                if (EnumerationTypeParser.ENUM_DEFINITION_FOLLOW_SET.has(token.getType() as PascalTokenType)) {
                    EnumerationTypeParser.errorHandler.flag(token, PascalErrorCode.MISSING_IDENTIFIER, this as unknown as PascalParserTD);
                }
            }
            else if (EnumerationTypeParser.ENUM_CONSTANT_START_SET.has(tokenType as PascalTokenType)) {
                EnumerationTypeParser.errorHandler.flag(token, PascalErrorCode.MISSING_COMMA, this as unknown as PascalParserTD);
            }
        } while (!EnumerationTypeParser.ENUM_DEFINITION_FOLLOW_SET.has(token.getType() as PascalTokenType));

        // Look for the closing )
        if (token.getType() === PascalTokenType.RIGHT_PAREN) {
            token = this.nextToken(); // consume theh )
        } else {
            EnumerationTypeParser.errorHandler.flag(token, PascalErrorCode.MISSING_RIGHT_PAREN, this as unknown as PascalParserTD);
        }

        enumerationType.setAttribute(TypeKeyImpl.ENUMERATION_CONSTANTS, constants);
        return enumerationType;
    }

    /**
     * Parse an enumeration identifier.
     * @param token the current token.
     * @param value the identifier's integer value (sequence number).
     * @param enumerationType the enumeration type specification.
     * @param constants the array of symbol table entries for the enumeration constants.
     */
    public parseEnumerationIdentifier(token: Token, value: number, enumerationType: TypeSpec, constants: SymTabEntry[]): void {
        let tokenType = token.getType();

        if (tokenType === PascalTokenType.IDENTIFIER) {
            let name = token.getText().toLowerCase();
            let constantId = EnumerationTypeParser.symTabStack.lookupLocal(name);

            if (constantId !== undefined) {
                EnumerationTypeParser.errorHandler.flag(token, PascalErrorCode.IDENTIFIER_REDIFINED, this as unknown as PascalParserTD);
            } else {
                constantId = EnumerationTypeParser.symTabStack.enterLocal(name);
                constantId?.setDefinition(DefinitionImpl.ENUMERATION_CONSNTANT);
                constantId?.setTypeSpec(enumerationType);
                constantId?.setAttribute(SymTabKeyImpl.CONSTANT_VALUE, value);
                constantId?.appendLineNumber(token.getLineNum());
                constants.push(constantId!);
            }

            token = this.nextToken(); // consume the identifier.
        } else {
            EnumerationTypeParser.errorHandler.flag(token, PascalErrorCode.MISSING_IDENTIFIER, this as unknown as PascalParserTD);
        }
    }
}

export class ArrayTypeParser extends TypeSpecificationParser {

    // Synchronization set for the [ token
    public static readonly LEFT_BRACKET_SET = new Set<PascalTokenType>([
        PascalTokenType.IDENTIFIER,
        PascalTokenType.INTEGER,
        PascalTokenType.REAL,
        PascalTokenType.PLUS,
        PascalTokenType.MINUS,
        PascalTokenType.STRING,
        PascalTokenType.SEMICOLON,
        PascalTokenType.LEFT_PAREN,
        PascalTokenType.COMMA,
        PascalTokenType.LEFT_BRACKET,
        PascalTokenType.RIGHT_BRACKET
    ]);

    // Synchronization set for the ] token
    public static readonly RIGHT_BRACKET_SET = new Set<PascalTokenType>([
        PascalTokenType.RIGHT_BRACKET,
        PascalTokenType.OF,
        PascalTokenType.SEMICOLON
    ]);

    // Synchronization set for OF
    public static readonly OF_SET = new Set<PascalTokenType>([
        PascalTokenType.IDENTIFIER,
        PascalTokenType.INTEGER,
        PascalTokenType.REAL,
        PascalTokenType.PLUS,
        PascalTokenType.MINUS,
        PascalTokenType.STRING,
        PascalTokenType.LEFT_PAREN,
        PascalTokenType.ARRAY,
        PascalTokenType.RECORD,
        PascalTokenType.COMMA,
        PascalTokenType.OF,
        PascalTokenType.SEMICOLON
    ]);


    /**
     * @constructor
     * @param parent
     */
    constructor(parent: PascalParserTD) {
        super(parent);
    }


    /**
     * Parse a Pascal array type specification.
     * @param token the current token.
     * @return the array type specification.
     */
    public parse(token: Token): TypeSpec {
        let arrayType = TypeFactory.createType(TypeFormImpl.ARRAY);
        token = this.nextToken(); // consume ARRAY

        // Synchronize at the [ token
        token = this.synchronize(ArrayTypeParser.LEFT_BRACKET_SET);
        if (token.getType() !== PascalTokenType.LEFT_BRACKET) {
            ArrayTypeParser.errorHandler.flag(token, PascalErrorCode.MISSING_LEFT_BRACKET, this as unknown as PascalParserTD);
        }

        // Parse the list of index type
        let elementType = this.parseIndexTypeList(token, arrayType);

        // Synchronize at the ] token
        token = this.synchronize(ArrayTypeParser.RIGHT_BRACKET_SET);
        if (token.getType() === PascalTokenType.RIGHT_BRACKET) {
            token = this.nextToken(); // consume [
        } else {
            ArrayTypeParser.errorHandler.flag(token, PascalErrorCode.MISSING_RIGHT_BRACKET, this as unknown as PascalParserTD);
        }

        // Synchronize at OF
        token = this.synchronize(ArrayTypeParser.OF_SET);
        if (token.getType() === PascalTokenType.OF) {
            token = this.nextToken(); // consume the OF
        } else {
            ArrayTypeParser.errorHandler.flag(token, PascalErrorCode.MISSING_OF, this as unknown as PascalParserTD);
        }

        // Parse the element type
        elementType.setAttribute(TypeKeyImpl.ARRAY_ELEMENT_TYPE, this.parseElementTYpe(token));

        return arrayType;
    }

    // Synchronization set to start an index type
    public static readonly INDEX_START_SET = new Set<PascalTokenType>([
        PascalTokenType.IDENTIFIER,
        PascalTokenType.INTEGER,
        PascalTokenType.REAL,
        PascalTokenType.PLUS,
        PascalTokenType.MINUS,
        PascalTokenType.STRING,
        PascalTokenType.SEMICOLON,
        PascalTokenType.LEFT_PAREN,
        PascalTokenType.COMMA
    ]);

    // Synchronization set to end an index type
    public static readonly INDEX_END_SET = new Set<PascalTokenType>([
        PascalTokenType.RIGHT_BRACKET,
        PascalTokenType.OF,
        PascalTokenType.SEMICOLON
    ]);

    // Synchronization set to follow an index type
    public static readonly INDEX_FOLLOW_SET = new Set<PascalTokenType>([
        PascalTokenType.IDENTIFIER,
        PascalTokenType.INTEGER,
        PascalTokenType.REAL,
        PascalTokenType.PLUS,
        PascalTokenType.MINUS,
        PascalTokenType.STRING,
        PascalTokenType.SEMICOLON,
        PascalTokenType.LEFT_PAREN,
        PascalTokenType.COMMA,
        PascalTokenType.RIGHT_BRACKET,
        PascalTokenType.OF,
    ]);

    /**
     * Parse the list of index type specifications.
     * @param token the current token.
     * @param arrayType the current array type specification.
     * @return the element type specification.
     */
    public parseIndexTypeList(token: Token, arrayType: TypeSpec): TypeSpec {
        let elementType = arrayType;
        let anotherIndex = false;

        token = this.nextToken(); // consume the [ token

        // Parse the list of index type specification.
        do {
            anotherIndex = false;

            // Parse the index type
            token = this.synchronize(ArrayTypeParser.INDEX_START_SET);
            this.parseIndexType(token, elementType);

            // Synchronize at the , token.
            token = this.synchronize(ArrayTypeParser.INDEX_FOLLOW_SET);
            let tokenType = token.getType();
            if ((tokenType !== PascalTokenType.COMMA) && (tokenType !== PascalTokenType.RIGHT_BRACKET)) {
                if (ArrayTypeParser.INDEX_START_SET.has(tokenType as PascalTokenType)) {
                    ArrayTypeParser.errorHandler.flag(token, PascalErrorCode.MISSING_COMMA, this as unknown as PascalParserTD);
                    anotherIndex = true;
                }
            }

            // Create an ARRAY element type object
            // for each subsequent index type.
            else if (tokenType === PascalTokenType.COMMA) {
                let newElementType = TypeFactory.createType(TypeFormImpl.ARRAY);
                elementType.setAttribute(TypeKeyImpl.ARRAY_ELEMENT_TYPE, newElementType);
                elementType = newElementType;

                token = this.nextToken(); // consume the , token
                anotherIndex = true;
            }
        } while (anotherIndex);

        return elementType;
    }

    /**
     * Parse an index type specification.
     * @param token the current token.
     * @param arrayType the current array type specification.
     */
    public parseIndexType(token: Token, arrayType: TypeSpec): void {
        let simpleTypeParser = new SimpleTypeParser(this as unknown as PascalParserTD);
        let indexType = simpleTypeParser.parse(token);
        arrayType.setAttribute(TypeKeyImpl.ARRAY_INDEX_TYPE, indexType);

        if (indexType === undefined) {
            return;
        }

        let form = indexType.getForm();
        let count = 0;

        // Check the index type and set the element count
        if (form === TypeFormImpl.SUBRANGE) {
            let minValue = Number(indexType.getAttribute(TypeKeyImpl.SUBRANGE_MIN_VALUE));
            let maxValue = Number(indexType.getAttribute(TypeKeyImpl.SUBRANGE_MAX_VALUE));

            if ((minValue !== undefined) && (maxValue !== undefined)) {
                count= maxValue - minValue + 1;
            }
        }
        else if (form === TypeFormImpl.ENUMERATION) {
            let constants = indexType.getAttribute(TypeKeyImpl.ENUMERATION_CONSTANTS) as SymTabEntry[];
            count = constants.length;
        } else {
            ArrayTypeParser.errorHandler.flag(token, PascalErrorCode.INVALID_INDEX_TYPE, this as unknown as PascalParserTD);
        }

        arrayType.setAttribute(TypeKeyImpl.ARRAY_ELEMENT_COUNT, count);
    }

    /**
     * Parse an element type specification.
     * @param token the current token.
     * @return the element type specification.
     */
    public parseElementTYpe(token: Token): TypeSpec {
        let typeSpecificationParser = new TypeSpecificationParser(this as unknown as PascalParserTD);
        return typeSpecificationParser.parse(token);
    }
}

/**
 * <h1>RecordTypeParser</h1>
 * <p>Parse a Pascal record type specification</p>
 */
export class RecordTypeParser extends TypeSpecificationParser {

    // Synchronization set for the END
    public static readonly END_SET = new Set<PascalTokenType>([
        PascalTokenType.VAR,
        PascalTokenType.PROCEDURE,
        PascalTokenType.FUNCTION,
        PascalTokenType.BEGIN,
        PascalTokenType.END,
        PascalTokenType.SEMICOLON,
    ]);

    /**
     * @constructor
     * @param parent
     */
    constructor(parent: PascalParserTD) {
        super(parent);
    }


    /**
     * Parse a Pascal record type specification.
     * @param token the current token.
     * @return the record type specification.
     */
    public parse(token: Token): TypeSpec {
        let recordType = TypeFactory.createType(TypeFormImpl.RECORD);
        token = this.nextToken(); // consume RECORD

        // Push a symbol table for the RECORD type specification.
        recordType.setAttribute(TypeKeyImpl.RECORD_SYMTAB, RecordTypeParser.symTabStack.push());

        // Parse the field declarations.
        let variableDeclarationsParser = new VariableDeclarationsParser(this as unknown as PascalParserTD);
        variableDeclarationsParser.setDefinition(DefinitionImpl.FIELD);
        variableDeclarationsParser.parse(token);

        // Pop off the record's symbol table.
        RecordTypeParser.symTabStack.pop();

        // Synchronize at the END
        token = this.synchronize(RecordTypeParser.END_SET);

        // Look for the END.
        if (token.getType() === PascalTokenType.END) {
            token = this.nextToken(); // consume the END
        } else {
            RecordTypeParser.errorHandler.flag(token, PascalErrorCode.MISSING_END, this as unknown as PascalParserTD);
        }

        return recordType;
    }
}