import { WebSocket } from "ws";
import { ServerPlayer } from "../player/ServerPlayer.ts";


export { ServerPlayerInteractionHandler };

class ServerPlayerInteractionHandler
{

    readonly player: ServerPlayer;
    readonly ws: WebSocket;

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

    /**
     * Handles a player joining a game once the handshake is complete and the play button is pressed
     * @param playerJoinData
     */
    onPlayerJoin (playerJoinData: any)
    {

    }
}