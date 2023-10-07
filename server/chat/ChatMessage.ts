import { SplatshooterServer } from "../SplatshooterServer.ts";
import { ServerPlayer } from "../player/ServerPlayer.ts";

export { ChatMessage };

class ChatMessage
{
    readonly from: string;
    readonly sendTo: string;
    text: string;

    /**
     * The constructor of a new chat message
     * @param {string} from The UUID of player that sent the message. If null, that means it is from the server.
     * @param {string} to The UUID of player to send the message to.  If null, sends it to the entire server.
     * @param {string} text The text that
     */
    constructor(from: string, to: string, text: string)
    {
        this.from = from;
        this.sendTo = to;
        // Ensure chat can't be "cleared" by some malicious party via spamming newlines.
        // TODO: Make sure you can't type newlines in the client chatbox either.
        this.text = text.replaceAll("\n", "");
    }
}