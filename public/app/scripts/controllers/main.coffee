'use strict'

angular.module('expertApp')
  .controller 'MainCtrl', ($scope, $rootScope, $http) ->
    $rootScope.current = "home"

    $scope.doSearch = ->
      s = (p) ->
        console.log $scope.search
        q = $http.get '/api/search/?search=' + $scope.search

        q.then (response) ->
          console.log response
          $scope.results = response.data
        , (response) ->
          console.log response
      e = ->
        alert 'need geo'


      navigator.geolocation.getCurrentPosition s, e

