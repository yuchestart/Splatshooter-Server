import { SplatshooterClient } from "./client/SplatshooterClient.js";

let CONFIG;

let adsAreEnabled = true;

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