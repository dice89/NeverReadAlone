angular.module('expertApp')
  .controller 'RegisterCtrl', ($scope, $rootScope, $http, $location) ->
    $rootScope.current = "account"

    $scope.newAccount = {}

    $scope.linkedin = ->
      $http.get '/api/auth/linkedin'

    $scope.submit = ->

      s = (p) ->
        $scope.newAccount.geo = {}
        $scope.newAccount.geo.longitude = p.coords.longitude
        $scope.newAccount.geo.latitude = p.coords.latitude

        q = $http.post '/api/user/create', $scope.newAccount

        q.then (response) ->
          $location.path '/experts/' + response.data.id
        , (response) ->
          console.log 'error'
      e = ->
        alert 'need geo'


      navigator.geolocation.getCurrentPosition s, e



angular.module('expertApp')
  .controller 'LoginCtrl', ($scope, $rootScope, $http, $location) ->
    $rootScope.current = "account"

    $scope.form = {}

    $scope.submit = ->
      $rootScope.Auth.login $scope.form




