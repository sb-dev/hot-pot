(function() {
  'use strict';

  angular
    .module('angular')
    .factory('Order', ['OrderItem', '$filter', '$rootScope', '$timeout', '$log', OrderModel]);

  /** @ngInject */
  function OrderModel(OrderItem, $filter, $rootScope, $timeout, $log) {
    var self = this;
    /**
     * Constructor, with class name
     */
    function Order(postcode, search) {
      this.postcode = postcode;
      this.search = search;
      this.items = [];
      this.total = 0;
      this.estimatedTime = null;
      this.preparationTime = null;

      this.minutes = 0;
      this.seconds = 0;

      this.progress = 0;

      if(search !== null) {
        if (search.availableServices.indexOf("collection") != -1) {
          this.service = 'collection';
        } else {
          this.service = 'delivery';
        }
      }
    }

    /**
     * Static method, assigned to class
     * Instance ('this') is not available in static context
     */
    Order.build = function (data) {
      var order;

      if(data == null) {
        return new Order(
          null,
          null
        );
      }

      if(typeof data.postcode !== 'undefined' && typeof data.search !== 'undefined'){
        order = new Order(
          data.postcode,
          data.search
        );
      } else {
        order = new Order(
          null,
          null
        );
      }

      if(typeof data.status !== 'undefined'){
        order.status = data.status;
      }

      if(typeof data.items !== 'undefined'){
        order.items = OrderItem.apiResponseTransformer(data.items);
        order.total = getTotal(order.items);
        order.preparationTime = updatePreparationTime(order.items);
        order.estimatedTime = updateEstimatedTime(order.items);
      }

      if(typeof data.uid !== 'undefined'){
        order.uid = data.uid;
      }

      if(typeof data.user != "undefined" ) {
        order.user = data.user;
      }

      if(typeof data.createdAt != "undefined"){
        order.createdAt = data.createdAt;
      }

      if(typeof data.acceptedAt != "undefined"){
        order.acceptedAt = parseInt(data.acceptedAt);
      }

      if(typeof data.phoneNumber != "undefined"){
        order.phoneNumber = data.phoneNumber;
      }

      return order;
    };

    Order.prototype.addDish = function (dish) {

      var matchedItems = this.items.filter(function(item){
      	return item.dish.uid === dish.uid;
      });

      if(matchedItems.length == 0) {
        var item = new OrderItem(1, dish);
        this.items.push(item);
      } else {
        matchedItems[0].addOne();
      }

      this.total = getTotal(this.items);
      this.estimatedTime = updateEstimatedTime(this.items);

      $rootScope.$broadcast('order:updated', this.total);
    };

    Order.prototype.removeDish = function (dish) {

      var matchedItems = this.items.filter(function(item){
      	return item.dish.uid === dish.uid;
      });

      matchedItems[0].removeOne();

      if(matchedItems[0].quantity == 0) {
        var index = this.items.indexOf(matchedItems[0]);
         this.items.splice(index, 1);
      }

      this.total = getTotal(this.items);
      this.estimatedTime = updateEstimatedTime(this.items);

      $rootScope.$broadcast('order:updated', this.total);
    };

    Order.prototype.isPreparationTimeDone = function() {

    };

    Order.prototype.startCountdown = function() {
      var now = moment().isDST() ? moment().add(1, 'hours').unix() : moment().unix();

      var timeElapsedSinceAccepted = now - this.acceptedAt;
      var estimatedTime = this.preparationTime * 60;

      if(timeElapsedSinceAccepted >= 0 && estimatedTime >= timeElapsedSinceAccepted) {
        this.counter = estimatedTime - timeElapsedSinceAccepted;
        this.countdown(this.counter);
      } else {
        $log.warn('Preparation time done - Cannot start countdown');
        this.progress = 100;
      }
    };

    Order.prototype.countdown = function(counter) {
      self = this;
      this.countdownState = $timeout(function() {
        //var counter = counterValue;
        counter --;

        self.updateProgress(counter);

        if(counter > 0) {
          self.countdown(counter);
        }
      }, 1000);
    };

    Order.prototype.stopCountdown = function() {
      $timeout.cancel(this.countdownState);
    };

    Order.prototype.updateProgress = function(counter) {
      this.counter = counter;
      this.minutes = Math.floor(counter / 60);
      this.seconds = counter - this.minutes * 60;
      this.progress = 100 - Math.floor((counter * 10) / (this.preparationTime * 6));
    };

    Order.apiResponseTransformer = function(data) {
      if (angular.isArray(data)) {
        return data
          .map(Order.build);
      }
      return Order.build(data);
    };

    function getTotal(items) {
      var total = 0;
      items.forEach(function(item,index){
      	total += item.price;
      });

      return total;
    };

    function updatePreparationTime(items) {
      var longestTime = 0;
      items.forEach(function(item,index){
        if(item.dish.preparationTime > longestTime) {
          longestTime = item.dish.preparationTime;
        }
      });

      return longestTime != 0 ? longestTime: null;
    };

    function updateEstimatedTime(items) {
      return updatePreparationTime(items);
    }

    /**
     * Return the constructor function
     */
    return Order;
  }
})();
