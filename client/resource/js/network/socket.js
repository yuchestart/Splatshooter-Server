import { gameMain } from "../main.js";
import { loadModalHide } from "../ui/htmlgui.js";
import Message from "./Message.js"

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
                console.error("Error %d", uncompressed.data.code)
                break;
            case 0:
                console.log("Handshake completed successfully.")
                this.id = message.data;
                loadModalHide()
                break;
            case 1:
                gameMain();
                break;
            case 2:
                console.log("keep aldive")
                const keepAlive = new Message(2, { id: uncompressed.data.id })
                this.socket.send(keepAlive.compress());
                break;
            default:
                break;
        }
    }
}

export function INIT_CONNECTION()
{
    CONNECTION.socket = new WebSocket("ws://localhost:6479");
    CONNECTION.socket.onclose = (event) =>
    {
        console.log(event);
    };
    CONNECTION.socket.addEventListener('open', (e) =>
    {
        const handshake = new Message(0, { intent: 'login' });
        CONNECTION.socket.send(handshake.compress());
    })
    CONNECTION.socket.addEventListener('message', (e) =>
    {
        e.data.arrayBuffer().then(data =>
        {
            CONNECTION.parseMessage(data);
        })
    });
}

export function SEND_JOIN_REQUEST(usernameValue)
{
    const joinRequest = new Message(1, { username: usernameValue, version: "0.0" })
    CONNECTION.socket.send(joinRequest.compress())
}