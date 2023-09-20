import { ChatHandler } from "../chat/ChatHandler.js";
import Message from "../network/Message.js";
import { ClientPlayerMessageHandler } from "../network/socket.js";
import { Renderer } from "../render/Renderer.js";
import { Util } from "../util/Util.js";

class SplatshooterClient
{

    config;
    messageHandler;

    /**
     * The game client's main renderer. 
     * @type {Renderer}
     */
    renderer;

    /**
     * 
     * @type {ChatHandler}
     */
    chatHandler;

    /**
     * Starts a new SplatshooterClient, which initializes the main menu.;
     * @param {any} config 
     */
    constructor(config)
    {
        this.config = config;
        this.initElements();
    }

    initElements()
    {
        document.getElementById("sixbattle").addEventListener("click", mouseEvent =>
        {
            mouseEvent.preventDefault();
            let usernameValue = document.getElementById("username").value;
            if (usernameValue)
            {
                this.startServerHandshake("ws://localhost:6479");
            }
            else
            {
                alert("Please input a username!");
            }
        });
        document.getElementsByClassName("loadmodal")[0].addEventListener("animationend", (event) =>
        {
            event.target.classList.toggle("hidden");
        });
    }

    /**
     * Immediately connect to the given server. This includes showing the loading modal, and initializing all socket listeners.
     * @param {string} url 
     */
    startServerHandshake(url)
    {
        this.messageHandler = new ClientPlayerMessageHandler(this, new WebSocket(url));
        this.messageHandler.registerSocketHandlers();
        this.chatHandler = new ChatHandler(this, this.renderer);
        this.messageHandler.send(new Message(Util.ServerboundMessageTypes.HANDSHAKE, { intent: "login" }));
    }

    initRenderer()
    {
        this.renderer = new Renderer(this);
        this.chatHandler = new ChatHandler(this, this.renderer);
    }
}

export { SplatshooterClient };