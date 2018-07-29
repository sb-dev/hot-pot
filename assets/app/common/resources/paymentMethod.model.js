(function() {
  'use strict';

  angular
    .module('angular')
    .factory('PaymentMethod', PaymentMethodModel);

  /** @ngInject */
  function PaymentMethodModel() {

    /**
     * Constructor, with class name
     */
    function PaymentMethod() {}

    /**
     * Static method, assigned to class
     * Instance ('this') is not available in static context
     */
    PaymentMethod.build = function (data) {
      var paymentMethod = new PaymentMethod();

      if(typeof data.uid !== 'undefined') {
        paymentMethod.uid = data.uid;
      }

      if(typeof data.cardType !== 'undefined') {
        paymentMethod.cardType = data.cardType;
      }

      if(typeof data.expirationMonth !== 'undefined') {
        paymentMethod.expirationMonth = data.expirationMonth;
      }

      if(typeof data.expirationYear !== 'undefined') {
        paymentMethod.expirationYear = data.expirationYear;
      }

      if(typeof data.maskedNumber !== 'undefined') {
        paymentMethod.maskedNumber = data.maskedNumber;
      }

      return paymentMethod;
    };

    PaymentMethod.apiResponseTransformer = function(data) {
      if (angular.isArray(data)) {
        return data
          .map(PaymentMethod.build);
      }
      return PaymentMethod.build(data);
    }

    /**
     * Return the constructor function
     */
    return PaymentMethod;
  }
})();
