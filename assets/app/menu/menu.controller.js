(function() {
  'use strict';

  angular
    .module('angular')
    .controller('MenuController', ['$scope', '$rootScope', '$state', 'localStorageService', 'Session', 'FoodService', 'Caterer', 'Order', MenuController]);

  /** @ngInject */
  function MenuController($scope, $rootScope, $state, localStorageService, Session, FoodService, Caterer, Order) {
    $rootScope.$broadcast('headerState:updated','catererMenu');

    Session.updateState($state.current, null);

    $scope.$on('order:updated', function(event) {
       localStorageService.set('order', $scope.order);
    });

    var listener = $scope.$watch('order', function(order) {
      if (!angular.equals({}, order)) {

        if(!localStorageService.get('order')) {
          $state.go('main.home');
        }

        $scope.order = Order.build(localStorageService.get('order'));
        FoodService.initMenu($scope.order).then(function(data){

          if(data.success) {
            $scope.caterer = Caterer.build(data.caterer);
            var header = {
              title: $scope.caterer.name,
              cover: true,
              text: "Fresh food available in",
              back: {
                state: "main.search",
                params: {postcode: $scope.order.postcode, service: $scope.order.search.service}
              }
            };

            $rootScope.$broadcast('header:updated',header);
            $rootScope.$broadcast('toggleEditSearchFormButton', false);
          } else {
            $rootScope.$broadcast('order:reset');
            $state.go('main.home');
          }

        });

        listener();
      }
    });

    $scope.viewBasket = false;
    $scope.toggleBasket = function() {
      $scope.viewBasket = !$scope.viewBasket;
    };

    $scope.editDeliveryTime = false;
    $scope.changeDeliveryTime = function() {
      $scope.editDeliveryTime = false;
    };

    $scope.toggleEditDeliveryTime = function() {
      $scope.editDeliveryTime = !$scope.editDeliveryTime;
    };
  }
})();
