//Import modules, such as WebSocketServer and Message
//import { WebSocketServer } from 'ws';
//import { Message } from "./server/messages.js";
//import * as http from "http"
//import express from "express"

console.log("----SPLATSHOOTER INTERNAL SERVERS----")
console.log("Loading...")
const ws = require("ws");
const messages = require("./server/messages.js");
const http = require("http");
const express = require("express");
//Setup WSS and express
const wss = new ws.WebSocketServer({port: 8080});
let websockets = [];
const matches = {};
const app = express()
const server = http.createServer(app)
app.use(express.static(__dirname + "/client"))
console.log("Done.")
server.listen(8000, ()=>console.log("HTTP listening on port 8000"))
console.log("WebSocket listening on port 8080")
//Setup WebSocket
function websocketConnected(ws){
    ws.on('message',recievedMessage)
    ws.on('close',()=>{webSocketClose(ws)})
    websockets.push(ws)
    ws.id = websockets.length-1
}
function recievedMessage(message){
    message = JSON.parse(message)
    switch(message.type){
        case "handshake":
            this.send(messages.Message(
                "handshake",
                websockets.length-1
            ))
            break;
        case "joinrequest":
            console.log(`Join request recieved for ${message.senderId}`)
            console.log(`Match requested: ${message.data.matchtype}`)
            console.log(`Match ID Requested: ${message.data.matchid}`)
            break;
    }
}
function webSocketClose(ws){
    console.log(`Connection with socket #${ws.id} has been terminated.`)
    websockets = websockets.filter(s => s!== ws)
}
wss.on('connection',websocketConnected)