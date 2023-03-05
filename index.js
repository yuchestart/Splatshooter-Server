
import { WebSocketServer } from 'ws'; // Import WebSocketServer
import { Message } from "./server/messages"

const wss = new WebSocketServer({port: 8080}); // Create new WebSocketServer

const websockets = {};
/**
 * 
 * @param {WebSocket} websocket 
 */
function websocketConnected(websocket){
    var id=websockets.length;
    websockets[id] = websocket;
    websocket.send(new Message("notification","You have successfully connected to Splatshooter Servers."))
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