import {filesArray} from "./SampleFiles.ts";
import {Parser} from "./frontend/Parser.ts";
import {Source} from "./frontend/Source.ts";
import {ICode} from "./intermediate/ICode.ts";
import {Backend} from "./backend/Backend.ts";
import {MessageListener} from "./message/MessageListener.ts";
import {Message} from "./message/Message.ts";
import {MessageType} from "./message/MessageType.ts";
import {FrontendFactory} from "./frontend/FrontendFactory.ts";
import {BackendFactory} from "./backend/BackendFactory.ts";
import {TokenType} from "./frontend/Token.ts";
import {PascalTokenType} from "./frontend/pascal/PascalTokenType.ts";
import {SymTabStack} from "./intermediate/SymTabStack.ts";
import {printSymbolTable} from "./util/CorssReferencer.ts";
import {ParseTreePrinter} from "./util/ParseTreePrinter.ts";


// DOM elements
const sourceList = document.querySelector("#source-file-list") as HTMLSelectElement;
const editorTextArea = document.querySelector("#editor__text-area") as HTMLTextAreaElement;
const processButton = document.querySelector("#processButton") as HTMLButtonElement;

editorTextArea.value = filesArray[0];

sourceList.addEventListener('change', () => {
    editorTextArea.value = filesArray[sourceList.selectedIndex];
});

// const processOption = document.querySelector("input[type='radio'][name='compile_execute']:checked") as HTMLButtonElement;


class Pascal {

    private parser: Parser;       // language-independent parser.
    private source: Source;       // language-independent scanner.
    private iCode: ICode;         // generated intermediate code.
    private symTabStack: SymTabStack;       // generated symbol table.
    private backEnd: Backend;     // backend.


    public constructor(operation: string, code: string) {
        this.source = new Source(code);
        this.source.addMessageListener(new SourceMessageListener());
        this.parser = FrontendFactory.createParser("pascal", "top-down", this.source);
        this.parser.addMessageListener(new ParserMessageListener());
        this.parser.parse();
        this.backEnd = BackendFactory.createBackend(operation);
        this.backEnd.addMessageListener(new BackendMessageListener());
        this.iCode = this.parser.getICode() as ICode;
        this.symTabStack = this.parser.getSymTabStack();

        const xref = document.querySelector("#crossreference__cbox") as HTMLInputElement;
        if (xref.checked) {
            printSymbolTable(this.symTabStack);
        }

        const interForm = document.querySelector("#intermediate__cbox") as HTMLInputElement;
        if (interForm.checked) {
            let treePrinter = new ParseTreePrinter();
            treePrinter.print(this.iCode);
        }
        this.backEnd.process(this.iCode, this.symTabStack);
    }
}

/**
 * Listener for Source messages.
 */
class SourceMessageListener implements MessageListener {

    /**
     * Called by the source whenever it produces a message.
     * @param message the message
     */
    messageReceived(message: Message): void {
        let type = message.getType();
        let body = message.getBody();

        switch (type) {
            case MessageType.SOURCE_LINE: {
                let lineNumber = body.line_number;
                let lineText = body.line_text;
                console.log(`${lineNumber.toString().padStart(3, '0')} ${lineText}`);
                break;
            }
        }
    }

}

/**
 * Listener for Parser messages.
 */
class ParserMessageListener implements MessageListener {

    /**
     * Called by the parser whenever it produces a message.
     * @param message
     */
    messageReceived(message: Message): void {
        let type = message.getType();
        let body = message.getBody();
        const PREFIX_WIDTH = 5;
        switch (type) {
            case MessageType.TOKEN: {
                let tokenLineNumber: number = body.token_line_number;
                let tokenPosition: number = body.token_position;
                let tokenType: TokenType = body.token_type;
                let tokenText: string = body.token_text;
                let tokenValue: any = body.token_value;
                console.log(`>>> ${(tokenType as PascalTokenType).valueOfToken() + " ".repeat(15)} line=${tokenLineNumber.toString().padStart(4, '0')}, pos=${tokenPosition.toString().padStart(3, '0')}. text="${tokenText}"`);
                if (typeof tokenValue === 'string' && tokenValue === "") {
                    console.log(`${" ".repeat(15)}value=""`);
                }
                if (tokenValue === 0) {
                    console.log(`${" ".repeat(15)}value="0"`);
                }
                if (tokenValue) {
                    if (tokenType === PascalTokenType.STRING) {
                        tokenValue = '"' + tokenValue + '"';
                    }
                    console.log(`${" ".repeat(15)}value=${tokenValue.toString()}`);
                }
                break;
            }
            case MessageType.SYNTAX_ERROR: {

                let position: number = body.position;
                let tokenText: string = body.text;
                let errorMessage: string = body.error_code;

                let spaceCount = PREFIX_WIDTH + position;
                let flagBuffer = "";

                // Spaces up the current position
                flagBuffer += " ".repeat(spaceCount-1);
                // A pointer to the error followed by the error message.
                flagBuffer += "^\n*** ";
                flagBuffer += errorMessage;

                if (tokenText) {
                    flagBuffer += ' [at "';
                    flagBuffer += tokenText;
                    flagBuffer += '"]';
                }

                console.log(flagBuffer);
                break;
            }
            case MessageType.PARSER_SUMMARY: {
                let statementCount = body.line_number;
                let parserErrorCount = body.parser_error_count;
                let elapsedTime = body.elapsed_time;
                console.log(`${statementCount.toString().padStart(20, ' ')} source lines.`);
                console.log(`${parserErrorCount.toString().padStart(20, ' ')} syntax errors.`);
                console.log(`${elapsedTime.toFixed(4).toString().padStart(20, ' ')} seconds total parsing time`);
                console.log("\n");
                break;
            }
        }
    }

}


/**
 * listener for Backend messages.
 */
class BackendMessageListener implements MessageListener {

    /**
     * Called by the back end whenever it produces a message.
     * @param message the message.
     */
    private firstOutputMessage: boolean = true;
    messageReceived(message: Message): void {
        let type = message.getType();
        let body = message.getBody();
        switch (type) {
            case MessageType.ASSIGN: {
                if (this.firstOutputMessage) {
                    console.log("\n================== OUTPUT =====================");
                    this.firstOutputMessage = false;
                }

                let lineNumber = body.line_number;
                let variableName = body.variable_name;
                let value = body.value;

                console.log(`>>> LINE: ${lineNumber.toString().padStart(4, "0")}: ${variableName} = ${value}`);
                break;
            }
            case MessageType.RUNTIME_ERROR: {
                let errorMessage = body.error_code;
                let error_line = body.error_line;

                let errMsg = "*** RUNTIME ERROR";
                if (error_line !== undefined) {
                    errMsg += ` AT LINE ${error_line.toString().padStart(4, "0")}`;
                }
                errMsg += `: ${errorMessage}`;
                console.log(errMsg);

                break;
            }
            case MessageType.INTERPRETER_SUMMARY: {
                let executionCount = body.execution_count;
                let runtimeErrors = body.runtime_errors;
                let elapsedTime = body.elapsed_time;
                console.log(`${executionCount.toString().padStart(20, ' ')} statements executed.`);
                console.log(`${runtimeErrors.toString().padStart(20, ' ')} runtime errors.`);
                console.log(`${elapsedTime.toFixed(4).toString().padStart(20, ' ')} seconds total execution time.`);
                console.log("\n");
                break;
            }
            case MessageType.COMPILER_SUMMARY: {
                let instructionCount = body.instruction_count;
                let elapsedTime = body.elapsed_time;
                console.log(`${instructionCount.toString().padStart(20, ' ')} statements executed.`);
                console.log(`${elapsedTime.toFixed(4).toString().padStart(20, ' ')} seconds total execution time.`);
                console.log("\n");
                break;
            }
        }
    }

}

processButton.addEventListener('click', () => {
    console.clear();
    const operation = document.querySelector("input[type='radio'][name='compile_execute']:checked") as HTMLButtonElement;
    const sourceCode = editorTextArea.value;
    let PascalParser = new Pascal(operation.value, sourceCode);
});