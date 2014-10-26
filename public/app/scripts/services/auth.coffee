'use strict'

angular.module('expertApp')
  .factory 'Auth', ($http, $location) ->

    account = null

    exports =

      login : (acc) ->
        q = $http.post '/api/login', acc

        q.then (response) ->
          account = response.data
          $location.path '/'
        , (response) ->
          console.log 'error'


      logout : ->
        q = $http.post '/api/logout'
        q.then ->
          account = null

      getAccount : ->
        account

      ping : ->
        q = $http.get '/api/self'
        q.then (response) ->
          account = response.data
        , (response) ->



