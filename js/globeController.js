angular.module('tweetStream')

.controller('globeController', function($scope, $q, $cookies, socket) {
  var time = null;
  $scope.tweetTotal = 0;
  $scope.tweetVelocity = 0;
  $scope.tweetLocations = [];

  var globe = {
    container : document.getElementById('globe'),
    obj       : null
  };

  // Verify socket connection to server.
  socket.on('serverResponse', function (data) {
    console.log(data);
    socket.emit('clientResponse', 'Connected to client');
  });

  setInterval(function(){
    // console.log('Calc velocity');
    $scope.tweetVelocity = $scope.velocity();
  }, 5000);

  socket.on('tweets', function(tweet) {
    if(time === null) {
      time = (new Date().getTime() / 1000) / 60;
    }

    // if($cookies.keyword) {
    //   $scope.cookieKeyword = $cookies.keyword;
    // }

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
      if($scope.tweetLocations.length > 20) {
        $scope.tweetLocations.shift();
      }
      $scope.tweetLocations.push({ id: tweet.id, loc: tweet.place.full_name});
    }
  });

  // Search for specific twitter keywords
  $scope.search = function() {
    // Reset data for new search.
    $scope.tweetTotal = 0;
    $scope.tweetVelocity = 0;
    $scope.tweetLocations = [];
    globe.obj = null;
    globe.container.innerHTML = '';

    console.log('Searching for keyword', this.keyword);
    // $cookies.keyword = this.keyword;
    // $scope.cookieKeyword = this.keyword;
    socket.emit('keyword', this.keyword);
  }

  // $scope.toggleStream = function(status) {
  //   console.log('Pause the stream', status);
  //   socket.emit('streamPause', status);
  // };

  // Utility function - shouldn't be on $scope
  $scope.velocity = function() {
    var newTime = (new Date().getTime() / 1000) / 60;
    return Math.floor( $scope.tweetTotal / (newTime - time) );
  };

});