import { Vector3d } from "../util/Vector3d.ts";
import * as uuid from 'uuid';
import CANNON from "cannon";
import { WebSocket } from "ws";
import { SplatshooterServer } from "../SplatshooterServer.ts";
import { ServerPlayerMessageHandler } from "../network/ServerPlayerMessageHandler.ts";

export { ServerPlayer };

class ServerPlayer
{
    readonly server: SplatshooterServer;
    readonly username: string;
    private position: Vector3d;
    private rotation: Vector3d;
    public latency: number = 0;
    readonly uuid: string;
    team: number;
    private body: CANNON.Body;
    public connection: ServerPlayerMessageHandler;
    disconnecting: boolean = false;

    constructor(server: SplatshooterServer, username: string)
    {
        this.server = server;
        this.username = username;
        this.body = new CANNON.Body({ fixedRotation: true });
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
    getPosition ()
    {
        return this.position;
    }
    getRotation ()
    {
        return this.rotation;
    }
    getBody ()
    {
        return this.body;
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