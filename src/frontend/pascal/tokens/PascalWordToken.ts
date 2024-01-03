import {PascalToken} from "../PascalToken.ts";
import {Source} from "../../Source.ts";
import {PascalTokenType} from "../PascalTokenType.ts";


/**
 * <h2>PascalWordToken</h2>
 * <p>Pascal word tokens (identifiers and reserved words).</p>
 */
export class PascalWordToken extends PascalToken {


    /**
     * @constructor
     * @param source the source from where to fetch the token's characters.
     * @throws {Error} if an error occurred.
     */
    constructor(source: Source) {
        super(source);
    }

    /**
     * Extract a Pascal word token from the source.
     * @protected
     * @throws {Error} if an error occurred.
     */
    protected extract() {
        let textBuffer: string = "";
        let currentChar: string = this.currentChar();

        // Get the word character (letter or digit). The scanner has
        // already determined that the first character is a letter.
        while (/[a-z0-9]/i.test(currentChar)) {
            textBuffer += currentChar;
            currentChar = this.nextChar();
        }

        this.text = textBuffer;

        // is it a reserved word or an Identifier?
        this.type = PascalTokenType.RESERVED_WORDS.has(this.text.toLowerCase()) ?
                        PascalTokenType.RESERVED_WORDS.get(this.text.toLowerCase()) as PascalTokenType :
                            PascalTokenType.IDENTIFIER;
    }
}