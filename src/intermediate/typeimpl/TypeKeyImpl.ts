import {TypeKey} from "../TypeKey.ts";


export class TypeKeyImpl implements TypeKey {

    _typeKeyMarker: boolean = true;

    // Enumeration
    public static ENUMERATION_CONSTANTS: TypeKeyImpl;

    // Subrange
    public static SUBRANGE_BASE_TYPE: TypeKeyImpl;
    public static SUBRANGE_MIN_VALUE: TypeKeyImpl;
    public static SUBRANGE_MAX_VALUE: TypeKeyImpl;

    // Array
    public static ARRAY_INDEX_TYPE: TypeKeyImpl;
    public static ARRAY_ELEMENT_TYPE: TypeKeyImpl;
    public static ARRAY_ELEMENT_COUNT: TypeKeyImpl;

    // Record
    public static RECORD_SYMTAB: TypeKeyImpl;

    static {
        TypeKeyImpl.ENUMERATION_CONSTANTS = new TypeKeyImpl("ENUMERATION_CONSTANTS");

        TypeKeyImpl.SUBRANGE_BASE_TYPE = new TypeKeyImpl("SUBRANGE_BASE_TYPE");
        TypeKeyImpl.SUBRANGE_MIN_VALUE = new TypeKeyImpl("SUBRANGE_MIN_VALUE");
        TypeKeyImpl.SUBRANGE_MAX_VALUE = new TypeKeyImpl("SUBRANGE_MAX_VALUE");

        TypeKeyImpl.ARRAY_INDEX_TYPE = new TypeKeyImpl("ARRAY_INDEX_TYPE");
        TypeKeyImpl.ARRAY_ELEMENT_TYPE = new TypeKeyImpl("ARRAY_ELEMENT_TYPE");
        TypeKeyImpl.ARRAY_ELEMENT_COUNT = new TypeKeyImpl("ARRAY_ELEMENT_COUNT");

        TypeKeyImpl.RECORD_SYMTAB = new TypeKeyImpl("RECORD_SYMTAB");
    }
    constructor(private readonly text: string) {
        this.text = text;
    }

    public valueOfTypeKey(): string {
        return this.text;
    }

    public toString(): string {
        return this.text.toLowerCase();
    }
}