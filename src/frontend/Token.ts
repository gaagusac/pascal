import {Source} from "./Source.ts";



interface TokenType {
    _tokenTypeMarker: symbol;
}

/**
 * <h1>Token</h1>
 * <p>The framework class that represents a token returned by
 * the scanner.</p>
 */
export class Token {

    protected type: TokenType;       // language-specific token.
    protected text: string;          // token text
    protected value: any;            // token value
    protected source: Source;        // source
    protected lineNum: number;       // line number of the token's source line
    protected position: number;      // position of the first token character

    /**
     * Constructor
     * @param source the source from where to fetch the token's character.
     * @throws {Error} if an error occurred.
     */
    constructor(source: Source) {
        this.type = <TokenType>{};
        this.text = "";
        this.source = source;
        this.lineNum = source.getLineNum();
        this.position = source.getPosition();
        this.extract();
    }


    /**
     * Default method to extract only one-character tokens from the source.
     * Subclasses can override this method to construct language-specific tokens.
     * After extracting the token, the current source line position will be one
     * beyond the last token character.
     * @protected
     */
    protected extract(): void {
        this.text = this.currentChar();
        this.value = null;
        this.nextChar(); // consume the charater.
    }

    /**
     * Call the source's currentChar() method.
     * @return the current character from the source.
     * @protected
     * @throws {Error} if an error occurred.
     */
    protected currentChar(): string {
        return this.source.currentChar();
    }

    /**
     * Call the source's nextChar() method.
     * @return the next character from the source after moving forward.
     * @throws {Error} if an error occurred.
     * @protected
     */
    protected nextChar(): string {
        return this.source.nextChar();
    }

    /**
     * Call the source's peekChar() method.
     * @return the next character from the source without moving forward.
     * @protected
     * @throws {Error} if an error occurred.
     */
    protected peekChar(): string {
        return this.source.peekChar();
    }

    /**
     * @getter
     * @return the type of the token.
     */
    public getType(): TokenType {
        return this.type;
    }

    /**
     * @getter
     * @return the text(lexeme) of the token.
     */
    public getText(): string {
        return this.text;
    }

    /**
     * @getter
     * @return the value of the token.
     */
    public getValue(): any {
        return this.value;
    }

    /**
     * @getter
     * @return the source from which this token was extracted.
     */
    public getSource(): Source {
        return this.source;
    }

    /**
     * @getter
     * @return the line number of the token.
     */
    public getLineNum(): number {
        return this.lineNum;
    }

    /**
     * @getter
     * @return the position of the token.
     */
    public getPosition(): number {
        return this.position;
    }
}