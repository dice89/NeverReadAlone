'use strict'

app = angular
  .module('expertApp', [
    'd3'
    'angularSpinner'
    'xeditable'
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
  ])
  .config ($routeProvider, $httpProvider) ->

    $httpProvider.interceptors.push 'authInterceptor'

    $routeProvider
      .when '/',
        templateUrl: 'views/main.html'
        controller: 'MainCtrl'
      .when '/register',
        templateUrl: 'views/register.html'
        controller: 'RegisterCtrl'
      .when '/login',
        templateUrl: 'views/login.html'
        controller: 'LoginCtrl'
      .when '/experts',
        templateUrl: 'views/experts.html'
        controller: 'ExpertsHomeCtrl'
      .when '/experts/:id',
        templateUrl: 'views/experts.single.html'
        controller: 'ExpertsSingleCtrl'
      .otherwise
        redirectTo: '/'



app.run ["$rootScope", "$location", 'Auth', ($rootScope, $location, Auth) ->
  $rootScope.Auth = Auth
  Auth.ping()

  $rootScope.$watch Auth.getAccount, (account) ->
    $rootScope.account = account

]

app.factory 'authInterceptor', ($q, $rootScope, $location) ->
    authInterceptor =
      response : (response) ->
        if response.status == 401
          $location.path = '/login'
        return response
