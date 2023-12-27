import {Scanner} from "../Scanner.ts";
import {Source} from "../Source.ts";
import { Token } from "../Token.ts";
import {EofToken} from "../EofToken.ts";


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
        let token: Token;
        let currentChar: string = this.currentChar();

        // Construct the next token. The current character
        // determines the token type.
        if (currentChar === Source.EOF) {
            token = new EofToken(this.source);
        } else {
            token = new Token(this.source);
        }

        return token;
    }

}