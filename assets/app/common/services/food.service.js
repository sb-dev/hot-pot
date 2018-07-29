(function() {
  'use strict';

  angular
      .module('angular')
      .factory('FoodService', ['$http', 'Restangular', 'Meal', FoodService]);

  /** @ngInject */
  function FoodService($http, Restangular, Meal) {
    var searchService = {};

    FoodService.search = function(search) {
      return $http.post('/search', search).then(function (response) {
        return response.data;
      });
    };

    FoodService.initMenu = function(dish) {
      return $http.post('/menu', dish).then(function (response) {
        return response.data;
      });
    };

    FoodService.getAvailableCuisines = function() {
      return $http({
        method: 'GET',
        url: '/data/cuisines.json'
      }).then(function(response) {
        return response.data;
      });
    };

    FoodService.getAvailableDishes = function() {
      return $http({
        method: 'GET',
        url: '/data/dishes.json'
      }).then(function(response) {
        return response.data;
      });
    };

    FoodService.getAvailableMeals = function() {
      return $http({
        method: 'GET',
        url: '/data/mealTypes.json'
      }).then(function(response) {
        return response.data;
      });
    };

    return FoodService;
  }

})();
