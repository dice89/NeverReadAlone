angular.module('expertApp')
  .controller 'RegisterCtrl', ($scope, $rootScope) ->
    $rootScope.current = "register"

    $scope.register = ->
