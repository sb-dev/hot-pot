(function() {
  'use strict';

  angular
    .module('angular')
    .controller('CheckoutController', ['$rootScope', '$scope', 'localStorageService', '$state', 'Session', 'Order' ,CheckoutController]);

  /** @ngInject */
  function CheckoutController($rootScope, $scope, localStorageService, $state, Session, Order) {
    var self = this;

    Session.updateState($state.current);

    $rootScope.$broadcast('headerState:updated','search');
    var header = {
      title: "Samir's Kitchen",
      cover: true,
      text: "You're about to order from"
    };
    $rootScope.$broadcast('header:updated',header);

    $scope.showOrderDetails = true;
    $scope.$on('orderDetails:hide', function(event,header) {
      $scope.showOrderDetails  = false;
    });
    $scope.$on('orderDetails:show', function(event,header) {
      $scope.showOrderDetails  = true;
    });

    var listener = $scope.$watch('order', function(order) {
      if (!angular.equals({}, order)) {
        $scope.order = Order.build(localStorageService.get('order'));
        listener();
      }
    });

  }
})();
