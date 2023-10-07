import { WebSocket } from "ws";
import { ServerPlayer } from "./ServerPlayer.ts";
import { SplatshooterServer } from "../SplatshooterServer.ts";
import { ServerPlayerMessageHandler } from "../network/ServerPlayerMessageHandler.ts";
import { Message } from "../network/messages/Message.ts";
import { Util } from "../util/Util.ts";
import { ChatMessage } from "../chat/ChatMessage.ts";
import { LOGGER } from "../../index.ts";

export { PlayerList };

/**
 * The main player manager for the server.
 * This includes creating and removing players, and other team-related utilities.
 */
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

    /**
     * Adds the player to the game world and sets up all necessary components, including the network handler. No messages should be sent to or from this player at this point in time.
     * @param ws The player's connection to the server.
     * @param player The player as an object.
     */
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
            rotation: player.getRotationQuaternion(),
            velocity: player.getBody().velocity,
            team: team
        }));

        this.getPlayers().filter((filterPlayer) => filterPlayer != player).forEach((splayer, index) =>
        {
            handler.send(new Message(Util.ClientboundMessageTypes.NEWPLAYER, {
                name: splayer.getName(),
                uuid: splayer.getUUID(),
                position: splayer.getPosition(),
                rotation: splayer.getRotationQuaternion(),
                velocity: splayer.getBody().velocity,
                team: splayer.getTeam()
            }));
            splayer.connection.send(new Message(Util.ClientboundMessageTypes.NEWPLAYER, {
                name: player.getName(),
                uuid: player.getUUID(),
                position: player.getPosition(),
                rotation: player.getRotationQuaternion(),
                velocity: player.getBody().velocity,
                team: player.getTeam()
            }));
        });
        this.server.chat.postMessage(new ChatMessage(null, null, `${player.getName()} joined the game`));
    }

    /**
     * Removes a player from the game world. This is usually called internally when the player's websocket disconnects.
     * @param player The player to remove
     * @param reason The reason why they were removed.
     */
    public removePlayer (player: ServerPlayer, reason: Buffer): void
    {
        LOGGER.info(`${player.getName()} left the game (${reason.toString() ? reason.toString() : "Client Disconnect"})`);
        this.getPlayers().filter((filterPlayer) => filterPlayer != player).forEach((player, index) =>
        {
            player.connection.send(new Message(Util.ClientboundMessageTypes.REMOVEPLAYER, { uuid: player.getUUID() }));
        });
        var index = this.getPlayers().indexOf(player);
        if (index !== -1)
        {
            this.getPlayers().splice(index, 1);
        }
        this.server.chat.postMessage(new ChatMessage(null, null, `${player.getName()} left the game (${reason.toString() ? reason.toString() : "Client Disconnect"})`));
    }

    /**
     * Get a list of all of the players on the server.
     * @returns A list of all of the players currently on the server.
     */
    public getPlayers (): ServerPlayer[]
    {
        return this.players;
    }

    /**
     * Gets a player based on a UUID.
     * @param uuid A player's Unique User ID
     * @returns A player object.
     */
    public getPlayerByUUID (uuid: string): ServerPlayer
    {
        return this.playersByUUID.get(uuid);
    }

    /**
     * Get how many players can be on this server.
     * @returns {number} A number of how many total players can be on this server.
     */
    public getMax (): number
    {
        return this.maxPlayers;
    }

    /**
     * Gets the players on a certain team.
     * @param team the ID of the team to get.
     * @returns {ServerPlayer[]} An array of players on the specified team.
     */
    public getPlayersOnTeam (team: number): ServerPlayer[]
    {
        return this.getPlayers().filter((player) => player.team == team);
    }

    /**
     * Gets the team to be placed on. If teams are equal, the player gets placed on the team ID 0.
     * @returns {number} The team to be placed on.
     */
    public getBalancedTeam (): number
    {
        return this.getPlayersOnTeam(0) >= this.getPlayersOnTeam(1) ? 1 : 0;
    }
}