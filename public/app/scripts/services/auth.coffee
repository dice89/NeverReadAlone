'use strict'

angular.module('expertApp')
  .factory 'Auth', ($http) ->

    account = null

    exports =

      logout = ->
        $http.post '/api/logout'

      getAccount : ->
        account

      ping : ->
        q = $http.get '/api/self'
        q.then (response) ->
          account = response.data
        , (response) ->



