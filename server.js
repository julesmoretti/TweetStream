var express = require('express');
var socketio = require('socket.io');
// var twitter = require('ntwitter');
var twitter = require('twitter');
var config = require('./config');


// Connect to twitter API
var twit = new twitter(config.twitter);

// TODO: Check for valid oAuth tokens before re-authenticating.
// twit.verifyCredentials(function (err, data) {
  // console.log('Twitter auth response', err);
// });


// Start up webserver.
var port = 3000;

var app = express();
app.get('/', function(req, res){
  res.sendfile(__dirname + '/index.html');
});

app.listen(port);
console.log('Express is running. Open http://localhost:' + port);