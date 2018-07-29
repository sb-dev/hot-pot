(function() {
  'use strict';

  angular
    .module('angular')
    .factory('AuthService', ['$rootScope', '$window', '$http', 'AUTH_EVENTS', 'Session', 'localStorageService', AuthService]);

  /** @ngInject */
  function AuthService($rootScope, $window, $http, AUTH_EVENTS, Session, localStorageService) {
    var authService = {};

    authService.login = function (credentials) {
      return $http.post('/login', credentials).then(function (response) {
        var data = response.data;
        Session.create(data.user,
                       data.user.role);
        localStorageService.set('token', data.token);
        return data.user;
      });
    };

    authService.loginWithFacebook = function() {
      var session = {
        state: Session.state,
        redirect: true
      };

      console.log('loginWithFacebook', session);
      localStorageService.set('session', session);
      $window.location.href = '/auth/facebook';
    };

    authService.isAuthenticated = function () {
      return !!Session.userId;
    };

    authService.isAuthorized = function (authorizedRoles) {
      if (!angular.isArray(authorizedRoles)) {
        authorizedRoles = [authorizedRoles];
      }

      return (authService.isAuthenticated() &&
        authorizedRoles.indexOf(Session.userRole) !== -1);
    };

    authService.authenticate = function (user, token) {
      localStorageService.set('token', token);

      if(!user) {
        $http({
          method: 'GET',
          url: '/current-user'
        }).then(function successCallback(res) {
          Session.create(res.data);
        });
      } else {
        Session.create(user);
      }

      return user;
    };

    authService.logout = function () {
      localStorageService.remove('token');
      $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
    };

    return authService;
  }
})();
