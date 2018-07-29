(function() {
  'use strict';

  angular
    .module('angular')
    .controller(
      'SearchController',
      ['$rootScope', '$scope', '$log', '$stateParams', '$state', 'localStorageService', 'Session', 'FoodService', 'matchmedia', 'Meal', 'Order', 'PostcodeService', SearchController]
    );

  /** @ngInject */
  function SearchController($rootScope, $scope, $log, $stateParams, $state, localStorageService, Session, FoodService, matchmedia, Meal, Order, PostcodeService) {
    $rootScope.$broadcast('headerState:updated','search');
    $scope.currentSearch = {};

    Session.updateState($state.current, $stateParams);

    $scope.showEditSearchForm = true;
    $rootScope.$broadcast('toggleEditSearchFormButton', true);

    matchmedia.onPhone( function(mediaQueryList){
      $scope.isPhone = mediaQueryList.matches;
      $scope.showEditSearchForm = !mediaQueryList.matches;
    });

    $scope.$on('showEditSearchForm', function(event,header) {
       $scope.showEditSearchForm = !$scope.showEditSearchForm;
    });

    $scope.sortBy = 'cuisine';
    $scope.filter = {};

    $scope.cuisineFilter = 'all';
    $scope.setCuisineFilter = function(value) {
      $scope.cuisineFilter = value;
    };
    $scope.$watch('cuisineFilter', function (newValue, oldValue) {
      if (newValue == 'all') {
          delete $scope.filter.cuisine;
      } else {
        $scope.filter.cuisine = newValue;
      }
    }, true);

    $scope.dishTypeFilter = 'all';
    $scope.setDishTypeFilter = function(value) {
      $scope.dishTypeFilter = value;
    };
    $scope.$watch('dishTypeFilter', function (newValue, oldValue) {
      if (newValue == 'all') {
          delete $scope.filter.dishType;
      } else {
        $scope.filter.dishType = newValue;
      }
    }, true);

    $scope.mealFilter = 'all';
    $scope.setMealFilter = function(value) {
      $scope.mealFilter = value;
    };
    $scope.$watch('mealFilter', function (newValue, oldValue) {
      if (newValue == 'all') {
          delete $scope.filter.meal;
      } else {
        $scope.filter.meal = newValue;
      }
    }, true);

    $scope.meals = [];
    $scope.formLoading = true;
    var search = function (postcode) {
      PostcodeService.geocodePostcode(postcode).then(function(result){
        var header = {
          title: result.district,
          cover: false,
          text: "Fresh food available in"
        };
        $rootScope.$broadcast('header:updated',header);

        var searchParams = {location: result.location, service: $stateParams.service};
        FoodService.search(searchParams).then(function(searchResult) {

          searchParams.availableDays = ['today'];
          searchParams.availableTimes = ['ASAP'];
          searchParams.availableServices = ['collection'];

          $scope.currentSearch = {
            postcode: $stateParams.postcode,
            searchParams: searchParams,
            availableDishes: Meal.apiResponseTransformer(searchResult.availableDishes)
          };

          $scope.formLoading = false;
        });
      });
    };

    search($stateParams.postcode);

    $scope.updateSearch = function (searchParams) {
      $scope.formLoading = true;
      $state.go('main.search', searchParams);
    };

    $scope.proceedToMenu = function(dish) {
      var order = new Order($stateParams.postcode, $scope.currentSearch.searchParams);
      order.addDish(dish);
      console.log('init Order', order);
      localStorageService.set('order', order);
      $state.go('main.menu');
    }
  }
})();
