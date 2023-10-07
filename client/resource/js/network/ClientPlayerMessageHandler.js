import { ChatHandler } from "../chat/ChatHandler.js";
import { SplatshooterClient } from "../client/SplatshooterClient.js";
import { LATEST_SERVER_VERSION } from "../main.js";
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
     * Handles the server responding to the handshake request by setting the user's authorization token. (so that external scripts can't simply access it)
     * @param {any} handshake 
     */
    onHandshake(handshake)
    {
        this.client.logger.info("Login handshake has been completed successfully and both the client and the server are now ready to connect.");
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
        if (this.authToken != null) message.data.authToken = this.authToken;
        console.log(message);
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
        this.socket.addEventListener("message", (event) =>
        {
            event.data.arrayBuffer().then(message =>
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
        });
    }
}

export { ClientPlayerMessageHandler };