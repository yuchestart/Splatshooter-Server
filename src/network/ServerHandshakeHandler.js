const pako = require("pako")
const { WebSocketServer } = require("ws");

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
        if (handshakeData.intent == "query") {
            const handshake = new Message({ type: 'handshake', intent: 'confirm' }, "json");
            const compressed = pako.deflate(JSON.stringify(handshake), { to: 'string' });
            this.socket.send(compressed);
        }
    }
}

module.exports = { ServerHandshakeHandler }