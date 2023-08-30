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
import { ServerPlayerInteractionHandler } from "./network/ServerPlayerMessageHandler.ts";
import { ServerPlayer } from "./player/ServerPlayer.ts";
import { Util } from "./util/Util.ts";
const ClientboundMessageTypes = Util.ClientboundMessageTypes;
const ServerboundMessageTypes = Util.ServerboundMessageTypes;
import { PlayerList } from "./player/PlayerList.ts";

export { SplatshooterServer };

/*
Packet values:
0: Handshake
1:
*/

class SplatshooterServer
{
    running = true;
    requestsQueue: { message: Message, player: ServerPlayer, handler: ServerPlayerInteractionHandler, ws: WebSocket; }[] = []; // ??? i guess ???
    physicsWorld: CANNON.World;
    readonly socketServer: WebSocket.WebSocketServer;
    keepAliveTime: number = performance.now();
    keepAlivePending: boolean;
    keepAliveChallenge: number = 0;
    playerList: PlayerList = new PlayerList(this, 6);
    playerMessageHandlers: Map<ServerPlayer, ServerPlayerInteractionHandler> = new Map();


    constructor(socketServer: WebSocketServer)
    {
        this.socketServer = socketServer;
    }

    initServer ()
    {
        this.socketServer.on("connection", (ws: WebSocket) =>
        {
            let networkHandshakeHandler: ServerHandshakeHandler = new ServerHandshakeHandler(this, ws);
            let connectedPlayer: ServerPlayer = null;
            let connectedPlayerHandler: ServerPlayerInteractionHandler = null;
            let hasPlayer = false;

            console.log("connection");

            ws.on("message", (msg) =>
            {
                const uncompressed = JSON.parse(pako.inflate(msg as Buffer, { to: 'string' }));
                console.log(uncompressed.data);
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
                        case ServerboundMessageTypes.HANDSHAKE:
                            networkHandshakeHandler.onHandshake(uncompressed.data);
                            break;
                        case ServerboundMessageTypes.LOGIN:
                            if (uncompressed.data.version != config.server.version)
                            {
                                let errorMessage = new Message(ClientboundMessageTypes.ERROR, { code: 4001 });
                                ws.send(errorMessage.compress());
                                break;
                            }
                            console.log(`Player ${uncompressed.data.username} joined the game`);
                            connectedPlayer = new ServerPlayer(this, uncompressed.data.username);
                            connectedPlayerHandler = new ServerPlayerInteractionHandler(connectedPlayer, ws);
                            this.playerMessageHandlers.set(connectedPlayer, connectedPlayerHandler);
                            hasPlayer = true;
                            break;
                        default:
                            break;
                    }
                }
                else
                {
                    this.requestsQueue.push({ message: uncompressed, player: connectedPlayer, handler: connectedPlayerHandler, ws: ws });
                }
            });
            ws.on("close", (code, reason) =>
            {
                this.playerMessageHandlers.delete(connectedPlayer);
                connectedPlayer = undefined;
                connectedPlayerHandler = undefined;
                hasPlayer = false;
            });
        });
    }

    runServer ()
    {
        this.initServer();

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

                this.playerMessageHandlers.forEach((handler, player) =>
                {
                    handler.tick();
                });

                this.requestsQueue.forEach((data, index) =>
                {
                    const message = data.message;
                    const handler = data.handler;
                    switch (message.dataType)
                    {
                        case ServerboundMessageTypes.KEEPALIVE:
                            handler.onKeepAlive(message as any);
                            break;
                        default:
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
                console.warn(
                    "Warning: unintended uncompressed data caught! Data: " + data
                );
            return false;
        }
    }

    getStatus ()
    {
        return { playersOnline: this.playerList.getSize(), maxPlayers: this.playerList.getMax() };
    }
}