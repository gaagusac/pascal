import {Message} from "./Message.ts";
import {MessageListener} from "./MessageListener.ts";

/**
 * <h2>MessageHandler</h2>
 * <p>A helper class to which message producer classes delegate the task
 * of maintaining and notifying listeners.</p>
 */
export class MessageHandler {

    private message: Message = {} as Message;        // message
    private listeners: MessageListener[];            // listener list

    /**
     * @constructor
     */
    constructor() {
        this.listeners = [];
    }


    /**
     * Add a listener to the listener list.
     * @param listener the listener to add.
     */
    public addListener(listener: MessageListener): void {
        this.listeners.push(listener);
    }

    /**
     * Remove a listener from the listener list.
     * @param listener the listener to remove.
     */
    public removeListener(listener: MessageListener): void {
        this.listeners.forEach((lst, index) => {
            if (lst === listener) {
                this.listeners.splice(index, 1);
            }
        });
    }

    /**
     * Notify listeners after setting the message.
     * @param message the message to set.
     */
    public sendMessage(message: Message): void {
        this.message = message;
        this.notifyListeners();
    }

    /**
     * Notify each listener in the listener list by calling the
     * listener's messageReceived() method.
     * @private
     */
    private notifyListeners(): void {
        this.listeners.forEach(listener => {
            listener.messageReceived(this.message);
        })
    }

}