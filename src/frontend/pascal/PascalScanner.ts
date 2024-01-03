import {Scanner} from "../Scanner.ts";
import {Source} from "../Source.ts";
import { Token } from "../Token.ts";
import {EofToken} from "../EofToken.ts";
import {PascalWordToken} from "./tokens/PascalWordToken.ts";
import {PascalNumberToken} from "./tokens/PascalNumberToken.ts";
import {PascalStringToken} from "./tokens/PascalStringToken.ts";
import {PascalTokenType} from "./PascalTokenType.ts";
import {PascalSpecialSymbolToken} from "./tokens/PascalSpecialSymbolToken.ts";
import {PascalErrorToken} from "./tokens/PascalErrorToken.ts";
import {PascalErrorCode} from "./PascalErrorCode.ts";


/**
 * <h2>PascalScanner</h2>
 * <p>The Pascal scanner.</p>
 */
export class PascalScanner extends Scanner {


    /**
     * @constructor
     * @param source the source to be used with this scanner.
     */
    constructor(source: Source) {
        super(source);
    }

    /**
     * Extract and return the next Pascal token from the source.
     * @return the next token.
     * @throws {Error}
     * @protected
     */
    protected extractToken(): Token {

        this.skipWhiteSpace();
        let token: Token;
        let currentChar: string = this.currentChar();

        // Construct the next token. The current character
        // determines the token type.
        if (currentChar === Source.EOF) {
            token = new EofToken(this.source);
        } else if (/[a-z]/i.test(currentChar)) {
            token = new PascalWordToken(this.source);
        } else if (/\d/.test(currentChar)) {
            token = new PascalNumberToken(this.source);
        } else if (currentChar === "'") {
            token = new PascalStringToken(this.source);
        } else if (PascalTokenType.SPECIAL_SYMBOLS.has(currentChar)) {
            token = new PascalSpecialSymbolToken(this.source);
        } else {
            token = new PascalErrorToken(this.source, PascalErrorCode.INVALID_CHARACTER, currentChar);
            this.nextChar();
        }
        return token;
    }

    private skipWhiteSpace(): void {

        let currentChar = this.currentChar();
        while (/\s/.test(currentChar) || currentChar === '{') {

            // Start of a comment?
            if (currentChar === '{') {
                do {
                    currentChar = this.nextChar(); // consume comment characters
                } while ((currentChar !== '}') && (currentChar !== Source.EOF));

                // Found closing '}'
                if (currentChar === '}') {
                    currentChar = this.nextChar();
                }
            } else { // not a comment
                currentChar = this.nextChar();
            }
        }
    }

}