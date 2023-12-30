import {PascalToken} from "../PascalToken.ts";
import {PascalErrorCode} from "../PascalErrorCode.ts";
import {Source} from "../../Source.ts";
import {PascalTokenType} from "../PascalTokenType.ts";


export class PascalErrorToken extends PascalToken {

    constructor(source: Source, errorCode: PascalErrorCode, tokenText: string) {
        super(source);
        this.text = tokenText;
        this.type = PascalTokenType.ERROR;
        this.value = errorCode;
    }


    /**
     * Do nothing. Do not consume any source characters.
     * @protected
     */
    protected extract() {
        // Do nothing
    }
}