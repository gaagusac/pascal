import {ICodeNode} from "../../intermediate/ICodeNode.ts";
import {RuntimeErrorCode} from "./RuntimeErrorCode.ts";
import {Backend} from "../Backend.ts";
import {ICodeKeyImpl} from "../../intermediate/icodeimpl/ICodeKeyImpl.ts";
import {Message} from "../../message/Message.ts";
import {MessageType} from "../../message/MessageType.ts";


export class RuntimeErrorHandler {

    private static readonly MAX_ERRORS = 5;
    private errorCount: number;
    constructor() {
        this.errorCount = 0;    // count of runtime errors.
    }

    public getErrorCount(): number {
        return this.errorCount;
    }

    public flag(node: ICodeNode, errorCode: RuntimeErrorCode, backend: Backend): void {
        // let lineNumber: string | undefined = undefined;

        // look for the ancestor statement node with a line number attribute.
        while ((node !== undefined) && (node.getAttribute(ICodeKeyImpl.LINE) === undefined)) {
            node = node.getParent()!;
        }

        // Notify the interpreter's listeners.
        backend.sendMessage(new Message(MessageType.RUNTIME_ERROR, {
            error_code: errorCode.toString(),
            error_line: Number(node.getAttribute(ICodeKeyImpl.LINE)),
        }));

        if (++this.errorCount > RuntimeErrorHandler.MAX_ERRORS) {
            throw new Error("******* ABORTED AFTER TOO MANY RUNTIME ERRORS.");
        }
    }
}