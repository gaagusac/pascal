import {TypeSpec} from "../TypeSpec.ts";
import {Predefined} from "../symtabimpl/Predefined.ts";
import {TypeFormImpl} from "./TypeFormImpl.ts";

/**
 * <h1>TypeChecker</h1>
 * <p>Perform type checking.</p>
 */
export class TypeChecker {


    /**
     * Check if a type specification is integer.
     * @param type the type specification to check.
     * @return true if integer, else false.
     */
    public static isInteger(type: TypeSpec): boolean {
        return (type !== undefined) && (type.baseType() === Predefined.integerType);
    }

    /**
     * Check if both type specifications are integer.
     * @param type1 the first type specification to check.
     * @param type2 the second type specification to check.
     */
    public static areBothInteger(type1: TypeSpec, type2: TypeSpec): boolean {
        return TypeChecker.isInteger(type1) && TypeChecker.isInteger(type2);
    }


    /**
     * Check if a type specification is real.
     * @param type the type specification to check.
     * @return true if real, else false.
     */
    public static isReal(type: TypeSpec): boolean {
        return (type !== undefined) && (type.baseType() === Predefined.realType);
    }

    /**
     * CHeck if a type specification is integer or real.
     * @param type
     */
    public static isIntegerOrReal(type: TypeSpec): boolean {
        return TypeChecker.isInteger(type) || TypeChecker.isReal(type);
    }

    /**
     * Check if at least one of two type specifications is real.
     * @param type1
     * @param type2
     */
    public static isAtLeastOneReal(type1: TypeSpec, type2: TypeSpec): boolean {
        return (TypeChecker.isReal(type1) && TypeChecker.isReal(type2)) ||
            (TypeChecker.isReal(type1) && TypeChecker.isInteger(type2)) ||
            (TypeChecker.isInteger(type1) && TypeChecker.isReal(type2));
    }


    /**
     * Check if a type specification is boolean.
     * @param type the type specification to check.
     * @return true if boolean, else false.
     */
    public static isBoolean(type: TypeSpec): boolean {
        return (type !== undefined) && (type.baseType() === Predefined.booleanType);
    }

    /**
     * CHeck if both type specifications are boolean.
     * @param type1 the first type specification to check.
     * @param type2 the second type specification to check.
     * @return true if both are boolean, else false.
     */
    public static areBothBoolean(type1: TypeSpec, type2: TypeSpec): boolean {
        return TypeChecker.isBoolean(type1) && TypeChecker.isBoolean(type2);
    }

    /**
     * Check if a type specification is char.
     * @param type the type specification to check.
     * @return true if char, else false.
     */
    public static isChar(type: TypeSpec): boolean {
        return (type !== undefined) && (type.baseType() === Predefined.charType);
    }


    /**
     * Check if two type specifications are assignment compatible.
     * @param targetValue the target type specification.
     * @param valueType the value type specification.
     * @return true if the value can be assigned to the target, else false.
     */
    public static areAssignmentCompatible(targetType: TypeSpec, valueType: TypeSpec): boolean {
        if ((targetType === undefined) || (valueType === undefined)) {
            return false;
        }

        targetType = targetType.baseType();
        valueType = valueType.baseType();

        let compatible = false;

        // Identical types.
        if (targetType === valueType) {
            compatible = true;
        }

        // real := integer
        else if (TypeChecker.isReal(targetType) && TypeChecker.isInteger(valueType)) {
            compatible = true;
        }

        // string := string
        else {
            compatible = targetType.isPascalString() && valueType.isPascalString();
        }

        return compatible;
    }

    /**
     * Check if two types specifications are comparison compatible.
     * @param type1 the first type specification to check.
     * @param type2 the second type specification to check.
     * @return true it the types can be compared to each other, else false.
     */
    public static areComparisonCompatible(type1: TypeSpec, type2: TypeSpec): boolean {
        if ((type1 === undefined) || (type2 === undefined)) {
            return false;
        }

        type1 = type1.baseType();
        type2 = type2.baseType();
        let form = type1.getForm();

        let compatible = false;

        // Two identical scalar or enumeration types.
        if ((type1 === type2) && ((form === TypeFormImpl.SCALAR) || (form === TypeFormImpl.ENUMERATION))) {
            compatible = true;
        }

        // One integer and one real
        else if (TypeChecker.isAtLeastOneReal(type1, type2)) {
            compatible = true;
        }

        // Two strings.
        else {
            compatible = type1.isPascalString() && type2.isPascalString();
        }

        return compatible;
    }
}