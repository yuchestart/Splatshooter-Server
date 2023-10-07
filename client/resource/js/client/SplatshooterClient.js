import { ChatHandler } from "../chat/ChatHandler.js";
import Message from "../network/Message.js";
import { ClientPlayerMessageHandler } from "../network/ClientPlayerMessageHandler.js";
import { Renderer } from "../render/Renderer.js";
import { Util } from "../util/Util.js";
import { LATEST_SERVER_VERSION } from "../main.js";
import { AdHandler } from "../network/AdHandler.js";
import { Logger } from "../util/Logger.js";

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
     * The game client's chat handler.
     * @type {ChatHandler}
     */
    chatHandler;

    /**
     * The ad handler, responsible for handling interstital, banner, and rewarded ads.
     * Also manages ad blocker blocking.
     * @type {AdHandler}
     */
    adHandler;

    /**
     * The logger, logging everything it's told do with fancy colors.
     * @type {Logger}
     */
    logger;

    /**
     * Starts a new SplatshooterClient, which initializes the main menu.
     * @param {any} config 
     */
    constructor(config)
    {
        this.config = config;
        this.initElements();
        this.logger = new Logger("Splatshooter Client");
        this.adHandler = new AdHandler(this);
        this.adHandler.detectAdBlock();
    }

    initElements()
    {
        document.getElementById("sixbattle").addEventListener("click", mouseEvent =>
        {
            mouseEvent.preventDefault();
            let usernameValue = document.getElementById("username").value;
            if (usernameValue)
            {
                if (!this.messageHandler) this.startServerHandshake("ws://localhost:6479");
                else
                {
                    let loginPacket = new Message(Util.ServerboundMessageTypes.LOGIN, { username: usernameValue, version: LATEST_SERVER_VERSION });
                    this.messageHandler.send(loginPacket);
                }
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
        this.messageHandler.socket.addEventListener("open", () =>
        {
            this.messageHandler.registerSocketHandlers();
            this.messageHandler.send(new Message(Util.ServerboundMessageTypes.HANDSHAKE, { intent: "login" }));
        });
    }

    initRenderer()
    {
        this.renderer = new Renderer(this);
        this.chatHandler = new ChatHandler(this, this.renderer);
    }
}

export { SplatshooterClient };