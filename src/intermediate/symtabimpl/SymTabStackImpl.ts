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

    private currentNestingLevel: number;                   // current scope nesting level.
    private programId: SymTabEntry = undefined!;           // entry for the main program id.
    private _symTabs: SymTab[];                            // the symbol table stack data structure. An array.

    /**
     * @constructor
     */
    constructor() {
        this.currentNestingLevel = 0;
        this._symTabs = [];
        this.add(SymTabFactory.createSymTab(this.currentNestingLevel));
    }


    /**
     * @setter
     * @param id the symbol table entry for the main program identifier.
     */
    setProgramId(id: SymTabEntry): void {
        this.programId = id;
    }

    /**
     * @getter
     * @return the symbol table entry for the main program identifier.
     */
    getProgramId(): SymTabEntry {
        return this.programId;
    }

    /**
     * Push a symbol table onto the symbol table stack.
     * @param symTab the symbol table to push.
     * @return the pushed symbol table.
     */
    push(symTab?: SymTab | undefined): SymTab {
        if (symTab === undefined) {
            let symTab = SymTabFactory.createSymTab(++this.currentNestingLevel);
            this.add(symTab);

            return symTab;
        }
        ++this.currentNestingLevel;
        this.add(symTab!);

        return symTab!;
    }

    /**
     * Pop a symbol table off the symbol table stack.
     * @return the popped symbol table.
     */
    pop(): SymTab {
        let symTab = this.get(this.currentNestingLevel);
        this._symTabs.splice(this.currentNestingLevel--, 1);

        return symTab;
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
        let foundEntry: SymTabEntry = undefined!;

        // Search the current and enclosing scopes.
        for (let i = this.currentNestingLevel; (i >= 0) && (foundEntry === undefined); --i) {
            foundEntry = this.get(i).lookup(name)!;
        }

        return foundEntry;
    }

    add(symTab: SymTab): void {
        this._symTabs.push(symTab);
    }

    get(n: number): SymTab {
        return this._symTabs[n];
    }
}