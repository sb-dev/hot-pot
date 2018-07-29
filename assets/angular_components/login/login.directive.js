(function() {
  'use strict';

  angular
    .module('angular')
    .directive('loginDialog', ['AUTH_EVENTS', 'AuthService', loginDialog]);

  /** @ngInject */
  function loginDialog(AUTH_EVENTS, AuthService) {
    return {
      restrict: 'A',
      link: linkFunc,
      controller: ['$scope', '$rootScope', loginController],
      controllerAs: 'login'
    };

    function linkFunc(scope, element) {
      var showDialog = function () {
        element.modal('show');
      };

      var closeDialog = function () {
        element.modal('hide');
      };

      scope.$on(AUTH_EVENTS.notAuthenticated, showDialog);
      scope.$on(AUTH_EVENTS.sessionTimeout, showDialog);
      scope.$on('loginDialog:close', closeDialog);
    }

    function loginController($scope, $rootScope) {
      $scope.credentials = {
        username: '',
        password: ''
      };

      $scope.submitLoginForm = function(credentials) {
        $scope.loginForm.loading = true;
        AuthService.login(credentials).then(function (user) {
          $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, user);
          $rootScope.$broadcast('loginDialog:close');
          $scope.loginForm.loading = false;
        }, function () {
          $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
          $scope.loginForm.loading = false;
        });
      };

      $scope.loginWithFacebook = function() {
        AuthService.loginWithFacebook();
      };
    }
  }

})();
