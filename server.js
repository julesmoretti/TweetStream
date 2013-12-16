var express = require('express');
var socketio = require('socket.io');
var twitter = require('twitter');
var config = require('./config');


// Connect to twitter API
// var twit = new twitter(config.twitter);

// TODO: Check for valid oAuth tokens before re-authenticating.
// twit.verifyCredentials(function (err, data) {
  // console.log('Twitter auth response', err);
// });


// Start up webserver.
var port = 3000;

var app = express();
var io = socketio.listen(app.listen(port));

app.get(/^(.+)$/, function(req, res){ 
  console.log('static file request : ' + req.params);
  res.sendfile( __dirname + req.params[0]); 
});
console.log('Express is running. Open http://localhost:' + port);

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});