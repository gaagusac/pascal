/**
 * <h1>Definition</h1>
 * <p>The interface for how a symbol table entry is defined.</p>
 */
export interface Definition {
    /**
     * @getter
     * @return {string} the text of the definition.
     */
    getText(): string;
}