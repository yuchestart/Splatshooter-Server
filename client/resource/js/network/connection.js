const CONNECTION = {
    socket:undefined,

}
CONNECTION.socket = new WebSocket(`ws://${PARAMETERS.HOST_ON_LOCAL_SERVER?PARAMETERS.LOCAL_URL:PARAMETERS.DEPLOYMENT_URL}`)
socket.addEventListener('open',(e)=>{
    socket.send("Hello server!")
})
socket.addEventListener('message',(e)=>{
    console.log('I heard this: ',e.data);
})