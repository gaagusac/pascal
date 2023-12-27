/**
 * <h2>MessageType</h2>
 * <p>Message types</p>
 */
export enum MessageType {
    SOURCE_LINE,
    SYNTAX_ERROR,
    PARSER_SUMMARY,
    INTERPRETER_SUMMARY,
    COMPILER_SUMMARY,
    MISCELLANEOUS,
    TOKEN,
    ASSIGN,
    FETCH,
    BREAKPOINT,
    RUNTIME_ERROR,
    CALL,
    RETURN
}