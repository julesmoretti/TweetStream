var express = require('express');
var socketio = require('socket.io');
var twitter = require('twitter');
var config = require('./config');

var connectedCount = 0;
// var streamStatus = 'not connected';


// Start up webserver.
var port = 3000;

var app = express();
var io = socketio.listen(app.listen(port), { log: false });

app.get(/^(.+)$/, function(req, res){ 
  console.log('static file request : ' + req.params);
  res.sendfile( __dirname + req.params[0]); 
});
console.log('Express is running. Open http://localhost:' + port);

// Setup the user sockets.
io.sockets.on('connection', function (socket) {
  connectedCount++;
  console.log('Number of clients connected', connectedCount);

  // socket.emit('streamStatus', streamStatus);
  socket.emit('serverResponse', 'Connected to server');
  socket.on('clientResponse', function (data) {
    console.log(data);
  });

  // On keyword submit, start new stream.
  socket.on('keyword', function(keyword) {
    console.log('Starting new stream with keyword:', keyword);
    var twit = new twitter(config.twitter);
    startStream(keyword);
  });

  socket.on('disconnect', function () {
    connectedCount--;
  });
});


// Connect to twitter API
var twit = new twitter(config.twitter);

var startStream = function(keyword) {
  console.log('Twitter OK');
  console.log('Starting Twitter stream');

  twit.stream('filter', { track: [keyword], location: [-180, -90, 180, 90] }, function(stream, error) {
    // console.log('Stream responded with', stream);
    // streamStatus = 'connected';
    // io.sockets.emit('streamStatus', streamStatus);

    // We have a connection. Now watch the 'data' event for incomming tweets.
    stream.on('data', function(tweet) {
      
      // Only send partial data across wire.
      var trimmedTweet = {};
      trimmedTweet.text = tweet.text;

      if(tweet.geo) {
        trimmedTweet.geo.coordinates = tweet.geo.coordinates;
        trimmedTweet.place.full_name = tweet.place.full_name;
        trimmedTweet.place.country = tweet.place.country;
      }

      io.sockets.emit('tweets', trimmedTweet);
    });

    var connectionCheck = setInterval(function(){
      // console.log('Connected count is:', connectedCount);

      // FIXME: check if there's a stream to close.
      if(connectedCount < 1) {
        console.log('Closing Twitter streaming connection');
        stream.destroy();
        clearInterval(connectionCheck);
      }
    }, 1000);

  });
}

// startStream('santa');

// FIXME: On interval, check if socket connections are still valid.



