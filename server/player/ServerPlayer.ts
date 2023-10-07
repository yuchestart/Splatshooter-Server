import * as uuid from 'uuid';
import { Body, Quaternion, Vec3 } from "cannon-es";
import { WebSocket } from "ws";
import { SplatshooterServer } from "../SplatshooterServer.ts";
import { ServerPlayerMessageHandler } from "../network/ServerPlayerMessageHandler.ts";

export { ServerPlayer };

/**
 * The player object for the game most non-physics player calculations are managed here.
 * Things such as position are handled by the physics engine.
 */
class ServerPlayer
{
    readonly server: SplatshooterServer;
    readonly username: string;
    private position: Vec3;
    private rotation: Vec3;
    public latency: number = 0;
    readonly uuid: string;
    team: number;
    private body: Body;
    public connection: ServerPlayerMessageHandler;
    disconnecting: boolean = false;

    constructor(server: SplatshooterServer, username: string)
    {
        this.server = server;
        this.username = username;
        this.body = new Body({ fixedRotation: true });
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
        return this.body.position.x;
    }
    getY ()
    {
        return this.body.position.y;
    }
    getZ ()
    {
        return this.body.position.z;
    }
    getPosition ()
    {
        return this.body.position;
    }
    /**
     * Returns the rotation of the player's body as a Euler angle. Please note that it is not actually a vector, `Vec3` is just a simple method of storing three numbers, so it is being used here.
     * @returns A `Vec3` containing the rotation.
     */
    getRotationEuler (): Vec3
    {
        let QRot: Quaternion = this.body.quaternion;
        QRot.toEuler(this.getPosition());
        return new Vec3(QRot.x, QRot.y, QRot.z);
    }

    getRotationQuaternion (): Quaternion
    {
        return this.body.quaternion;
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