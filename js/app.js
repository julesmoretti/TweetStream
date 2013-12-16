var container = document.getElementById( 'container' );

// Make the globe
var globe = new DAT.Globe( container );

// globe.addData([39,30,0.021],{animated:false});
// var data = [
//   [
//   'seriesA', [ 6,159,0.001, 30,99,0.002, 45,-109,0.000,42,115,0.007,4,-54,0.000,-16,-67,0.014,21,-103,0.006,-20,-64,0.004,-40,-69,0.001,32,64,0.001,28,67,0.006,8,22,0.000,-15,133,0.000,-16,20,0.000,55,42,0.006,32,-81,0.010,31,36,0.067,9,80,0.016,42,-91,0.006,19,54,0.001,21,111,0.163,-3,-51,0.001,33,119,0.150,65,21,0.002,46,49,0.015,43,77,0.043,45,130,0.018,4,119,0.006,22,59,0.002,9,-82,0.003,46,-60,0.002,-14,15,0.006,-15,-76,0.001,57,15,0.007,52,9,0.056,10,120,0.004,24,87,0.134,0,-51,0.005,-5,123,0.013,-24,-53,0.010,-28,-58,0.015,43,0,0.019,24,70,0.023,-9,33,0.012,20,73,0.037,13,104,0.034,43,41,0.012,23,78,0.095,20,-72,0.001,38,-4,0.006,0,-77,0.016,-9,-35,0.056,25,109,0.034,-13,34,0.013,61,18,0.001,58,40,0.002,34,50,0.027,49,88,0.000,48,-99,0.001,-42,176,0.002,20,86,0.156,-18,30,0.007,53,44,0.006,29,18,0.001,5,16,0.003,49,-74,0.000,48,131,0.006,14,121,0.210,63,19,0.001,40,54,0.001,36,57,0.005,16,52,0.000,50,128,0.010,54,12,0.006,16,-61,0.011,27,80,0.196,29,101,0.001,14,78,0.067,7,13,0.003,41,125,0.026,-17,23,0.002,54,27,0.010,30,29,0.001,41,142,0.003 ]
//   ]
// ];

// // Tell the globe about your JSON data
// console.log(data);
// for ( var i = 0; i < data.length; i ++ ) {
//     globe.addData( data[i][1], { format : 'magnitude', name: data[i][0] } );
// }

// // Create the geometry
// globe.createPoints();

// Begin animation
globe.animate();


var socket = io.connect('http://localhost');
socket.on('serverResponse', function (data) {
  console.log(data);
  socket.emit('clientResponse', 'Connected to client');
});
socket.on('tweets', function(tweet) {
  console.log('Tweet coming in!');

  if(tweet.geo) {
    console.log('Tweet with geo detected', tweet.geo);
    // Add the maginitude
    // tweet.data.coordinates.push(0.9);
    var data = [tweet.geo.coordinates[0], tweet.geo.coordinates[1], 0.3];
    globe.addData(data, { format: 'magnitude' });
    globe.createPoints();
  }
  // console.log(tweet);
});

