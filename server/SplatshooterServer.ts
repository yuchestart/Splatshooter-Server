import { Worker } from "worker_threads";
import os from "os";
import config from "../splatshooter_config.json" assert {type: "json"};
import https from "https";
import http from "http";
import fs from "fs";
import CANNON from "cannon";
import pako from "pako";
import WebSocket, { WebSocketServer } from "ws";
import { Message } from "./network/messages/Message.ts";
import { ServerHandshakeHandler } from "./network/ServerHandshakeHandler.ts";
import { APIHandler } from "./api/APIHandler.ts";
import { ServerPlayerMessageHandler } from "./network/ServerPlayerMessageHandler.ts";
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

    canJoinServer (data, ws: WebSocket)
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
            LOGGER.error("Too many players! Maximum is 24.");
            return false;
        }
        this.handshakeHandler = new ServerHandshakeHandler(this);
        this.socketServer.on("connection", (ws: WebSocket) =>
        {
            let connectedPlayer: ServerPlayer = null;
            let hasPlayer = false;

            ws.on("message", (msg) =>
            {
                const uncompressed = JSON.parse(pako.inflate(msg as Buffer, { to: 'string' }));
                if (typeof uncompressed.dataType != "number")
                {
                    let errorMessage = new Message(ClientboundMessageTypes.ERROR, { code: 3001 });
                    ws.send(errorMessage.compress());
                    return;
                }

                if (!hasPlayer)
                {
                    switch (uncompressed.dataType)
                    {
                        case ServerboundMessageTypes.ERROR:
                            LOGGER.warn("Caught error message from client: " + uncompressed.data);
                            break;
                        case ServerboundMessageTypes.HANDSHAKE:
                            this.handshakeHandler.onHandshake(uncompressed.data, ws);
                            break;
                        case ServerboundMessageTypes.LOGIN:

                            if (this.canJoinServer(uncompressed.data, ws))
                            {
                                LOGGER.info(`Player ${uncompressed.data.username} joined the game`);
                                this.playerList.addNewPlayer(ws, new ServerPlayer(this, uncompressed.data.username));
                                hasPlayer = true;
                                this.requestsQueue.push({ message: uncompressed, player: connectedPlayer });
                            }
                            break;
                        default:
                            LOGGER.warn("Unknown data type while player has not been created! Sending to request queue, but may cause issues. Data Type is " + uncompressed.dataType);
                            this.requestsQueue.push({ message: uncompressed, player: connectedPlayer });
                            break;
                    }
                }
                else
                {
                    this.requestsQueue.push({ message: uncompressed, player: connectedPlayer });
                }
            });
            ws.on("close", (code, reason) =>
            {
                if (connectedPlayer)
                {
                    this.chat.postMessage(new ChatMessage(null, null, connectedPlayer.getName()));
                    connectedPlayer = undefined;
                    hasPlayer = false;
                }
            });
        });
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
            this.physicsWorld = new CANNON.World();


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

                    this.playerList.getPlayerMessageHandlers().forEach((handler, player) =>
                    {
                        if (!player.disconnecting)
                        {
                            handler.tick();
                        }
                    });

                    this.requestsQueue.forEach((data, index) =>
                    {
                        const message = data.message;
                        switch (message.dataType)
                        {
                            case ServerboundMessageTypes.KEEPALIVE:
                                this.playerList.getPlayerMessageHandlers().get(data.player).onKeepAlive(message as any);
                                break;
                            case ServerboundMessageTypes.CHAT:
                                this.chat.postMessage(new ChatMessage(data.player, message.data.to, message.data.text));
                                break;
                            default:
                                LOGGER.warn("Unknown message type " + message.dataType + " recieved!");
                                break;
                        }
                    });

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

    isCompressed (data: string | ArrayBuffer | Buffer[], intended: boolean)
    {
        try
        {
            pako.inflate(data as Buffer);
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
}