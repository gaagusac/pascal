import {SymTabKey} from "../SymTabKey.ts";

export class SymTabKeyImpl implements SymTabKey {

    _symTabKeyMarker: boolean = true;

    // Constant
    public static CONSTANT_VALUE: SymTabKeyImpl;

    // Procedure or function.
    public static ROUTINE_CODE: SymTabKeyImpl;
    public static ROUTINE_SYMTAB: SymTabKeyImpl;
    public static ROUTINE_ICODE: SymTabKeyImpl;
    public static ROUTINE_PARMS: SymTabKeyImpl;
    public static ROUTINE_ROUTINES: SymTabKeyImpl;

    // Variable or record field value.
    public static DATA_VALUE: SymTabKeyImpl;

    static {
        SymTabKeyImpl.CONSTANT_VALUE = new SymTabKeyImpl("CONSTANT_VALUE");

        SymTabKeyImpl.ROUTINE_CODE = new SymTabKeyImpl("ROUTINE_CODE");
        SymTabKeyImpl.ROUTINE_SYMTAB = new SymTabKeyImpl("ROUTINE_SYMTAB");
        SymTabKeyImpl.ROUTINE_ICODE = new SymTabKeyImpl("ROUTINE_ICODE");
        SymTabKeyImpl.ROUTINE_PARMS = new SymTabKeyImpl("ROUTINE_PARMS");
        SymTabKeyImpl.ROUTINE_ROUTINES = new SymTabKeyImpl("ROUTINE_ROUTINES");

        SymTabKeyImpl.DATA_VALUE = new SymTabKeyImpl("DATA_VALUE");
    }

    /**
     * Get the key value name.
     * @return the key name.
     */
    public getSYmTabKeyValueOf(): string {
        return this.text;
    }

    /**
     * @constructor
     * @param text dummy text.
     */
    constructor(private text: string) {
        this.text = text;
    }
}