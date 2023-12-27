import {Message} from "./Message.ts";


/**
 * <h2>MessageListener</h2>
 * <p>All classes the listen to message must implement this interface.</p>
 */
export interface MessageListener {

    /**
     * Called to receive a message sent by a message producer.
     * @param message the message that was sent.
     */
    messageReceived(message: Message): void;
}