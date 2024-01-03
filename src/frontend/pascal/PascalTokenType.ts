import {TokenType} from "../Token.ts";

export class PascalTokenType implements TokenType {

    // TokenType interface marker.
    _tokenTypeMarker: symbol = Symbol();

    // Reserved words
    public static AND: PascalTokenType;
    public static ARRAY: PascalTokenType;
    public static BEGIN: PascalTokenType;
    public static CASE: PascalTokenType;
    public static CONST: PascalTokenType;
    public static DIV: PascalTokenType;
    public static DO: PascalTokenType;
    public static DOWNTO: PascalTokenType;
    public static ELSE: PascalTokenType;
    public static END: PascalTokenType;
    public static FILE: PascalTokenType;
    public static FOR: PascalTokenType;
    public static FUNCTION: PascalTokenType;
    public static GOTO: PascalTokenType;
    public static IF: PascalTokenType;
    public static IN: PascalTokenType;
    public static LABEL: PascalTokenType;
    public static MOD: PascalTokenType;
    public static NIL: PascalTokenType;
    public static NOT: PascalTokenType;
    public static OF: PascalTokenType;
    public static OR: PascalTokenType;
    public static PACKED: PascalTokenType;
    public static PROCEDURE: PascalTokenType;
    public static PROGRAM: PascalTokenType;
    public static RECORD: PascalTokenType;
    public static REPEAT: PascalTokenType;
    public static SET: PascalTokenType;
    public static THEN: PascalTokenType;
    public static TO: PascalTokenType;
    public static TYPE: PascalTokenType;
    public static UNTIL: PascalTokenType;
    public static VAR: PascalTokenType;
    public static WHILE: PascalTokenType;
    public static WITH: PascalTokenType;

    // Special symbols

    public static PLUS: PascalTokenType;
    public static MINUS: PascalTokenType;
    public static START: PascalTokenType;
    public static SLASH: PascalTokenType;
    public static COLON_EQUALS: PascalTokenType;
    public static DOT: PascalTokenType;
    public static COMMA: PascalTokenType;
    public static SEMICOLON: PascalTokenType;
    public static COLON: PascalTokenType;
    public static QUOTE: PascalTokenType;
    public static EQUALS: PascalTokenType;
    public static NOT_EQUALS: PascalTokenType;
    public static LESS_THAN: PascalTokenType;
    public static LESS_EQUALS: PascalTokenType;
    public static GREATER_EQUALS: PascalTokenType;
    public static GREATER_THAN: PascalTokenType;
    public static LEFT_PAREN: PascalTokenType;
    public static RIGHT_PAREN: PascalTokenType;
    public static LEFT_BRACKET: PascalTokenType;
    public static RIGHT_BRACKET: PascalTokenType;
    public static LEFT_BRACE: PascalTokenType;
    public static RIGHT_BRACE: PascalTokenType;
    public static UP_ARROW: PascalTokenType;
    public static DOT_DOT: PascalTokenType;

    // And the others tokens
    public static IDENTIFIER: PascalTokenType;
    public static INTEGER: PascalTokenType;
    public static REAL: PascalTokenType;
    public static STRING: PascalTokenType;
    public static ERROR: PascalTokenType;
    public static END_OF_FILE: PascalTokenType;

    static {

        PascalTokenType.AND = new PascalTokenType("AND");
        PascalTokenType.ARRAY = new PascalTokenType("ARRAY");
        PascalTokenType.BEGIN = new PascalTokenType("BEGIN");
        PascalTokenType.CASE= new PascalTokenType("CASE");
        PascalTokenType.CONST = new PascalTokenType("CONST");
        PascalTokenType.DIV = new PascalTokenType("DIV");
        PascalTokenType.DO = new PascalTokenType("DO");
        PascalTokenType.DOWNTO = new PascalTokenType("DOWNTO");
        PascalTokenType.ELSE = new PascalTokenType("ELSE");
        PascalTokenType.END = new PascalTokenType("END");
        PascalTokenType.FILE = new PascalTokenType("FILE");
        PascalTokenType.FOR = new PascalTokenType("FOR");
        PascalTokenType.FUNCTION = new PascalTokenType("FUNCTION");
        PascalTokenType.GOTO = new PascalTokenType("GOTO");
        PascalTokenType.IF = new PascalTokenType("IF");
        PascalTokenType.IN = new PascalTokenType("IN");
        PascalTokenType.LABEL = new PascalTokenType("LABEL");
        PascalTokenType.MOD = new PascalTokenType("MOD");
        PascalTokenType.NIL = new PascalTokenType("NIL");
        PascalTokenType.NOT = new PascalTokenType("NOT");
        PascalTokenType.OF = new PascalTokenType("OF");
        PascalTokenType.OR = new PascalTokenType("OR");
        PascalTokenType.PACKED = new PascalTokenType("PACKED");
        PascalTokenType.PROCEDURE = new PascalTokenType("PROCEDURE");
        PascalTokenType.PROGRAM = new PascalTokenType("PROGRAM");
        PascalTokenType.RECORD = new PascalTokenType("RECORD");
        PascalTokenType.REPEAT = new PascalTokenType("REPEAT");
        PascalTokenType.SET = new PascalTokenType("SET");
        PascalTokenType.THEN = new PascalTokenType("THEN");
        PascalTokenType.TO = new PascalTokenType("TO");
        PascalTokenType.TYPE = new PascalTokenType("TYPE");
        PascalTokenType.UNTIL = new PascalTokenType("UNTIL");
        PascalTokenType.VAR = new PascalTokenType("VAR");
        PascalTokenType.WHILE = new PascalTokenType("WHILE");
        PascalTokenType.WITH = new PascalTokenType("WITH");


        PascalTokenType.PLUS = new PascalTokenType("+");
        PascalTokenType.MINUS = new PascalTokenType("-");
        PascalTokenType.START = new PascalTokenType("*");
        PascalTokenType.SLASH = new PascalTokenType("/");
        PascalTokenType.COLON_EQUALS = new PascalTokenType(":=");
        PascalTokenType.DOT = new PascalTokenType(".");
        PascalTokenType.COMMA = new PascalTokenType(",");
        PascalTokenType.SEMICOLON = new PascalTokenType(";");
        PascalTokenType.COLON = new PascalTokenType(":");
        PascalTokenType.QUOTE = new PascalTokenType("'");
        PascalTokenType.EQUALS = new PascalTokenType("=");
        PascalTokenType.NOT_EQUALS = new PascalTokenType("<>");
        PascalTokenType.LESS_THAN = new PascalTokenType("<");
        PascalTokenType.LESS_EQUALS = new PascalTokenType("<=");
        PascalTokenType.GREATER_EQUALS = new PascalTokenType(">=");
        PascalTokenType.GREATER_THAN = new PascalTokenType(">");
        PascalTokenType.LEFT_PAREN = new PascalTokenType("(");
        PascalTokenType.RIGHT_PAREN = new PascalTokenType(")");
        PascalTokenType.LEFT_BRACKET = new PascalTokenType("[");
        PascalTokenType.RIGHT_BRACKET = new PascalTokenType("]");
        PascalTokenType.LEFT_BRACE = new PascalTokenType("{");
        PascalTokenType.RIGHT_BRACE = new PascalTokenType("}");
        PascalTokenType.UP_ARROW = new PascalTokenType("^");
        PascalTokenType.DOT_DOT = new PascalTokenType("..");


        PascalTokenType.IDENTIFIER = new PascalTokenType("IDENTIFIER");
        PascalTokenType.INTEGER = new PascalTokenType("INTEGER");
        PascalTokenType.REAL = new PascalTokenType("REAL");
        PascalTokenType.STRING = new PascalTokenType("STRING");
        PascalTokenType.ERROR = new PascalTokenType("ERROR");
        PascalTokenType.END_OF_FILE = new PascalTokenType("END_OF_FILE");

    }

    /**
     * Returns the value of a token as a string constant
     * @returns the value of the token as a string
     * @public
     */
    public valueOfToken(): string {
       switch (this.text) {
           // Reserved words
           case "and": return "AND";
           case "array": return "ARRAY";
           case "begin": return "BEGIN";
           case "case": return "CASE";
           case "const": return "CONST";
           case "div": return "DIV";
           case "do": return "DO";
           case "downto": return "DOWNTO";
           case "else": return "ELSE";
           case "end": return "END";
           case "file": return "FILE";
           case "for": return "FOR";
           case "function": return "FUNCTION";
           case "goto": return "GOTO";
           case "if": return "IF";
           case "in": return "IN";
           case "label": return "LABEL";
           case "mod": return "MOD";
           case "nil": return "NIL";
           case "not": return "NOT";
           case "of": return "OF";
           case "or": return "OR";
           case "packed": return "PACKED";
           case "procedure": return "PROCEDURE";
           case "program": return "PROGRAM";
           case "record": return "RECORD";
           case "repeat": return "REPEAT";
           case "set": return "SET";
           case "then": return "THEN";
           case "to": return "TO";
           case "type": return "TYPE";
           case "until": return "UNTIL";
           case "var": return "VAR";
           case "while": return "WHILE";
           case "with": return "WITH";

           // Special Symbols
           case "+": return "PLUS";
           case "-" : return "MINUS";
           case "*" : return "START";
           case "/" : return "SLASH";
           case ":=": return "COLON_EQUALS";
           case ".": return "DOT";
           case ",": return "COMMA";
           case ";": return "SEMICOLON";
           case ":": return "COLON";
           case "'": return "QUOTE";
           case "=": return "EQUALS";
           case "<>": return "NOT_EQUALS";
           case "<": return "LESS_THAN";
           case "<=": return "LESS_EQUALS";
           case ">=": return "GREATER_EQUALS";
           case ">": return "GREATER_THAN";
           case "(": return "LEFT_PAREN";
           case ")": return "RIGHT_PAREN";
           case "[": return "LEFT_BRACKET";
           case "]": return "RIGHT_BRACKET";
           case "{": return "LEFT_BRACE";
           case "}": return "RIGHT_BRACE";
           case "^": return "UP_ARROW";
           case "..": return "DOT_DOT";

           // Other tokens
           case "identifier": return "IDENTIFIER";
           case "integer": return "INTEGER";
           case "real": return "REAL";
           case "string": return "STRING";
           case "error": return "ERROR";
           case "end_of_file": return "END_OF_FILE";

           default: return ">>>>>>>>>>>>>>>>ERROR<<<<<<<<<<<<<<<<<<<<<<<";
       }
    }
    public getText(): string {
        return this.text;
    }

    public static RESERVED_WORDS = new Map<string, PascalTokenType>();

    static {
        PascalTokenType.RESERVED_WORDS.set(PascalTokenType.AND.getText().toLowerCase(), PascalTokenType.AND);
        PascalTokenType.RESERVED_WORDS.set(PascalTokenType.ARRAY.getText(), PascalTokenType.ARRAY);
        PascalTokenType.RESERVED_WORDS.set(PascalTokenType.BEGIN.getText(), PascalTokenType.BEGIN);
        PascalTokenType.RESERVED_WORDS.set(PascalTokenType.CASE.getText(), PascalTokenType.CASE);
        PascalTokenType.RESERVED_WORDS.set(PascalTokenType.CONST.getText(), PascalTokenType.CONST);
        PascalTokenType.RESERVED_WORDS.set(PascalTokenType.DIV.getText(), PascalTokenType.DIV);
        PascalTokenType.RESERVED_WORDS.set(PascalTokenType.DO.getText(), PascalTokenType.DO);
        PascalTokenType.RESERVED_WORDS.set(PascalTokenType.DOWNTO.getText(), PascalTokenType.DOWNTO);
        PascalTokenType.RESERVED_WORDS.set(PascalTokenType.ELSE.getText(), PascalTokenType.ELSE);
        PascalTokenType.RESERVED_WORDS.set(PascalTokenType.END.getText(), PascalTokenType.END);
        PascalTokenType.RESERVED_WORDS.set(PascalTokenType.FILE.getText(), PascalTokenType.FILE);
        PascalTokenType.RESERVED_WORDS.set(PascalTokenType.FOR.getText(), PascalTokenType.FOR);
        PascalTokenType.RESERVED_WORDS.set(PascalTokenType.FUNCTION.getText(), PascalTokenType.FUNCTION);
        PascalTokenType.RESERVED_WORDS.set(PascalTokenType.GOTO.getText(), PascalTokenType.GOTO);
        PascalTokenType.RESERVED_WORDS.set(PascalTokenType.IF.getText(), PascalTokenType.IF);
        PascalTokenType.RESERVED_WORDS.set(PascalTokenType.IN.getText(), PascalTokenType.IN);
        PascalTokenType.RESERVED_WORDS.set(PascalTokenType.LABEL.getText(), PascalTokenType.LABEL);
        PascalTokenType.RESERVED_WORDS.set(PascalTokenType.MOD.getText(), PascalTokenType.MOD);
        PascalTokenType.RESERVED_WORDS.set(PascalTokenType.NIL.getText(), PascalTokenType.NIL);
        PascalTokenType.RESERVED_WORDS.set(PascalTokenType.NOT.getText(), PascalTokenType.NOT);
        PascalTokenType.RESERVED_WORDS.set(PascalTokenType.OF.getText(), PascalTokenType.OF);
        PascalTokenType.RESERVED_WORDS.set(PascalTokenType.OR.getText(), PascalTokenType.OR);
        PascalTokenType.RESERVED_WORDS.set(PascalTokenType.PACKED.getText(), PascalTokenType.PACKED);
        PascalTokenType.RESERVED_WORDS.set(PascalTokenType.PROCEDURE.getText(), PascalTokenType.PROCEDURE);
        PascalTokenType.RESERVED_WORDS.set(PascalTokenType.PROGRAM.getText(), PascalTokenType.PROGRAM);
        PascalTokenType.RESERVED_WORDS.set(PascalTokenType.RECORD.getText(), PascalTokenType.RECORD);
        PascalTokenType.RESERVED_WORDS.set(PascalTokenType.REPEAT.getText(), PascalTokenType.REPEAT);
        PascalTokenType.RESERVED_WORDS.set(PascalTokenType.SET.getText(), PascalTokenType.SET);
        PascalTokenType.RESERVED_WORDS.set(PascalTokenType.THEN.getText(), PascalTokenType.THEN);
        PascalTokenType.RESERVED_WORDS.set(PascalTokenType.TO.getText(), PascalTokenType.TO);
        PascalTokenType.RESERVED_WORDS.set(PascalTokenType.TYPE.getText(), PascalTokenType.TYPE);
        PascalTokenType.RESERVED_WORDS.set(PascalTokenType.UNTIL.getText(), PascalTokenType.UNTIL);
        PascalTokenType.RESERVED_WORDS.set(PascalTokenType.VAR.getText(), PascalTokenType.VAR);
        PascalTokenType.RESERVED_WORDS.set(PascalTokenType.WHILE.getText(), PascalTokenType.WHILE);
        PascalTokenType.RESERVED_WORDS.set(PascalTokenType.WITH.getText(), PascalTokenType.WITH);
    }


    public static SPECIAL_SYMBOLS = new Map<string, PascalTokenType>();

    static {
        PascalTokenType.SPECIAL_SYMBOLS.set(PascalTokenType.PLUS.getText(), PascalTokenType.PLUS);
        PascalTokenType.SPECIAL_SYMBOLS.set(PascalTokenType.MINUS.getText(), PascalTokenType.MINUS);
        PascalTokenType.SPECIAL_SYMBOLS.set(PascalTokenType.START.getText(), PascalTokenType.START);
        PascalTokenType.SPECIAL_SYMBOLS.set(PascalTokenType.SLASH.getText(), PascalTokenType.SLASH);
        PascalTokenType.SPECIAL_SYMBOLS.set(PascalTokenType.COLON_EQUALS.getText(), PascalTokenType.COLON_EQUALS);
        PascalTokenType.SPECIAL_SYMBOLS.set(PascalTokenType.DOT.getText(), PascalTokenType.DOT);
        PascalTokenType.SPECIAL_SYMBOLS.set(PascalTokenType.COMMA.getText(), PascalTokenType.COMMA);
        PascalTokenType.SPECIAL_SYMBOLS.set(PascalTokenType.SEMICOLON.getText(), PascalTokenType.SEMICOLON);
        PascalTokenType.SPECIAL_SYMBOLS.set(PascalTokenType.COLON.getText(), PascalTokenType.COLON);
        PascalTokenType.SPECIAL_SYMBOLS.set(PascalTokenType.QUOTE.getText(), PascalTokenType.QUOTE);
        PascalTokenType.SPECIAL_SYMBOLS.set(PascalTokenType.EQUALS.getText(), PascalTokenType.EQUALS);
        PascalTokenType.SPECIAL_SYMBOLS.set(PascalTokenType.NOT_EQUALS.getText(), PascalTokenType.NOT_EQUALS);
        PascalTokenType.SPECIAL_SYMBOLS.set(PascalTokenType.LESS_THAN.getText(), PascalTokenType.LESS_THAN);
        PascalTokenType.SPECIAL_SYMBOLS.set(PascalTokenType.LESS_EQUALS.getText(), PascalTokenType.LESS_EQUALS);
        PascalTokenType.SPECIAL_SYMBOLS.set(PascalTokenType.GREATER_EQUALS.getText(), PascalTokenType.GREATER_EQUALS);
        PascalTokenType.SPECIAL_SYMBOLS.set(PascalTokenType.GREATER_THAN.getText(), PascalTokenType.GREATER_THAN);
        PascalTokenType.SPECIAL_SYMBOLS.set(PascalTokenType.LEFT_PAREN.getText(), PascalTokenType.LEFT_PAREN);
        PascalTokenType.SPECIAL_SYMBOLS.set(PascalTokenType.RIGHT_PAREN.getText(), PascalTokenType.RIGHT_PAREN);
        PascalTokenType.SPECIAL_SYMBOLS.set(PascalTokenType.LEFT_BRACKET.getText(), PascalTokenType.LEFT_BRACKET);
        PascalTokenType.SPECIAL_SYMBOLS.set(PascalTokenType.RIGHT_BRACKET.getText(), PascalTokenType.RIGHT_BRACKET);
        PascalTokenType.SPECIAL_SYMBOLS.set(PascalTokenType.LEFT_BRACE.getText(), PascalTokenType.LEFT_BRACE);
        PascalTokenType.SPECIAL_SYMBOLS.set(PascalTokenType.RIGHT_BRACE.getText(), PascalTokenType.RIGHT_BRACE);
        PascalTokenType.SPECIAL_SYMBOLS.set(PascalTokenType.UP_ARROW.getText(), PascalTokenType.UP_ARROW);
        PascalTokenType.SPECIAL_SYMBOLS.set(PascalTokenType.DOT_DOT.getText(), PascalTokenType.DOT_DOT);
    }

    constructor(private readonly text: string) {
        this.text = text.toString().toLowerCase();
    }

}