import { WebSocket } from "ws";
import { ServerPlayer } from "./ServerPlayer.ts";
import { SplatshooterServer } from "../SplatshooterServer.ts";
import { ServerPlayerMessageHandler } from "../network/ServerPlayerMessageHandler.ts";

export { PlayerList };

class PlayerList
{
    private readonly server: SplatshooterServer;
    private readonly maxPlayers: number;
    private readonly players: ServerPlayer[] = [];
    private readonly playersByUUID: Map<string, ServerPlayer> = new Map();
    private readonly playerMessageHandlers: Map<ServerPlayer, ServerPlayerMessageHandler> = new Map();

    constructor(server: SplatshooterServer, maxPlayers: number)
    {
        this.server = server;
        this.maxPlayers = maxPlayers;
    }

    public addNewPlayer (ws: WebSocket, player: ServerPlayer)
    {
        this.players.push(player);
        this.playersByUUID.set(player.getUUID(), player);
        const handler = new ServerPlayerMessageHandler(player, ws);
        this.playerMessageHandlers.set(player, handler);
    }

    public getPlayerMessageHandlers ()
    {
        return this.playerMessageHandlers;
    }

    public getPlayers ()
    {
        return this.players;
    }

    public getMax ()
    {
        return this.maxPlayers;
    }
}