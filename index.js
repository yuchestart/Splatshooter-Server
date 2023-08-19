const https = require("https");
const http = require("http");
const { WebSocketServer } = require("ws");
const fs = require("fs");
const pako = require('pako');
const version = require('./package.json').version;
const config = require('./config.json');

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
                const uncompressed = pako.inflate(msg, { to: 'string' });
                console.log("Recieved message: " + uncompressed);
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