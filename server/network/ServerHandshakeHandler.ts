import pako from "pako"
import { Message } from "./messages/Message.ts";
import WebSocket from "ws";

export { ServerHandshakeHandler }

class ServerHandshakeHandler
{

    socket: WebSocket;

    /**
    * The server's handler for a client's handshake request.
    * @constructor
    * @param {WebSocket} socketConnection
    */
    constructor(socketConnection: WebSocket)
    {
        this.socket = socketConnection
    };

    onHandshake(handshakeData: { intent: string; })
    {
        if (handshakeData.intent == "query") { // could be used for like login auth or smthn, idk
            let handshake = new Message(0, { intent: 'confirm' });
            let compressed = pako.deflate(JSON.stringify(handshake));
            this.socket.send(compressed);
        }
    }
}