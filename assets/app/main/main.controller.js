(function() {
  'use strict';

  angular
    .module('angular')
    .controller(
      'MainController',
      ['$scope', '$log', '$state', '$stateParams', '$rootScope', 'localStorageService', 'Order', 'User', 'USER_ROLES', 'AUTH_EVENTS', 'AuthService', 'Session', 'PostcodeService', MainController]
    );

  /** @ngInject */
  function MainController($scope, $log, $state, $stateParams, $rootScope, localStorageService, Order, User, USER_ROLES, AUTH_EVENTS, AuthService, Session, PostcodeService) {
    // Update application state
    $scope.currentUser = Session.currentUser;
    $scope.userRoles = USER_ROLES;
    $scope.isAuthorized = AuthService.isAuthorized;

    var setCurrentUser = function () {
      $scope.currentUser = Session.currentUser;
    };
    $scope.signIn = function () {
      $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
    };
    Session.registerObserverCallback(setCurrentUser);

    $scope.signOut = function () {
      AuthService.logout();
    };

    $scope.search = {
      postcode: '',
      service: 'all'
    };

    $scope.form = {};

    // Init order
    $scope.order = {};
    $scope.total = 0;
    $scope.order = Order.build(localStorageService.get('order'));
    $scope.total = $scope.order.total;
    $scope.$on('order:updated', function(event, total) {
       $scope.total = total;
    });

    $scope.$on('order:reset', function(event, total) {
      $scope.total = 0.00;
      $scope.order = {};
    });

    // Search dishes
    $scope.searchFood = function(search) {
      var listener;
      if (search.postcode) {
        if(PostcodeService.validate(search.postcode)) {
          $state.go('main.search', search);
        } else {
          $scope.form.searchFood.postcode.$setValidity("invalidFormat", false);
           listener = $scope.$watch('search.postcode', function(postcode) {
             if(PostcodeService.validate(postcode)) {
               $scope.form.searchFood.postcode.$setValidity("invalidFormat", true);
               listener();
             }
           });
        }
      }
    };

    // Handle application state events
    $scope.$on('headerState:updated', function(event,headerState) {
       $scope.headerState = headerState;
    });
    $scope.$on('header:updated', function(event,header) {
       $scope.header = header;
    });

    // Handle small screens
    $scope.toggleEditSearchFormButton = false;
    $scope.$on('toggleEditSearchFormButton', function(event, toggleEditSearchFormButton) {
       $scope.toggleEditSearchFormButton = toggleEditSearchFormButton;
    });
    $scope.toggleEditSearchForm = function () {
      $rootScope.$broadcast('showEditSearchForm');
    };
  }
})();
