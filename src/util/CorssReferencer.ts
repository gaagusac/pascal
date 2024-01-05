import {SymTab} from "../intermediate/SymTab.ts";
import {SymTabStack} from "../intermediate/SymTabStack.ts";


export function printSymbolTable(symTabStack: SymTabStack) {
    console.log("\n==================== CROSS-REFERENCE TABLE ========================");
    let st = symTabStack.getLocalSymTab();
    if (st !== undefined) {
        printSymTab(st);
    } else {
        console.log("No local symbol table.");
    }
}

function printSymTab(symTab: SymTab) {
    let sorted = symTab.sortedEntries();
    let table: { [key: string]: string } = {};
    // Fill up the table
    for (let entry of sorted) {
        let lineNumbers = entry.getLineNumbers().map(item => {
            return item.toString().padStart(4, '0');
        }).join(" ");
        table[entry.getName()] = lineNumbers;
    }
    console.table(table);
}