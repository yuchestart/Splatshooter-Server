const CONNECTION = {
    socket:undefined,
    id:undefined,
    newMessage:function(type,data){
        return JSON.stringify({
            type:type,
            data:data,
            timestamp:new Date().toString(0)
        })
    },
    parseMessage:function(message){
        switch(message.type){
            case "info":
                console.log(message.data)
            case "matchjoin":
                break;
            case "handshake":
                console.log("Handshake completed successfully.")
                this.id = message.data;
                loadModalHide()
        }
    }
}

CONNECTION.socket = new WebSocket("ws://localhost:8080")
CONNECTION.socket.addEventListener('open',(e)=>{
    CONNECTION.socket.send(CONNECTION.newMessage("handshake","Handshake start"))
    console.log("WebSocket Handshake started")
})
CONNECTION.socket.addEventListener('message',(e)=>{
    CONNECTION.parseMessage(JSON.parse(e.data))
})