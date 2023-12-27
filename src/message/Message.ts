import {MessageType} from "./MessageType.ts";

/**
 * <h2>Message</h2>
 * <p>Message format.</p>
 */
export class Message {

    private readonly type: MessageType;
    private readonly body: any;

    /**
     * Constructor
     * @param type the message type.
     * @param body the message body.
     */
    constructor(type: MessageType, body: any) {
        this.type = type;
        this.body = body;
    }

    /**
     * @getter
     * @return the message type.
     */
    public getType(): MessageType {
        return this.type;
    }

    /**
     * @getter
     * @return the message body.
     */
    public getBody(): any {
        return this.body;
    }
}