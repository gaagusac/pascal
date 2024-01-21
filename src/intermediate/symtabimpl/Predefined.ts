import {TypeSpec} from "../TypeSpec.ts";
import {SymTabEntry} from "../SymTabEntry.ts";
import {SymTabStack} from "../SymTabStack.ts";
import {TypeFactory} from "../TypeFactory.ts";
import {DefinitionImpl} from "./DefinitionImpl.ts";
import {TypeFormImpl} from "../typeimpl/TypeFormImpl.ts";
import {SymTabKeyImpl} from "./SymTabKeyImpl.ts";
import {TypeKeyImpl} from "../typeimpl/TypeKeyImpl.ts";

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

    /**
     * Initialize a symbol table stack with predefined identifiers.
     * @param symTabStack the symbol table stack to initialize.
     */
    public static initialize(symTabStack: SymTabStack): void {
        Predefined.initializeTypes(symTabStack);
        Predefined.initializeConstants(symTabStack);
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

}