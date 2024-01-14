import {SymTab} from "./SymTab.ts";
import {SymTabEntry} from "./SymTabEntry.ts";

/**
 * <h1>SymTabStack</h1>
 * <p>The interface for the symbol table stack.</p>
 */
export interface SymTabStack {


    /**
     * @setter
     * @param entry the symbol table entry for the main program identifier.
     */
     setProgramId(entry: SymTabEntry): void;

    /**
     * @getter
     * @return the symbol table entry for the main program identifier.
     */
    getProgramId(): SymTabEntry;

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
     * Push a symbol table into the stack.
     * @param symTab the symbol table.
     * @return the pushed symbol table.
     */
    push(symTab?: SymTab): SymTab;

    /**
     * Pop a symbol table off the stack.
     */
    pop(): SymTab;

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
