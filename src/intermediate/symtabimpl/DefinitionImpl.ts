import {Definition} from "../Definition.ts";


export class DefinitionImpl implements Definition {


    public static CONSTANT: DefinitionImpl;
    public static ENUMERATION_CONSNTANT: DefinitionImpl;
    public static TYPE: DefinitionImpl;
    public static VARIABLE: DefinitionImpl;
    public static FIELD: DefinitionImpl;
    public static VALUE_PARM: DefinitionImpl;
    public static VAR_PARM: DefinitionImpl;
    public static PROGRAM_PARM: DefinitionImpl;
    public static PROGRAM: DefinitionImpl;
    public static PROCEDURE: DefinitionImpl;
    public static FUNCTION: DefinitionImpl;
    public static UNDEFINED: DefinitionImpl;


    static {
        DefinitionImpl.CONSTANT = new DefinitionImpl("constant");
        DefinitionImpl.ENUMERATION_CONSNTANT = new DefinitionImpl("enumeration constant");
        DefinitionImpl.TYPE = new DefinitionImpl("type");
        DefinitionImpl.VARIABLE = new DefinitionImpl("variable");
        DefinitionImpl.FIELD = new DefinitionImpl("record field");
        DefinitionImpl.VALUE_PARM = new DefinitionImpl("value parameter");
        DefinitionImpl.VAR_PARM = new DefinitionImpl("VAR parameter");
        DefinitionImpl.PROGRAM_PARM = new DefinitionImpl("program parameter");
        DefinitionImpl.PROGRAM = new DefinitionImpl("program");
        DefinitionImpl.PROCEDURE = new DefinitionImpl("procedure");
        DefinitionImpl.FUNCTION = new DefinitionImpl("function");
        DefinitionImpl.UNDEFINED = new DefinitionImpl("undefined");
    }

    /**
     * @constructor
     * @param text the text for the definition code.
     */
    constructor(private readonly text: string) {
        this.text = text;
    }

    /**
     * @getter
     * @return the text of the definition code.
     */
    getText(): string {
        return this.text;
    }

}