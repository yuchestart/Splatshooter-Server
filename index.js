'use strict';
let http = require("http");
let express = require("express");

let app = express();
let server = http.createServer(app);

app.use(express.static(__dirname+"/client"))

server.listen(8080, ()=>{
    console.log("Server started successfully.");
    console.log("Pow pow pow paam bow bum bum pow bam bum bum baw baw baw baw bababa bow!")
});