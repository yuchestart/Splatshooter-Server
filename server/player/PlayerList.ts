import { WebSocket } from "ws";
import { ServerPlayer } from "./ServerPlayer.ts";
import { SplatshooterServer } from "../SplatshooterServer.ts";

export { PlayerList };

class PlayerList
{
    private readonly server: SplatshooterServer;
    private readonly maxPlayers: number;
    private readonly players: ServerPlayer[] = [];
    private readonly playersByUUID: Map<string, ServerPlayer> = new Map();

    constructor(server: SplatshooterServer, maxPlayers: number)
    {
        this.server = server;
        this.maxPlayers = maxPlayers;
    }

    public addNewPlayer (ws: WebSocket, player: ServerPlayer)
    {
        this.players.push(player);
        this.playersByUUID.set(player.getUUID(), player);
    }

    public getSize ()
    {
        return this.players.length;
    }

    public getMax ()
    {
        return this.maxPlayers;
    }
}