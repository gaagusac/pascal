import {Parser} from "../Parser.ts";
import {Scanner} from "../Scanner.ts";
import {Token} from "../Token.ts";
import {EofToken} from "../EofToken.ts";
import {Message} from "../../message/Message.ts";
import {MessageType} from "../../message/MessageType.ts";
import {PascalTokenType} from "./PascalTokenType.ts";
import {PascalErrorHandler} from "./PascalErrorHandler.ts";
import {PascalErrorCode} from "./PascalErrorCode.ts";

export class PascalParserTD extends Parser {

    protected errorHandler: PascalErrorHandler = new PascalErrorHandler();
    /**
     * @constructor
     * @param scanner the scanner to be used with this parser.
     */
    constructor(scanner: Scanner) {
        super(scanner);
    }

    /**
     *
     */
    public parse(): void {
        let token: Token;
        const starTime = Date.now();

        while (!((token = this.nextToken()) instanceof EofToken)) {
            let tokenType = token.getType();
            if (tokenType !== PascalTokenType.ERROR) {
                this.sendMessage(new Message(MessageType.TOKEN, {
                    token_line_number: token.getLineNum(),
                    token_position: token.getPosition(),
                    token_type: token.getType(),
                    token_text: token.getText(),
                    token_value: token.getValue(),
                }));
            } else {
                this.errorHandler.flag(token, token.getValue() as unknown as PascalErrorCode, this);
            }
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
     *
     */
    public getErrorCount(): number {
        return this.errorHandler.getErrorCount();
    }

}