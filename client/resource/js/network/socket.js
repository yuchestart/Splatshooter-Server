import { gameMain } from "../main.js";
import { loadModalHide } from "../ui/htmlgui.js";
import Message from "./Message.js"

const CONNECTION = {
    socket:undefined,
    id:undefined,
    newMessage:function(type,data){
        return JSON.stringify({
            type:type,
            data:data,
            senderId:this.id,
            timestamp: null // for debugging purposes, change later...
        })
    },
    parseMessage:function(message){
        const uncompressed = JSON.parse( pako.inflate(message, { to: 'string' }) );
        switch (uncompressed.dataType) {
            case "json":
                if (uncompressed.data.type === "handshake") {
                    console.log("Handshake completed successfully.")
                    this.id = message.data;
                    loadModalHide()
                    gameMain()
                }
                break;
                
            default:
                break;
        }
    }
}

export function INIT_CONNECTION() {
    CONNECTION.socket = new WebSocket("ws://localhost:6479");
    CONNECTION.socket.addEventListener('open',(e)=>{
        const handshake = new Message({ type: 'handshake', data: { intent: 'client' } }, "json"); // intent doesn't do anything (yet) but it's better than "Handshake start"
        const compressed = pako.deflate(JSON.stringify(handshake), { to: 'string' });
        CONNECTION.socket.send(compressed);
    })
    CONNECTION.socket.addEventListener('message',(e)=>{
        e.data.arrayBuffer().then(data => {
            CONNECTION.parseMessage(data);
        })
    });
}