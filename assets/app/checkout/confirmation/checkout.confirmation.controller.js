(function() {
  'use strict';

  angular
    .module('angular')
    .controller(
      'CheckoutConfirmationController',
      ['$rootScope', '$scope', '$log', 'localStorageService', '$stateParams', 'OrderService', CheckoutConfirmationController]
    );

  /** @ngInject */
  function CheckoutConfirmationController($rootScope, $scope, $log, localStorageService, $stateParams, OrderService) {
    var self = this;

    var header = {
      title: "Samir's Kitchen",
      cover: true,
      text: "You ordered from"
    };
    $rootScope.$broadcast('header:updated',header);

    $rootScope.$broadcast('orderDetails:hide');

    function init() {
      io.socket.get('/track-order/' + $stateParams.orderUid);

      var orderUid = $stateParams.orderUid;
      OrderService.findOrder(orderUid).then(function(order){
        $scope.order = order;
      });
    }

    io.socket.on('order',function(event){
      switch (event.verb) {
        case 'updated':
          $scope.order.status = event.data.status;
          $scope.$apply();
          break;
        default:
          console.warn('Unrecognized socket event (`%s`) from server:',event.verb, event);
      }
		});


    init();
  }
})();
