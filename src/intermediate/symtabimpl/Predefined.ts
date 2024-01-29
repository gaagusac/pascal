import {TypeSpec} from "../TypeSpec.ts";
import {SymTabEntry} from "../SymTabEntry.ts";
import {SymTabStack} from "../SymTabStack.ts";
import {TypeFactory} from "../TypeFactory.ts";
import {DefinitionImpl} from "./DefinitionImpl.ts";
import {TypeFormImpl} from "../typeimpl/TypeFormImpl.ts";
import {SymTabKeyImpl} from "./SymTabKeyImpl.ts";
import {TypeKeyImpl} from "../typeimpl/TypeKeyImpl.ts";
import {Definition} from "../Definition.ts";
import {RoutineCode} from "../RoutineCode.ts";
import {RoutineCodeImpl} from "../typeimpl/RoutineCodeImpl.ts";

/**
 * <h1>Predefined</h1>
 * <p>Enter the predefined Pascal types, identifiers, and constants into the symbol table.</p>
 */
export class Predefined {

    // predefined types.
    public static integerType: TypeSpec;
    public static realType: TypeSpec;
    public static booleanType: TypeSpec;
    public static charType: TypeSpec;
    public static undefinedType: TypeSpec;

    // predefined identifiers
    public static integerId: SymTabEntry;
    public static realId: SymTabEntry;
    public static booleanId: SymTabEntry;
    public static charId: SymTabEntry;
    public static falseId: SymTabEntry;
    public static trueId: SymTabEntry;
    public static readId: SymTabEntry;
    public static readlnId: SymTabEntry;
    public static writeId: SymTabEntry;
    public static writelnId: SymTabEntry;
    public static absId: SymTabEntry;
    public static arctanId: SymTabEntry;
    public static chrId: SymTabEntry;
    public static cosId: SymTabEntry;
    public static eofId: SymTabEntry;
    public static eolnId: SymTabEntry;
    public static expId: SymTabEntry;
    public static lnId: SymTabEntry;
    public static oddId: SymTabEntry;
    public static ordId: SymTabEntry;
    public static predId: SymTabEntry;
    public static roundId: SymTabEntry;
    public static sinId: SymTabEntry;
    public static sqrId: SymTabEntry;
    public static sqrtId: SymTabEntry;
    public static succId: SymTabEntry;
    public static truncId: SymTabEntry;


    /**
     * Initialize a symbol table stack with predefined identifiers.
     * @param symTabStack the symbol table stack to initialize.
     */
    public static initialize(symTabStack: SymTabStack): void {
        Predefined.initializeTypes(symTabStack);
        Predefined.initializeConstants(symTabStack);
        Predefined.initializeStandardRoutines(symTabStack);
    }

    /**
     * Initialize the predefined types.
     * @param symTabStack the symbol table stack to initialize.
     * @private
     */
    private static initializeTypes(symTabStack: SymTabStack): void {

        // Type integer.
        Predefined.integerId = symTabStack.enterLocal("integer")!;
        Predefined.integerType = TypeFactory.createType(TypeFormImpl.SCALAR);
        Predefined.integerType.setIdentifier(Predefined.integerId);
        Predefined.integerId.setDefinition(DefinitionImpl.TYPE);
        Predefined.integerId.setTypeSpec(Predefined.integerType);

        // Type real
        Predefined.realId = symTabStack.enterLocal("real")!;
        Predefined.realType = TypeFactory.createType(TypeFormImpl.SCALAR);
        Predefined.realType.setIdentifier(Predefined.realId);
        Predefined.realId.setDefinition(DefinitionImpl.TYPE);
        Predefined.realId.setTypeSpec(Predefined.realType);

        // Type boolean
        Predefined.booleanId = symTabStack.enterLocal("boolean")!;
        Predefined.booleanType = TypeFactory.createType(TypeFormImpl.ENUMERATION);
        Predefined.booleanType.setIdentifier(Predefined.booleanId);
        Predefined.booleanId.setDefinition(DefinitionImpl.TYPE);
        Predefined.booleanId.setTypeSpec(Predefined.booleanType);

        // Type char
        Predefined.charId = symTabStack.enterLocal("char")!;
        Predefined.charType = TypeFactory.createType(TypeFormImpl.SCALAR);
        Predefined.charType.setIdentifier(Predefined.charId);
        Predefined.charId.setDefinition(DefinitionImpl.TYPE);
        Predefined.charId.setTypeSpec(Predefined.charType);

        // Undefined type
        Predefined.undefinedType = TypeFactory.createType(TypeFormImpl.SCALAR);

    }

    /**
     * Initialize the predefined constant.
     * @param symTabStack the symbol table stack to initialize.
     * @private
     */
    private static initializeConstants(symTabStack: SymTabStack): void {
        // Boolean enumeration constant false.
        Predefined.falseId = symTabStack.enterLocal("false")!;
        Predefined.falseId.setDefinition(DefinitionImpl.ENUMERATION_CONSNTANT);
        Predefined.falseId.setTypeSpec(Predefined.booleanType);
        Predefined.falseId.setAttribute(SymTabKeyImpl.CONSTANT_VALUE, Number(0));

        // Boolean enumeration constant true.
        Predefined.trueId = symTabStack.enterLocal("true")!;
        Predefined.trueId.setDefinition(DefinitionImpl.ENUMERATION_CONSNTANT);
        Predefined.trueId.setTypeSpec(Predefined.booleanType);
        Predefined.trueId.setAttribute(SymTabKeyImpl.CONSTANT_VALUE, Number(1));

        // Add false and true to the boolean enumeration type.
        let constants: SymTabEntry[] = [];
        constants.push(Predefined.falseId);
        constants.push(Predefined.realId);
        Predefined.booleanType.setAttribute(TypeKeyImpl.ENUMERATION_CONSTANTS, constants);
    }

    /**
     * Initialize the standard procedures and functions.
     * @param symTabStack the symbol table stack to initialize.
     * @private
     */
    private static initializeStandardRoutines(symTabStack: SymTabStack): void {
        Predefined.readId      = Predefined.enterStandard(symTabStack, DefinitionImpl.PROCEDURE, "read", RoutineCodeImpl.READ);
        Predefined.readlnId    = Predefined.enterStandard(symTabStack, DefinitionImpl.PROCEDURE, "readln", RoutineCodeImpl.READLN);
        Predefined.writeId     = Predefined.enterStandard(symTabStack, DefinitionImpl.PROCEDURE, "write", RoutineCodeImpl.WRITE);
        Predefined.writelnId      = Predefined.enterStandard(symTabStack, DefinitionImpl.PROCEDURE, "writeln", RoutineCodeImpl.WRITELN);

        Predefined.absId      = Predefined.enterStandard(symTabStack, DefinitionImpl.PROCEDURE, "abs", RoutineCodeImpl.WRITELN);
        Predefined.arctanId      = Predefined.enterStandard(symTabStack, DefinitionImpl.PROCEDURE, "arctan", RoutineCodeImpl.ARCTAN);
        Predefined.chrId      = Predefined.enterStandard(symTabStack, DefinitionImpl.PROCEDURE, "chr", RoutineCodeImpl.CHR);
        Predefined.cosId      = Predefined.enterStandard(symTabStack, DefinitionImpl.PROCEDURE, "cos", RoutineCodeImpl.COS);
        Predefined.eofId      = Predefined.enterStandard(symTabStack, DefinitionImpl.PROCEDURE, "eof", RoutineCodeImpl.EOF);
        Predefined.eolnId      = Predefined.enterStandard(symTabStack, DefinitionImpl.PROCEDURE, "eoln", RoutineCodeImpl.EOLN);
        Predefined.expId      = Predefined.enterStandard(symTabStack, DefinitionImpl.PROCEDURE, "exp", RoutineCodeImpl.EXP);
        Predefined.lnId      = Predefined.enterStandard(symTabStack, DefinitionImpl.PROCEDURE, "ln", RoutineCodeImpl.LN);
        Predefined.oddId      = Predefined.enterStandard(symTabStack, DefinitionImpl.PROCEDURE, "odd", RoutineCodeImpl.ODD);
        Predefined.ordId      = Predefined.enterStandard(symTabStack, DefinitionImpl.PROCEDURE, "ord", RoutineCodeImpl.ORD);
        Predefined.predId      = Predefined.enterStandard(symTabStack, DefinitionImpl.PROCEDURE, "pred", RoutineCodeImpl.PRED);
        Predefined.roundId      = Predefined.enterStandard(symTabStack, DefinitionImpl.PROCEDURE, "round", RoutineCodeImpl.ROUND);
        Predefined.sinId      = Predefined.enterStandard(symTabStack, DefinitionImpl.PROCEDURE, "sin", RoutineCodeImpl.SIN);
        Predefined.sqrId      = Predefined.enterStandard(symTabStack, DefinitionImpl.PROCEDURE, "sqr", RoutineCodeImpl.SQR);
        Predefined.sqrtId      = Predefined.enterStandard(symTabStack, DefinitionImpl.PROCEDURE, "sqrt", RoutineCodeImpl.SQRT);
        Predefined.succId      = Predefined.enterStandard(symTabStack, DefinitionImpl.PROCEDURE, "succ", RoutineCodeImpl.SUCC);
        Predefined.truncId      = Predefined.enterStandard(symTabStack, DefinitionImpl.PROCEDURE, "trunc", RoutineCodeImpl.TRUNC);
    }

    /**
     * Enter a standard procedure or function into the symbol table stack.
     * @param symTabStack the symbol table stack to initialize.
     * @param defn either PROCEDURE or FUNCTION.
     * @param name the procedure or function name.
     * @param routineCdoe the code of the procedure or function.
     * @private
     */
    private static enterStandard(symTabStack: SymTabStack,
                                 defn: Definition,
                                 name: string,
                                 routineCdoe: RoutineCode): SymTabEntry {
        let procId = symTabStack.enterLocal(name);
        procId?.setDefinition(defn);
        procId?.setAttribute(SymTabKeyImpl.ROUTINE_CODE, routineCdoe);

        return procId!;
    }

}