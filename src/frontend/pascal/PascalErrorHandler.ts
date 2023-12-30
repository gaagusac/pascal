import {PascalErrorCode} from "./PascalErrorCode.ts";
import {Token} from "../Token.ts";
import {Parser} from "../Parser.ts";
import {Message} from "../../message/Message.ts";
import {MessageType} from "../../message/MessageType.ts";

export class PascalErrorHandler {

    private static readonly MAX_ERRORS: number = 25; // Set this up to increase or decrease the maximum number of
                                                     // syntax errors.

    private errorCount: number = 0; // count of syntax errors


    /**
     * Flag the error in the source line.
     * @param token the bad token.
     * @param errorCode the error code.
     * @param parser the parser.
     * @throws {Error} if an error occurred.
     */
    public flag(token: Token, errorCode: PascalErrorCode, parser: Parser): void {
        parser.sendMessage(new Message(MessageType.SYNTAX_ERROR, {
            line_number: token.getLineNum(),
            position: token.getPosition(),
            text: token.getText(),
            error_code: errorCode.getMessage(),
        }));
        if (++this.errorCount > PascalErrorHandler.MAX_ERRORS) {
            this.abortTranslation(PascalErrorCode.TOO_MANY_ERRORS, parser);
        }
    }

    /**
     * @getter
     * @return the syntax error count.
     */
    public getErrorCount(): number {
        return this.errorCount;
    }

    /**
     * Abort the translation.
     * @param errorCode the error code.
     * @param parser the parser.
     */
    public abortTranslation(errorCode: PascalErrorCode, parser: Parser): never {
        let fatalText: string = `FATAL ERROR: ${errorCode.getMessage()}`;
        parser.sendMessage(new Message(MessageType.SYNTAX_ERROR, {
            line_number: 0,
            position: 0,
            text: "",
            error_code: fatalText,
        }));
        throw new Error("Translation aborted!!!");
    }

}