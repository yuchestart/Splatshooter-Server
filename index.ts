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
//CLIENT
import express from "express";
//SERVER
import config from "./splatshooter_config.json" assert {type: "json"};
import https from "https";
import http from "http";
import fs from "fs";
import pako from "pako";
import WebSocket, { WebSocketServer } from "ws";
import { Message } from "./server/network/messages/Message.ts";
import { ServerHandshakeHandler } from "./server/network/ServerHandshakeHandler.ts";
import { APIHandler } from "./server/api/APIHandler.ts";
import { ServerPlayerInteractionHandler } from "./server/network/ServerPlayerInteractionHandler.ts";
import { ServerPlayer } from "./server/player/ServerPlayer.ts";
// INIT SERVER
if (config.server.host)
{
  console.log("Splatshooter server - v" + config.server.version);
  console.log("Loading...");

  console.log("creating http server...");
  // setup http server

  let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse> | https.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;

  if (config.server.ssl)
  {
    server = https.createServer({
      cert: fs.readFileSync(`./${config.server.ssl.certificate}`),
      key: fs.readFileSync(`./${config.server.ssl.certificate}`),
    });
  }
  else
  {
    server = http.createServer(new APIHandler().handleServer);
  }
  console.log("creating websocket server...");
  // Setup WSS
  const serverSocket = new WebSocketServer({ server });

  server.listen(config.server, () =>
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
        if (isCompressed(msg, true))
        {
          const uncompressed = JSON.parse(pako.inflate(msg as Buffer, { to: 'string' }));
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
            case 1:

              break;

            default:
              break;
          }
        }
      });
    });
  });

  function isCompressed (data: string | ArrayBuffer | Buffer[], intended: boolean)
  {
    try
    {
      pako.inflate(data as Buffer);
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

  console.log("Server listening on port " + config.server.port);
}

if (config.client.host && config.server.host) console.log("-------------------------------------------");

if (config.client.host)
{
  console.log("Creating client...");

  const client_app = express();

  client_app.use(express.static('client'));

  let clientServer: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse> | https.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;

  if (config.client.ssl)
  {
    clientServer = https.createServer({
      cert: fs.readFileSync(`./${config.server.ssl.certificate}`),
      key: fs.readFileSync(`./${config.server.ssl.certificate}`),
    }, client_app);
  }
  else
  {
    clientServer = http.createServer(client_app);
  }

  clientServer.listen(443);
}
console.log("Done.");
