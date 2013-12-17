$(document).ready(function() {

  var placements = {
    velocity   : $('.tweetVelocity').find('.target'),
    tweetTotal : $('.tweetNum').find('.target'),
    location   : $('.tweetLoc').find('.target'),
    preview    : $('#tweetPreview')
  }
  
  var globe = {
    container : document.getElementById('globe'),
    obj       : null
  }

  var tweetStats = {
    total     : 0,
    timer     : 0,
    locations: {}
  };

  var last = 0;
  var calcVelo = function(d, t) {
    d = (tweetStats.total - last) * 60;
    v = (d/t);
    last = tweetStats.total;
    return Math.floor(v);
  }

  // Calculate tweet velocity - tweets per second
  setInterval(function(){
    tweetStats.timer += 1
    placements.velocity.html(calcVelo(tweetStats.total, tweetStats.timer));
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

    // Reset the globe.
    if(globe.obj !== undefined) {
      console.log('Deleting globe');
      $('#globe').remove();
      var globeCont = $('<div></div>').attr('id', 'globe');
      $('body').prepend(globeCont);
      globe.container = document.getElementById( 'globe' );
    }

    var keyword = $(this).find('input[name=keyword]').val();
    socket.emit('keyword', keyword);

    // Make the globe
    globe.obj = new DAT.Globe( globe.container );
    globe.obj.animate();
  });

  // Listen for tweets socket stream.
  socket.on('tweets', function(tweet) {
    // Add to total on each tweet.
    tweetStats.total += 1;

    // Check for globe, if not one create it.
    if(globe.obj === null) {
      globe.obj = new DAT.Globe( globe.container );
      globe.obj.animate();
    }

    // Display the tweets. Sometimes the user data is undefined.
    if(!!tweet.user) {
      placements.preview.html('@' + tweet.user.screen_name + ' - ' + tweet.text);
    } else {
      placements.preview.html(tweet.text);
    }

    // Display the total tweets recieved on page.
    placements.tweetTotal.html(tweetStats.total);

    if(tweet.geo && tweet.geo.type === "Point") {
      if(!!tweet.place) {
        placements.location.append('<p>' + tweet.place.full_name + '</p>');
      }

      // Format data and add the magnitude.
      var magnitude = tweet.text.length / 280;
      var data = [tweet.geo.coordinates[0], tweet.geo.coordinates[1], magnitude];
      globe.obj.addData(data, { format: 'magnitude' });
      globe.obj.createPoints();
    }

  });

});