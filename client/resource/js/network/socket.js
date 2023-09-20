import { ChatHandler } from "../chat/ChatHandler.js";
import { SplatshooterClient } from "../client/SplatshooterClient.js";
import { LATEST_SERVER_VERSION, RENDERER, gameMain } from "../main.js";
import { loadModalHide } from "../ui/htmlgui.js";
import { Util } from "../util/Util.js";
import Message from "./Message.js";

class ClientPlayerMessageHandler
{
    /**
     * Creates a new message handler for the client.
     * @param {SplatshooterClient} client 
     * @param {WebSocket} socket 
     */
    constructor(client, socket)
    {
        this.client = client;
        this.socket = socket;

    }
    /**
     * Handles the server responding to the handshake request by setting the user's authorization token. (so that other scripts can't simply access it)
     * @param {any} handshake 
     */
    onHandshake(handshake)
    {
        console.log("Login handshake has been completed successfully and both the client and the server are now ready to connect.");
        this.authToken = handshake.authToken;
        loadModalHide();
    }

    onError(code)
    {
        console.error(code);
    }

    /**
     * Handles the server saying that the player has joined the game by initializing the renderer, loading the map, and other initialization things.
     * @param {any} loginMessage 
     */
    onLogin(loginMessage)
    {
        this.client.initRenderer();
    }

    /**
     * Handles a keep alive message by sending a keep alive request back
     * @param {any} keepAliveMessage 
     */
    onKeepAlive(keepAliveMessage)
    {
        this.send(new Message(Util.ServerboundMessageTypes.KEEPALIVE, { id: keepAliveMessage.id }));
    }

    onChat(chatMessage)
    {
        console.log(`[CHAT] ${chatMessage.text}`);
        this.client.chatHandler.addNewChatMessage(chatMessage.text);
    }

    /**
     * Compresses, adds the user's auth token to, and sends the message.
     * @param {Message} message 
     */
    send(message)
    {
        message.data.authToken = this.authToken;
        this.socket.send(message.compress());
    }

    disconnect(reason)
    {
        this.socket.close(null, reason);
    }

    /**
     * Register the socket handlers.
     */
    registerSocketHandlers()
    {
        this.socket.addEventListener("message", (message) =>
        {
            const uncompressed = JSON.parse(pako.inflate(message, { to: 'string' }));
            console.log(uncompressed);
            switch (uncompressed.dataType)
            {
                case Util.ClientboundMessageTypes.ERROR:
                    console.error("Error %d", uncompressed.data.code);
                    break;
                case Util.ClientboundMessageTypes.HANDSHAKE:
                    this.onHandshake(uncompressed.data);
                    break;
                case Util.ClientboundMessageTypes.LOGIN:
                    this.onLogin(uncompressed.data);
                    break;
                case Util.ClientboundMessageTypes.KEEPALIVE:
                    this.onKeepAlive(uncompressed.data);
                    break;
                case Util.ClientboundMessageTypes.CHAT:
                    this.onChat(uncompressed.data);
                    break;
                default:
                    break;
            }
        });
    }
}

export { ClientPlayerMessageHandler };

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
            case Util.ClientboundMessageTypes.LOGIN:
                gameMain();
                break;
            case Util.ClientboundMessageTypes.KEEPALIVE:
                const keepAlive = new Message(Util.ServerboundMessageTypes.KEEPALIVE, { id: uncompressed.data.id });
                this.socket.send(keepAlive.compress());
                break;
            case Util.ClientboundMessageTypes.CHAT:
                console.log(`[CHAT] ${uncompressed.data.text}`);
                ChatRenderer.renderChatMessage(uncompressed.data.text, RENDERER.renderer2D);
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
    const joinRequest = new Message(Util.ServerboundMessageTypes.LOGIN, { username: usernameValue, version: LATEST_SERVER_VERSION });
    CONNECTION.socket.send(joinRequest.compress());
}