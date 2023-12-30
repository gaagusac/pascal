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


    public getText(): string {
        return this.text;
    }

    public static RESERVED_WORDS = new Set<string>();

    static {
        PascalTokenType.RESERVED_WORDS.add(PascalTokenType.AND.getText());
        PascalTokenType.RESERVED_WORDS.add(PascalTokenType.ARRAY.getText());
        PascalTokenType.RESERVED_WORDS.add(PascalTokenType.BEGIN.getText());
        PascalTokenType.RESERVED_WORDS.add(PascalTokenType.CASE.getText());
        PascalTokenType.RESERVED_WORDS.add(PascalTokenType.CONST.getText());
        PascalTokenType.RESERVED_WORDS.add(PascalTokenType.DIV.getText());
        PascalTokenType.RESERVED_WORDS.add(PascalTokenType.DO.getText());
        PascalTokenType.RESERVED_WORDS.add(PascalTokenType.DOWNTO.getText());
        PascalTokenType.RESERVED_WORDS.add(PascalTokenType.ELSE.getText());
        PascalTokenType.RESERVED_WORDS.add(PascalTokenType.END.getText());
        PascalTokenType.RESERVED_WORDS.add(PascalTokenType.FILE.getText());
        PascalTokenType.RESERVED_WORDS.add(PascalTokenType.FOR.getText());
        PascalTokenType.RESERVED_WORDS.add(PascalTokenType.FUNCTION.getText());
        PascalTokenType.RESERVED_WORDS.add(PascalTokenType.GOTO.getText());
        PascalTokenType.RESERVED_WORDS.add(PascalTokenType.IF.getText());
        PascalTokenType.RESERVED_WORDS.add(PascalTokenType.IN.getText());
        PascalTokenType.RESERVED_WORDS.add(PascalTokenType.LABEL.getText());
        PascalTokenType.RESERVED_WORDS.add(PascalTokenType.MOD.getText());
        PascalTokenType.RESERVED_WORDS.add(PascalTokenType.NIL.getText());
        PascalTokenType.RESERVED_WORDS.add(PascalTokenType.NOT.getText());
        PascalTokenType.RESERVED_WORDS.add(PascalTokenType.OF.getText());
        PascalTokenType.RESERVED_WORDS.add(PascalTokenType.OR.getText());
        PascalTokenType.RESERVED_WORDS.add(PascalTokenType.PACKED.getText());
        PascalTokenType.RESERVED_WORDS.add(PascalTokenType.PROCEDURE.getText());
        PascalTokenType.RESERVED_WORDS.add(PascalTokenType.PROGRAM.getText());
        PascalTokenType.RESERVED_WORDS.add(PascalTokenType.RECORD.getText());
        PascalTokenType.RESERVED_WORDS.add(PascalTokenType.REPEAT.getText());
        PascalTokenType.RESERVED_WORDS.add(PascalTokenType.SET.getText());
        PascalTokenType.RESERVED_WORDS.add(PascalTokenType.THEN.getText());
        PascalTokenType.RESERVED_WORDS.add(PascalTokenType.TO.getText());
        PascalTokenType.RESERVED_WORDS.add(PascalTokenType.TYPE.getText());
        PascalTokenType.RESERVED_WORDS.add(PascalTokenType.UNTIL.getText());
        PascalTokenType.RESERVED_WORDS.add(PascalTokenType.VAR.getText());
        PascalTokenType.RESERVED_WORDS.add(PascalTokenType.WHILE.getText());
        PascalTokenType.RESERVED_WORDS.add(PascalTokenType.WITH.getText());
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