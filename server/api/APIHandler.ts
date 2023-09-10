import * as http from "http";
import { SplatshooterServer } from "../SplatshooterServer.ts";

export { APIHandler };

class APIHandler
{

    static handleServer (req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>, splatserver: SplatshooterServer)
    {
        switch (req.method)
        {
            case "POST":
                switch (req.url)
                {
                    case "/api/login":
                        // i'm just gonna leave this till more of the game is implemented :3
                        res.writeHead(501, { 'Content-Type': 'text/plain' });
                        res.end();
                        break;
                    default:
                        res.writeHead(501, { 'Content-Type': 'text/plain' });
                        res.end();
                        break;
                }
                break;
            case "GET":
                switch (req.url)
                {
                    case "/api/status":
                        if (splatserver == undefined)
                        {
                            res.writeHead(503, { 'Content-Type': 'text/plain' });
                            res.write("Server has not yet been defined!");
                            res.end();
                        }
                        else
                        {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.write(`{playersOnline:${splatserver.playerList.getPlayers().length},maxPlayers:${splatserver.playerList.getMax()}}`);
                            res.end();
                        }
                        break;
                    default:
                        res.writeHead(501, { 'Content-Type': 'text/plain' });
                        res.end();
                        break;
                }
                break;
            default:
                res.writeHead(501, { 'Content-Type': 'text/plain' });
                res.end();
                break;
        }

    }
}