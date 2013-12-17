angular.module('tweetStream', ['socket-io', 'ngRoute'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'templates/globe.html',
      controller: 'globeController'
    }).
    otherwise({
      redirectTo: '/'
    })
}]);