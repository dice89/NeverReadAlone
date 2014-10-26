'use strict'

angular.module('expertApp')
  .controller 'ExpertsHomeCtrl', ($scope, $rootScope, $http) ->
    $rootScope.current = "experts"

    s = (p) ->

      q = $http.get '/api/user?lng=' + p.coords.longitude + '&lat=' + p.coords.latitude

      q.then (response) ->
        $scope.experts = response.data
        console.log response.data
      , (response) ->
        console.log 'error'

    e = ->
      alert 'need geo'


    navigator.geolocation.getCurrentPosition s, e



angular.module('expertApp')
  .controller 'ExpertsSingleCtrl', ($scope, $rootScope, $http, $routeParams) ->
    $rootScope.current = "experts"


    $scope.contact = ->
      swal("Contact request sent!", "", "success")

    $scope.updateUser = ->
      $http.put '/api/user', $scope.expert

    q = $http.get '/api/user/' +  $routeParams.id

    q.then (response) ->
      $scope.expert = response.data
      $scope.expert.words = ["Java","Go","WebSocket","Student","Skills","Leader","Node.js","Ruby","Facbook","UserExperience","News","Wifi","WebWorker","Techcrunch"]

      console.log response.data
    , (response) ->
      console.log 'error'