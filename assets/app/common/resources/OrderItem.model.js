(function() {
  'use strict';

  angular
    .module('angular')
    .factory('OrderItem', ['Meal', OrderItemModel]);

  /** @ngInject */
  function OrderItemModel(Meal) {

    /**
     * Constructor, with class name
     */
    function OrderItem(quantity, dish) {
      this.quantity = quantity;
      this.dish = dish;
      this.price = dish.price * quantity;
    }

    /**
     * Static method, assigned to class
     * Instance ('this') is not available in static context
     */
    OrderItem.build = function (data) {
      return new OrderItem(
        data.quantity,
        Meal.build(data.dish)
      );
    };

    OrderItem.prototype.addOne = function () {
      this.quantity++;
      this.price += this.dish.price;
    };

    OrderItem.prototype.removeOne = function () {
      this.quantity--;
      this.price -= this.dish.price;
    };

    OrderItem.apiResponseTransformer = function(data) {
      if (angular.isArray(data)) {
        return data
          .map(OrderItem.build);
      }
      return OrderItem.build(data);
    }

    /**
     * Return the constructor function
     */
    return OrderItem;
  }
})();
