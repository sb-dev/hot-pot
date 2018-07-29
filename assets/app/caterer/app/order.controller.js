(function() {
  'use strict';

  angular
    .module('angular')
    .controller(
      'CatererAppOrderController',
      ['$rootScope', '$scope', '$state', '$stateParams', '$http', 'OrderService', 'ORDER_STATUS', CatererAppOrderController]
    );

  /** @ngInject */
  function CatererAppOrderController($rootScope, $scope, $state, $stateParams, $http, OrderService, ORDER_STATUS) {
    var self = this;

    var header = {
      back: true
    }
    $rootScope.$broadcast('header:updated',header);

    function init() {
      var orderUid = $stateParams.orderUid;
      OrderService.findOrder(orderUid).then(function(order){
        $scope.order = order;
        $scope.initialPreparationTime = order.preparationTime;

        if($scope.order.status == ORDER_STATUS.accepted) {
          $scope.order.startCountdown();
        }

        console.log('Order', $scope.order);
      });
    }

    var listener = $scope.$watch('currentCaterer', function(caterer) {
      if (!angular.equals({}, caterer)) {
        init();
      }
    });

    $scope.acceptOrder = function(order){
      var data = {
        preparationTime: order.preparationTime
      };

      var orderUid = order.uid;

      $http.post('/order/'+ orderUid, data).then(function(response){
        var result = response.data;
        console.log('response', response);
        if(result.success) {
          $scope.order.preparationTime = result.preparationTime;
          $scope.order.acceptedAt = result.acceptedAt;
          $scope.order.status = result.status;
          $scope.currentCaterer.updateOrder($scope.order);
          $rootScope.$broadcast('pendingOrders:update');
          $scope.order.startCountdown();
        }
      }, function(response){

      });
    };

    $scope.readyOrder = function(order) {
      console.log('readyOrder');
      var orderUid = order.uid;
      $http.post('/order/'+ orderUid, {}).then(function(response){
        var result = response.data;
        console.log('response', response);
        if(result.success) {
          $scope.order.status = result.status;
          $scope.currentCaterer.updateOrder($scope.order);
          $rootScope.$broadcast('pendingOrders:update');
        }
      }, function(response){});
    };

    $scope.completeOrder = function(order) {
      console.log('completeOrder');
      var orderUid = order.uid;
      $http.post('/order/'+ orderUid, {}).then(function(response){
        var result = response.data;
        console.log('response', response);
        if(result.success) {
          $scope.order.status = result.status;
          $scope.currentCaterer.updateOrder($scope.order);
          $rootScope.$broadcast('pendingOrders:update');
        }
      }, function(response){});
    };

    $scope.$on('go:viewOrders', function(event,user) {
      $scope.order.stopCountdown();
       $state.go('catererApp.viewOrders');
    });
  }
})();
