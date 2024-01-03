import {PascalToken} from "../PascalToken.ts";
import {Source} from "../../Source.ts";
import {PascalTokenType} from "../PascalTokenType.ts";
import {PascalErrorCode} from "../PascalErrorCode.ts";

/**
 * <h2>PascalNumberToken</h2>
 * <p>Pascal number tokens (integer and real).</p>
 */

/**
 * JavaScript does not have a text buffer.
 * We can simulate the functionality we want with a simple object.
 */
interface StringBuffer {
    textBuffer: string;
}

export class PascalNumberToken extends PascalToken {

    private static MAX_EXPONENT = 37;

    /**
     * @constructor
     * @param source the source from where to fetch the token's characters.
     */
    constructor(source: Source) {
        super(source);
    }


    /**
     * Extract a Pascal number token from the source.
     * @protected
     */
    protected extract() {
        let tb: StringBuffer = { textBuffer: ""};
        this.extractNumber(tb);
        this.text = tb.textBuffer;
    }

    /**
     * Extract a Pascal number token from the source.
     * @param tb the buffer to append the token's characters.
     * @protected
     */
    protected extractNumber(tb: StringBuffer): void {
        let wholeDigits: string | null = null;       // digits before the decimal point
        let fractionDigits: string | null = null;    // digits after the decimal point
        let exponentDigits: string | null = null;    // exponent digits
        let exponentSign: string = "+";              // exponent sign '+' or '-'
        let sawDotDot: boolean = false;              // true if saw .. token
        let currentChar: string;                     // current character.

        this.type = PascalTokenType.INTEGER;         // assume INTEGER token type for now.

        // Extract the digits of the whole part of the number
        wholeDigits = this.unsignedIntegerDigits(tb);
        if (this.type === PascalTokenType.ERROR) {
            return;
        }

        // Is there a . ?
        // It could be a decimal point or the start of the token .. token.
        currentChar = this.currentChar();
        if (currentChar === ".") {
            if (this.peekChar() === ".") {
                sawDotDot = true;   // it is a ".." token, do don't consume it.
            } else {
                this.type = PascalTokenType.REAL; // decimal point, so token type is REAL.
                tb.textBuffer += currentChar;
                currentChar = this.nextChar(); // consume the decimal point.

                // Collect the digits of the fraction part of the number.
                fractionDigits = this.unsignedIntegerDigits(tb);
                if (this.type === PascalTokenType.ERROR) {
                    return;
                }
            }
        }

        // Is there an exponent part?
        // There cannot be an exponent if we already saw a ".." token.
        currentChar = this.currentChar();
        if (!sawDotDot && (currentChar === "E") || (currentChar === "e")) {
            this.type = PascalTokenType.REAL;   // exponent, so token type is REAL.
            tb.textBuffer += currentChar;
            currentChar = this.nextChar(); // consume 'E' or 'e'

            // Exponent sign?
            if ((currentChar === "+") || (currentChar === "-")) {
                tb.textBuffer += currentChar;
                exponentSign = currentChar;
                currentChar = this.nextChar(); // consume '+' or '-'
            }

            // Extract the digits of the exponent.
            exponentDigits = this.unsignedIntegerDigits(tb);
        }

        // Compute the value of the integer number token.
        if (this.type === PascalTokenType.INTEGER) {
            let integerValue = this.computeIntegerValue(wholeDigits);

            if (this.type !== PascalTokenType.ERROR) {
                this.value = Number(integerValue);
            }
        }
        // Compute the value of the real number token.
        else if (this.type === PascalTokenType.REAL) {
            let floatValue = this.computeFloatValues(wholeDigits, fractionDigits, exponentDigits, exponentSign);

            if (this.type !== PascalTokenType.ERROR) {
                this.value = Number(floatValue);
            }
        }
    }


    /**
     * Extract and return the digits of an unsigned integer.
     * @param textBuffer the buffer to append the token's characters.
     * @return the string of digits.
     * @private
     * @throws {Error} if an error occurred.
     */
    private unsignedIntegerDigits(tb: StringBuffer): string | null {
        let currentChar = this.currentChar();

        // Must have at least one digit.
        if (!(/\d/.test(currentChar))) {
            this.type = PascalTokenType.ERROR;
            this.value = PascalErrorCode.INVALID_NUMBER;
            return null;
        }

        // Extract the digits.
        let digits = "";
        while (/\d/.test(currentChar)) {
            tb.textBuffer += currentChar;
            digits += currentChar;
            currentChar = this.nextChar(); // consume digit
        }

        return digits;
    }

    /**
     * Compute and return the integer value of a string of digits.
     * @param digits the string of digits.
     * @private
     * @return the integer value.
     */
    private computeIntegerValue(digits: string | null): number {

        // return 0 if no digits
        if (digits === null) {
            return 0;
        }

        let integerValue = Number(digits);
        if (integerValue <= Number.MAX_SAFE_INTEGER) {
            return integerValue;
        } else {
            this.type = PascalTokenType.ERROR;
            this.value = PascalErrorCode.RANGE_INTEGER;
            return 0;
        }
        // let integerValue = 0;
        // let prevValue = -1;             // overflow occurred if prevValue > integerValue
        // let index = 0;
        //
        // // Loop over the digits to compute the integer value
        // // as long as there is no overflow
        // while ((index < digits.length) && (integerValue >= prevValue)) {
        //     prevValue = integerValue;
        //     integerValue = 10*integerValue + Number(digits.charAt(index++));
        // }

        // No overflow: return the integer value.
        // if (integerValue >= prevValue) {
        //     return integerValue;
        // }
        // // Overflow: Set the integer out of range error.
        // else {
        //     this.type = PascalTokenType.ERROR;
        //     this.value = PascalErrorCode.RANGE_INTEGER;
        //     return 0;
        // }
    }

    private computeFloatValues(wholeDigits: string | null,
                               fractionDigits: string | null,
                               exponentDigits: string | null,
                               exponentSign: string) {
        let floatValue = 0.0;
        let exponentValue = this.computeIntegerValue(exponentDigits);
        let digits = wholeDigits;

        // Negate the exponent if the exponent sign is '-'
        if (exponentSign === '-') {
            exponentValue = -exponentValue;
        }

        // if there are any fraction digits, adjust the exponent value
        // and append the fraction digits.
        if (fractionDigits !== null) {
            exponentValue -= fractionDigits.length;
            digits += fractionDigits;
        }

        // check for a real number out of range error.
        if (Math.abs(exponentValue + wholeDigits!.length) > PascalNumberToken.MAX_EXPONENT) {
            this.type = PascalTokenType.ERROR;
            this.value = PascalErrorCode.RANGE_REAL;
            return 0.0;
        }

        // Loop over the digits to compute the float value
        let index = 0;
        while (index < digits!.length) {
            floatValue = 10*floatValue + Number(digits!.charAt(index++));
        }


        // Adjust the float value based on the exponent value
        if (exponentValue !== 0) {
            floatValue *= Math.pow(10, exponentValue);
        }

        return floatValue;
    }
}