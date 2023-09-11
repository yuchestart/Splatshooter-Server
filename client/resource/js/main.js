import Message from "./network/Message.js";
import { CONNECTION, INIT_CONNECTION, SEND_JOIN_REQUEST } from "./network/socket.js";
import Renderer, { INIT_GAME } from "./render/Renderer.js";
import { Util } from "./util/Util.js";


let CONFIG;

export let RENDERER = null;

export const LATEST_SERVER_VERSION = "0.0";

//We start rolling first
function main()
{
  // step 0: make sure the load modal disappears when the animation is done
  document.getElementsByClassName("loadmodal")[0].addEventListener("animationend", (event) =>
  {
    event.target.classList.toggle("hidden");
  });
  // step 1: get the client
  fetch("./config/client.json")
    .then(response =>
    {
      return response.json();
    })
    .then(json =>
    {
      CONFIG = json;
    });
  // step 2: init the connection to the server
  // THIS WILL NOT BE ON PRODUCTION, AS THERE WILL BE MULTIPLE SERVERS.
  INIT_CONNECTION();
  document.getElementById("sixbattle").addEventListener("click", mouseEvent =>
  {
    mouseEvent.preventDefault();
    let usernameValue = document.getElementById("username").value;
    if (usernameValue)
    {
      SEND_JOIN_REQUEST(usernameValue);
    }
    else
    {
      alert("Please input a username!");
    }
  });
}
//After handshake complete, we start rolling
export function gameMain()
{
  /*
  var request = CONNECTION.newMessage("joinrequest",{
    matchtype:"insane",
    matchid:"random"
  })
  CONNECTION.socket.send(request)
  */
  RENDERER = new Renderer();
  RENDERER.INIT_RENDERER();
}
window.onload = main;