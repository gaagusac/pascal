import {ICodeNode} from "../ICodeNode.ts";
import {ICodeKey} from "../ICodeKey.ts";
import { ICodeNodeType } from "../ICodeNodeType.ts";
import {ICodeFactory} from "../ICodeFactory.ts";

interface ICodeNodeImplArrayList<K, T> {
    put(key: K, value: T): void;

    get(key: K): T;
}

export class ICodeNodeImpl implements ICodeNode, ICodeNodeImplArrayList<ICodeKey, any> {


    private type: ICodeNodeType;                // node type.
    private parent: ICodeNode | undefined;                  // parent node.
    private children: ICodeNode[];
    private attributes: Map<ICodeKey, any>;


    /**
     * @constructor
     * @param type the node type whose name will be the name of this node.
     */
    constructor(type: ICodeNodeType) {
        this.type = type;
        this.children = [];
        this.parent = undefined;
        this.attributes = new Map<ICodeKey, any>();
    }

    put(key: ICodeKey, value: any): void {
        this.attributes.set(key, value);
    }
    get(key: ICodeKey): any {
        return this.attributes.get(key);
    }

    /**
     * @getter
     * @return the node type.
     */
    getType(): ICodeNodeType {
        return this.type;
    }

    /**
     * Return the parent of this node.
     * @return the parent node.
     */
    getParent(): ICodeNode | undefined {
        return this.parent;
    }

    /**
     * Add a child node.
     * @param node the child node. not added if undefined.
     * @return the child node.
     */
    addChild(node: ICodeNode): ICodeNode {
        if (node !== undefined) {
            this.children.push(node);
            (node as unknown as ICodeNodeImpl).parent = this;
        }

        return node;
    }

    /**
     * Return a list of this node's children.
     * @return the list of children.
     */
    getChildren(): ICodeNode[] {
        return this.children;
    }

    /**
     * Set a node attribute.
     * @param key the attribute key.
     * @param value the attribute value
     */
    setAttribute(key: ICodeKey, value: any): void {
        this.put(key, value);
    }

    /**
     * Get the value of a node attribute.
     * @param key the attribute key.
     * @return the attribute value.
     */
    getAttribute(key: ICodeKey): any {
        return this.get(key);
    }

    /**
     * Make a copy of this node.
     * @return the copy.
     */
    copy(): ICodeNode {
        // Create a copy with the same type.
        let theCopy = ICodeFactory.createICodeNode(this.type);
        this.attributes.forEach((value, key) => {
            (theCopy as ICodeNodeImpl).put(key, value);
        });

        return theCopy;
    }

}
