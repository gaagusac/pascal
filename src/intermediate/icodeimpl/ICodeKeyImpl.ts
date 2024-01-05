import {ICodeKey} from "../ICodeKey.ts";

export class ICodeKeyImpl implements ICodeKey {

    _ICodeKeyMaker: boolean = true;

    public static LINE: ICodeKeyImpl;
    public static ID: ICodeKeyImpl;
    public static VALUE: ICodeKeyImpl;

    static {
        ICodeKeyImpl.LINE = new ICodeKeyImpl("LINE");
        ICodeKeyImpl.ID = new ICodeKeyImpl("ID");
        ICodeKeyImpl.VALUE = new ICodeKeyImpl("VALUE");
    }

    /**
     * @constructor
     * @param text the value of the constant.
     */
    constructor(private readonly text: string) {
        this.text = text;
    }

    public valueOfKey(): string {
        return this.text;
    }

}