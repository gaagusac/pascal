import {Scanner} from "./Scanner.ts";
import {Token} from "./Token.ts";
import {SymTab} from "../intermediate/SymTab.ts";
import {ICode} from "../intermediate/ICode.ts";
import {MessageProducer} from "../message/MessageProducer.ts";
import { Message } from "../message/Message.ts";
import { MessageListener } from "../message/MessageListener.ts";
import {MessageHandler} from "../message/MessageHandler.ts";

/**
 * @class
 * <p> A language-independent framework class. This abstract parser
 * class will be implemented by a language-specific subclasses.</p>
 * @public
 * @property {SymTab} symTab - the symbol table generated for this parser.
 * @property {Scanner} scanner - the scanner used by the parser.
 * @property {ICode} iCode - the intermediate code for this parser.
 */
export abstract class Parser implements MessageProducer {

    protected static symTab: SymTab;
    protected static messageHandler: MessageHandler;

    static {
        Parser.symTab = {} as SymTab;
        Parser.messageHandler = new MessageHandler();
    }

    protected scanner: Scanner;

    protected iCode: ICode;


    /**
     * Constructor
     * @param scanner - the scanner to be used with this parser.
     * @protected
     */
    protected constructor(scanner: Scanner) {
        this.scanner = scanner;
        this.iCode = {} as ICode;
    }

    /**
     * Add a parser message listener.
     * @param listener the listener to add.
     */
    addMessageListener(listener: MessageListener): void {
        Parser.messageHandler.addListener(listener);
    }

    /**
     * Remove a parser message listener.
     * @param listener the message listener to remove.
     */
    removeMessageListener(listener: MessageListener): void {
        Parser.messageHandler.removeListener(listener);
    }

    /**
     * Notify listeners after setting the message.
     * @param message the message to set.
     */
    sendMessage(message: Message): void {
        Parser.messageHandler.sendMessage(message);
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