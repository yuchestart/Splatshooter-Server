import { gameMain } from "../main.js";
import * as Message from "./Message.js"

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
        switch(message.type){
            case "info":
                console.log(message.data)
            case "matchjoin":
                break;
            case "handshake":
                console.log("Handshake completed successfully.")
                this.id = message.data;
                loadModalHide()
                gameMain()
        }
    }
}

CONNECTION.socket = new WebSocket("ws://localhost:6479")
CONNECTION.socket.addEventListener('open',(e)=>{
    const handshake = new Message(CONNECTION.newMessage('handshake', { intent: 'load' }), "json"); // intent doesn't do anything (yet) but it's better than "Handshake start"
    const compressed = pako.deflate(JSON.stringify(handshake), { to: 'string' })
    CONNECTION.socket.send(compressed)
})
CONNECTION.socket.addEventListener('message',(e)=>{
    CONNECTION.parseMessage(JSON.parse(e.data))
})