var app = require("express")();
var server = require('http').createServer(app).listen(8080);
var io = require("socket.io").listen(server);

