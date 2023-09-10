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
import { WebSocketServer } from "ws";
import { APIHandler } from "./server/api/APIHandler.ts";
import { SplatshooterServer } from "./server/SplatshooterServer.ts";
import { Util } from "./server/util/Util.ts";


export { LOGGER };
const LOGGER = Util.getLogger("Splatshooter");

// INIT SERVER
if (config.server.host)
{
  LOGGER.info(`Splatshooter server - v${config.server.version}`);
  LOGGER.info("Loading...");

  LOGGER.info("Creating http server...");
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
    httpServer = http.createServer();
  }
  LOGGER.info("creating websocket server...");
  // Setup WSS
  const serverSocket = new WebSocketServer({ server: httpServer });
  const splatserver = new SplatshooterServer(serverSocket);
  httpServer.listen(config.server.port, () =>
  {
    splatserver.runServer();
    httpServer.on("request", (req, res) =>
    {
      APIHandler.handleServer(req, res, splatserver);
    });
  });


  LOGGER.info(`Server listening on port ${config.server.port}`);
}

if (config.client.host && config.server.host) LOGGER.info("-------------------------------------------");

if (config.client.host)
{
  LOGGER.info(`Splatshooter client - v${config.client.version}`);
  LOGGER.info("Loading...");

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


  LOGGER.info(`Client listening on port ${config.client.port}`);
}
LOGGER.info("Done.");