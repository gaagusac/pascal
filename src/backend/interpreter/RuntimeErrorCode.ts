

export class RuntimeErrorCode {

    public static UNINITIALIZED_VALUE: RuntimeErrorCode;
    public static VALUE_RANGE: RuntimeErrorCode;
    public static INVALID_CASE_EXPRESSION_VALUE: RuntimeErrorCode;
    public static DIVISION_BY_ZERO: RuntimeErrorCode;
    public static INVALID_STANDARD_FUNCTION_ARGUMENT: RuntimeErrorCode;
    public static INVALID_INPUT: RuntimeErrorCode;
    public static STACK_OVERFLOW: RuntimeErrorCode;
    public static UNIMPLEMENTED_FEATURE: RuntimeErrorCode;

    static {
        RuntimeErrorCode.UNINITIALIZED_VALUE = new RuntimeErrorCode("Uninitialized value");
        RuntimeErrorCode.VALUE_RANGE = new RuntimeErrorCode("Value out of range");
        RuntimeErrorCode.INVALID_CASE_EXPRESSION_VALUE = new RuntimeErrorCode("Invalid CASE expression value");
        RuntimeErrorCode.DIVISION_BY_ZERO = new RuntimeErrorCode("Division by zero");
        RuntimeErrorCode.INVALID_STANDARD_FUNCTION_ARGUMENT = new RuntimeErrorCode("Invalid standard function argument");
        RuntimeErrorCode.INVALID_INPUT = new RuntimeErrorCode("Invalid input");
        RuntimeErrorCode.STACK_OVERFLOW = new RuntimeErrorCode("Runtime stack overflow");
        RuntimeErrorCode.UNIMPLEMENTED_FEATURE = new RuntimeErrorCode("Unimplemented runtime feature");
    }

    constructor(private readonly message: string) {
        this.message = message;
    }

    public toString(): string {
        return this.message;
    }


    public valueOfRuntimeError(): string {
        switch (this.message) {
            case "Uninitialized value": return "UNINITIALIZED_VALUE";
            case "Value out of range": return "VALUE_RANGE";
            case "Invalid CASE expression value": return "INVALID_CASE_EXPRESSION_VALUE";
            case "Division by zero": return "DIVISION_BY_ZERO";
            case "Invalid standard function argument": return "INVALID_STANDARD_FUNCTION_ARGUMENT";
            case "Invalid input": return "INVALID_INPUT";
            case "Runtime stack overflow": return "STACK_OVERFLOW";
            case "Unimplemented runtime feature": return "UNIMPLEMENTED_FEATURE";
            default: return "N/A";
        }
    }


}