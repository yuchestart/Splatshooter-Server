import * as http from "http"

export { APIHandler }

class APIHandler
{
    constructor() { }

    handleServer(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>)
    {
        switch (req.method) {
            case "post":
                switch (req.url) {
                    case "/api/login":

                        const headers = req.headers;
                        const usr = headers.location;
                        // i'm just gonna leave this till more of the game is implemented :3
                        res.writeHead(501, { 'Content-Type': 'text/plain' });
                        res.write(req.url);
                        res.end();
                        break;
                    default:
                        res.writeHead(501, { 'Content-Type': 'text/plain' });
                        res.write(req.url);
                        res.end();
                        break;
                }
                break;

            default:
                res.writeHead(501, { 'Content-Type': 'text/plain' });
                res.write(req.url);
                res.end();
                break;
        }

    }
}