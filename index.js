const https = require("https");
const http = require("http");
const ws = require("ws");
const fs = require("fs");
const messages = require("./src/messages.js");
const version = require('./package.json').version;
const config = require('./config.json');

// INIT
console.log("Splatshooter server - v" + version);
console.log("Loading...");

let server;

// setup http server
if (config.secure) {
    server = https.createServer({
        cert: fs.readFileSync('./cert/certificate.pem'),
        key: fs.readFileSync('./cert/key.pem')
    });
} else {
    server = http.createServer();
}

// Setup WSS
const serverSocket = new ws.WebSocketServer({ server });

let websockets = [];

const matches = {};
console.log("Done.")
console.log("WebSocket listening on port " + wss.port)


// Setup WebSocket
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
        case "matchtransformrequest":
            break;
    }
}
function webSocketClose(ws){
    console.log(`Connection with socket #${ws.id} has been terminated.`)
    websockets = websockets.filter(s => s!== ws)
}

server.listen(config.port, (req, res) => {
    
})