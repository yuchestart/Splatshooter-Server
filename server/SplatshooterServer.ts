import config from "../splatshooter_config.json" assert {type: "json"};
import CANNON from "cannon";
import pako from "pako";
import WebSocket, { WebSocketServer } from "ws";
import { Message } from "./network/messages/Message.ts";
import { ServerHandshakeHandler } from "./network/ServerHandshakeHandler.ts";
import { ServerPlayer } from "./player/ServerPlayer.ts";
import { Util } from "./util/Util.ts";
const ClientboundMessageTypes = Util.ClientboundMessageTypes;
const ServerboundMessageTypes = Util.ServerboundMessageTypes;
import { PlayerList } from "./player/PlayerList.ts";
import { ChatList } from "./chat/ChatList.ts";
import { ChatMessage } from "./chat/ChatMessage.ts";
import { QueuedMessage } from "./network/messages/QueuedMessage.ts";
import { LOGGER } from "../index.ts";

export { SplatshooterServer };

/*
Packet values:
0: Handshake
1:
*/

class SplatshooterServer
{
    running = true;
    requestsQueue: QueuedMessage[] = [];
    physicsWorld: CANNON.World;
    readonly socketServer: WebSocket.WebSocketServer;
    keepAliveTime: number = performance.now();
    keepAlivePending: boolean;
    keepAliveChallenge: number = 0;
    playerList: PlayerList = new PlayerList(this, 12);
    chat: ChatList = new ChatList(this);
    handshakeHandler: ServerHandshakeHandler;

    constructor(socketServer: WebSocketServer)
    {
        this.socketServer = socketServer;
    }

    canJoinServer (data: { version: string; }, ws: WebSocket)
    {
        if (data.version != config.server.version)
        {
            this.disconnect(ws, "Mismatched Version! I'm on " + config.server.version);
            return false;
        }
        else if (this.playerList.getPlayers().length >= this.playerList.getMax())
        {
            this.disconnect(ws, "Server is full!");
            return false;
        }

        return true;
    }

    initServer ()
    {
        if (this.playerList.getMax() > 24)
        {
            LOGGER.error("Too many players in config! Maximum is 24.");
            return false;
        }
        this.handshakeHandler = new ServerHandshakeHandler(this);
        this.socketServer.on("connection", (ws: WebSocket) =>
        {
            let connectedPlayer: ServerPlayer = null;
            let hasPlayer = false;
            let authToken: string = null;

            console.log("connected");

            ws.on("message", (msg) =>
            {
                const uncompressed = JSON.parse(pako.inflate(msg as any, { to: 'string' }));
                if (typeof uncompressed.dataType != "number")
                {
                    let errorMessage = new Message(ClientboundMessageTypes.ERROR, { code: 3001 });
                    ws.send(errorMessage.compress());
                    return;
                }

                if (this.validateAuthToken(uncompressed.authToken, authToken, uncompressed.dataType))
                {

                    if (!hasPlayer)
                    {
                        switch (uncompressed.dataType)
                        {
                            case ServerboundMessageTypes.ERROR:
                                LOGGER.warn("Caught error message from client: " + uncompressed.data);
                                break;
                            case ServerboundMessageTypes.HANDSHAKE:
                                authToken = this.handshakeHandler.onHandshake(uncompressed.data, ws);
                                break;
                            case ServerboundMessageTypes.LOGIN:

                                if (this.canJoinServer(uncompressed.data, ws))
                                {
                                    LOGGER.info(`Player ${uncompressed.data.username} joined the game`);
                                    connectedPlayer = new ServerPlayer(this, uncompressed.data.username);
                                    this.playerList.addNewPlayer(ws, connectedPlayer);
                                    hasPlayer = true;
                                }
                                break;
                            default:
                                LOGGER.warn("Unknown data type while player has not been created! Sending to request queue, but may cause issues. Data Type is " + uncompressed.dataType);
                                this.requestsQueue.push(new QueuedMessage(uncompressed, connectedPlayer));
                                break;
                        }
                    }
                    else
                    {
                        this.requestsQueue.push(new QueuedMessage(uncompressed, connectedPlayer));
                    }
                }
            });
            ws.on("close", (code, reason) =>
            {
                if (connectedPlayer)
                {
                    this.playerList.removePlayer(connectedPlayer);
                }
                connectedPlayer = undefined;
                hasPlayer = false;
            });
        });

        this.physicsWorld = new CANNON.World();

        return true;
    }

    runServer ()
    {
        if (!this.initServer())
        {
            LOGGER.error("ERROR INITIALIZING SERVER!");
            return;
        }
        else
        {
            const targetTicksPerSecond = 30;
            const tickIntervalMs = 1000 / targetTicksPerSecond;
            let lastTickTime = Date.now();
            let prevDelay = 1 / 30;

            const iteration = () =>
            {
                if (this.running)
                {
                    const currentTime = Date.now();
                    const elapsed = currentTime - lastTickTime;

                    this.physicsWorld.step(prevDelay);

                    this.playerList.getPlayers().forEach((player, i) =>
                    {
                        const handler = player.connection;
                        if (!player.disconnecting)
                        {
                            handler.tick();
                        }
                    });

                    // Handle the requests queue
                    this.requestsQueue.forEach((data, index) =>
                    {
                        const message = data.message;
                        switch (message.dataType)
                        {
                            case ServerboundMessageTypes.KEEPALIVE:
                                data.player.connection.onKeepAlive(message.data);
                                // Just a debug to test chat rendering until I have a chat box implemented
                                data.player.connection.send(new Message(Util.ClientboundMessageTypes.CHAT, { from: null, text: "rendering test" }));
                                break;
                            case ServerboundMessageTypes.CHAT:
                                this.chat.postMessage(new ChatMessage(data.player.getUUID(), message.data.to, message.data.text));
                                break;
                            default:
                                LOGGER.warn("Unknown message type " + message.dataType + " recieved!");
                                break;
                        }
                    });
                    this.requestsQueue = []; // Clear it so the console isn't spammed

                    lastTickTime = currentTime;

                    // Calculate the delay for the next tick
                    const delay = Math.max(tickIntervalMs - elapsed, 0);
                    prevDelay = delay;
                    // Schedule the next iteration with the adjusted delay
                    setTimeout(iteration, delay);
                }
            };

            // Start the first iteration
            iteration();
        }
    }
    disconnect (ws: WebSocket, disconnectText: string)
    {
        const disconnect = new Message(ClientboundMessageTypes.DISCONNECT, { text: disconnectText });
        ws.send(disconnect.compress());
        ws.close(3000, disconnectText);
    }
    stop ()
    {
        this.running = false;
    }

    isCompressed (data: any, intended: boolean)
    {
        try
        {
            pako.inflate(data);
            return true;
        } catch (error)
        {
            if (intended)
                LOGGER.warn(
                    "Warning: unintended uncompressed data caught! Data: " + data
                );
            return false;
        }
    }

    getStatus ()
    {
        return { playersOnline: this.playerList.getPlayers().length, maxPlayers: this.playerList.getMax() };
    }

    private validateAuthToken (sent: string, known: string, dataType: number)
    {
        if (dataType == ServerboundMessageTypes.HANDSHAKE)
        {
            // You shouldn't need a token for a handshake, as that is when it's given.
            // Also, server status.
            return true;
        }
        else if (sent === known)
        {
            return true;
        } else
        {
            LOGGER.warn(`User's authtoken did not match! User's token was ${sent}, while I think it's ${known}`);
            return false;
        }

    }
}