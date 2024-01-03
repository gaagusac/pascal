import {PascalToken} from "../PascalToken.ts";
import {Source} from "../../Source.ts";
import {PascalTokenType} from "../PascalTokenType.ts";
import {PascalErrorCode} from "../PascalErrorCode.ts";

/**
 * <h2>PascalSpecialSymbolToken</h2>
 * <p>Pascal special symbol tokens.</p>
 */
export class PascalSpecialSymbolToken extends PascalToken {

    /**
     * @constructor
     * @param source the source from where to fetch the token's characters.
     * @throws {Error} if an error occurred.
     */
    constructor(source: Source) {
        super(source);
    }


    /**
     * Extract a Pascal special symbol token from the source.
     * @protected
     */
    protected extract() {

        let currentChar = this.currentChar();

        this.text = currentChar;

        switch (currentChar) {

            // Single-character special symbols.
            case "+": case "-": case "*" : case "/": case ",":
            case ";": case "'": case "=" : case "(": case ")":
            case "[": case "]": case "{" : case "}": case "^": {
                this.nextChar();
                break;
            }

            // : or :=
            case ":" : {
                currentChar = this.nextChar(); // consume ':'

                if (currentChar === "=") {
                    this.text += currentChar;
                    this.nextChar(); // consume '=';
                }

                break;
            }

            // < or <= or <>
            case "<" : {
                currentChar = this.nextChar(); // consume '<'

                if (currentChar === "=") {
                    this.text += currentChar;
                    this.nextChar(); // consume '='
                } else if (currentChar === '>') {
                    this.text += currentChar;
                    this.nextChar(); // consume '>'
                }

                break;
            }

            // > or >=
            case ">" : {
                currentChar = this.nextChar(); // consume '>'

                if (currentChar === "=") {
                    this.text += currentChar;
                    this.nextChar(); // consume '='
                }

                break;
            }

            // . or ..
            case "." : {
                currentChar = this.nextChar(); // consume '.'

                 if (currentChar === ".") {
                     this.text += currentChar;
                     this.nextChar(); // consume '.'
                 }

                 break;
            }

            default: {
                this.nextChar();
                this.type = PascalTokenType.ERROR;
                this.value = PascalErrorCode.INVALID_CHARACTER;
            }
        }

        // Set the type if it wasn't an error.
        if (this.type !== undefined) {
            this.type = PascalTokenType.SPECIAL_SYMBOLS.get(this.text)!;
        }
    }
}