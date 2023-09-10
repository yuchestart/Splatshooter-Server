import pako from "pako";
import { Message } from "./messages/Message.ts";
import WebSocket from "ws";
import { SplatshooterServer } from "../SplatshooterServer.ts";
import { Util } from "../util/Util.ts";
import { LOGGER } from "../../index.ts";
const ClientboundMessageTypes = Util.ClientboundMessageTypes;

export { ServerHandshakeHandler };

class ServerHandshakeHandler
{
    server: SplatshooterServer;

    /**
    * The server's handler for a client's handshake request.
    * @constructor
    * @param {SplatshooterServer} server
    */
    constructor(server: SplatshooterServer)
    {
        this.server = server;
    };

    onHandshake (handshakeData: { intent: string; }, socket: WebSocket)
    {
        switch (handshakeData.intent)
        {
            case "status":
                let status = this.server.getStatus();
                let statusMessage = new Message(ClientboundMessageTypes.STATUS, { playersOnline: status.playersOnline, maxPlayers: status.maxPlayers });
                socket.send(statusMessage.compress());
                break;
            case "login":
                let handshake = new Message(ClientboundMessageTypes.HANDSHAKE, { intent: 'confirm' });
                let compressed = pako.deflate(JSON.stringify(handshake));
                socket.send(compressed);
                break;
            default:
                LOGGER.warn("Warning: invalid intent " + handshakeData.intent + " recieved!");
                break;
        }
    }
}