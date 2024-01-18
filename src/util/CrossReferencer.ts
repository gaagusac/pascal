// import {SymTabStack} from "../intermediate/SymTabStack.ts";
// import {SymTabEntry} from "../intermediate/SymTabEntry.ts";
// import {SymTabKeyImpl} from "../intermediate/symtabimpl/SymTabKeyImpl.ts";
// import {SymTab} from "../intermediate/SymTab.ts";
// import {TypeSpec} from "../intermediate/TypeSpec.ts";
//
//
// export class CrossReferencer {
//
//     private static readonly NAME_WIDTH = 16;
//
//     private static readonly NAME_FORMAT = " ".repeat(CrossReferencer.NAME_WIDTH);
//     private static readonly NUMBERS_LABEL      = " Line numbers    ";
//     private static readonly NUMBERS_UNDERLINE =   " ------------    ";
//     private static readonly NUMBER_FORMAT = " %03d";
//
//     private static readonly LABEL_WIDTH = CrossReferencer.NUMBERS_LABEL.length;
//     private static readonly INDENT_WIDTH = CrossReferencer.NAME_WIDTH + CrossReferencer.LABEL_WIDTH;
//
//     private INDENT = " ".repeat(CrossReferencer.INDENT_WIDTH);
//
//     /**
//      * Print the cross-reference table.
//      * @param symTabStack the symbol table stack.
//      */
//     public print(symTabStack: SymTabStack): void {
//         console.log("\n====================== CROSS-REFERENCE TABLE ======================");
//
//         let programId = symTabStack.getProgramId();
//         this.printRoutine(programId);
//     }
//
//     /**
//      * Print a cross-reference table for a routine.
//      * @param routineId
//      * @private
//      */
//     private printRoutine(routineId: SymTabEntry): void {
//         let definition = routineId.getDefinition();
//         console.log(`\n*** ${definition.getText()} ${routineId.getName()} ***`);
//         this.printColumnHeadings();
//
//         // Print the entries in the routine's symbol table.
//         let symTab = routineId.getAttribute(SymTabKeyImpl.ROUTINE_SYMTAB) as SymTab;
//         let newRecordTypes: TypeSpec[] = [];
//         this.printSymTab(symTab, newRecordTypes);
//
//         // Print cross-reference tables for any records defined in the routine.
//         if (newRecordTypes.length > 0) {
//             this.printRecords(newRecordTypes);
//         }
//
//         // Print any procedures and functions defined in the routine.
//         let routinesIds = routineId.getAttribute(SymTabKeyImpl.ROUTINE_ROUTINES) as SymTabEntry[];
//         if (routinesIds !== undefined) {
//             for (let rtnId of routinesIds) {
//                 this.printRoutine(rtnId);
//             }
//         }
//     }
//
//     /**
//      * Print column headings.
//      * @private
//      */
//     private printColumnHeadings(): void {
//         console.log("\n");
//     }
//
//     private printSymTab(symTab: SymTab, recordTypes: TypeSpec[]): void {
//
//     }
//
//     private printRecords(recordTypes: TypeSpec[]): void {
//
//     }
// }