'use strict'

angular.module('expertApp')
  .controller 'MainCtrl', ($scope, $rootScope) ->
    $rootScope.current = "home"
