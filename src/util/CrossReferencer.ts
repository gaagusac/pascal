import {SymTabStack} from "../intermediate/SymTabStack.ts";
import {SymTabEntry} from "../intermediate/SymTabEntry.ts";
import {SymTabKeyImpl} from "../intermediate/symtabimpl/SymTabKeyImpl.ts";
import {SymTab} from "../intermediate/SymTab.ts";
import {TypeSpec} from "../intermediate/TypeSpec.ts";
import {DefinitionImpl} from "../intermediate/symtabimpl/DefinitionImpl.ts";
import {TypeFormImpl} from "../intermediate/typeimpl/TypeFormImpl.ts";
import {TypeKeyImpl} from "../intermediate/typeimpl/TypeKeyImpl.ts";


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
        if (newRecordTypes.length > 0) {
            this.printRecords(newRecordTypes);
        }

        // Print any procedures and functions defined in the routine.
        let routinesIds = routineId.getAttribute(SymTabKeyImpl.ROUTINE_ROUTINES) as SymTabEntry[];
        if (routinesIds !== undefined) {
            for (let rtnId of routinesIds) {
                this.printRoutine(rtnId);
            }
        }
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
            this.printEntry(entry, recordTypes);
            console.log("<>".repeat(30));
        }

    }

    /**
     * Print a symbol table entry.
     * @param entry the symbol table entry.
     * @param recordTypes the list to fill with RECORD type specifications.
     * @private
     */
    private printEntry(entry: SymTabEntry, recordTypes: TypeSpec[]): void {
        let definition = entry.getDefinition();
        let nestingLevel = entry.getSymTab().getNestingLevel();
        console.log("Defined as : " + definition.getText());
        console.log("Scope nesting level: " + nestingLevel);

       // print the type specification.
       let type = entry.getTypeSpec();
       this.printType(type);

       switch (definition as DefinitionImpl) {

           case DefinitionImpl.CONSTANT: {
               let value = entry.getAttribute(SymTabKeyImpl.CONSTANT_VALUE);
               console.log("value = " + this.toString(value));

               // print the type details only if the type is unnamed.
               if (type.getIdentifier() === undefined) {
                    this.printTypeDetail(type, recordTypes);
               }

               break;
           }

           case DefinitionImpl.ENUMERATION_CONSNTANT: {
               let value = entry.getAttribute(SymTabKeyImpl.CONSTANT_VALUE);
               console.log("value = " + this.toString(value));

               break;
           }

           case DefinitionImpl.TYPE: {

               // Print the type details only when the type if first defined.
               if (entry === type.getIdentifier()) {
                   this.printTypeDetail(type, recordTypes);
               }

               break;
           }

           case DefinitionImpl.VARIABLE: {

               // Print the type details only if the type is unnamed
               if (type.getIdentifier() === undefined) {
                   this.printTypeDetail(type, recordTypes);
               }

               break;
           }
       }

    }

    /**
     * Print a type specification.
     * @param type the type specification.
     * @private
     */
    private printType(type: TypeSpec): void {
        if (type !== undefined) {
            let form = type.getForm();
            let typeId = type.getIdentifier();
            let typeName = typeId !== undefined ? typeId.getName() : "<unnamed>";

            console.log(`Type form = ${(form as TypeFormImpl).toString()}, Type id = ${typeName}`);
        }
    }

    private printTypeDetail(type: TypeSpec, recordTypes: TypeSpec[]): void {
        let form = type.getForm();

        switch (form as TypeFormImpl) {

            case TypeFormImpl.ENUMERATION: {
                let constantIds = type.getAttribute(TypeKeyImpl.ENUMERATION_CONSTANTS) as SymTabEntry[];
                console.log("--- Enumeration constants ---");

                // Print each enumeration constant and its value.
                for (let constantId of constantIds) {
                    let name = constantId.getName();
                    let value = constantId.getAttribute(SymTabKeyImpl.CONSTANT_VALUE);

                    console.log(`${name} = ${value}`);
                }

                break;
            }

            case TypeFormImpl.SUBRANGE: {
                let minValue = type.getAttribute(TypeKeyImpl.SUBRANGE_MIN_VALUE);
                let maxValue = type.getAttribute(TypeKeyImpl.SUBRANGE_MAX_VALUE);
                let baseTypeSpec = type.getAttribute(TypeKeyImpl.SUBRANGE_BASE_TYPE) as TypeSpec;

                console.log("--- Base Type ---");
                this.printType(baseTypeSpec);

                // Print the base type details only if the type is unnamed.
                if (baseTypeSpec.getIdentifier() === undefined) {
                    this.printTypeDetail(baseTypeSpec, recordTypes);
                }

                console.log(`Range = ${this.toString(minValue)}..${this.toString(maxValue)}`);

                break;
            }

            case TypeFormImpl.ARRAY: {
                let indexType = type.getAttribute(TypeKeyImpl.ARRAY_INDEX_TYPE);
                let elementType = type.getAttribute(TypeKeyImpl.ARRAY_ELEMENT_TYPE);
                let count = type.getAttribute(TypeKeyImpl.ARRAY_ELEMENT_COUNT) as number;

                console.log("--- INDEX TYPE ---");
                this.printType(indexType);

                // Print the index type details only if the type is unnamed.
                if (indexType.getIdentifier() === undefined) {
                    this.printTypeDetail(indexType, recordTypes);
                }

                console.log("--- ELEMENT TYPE ---");
                this.printType(elementType);
                console.log(`${count} elements`);

                // Print the element type details only if the type is unnamed.
                if (elementType.getIdentifier() === undefined) {
                    this.printTypeDetail(elementType, recordTypes);
                }

                break;
            }

            case TypeFormImpl.RECORD: {
                recordTypes.push(type);
                break;
            }
        }
    }

    /**
     * Print cross-reference tables for records defined in the routine.
     * @param recordTypes the list to fill with RECORD type specification.
     * @private
     */
    private printRecords(recordTypes: TypeSpec[]): void {
        for (let recordType of recordTypes) {
            let recordId = recordType.getIdentifier();
            let name = recordId !== undefined ? recordId.getName() : "<unnamed>";

            console.log(`\n---RECORD ${name} ---`);

            // Print the entries in the record's symbol table.
            let symTab = recordType.getAttribute(TypeKeyImpl.RECORD_SYMTAB) as SymTab;
            let newRecordTypes: TypeSpec[] = [];
            this.printSymTab(symTab, newRecordTypes);

            // Print the cross-reference tables for any records.
            if (newRecordTypes.length > 0) {
                this.printRecords(newRecordTypes);
            }
        }
    }

    /**
     * Convert a value to a string.
     * @param value the value
     * @return the string.
     * @private
     */
    private toString(value: any): string {
        return typeof value === "string" ? "'" + String(value) + "'" : value.toString();
    }
}