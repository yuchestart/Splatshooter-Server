import { SplatshooterClient } from "./client/SplatshooterClient.js";
import Message from "./network/Message.js";
import { CONNECTION, INIT_CONNECTION, SEND_JOIN_REQUEST } from "./network/socket.js";
import { Renderer } from "./render/Renderer.js";
import { hideOverviewModal } from "./ui/htmlgui.js";
import { Util } from "./util/Util.js";


let CONFIG;

export let CLIENT;

export const LATEST_SERVER_VERSION = "0.0";

//We start rolling first
function main()
{
  // step 1: get the client config
  fetch("./config/client.json")
    .then(response =>
    {
      return response.json();
    })
    .then(json =>
    {
      CONFIG = json;
    });
  CLIENT = new SplatshooterClient(CONFIG);
  // step 2: init the connection to the server
  // THIS WILL NOT BE ON PRODUCTION, AS THERE WILL BE MULTIPLE SERVERS.
  INIT_CONNECTION();
  CLIENT.startServerHandshake();
}
//After handshake complete, we start rolling
export function gameMain()
{
  RENDERER = new Renderer();

  hideOverviewModal();
}
window.onload = main;