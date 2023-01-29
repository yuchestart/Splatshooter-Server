//ALERT: DO NOT TOUCH!
'use strict';
let http = require("http");
let express = require("express");
let socketio = require("socket.io");

let app = express();
let server = http.createServer(app);
let io = socketio(server);

io.on("connection",(sock)=>{
    sock.emit("msg","Emotional damage")
})

app.use(express.static(__dirname+"/client"))

server.listen(8080, ()=>{
    console.log("Server started successfully.");
    console.log("Che Yu was here. hahahaha");
});