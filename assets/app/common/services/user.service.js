(function() {
  'use strict';

  angular
      .module('angular')
      .factory('UserService', ['$http', '$rootScope', 'PaymentMethod', 'AUTH_EVENTS', 'AuthService', UserService]);

  /** @ngInject */
  function UserService($http, $rootScope, PaymentMethod, AUTH_EVENTS, AuthService) {
    var UserService = {};

    UserService.createUser = function(user) {
      return $http.post('/user/signup', user).then(function(response) {
        var result = response.data;
        var success = false;
        if (result.success) {
          var user = result.user;
          var token = result.token;
          AuthService.authenticate(user, token);
          $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, user);
          success = true;
        }

        return {
          'success': success,
          'message': result.message
        };
      }, function() {
        $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        return {
          'success': false
        };
      });
    };

    UserService.findPaymentMethods = function() {
      return $http({
        method: 'GET',
        url: '/user/payment-methods'
      }).then(function successCallback(response) {
        return PaymentMethod.apiResponseTransformer(response.data);
      });
    };

    return UserService;
  }

})();
