import {ICodeImpl} from "./icodeimpl/ICodeImpl.ts";
import {ICodeNodeType} from "./ICodeNodeType.ts";
import {ICodeNode} from "./ICodeNode.ts";
import {ICodeNodeImpl} from "./icodeimpl/ICodeNodeImpl.ts";

/**
 * <h1>ICodeFactory</h1>
 * <p>A factory for creating objects that implements the intermediate code.</p>
 */
export class ICodeFactory {

    /**
     * Create and return an intermediate code implementation.
     * @return the intermediate code implementation.
     */
    public static createICode() {
        return new ICodeImpl();
    }

    /**
     * Create and return a node implementation.
     * @param type the node type.
     * @return the node implemenation.
     */
    public static createICodeNode(type: ICodeNodeType): ICodeNode {
        return new ICodeNodeImpl(type);
    }
}