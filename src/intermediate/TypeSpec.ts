import {TypeForm} from "./TypeForm.ts";
import {SymTabEntry} from "./SymTabEntry.ts";
import {TypeKey} from "./TypeKey.ts";

/**
 * <h1>TypeSpec</h1>
 * <p>The interface for a type specification.</p>
 */
export interface TypeSpec {

    /**
     * @getter
     * @return the type form
     */
    getForm(): TypeForm;

    /**
     * @setter
     * @param identifier the type identifier (symbol table entry).
     */
    setIdentifier(identifier: SymTabEntry): void;

    /**
     * @getter
     * @return the type identifier (symbol table entry).
     */
    getIdentifier(): SymTabEntry;

    /**
     * Set an attribute of the specification.
     * @param key the attribute key.
     * @param value the attribute value.
     */
    setAttribute(key: TypeKey, value: any): void;

    /**
     * Get the value of an attribute of the specification.
     * @param key
     */
    getAttribute(key: TypeKey): any;

    /**
     * @return true if this is a Pascal string type.
     */
    isPascalString(): boolean;

    /**
     * @return the base type of this type.
     */
    baseType(): TypeSpec;
}