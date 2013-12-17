$(document).ready(function() {

  var veloPlace = $('.tweetVelocity').find('.target');
  var numPlace = $('.tweetNum').find('.target');
  var locPlace = $('.tweetLoc').find('.target');
  var preview = $('#tweetPreview');
  var container = document.getElementById( 'globe' );
  var globe = null;
  var tweetStats = {
    'total': 0,
    'timer': 0,
    'locations': {}
  };


  // var tweetNum = 0;
  // var tweetTime = 0;
  var last = 0;
  var calcVelo = function(d, t) {
    d = (tweetStats.total - last) * 60;
    v = (d/t);
    last = tweetStats.total;
    return Math.floor(v);
  }

  // Calculate tweet velocity - tweets per minute?
  // FIXME: This is gross.
  setInterval(function(){
    tweetStats.timer += 1
    veloPlace.html(calcVelo(tweetStats.total, tweetStats.timer));
  }, 1000);
    
  // Open Socket
  var socket = io.connect('http://localhost');
  socket.on('serverResponse', function (data) {
    console.log(data);
    socket.emit('clientResponse', 'Connected to client');
  });


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
  });

  // Listen for tweets socket stream.
  socket.on('tweets', function(tweet) {
    // Add to total on each tweet.
    tweetStats.total += 1;

    // Check for globe, if not one create it.
    if(globe === null) {
      globe = new DAT.Globe( container );
      globe.animate();
    }

    // Show some sort of graph of tweet flow?
    // console.log('Tweet coming in!', tweet);
    preview.html('@' + tweet.user.screen_name + ' - ' + tweet.text);

    // FIXME: Better variable name required.
    numPlace.html(tweetStats.total);

    if(tweet.geo && tweet.geo.type === "Point") {
      // console.log('Tweet with geo detected', tweet);
      locPlace.append('<p>' + tweet.place.full_name + '</p>');

      // Format data and add the magnitude.
      var magnitude = tweet.text.length / 280;
      var data = [tweet.geo.coordinates[0], tweet.geo.coordinates[1], magnitude];
      globe.addData(data, { format: 'magnitude' });
      // globe.addData(data, { format: 'legend' });
      // globe.addData(data, { format: 'magnitude', animated: true });
      globe.createPoints();

    }
  });
});


