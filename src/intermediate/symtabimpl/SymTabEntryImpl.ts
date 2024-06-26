import { SymTab } from "../SymTab.ts";
import {SymTabEntry} from "../SymTabEntry.ts";
import {SymTabKey} from "../SymTabKey.ts";
import {Definition} from "../Definition.ts";
import {TypeSpec} from "../TypeSpec.ts";



interface SymTabEntryMap<K, T> {
    put(key: K, value: T): void;
    get(key: K): T | undefined;
}

/**
 * <h2>SymTabEntryImpl</h2>
 * <p>An implementation of a symbol table entry.</p>
 */
export class SymTabEntryImpl implements SymTabEntry,SymTabEntryMap<SymTabKey, any> {

    private name: string;
    private symTab: SymTab;
    private lineNumbers: number[];
    private definition: Definition;                 // how the identifier is defined.
    private typeSpec: TypeSpec;                     // type specification
    private _attributes: Map<SymTabKey, any>;

    /**
     * @constructor
     * @param name
     * @param symTab
     */
    constructor(name: string, symTab: SymTab) {
        this.name = name;
        this.symTab = symTab;
        this.lineNumbers = [];
        this._attributes = new Map<SymTabKey, any>();
        this.definition = undefined!;
        this.typeSpec = undefined!;
    }

    /**
     * @setter
     * @param definition the definition to set.
     */
    setDefinition(definition: Definition): void {
        this.definition = definition;
    }

    /**
     * @getter
     * @return the definition.
     */
    getDefinition(): Definition {
        return this.definition;
    }

    /**
     * @setter
     * @param typeSpec the type specification to set.
     */
    setTypeSpec(typeSpec: TypeSpec): void {
        this.typeSpec = typeSpec;
    }

    /**
     * @getter
     * @return the type specification.
     */
    getTypeSpec(): TypeSpec {
        return this.typeSpec;
    }

    put(key: SymTabKey, value: any): void {
        this._attributes.set(key, value);
    }
    get(key: SymTabKey): any {
        return this._attributes.get(key);
    }

    /**
     * @getter
     * @return the name of the entry.
     */
    getName(): string {
        return this.name;
    }

    /**
     * @getter
     * @return the symbol table that contains this entry.
     */
    getSymTab(): SymTab {
        return this.symTab;
    }

    /**
     * Append a source line number to the entry.
     * @param lineNumber
     */
    appendLineNumber(lineNumber: number): void {
        this.lineNumbers.push(lineNumber);
    }

    /**
     * @getter
     * @return the list of source line numbers for the entry.
     */
    getLineNumbers(): number[] {
        return this.lineNumbers;
    }

    /**
     * Set an attribute of the entry.
     * @param key the attribute key.
     * @param value the attribute value.
     */
    setAttribute(key: SymTabKey, value: any): void {
        this.put(key, value);
    }

    /**
     * Get the value of an attribute of the entry.
     * @param key
     */
    getAttribute(key: SymTabKey): any {
        return this.get(key);
    }



}