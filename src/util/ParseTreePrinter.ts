import {ICode} from "../intermediate/ICode.ts";
import {ICodeNodeImpl} from "../intermediate/icodeimpl/ICodeNodeImpl.ts";
import {ICodeKeyImpl} from "../intermediate/icodeimpl/ICodeKeyImpl.ts";
import {SymTabEntryImpl} from "../intermediate/symtabimpl/SymTabEntryImpl.ts";
import {ICodeNode} from "../intermediate/ICodeNode.ts";


export class ParseTreePrinter {

    private static readonly INDENT_WIDTH = 4;
    private static readonly LINE_WIDTH = 80;

    private length: number;                 // output line length.
    private indent: string;                 // indent spaces.
    private indentation: string;            // indentation of a line.
    private line: string;                   // output line.


    constructor() {
        this.length = 0;
        this.indentation = "";
        this.line = "";

        // The indent is INDENT_WIDTH spaces.
        this.indent = "";
        this.indent += " ".repeat(ParseTreePrinter.INDENT_WIDTH);
    }

    /**
     * Print the intermediate code as a parse tree.
     * @param iCode
     */
    public print(iCode: ICode): void {
        console.log("\n============ INTERMEDIATE CODE ==============\n");

        this.printNode(iCode.getRoot() as ICodeNodeImpl);
        console.log("\n");
    }

    /**
     * Print a parse tree node.
     * @param node the parse tree node.
     * @private
     */
    private printNode(node: ICodeNodeImpl): void {
        // Opening tag
        this.append(this.indentation); this.append("<" + node.toString());

        this.printAttributes(node);
        this.printTypeSpec(node);

        let childNodes = node.getChildren();

        // Print the node's children followed by the closing tag.
        if (childNodes.length !== 0) {
            this.append(">");
            this.printLine();

            this.printChildNodes(childNodes);
            this.append(this.indentation); this.append("</" + node.toString() + ">");
        }

        // No children: Close off the tag
        else {
             this.append(" "); this.append("/>");
        }

        this.printLine();
    }


    /**
     * Print a parse tree node's attributes.
     * @param node the parse tree node.
     * @private
     */
    private printAttributes(node: ICodeNodeImpl): void {
        let saveIndentation = this.indentation;
        this.indentation += this.indent;

        let attributes = node.entrySet();
        attributes.forEach((value, key) => {
            this.printAttribute((key as unknown as ICodeKeyImpl).valueOfKey(), value);
        });

        this.indentation = saveIndentation;
    }

    /**
     * Print a node attribute as key="value"
     * @param keyString the key string
     * @param value the value
     * @private
     */
    private printAttribute(keyString: string, value: any) {
        // If the value is a symbol table entry. use the identifier's name.
        // else just use the value string.
        let isSymTabEntry = value instanceof SymTabEntryImpl;
        let valueString = isSymTabEntry ? (value as SymTabEntryImpl).getName() : value.toString();

        let text = keyString.toLowerCase() + '="' + valueString + '"';
        this.append(" "); this.append(text);

        // Include an identifier's nesting level.
        if (isSymTabEntry) {
            let level = (value as SymTabEntryImpl).getSymTab().getNestingLevel();
            this.printAttribute("LEVEL", level);
        }
    }

    private printChildNodes(childNodes: ICodeNode[]): void {
        let saveIndentation = this.indentation;
        this.indentation += this.indent;

        for (let child of childNodes) {
            this.printNode(child as ICodeNodeImpl);
        }

        this.indentation = saveIndentation;
    }

    /**
     * Print a parse tree node's type specification.
     * @param node the parse tree node.
     * @private
     */
    // @ts-ignore
    private printTypeSpec(node: ICodeNodeImpl) {
    }

    /**
     * Append text to the output line.
     * @param text the text to append.
     * @private
     */
    private append(text: string): void {
        let textLength = text.length;
        let lineBreak = false;

        // Wrap lines that are too long.
        if (this.length + textLength > ParseTreePrinter.LINE_WIDTH) {
            this.printLine();
            this.line += this.indentation;
            this.length = this.indentation.length;
            lineBreak = true;
        }

        // Append the text.
        if (!(lineBreak && text === " ")) {
            this.line += text;
            this.length += textLength;
        }
    }

    /**
     * Print an output line.
     * @private
     */
    private printLine(): void {
        if (this.length > 0) {
            console.log(this.line);
            this.line = "";
            this.length = 0;
        }
    }
}