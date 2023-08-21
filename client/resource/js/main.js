import { INIT_GAME } from "./render/Initialize.js"

let CONFIG;
//We start rolling first
function main(){
  fetch("./config/client.json")
  .then(response=>{
    return response.json();
  })
  .then(json => {
    CONFIG = json;
  });
  
}
//After handshake complete, we start rolling
export function gameMain(){
  var request = CONNECTION.newMessage("joinrequest",{
    matchtype:"insane",
    matchid:"random"
  })
  CONNECTION.socket.send(request)
  INIT_GAME();
}
window.onload = main;