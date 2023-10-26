import crypto from "crypto";
import pako from "pako";
import { Message } from "./messages/Message.ts";
import WebSocket from "ws";
import { SplatshooterServer } from "../SplatshooterServer.ts";
import { Util, NetworkTypes } from "../util/Util.ts";
import { LOGGER } from "../../index.ts";

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

    onHandshake (handshakeData: any, socket: WebSocket): string
    {
        switch (handshakeData.intent)
        {
            case "status":
                let status = this.server.getStatus();
                let statusMessage = new Message(NetworkTypes.ClientboundMessageTypes.STATUS, { playersOnline: status.playersOnline, maxPlayers: status.maxPlayers });
                socket.send(statusMessage.compress());
                socket.close(1004, "Status finished");
                return null;
            case "login":
                let token = Util.getAuthToken();
                let handshake = new Message(NetworkTypes.ClientboundMessageTypes.HANDSHAKE, { intent: 'confirm', authToken: token });
                let compressed = pako.deflate(JSON.stringify(handshake));
                socket.send(compressed);
                return token;
            default:
                LOGGER.warn("Invalid intent " + handshakeData.intent + " recieved!");
                break;
        }
    }
}