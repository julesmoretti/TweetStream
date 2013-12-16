var express = require('express');
var socketio = require('socket.io');
var twitter = require('twitter');
var config = require('./config');




// Start up webserver.
var port = 3000;

var app = express();
var io = socketio.listen(app.listen(port));

app.get(/^(.+)$/, function(req, res){ 
  console.log('static file request : ' + req.params);
  res.sendfile( __dirname + req.params[0]); 
});
console.log('Express is running. Open http://localhost:' + port);

// Setup the user sockets.
io.sockets.on('connection', function (socket) {
  socket.emit('serverResponse', 'Connected to server');
  socket.on('clientResponse', function (data) {
    console.log(data);
  });
});


// Connect to twitter API
var twit = new twitter(config.twitter);

// TODO: Check for valid oAuth tokens before re-authenticating.
// twit.verifyCredentials(function (err, data) {
//   console.log('Twitter auth response', err);
// });

var startStream = function() {
  console.log('Twitter OK');
  console.log('Starting Twitter stream');

  twit.stream('statuses/filter', { track: ['nodejs'] }, function(stream, error) {
    console.log('Stream responded with', stream);

    //We have a connection. Now watch the 'data' event for incomming tweets.
    stream.on('data', function(tweet) {
   
      //Make sure it was a valid tweet
      if (tweet.text !== undefined) {
        io.sockets.emit('Tweet data:', tweet);
      }

    });

    setTimeout(function(){
      console.log('Closing Twitter streaming connection');
      stream.destroy();
    }, 5000);

  });
}

twit.verifyCredentials(function(response) {
  // console.log('Twitter auth response', response);
  console.log('Authorizing with Twitter');

  if(response.errors) {
    console.log('Twitter Auth Error:', response.errors);
  } else {
    startStream();
  }
});

