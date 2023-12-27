import {Backend} from "./Backend.ts";
import {CodeGenerator} from "./compiler/CodeGenerator.ts";
import {Executor} from "./interpreter/Executor.ts";

export class BackendFactory {

    /**
     * Create a compiler or an interpreter backend component.
     * @param operation either "compile" or "execute".
     * @return a compiler or an interpreter backend component.
     * @throws {Error} if an error occurred.
     */
    public static createBackend(operation: string): Backend {
        if (operation.toLowerCase() === "compile") {
            return new CodeGenerator();
        }
        else if (operation.toLowerCase() === "execute") {
            return new Executor();
        }
        else {
            throw new Error(`Backend factory: Invalid operation '${operation}'`);
        }
    }
}