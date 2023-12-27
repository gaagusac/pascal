import {Source} from "./Source.ts";
import {Token} from "./Token.ts";

/**
 * A language independent framework class. This abstract scanner class
 * will be implemented by a language-specific subclass.
 */
export abstract class Scanner {

    protected source: Source;                   // source
    private _currentToken: Token = <Token>{};   // current token

    /**
     * Constructor
     * @param source - the source to be used with this scanner.
     */
    public constructor(source: Source) {
        this.source = source;
    }

    /**
     * @return the current token
     */
    public currentToken(): Token {
        return this._currentToken;
    }

    /**
     * Return next token from the source.
     * @return the next token.
     * @throws {Error} if an error occurred.
     */
    public nextToken(): Token {
        this._currentToken = this.extractToken();
        return this._currentToken;
    }

    /**
     * Do the actual work of extracting and returning the next token from
     * the source. Implemented by scanner subclasses.
     * @return the next token.
     * @throws {Error} if an error occurred.
     * @protected
     */
    protected abstract extractToken(): Token;


    /**
     * Call the source's currentChar() method.
     * @return the current character from the source.
     * @throws {Error} if an error occurred.
     */
    public currentChar(): string {
        return this.source.currentChar();
    }

    /**
     * Call the source's nextChar() method.
     * @return the next character from the source.
     * @throws {Error} if an error occurred.
     */
    public nextChar(): string {
        return this.source.nextChar();
    }

}