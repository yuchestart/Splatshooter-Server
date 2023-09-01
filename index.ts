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
4001: Client does not match version
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
import { APIHandler } from "./server/api/APIHandler.ts";
import { ServerPlayer } from "./server/player/ServerPlayer.ts";
import { SplatshooterServer } from "./server/SplatshooterServer.ts";
export let matchPlayers: Map<number, ServerPlayer>;
// INIT SERVER
if (config.server.host)
{

  console.log("Splatshooter server - v" + config.server.version);
  console.log("Loading...");

  console.log("creating http server...");
  // setup http server
  let httpServer: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse> | https.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;

  if (config.server.use_ssl)
  {
    httpServer = https.createServer({
      cert: fs.readFileSync(`./${config.server.ssl.certificate}`),
      key: fs.readFileSync(`./${config.server.ssl.key}`),
    });
  }
  else
  {
    httpServer = http.createServer(new APIHandler().handleServer);
  }
  console.log("creating websocket server...");
  // Setup WSS
  const serverSocket = new WebSocketServer({ server: httpServer });

  httpServer.listen(config.server.port, () =>
  {
    const splatserver = new SplatshooterServer(serverSocket);
    splatserver.runServer();
  });


  console.log("Server listening on port " + config.server.port);
}

if (config.client.host && config.server.host) console.log("-------------------------------------------");

if (config.client.host)
{
  console.log("Creating client...");

  const client_app = express();

  client_app.use(express.static('client'));

  let clientServer: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse> | https.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;

  if (config.client.use_ssl)
  {
    clientServer = https.createServer({
      cert: fs.readFileSync(`./${config.client.ssl.certificate}`),
      key: fs.readFileSync(`./${config.client.ssl.key}`),
    }, client_app);
  }
  else
  {
    clientServer = http.createServer(client_app);
  }
  clientServer.listen(config.client.port);

}
console.log("Done.");

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