
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
    websocket.on('message',
    function(msg){
        websocketRecievedMessage(websockets[websocket.id],msg)
    }
    )
    websocket.on('close',function(){
        websocketClose(websockets[websocket.id])
    })
}
/**
 * 
 * @param {String} message 
 */
function websocketRecievedMessage(ws,message){
    message = JSON.parse(message)
    switch(message.type){
        case "message":
            console.log(`New message from WebSocket #${ws.id}`)
            console.log(message.data);
            break;
    }
}
function websocketClose(ws){
    websockets[ws.id] = undefined;
}
wss.on('connection',websocketConnected)