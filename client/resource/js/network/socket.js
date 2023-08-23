import { gameMain } from "../main.js";
import { loadModalHide } from "../ui/htmlgui.js";
import Message from "./Message.js"

const CONNECTION = {
    socket: undefined,
    id: undefined,
    parseMessage: function (message)
    {
        const uncompressed = JSON.parse(pako.inflate(message, { to: 'string' }));
        switch (uncompressed.dataType)
        {
            case -1:
                console.error("Error %d", uncompressed.data.code)
                break;
            case 0:
                console.log("Handshake completed successfully.")
                this.id = message.data;
                loadModalHide()
                gameMain()
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
        const handshake = new Message('handshake', { intent: 'query' }); // intent doesn't do anything (yet) but it's better than "Handshake start"
        const compressed = pako.deflate(JSON.stringify(handshake), { to: 'string' });
        CONNECTION.socket.send(compressed);
    })
    CONNECTION.socket.addEventListener('message', (e) =>
    {
        e.data.arrayBuffer().then(data =>
        {
            CONNECTION.parseMessage(data);
        })
    });
}