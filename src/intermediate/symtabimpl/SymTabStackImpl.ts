import {SymTab} from "../SymTab.ts";
import { SymTabEntry } from "../SymTabEntry.ts";
import {SymTabFactory} from "../SymTabFactory.ts";
import {SymTabStack} from "../SymTabStack.ts";


interface ArrayList<T> {
    add(symTab: T): void;
    get(n: number): T;
}

/**
 * <h1>SymTabStackImpl</p>
 * <p>An implementation of the symbol table stack.</p>
 */
export class SymTabStackImpl implements ArrayList<SymTab>, SymTabStack {

    private currentNestingLevel: number;      // current scope nesting level.
    private readonly _symTabs: SymTab[];               // the symbol table stack data structure. An array.

    /**
     * @constructor
     */
    constructor() {
        this.currentNestingLevel = 0;
        this.add(SymTabFactory.createSymTab(this.currentNestingLevel));
        this._symTabs = [];
    }

    /**
     * @getter
     * @return the current nesting level.
     */
    getCurrentNestingLevel(): number {
        return this.currentNestingLevel;
    }

    /**
     * Return the local symbol table which is at the top of the stack.
     */
    getLocalSymTab(): SymTab {
        return this.get(this.currentNestingLevel);
    }

    /**
     * Create and enter a new entry into the local symbol table.
     * @param name
     */
    enterLocal(name: string): SymTabEntry | undefined {
        return this.get(this.currentNestingLevel)?.enter(name);
    }

    /**
     * Look up an existing symbol table entry in the local symbol table.
     * @param name the name of the entry.
     * @return the entry, or null if it does not exist.
     */
    lookupLocal(name: string): SymTabEntry | undefined {
        return this.get(this.currentNestingLevel)?.lookup(name);
    }

    /**
     * Look up an existing symbol table entry throughout the stack.
     * @param name the entry name.
     * @return the entry, or null if it does not exist.
     */
    lookup(name: string): SymTabEntry | undefined {
        return this.lookupLocal(name);
    }

    add(symTab: SymTab): void {
        this._symTabs.push(symTab);
    }

    get(n: number): SymTab {
        return this._symTabs[n];
    }

}