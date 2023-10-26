import { NetworkTypes } from "../../../shared/CommonTypes.js";
import { SplatshooterClient } from "./client/SplatshooterClient.js";
import Message from "./network/Message.js";

let CONFIG;

let adsAreEnabled = true;

/**
 * @type {SplatshooterClient}
 */
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
}
window.onload = main;

sendChatMessage = function (textToSend)
{
  CLIENT.messageHandler.send(
    new Message(NetworkTypes.ServerboundMessageTypes.CHAT, { to: null, text: textToSend })
  );
};