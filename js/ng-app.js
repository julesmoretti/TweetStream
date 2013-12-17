angular.module('tweetStream', ['socket-io'])
.controller('globeController', function($scope, socket) {

  // TODO: Calculate velocity
  // TODO: Create Pause button.
  // FIXME: Looking into socket.io heartbeat for smoother pulses.

  var globe = {
    container : document.getElementById('globe'),
    obj       : null
  };

  $scope.tweetTotal = 0;
  $scope.tweetVelocity = 0;
  $scope.tweetLocations = [];

  socket.on('tweets', function(tweet) {
    $scope.tweetTotal++;
    
    // If globe doesn't exists, create one.
    if(globe.obj === null) {
      globe.obj = new DAT.Globe(globe.container);
      globe.obj.animate();
    } else {
      // Make sure geo data is available.
      if(tweet.geo && tweet.geo.type === "Point") {
        var magnitude = tweet.text.length / 280;
        var data = [tweet.geo.coordinates[0], tweet.geo.coordinates[1], magnitude];
        globe.obj.addData(data, { format: 'magnitude' });
        globe.obj.createPoints();
      }
    }

    // Display the tweet on screen.
    var message;
    if(!!tweet.user) {
      message = '@' + tweet.user.screen_name + ' - ' + tweet.text;
    } else {
      message = tweet.text;
    }
    $scope.tweetPreview = message;

    if(!!tweet.place) {
      if($scope.tweetLocations.length > 10) {
        $scope.tweetLocations.shift();
      }
      $scope.tweetLocations.push({ id: tweet.id, loc: tweet.place.full_name});
    }
  })

  // Search for specific twitter keywords
  $scope.search = function() {
    // Reset data for new search.
    globe.obj = null;
    globe.container.innerHTML = '';
    $scope.tweetTotal = 0;
    $scope.tweetVelocity = 0;
    $scope.tweetLocations = [];

    console.log('Searching for keyword', this.keyword);
    socket.emit('keyword', this.keyword);
  }

});