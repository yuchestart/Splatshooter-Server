import { gameMain } from "../main.js";
import { loadModalHide } from "../ui/htmlgui.js";
import { Util } from "../util/Util.js";
import Message from "./Message.js";

export const CONNECTION = {
    socket: undefined,
    id: undefined,
    parseMessage: function (message)
    {
        const uncompressed = JSON.parse(pako.inflate(message, { to: 'string' }));
        console.log(uncompressed.data);
        switch (uncompressed.dataType)
        {
            case -1:
                console.error("Error %d", uncompressed.data.code);
                break;
            case Util.ClientboundMessageTypes.HANDSHAKE:
                console.log("Handshake completed successfully.");
                this.id = message.data;
                loadModalHide();
                break;
            case 1:
                gameMain();
                break;
            case 2:
                const keepAlive = new Message(Util.ServerboundMessageTypes.KEEPALIVE, { id: uncompressed.data.id });
                this.socket.send(keepAlive.compress());
                break;
            default:
                break;
        }
    }
};

export function INIT_CONNECTION()
{
    CONNECTION.socket = new WebSocket("ws://localhost:6479");
    CONNECTION.socket.onclose = (event) =>
    {
        console.log("Socket closed");
        CONNECTION.socket = null;
    };
    CONNECTION.socket.addEventListener('open', (e) =>
    {
        const handshake = new Message(Util.ServerboundMessageTypes.HANDSHAKE, { intent: 'login' });
        CONNECTION.socket.send(handshake.compress());
    });
    CONNECTION.socket.addEventListener('message', (e) =>
    {
        e.data.arrayBuffer().then(data =>
        {
            CONNECTION.parseMessage(data);
        });
    });
}

export function SEND_JOIN_REQUEST(usernameValue)
{
    const joinRequest = new Message(Util.ServerboundMessageTypes.LOGIN, { username: usernameValue, version: "0.0" });
    CONNECTION.socket.send(joinRequest.compress());
}