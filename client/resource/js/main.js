import Message from "./network/Message.js";
import { CONNECTION, INIT_CONNECTION, SEND_JOIN_REQUEST } from "./network/socket.js";
import { INIT_GAME } from "./render/Initialize.js"


let CONFIG;

export const LATEST_SERVER_VERSION = "0.0"

//We start rolling first
function main()
{

  document.getElementsByClassName("loadmodal")[0].addEventListener("animationend", (event) =>
  {
    event.target.classList.toggle("hidden")
  })

  fetch("./config/client.json")
    .then(response =>
    {
      return response.json();
    })
    .then(json =>
    {
      CONFIG = json;
    });
  INIT_CONNECTION()
  document.getElementById("sixbattle").addEventListener("click", mouseEvent =>
  {
    mouseEvent.preventDefault();
    let usernameValue = document.getElementById("username").value
    if (usernameValue)
    {
      const joinRequest = new Message(1, { username: usernameValue, version: LATEST_SERVER_VERSION })
      CONNECTION.socket.send(joinRequest.compress())
      SEND_JOIN_REQUEST(usernameValue)
    }
    else
    {
      alert("Please input a username!")
    }
  })
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
  INIT_GAME();
}
window.onload = main;