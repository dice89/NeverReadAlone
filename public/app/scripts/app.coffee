'use strict'

angular
  .module('expertApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
  ])
  .config ($routeProvider) ->
    $routeProvider
      .when '/',
        templateUrl: 'views/main.html'
        controller: 'MainCtrl'
      .when '/register',
        templateUrl: 'views/register.html'
        controller: 'RegisterCtrl'
      .when '/experts',
        templateUrl: 'views/experts.html'
        controller: 'ExpertsHomeCtrl'
      .otherwise
        redirectTo: '/'

