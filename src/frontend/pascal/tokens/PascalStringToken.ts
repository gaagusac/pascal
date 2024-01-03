import {PascalToken} from "../PascalToken.ts";
import {Source} from "../../Source.ts";
import {PascalTokenType} from "../PascalTokenType.ts";
import {PascalErrorCode} from "../PascalErrorCode.ts";


/**
 * <h2>PascalStringToken</h2>
 * <p>Pascal string tokens.</p>
 */
export class PascalStringToken extends PascalToken {


    /**
     * @constructor
     * @param source the source from where to fetch the token's characters.
     * @throws {Error} if an error occurred.
     */
    constructor(source: Source) {
        super(source);
    }


    /**
     * Extract a Pascal string token from the source.
     * @protected
     * @throws {Error} if an error occurred.
     */
    protected extract() {
        let textBuffer: string = "";
        let valueBuffer: string = "";

        let currentChar = this.nextChar(); // consume the initial quote '
        textBuffer += "'";

        // Get the string characters.
        do {
            // Replace any whitespace character with a blank.
            if (/\s/.test(currentChar)) {
                currentChar = " ";
            }

            if ((currentChar !== "'") && (currentChar !== Source.EOF)) {
                textBuffer += currentChar;
                valueBuffer += currentChar;
                currentChar = this.nextChar(); // Consume character.
            }

            // Quote? Each pair of adjacent quotes represent a single-quote
            if (currentChar === "'") {
                while ((currentChar === "'") && (this.peekChar() === "'")) {
                    textBuffer += "''";
                    valueBuffer += currentChar; // append single-quote
                    currentChar = this.nextChar(); // consume a pair of quotes.
                    currentChar = this.nextChar();
                }
            }
        } while ((currentChar !== "'") && (currentChar !== Source.EOF));

        if (currentChar === "'") {
            this.nextChar();
            textBuffer += "'";

            this.type = PascalTokenType.STRING;
            this.value = valueBuffer;
        } else {
            this.type = PascalTokenType.ERROR;
            this.value = PascalErrorCode.UNEXPECTED_EOF;
        }

        this.text = textBuffer;
    }
}