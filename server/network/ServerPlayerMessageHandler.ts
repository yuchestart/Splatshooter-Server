import { WebSocket } from "ws";
import { ServerPlayer } from "../player/ServerPlayer.ts";
import { Message } from "./messages/Message.ts";


export { ServerPlayerInteractionHandler };

class ServerPlayerInteractionHandler
{

    readonly player: ServerPlayer;
    readonly ws: WebSocket;

    keepAlivePending: boolean;
    keepAliveTime: number;
    keepAliveChallenge: number;

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
                this.disconnect(this.ws, "Timed Out.");
            } else
            {
                this.keepAlivePending = true;
                this.keepAliveTime = i;
                this.keepAliveChallenge = i;
                const keepAlive = new Message(2, { id: this.keepAliveChallenge });
                this.ws.send(keepAlive.compress());
            }
        }
    }

    /**
     * Handles a player joining a game once the handshake is complete and the play button is pressed
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
            this.disconnect(this.ws, "Timed out.");
        }
    }

    disconnect (ws: WebSocket, disconnectText: string)
    {
        const disconnect = new Message(-2, { text: disconnectText });
        ws.send(disconnect.compress());
        ws.close(3000, disconnectText);
    }
}