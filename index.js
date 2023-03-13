
//Import modules, such as WebSocketServer and Message
import { WebSocketServer } from 'ws';
import { Message } from "./server/messages";
//Initialize variables
const wss = new WebSocketServer({port: 8080}); // Create new WebSocketServer
const websockets = {};

function websocketConnected(websocket){
    var id=websockets.length;
    websockets[id] = websocket;
    websocket.send(new Message("info","SPLATSHOOTER_CONNECTION_SUCCESSFUL"))
    websocket.on('message',
        function(msg){
            websocketRecievedMessage(websockets[websocket.id],msg)
        }
    );
    websocket.on('close',function(){
        websocketClose(websockets[websocket.id])
    });
}
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