import { Worker } from "worker_threads";
import os from "os";
import config from "../splatshooter_config.json" assert {type: "json"};
import https from "https";
import http from "http";
import fs from "fs";
import * as cannon from "cannon";
import pako from "pako";
import WebSocket, { WebSocketServer } from "ws";
import { Message } from "./network/messages/Message.ts";
import { ServerHandshakeHandler } from "./network/ServerHandshakeHandler.ts";
import { APIHandler } from "./api/APIHandler.ts";
import { ServerPlayerInteractionHandler } from "./network/ServerPlayerInteractionHandler.ts";
import { ServerPlayer } from "./player/ServerPlayer.ts";
import { Util } from "./util/Util.ts";

export { SplatshooterServer };

class SplatshooterServer
{
    running = true;
    requestsQueue: Message[] = [];
    physicsWorld: cannon.World;
    readonly socketServer: WebSocket.WebSocketServer;
    keepAliveTime: number;
    keepAlivePending: boolean;
    keepAliveChallenge: number;


    constructor(socketServer: WebSocketServer)
    {
        this.socketServer = socketServer;
    }

    runServer ()
    {
        this.physicsWorld = new cannon.World();


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

                this.socketServer.clients.forEach(ws =>
                {
                    let i = performance.now();
                    if (i - this.keepAliveTime >= 15000)
                    {
                        if (this.keepAlivePending)
                        {
                            this.disconnect(ws, "Timed Out.");
                        } else
                        {
                            this.keepAlivePending = true;
                            this.keepAliveTime = i;
                            this.keepAliveChallenge = i;
                            const keepAlive = new Message(2, { id: this.keepAliveChallenge });
                            ws.send(keepAlive.compress());
                        }
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

    disconnect (ws: WebSocket, disconnectText: string)
    {
        const disconnect = new Message(-2, { text: disconnectText });
        ws.send(disconnect.compress());
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
}