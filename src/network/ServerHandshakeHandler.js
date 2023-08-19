import { WebSocketServer } from "ws";

export { ServerHandshakeHandler };

class ServerHandshakeHandler {

    /**
    * The server's handler for a client's handshake request.
    * @constructor
    * @param {WebSocketServer} socketConnection
    */
    constructor(socketConnection) {
        this.socket = socketConnection
    };

    onHandshake(handshakeData)
    {
        
    }
}