import { WebSocket } from "ws";
import { ServerPlayer } from "../player/ServerPlayer.ts";
import { Message } from "./messages/Message.ts";
import { Util } from "../util/Util.ts";
const ClientboundMessageTypes = Util.ClientboundMessageTypes;


export { ServerPlayerMessageHandler };

class ServerPlayerMessageHandler
{

    readonly player: ServerPlayer;
    readonly ws: WebSocket;

    keepAlivePending: boolean;
    keepAliveTime: number;
    keepAliveChallenge: number;

    hasClosed = false;

    /**
    * The server's handler for a client's handshake request.
    * @constructor
    * @param {ServerPlayer} player 
    * @param {WebSocket} connection 
    */
    constructor(player: ServerPlayer, connection: WebSocket)
    {
        this.player = player;
        this.ws = connection;
    }

    tick ()
    {
        let i = performance.now();
        if (i - this.keepAliveTime >= 15000)
        {
            if (this.keepAlivePending)
            {
                this.disconnect("Timed Out.");
            } else
            {
                this.keepAlivePending = true;
                this.keepAliveTime = i;
                this.keepAliveChallenge = i;
                const keepAlive = new Message(ClientboundMessageTypes.KEEPALIVE, { id: this.keepAliveChallenge });
                this.ws.send(keepAlive.compress());
            }
        }
    }

    /**
     * Handles a player joining a game once the handshake is complete and the login is processed
     * @param playerJoinData
     */
    onPlayerJoin (playerJoinData: object)
    {

    }

    onKeepAlive (message: { id: number; })
    {
        if (this.keepAlivePending && message.id == this.keepAliveChallenge)
        {
            let i = performance.now() - this.keepAliveTime;
            this.player.latency = (this.player.latency * 3 + i) / 4;
            this.keepAlivePending = false;
        }
        else
        {
            this.disconnect("Timed out.");
        }
    }

    onChatMessage (from: ServerPlayer, text: string)
    {
        const chat = new Message(ClientboundMessageTypes.CHAT, { from, text });
        this.ws.send(chat.compress());
    }

    disconnect (disconnectText: string)
    {
        const disconnect = new Message(ClientboundMessageTypes.DISCONNECT, { text: disconnectText });
        this.player.disconnecting = true;
        this.ws.send(disconnect.compress());
        this.ws.close(3000, disconnectText);
    }
}