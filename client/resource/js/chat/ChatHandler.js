import { SplatshooterClient } from "../client/SplatshooterClient";

class ChatHandler
{
    /**
     * @type {string[]}
     */
    chatHistory;

    /**
     * @type { CanvasRenderingContext2D }
     */
    renderer;

    /**
     * 
     * @param {SplatshooterClient} client 
     * @param {CanvasRenderingContext2D} renderer 
     */
    constructor(client, renderer)
    {
        this.client = client;
        this.renderer = renderer;
        this.renderer.font = "40px Arial";
        this.renderer.fillStyle = "white";
    }

    addNewChatMessage(message)
    {
        chatHistory.push(message);
    };

    /**
     * 
     * @param {string} message
     */
    renderChatMessage(message)
    {
        const startingX = this.renderer.canvas.width / 10;
        const startingY = this.renderer.canvas.height / 1.1;
        const rectWidth = this.renderer.canvas.width / 4;
        this.chatHistory.forEach((chat, index) =>
        {
            if (index > 5) return;
            this.renderer.fillStyle = "gray";
            this.renderer.globalAlpha = 0.4;
            this.renderer.fillRect(startingX, startingY - index * 25, rectWidth, 40);
            this.renderer.fillStyle = "white";
            this.renderer.globalAlpha = 1;
            this.renderer.fillText(chat, startingX, startingY - index * 25);
        });
    }
}

export { ChatHandler };