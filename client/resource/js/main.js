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
function gameMain(){
  var request = CONNECTION.newMessage("joinrequest",{
    matchtype:"insane",
    matchid:"random"
  })
  CONNECTION.socket.send(request)
}
window.onload = main;