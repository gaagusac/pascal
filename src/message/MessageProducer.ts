import {MessageListener} from "./MessageListener.ts";
import {Message} from "./Message.ts";


/**
 * <h2>MessageProducer</h2>
 * <p>All classes that produce message must implement this interface.</p>
 */
export interface MessageProducer {

    /**
     * Add a listener to the listener list.
     * @param listener the listener to add.
     */
    addMessageListener(listener: MessageListener): void;

    /**
     * Remove a listener from the listener list.
     * @param listener the listener to remove.
     */
    removeMessageListener(listener: MessageListener): void;

    /**
     * Notify listeners after setting the message.
     * @param message the message to set.
     */
    sendMessage(message: Message): void;

}