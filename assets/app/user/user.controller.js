(function() {
  'use strict';

  angular
    .module('angular')
    .controller('UserController', ['$log', '$scope', 'Restangular', UserController]);

  /** @ngInject */
  function UserController($log, $scope, Restangular) {
    var self = this;

    $scope.signupForm = {
  		loading: false
  	};

    $scope.credentials = {
      username: '',
      password: ''
    };

    var baseUser = Restangular.all('user');
  	$scope.submitSignupForm = function(signupForm){
      $scope.signupForm.loading = true;

      var user = {
        firstName: $scope.signupForm.firstName,
        lastName: $scope.signupForm.lastName,
        email: $scope.signupForm.email,
        password: $scope.signupForm.password,
        phone: $scope.signupForm.phone
      }

      baseUser.post(user).then(function(newUser) {
         console.log("id", newUser.id);
         $scope.signupForm.loading = false;
      }, function() {
        console.log("There was an error saving");
      });

    };

  }
})();
