import {ICodeNodeType} from "../ICodeNodeType.ts";

export class ICodeNodeTypeImpl implements ICodeNodeType {

    _iCodeNodeTypeMarker: boolean = true;


    // Program structure
    public static PROGRAM: ICodeNodeTypeImpl;
    public static PROCEDURE: ICodeNodeTypeImpl;
    public static FUNCTION: ICodeNodeTypeImpl;

    // Statements
    public static COMPOUND: ICodeNodeTypeImpl;
    public static ASSIGN: ICodeNodeTypeImpl;
    public static LOOP: ICodeNodeTypeImpl;
    public static TEST: ICodeNodeTypeImpl;
    public static CALL: ICodeNodeTypeImpl;
    public static PARAMETERS: ICodeNodeTypeImpl;
    public static IF: ICodeNodeTypeImpl;
    public static SELECT: ICodeNodeTypeImpl;
    public static SELECT_BRANCH: ICodeNodeTypeImpl;
    public static SELECT_CONSTANTS: ICodeNodeTypeImpl;
    public static NO_OP: ICodeNodeTypeImpl;

    // Relational operators
    public static EQ: ICodeNodeTypeImpl;
    public static NE: ICodeNodeTypeImpl;
    public static LT: ICodeNodeTypeImpl;
    public static LE: ICodeNodeTypeImpl;
    public static GT: ICodeNodeTypeImpl;
    public static GE: ICodeNodeTypeImpl;
    public static NOT: ICodeNodeTypeImpl;

    // Additive operators
    public static ADD: ICodeNodeTypeImpl;
    public static SUBTRACT: ICodeNodeTypeImpl;
    public static OR: ICodeNodeTypeImpl;
    public static NEGATE: ICodeNodeTypeImpl;

    // Multiplicative operators
    public static MULTIPLY: ICodeNodeTypeImpl;
    public static INTEGER_DIVIDE: ICodeNodeTypeImpl;
    public static FLOAT_DIVIDE: ICodeNodeTypeImpl;
    public static MOD: ICodeNodeTypeImpl;
    public static AND: ICodeNodeTypeImpl;

    // Operands
    public static VARIABLE: ICodeNodeTypeImpl;
    public static SUBSCRIPTS: ICodeNodeTypeImpl;
    public static FIELD: ICodeNodeTypeImpl;
    public static INTEGER_CONSTANT: ICodeNodeTypeImpl;
    public static REAL_CONSTANT: ICodeNodeTypeImpl;
    public static STRING_CONSTANT: ICodeNodeTypeImpl;
    public static BOOLEAN_CONSTANT: ICodeNodeTypeImpl;

    // WRITE parameter
    public static WRITE_PARM: ICodeNodeTypeImpl;


    static {
        ICodeNodeTypeImpl.PROGRAM = new ICodeNodeTypeImpl("PROGRAM");
        ICodeNodeTypeImpl.PROCEDURE = new ICodeNodeTypeImpl("PROCEDURE");
        ICodeNodeTypeImpl.FUNCTION = new ICodeNodeTypeImpl("FUNCTION");

        ICodeNodeTypeImpl.COMPOUND = new ICodeNodeTypeImpl("COMPOUND");
        ICodeNodeTypeImpl.ASSIGN = new ICodeNodeTypeImpl("ASSIGN");
        ICodeNodeTypeImpl.LOOP = new ICodeNodeTypeImpl("LOOP");
        ICodeNodeTypeImpl.TEST = new ICodeNodeTypeImpl("TEST");
        ICodeNodeTypeImpl.CALL = new ICodeNodeTypeImpl("CALL");
        ICodeNodeTypeImpl.PARAMETERS = new ICodeNodeTypeImpl("PARAMETERS");
        ICodeNodeTypeImpl.IF = new ICodeNodeTypeImpl("IF");
        ICodeNodeTypeImpl.SELECT = new ICodeNodeTypeImpl("SELECT");
        ICodeNodeTypeImpl.SELECT_BRANCH = new ICodeNodeTypeImpl("SELECT_BRANCH");
        ICodeNodeTypeImpl.SELECT_CONSTANTS = new ICodeNodeTypeImpl("SELECT_CONSTANT");
        ICodeNodeTypeImpl.NO_OP = new ICodeNodeTypeImpl("NO_OP");

        ICodeNodeTypeImpl.EQ = new ICodeNodeTypeImpl("EQ");
        ICodeNodeTypeImpl.NE = new ICodeNodeTypeImpl("NE");
        ICodeNodeTypeImpl.LT = new ICodeNodeTypeImpl("LT");
        ICodeNodeTypeImpl.LE = new ICodeNodeTypeImpl("LE");
        ICodeNodeTypeImpl.GT = new ICodeNodeTypeImpl("GT");
        ICodeNodeTypeImpl.GE = new ICodeNodeTypeImpl("GE");
        ICodeNodeTypeImpl.NOT = new ICodeNodeTypeImpl("NOT");

        ICodeNodeTypeImpl.ADD = new ICodeNodeTypeImpl("ADD");
        ICodeNodeTypeImpl.SUBTRACT = new ICodeNodeTypeImpl("SUBTRACT");
        ICodeNodeTypeImpl.OR = new ICodeNodeTypeImpl("OR");
        ICodeNodeTypeImpl.NEGATE = new ICodeNodeTypeImpl("NEGATE");

        ICodeNodeTypeImpl.MULTIPLY = new ICodeNodeTypeImpl("MULTIPLY");
        ICodeNodeTypeImpl.INTEGER_DIVIDE = new ICodeNodeTypeImpl("INTEGER_DIVIDE");
        ICodeNodeTypeImpl.FLOAT_DIVIDE = new ICodeNodeTypeImpl("FLOAT_DIVIDE");
        ICodeNodeTypeImpl.MOD = new ICodeNodeTypeImpl("MOD");
        ICodeNodeTypeImpl.AND = new ICodeNodeTypeImpl("AND");

        ICodeNodeTypeImpl.VARIABLE = new ICodeNodeTypeImpl("VARIABLE");
        ICodeNodeTypeImpl.SUBSCRIPTS = new ICodeNodeTypeImpl("SUBSCRIPTS");
        ICodeNodeTypeImpl.FIELD = new ICodeNodeTypeImpl("FIELD");
        ICodeNodeTypeImpl.INTEGER_CONSTANT = new ICodeNodeTypeImpl("INTEGER_CONSTANT");
        ICodeNodeTypeImpl.REAL_CONSTANT = new ICodeNodeTypeImpl("REAL_CONSTANT");
        ICodeNodeTypeImpl.STRING_CONSTANT = new ICodeNodeTypeImpl("STRING_CONSTANT");
        ICodeNodeTypeImpl.BOOLEAN_CONSTANT = new ICodeNodeTypeImpl("BOOLEAN_CONSTANT");

        ICodeNodeTypeImpl.WRITE_PARM = new ICodeNodeTypeImpl("WRITE_PARM");
    }

    constructor(private readonly text: string) {
        this.text = text;
    }

    public valueOfNodeType(): string {
        return this.text;
    }

    public toString(): string {
        return this.valueOfNodeType();
    }

}