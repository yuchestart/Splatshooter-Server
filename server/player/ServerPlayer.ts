import { Vector3d } from "../util/Vector3d.ts";
import * as uuid from 'uuid';
import * as cannon from "cannon";
import { WebSocket } from "ws";
import { SplatshooterServer } from "../SplatshooterServer.ts";

export { ServerPlayer };

class ServerPlayer
{
    readonly server: SplatshooterServer;
    readonly username: string;
    position: Vector3d;
    rotation: Vector3d;
    latency: number = 0;
    readonly uuid: string;
    team: number;
    body: cannon.Body;
    disconnecting: boolean = false;

    constructor(server: SplatshooterServer, username: string)
    {
        this.server = server;
        this.username = username;
        this.uuid = uuid.v4();
    }

    doTick ()
    {

    }

    getName ()
    {
        return this.username;
    }

    getX ()
    {
        return this.position.x;
    }
    getY ()
    {
        return this.position.y;
    }
    getZ ()
    {
        return this.position.z;
    }

    getUUID ()
    {
        return this.uuid;
    }

    getTeam ()
    {
        return this.team;
    }

    setTeam (team: number)
    {
        this.team = team;
    }
}