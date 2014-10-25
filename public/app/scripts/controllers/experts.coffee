'use strict'

angular.module('expertApp')
  .controller 'ExpertsHomeCtrl', ($scope, $rootScope) ->
    $rootScope.current = "experts"
