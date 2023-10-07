import { WebSocket } from "ws";
import { ServerPlayer } from "../player/ServerPlayer.ts";
import { Message } from "./messages/Message.ts";
import { Util } from "../util/Util.ts";
import { SplatshooterServer } from "../SplatshooterServer.ts";
import { LOGGER } from "../../index.ts";
const ClientboundMessageTypes = Util.ClientboundMessageTypes;


export { ServerPlayerMessageHandler };

class ServerPlayerMessageHandler
{
    readonly server: SplatshooterServer;
    readonly player: ServerPlayer;
    private readonly ws: WebSocket;

    keepAlivePending: boolean;
    keepAliveTime: number;
    keepAliveChallenge: number;

    hasClosed = false;

    /**
    * The server's handler for a client's handshake request.
    * @param {SplatshooterServer} server A reference to the starting SplatshooterServer
    * @param {ServerPlayer} player The player that this message handler is linked to
    * @param {WebSocket} connection The websocket connection that links the client and the server
    */
    constructor(server: SplatshooterServer, player: ServerPlayer, connection: WebSocket)
    {
        this.server = server;
        this.player = player;
        player.connection = this;
        this.keepAliveTime = performance.now();
        this.ws = connection;
    }

    tick (): void
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
                this.keepAliveChallenge = Math.round(i);
                const keepAliveMessage = new Message(ClientboundMessageTypes.KEEPALIVE, { id: this.keepAliveChallenge });
                this.send(keepAliveMessage);
            }
        }
    }

    onKeepAlive (message: any): void
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

    onChatMessage (from: string, text: string): void
    {
        const chat = new Message(ClientboundMessageTypes.CHAT, { from, text });
        this.send(chat);
    }

    send (data: Message): void
    {
        this.ws.send(data.compress());
    }

    disconnect (disconnectText: string): void
    {
        const disconnectMessage = new Message(ClientboundMessageTypes.DISCONNECT, { text: disconnectText });
        this.player.disconnecting = true;
        this.send(disconnectMessage);
        this.ws.close(3000, disconnectText);
    }
}