import {SymTab} from "./SymTab.ts";
import {SymTabKey} from "./SymTabKey.ts";

/**
 * <h1>SymTabEntry</h1>
 * <p>The interface for a symbol table entry.</p>
 */
export interface SymTabEntry {

    /**
     * @getter
     * @return the name of the entry.
     */
    getName(): string;

    /**
     * @getter
     * @return the symbol table that contains the entry.
     */
    getSymTab(): SymTab;

    /**
     * Append a line number to the entry.
     * @param lineNumber the line number to append.
     */
    appendLineNumber(lineNumber: number): void;

    /**
     * @getter
     * @return the list of source line numbers.
     */
    getLineNumbers(): number[];

    /**
     * Set an attribute of the entry.
     * @param key the attribute key.
     * @param value the attribute value.
     */
    setAttribute(key: SymTabKey, value: any): void;

    /**
     * Get the value of an attribute of the entry.
     * @param key the attribute key.
     * @return the attribute value.
     */
    getAttribute(key: SymTabKey): any;
}