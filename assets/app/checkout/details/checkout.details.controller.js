(function() {
  'use strict';

  angular
    .module('angular')
    .controller(
      'CheckoutDetailsController',
      ['$rootScope', '$scope', '$log', '$state', 'localStorageService', 'Restangular', 'Session', 'Order', 'OrderService', 'UserService', CheckoutDetailsController]
    );

  /** @ngInject */
  function CheckoutDetailsController($rootScope, $scope, $log, $state, localStorageService, Restangular, Session, Order, OrderService, UserService) {
    var self = this;

    $rootScope.$broadcast('orderDetails:show');

    if(Session.currentUser == null) {
      $state.go('main.checkout.login');
    }

    $scope.formLoading = false;

    $scope.checkoutDetails = {};

    $scope.deliveryDetails = {
      mobilePhone: Session.currentUser.mobilePhone
    };

    $scope.collectionDetails = {
      notes: 'samir',
      mobilePhone: Session.currentUser.mobilePhone
    };

    $scope.paymentDetails = {
      savePaymentMethod: true,
      paymentMethodUid: null
    };

    var client = null;
    $scope.isClientReady = false;
    function init() {
      OrderService.generateClientToken()
      .then(function(response){
        var clientToken = response.data;
        client = new braintree.api.Client({
          clientToken: clientToken
        });
        $scope.isClientReady = true;
      });

      $scope.currentUser.paymentMethods = false;
      UserService.findPaymentMethods().then(function(paymentMethods){
        console.log('paymentMethods', paymentMethods);
        $scope.currentUser.paymentMethods = paymentMethods;
      });
    }

    $scope.elementName = "selectedPaymentMethod";
    $scope.selectedPaymentMethodId = null;
    $scope.nullObject = null;
    $rootScope.$on("selectedPaymentMethod:updated", function(event,paymentMethodId) {
      console.log('paymentMethodId', paymentMethodId);
      var paymentMethod = $scope.currentUser.findPaymentMethod(paymentMethodId);

      $scope.paymentDetails.paymentMethodUid = paymentMethod.uid;
      $scope.paymentDetails.card = {
        number: paymentMethod.maskedNumber,
        expireMonth: paymentMethod.expirationMonth,
        expireYear: paymentMethod.expirationYear
      };

      $scope.$apply();
    });

    var baseOrder = Restangular.all('order');
    $scope.confirmCheckout = function(deliveryDetails, collectionDetails, paymentDetails){

      if($scope.checkoutDetailsForm.$valid) {
        $scope.formLoading = true;
        var card = paymentDetails.card;
        client.tokenizeCard({
          number: card.number,
          expirationDate: card.expireMonth +'/'+ card.expireYear
        }, function (err, nonce) {
          if(err) {
            console.log('err', err);
          } else {
            var order = Order.build(localStorageService.get('order'));
            order.nonce = nonce;
            order.paymentMethodUid = paymentDetails.paymentMethodUid;
            order.deliveryAddress = deliveryDetails;
            order.notes = collectionDetails.notes;
            order.mobilePhone = collectionDetails.mobilePhone;
            order.savePaymentMethod = paymentDetails.savePaymentMethod;

            baseOrder.post(order).then(function(result) {
              console.log("Payment success");
              if(result.success) {
                localStorageService.remove('order');
                $state.go('main.checkout.confirmation', {orderUid: result.orderUid});
              } else {
                console.log('failed', result);
                $scope.checkoutDetails.error = true;
                $scope.checkoutDetails.message = result.message;
              }

              $scope.formLoading = false;
            }, function() {
              console.log("There was an error saving order");
              $scope.formLoading = false;
            });
          }
        });
      }

    }

    init();
  }
})();
