/* global malarkey:false, moment:false */
(function() {
  'use strict';

  angular
    .module('angular')
    .constant('AUTH_EVENTS', {
      loginSuccess: 'auth-login-success',
      loginFailed: 'auth-login-failed',
      logoutSuccess: 'auth-logout-success',
      sessionTimeout: 'auth-session-timeout',
      notAuthenticated: 'auth-not-authenticated',
      notAuthorized: 'auth-not-authorized'
    }).constant('USER_ROLES', {
      all: '*',
      admin: 'admin',
      caterer: 'caterer',
      driver: 'driver',
      user: 'user',
      guest: 'guest'
    }).config(['$httpProvider', config])
    .factory('AuthInterceptor', ['$rootScope', '$q', 'AUTH_EVENTS', 'localStorageService', AuthInterceptor]);

    function config ($httpProvider) {
      $httpProvider.interceptors.push([
        '$injector',
        function ($injector) {
          return $injector.get('AuthInterceptor');
        }
      ]);
    }

    function AuthInterceptor($rootScope, $q, AUTH_EVENTS, localStorageService) {
      return {
        'request': function (config) {
          config.headers = config.headers || {};
          if (localStorageService.get('token')) {
            config.headers.Authorization = 'JWT ' + localStorageService.get('token');
          }
          return config;
        },
        'responseError': function (response) {
          $rootScope.$broadcast({
            401: AUTH_EVENTS.notAuthenticated,
            403: AUTH_EVENTS.notAuthorized,
            419: AUTH_EVENTS.sessionTimeout,
            440: AUTH_EVENTS.sessionTimeout
          }[response.status], response);
          return $q.reject(response);
        }
      };
    }

})();
