'use strict'

angular.module('expertApp')
  .controller 'MainCtrl', ($scope, $rootScope, $http) ->
    $rootScope.current = "home"

    $scope.results = []

    $scope.doSearch = ->
      $scope.results = []
      s = (p) ->
        q = $http.get '/api/search/' +  $scope.search

        q.then (response) ->
          console.log response
          $scope.results = response.data
        , (response) ->
          $scope.results = []
          console.log response
      e = ->
        alert 'need geo'


      navigator.geolocation.getCurrentPosition s, e

