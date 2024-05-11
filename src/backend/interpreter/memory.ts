import {SymTabEntry} from "../../intermediate/SymTabEntry.ts";
import {SymTab} from "../../intermediate/SymTab.ts";
import {SymTabKeyImpl} from "../../intermediate/symtabimpl/SymTabKeyImpl.ts";
import {DefinitionImpl} from "../../intermediate/symtabimpl/DefinitionImpl.ts";
import {TypeSpec} from "../../intermediate/TypeSpec.ts";
import {TypeFormImpl} from "../../intermediate/typeimpl/TypeFormImpl.ts";
import {TypeKeyImpl} from "../../intermediate/typeimpl/TypeKeyImpl.ts";

/**
 * <h1>RuntimeStack</h1>
 * <p>Interface for the interpreter's runtime stack</p>
 */
export interface RuntimeStack {
    /**
     * @return an array or list of activation records on the stack.
     */
    records(): ActivationRecord[];

    /**
     * Get the top most activation record at a given nesting level.
     * @param nestingLevel the nesting level.
     */
    getTopmost(nestingLevel: number): ActivationRecord;

    /**
     * @return the current nesting level.
     */
    currentNestingLevel(): number;

    /**
     * Pop an activation record off the stack.
     */
    pop(): void;

    /**
     * Push an activation record onto the stack.
     * @param ar the activation record to push.
     */
    push(ar: ActivationRecord): void;
}


/**
 * <h1>ActivationRecord</h1>
 * <p>Interface for the interpreter's runtime activation record.</p>
 */
export interface ActivationRecord {
    /**
     * Getter
     * @return the symbol table entry of the routine's name.
     */
    getRoutineId(): SymTabEntry;

    /**
     * Return the memory cell for the given name from the memory map.
     * @param name
     */
    getCell(name: string): Cell;

    /**
     * @return the list of all names in the memory map.
     */
    getAllNames(): string[];


    /**
     * Getter
     * @return the scope nesting level.
     */
    getNestingLevel(): number;

    /**
     * @return the activation record to which this record is dynamically linked.
     */
    linkedTo(): ActivationRecord;

    /**
     * Make a dynamic link from this activation record to another one.
     * @param ar the activation record to link to.
     * @return the activation record.
     */
    makeLinkTo(ar: ActivationRecord): ActivationRecord;
}

/**
 * <h1>RuntimeDisplay</h1>
 * <p>Interface for the interpreter's runtime display</p>
 */
export interface RuntimeDisplay {
    /**
     * Get the activation record at a given nesting level.
     * @param nestingLevel the nesting level.
     * @return the activation record.
     */
    getActivationRecord(nestingLevel: number): ActivationRecord;

    /**
     * Update the display for a call to a routine at a given nesting level.
     * @param nestingLeve the nesting level.
     * @param ar the activation record for the routine.
     */
    callUpdate(nestingLevel: number, ar: ActivationRecord): void;

    /**
     * Update the display for a return from a routine at a given nesting level.
     * @param nestingLevel the nesting level.
     */
    returnUpdate(nestingLevel: number): void;
}

/**
 * <h1>Cell</h1>
 * <p>Interface for the interpreter's runtime memory cell.</p>
 */
export interface Cell {
    /**
     * Set a new value into the cell.
     * @param value
     */
    setValue(value: any): void;

    /**
     * @return the value in the cell.
     */
    getValue(): any;
}

/**
 * <h1>MemoryMap</h1>
 * <p>Interface for the interpreter's runtime memory map.</p>
 */
export interface MemoryMap {
    /**
     * Return the memory cell with the given name.
     * @param name
     */
    getCell(name: string): Cell;

    /**
     * @return the list of all the names.
     */
    getAllNames(): string[];
}


/**
 * <h1>RuntimeStackImpl</h1>
 * <p>THe interpreter's runtime stack.</p>
 */
export class RuntimeStackImpl implements RuntimeStack {

    private display: RuntimeDisplay; // runtime display
    private _ars: ActivationRecord[];

    /**
     * @constructor
     */
    constructor() {
        this.display = MemoryFactory.createRuntimeDisplay();
        this._ars = [];
    }

    /**
     * @return an array of the activation records on the stack.
     */
    records(): ActivationRecord[] {
        return this._ars;
    }

    /**
     * Get the topmost activation record at a given nesting level.
     * @param nestingLeve
     */
    getTopmost(nestingLevel: number): ActivationRecord {
        return this.display.getActivationRecord(nestingLevel);
    }

    /**
     * @return the current nesting level.
     */
    currentNestingLevel(): number {
        let topIndex = this._ars.length - 1;
        return topIndex >= 0 ? this._ars[topIndex].getNestingLevel() : -1;
    }

    /**
     * Pop an activation record off the stack for a returning routine.
     */
    pop(): void {
        this.display.returnUpdate(this.currentNestingLevel());
        this._ars.splice(this._ars.length - 1);
    }

    /**
     * Push an activation record onto the stack for a routine being called.
     * @param ar the activation record to push.
     */
    push(ar: ActivationRecord): void {
        let nestingLevel = ar.getNestingLevel();

        this._ars.push(ar);
        this.display.callUpdate(nestingLevel, ar);
    }
}

export class ActivationRecordImpl implements ActivationRecord {

    private routineId: SymTabEntry;                 // Symbol table entry of the routine's name.
    private link: ActivationRecord = undefined!;    // dynamic link to the previous record.
    private nestingLevel: number;                   // scope nesting level of this record.
    private memoryMap: MemoryMap;                   // memory map of this stack record.

    /**
     * @constructor
     * @param routineId the symbol table entry of the routine's name.
     */
    constructor(routineId: SymTabEntry) {
        let symTab = routineId.getAttribute(SymTabKeyImpl.ROUTINE_SYMTAB);
        this.routineId = routineId;
        this.nestingLevel = symTab.getNestingLevel();
        this.memoryMap = MemoryFactory.createMemoryMap(symTab);
    }

    /**
     * Getter
     * @return the symbol table entry of the routine's name.
     */
    getRoutineId(): SymTabEntry {
        return this.routineId;
    }

    /**
     * Return the memory cell for the given name from the memory map.
     * @param name the name of the cell.
     * @return the cell.
     */
    getCell(name: string): Cell {
        return this.memoryMap.getCell(name);
    }

    /**
     * @return the list of all the names in the memory map.
     */
    getAllNames(): string[] {
        return this.memoryMap.getAllNames();
    }

    /**
     * Getter
     * @return the scope nesting level.
     */
    getNestingLevel(): number {
        return this.nestingLevel;
    }

    /**
     * @return the activation record to which this record is dynamically linked.
     */
    linkedTo(): ActivationRecord {
        return this.link;
    }

    /**
     * Make a dynamic link from this activation record to another one.
     * @param ar the activation record to link to.
     * @return this activation record.
     */
    makeLinkTo(ar: ActivationRecord): ActivationRecord {
        this.link = ar;
        return this;
    }
}

export class RuntimeDisplayImpl implements RuntimeDisplay {

    private _ars: ActivationRecord[];

    /**
     * @constructor
     */
    constructor() {
        this._ars = [] as ActivationRecord[];
        this._ars.push(undefined!); // dummy element 0 (never used)
    }

    /**
     * Get the activation record at a given nesting level.
     * @param nestingLevel the nesting level.
     * @return the activation record.
     */
    getActivationRecord(nestingLevel: number): ActivationRecord {
        return this._ars[nestingLevel]!;
    }

    /**
     * Update the display for a call to a routine at a given nesting leve.
     * @param nestingLevel the nesting level.
     * @param ar the activation record fot the routine.
     */
    callUpdate(nestingLevel: number, ar: ActivationRecord): void {
        // Next higher nesting level: Append a new element at the top.
        if (nestingLevel >= this._ars.length) {
            this._ars.push(ar);
        }

        // Existing nesting level: Set at the specified level.
        else {
            let prevAr = this._ars[nestingLevel];
            this._ars.splice(nestingLevel, 0, ar.makeLinkTo(prevAr));
        }
    }

    /**
     * update the display for a return from a routine at a given nesting level.
     * @param nestingLevel the nesting level.
     */
    returnUpdate(nestingLevel: number): void {
        let topIndex = this._ars.length - 1;
        let ar = this._ars[nestingLevel]; // AR about to be popped off.
        let prevAr = ar.linkedTo();       // previous AR it points to.

        // Point the element at that nesting level to the
        // previous activation record.
        if (prevAr !== undefined) {
            this._ars.splice(nestingLevel, 0, prevAr);
        }

        // The top element has become undefined, so remove it.
        else if (nestingLevel === topIndex) {
            this._ars.splice(topIndex, 1);
        }
    }
}

export class CellImpl implements Cell {

    private value: any = undefined!;        // value contained in the memory cell.

    /**
     * @constructor
     * @param value the value for the cell.
     */
    constructor(value: any) {
        this.value = value;
    }

    /**
     * Set a new value into the cell.
     * @param value the new value.
     */
    setValue(value: any): void {
        this.value = value;
    }

    /**
     * @return the value in the cell.
     */
    getValue() {
        return this.value;
    }
}

export class MemoryMapImpl implements MemoryMap {

    private _mMap: Map<string, Cell> = new Map<string, Cell>();
    /**
     * @constructor
     * Creates a memory map and allocate its memory cells
     * based on the entries in a symbol table.
     * @param symTab
     */
    constructor(symTab: SymTab) {
        let entries = symTab.sortedEntries();

        // Loop for each entry of the symbol table.
        for (let entry of entries) {
            let defn = entry.getDefinition();

            // Not a VAR parameter: Allocate cells for the date type
            //                      in the map.
            if ((defn === DefinitionImpl.VARIABLE) || (defn === DefinitionImpl.FUNCTION)
                 || (defn === DefinitionImpl.VALUE_PARM) || (defn === DefinitionImpl.FIELD)) {
                let name = entry.getName();
                let type = entry.getTypeSpec();
                this._mMap.set(name, MemoryFactory.createCell(this.allocateCellValue(type)));
            }

            // VAR parameter: Allocate a single cell to hold a reference
            //                in the hashmap.
            else if (defn === DefinitionImpl.VAR_PARM) {
                let name = entry.getName();
                this._mMap.set(name, MemoryFactory.createCell(undefined));
            }
        }
    }

    /**
     * Return the memory cell with the given name.
     * @param name the name.
     * @return the cell.
     */
    public getCell(name: string): Cell {
        return this._mMap.get(name)!;
    }

    /**
     * @return the list of all the names.
     */
    public getAllNames(): string[] {
        return [...this._mMap.keys()];
        // return Array.from( this._mMap.keys() );
    }

    /**
     * Make a allocation for a value of a given data type for a memory cell.
     * @param type the data type.
     * @return the allocation.
     * @private
     */
    private allocateCellValue(type: TypeSpec): any {
        let form = type.getForm();

        switch (form as TypeFormImpl) {

            case TypeFormImpl.ARRAY: {
                return this.allocateArrayCells(type);
            }

            case TypeFormImpl.RECORD: {
                return this.allocateRecordMap(type);
            }

            default: {
                return undefined!; // uninitialized scalar value.
            }
        }
    }

    /**
     * Allocate the memory map an array.
     * @param type the array type.
     * @return the allocation.
     * @private
     */
    private allocateArrayCells(type: TypeSpec): any[] {
        let elmtCount = type.getAttribute(TypeKeyImpl.ARRAY_ELEMENT_COUNT) as number;
        let elmtType = type.getAttribute(TypeKeyImpl.ARRAY_ELEMENT_TYPE) as TypeSpec;
        let allocation = [] as Cell[];

        for (let i = 0; i < elmtCount; ++i) {
            allocation.push(MemoryFactory.createCell(this.allocateCellValue(elmtType)));
        }

        return allocation;
    }

    /**
     * Allocate the memory map for a record.
     * @param type the record type.
     * @return the allocation.
     * @private
     */
    private allocateRecordMap(type: TypeSpec): MemoryMap {
        let symTab = type.getAttribute(TypeKeyImpl.RECORD_SYMTAB) as SymTab;
        let memoryMap = MemoryFactory.createMemoryMap(symTab);

        return memoryMap;
    }
}


/**
 * <h1>MemoryFactory</h1>
 * <p>A factory class that creates runtime components.</p>
 */
export class MemoryFactory {

    /**
     * Create a runtime stack.
     * @return the new runtime stack.
     */
    public static createRuntimeStack(): RuntimeStack {
        return new RuntimeStackImpl();
    }

    /**
     * Create a runtime display.
     * @return the new runtime display.
     */
    public static createRuntimeDisplay(): RuntimeDisplay {
        return new RuntimeDisplayImpl();
    }

    /**
     * Create an activation record for a routine.
     * @param routineId
     */
    public static createActivationRecord(routineId: SymTabEntry): ActivationRecord {
        return new ActivationRecordImpl(routineId);
    }

    /**
     * Create a memory map for a symbol table.
     * @param symTab
     */
    public static createMemoryMap(symTab: SymTab): MemoryMap {
        return new MemoryMapImpl(symTab);
    }

    /**
     * Create a memory cell.
     * @param value the value for the cell.
     * @return the new memory cell.
     */
    public static createCell(value: any): Cell {
        return new CellImpl(value);
    }

}