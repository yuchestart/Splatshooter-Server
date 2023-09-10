export { Util }

class Util
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
        CHAT: 3
    };

}