//Import modules, such as WebSocketServer and Message
//import { WebSocketServer } from 'ws';
//import { Message } from "./server/messages.js";
//import * as http from "http"
//import express from "express"

const ws = require("ws");
const messages = require("./server/messages.js");
const http = require("http");
const express = require("express");
//Setup WSS and express
const wss = new ws.WebSocketServer({port: 8080});
const websockets = {};
const app = express()
const server = http.createServer(app)
app.use(express.static(__dirname + "/client"))
server.listen(8000, ()=>console.log("HTTP Listening on port 8000"))
//Setup WebSocket
function websocketConnected(websocket){
    var id=websockets.length;
    websockets[id] = websocket;
    websocket.send(new messages.Message("info","Hello World!"))
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