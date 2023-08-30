export { Util };

class Util
{
    static randomBetween (min: number, max: number)
    {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    public static readonly ServerboundMessageTypes: {
        DISCONNECT: -2;
        ERROR: -1;
        HANDSHAKE: 0;
        LOGIN: 1;
        KEEPALIVE: 2;
    };
    public static readonly ClientboundMessageTypes: {
        ERROR: -1;
        HANDSHAKE: 0;
        STATUS: 1;
        KEEPALIVE: 2;
    };
}