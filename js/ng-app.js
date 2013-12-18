angular.module('tweetStream', ['socket-io', 'ngRoute', 'ngCookies'])
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