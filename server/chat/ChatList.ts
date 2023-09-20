import { LOGGER } from "../../index.ts";
import { SplatshooterServer } from "../SplatshooterServer.ts";
import { ChatMessage } from "./ChatMessage.ts";

export { ChatList };

class ChatList
{

    readonly server: SplatshooterServer;


    serverChat: ChatMessage[];

    constructor(server: SplatshooterServer)
    {
        this.server = server;
        this.serverChat = [];
    }

    /**
     * Posts a message to the chat list.
     * @param {ChatMessage} chatMessage The chat message to send to the clients.
     */
    public postMessage (chatMessage: ChatMessage)
    {
        this.serverChat.unshift(chatMessage);
        const to = this.server.playerList.getPlayerByUUID(chatMessage.sendTo);
        const from = this.server.playerList.getPlayerByUUID(chatMessage.from);
        LOGGER.info(`Sending chat message "${chatMessage.text}" to ${to ? to.getName() : "everyone"} from ${from ? from.getName() : "the server"}`);
        const playerListPlayer = this.server.playerList.getPlayers().find((player) => player == to);
        if (playerListPlayer != undefined)
        {
            playerListPlayer.connection.onChatMessage(chatMessage.from, chatMessage.text);
        }
        else
        {
            this.server.playerList.getPlayers().forEach((player) =>
            {
                player.connection.onChatMessage(chatMessage.from, chatMessage.text);
            });
        }
    }

}