import { PlayerList } from "../player/PlayerList.ts";
import { ServerPlayer } from "../player/ServerPlayer.ts";
import { Logger } from "./Logger.ts";
import crypto from 'crypto';

export { Util, NetworkTypes };

class Util
{
    static randomBetween (min: number, max: number)
    {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    public static canPlayerJoin (message)
    {

    }

    public static getLogger (name: String)
    {
        return new Logger(name);
    }

    public static getAuthToken (length: number = 10, encoding: 'hex' | 'base64' = 'hex'): string
    {
        // Calculate the number of bytes needed to get the desired length
        const bytes = Math.ceil(length / 2);

        // Generate random bytes and convert them to a string
        const buffer: Buffer = crypto.randomBytes(bytes);
        const string = buffer.toString(encoding); // note: vscode says that this is an error but it compiles fine. thanks node

        // Return the string truncated to the desired length
        return string.slice(0, length);
    }
}

class NetworkTypes
{
    static ServerboundMessageTypes = {
        ERROR: -1,
        HANDSHAKE: 0,
        LOGIN: 1,
        KEEPALIVE: 2,
        CHAT: 3
    };
    static ClientboundMessageTypes = {
        DISCONNECT: -2,
        ERROR: -1,
        HANDSHAKE: 0,
        STATUS: 1,
        KEEPALIVE: 2,
        INFO: 3,
        LOGIN: 4,
        NEWPLAYER: 5,
        REMOVEPLAYER: 6,
        CHAT: 7,
        HEALTHUPDATE: 8
    };
}