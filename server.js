var express = require('express');

var app = express();
//var server = app.listen(3000);

// process.env.PORT is related to deploying on heroku
var server = app.listen(process.env.PORT || 3000, listen);

// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}

app.use(express.static('public'));

console.log("My socket server is running");

var socket = require('socket.io');

var io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket) {
  //  console.log('new connection: ' + socket.id);

    socket.on('start', startPlayer);
    
    socket.on('disconnect', disconnect);

    function startPlayer(data){

    }

    function disconnect(){

    }
}


