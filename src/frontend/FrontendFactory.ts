import {Source} from "./Source.ts";
import {Parser} from "./Parser.ts";
import {Scanner} from "./Scanner.ts";
import {PascalScanner} from "./pascal/PascalScanner.ts";
import {PascalParserTD} from "./pascal/PascalParserTD.ts";


export class FrontendFactory {

    /**
     * Create a parser
     * @param language the name of the source language (e.g., "Pascal").
     * @param type the type of parser (e.g., "top-down").
     * @param source the source object.
     * @return the parser
     * @throws {Error} if an error occurred.
     */
    public static createParser(language: string, type: string, source:Source): Parser {
        if (language.toLowerCase() === "pascal" && type.toLowerCase() === "top-down") {
            let scanner: Scanner = new PascalScanner(source);
            return new PascalParserTD(scanner as PascalScanner);
        }
        else if (language.toLowerCase() !== "pascal") {
            throw new Error(`Parser factory: Invalid language '${language}'.`);
        }
        else {
            throw new Error(`Parser factory: Invalid type '${type}'.`);
        }
    }
}