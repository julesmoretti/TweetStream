$(document).ready(function(){
    var container = document.getElementById( 'globe' );

    // Make the globe
    var globe = new DAT.Globe( container );

    // Begin animation
    globe.animate();

    var socket = io.connect('http://localhost');

    socket.on('serverResponse', function (data) {
      console.log(data);
      socket.emit('clientResponse', 'Connected to client');
    });

    socket.on('tweets', function(tweet) {

      // Calculate tweet velocity - tweets per second?
      // Show some sort of graph of tweet flow?

      console.log('Tweet coming in!');
      $('#tweetPreview').html(tweet.text);

      if(tweet.geo && tweet.geo.type === "Point") {
        console.log('Tweet with geo detected', tweet.geo);

        // Format data and add the maginitude.
        var data = [tweet.geo.coordinates[0], tweet.geo.coordinates[1], 0.3];
        globe.addData(data, { format: 'magnitude', animated: true });
        globe.createPoints();

      }
    });
});


