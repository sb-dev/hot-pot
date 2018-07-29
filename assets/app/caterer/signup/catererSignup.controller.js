(function() {
  'use strict';

  angular
    .module('angular')
    .controller('CatererSignupController', ['$log', '$rootScope', '$state', '$scope', 'CatererService', 'AUTH_EVENTS', 'USER_ROLES', 'Session', CatererSignupController]);

  /** @ngInject */
  function CatererSignupController($log, $rootScope, $state, $scope, CatererService, AUTH_EVENTS, USER_ROLES, Session) {
    $scope.signup = {};
    $scope.formLoading = false;

    if(Session.userRole === USER_ROLES.caterer) {
      $state.go('caterer.profile');
    }

    //var baseCaterer = Restangular.all('caterer');

    $scope.submitCatererSignupForm = function(signup){
      if($scope.signupForm.$valid) {
        $scope.formLoading = true;

        var user = {
          firstName: signup.firstName,
          lastName: signup.lastName,
          email: signup.email,
          password: signup.password
        };

        CatererService.createCaterer(user).then(function(result){
          $scope.signupFormLoading = false;
          if(result.success) {
            $state.go('caterer.profile');
          } else {
            console.log('signupForm validation error');
            $scope.signupForm.email.$setValidity("duplicate", false);
          }
        });
      }

    }

  }
})();
