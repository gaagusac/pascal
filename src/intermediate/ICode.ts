import {ICodeNode} from "./ICodeNode.ts";

/**
 * <h1>ICode</h1>
 * <p>The framework interface that represents the intermediate code.</p>
 */
export interface ICode {

    /**
     * Set and return the root node.
     * @param node the node to set as the root.
     * @return the root node.
     */
    setRoot(node: ICodeNode): ICodeNode;

    /**
     * Get the root node.
     * @return the root node.
     */
    getRoot(): ICodeNode | undefined;
}