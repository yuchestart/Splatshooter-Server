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
                        // i'm just gonna leave this till more of the game is implemented
                        res.writeHead(501, { 'Content-Type': 'text/plain' });
                        res.end();
                        break;
                    default:
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.write(JSON.stringify
                            ({
                                message: "API path not found. Are you using the wrong request method?"
                            })
                        );
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
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.write(JSON.stringify
                                ({
                                    message: "No server to recieve information from."
                                })
                            );
                            res.end();
                        }
                        else
                        {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.write(JSON.stringify
                                ({
                                    players_online: splatserver.playerList.getPlayers().length,
                                    max_players: splatserver.playerList.getMax()
                                })
                            );
                            res.end();
                        }
                        break;
                    default:
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.write(JSON.stringify
                            ({
                                message: "API path not found. Are you using the wrong request method?"
                            })
                        );
                        res.end();
                        break;
                }
                break;
            default:
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.write("Request method not implemented.");
                res.end();
                break;
        }

    }
}