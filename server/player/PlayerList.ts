import { WebSocket } from "ws";
import { ServerPlayer } from "./ServerPlayer.ts";
import { SplatshooterServer } from "../SplatshooterServer.ts";

export { PlayerList };

class PlayerList
{
    private readonly server: SplatshooterServer;
    private readonly ppt: number;
    private readonly players: ServerPlayer[] = [];
    private readonly playersByUUID: Map<string, ServerPlayer> = new Map();

    constructor(server: SplatshooterServer, playerperteam: number)
    {
        this.server = server;
        this.ppt = playerperteam;
    }

    public addNewPlayer (ws: WebSocket, player: ServerPlayer)
    {
        this.players.push(player);
        this.playersByUUID.set(player.getUUID(), player);
    }
}