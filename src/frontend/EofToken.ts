import {Token} from "./Token.ts";
import {Source} from "./Source.ts";


/**
 * <h2>EofToken</h2>
 * <p>The generic end-of-file token.</p>
 */
export class EofToken extends Token {

    /**
     * Constructor
     * @param source the source from where to fetch subsequent characters.
     * @throws {Error} if an error occurred.
     */
    constructor(source: Source) {
        super(source);
    }

    /**
     * Do nothing. Do not consume any source characters.
     * @protected
     */
    protected extract() {
        // Do nothing
    }
}