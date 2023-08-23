const pako = require("pako")
const { WebSocketServer } = require("ws");
const { Message } = require("./messages/Message.js");

class ServerHandshakeHandler
{

    /**
    * The server's handler for a client's handshake request.
    * @constructor
    * @param {WebSocketServer} socketConnection
    */
    constructor(socketConnection)
    {
        this.socket = socketConnection
    };

    onHandshake(handshakeData)
    {
        if (handshakeData.intent == "query")
        { // could be used for like login auth or smthn, idk
            let handshake = new Message(0, { intent: 'confirm' });
            let compressed = pako.deflate(JSON.stringify(handshake), { to: 'string' });
            this.socket.send(compressed);
        }
    }
}

module.exports = { ServerHandshakeHandler }