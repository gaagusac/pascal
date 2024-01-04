import {SymTabStack} from "./SymTabStack.ts";
import {SymTabStackImpl} from "./symtabimpl/SymTabStackImpl.ts";
import {SymTabImpl} from "./symtabimpl/SymTabImpl.ts";
import {SymTab} from "./SymTab.ts";
import {SymTabEntry} from "./SymTabEntry.ts";
import {SymTabEntryImpl} from "./symtabimpl/SymTabEntryImpl.ts";

/**
 * <h1>SymTabFactory</h1>
 * <p>A factory for creating objects that implement the symbol table.</p>
 */
export class SymTabFactory {

    /**
     * Create and return a symbol table stack implementation.
     */
    public static createSymTabStack(): SymTabStack {
        return new SymTabStackImpl();
    }

    /**
     * Create and return a symbol table implementation.
     * @param nestingLevel
     */
    public static createSymTab(nestingLevel: number): SymTab {
        return new SymTabImpl(nestingLevel);
    }

   public static createSymTabEntry(name: string, symTab: SymTab): SymTabEntry {
        return new SymTabEntryImpl(name, symTab);
    }
}