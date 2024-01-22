import {ICodeNodeType} from "./ICodeNodeType.ts";
import {ICodeKey} from "./ICodeKey.ts";
import {TypeSpec} from "./TypeSpec.ts";

/**
 * <h1>ICodeNode</h1>
 * <p>The interface for a node of the intermediate code.</p>
 */
export interface ICodeNode {

    /**
     * @getter
     * @return the node type.
     */
    getType(): ICodeNodeType;

    /**
     * Return the parent of this node.
     * @return the parent node.
     */
    getParent(): ICodeNode | undefined;

    /**
     * Add a child node.
     * @param node the child node.
     * @return the child node.
     */
    addChild(node: ICodeNode): ICodeNode;

    /**
     * Return the list of this node's children.
     * @return the list of children.
     */
    getChildren(): ICodeNode[];

    /**
     * Set a node attribute.
     * @param key the attribute key.
     * @param value the attribute value.
     */
    setAttribute(key: ICodeKey, value: any): void;

    /**
     * Get the value of a node attribute.
     * @param key the attribute key.
     * @return the attribute value.
     */
    getAttribute(key: ICodeKey): any;

    /**
     * Make a copy of this node.
     * @return the copy.
     */
    copy(): ICodeNode;

    /**
     * Set the type specification of this node.
     * @param typeSpec the type specification to set.
     */
    setTypeSpec(typeSpec: TypeSpec): void;

    /**
     * Return the type specification of this node.
     * @return the type specification.
     */
    getTypeSpec(): TypeSpec;
}