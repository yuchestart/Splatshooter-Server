import { ServerPlayer } from "../../player/ServerPlayer.ts";
import { Message } from "./Message.ts";

export { QueuedMessage };

class QueuedMessage
{

    public message: Message;
    public player: ServerPlayer;

    constructor(message: Message, player: ServerPlayer)
    {
        this.message = message;
        this.player = player;
    }

}