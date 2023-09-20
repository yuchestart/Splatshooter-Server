import { PlayerList } from "../player/PlayerList.ts";
import { ServerPlayer } from "../player/ServerPlayer.ts";
import { Logger } from "./Logger.ts";

export { Util };

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

    public static readonly ServerboundMessageTypes = {
        ERROR: -1,
        HANDSHAKE: 0,
        LOGIN: 1,
        KEEPALIVE: 2,
        CHAT: 3
    };
    public static readonly ClientboundMessageTypes = {
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