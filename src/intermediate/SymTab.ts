import {SymTabEntry} from "./SymTabEntry.ts";

/**
 * <h1>SymTab</h1>
 * <p>The framework interface that represents the symbol table.</p>
 */
export interface SymTab {

    /**
     * @getter
     * @return the scope nesting level of this entry.
     */
    getNestingLevel(): number;

    /**
     * Create and enter a new entry into the symbol table.
     * @param name the name of the entry.
     */
    enter(name: string): SymTabEntry | undefined;

    /**
     * Look up an existing symbol table entry.
     * @param name the name of the entry.
     */
    lookup(name: string): SymTabEntry | undefined;

    /**
     * @return a list of symbol table entries sorted by name.
     */
    sortedEntries(): SymTabEntry[];
}