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
    }

    /**
     * Posts a message to the chat list.
     * @param {ChatMessage} chatMessage The chat message to send to the clients.
     */
    public postMessage (chatMessage: ChatMessage)
    {
        this.serverChat.unshift(chatMessage);
        LOGGER.info(`Sending chat message to ${chatMessage.sendTo.getName()} from ${chatMessage.from.getName()}`);
        const playerListPlayer = this.server.playerList.getPlayers().find((player) => player == chatMessage.sendTo);
        if (playerListPlayer != undefined)
        {
            playerListPlayer.connection.onChatMessage(chatMessage.from, chatMessage.text);
        }
        else
        {
            this.server.playerList.getPlayers().forEach((player) =>
            {
                playerListPlayer.connection.onChatMessage(chatMessage.from, chatMessage.text);
            });
        }
    }

}