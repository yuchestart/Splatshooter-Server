import pako from "pako";
import { Message } from "./messages/Message.ts";
import WebSocket from "ws";
import { SplatshooterServer } from "../SplatshooterServer.ts";
import { Util } from "../util/Util.ts";
const ClientboundMessageTypes = Util.ClientboundMessageTypes;

export { ServerHandshakeHandler };

class ServerHandshakeHandler
{
    server: SplatshooterServer;
    socket: WebSocket;

    /**
    * The server's handler for a client's handshake request.
    * @constructor
    * @param {SplatshooterServer} server
    * @param {WebSocket} socketConnection
    */
    constructor(server: SplatshooterServer, socketConnection: WebSocket)
    {
        this.server = server;
        this.socket = socketConnection;
    };

    onHandshake (handshakeData: { intent: string; })
    {
        switch (handshakeData.intent)
        {
            case "status":
                let status = this.server.getStatus();
                let statusMessage = new Message(ClientboundMessageTypes.STATUS, { playersOnline: status.playersOnline, maxPlayers: status.maxPlayers });
                this.socket.send(statusMessage.compress());
                break;
            case "login":
                let handshake = new Message(ClientboundMessageTypes.HANDSHAKE, { intent: 'confirm' });
                let compressed = pako.deflate(JSON.stringify(handshake));
                this.socket.send(compressed);
                break;
            default:
                console.warn("Warning: invalid intent " + handshakeData.intent + " recieved!");
                break;
        }
    }
}