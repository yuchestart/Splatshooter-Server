import { SplatshooterServer } from "../SplatshooterServer.ts";
import { ServerPlayer } from "../player/ServerPlayer.ts";

export { ChatMessage };

class ChatMessage
{
    readonly from: ServerPlayer;
    readonly sendTo: ServerPlayer;
    text: string;

    constructor(from: ServerPlayer, to: ServerPlayer, text: string)
    {
        this.from = from;
        this.sendTo = to;
        this.text = text;
    }
}