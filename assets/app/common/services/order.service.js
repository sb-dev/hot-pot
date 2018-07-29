(function() {
  'use strict';

  angular
      .module('angular')
      .factory('OrderService', ['$http', 'Restangular', 'Meal', 'Order', OrderService]);

  /** @ngInject */
  function OrderService($http, Restangular, Meal, Order) {
    var orderService = {};

    orderService.generateClientToken = function() {
      return $http.get('/order/client-token');
    };

    orderService.initOrder = function(dish) {
      return $http.get('/order/init');
    };

    orderService.createOrder = function(dish) {

    };

    orderService.findOrder = function(orderUid) {
      return $http.get('/order/'+ orderUid).then(function(response){
        return Order.build(response.data)
      });
    };

    return orderService;
  }

})();
