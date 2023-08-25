import { Vector3d } from "../util/Vector3d.ts";
import * as uuid from 'uuid';
import * as cannon from "cannon";

export { ServerPlayer };

class ServerPlayer
{
    readonly username: string;
    position: Vector3d;
    rotation: Vector3d;
    readonly uuid: string;
    team: number;
    body: cannon.Body;

    constructor(username: string)
    {
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