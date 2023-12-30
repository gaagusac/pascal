import {Token} from "../Token.ts";
import {Source} from "../Source.ts";

/**
 * <h2>PascalToken</h2>
 * <p>Base class for Pascal token classes.</p>
 */
export class PascalToken extends Token {

    /**
     * @constructor
     * @param source the source from where to fetch the token's characters.
     */
    constructor(source: Source) {
        super(source);
    }

}