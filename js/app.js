$(document).ready(function() {
    var velocity = $('#tweetVelocity span');
    var preview = $('#tweetPreview');
    var container = document.getElementById( 'globe' );
    var globe = null;

    var calcVelo = function(d, t) {
      // FIXME: Math is WRONG.

      t = t || 5; // 5 seconds
      // t = t * 12;
      // d = d * 12;
      v = (d/t);

      return Math.floor(v);
    }
        

    var socket = io.connect('http://localhost');
    socket.on('serverResponse', function (data) {
      console.log(data);
      socket.emit('clientResponse', 'Connected to client');
    });
    // socket.on('streamStatus', function(data) {
    //   console.log('Twitter stream status:', data);
    // });


    // Capture keyword input
    $('#kwInput form').submit(function(e) {
      e.preventDefault();

      if(globe !== undefined) {
        // Make sure this actually deletes the globe;
        console.log('Deleting globe');
        $('#globe canvas').remove();
      }

      var keyword = $(this).find('input[name=keyword]').val();
      socket.emit('keyword', keyword);

      // Make the globe
      globe = new DAT.Globe( container );
      globe.animate();
    })

    var tweetNum = 0;
    socket.on('tweets', function(tweet) {

      // Check for globe, if not one create it.
      if(globe === null) {
        globe = new DAT.Globe( container );
        globe.animate();
      }
      // Add to total on each tweet.
      tweetNum += 1;

      // Calculate tweet velocity - tweets per minute?
      // Sample size is 5 seconds.
      setInterval(function(){
        velocity.html(calcVelo(tweetNum));
        // tweetNum = 0;
      }, 5000);
      // Show some sort of graph of tweet flow?

      console.log('Tweet coming in!');
      preview.html(tweet.text);

      if(tweet.geo && tweet.geo.type === "Point") {
        console.log('Tweet with geo detected', tweet.geo);

        // Format data and add the maginitude.
        var data = [tweet.geo.coordinates[0], tweet.geo.coordinates[1], 0.3];
        globe.addData(data, { format: 'magnitude' });
        // globe.addData(data, { format: 'magnitude', animated: true });
        globe.createPoints();

      }
    });
});


