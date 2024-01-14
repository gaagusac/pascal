import {TypeForm} from "../TypeForm.ts";

export class TypeFormImpl implements TypeForm {

    _typeFormMarker: boolean = true;

    public static SCALAR: TypeFormImpl;
    public static ENUMERATION: TypeFormImpl;
    public static SUBRANGE: TypeFormImpl;
    public static ARRAY: TypeFormImpl;
    public static RECORD: TypeFormImpl;

    static {
        TypeFormImpl.SCALAR = new TypeFormImpl("SCALAR");
        TypeFormImpl.ENUMERATION = new TypeFormImpl("ENUMERATION");
        TypeFormImpl.SUBRANGE = new TypeFormImpl("SUBRANGE");
        TypeFormImpl.ARRAY = new TypeFormImpl("ARRAY");
        TypeFormImpl.RECORD = new TypeFormImpl("RECORD");
    }

    constructor(private readonly text: string) {
        this.text = text;
    }

    public valueOfTypeForm(): string {
        return this.text;
    }

    public toString(): string {
        return this.text.toLowerCase();
    }

}