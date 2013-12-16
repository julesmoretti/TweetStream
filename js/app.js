var socket = io.connect('http://localhost');
socket.on('serverResponse', function (data) {
  console.log(data);
  socket.emit('clientResponse', 'Connected to client');
});
socket.on('tweets', function(tweet) {
  console.log(tweet);
});