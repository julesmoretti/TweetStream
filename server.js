var express = require('express');
var socketio = require('socket.io');
var twitter = require('ntwitter');
var config = require('./config');

// Start up webserver.
var port = 3000;

var app = express();
app.get('/', function(req, res){
  res.sendfile(__dirname + '/public/index.html');
});

app.listen(port);
console.log('Express is running. Open http://localhost:' + port);