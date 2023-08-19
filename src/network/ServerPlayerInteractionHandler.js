import { WebSocketServer } from "ws";

export { ServerPlayerInteractionHandler };

class ServerPlayerInteractionHandler {

    /**
    * The server's handler for a client's handshake request.
    * @constructor
    * @param {ServerPlayer} player 
    * @param {WebSocketServer} socketServer 
    */
    constructor(player, socketServer) {
        this.player = player
        this.ws = socketServer
    }

    onPlayerJoin(playerJoinData)
    {
        
    }
}