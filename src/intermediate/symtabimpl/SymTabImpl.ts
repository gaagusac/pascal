import {SymTab} from "../SymTab.ts";
import {SymTabEntry} from "../SymTabEntry.ts";
import {SymTabFactory} from "../SymTabFactory.ts";


interface HashMap<K, T> {
    set(name: K, value: T): void;
    get(name: K): T | undefined;
}

export class SymTabImpl implements SymTab, HashMap<string, SymTabEntry>{

    private nestingLevel: number;
    private readonly _entries: Map<string, SymTabEntry>;
    /**
     * @constructor
     * @apram nestingLevel the nesting level of this symbol table.
     */
    constructor(nestingLevel: number) {
        this.nestingLevel =  nestingLevel;
        this._entries = new Map<string, SymTabEntry>();
    }

    /**
     * Adds a new entry to the entries map.
     * @param key the key of the entry.
     * @param value the value of the entry.
     */
    set(name: string, value: SymTabEntry): void {
        this._entries.set(name, value);
    }

    /**
     * Gets and entry of the entries map.
     * @param key the key of the entry.
     */
    get(name: string): SymTabEntry | undefined {
        return this._entries?.get(name);
    }

    /**
     * @getter
     * @return the scope nesting level of this entry.
     */
    getNestingLevel(): number {
        return this.nestingLevel;
    }

    /**
     * Create and enter a new entry into the symbol table.
     * @param name the name of the entry.
     * @return the new entry.
     */
    enter(name: string): SymTabEntry {
        let entry = SymTabFactory.createSymTabEntry(name, this as SymTab);
        this.set(name, entry);

        return entry;
    }

    /**
     * Look up an existing symbol table entry.
     * @param name the name of the entry.
     * @return the entry, or null if it does not exist.
     */
    lookup(name: string): SymTabEntry | undefined {
        return this._entries.get(name);
    }

    /**
     * @return a list of symbol table entries sorted by name.
     */
    sortedEntries(): SymTabEntry[] {
        let sortedKeys = [...this._entries.keys()].sort();
        let sortedEntries: SymTabEntry[] = [];
        for (let key of sortedKeys) {
            sortedEntries.push(this._entries.get(key) as SymTabEntry);
        }
        return sortedEntries;
    }
}