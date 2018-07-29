(function() {
  'use strict';

  angular
    .module('angular')
    .factory('Meal', MealModel);

  /** @ngInject */
  function MealModel() {
    /**
     * Constructor, with class name
     */
    function Meal(uid, name, description, picture, price, cuisine, dishType, meal) {
      this.uid = uid;
      this.name = name;
      this.description = description;
      this.price = price;
      this.picture = picture;
      this.cuisine = cuisine;
      this.dishType = dishType;
      this.meal = meal;
    }

    /**
     * Static method, assigned to class
     * Instance ('this') is not available in static context
     */
    Meal.build = function (data) {
      if(typeof data == "undefined") {
        return null;
      }

      if(typeof data.uid == "undefined") {
        return new Meal(
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null
        );
      }

      var meal = new Meal(
        data.uid,
        data.name,
        data.description,
        data.picture,
        data.price,
        data.cuisine,
        data.dishType,
        data.meal
      );

      if(typeof data.catererName != "undefined" ) {
        meal.catererName = data.catererName;
      }

      if(typeof data.rating != "undefined" ) {
        meal.rating = data.rating;
      }

      if(typeof data.numberOfRatings != "undefined" ) {
        meal.numberOfRatings = data.numberOfRatings;
      }

      if(typeof data.preparationTime != "undefined" ) {
        meal.preparationTime = parseInt(data.preparationTime);
      } else {
        meal.preparationTime = 10;
      }

      if(typeof data.numberOfPortions != "undefined" ) {
        meal.numberOfPortions = parseInt(data.numberOfPortions);
      } else {
        meal.numberOfPortions = 0;
      }

      if(typeof data.distance != "undefined" ) {
        meal.distance = data.distance;
      }

      if(typeof data.distanceGroup != "undefined" ) {
        meal.distanceGroup = data.distanceGroup;
      }

      if(typeof data.priceGroup != "undefined" ) {
        meal.priceGroup = data.priceGroup;
      }

      if(typeof data.online != "undefined" ) {
        meal.online = data.online;
      }

      return meal;
    };

    Meal.apiResponseTransformer = function(data) {
      if (angular.isArray(data)) {
        return data
          .map(Meal.build);
      }
      return Meal.build(data);
    }

    /**
     * Return the constructor function
     */
    return Meal;
  }
})();
