(function() {
  'use strict';

  angular
    .module('angular')
    .controller(
      'CheckoutLoginController',
      ['$rootScope', '$scope', '$log', '$window', '$state', 'localStorageService', 'AuthService', 'AUTH_EVENTS', 'UserService', CheckoutLoginController]
    );

  /** @ngInject */
  function CheckoutLoginController($rootScope, $scope, $log, $window, $state, localStorageService, AuthService, AUTH_EVENTS, UserService) {

    $scope.signupFormLoading = false;
    $scope.loginFormLoading = false;

    $scope.signup = {};

    $scope.submitUserSignupForm = function (signup) {
      if($scope.signupForm.$valid) {
        $scope.signupFormLoading = true;
        var user = {
          firstName: signup.firstName,
          lastName: signup.lastName,
          email: signup.email,
          password: signup.password,
          mobilePhone: signup.mobilePhone
        };

        UserService.createUser(user).then(function(result){
          $scope.signupFormLoading = false;
          if(result.success) {
            $state.go('main.checkout.details');
          } else {
            console.log('signupForm validation error');
            $scope.signupForm.email.$setValidity("duplicate", false);
          }
        });
      }
    };

    $scope.submitLoginForm = function(credentials) {
      console.log('credentials', credentials);
      if($scope.checkoutLoginForm.$valid) {
        $scope.loginFormLoading = true;

        AuthService.login(credentials).then(function (user) {
          $rootScope.$broadcast('user:updated', user);
          $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);

          $state.go('main.checkout.details');

          $scope.loginFormLoading = false;
        }, function () {
          $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
          $scope.loginFormLoading = false;
        });
      }
    };

    $scope.loginWithFacebook = function() {
      var session = {
        state: 'main.checkout.details',
        redirect: true
      };
      localStorageService.set('session', session);
      $window.location.href = '/auth/facebook';
    }
  }
})();
