
import { WebSocketServer } from 'ws'; // Import WebSocketServer

const wss = new WebSocketServer({port: 8080}); // Create new WebSocketServer
const websockets = {};
/**
 * 
 * @param {WebSocket} websocket 
 */
function websocketConnected(websocket){
    websocket.id=websockets.length;
    websockets[websocket.id] = websocket;
    websocket.on('message',websocketRecievedMessage)
    websocket.on('close',websocketClose)
}
/**
 * 
 * @param {String} message 
 */
function websocketRecievedMessage(message){
    message = JSON.parse(message)
    switch(message.type){
        case "message":
            console.log(`New message from WebSocket #${this.id}`)
            console.log(message.data);
            break;
    }
}
function websocketClose(){
    websockets[this.id] = undefined;
}
wss.on('connection',websocketConnected)