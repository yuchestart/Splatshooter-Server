import { WebSocket } from "ws";
import { ServerPlayer } from "./ServerPlayer.ts";
import { SplatshooterServer } from "../SplatshooterServer.ts";
import { ServerPlayerMessageHandler } from "../network/ServerPlayerMessageHandler.ts";
import { Message } from "../network/messages/Message.ts";
import { Util } from "../util/Util.ts";

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

    public addNewPlayer (ws: WebSocket, player: ServerPlayer): void
    {
        this.players.push(player);
        this.playersByUUID.set(player.getUUID(), player);
        const handler = new ServerPlayerMessageHandler(this.server, player, ws);

        const team = this.getBalancedTeam();

        handler.send(new Message(Util.ClientboundMessageTypes.LOGIN, {
            player: player,
            team: team
        }));

        this.getPlayers().forEach((splayer, index) =>
        {
            handler.send(new Message(Util.ClientboundMessageTypes.NEWPLAYER, {
                name: splayer.getName(),
                position: splayer.getPosition(),
                rotation: splayer.getRotation(),
                velocity: splayer.getBody().velocity
            }));
            splayer.connection.send(new Message(Util.ClientboundMessageTypes.NEWPLAYER, {
                name: player.getName(),
                position: player.getPosition(),
                rotation: player.getRotation(),
                velocity: player.getBody().velocity
            }));
        });
    }

    public getPlayers (): ServerPlayer[]
    {
        return this.players;
    }

    public getMax (): number
    {
        return this.maxPlayers;
    }

    public getPlayersOnTeam (team: number): ServerPlayer[]
    {
        return this.getPlayers().filter((player) => player.team == team);
    }

    /**
     * Gets the team to be placed on. If teams are equal, the player gets placed on the RED team.
     * @returns {number} The team to be placed on.
     */
    public getBalancedTeam (): number
    {
        return this.getPlayersOnTeam(0) >= this.getPlayersOnTeam(1) ? 1 : 0;
    }
}