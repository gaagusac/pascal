import {Scanner} from "./Scanner.ts";
import {Token} from "./Token.ts";
import {ICode} from "../intermediate/ICode.ts";
import {MessageProducer} from "../message/MessageProducer.ts";
import { Message } from "../message/Message.ts";
import { MessageListener } from "../message/MessageListener.ts";
import {MessageHandler} from "../message/MessageHandler.ts";
import {SymTabStack} from "../intermediate/SymTabStack.ts";
import {SymTabFactory} from "../intermediate/SymTabFactory.ts";

/**
 * @class
 * <p> A language-independent framework class. This abstract parser
 * class will be implemented by a language-specific subclasses.</p>
 * @public
 * @property {SymTab} symTab - the symbol table generated for this parser.
 * @property {Scanner} scanner - the scanner used by the parser.
 * @property {MessageHandler} messageHandler - delegate for messages.
 * @property {ICode} iCode - the intermediate code for this parser.
 */
export abstract class Parser implements MessageProducer {

    protected symTabStack: SymTabStack;
    protected messageHandler: MessageHandler;
    protected scanner: Scanner;
    protected iCode: ICode;

    /**
     * Constructor
     * @param scanner - the scanner to be used with this parser.
     * @protected
     */
    protected constructor(scanner: Scanner) {
        this.symTabStack = SymTabFactory.createSymTabStack();
        this.messageHandler = new MessageHandler();
        this.scanner = scanner;
        this.iCode = {} as ICode;
    }

    /**
     * @getter
     * @return the scanner for this parser.
     */
    public getScanner(): Scanner {
        return this.scanner;
    }

    /**
     * @getter
     * @return the intermediate code generated for this parser.
     */
    public getICode(): ICode {
        return this.iCode;
    }

    /**
     * @getter
     * @return the symbol table for this parser.
     */
    public getSymTab(): SymTabStack {
        return this.symTabStack;
    }

    public getMessageHandler(): MessageHandler {
        return this.messageHandler;
    }

    /**
     * Add a parser message listener.
     * @param listener the listener to add.
     */
    addMessageListener(listener: MessageListener): void {
        this.messageHandler.addListener(listener);
    }

    /**
     * Remove a parser message listener.
     * @param listener the message listener to remove.
     */
    removeMessageListener(listener: MessageListener): void {
        this.messageHandler.removeListener(listener);
    }

    /**
     * Notify listeners after setting the message.
     * @param message the message to set.
     */
    sendMessage(message: Message): void {
        this.messageHandler.sendMessage(message);
    }

    /**
     * Parse a source program and generate the intermediate code and the
     * symbol table. To be implemented by a language-specific parser.
     * @throws {Error}
     */
    public abstract parse(): void;

    /**
     * Return the number of syntax errors found by the parser.
     * To be implemented by a language-specific parser subclass.
     * @return {number} the error count.
     */
    public abstract getErrorCount(): number;

    /**
     * Call the scanner's currentToken() method.
     * @return the current token.
     */
    public currentToken(): Token {
        return this.scanner.currentToken();
    }

    /**
     * Call the scanner's nextToken() method.
     * @return the next token.
     * @throws {Error} - if an error occurred.
     */
    public nextToken(): Token {
        return this.scanner.nextToken();
    }

}