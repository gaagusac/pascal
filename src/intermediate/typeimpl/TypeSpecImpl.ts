import {TypeSpec} from "../TypeSpec.ts";
import {TypeKey} from "../TypeKey.ts";
import { SymTabEntry } from "../SymTabEntry.ts";
import { TypeForm } from "../TypeForm.ts";
import {TypeFormImpl} from "./TypeFormImpl.ts";
import {TypeKeyImpl} from "./TypeKeyImpl.ts";
import {Predefined} from "../symtabimpl/Predefined.ts";

interface TypeSpecImplMap<T, V> {
    get(key: T): V;
    put(key: T, value: V): V;
}

/**
 *
 */
export class TypeSpecImpl implements TypeSpec, TypeSpecImplMap<TypeKey, any> {


    // @ts-ignore
    private form: TypeForm;             // type form
    // @ts-ignore
    private identifier: SymTabEntry;    // type identifier
    private _attributes: Map<TypeKey, any> = new Map<TypeKey, any>(); // attributes of the type specification.
    /**
     * @constructor
     * @param form the type form or a string.
     */
    constructor(form: TypeForm | string) {
        if (form instanceof TypeFormImpl) {
            this.form = form;
            this.identifier = undefined!;
        }
        //
        else if (typeof form === 'string') {
            this.form = TypeFormImpl.ARRAY;

            let indexType = new TypeSpecImpl(TypeFormImpl.SUBRANGE);
            indexType.setAttribute(TypeKeyImpl.SUBRANGE_BASE_TYPE, Predefined.integerType);
            indexType.setAttribute(TypeKeyImpl.SUBRANGE_MIN_VALUE, 1);
            indexType.setAttribute(TypeKeyImpl.SUBRANGE_MAX_VALUE, form.length);

            this.setAttribute(TypeKeyImpl.ARRAY_INDEX_TYPE, indexType);
            this.setAttribute(TypeKeyImpl.ARRAY_ELEMENT_TYPE, Predefined.charType);
            this.setAttribute(TypeKeyImpl.ARRAY_ELEMENT_COUNT, form.length);
        }
    }

    get(key: TypeKey): any {
        return this._attributes.get(key);
    }
    put(key: TypeKey, value: any) {
        this._attributes.set(key, value);
    }

    getForm(): TypeForm {
        return this.form;
    }

    /**
     * @setter
     * @param identifier the identifier (symbol table entry);
     */
    setIdentifier(identifier: SymTabEntry): void {
        this.identifier = identifier;
    }

    /**
     * @getter
     * @return the type identifier (symbol table entry).
     */
    getIdentifier(): SymTabEntry {
        return this.identifier;
    }

    /**
     * Set an attribute of the specification.
     * @param key the attribute key.
     * @param value the attribute value.
     */
    setAttribute(key: TypeKey, value: any): void {
        this.put(key, value);
    }

    /**
     * Get the value of an attribute of the specification.
     * @param key the attribute key.
     * @return the attribute value.
     */
    getAttribute(key: TypeKey): any {
        return this.get(key);
    }

    isPascalString(): boolean {
        if (this.form === TypeFormImpl.ARRAY) {
            let elmtType = this.getAttribute(TypeKeyImpl.ARRAY_ELEMENT_TYPE) as TypeSpec;
            let indexType = this.getAttribute(TypeKeyImpl.ARRAY_INDEX_TYPE) as TypeSpec;

            return (elmtType.baseType() === Predefined.charType) && (indexType.baseType() === Predefined.integerType);
        }

        return false;
    }
    baseType(): TypeSpec {
        return this.form === TypeFormImpl.SUBRANGE ?
                 this.getAttribute(TypeKeyImpl.SUBRANGE_BASE_TYPE) as TypeSpec :
                      this as unknown as TypeSpec;
    }

}
