const https = require("https");
const http = require("http");
import WebSocketServer from "ws"
const fs = require("fs");
const pako = require('pako');
const messages = require("./src/messages.js");
const version = require('./package.json').version;
const config = require('./config.json');
const handler = require('./src/network/servernetworkinghandler.js')

// INIT
console.log("Splatshooter server - v" + version);
console.log("Loading...");

let server;

console.log("creating http server...");
// setup http server
if (config.secure) {
    server = https.createServer({
        cert: fs.readFileSync('./cert/certificate.pem'),
        key: fs.readFileSync('./cert/key.pem')
    });
} else {
    server = http.createServer();
}
console.log("creating websocket server...");
// Setup WSS
const serverSocket = new WebSocketServer({ server });

server.listen(config.port, (req, res) => {
    serverSocket.on('connection', (ws) => {
        ws.on('error', console.error);
        
        ws.on('message', (msg) => {
            if (isCompressed(msg, true)) {
                console.log("Recieved Message! Compressed data: " + msg)
                const uncompressed = pako.inflate(msg, { to: 'string' });
                console.log("Uncompressed data:" + uncompressed);
            }
        });
    });
})

function isCompressed(data, intended) {
    try {
        pako.inflate(data);
        return true;
    } catch (error) {
        if (intended) console.warn("Warning: unintended uncompressed data caught! Data: " + data)
        return false;
    }
  }

console.log("Server listening on port " + config.port)

console.log("Done.")