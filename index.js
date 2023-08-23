/*
MESSAGE TYPES:
-1: Error
0: Handshake


ERROR CATEGORIZATION:
1xxx: Network
2xxx: Database (eventually, for login)
3xxx: Input Validation
4xxx: Application errors

*/

const https = require("https");
const http = require("http");
const { WebSocketServer } = require("ws");
const fs = require("fs");
const pako = require("pako");
const version = require("./package.json").version;
const config = require("./config.json");
const { Message } = require("./src/network/messages/Message.js");
const {
  ServerHandshakeHandler,
} = require("./src/network/ServerHandshakeHandler.js");

// INIT
console.log("Splatshooter server - v" + version);
console.log("Loading...");

let server;

console.log("creating http server...");
// setup http server
if (config.secure)
{
  server = https.createServer({
    cert: fs.readFileSync("./cert/certificate.pem"),
    key: fs.readFileSync("./cert/key.pem"),
  });
} else
{
  server = http.createServer();
}
console.log("creating websocket server...");
// Setup WSS
const serverSocket = new WebSocketServer({ server });

server.listen(config.port, (req, res) =>
{
  serverSocket.on("connection", (ws) =>
  {
    console.log("creating network handlers for new connection...");

    const networkHandshakeHandler = new ServerHandshakeHandler(ws);

    ws.on("error", console.error);

    ws.on("message", (msg) =>
    {
      if (isCompressed(msg, true))
      {
        const uncompressed = JSON.parse(pako.inflate(msg, { to: "string" }));
        if (typeof uncompressed.dataType != "number")
        {
          let errorMessage = new Message(-1, { code: 3001 });
          ws.send(errorMessage.compress());
          return;
        }
        switch (uncompressed.dataType)
        {
          case 0:
            networkHandshakeHandler.onHandshake(uncompressed.data);
            break;

          default:
            break;
        }
      }
    });
  });
});

function isCompressed(data, intended)
{
  try
  {
    pako.inflate(data);
    return true;
  } catch (error)
  {
    if (intended)
      console.warn(
        "Warning: unintended uncompressed data caught! Data: " + data
      );
    return false;
  }
}

console.log("Server listening on port " + config.port);

console.log("Done.");
