(function() {
  'use strict';

  angular
    .module('angular')
    .factory('Caterer', ['CatererProfile', 'Location', 'Meal', 'Order', 'ORDER_STATUS', CatererModel]);

  /** @ngInject */
  function CatererModel(CatererProfile, Location, Meal, Order, ORDER_STATUS) {

    /**
     * Constructor, with class name
     */
    function Caterer(name, profile, location, dishes) {
      this.name = name;
      this.profile = profile;
      this.location = location;
      this.dishes = dishes;
    }

    /**
     * Static method, assigned to class
     * Instance ('this') is not available in static context
     */
    Caterer.build = function (data) {

      var caterer = new Caterer(
        data.name,
        CatererProfile.build(data),
        Location.build(data),
        Meal.apiResponseTransformer(data.dishes)
      );

      if(typeof data.online != "undefined" ) {
        caterer.online = data.online;
      }

      if(typeof data.orders != "undefined" ) {
        caterer.orders = Order.apiResponseTransformer(data.orders);
      }

      return caterer;
    };

    Caterer.prototype.setLocation = function (location) {
      this.location = Location.build(location);
    };

    Caterer.prototype.findDish = function (dishId) {
      if (this.dishes && Array.isArray(this.dishes)) {
        for(var i = 0; i<this.dishes.length;i++) {
          if(this.dishes[i].uid == dishId) {
            console.log('data', this.dishes[i]);
            return this.dishes[i];
          }
        }
      }

      return Meal.build({});
    };

    Caterer.prototype.addDish = function (data) {
      this.dishes.push(Meal.build(data));
    };

    Caterer.prototype.updateOrder = function (order) {
      for(var i = 0; i<this.orders.length;i++) {
        if(this.orders[i].uid == order.uid) {
          console.log('updateOrder', this.orders[i]);
          this.orders[i] = order;
        }
      }
    };

    Caterer.prototype.addOrder = function (order) {
      this.orders.push(order);
    };

    Caterer.prototype.countPendingOrders = function ()  {
      var numberOfPendingOrders = 0;
      this.orders.forEach(function(order,index){
        console.log('countPendingOrders',order.status);
        if (order.status === ORDER_STATUS.pending) numberOfPendingOrders++;
      });
      return numberOfPendingOrders;
    };

    /**
     * Return the constructor function
     */
    return Caterer;
  }
})();
