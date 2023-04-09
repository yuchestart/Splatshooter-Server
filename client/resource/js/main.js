let CONFIG;
function main(){
  fetch("./config/client.json")
  .then(response=>{
    return response.json();
  })
  .then(json => {
    CONFIG = json;
  })
}
window.onload = main;
