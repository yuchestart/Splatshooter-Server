import { WebSocket } from "ws";
import { ServerPlayer } from "./ServerPlayer.ts";
import { SplatshooterServer } from "../SplatshooterServer.ts";
import { ServerPlayerMessageHandler } from "../network/ServerPlayerMessageHandler.ts";
import { Message } from "../network/messages/Message.ts";
import { Util } from "../util/Util.ts";
import { ChatMessage } from "../chat/ChatMessage.ts";
import { LOGGER } from "../../index.ts";

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

        player.team = team;

        handler.send(new Message(Util.ClientboundMessageTypes.LOGIN, {
            name: player.getName(),
            position: player.getPosition(),
            rotation: player.getRotation(),
            velocity: player.getBody().velocity,
            team: team
        }));

        this.getPlayers().filter((filterPlayer) => filterPlayer != player).forEach((splayer, index) =>
        {
            handler.send(new Message(Util.ClientboundMessageTypes.NEWPLAYER, {
                name: splayer.getName(),
                uuid: splayer.getUUID(),
                position: splayer.getPosition(),
                rotation: splayer.getRotation(),
                velocity: splayer.getBody().velocity,
                team: splayer.getTeam()
            }));
            splayer.connection.send(new Message(Util.ClientboundMessageTypes.NEWPLAYER, {
                name: player.getName(),
                uuid: player.getUUID(),
                position: player.getPosition(),
                rotation: player.getRotation(),
                velocity: player.getBody().velocity,
                team: player.getTeam()
            }));
        });
        this.server.chat.postMessage(new ChatMessage(null, null, `${player.getName()} joined the game`));
    }

    public removePlayer (player: ServerPlayer): void
    {
        LOGGER.info(`Player ${player.getName()} left the game`);
        this.server.chat.postMessage(new ChatMessage(null, null, `Player ${player.getName()} left the game`));
        this.getPlayers().filter((filterPlayer) => filterPlayer != player).forEach((player, index) =>
        {
            player.connection.send(new Message(Util.ClientboundMessageTypes.REMOVEPLAYER, { uuid: player.getUUID() }));
        });
        var index = this.getPlayers().indexOf(player);
        if (index !== -1)
        {
            this.getPlayers().splice(index, 1);
        }
        this.server.chat.postMessage(new ChatMessage(null, null, `${player.getName()} left the game`));
    }

    public getPlayers (): ServerPlayer[]
    {
        return this.players;
    }

    public getPlayerByUUID (uuid: string): ServerPlayer
    {
        return this.playersByUUID.get(uuid);
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