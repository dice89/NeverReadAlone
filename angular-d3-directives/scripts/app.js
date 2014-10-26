'use strict';

angular.module('examplesApp', ['d3'])
  .config(['$routeProvider',function ($routeProvider) {
    $routeProvider
      .when('/', {
            // Using template to enable using example without server, templateURL require Ajax call
        template: '' +
            '<wordcloud words="words"></wordcloud>' +
            '',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
