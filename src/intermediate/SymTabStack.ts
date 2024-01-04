import {SymTab} from "./SymTab.ts";
import {SymTabEntry} from "./SymTabEntry.ts";

/**
 * <h1>SymTabStack</h1>
 * <p>The interface for the symbol table stack.</p>
 */
export interface SymTabStack {

    /**
     * @getter
     * @return the current nesting level.
     */
    getCurrentNestingLevel(): number;

    /**
     * Return the local symbol table which is at the top of the stack.
     * @return the local symbol table.
     */
    getLocalSymTab(): SymTab | undefined ;

    /**
     * Create and enter a new entry in the local symbol table.
     * @param name the name of the entry.
     */
    enterLocal(name: string): SymTabEntry | undefined;

    /**
     * Look up an existing symbol table entry in the local symbol table.
     * @param name the name of the entry.
     */
    lookupLocal(name: string): SymTabEntry | undefined;

    /**
     * Look up an existing symbol table entry throughout the stack.
     * @param name
     */
    lookup(name: string): SymTabEntry | undefined;
}