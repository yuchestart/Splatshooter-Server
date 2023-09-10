import { SplatshooterServer } from "../SplatshooterServer.ts";
import { ServerPlayer } from "../player/ServerPlayer.ts";

export { ChatMessage };

class ChatMessage
{
    readonly from: ServerPlayer;
    readonly sendTo: ServerPlayer;
    text: string;

    /**
     * The constructor of a new chat message
     * @param {ServerPlayer} from The player that sent the message. If null, that means it is from the server.
     * @param {ServerPlayer} to The player to send the message to.  If null, sends it to the entire server.
     * @param {string} text The text that
     */
    constructor(from: ServerPlayer, to: ServerPlayer, text: string)
    {
        this.from = from;
        this.sendTo = to;
        this.text = text;
    }
}