import {SymTabStack} from "../intermediate/SymTabStack.ts";
import {SymTabEntry} from "../intermediate/SymTabEntry.ts";
import {SymTabKeyImpl} from "../intermediate/symtabimpl/SymTabKeyImpl.ts";
import {SymTab} from "../intermediate/SymTab.ts";
import {TypeSpec} from "../intermediate/TypeSpec.ts";


export class CrossReferencer {

    /**
     * Print the cross-reference table.
     * @param symTabStack the symbol table stack.
     */
    public print(symTabStack: SymTabStack): void {
        console.log("\n====================== CROSS-REFERENCE TABLE ======================");

        let programId = symTabStack.getProgramId();
        this.printRoutine(programId);
    }

    /**
     * Print a cross-reference table for a routine.
     * @param routineId
     * @private
     */
    private printRoutine(routineId: SymTabEntry): void {
        let definition = routineId.getDefinition();
        console.log(`\n*** ${definition.getText()} ${routineId.getName()} ***`);
        // this.printColumnHeadings();

        // Print the entries in the routine's symbol table.
        let symTab = routineId.getAttribute(SymTabKeyImpl.ROUTINE_SYMTAB) as SymTab;
        let newRecordTypes: TypeSpec[] = [];
        this.printSymTab(symTab, newRecordTypes);

        // Print cross-reference tables for any records defined in the routine.
        // if (newRecordTypes.length > 0) {
        //     this.printRecords(newRecordTypes);
        // }
        //
        // // Print any procedures and functions defined in the routine.
        // let routinesIds = routineId.getAttribute(SymTabKeyImpl.ROUTINE_ROUTINES) as SymTabEntry[];
        // if (routinesIds !== undefined) {
        //     for (let rtnId of routinesIds) {
        //         this.printRoutine(rtnId);
        //     }
        // }
    }

    /**
     * Print column headings.
     * @private
     */
    // private printColumnHeadings(): void {
    //     console.log("\n");
    //     console.log()
    // }

    private printSymTab(symTab: SymTab, recordTypes: TypeSpec[]): void {
        // Loop over the sortedList of symbol table entries.
        let sorted = symTab.sortedEntries();

        for (let entry of sorted) {
            console.log("<>".repeat(30));
            let lineNumbers = entry.getLineNumbers();
            // For each entry, print the identifier name
            // followed by the line numbers.
            console.log("identifier : " + entry.getName());
            console.log("line numbers: " + lineNumbers.join(" "));
            // Print the symbol table entry.
            console.log("<>".repeat(30));
        }

    }

    private printEntry(entry: SymTabEntry, recordTypes: TypeSpec[]): void {
        // TODO
    }
    private printRecords(recordTypes: TypeSpec[]): void {
        // TODO
    }
}