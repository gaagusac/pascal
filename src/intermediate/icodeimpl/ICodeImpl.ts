import {ICode} from "../ICode.ts";
import {ICodeNode} from "../ICodeNode.ts";


/**
 * <h1>ICodeImpl</h1>
 * <p>An implementation of the intermediate code as a parse tree.</p>
 */
export class ICodeImpl implements ICode {

    private root: ICodeNode | undefined;        // root node

    /**
     * Set and return the root node.
     * @param node the node to set as the root.
     * @return the root node.
     */
    setRoot(node: ICodeNode): ICodeNode {
        this.root = node;
        return this.root;
    }

    /**
     * Get the root node.
     * @return the root node.
     */
    getRoot(): ICodeNode | undefined {
        return this.root;
    }
}