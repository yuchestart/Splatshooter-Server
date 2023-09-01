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
     * postMessage
     */
    public postMessage (chatMessage: ChatMessage)
    {
        this.serverChat.unshift(chatMessage);
        if (chatMessage.sendTo != null)
        {
            const playerListPlayer = this.server.playerList.getPlayers().find((player) => player == chatMessage.sendTo);
            if (playerListPlayer != null)
            {
                const handler = this.server.playerList.getPlayerMessageHandlers().get(playerListPlayer);
                handler.onChatMessage(chatMessage.from, chatMessage.text);
            }
        }
    }

}