/*
MESSAGE TYPES:
-1: Error
0: Handshake


ERROR CATEGORIZATION:
1xxx: Network
2xxx: Database (eventually, for login)
3xxx: Input Validation
3001: Message type isn't number
3002: Message data isn't specified
4xxx: Application errors

*/

import https from "https";
import http from "http";
import { WebSocketServer } from "ws";
import pako from "pako";
import packageJSON from "./package.json" assert {type: "json"};
const version = packageJSON.version;
import config from "./config.json" assert {type: "json"};
import { Message } from "./src/network/messages/Message.ts";
import { ServerHandshakeHandler } from "./src/network/ServerHandshakeHandler.ts";
import { APIHandler } from "./src/api/APIHandler.ts";
import WebSocket from 'ws';
import { ServerPlayerInteractionHandler } from "./src/network/ServerPlayerInteractionHandler.ts";
import { ServerPlayer } from "./src/server/ServerPlayer.ts";
// INIT
console.log("Splatshooter server - v" + version);
console.log("Loading...");

console.log("creating http server...");
// setup http server

let api = new APIHandler();

let server = http.createServer(api.handleServer);

/*
if (config.secure)
{
  server = https.createServer({
    cert: fs.readFileSync("./cert/certificate.pem"),
    key: fs.readFileSync("./cert/key.pem"),
  });
} else
{
  
  server = http.createServer();
}*/
console.log("creating websocket server...");
// Setup WSS
const serverSocket = new WebSocketServer({ server });

server.listen(config.port, () =>
{
  serverSocket.on("connection", (ws: WebSocket) =>
  {
    console.log("creating network handlers for new connection...");

    const networkHandshakeHandler = new ServerHandshakeHandler(ws);
    let player: ServerPlayer;
    let playerInteractionHandler;
    ws.on("error", console.error);

    ws.on("message", (msg) =>
    {
      if (isCompressed(msg, true)) {
        const uncompressed = JSON.parse(pako.inflate(msg as Buffer, { to: 'string' }));
        if (typeof uncompressed.dataType != "number") {
          let errorMessage = new Message(-1, { code: 3001 });
          ws.send(errorMessage.compress());
          return;
        }
        switch (uncompressed.dataType) {
          case 0:
            networkHandshakeHandler.onHandshake(uncompressed.data);
            break;
          case 1:

            break;

          default:
            break;
        }
      }
    });
  });
});

function isCompressed(data: string | ArrayBuffer | Buffer[], intended: boolean)
{
  try {
    pako.inflate(data as Buffer);
    return true;
  } catch (error) {
    if (intended)
      console.warn(
        "Warning: unintended uncompressed data caught! Data: " + data
      );
    return false;
  }
}

console.log("Server listening on port " + config.port);

console.log("Done.");
