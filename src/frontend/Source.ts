import {Message} from "../message/Message.ts";
import {MessageHandler} from "../message/MessageHandler.ts";
import {MessageListener} from "../message/MessageListener.ts";
import {MessageProducer} from "../message/MessageProducer.ts";
import {MessageType} from "../message/MessageType.ts";

/**
 * <h1>Source</h1>
 * <p>The framework class that represents the source program.</p>
 * @class
 */
export class Source implements MessageProducer {

    public static EOL = "\n"; // end-of-file character.
    public static EOF = "\u0000"; // enf-of-line character.

    private reader: string; // a reader for the source program

    private line: string; // source line
    private lineNum: number; // current source line number
    private currentPos: number; // current source line position.
    private messageHandler: MessageHandler;  // delegate to handle messages.
    private readonly lineList: string[]; // the source code in the form os a list.

    /**
     * Constructor
     * @param {string} reader - the reader for the source program.
     * @throws {Error}
     */
    constructor(reader: string) {
        this.lineNum = 0;
        this.currentPos = -2; // Set to -2 to read the first line.
        this.reader = reader;
        this.line = "";
        this.messageHandler = new MessageHandler();
        this.lineList = this.reader.split("\n"); // the source code as an array of strings.
    }

    /**
     * Add a source message listener.
     * @param listener the listener to add.
     */
    addMessageListener(listener: MessageListener): void {
        this.messageHandler.addListener(listener);
    }

    /**
     * Remove a Source message listener.
     * @param listener the listener to remove.
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
     * Return the source character at the current position.
     * @return {string} the source character at the current position.
     * @throws {Error} if an error occurred.
     */
    public currentChar(): string {
        // First time?
        if (this.currentPos === -2) {
            this.readLine();
            return this.nextChar();
        }
        // At the end of file?
        else if (this.line === undefined) {
            return Source.EOF;
        }
        // At the end of line?
        else if ((this.currentPos === -1) || (this.currentPos === this.line.length)) {
            return Source.EOL;
        }
        // Need to read the next line?
        else if (this.currentPos > this.line.length) {
            this.readLine();
            return this.nextChar();
        }
        // Return the character at the current pos
        else {
            return this.line.charAt(this.currentPos);
        }
    }

    /**
     * Consume the current source character and return the next character.
     * @return {string} the next source character.
     * @throws {Error} if an error occurred.
     */
    public nextChar(): string {
        ++this.currentPos;
        return this.currentChar();
    }

    /**
     * Return the source character following the current character without consuming
     * the following character.
     * @return {string} the following character.
     * @throws {Error} if an error occurred.
     */
    public peekChar(): string {
        this.currentChar();
        if (this.line === undefined) {
            return Source.EOF;
        }
        let nextPos: number = this.currentPos + 1;
        return nextPos < this.line.length ? this.line.charAt(nextPos) : Source.EOL;
    }

    /**
     * Read the next source line.
     * @throws {Erorr} if an error occurred.
     * @private
     */
    private readLine(): void {
        this.line = this.lineList[this.lineNum]; // undefined when no line match
        this.currentPos = -1;
        if (this.line !== undefined) {
            ++this.lineNum;
        }

        // Send a source line message containing the line number
        // and the line text to all listeners.
        if (this.line !== undefined) {
            this.sendMessage(new Message(MessageType.SOURCE_LINE, {
                line_number: this.lineNum,
                line_text: this.line,
            }));
        }
    }

    /**
     * @getter
     * @field lineNum
     */
    public getLineNum(): number {
        return this.lineNum;
    }

    /**
     * @getter
     * @field currentPos
     */
    public getPosition(): number {
        return this.currentPos;
    }
}