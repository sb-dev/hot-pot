(function() {
  'use strict';

  angular
      .module('angular')
      .factory('CatererService', ['$http', '$rootScope', 'AuthService', 'AUTH_EVENTS', CatererService]);

  /** @ngInject */
  function CatererService($http, $rootScope, AuthService, AUTH_EVENTS) {
    var CatererService = {};

    CatererService.createCaterer = function(user) {
      return $http.post('/caterer', user).then(function(response) {
        var result = response.data;
        var success = false;
        if (result.success) {
          var user = result.user;
          var token = result.token;
          AuthService.authenticate(user, token);
          $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, user);
          success = true;

          return {
            'success': success,
          }
        }

        return {
          'success': false,
          'message': result.message
        };
      }, function() {
        $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        return {
          'success': false
        };
      });
    };

    CatererService.updateProfile = function(caterer) {
      return $http.post('/caterer/profile', caterer).then(function(response) {
        var result = response.data;
        if (result.success) {
          return {
            'success': true
          }
        }

        return {
          'success': false,
          'message': result.message
        };
      }, function() {
        return {
          'success': false
        };
      });
    };

    CatererService.find = function() {
      return Restangular.one('current-caterer').get().then(
        function(caterer){
            return caterer;
        },
        function (res) {
            if(res.status == 403){
              console.log(AUTH_EVENTS.notAuthenticated);
              $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
            }
        }
      );
    }

    return CatererService;
  }

})();
