

export class PascalErrorCode {


    public static ALREADY_FORWARDED: PascalErrorCode;

    public static IDENTIFIER_REDIFINED: PascalErrorCode;
    public static IDENTIFIER_UNDEFINED: PascalErrorCode;

    public static INCOMPATIBLE_ASSIGNMENT: PascalErrorCode;
    public static INCOMPATIBLE_TYPES: PascalErrorCode;

    public static INVALID_ASSIGMENT: PascalErrorCode;
    public static INVALID_CHARACTER: PascalErrorCode;
    public static INVALID_CONSTANT: PascalErrorCode;
    public static INVALID_EXPONENT: PascalErrorCode;
    public static INVALID_EXPRESSION: PascalErrorCode;
    public static INVALID_FIELD: PascalErrorCode;
    public static INVALID_FRACTION: PascalErrorCode;
    public static INVALID_IDENTIFIER_USAGE: PascalErrorCode;
    public static INVALID_INDEX_TYPE: PascalErrorCode;
    public static INVALID_NUMBER: PascalErrorCode;
    public static INVALID_STATEMENT: PascalErrorCode;
    public static INVALID_SUBRANGE: PascalErrorCode;
    public static INVALID_TARGET: PascalErrorCode;
    public static INVALID_TYPE: PascalErrorCode;
    public static INVALID_VAR_PARM: PascalErrorCode;

    public static MIN_GT_MAX: PascalErrorCode;

    public static MISSING_BEGIN: PascalErrorCode;
    public static MISSING_COLON: PascalErrorCode;
    public static MISSING_COLON_EQUALS: PascalErrorCode;
    public static MISSING_COMMA: PascalErrorCode;
    public static MISSING_CONSTANT: PascalErrorCode;
    public static MISSING_DO: PascalErrorCode;
    public static MISSING_DOT_DOT: PascalErrorCode;
    public static MISSING_END: PascalErrorCode;
    public static MISSING_EQUALS: PascalErrorCode;
    public static MISSING_FOR__CONTROL: PascalErrorCode;
    public static MISSING_IDENTIFIER: PascalErrorCode;
    public static MISSING_LEFT_BRACKET: PascalErrorCode;
    public static MISSING_OF: PascalErrorCode;
    public static MISSING_PERIOD: PascalErrorCode;
    public static MISSING_PROGRAM: PascalErrorCode;
    public static MISSING_RIGHT_BRACKET: PascalErrorCode;
    public static MISSING_RIGHT_PAREN: PascalErrorCode;
    public static MISSING_SEMICOLON: PascalErrorCode;
    public static MISSING_THEN: PascalErrorCode;
    public static MISSING_TO_DOWNTO: PascalErrorCode;
    public static MISSING_UNTIL: PascalErrorCode;
    public static MISSING_VARIABLE: PascalErrorCode;

    public static CASE_CONSTANT_REUSED: PascalErrorCode;

    public static NOT_CONSTANT_IDENTIFIER: PascalErrorCode;
    public static NOT_RECORD_VARIABLE: PascalErrorCode;
    public static NOT_TYPE_IDENTIFIER: PascalErrorCode;

    public static RANGE_INTEGER: PascalErrorCode;
    public static RANGE_REAL: PascalErrorCode;

    public static STACK_OVERFLOW: PascalErrorCode;

    public static TOO_MANY_LEVELS: PascalErrorCode;
    public static TOO_MANY_SUBSCRIPTS: PascalErrorCode;

    public static UNEXPECTED_EOF: PascalErrorCode;
    public static UNEXPECTED_TOKEN: PascalErrorCode;

    public static UNIMPLEMENTED: PascalErrorCode;

    public static UNRECOGNIZABLE: PascalErrorCode;

    public static WRONG_NUMBER_OF_PARMS: PascalErrorCode;

    // Fatal errors
    public static IO_ERROR: PascalErrorCode;
    public static TOO_MANY_ERRORS: PascalErrorCode;


    static {
        PascalErrorCode.ALREADY_FORWARDED = new PascalErrorCode("Already specified in FORWARD");

        PascalErrorCode.IDENTIFIER_REDIFINED = new PascalErrorCode("Redefined identifier");
        PascalErrorCode.IDENTIFIER_UNDEFINED = new PascalErrorCode("Undefined identifier");

        PascalErrorCode.INCOMPATIBLE_ASSIGNMENT = new PascalErrorCode("Incompatible assignment");
        PascalErrorCode.INCOMPATIBLE_TYPES = new PascalErrorCode("Incompatible types");

        PascalErrorCode.INVALID_ASSIGMENT = new PascalErrorCode("Invalid assignment statement");
        PascalErrorCode.INVALID_CHARACTER = new PascalErrorCode("Invalid character");
        PascalErrorCode.INVALID_CONSTANT = new PascalErrorCode("Invalid constant");
        PascalErrorCode.INVALID_EXPONENT = new PascalErrorCode("Invalid exponent");
        PascalErrorCode.INVALID_EXPRESSION = new PascalErrorCode("Invalid expression");
        PascalErrorCode.INVALID_FIELD = new PascalErrorCode("Invalid field");
        PascalErrorCode.INVALID_FRACTION = new PascalErrorCode("Invalid fraction");
        PascalErrorCode.INVALID_IDENTIFIER_USAGE = new PascalErrorCode("Invalid identifier usage");
        PascalErrorCode.INVALID_INDEX_TYPE = new PascalErrorCode("Invalid index type");
        PascalErrorCode.INVALID_NUMBER = new PascalErrorCode("Invalid number");
        PascalErrorCode.INVALID_STATEMENT = new PascalErrorCode("Invalid statement");
        PascalErrorCode.INVALID_SUBRANGE = new PascalErrorCode("Invalid subrange type");
        PascalErrorCode.INVALID_TARGET = new PascalErrorCode("Invalid assignment target");
        PascalErrorCode.INVALID_TYPE = new PascalErrorCode("Invalid type");
        PascalErrorCode.INVALID_VAR_PARM = new PascalErrorCode("Invalid VAR parameter");

        PascalErrorCode.MIN_GT_MAX = new PascalErrorCode("Min limit greater than max limit");

        PascalErrorCode.MISSING_BEGIN = new PascalErrorCode("Missing BEGIN");
        PascalErrorCode.MISSING_COLON = new PascalErrorCode("Missing :");
        PascalErrorCode.MISSING_COLON_EQUALS = new PascalErrorCode("Missing :=");
        PascalErrorCode.MISSING_COMMA = new PascalErrorCode("Missing ,");
        PascalErrorCode.MISSING_CONSTANT = new PascalErrorCode("Missing constant");
        PascalErrorCode.MISSING_DO = new PascalErrorCode("Missing DO");
        PascalErrorCode.MISSING_DOT_DOT = new PascalErrorCode("Missing ..");
        PascalErrorCode.MISSING_END = new PascalErrorCode("Missing END");
        PascalErrorCode.MISSING_EQUALS = new PascalErrorCode("Missing =");
        PascalErrorCode.MISSING_FOR__CONTROL = new PascalErrorCode("Invalid FOR control variable");
        PascalErrorCode.MISSING_IDENTIFIER = new PascalErrorCode("Missing identifier");
        PascalErrorCode.MISSING_LEFT_BRACKET = new PascalErrorCode("Missing [");
        PascalErrorCode.MISSING_OF = new PascalErrorCode("Missing OF");
        PascalErrorCode.MISSING_PERIOD = new PascalErrorCode("Missing .");
        PascalErrorCode.MISSING_PROGRAM = new PascalErrorCode("Missing PROGRAM");
        PascalErrorCode.MISSING_RIGHT_BRACKET = new PascalErrorCode("Missing ]");
        PascalErrorCode.MISSING_RIGHT_PAREN = new PascalErrorCode("Missing )");
        PascalErrorCode.MISSING_SEMICOLON = new PascalErrorCode("Missing ;");
        PascalErrorCode.MISSING_THEN = new PascalErrorCode("Missing THEN");
        PascalErrorCode.MISSING_TO_DOWNTO = new PascalErrorCode("Missing TO or DOWNTO");
        PascalErrorCode.MISSING_UNTIL = new PascalErrorCode("Missing UNTIL");
        PascalErrorCode.MISSING_VARIABLE = new PascalErrorCode("Missing variable");

        PascalErrorCode.CASE_CONSTANT_REUSED = new PascalErrorCode("CASE constant reused");

        PascalErrorCode.NOT_CONSTANT_IDENTIFIER = new PascalErrorCode("Not a constant identifier");
        PascalErrorCode.NOT_RECORD_VARIABLE = new PascalErrorCode("Not a record variable");
        PascalErrorCode.NOT_TYPE_IDENTIFIER = new PascalErrorCode("Not a type identifier");

        PascalErrorCode.RANGE_INTEGER = new PascalErrorCode("Integer literal out of range");
        PascalErrorCode.RANGE_REAL = new PascalErrorCode("Real literal out of range");

        PascalErrorCode.STACK_OVERFLOW = new PascalErrorCode("Stack overflow");

        PascalErrorCode.TOO_MANY_LEVELS = new PascalErrorCode("Nesting level too deep");
        PascalErrorCode.TOO_MANY_SUBSCRIPTS = new PascalErrorCode("Too many subscripts");

        PascalErrorCode.UNEXPECTED_EOF = new PascalErrorCode("Unexpected end of file");
        PascalErrorCode.UNEXPECTED_TOKEN = new PascalErrorCode("Unexpected token");

        PascalErrorCode.UNIMPLEMENTED = new PascalErrorCode("Unimplemented feature");

        PascalErrorCode.UNRECOGNIZABLE = new PascalErrorCode("Unrecognizable input");

        PascalErrorCode.WRONG_NUMBER_OF_PARMS = new PascalErrorCode("Wrong number of actual parameters");

        PascalErrorCode.IO_ERROR = new PascalErrorCode("Object I/O error", -101);
        PascalErrorCode.TOO_MANY_ERRORS = new PascalErrorCode("Too many syntax errors", -102);
    }

    private status: number;        // error code
    private message: string;       // a string representation for the error.

    /**
     * @constructor
     * @param status the status message
     * @param message the message
     */
    constructor(message: string, status:number = 0) {
        this.status = status;
        this.message = message;
    }

    /**
     * @getter
     * @return the status code.
     */
    public getStatus(): number {
        return this.status;
    }

    /**
     * @getter
     * @return the error message.
     */
    public getMessage(): string {
        return this.message;
    }


}